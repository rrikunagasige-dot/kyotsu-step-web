import { describe, expect, it } from 'vitest'
import { mathFunctionConditionsUnit } from './functionConditionsLesson'

describe('math function-conditions textbook unit', () => {
  it('stays in review while preserving source scope', () => {
    expect(mathFunctionConditionsUnit.status).toBe('review')
    expect(mathFunctionConditionsUnit.chapter?.chapterId).toBe('math-ch02-functions')
    expect(mathFunctionConditionsUnit.chapter?.sourcePages).toEqual([46, 47, 48, 49])
  })

  it('forms the function concept after the uniqueness decision', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const decision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-a01',
      ),
    )
    const concept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('yはxの関数である'),
      ),
    )
    expect(decision).toBeGreaterThanOrEqual(0)
    expect(concept).toBeGreaterThan(decision)
  })

  it('derives the domain before naming it', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const decision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-b02',
      ),
    )
    const concept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('定義域という'),
      ),
    )
    expect(decision).toBeGreaterThanOrEqual(0)
    expect(concept).toBeGreaterThan(decision)
  })

  it('keeps the lesson to three learner-facing headings', () => {
    const headings = mathFunctionConditionsUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      'xを決めるとyはどうなるか',
      '式だけでなく、使えるxの範囲も読む',
      '定義域から値域を読む',
    ])
  })
})
