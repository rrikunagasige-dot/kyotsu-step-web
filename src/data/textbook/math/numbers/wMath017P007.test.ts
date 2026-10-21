import { describe, expect, it } from 'vitest'
import { mathNumbersN11Unit, n11SourceToItemIds } from './n11Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit = mathNumbersN11Unit
const sec = unit.sections[0]
const at = (id:string) => sec.readingFlow.findIndex(b=>b.id===id)
const item = (id:string) => sec.items.find(i=>i.id===id)!

describe('P-007 N11 Q08–Q09 four-row inequality math and histories',()=>{
 it('keeps four formula rows and two conditional reasons in one frame, source mapping exact',()=>{
  expect(unit.revision).toBe(9)
  const ids=['n11-lead-08','n11-formula-08','n11-p007-q08-explain','n11-after-08','n11-p007-q09-explain','n11-formula-09']
  const n=ids.map(at)
  expect(n.every(x=>x>=0)).toBe(true)
  expect(n).toEqual(n.map((_,i)=>n[0]+i))
  const blocks=n.map(i=>sec.readingFlow[i])
  expect(blocks.map(b=>b.type)).toEqual(['formula','formula','paragraph','formula','paragraph','formula'])
  expect(blocks.every(b=>(b.type==='formula'||b.type==='paragraph') && b.derivationId==='n11-q08-q09-chain')).toBe(true)
  const formula=blocks.map(b=>b.type==='formula'?b.parts.filter(p=>p.type==='math').map(p=>p.latex):[])
  expect(formula).toEqual([['-2x+3\\le5'],['-2x+3-','\\le5-'],[],['-2x\\le'],[],['x']])
  const holes=blocks.map(b=>(b.type==='formula'||b.type==='paragraph')?b.parts.filter(p=>p.type==='choice').map(p=>p.itemId):[])
  expect(holes).toEqual([[],['n11-p007-q08-subtract-left','n11-p007-q08-subtract-right'],[],['n11-08'],[],['n11-p007-q09-direction','n11-09']])
  expect(JSON.stringify(blocks[2])).toContain('左辺の＋3と−3を打ち消す')
  expect(JSON.stringify(blocks[4])).toContain('不等号の向きが逆になる')
  expect(JSON.stringify(blocks)).not.toContain('x\\ge-1')
  expect(at('n11-formula-10')).toBeGreaterThan(at('n11-formula-09'))
  expect(at('n11-show-n11-f02')).toBeGreaterThan(at('n11-formula-10'))
  expect(at('n11-p006-q05-cancel-explain')).toBeGreaterThan(0)
  expect(sec.items).toHaveLength(28)
  expect(sec.items.map(i=>i.id)).toEqual(Object.values(n11SourceToItemIds).flat())
  expect(Object.keys(n11SourceToItemIds)).toHaveLength(14)
  expect(n11SourceToItemIds['N11-Q08']).toEqual(['n11-p007-q08-subtract-left','n11-p007-q08-subtract-right','n11-08'])
  expect(n11SourceToItemIds['N11-Q09']).toEqual(['n11-p007-q09-direction','n11-09'])
 })
 it('preserves inclusive ≥ and grades five independent decisions',()=>{
  const ids=['n11-p007-q08-subtract-left','n11-p007-q08-subtract-right','n11-08','n11-p007-q09-direction','n11-09']
  expect(ids.map(x=>item(x).answer)).toEqual(['3','3','2','\\ge','-1'])
  for(const id of ids){
    expect(item(id).choices).toHaveLength(4)
    expect(new Set(item(id).choices).size).toBe(4)
    expect(item(id).choices).toContain(item(id).answer)
  }
  for(const x of [-5,-1,0,1,4]){
    expect(-2*x+3<=5).toBe(-2*x<=2)
    expect(-2*x<=2).toBe(x>=-1)
  }
 })
 const record=(id:string,value:string):TextbookAnswerRecord=>({
   itemId:id,value,firstValue:value,isFirstCorrect:true,resolved:true,
   attemptCount:1,firstAnsweredAt:100,lastAnsweredAt:200,
 })
 it('archives v8 and reopens only changed Q08 and Q09 keys, preserves all other progress',()=>{
  const previous:TextbookUnitProgress={
    unitId:unit.unitId,unitRevision:8,startedAt:10,updatedAt:200,completedAt:210,
    answers:{
      'n11-01':record('n11-01','>'),
      'n11-05':record('n11-05','7'),
      'n11-06':record('n11-06','\\frac73'),
      'n11-08':record('n11-08','\\text{両辺から}3\\text{を引く},\\quad-2x\\le2'),
      'n11-09':record('n11-09','\\text{両辺を}-2\\text{で割る},\\quad x\\ge-1'),
      'n11-14':record('n11-14','x\\ge-1'),
    },
  }
  const current=effectiveTextbookProgress(unit,previous)!
  expect(current.unitRevision).toBe(9)
  expect(current.migratedFromRevision).toBe(8)
  expect(current.completedAt).toBeUndefined()
  expect(current.previousRevisionCompletedAt).toBe(210)
  expect(current.archivedRevisions?.['8']?.answers).toEqual(previous.answers)
  expect(current.archivedRevisions?.['8']?.completedAt).toBe(210)
  for(const id of ['n11-01','n11-05','n11-06','n11-14'])expect(current.answers[id]).toEqual(previous.answers[id])
  for(const id of ['n11-08','n11-09','n11-p007-q08-subtract-left','n11-p007-q08-subtract-right','n11-p007-q09-direction'])expect(current.answers[id]).toBeUndefined()
  expect(effectiveTextbookProgress(unit,current)).toBe(current)
 })
 it('migrates previous v3 all the way to v9 while preserving archived revision boundaries',()=>{
  const previous:TextbookUnitProgress={
    unitId:unit.unitId,unitRevision:3,startedAt:10,updatedAt:200,
    answers:{'n11-02':record('n11-02','b-a'),'n11-08':record('n11-08','old'),'n11-09':record('n11-09','old')},
  }
  const current=effectiveTextbookProgress(unit,previous)!
  expect(current.unitRevision).toBe(9)
  for(const rev of ['3','4','5','6','7','8'])expect(current.archivedRevisions?.[rev]).toBeDefined()
  expect(current.answers['n11-02']).toEqual(previous.answers['n11-02'])
  expect(current.answers['n11-08']).toBeUndefined()
  expect(current.answers['n11-09']).toBeUndefined()
 })
})
