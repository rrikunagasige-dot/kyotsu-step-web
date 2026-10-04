import { describe, expect, it } from 'vitest'
import { mathPropositionReadingUnit } from './propositionReadingLesson'

describe('math proposition-reading textbook unit', () => {
  it('keeps the source scope and starts in review while the new unit is audited', () => {
    expect(mathPropositionReadingUnit.subject).toBe('math-1a')
    expect(mathPropositionReadingUnit.status).toBe('review')
    expect(mathPropositionReadingUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionReadingUnit.chapter?.sourcePages).toEqual([92, 93, 94, 95])
    expect(mathPropositionReadingUnit.sections).toHaveLength(1)
  })


  it('forms the proposition concept only after the three concrete judgments', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const propositionConcept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('文を命題という'),
      ),
    )
    const ids = ['prop-p00a', 'prop-p00b', 'prop-p00c', 'prop-p00d', 'prop-p00e']
    const indexes = ids.map((itemId) => flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === itemId,
      ),
    ))
    const implicationDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a01',
      ),
    )

    expect(propositionConcept).toBeGreaterThanOrEqual(0)
    expect(indexes.every((index) => index >= 0 && index < propositionConcept)).toBe(true)
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
    expect(propositionConcept).toBeGreaterThan(indexes[indexes.length - 1])
    expect(implicationDecision).toBeGreaterThan(propositionConcept)
  })


  it('does not reveal the triangle counterexample before the learner chooses it', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const choiceIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-p00b',
      ),
    )
    const beforeChoice = flow.slice(0, choiceIndex).map((block) => {
      if (block.type !== 'paragraph' && block.type !== 'formula') return ''
      return block.parts.map((part) => part.type === 'text' ? part.text : '').join('')
    }).join('\n')

    expect(choiceIndex).toBeGreaterThanOrEqual(0)
    expect(beforeChoice).not.toContain('頂角40°')
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
        (part) => part.type === 'text' && part.text.includes('このような例を反例という'),
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
        (part) => part.type === 'text' && part.text.includes('十分条件'),
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
        (part) => part.type === 'text' && part.text.includes('pの否定という'),
      ),
    )
    const compoundDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-c03',
      ),
    )
    const deMorganIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('ド・モルガンの法則'),
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

    expect(items.find((item) => item.id === 'prop-a07')).toBeUndefined()
    const learnerText = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'paragraph')
      .flatMap((block) => block.parts)
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')

    expect(learnerText).toContain('△ABCが二等辺三角形なら、△ABCは正三角形である')
    expect(learnerText).not.toContain('問8(4)')

    expect(items.find((item) => item.id === 'prop-c02')?.answer)
      .toBe('2は合成数ではない')

    expect(items.find((item) => item.id === 'prop-c04')?.answer)
      .toBe('-1<x<3')

    expect(items.find((item) => item.id === 'prop-b03')?.answer)
      .toBe('必要条件')
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
  })

  it('uses only three learner-facing headings', () => {
    const headings = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      '命題の真偽を読む',
      '必要条件・十分条件を見分ける',
      '条件を否定する',
    ])
  })
})
