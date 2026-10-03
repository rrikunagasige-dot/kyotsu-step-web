export type MathPracticeResult = {
  blankId: string
  label: { ja: string; zh: string }
  latexPrefix?: string
}

export type MathPracticeTarget = {
  id: string
  kicker: { ja: string; zh: string }
  label?: { ja: string; zh: string }
  latex?: string
  blankIds: readonly string[]
  dependsOn?: readonly string[]
  result?: MathPracticeResult
  results?: readonly MathPracticeResult[]
  resultLinkLabel?: { ja: string; zh: string }
}

const targetsByQuestion: Record<string, readonly MathPracticeTarget[]> = {
  'math-practice-087': [
    {
      id: 'membership-rule',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '集合 A に入る条件を整理する', zh: '整理进入集合 A 的条件' },
      blankIds: ['condition-sufficiency', 'prime-condition'],
    },
    {
      id: 'two',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '2\\;\\square\\;A',
      blankIds: ['two-divisors', 'two-membership'],
    },
    {
      id: 'fifteen',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '15\\;\\square\\;A',
      blankIds: ['fifteen-factor', 'fifteen-membership'],
    },
    {
      id: 'twentyone',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '21\\;\\square\\;A',
      blankIds: ['twentyone-factor', 'twentyone-membership'],
    },
    {
      id: 'twentynine',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '29\\;\\square\\;A',
      blankIds: ['twentynine-divisor-check', 'twentynine-membership'],
    },
  ],
  'math-practice-094': [
    {
      id: 'basis',
      kicker: { ja: '準備', zh: '准备' },
      label: { ja: '補集合を考える基準を確認する', zh: '先确认补集的基准' },
      blankIds: ['universe-basis'],
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      latex: '\\overline{A}',
      blankIds: ['a-complement'],
      result: {
        blankId: 'a-complement',
        label: { ja: '(1) の結果', zh: '(1) 的结果' },
        latexPrefix: '\\overline{A}=',
      },
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: '\\overline{B}',
      blankIds: ['b-complement'],
      result: {
        blankId: 'b-complement',
        label: { ja: '(2) の結果', zh: '(2) 的结果' },
        latexPrefix: '\\overline{B}=',
      },
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      latex: '\\overline{A}\\cap B',
      blankIds: ['abar-intersection-b-meaning', 'abar-intersection-b'],
      dependsOn: ['s1'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      latex: 'A\\cup\\overline{B}',
      blankIds: ['a-union-bbar'],
      dependsOn: ['s2'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      latex: '\\overline{A}\\cap\\overline{B}',
      blankIds: ['abar-intersection-bbar'],
      dependsOn: ['s1', 's2'],
    },
    {
      id: 's6',
      kicker: { ja: '今の問い｜(6)', zh: '当前问题｜(6)' },
      latex: '\\overline{A}\\cup\\overline{B}',
      blankIds: ['abar-union-bbar'],
      dependsOn: ['s1', 's2'],
    },
    {
      id: 's7',
      kicker: { ja: '今の問い｜(7)', zh: '当前问题｜(7)' },
      latex: '\\overline{A\\cap B}',
      blankIds: ['a-intersection-b', 'complement-a-intersection-b'],
    },
    {
      id: 's8',
      kicker: { ja: '今の問い｜(8)', zh: '当前问题｜(8)' },
      latex: '\\overline{A\\cup B}',
      blankIds: ['a-union-b', 'complement-a-union-b'],
    },
  ],
  'math-practice-097': [
    {
      id: 'solve-a',
      kicker: { ja: 'まずの目標', zh: '第一目标' },
      label: { ja: '共通部分の条件から a を求める', zh: '由交集条件求 a' },
      blankIds: ['four-membership', 'variable-element', 'equation-for-four', 'solve-a'],
      result: {
        blankId: 'solve-a',
        label: { ja: '前の結果', zh: '前一步结果' },
        latexPrefix: 'a=',
      },
    },
    {
      id: 'verify-a',
      kicker: { ja: '次の目標', zh: '下一目标' },
      label: { ja: '求めた a が条件を本当に満たすか確かめる', zh: '确认求得的 a 是否真的满足条件' },
      blankIds: ['a-set', 'b-set', 'intersection-check'],
      dependsOn: ['solve-a'],
      resultLinkLabel: { ja: '前の確認結果', zh: '前一步确认结果' },
      results: [
        {
          blankId: 'a-set',
          label: { ja: 'A', zh: 'A' },
          latexPrefix: 'A=',
        },
        {
          blankId: 'b-set',
          label: { ja: 'B', zh: 'B' },
          latexPrefix: 'B=',
        },
      ],
    },
    {
      id: 'union',
      kicker: { ja: '最後の目標', zh: '最后目标' },
      latex: 'A\\cup B',
      blankIds: ['union-result'],
      dependsOn: ['verify-a'],
    },
  ],
}

function localBlankId(questionId: string, fullBlankId: string) {
  const prefix = `${questionId}-`
  return fullBlankId.startsWith(prefix) ? fullBlankId.slice(prefix.length) : fullBlankId
}

export function mathPracticeTargetForBlank(questionId: string, fullBlankId: string | null | undefined) {
  if (!fullBlankId) return targetsByQuestion[questionId]?.[0] ?? null
  const localId = localBlankId(questionId, fullBlankId)
  return targetsByQuestion[questionId]?.find((target) => target.blankIds.includes(localId)) ?? null
}

export function mathPracticeTargetsForQuestion(questionId: string) {
  return targetsByQuestion[questionId] ?? []
}


export function mathPracticeTargetById(questionId: string, targetId: string) {
  return targetsByQuestion[questionId]?.find((target) => target.id === targetId) ?? null
}

export function mathPracticeDependencyTargets(questionId: string, targetId: string) {
  const target = mathPracticeTargetById(questionId, targetId)
  if (!target?.dependsOn?.length) return []
  return target.dependsOn
    .map((dependencyId) => mathPracticeTargetById(questionId, dependencyId))
    .filter((dependency): dependency is MathPracticeTarget => Boolean(dependency))
}

export function mathPracticeResultItems(target: MathPracticeTarget) {
  if (target.results?.length) return target.results
  return target.result ? [target.result] : []
}

export function mathPracticeUsesSubproblemCompression(questionId: string) {
  return [
    'math-practice-087',
    'math-practice-094',
    'math-practice-097',
  ].includes(questionId)
}
