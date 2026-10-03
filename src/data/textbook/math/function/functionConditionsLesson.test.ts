import { describe, expect, it } from 'vitest'
import { mathFunctionConditionsUnit } from './functionConditionsLesson'

describe('math function-conditions textbook unit', () => {
  it('stays in review and uses the textbook definition as the source bridge', () => {
    expect(mathFunctionConditionsUnit.status).toBe('review')
    expect(mathFunctionConditionsUnit.chapter?.chapterId).toBe('math-ch02-functions')
    expect(mathFunctionConditionsUnit.chapter?.sourcePages).toEqual([46, 47])
  })

  it('forms the function criterion before entering the three practice-118 examples', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const criterionDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-a01',
      ),
    )
    const concept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('yはxの関数であるという'),
      ),
    )
    const firstPracticeExample = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-b01',
      ),
    )
    expect(criterionDecision).toBeGreaterThanOrEqual(0)
    expect(concept).toBeGreaterThan(criterionDecision)
    expect(firstPracticeExample).toBeGreaterThan(concept)
  })

  it('keeps the practice-118 examples in circle, square-root, rectangle order', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const indexes = ['func-b01', 'func-c01', 'func-d01'].map(
      (itemId) => flow.findIndex(
        (block) => block.type === 'paragraph' && block.parts.some(
          (part) => part.type === 'choice' && part.itemId === itemId,
        ),
      ),
    )
    expect(indexes.every((index) => index >= 0)).toBe(true)
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
  })

  it('uses one learner-facing heading instead of splitting the three parallel examples', () => {
    const headings = mathFunctionConditionsUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual(['関数かどうかを判断する'])
  })
})
