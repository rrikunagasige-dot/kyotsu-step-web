import { describe, expect, it } from 'vitest'
import { chapter1PracticeQuestions, chapter1PracticeQuestionsZh } from './textbookPracticeQuestions'

describe('Chapter 1 continuous-textbook practice adapter', () => {
  it('does not synthesize legacy worked-example questions from continuous lessons', () => {
    expect(chapter1PracticeQuestions).toEqual([])
    expect(chapter1PracticeQuestionsZh).toEqual([])
  })

  it('keeps Japanese and Chinese adapter outputs aligned', () => {
    expect(chapter1PracticeQuestionsZh).toEqual(chapter1PracticeQuestions)
  })
})
