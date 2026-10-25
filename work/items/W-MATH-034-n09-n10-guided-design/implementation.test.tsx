import {describe,it,expect} from 'vitest'
import {render,fireEvent,cleanup} from '@testing-library/react'
import {renderToStaticMarkup} from 'react-dom/server'
import {execFileSync} from 'node:child_process'
import {GuidedMathReadingFlow} from '../../../src/components/textbook/GuidedMathReadingFlow'
import {mathNumbersN09Unit as unit,n09Presentation as data,n09SourceToItemIds} from '../../../src/data/textbook/math/numbers/n09Lesson'
import {mathNumbersN09Unit as oldUnit} from '../../../src/test/n09Legacy'
import {answerTextbookItem,effectiveTextbookProgress,textbookUnitProgress,type TextbookUnitProgress} from '../../../src/domain/textbook'
const key='math-textbook-compact-v1:'+unit.unitId+':r3'
function html(p:TextbookUnitProgress|undefined,stage:number){localStorage.setItem(key,String(stage));return renderToStaticMarkup(<GuidedMathReadingFlow presentation={data} unit={unit} section={unit.sections[0]} progress={p} />)}
describe('W034 N09 approved reader and old saves',()=>{
 it('materializes frozen inputs and preserves all18 accepted contracts',()=>{
  execFileSync(process.execPath,['work/items/W-MATH-034-n09-n10-guided-design/materialize.mjs','--check-n09'])
  expect(data.nodes).toHaveLength(41);expect(unit.sections[0].items).toHaveLength(36);expect(data.stages).toHaveLength(11)
  for(const item of oldUnit.sections[0].items)expect(unit.sections[0].items.find(i=>i.id===item.id)?.answer).toBe(item.answer)
  expect(new Set(Object.values(n09SourceToItemIds).flat())).toEqual(new Set(unit.sections[0].items.map(i=>i.id)))
 })
 it.each([1,2])('respects real revision%i archives and first-attempt histories',revision=>{
  let old:TextbookUnitProgress|undefined
  for(const item of oldUnit.sections[0].items){if(revision===1&&item.id.includes('p001'))continue;old=answerTextbookItem(old,{...oldUnit,revision},item,item.choices!.find(x=>x!==item.answer)!,10);old=answerTextbookItem(old,{...oldUnit,revision},item,item.answer,20)}
  const snapshot=structuredClone(old!);const next=effectiveTextbookProgress(unit,old)!
  expect(next.unitRevision).toBe(3);expect(next.archivedRevisions?.[String(revision)].answers).toEqual(old!.answers)
  expect(Object.keys(next.answers)).toHaveLength(revision===1?0:18);expect(next.completedAt).toBeUndefined()
  if(revision===2)expect(next.answers).toEqual(old!.answers)
  const current=html(next,10);expect(current).toContain('textbook-item-n09-q01-negative');expect(current).not.toContain('data-testid="n09-complete"')
  expect(current).not.toContain('guided-original-figure');expect(old).toEqual(snapshot)
  let done=next;for(const item of unit.sections[0].items)if(!done.answers[item.id])done=answerTextbookItem(done,unit,item,item.answer,30)
  expect(textbookUnitProgress(unit,done).completed).toBe(36);expect(done.archivedRevisions).toEqual(next.archivedRevisions)
 })
 it('renders all41 nodes and gates the original figure until the integer is chosen',()=>{
  let progress:TextbookUnitProgress|undefined
  for(const node of data.nodes){
   const stage=data.stages.findIndex(s=>s.id===node.stageId);const before=html(progress,stage)
   expect(before).not.toContain('katex-error');if(data.nodes.indexOf(node)<=data.nodes.findIndex(n=>n.id==='n09-10'))expect(before).not.toContain('guided-original-figure')
   if(node.interaction){expect(before).toContain('textbook-item-'+node.interaction);const item=unit.sections[0].items.find(i=>i.id===node.interaction)!;progress=answerTextbookItem(progress,unit,item,item.answer,20)}
   const after=html(progress,stage);expect(after).not.toContain('katex-error');if(node.id==='n09-10')expect(after).toContain('guided-original-figure')
   if(node.interaction)expect(after).not.toContain('data-block-id="'+node.id+'-interaction')
  }
  expect(html(progress,10)).toContain('n09-14-table');expect(html(progress,10)).toContain('n09-complete')
 })
 it('records all necessary definitions and both signed intervals for the final stage',()=>{
  let progress:TextbookUnitProgress|undefined;for(const item of unit.sections[0].items)progress=answerTextbookItem(progress,unit,item,item.answer,20)
  const doc=new DOMParser().parseFromString(html(progress,10),'text/html');const refs=doc.querySelector('[data-testid="math-textbook-stage-references"]')!
  for(const id of ['n09-11-result','n09-12-result','n09-13-result'])expect(refs.querySelector('[data-result-source="'+id+'"]')).not.toBeNull()
  const table=doc.querySelector('[data-testid="n09-14-table"]')!;expect(table.querySelectorAll('tbody tr')).toHaveLength(2);expect(table.textContent).toContain('小数部分')
 })
 it('uses the accepted three short rows for every Q08 option',()=>{
  let progress:TextbookUnitProgress|undefined
  for(const item of unit.sections[0].items){if(item.id==='n09-08')break;progress=answerTextbookItem(progress,unit,item,item.answer,20)}
  localStorage.setItem(key,'5')
  const view=render(<GuidedMathReadingFlow presentation={data} unit={unit} section={unit.sections[0]} progress={progress} />)
  fireEvent.click(view.getByTestId('textbook-item-n09-08'))
  const options=view.getByTestId('inline-choice-panel-n09-08').querySelectorAll('.reading-choice-option')
  expect(options).toHaveLength(4)
  for(const option of options)expect(option.querySelectorAll('.guided-independent-lines .reading-formula-line')).toHaveLength(3)
  cleanup()
 })

})

