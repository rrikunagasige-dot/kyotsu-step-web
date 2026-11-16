import { describe, expect, it } from 'vitest'
import { mathQuadraticQF01Unit as unit, qf01Revision2Unit } from '../data/textbook/math/quadratic/qf01Lesson'
import { answerTextbookItem, effectiveTextbookProgress, resetTextbookUnitProgress, textbookUnitProgress, type TextbookUnitProgress } from './textbook'

const first = qf01Revision2Unit.sections.flatMap(s => s.items).find(i => i.id === 'qf01-n01-answer')!
function oldProgress(): TextbookUnitProgress {
  const r1 = { unitId: unit.unitId, unitRevision: 1, startedAt: 1, updatedAt: 2, answers: {}, extension: { preserve: 'r1 unknown' } }
  return { unitId: unit.unitId, unitRevision: 2, startedAt: 1, updatedAt: 3, answers: { [first.id]: { itemId: first.id, value: first.answer, resolved: true, isFirstCorrect: true, firstValue: first.answer, attemptCount: 1, firstAnsweredAt: 2, lastAnsweredAt: 2 } }, qf01Revision1Snapshot: { schemaVersion: 'qf01-revision1-snapshot/1', sourceSHA: '384021f539967038a20fd98bd146e0e499f0df65', serializedProgress: JSON.stringify(r1) }, qf01ResetSnapshots: [], extension: { preserve: ['r2 unknown', 0] } } as TextbookUnitProgress
}

describe('QF01 revision3 progress boundary', () => {
  it('archives original r2 serialization including r1/reset/unknown fields and starts all 35 judgments empty', () => {
    const old = oldProgress(), original = JSON.stringify(old), next = effectiveTextbookProgress(unit, old)!
    expect(JSON.stringify(old)).toBe(original)
    expect(next.answers).toEqual({})
    expect(next.qf01Revision2Snapshot?.serializedProgress).toBe(original)
    expect(textbookUnitProgress(unit, next)).toEqual({ completed: 0, total: 35, percent: 0 })
    expect(effectiveTextbookProgress(unit, next)).toBe(next)
  })
  it('does not invent a revision2 history when upgrading directly from revision1', () => {
    const r1 = JSON.parse(oldProgress().qf01Revision1Snapshot!.serializedProgress)
    const next = effectiveTextbookProgress(unit, r1)!
    expect(next.qf01Revision2Snapshot).toBeUndefined()
    expect(next.qf01Revision1Snapshot?.serializedProgress).toBe(JSON.stringify(r1))
    expect(next.answers).toEqual({})
  })
  it('requires actual preceding answers and retains the archived record across wrong answers and reset', () => {
    const old = oldProgress(), original = JSON.stringify(old), items = unit.sections.flatMap(s => s.items)
    expect(() => answerTextbookItem(old, unit, items[1], items[1].answer, 5)).toThrow()
    let current = answerTextbookItem(old, unit, items[0], items[0].answer, 5)
    const wrong = items[1].choices!.find(c => c !== items[1].answer)!
    current = answerTextbookItem(current, unit, items[1], wrong, 6)
    expect(current.answers[items[1].id].resolved).toBe(false)
    const reset = resetTextbookUnitProgress(unit, current, 8)!
    expect(reset.answers).toEqual({})
    expect(reset.qf01Revision2Snapshot?.serializedProgress).toBe(original)
    const saved = JSON.parse(reset.qf01Revision3ResetSnapshots![0].serializedProgressWithoutResetSnapshots)
    expect(saved.answers[items[1].id].value).toBe(wrong)
    expect(effectiveTextbookProgress(unit, reset)).toBe(reset)
  })
  it('rejects malformed or contradictory data without changing the original serialization', () => {
    const old = oldProgress(), bad = { ...old, answers: { ...old.answers, [first.id]: { ...old.answers[first.id], value: first.choices!.find(c => c !== first.answer)! } } }, original = JSON.stringify(bad)
    expect(() => effectiveTextbookProgress(unit, bad)).toThrow('元の記録を保持')
    expect(JSON.stringify(bad)).toBe(original)
    const current = effectiveTextbookProgress(unit, old)!
    const invalid = { ...current, completedAt: 3 }
    expect(() => effectiveTextbookProgress(unit, invalid)).toThrow()
  })
  it('completes only after all 35 current-version judgments and leaves the old history unchanged', () => {
    const old = oldProgress(), original = JSON.stringify(old)
    let current: TextbookUnitProgress | undefined = old
    unit.sections.flatMap(s => s.items).forEach((item, index) => { current = answerTextbookItem(current, unit, item, item.answer, 10 + index) })
    expect(textbookUnitProgress(unit, current)).toEqual({ completed: 35, total: 35, percent: 100 })
    expect(current!.qf01Revision2Snapshot?.serializedProgress).toBe(original)
    expect(current!.completedAt).toBe(44)
    expect(effectiveTextbookProgress(unit, current)).toBe(current)
  })
})
