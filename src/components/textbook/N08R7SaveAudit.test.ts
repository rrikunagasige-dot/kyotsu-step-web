import { describe, expect, it } from 'vitest'
import { validateTextbookUnits, type TextbookUnit } from '../../domain/textbookSchema'
import { answerTextbookConstruction, answerTextbookConstructionV2, answerTextbookItem, effectiveTextbookProgress, resetTextbookUnitProgress, textbookUnitProgress, type TextbookUnitProgress } from '../../domain/textbook'
import r7 from '../../data/textbook/math/numbers/n08Revision7.json'
import r6 from '../../data/textbook/math/numbers/n08Revision6.json'
import r5 from '../../data/textbook/math/numbers/n08Revision5.json'
import r4 from '../../data/textbook/math/numbers/n08Authored.json'
const [u7,u6,u5,u4] = validateTextbookUnits([r7.unit,r6.unit,r5.unit,r4.unit])
function complete(unit: TextbookUnit, nodes: {interaction:string|null}[], initial?: TextbookUnitProgress) {
  return nodes.reduce((state,n,index)=>{
    if(!n.interaction)return state
    const modern=unit.constructionItemsV2?.find(i=>i.id===n.interaction)
    if(modern)return modern.parts.reduce((p,part)=>answerTextbookConstructionV2(p,unit,modern.id,part.id,part.choices.find(c=>c.value===part.expected)!.id,'B-audit-v2-'+part.id,1000+index),state)
    const old=unit.constructionItems?.find(i=>i.id===n.interaction)
    if(old)return old.parts.reduce((p,part)=>answerTextbookConstruction(p,unit,old.id,part.id,part.expected,'B-audit-v1-'+part.id,1000+index),state)
    const item=unit.sections.flatMap(s=>s.items).find(i=>i.id===n.interaction)!
    return answerTextbookItem(state,unit,item,item.answer,1000+index)
  },initial)
}
describe('B nonauthor r7 persistence counterexamples against real old revision units',()=>{
  it('inherits only sixteen same-meaning parents, leaves fourteen changed parents unanswered',()=>{
    const prior=complete(u6,r6.nodes)!,snapshot=JSON.stringify(prior),migrated=effectiveTextbookProgress(u7,prior)!
    expect(textbookUnitProgress(u6,prior).completed).toBe(33)
    expect(textbookUnitProgress(u7,migrated)).toMatchObject({completed:16,total:30})
    expect(migrated.constructionProgressV2).toEqual({})
    for(const [id,record]of Object.entries(migrated.constructionProgress??{})) expect(record).toEqual(prior.constructionProgress![id])
    expect(JSON.stringify(prior)).toBe(snapshot)
  })
  it('does not resurrect reset answers after actual r4/r5/r6 adapters, and preserves the old completed archives',()=>{
    const prior=complete(u6,r6.nodes)!,all=complete(u7,r7.nodes,prior)!,reset=resetTextbookUnitProgress(u7,all,4000)!
    expect(textbookUnitProgress(u7,all).completed).toBe(30)
    for(const old of[u6,u5,u4]){
      const compared=effectiveTextbookProgress(old,JSON.parse(JSON.stringify(reset)))!,restored=effectiveTextbookProgress(u7,compared)!
      expect(textbookUnitProgress(u7,restored)).toMatchObject({completed:0,total:30})
      expect(restored.answers).toEqual({});expect(restored.constructionProgress).toEqual({});expect(restored.constructionProgressV2).toEqual({})
      expect(restored.archivedRevisions?.['7-reset-4000']?.constructionProgressV2).toEqual(all.constructionProgressV2)
      expect(restored.archivedRevisions?.['6']?.answers).toEqual(prior.answers)
    }
  })
})
