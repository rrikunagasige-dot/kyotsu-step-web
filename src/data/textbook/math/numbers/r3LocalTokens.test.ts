// Historical edition regression; current-theme coverage lives in firstThemeRepair.test.ts.
import { firstThemeBaseline } from '../../../../test/firstThemeBaseline'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { getTextbookChoices, normalizeTextbookAnswer } from '../../../../domain/textbook'
import type { TextbookUnit } from '../../../../domain/textbookSchema'
import { mathNumbersN01Unit as current_mathNumbersN01Unit, n01R2SourceMap as n01SourceToItemIds } from './n01Lesson'
import { mathNumbersN03Unit as current_mathNumbersN03Unit, n03SourceToItemIds } from './n03Lesson'
import { mathNumbersN09Unit } from './n09Lesson'
import { mathNumbersN12Unit } from './n12Lesson'
const mathNumbersN01Unit = firstThemeBaseline(current_mathNumbersN01Unit)

const mathNumbersN03Unit = firstThemeBaseline(current_mathNumbersN03Unit)


// W-MATH-005/P-002: small-block §52 preflight for N01-Q07 then N03-Q10.
// Verify each new calculation, preceding visible evidence, unchanged source IDs,
// sequential interactions, and N09/N12 released-version isolation.
const cases = [
  {
    lesson: mathNumbersN01Unit, original: n01SourceToItemIds, originals: 15, total: 18,
    derived: 'n01-q07-evaluate', final: 'n01-07', figures: [],
    tokens: [
      ['n01-r3-q07-x2coef', '-2'],
      ['n01-r3-q07-xcoef', '-3'],
      ['n01-r3-q07-const', '3'],
    ],
  },
  {
    lesson: mathNumbersN03Unit, original: n03SourceToItemIds, originals: 13, total: 17,
    derived: 'n03-four-products', final: 'n03-10', figures: ['n03-f01'],
    tokens: [
      ['n03-r3-q10-p1', '6x^2'],
      ['n03-r3-q10-p2', '8x'],
      ['n03-r3-q10-p3', '3x'],
      ['n03-r3-q10-p4', '4'],
    ],
  },
] as const

const choiceOrder = (unit: TextbookUnit) => unit.sections[0].readingFlow.flatMap(block =>
  block.type === 'formula' || block.type === 'paragraph'
    ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
    : [],
)

describe('W-MATH-005/P-002 exact seven scoped R3 local calculations', () => {
  it.each(cases)('$lesson.unitId keeps original math and introduces only approved local slots', ({ lesson, original, originals, total, derived, final, figures, tokens }) => {
    const section = lesson.sections[0]
    const originalsIds = Object.values(original).flat() as string[]
    const tokenIds = tokens.map(([id]) => id)
    const itemIds = section.items.map(item => item.id)
    const flowIds = choiceOrder(lesson)

    expect(lesson.revision).toBe(2)
    expect(lesson.status).toBe('review')
    expect(originalsIds).toHaveLength(originals)
    expect(new Set(originalsIds).size).toBe(originals)
    expect(itemIds.filter(id => originalsIds.includes(id))).toEqual(originalsIds)
    expect(itemIds.filter(id => !originalsIds.includes(id))).toEqual(tokenIds)
    expect(itemIds).toHaveLength(total)
    expect(flowIds).toEqual(itemIds)
    expect(section.figures.map(figure => figure.id)).toEqual(figures)
    expect(new Set(itemIds).size).toBe(total)

    const grouped = section.readingFlow.filter(block =>
      block.type === 'formula' && block.derivationId === derived)
    expect(grouped).toHaveLength(tokens.length + 1)
    expect(grouped.flatMap(block => block.type === 'formula'
      ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
      : [])).toEqual([...tokenIds, final])
    for (const [id, answer] of tokens) {
      const item = section.items.find(candidate => candidate.id === id)!
      expect(item.answer).toBe(answer)
      expect(item.answerType).toBe('formula')
      const choices = getTextbookChoices(lesson, item)
      expect(choices).toContain(answer)
      expect(new Set(choices.map(normalizeTextbookAnswer)).size).toBe(choices.length)
      const beforeChoice = section.readingFlow.find(block =>
        block.type === 'formula' && block.parts.some(part => part.type === 'choice' && part.itemId === id))
      expect(beforeChoice?.type).toBe('formula')
      if (beforeChoice?.type !== 'formula') continue
      const position = beforeChoice.parts.findIndex(part => part.type === 'choice')
      expect(position).toBeGreaterThan(0)
      expect(beforeChoice.parts[position - 1].type).toBe('math')
    }
    for (const block of section.readingFlow) {
      if (block.type !== 'paragraph' && block.type !== 'formula') continue
      for (const part of block.parts) {
        if (part.type !== 'math') continue
        expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }), block.id)
          .not.toThrow()
      }
    }
  })

  it('checks each coefficient/product with independently computed values', () => {
    expect([3 - 5, -5 + 2, 6 - 3]).toEqual([-2, -3, 3])
    expect([2 * 3, 2 * 4, 1 * 3, 1 * 4]).toEqual([6, 8, 3, 4])
    expect(mathNumbersN01Unit.sections[0].items.find(item => item.id === 'n01-07')?.answer)
      .toBe('-2x^2-3x+3')
    expect(mathNumbersN03Unit.sections[0].items.find(item => item.id === 'n03-10')?.answer)
      .toBe('6x^2+8x+3x+4')
  })

  it('keeps N03 original multiplication grid gated, and N09/N12 accepted totals', () => {
    const flow = mathNumbersN03Unit.sections[0].readingFlow
    const figure = flow.findIndex(block => block.type === 'figure' && block.figureId === 'n03-f01')
    const question8 = flow.findIndex(block => block.type === 'formula' && block.parts.some(
      part => part.type === 'choice' && part.itemId === 'n03-08'))
    expect(figure).toBeGreaterThan(question8)
    expect(choiceOrder(mathNumbersN03Unit).indexOf('n03-r3-q10-p1'))
      .toBeGreaterThan(choiceOrder(mathNumbersN03Unit).indexOf('n03-09'))
    expect(mathNumbersN09Unit.sections[0].items).toHaveLength(18)
    expect(mathNumbersN09Unit.revision).toBe(2)
    expect(mathNumbersN12Unit.sections[0].items).toHaveLength(35)
    expect(mathNumbersN12Unit.revision).toBe(3)
  })
})
