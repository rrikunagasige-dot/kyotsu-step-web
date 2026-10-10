import { describe, expect, it } from 'vitest'
import { normalizeTextbookAnswer } from '../../../../domain/textbook'
import { mathQuantifierUnit } from './quantifierLesson'

describe('math quantifier textbook unit', () => {
  it('keeps the source reference scope and original five-example order in review', () => {
    expect(mathQuantifierUnit.status).toBe('review')
    expect(mathQuantifierUnit.revision).toBe(5)
    expect(mathQuantifierUnit.chapter?.sourcePages).toEqual([100, 101])
    expect(mathQuantifierUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')

    const section = mathQuantifierUnit.sections[0]
    const flow = section.readingFlow
    const firstIndexes = ['quant-a02', 'quant-b01', 'quant-c02', 'quant-d01', 'quant-e01'].map(
      (itemId) => flow.findIndex(
        (block) => block.type === 'paragraph' && block.parts.some(
          (part) => part.type === 'choice' && part.itemId === itemId,
        ),
      ),
    )
    expect(firstIndexes.every((index) => index >= 0)).toBe(true)
    expect(firstIndexes).toEqual([...firstIndexes].sort((a, b) => a - b))
    expect(section.items).toHaveLength(11)
    expect(section.items.some((item) => item.id === 'quant-a01')).toBe(false)
    expect(section.items.some((item) => item.id === 'quant-c01')).toBe(false)
  })


  it('uses the five textbook p.100-101 statements rather than substituted practice examples', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const learnerText = flow
      .filter((block) => block.type === 'paragraph' || block.type === 'formula')
      .flatMap((block) => block.parts)
      .map((part) => part.type === 'text' ? part.text : part.type === 'math' ? part.latex : '')
      .join('\n')

    expect(learnerText).toContain('ある素数の組')
    expect(learnerText).toContain('ab')
    expect(learnerText).toContain('x^2=-1')
    expect(learnerText).toContain('すべての素数は奇数である')
    expect(learnerText).toContain('2つの無理数の積は無理数である')
    expect(learnerText).toContain('ひし形は平行四辺形である')
  })

  it('uses textbook role markers, selective dialogue, and black-bold quantifier terms', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const markers = flow.filter((block) => block.type === 'marker')
    const dialogues = flow.filter((block) => block.type === 'dialogue')
    const terms = flow.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'term').map((part) => part.text)
        : [],
    )

    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'example')).toHaveLength(2)
    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'check')).toHaveLength(2)
    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'summary')).toHaveLength(1)
    expect(dialogues).toHaveLength(3)
    expect(terms).toEqual(expect.arrayContaining(['ある', 'すべて', '否定', '反例']))
  })

  it('uses an existence witness before stating the negation rule for exists', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const witnessIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-a02',
      ),
    )
    const negationDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-a03',
      ),
    )
    const ruleIndex = flow.findIndex((block) => block.id === 'paragraph-exists-rule')
    const witnessMeaningIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('条件を満たす例を1つ見つければ真だと示せる'),
      ),
    )
    expect(witnessIndex).toBeGreaterThanOrEqual(0)
    expect(witnessMeaningIndex).toBeGreaterThan(witnessIndex)
    expect(negationDecisionIndex).toBeGreaterThan(witnessMeaningIndex)
    expect(ruleIndex).toBeGreaterThan(negationDecisionIndex)
  })

  it('uses a counterexample before stating the negation rule for all', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const counterexampleIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-c02',
      ),
    )
    const negationDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-c03',
      ),
    )
    const ruleIndex = flow.findIndex((block) => block.id === 'paragraph-all-rule')
    const oneCounterexampleMeaningIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('例外を1つ許しただけで崩れる'),
      ),
    )
    expect(counterexampleIndex).toBeGreaterThanOrEqual(0)
    expect(oneCounterexampleMeaningIndex).toBeGreaterThan(counterexampleIndex)
    expect(negationDecisionIndex).toBeGreaterThan(oneCounterexampleMeaningIndex)
    expect(ruleIndex).toBeGreaterThan(negationDecisionIndex)
  })



  it('preserves the five source examples and their truth/negation conclusions', () => {
    const items = mathQuantifierUnit.sections[0].items

    expect(items.find((item) => item.id === 'quant-a02')?.answer).toBe('a=2, b=3')
    expect(items.find((item) => item.id === 'quant-a03')?.answer)
      .toBe('すべての素数の組(a,b)に対してabは奇数である')

    expect(items.find((item) => item.id === 'quant-b01')?.answer).toBe('存在しない')
    expect(items.find((item) => item.id === 'quant-b02')?.answer)
      .toBe('すべての実数xに対して x²≠-1')

    expect(items.find((item) => item.id === 'quant-c02')?.answer).toBe('2')
    expect(items.find((item) => item.id === 'quant-c03')?.answer).toBe('ある素数は偶数である')

    expect(items.find((item) => item.id === 'quant-d02')?.answer).toBe('4')
    expect(items.find((item) => item.id === 'quant-d03')?.answer)
      .toBe('ある2つの無理数の積は有理数である')

    expect(items.find((item) => item.id === 'quant-e01')?.answer).toBe('真')
    expect(items.find((item) => item.id === 'quant-e02')?.answer).toBe('偽')
  })

  it('matches the source wording for the prime-number negation', () => {
    const item = mathQuantifierUnit.sections[0].items.find((candidate) => candidate.id === 'quant-c03')
    expect(item?.answer).toBe('ある素数は偶数である')
    expect(item?.acceptedAnswers).toContain('ある素数は奇数ではない')
  })

  it('keeps the irrational-product calculation natural when inserted into prose', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const block = flow.find(
      (candidate) => candidate.type === 'paragraph' && candidate.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-d02',
      ),
    )
    expect(block?.type).toBe('paragraph')
    if (block?.type === 'paragraph') {
      const choiceIndex = block.parts.findIndex((part) => part.type === 'choice' && part.itemId === 'quant-d02')
      const suffix = block.parts.slice(choiceIndex + 1)
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('')
      expect(suffix).toContain('となり、有理数になる')
      expect(suffix).not.toContain('で有理数になる')
    }
  })

  it('keeps full-sentence negation answers from producing duplicated sentence endings', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    for (const itemId of ['quant-a03', 'quant-c03', 'quant-d03']) {
      const block = flow.find(
        (candidate) => candidate.type === 'paragraph' && candidate.parts.some(
          (part) => part.type === 'choice' && part.itemId === itemId,
        ),
      )
      expect(block?.type, itemId).toBe('paragraph')
      if (block?.type !== 'paragraph') continue
      const choiceIndex = block.parts.findIndex((part) => part.type === 'choice' && part.itemId === itemId)
      const suffix = block.parts.slice(choiceIndex + 1)
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('')
      expect(suffix.trim(), itemId).toBe('。')
    }
  })

  it('keeps the implicit universal statement natural when completed as prose', () => {
    const item = mathQuantifierUnit.sections[0].items.find((candidate) => candidate.id === 'quant-d01')
    expect(item?.answer).toBe('どの2つの無理数を選んでも')
    expect(item?.choices).toEqual([
      'どの2つの無理数を選んでも',
      'ある2つの無理数を選べば',
    ])
    expect(item?.acceptedAnswers).toContain('任意の2つの無理数について')

    const flow = mathQuantifierUnit.sections[0].readingFlow
    const block = flow.find(
      (candidate) => candidate.type === 'paragraph' && candidate.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-d01',
      ),
    )
    expect(block?.type).toBe('paragraph')
    if (block?.type === 'paragraph') {
      const textBefore = block.parts
        .slice(0, block.parts.findIndex((part) => part.type === 'choice'))
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('')
      expect(textBefore).not.toContain('どの2つの無理数を選んでも')
    }
  })

  it('does not ask the existential/universal rule before the concrete experience', () => {
    const section = mathQuantifierUnit.sections[0]
    const flowText = section.readingFlow
      .filter((block) => block.type === 'paragraph')
      .flatMap((block) => block.parts)
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')

    expect(section.items.some((item) => item.id === 'quant-a01')).toBe(false)
    expect(section.items.some((item) => item.id === 'quant-c01')).toBe(false)
    expect(flowText).toContain('この1組だけで')
    expect(flowText).toContain('反例が1つ見つかったので')
  })

  it('keeps universal-negation hints staged from idea to concrete sentence shape', () => {
    const item = mathQuantifierUnit.sections[0].items.find((candidate) => candidate.id === 'quant-c03')
    expect(item?.hints[0]).toContain('否定の文')
    expect(item?.hints[1]).toContain('ある素数は')
  })

  it('does not put the exact answer into the first staged hint', () => {
    const items = mathQuantifierUnit.sections[0].items
    for (const item of items) {
      const firstHint = normalizeTextbookAnswer(item.hints[0] ?? '')
      const answer = normalizeTextbookAnswer(item.answer)
      expect(firstHint, item.id).not.toContain(answer)
    }
  })

  it('keeps sentence-like quantifier answers in text mode instead of mixed-text KaTeX', () => {
    const item = mathQuantifierUnit.sections[0].items.find((candidate) => candidate.id === 'quant-b02')
    expect(item?.answerType).toBe('text')
    expect(item?.answer).toBe('すべての実数xに対して x²≠-1')
  })

  it('keeps one learner-facing heading for the compact reference topic', () => {
    const headings = mathQuantifierUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual(['「すべて」と「ある」'])
  })
})
