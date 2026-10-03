import type { Question } from '../domain/questionSchema'
import type { AppLanguage } from '../i18n/types'

export type MathPracticeTopicId =
  | 'organize-sets'
  | 'read-propositions'
  | 'prove-propositions'

export type MathPracticeTopic = {
  id: MathPracticeTopicId
  label: { ja: string; zh: string }
  flow: { ja: string; zh: string }
  range: readonly [number, number]
}

export type MathPracticeDomain = {
  id: 'sets-and-propositions'
  label: { ja: string; zh: string }
  topics: readonly MathPracticeTopic[]
}

export type MathCommonTestAreaId = 'quadratic' | 'data-analysis'

export const mathCommonTestAreas = [
  {
    id: 'quadratic',
    label: { ja: '二次関数', zh: '二次函数' },
    flow: { ja: '式・グラフ → 最大・最小 → 条件を読む', zh: '式与图像 → 最大最小 → 读取条件' },
    majorUnit: 'functions',
  },
  {
    id: 'data-analysis',
    label: { ja: 'データの分析', zh: '数据分析' },
    flow: { ja: '資料を読む → 代表値 → 判断する', zh: '读取资料 → 代表值 → 作出判断' },
    majorUnit: 'data-analysis',
  },
] as const satisfies readonly {
  id: MathCommonTestAreaId
  label: { ja: string; zh: string }
  flow: { ja: string; zh: string }
  majorUnit: string
}[]

export const mathPracticeTaxonomy: readonly MathPracticeDomain[] = [
  {
    id: 'sets-and-propositions',
    label: { ja: '集合と命題', zh: '集合与命题' },
    topics: [
      {
        id: 'organize-sets',
        label: { ja: '集合を整理する', zh: '整理集合' },
        flow: {
          ja: '集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件',
          zh: '集合的表示 → 子集 → 交集・并集 → 补集 → 集合条件',
        },
        range: [87, 97],
      },
      {
        id: 'read-propositions',
        label: { ja: '条件から命題を読む', zh: '从条件理解命题' },
        flow: {
          ja: '真偽 → 条件の否定 → 必要条件・十分条件 → 「すべて」と「ある」 → 関数の条件',
          zh: '真假 → 条件的否定 → 必要条件・充分条件 → “所有”与“存在” → 函数条件',
        },
        range: [98, 120],
      },
      {
        id: 'prove-propositions',
        label: { ja: '命題を証明する', zh: '证明命题' },
        flow: {
          ja: '同値 → 逆・裏・対偶 → 対偶による証明 → 無理数 → 背理法',
          zh: '等价 → 逆命题・否命题・逆否命题 → 逆否证明 → 无理数 → 反证法',
        },
        range: [108, 117],
      },
    ],
  },
] as const

function problemNumber(questionId: string) {
  const match = /^math-practice-(\d{3})$/.exec(questionId)
  return match ? Number(match[1]) : null
}

export function mathPracticeTopicForQuestion(question: Pick<Question, 'subject' | 'questionId'>): MathPracticeTopicId | null {
  if (question.subject !== 'math-1a') return null
  const number = problemNumber(question.questionId)
  if (number === null) return null

  if (number >= 87 && number <= 97) return 'organize-sets'
  if (
    (number >= 98 && number <= 107) ||
    number === 109 ||
    (number >= 118 && number <= 120)
  ) return 'read-propositions'
  if (number === 108 || (number >= 110 && number <= 117)) return 'prove-propositions'
  return null
}

export function mathPracticeTopicLabel(topicId: MathPracticeTopicId, language: AppLanguage) {
  for (const domain of mathPracticeTaxonomy) {
    const topic = domain.topics.find((candidate) => candidate.id === topicId)
    if (topic) return topic.label[language]
  }
  return topicId
}

export function mathPracticeTopicFlow(topicId: MathPracticeTopicId, language: AppLanguage) {
  for (const domain of mathPracticeTaxonomy) {
    const topic = domain.topics.find((candidate) => candidate.id === topicId)
    if (topic) return topic.flow[language]
  }
  return ''
}

export function buildMathPracticeTopicSummary(questions: Question[]) {
  const counts = Object.fromEntries(
    mathPracticeTaxonomy.flatMap((domain) => domain.topics.map((topic) => [topic.id, 0])),
  ) as Record<MathPracticeTopicId, number>

  let unclassified = 0
  for (const question of questions) {
    if (question.subject !== 'math-1a' || question.status !== 'published') continue
    const topicId = mathPracticeTopicForQuestion(question)
    if (topicId) counts[topicId] += 1
    else unclassified += 1
  }
  return { counts, unclassified }
}

export function mathPracticeProblemNumber(questionId: string) {
  return problemNumber(questionId)
}

export function mathPracticeQuestionsForTopic(
  questions: Question[],
  topicId: MathPracticeTopicId,
) {
  return questions
    .filter((question) =>
      question.subject === 'math-1a' &&
      question.status === 'published' &&
      mathPracticeTopicForQuestion(question) === topicId,
    )
    .sort((left, right) =>
      (problemNumber(left.questionId) ?? Number.MAX_SAFE_INTEGER) -
      (problemNumber(right.questionId) ?? Number.MAX_SAFE_INTEGER),
    )
}


export function mathCommonTestAreaForQuestion(
  question: Pick<Question, 'subject' | 'questionId' | 'taxonomy'>,
): MathCommonTestAreaId | null {
  if (question.subject !== 'math-1a' || question.questionId.startsWith('math-practice-')) return null
  return mathCommonTestAreas.find((area) => area.majorUnit === question.taxonomy.majorUnit)?.id ?? null
}

export function buildMathCommonTestSummary(questions: Question[]) {
  const counts = Object.fromEntries(mathCommonTestAreas.map((area) => [area.id, 0])) as Record<MathCommonTestAreaId, number>
  for (const question of questions) {
    const area = mathCommonTestAreaForQuestion(question)
    if (area && question.status === 'published') counts[area] += 1
  }
  return counts
}
