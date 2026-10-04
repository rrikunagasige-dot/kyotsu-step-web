import { describe, expect, it } from 'vitest'
import { mathPracticeFigureState } from './figures'

const r = (...ids: string[]) => new Set(ids)

describe('math practice figure timing', () => {
  it('does not reveal the 98 counterexample before learner-owned reasoning', () => {
    expect(mathPracticeFigureState('math-practice-098', 's2', r())).toBeNull()
    expect(mathPracticeFigureState('math-practice-098', 's2', r('p2-property'))).toBe('F98-2A')
    expect(mathPracticeFigureState('math-practice-098', 's2', r('p2-property', 'p2-third-side', 'p2-example'))).toBe('F98-2B')
  })

  it('shows 99 number lines only after both sets are derived', () => {
    expect(mathPracticeFigureState('math-practice-099', 's1', r())).toBeNull()
    expect(mathPracticeFigureState('math-practice-099', 's1', r('p1-sets'))).toBe('F99-1')
    expect(mathPracticeFigureState('math-practice-099', 's3', r('p3-p-set'))).toBeNull()
    expect(mathPracticeFigureState('math-practice-099', 's3', r('p3-p-set', 'p3-q-set'))).toBe('F99-3')
  })

  it('keeps 104 rhombus evidence behind the forward reasoning node', () => {
    expect(mathPracticeFigureState('math-practice-104', 's6', r())).toBeNull()
    expect(mathPracticeFigureState('math-practice-104', 's6', r('p6-forward-property'))).toBe('F104-6A')
    expect(mathPracticeFigureState('math-practice-104', 's6', r('p6-forward-property', 'p6-forward-judgment', 'p6-reverse-property'))).toBe('F104-6B')
  })

  it('does not reveal both negative-product sign branches before 107 reverse-sign reasoning', () => {
    expect(mathPracticeFigureState('math-practice-107', 's2', r())).toBeNull()
    expect(mathPracticeFigureState('math-practice-107', 's2', r('p2-forward-sign', 'p2-forward-judgment'))).toBeNull()
    expect(mathPracticeFigureState('math-practice-107', 's2', r('p2-forward-sign', 'p2-forward-judgment', 'p2-reverse-signs'))).toBe('F107-2A')
  })

  it('progresses 107(5) through notation, branch evidence, and counterexamples', () => {
    expect(mathPracticeFigureState('math-practice-107', 's5', r())).toBe('F107-5A')
    expect(mathPracticeFigureState('math-practice-107', 's5', r('p5-branch-isosceles'))).toBe('F107-5B')
    expect(mathPracticeFigureState('math-practice-107', 's5', r('p5-branch-isosceles', 'p5-branch-right'))).toBe('F107-5C')
    expect(mathPracticeFigureState('math-practice-107', 's5', r('p5-branch-isosceles', 'p5-branch-right', 'p5-forward-example'))).toBe('F107-5D')
    expect(mathPracticeFigureState('math-practice-107', 's5', r('p5-reverse-lengths'))).toBe('F107-5E')
  })

  it('does not show the non-unique 118 mapping until both square roots are found', () => {
    expect(mathPracticeFigureState('math-practice-118', 's2', r())).toBeNull()
    expect(mathPracticeFigureState('math-practice-118', 's2', r('p2-sample'))).toBe('F118-2A')
    expect(mathPracticeFigureState('math-practice-118', 's2', r('p2-sample', 'p2-roots'))).toBe('F118-2B')
  })

  it('progresses the 120 route without implying an interior current position initially', () => {
    expect(mathPracticeFigureState('math-practice-120', 'p2-distance-rule', r())).toBe('F120-2A')
    expect(mathPracticeFigureState('math-practice-120', 'p2-model', r('p2-traveled'))).toBe('F120-2B')
    expect(mathPracticeFigureState('math-practice-120', 'p2-start', r('p2-model'))).toBe('F120-2C')
    expect(mathPracticeFigureState('math-practice-120', 'p2-domain', r('p2-start', 'p2-end'))).toBe('F120-2D')
  })

  it('does not add figures to untouched first-section problems', () => {
    expect(mathPracticeFigureState('math-practice-097', 'union', r())).toBeNull()
  })
})
