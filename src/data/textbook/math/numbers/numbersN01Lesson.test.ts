import { describe, expect, it } from 'vitest'
import { mathNumbersN01Unit } from './numbersN01Lesson'
import { mathTextbookUnits } from '../index'
import { mathTextbookTopics } from '../mathCatalog'

const section = mathNumbersN01Unit.sections[0]
const reading = section.readingFlow
const choicesInOrder = reading.flatMap((block) =>
  block.type === 'paragraph' || block.type === 'formula'
    ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
    : [],
)

describe('W-MATH-003 N01 review pilot', () => {
  it('is isolated from published sets and never silently appears on the published setup screen', () => {
    expect(mathNumbersN01Unit.unitId).toBe('math-numbers-expressions-n01')
    expect(mathNumbersN01Unit.revision).toBe(1)
    expect(mathNumbersN01Unit.status).toBe('review')
    expect(mathNumbersN01Unit.subject).toBe('math-1a')
    expect(mathNumbersN01Unit.schemaVersion).toBe('1.0')
    expect(mathNumbersN01Unit.chapter).toBeUndefined() // Source textbook page numbers are not yet verified.
    expect(mathTextbookUnits.find((u) => u.unitId === 'math-numbers-expressions-n01')).toBe(mathNumbersN01Unit)
    expect(mathTextbookTopics.some((topic) => topic.unitIds.includes(mathNumbersN01Unit.unitId))).toBe(false)
    expect(mathTextbookUnits.filter((u) => u.status === 'published').map((u) => u.unitId)).toEqual(['math-sets'])
  })

  it('preserves all ten original question IDs as fifteen staged, unique app decisions', () => {
    const expected = [
      'n01-01', 'n01-02a', 'n01-02b', 'n01-02c', 'n01-03', 'n01-04',
      'n01-05', 'n01-06a', 'n01-06b', 'n01-07', 'n01-08', 'n01-09a',
      'n01-09b', 'n01-10a', 'n01-10b',
    ]
    expect(choicesInOrder).toEqual(expected)
    expect(section.items.map((item) => item.id)).toEqual(expected)
    expect(section.items).toHaveLength(15)
    expect(new Set(choicesInOrder).size).toBe(15)
    expect(section.figures).toEqual([])
  })

  it('keeps exact core source mathematics and independent answers', () => {
    const m = Object.fromEntries(section.items.map(({ id, answer }) => [id, answer]))
    expect(m['n01-01']).toBe('-1')
    expect(m['n01-02a']).toBe('(-2,1)')
    expect(m['n01-02b']).toBe('(1,2)')
    expect(m['n01-02c']).toBe('(-1,4)')
    expect(m['n01-03']).toBe('5y')
    expect(m['n01-04']).toBe('(5x^3,1)')
    expect(m['n01-05']).toBe('(ay,ax)')
    expect(m['n01-06a']).toBe('3x^2-5x^2')
    expect(m['n01-06b']).toBe('(-5x+2x)\\quad(6-3)')
    expect(m['n01-07']).toBe('-2x^2-3x+3')
    expect(m['n01-08']).toBe('(2,3)')
    expect(m['n01-09a']).toBe('(1-1)x^3-2x^2+(1+3)x-1')
    expect(m['n01-09b']).toBe('-2x^2+4x-1')
    expect(m['n01-10a']).toBe('2次式')
    expect(m['n01-10b']).toBe('x³の項が打ち消し合うから')

    const sourceMath = reading.flatMap((b) =>
      (b.type === 'paragraph' || b.type === 'formula') ? b.parts.filter((x) => x.type === 'math').map((x) => x.latex) : [],
    ).join('\n')
    expect(sourceMath).toContain('5x^3y')
    expect(sourceMath).toContain('3x^2-5x+6-5x^2+2x-3')
    expect(sourceMath).toContain('x^3-2x^2+x-x^3+3x-1')
  })

  it('places a meaningful question before each definition, and never exposes Q09/Q10 answers prematurely', () => {
    const q01 = reading.findIndex((b) => b.id === 'formula-q01')
    const concept = reading.findIndex((b) => b.id === 'concept-monomial')
    expect(q01).toBeLessThan(concept)
    expect(choicesInOrder.indexOf('n01-03')).toBeLessThan(choicesInOrder.indexOf('n01-04'))
    expect(choicesInOrder.indexOf('n01-06b')).toBeLessThan(choicesInOrder.indexOf('n01-07'))
    expect(choicesInOrder.indexOf('n01-09b')).toBeLessThan(choicesInOrder.indexOf('n01-10a'))
    expect(choicesInOrder.indexOf('n01-10a')).toBeLessThan(choicesInOrder.indexOf('n01-10b'))

    const beforeFinal = reading.slice(0, reading.findIndex((b) => b.id === 'q09b'))
    const visibleWords = beforeFinal.flatMap((b) =>
      b.type === 'paragraph' || b.type === 'formula'
        ? b.parts.filter((part) => part.type === 'text' || part.type === 'math').map((part) =>
          part.type === 'text' ? part.text : part.latex)
        : [],
    ).join(' ')
    expect(visibleWords).not.toContain('-2x^2+4x-1')
    expect(visibleWords).not.toContain('x³の項が打ち消し合うから')
  })

  it('has legal and distinct alternatives with responsive choice metadata', () => {
    for (const item of section.items) {
      expect(item.choices).toHaveLength(3)
      expect(new Set(item.choices).size, item.id).toBe(3)
      expect(item.choices?.filter((x) => x === item.answer), item.id).toHaveLength(1)
      expect(item.hints.length, item.id).toBe(2)
      expect(item.purpose).toBeTruthy()
      expect(item.prompt).not.toMatch(/N01|Q[0-9]{1,2}/)
    }
    expect(section.items[0].scaffoldLevel).toBe('strong')
    expect(section.items.at(-1)?.scaffoldLevel).toBe('light')
  })
})
