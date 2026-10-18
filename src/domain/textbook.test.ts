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
  textbookUnitProgress,
  type TextbookUnitProgress,
} from './textbook'

import { mathNumbersN12Unit } from '../data/textbook/math/numbers/n12Lesson'
import { mathNumbersN01Unit, n01SourceToItemIds } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit, n03SourceToItemIds } from '../data/textbook/math/numbers/n03Lesson'
import { mathNumbersN09Unit, n09SourceToItemIds } from '../data/textbook/math/numbers/n09Lesson'

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


describe('N12 P-002 progress transition only', () => {
  const lesson = mathNumbersN12Unit
  const getItem = (id: string) => lesson.sections[0].items.find(item => item.id === id)!
  const oldAnswer = (id: string, value: string, resolved = true) => ({
    itemId: id,
    value,
    firstValue: value,
    isFirstCorrect: resolved,
    resolved,
    attemptCount: 1,
    firstAnsweredAt: 100,
    lastAnsweredAt: 200,
  })

  const oldProgress = (): TextbookUnitProgress => ({
    unitId: lesson.unitId,
    unitRevision: 1,
    startedAt: 50,
    updatedAt: 200,
    completedAt: 300,
    answers: {
      'n12-01': oldAnswer('n12-01', getItem('n12-01').answer),
      'n12-01a': oldAnswer('n12-01a', '-7<2x'),
      'n12-02': oldAnswer('n12-02', getItem('n12-02').answer),
      'n12-03': oldAnswer('n12-03', '一つ目を満たすから適する', false),
    },
  })

  it('retains v1 source answers and old extras but never credits old extras as new holes', () => {
    const v1 = oldProgress()
    const projected = effectiveTextbookProgress(lesson, v1)!
    expect(projected.unitRevision).toBe(2)
    expect(projected.migratedFromRevision).toBe(1)
    expect(projected.startedAt).toBe(50)
    expect(projected.previousRevisionCompletedAt).toBe(300)
    expect(projected.completedAt).toBeUndefined()
    expect(projected.answers).toEqual(v1.answers)
    expect(textbookUnitProgress(lesson, v1)).toMatchObject({ completed: 2, total: 26 })
    expect(textbookUnitProgress(lesson, projected).completed).toBe(2)
    expect(getItem('n12-p002-q01-coef').answer).toBe('2')
    expect(projected.answers['n12-p002-q01-coef']).toBeUndefined()
    expect(effectiveTextbookProgress(lesson, projected)).toBe(projected)
  })

  it('converts on first new answer and keeps old completion history across subsequent answers', () => {
    const v1 = oldProgress()
    const coef = getItem('n12-p002-q01-coef')
    const afterFirst = answerTextbookItem(v1, lesson, coef, coef.answer, 500)
    expect(afterFirst.unitRevision).toBe(2)
    expect(afterFirst.startedAt).toBe(50)
    expect(afterFirst.completedAt).toBeUndefined()
    expect(afterFirst.previousRevisionCompletedAt).toBe(300)
    expect(afterFirst.answers['n12-01']).toEqual(v1.answers['n12-01'])
    expect(afterFirst.answers['n12-01a']).toEqual(v1.answers['n12-01a'])
    expect(textbookUnitProgress(lesson, afterFirst).completed).toBe(3)

    const constant = getItem('n12-p002-q01-const')
    const afterSecond = answerTextbookItem(afterFirst, lesson, constant, constant.answer, 600)
    expect(afterSecond.previousRevisionCompletedAt).toBe(300)
    expect(afterSecond.migratedFromRevision).toBe(1)
    expect(afterSecond.answers['n12-01a']).toEqual(v1.answers['n12-01a'])
    expect(textbookUnitProgress(lesson, afterSecond).completed).toBe(4)
  })

  it('does not migrate unrelated unit revisions or artificially resolve incorrect records', () => {
    expect(effectiveTextbookProgress(unit, {
      ...oldProgress(), unitId: unit.unitId, unitRevision: unit.revision - 1,
    })).toBeUndefined()
    const v1 = oldProgress()
    v1.completedAt = undefined
    const migrated = effectiveTextbookProgress(lesson, v1)!
    expect(migrated.previousRevisionCompletedAt).toBeUndefined()
    expect(textbookUnitProgress(lesson, migrated).completed).toBe(2)
  })
})


