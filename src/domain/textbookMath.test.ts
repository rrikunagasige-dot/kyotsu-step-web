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

  it('normalizes theta, degree signs, and trigonometric operators', () => {
    expect(normalizeTextbookMath('θ=45°')).toBe('\\theta =45^{\\circ}')
    expect(normalizeTextbookMath('2θ=90°')).toBe('2\\theta =90^{\\circ}')
    expect(normalizeTextbookMath('sin²θ')).toBe('\\sin ^2\\theta')
    expect(normalizeTextbookMath('cos²θ')).toBe('\\cos ^2\\theta')
    expect(normalizeTextbookMath('sin2θ')).toBe('\\sin 2\\theta')
  })

  it('keeps theta-led and degree-bearing inline expressions inside math tokens', () => {
    const parts = splitTextbookInlineMath('この条件は 2θ=90° を意味し、θ=45° となる。')
    expect(parts.some((part) => part.type === 'math' && part.latex === '2\\theta =90^{\\circ}')).toBe(true)
    expect(parts.some((part) => part.type === 'math' && part.latex === '\\theta =45^{\\circ}')).toBe(true)
    expect(parts.some((part) => part.type === 'text' && (part.text.includes('θ=') || part.text.includes('90°')))).toBe(false)
  })

  it('normalizes set complement, intersection, union, and membership notation', () => {
    expect(normalizeTextbookMath('overline(A) ∩ B')).toBe('\\overline{A} \\cap B')
    expect(normalizeTextbookMath('A ∪ overline(B)')).toBe('A \\cup \\overline{B}')
    expect(normalizeTextbookMath('2 ∈ A')).toBe('2 \\in A')
    expect(normalizeTextbookMath('21 ∉ A')).toBe('21 \\notin A')
    expect(normalizeTextbookMath('{1,4}')).toBe('\\{1,4\\}')
  })

  it('keeps prose-level set expressions together as inline math', () => {
    const parts = splitTextbookInlineMath('overline(A) ∩ B に入る要素の条件はどれか。')
    expect(parts.some((part) =>
      part.type === 'math' && part.latex === '\\overline{A} \\cap B',
    )).toBe(true)
    expect(parts.some((part) => part.type === 'text' && part.text.includes('overline'))).toBe(false)
  })

  it('renders equations with finite-set literals as one math token', () => {
    const parts = splitTextbookInlineMath('共通部分 A∩B={1,4} を確認する。')
    expect(parts.some((part) =>
      part.type === 'math' && part.latex === 'A \\cap B=\\{1,4\\}',
    )).toBe(true)
  })

  it('keeps a complement of a grouped set expression as one math token', () => {
    const parts = splitTextbookInlineMath('overline(A ∩ B) はどれか。')
    expect(parts.some((part) =>
      part.type === 'math' && part.latex === '\\overline{A \\cap B}',
    )).toBe(true)
    expect(parts.some((part) => part.type === 'text' && part.text.includes('overline'))).toBe(false)
  })

  it('renders the union in the exact 97 problem sentence as inline math', () => {
    const parts = splitTextbookInlineMath('このとき、定数 a の値と和集合 A∪B を求めよ。')
    expect(parts.some((part) =>
      part.type === 'math' && part.latex === 'A \\cup B',
    )).toBe(true)
  })
  it('does not turn TeX grouping in complement operators into singleton sets', () => {
    expect(normalizeTextbookMath('\\overline{A}\\cap\\overline{B}')).toBe('\\overline{A}\\cap\\overline{B}')
    expect(normalizeTextbookMath('\\overline{A}\\cup\\overline{B}')).toBe('\\overline{A}\\cup\\overline{B}')
    expect(normalizeTextbookMath('\\overline{\\overline{A}}=A')).toBe('\\overline{\\overline{A}}=A')
    expect(normalizeTextbookMath('\\overline{A\\cap B}')).toBe('\\overline{A\\cap B}')
  })

  it('preserves other TeX groups while still escaping unescaped finite-set literals', () => {
    expect(normalizeTextbookMath('\\sqrt{2}+\\frac{a}{b}+\\vec{r}+x^{2}')).toBe('\\sqrt{2}+\\frac{a}{b}+\\vec{r}+x^{2}')
    expect(normalizeTextbookMath('A={1,4}')).toBe('A=\\{1,4\\}')
    expect(normalizeTextbookMath('{A}')).toBe('\\{A\\}')
    expect(normalizeTextbookMath('\\{1,4\\}')).toBe('\\{1,4\\}')
  })

  it('does not alter TeX groups inside the paired real-line choice', () => {
    const latex = 'A\\cap B=\\{x\\mid -1\\le x<2\\},\\quad \\overline{A\\cap B}=\\{x\\mid x<-1,\\ 2\\le x\\}'
    expect(normalizeTextbookMath(latex)).toBe(latex)
  })

})


