import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import {
  answerTextbookItem,
  getTextbookChoices,
  groupTextbookUnitsByChapter,
  isTextbookAnswerCorrect,
  isTextbookItemResolved,
  normalizeTextbookAnswer,
  textbookUnitProgress,
} from './textbook'

const unit = builtInTextbookUnits[0]
const firstItem = unit.sections[0].items[0]
const formulaItem = unit.sections[0].items.find((item) => item.id === 'a6')!

describe('textbook learning state', () => {
  it('groups published textbook units into ordered chapters', () => {
    const chapters = groupTextbookUnitsByChapter(builtInTextbookUnits)
    expect(chapters).toHaveLength(1)
    expect(chapters[0]).toMatchObject({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
    })
    expect(chapters[0].units.map((candidate) => candidate.chapter?.unitCode)).toEqual(['1A', '1B', '1C', '1D', '1E', '1F', '1G'])
  })

  it('normalizes spacing, unicode minus and vector marks for formula entry', () => {
    expect(normalizeTextbookAnswer(' r₂ − r₁ ')).toBe(normalizeTextbookAnswer('r2-r1'))
    expect(isTextbookAnswerCorrect(formulaItem, formulaItem.answer.replace(/ /g, ''))).toBe(true)
  })

  it('builds stable multiple-choice options while preserving the correct answer', () => {
    const choices = getTextbookChoices(unit, firstItem)
    expect(choices).toContain(firstItem.answer)
    expect(choices).toHaveLength(4)
    expect(getTextbookChoices(unit, firstItem)).toEqual(choices)
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