describe('W-MATH-005 P-001: N01/N03/N09 safe v1 to v2 record conversion', () => {
  const cases = [
    { unit: mathNumbersN01Unit, source: n01SourceToItemIds, tokens: ['n01-r3-q07-x2coef', 'n01-r3-q07-xcoef', 'n01-r3-q07-const'], total: 18 },
    { unit: mathNumbersN03Unit, source: n03SourceToItemIds, tokens: ['n03-r3-q10-p1', 'n03-r3-q10-p2', 'n03-r3-q10-p3', 'n03-r3-q10-p4'], total: 17 },
    { unit: mathNumbersN09Unit, source: n09SourceToItemIds, tokens: ['n09-r3-q08-square141', 'n09-r3-q08-square142'], total: 16 },
  ]

  for (const { unit: lesson, source, tokens, total } of cases) {
    it(lesson.unitId + ': projects fully solved v1 originals while every new local token stays unanswered', () => {
      const originalIds = Object.values(source).flat()
      const answers = Object.fromEntries(originalIds.map(id => {
        const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
        return [id, {
          itemId: id, value: item.answer, firstValue: item.answer, isFirstCorrect: true,
          resolved: true, attemptCount: 2, firstAnsweredAt: 100, lastAnsweredAt: 200,
        }]
      }))
      const old: TextbookUnitProgress = {
        unitId: lesson.unitId, unitRevision: 1, startedAt: 50, updatedAt: 200, completedAt: 300, answers,
      }
      expect(effectiveTextbookProgress(lesson, undefined)).toBeUndefined()
      const migrated = effectiveTextbookProgress(lesson, old)!
      expect(migrated.unitRevision).toBe(2)
      expect(migrated.migratedFromRevision).toBe(1)
      expect(migrated.previousRevisionCompletedAt).toBe(300)
      expect(migrated.completedAt).toBeUndefined()
      expect(migrated.startedAt).toBe(50)
      expect(migrated.answers).toEqual(old.answers)
      expect(textbookUnitProgress(lesson, old)).toMatchObject({ completed: originalIds.length, total })
      expect(effectiveTextbookProgress(lesson, migrated)).toBe(migrated)
      for (const token of tokens) expect(migrated.answers[token]).toBeUndefined()

      const afterFirst = answerTextbookItem(old, lesson, lesson.sections[0].items.find(item => item.id === tokens[0])!, lesson.sections[0].items.find(item => item.id === tokens[0])!.answer, 400)
      expect(afterFirst.unitRevision).toBe(2)
      expect(afterFirst.previousRevisionCompletedAt).toBe(300)
      expect(afterFirst.answers[originalIds[0]].attemptCount).toBe(2)
      expect(textbookUnitProgress(lesson, afterFirst).completed).toBe(originalIds.length + 1)

      let progress = afterFirst
      tokens.slice(1).forEach((id, index) => {
        const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
        progress = answerTextbookItem(progress, lesson, item, item.answer, 500 + index)
      })
      expect(textbookUnitProgress(lesson, progress)).toMatchObject({ completed: total, total, percent: 100 })
      expect(progress.completedAt).toBeDefined()
      expect(progress.previousRevisionCompletedAt).toBe(300)
      expect(progress.answers[originalIds[0]].attemptCount).toBe(2)
    })

    it(lesson.unitId + ': does not credit a previously wrong original or a different revision', () => {
      const originalId = Object.values(source).flat()[0]
      const original = lesson.sections[0].items.find(item => item.id === originalId)!
      const old: TextbookUnitProgress = {
        unitId: lesson.unitId, unitRevision: 1, startedAt: 1, updatedAt: 2,
        answers: {
          [originalId]: {
            itemId: originalId, value: 'intentionally wrong', firstValue: 'intentionally wrong',
            isFirstCorrect: false, resolved: true, attemptCount: 3, firstAnsweredAt: 1, lastAnsweredAt: 2,
          },
        },
      }
      const migrated = effectiveTextbookProgress(lesson, old)!
      expect(migrated.answers[originalId].attemptCount).toBe(3)
      expect(migrated.previousRevisionCompletedAt).toBeUndefined()
      expect(textbookUnitProgress(lesson, migrated).completed).toBe(0)
      const repaired = answerTextbookItem(old, lesson, original, original.answer, 100)
      expect(repaired.answers[originalId].attemptCount).toBe(4)
      expect(repaired.answers[originalId].firstValue).toBe('intentionally wrong')
      expect(textbookUnitProgress(lesson, repaired).completed).toBe(1)
      expect(effectiveTextbookProgress(lesson, { ...old, unitRevision: 0 })).toBeUndefined()
      expect(effectiveTextbookProgress(lesson, { ...old, unitId: 'math-numbers-expressions-n02' })).toBeUndefined()
    })
  }
})
