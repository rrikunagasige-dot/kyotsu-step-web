import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { normalizeTextbookAnswer } from '../../../../domain/textbook'
import type { TextbookUnit } from '../../../../domain/textbookSchema'
import { mathNumbersN01Unit } from './n01Lesson'
import { mathNumbersN03Unit, n03SourceToItemIds } from './n03Lesson'
import { mathNumbersN10Unit, n10SourceToItemIds } from './n10Lesson'
import { mathNumbersN12Unit, n12SourceToItemIds } from './n12Lesson'

const pilots = [
  { unit: mathNumbersN03Unit, prefix: 'N03', count: 13, pages: [6, 7], sourceMap: n03SourceToItemIds },
  { unit: mathNumbersN10Unit, prefix: 'N10', count: 21, pages: [24, 25, 26], sourceMap: n10SourceToItemIds },
  { unit: mathNumbersN12Unit, prefix: 'N12', count: 15, pages: [30, 31, 32], sourceMap: n12SourceToItemIds },
]

function itemIndex(unit: TextbookUnit, id: string) {
  return unit.sections[0].readingFlow.findIndex(block =>
    (block.type === 'paragraph' || block.type === 'formula')
    && block.parts.some(part => part.type === 'choice' && part.itemId === id),
  )
}

function figureIndex(unit: TextbookUnit, id: string) {
  return unit.sections[0].readingFlow.findIndex(block =>
    block.type === 'figure' && block.figureId === id,
  )
}

