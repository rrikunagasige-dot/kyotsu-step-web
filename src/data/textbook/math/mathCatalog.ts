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
      ja: '集合の表し方 → 集合どうしの関係 → 補集合 → 集合の条件',
      zh: '集合的表示 → 集合之间的关系 → 补集 → 集合条件',
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
] as const

export function mathTextbookTopicForUnit(unitId: string) {
  return mathTextbookTopics.find((topic) => topic.unitIds.includes(unitId))
}
