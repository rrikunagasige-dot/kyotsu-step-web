import { describe, expect, it } from 'vitest'
import active from '../data/textbook/math/numbers/n09ConstructionCompiledR7.json'
import r6 from '../data/textbook/math/numbers/n09ConstructionCompiledR6.json'
import r5 from '../data/textbook/math/numbers/n09ConstructionCompiledR5.json'
import r4 from '../data/textbook/math/numbers/n09ConstructionCompiledR4.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'
import { answerNestedPart, emptyNestedLedger, projectNestedLesson, resetNestedLedger, type NestedLesson, type NestedLedger } from './nestedLesson'
import { activateRetainedNativeRecords, migrateNativeRevisionLedger } from './nestedMigration'
import { parseSavedNestedLesson } from './nestedLessonStorage'
const from = (c: unknown) => nestedLessonFromCompiled(c as CompiledNestedLesson)
const target = from(active), previous = from(r6)
const parts = (l: NestedLesson) => l.nodes.flatMap(n => n.parts)
function complete(l: NestedLesson) {
  let ledger = emptyNestedLedger(l, 1), i = 0
  while (!projectNestedLesson(l, ledger).completed) {
    const id = projectNestedLesson(l, ledger).editable!.partId, p = parts(l).find(p => p.id === id)!
    ledger = answerNestedPart(l, ledger, id, p.expected, 'original-' + ++i, i + 1)!
  }
  return ledger
}
const retired = ['n09-q01-negative::productSign', ...['balanceOperation', 'factorSign', 'zeroLogic', 'leftInverseOperation', 'rightInverseOperation'].map(k => 'n09-01::' + k)]
const factorId = 'n09-01::factorisedFormUX05', zeroId = 'n09-01::factorZeroConditionUX05'
const part = (id: string) => parts(target).find(p => p.id === id)!
const current = (ledger: NestedLedger) => projectNestedLesson(target, ledger).visible.find(n => n.node.nodeId === 'n09-01')!
describe('UX05 representative keeps the main inference and native history', () => {
  it('changes only the two approved nodes and never preprints the concrete zero conditions', () => {
    expect(target.nodes).toHaveLength(41)
    expect(parts(target)).toHaveLength(48)
    for (const old of previous.nodes) if (!['n09-q01-negative', 'n09-01'].includes(old.nodeId)) expect(target.nodes.find(n => n.nodeId === old.nodeId)).toEqual(old)
    let ledger = emptyNestedLedger(target, 0)
    expect(answerNestedPart(target, ledger, 'n09-q01-negative::value', '16', 'skip', 1)).toBe(ledger)
    ledger = answerNestedPart(target, ledger, 'n09-q01-negative::powerAction', 'repeat-whole-base', 'scope', 2)!
    expect(projectNestedLesson(target, ledger).editable?.partId).toBe('n09-q01-negative::value')
    ledger = answerNestedPart(target, ledger, 'n09-q01-negative::value', '16', 'value', 3)!
    expect(projectNestedLesson(target, ledger).editable?.partId).toBe(factorId)
    expect(current(ledger).rows.some(r => /x-4=0|x\+4=0/.test(r.template))).toBe(false)
    expect(answerNestedPart(target, ledger, zeroId, part(zeroId).expected, 'skip-condition', 4)).toBe(ledger)
    for (const choice of part(factorId).choices.filter(c => c.value !== part(factorId).expected)) {
      const wrong = answerNestedPart(target, ledger, factorId, choice.value, 'wrong-factor-' + choice.value, 5)!
      expect(projectNestedLesson(target, wrong).editable?.partId).toBe(factorId)
      expect(current(wrong).rows.some(r => r.partKeys.includes('factorZeroConditionUX05'))).toBe(false)
    }
    ledger = answerNestedPart(target, ledger, factorId, part(factorId).expected, 'factor', 6)!
    expect(projectNestedLesson(target, ledger).editable?.partId).toBe(zeroId)
    expect(current(ledger).rows.some(r => /x-4=0|x\+4=0|x=4|x=-4/.test(r.template))).toBe(false)
    expect(current(ledger).node.terminalRecord).toBeUndefined()
    for (const choice of part(zeroId).choices.filter(c => c.value !== part(zeroId).expected)) {
      const wrong = answerNestedPart(target, ledger, zeroId, choice.value, 'wrong-condition-' + choice.value, 7)!
      expect(current(wrong).rows.some(r => /x=4|x=-4/.test(r.template))).toBe(false)
      expect(current(wrong).rows.some(r => r.partKeys.includes('factorZeroConditionUX05'))).toBe(true)
    }
    ledger = answerNestedPart(target, ledger, zeroId, part(zeroId).expected, 'condition', 8)!
    expect(current(ledger).resolved).toBe(true)
    expect(current(ledger).rows.some(r => r.partKeys.includes('factorZeroConditionUX05'))).toBe(false)
    expect(current(ledger).rows.some(r => r.template === 'x-4=0')).toBe(true)
    expect(current(ledger).rows.some(r => r.template.includes('x+4=0'))).toBe(true)
    expect(current(ledger).rows.some(r => r.template.includes('x=4'))).toBe(true)
    expect(projectNestedLesson(target, resetNestedLedger(target, 9)).editable?.partId).toBe('n09-q01-negative::powerAction')
  })
  it('retains 46 real records, archives the six retired tasks at their original source, and resumes at exactly two NEW judgments', () => {
    const original = complete(previous), frozen = JSON.stringify(original)
    const moved = migrateNativeRevisionLedger({ source: previous, target, sourceLedger: original, now: 1000 })
    expect(moved.eligiblePartIds).toHaveLength(46)
    expect(Object.keys(moved.ledger.records)).toHaveLength(46)
    for (const id of retired) { expect(moved.ledger.records[id]).toBeUndefined(); expect(original.records[id]).toBeDefined() }
    for (const id of moved.eligiblePartIds) expect(moved.ledger.records[id]).toEqual(original.records[id])
    expect(moved.ledger.processedEventIds).toEqual(original.processedEventIds)
    expect(projectNestedLesson(target, moved.ledger).editable?.partId).toBe(factorId)
    expect(current(moved.ledger).resolved).toBe(false)
    let ledger = moved.ledger
    for (const [i, id] of [factorId, zeroId].entries()) {
      ledger = activateRetainedNativeRecords(target, answerNestedPart(target, ledger, id, part(id).expected, 'new-' + i, 1100 + i)!, moved.eligiblePartIds)
    }
    expect(projectNestedLesson(target, ledger).completed).toBe(true)
    expect(ledger.processedEventIds).toHaveLength(original.processedEventIds.length + 2)
    expect(parseSavedNestedLesson(JSON.stringify({ schemaVersion: 'nested-reader-storage/1', ledger }), target).ledger).toEqual(ledger)
    expect(JSON.stringify(original)).toBe(frozen)
  })
  it('preserves known r4/r5 chains, keeps resets empty, and rejects unknown source/target hashes', () => {
    for (const start of [from(r4), from(r5)]) {
      let source = start, ledger = complete(start)
      for (const next of [from(r5), previous, target].filter(l => l.toRevision > start.toRevision)) {
        ledger = migrateNativeRevisionLedger({ source, target: next, sourceLedger: ledger, now: 1000 }).ledger; source = next
      }
      expect(Object.keys(ledger.records).length).toBeGreaterThan(0)
      expect(projectNestedLesson(target, ledger).completed).toBe(false)
    }
    const empty = resetNestedLedger(previous, 100)
    const moved = migrateNativeRevisionLedger({ source: previous, target, sourceLedger: empty, now: 101 })
    expect(moved.ledger.records).toEqual({}); expect(moved.ledger.draft).toEqual({})
    const answered = answerNestedPart(previous, empty, 'n09-q01-negative::powerAction', 'repeat-whole-base', 'after-reset', 102)!
    const after = migrateNativeRevisionLedger({ source: previous, target, sourceLedger: answered, now: 103 })
    expect(after.ledger.records).toEqual(answered.records)
    expect(after.ledger.processedEventIds).toEqual(['after-reset'])
    expect(() => migrateNativeRevisionLedger({ source: { ...previous, compiledHash: 'unknown' }, target, sourceLedger: answered, now: 103 })).toThrow('UX03_NATIVE_REVISION_BINDING')
    expect(() => migrateNativeRevisionLedger({ source: previous, target: { ...target, compiledHash: 'unknown' }, sourceLedger: answered, now: 103 })).toThrow('UX03_NATIVE_REVISION_BINDING')
  })
})
