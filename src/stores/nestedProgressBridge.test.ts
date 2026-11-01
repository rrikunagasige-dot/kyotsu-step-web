// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from './useAppStore'
import { mathNumbersN10Unit as unit } from '../data/textbook/math/numbers/n10Lesson'
import compiled from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from '../domain/compiledNestedLesson'
import { answerNestedPart, emptyNestedLedger, nestedStorageKey, legacyNestedStorageKey } from '../domain/nestedLesson'
import { textbookUnitProgress, type TextbookUnitProgress } from '../domain/textbook'
const lesson = nestedLessonFromCompiled(compiled as unknown as CompiledNestedLesson)
const old = (): TextbookUnitProgress => ({ unitId: unit.unitId, unitRevision: 2, startedAt: 1, updatedAt: 10, answers: {}, completedAt: 10 })
beforeEach(() => { localStorage.clear(); useAppStore.setState({ textbookProgress: {} }) })
afterEach(() => vi.unstubAllEnvs())
describe('catalog and canonical-ledger bridge', () => {
  it('archives old progress and does not turn old completion into new completion', () => {
    const archive = old(); useAppStore.setState({ textbookProgress: { [unit.unitId]: archive } })
    useAppStore.getState().syncNestedTextbook(unit, emptyNestedLedger(lesson, 20), undefined, archive)
    const saved = useAppStore.getState().textbookProgress[unit.unitId]
    expect(saved.unitRevision).toBe(3); expect(saved.completedAt).toBeUndefined(); expect(saved.previousRevisionCompletedAt).toBe(10)
    expect(saved.archivedRevisions?.['2']).toMatchObject(archive); expect(archive).toEqual(old())
    expect(textbookUnitProgress(unit, saved)).toEqual({ completed: 0, total: 35, percent: 0 })
  })
  it('updates the home count only after a whole real parent is certified', () => {
    let ledger = emptyNestedLedger(lesson, 20)
    const first = lesson.nodes.find(n => n.parts.length)!
    for (const [i, p] of first.parts.entries()) ledger = answerNestedPart(lesson, ledger, p.id, p.expected, 'part-' + i, 21 + i)!
    useAppStore.getState().syncNestedTextbook(unit, ledger)
    expect(textbookUnitProgress(unit, useAppStore.getState().textbookProgress[unit.unitId])).toMatchObject({ completed: 1, total: 35 })
  })
  it('home reset wins over an older async ledger and keeps old archives', () => {
    const archive = old(); useAppStore.getState().syncNestedTextbook(unit, emptyNestedLedger(lesson, 20), undefined, archive)
    const stale = useAppStore.getState().textbookProgress[unit.unitId].nestedProgress!
    useAppStore.getState().resetTextbookUnit(unit.unitId, unit)
    const reset = useAppStore.getState().textbookProgress[unit.unitId]
    expect(reset.nestedResetAt).toBeDefined(); expect(reset.nestedProgress?.records).toEqual({})
    useAppStore.getState().syncNestedTextbook(unit, stale)
    expect(useAppStore.getState().textbookProgress[unit.unitId]).toBe(reset)
    expect(reset.archivedRevisions?.['2']).toMatchObject(archive)
  })
  it('rejects a mismatched compiled ledger and clears nested keys on explicit global reset', () => {
    useAppStore.getState().syncNestedTextbook(unit, { ...emptyNestedLedger(lesson, 20), compiledHash: 'wrong' })
    expect(useAppStore.getState().textbookProgress[unit.unitId]).toBeUndefined()
    localStorage.setItem(nestedStorageKey(lesson), 'saved'); localStorage.setItem('unrelated', 'keep')
    useAppStore.getState().resetProgress()
    expect(localStorage.getItem(nestedStorageKey(lesson))).toBeNull(); expect(localStorage.getItem('unrelated')).toBe('keep')
  })
  it('ordinary and review resets do not erase the other namespace', () => {
    const ordinary = nestedStorageKey(lesson, 'kyotsu-step-store'), review = nestedStorageKey(lesson, 'review-test'), legacy = legacyNestedStorageKey(lesson, 'kyotsu-step-store')!
    expect(ordinary).not.toBe(review); expect(legacyNestedStorageKey(lesson, 'review-test')).toBeUndefined()
    for (const key of [ordinary, review, legacy]) localStorage.setItem(key, 'keep')
    vi.stubEnv('VITE_STORAGE_NAMESPACE', 'review-test'); useAppStore.getState().resetProgress()
    expect(localStorage.getItem(review)).toBeNull(); expect(localStorage.getItem(ordinary)).toBe('keep'); expect(localStorage.getItem(legacy)).toBe('keep')
    localStorage.setItem(review, 'keep'); vi.stubEnv('VITE_STORAGE_NAMESPACE', 'kyotsu-step-store'); useAppStore.getState().resetProgress()
    expect(localStorage.getItem(ordinary)).toBeNull(); expect(localStorage.getItem(legacy)).toBeNull(); expect(localStorage.getItem(review)).toBe('keep')
  })
})
