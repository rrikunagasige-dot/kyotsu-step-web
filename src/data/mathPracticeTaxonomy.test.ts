import { describe, expect, it } from 'vitest'
import type { Question } from '../domain/questionSchema'
import {
  buildMathCommonTestSummary,
  buildMathPracticeTopicSummary,
  mathCommonTestAreaForQuestion,
  mathPracticeProblemNumber,
  mathPracticeQuestionsForTopic,
  mathPracticeTaxonomy,
  mathPracticeTopicForQuestion,
} from './mathPracticeTaxonomy'
import { mathPracticePilotQuestions } from './mathPractice/adapter'

describe('math practice title architecture', () => {
  it('keeps exactly the three approved learner-facing Math practice themes', () => {
    expect(mathPracticeTaxonomy.map((domain) => domain.label.ja)).toEqual([
      '集合と命題',
    ])
    expect(mathPracticeTaxonomy.flatMap((domain) => domain.topics.map((topic) => topic.label.ja))).toEqual([
      '集合を整理する',
      '条件から命題を読む',
      '命題を証明する',
    ])
  })

  it('maps the reviewed problem-number ranges to those themes', () => {
    const sample = (problemNo: number) => ({
      subject: 'math-1a' as const,
      questionId: `math-practice-${String(problemNo).padStart(3, '0')}`,
    })

    expect(mathPracticeTopicForQuestion(sample(87))).toBe('organize-sets')
    expect(mathPracticeTopicForQuestion(sample(97))).toBe('organize-sets')
    expect(mathPracticeTopicForQuestion(sample(98))).toBe('read-propositions')
    expect(mathPracticeTopicForQuestion(sample(107))).toBe('read-propositions')
    expect(mathPracticeTopicForQuestion(sample(108))).toBe('prove-propositions')
    expect(mathPracticeTopicForQuestion(sample(109))).toBe('read-propositions')
    expect(mathPracticeTopicForQuestion(sample(110))).toBe('prove-propositions')
    expect(mathPracticeTopicForQuestion(sample(117))).toBe('prove-propositions')
    expect(mathPracticeTopicForQuestion(sample(118))).toBe('read-propositions')
    expect(mathPracticeTopicForQuestion(sample(120))).toBe('read-propositions')
  })

  it('keeps the reviewed set batch under 集合を整理する and grows the proposition theme through 100', () => {
    const summary = buildMathPracticeTopicSummary(mathPracticePilotQuestions)
    expect(summary.counts['organize-sets']).toBe(11)
    expect(summary.counts['read-propositions']).toBe(3)
    expect(summary.counts['prove-propositions']).toBe(0)
    expect(summary.unclassified).toBe(0)
  })

  it('keeps proposition pilots in source order starting from 98', () => {
    const ordered = mathPracticeQuestionsForTopic(mathPracticePilotQuestions, 'read-propositions')
    expect(ordered.map((question) => mathPracticeProblemNumber(question.questionId))).toEqual([98, 99, 100])
  })

  it('separates the old Common-Test math samples from 4STEP practice', () => {
    const commonTestSamples = [
      {
        subject: 'math-1a' as const,
        questionId: 'math-quadratic-01',
        status: 'published' as const,
        taxonomy: { majorUnit: 'functions' },
      },
      {
        subject: 'math-1a' as const,
        questionId: 'math-statistics-01',
        status: 'published' as const,
        taxonomy: { majorUnit: 'data-analysis' },
      },
    ] as unknown as Question[]

    expect(mathCommonTestAreaForQuestion(commonTestSamples[0])).toBe('quadratic')
    expect(mathCommonTestAreaForQuestion(commonTestSamples[1])).toBe('data-analysis')
    expect(buildMathCommonTestSummary(commonTestSamples).quadratic).toBe(1)
    expect(buildMathCommonTestSummary(commonTestSamples)['data-analysis']).toBe(1)
  })

  it('keeps theme questions in source problem-number order for 1,2,3… navigation', () => {
    const ordered = mathPracticeQuestionsForTopic(mathPracticePilotQuestions, 'organize-sets')
    expect(ordered.map((question) => mathPracticeProblemNumber(question.questionId))).toEqual(
      Array.from({ length: 11 }, (_, index) => 87 + index),
    )
  })
})
