import { describe, expect, it } from 'vitest'
import { mathNumbersN11Unit, n11SourceToItemIds } from './n11Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit=mathNumbersN11Unit
const sec=unit.sections[0]
const at=(id:string)=>sec.readingFlow.findIndex(b=>b.id===id)
const item=(id:string)=>sec.items.find(i=>i.id===id)!

describe('W-MATH-017/P-008 N11 Q13 denominator cancellation and distribution',()=>{
 it('reuses original Q13 and Q14 source boundaries with four in-equation decisions',()=>{
  const ids=['n11-lead-13','n11-formula-13','n11-p008-q13-positive-explain',
    'n11-p008-q13-cancel','n11-p008-q13-distribute-explain','n11-p008-q13-result']
  const indices=ids.map(at)
  expect(indices.every(x=>x>=0)).toBe(true)
  expect(indices).toEqual(indices.map((_,i)=>indices[0]+i))
  const blocks=indices.map(i=>sec.readingFlow[i])
  expect(blocks.map(b=>b.type)).toEqual(['formula','formula','paragraph','formula','paragraph','formula'])
  expect(blocks.every(b=>(b.type==='formula'||b.type==='paragraph')&&b.derivationId==='n11-q13-chain')).toBe(true)
  const math=blocks.map(b=>b.type==='formula'?b.parts.filter(p=>p.type==='math').map(p=>p.latex):[])
  expect(math).toEqual([
    ['\\frac{x-2}{3}\\le2x+1'],
    ['\\cdot\\frac{x-2}{3}\\le','(2x+1)'],[],
    ['x-2\\le3(2x+1)'],[],['x-2\\le','x+'],
  ])
  const holes=blocks.map(b=>(b.type==='formula'||b.type==='paragraph')
    ?b.parts.filter(p=>p.type==='choice').map(p=>p.itemId):[])
  expect(holes).toEqual([[],
    ['n11-p008-q13-mul-left','n11-p008-q13-mul-right'],[],[],
    [],['n11-13','n11-p008-q13-constant']])
  expect(JSON.stringify(blocks[2])).toContain('3は正の数なので、不等号の向きは変わらない')
  expect(JSON.stringify(blocks[4])).toContain('二つの項それぞれに外側の3を掛けて')
  expect(JSON.stringify(blocks.slice(0,5))).not.toContain('6x+3')
  expect(at('n11-after-13')).toBe(indices[5]+1)
  expect(at('n11-lead-wm013-q14-xcoef')).toBeGreaterThan(at('n11-after-13'))
  expect(at('n11-p006-q05-cancel-explain')).toBeGreaterThan(0)
  expect(at('n11-p007-q08-explain')).toBeGreaterThan(0)
  expect(unit.revision).toBe(10)
  expect(sec.items).toHaveLength(31)
  expect(Object.keys(n11SourceToItemIds)).toHaveLength(14)
  expect(sec.items.map(i=>i.id)).toEqual(Object.values(n11SourceToItemIds).flat())
  expect(n11SourceToItemIds['N11-Q13']).toEqual([
    'n11-p008-q13-mul-left','n11-p008-q13-mul-right','n11-13','n11-p008-q13-constant'])
 })
 it('grades only the actual four operations and mathematically preserves ≤',()=>{
  const ids=['n11-p008-q13-mul-left','n11-p008-q13-mul-right','n11-13','n11-p008-q13-constant']
  expect(ids.map(i=>item(i).answer)).toEqual(['3','3','6','3'])
  for(const id of ids){
    expect(item(id).choices).toHaveLength(4)
    expect(new Set(item(id).choices).size).toBe(4)
    expect(item(id).choices).toContain(item(id).answer)
  }
  for(const x of [-5,-1,0,1,4]){
    expect((x-2)/3<=2*x+1).toBe(x-2<=3*(2*x+1))
    expect(x-2<=3*(2*x+1)).toBe(x-2<=6*x+3)
  }
  expect(item('n11-wm013-q14-xcoef').answer).toBe('5')
  expect(item('n11-wm013-q14-const').answer).toBe('-5')
  expect(item('n11-14').answer).toBe('x\\ge-1')
 })
 const mk=(id:string,value:string):TextbookAnswerRecord=>({
  itemId:id,value,firstValue:value,isFirstCorrect:true,resolved:true,attemptCount:1,
  firstAnsweredAt:100,lastAnsweredAt:200,
 })
 it('archives complete revision9 before reopening only n11-13',()=>{
  const previous:TextbookUnitProgress={
   unitId:unit.unitId,unitRevision:9,startedAt:40,updatedAt:200,completedAt:220,
   answers:{
    'n11-01':mk('n11-01','>'),'n11-05':mk('n11-05','7'),
    'n11-08':mk('n11-08','2'),'n11-09':mk('n11-09','-1'),
    'n11-11':mk('n11-11','-4x\\ge-26'),
    'n11-13':mk('n11-13','\\text{両辺に正の}3\\text{を掛ける},\\quad x-2\\le6x+3'),
    'n11-wm013-q14-xcoef':mk('n11-wm013-q14-xcoef','5'),
    'n11-14':mk('n11-14','x\\ge-1'),
   },
  }
  const next=effectiveTextbookProgress(unit,previous)!
  expect(next.unitRevision).toBe(10)
  expect(next.migratedFromRevision).toBe(9)
  expect(next.startedAt).toBe(previous.startedAt)
  expect(next.completedAt).toBeUndefined()
  expect(next.previousRevisionCompletedAt).toBe(220)
  expect(next.archivedRevisions?.['9']?.answers).toEqual(previous.answers)
  expect(next.archivedRevisions?.['9']?.completedAt).toBe(220)
  for(const id of Object.keys(previous.answers).filter(id=>id!=='n11-13')){
    expect(next.answers[id]).toEqual(previous.answers[id])
  }
  for(const id of ['n11-13','n11-p008-q13-mul-left','n11-p008-q13-mul-right','n11-p008-q13-constant'])
    expect(next.answers[id]).toBeUndefined()
  expect(effectiveTextbookProgress(unit,next)).toBe(next)
 })
 it('preserves all successive archives migrating from revision3 to revision10',()=>{
  const prev:TextbookUnitProgress={unitId:unit.unitId,unitRevision:3,startedAt:40,updatedAt:200,
    answers:{'n11-02':mk('n11-02','b-a'),'n11-13':mk('n11-13','old13')}}
  const next=effectiveTextbookProgress(unit,prev)!
  expect(next.unitRevision).toBe(10)
  for(const rev of ['3','4','5','6','7','8','9'])expect(next.archivedRevisions?.[rev]).toBeDefined()
  expect(next.answers['n11-02']).toEqual(prev.answers['n11-02'])
  expect(next.answers['n11-13']).toBeUndefined()
 })
})
