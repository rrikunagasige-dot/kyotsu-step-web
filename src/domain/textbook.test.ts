// Historical edition regression; current-theme coverage lives in firstThemeRepair.test.ts.
import { firstThemeBaseline } from '../test/firstThemeBaseline'
import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import {
  answerTextbookItem,
  effectiveTextbookProgress,
  getTextbookChoices,
  groupTextbookUnitsByChapter,
  isTextbookAnswerCorrect,
  isTextbookItemResolved,
  normalizeTextbookAnswer,
  resetTextbookUnitProgress,
  textbookUnitProgress,
  type TextbookUnitProgress,
} from './textbook'

import { mathNumbersN12Unit } from '../data/textbook/math/numbers/n12Lesson'
import { mathNumbersN01Unit, n01SourceToItemIds } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit as current_mathNumbersN03Unit, n03SourceToItemIds } from '../data/textbook/math/numbers/n03Lesson'
import { mathNumbersN09Unit } from '../data/textbook/math/numbers/n09Lesson'
const mathNumbersN03Unit = firstThemeBaseline(current_mathNumbersN03Unit)


const unit = builtInTextbookUnits[0]
const firstItem = unit.sections[0].items[0]
const formulaItem = unit.sections[0].items.find((item) => item.id === 'a6')!

describe('textbook learning state', () => {
  it('groups published textbook units into ordered chapters', () => {
    const publishedUnits = builtInTextbookUnits.filter((candidate) => candidate.status === 'published')
    const chapters = groupTextbookUnitsByChapter(publishedUnits)
    expect(chapters).toHaveLength(2)
    expect(chapters[0]).toMatchObject({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
    })
    expect(chapters[0].units.map((candidate) => candidate.chapter?.unitCode)).toEqual(['1A', '1B', '1C', '1D', '1E', '1F', '1G'])
    expect(chapters[1]).toMatchObject({
      chapterId: 'math-ch03-sets-propositions',
      chapterNumber: '3',
      chapterTitle: '集合と命題',
    })
    expect(chapters[1].units.map((candidate) => candidate.unitId)).toEqual(['math-sets'])
  })

  it('normalizes spacing, unicode minus and vector marks for formula entry', () => {
    expect(normalizeTextbookAnswer(' r₂ − r₁ ')).toBe(normalizeTextbookAnswer('r2-r1'))
    expect(isTextbookAnswerCorrect(formulaItem, formulaItem.answer.replace(/ /g, ''))).toBe(true)
  })

  it('builds stable scaffolded options while preserving the correct answer', () => {
    const choices = getTextbookChoices(unit, firstItem)
    expect(firstItem.scaffoldLevel).toBe('strong')
    expect(choices).toContain(firstItem.answer)
    expect(choices).toHaveLength(2)
    expect(getTextbookChoices(unit, firstItem)).toEqual(choices)

    const medium = builtInTextbookUnits.flatMap((candidate) => candidate.sections[0].items)
      .find((item) => item.scaffoldLevel === 'medium')!
    const light = builtInTextbookUnits.flatMap((candidate) => candidate.sections[0].items)
      .find((item) => item.scaffoldLevel === 'light')!
    const mediumUnit = builtInTextbookUnits.find((candidate) => candidate.sections[0].items.some((item) => item.id === medium.id))!
    const lightUnit = builtInTextbookUnits.find((candidate) => candidate.sections[0].items.some((item) => item.id === light.id))!

    expect(getTextbookChoices(mediumUnit, medium)).toHaveLength(3)
    expect(getTextbookChoices(lightUnit, light)).toHaveLength(4)
    expect(getTextbookChoices(mediumUnit, medium)).toContain(medium.answer)
    expect(getTextbookChoices(lightUnit, light)).toContain(light.answer)
  })

  it('keeps a wrong choice unresolved and resolves only after a correct retry', () => {
    const wrong = firstItem.choices!.find((choice) => choice !== firstItem.answer)!
    const wrongProgress = answerTextbookItem(undefined, unit, firstItem, wrong, 1000)
    const wrongRecord = wrongProgress.answers[firstItem.id]

    expect(wrongRecord.isFirstCorrect).toBe(false)
    expect(wrongRecord.firstValue).toBe(wrong)
    expect(wrongRecord.value).toBe(wrong)
    expect(wrongRecord.resolved).toBe(false)
    expect(wrongRecord.attemptCount).toBe(1)
    expect(isTextbookItemResolved(firstItem, wrongRecord)).toBe(false)
    expect(textbookUnitProgress(unit, wrongProgress).completed).toBe(0)

    const correctedProgress = answerTextbookItem(wrongProgress, unit, firstItem, firstItem.answer, 2000)
    const correctedRecord = correctedProgress.answers[firstItem.id]

    expect(correctedRecord.isFirstCorrect).toBe(false)
    expect(correctedRecord.firstValue).toBe(wrong)
    expect(correctedRecord.value).toBe(firstItem.answer)
    expect(correctedRecord.resolved).toBe(true)
    expect(correctedRecord.attemptCount).toBe(2)
    expect(isTextbookItemResolved(firstItem, correctedRecord)).toBe(true)
    expect(textbookUnitProgress(unit, correctedProgress).completed).toBe(1)
  })

  it('ignores stale progress when the textbook revision changes', () => {
    const stale = {
      unitId: unit.unitId,
      unitRevision: unit.revision - 1,
      startedAt: 10,
      updatedAt: 20,
      answers: {
        [firstItem.id]: {
          itemId: firstItem.id,
          value: firstItem.answer,
          firstValue: firstItem.answer,
          isFirstCorrect: true,
          resolved: true,
          attemptCount: 1,
          firstAnsweredAt: 10,
          lastAnsweredAt: 20,
        },
      },
    }

    expect(textbookUnitProgress(unit, stale).completed).toBe(0)

    const refreshed = answerTextbookItem(stale, unit, firstItem, firstItem.answer, 1000)
    expect(refreshed.unitRevision).toBe(unit.revision)
    expect(refreshed.startedAt).toBe(1000)
    expect(Object.keys(refreshed.answers)).toEqual([firstItem.id])
  })

  it('rejects resolved-wrong records while preserving first-correct records', () => {
    const wrong = firstItem.choices!.find((choice) => choice !== firstItem.answer)!
    const legacyWrong = {
      itemId: firstItem.id,
      value: wrong,
      firstValue: wrong,
      isFirstCorrect: false,
      resolved: true,
      attemptCount: 1,
      firstAnsweredAt: 1,
      lastAnsweredAt: 1,
    }
    const legacyCorrect = {
      ...legacyWrong,
      value: firstItem.answer,
      firstValue: firstItem.answer,
      isFirstCorrect: true,
    }

    expect(isTextbookItemResolved(firstItem, legacyWrong)).toBe(false)
    expect(isTextbookItemResolved(firstItem, legacyCorrect)).toBe(true)
  })
})


