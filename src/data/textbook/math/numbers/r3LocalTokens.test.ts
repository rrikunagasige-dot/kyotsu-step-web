import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { getTextbookChoices, normalizeTextbookAnswer } from '../../../../domain/textbook'
import type { TextbookUnit } from '../../../../domain/textbookSchema'
import { mathNumbersN01Unit, n01SourceToItemIds } from './n01Lesson'
import { mathNumbersN03Unit, n03SourceToItemIds } from './n03Lesson'
import { mathNumbersN09Unit, n09SourceToItemIds } from './n09Lesson'

// W-MATH-005/P-001: keep all 42 original source answers and append exactly nine
// new in-equation scalar/product/square evaluations under distinct answer IDs.
const specs = [
  { unit: mathNumbersN01Unit, source: n01SourceToItemIds, oldCount: 15, newAnswers: [
    ['n01-r3-q07-x2coef', '-2'], ['n01-r3-q07-xcoef', '-3'], ['n01-r3-q07-const', '3'],
  ], final: 'n01-07', expectedTotal: 18, group: 'n01-q07-evaluate', figureIds: [] },
  { unit: mathNumbersN03Unit, source: n03SourceToItemIds, oldCount: 13, newAnswers: [
    ['n03-r3-q10-p1', '6x^2'], ['n03-r3-q10-p2', '8x'],
    ['n03-r3-q10-p3', '3x'], ['n03-r3-q10-p4', '4'],
  ], final: 'n03-10', expectedTotal: 17, group: 'n03-four-products', figureIds: ['n03-f01'] },
  { unit: mathNumbersN09Unit, source: n09SourceToItemIds, oldCount: 14, newAnswers: [
    ['n09-r3-q08-square141', '1.9881'], ['n09-r3-q08-square142', '2.0164'],
  ], final: 'n09-08', expectedTotal: 16, group: 'n09-decimal-squares', figureIds: ['n09-f01'] },
] as const

function choiceRefs(unit: TextbookUnit) {
  return unit.sections[0].readingFlow.flatMap(block =>
    block.type === 'formula' || block.type === 'paragraph'
      ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
      : [],
  )
}

describe('W-MATH-005 P-001 approved local transform additions', () => {
  it.each(specs)('$unit.unitId preserves source answers and adds exact new IDs in the original flow', ({ unit, source, oldCount, newAnswers, final, expectedTotal, group, figureIds }) => {
    const section = unit.sections[0]
    const originalIds = Object.values(source).flat()
    const newIds = newAnswers.map(([id]) => id)
    const allIds = section.items.map(item => item.id)
    const refs = choiceRefs(unit)

    expect(unit.revision).toBe(2)
    expect(unit.status).toBe('review')
    expect(originalIds).toHaveLength(oldCount)
    expect(allIds.filter(id => originalIds.includes(id))).toEqual(originalIds)
    expect(allIds.filter(id => !originalIds.includes(id))).toEqual(newIds)
    expect(allIds).toHaveLength(expectedTotal)
    expect(new Set(allIds).size).toBe(expectedTotal)
    expect(refs).toEqual(allIds)
    expect(refs.indexOf(newIds[0])).toBeGreaterThan(0)
    expect(refs.indexOf(newIds[newIds.length - 1])).toBeLessThan(refs.indexOf(final))

    expect(section.figures.map(figure => figure.id)).toEqual(figureIds)
    const grouped = section.readingFlow.filter(block =>
      block.type === 'formula' && block.derivationId === group)
    expect(grouped).toHaveLength(newIds.length + 1)
    expect(grouped.flatMap(block => block.parts.filter(part => part.type === 'choice').map(part => part.itemId)))
      .toEqual([...newIds, final])

    for (const [id, answer] of newAnswers) {
      const item = section.items.find(candidate => candidate.id === id)
      expect(item?.answer).toBe(answer)
      expect(item?.answerType).toBe('formula')
      expect(getTextbookChoices(unit, item!)).toContain(answer)
      expect(new Set(item?.choices?.map(normalizeTextbookAnswer)).size).toBe(item?.choices?.length)
      const flowBlock = section.readingFlow.find(block =>
        block.type === 'formula' && block.parts.some(part => part.type === 'choice' && part.itemId === id))
      expect(flowBlock?.type).toBe('formula')
      if (flowBlock?.type !== 'formula') continue
      const p = flowBlock.parts.findIndex(part => part.type === 'choice')
      expect(p).toBeGreaterThan(0)
      expect(flowBlock.parts[p - 1].type).toBe('math')
      expect(flowBlock.parts[p - 1].type === 'math' && flowBlock.parts[p - 1].latex.endsWith('='))
        .toBe(id.startsWith('n03-') || id.startsWith('n09-'))
    }

    for (const block of section.readingFlow) {
      if (block.type !== 'formula' && block.type !== 'paragraph') continue
      for (const part of block.parts) {
        if (part.type !== 'math') continue
        expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }), block.id)
          .not.toThrow()
      }
    }
  })

  it('checks nine exact arithmetic targets independently of rendered answer choices', () => {
    expect(3 - 5).toBe(-2)
    expect(-5 + 2).toBe(-3)
    expect(6 - 3).toBe(3)
    expect(2 * 3).toBe(6)
    expect(2 * 4).toBe(8)
    expect(1 * 3).toBe(3)
    expect(1 * 4).toBe(4)
    expect(141 ** 2 / 10_000).toBe(1.9881)
    expect(142 ** 2 / 10_000).toBe(2.0164)
  })

  it('keeps N03 grid and N09 n=-3 answer-bearing figure gated behind their original prerequisites', () => {
    const n03 = choiceRefs(mathNumbersN03Unit)
    const n03Flow = mathNumbersN03Unit.sections[0].readingFlow
    expect(n03Flow.findIndex(block => block.type === 'figure' && block.figureId === 'n03-f01'))
      .toBeGreaterThan(n03Flow.findIndex(block => block.type === 'formula' && block.parts.some(part => part.type === 'choice' && part.itemId === 'n03-08')))
    expect(n03.indexOf('n03-r3-q10-p1')).toBeGreaterThan(n03.indexOf('n03-09'))
    const n09Flow = mathNumbersN09Unit.sections[0].readingFlow
    const q10 = n09Flow.findIndex(block => (block.type === 'formula' || block.type === 'paragraph')
      && block.parts.some(part => part.type === 'choice' && part.itemId === 'n09-10'))
    const figure = n09Flow.findIndex(block => block.type === 'figure' && block.figureId === 'n09-f01')
    expect(figure).toBeGreaterThan(q10)
  })
})
