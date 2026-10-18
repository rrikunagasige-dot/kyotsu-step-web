import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { normalizeTextbookAnswer } from '../../../../domain/textbook'
import type { TextbookUnit } from '../../../../domain/textbookSchema'
import { mathNumbersN01Unit } from './n01Lesson'
import { mathNumbersN02Unit, n02SourceToItemIds } from './n02Lesson'
import { mathNumbersN03Unit } from './n03Lesson'
import { mathNumbersN09Unit, n09SourceToItemIds } from './n09Lesson'
import { mathNumbersN10Unit } from './n10Lesson'
import { mathNumbersN12Unit } from './n12Lesson'

const batch = [
  { unit: mathNumbersN02Unit, prefix: 'N02', count: 12, pages: [4, 5], sourceMap: n02SourceToItemIds },
  { unit: mathNumbersN09Unit, prefix: 'N09', count: 14, pages: [22, 23], sourceMap: n09SourceToItemIds },
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
function previousCopy(unit: TextbookUnit, id: string) {
  return JSON.stringify(unit.sections[0].readingFlow.slice(0, itemIndex(unit, id)))
}

describe('W-MATH-003 user-approved N02/N09 review-only implementation', () => {
  it.each(batch)('$prefix keeps source question counts, order, review status, and approved page mapping', ({ unit, prefix, count, pages, sourceMap }) => {
    expect(unit.schemaVersion).toBe('1.1')
    expect(unit.status).toBe('review')
    expect(unit.unitId).toBe('math-numbers-expressions-' + prefix.toLowerCase())
    expect(unit.chapter?.chapterNumber).toBe('1')
    expect(unit.chapter?.orderInChapter).toBe(Number(prefix.slice(1)))
    expect(unit.chapter?.sourcePages).toEqual(pages)
    expect(Object.keys(sourceMap)).toEqual(Array.from({ length: count }, (_, i) => prefix + '-Q' + String(i + 1).padStart(2, '0')))
    const mapped = Object.values(sourceMap).flat()
    expect(mapped).toHaveLength(count)
    expect(new Set(mapped).size).toBe(count)
    expect(unit.sections).toHaveLength(1)
    expect(unit.sections[0].items.map(item => item.id).filter(id => mapped.includes(id))).toEqual(mapped)
    expect(unit.sections[0].items).toHaveLength(count + (prefix === 'N09' ? 2 : 0))
    const presented = unit.sections[0].readingFlow.flatMap(block =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
        : [],
    )
    expect(presented.filter(id => mapped.includes(id))).toEqual(mapped)
    expect(presented).toHaveLength(count + (prefix === 'N09' ? 2 : 0))
    expect(unit.sections[0].items[0].scaffoldLevel).toBe('strong')
    expect(unit.sections[0].items.some(item => item.scaffoldLevel === 'light')).toBe(true)
  })

  it.each(batch)('$prefix has nonduplicated four-choice math interactions and valid KaTeX everywhere', ({ unit }) => {
    for (const section of unit.sections) {
      for (const q of section.items) {
        expect(q.answerType).toBe('formula')
        expect(q.choices).toHaveLength(4)
        expect(q.choices).toContain(q.answer)
        expect(new Set(q.choices?.map(normalizeTextbookAnswer)).size).toBe(4)
        for (const option of q.choices ?? []) {
          expect(() => katex.renderToString(option, { throwOnError: true, strict: 'ignore' }), q.id + ' ' + option).not.toThrow()
        }
      }
      for (const block of section.readingFlow) {
        if (block.type !== 'paragraph' && block.type !== 'formula') continue
        for (const part of block.parts) {
          if (part.type === 'math') {
            expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }), block.id + ' ' + part.latex).not.toThrow()
          }
        }
      }
    }
  })

  it('preserves source mappings and adds only approved R3 tokens alongside P-002 N12', () => {
    expect(mathNumbersN01Unit.status).toBe('review')
    expect(mathNumbersN01Unit.sections[0].items).toHaveLength(18)
    expect(mathNumbersN03Unit.sections[0].items).toHaveLength(17)
    expect(mathNumbersN10Unit.sections[0].items).toHaveLength(21)
    expect(mathNumbersN12Unit.status).toBe('review')
    expect(mathNumbersN12Unit.sections[0].items).toHaveLength(26)
  })

  it('independently checks N02 answers, compound Q03/Q09 and formula reuse', () => {
    expect(mathNumbersN02Unit.sections[0].items.map(q => q.answer)).toEqual([
      '3bx',
      'x^3-ax^2+3bx+5c',
      '(2y-3,\\ y^2-3y+2)',
      'x^2+(2y-3)x+(y^2-3y+2)',
      '0x',
      'x^3-x^2+x+1',
      'x^3-2x^2-2',
      '3x^3-5x^2+x-3',
      '(4x^3-6x^2+2x-2,\\ 3x^3-6x^2-6)',
      '7x^3-12x^2+2x-8',
      '2A-3B',
      '7x^3-12x^2+2x-8',
    ])
    expect(itemIndex(mathNumbersN02Unit, 'n02-03')).toBeLessThan(itemIndex(mathNumbersN02Unit, 'n02-04'))
    expect(itemIndex(mathNumbersN02Unit, 'n02-07')).toBeLessThan(itemIndex(mathNumbersN02Unit, 'n02-08'))
    expect(itemIndex(mathNumbersN02Unit, 'n02-09')).toBeLessThan(itemIndex(mathNumbersN02Unit, 'n02-10'))
    expect(itemIndex(mathNumbersN02Unit, 'n02-10')).toBeLessThan(itemIndex(mathNumbersN02Unit, 'n02-11'))
    expect(itemIndex(mathNumbersN02Unit, 'n02-11')).toBeLessThan(itemIndex(mathNumbersN02Unit, 'n02-12'))
    expect(mathNumbersN02Unit.sections[0].figures).toEqual([])
    expect(previousCopy(mathNumbersN02Unit, 'n02-11')).not.toContain('3A-4B-(A-B)=2A-3B')
    expect(previousCopy(mathNumbersN02Unit, 'n02-12')).not.toContain('3A-4B-(A-B)=7x^3-12x^2+2x-8')
  })

  it('preserves N09 all fourteen independently checked results', () => {
    expect(mathNumbersN09Unit.sections[0].items.filter(q => Object.values(n09SourceToItemIds).flat().includes(q.id)).map(q => q.answer)).toEqual([
      'x=4,\\ -4',
      '(4,\\ 5)',
      '4',
      '(a,\\ -a)',
      '|a|',
      '2-\\sqrt5<0',
      '\\sqrt5-2',
      '1.41^2=1.9881<2<2.0164=1.42^2',
      '1.41<\\sqrt2<1.42',
      '-3',
      '-3+0.9',
      '3<\\sqrt{10}<4',
      '-4<-\\sqrt{10}<-3',
      '\\begin{aligned}\\sqrt{10}&:(3,\\sqrt{10}-3)\\\\-\\sqrt{10}&:(-4,4-\\sqrt{10})\\end{aligned}',
    ])
    const root = Math.sqrt(10)
    const floorPositive = Math.floor(root)
    const floorNegative = Math.floor(-root)
    expect(floorPositive).toBe(3)
    expect(floorNegative).toBe(-4)
    expect(root - floorPositive).toBeGreaterThan(0)
    expect(root - floorPositive).toBeLessThan(1)
    expect(-root - floorNegative).toBeGreaterThan(0)
    expect(-root - floorNegative).toBeLessThan(1)
    expect(Math.floor(-2.1)).toBe(-3)
    expect(Math.abs(2 - Math.sqrt(5))).toBeCloseTo(Math.sqrt(5) - 2, 12)
  })

  it('preserves untouched N09-F01 binary and gates both image/alt only after Q10 correct', () => {
    const file = readFileSync(resolve(process.cwd(), 'public/assets/math/textbook/numbers/n09-f01.png'))
    expect(file.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
    expect(createHash('sha256').update(file).digest('hex'))
      .toBe('24dd29dcaacd371ddfab4c8fefbccd84933fd0f1a27ed5f167372f74ca4a9cfd')

    const figures = mathNumbersN09Unit.sections[0].figures
    expect(figures.map(figure => figure.id)).toEqual(['n09-f01'])
    expect(figures[0].src).toBe('/assets/math/textbook/numbers/n09-f01.png')
    expect(itemIndex(mathNumbersN09Unit, 'n09-10')).toBeLessThan(figureIndex(mathNumbersN09Unit, 'n09-f01'))
    expect(figureIndex(mathNumbersN09Unit, 'n09-f01')).toBeLessThan(itemIndex(mathNumbersN09Unit, 'n09-11'))
    expect(previousCopy(mathNumbersN09Unit, 'n09-10')).not.toContain('-3\\le-2.1<-2')
    expect(previousCopy(mathNumbersN09Unit, 'n09-10')).not.toContain('n09-f01')
  })

  it('keeps sign reasoning before absolute-value extraction and negative square-root fraction split', () => {
    for (const [before, after] of [
      ['n09-03','n09-04'], ['n09-04','n09-05'],
      ['n09-06','n09-07'], ['n09-08','n09-09'],
      ['n09-12','n09-13'], ['n09-13','n09-14'],
    ]) expect(itemIndex(mathNumbersN09Unit, before)).toBeLessThan(itemIndex(mathNumbersN09Unit, after))
    expect(previousCopy(mathNumbersN09Unit, 'n09-14')).not.toContain('4-\\sqrt{10}')
  })
})
