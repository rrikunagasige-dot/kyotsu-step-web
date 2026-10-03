import { describe, expect, it } from 'vitest'
import { mathPracticeTargetForBlank, mathPracticeTargetsForQuestion } from './presentation'

describe('math practice current-target presentation', () => {
  it('keeps 87 anchored to the current membership decision', () => {
    expect(mathPracticeTargetForBlank('math-practice-087', 'math-practice-087-two-divisors')?.latex)
      .toBe('2\\;\\square\\;A')
    expect(mathPracticeTargetForBlank('math-practice-087', 'math-practice-087-fifteen-membership')?.latex)
      .toBe('15\\;\\square\\;A')
  })

  it('maps every 94 subproblem to its visible numbered target', () => {
    const targets = mathPracticeTargetsForQuestion('math-practice-094')
    expect(targets.map((target) => target.id)).toEqual([
      'basis', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8',
    ])
    expect(mathPracticeTargetForBlank('math-practice-094', 'math-practice-094-abar-intersection-b-meaning')?.latex)
      .toBe('\\overline{A}\\cap B')
    expect(mathPracticeTargetForBlank('math-practice-094', 'math-practice-094-complement-a-union-b')?.latex)
      .toBe('\\overline{A\\cup B}')
  })

  it('makes the three goals of 97 explicit', () => {
    expect(mathPracticeTargetForBlank('math-practice-097', 'math-practice-097-four-membership')?.id).toBe('solve-a')
    expect(mathPracticeTargetForBlank('math-practice-097', 'math-practice-097-b-set')?.id).toBe('verify-a')
    expect(mathPracticeTargetForBlank('math-practice-097', 'math-practice-097-union-result')?.id).toBe('union')
  })
})
