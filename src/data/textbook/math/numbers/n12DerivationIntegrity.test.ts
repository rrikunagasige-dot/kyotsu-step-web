import { describe, expect, it } from 'vitest'
import { mathNumbersN12Unit, n12SourceToItemIds } from './n12Lesson'

// P-002: fifteen original Word questions, eleven in-equation token decisions.
const originalIds = Array.from({ length: 15 }, (_, i) => 'n12-' + String(i + 1).padStart(2, '0'))
const tokenIds = [
  'n12-p002-q01-coef', 'n12-p002-q01-const',
  'n12-p002-q02-coef', 'n12-p002-q02-const',
  'n12-p002-q06-left-coef', 'n12-p002-q06-left-const',
  'n12-p002-q06-right-coef', 'n12-p002-q06-right-const',
  'n12-p002-q12-signed-coef',
  'n12-p002-q13-lower', 'n12-p002-q13-upper',
]
const newP003Ids = [
  'n12-p003-q10-meaning',
  'n12-p003-q10-cream-coef',
  'n12-p003-q10-pudding-coef',
  'n12-p003-q10-box-fee',
  'n12-p003-q11-lower-sign',
  'n12-p003-q11-upper-sign',
  'n12-p003-q12-product-constant',
  'n12-p003-q12-total-constant',
  'n12-p003-q12-x-coef',
]
const newP003Answers: Record<string, string> = {
  'n12-p003-q10-meaning': '箱と20個の菓子の合計金額',
  'n12-p003-q10-cream-coef': '180',
  'n12-p003-q10-pudding-coef': '130',
  'n12-p003-q10-box-fee': '50',
  'n12-p003-q11-lower-sign': '\\le',
  'n12-p003-q11-upper-sign': '<',
  'n12-p003-q12-product-constant': '2600',
  'n12-p003-q12-total-constant': '2650',
  'n12-p003-q12-x-coef': '50',
}
const retiredP001Ids = ['n12-01a', 'n12-02a', 'n12-06a', 'n12-06b', 'n12-12a', 'n12-13a']
const expectedOrder = [
  ...tokenIds.slice(0, 2), 'n12-01', ...tokenIds.slice(2, 4), 'n12-02',
  'n12-03', 'n12-04', 'n12-05', ...tokenIds.slice(4, 8),
  'n12-06', 'n12-07', 'n12-08', 'n12-09',
  ...newP003Ids.slice(0, 4), 'n12-10',
  ...newP003Ids.slice(4, 6), 'n12-11',
  newP003Ids[6], tokenIds[8], ...newP003Ids.slice(7, 9),
  'n12-12', ...tokenIds.slice(9), 'n12-13', 'n12-14', 'n12-15',
]
const expectedLocal: Record<string, string> = {
  'n12-p002-q01-coef': '2',
  'n12-p002-q01-const': '-7',
  'n12-p002-q02-coef': '2',
  'n12-p002-q02-const': '1',
  'n12-p002-q06-left-coef': '1',
  'n12-p002-q06-left-const': '2',
  'n12-p002-q06-right-coef': '3',
  'n12-p002-q06-right-const': '5',
  'n12-p002-q12-signed-coef': '-130',
  'n12-p002-q13-lower': '550',
  'n12-p002-q13-upper': '650',
}
const originalAnswers = [
  'x>-\\frac72', 'x\\le\\frac12', '二つ目に反するので不適',
  '-\\frac72<x\\le\\frac12', '3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x',
  'x\\le2,\\quad x\\le\\frac53', 'x\\le\\frac53', '20-x',
  'x\\in\\mathbb Z,\\ 0\\le x\\le20', '50+180x+130(20-x)',
  '3200\\le50+180x+130(20-x)<3300', '3200\\le2650+50x<3300',
  '11\\le x<13', 'x=11\\ \\text{または}\\ 12',
  'T(11)=3200\\text{円},\\ T(12)=3250\\text{円}',
]
const section = mathNumbersN12Unit.sections[0]
const blocks = section.readingFlow
const flowIds = blocks.flatMap(block =>
  block.type === 'paragraph' || block.type === 'formula'
    ? block.parts.flatMap(part => part.type === 'choice' ? [part.itemId] : [])
    : [],
)
const itemById = new Map(section.items.map(item => [item.id, item]))

