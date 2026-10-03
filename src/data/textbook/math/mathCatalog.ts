export type MathTextbookTopicCatalogEntry = {
  id: string
  label: { ja: string; zh: string }
  flow: { ja: string; zh: string }
  practiceTopicId: string
  practiceRange: readonly [number, number]
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
      ja: '真偽 → 条件の否定 → 必要条件・十分条件 → 「すべて」と「ある」 → 関数の条件',
      zh: '真假 → 条件的否定 → 必要条件・充分条件 → “所有”与“存在” → 函数条件',
    },
    practiceTopicId: 'read-propositions',
    practiceRange: [98, 120],
    unitIds: ['math-propositions-reading', 'math-quantifiers-all-exists'],
    learnerHeadings: [],
  },
  {
    id: 'prove-propositions',
    label: { ja: '命題を証明する', zh: '证明命题' },
    flow: {
      ja: '同値 → 逆・裏・対偶 → 対偶による証明 → 無理数 → 背理法',
      zh: '等价 → 逆命题・否命题・逆否命题 → 逆否证明 → 无理数 → 反证法',
    },
    practiceTopicId: 'prove-propositions',
    practiceRange: [108, 117],
    unitIds: [],
    learnerHeadings: [],
  },
] as const

export function mathTextbookTopicForUnit(unitId: string) {
  return mathTextbookTopics.find((topic) => topic.unitIds.includes(unitId))
}
