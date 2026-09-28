import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import { answerTextbookItem, getTextbookChoices, groupTextbookUnitsByChapter, isTextbookAnswerCorrect, normalizeTextbookAnswer, textbookUnitProgress } from './textbook'

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
    expect(chapters[0].units.map((candidate) => candidate.chapter?.unitCode)).toEqual(['1A', '1B', '1C', '1D', '1E'])
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

  it('preserves the wrong first choice, resolves the blank, and leaves the correct answer available from the item', () => {
    const progress = answerTextbookItem(undefined, unit, firstItem, '変位', 1000)
    const record = progress.answers[firstItem.id]

    expect(record.isFirstCorrect).toBe(false)
    expect(record.firstValue).toBe('変位')
    expect(record.value).toBe('変位')
    expect(firstItem.answer).toBe('位置ベクトル')
    expect(record.resolved).toBe(true)
    expect(record.attemptCount).toBe(1)
    expect(textbookUnitProgress(unit, progress).completed).toBe(1)
  })
})
