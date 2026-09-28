import { describe, expect, it } from 'vitest'
import { chapter1PracticeQuestions, chapter1PracticeQuestionsZh } from './textbookPracticeQuestions'

describe('Chapter 1 textbook-to-question-bank adapter', () => {
  it('imports exactly two worked examples from each of the seven units', () => {
    expect(chapter1PracticeQuestions).toHaveLength(14)
    expect(chapter1PracticeQuestions.map((question) => question.questionId)).toEqual([
      'physics-ch01-1a-example-q1',
      'physics-ch01-1a-example-q2',
      'physics-ch01-1b-example-q1',
      'physics-ch01-1b-example-q2',
      'physics-ch01-1c-example-q1',
      'physics-ch01-1c-example-q2',
      'physics-ch01-1d-example-q1',
      'physics-ch01-1d-example-q2',
      'physics-ch01-1e-example-q1',
      'physics-ch01-1e-example-q2',
      'physics-ch01-1f-example-q1',
      'physics-ch01-1f-example-q2',
      'physics-ch01-1g-example-q1',
      'physics-ch01-1g-example-q2',
    ])
  })

  it('classifies every imported example under mechanics / motion', () => {
    expect(chapter1PracticeQuestions.every((question) =>
      question.taxonomy.majorUnit === 'mechanics' &&
      question.taxonomy.minorUnit === 'motion' &&
      question.status === 'published',
    )).toBe(true)
  })

  it('keeps stable grading identities across Japanese and Chinese imports', () => {
    expect(chapter1PracticeQuestionsZh.map((question) => question.questionId))
      .toEqual(chapter1PracticeQuestions.map((question) => question.questionId))

    for (let index = 0; index < chapter1PracticeQuestions.length; index += 1) {
      const ja = chapter1PracticeQuestions[index]
      const zh = chapter1PracticeQuestionsZh[index]
      expect(Object.keys(zh.learning.blanks)).toEqual(Object.keys(ja.learning.blanks))
      expect(zh.learning.finalBlankId).toBe(ja.learning.finalBlankId)
      expect(zh.simulation.items[0].correctOptionIds).toEqual(ja.simulation.items[0].correctOptionIds)
    }
  })

  it('does not leak Japanese kana into the Chinese imported catalog', () => {
    expect(JSON.stringify(chapter1PracticeQuestionsZh)).not.toMatch(/[ぁ-んァ-ン]/)
  })
})
