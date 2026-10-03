import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './set/setLesson'
import { mathTextbookTopicForUnit, mathTextbookTopics } from './mathCatalog'

describe('math textbook catalog', () => {
  it('aligns the set lesson with the same practice curriculum topic and range', () => {
    const topic = mathTextbookTopicForUnit(mathSetUnit.unitId)
    expect(topic?.id).toBe('organize-sets')
    expect(topic?.practiceTopicId).toBe('organize-sets')
    expect(topic?.practiceRange).toEqual([87, 97])
  })

  it('keeps the approved three learner-facing headings in order', () => {
    const topic = mathTextbookTopics[0]
    expect(topic.learnerHeadings).toEqual([
      '集合を表す',
      '集合どうしの関係を見る',
      '集合の外側まで考える',
    ])

    const headings = mathSetUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)

    expect(headings).toEqual(topic.learnerHeadings)
  })
})
