import { describe, expect, it } from 'vitest'
import { mathPractice87To120Catalog, mathPracticePilotCatalog } from './catalog'
import { mathPracticePilotSource } from './pilot'
import { mathPracticeSetsBatchASource } from './setsBatchA'
import { mathPracticePilotQuestions, mathPracticePilotQuestionsZh } from './adapter'

describe('math practice 87-120 staged integration', () => {
  it('keeps the complete 87-120 title catalog without publishing everything at once', () => {
    expect(mathPractice87To120Catalog).toHaveLength(34)
    expect(mathPractice87To120Catalog[0]?.problemNo).toBe(87)
    expect(mathPractice87To120Catalog.at(-1)?.problemNo).toBe(120)
    expect(mathPracticePilotCatalog.map((entry) => entry.problemNo)).toEqual([87,88,89,90,91,92,93,94,95,96,97])
  })

  it('publishes the reviewed set batch 87-97', () => {
    expect(mathPracticePilotSource.map((question) => question.problemNo)).toEqual([87, 94, 97])
    expect(mathPracticePilotQuestions.map((question) => question.questionId)).toEqual(
      Array.from({ length: 11 }, (_, index) => `math-practice-${String(87 + index).padStart(3, '0')}`),
    )
  })

  it('preserves short numbered titles in source order', () => {
    expect(mathPracticePilotQuestions.map((question) => question.title)).toEqual([
      '87｜素数と集合',
      '88｜集合の表し方',
      '89｜部分集合',
      '90｜集合の包含関係',
      '91｜部分集合をすべて求める',
      '92｜共通部分と和集合',
      '93｜3つの集合',
      '94｜補集合',
      '95｜集合を復元する',
      '96｜3集合の複合演算',
      '97｜共通部分から定数を決める',
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

  it('preserves TeX escapes in Math 88 source strings before adaptation', () => {
    const question = mathPracticeSetsBatchASource.find((item) => item.problemNo === 88)
    expect(question).toBeDefined()

    const latex = [
      ...(question?.problem.filter((block) => block.type === 'latex').map((block) => block.latex) ?? []),
      ...(question?.guide.flatMap((node) =>
        node.type === 'content'
          ? node.blocks.filter((block) => block.type === 'latex').map((block) => block.latex)
          : [],
      ) ?? []),
    ]

    const joined = latex.join('\n')
    expect(joined).toContain('\\text')
    expect(joined).toContain('\\times')
    expect(joined).toContain('\\ldots')
    expect(joined).not.toContain('\t')
  })

  it('uses the original problem again for simulation instead of inventing a second exercise', () => {
    for (const question of mathPracticePilotQuestions) {
      expect(question.simulation.material.length).toBeGreaterThan(1)
      expect(question.simulation.items.length).toBeGreaterThan(0)
    }
  })
})