describe('N12 P-003 revision-3 start-over with historical archive', () => {
  const lesson = mathNumbersN12Unit
  const getItem = (id: string) => lesson.sections[0].items.find(item => item.id === id)!
  const oldAnswer = (id: string, value: string, resolved = true) => ({
    itemId: id, value, firstValue: value, isFirstCorrect: resolved, resolved,
    attemptCount: resolved ? 1 : 2, firstAnsweredAt: 100, lastAnsweredAt: 200,
  })
  const oldProgress = (revision: 1 | 2): TextbookUnitProgress => ({
    unitId: lesson.unitId,
    unitRevision: revision,
    startedAt: 50,
    updatedAt: 200,
    completedAt: 300,
    ...(revision === 2 ? { migratedFromRevision: 1, previousRevisionCompletedAt: 280 } : {}),
    answers: {
      'n12-01': oldAnswer('n12-01', getItem('n12-01').answer),
      'n12-01a': oldAnswer('n12-01a', '-7<2x'),
      'n12-02': oldAnswer('n12-02', getItem('n12-02').answer),
      'n12-03': oldAnswer('n12-03', '一つ目を満たすから適する', false),
      ...(revision === 2 ? { 'n12-p002-q01-coef': oldAnswer('n12-p002-q01-coef', '2') } : {}),
    },
  })

  it.each([1, 2] as const)('archives every v%d answer and presents zero of 35 as complete', (revision) => {
    const previous = oldProgress(revision)
    const projection = effectiveTextbookProgress(lesson, previous)!
    expect(projection.unitRevision).toBe(3)
    expect(projection.migratedFromRevision).toBe(revision)
    expect(projection.completedAt).toBeUndefined()
    expect(projection.answers).toEqual({})
    expect(projection.archivedRevisions?.[revision].answers).toEqual(previous.answers)
    expect(projection.archivedRevisions?.[revision].completedAt).toBe(300)
    expect(projection.archivedRevisions?.[revision].answers['n12-03'].attemptCount).toBe(2)
    expect(textbookUnitProgress(lesson, previous)).toEqual({ completed: 0, total: 35, percent: 0 })
    expect(effectiveTextbookProgress(lesson, projection)).toBe(projection)
    expect(effectiveTextbookProgress(lesson, previous)).toEqual(projection)
  })

  it('preserves prior v2 records after first response, after reload-style reads, and after another response', () => {
    const v2 = oldProgress(2)
    const first = getItem('n12-p002-q01-coef')
    const afterFirst = answerTextbookItem(v2, lesson, first, first.answer, 500)
    expect(afterFirst.unitRevision).toBe(3)
    expect(afterFirst.answers[first.id].value).toBe('2')
    expect(afterFirst.answers['n12-01']).toBeUndefined()
    expect(afterFirst.archivedRevisions?.['2'].answers['n12-01']).toEqual(v2.answers['n12-01'])
    expect(afterFirst.archivedRevisions?.['2'].answers['n12-01a']).toEqual(v2.answers['n12-01a'])
    expect(textbookUnitProgress(lesson, afterFirst).completed).toBe(1)

    const reloaded = effectiveTextbookProgress(lesson, afterFirst)!
    expect(reloaded).toBe(afterFirst)
    const second = getItem('n12-p002-q01-const')
    const afterSecond = answerTextbookItem(reloaded, lesson, second, second.answer, 600)
    expect(afterSecond.answers[first.id].value).toBe('2')
    expect(afterSecond.answers[second.id].value).toBe('-7')
    expect(afterSecond.archivedRevisions).toEqual(afterFirst.archivedRevisions)
    expect(textbookUnitProgress(lesson, afterSecond).completed).toBe(2)
  })

  it('manual restart wipes only current N12 answers while retaining old version archive', () => {
    const v2 = oldProgress(2)
    const first = getItem('n12-p002-q01-coef')
    const active = answerTextbookItem(v2, lesson, first, first.answer, 500)
    const restarted = resetTextbookUnitProgress(lesson, active, 700)!
    expect(restarted.answers).toEqual({})
    expect(restarted.startedAt).toBe(700)
    expect(restarted.unitRevision).toBe(3)
    expect(restarted.archivedRevisions).toEqual(active.archivedRevisions)
    expect(restarted.completedAt).toBeUndefined()
    expect(textbookUnitProgress(lesson, restarted).completed).toBe(0)
    expect(resetTextbookUnitProgress(lesson, v2, 701)?.archivedRevisions?.['2'].answers)
      .toEqual(v2.answers)
  })

  it('keeps ordinary other-unit revision invalidation and historical P-002 migration', () => {
    const stale = oldProgress(1)
    expect(effectiveTextbookProgress(unit, { ...stale, unitId: unit.unitId, unitRevision: unit.revision - 1 }))
      .toBeUndefined()
    expect(resetTextbookUnitProgress(unit, stale, 1000)).toBeUndefined()
    const historicalV2 = { ...lesson, revision: 2 }
    const p002 = effectiveTextbookProgress(historicalV2, stale)!
    expect(p002.unitRevision).toBe(2)
    expect(p002.answers).toEqual(stale.answers)
    expect(p002.previousRevisionCompletedAt).toBe(300)
  })
})


