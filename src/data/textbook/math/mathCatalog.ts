export type MathTextbookPracticeLink = {
  topicId: string
  questionNumbers: readonly number[]
}

export type MathTextbookTopicCatalogEntry = {
  id: string
  chapterId: string
  label: { ja: string; zh: string }
  flow: { ja: string; zh: string }
  practiceLinks: readonly MathTextbookPracticeLink[]
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
    id: 'numbers-polynomials',
    chapterId: 'math-ch01-numbers-expressions',
    label: { ja: '式を整える', zh: '整理代数式' },
    flow: { ja: '同類項 → 整理と加減 → 指数法則と展開', zh: '合并同类项 → 整理与加减 → 指数规律与展开' },
    practiceLinks: [],
    unitIds: ['math-numbers-expressions-n01', 'math-numbers-expressions-n02', 'math-numbers-expressions-n03'],
    learnerHeadings: [],
  },
  {
    id: 'numbers-real',
    chapterId: 'math-ch01-numbers-expressions',
    label: { ja: '実数を扱う', zh: '认识实数' },
    flow: { ja: '平方根と符号 → 数直線 → 根号の計算と有理化', zh: '平方根与符号 → 数轴 → 根式计算与有理化' },
    practiceLinks: [],
    unitIds: ['math-numbers-expressions-n09', 'math-numbers-expressions-n10'],
    learnerHeadings: [],
  },
  {
    id: 'numbers-inequalities',
    chapterId: 'math-ch01-numbers-expressions',
    label: { ja: '不等式を使う', zh: '运用不等式' },
    flow: { ja: '範囲の共通部分 → 連立不等式 → 整数条件', zh: '范围交集 → 不等式组 → 整数条件' },
    practiceLinks: [],
    unitIds: ['math-numbers-expressions-n12'],
    learnerHeadings: [],
  },
  {
    id: 'organize-sets',
    chapterId: 'math-ch03-sets-propositions',
    label: { ja: '集合を整理する', zh: '整理集合' },
    flow: {
      ja: '集合の表し方 → 共通部分・和集合 → 部分集合 → 補集合 → 集合の条件',
      zh: '集合的表示 → 交集・并集 → 子集 → 补集 → 集合条件',
    },
    practiceLinks: [
      {
        topicId: 'organize-sets',
        questionNumbers: [87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
      },
    ],
    unitIds: ['math-sets'],
    learnerHeadings: [
      '第1部　集合を表す',
      '第2部　集合どうしの関係を見る',
      '第3部　集合の外側まで考える',
    ],
  },
  {
    id: 'read-propositions',
    chapterId: 'math-ch03-sets-propositions',
    label: { ja: '条件から命題を読む', zh: '从条件理解命题' },
    flow: {
      ja: '真偽 → 必要条件・十分条件 → 条件の否定 → 「すべて」と「ある」',
      zh: '真假 → 必要条件・充分条件 → 条件的否定 → “所有”与“存在”',
    },
    practiceLinks: [
      {
        topicId: 'read-propositions',
        questionNumbers: [98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109],
      },
    ],
    unitIds: ['math-propositions-reading', 'math-quantifiers-all-exists'],
    learnerHeadings: [],
  },
  {
    id: 'prove-propositions',
    chapterId: 'math-ch03-sets-propositions',
    label: { ja: '命題を証明する', zh: '证明命题' },
    flow: {
      ja: '逆・裏・対偶 → 証明しやすい向き → 対偶による証明 → 矛盾を使う証明',
      zh: '逆命题・否命题・逆否命题 → 选择易证明的方向 → 逆否证明 → 用矛盾证明',
    },
    practiceLinks: [
      {
        topicId: 'prove-propositions',
        questionNumbers: [108, 110, 111, 112, 113, 114, 115, 116, 117],
      },
    ],
    unitIds: ['math-propositions-proof'],
    learnerHeadings: [],
  },
] as const

// The chapter-1 units are deliberately learner-visible as review previews.
export const mathNumbersReviewUnitIds = mathTextbookTopics
  .filter((topic) => topic.chapterId === 'math-ch01-numbers-expressions')
  .flatMap((topic) => topic.unitIds)

export function mathTextbookTopicForUnit(unitId: string) {
  return mathTextbookTopics.find((topic) => topic.unitIds.includes(unitId))
}


export function mathTextbookTopicHasAllUnits(topicId: string, availableUnitIds: readonly string[]) {
  const topic = mathTextbookTopics.find((candidate) => candidate.id === topicId)
  if (!topic) return false
  const available = new Set(availableUnitIds)
  return topic.unitIds.every((unitId) => available.has(unitId))
}

export function mathTextbookNextUnitId(unitId: string) {
  const topic = mathTextbookTopicForUnit(unitId)
  if (!topic) return undefined
  const index = topic.unitIds.indexOf(unitId)
  if (index < 0 || index >= topic.unitIds.length - 1) return undefined
  return topic.unitIds[index + 1]
}
