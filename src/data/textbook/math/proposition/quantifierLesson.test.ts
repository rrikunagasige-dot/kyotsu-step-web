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
