import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import { answerTextbookItem, getTextbookChoices, groupTextbookUnitsByChapter, isTextbookAnswerCorrect, isTextbookItemResolved, normalizeTextbookAnswer, textbookUnitProgress } from './textbook'

const unit = builtInTextbookUnits[0]
const firstItem = unit.sections[0].items[0]
const formulaItem = unit.sections[0].items.find((item) => item.id === 'a-5')!

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
    expect(isTextbookAnswerCorrect(formulaItem, 'r2 - r1')).toBe(true)
  })

  it('builds stable multiple-choice options from answers in the same source unit', () => {
    const choices = getTextbookChoices(unit, firstItem)
    expect(choices).toContain('位置ベクトル')
    expect(choices.length).toBeGreaterThanOrEqual(3)
    expect(getTextbookChoices(unit, firstItem)).toEqual(choices)
  })

  it('keeps a wrong choice unresolved and resolves only after a correct retry', () => {
    const wrongProgress = answerTextbookItem(undefined, unit, firstItem, '変位', 1000)
    const wrongRecord = wrongProgress.answers[firstItem.id]

    expect(wrongRecord.isFirstCorrect).toBe(false)
    expect(wrongRecord.firstValue).toBe('変位')
    expect(wrongRecord.value).toBe('変位')
    expect(wrongRecord.resolved).toBe(false)
    expect(wrongRecord.attemptCount).toBe(1)
    expect(isTextbookItemResolved(firstItem, wrongRecord)).toBe(false)
    expect(textbookUnitProgress(unit, wrongProgress).completed).toBe(0)

    const correctedProgress = answerTextbookItem(wrongProgress, unit, firstItem, '位置ベクトル', 2000)
    const correctedRecord = correctedProgress.answers[firstItem.id]

    expect(correctedRecord.isFirstCorrect).toBe(false)
    expect(correctedRecord.firstValue).toBe('変位')
    expect(correctedRecord.value).toBe('位置ベクトル')
    expect(correctedRecord.resolved).toBe(true)
    expect(correctedRecord.attemptCount).toBe(2)
    expect(isTextbookItemResolved(firstItem, correctedRecord)).toBe(true)
    expect(textbookUnitProgress(unit, correctedProgress).completed).toBe(1)
  })

  it('rejects legacy resolved-wrong records while preserving legacy first-correct progress', () => {
    const legacyWrong = {
      itemId: firstItem.id,
      value: '変位',
      firstValue: '変位',
      isFirstCorrect: false,
      resolved: true,
      attemptCount: 1,
      firstAnsweredAt: 1,
      lastAnsweredAt: 1,
    }
    const legacyCorrectSeed = {
      ...legacyWrong,
      value: 'seeded',
      firstValue: 'seeded',
      isFirstCorrect: true,
    }

    expect(isTextbookItemResolved(firstItem, legacyWrong)).toBe(false)
    expect(isTextbookItemResolved(firstItem, legacyCorrectSeed)).toBe(true)
  })
})
