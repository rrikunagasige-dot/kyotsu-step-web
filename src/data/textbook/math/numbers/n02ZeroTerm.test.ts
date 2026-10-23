import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { isTextbookAnswerCorrect } from '../../../../domain/textbook'
import { normalizeTextbookMath } from '../../../../domain/textbookMath'
import { mathNumbersN01Unit } from './n01Lesson'
import { mathNumbersN02Unit, n02SourceToItemIds } from './n02Lesson'
import { mathNumbersN03Unit } from './n03Lesson'

const section = mathNumbersN02Unit.sections[0]
const blocks = section.readingFlow
const q05 = section.items.find(q => q.id === 'n02-05')!
const q05Index = blocks.findIndex(block =>
  (block.type === 'paragraph' || block.type === 'formula')
  && block.parts.some(part => part.type === 'choice' && part.itemId === 'n02-05'))

describe('W-MATH-010/P-001: N02 missing zero-coefficient TERM', () => {
  it('preserves Q05 exactly during approved Q06-Q12 revision and keeps all 12 source mappings', () => {
    const originalIds = Object.values(n02SourceToItemIds).flat()
    expect(section.items.map(q => q.id)).toEqual(originalIds)
    expect(mathNumbersN02Unit.revision).toBe(2)
    expect(mathNumbersN02Unit.status).toBe('review')
    expect(q05.answer).toBe('0x')
    expect(q05.choices).toEqual(['0x', 'x', '-x', '2x'])
    expect(section.items).toHaveLength(15)
    expect(mathNumbersN01Unit.sections[0].items).toHaveLength(18)
    expect(mathNumbersN03Unit.sections[0].items).toHaveLength(17)
  })

  it('asks for a missing first-degree term rather than only the coefficient', () => {
    expect(q05.prompt).toBe('係数が0の一次項を、Bの式中に補おう。')
    expect(q05.prompt).toContain('一次項')
    expect(q05.prompt).not.toContain('係数は？')
    const q05Formula = blocks[q05Index]
    expect(q05Formula.type).toBe('formula')
    if (q05Formula.type === 'formula') {
      expect(q05Formula.parts).toEqual([
        { type: 'math', latex: 'B=-x^3+2x^2+' },
        { type: 'choice', itemId: 'n02-05' },
        { type: 'math', latex: '+2' },
      ])
      for (const part of q05Formula.parts) if (part.type === 'math') {
        expect(() => katex.renderToString(part.latex, { throwOnError: true })).not.toThrow()
      }
    }
    expect(isTextbookAnswerCorrect(q05, '0x')).toBe(true)
    expect(isTextbookAnswerCorrect(q05, '0')).toBe(false)
  })

  it('explains the distinction only AFTER Q05 so the placeholder answer is not leaked', () => {
    const earlier = JSON.stringify(blocks.slice(0, q05Index))
    expect(earlier).not.toContain('0x')
    expect(earlier).not.toContain('係数0')
    const explanation = blocks[q05Index + 1]
    expect(explanation.id).toBe('paragraph-n02-05-after')
    expect(JSON.stringify(explanation)).toContain('0x')
    expect(JSON.stringify(explanation)).toContain('係数は')
    const q06Index = blocks.findIndex(block =>
      (block.type === 'paragraph' || block.type === 'formula')
      && block.parts.some(part => part.type === 'choice' && part.itemId === 'n02-06'))
    expect(q06Index).toBeGreaterThan(q05Index + 1)
  })

  it('does not introduce a coefficient 1x or alter the existing 1→x display rule', () => {
    expect(section.items.map(q => q.answer).join(' ')).not.toContain('1x')
    expect(normalizeTextbookMath('x')).toBe('x')
    expect(normalizeTextbookMath('0x')).toBe('0x')
    expect(q05.choices).toContain('x')
  })
})
