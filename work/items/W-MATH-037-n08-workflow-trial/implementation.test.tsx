import {describe,it,expect} from 'vitest'
import old from '../../../src/data/textbook/math/numbers/n08Authored.json'
import next from '../../../src/data/textbook/math/numbers/n08Revision5.json'
import {validateTextbookUnits} from '../../../src/domain/textbookSchema'
import {effectiveTextbookProgress,answerTextbookItem,type TextbookUnitProgress} from '../../../src/domain/textbook'
const v4=validateTextbookUnits([old.unit])[0],v5=validateTextbookUnits([next.unit])[0]
const saved=(revision=4):TextbookUnitProgress=>({unitId:v4.unitId,unitRevision:revision,startedAt:1,updatedAt:2,completedAt:2,answers:Object.fromEntries(v4.sections[0].items.filter(i=>revision===4||/^n08-\d\d$/.test(i.id)).map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'previous-wrong',isFirstCorrect:false,resolved:true,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]))})
describe('N08 revision preservation',()=>{
 it('keeps all 31 old grading contracts byte for byte',()=>{
  expect(old.unit.sections[0].items).toHaveLength(31);expect(next.unit.sections[0].items).toHaveLength(34)
  for(const q of old.unit.sections[0].items)expect(next.unit.sections[0].items.find(x=>x.id===q.id)).toEqual(q)
  expect(next.stages).toEqual(old.stages)
 })
 it('retains all attempts and reopens only three new answers',()=>{
  const source=saved(),result=effectiveTextbookProgress(v5,source)!
  expect(result.answers).toEqual(source.answers);expect(result.completedAt).toBeUndefined();expect(result.archivedRevisions?.['4'].answers).toEqual(source.answers)
  expect(v5.sections[0].items.filter(q=>!result.answers[q.id])).toHaveLength(3)
 })
 it('round trips r4 -> r5 -> r4 -> r5 without losing new or old histories',()=>{
  const source=saved(),q=v5.sections[0].items.find(x=>x.id.startsWith('n08-r5-'))!
  const trial=answerTextbookItem(source,v5,q,q.answer,3)
  const rollback=effectiveTextbookProgress(v4,trial)!
  expect(rollback.answers).toEqual(source.answers);expect(rollback.completedAt).toBe(2);expect(rollback.archivedRevisions?.['5'].answers[q.id]).toEqual(trial.answers[q.id])
  const restored=effectiveTextbookProgress(v5,rollback)!
  expect(restored.answers).toEqual(trial.answers);expect(restored.completedAt).toBeUndefined()
 })
 it.each([1,2,3])('applies the old migration before r%d -> r5',revision=>{
  const source=saved(revision),result=effectiveTextbookProgress(v5,source)!
  const existingMigration=effectiveTextbookProgress(v4,source)!
  expect(result.unitRevision).toBe(5);expect(result.answers).toEqual(existingMigration.answers)
  expect(result.archivedRevisions?.[String(revision)]?.answers).toEqual(source.answers)
  expect(result.archivedRevisions?.['4']).toBeDefined();expect(result.completedAt).toBeUndefined()
 })
 it('binds each two-sided operation to one grading key',()=>{
  for(const node of next.semantic.nodes.filter(n=>n.id.includes('-operation'))){
   const slots=node.before.flatMap(b=>b.parts).filter(p=>p.type==='choice')
   expect(slots).toHaveLength(2);expect(new Set(slots.map(p=>p.type==='choice'&&p.itemId)).size).toBe(1)
  }
 })
})
