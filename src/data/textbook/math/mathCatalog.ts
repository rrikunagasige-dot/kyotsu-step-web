export type MathTextbookTopicCatalogEntry = {
  id: string
  label: { ja: string; zh: string }
  flow: { ja: string; zh: string }
  practiceTopicId: string
  practiceRange: readonly [number, number]
  practiceQuestionNumbers: readonly number[]
  unitIds: readonly string[]
  learnerHeadings: readonly string[]
}

/**
 * 学習モードと練習モードを同じカリキュラム上で接続するための契約。
 *
 * ここでは練習モード実装を import しない。
 * 別チャットの practice 作業と runtime dependency を作らず、
 * setup 統合時に最新 practice taxonomy と照合する。
 */
export const mathTextbookTopics: readonly MathTextbookTopicCatalogEntry[] = [
  {
    id: 'organize-sets',
    label: { ja: '集合を整理する', zh: '整理集合' },
    flow: {
      ja: '集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件',
      zh: '集合的表示 → 子集 → 交集・并集 → 补集 → 集合条件',
    },
    practiceTopicId: 'organize-sets',
    practiceRange: [87, 97],
    practiceQuestionNumbers: [87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
    unitIds: ['math-sets'],
    learnerHeadings: [
      '集合を表す',
      '集合どうしの関係を見る',
      '集合の外側まで考える',
    ],
  },
  {
    id: 'read-propositions',
    label: { ja: '条件から命題を読む', zh: '从条件理解命题' },
    flow: {
      ja: '真偽 → 必要条件・十分条件 → 条件の否定 → 「すべて」と「ある」',
      zh: '真假 → 必要条件・充分条件 → 条件的否定 → “所有”与“存在”',
    },
    practiceTopicId: 'read-propositions',
    practiceRange: [98, 109],
    practiceQuestionNumbers: [98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109],
    unitIds: ['math-propositions-reading', 'math-quantifiers-all-exists'],
    learnerHeadings: [],
  },
  {
    id: 'prove-propositions',
    label: { ja: '命題を証明する', zh: '证明命题' },
    flow: {
      ja: '逆・裏・対偶 → 証明しやすい向き → 対偶による証明 → 矛盾を使う証明',
      zh: '逆命题・否命题・逆否命题 → 选择易证明的方向 → 逆否证明 → 用矛盾证明',
    },
    practiceTopicId: 'prove-propositions',
    practiceRange: [108, 117],
    practiceQuestionNumbers: [108, 110, 111, 112, 113, 114, 115, 116, 117],
    unitIds: ['math-propositions-proof'],
    learnerHeadings: [],
  },
] as const

export function mathTextbookTopicForUnit(unitId: string) {
  return mathTextbookTopics.find((topic) => topic.unitIds.includes(unitId))
}