describe('W-MATH-005/P-002: N01/N03-only v1 to v2 answer preservation', () => {
  const cases = [
    { lesson: mathNumbersN01Unit, source: n01SourceToItemIds,
      tokens: ['n01-r3-q07-x2coef', 'n01-r3-q07-xcoef', 'n01-r3-q07-const'], total: 18 },
    { lesson: mathNumbersN03Unit, source: n03SourceToItemIds,
      tokens: ['n03-r3-q10-p1', 'n03-r3-q10-p2', 'n03-r3-q10-p3', 'n03-r3-q10-p4'], total: 17 },
  ]

  for (const { lesson, source, tokens, total } of cases) {
    it(lesson.unitId + ': preserves all original completion and attempts, while seven-hole family is unanswered', () => {
      const ids = Object.values(source).flat()
      const answers = Object.fromEntries(ids.map(id => {
        const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
        return [id, {
          itemId: id, value: item.answer, firstValue: item.answer, isFirstCorrect: true,
          resolved: true, attemptCount: 3, firstAnsweredAt: 100, lastAnsweredAt: 200,
        }]
      }))
      const old: TextbookUnitProgress = {
        unitId: lesson.unitId, unitRevision: 1, startedAt: 80,
        updatedAt: 200, completedAt: 300, answers,
      }
      const migrated = effectiveTextbookProgress(lesson, old)!
      expect(migrated.unitRevision).toBe(2)
      expect(migrated.migratedFromRevision).toBe(1)
      expect(migrated.previousRevisionCompletedAt).toBe(300)
      expect(migrated.completedAt).toBeUndefined()
      expect(migrated.answers).toEqual(old.answers)
      expect(migrated.startedAt).toBe(80)
      expect(textbookUnitProgress(lesson, old)).toMatchObject({ completed: ids.length, total })
      expect(effectiveTextbookProgress(lesson, migrated)).toBe(migrated)
      for (const id of tokens) expect(migrated.answers[id]).toBeUndefined()

      let active = old
      tokens.forEach((id, index) => {
        const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
        active = answerTextbookItem(active, lesson, item, item.answer, 400 + index)
      })
      expect(textbookUnitProgress(lesson, active)).toMatchObject({ completed: total, total, percent: 100 })
      expect(active.completedAt).toBeDefined()
      expect(active.previousRevisionCompletedAt).toBe(300)
      expect(active.answers[ids[0]].attemptCount).toBe(3)
      expect(effectiveTextbookProgress(lesson, active)).toBe(active)
    })

    it(lesson.unitId + ': wrong old answers and unrelated revision never become solved', () => {
      const id = Object.values(source).flat()[0]
      const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
      const wrong = {
        itemId: id, value: 'wrong', firstValue: 'wrong',
        isFirstCorrect: false, resolved: true,
        attemptCount: 2, firstAnsweredAt: 100, lastAnsweredAt: 200,
      }
      const old: TextbookUnitProgress = {
        unitId: lesson.unitId, unitRevision: 1, startedAt: 100, updatedAt: 200,
        answers: { [id]: wrong },
      }
      const migrated = effectiveTextbookProgress(lesson, old)!
      expect(migrated.answers[id]).toEqual(wrong)
      expect(textbookUnitProgress(lesson, old).completed).toBe(0)
      const corrected = answerTextbookItem(old, lesson, item, item.answer, 400)
      expect(corrected.answers[id].firstValue).toBe('wrong')
      expect(corrected.answers[id].attemptCount).toBe(3)
      expect(textbookUnitProgress(lesson, corrected).completed).toBe(1)
      expect(effectiveTextbookProgress(lesson, { ...old, unitRevision: 0 })).toBeUndefined()
      expect(effectiveTextbookProgress(lesson, { ...old, unitId: 'math-numbers-expressions-n02' })).toBeUndefined()
    })
  }

  it('keeps already-released N09 restart and N12 35-stage archive behavior', () => {
    const n09old: TextbookUnitProgress = {
      unitId: mathNumbersN09Unit.unitId, unitRevision: 1, startedAt: 10, updatedAt: 20,
      completedAt: 30, answers: {},
    }
    const n09 = effectiveTextbookProgress(mathNumbersN09Unit, n09old)!
    expect(n09.answers).toEqual({})
    expect(n09.archivedRevisions?.['1'].completedAt).toBe(30)
    expect(textbookUnitProgress(mathNumbersN09Unit, n09old).total).toBe(18)

    const n12old: TextbookUnitProgress = { ...n09old, unitId: mathNumbersN12Unit.unitId, unitRevision: 2 }
    const n12 = effectiveTextbookProgress(mathNumbersN12Unit, n12old)!
    expect(n12.unitRevision).toBe(3)
    expect(n12.answers).toEqual({})
    expect(n12.archivedRevisions?.['2'].completedAt).toBe(30)
    expect(textbookUnitProgress(mathNumbersN12Unit, n12old).total).toBe(35)
  })
})
