import { describe, expect, it } from 'vitest'
import {
  mathPracticeDependencyTargets,
  mathPracticeTargetForBlank,
  mathPracticeTargetsForQuestion,
  mathPracticeUsesSubproblemCompression,
} from './presentation'

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

  it('encodes only the previous results that 94 actually reuses', () => {
    expect(mathPracticeUsesSubproblemCompression('math-practice-094')).toBe(true)
    expect(mathPracticeUsesSubproblemCompression('math-practice-087')).toBe(false)

    expect(mathPracticeDependencyTargets('math-practice-094', 's3').map((target) => target.id)).toEqual(['s1'])
    expect(mathPracticeDependencyTargets('math-practice-094', 's4').map((target) => target.id)).toEqual(['s2'])
    expect(mathPracticeDependencyTargets('math-practice-094', 's5').map((target) => target.id)).toEqual(['s1', 's2'])
    expect(mathPracticeDependencyTargets('math-practice-094', 's6').map((target) => target.id)).toEqual(['s1', 's2'])
    expect(mathPracticeDependencyTargets('math-practice-094', 's7')).toEqual([])
  })

  it('stores reusable result nodes for 94 without duplicating the derivation', () => {
    const targets = mathPracticeTargetsForQuestion('math-practice-094')
    const s1 = targets.find((target) => target.id === 's1')
    const s2 = targets.find((target) => target.id === 's2')
    expect(s1?.result).toEqual({
      blankId: 'a-complement',
      label: { ja: '(1) の結果', zh: '(1) 的结果' },
      latexPrefix: '\\overline{A}=',
    })
    expect(s2?.result?.blankId).toBe('b-complement')
  })

  it('makes the three goals of 97 explicit', () => {
    expect(mathPracticeTargetForBlank('math-practice-097', 'math-practice-097-four-membership')?.id).toBe('solve-a')
    expect(mathPracticeTargetForBlank('math-practice-097', 'math-practice-097-b-set')?.id).toBe('verify-a')
    expect(mathPracticeTargetForBlank('math-practice-097', 'math-practice-097-union-result')?.id).toBe('union')
  })
})
