export type MathPracticeTarget = {
  id: string
  kicker: { ja: string; zh: string }
  label?: { ja: string; zh: string }
  latex?: string
  blankIds: readonly string[]
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
      latex: '2\;\square\;A',
      blankIds: ['two-divisors', 'two-membership'],
    },
    {
      id: 'fifteen',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '15\;\square\;A',
      blankIds: ['fifteen-factor', 'fifteen-membership'],
    },
    {
      id: 'twentyone',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '21\;\square\;A',
      blankIds: ['twentyone-factor', 'twentyone-membership'],
    },
    {
      id: 'twentynine',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '29\;\square\;A',
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
      latex: '\overline{A}',
      blankIds: ['a-complement'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: '\overline{B}',
      blankIds: ['b-complement'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      latex: '\overline{A}\cap B',
      blankIds: ['abar-intersection-b-meaning', 'abar-intersection-b'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      latex: 'A\cup\overline{B}',
      blankIds: ['a-union-bbar'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      latex: '\overline{A}\cap\overline{B}',
      blankIds: ['abar-intersection-bbar'],
    },
    {
      id: 's6',
      kicker: { ja: '今の問い｜(6)', zh: '当前问题｜(6)' },
      latex: '\overline{A}\cup\overline{B}',
      blankIds: ['abar-union-bbar'],
    },
    {
      id: 's7',
      kicker: { ja: '今の問い｜(7)', zh: '当前问题｜(7)' },
      latex: '\overline{A\cap B}',
      blankIds: ['a-intersection-b', 'complement-a-intersection-b'],
    },
    {
      id: 's8',
      kicker: { ja: '今の問い｜(8)', zh: '当前问题｜(8)' },
      latex: '\overline{A\cup B}',
      blankIds: ['a-union-b', 'complement-a-union-b'],
    },
  ],
  'math-practice-097': [
    {
      id: 'solve-a',
      kicker: { ja: 'まずの目標', zh: '第一目标' },
      label: { ja: '共通部分の条件から a を求める', zh: '由交集条件求 a' },
      blankIds: ['four-membership', 'variable-element', 'equation-for-four', 'solve-a'],
    },
    {
      id: 'verify-a',
      kicker: { ja: '次の目標', zh: '下一目标' },
      label: { ja: '求めた a が条件を本当に満たすか確かめる', zh: '确认求得的 a 是否真的满足条件' },
      blankIds: ['a-set', 'b-set', 'intersection-check'],
    },
    {
      id: 'union',
      kicker: { ja: '最後の目標', zh: '最后目标' },
      latex: 'A\cup B',
      blankIds: ['union-result'],
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