// View-only pilot: learning/answer contracts come from the unchanged original unit.
import { qf01TransformationPresentation, mathQuadraticQF01Unit } from '../data/textbook/math/quadratic/qf01Lesson'
import { TransformationReadingSchema, projectTransformationView } from './transformationReading'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TransformationReadingGroup } from '../components/textbook/TransformationReadingGroup'

describe('P011 continuous substitution without changing grading', () => {
  const view = TransformationReadingSchema.parse(qf01TransformationPresentation)
  const substitution = 'qf01-n03-answer', result = 'qf01-n04-answer'
  const items = mathQuadraticQF01Unit.sections.flatMap(section => section.items)
  it('binds exactly the original two decisions and no other learning IDs', () => {
    expect(view.scope.nodeIds).toEqual(['qf01-n03', 'qf01-n04'])
    for (const interaction of view.interactions) {
      const item = items.find(item => item.id === interaction.id)!
      expect(interaction.correctValue).toBe(item.answer)
      expect(interaction.choices).toEqual(item.choices)
      expect(item.answerType).toBe('text')
      expect(item.acceptedAnswers).toEqual([])
    }
    expect(items).toHaveLength(25)
    expect(mathQuadraticQF01Unit.revision).toBe(1)
  })
  it('unlocks arithmetic and result only after the whole substitution is correct', () => {
    expect(projectTransformationView(view).groups[0].rows.map(row => row.id)).toEqual(['qf01-input', 'qf01-substitution'])
    expect(projectTransformationView(view, [result]).groups[0].rows.map(row => row.id)).toEqual(['qf01-input', 'qf01-substitution'])
    const partial = projectTransformationView(view, [substitution]).groups[0]
    expect(partial.rows).toHaveLength(4)
    expect(partial.rows.at(-1)?.current?.id).toBe(result)
    const complete = projectTransformationView(view, [substitution, result]).groups[0]
    expect(complete.rows.every(row => row.done)).toBe(true)
    expect(complete.rows.at(-1)?.after).toEqual([{ type: 'text', text: '入力が−1のとき、出力は−10です。' }])
  })
  it('retains the input and arithmetic in compact history and the whole chain once in full history', () => {
    const group = projectTransformationView(view, [substitution, result]).groups[0]
    const markup = (rows: typeof group.rows) => renderToStaticMarkup(createElement(TransformationReadingGroup, { group: { ...group, rows }, renderSlot: () => null, renderPanel: () => null }))
    const full = markup(group.rows), compact = markup(group.rows.filter(row => row.sourceNodeId === 'qf01-n04'))
    expect((full.match(/data-transformation-row=/g) ?? [])).toHaveLength(3)
    expect((compact.match(/data-transformation-row=/g) ?? [])).toHaveLength(2)
    for (const html of [full, compact]) {
      expect(html).toContain('f(-1)')
      expect(html).toContain('-4-6')
      expect(html).toContain('-10')
    }
    expect(full).toContain('<mo>×</mo>')
    expect(full).not.toContain('を計算すると？')
  })
})
