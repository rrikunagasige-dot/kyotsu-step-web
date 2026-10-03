import { describe, expect, it } from 'vitest'
import {
  buildMathPracticeTopicSummary,
  mathPracticeProblemNumber,
  mathPracticeTaxonomy,
  mathPracticeTopicForQuestion,
} from './mathPracticeTaxonomy'
import { mathPracticePilotQuestions } from './mathPractice/adapter'

describe('math practice title architecture', () => {
  it('keeps four learner-facing themes across two Math I groups', () => {
    expect(mathPracticeTaxonomy.map((domain) => domain.label.ja)).toEqual([
      '数学 I｜集合と命題',
      '数学 I｜関数',
    ])
    expect(mathPracticeTaxonomy.flatMap((domain) => domain.topics.map((topic) => topic.label.ja))).toEqual([
      '集合を整理する',
      '条件から命題を読む',
      '命題を証明する',
      '関数を表す',
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
    expect(mathPracticeTopicForQuestion(sample(109))).toBe('read-propositions')
    expect(mathPracticeTopicForQuestion(sample(110))).toBe('prove-propositions')
    expect(mathPracticeTopicForQuestion(sample(117))).toBe('prove-propositions')
    expect(mathPracticeTopicForQuestion(sample(118))).toBe('represent-functions')
    expect(mathPracticeTopicForQuestion(sample(120))).toBe('represent-functions')
  })

  it('keeps current pilots together under 集合を整理する', () => {
    const summary = buildMathPracticeTopicSummary(mathPracticePilotQuestions)
    expect(summary.counts['organize-sets']).toBe(3)
    expect(summary.counts['read-propositions']).toBe(0)
    expect(summary.counts['prove-propositions']).toBe(0)
    expect(summary.counts['represent-functions']).toBe(0)
    expect(summary.unclassified).toBe(0)
  })

  it('uses problem numbers as the compact leaf labels', () => {
    expect(mathPracticePilotQuestions.map((question) => mathPracticeProblemNumber(question.questionId))).toEqual([
      87,
      94,
      97,
    ])
  })
})