import {mathNumbersN10Unit as unit10,n10Presentation as data10} from '../../../src/data/textbook/math/numbers/n10Lesson'
import {mathNumbersN10Unit as old10} from '../../../src/test/n10Legacy'
function html10(progress:TextbookUnitProgress|undefined,stage:number){localStorage.setItem('math-textbook-compact-v1:'+unit10.unitId+':r2',String(stage));return renderToStaticMarkup(<GuidedMathReadingFlow presentation={data10} unit={unit10} section={unit10.sections[0]} progress={progress} />)}
describe('W034 N10 approved proof and rationalization',()=>{
 it('keeps all21 contracts within45 active derivation decisions',()=>{
  expect(unit10.sections[0].items).toHaveLength(45);expect(data10.nodes).toHaveLength(45);expect(data10.stages).toHaveLength(12)
  for(const item of old10.sections[0].items)expect(unit10.sections[0].items.find(i=>i.id===item.id)?.answer).toBe(item.answer)
 })
 it('renders every before/after state including nested radical and long fractions',()=>{
  let progress:TextbookUnitProgress|undefined
  for(const node of data10.nodes){const stage=data10.stages.findIndex(s=>s.id===node.stageId);const before=html10(progress,stage);expect(before,node.id).not.toContain('katex-error');expect(before).toContain('textbook-item-'+node.interaction);const item=unit10.sections[0].items.find(i=>i.id===node.interaction)!;progress=answerTextbookItem(progress,unit10,item,item.answer,20);expect(html10(progress,stage),node.id).not.toContain('katex-error')}
  expect(html10(progress,11)).toContain('n10-complete')
 })
 it('archives original records and reopens only the new intermediate decisions',()=>{
  let p:TextbookUnitProgress|undefined;for(const item of old10.sections[0].items){p=answerTextbookItem(p,old10,item,item.choices!.find(x=>x!==item.answer)!,10);p=answerTextbookItem(p,old10,item,item.answer,20)}
  const next=effectiveTextbookProgress(unit10,p)!;expect(next.unitRevision).toBe(2);expect(next.answers).toEqual(p!.answers);expect(next.archivedRevisions?.['1'].answers).toEqual(p!.answers);expect(next.completedAt).toBeUndefined();expect(next.previousRevisionCompletedAt).toBe(20);expect(html10(next,11)).toContain('textbook-item-n10-q01-square')
 })
})
