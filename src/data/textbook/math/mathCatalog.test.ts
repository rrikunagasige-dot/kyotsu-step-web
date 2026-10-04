import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './set/setLesson'
import { mathTextbookTopicForUnit, mathTextbookTopics } from './mathCatalog'
import { mathTextbookUnits } from './index'

describe('math textbook catalog', () => {
  it('aligns the set lesson with the same practice curriculum topic and range', () => {
    const topic = mathTextbookTopicForUnit(mathSetUnit.unitId)
    expect(topic?.id).toBe('organize-sets')
    expect(topic?.practiceTopicId).toBe('organize-sets')
    expect(topic?.practiceRange).toEqual([87, 97])
    expect(topic?.flow.ja).toBe('集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件')
  })


  it('keeps the three learning topics synchronized only where textbook content overlaps practice', () => {
    expect(mathTextbookTopics.map((topic) => topic.id)).toEqual([
      'organize-sets',
      'read-propositions',
      'prove-propositions',
    ])
    expect(mathTextbookTopics.map((topic) => topic.practiceRange)).toEqual([
      [87, 97],
      [98, 109],
      [108, 117],
    ])
    expect(mathTextbookTopics[0].unitIds).toEqual(['math-sets'])
    expect(mathTextbookTopics[1].unitIds).toEqual(['math-propositions-reading', 'math-quantifiers-all-exists'])
    expect(mathTextbookTopics[2].unitIds).toEqual(['math-propositions-proof'])
  })


  it('keeps practice synchronization metadata internal without forcing unrelated later questions into learning mode', () => {
    expect(mathTextbookTopics[0].practiceQuestionNumbers).toEqual([
      87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
    ])
    expect(mathTextbookTopics[1].practiceQuestionNumbers).toEqual([
      98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109,
    ])
    expect(mathTextbookTopics[2].practiceQuestionNumbers).toEqual([
      108, 110, 111, 112, 113, 114, 115, 116, 117,
    ])
    const all = mathTextbookTopics.flatMap((topic) => topic.practiceQuestionNumbers)
    expect(new Set(all).size).toBe(all.length)
    expect(all).not.toContain(118)
    expect(all).not.toContain(119)
    expect(all).not.toContain(120)
    expect(mathTextbookTopicForUnit('math-functions-conditions')).toBeUndefined()
  })



  it('keeps learner-facing topic flows aligned with the textbook lesson order', () => {
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
      'math-quantifiers-all-exists',
      'math-functions-conditions',
      'math-propositions-proof',
    ])
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
