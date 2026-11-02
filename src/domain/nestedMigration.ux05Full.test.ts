import { describe, expect, it } from 'vitest'
import r7 from '../data/textbook/math/numbers/n09ConstructionCompiledR7.json'
import r4 from '../data/textbook/math/numbers/n10ConstructionCompiledR4.json'
import n09 from '../data/textbook/math/numbers/n09ConstructionCompiled.json'
import n10 from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import mappings from '../data/textbook/math/numbers/n0910Ux05Migration.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'
import { emptyNestedLedger, answerNestedPart, projectNestedLesson, type NestedLesson } from './nestedLesson'
import { migrateNativeRevisionLedger, activateRetainedNativeRecords } from './nestedMigration'
const lesson = (c: unknown) => nestedLessonFromCompiled(c as CompiledNestedLesson)
function completed(l: NestedLesson) {
  let state = emptyNestedLedger(l, 1), time = 1
  for (const node of l.nodes) for (const p of node.parts) state = answerNestedPart(l, state, p.id, p.expected, 'fixture-'+ ++time, time)!
  expect(projectNestedLesson(l, state).completed).toBe(true)
  return state
}
describe('UX05 full explicit native edges and real prerequisites', () => {
  for (const [a,b,kept,retired,fresh,first] of [
    [r7,n09,34,14,9,'n09-q02-negative-square::signedRootSquareUX05'],
    [r4,n10,52,11,8,'n10-q10-coefficients::collectedExpressionUX05'],
  ] as const) {
    it(a.unitId+': retains original histories and only the new decisions reopen', () => {
      const from=lesson(a),to=lesson(b),old=completed(from),frozen=JSON.stringify(old),edge=mappings.edges.find(e=>e.unitId===a.unitId)!
      const moved=migrateNativeRevisionLedger({source:from,target:to,sourceLedger:old,now:1000})
      expect(moved.eligiblePartIds).toHaveLength(kept);expect(edge.retirePartIds).toHaveLength(retired);expect(edge.newPartIds).toHaveLength(fresh)
      expect(projectNestedLesson(to,moved.ledger).editable?.partId).toBe(first)
      expect(moved.ledger.processedEventIds).toEqual(old.processedEventIds)
      for(const id of edge.keepPartIds)expect(moved.ledger.records[id]).toEqual(old.records[id])
      for(const id of edge.retirePartIds){expect(moved.ledger.records[id]).toBeUndefined();expect(old.records[id]).toBeDefined()}
      let next=moved.ledger,events=0,time=1100
      while(!projectNestedLesson(to,next).completed){
        const id=projectNestedLesson(to,next).editable!.partId,p=to.nodes.flatMap(n=>n.parts).find(p=>p.id===id)!
        expect(edge.newPartIds).toContain(id)
        next=answerNestedPart(to,next,id,p.choices.find(c=>c.value!==p.expected)!.value,'new-wrong-'+events,++time)!
        expect(projectNestedLesson(to,next).editable?.partId).toBe(id)
        next=activateRetainedNativeRecords(to,answerNestedPart(to,next,id,p.expected,'new-correct-'+events++,++time)!,moved.eligiblePartIds)
      }
      expect(events).toBe(fresh);expect(next.processedEventIds).toHaveLength(old.processedEventIds.length+fresh*2)
      for(const id of edge.keepPartIds)expect(next.records[id]).toEqual(old.records[id])
      expect(JSON.stringify(old)).toBe(frozen)
    })
    it(a.unitId+': refuses stale artifacts and a changed KEEP meaning even if its value is equal', () => {
      const from=lesson(a),to=lesson(b),old=completed(from)
      expect(()=>migrateNativeRevisionLedger({source:{...from,compiledHash:'unknown'},target:to,sourceLedger:old,now:1000})).toThrow('UX03_NATIVE_REVISION_BINDING')
      expect(()=>migrateNativeRevisionLedger({source:from,target:{...to,compiledHash:'unknown'},sourceLedger:old,now:1000})).toThrow('UX03_NATIVE_REVISION_BINDING')
      const altered=structuredClone(to),id=mappings.edges.find(e=>e.unitId===a.unitId)!.keepPartIds[0]
      altered.nodes.flatMap(n=>n.parts).find(p=>p.id===id)!.prompt+=' different mathematical task'
      expect(()=>migrateNativeRevisionLedger({source:from,target:altered,sourceLedger:old,now:1000})).toThrow('UX05_KEEP_CONTRACT_CHANGED')
    })
  }
})
