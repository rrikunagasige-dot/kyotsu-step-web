import { describe, expect, it } from 'vitest'
import { mathFunctionConditionsUnit } from './functionConditionsLesson'

describe('math function-conditions textbook unit', () => {
  it('stays in review and keeps the textbook p.46–47 source scope', () => {
    expect(mathFunctionConditionsUnit.status).toBe('review')
    expect(mathFunctionConditionsUnit.chapter?.chapterId).toBe('math-ch02-functions')
    expect(mathFunctionConditionsUnit.chapter?.sourcePages).toEqual([46, 47])
  })

  it('forms the function concept from one-input/one-output before naming it', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const decision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-a01',
      ),
    )
    const concept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('yはxの関数であるという'),
      ),
    )
    expect(decision).toBeGreaterThanOrEqual(0)
    expect(concept).toBeGreaterThan(decision)
  })

  it('keeps the source substitution order for f and g before domain/range work', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const ids = ['func-a02', 'func-a03', 'func-a04', 'func-a05', 'func-b01', 'func-b02', 'func-b03', 'func-c01']
    const indexes = ids.map((itemId) => flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === itemId,
      ),
    ))
    expect(indexes.every((index) => index >= 0)).toBe(true)
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
  })

  it('derives the domain before naming it, then derives the range before naming it', () => {
    const flow = mathFunctionConditionsUnit.sections[0].readingFlow
    const domainDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-c02',
      ),
    )
    const domainConcept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('定義域という'),
      ),
    )
    const rangeDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-c03',
      ),
    )
    const rangeConcept = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('値域という'),
      ),
    )
    expect(domainDecision).toBeGreaterThanOrEqual(0)
    expect(domainConcept).toBeGreaterThan(domainDecision)
    expect(rangeDecision).toBeGreaterThan(domainConcept)
    expect(rangeConcept).toBeGreaterThan(rangeDecision)
  })


  it('shows the source rectangle before equation/domain decisions without answer-bearing overlays', () => {
    const section = mathFunctionConditionsUnit.sections[0]
    const flow = section.readingFlow
    const figureIndex = flow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'rectangle-perimeter-40',
    )
    const equationIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'func-c01',
      ),
    )
    const figure = section.figures.find((candidate) => candidate.id === 'rectangle-perimeter-40')

    expect(figureIndex).toBeGreaterThanOrEqual(0)
    expect(equationIndex).toBeGreaterThan(figureIndex)
    expect(figure?.overlays).toEqual([])
    expect(figure?.caption).not.toContain('0<x<20')
    expect(figure?.caption).not.toContain('0<y<20')
  })

  it('uses three learner-facing headings for the three textbook moves', () => {
    const headings = mathFunctionConditionsUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      'xを決めるとyはどうなるか',
      '別の関数でも同じように読む',
      '使えるxとyの範囲を読む',
    ])
  })
})
