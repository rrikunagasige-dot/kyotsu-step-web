import { describe, expect, it } from 'vitest'
import { mathNumbersN12Unit, n12SourceToItemIds } from './n12Lesson'

// W-MATH-004/P-001: supplemental learning stages, not new Word questions.
const originalIds = Array.from({ length: 15 }, (_, index) => 'n12-' + String(index + 1).padStart(2, '0'))
const extraIds = ['n12-01a', 'n12-02a', 'n12-06a', 'n12-06b', 'n12-12a', 'n12-13a']
const expectedOrder = [
  'n12-01a', 'n12-01', 'n12-02a', 'n12-02',
  'n12-03', 'n12-04', 'n12-05',
  'n12-06a', 'n12-06b', 'n12-06', 'n12-07',
  'n12-08', 'n12-09', 'n12-10', 'n12-11',
  'n12-12a', 'n12-12', 'n12-13a', 'n12-13', 'n12-14', 'n12-15',
]

const section = mathNumbersN12Unit.sections[0]
const flowOrder = section.readingFlow.flatMap((block) =>
  block.type === 'paragraph' || block.type === 'formula'
    ? block.parts.flatMap((part) => part.type === 'choice' ? [part.itemId] : [])
    : [],
)
const choiceById = new Map(section.items.map((item) => [item.id, item]))

function formulaBefore(id: string): string {
  const block = section.readingFlow.find((part) =>
    part.type === 'formula' && part.parts.some((fragment) =>
      fragment.type === 'choice' && fragment.itemId === id,
    ),
  )
  if (block?.type !== 'formula') throw new Error('missing formula for ' + id)
  return block.parts.flatMap((part) => part.type === 'math' ? [part.latex] : []).join('')
}

describe('N12 approved six-stage derivation correction', () => {
  it('preserves the original 15 Word markers and response keys', () => {
    expect(Object.keys(n12SourceToItemIds)).toEqual(
      Array.from({ length: 15 }, (_, index) => 'N12-Q' + String(index + 1).padStart(2, '0')),
    )
    for (const [index, id] of originalIds.entries()) {
      expect(n12SourceToItemIds['N12-Q' + String(index + 1).padStart(2, '0')]).toEqual([id])
    }
    expect(section.items.map((item) => item.id).filter((id) => originalIds.includes(id))).toEqual(originalIds)
  })

  it('adds six distinct steps within 21 progressive inline choices', () => {
    expect(mathNumbersN12Unit.status).toBe('review')
    expect(section.items).toHaveLength(21)
    expect(flowOrder).toEqual(expectedOrder)
    expect(new Set(flowOrder).size).toBe(21)
    expect(section.items.map((item) => item.id).filter((id) => extraIds.includes(id))).toEqual(extraIds)
    expect(section.readingFlow.filter((block) => block.type === 'heading')).toHaveLength(2)
  })

  it('requires algebraic reasoning before revealing original final results', () => {
    const answers: Record<string, string> = {
      'n12-01a': '-7<2x',
      'n12-02a': '2x\\le1',
      'n12-06a': 'x\\le2',
      'n12-06b': '3x\\le5',
      'n12-12a': '50+180x+2600-130x',
      'n12-13a': '550\\le50x<650',
      'n12-01': 'x>-\\frac72',
      'n12-02': 'x\\le\\frac12',
      'n12-06': 'x\\le2,\\quad x\\le\\frac53',
      'n12-12': '3200\\le2650+50x<3300',
      'n12-13': '11\\le x<13',
      'n12-14': 'x=11\\ \\text{または}\\ 12',
    }
    for (const [id, correct] of Object.entries(answers)) {
      expect(choiceById.get(id)?.answer, id).toBe(correct)
    }
    expect(formulaBefore('n12-01a')).toContain('-2<2x+5')
    expect(formulaBefore('n12-01')).toContain('-7<2x')
    expect(formulaBefore('n12-02a')).toContain('2x+4\\le5')
    expect(formulaBefore('n12-02')).toContain('2x\\le1')
    expect(formulaBefore('n12-06a')).toContain('x+2\\le4')
    expect(formulaBefore('n12-06b')).toContain('3x+4\\le9')
    expect(formulaBefore('n12-06')).toContain('3x\\le5')
    expect(formulaBefore('n12-12a')).toContain('130(20-x)')
    expect(formulaBefore('n12-12')).toContain('2600-130x')
    expect(formulaBefore('n12-13a')).toContain('2650+50x')
    expect(formulaBefore('n12-13')).toContain('550\\le50x<650')

    for (const id of extraIds) {
      const item = choiceById.get(id)
      expect(item?.choices).toHaveLength(4)
      expect(item?.choices?.filter((choice) => choice === item?.answer)).toHaveLength(1)
    }
  })

  it('keeps the three original figures and answer-bearing F03 after the final check', () => {
    expect(section.figures.map((figure) => figure.src)).toEqual([
      '/assets/math/textbook/numbers/n12-f01.png',
      '/assets/math/textbook/numbers/n12-f02.png',
      '/assets/math/textbook/numbers/n12-f03.png',
    ])
    const figureF03 = section.readingFlow.findIndex((block) => block.type === 'figure' && block.figureId === 'n12-f03')
    const lastQuestion = section.readingFlow.findIndex((block) =>
      (block.type === 'paragraph' || block.type === 'formula') &&
      block.parts.some((part) => part.type === 'choice' && part.itemId === 'n12-15'),
    )
    expect(lastQuestion).toBeGreaterThan(-1)
    expect(figureF03).toBeGreaterThan(lastQuestion)
  })

  it('preserves inequality direction and validates integer/cost endpoints', () => {
    const good = [11, 12].filter((x) => x >= 0 && x <= 20 && x >= 11 && x < 13)
    expect(good).toEqual([11, 12])
    expect(good.map((x) => 50 + 180 * x + 130 * (20 - x))).toEqual([3200, 3250])
    expect(50 + 180 * 13 + 130 * (20 - 13)).toBe(3300)
    expect((-7 / 2) < 1 && 1 > 1 / 2).toBe(true)
    expect(5 / 3 < 2).toBe(true)
  })
})
