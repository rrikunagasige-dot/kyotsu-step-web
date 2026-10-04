import { describe, expect, it } from 'vitest'
import {
  mathPracticeDependencyTargets,
  mathPracticeExternalDependencies,
  mathPracticeResultItems,
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
    expect(mathPracticeUsesSubproblemCompression('math-practice-087')).toBe(true)
    expect(mathPracticeUsesSubproblemCompression('math-practice-094')).toBe(true)
    expect(mathPracticeUsesSubproblemCompression('math-practice-097')).toBe(true)

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

  it('compresses 87 into independent membership stages without false dependency links', () => {
    const targets = mathPracticeTargetsForQuestion('math-practice-087')
    expect(targets.map((target) => target.id)).toEqual([
      'membership-rule', 'two', 'fifteen', 'twentyone', 'twentynine',
    ])
    expect(targets.every((target) => !target.dependsOn?.length)).toBe(true)
  })

  it('encodes the linear dependency chain for 97', () => {
    expect(mathPracticeDependencyTargets('math-practice-097', 'verify-a').map((target) => target.id))
      .toEqual(['solve-a'])
    expect(mathPracticeDependencyTargets('math-practice-097', 'union').map((target) => target.id))
      .toEqual(['verify-a'])

    const solveA = mathPracticeTargetsForQuestion('math-practice-097').find((target) => target.id === 'solve-a')!
    const verifyA = mathPracticeTargetsForQuestion('math-practice-097').find((target) => target.id === 'verify-a')!
    expect(mathPracticeResultItems(solveA).map((result) => result.blankId)).toEqual(['solve-a'])
    expect(mathPracticeResultItems(verifyA).map((result) => result.blankId)).toEqual(['a-set', 'b-set'])
  })
  it('maps 88-96 to compressed current-stage structures', () => {
    expect(mathPracticeTargetsForQuestion('math-practice-088').map((target) => target.id))
      .toEqual(['s1', 's2', 's3', 's4'])
    expect(mathPracticeTargetsForQuestion('math-practice-089').map((target) => target.id))
      .toEqual(['basis', 'b', 'c', 'd', 'e', 'final'])
    expect(mathPracticeTargetsForQuestion('math-practice-090').map((target) => target.id))
      .toEqual(['s1', 's2'])
    expect(mathPracticeTargetsForQuestion('math-practice-091').map((target) => target.id))
      .toEqual(['s1', 's2-plan', 's2-pairs', 's2-finish'])
    expect(mathPracticeTargetsForQuestion('math-practice-092').map((target) => target.id))
      .toEqual(['basis', 's1', 's2', 's3', 's4', 's5'])
    expect(mathPracticeTargetsForQuestion('math-practice-095').map((target) => target.id))
      .toEqual(['s1', 's2', 's3'])
  })

  it('reuses only the logically required previous results in 93 and 96', () => {
    expect(mathPracticeDependencyTargets('math-practice-093', 's1').map((target) => target.id))
      .toEqual(['basis'])
    expect(mathPracticeDependencyTargets('math-practice-093', 's2').map((target) => target.id))
      .toEqual(['basis'])
    const basis = mathPracticeTargetsForQuestion('math-practice-093').find((target) => target.id === 'basis')!
    expect(mathPracticeResultItems(basis).map((result) => result.blankId))
      .toEqual(['a-set', 'b-set', 'c-set'])

    expect(mathPracticeDependencyTargets('math-practice-096', 's5').map((target) => target.id))
      .toEqual(['s1'])
    expect(mathPracticeDependencyTargets('math-practice-096', 's3')).toEqual([])
    const p96s1 = mathPracticeTargetsForQuestion('math-practice-096').find((target) => target.id === 's1')!
    expect(mathPracticeResultItems(p96s1).map((result) => result.blankId)).toEqual(['p1-result'])
  })

  it('encodes 117 as two independent chains that import theorem 116 only when coefficient separation is applied', () => {
    expect(mathPracticeTargetsForQuestion('math-practice-117').map((target) => target.id)).toEqual([
      'p1-expand',
      'p1-group',
      'p1-apply',
      'p1-solve',
      'p2-conjugate',
      'p2-rationalize',
      'p2-group',
      'p2-apply',
      'p2-solve',
    ])

    expect(mathPracticeDependencyTargets('math-practice-117', 'p1-group').map((target) => target.id))
      .toEqual(['p1-expand'])
    expect(mathPracticeDependencyTargets('math-practice-117', 'p1-apply').map((target) => target.id))
      .toEqual(['p1-group'])
    expect(mathPracticeDependencyTargets('math-practice-117', 'p2-rationalize').map((target) => target.id))
      .toEqual(['p2-conjugate'])
    expect(mathPracticeDependencyTargets('math-practice-117', 'p2-apply').map((target) => target.id))
      .toEqual(['p2-group'])

    const p1External = mathPracticeExternalDependencies('math-practice-117', 'p1-apply')
    expect(p1External).toHaveLength(1)
    expect(p1External[0]).toMatchObject({
      id: 'R116-sqrt2',
      sourceQuestionId: 'math-practice-116',
      label: { ja: '116の結果', zh: '116的结论' },
    })
    expect(p1External[0]?.resultLatex).toContain('A+B\\sqrt{2}=0')

    expect(mathPracticeExternalDependencies('math-practice-117', 'p1-solve')).toEqual([])
    expect(mathPracticeExternalDependencies('math-practice-117', 'p2-apply').map((item) => item.id))
      .toEqual(['R116-sqrt2'])
  })

  it('models 118 as one shared function criterion with three independent judgments', () => {
    expect(mathPracticeTargetsForQuestion('math-practice-118').map((target) => target.id))
      .toEqual(['basis', 'p1', 'p2', 'p3'])
    expect(mathPracticeDependencyTargets('math-practice-118', 'p1').map((target) => target.id))
      .toEqual(['basis'])
    expect(mathPracticeDependencyTargets('math-practice-118', 'p2').map((target) => target.id))
      .toEqual(['basis'])
    expect(mathPracticeDependencyTargets('math-practice-118', 'p3').map((target) => target.id))
      .toEqual(['basis'])
    expect(mathPracticeUsesSubproblemCompression('math-practice-118')).toBe(true)
  })

  it('models 119 as current-item substitution with extra stages only for composite inputs', () => {
    expect(mathPracticeTargetsForQuestion('math-practice-119').map((target) => target.id)).toEqual([
      'basis',
      'f0',
      'f2',
      'fm1',
      'fa',
      'fa1-substitute',
      'fa1-simplify',
      'g0',
      'g3',
      'gm2',
      'gma-substitute',
      'gma-square',
      'gma-simplify',
      'ga1-substitute',
      'ga1-expand',
      'ga1-simplify',
    ])

    expect(mathPracticeDependencyTargets('math-practice-119', 'f0').map((target) => target.id))
      .toEqual(['basis'])
    expect(mathPracticeDependencyTargets('math-practice-119', 'fa1-simplify').map((target) => target.id))
      .toEqual(['fa1-substitute'])
    expect(mathPracticeDependencyTargets('math-practice-119', 'gma-square').map((target) => target.id))
      .toEqual(['gma-substitute'])
    expect(mathPracticeDependencyTargets('math-practice-119', 'gma-simplify').map((target) => target.id))
      .toEqual(['gma-square'])
    expect(mathPracticeDependencyTargets('math-practice-119', 'ga1-expand').map((target) => target.id))
      .toEqual(['ga1-substitute'])
    expect(mathPracticeDependencyTargets('math-practice-119', 'ga1-simplify').map((target) => target.id))
      .toEqual(['ga1-expand'])
    expect(mathPracticeUsesSubproblemCompression('math-practice-119')).toBe(true)
  })

  it('models 120 as two independent verbal problems with local formula and domain chains', () => {
    expect(mathPracticeTargetsForQuestion('math-practice-120').map((target) => target.id)).toEqual([
      'p1-formula',
      'p1-model',
      'p1-domain-meaning',
      'p1-domain',
      'p2-distance-rule',
      'p2-traveled',
      'p2-model',
      'p2-start',
      'p2-end',
      'p2-domain',
    ])

    expect(mathPracticeDependencyTargets('math-practice-120', 'p1-model').map((target) => target.id))
      .toEqual(['p1-formula'])
    expect(mathPracticeDependencyTargets('math-practice-120', 'p1-domain-meaning')).toEqual([])
    expect(mathPracticeDependencyTargets('math-practice-120', 'p1-domain').map((target) => target.id))
      .toEqual(['p1-domain-meaning'])

    expect(mathPracticeDependencyTargets('math-practice-120', 'p2-traveled').map((target) => target.id))
      .toEqual(['p2-distance-rule'])
    expect(mathPracticeDependencyTargets('math-practice-120', 'p2-model').map((target) => target.id))
      .toEqual(['p2-traveled'])
    expect(mathPracticeDependencyTargets('math-practice-120', 'p2-start')).toEqual([])
    expect(mathPracticeDependencyTargets('math-practice-120', 'p2-end')).toEqual([])
    expect(mathPracticeDependencyTargets('math-practice-120', 'p2-domain').map((target) => target.id))
      .toEqual(['p2-start', 'p2-end'])

    expect(mathPracticeUsesSubproblemCompression('math-practice-120')).toBe(true)
  })


  it('keeps current-target headings task-oriented instead of revealing current answers', () => {
    const label = (questionId: string, targetId: string) =>
      mathPracticeTargetsForQuestion(questionId).find((target) => target.id === targetId)?.label

    expect(label('math-practice-106', 's2')).toEqual({
      ja: '奇数の条件を集合 P で表す',
      zh: '用集合 P 表示奇数条件',
    })
    expect(label('math-practice-108', 'basis')).toEqual({
      ja: '同値を示すための証明方針を考える',
      zh: '思考证明等价所需的方针',
    })
    expect(label('math-practice-108', 'conclude')).toEqual({
      ja: '2方向の結果から最終関係を判断する',
      zh: '根据两个方向的结果判断最终关系',
    })
    expect(label('math-practice-111', 'p4-form')).toEqual({
      ja: '奇数を整数 k を使って表す',
      zh: '用整数 k 表示奇数',
    })
    expect(label('math-practice-113', 'assumption')).toEqual({
      ja: '背理法の反対仮定を置く',
      zh: '写出反证法所需的反设',
    })
    expect(label('math-practice-116', 'assumption')).toEqual({
      ja: 'q=0を示すための反対仮定を置く',
      zh: '为证明q=0写出反设',
    })
    expect(label('math-practice-118', 'basis')).toEqual({
      ja: '関数の判定基準を確認する',
      zh: '确认函数的判定标准',
    })
  })

  it('enables subproblem compression for the full reviewed set batch 87-97', () => {
    for (let problemNo = 87; problemNo <= 97; problemNo += 1) {
      expect(mathPracticeUsesSubproblemCompression(`math-practice-${String(problemNo).padStart(3, '0')}`)).toBe(true)
    }
  })

})
