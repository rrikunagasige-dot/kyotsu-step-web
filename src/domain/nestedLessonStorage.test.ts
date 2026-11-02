import { describe, it, expect } from 'vitest'
import compiled from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'
import { answerNestedPart, resetNestedLedger, projectNestedLesson } from './nestedLesson'
import { parseSavedNestedLesson, savedNestedLessonFromMain } from './nestedLessonStorage'
const lesson = nestedLessonFromCompiled(compiled as unknown as CompiledNestedLesson)
const initial = () => ({ schemaVersion: 'nested-reader-storage/1', ledger: resetNestedLedger(lesson, 1) })
describe('actual revision storage restoration', () => {
  it('rejects a fabricated answer event for an automatic conclusion', () => {
    const s = initial(), automatic = lesson.nodes.find(n => !n.parts.length)!
    s.ledger.parents[automatic.nodeId] = { attemptCount: 1, isFirstCorrect: true, firstSubmittedValues: {}, firstSubmittedAt: 1, lastSubmittedAt: 1 }
    expect(() => parseSavedNestedLesson(JSON.stringify(s), lesson)).toThrow('NESTED_STORAGE_PARENT')
  })
  it('round trips empty/reset and a real first-wrong record', () => {
    const s = initial(), id = projectNestedLesson(lesson).editable!.partId, part = lesson.nodes.flatMap(n => n.parts).find(p => p.id === id)!
    s.ledger = answerNestedPart(lesson, s.ledger, id, part.choices.find(c => c.value !== part.expected)!.value, 'wrong', 2)!
    expect(parseSavedNestedLesson(JSON.stringify(s), lesson)).toEqual(s)
    expect(parseSavedNestedLesson(JSON.stringify({ ...initial(), resetAt: 1 }), lesson).resetAt).toBe(1)
  })
  for (const [name, change] of Object.entries({ arrayDraft: (s: ReturnType<typeof initial>) => Object.assign(s.ledger, { draft: [] }), stringRecords: (s: ReturnType<typeof initial>) => Object.assign(s.ledger, { records: 'wrong' }), wrongRevision: (s: ReturnType<typeof initial>) => s.ledger.revision++, duplicateEvents: (s: ReturnType<typeof initial>) => s.ledger.processedEventIds.push('same', 'same'), futureDraft: (s: ReturnType<typeof initial>) => Object.assign(s.ledger.draft, { unknown: '1' }), badParent: (s: ReturnType<typeof initial>) => Object.assign(s.ledger.parents, { unknown: { attemptCount: 1 } }) })) it('rejects ' + name + ' without modifying source data', () => { const s = initial(); change(s); const raw = JSON.stringify(s); expect(() => parseSavedNestedLesson(raw, lesson)).toThrow(); expect(JSON.stringify(s)).toBe(raw) })
})


describe('exact current main-store recovery', () => {
  it('preserves answers after reset, original events, counters and times without mutating main', () => {
    const ledger = resetNestedLedger(lesson, 1), partId = projectNestedLesson(lesson, ledger).editable!.partId
    const part = lesson.nodes.flatMap(n => n.parts).find(p => p.id === partId)!
    const answered = answerNestedPart(lesson, ledger, partId, part.choices.find(c => c.value !== part.expected)!.value, 'real-first-wrong', 2)!
    const main = { unitId: lesson.unitId, unitRevision: lesson.toRevision, nestedProgress: answered, nestedResetAt: 1 }
    const before = JSON.stringify(main), restored = savedNestedLessonFromMain(main, lesson)!
    expect(restored.ledger).toEqual(answered)
    expect(restored.resetAt).toBe(1)
    expect(restored.nativeRevisionImport?.eligiblePartIds).toEqual([partId])
    expect(restored.ledger.processedEventIds).toEqual(['real-first-wrong'])
    expect(restored.ledger.records[partId]).toEqual(answered.records[partId])
    expect(projectNestedLesson(lesson, restored.ledger).editable?.partId).toBe(partId)
    expect(JSON.stringify(main)).toBe(before)
    expect(restored.ledger).not.toBe(answered)
  })
  it('never adopts another revision or candidate hash and fails closed on a corrupt matching ledger', () => {
    const main = { unitId: lesson.unitId, unitRevision: lesson.toRevision, nestedProgress: initial().ledger }
    expect(savedNestedLessonFromMain({ ...main, unitRevision: lesson.toRevision - 1 }, lesson)).toBeUndefined()
    expect(savedNestedLessonFromMain({ ...main, nestedProgress: { ...main.nestedProgress, compiledHash: 'other-candidate' } }, lesson)).toBeUndefined()
    expect(() => savedNestedLessonFromMain({ ...main, nestedProgress: { ...main.nestedProgress, records: [] } }, lesson)).toThrow('NESTED_STORAGE_BINDING')
  })
})
