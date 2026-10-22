import {describe,expect,it} from 'vitest'
import {mathNumbersN14Unit,n14SourceToItemIds} from './n14Lesson'
import {effectiveTextbookProgress,type TextbookAnswerRecord,type TextbookUnitProgress} from '../../../../domain/textbook'
const unit=mathNumbersN14Unit,sec=unit.sections[0]
const pos=(id:string)=>sec.readingFlow.findIndex(b=>b.id===id)
const item=(id:string)=>sec.items.find(i=>i.id===id)!
const record=(id:string,value:string):TextbookAnswerRecord=>({
  itemId:id,value,firstValue:value,isFirstCorrect:true,resolved:true,
  attemptCount:2,firstAnsweredAt:110,lastAnsweredAt:220,
})
describe('W-MATH-020/P-001 N14 Q15 source and guarded archive',()=>{
 it('keeps 16 source markers, 34 actions, Q14→Q15→Q16 and the original figure',()=>{
   expect(unit.revision).toBe(9)
   expect(Object.keys(n14SourceToItemIds)).toHaveLength(16)
   expect(sec.items).toHaveLength(34)
   expect(sec.items.map(i=>i.id)).toEqual(Object.values(n14SourceToItemIds).flat())
   const ids=['n14-lead-15','n14-formula-15','n14-wm020-q15-explain','n14-wm020-q15-result']
   const indices=ids.map(pos)
   expect(indices.every(x=>x>=0)).toBe(true)
   expect(indices).toEqual(indices.map((_,i)=>indices[0]+i))
   const b=indices.map(i=>sec.readingFlow[i])
   expect(b.map(v=>v.type)).toEqual(['formula','formula','paragraph','formula'])
   expect(b.every(v=>(v.type==='formula'||v.type==='paragraph')&&v.derivationId==='n14-q15-chain')).toBe(true)
   expect(b.map(v=>v.type==='formula'?v.parts.filter(p=>p.type==='math').map(p=>p.latex):[]))
     .toEqual([['-2\\le3x\\le6'],['-2\\div','\\le3x\\div','\\le6\\div'],[],['\\le x\\le']])
   expect(b.map(v=>(v.type==='formula'||v.type==='paragraph')?v.parts.filter(p=>p.type==='choice').map(p=>p.itemId):[]))
     .toEqual([[],['n14-wm020-q15-divide-left','n14-wm020-q15-divide-center','n14-wm020-q15-divide-right'],[],['n14-15','n14-wm020-q15-bound-right']])
   expect(JSON.stringify(b[2])).toContain('三辺を正の3で割っても')
   expect(JSON.stringify(b[2])).not.toContain('−2/3')
   expect(pos('n14-after-14')).toBe(indices[0]-1)
   expect(pos('n14-after-15')).toBe(indices[3]+1)
   expect(pos('n14-lead-16')).toBe(pos('n14-after-15')+1)
   expect(item('n14-16').answer).toBe('|-4|=4,\\quad|4|=4')
   expect(n14SourceToItemIds['N14-Q14']).toEqual(['n14-wm019-q14-add-left','n14-wm019-q14-add-center','n14-wm019-q14-add-right','n14-14','n14-wm019-q14-bound-right'])
   expect(n14SourceToItemIds['N14-Q10']).toHaveLength(5)
   expect(sec.figures.map(f=>f.id)).toEqual(['n14-f01'])
 })
 it('grades 3 positive divisors then two computed inclusive endpoints, no full result leak',()=>{
   const ids=n14SourceToItemIds['N14-Q15']
   expect(ids).toEqual(['n14-wm020-q15-divide-left','n14-wm020-q15-divide-center','n14-wm020-q15-divide-right','n14-15','n14-wm020-q15-bound-right'])
   expect(ids.map(id=>item(id).answer)).toEqual(['3','3','3','-\\frac23','2'])
   for(const id of ids){
     expect(item(id).choices).toHaveLength(4)
     expect(new Set(item(id).choices).size).toBe(4)
     expect(item(id).choices).toContain(item(id).answer)
   }
   for(let i=-120;i<=120;i++){
     const x=i/15
     expect(-2<=3*x&&3*x<=6).toBe(-2/3<=x&&x<=2)
   }
   expect(JSON.stringify(sec.readingFlow.slice(pos('n14-lead-15'),pos('n14-wm020-q15-result')))).not.toContain('\\\\frac23')
 })
 it('preserves unchanged approved answers and snapshots all v8 history, reopening only n14-15',()=>{
   const previous:TextbookUnitProgress={
     unitId:unit.unitId,unitRevision:8,startedAt:55,updatedAt:230,completedAt:245,
     answers:{
       'n14-01':record('n14-01','old'),
       'n14-10':record('n14-10','-2'),
       'n14-wm019-q14-add-center':record('n14-wm019-q14-add-center','2'),
       'n14-14':record('n14-14','-2'),
       'n14-wm019-q14-bound-right':record('n14-wm019-q14-bound-right','6'),
       'n14-15':record('n14-15','\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23\\le x\\le2'),
       'n14-16':record('n14-16','|-4|=4,\\quad|4|=4'),
     },
   }
   const now=effectiveTextbookProgress(unit,previous)!
   expect(now.unitRevision).toBe(9)
   expect(now.migratedFromRevision).toBe(8)
   expect(now.completedAt).toBeUndefined()
   expect(now.previousRevisionCompletedAt).toBe(245)
   expect(now.archivedRevisions?.['8']?.answers).toEqual(previous.answers)
   expect(now.archivedRevisions?.['8']?.completedAt).toBe(245)
   for(const id of Object.keys(previous.answers).filter(id=>id!=='n14-15'))
     expect(now.answers[id]).toEqual(previous.answers[id])
   for(const id of n14SourceToItemIds['N14-Q15'])expect(now.answers[id]).toBeUndefined()
   expect(effectiveTextbookProgress(unit,now)).toBe(now)
 })
 it('W-MATH-021 P-001 guides the incorrect center divisor without directly giving 3x÷3=x',()=>{
   const center=item('n14-wm020-q15-divide-center')
   const afterWrong='係数を1にする方法を、まず小さい数で考えよう。① 2×□=1 の□には何が入る？ ② 3×□=1 では？ ③ 同じ考え方で、3x×□=x の□には何が入る？ ④ この掛け算を割り算に直すと、3x÷□=x の□には何が入る？'
   expect(center.answer).toBe('3')
   expect(center.choices).toEqual(['3','-3','1','6'])
   expect(center.hints).toEqual([afterWrong])
   const examples=['2×□=1','3×□=1','3x×□=x','3x÷□=x']
   const positions=examples.map(example=>afterWrong.indexOf(example))
   expect(positions.every(n=>n>=0)).toBe(true)
   expect(positions).toEqual([...positions].sort((a,b)=>a-b))
   expect(center.hints.join('')).not.toContain('3x÷3=x')
   expect(sec.items.find(i=>i.id==='n14-wm020-q15-divide-left')?.answer).toBe('3')
   expect(sec.items.find(i=>i.id==='n14-wm020-q15-divide-right')?.answer).toBe('3')
   expect(unit.revision).toBe(9)
   expect(sec.items).toHaveLength(34)
 })
 it('normalizes ancient revision 1 into 9 without resurrecting old combined keys',()=>{
   const first:TextbookUnitProgress={
     unitId:unit.unitId,unitRevision:1,startedAt:11,updatedAt:21,completedAt:31,
     answers:{'n14-01':record('n14-01','old'),'n14-10':record('n14-10','old'),'n14-14':record('n14-14','old'),
       'n14-15':record('n14-15','old'),'n14-16':record('n14-16','old')},
   }
   const now=effectiveTextbookProgress(unit,first)!
   expect(now.unitRevision).toBe(9)
   for(let rev=1;rev<=8;rev++)expect(now.archivedRevisions?.[String(rev)]).toBeDefined()
   expect(now.answers['n14-01']).toEqual(first.answers['n14-01'])
   expect(now.answers['n14-10']).toBeUndefined()
   expect(now.answers['n14-14']).toBeUndefined()
   expect(now.answers['n14-15']).toBeUndefined()
   expect(now.archivedRevisions?.['1']?.answers['n14-15']).toEqual(first.answers['n14-15'])
   expect(now.answers['n14-16']).toEqual(first.answers['n14-16'])
 })
})
