import { describe, expect, it } from 'vitest'
import { typesetRows } from './typesetRows'

const measure = (s: string) => s.length * 8
const content = (s: string) => s.replace(/\\qquad|\s/g, '')
describe('approved logical mathematical rows', () => {
  it('keeps both short independent equalities whole, rather than four detached halves', () => {
    const plan = typesetRows('2xy=(2y)x,\\qquad -3x=(-3)x', 300, measure)
    expect(plan.independent).toBe(true)
    expect(plan.rows.map(r => [r.lhs, r.rhs])).toEqual([['2xy', '(2y)x,'], ['-3x', '(-3)x']])
  })
  it('keeps a short equality and its actual hole in the same logical row', () => {
    expect(typesetRows('2xy-3x=(§1§)x', 300, measure).rows).toHaveLength(1)
  })
  it('distinguishes transformation relations from a continued sum without changing tokens', () => {
    const source = 'x^2+2xy+y^2-3x-3y+2=x^2+(2y-3)x+(y^2-3y+2)'
    const rows = typesetRows(source, 160, measure).rows
    expect(rows.some(r => r.kind === 'continuation')).toBe(true)
    expect(content(rows.map(r => r.latex).join(''))).toBe(content(source))
    expect(rows.filter(r => r.kind === 'equation')).toHaveLength(1)
  })
  it('keeps annotation, coefficient control and parentheses intact', () => {
    const source = 'a^3=4\\times\\underbrace{a\\times a\\times a}_{3\\text{個}}\\times(§1§)'
    const rows = typesetRows(source, 220, measure).rows
    expect(rows.map(r => r.latex).join('')).toBe(source)
    expect(rows.some(r => r.latex.includes('\\underbrace{a\\times a\\times a}_{3\\text{個}}'))).toBe(true)
    expect(rows.some(r => r.latex.includes('(§1§)'))).toBe(true)
  })
  it('retains the columns and order of a source table', () => {
    const p = typesetRows('\\begin{array}{c|r}種類&結果\\\\\\hline 二次&-2x^2\\end{array}', 280, measure)
    expect(p.table).toEqual([['種類', '結果'], [' 二次', '-2x^2']])
  })
})
