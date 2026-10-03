import { describe, expect, it } from 'vitest'
import { mathQuantifierUnit } from './quantifierLesson'

describe('math quantifier textbook unit', () => {
  it('keeps the source reference scope in review during audit', () => {
    expect(mathQuantifierUnit.status).toBe('review')
    expect(mathQuantifierUnit.chapter?.sourcePages).toEqual([100, 101])
    expect(mathQuantifierUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
  })

  it('uses a concrete counterexample before stating the negation of all', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const counterexampleIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-a02',
      ),
    )
    const ruleIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('「すべてのxに対してpである」を否定すると'),
      ),
    )
    expect(counterexampleIndex).toBeGreaterThanOrEqual(0)
    expect(ruleIndex).toBeGreaterThan(counterexampleIndex)
  })

  it('uses an existence witness before stating the negation of exists', () => {
    const flow = mathQuantifierUnit.sections[0].readingFlow
    const witnessIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'quant-b02',
      ),
    )
    const ruleIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('「あるxに対してpである」を否定すると'),
      ),
    )
    expect(witnessIndex).toBeGreaterThanOrEqual(0)
    expect(ruleIndex).toBeGreaterThan(witnessIndex)
  })

  it('keeps one learner-facing heading for the compact reference topic', () => {
    const headings = mathQuantifierUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual(['「すべて」と「ある」'])
  })
})
