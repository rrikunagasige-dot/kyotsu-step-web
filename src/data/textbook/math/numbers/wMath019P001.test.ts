import { describe, expect, it } from 'vitest'
import { mathNumbersN14Unit, n14SourceToItemIds } from './n14Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit=mathNumbersN14Unit
const section=unit.sections[0]
const at=(id:string)=>section.readingFlow.findIndex(b=>b.id===id)
const item=(id:string)=>section.items.find(i=>i.id===id)!

const record=(itemId:string,value:string):TextbookAnswerRecord=>({
  itemId,value,firstValue:value,isFirstCorrect:true,resolved:true,
  attemptCount:2,firstAnsweredAt:100,lastAnsweredAt:200,
})

describe('W-MATH-019/P-001 N14 Q14: original three inequalities, reason and five local choices',()=>{
  it('inserts only the N14 Q14 source block between unchanged Q13 and Q15',()=>{
    expect(unit.revision).toBe(8)
    expect(Object.keys(n14SourceToItemIds)).toHaveLength(16)
    expect(section.items).toHaveLength(30)
    expect(section.items.map(i=>i.id)).toEqual(Object.values(n14SourceToItemIds).flat())
    const ids=['n14-lead-14','n14-formula-14','n14-wm019-q14-explain','n14-wm019-q14-result']
    const atIds=ids.map(at)
    expect(atIds.every(n=>n>=0)).toBe(true)
    expect(atIds).toEqual(atIds.map((_,i)=>atIds[0]+i))
    const blocks=atIds.map(i=>section.readingFlow[i])
    expect(blocks.map(b=>b.type)).toEqual(['formula','formula','paragraph','formula'])
    expect(blocks.every(b=>(b.type==='formula'||b.type==='paragraph')&&b.derivationId==='n14-q14-chain')).toBe(true)
    const math=blocks.map(b=>b.type==='formula'?b.parts.filter(p=>p.type==='math').map(p=>p.latex):[])
    expect(math).toEqual([['-4\\le3x-2\\le4'],['-4+','\\le3x-2+','\\le4+'],[],['\\le3x\\le']])
    const choices=blocks.map(b=>(b.type==='formula'||b.type==='paragraph')?b.parts.filter(p=>p.type==='choice').map(p=>p.itemId):[])
    expect(choices).toEqual([[],['n14-wm019-q14-add-left','n14-wm019-q14-add-center','n14-wm019-q14-add-right'],[],['n14-14','n14-wm019-q14-bound-right']])
    expect(JSON.stringify(blocks[2])).toContain('中央の−2と＋2')
    expect(JSON.stringify(blocks[2])).not.toContain('−4+2=−2')
    expect(JSON.stringify(blocks[2])).not.toContain('4+2=6')
    expect(at('n14-after-13')).toBe(atIds[0]-1)
    expect(at('n14-after-14')).toBe(atIds[3]+1)
    expect(at('n14-lead-15')).toBe(at('n14-after-14')+1)
    expect(item('n14-15').answer).toBe('\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23\\le x\\le2')
    expect(at('n14-wm018-q10-result')).toBeGreaterThan(0)
    expect(at('n14-wm016-q12-left')).toBeGreaterThan(0)
    expect(section.figures.map(f=>f.id)).toEqual(['n14-f01'])
  })
  it('requires all 3 additions and both endpoint calculations, with no leaked complete result',()=>{
    const ids=n14SourceToItemIds['N14-Q14']
    expect(ids).toEqual(['n14-wm019-q14-add-left','n14-wm019-q14-add-center','n14-wm019-q14-add-right','n14-14','n14-wm019-q14-bound-right'])
    expect(ids.map(id=>item(id).answer)).toEqual(['2','2','2','-2','6'])
    for(const id of ids){
      expect(item(id).choices).toHaveLength(4)
      expect(new Set(item(id).choices).size).toBe(4)
      expect(item(id).choices).toContain(item(id).answer)
    }
    for(const x of [-20,-2,0,2,6,20]){
      expect(-4<=3*x-2&&3*x-2<=4).toBe(-2<=3*x&&3*x<=6)
    }
  })
  it('archives v7 and reopens only old compound n14-14, never prior approved Q10 or Q12',()=>{
    const prev:TextbookUnitProgress={
      unitId:unit.unitId,unitRevision:7,startedAt:50,updatedAt:200,completedAt:230,
      answers:{
        'n14-01':record('n14-01','original'),
        'n14-wm018-q10-add-left':record('n14-wm018-q10-add-left','3'),
        'n14-10':record('n14-10','-2'),
        'n14-wm018-q10-bound-right':record('n14-wm018-q10-bound-right','8'),
        'n14-wm016-q12-left':record('n14-wm016-q12-left','x\\le-5'),
        'n14-12':record('n14-12','original'),
        'n14-14':record('n14-14','\\text{三辺に}2\\text{を足す},\\quad-2\\le3x\\le6'),
        'n14-15':record('n14-15','original'),
      },
    }
    const now=effectiveTextbookProgress(unit,prev)!
    expect(now.unitRevision).toBe(8)
    expect(now.migratedFromRevision).toBe(7)
    expect(now.completedAt).toBeUndefined()
    expect(now.previousRevisionCompletedAt).toBe(230)
    expect(now.archivedRevisions?.['7']?.answers).toEqual(prev.answers)
    expect(now.archivedRevisions?.['7']?.completedAt).toBe(230)
    for(const id of Object.keys(prev.answers).filter(id=>id!=='n14-14'))expect(now.answers[id]).toEqual(prev.answers[id])
    for(const id of n14SourceToItemIds['N14-Q14'])expect(now.answers[id]).toBeUndefined()
    expect(effectiveTextbookProgress(unit,now)).toBe(now)
  })
  it('migrates historical revisions 1–7 into v8 without resetting unrelated resolved answers',()=>{
    const previous:TextbookUnitProgress={
      unitId:unit.unitId,unitRevision:1,startedAt:50,updatedAt:100,completedAt:110,
      answers:{
        'n14-02':record('n14-02','-3,3'),
        'n14-10':record('n14-10','old compound'),
        'n14-14':record('n14-14','old compound'),
        'n14-15':record('n14-15','original unchanged'),
      },
    }
    const now=effectiveTextbookProgress(unit,previous)!
    expect(now.unitRevision).toBe(8)
    for(const rev of ['1','2','3','4','5','6','7'])expect(now.archivedRevisions?.[rev]).toBeDefined()
    expect(now.answers['n14-02']).toEqual(previous.answers['n14-02'])
    expect(now.answers['n14-14']).toBeUndefined()
    expect(now.answers['n14-10']).toBeUndefined() // prior Q10 semantics were already re-keyed at rev7
    expect(now.answers['n14-15']).toEqual(previous.answers['n14-15'])
    expect(now.archivedRevisions?.['7']?.answers['n14-15']).toEqual(previous.answers['n14-15'])
  })
})
