import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { mathTextbookUnits } from '../index'
import { isFirstThemeUnit, partitionFirstThemeReadingFlow, requiredFirstThemeContext } from '../presentation'
import type { TextbookUnit, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { effectiveTextbookProgress, answerTextbookItem, textbookUnitProgress, type TextbookUnitProgress } from '../../../../domain/textbook'
import { firstSectionTeachingPlans } from './firstSectionTeaching'
const baseline = JSON.parse(readFileSync('work/items/W-MATH-029-section-one-teaching/BASELINE.json','utf8')) as Record<string,TextbookUnit>
const units = mathTextbookUnits.filter(u=>isFirstThemeUnit(u.unitId))
const itemIds = (blocks:readonly TextbookReadingBlock[]) => blocks.flatMap(b=>b.type==='paragraph'||b.type==='formula'?b.parts.flatMap(p=>p.type==='choice'?[p.itemId]:[]):[])
describe('W-MATH-029 current complete section teaching edition',()=>{
  it('covers all42 audited regions, preserves sample explanation and solved equations, and protects the other nine numbers units',()=>{
    expect(units).toHaveLength(7)
    expect(Object.values(firstSectionTeachingPlans).reduce((n,p)=>n+p.auditedRegions.length,0)).toBe(42)
    for(const current of mathTextbookUnits) if(baseline[current.unitId]&&!isFirstThemeUnit(current.unitId)) expect(current,current.unitId).toEqual(baseline[current.unitId])
    const unit=units.find(u=>u.unitId.endsWith('-n01'))!
    const sample=(u:TextbookUnit)=>{const flow=u.sections[0].readingFlow;return flow.slice(flow.findIndex(b=>b.id==='marker-degree-check'))}
    const solved=(u:TextbookUnit,b:TextbookReadingBlock)=>b.type==='formula'||b.type==='paragraph'
      ? b.parts.map(p=>p.type==='math'?p.latex:p.type==='choice'?u.sections[0].items.find(q=>q.id===p.itemId)!.answer:p.text).join('')
      : 'text' in b?b.text:JSON.stringify(b)
    for(const old of sample(baseline[unit.unitId])) {
      const current=sample(unit).find(b=>b.id===old.id)!
      expect(current,old.id).toBeDefined()
      expect(solved(unit,current),old.id).toEqual(solved(baseline[unit.unitId],old))
    }
  })
  it.each(units)('$unitId preserves surviving mathematical contracts, archives retired IDs, and has a complete continuous partition',unit=>{
    const plan=firstSectionTeachingPlans[unit.unitId.split('-').at(-1)!]
    const section=unit.sections[0],old=baseline[unit.unitId]
    expect(Object.values(plan.sourceCoverage).flatMap(q=>q.activeItemIds).sort()).toEqual(section.items.map(q=>q.id).sort())
    for(const source of Object.values(plan.sourceCoverage)){expect(source.activeItemIds.length+source.workedBlockIds.length).toBeGreaterThan(0);for(const id of source.workedBlockIds)expect(section.readingFlow.some(b=>b.id===id)).toBe(true)}
    expect(unit.revision).toBe(old.revision+(plan.editionIncrement??1))
    expect(unit.sections[0].figures).toEqual(old.sections[0].figures)
    expect(unit.source).toEqual(old.source)
    const order=itemIds(section.readingFlow)
    expect(order).toEqual(section.items.map(q=>q.id));expect(new Set(order).size).toBe(order.length)
    for(const q of old.sections[0].items){
      const current=section.items.find(x=>x.id===q.id)
      if(plan.retiredItems.includes(q.id)){expect(current).toBeUndefined();continue}
      expect(current).toEqual({...q,prompt:plan.itemPrompts[q.id]??q.prompt})
    }
    const stages=partitionFirstThemeReadingFlow(unit.unitId,section.readingFlow)!
    expect(stages.flatMap(s=>s.blocks)).toEqual(section.readingFlow)
    const chains=new Map<string,number>()
    stages.forEach((stage,i)=>{
      expect(()=>requiredFirstThemeContext(stage,section.readingFlow)).not.toThrow()
      for(const b of stage.blocks) if('derivationId' in b&&b.derivationId){expect(chains.get(b.derivationId)??i,b.id).toBe(i);chains.set(b.derivationId,i)}
    })
    for(const b of section.readingFlow) if(b.type==='paragraph'||b.type==='formula') for(const p of b.parts) if(p.type==='math') expect(()=>katex.renderToString(p.latex,{throwOnError:true}),b.id).not.toThrow()
    for(const q of section.items) if(q.answerType==='formula') for(const c of q.choices!) expect(()=>katex.renderToString(c,{throwOnError:true}),q.id).not.toThrow()
  })
  it.each(units)('$unitId keeps the entire previous attempt and requires every new decision',unit=>{
    const old=baseline[unit.unitId]
    const progress:TextbookUnitProgress={unitId:unit.unitId,unitRevision:old.revision,startedAt:1,updatedAt:2,completedAt:3,answers:Object.fromEntries(old.sections[0].items.map(q=>[q.id,{itemId:q.id,value:q.answer,resolved:true,isFirstCorrect:true,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]))}
    let current=effectiveTextbookProgress(unit,progress)!
    expect(current.archivedRevisions?.[String(old.revision)].answers).toEqual(progress.answers)
    expect(current.completedAt).toBeUndefined()
    const added=unit.sections[0].items.filter(q=>!current.answers[q.id]);expect(added.length).toBeGreaterThan(0)
    for(const q of added){const before=textbookUnitProgress(unit,current).completed;current=answerTextbookItem(current,unit,q,q.choices!.find(c=>c!==q.answer)!,4);expect(textbookUnitProgress(unit,current).completed).toBe(before);current=answerTextbookItem(current,unit,q,q.answer,5)}
    expect(textbookUnitProgress(unit,current).completed).toBe(unit.sections[0].items.length)
  })
  it('enforces the exact temporal repairs rather than counting added paragraphs',()=>{
    const flow=(key:string)=>units.find(u=>u.unitId.endsWith('-'+key))!.sections[0].readingFlow
    const before=(key:string,a:string,b:string)=>{const f=flow(key);expect(f.findIndex(x=>x.id===a),a).toBeGreaterThanOrEqual(0);expect(f.findIndex(x=>x.id===a),a+' before '+b).toBeLessThan(f.findIndex(x=>x.id===b))}
    before('n02','n02-bridge-audit-twice-constant-formula','n02-bridge-minus-multiplier-formula')
    before('n04','n04-s4-square-result','n04-s4-product-heading')
    before('n06','n06-bridge-audit-constant-pair-formula','n06-bridge-constant-cross-formula')
    before('ne01','ne01-bridge-detail-quadratic-coefficient-formula','ne01-bridge-linear-number-formula')
    before('ne01','ne01-bridge-factor-difference-formula','ne01-s4-second-factor-heading')
    for(const [key,anchor,answer] of [['n04','n04-heading-2','差の平方'],['n04','n04-s4-product-heading','和と差の積'],['ne01','ne01-heading-12','3乗の差'],['ne01','ne01-s4-second-factor-heading','3乗の和']]) {
      const plan=firstSectionTeachingPlans[key];expect(plan.stages.find(([id])=>id===anchor)![1]).not.toContain(answer)
    }
    expect(flow('ne01').some(b=>b.id==='ne01-before-02-2')).toBe(false)
    expect(flow('ne01').some(b=>b.id==='ne01-result-07-1')).toBe(false)
    for(const id of ['ne01-lead-11','ne01-bridge-difference-substitute-lead']){
      const b=flow('ne01').find(b=>b.id===id)!
      expect(JSON.stringify(b)).not.toContain('差の3乗')
      expect(JSON.stringify(b)).toContain('3乗の差')
    }
  })
})
