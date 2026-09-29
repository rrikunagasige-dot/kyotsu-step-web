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
})
