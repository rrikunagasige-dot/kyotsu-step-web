import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './set/setLesson'
import { mathTextbookTopicForUnit, mathTextbookTopics } from './mathCatalog'

describe('math textbook catalog', () => {
  it('aligns the set lesson with the same practice curriculum topic and range', () => {
    const topic = mathTextbookTopicForUnit(mathSetUnit.unitId)
    expect(topic?.id).toBe('organize-sets')
    expect(topic?.practiceTopicId).toBe('organize-sets')
    expect(topic?.practiceRange).toEqual([87, 97])
    expect(topic?.flow.ja).toBe('集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件')
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
