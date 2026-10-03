import { describe, expect, it } from 'vitest'
import { mathPractice87To120Catalog, mathPracticePilotCatalog } from './catalog'
import { mathPracticePilotSource } from './pilot'
import { mathPracticePilotQuestions, mathPracticePilotQuestionsZh } from './adapter'

describe('math practice 87-120 staged integration', () => {
  it('keeps the complete 87-120 title catalog without publishing everything at once', () => {
    expect(mathPractice87To120Catalog).toHaveLength(34)
    expect(mathPractice87To120Catalog[0]?.problemNo).toBe(87)
    expect(mathPractice87To120Catalog.at(-1)?.problemNo).toBe(120)
    expect(mathPracticePilotCatalog.map((entry) => entry.problemNo)).toEqual([87, 94, 97])
  })

  it('publishes only the three pilot source questions', () => {
    expect(mathPracticePilotSource.map((question) => question.problemNo)).toEqual([87, 94, 97])
    expect(mathPracticePilotQuestions.map((question) => question.questionId)).toEqual([
      'math-practice-087',
      'math-practice-094',
      'math-practice-097',
    ])
  })

  it('preserves short numbered titles for the current mobile selector', () => {
    expect(mathPracticePilotQuestions.map((question) => question.title)).toEqual([
      '87｜素数と集合',
      '94｜補集合',
      '97｜共通部分から定数を決める',
    ])
    expect(mathPracticePilotQuestionsZh.map((question) => question.title)).toEqual([
      '87｜素数与集合',
      '94｜补集',
      '97｜由交集确定常数',
    ])
  })

  it('keeps Japanese and Chinese grading structures aligned', () => {
    const signature = (question: (typeof mathPracticePilotQuestions)[number]) => ({
      questionId: question.questionId,
      taxonomy: question.taxonomy,
      difficulty: question.difficulty,
      presentation: question.learning.presentation,
      variants: question.learning.variants,
      blanks: Object.values(question.learning.blanks).map((blank) => ({
        id: blank.id,
        answerType: blank.answerType,
        optionIds: blank.options.map((option) => option.id),
        correctOptionIds: blank.correctOptionIds,
        knowledgeTags: blank.knowledgeTags,
        skillTag: blank.skillTag,
      })),
      simulation: question.simulation.items.map((item) => ({
        id: item.id,
        answerType: item.answerType,
        optionIds: item.options?.map((option) => option.id),
        correctOptionIds: item.correctOptionIds,
        correctValue: item.correctValue,
        tolerance: item.tolerance,
        score: item.score,
      })),
    })

    expect(mathPracticePilotQuestionsZh.map(signature)).toEqual(mathPracticePilotQuestions.map(signature))
  })

  it('contains no Japanese kana in the Chinese pilot', () => {
    expect(JSON.stringify(mathPracticePilotQuestionsZh).match(/[ぁ-んァ-ン]/g)).toBeNull()
  })

  it('keeps every authored thinking blank referenced by the learning flow', () => {
    for (const question of mathPracticePilotQuestions) {
      const flowIds = question.learning.solutionFlow
        .filter((node) => node.type === 'blank')
        .map((node) => node.blankId)
      expect(new Set(flowIds)).toEqual(new Set(Object.keys(question.learning.blanks)))
    }
  })

  it('uses the original problem again for simulation instead of inventing a second exercise', () => {
    for (const question of mathPracticePilotQuestions) {
      expect(question.simulation.material.length).toBeGreaterThan(1)
      expect(question.simulation.items.length).toBeGreaterThan(0)
    }
  })
})
