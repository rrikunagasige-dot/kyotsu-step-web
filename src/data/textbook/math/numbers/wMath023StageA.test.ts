import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { mathNumbersN13Unit, n13SourceToItemIds } from './n13Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit = mathNumbersN13Unit
const section = unit.sections[0]
const findItem = (id: string) => section.items.find(i => i.id === id)!
const at = (id: string) => section.readingFlow.findIndex(b => b.id === id)
const rec = (id: string, value = 'old value'): TextbookAnswerRecord => ({
  itemId:id, value, firstValue:value, resolved:true, isFirstCorrect:true,
  attemptCount:1, firstAnsweredAt:101, lastAnsweredAt:202,
})

describe('W-MATH-023/P-002 Stage A regression after Stage B acceptance',()=>{
  it('preserves nine original Word questions, ten independent graded steps and original diagrams',()=>{
    expect(unit.revision).toBe(4)
    expect(Object.keys(n13SourceToItemIds)).toEqual(
      Array.from({length:9},(_,i)=>'N13-Q'+String(i+1).padStart(2,'0')),
    )
    expect(n13SourceToItemIds['N13-Q05']).toEqual(['n13-wm023-q05-right','n13-05'])
    expect(section.items).toHaveLength(12)
    expect(section.items.map(i=>i.id)).toEqual(Object.values(n13SourceToItemIds).flat())
    expect(section.figures.map(f=>f.id)).toEqual(['n13-f02','n13-f01'])
    expect(at('n13-show-n13-f01')).toBeLessThan(at('n13-lead-05'))
    expect(at('n13-group-2')+1).toBe(at('n13-lead-05'))
    expect(at('n13-lead-05')+1).toBe(at('n13-wm023-q05-right'))
    expect(at('n13-wm023-q05-right')+1).toBe(at('n13-formula-05'))
    expect(at('n13-formula-05')+1).toBe(at('n13-after-05'))
    const flowItems=section.readingFlow.flatMap(b=>
      b.type==='paragraph'||b.type==='formula' ? b.parts.flatMap(p=>p.type==='choice'?[p.itemId]:[]):[],
    )
    expect(flowItems).toEqual(section.items.map(i=>i.id))
    expect(section.readingFlow[at('n13-formula-08')].type).toBe('formula')
  })

  it('Q05 two cases grade distance expressions without leaking exact answers in wrong hints',()=>{
    const right=findItem('n13-wm023-q05-right')
    const left=findItem('n13-05')
    expect(right.answer).toBe('x-1')
    expect(left.answer).toBe('1-x')
    expect(right.choices).toEqual(['x-1','1-x','x+1','-1-x'])
    expect(left.choices).toEqual(['1-x','x-1','1+x','-1-x'])
    for(const item of [right,left]){
      expect(item.answerType).toBe('formula')
      expect(item.choices?.length).toBe(4)
      expect(new Set(item.choices).size).toBe(4)
      expect(item.choices?.filter(v=>v===item.answer)).toHaveLength(1)
      for(const choice of item.choices ?? [])expect(()=>katex.renderToString(choice,{throwOnError:true})).not.toThrow()
      expect(item.hints).toHaveLength(1)
      expect(item.hints[0]).not.toContain('右側ではx−1、左側では1−x')
    }
    const math = section.readingFlow.slice(at('n13-lead-05'),at('n13-after-05')).flatMap(b=>
      b.type==='paragraph'||b.type==='formula' ? b.parts.filter(p=>p.type==='math'):[],
    )
    for(const p of math)if(p.type==='math')
      expect(()=>katex.renderToString(p.latex,{throwOnError:true,strict:'ignore'})).not.toThrow()
    expect(section.readingFlow[at('n13-after-05')]).toMatchObject({
      type:'paragraph',parts:[{type:'text',text:'x≥1ならx−1≥0、x<1なら1−x>0。どちらも二点間の距離として負にならない。'}],
    })
    expect(Math.abs(3-1)).toBe(2)
    expect(3-1).toBe(2)
    expect(Math.abs(0-1)).toBe(1)
    expect(1-0).toBe(1)
  })

  it('Stage A Q05 remains identical while Q08 now has three separate decisions',()=>{
    expect(n13SourceToItemIds['N13-Q05']).toEqual(['n13-wm023-q05-right','n13-05'])
    expect(n13SourceToItemIds['N13-Q08']).toEqual(['n13-wm023-q08-branches','n13-wm023-q08-positive-root','n13-08'])
    expect(findItem('n13-08').answer).toBe('-2')
  })

  it('archives v2 completed evidence while clearing only rekeyed n13-05 (not existing n13-08)',()=>{
    const answers=Object.fromEntries(Array.from({length:9},(_,i)=>{
      const id='n13-'+String(i+1).padStart(2,'0')
      return [id,rec(id,id==='n13-05'?'old combined':id==='n13-08'?'old Q08':'preserve')]
    }))
    const old: TextbookUnitProgress = {
      unitId:unit.unitId,unitRevision:2,startedAt:90,updatedAt:205,completedAt:209,answers,
      archivedRevisions:{'1':{unitRevision:1,startedAt:1,updatedAt:3,answers:{'n13-08':rec('n13-08','rev1 bundled')}}},
    }
    const now=effectiveTextbookProgress({...unit,revision:3},old)!
    expect(now.unitRevision).toBe(3)
    expect(now.completedAt).toBeUndefined()
    expect(now.previousRevisionCompletedAt).toBe(209)
    expect(now.startedAt).toBe(90)
    expect(now.migratedFromRevision).toBe(2)
    expect(now.archivedRevisions?.['1']).toEqual(old.archivedRevisions?.['1'])
    expect(now.archivedRevisions?.['2']?.answers).toEqual(answers)
    expect(now.archivedRevisions?.['2']?.completedAt).toBe(209)
    expect(now.answers['n13-05']).toBeUndefined()
    expect(now.answers['n13-wm023-q05-right']).toBeUndefined()
    expect(now.answers['n13-08']).toEqual(answers['n13-08'])
    for(const id of Object.keys(answers).filter(id=>id!=='n13-05'))
      expect(now.answers[id]).toEqual(answers[id])
    expect(effectiveTextbookProgress({...unit,revision:3},now)).toBe(now)
  })

  it('chains v1→v2 historical R5 before v2→v3 with both old archives retained',()=>{
    const previous:TextbookUnitProgress={
      unitId:unit.unitId,unitRevision:1,startedAt:1,updatedAt:2,completedAt:3,
      answers:{'n13-03':rec('n13-03','keep'),'n13-05':rec('n13-05','old Q05'),'n13-08':rec('n13-08','old Q08')},
    }
    const now=effectiveTextbookProgress({...unit,revision:3},previous)!
    expect(now.unitRevision).toBe(3)
    expect(now.answers['n13-03']).toEqual(previous.answers['n13-03'])
    expect(now.answers['n13-05']).toBeUndefined()
    expect(now.answers['n13-08']).toBeUndefined() // v1 Q08 was already rekeyed by accepted R5
    expect(now.archivedRevisions?.['1']?.answers).toEqual(previous.answers)
    expect(now.archivedRevisions?.['2']).toBeDefined()
    expect(now.previousRevisionCompletedAt).toBe(3)
    expect(effectiveTextbookProgress(unit,now)).toBe(now)
  })
})
