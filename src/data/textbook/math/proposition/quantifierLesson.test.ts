import { describe, expect, it } from 'vitest'
import { mathQuantifierUnit } from './quantifierLesson'

describe('math quantifier textbook unit', () => {
  it('keeps the source reference scope and original five-example order in review', () => {
    expect(mathQuantifierUnit.status).toBe('review')
    expect(mathQuantifierUnit.chapter?.sourcePages).toEqual([100, 101])
    expect(mathQuantifierUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')

    const flow = mathQuantifierUnit.sections[0].readingFlow
    const firstIndexes = ['quant-a01', 'quant-b01', 'quant-c01', 'quant-d01', 'quant-e01'].map(
      (itemId) => flow.findIndex(
        (block) => block.type === 'paragraph' && block.parts.some(
          (part) => part.type === 'choice' && part.itemId === itemId,
        ),
      ),
    )
    expect(firstIndexes.every((index) => index >= 0)).toBe(true)
    expect(firstIndexes).toEqual([...firstIndexes].sort((a, b) => a - b))
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
    const ruleIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('「あるxに対してpである」の否定は'),
      ),
    )
    expect(witnessIndex).toBeGreaterThanOrEqual(0)
    expect(negationDecisionIndex).toBeGreaterThan(witnessIndex)
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
    const ruleIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('「すべてのxに対してpである」の否定は'),
      ),
    )
    expect(counterexampleIndex).toBeGreaterThanOrEqual(0)
    expect(negationDecisionIndex).toBeGreaterThan(counterexampleIndex)
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
