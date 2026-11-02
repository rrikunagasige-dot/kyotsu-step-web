import { describe, expect, it } from 'vitest'
import current from '../data/textbook/math/numbers/n09ConstructionCompiled.json'
import previous from '../data/textbook/math/numbers/n09ConstructionCompiledR8.json'
import mapping from '../data/textbook/math/numbers/n0910Ux06Migration.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'
import { emptyNestedLedger, answerNestedPart, projectNestedLesson } from './nestedLesson'
import { activateRetainedNativeRecords, migrateNativeRevisionLedger } from './nestedMigration'
const old = nestedLessonFromCompiled(previous as unknown as CompiledNestedLesson)
const lesson = nestedLessonFromCompiled(current as unknown as CompiledNestedLesson)
const block = lesson.nodes.find(n => n.nodeId === 'n09-decimal-method')!
function completedOld() {
  let ledger = emptyNestedLedger(old, 1), tick = 1
  for (const n of old.nodes) for (const p of n.parts) ledger = answerNestedPart(old, ledger, p.id, p.expected, 'old-' + ++tick, tick)!
  expect(projectNestedLesson(old, ledger).completed).toBe(true)
  return ledger
}
describe('UX06 representative derives the formula before reusing old answers', () => {
  it('retains43 real histories but requires six new derivation decisions even after old completion', () => {
    const source = completedOld(), frozen = JSON.stringify(source), edge = mapping.edges[0]
    const moved = migrateNativeRevisionLedger({ source: old, target: lesson, sourceLedger: source, now: 1000 })
    expect(moved.eligiblePartIds).toHaveLength(43)
    expect(projectNestedLesson(lesson, moved.ledger).editable?.partId).toBe(block.parts[0].id)
    let ledger = moved.ledger, tick = 1100
    for (const p of block.parts) {
      const before = projectNestedLesson(lesson, ledger)
      expect(before.editable?.partId).toBe(p.id)
      expect(ledger.records[p.id]).toBeUndefined()
      for (const wrong of p.choices.filter(c => c.value !== p.expected)) {
        const attempted = answerNestedPart(lesson, ledger, p.id, wrong.value, 'wrong-' + ++tick, tick)!
        const after = projectNestedLesson(lesson, attempted)
        expect(after.editable?.partId).toBe(p.id)
        expect(after.visible.map(v => [v.node.nodeId, v.rows.map(r => r.id)])).toEqual(before.visible.map(v => [v.node.nodeId, v.rows.map(r => r.id)]))
      }
      ledger = activateRetainedNativeRecords(lesson, answerNestedPart(lesson, ledger, p.id, p.expected, 'new-' + ++tick, tick)!, moved.eligiblePartIds)
    }
    expect(projectNestedLesson(lesson, ledger).completed).toBe(true)
    for (const id of edge.keepPartIds) expect(ledger.records[id]).toEqual(source.records[id])
    expect(ledger.processedEventIds).toHaveLength(source.processedEventIds.length + 6)
    expect(JSON.stringify(source)).toBe(frozen)
  })
  it('withholds the completed formula and later prose until the relevant decisions are correct', () => {
    const moved = migrateNativeRevisionLedger({ source: old, target: lesson, sourceLedger: completedOld(), now: 1000 })
    const first = projectNestedLesson(lesson, moved.ledger).visible.find(v => v.node.nodeId === block.nodeId)!
    expect(first.rows.filter(r => r.kind === 'math')).toHaveLength(1)
    expect(JSON.stringify(first.node.assumptionParts)).not.toContain('2AB')
    expect(first.node.terminalRecord).toBeUndefined()
    expect(first.rows.some(r => r.template.includes('同じ交差項'))).toBe(false)
    expect(first.rows.some(r => r.template.includes('分数の平方'))).toBe(false)
  })
  it('keeps all40 other nodes exact and rejects unknown source or target hashes and altered KEEP tasks', () => {
    expect(lesson.toRevision).toBe(9)
    for (const n of lesson.nodes.filter(n => n.nodeId !== block.nodeId)) expect(n).toEqual(old.nodes.find(p => p.nodeId === n.nodeId))
    const sourceLedger = completedOld()
    expect(() => migrateNativeRevisionLedger({ source: old, target: { ...lesson, compiledHash: 'unknown' }, sourceLedger, now: 1000 })).toThrow('UX03_NATIVE_REVISION_BINDING')
    expect(() => migrateNativeRevisionLedger({ source: { ...old, compiledHash: 'unknown' }, target: lesson, sourceLedger, now: 1000 })).toThrow('UX03_NATIVE_REVISION_BINDING')
    const altered = structuredClone(lesson)
    altered.nodes.flatMap(n => n.parts).find(p => p.id === mapping.edges[0].keepPartIds[0])!.prompt += ' changed task'
    expect(() => migrateNativeRevisionLedger({ source: old, target: altered, sourceLedger, now: 1000 })).toThrow('UX05_KEEP_CONTRACT_CHANGED')
  })
})
