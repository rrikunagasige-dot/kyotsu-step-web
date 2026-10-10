import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './set/setLesson'
import { mathTextbookNextUnitId, mathTextbookTopicForUnit, mathTextbookTopicHasAllUnits, mathTextbookTopics } from './mathCatalog'
import { mathTextbookUnits } from './index'

describe('math textbook catalog', () => {
  it('aligns the set lesson with the overlapping practice curriculum without driving learner structure', () => {
    const topic = mathTextbookTopicForUnit(mathSetUnit.unitId)
    expect(topic?.id).toBe('organize-sets')
    expect(topic?.practiceLinks).toEqual([
      {
        topicId: 'organize-sets',
        questionNumbers: [87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
      },
    ])
    expect(topic?.flow.ja).toBe('集合の表し方 → 共通部分・和集合 → 部分集合 → 補集合 → 集合の条件')
  })


  it('keeps the three learning topics synchronized only where textbook content overlaps practice', () => {
    expect(mathTextbookTopics.map((topic) => topic.id)).toEqual([
      'organize-sets',
      'read-propositions',
      'prove-propositions',
    ])
    expect(mathTextbookTopics[0].unitIds).toEqual(['math-sets'])
    expect(mathTextbookTopics[1].unitIds).toEqual(['math-propositions-reading', 'math-quantifiers-all-exists'])
    expect(mathTextbookTopics[2].unitIds).toEqual(['math-propositions-proof'])
  })


  it('requires every configured unit before a multi-unit learner topic can open', () => {
    expect(mathTextbookTopicHasAllUnits('organize-sets', ['math-sets'])).toBe(true)
    expect(mathTextbookTopicHasAllUnits('read-propositions', ['math-propositions-reading'])).toBe(false)
    expect(
      mathTextbookTopicHasAllUnits('read-propositions', [
        'math-propositions-reading',
        'math-quantifiers-all-exists',
      ]),
    ).toBe(true)
  })

  it('keeps continuation inside a multi-unit learner topic', () => {
    expect(mathTextbookNextUnitId('math-propositions-reading')).toBe('math-quantifiers-all-exists')
    expect(mathTextbookNextUnitId('math-quantifiers-all-exists')).toBeUndefined()
    expect(mathTextbookNextUnitId('math-propositions-proof')).toBeUndefined()
  })

  it('keeps practice synchronization metadata internal without forcing practice taxonomy onto learner topics', () => {
    expect(mathTextbookTopics[1].practiceLinks).toEqual([
      {
        topicId: 'read-propositions',
        questionNumbers: [98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109],
      },
    ])
    expect(mathTextbookTopics[2].practiceLinks).toEqual([
      {
        topicId: 'prove-propositions',
        questionNumbers: [108, 110, 111, 112, 113, 114, 115, 116, 117],
      },
    ])

    const all = mathTextbookTopics.flatMap((topic) =>
      topic.practiceLinks.flatMap((link) => link.questionNumbers),
    )
    expect(new Set(all).size).toBe(all.length)
    expect([...all].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 31 }, (_, index) => 87 + index),
    )
    expect(all).not.toContain(118)
    expect(all).not.toContain(119)
    expect(all).not.toContain(120)
    expect(mathTextbookTopicForUnit('math-functions-conditions')).toBeUndefined()
  })





  it('keeps chapter 3 units in textbook page order', () => {
    const chapter3 = mathTextbookUnits
      .filter((unit) => unit.chapter?.chapterNumber === '3')
      .map((unit) => [unit.unitId, unit.chapter?.orderInChapter])

    expect(chapter3).toEqual([
      ['math-sets', 1],
      ['math-propositions-reading', 2],
      ['math-propositions-proof', 3],
      ['math-quantifiers-all-exists', 4],
    ])
  })

  it('keeps current learner topics inside chapter 3 and leaves the function review in chapter 2', () => {
    const chapter3UnitIds = mathTextbookTopics.flatMap((topic) => topic.unitIds)
    for (const unitId of chapter3UnitIds) {
      expect(
        mathTextbookUnits.find((unit) => unit.unitId === unitId)?.chapter?.chapterNumber,
        unitId,
      ).toBe('3')
    }

    const functionUnit = mathTextbookUnits.find((unit) => unit.unitId === 'math-functions-conditions')
    expect(functionUnit?.chapter?.chapterNumber).toBe('2')
    expect(mathTextbookTopicForUnit('math-functions-conditions')).toBeUndefined()
  })

  it('keeps learner-facing topic flows aligned with the approved source-backed curriculum', () => {
    expect(mathTextbookTopics[1].flow.ja).toBe(
      '真偽 → 必要条件・十分条件 → 条件の否定 → 「すべて」と「ある」',
    )
    expect(mathTextbookTopics[2].flow.ja).toBe(
      '逆・裏・対偶 → 証明しやすい向き → 対偶による証明 → 矛盾を使う証明',
    )
  })

  it('keeps only the approved set lesson published while the later lessons remain review-only', () => {
    expect(
      mathTextbookUnits.filter((unit) => unit.status === 'published').map((unit) => unit.unitId),
    ).toEqual(['math-sets'])

    expect(
      mathTextbookUnits.filter((unit) => unit.status === 'review').map((unit) => unit.unitId),
    ).toEqual([
      'math-propositions-reading',
      'math-propositions-proof',
      'math-quantifiers-all-exists',
      'math-functions-conditions',
    ])
  })

  it('keeps the approved three learner-facing headings in order', () => {
    const topic = mathTextbookTopics[0]
    expect(topic.learnerHeadings).toEqual([
      '第1部　集合を表す',
      '第2部　集合どうしの関係を見る',
      '第3部　集合の外側まで考える',
    ])

    const headings = mathSetUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)

    expect(headings).toEqual(topic.learnerHeadings)
  })
})
