import {it,expect,afterEach} from 'vitest'
import {render,fireEvent,cleanup} from '@testing-library/react'
import fs from 'node:fs'
import katex from 'katex'
import {execFileSync} from 'node:child_process'
import {mathTextbookUnits} from '../../../src/data/textbook/math'
import {GuidedMathReadingFlow} from '../../../src/components/textbook/GuidedMathReadingFlow'
import {effectiveTextbookProgress,type TextbookUnitProgress} from '../../../src/domain/textbook'
import type {TextbookUnit} from '../../../src/domain/textbookSchema'
afterEach(cleanup)
const root='work/items/W-MATH-036-ne02-n11-n12-guided-design/'
for(const code of (process.env.CODES??'ne02').split(',')){
 const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/'+code+'Authored.json','utf8'))
 const unit=mathTextbookUnits.find(u=>u.unitId===data.unit.unitId)!
 const old=JSON.parse(fs.readFileSync(root+'evidence/'+code.toUpperCase()+'_CURRENT.json','utf8')).unit as TextbookUnit
 it(code+' deterministically compiles only the frozen approved design',()=>{execFileSync(process.execPath,[root+'materialize.mjs','--check-'+code]);expect(unit.sections[0].items).toHaveLength(({ne02:30,n11:39,n12:46} as Record<string,number>)[code]);expect(data.choiceDisplay).toBe('semantic');for(const q of old.sections[0].items){const now=unit.sections[0].items.find(i=>i.id===q.id)!;expect(now.answer).toBe(q.answer);expect(new Set(now.choices)).toEqual(new Set(q.choices))}})
 it(code+' strictly compiles every generated option math span',()=>{for(const display of Object.values(data.semanticDisplay) as {choices:Record<string,{type:string;latex?:string}[]>}[])for(const parts of Object.values(display.choices))for(const p of parts)if(p.type==='math')expect(()=>katex.renderToString(p.latex!,{throwOnError:true,strict:'error'})).not.toThrow()})
 it(code+' preserves old attempts and archives while reopening only new reasoning',()=>{
  const answers=Object.fromEntries(old.sections[0].items.map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'old-wrong',isFirstCorrect:false,resolved:true,attemptCount:3,firstAnsweredAt:10,lastAnsweredAt:20}]))
  const prior:TextbookUnitProgress={unitId:unit.unitId,unitRevision:old.revision,startedAt:1,updatedAt:20,completedAt:20,answers}
  const out=effectiveTextbookProgress(unit,prior)!;expect(out.unitRevision).toBe(unit.revision);expect(out.answers).toEqual(answers);expect(out.completedAt).toBeUndefined();expect(out.previousRevisionCompletedAt).toBe(20);expect(out.archivedRevisions?.[String(old.revision)].answers).toEqual(answers)
  for(const q of unit.sections[0].items.filter(i=>!old.sections[0].items.some(o=>o.id===i.id)))expect(out.answers[q.id]).toBeUndefined()
 })
 it(code+' runs every older reset/migration before preserving current answers',()=>{
  for(let revision=1;revision<old.revision;revision++){
   const original=old.sections[0].items.filter(i=>new RegExp('^'+code+'-\\d\\d$').test(i.id));const prior:TextbookUnitProgress={unitId:unit.unitId,unitRevision:revision,startedAt:1,updatedAt:2,completedAt:2,answers:Object.fromEntries(original.map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'wrong',resolved:true,isFirstCorrect:false,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]))}
   const baseline=effectiveTextbookProgress(old,prior)!;const current=effectiveTextbookProgress(unit,prior)!;expect(current.answers).toEqual(baseline.answers);expect(current.archivedRevisions?.[String(old.revision)].answers).toEqual(baseline.answers);for(const [r,archive]of Object.entries(baseline.archivedRevisions??{}))expect(current.archivedRevisions?.[r]).toEqual(archive)
  }
 })
 it(code+' displays only the current stage and no future answer after a wrong choice',()=>{
  localStorage.clear();const view=render(<GuidedMathReadingFlow presentation={data} unit={unit} section={unit.sections[0]} progress={undefined}/>);const first=unit.sections[0].items[0];fireEvent.click(view.getByTestId('textbook-item-'+first.id));const panel=view.getByTestId('inline-choice-panel-'+first.id);expect(panel.querySelectorAll('.reading-choice-option')).toHaveLength(first.choices!.length);expect(view.queryByTestId('math-textbook-next-stage')).toBeNull();expect(view.queryAllByTestId('guided-original-figure')).toHaveLength(code==='n11'?1:0)
 })
}

it('keeps a denominator slot in a complete balanced fraction, including after resize',()=>{
 const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/ne02Authored.json','utf8'));const unit=mathTextbookUnits.find(u=>u.unitId===data.unit.unitId)!;const index=data.nodes.findIndex((n:{id:string})=>n.id==='ne02-q12-denominator');const answers=Object.fromEntries(data.nodes.slice(0,index).filter((n:{interaction:string|null})=>n.interaction).map((n:{interaction:string})=>{const q=unit.sections[0].items.find(i=>i.id===n.interaction)!;return [q.id,{itemId:q.id,value:q.answer,resolved:true,isFirstCorrect:true,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:1}]}));localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r2','11');const v=render(<GuidedMathReadingFlow presentation={data} unit={unit} section={unit.sections[0]} progress={{unitId:unit.unitId,unitRevision:2,startedAt:1,updatedAt:1,answers}}/>);const slot=v.getByTestId('textbook-item-ne02-q12-denominator');expect(slot.classList.contains('guided-formula-slot')).toBe(true);expect(slot.querySelector('.katex')).toBeTruthy();fireEvent.click(slot);expect(v.getByTestId('inline-choice-panel-ne02-q12-denominator')).toBeTruthy()
})