describe('W-MATH-003 approved numbers & expressions pilot implementation', () => {
  it.each(pilots)('$prefix stays review-only with exact source mapping and unmodified N01', ({ unit, prefix, count, pages, sourceMap }) => {
    expect(unit.status).toBe('review')
    expect(unit.schemaVersion).toBe('1.1')
    expect(unit.unitId).toBe('math-numbers-expressions-' + prefix.toLowerCase())
    expect(unit.chapter?.chapterNumber).toBe('1')
    expect(unit.chapter?.orderInChapter).toBe(Number(prefix.slice(1)))
    expect(unit.chapter?.sourcePages).toEqual(pages)
    expect(unit.sections).toHaveLength(1)
    const section = unit.sections[0]
    expect(Object.keys(sourceMap)).toEqual(Array.from({ length: count }, (_, i) => prefix + '-Q' + String(i + 1).padStart(2, '0')))
    const mapped = Object.values(sourceMap).flat()
    expect(mapped).toHaveLength(count)
    expect(new Set(mapped).size).toBe(count)
    expect(section.items.map(item => item.id)).toEqual(mapped)
    const referenced = section.readingFlow.flatMap(block =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
        : [],
    )
    expect(referenced).toEqual(mapped)
    expect(section.items[0].scaffoldLevel).toBe('strong')
    expect(section.items.some(item => item.scaffoldLevel === 'light')).toBe(true)
  })

  it('keeps the original N01 unchanged and independent of new lessons', () => {
    expect(mathNumbersN01Unit.status).toBe('review')
    expect(mathNumbersN01Unit.sections[0].items).toHaveLength(15)
    expect(mathNumbersN01Unit.chapter?.sourcePages).toEqual([2, 3])
  })

  it.each(pilots)('$prefix uses distinct meaningful choices and valid KaTeX source', ({ unit }) => {
    for (const section of unit.sections) {
      for (const item of section.items) {
        expect(item.choices?.length ?? 0, item.id).toBeGreaterThanOrEqual(3)
        expect(item.choices, item.id).toContain(item.answer)
        expect(new Set(item.choices?.map(normalizeTextbookAnswer)).size, item.id).toBe(item.choices?.length)
        for (const option of item.choices ?? []) {
          if (item.answerType === 'formula') {
            expect(() => katex.renderToString(option, { throwOnError: true, strict: 'ignore' }), item.id + ': ' + option).not.toThrow()
          }
        }
      }
      for (const block of section.readingFlow) {
        if (block.type !== 'paragraph' && block.type !== 'formula') continue
        for (const part of block.parts) {
          if (part.type === 'math') {
            expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }), block.id + ': ' + part.latex).not.toThrow()
          }
        }
      }
    }
  })

  it('preserves thirteen N03 independently checked answers, including sign and all four products', () => {
    expect(mathNumbersN03Unit.sections[0].items.map(item => item.answer)).toEqual([
      '4a^8', 'a^{m+n}', 'a^{mn}', 'a^nb^n',
      '(-2)^3(x^3)^3(y^2)^3', '-8x^9y^6',
      'x^2x^2+x^2(-3x)+x^2\\cdot4', 'x^4-3x^3+4x^2',
      '2x(3x+4)+1(3x+4)', '6x^2+8x+3x+4',
      '6x^2+11x+4', '3x(2x^2-x+5)-(2x^2-x+5)', '6x^3-5x^2+16x-5',
    ])
    const section = mathNumbersN03Unit.sections[0]
    expect(section.figures.map(figure => figure.id)).toEqual(['n03-f01'])
    expect(section.figures[0].src).toBe('/assets/math/textbook/numbers/n03-f01.png')
    expect(section.figures[0].alt).not.toContain('11x')
    expect(itemIndex(mathNumbersN03Unit, 'n03-08')).toBeLessThan(figureIndex(mathNumbersN03Unit, 'n03-f01'))
    expect(figureIndex(mathNumbersN03Unit, 'n03-f01')).toBeLessThan(itemIndex(mathNumbersN03Unit, 'n03-09'))
  })

  it('preserves all N10 radical proof assumptions and 21 independently checked answers', () => {
    expect(mathNumbersN10Unit.sections[0].items.map(item => item.answer)).toEqual([
      't^2=25', '5\\sqrt5', 'ab', '\\sqrt{ab}', '\\frac ab', '\\sqrt{\\frac ab}',
      '\\sqrt{48}=\\sqrt{16\\cdot3}', '4\\sqrt3', '2\\sqrt2+5\\sqrt2',
      '7\\sqrt2', '2-2\\sqrt2\\sqrt3+3', '5-2\\sqrt6', '7-2=5',
      '0でない同じ数を分子・分母の両方に掛ける',
      '\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt3}{\\sqrt3}=\\frac{\\sqrt3}{2(\\sqrt3)^2}',
      '\\frac{\\sqrt3}{6}',
      '\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}\\cdot\\frac{\\sqrt3-\\sqrt2}{\\sqrt3-\\sqrt2}',
      '3-2=1', '3-\\sqrt6',
      '\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)(2-\\sqrt3)}=\\frac{(2-\\sqrt3)^2}{4-3}',
      '7-4\\sqrt3',
    ])
    const section = mathNumbersN10Unit.sections[0]
    expect(section.figures).toEqual([])
    const proof = section.readingFlow.findIndex(block => block.type === 'marker' && block.kind === 'proof')
    const q3 = itemIndex(mathNumbersN10Unit, 'n10-03')
    const q4 = itemIndex(mathNumbersN10Unit, 'n10-04')
    const q5 = itemIndex(mathNumbersN10Unit, 'n10-05')
    const q6 = itemIndex(mathNumbersN10Unit, 'n10-06')
    expect(proof).toBeLessThan(q3)
    expect(q3).toBeLessThan(q4)
    expect(q4).toBeLessThan(q5)
    expect(q5).toBeLessThan(q6)
    const proofCopy = JSON.stringify(section.readingFlow.slice(proof, q6 + 1))
    expect(proofCopy).toContain('a>0')
    expect(proofCopy).toContain('b>0')
    expect(proofCopy).toContain('ne0')
  })

  it('preserves N12 15 source answers and gates original figures after their prerequisite answers', () => {
    expect(mathNumbersN12Unit.sections[0].items.map(item => item.answer)).toEqual([
      'x>-\\frac72', 'x\\le\\frac12', '二つ目に反するので不適', '-\\frac72<x\\le\\frac12',
      '3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x',
      'x\\le2,\\quad x\\le\\frac53', 'x\\le\\frac53',
      '20-x', 'x\\in\\mathbb Z,\\ 0\\le x\\le20',
      '50+180x+130(20-x)', '3200\\le50+180x+130(20-x)<3300',
      '3200\\le2650+50x<3300', '11\\le x<13',
      'x=11\\ \\text{または}\\ 12', 'T(11)=3200\\text{円},\\ T(12)=3250\\text{円}',
    ])
    const figures = mathNumbersN12Unit.sections[0].figures
    expect(figures.map(figure => figure.id)).toEqual(['n12-f01', 'n12-f02', 'n12-f03'])
    expect(figures.map(figure => figure.src)).toEqual([
      '/assets/math/textbook/numbers/n12-f01.png',
      '/assets/math/textbook/numbers/n12-f02.png',
      '/assets/math/textbook/numbers/n12-f03.png',
    ])
    expect(itemIndex(mathNumbersN12Unit, 'n12-02')).toBeLessThan(figureIndex(mathNumbersN12Unit, 'n12-f01'))
    expect(figureIndex(mathNumbersN12Unit, 'n12-f01')).toBeLessThan(itemIndex(mathNumbersN12Unit, 'n12-03'))
    expect(itemIndex(mathNumbersN12Unit, 'n12-06')).toBeLessThan(figureIndex(mathNumbersN12Unit, 'n12-f02'))
    expect(figureIndex(mathNumbersN12Unit, 'n12-f02')).toBeLessThan(itemIndex(mathNumbersN12Unit, 'n12-07'))
    expect(itemIndex(mathNumbersN12Unit, 'n12-15')).toBeLessThan(figureIndex(mathNumbersN12Unit, 'n12-f03'))
    expect(figures[2].alt).not.toMatch(/11|12|3200|3250/)
    expect(figures[2].caption).not.toMatch(/11|12|3200|3250/)
  })
})
