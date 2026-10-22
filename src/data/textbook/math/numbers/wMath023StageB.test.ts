import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { mathNumbersN13Unit, n13SourceToItemIds } from './n13Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit=mathNumbersN13Unit
const section=unit.sections[0]
const at=(id:string)=>section.readingFlow.findIndex(b=>b.id===id)
const item=(id:string)=>section.items.find(i=>i.id===id)!
const ids=['n13-wm023-q08-branches','n13-wm023-q08-positive-root','n13-08']
const record=(id:string,v:string):TextbookAnswerRecord=>({
  itemId:id,value:v,firstValue:v,resolved:true,isFirstCorrect:true,
  attemptCount:1,firstAnsweredAt:100,lastAnsweredAt:200,
})

describe('W-MATH-023/P-002 Stage B N13 Q08 sign split and two roots',()=>{
  it('keeps 9 original questions, original 2 diagrams, Q05 approved keys, and exactly 12 choice steps',()=>{
    expect(unit.revision).toBe(4)
    expect(Object.keys(n13SourceToItemIds)).toHaveLength(9)
    expect(n13SourceToItemIds['N13-Q05']).toEqual(['n13-wm023-q05-right','n13-05'])
    expect(n13SourceToItemIds['N13-Q08']).toEqual(ids)
    expect(section.figures.map(f=>f.id)).toEqual(['n13-f02','n13-f01'])
    expect(section.items).toHaveLength(12)
    expect(section.items.map(i=>i.id)).toEqual(Object.values(n13SourceToItemIds).flat())
    const flowChoices=section.readingFlow.flatMap(b=>
      b.type==='formula'||b.type==='paragraph'
        ? b.parts.flatMap(p=>p.type==='choice'?[p.itemId]:[]) : [])
    expect(flowChoices).toEqual(section.items.map(i=>i.id))
    expect(at('n13-after-07')+1).toBe(at('n13-lead-08'))
    expect(at('n13-lead-08')+1).toBe(at('n13-formula-08'))
    expect(at('n13-formula-08')+1).toBe(at('n13-wm023-q08-positive-root'))
    expect(at('n13-wm023-q08-positive-root')+1).toBe(at('n13-wm023-q08-negative-root'))
    expect(at('n13-wm023-q08-negative-root')+1).toBe(at('n13-after-08'))
    expect(at('n13-after-08')+1).toBe(at('n13-lead-09'))
    for(const block of section.readingFlow.slice(at('n13-lead-08'),at('n13-after-08')))
      expect(block.type==='paragraph'||block.type==='formula' ? block.derivationId : '').toBe('n13-q08-chain')
    expect(item('n13-wm023-q05-right').answer).toBe('x-1')
    expect(item('n13-05').answer).toBe('1-x')
  })

  it('grades sign alternatives, then each root separately, with non-revealing wrong-only hints',()=>{
    expect(ids.map(id=>item(id).answer)).toEqual(['3x=6\\;\\text{または}\\;3x=-6','2','-2'])
    expect(ids.map(id=>item(id).answerType)).toEqual(['formula','formula','formula'])
    for(const id of ids){
      const q=item(id),options=q.choices??[]
      expect(options).toHaveLength(4)
      expect(new Set(options).size).toBe(4)
      expect(options.filter(v=>v===q.answer)).toHaveLength(1)
      expect(q.hints).toHaveLength(1)
      expect(q.hints[0]).not.toContain('3x=6か3x=−6かを解く。')
      for(const v of options)expect(()=>katex.renderToString(v,{throwOnError:true,strict:'ignore'}),id).not.toThrow()
    }
    expect(item(ids[0]).choices).toEqual([
      '3x=6\\;\\text{または}\\;3x=-6',
      '3x=6\\;\\text{かつ}\\;3x=-6','3x=6','3x=-6',
    ])
    expect(item(ids[1]).choices).toEqual(['2','-2','6','\\frac12'])
    expect(item(ids[2]).choices).toEqual(['-2','2','-6','-\\frac12'])
    const math=section.readingFlow.slice(at('n13-lead-08'),at('n13-after-08')+1)
      .flatMap(b=>b.type==='formula'||b.type==='paragraph'?b.parts.filter(p=>p.type==='math'):[])
    for(const p of math)if(p.type==='math')
      expect(()=>katex.renderToString(p.latex,{throwOnError:true,strict:'ignore'})).not.toThrow()
    expect(Math.abs(3*2)).toBe(6)
    expect(Math.abs(3*(-2))).toBe(6)
    expect(item(ids[2]).answer).not.toContain('3x=6') // old bundled answer cannot pass the final root
  })

  it('archives accepted rev3 Q05 and earlier rev1/2 without auto-grading re-keyed old n13-08',()=>{
    const answers=Object.fromEntries([
      ['n13-01',record('n13-01','previous')],
      ['n13-04',record('n13-04','previous')],
      ['n13-wm023-q05-right',record('n13-wm023-q05-right','x-1')],
      ['n13-05',record('n13-05','1-x')],
      ['n13-06',record('n13-06','previous')],
      ['n13-07',record('n13-07','previous')],
      ['n13-08',record('n13-08','old combined 3x=6...x=-2')],
      ['n13-09',record('n13-09','previous')],
    ])
    const previous:TextbookUnitProgress={
      unitId:unit.unitId,unitRevision:3,startedAt:80,updatedAt:205,completedAt:210,
      answers,archivedRevisions:{
        '1':{unitRevision:1,startedAt:1,updatedAt:10,answers:{'n13-08':record('n13-08','rev1')}},
        '2':{unitRevision:2,startedAt:11,updatedAt:75,answers:{'n13-05':record('n13-05','rev2')}},
      },
    }
    const current=effectiveTextbookProgress(unit,previous)!
    expect(current.unitRevision).toBe(4)
    expect(current.migratedFromRevision).toBe(3)
    expect(current.startedAt).toBe(80)
    expect(current.completedAt).toBeUndefined()
    expect(current.previousRevisionCompletedAt).toBe(210)
    expect(current.archivedRevisions?.['1']).toEqual(previous.archivedRevisions?.['1'])
    expect(current.archivedRevisions?.['2']).toEqual(previous.archivedRevisions?.['2'])
    expect(current.archivedRevisions?.['3']?.answers).toEqual(previous.answers)
    expect(current.archivedRevisions?.['3']?.completedAt).toBe(210)
    expect(current.answers['n13-08']).toBeUndefined()
    expect(current.answers['n13-wm023-q08-branches']).toBeUndefined()
    expect(current.answers['n13-wm023-q08-positive-root']).toBeUndefined()
    for(const id of Object.keys(answers).filter(id=>id!=='n13-08'))
      expect(current.answers[id]).toEqual(answers[id])
    expect(effectiveTextbookProgress(unit,current)).toBe(current)
  })

  it('chains accepted R5 v1→v2, Q05 v2→v3, Q08 v3→v4 for all older states',()=>{
    for(let v=1;v<=3;v++){
      const old:TextbookUnitProgress={unitId:unit.unitId,unitRevision:v,startedAt:1,updatedAt:2,
        answers:{'n13-01':record('n13-01','keep'),
          'n13-05':record('n13-05',v===3?'1-x':'old paired'),
          'n13-08':record('n13-08','old combined'),
          ...(v===3?{'n13-wm023-q05-right':record('n13-wm023-q05-right','x-1')}:{}),
        }}
      const now=effectiveTextbookProgress(unit,old)!
      expect(now.unitRevision).toBe(4)
      expect(now.answers['n13-01']).toEqual(old.answers['n13-01'])
      expect(now.answers['n13-08']).toBeUndefined()
      expect(now.answers['n13-wm023-q08-branches']).toBeUndefined()
      expect(now.answers['n13-wm023-q08-positive-root']).toBeUndefined()
      if(v===3){
        expect(now.answers['n13-05']).toEqual(old.answers['n13-05'])
        expect(now.answers['n13-wm023-q05-right']).toEqual(old.answers['n13-wm023-q05-right'])
      }else expect(now.answers['n13-05']).toBeUndefined()
      for(let k=v;k<=3;k++)expect(now.archivedRevisions?.[String(k)]).toBeDefined()
      expect(effectiveTextbookProgress(unit,now)).toBe(now)
    }
  })
})
