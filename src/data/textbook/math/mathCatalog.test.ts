// Historical edition regression; current-theme coverage lives in firstThemeRepair.test.ts.
import { firstThemeBaseline } from '../../../test/firstThemeBaseline'
import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './set/setLesson'
import { mathNumbersReviewUnitIds, mathTextbookNextUnitId, mathTextbookTopicForUnit, mathTextbookTopicHasAllUnits, mathTextbookTopics } from './mathCatalog'
import { mathTextbookUnits as current_mathTextbookUnits } from './index'
import { textbookRepository } from '../../../repositories/textbookRepository'
const mathTextbookUnits = current_mathTextbookUnits.map(firstThemeBaseline)


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
      'numbers-polynomials',
      'numbers-real',
      'numbers-inequalities',
      'organize-sets',
      'read-propositions',
      'prove-propositions',
    ])
    expect(mathTextbookTopicForUnit('math-sets')?.unitIds).toEqual(['math-sets'])
    expect(mathTextbookTopicForUnit('math-propositions-reading')?.unitIds).toEqual(['math-propositions-reading', 'math-quantifiers-all-exists'])
    expect(mathTextbookTopicForUnit('math-propositions-proof')?.unitIds).toEqual(['math-propositions-proof'])
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
    expect(mathTextbookTopicForUnit('math-propositions-reading')?.practiceLinks).toEqual([
      {
        topicId: 'read-propositions',
        questionNumbers: [98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109],
      },
    ])
    expect(mathTextbookTopicForUnit('math-propositions-proof')?.practiceLinks).toEqual([
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
    const chapter3UnitIds = mathTextbookTopics.filter((topic) => topic.chapterId === 'math-ch03-sets-propositions').flatMap((topic) => topic.unitIds)
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
    expect(mathTextbookTopicForUnit('math-propositions-reading')?.flow.ja).toBe(
      '真偽 → 必要条件・十分条件 → 条件の否定 → 「すべて」と「ある」',
    )
    expect(mathTextbookTopicForUnit('math-propositions-proof')?.flow.ja).toBe(
      '逆・裏・対偶 → 証明しやすい向き → 対偶による証明 → 矛盾を使う証明',
    )
  })

  it('keeps only the approved set lesson published while all unaccepted math pilots remain review-only', () => {
    expect(
      mathTextbookUnits.filter((unit) => unit.status === 'published').map((unit) => unit.unitId),
    ).toEqual(['math-sets'])

    expect(
      mathTextbookUnits.filter((unit) => unit.status === 'review').map((unit) => unit.unitId),
    ).toEqual([
      'math-numbers-expressions-n01',
      'math-numbers-expressions-n02',
      'math-numbers-expressions-n03',
      'math-numbers-expressions-n04',
      'math-numbers-expressions-n05',
      'math-numbers-expressions-n06',
      'math-numbers-expressions-n07',
      'math-numbers-expressions-n08',
      'math-numbers-expressions-n09',
      'math-numbers-expressions-n10',
      'math-numbers-expressions-n11',
      'math-numbers-expressions-n12',
      'math-numbers-expressions-n13',
      'math-numbers-expressions-n14',
      'math-numbers-expressions-ne01',
      'math-numbers-expressions-ne02',
      'math-propositions-reading',
      'math-propositions-proof',
      'math-quantifiers-all-exists',
      'math-functions-conditions',
    ])
  })

  it('keeps the approved three learner-facing headings in order', () => {
    const topic = mathTextbookTopicForUnit('math-sets')
    expect(topic?.learnerHeadings).toEqual([
      '第1部　集合を表す',
      '第2部　集合どうしの関係を見る',
      '第3部　集合の外側まで考える',
    ])

    const headings = mathSetUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)

    expect(headings).toEqual(topic?.learnerHeadings)
  })

  it('maps sixteen source-audited chapter-1 review lessons into exactly three topics including development', () => {
    const chapter1 = mathTextbookTopics.filter((topic) => topic.chapterId === 'math-ch01-numbers-expressions')
    expect(chapter1.map((topic) => topic.label.ja)).toEqual(['式を整える', '実数を扱う', '不等式を使う'])
    expect(chapter1.map((topic) => topic.unitIds.map((id) => id.replace('math-numbers-expressions-', '')))).toEqual([
      ['n01', 'n02', 'n03', 'n04', 'n05', 'n06', 'ne01'], ['n07', 'n08', 'n09', 'n10', 'ne02'], ['n11', 'n12', 'n13', 'n14'],
    ])
    expect(mathNumbersReviewUnitIds).toHaveLength(16)
    for (const id of mathNumbersReviewUnitIds) {
      const unit = mathTextbookUnits.find((candidate) => candidate.unitId === id)
      expect(unit?.status, id).toBe('review')
      expect(unit?.chapter?.chapterId, id).toBe('math-ch01-numbers-expressions')
    }
    expect(mathTextbookNextUnitId('math-numbers-expressions-n01')).toBe('math-numbers-expressions-n02')
    expect(mathTextbookNextUnitId('math-numbers-expressions-n02')).toBe('math-numbers-expressions-n03')
    expect(mathTextbookNextUnitId('math-numbers-expressions-n09')).toBe('math-numbers-expressions-n10')
    expect(mathTextbookNextUnitId('math-numbers-expressions-n03')).toBe('math-numbers-expressions-n04')
    expect(mathTextbookNextUnitId('math-numbers-expressions-n14')).toBeUndefined()
  })

  it('exposes ONLY chapter-1 review previews in the learner setup, without promoting their published status', async () => {
    const published = await textbookRepository.listPublished()
    const visible = await textbookRepository.listLearningSetup()
    const publishedIds = published.map((unit) => unit.unitId)
    const visibleIds = visible.map((unit) => unit.unitId)
    expect(publishedIds).toContain('math-sets')
    for (const id of mathNumbersReviewUnitIds) {
      expect(publishedIds).not.toContain(id)
      expect(visibleIds).toContain(id)
    }
    for (const id of ['math-propositions-reading', 'math-propositions-proof', 'math-quantifiers-all-exists', 'math-functions-conditions']) {
      expect(visibleIds).not.toContain(id)
    }
  })
})

