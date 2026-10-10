import { describe, expect, it } from 'vitest'
import { normalizeTextbookAnswer } from '../../../../domain/textbook'
import { mathPropositionReadingUnit } from './propositionReadingLesson'

describe('math proposition-reading textbook unit', () => {
  it('keeps the source scope and starts in review while the new unit is audited', () => {
    expect(mathPropositionReadingUnit.subject).toBe('math-1a')
    expect(mathPropositionReadingUnit.status).toBe('review')
    expect(mathPropositionReadingUnit.revision).toBe(3)
    expect(mathPropositionReadingUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionReadingUnit.chapter?.sourcePages).toEqual([92, 93, 94, 95])
    expect(mathPropositionReadingUnit.sections).toHaveLength(1)
  })



  it('keeps the frontmatter goals in the same order as the learner flow', () => {
    expect(mathPropositionReadingUnit.objectives).toEqual([
      '条件から何が必ず言えるかを具体例で判断する',
      '一方向と逆方向を分けて、二つの条件の関係を整理する',
      '条件が成り立たない範囲を言葉と式で表す',
    ])
  })

  it('removes redundant conclusion panels and keeps the remaining transfer fading', () => {
    const section = mathPropositionReadingUnit.sections[0]
    const items = section.items
    expect(items).toHaveLength(14)
    expect(items.find((item) => item.id === 'prop-a07')?.scaffoldLevel).toBe('light')
    expect(items.find((item) => item.id === 'prop-c04')?.scaffoldLevel).toBe('light')

    for (const removedId of ['prop-a06', 'prop-a08', 'prop-b03', 'prop-b06']) {
      expect(items.some((item) => item.id === removedId), removedId).toBe(false)
      const referenced = section.readingFlow.some((block) =>
        (block.type === 'paragraph' || block.type === 'formula')
        && block.parts.some((part) => part.type === 'choice' && part.itemId === removedId),
      )
      expect(referenced, removedId).toBe(false)
    }
  })

  it('uses the golden textbook role hierarchy and black-bold concept terms', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const markers = flow.filter((block) => block.type === 'marker')
    const dialogues = flow.filter((block) => block.type === 'dialogue')
    const terms = flow.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'term').map((part) => part.text)
        : [],
    )

    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'example')).toHaveLength(6)
    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'check')).toHaveLength(4)
    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'summary')).toHaveLength(1)
    expect(dialogues).toHaveLength(4)
    expect(terms).toEqual(expect.arrayContaining([
      '命題',
      '反例',
      '十分条件',
      '必要条件',
      '必要十分条件',
      '同値',
      '否定',
      'ド・モルガンの法則',
    ]))
  })

  it('forms the proposition concept after the first source implication judgment', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const implicationDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a01',
      ),
    )
    const propositionConcept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === '命題',
      ),
    )

    expect(implicationDecision).toBeGreaterThanOrEqual(0)
    expect(propositionConcept).toBeGreaterThan(implicationDecision)
  })


  it('does not reveal the triangle counterexample before the learner chooses it', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const choiceIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a07',
      ),
    )
    const beforeChoice = flow.slice(0, choiceIndex).map((block) => {
      if (block.type !== 'paragraph' && block.type !== 'formula') return ''
      return block.parts.map((part) => part.type === 'text' ? part.text : '').join('')
    }).join('\n')

    expect(choiceIndex).toBeGreaterThanOrEqual(0)
    expect(beforeChoice).not.toContain('直角二等辺三角形')
  })

  it('forms implication meaning from a concrete condition before naming p⇒q', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const decisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a01',
      ),
    )
    const conceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('pならばqである'),
      ),
    )
    expect(decisionIndex).toBeGreaterThanOrEqual(0)
    expect(conceptIndex).toBeGreaterThan(decisionIndex)
  })

  it('reveals the inclusion picture only after the learner links P and Q', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const setDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a02',
      ),
    )
    const figureIndex = flow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'implication-inclusion',
    )
    expect(setDecisionIndex).toBeGreaterThanOrEqual(0)
    expect(figureIndex).toBeGreaterThan(setDecisionIndex)
  })

  it('does not present the chosen counterexample as the only possible real number', () => {
    const learnerText = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'paragraph')
      .flatMap((block) => block.parts)
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
    expect(learnerText).toContain('満たさない実数の一例は')
  })

  it('lets a counterexample break the implication before teaching the term', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const counterexampleDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a03',
      ),
    )
    const truthDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a04',
      ),
    )
    const conceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === '反例',
      ),
    )
    expect(counterexampleDecisionIndex).toBeGreaterThanOrEqual(0)
    expect(truthDecisionIndex).toBeGreaterThan(counterexampleDecisionIndex)
    expect(conceptIndex).toBeGreaterThan(truthDecisionIndex)
  })

  it('checks both directions before attaching necessary and sufficient labels', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const forwardIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b01',
      ),
    )
    const reverseIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b02',
      ),
    )
    const definitionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === '十分条件',
      ),
    )
    expect(forwardIndex).toBeGreaterThanOrEqual(0)
    expect(reverseIndex).toBeGreaterThan(forwardIndex)
    expect(definitionIndex).toBeGreaterThan(reverseIndex)
  })

  it('derives negation from the outside of a condition before using De Morgan', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const simpleNegationIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-c01',
      ),
    )
    const negationConceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === '否定',
      ),
    )
    const compoundDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-c03',
      ),
    )
    const deMorganIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === 'ド・モルガンの法則',
      ),
    )
    expect(simpleNegationIndex).toBeGreaterThanOrEqual(0)
    expect(negationConceptIndex).toBeGreaterThan(simpleNegationIndex)
    expect(compoundDecisionIndex).toBeGreaterThan(negationConceptIndex)
    expect(deMorganIndex).toBeGreaterThan(compoundDecisionIndex)
  })


  it('keeps the textbook order: truth, necessary/sufficient, then negation', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const truthIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a01',
      ),
    )
    const relationIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b01',
      ),
    )
    const negationIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-c01',
      ),
    )
    expect(truthIndex).toBeGreaterThanOrEqual(0)
    expect(relationIndex).toBeGreaterThan(truthIndex)
    expect(negationIndex).toBeGreaterThan(relationIndex)
  })


  it('matches the source guide examples for truth, negation, and necessary-condition classification', () => {
    const items = mathPropositionReadingUnit.sections[0].items

    expect(items.find((item) => item.id === 'prop-a07')?.answer).toBe('直角二等辺三角形')
    expect(items.find((item) => item.id === 'prop-a08')).toBeUndefined()
    const learnerText = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'paragraph')
      .flatMap((block) => block.parts)
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')

    expect(learnerText).toContain('△ABCが二等辺三角形なら、△ABCは正三角形である')
    expect(learnerText).not.toContain('問8(4)')
    expect(learnerText).not.toContain('頂角40°')
    expect(learnerText).not.toContain('3.14は円周率')
    expect(learnerText).not.toContain('23を3で割る')

    expect(items.find((item) => item.id === 'prop-c02')?.answer)
      .toBe('2は合成数ではない')

    expect(items.find((item) => item.id === 'prop-c04')?.answer)
      .toBe('-1<x<3')

    expect(items.find((item) => item.id === 'prop-b03')).toBeUndefined()
    expect(learnerText).toContain('長方形であること」のための必要条件である')
    expect(learnerText).toContain('この命題は偽である')
    expect(learnerText).toContain('必要十分条件であり、2つの条件は同値である')
  })


  it('shows the equal-diagonals evidence figure before the reverse-direction judgment', () => {
    const section = mathPropositionReadingUnit.sections[0]
    const flow = section.readingFlow
    const firstDirectionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b01',
      ),
    )
    const figureIndex = flow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'equal-diagonals-quadrilateral',
    )
    const reverseDirectionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b02',
      ),
    )
    const figure = section.figures.find((candidate) => candidate.id === 'equal-diagonals-quadrilateral')

    expect(firstDirectionIndex).toBeGreaterThanOrEqual(0)
    expect(figureIndex).toBeGreaterThan(firstDirectionIndex)
    expect(reverseDirectionIndex).toBeGreaterThan(figureIndex)
    expect(figure?.caption).not.toMatch(/必要条件|十分条件/)
    expect(figure?.alt).not.toContain('長方形ではない')
  })

  it('keeps the triangle counterexample distractors conceptually distinct', () => {
    const item = mathPropositionReadingUnit.sections[0].items.find((candidate) => candidate.id === 'prop-a07')
    expect(item?.answer).toBe('直角二等辺三角形')
    expect(item?.choices).toEqual([
      '直角二等辺三角形',
      '正三角形',
      '不等辺三角形',
    ])
  })

  it('keeps relation hints staged from broad direction to concrete evidence', () => {
    const item = mathPropositionReadingUnit.sections[0].items.find((candidate) => candidate.id === 'prop-b05')
    expect(item?.hints[0]).toContain('別々に')
    expect(item?.hints[1]).toContain('x=0')
  })

  it('does not put the exact answer into the first staged hint', () => {
    const items = mathPropositionReadingUnit.sections[0].items
    for (const item of items) {
      const firstHint = normalizeTextbookAnswer(item.hints[0] ?? '')
      const answer = normalizeTextbookAnswer(item.answer)
      expect(firstHint, item.id).not.toContain(answer)
    }
  })

  it('does not leak new concept names through the inline-choice accessibility prompt', () => {
    const items = mathPropositionReadingUnit.sections[0].items
    const truthDecision = items.find((item) => item.id === 'prop-a04')
    const negationDecision = items.find((item) => item.id === 'prop-c01')

    expect(truthDecision?.prompt).not.toContain('反例')
    expect(truthDecision?.prompt).toContain('pを満たすのにqを満たさない例')
    expect(negationDecision?.prompt).not.toContain('否定')
    expect(negationDecision?.prompt).toContain('成り立たない条件')
  })

  it('keeps worked-example transitions visible without turning them into extra headings', () => {
    const learnerText = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'paragraph')
      .flatMap((block) => block.parts)
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')

    expect(learnerText).toContain('別の式ですぐ使ってみる')
    expect(learnerText).toContain('別の条件ですぐ使ってみる')
    expect(learnerText).toContain('別の文ですぐ使ってみる')
  })

  it('uses only three learner-facing headings', () => {
    const headings = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      '条件から真偽を判断する',
      '2つの条件の関係を見る',
      '成り立たない条件を考える',
    ])
  })
})
