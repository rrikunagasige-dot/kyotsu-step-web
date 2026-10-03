import { describe, expect, it } from 'vitest'
import { builtInQuestions } from './questions'

describe('built-in content coverage', () => {
  it('contains the existing catalog plus reviewed Math 87-111 practice', () => {
    expect(builtInQuestions.filter((question) => question.subject === 'math-1a')).toHaveLength(27)
    expect(builtInQuestions.filter((question) => question.subject === 'physics')).toHaveLength(3)
    expect(
      builtInQuestions
        .filter((question) => question.questionId.startsWith('math-practice-'))
        .map((question) => question.questionId),
    ).toEqual(Array.from({ length: 25 }, (_, index) => `math-practice-${String(87 + index).padStart(3, '0')}`))
  })

  it('covers common-test narrative, standard practice, images, tables and all three physics flow types', () => {
    const commonTestQuestions = builtInQuestions.filter((question) => question.learning.presentation === 'common-test')
    const standardQuestions = builtInQuestions.filter((question) => question.learning.presentation === 'standard')
    expect(commonTestQuestions.length).toBeGreaterThan(0)
    expect(standardQuestions.map((question) => question.questionId)).toEqual(
      Array.from({ length: 25 }, (_, index) => `math-practice-${String(87 + index).padStart(3, '0')}`),
    )
    expect(builtInQuestions.some((question) => question.assets.length > 0)).toBe(true)
    expect(builtInQuestions.some((question) => question.stem.some((block) => block.type === 'table'))).toBe(true)
    expect(builtInQuestions.some((question) => question.learning.solutionFlow.some((block) => block.type === 'content' && block.content.some((content) => content.type === 'text' && Boolean(content.speaker))))).toBe(true)

    const physicsTypes = new Set(
      builtInQuestions
        .filter((question) => question.subject === 'physics')
        .map((question) => question.learning.flowType),
    )
    expect(physicsTypes).toEqual(new Set(['phenomenon-analysis', 'calculation-derivation', 'relation-analysis']))
  })

  it('keeps Common-Test final choices separate while allowing standard guided practice', () => {
    for (const question of builtInQuestions) {
      const finalBlankId = question.learning.finalBlankId

      if (question.learning.presentation === 'common-test') {
        expect(finalBlankId).toBeTruthy()
        expect(question.learning.solutionFlow.some((block) => block.type === 'blank' && block.blankId === finalBlankId)).toBe(false)
        expect(Object.values(question.learning.variants).every((ids) => finalBlankId ? ids.includes(finalBlankId) : false)).toBe(true)
        continue
      }

      expect(finalBlankId).toBeUndefined()
      const flowBlankIds = question.learning.solutionFlow
        .filter((block) => block.type === 'blank')
        .map((block) => block.blankId)
      expect(new Set(flowBlankIds)).toEqual(new Set(Object.keys(question.learning.blanks)))
    }
  })

  it('uses stable option ids independent from array positions', () => {
    for (const question of builtInQuestions) {
      for (const blank of Object.values(question.learning.blanks)) {
        expect(blank.correctOptionIds.every((id) => blank.options.some((option) => option.id === id))).toBe(true)
      }
    }
  })
})
