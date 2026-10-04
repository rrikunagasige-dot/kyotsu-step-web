import { describe, expect, it } from 'vitest'
import { normalizeTextbookAnswer } from '../../../../domain/textbook'
import { mathQuantifierUnit } from './quantifierLesson'

describe('math quantifier textbook unit', () => {
  it('keeps the source reference scope and original five-example order in review', () => {
    expect(mathQuantifierUnit.status).toBe('review')
    expect(mathQuantifierUnit.revision).toBe(3)
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
