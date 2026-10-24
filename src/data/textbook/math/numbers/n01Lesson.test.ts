// Historical171c contract; current edition is verified by firstThemeRepair.test.ts.
import { firstThemeBaseline } from '../../../../test/firstThemeBaseline'
import { describe, expect, it } from 'vitest'
import { getTextbookChoices, normalizeTextbookAnswer } from '../../../../domain/textbook'
import { mathNumbersN01Unit as current_mathNumbersN01Unit, n01R2SourceMap as n01SourceToItemIds } from './n01Lesson'
const mathNumbersN01Unit = firstThemeBaseline(current_mathNumbersN01Unit)


const section = mathNumbersN01Unit.sections[0]

function itemIndex(id: string) {
  return section.readingFlow.findIndex(block =>
    (block.type === 'paragraph' || block.type === 'formula')
    && block.parts.some(part => part.type === 'choice' && part.itemId === id),
  )
}

describe('N01 mathematics textbook review lesson', () => {
  it('is a separate N01 pilot with original source page and never a published unit', () => {
    expect(mathNumbersN01Unit.schemaVersion).toBe('1.1')
    expect(mathNumbersN01Unit.subject).toBe('math-1a')
    expect(mathNumbersN01Unit.unitId).toBe('math-numbers-expressions-n01')
    expect(mathNumbersN01Unit.status).toBe('review')
    expect(mathNumbersN01Unit.chapter?.chapterNumber).toBe('1')
    expect(mathNumbersN01Unit.chapter?.sourcePages).toEqual([2, 3])
    expect(mathNumbersN01Unit.revision).toBe(2)
    expect(mathNumbersN01Unit.sections).toHaveLength(1)
    expect(section.figures).toEqual([])
  })

  it('maps all 10 original questions exactly to 15 stable and referenced choice IDs', () => {
    expect(Object.keys(n01SourceToItemIds)).toEqual(
      Array.from({ length: 10 }, (_, i) => 'N01-Q' + String(i + 1).padStart(2, '0')),
    )
    const mappedIds: string[] = Object.values(n01SourceToItemIds).flat()
    expect(mappedIds).toHaveLength(15)
    expect(new Set(mappedIds).size).toBe(15)
    expect(section.items.map(item => item.id).filter(id => mappedIds.includes(id))).toEqual(mappedIds)
    expect(section.items).toHaveLength(18)
    for (const id of mappedIds) expect(itemIndex(id), id).toBeGreaterThanOrEqual(0)
    const referenced = section.readingFlow.flatMap(block =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
        : [],
    )
    expect(referenced.filter(id => mappedIds.includes(id))).toEqual(mappedIds)
    expect(referenced).toHaveLength(18)
  })

  it('asks Q1 before introducing monomial, coefficient and degree', () => {
    const conceptIndex = section.readingFlow.findIndex(block =>
      block.type === 'paragraph' && block.parts.some(part => part.type === 'term' && part.text === '単項式'),
    )
    expect(itemIndex('n01-01')).toBeLessThan(conceptIndex)
    expect(conceptIndex).toBeLessThan(itemIndex('n01-02a'))
    expect(section.readingFlow.filter(block => block.type === 'heading').map(block => block.text))
      .toEqual(['式を掛け算に戻す', 'どの文字を見るか', '同じ種類の項を集める'])
  })

  it('reuses Q3 result for Q4 and does not redundantly re-ask x coefficient', () => {
    expect(itemIndex('n01-03')).toBeLessThan(itemIndex('n01-04'))
    expect(section.items.find(item => item.id === 'n01-03')?.answer).toBe('5y')
    expect(section.items.find(item => item.id === 'n01-04')?.answer).toBe('(5x^3,1)')
    expect(n01SourceToItemIds['N01-Q04']).toEqual(['n01-04'])
    expect(section.readingFlow.filter(block => block.type === 'paragraph').map(block =>
      block.parts.filter(part => part.type === 'text').map(part => part.text).join(''),
    ).join(' ')).not.toContain('形式的な文字')
  })

  it('requires grouping before solving and only then asks the degree and reasoning', () => {
    expect(itemIndex('n01-06a')).toBeLessThan(itemIndex('n01-06b'))
    expect(itemIndex('n01-06b')).toBeLessThan(itemIndex('n01-r3-q07-x2coef'))
    expect(itemIndex('n01-r3-q07-x2coef')).toBeLessThan(itemIndex('n01-r3-q07-xcoef'))
    expect(itemIndex('n01-r3-q07-xcoef')).toBeLessThan(itemIndex('n01-r3-q07-const'))
    expect(itemIndex('n01-r3-q07-const')).toBeLessThan(itemIndex('n01-07'))
    expect(itemIndex('n01-07')).toBeLessThan(itemIndex('n01-08'))
    expect(itemIndex('n01-09a')).toBeLessThan(itemIndex('n01-09b'))
    expect(itemIndex('n01-09b')).toBeLessThan(itemIndex('n01-10a'))
    expect(itemIndex('n01-10a')).toBeLessThan(itemIndex('n01-10b'))
  })

  it('preserves independent answers from all ten original source prompts', () => {
    const expected: Record<string, string> = {
      'n01-01': '-1',
      'n01-02a': '(-2,1)',
      'n01-02b': '(1,2)',
      'n01-02c': '(-1,4)',
      'n01-03': '5y',
      'n01-04': '(5x^3,1)',
      'n01-05': '(ay,ax)',
      'n01-06a': '3x^2-5x^2',
      'n01-06b': '(-5x+2x)\\quad (6-3)',
      'n01-07': '-2x^2-3x+3',
      'n01-08': '(2,3)',
      'n01-09a': '(1-1)x^3-2x^2+(1+3)x-1',
      'n01-09b': '-2x^2+4x-1',
      'n01-10a': '2次式',
      'n01-10b': '3次の項が整理によって消えるから',
    }
    for (const item of section.items.filter(item => (Object.values(n01SourceToItemIds).flat() as string[]).includes(item.id))) {
      expect(item.answer, item.id).toBe(expected[item.id])
      expect(item.choices, item.id).toContain(item.answer)
      expect(item.choices && new Set(item.choices.map(normalizeTextbookAnswer)).size, item.id)
        .toBe(item.choices?.length)
      const presented = getTextbookChoices(mathNumbersN01Unit, item)
      expect(presented).toContain(item.answer)
      expect(presented.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('has no future Q9–Q10 answer in text/math prior to corresponding interaction', () => {
    const q9 = itemIndex('n01-09a')
    const q10 = itemIndex('n01-10a')
    const beforeQ9 = section.readingFlow.slice(0, q9)
    const beforeQ10 = section.readingFlow.slice(0, q10)
    const text = (blocks: typeof beforeQ9) => blocks.flatMap(block =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter(part => part.type !== 'choice').map(part =>
            part.type === 'math' ? part.latex : part.text)
        : block.type === 'note' || block.type === 'heading' || block.type === 'marker'
          ? [block.text]
          : [],
    ).join(' ')
    expect(text(beforeQ9)).not.toContain('-2x^2+4x-1')
    expect(text(beforeQ10)).not.toContain('3次の項が整理によって消える')
  })

  it('limits numerical interactions to meaningful in-text choices, with fading support', () => {
    expect(section.items[0].scaffoldLevel).toBe('strong')
    expect(section.items.some(item => item.scaffoldLevel === 'light')).toBe(true)
    expect(section.readingFlow.filter(block => block.type === 'marker' && block.kind === 'proof')).toHaveLength(0)
    expect(section.readingFlow.filter(block => block.type === 'figure')).toHaveLength(0)
    expect(section.items.every(item => (item.choices?.length ?? 0) >= 2)).toBe(true)
  })
})
