import { describe, expect, it } from 'vitest'
import { mathNumbersN14Unit, n14SourceToItemIds } from './n14Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit=mathNumbersN14Unit
const sec=unit.sections[0]
const at=(id:string)=>sec.readingFlow.findIndex(b=>b.id===id)
const find=(id:string)=>sec.items.find(x=>x.id===id)!

describe('W-MATH-018/P-001 N14 Q10 source-cognitive correction and archived history',()=>{
 it('renders exact THREE math lines + ONE independent reason and five in-math choices',()=>{
   const ids=['n14-lead-10','n14-formula-10','n14-wm018-q10-explain','n14-wm018-q10-result']
   const p=ids.map(at)
   expect(p.every(x=>x>=0)).toBe(true)
   expect(p).toEqual(p.map((_,i)=>p[0]+i))
   const blocks=p.map(i=>sec.readingFlow[i])
   expect(blocks.map(x=>x.type)).toEqual(['formula','formula','paragraph','formula'])
   expect(blocks.every(x=>(x.type==='formula'||x.type==='paragraph')&&x.derivationId==='n14-q10-chain')).toBe(true)
   const math=blocks.map(x=>x.type==='formula'?x.parts.filter(z=>z.type==='math').map(z=>z.latex):[])
   expect(math).toEqual([['-5<x-3<5'],['-5+','<x-3+','<5+'],[],['<x<']])
   const choice=blocks.map(x=>(x.type==='formula'||x.type==='paragraph')?x.parts.filter(z=>z.type==='choice').map(z=>z.itemId):[])
   expect(choice).toEqual([[],['n14-wm018-q10-add-left','n14-wm018-q10-add-center','n14-wm018-q10-add-right'],[],['n14-10','n14-wm018-q10-bound-right']])
   expect(JSON.stringify(blocks[2])).toContain('三辺に同じ数を足しても')
   expect(JSON.stringify(blocks[2])).toContain('向きは変わらない')
   expect(JSON.stringify(blocks[2])).not.toContain('−5+3=−2')
   expect(JSON.stringify(blocks[2])).not.toContain('5+3=8')
   expect(at('n14-after-09')).toBe(p[0]-1)
   expect(at('n14-after-10')).toBe(p[3]+1)
   expect(at('n14-lead-11')).toBeGreaterThan(at('n14-after-10'))
   expect(at('n14-formula-wm014-q07-nonnegative')).toBeGreaterThan(0)
   expect(at('n14-formula-wm015-q08-negative')).toBeGreaterThan(0)
   expect(at('n14-formula-wm016-q12-left')).toBeGreaterThan(at('n14-lead-11'))
   expect(sec.figures).toHaveLength(1)
   expect(sec.figures[0].id).toBe('n14-f01')
   expect(unit.revision).toBe(9)
   expect(sec.items).toHaveLength(34)
   expect(Object.keys(n14SourceToItemIds)).toHaveLength(16)
   expect(sec.items.map(x=>x.id)).toEqual(Object.values(n14SourceToItemIds).flat())
 })
 it('keeps five separate non-leaking decisions and strict inequalities',()=>{
   const ids=n14SourceToItemIds['N14-Q10']
   expect(ids).toEqual(['n14-wm018-q10-add-left','n14-wm018-q10-add-center','n14-wm018-q10-add-right','n14-10','n14-wm018-q10-bound-right'])
   expect(ids.map(id=>find(id).answer)).toEqual(['3','3','3','-2','8'])
   for(const id of ids){
     expect(find(id).choices).toHaveLength(4)
     expect(new Set(find(id).choices).size).toBe(4)
     expect(find(id).choices).toContain(find(id).answer)
   }
   for(const x of [-20,-2.1,-2,-1.9,0,7.9,8,8.1]){
     expect(-5<x-3&&x-3<5).toBe(-2<x&&x<8)
   }
 })
 const mk=(id:string,value:string):TextbookAnswerRecord=>({
   itemId:id,value,firstValue:value,isFirstCorrect:true,resolved:true,attemptCount:2,
   firstAnsweredAt:100,lastAnsweredAt:200,
 })
 it('revision6→7 preserves all answers except repurposed n14-10 and snapshots v6 attempts',()=>{
   const prev:TextbookUnitProgress={
     unitId:unit.unitId,unitRevision:6,startedAt:50,updatedAt:200,completedAt:220,
     previousRevisionCompletedAt:120,
     answers:{
       'n14-01':mk('n14-01','old'),
       'n14-wm014-q07-nonnegative':mk('n14-wm014-q07-nonnegative','0\\le X<a'),
       'n14-wm015-q08-negative':mk('n14-wm015-q08-negative','X<-a'),
       'n14-08':mk('n14-08','old'),
       'n14-09':mk('n14-09','-5<x-3<5'),
       'n14-10':mk('n14-10','\\text{三辺に}3\\text{を足す},\\quad-2<x<8'),
       'n14-wm016-q12-left':mk('n14-wm016-q12-left','x\\le-5'),
       'n14-wm016-q12-right':mk('n14-wm016-q12-right','x\\ge-1'),
       'n14-12':mk('n14-12','old'),
       'n14-14':mk('n14-14','old'),
       'n14-15':mk('n14-15','old'),
     },
   }
   const now=effectiveTextbookProgress({...unit,revision:7},prev)!
   expect(now.unitRevision).toBe(7)
   expect(now.migratedFromRevision).toBe(6)
   expect(now.completedAt).toBeUndefined()
   expect(now.previousRevisionCompletedAt).toBe(220)
   expect(now.archivedRevisions?.['6']?.answers).toEqual(prev.answers)
   expect(now.archivedRevisions?.['6']?.completedAt).toBe(220)
   for(const id of Object.keys(prev.answers).filter(x=>x!=='n14-10')) expect(now.answers[id]).toEqual(prev.answers[id])
   expect(now.answers['n14-10']).toBeUndefined()
   for(const id of n14SourceToItemIds['N14-Q10'].filter(x=>x!=='n14-10'))expect(now.answers[id]).toBeUndefined()
   expect(effectiveTextbookProgress({...unit,revision:7},now)).toBe(now)
 })
 it('preserves complete archival ladder from revisions 1–6 into revision7',()=>{
   const previous:TextbookUnitProgress={
     unitId:unit.unitId,unitRevision:1,startedAt:50,updatedAt:100,
     answers:{'n14-02':mk('n14-02','-3,3'),'n14-10':mk('n14-10','old')},
   }
   const next=effectiveTextbookProgress({...unit,revision:7},previous)!
   expect(next.unitRevision).toBe(7)
   for(const r of ['1','2','3','4','5','6'])expect(next.archivedRevisions?.[r]).toBeDefined()
   expect(next.answers['n14-02']).toEqual(previous.answers['n14-02'])
   expect(next.answers['n14-10']).toBeUndefined()
 })
})