describe('N12 P-002 token-level derivation', () => {
  it('preserves all fifteen source IDs and answers exactly, with review status', () => {
    expect(mathNumbersN12Unit.status).toBe('review')
    expect(mathNumbersN12Unit.revision).toBe(3)
    expect(Object.keys(n12SourceToItemIds)).toEqual(
      Array.from({ length: 15 }, (_, i) => 'N12-Q' + String(i + 1).padStart(2, '0')),
    )
    for (const [i, id] of originalIds.entries()) {
      expect(n12SourceToItemIds['N12-Q' + String(i + 1).padStart(2, '0')]).toEqual([id])
    }
    expect(section.items.filter(item => originalIds.includes(item.id)).map(item => item.answer)).toEqual(originalAnswers)
  })

  it('replaces six legacy supplemental choices with eleven P-002 and nine P-003 local holes in 35 progressive steps', () => {
    expect(section.items).toHaveLength(35)
    expect(flowIds).toEqual(expectedOrder)
    expect(section.items.map(item => item.id)).toEqual(expectedOrder)
    expect(new Set(flowIds).size).toBe(35)
    expect(section.items.filter(item => tokenIds.includes(item.id)).map(item => item.id)).toEqual(tokenIds)
    expect(section.items.filter(item => newP003Ids.includes(item.id)).map(item => item.id)).toEqual(newP003Ids)
    expect(retiredP001Ids.some(id => itemById.has(id))).toBe(false)
    expect(blocks.filter(block => block.type === 'heading')).toHaveLength(2)
  })

  it('puts every token inside a formula with adjacent math and one gated gap per block', () => {
    for (const [id, value] of Object.entries(expectedLocal)) {
      const item = itemById.get(id)
      expect(item?.answer, id).toBe(value)
      expect(item?.answerType, id).toBe('formula')
      expect(item?.choices, id).toHaveLength(4)
      expect(item?.choices?.filter(option => option === value), id).toHaveLength(1)
      const matching = blocks.filter(block =>
        block.type === 'formula' && block.parts.some(part => part.type === 'choice' && part.itemId === id),
      )
      expect(matching, id).toHaveLength(1)
      const block = matching[0]
      if (block.type !== 'formula') throw new Error('missing formula')
      const hole = block.parts.findIndex(part => part.type === 'choice' && part.itemId === id)
      expect(hole, id).toBeGreaterThanOrEqual(0)
      expect(
        block.parts[hole - 1]?.type === 'math' || block.parts[hole + 1]?.type === 'math',
        id,
      ).toBe(true)
      expect(block.parts.filter(part => part.type === 'choice'), id).toHaveLength(1)
    }
    const q12 = blocks.find(block => block.type === 'formula' && block.id === 'formula-q12-signed-coef')
    expect(q12?.type === 'formula' ? q12.parts.at(-1) : null).toMatchObject({ type: 'math', latex: ')x' })
    const q13 = blocks.find(block => block.type === 'formula' && block.id === 'formula-q13-lower')
    expect(q13?.type === 'formula' ? q13.parts.at(-1) : null).toMatchObject({ type: 'math', latex: '\\le50x<3300-2650' })
  })

  it('asks nine local meaning/model/sign/arithmetic decisions before revealing synthesis', () => {
    const itemById = new Map(section.items.map(item => [item.id, item]))
    for (const [id, answer] of Object.entries(newP003Answers)) {
      const item = itemById.get(id)
      expect(item?.answer, id).toBe(answer)
      expect(item?.choices, id).toHaveLength(4)
      expect(item?.choices?.filter(choice => choice === answer), id).toHaveLength(1)
      const matching = blocks.filter(block =>
        (block.type === 'paragraph' || block.type === 'formula') &&
        block.parts.some(part => part.type === 'choice' && part.itemId === id))
      expect(matching, id).toHaveLength(1)
      const block = matching[0]
      if (block.type !== 'paragraph' && block.type !== 'formula') throw Error(id)
      expect(block.parts.filter(part => part.type === 'choice'), id).toHaveLength(1)
    }
    expect(flowIds.indexOf('n12-p003-q10-box-fee')).toBeLessThan(flowIds.indexOf('n12-10'))
    expect(flowIds.indexOf('n12-p003-q11-upper-sign')).toBeLessThan(flowIds.indexOf('n12-11'))
    expect(flowIds.indexOf('n12-p003-q12-x-coef')).toBeLessThan(flowIds.indexOf('n12-12'))
    const costBlocks = blocks.filter(block =>
      'derivationId' in block && block.derivationId === 'cost-range')
    expect(costBlocks.some(block => block.id === 'formula-cost-product-constant')).toBe(true)
    expect(costBlocks.some(block => block.id === 'formula-cost-collected-total')).toBe(true)
    expect(blocks.filter(block => block.type === 'heading')).toHaveLength(2)
  })

  it('keeps contiguous visual derivations and source figure timing', () => {
    for (const group of ['solve-first', 'solve-second', 'triple-solve', 'cost-range']) {
      const indexes = blocks.flatMap((block, index) =>
        'derivationId' in block && block.derivationId === group ? [index] : [],
      )
      expect(indexes.length).toBeGreaterThanOrEqual(5)
      expect(indexes.at(-1)! - indexes[0] + 1).toBe(indexes.length)
    }
    expect(section.figures.map(f => f.src)).toEqual([
      '/assets/math/textbook/numbers/n12-f01.png',
      '/assets/math/textbook/numbers/n12-f02.png',
      '/assets/math/textbook/numbers/n12-f03.png',
    ])
    const choicePosition = (id: string) => blocks.findIndex(block =>
      (block.type === 'paragraph' || block.type === 'formula') &&
      block.parts.some(part => part.type === 'choice' && part.itemId === id),
    )
    const figurePosition = (id: string) => blocks.findIndex(block => block.type === 'figure' && block.figureId === id)
    expect(choicePosition('n12-02')).toBeLessThan(figurePosition('n12-f01'))
    expect(choicePosition('n12-06')).toBeLessThan(figurePosition('n12-f02'))
    expect(choicePosition('n12-15')).toBeLessThan(figurePosition('n12-f03'))
  })

  it('has correct inequality and cost mathematics', () => {
    expect(1 - 3).toBe(-2)
    expect(-2 - 5).toBe(-7)
    expect(5 - 4).toBe(1)
    expect(3 - 2).toBe(1)
    expect(2 + 1).toBe(3)
    expect(9 - 4).toBe(5)
    expect(130 * (-1)).toBe(-130)
    expect(130 * 20).toBe(2600)
    expect(50 + 2600).toBe(2650)
    expect(180 - 130).toBe(50)
    expect(3200 - 2650).toBe(550)
    expect(3300 - 2650).toBe(650)
    expect([11, 12].map(x => 50 + 180*x + 130*(20-x))).toEqual([3200, 3250])
    expect(-7/2).toBeLessThan(1/2)
    expect(5/3).toBeLessThan(2)
  })
})
