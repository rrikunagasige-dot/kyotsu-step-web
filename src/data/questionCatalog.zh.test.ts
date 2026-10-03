import { describe, expect, it } from 'vitest'
import { builtInQuestions } from './questions'
import { builtInQuestionsZh } from './questions.zh'
import { getQuestionCatalog } from '../stores/useAppStore'

function gradingSignature(question: (typeof builtInQuestions)[number]) {
  return {
    questionId: question.questionId,
    revision: question.revision,
    subject: question.subject,
    status: question.status,
    taxonomy: question.taxonomy,
    difficulty: question.difficulty,
    assets: question.assets.map(({ id, type, src }) => ({ id, type, src })),
    presentation: question.learning.presentation,
    flowType: question.learning.flowType,
    finalBlankId: question.learning.finalBlankId,
    variants: question.learning.variants,
    blanks: Object.values(question.learning.blanks).map((blank) => ({
      id: blank.id,
      answerType: blank.answerType,
      optionIds: blank.options.map((option) => option.id),
      correctOptionIds: blank.correctOptionIds,
      knowledgeTags: blank.knowledgeTags,
      skillTag: blank.skillTag,
      shortPracticeQuestionId: blank.shortPracticeQuestionId,
    })),
    simulationItems: question.simulation.items.map((item) => ({
      id: item.id,
      answerType: item.answerType,
      optionIds: item.options?.map((option) => option.id),
      correctOptionIds: item.correctOptionIds,
      correctValue: item.correctValue,
      tolerance: item.tolerance,
      score: item.score,
      estimatedSeconds: item.estimatedSeconds,
      knowledgeTags: item.knowledgeTags,
      skillTags: item.skillTags,
    })),
    relatedQuestions: question.relatedQuestions,
  }
}

describe('independently authored Chinese question catalog', () => {
  it('matches every Japanese question and preserves all grading logic', () => {
    expect(builtInQuestionsZh.map(gradingSignature)).toEqual(builtInQuestions.map(gradingSignature))
  })

  it('contains complete Chinese content instead of Japanese text fallbacks', () => {
    const serialized = JSON.stringify(builtInQuestionsZh)
    const kana = [...new Set(serialized.match(/[ぁ-んァ-ン]/g) ?? [])]
    expect(kana).toEqual([])
    expect(builtInQuestionsZh.map((question) => question.title)).toEqual([
      '通过对话理解二次函数最大值',
      '通过对话读取频数分布表与平均数',
      '计算推导型｜速度–时间图像',
      '现象分析型｜串联与并联电路候选比较',
      '关系式分析型｜负电荷与磁场',
      '87｜素数与集合',
      '88｜集合的表示',
      '89｜子集',
      '90｜集合的包含关系',
      '91｜列出所有子集',
      '92｜交集与并集',
      '93｜三个集合',
      '94｜补集',
      '95｜由区域信息还原集合',
      '96｜三个集合的复合运算',
      '97｜由交集确定常数',
      '98｜命题与真假',
      '99｜蕴含命题的真假',
      '100｜反例',
      '101｜条件的否定',
      '102｜“且”与“或”',
      '103｜复合条件的否定',
      '104｜必要条件与充分条件',
      '105｜命题的真假',
      '106｜用集合表示条件',
      '107｜判断必要与充分条件',
      '108｜证明等价',
      '109｜“所有”与“存在”的否定',
      '110｜逆命题、逆否命题与否命题',
    ])  })

  it('selects the requested language without changing stable question IDs', () => {
    const japanese = getQuestionCatalog([], 'ja')
    const chinese = getQuestionCatalog([], 'zh')
    expect(chinese[0].title).toBe('通过对话理解二次函数最大值')
    expect(japanese[0].title).toBe('会話で考える二次関数の最大値')
    expect(chinese.map((question) => question.questionId)).toEqual(japanese.map((question) => question.questionId))
  })
})
