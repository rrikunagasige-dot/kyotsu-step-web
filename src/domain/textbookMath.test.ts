import { describe, expect, it } from 'vitest'
import { normalizeTextbookMath, splitTextbookInlineMath } from './textbookMath'

describe('textbook math normalization', () => {
  it('groups combined unicode subscripts into one valid LaTeX subscript', () => {
    expect(normalizeTextbookMath('v₀ₓ')).toBe('v_{0x}')
    expect(normalizeTextbookMath('v₀ᵧ')).toBe('v_{0y}')
    expect(normalizeTextbookMath('v_0_x')).toBe('v_{0x}')
  })

  it('normalizes vectors and vector subscripts without raw combining marks', () => {
    expect(normalizeTextbookMath('r⃗₁')).toBe('\\vec{r}_{1}')
    expect(normalizeTextbookMath('Δr⃗')).toBe('\\Delta \\vec{r}')
    expect(normalizeTextbookMath('v⃗_A')).toBe('\\vec{v}_A')
    expect(normalizeTextbookMath('v̄⃗')).toBe('\\vec{v}_{\\mathrm{avg}}')
  })

  it('keeps ordinary symbolic subscripts valid', () => {
    expect(normalizeTextbookMath('t_H')).toBe('t_H')
    expect(normalizeTextbookMath('v_t')).toBe('v_t')
  })

  it('extracts prose-level combined-subscript symbols as math instead of text', () => {
    const parts = splitTextbookInlineMath('水平方向の初速度は v₀ₓ である。')
    expect(parts.some((part) => part.type === 'math' && part.latex === 'v_{0x}')).toBe(true)
    expect(parts.some((part) => part.type === 'text' && part.text.includes('v₀ₓ'))).toBe(false)
  })

  it('normalizes unicode radicals including nested parentheses', () => {
    expect(normalizeTextbookMath('√(a²+b²)')).toBe('\\sqrt{a^2+b^2}')
    expect(normalizeTextbookMath('√((−10)²+(−10)²)')).toBe('\\sqrt{(-10)^2+(-10)^2}')
    expect(normalizeTextbookMath('v=√(v₀²+g²t²)')).toBe('v=\\sqrt{v_0^2+g^2t^2}')
  })

  it('keeps an inline radical expression together as one math token', () => {
    const parts = splitTextbookInlineMath('したがって速さは v = √(v₀²+g²t²) である。')
    expect(parts).toEqual([
      { type: 'text', text: 'したがって速さは ' },
      { type: 'math', latex: 'v = \\sqrt{v_0^2+g^2t^2}' },
      { type: 'text', text: ' である。' },
    ])
    expect(parts.some((part) => part.type === 'text' && part.text.includes('√'))).toBe(false)
  })

  it('extracts a radical-starting inline expression as math', () => {
    const parts = splitTextbookInlineMath('大きさは √((−10)²+(−10)²) である。')
    expect(parts.some((part) =>
      part.type === 'math' && part.latex === '\\sqrt{(-10)^2+(-10)^2}',
    )).toBe(true)
  })
})
