// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GuidedMathReadingFlow, R3FeedbackMath } from './GuidedMathReadingFlow'
import { validateQF01R3Reading, projectQF01R3Block, qf01R3Solved } from '../../domain/transformationReading'
import { QF01Revision2Archive } from './QF01Revision2Archive'
import { useAppStore } from '../../stores/useAppStore'
import { answerTextbookItem } from '../../domain/textbook'
import { mathQuadraticQF01Unit as unit, qf01GuidedPresentation as presentation, qf01ReadingPresentation as reading, qf01Revision2Unit as r2 } from '../../data/textbook/math/quadratic/qf01Lesson'
const items=unit.sections[0].items
const active=unit.requiredInteractionRefs!.map(id=>items.find(item=>item.id===id)!)
function Lesson(){const progress=useAppStore(state=>state.textbookProgress[unit.unitId]);return <GuidedMathReadingFlow unit={unit} section={unit.sections[0]} progress={progress} presentation={presentation} readingPresentation={reading} storageScope="r3-react-dom-test"/>}
function clickChoice(id:string,value:string){const panel=screen.getByTestId('inline-choice-panel-'+id);const candidate=within(panel).getAllByRole('button').find(button=>button.getAttribute('aria-label')?.endsWith('、'+value));expect(candidate).toBeTruthy();fireEvent.click(candidate!)}
beforeEach(()=>{Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});localStorage.clear();useAppStore.setState({textbookProgress:{}});window.scrollBy=vi.fn();Element.prototype.scrollIntoView=vi.fn();window.requestAnimationFrame=cb=>window.setTimeout(()=>cb(0),0);window.cancelAnimationFrame=id=>window.clearTimeout(id)})
afterEach(()=>{cleanup();vi.restoreAllMocks()})
describe('承認R3の実React DOM（ピクセル測定ではない）',()=>{
 it('35実回答をstoreへ保存し、本文math2・意味穴・誤答・再読込・参照・履歴・まとめを結ぶ',async()=>{
  const warnings=vi.spyOn(console,'warn')
  let view=render(<Lesson/>);await screen.findByTestId('textbook-item-'+active[0].id,{}, {timeout:10000});let advances=0;let mathematicalProse=0
  for(const [index,item]of active.entries()){
   while(!screen.queryByTestId('textbook-item-'+item.id)&&advances<8){fireEvent.click(screen.getByRole('button',{name:'次の段階へ'}));advances++;await waitFor(()=>expect(document.querySelector('.math-textbook-stage--current')).toBeTruthy())}
   const button=screen.getByTestId('textbook-item-'+item.id);expect(button.tagName).toBe('BUTTON');expect(button.getAttribute('aria-label')).not.toContain(item.answer)
   expect(document.querySelector('.math-textbook-stage--current .reading-role-marker--example')).toBeTruthy()
   expect(button.closest('[data-reading-layout-scope]')?.querySelector('[data-reading-layout-body] [data-reading-layout-chain] [data-reading-layout-block]')).toBeTruthy()
   if(index===0)expect(button.closest('[data-reading-layout-body]')?.querySelector('[data-reading-layout-spacing="reason-equation"]')).toBeTruthy()
   expect(document.querySelector('[data-source-block$="-registry"]')).toBeNull();expect(screen.queryByTestId('textbook-item-qf01-n20-answer')).toBeNull()
   if(['qf01-r3-n14-perimeter-expression-answer','qf01-r3-n16-target-answer'].includes(item.id)){expect(button.closest('.reading-paragraph')).toBeTruthy();mathematicalProse++}
   if(item.id==='qf01-r3-n19-endpoints-answer')expect(document.querySelector('.math-textbook-stage--current')?.textContent).not.toContain('x=0では縦の辺が0')
   fireEvent.click(button);expect(screen.getByTestId('inline-choice-panel-'+item.id)).toBeTruthy()
   if(index===0){const wrong=item.choices!.find(value=>value!==item.answer)!;clickChoice(item.id,wrong);expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].resolved).toBe(false);expect(screen.getByTestId('textbook-hint-'+item.id)).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'手掛かりを見る'}));expect(screen.getByRole('button',{name:'手掛かりを閉じる'})).toBeTruthy()}
   clickChoice(item.id,item.answer);await waitFor(()=>expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].resolved).toBe(true));expect(screen.queryByTestId('inline-choice-panel-'+item.id)).toBeNull()
   if(index===4){const before=JSON.stringify(useAppStore.getState().textbookProgress[unit.unitId]);view.unmount();await act(async()=>{await useAppStore.persist.rehydrate()});view=render(<Lesson/>);await waitFor(()=>expect(screen.queryByText('教材の対応を確認しています。')).toBeNull(),{timeout:10000});expect(JSON.stringify(useAppStore.getState().textbookProgress[unit.unitId])).toBe(before)}
   const q=reading.interactions.find(q=>q.id===item.id)!;const row=reading.viewContracts.INTERACTION_REFERENCES.rows.find(r=>r.currentInteractionId===q.id)!;
   // 視覚見出しは現在の参照が存在する問いでのみ必要。解答後は次currentへ切り替わるため、構造を追跡する。
   if(row.topReferenceRecordIds.length)expect(document.querySelector('.math-textbook-stage-reference-content')).toBeTruthy()
  }
  expect(warnings.mock.calls.filter(args=>args.some(value=>String(value).includes('unicodeTextInMathMode')))).toHaveLength(0)
  expect(advances).toBe(8);expect(mathematicalProse).toBe(2);expect(Object.keys(useAppStore.getState().textbookProgress[unit.unitId].answers)).toHaveLength(35)
  expect(screen.getByTestId('qf01-unit-summary').textContent).toContain('関数')
  fireEvent.click(screen.getByRole('button',{name:'前の段階を見る'}));expect(screen.getAllByTestId(/^recorded-results-/)).toHaveLength(8);fireEvent.click(screen.getByRole('button',{name:'全文を開く'}));expect(document.querySelector('[data-source-view="history-full-"]')).toBeTruthy();expect(document.querySelector('[data-source-block$="-registry"]')).toBeNull()
 },30000)
 it('局所平方の問いで親式の必要参照を可視見出し付きで本文より前へ置く',async()=>{
  const target='qf01-n12b-answer',at=active.findIndex(item=>item.id===target)
  act(()=>{for(const item of active.slice(0,at))useAppStore.getState().answerTextbook(unit,item.id,item.answer)})
  localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test','5')
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+target,{}, {timeout:10000})
  const stage=document.querySelector('.math-textbook-stage--current')!,aside=within(stage as HTMLElement).getByRole('complementary',{name:'現在必要な情報'})
  expect(within(aside).getByText('使う条件・前の結果',{selector:'strong'})).toBeTruthy()
  expect(aside.querySelector('[data-source-block="qf01-r3-c2-s06-f01"]')).toBeTruthy()
  const chain=stage.querySelector('.reading-derivation-chain')!;expect(aside.compareDocumentPosition(chain)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(screen.getAllByTestId('textbook-item-'+target)).toHaveLength(1)
 })
 it('長方形の近接参照を問いより前へ置き、図を一度だけ再掲して選択操作を保つ',async()=>{
  const target='qf01-r3-n14-boundary-answer',at=active.findIndex(item=>item.id===target)
  act(()=>{for(const item of active.slice(0,at))useAppStore.getState().answerTextbook(unit,item.id,item.answer)})
  localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test','6')
  const original=HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return this.classList.contains('math-textbook-stage-reference-content')?new DOMRect(0,-200,246,50):original.call(this)})
  render(<Lesson/>);const slot=await screen.findByTestId('textbook-item-'+target,{}, {timeout:10000})
  const stage=document.querySelector('.math-textbook-stage--current')!,nearby=await within(stage as HTMLElement).findByRole('complementary',{name:'今の判断に必要な情報'})
  const owner=slot.closest('[data-source-view="canonical"]')!,question=slot.closest('.reading-paragraph')!,panel=screen.getByTestId('inline-choice-panel-'+target)
  expect(nearby.parentElement).toBe(owner);expect(nearby.compareDocumentPosition(question)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(question.compareDocumentPosition(panel)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();expect(panel.contains(nearby)).toBe(false)
  expect([...nearby.querySelectorAll('[data-source-block]')].map(node=>node.getAttribute('data-source-block'))).toEqual(['qf01-r3-c3-s07-v01','qf01-r3-c3-s07-p03'])
  expect(nearby.querySelectorAll('img[src$="rectangle-perimeter-40-reading.svg"]')).toHaveLength(1)
  expect(stage.querySelectorAll('img[src$="rectangle-perimeter-40-reading.svg"]')).toHaveLength(2)
  const before=JSON.stringify(useAppStore.getState().textbookProgress);fireEvent.click(slot)
  expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before);expect(within(panel).getAllByRole('button',{name:/^候補/})).toHaveLength(3)
  const item=active[at],wrong=item.choices!.find(value=>value!==item.answer)!;clickChoice(target,wrong)
  expect(useAppStore.getState().textbookProgress[unit.unitId].answers[target].resolved).toBe(false)
  clickChoice(target,item.answer);expect(useAppStore.getState().textbookProgress[unit.unitId].answers[target].resolved).toBe(true)
 })
 it('誤答後の再掲挿入で動いたfocus候補を再測定し、手動スクロールで自動調整を止める',async()=>{
  // A deterministic geometry scenario, not a claim of real pixel verification.
  const target='qf01-r3-n14-boundary-answer',at=active.findIndex(item=>item.id===target),item=active[at]
  act(()=>{for(const prior of active.slice(0,at))useAppStore.getState().answerTextbook(unit,prior.id,prior.answer)})
  localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test','6')
  const oldRAF=window.requestAnimationFrame,oldCancel=window.cancelAnimationFrame,oldHeight=Object.getOwnPropertyDescriptor(window,'innerHeight')
  const frames=new Map<number,FrameRequestCallback>();let seq=0,scroll=1000,selectedIndex=2
  window.requestAnimationFrame=callback=>{frames.set(++seq,callback);return seq};window.cancelAnimationFrame=id=>{frames.delete(id)}
  Object.defineProperty(window,'innerHeight',{value:900,configurable:true})
  const flush=()=>{for(let turn=0;turn<12&&frames.size;turn++)act(()=>{const pending=[...frames.values()];frames.clear();for(const callback of pending)callback(0)})}
  const header=document.createElement('header');header.style.position='fixed';header.style.top='0px';document.body.append(header)
  const original=HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){
   if(this===header)return new DOMRect(0,0,1440,64)
   if(this.classList.contains('math-textbook-stage-reference-content'))return new DOMRect(0,1080-scroll,600,50)
   const repeated=Boolean(document.querySelector('[aria-label="今の判断に必要な情報"]')),extra=repeated?400:0,id=this.getAttribute('data-testid')??''
   if(id.startsWith('textbook-choice-'+target+'-')){const index=Number(id.split('-').at(-1)),attempt=useAppStore.getState().textbookProgress[unit.unitId].answers[target]?.attemptCount??0;return new DOMRect(0,(attempt?1830-selectedIndex*70+(attempt-1)*1000:1450)+index*70+extra-scroll,540,64)}
   if(id==='inline-choice-panel-'+target)return new DOMRect(0,1400+extra-scroll,600,300)
   if(id==='textbook-item-'+target)return new DOMRect(0,1350+extra-scroll,48,48)
   return original.call(this)
  })
  vi.mocked(window.scrollBy).mockImplementation((input?:number|ScrollToOptions,y?:number)=>{scroll+=typeof input==='number'?(y??0):(input?.top??0);window.dispatchEvent(new Event('scroll'))})
  let view:ReturnType<typeof render>|undefined
  try{
   view=render(<Lesson/>);await screen.findByTestId('textbook-item-'+target,{}, {timeout:10000});flush()
   fireEvent.click(screen.getByTestId('textbook-item-'+target));flush()
   const wrongs=item.choices!.filter(value=>value!==item.answer),panel=screen.getByTestId('inline-choice-panel-'+target)
   const buttonFor=(value:string)=>within(panel).getAllByRole('button').find(button=>button.getAttribute('aria-label')?.endsWith('、'+value))!
   // Use the lower wrong candidate so feedback crosses the viewport boundary.
   wrongs.sort((a,b)=>Number(buttonFor(b).getAttribute('data-testid')!.split('-').at(-1))-Number(buttonFor(a).getAttribute('data-testid')!.split('-').at(-1)))
   selectedIndex=Number(buttonFor(wrongs[0]).getAttribute('data-testid')!.split('-').at(-1))
   const firstWrong=buttonFor(wrongs[0]);fireEvent.pointerDown(firstWrong);act(()=>{firstWrong.focus()});fireEvent.pointerUp(firstWrong);fireEvent.click(firstWrong);flush()
   expect(screen.getByRole('complementary',{name:'今の判断に必要な情報'})).toBeTruthy();expect(document.activeElement).toBe(firstWrong)
   expect(firstWrong.getBoundingClientRect().top).toBeGreaterThanOrEqual(76);expect(firstWrong.getBoundingClientRect().bottom).toBeLessThanOrEqual(888)
   const secondWrong=buttonFor(wrongs[1]);fireEvent.pointerDown(secondWrong);act(()=>{secondWrong.focus()});fireEvent.pointerUp(secondWrong);fireEvent.click(secondWrong)
   vi.mocked(window.scrollBy).mockClear();fireEvent.wheel(window);flush();expect(window.scrollBy).not.toHaveBeenCalled()
   expect(document.activeElement).toBe(secondWrong);expect(useAppStore.getState().textbookProgress[unit.unitId].answers[target].value).toBe(wrongs[1])
  }finally{view?.unmount();header.remove();window.requestAnimationFrame=oldRAF;window.cancelAnimationFrame=oldCancel;if(oldHeight)Object.defineProperty(window,'innerHeight',oldHeight)}
 })
 it('再読込相当の保存済み誤答から現在の空欄を表示し、解答やfocusを変更しない',async()=>{
  const target='qf01-n13-answer',at=active.findIndex(item=>item.id===target),item=active[at]
  act(()=>{for(const prior of active.slice(0,at))useAppStore.getState().answerTextbook(unit,prior.id,prior.answer);for(const wrong of item.choices!.filter(value=>value!==item.answer))useAppStore.getState().answerTextbook(unit,target,wrong)})
  const stage=reading.interactions.find(q=>q.id===target)!.stageId;localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test',String(Number(stage.split('-').at(-1))-1))
  const before=JSON.stringify(useAppStore.getState().textbookProgress),oldRAF=window.requestAnimationFrame,oldCancel=window.cancelAnimationFrame,oldHeight=Object.getOwnPropertyDescriptor(window,'innerHeight')
  const frames=new Map<number,FrameRequestCallback>();let seq=0,scroll=0
  window.requestAnimationFrame=callback=>{frames.set(++seq,callback);return seq};window.cancelAnimationFrame=id=>{frames.delete(id)};Object.defineProperty(window,'innerHeight',{value:900,configurable:true})
  const flush=()=>{for(let turn=0;turn<12&&frames.size;turn++)act(()=>{const pending=[...frames.values()];frames.clear();for(const callback of pending)callback(0)})}
  const original=HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){
   if(this.classList.contains('math-textbook-stage-reference-content'))return new DOMRect(0,1800-scroll,600,80)
   if(this.getAttribute('data-testid')==='textbook-item-'+target)return new DOMRect(0,2200+(document.querySelector('[aria-label="今の判断に必要な情報"]')?300:0)-scroll,48,48)
   return original.call(this)
  })
  vi.mocked(window.scrollBy).mockImplementation((input?:number|ScrollToOptions,y?:number)=>{scroll+=typeof input==='number'?(y??0):(input?.top??0);window.dispatchEvent(new Event('scroll'))})
  let view:ReturnType<typeof render>|undefined
  try{
   view=render(<Lesson/>);const slot=await screen.findByTestId('textbook-item-'+target,{}, {timeout:10000})
   flush()
   expect(slot.getBoundingClientRect().top).toBeGreaterThanOrEqual(12);expect(slot.getBoundingClientRect().bottom).toBeLessThanOrEqual(888)
   expect(screen.getByTestId('textbook-hint-'+target)).toBeTruthy();expect(document.activeElement).toBe(document.body);expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before)
   view.unmount();scroll=0;await act(async()=>{await useAppStore.persist.rehydrate()});view=render(<Lesson/>)
   const restored=await screen.findByTestId('textbook-item-'+target,{}, {timeout:10000});flush()
   expect(restored.getBoundingClientRect().top).toBeGreaterThanOrEqual(12);expect(restored.getBoundingClientRect().bottom).toBeLessThanOrEqual(888)
   expect(screen.getByTestId('textbook-hint-'+target)).toBeTruthy();expect(document.activeElement).toBe(document.body);expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before)
  }finally{view?.unmount();window.requestAnimationFrame=oldRAF;window.cancelAnimationFrame=oldCancel;if(oldHeight)Object.defineProperty(window,'innerHeight',oldHeight)}
 })
 it('旧r2 archive閲覧は実store・cursorを変更せず、候補操作を出さない',async()=>{
  const old=answerTextbookItem(undefined,r2,r2.sections[0].items[0],r2.sections[0].items[0].answer,100)
  const migrated=answerTextbookItem(old,unit,active[0],active[0].answer,101);useAppStore.setState({textbookProgress:{[unit.unitId]:migrated}})
  const before=JSON.stringify(useAppStore.getState().textbookProgress);const writes=vi.spyOn(Storage.prototype,'setItem');render(<MemoryRouter><QF01Revision2Archive/></MemoryRouter>)
  expect(screen.getByTestId('qf01-revision2-archive')).toBeTruthy();const blanks=document.querySelectorAll<HTMLButtonElement>('[data-qf01-current-slot]');expect(blanks.length).toBeGreaterThan(0);expect([...blanks].every(button=>button.disabled)).toBe(true)
  expect(document.querySelector('[data-testid^="inline-choice-panel-"]')).toBeNull();expect(writes).not.toHaveBeenCalled();expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before)
 })
})

// Formal-gate feedback regressions: real metadata and React math DOM; no pixel claims.
describe('R3 help gate and mathematical feedback',()=>{
 function prepare(id:string){const at=active.findIndex(item=>item.id===id);act(()=>{for(const item of active.slice(0,at))useAppStore.getState().answerTextbook(unit,item.id,item.answer)});const stage=reading.interactions.find(q=>q.id===id)!.stageId;localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test',String(Number(stage.split('-').at(-1))-1));return active[at]}
 it('help gate retains prerequisites and changes only with open help or solved n18',async()=>{
  const id='qf01-n18-answer',block='qf01-r3-c3-s08-p04',item=prepare(id)
  const source=await validateQF01R3Reading(unit,reading),solved=qf01R3Solved(source,useAppStore.getState().textbookProgress[unit.unitId].answers)
  expect(projectQF01R3Block(source,block,new Set(),{helpFor:id})).toBeUndefined()
  expect(projectQF01R3Block(source,block,solved)).toBeUndefined()
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+id)
  const shown=()=>document.querySelector('.math-textbook-stage--current [data-source-block="'+block+'"]')
  expect(shown()).toBeNull();fireEvent.click(screen.getByRole('button',{name:'手掛かりを見る'}));expect(shown()).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'手掛かりを閉じる'}));expect(shown()).toBeNull()
  fireEvent.click(screen.getByTestId('textbook-item-'+id));clickChoice(id,item.choices!.find(v=>v!==item.answer)!)
  expect(shown()).toBeNull();fireEvent.click(screen.getByRole('button',{name:'手掛かりを見る'}));expect(shown()).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'手掛かりを閉じる'}));clickChoice(id,item.answer);expect(shown()).toBeTruthy()
 })
 it.each(['unknown','missing','misplaced'])('invalid %s help reference fails closed rather than making the block unconditional',async(kind)=>{
  const source=await validateQF01R3Reading(unit,reading),copy=structuredClone(source.metadata)
  const rule=copy.blockVisibility.find(v=>v.mode==='help-or-solved')!
  if(kind==='unknown')Object.assign(rule.visibleWhen,{helpOrSolvedFor:'unknown-interaction'})
  else{delete rule.visibleWhen.helpOrSolvedFor;if(kind==='misplaced')Object.assign(rule,{helpOrSolvedFor:'qf01-n18-answer'})}
  expect(()=>projectQF01R3Block({...source,metadata:copy},rule.blockId,new Set(rule.visibleWhen.allSolved))).toThrow(/HELP/)
 })
 it.each([['qf01-n06-answer',2],['qf01-n10-answer',1],['qf01-n12b-answer',2],['qf01-n12c-answer',1],['qf01-n14-answer',1]] as const)('%s wrong reason renders complete math including signed operands and labels',async(id,index)=>{
  const item=prepare(id);render(<Lesson/>);await screen.findByTestId('textbook-item-'+id);fireEvent.click(screen.getByTestId('textbook-item-'+id));clickChoice(id,item.choices![index])
  const reason=screen.getByTestId('textbook-hint-'+id).querySelector('p')!
  expect(reason.querySelector('.katex')).toBeTruthy();expect(reason.querySelector('.katex-error')).toBeNull()
  const latex=[...reason.querySelectorAll('annotation')].map(n=>n.textContent!).join(' ')
  expect(latex).toContain(String.raw`\times`)
  if(id==='qf01-n06-answer'||id==='qf01-n12b-answer'||id==='qf01-n12c-answer')expect(latex).toMatch(/\\times\s*\(-1\)/)
  if(id==='qf01-n14-answer')expect(latex).toContain(String.raw`\text{縦}\times \text{横}`)
  const prose=reason.cloneNode(true) as HTMLElement;prose.querySelectorAll('.katex').forEach(n=>n.remove());expect(prose.textContent).not.toMatch(/\\|\^|×/)
 })

 it('double-escaped canonical feedback uses the same math renderer without copying question answers',()=>{
  for(const [id,index] of [['qf01-n06-answer',2],['qf01-n10-answer',1],['qf01-n12b-answer',2],['qf01-n12c-answer',1],['qf01-n14-answer',1]] as const){
   const raw=reading.interactions.find(q=>q.id===id)!.wrongReasonByChoiceIndex[index]!
   const view=render(<R3FeedbackMath text={raw.replace(/\\/g,'\\\\')} sourceId="double-escaped-feedback" unitId={unit.unitId}/> )
   expect(view.container.querySelector('.katex')).toBeTruthy();expect(view.container.querySelector('.katex-error')).toBeNull()
   expect([...view.container.querySelectorAll('annotation')].map(n=>n.textContent).join(' ')).toContain(String.raw`\times`)
   const prose=view.container.cloneNode(true) as HTMLElement;prose.querySelectorAll('.katex').forEach(n=>n.remove());expect(prose.textContent).not.toMatch(/\\|\^|×/)
   view.unmount()
  }
 })
 it('every R3 wrong reason and both hints use the same math rendering without raw notation',async()=>{
  for(const item of active){prepare(item.id);const view=render(<Lesson/>);await screen.findByTestId('textbook-item-'+item.id);fireEvent.click(screen.getByTestId('textbook-item-'+item.id))
   const wrongs=item.choices!.filter(v=>v!==item.answer);clickChoice(item.id,wrongs[0]);
   for(const p of screen.getByTestId('inline-choice-panel-'+item.id).querySelectorAll('p')){const prose=p.cloneNode(true) as HTMLElement;prose.querySelectorAll('.katex').forEach(n=>n.remove());expect(prose.textContent).not.toMatch(/\\|\^|×|²/)}
   clickChoice(item.id,wrongs[1]);fireEvent.click(screen.getByRole('button',{name:'手掛かりを見る'}))
   const panel=screen.getByTestId('inline-choice-panel-'+item.id)
   expect(panel.querySelector('.katex-error')).toBeNull()
   for(const p of panel.querySelectorAll('p')){const prose=p.cloneNode(true) as HTMLElement;prose.querySelectorAll('.katex').forEach(n=>n.remove());expect(prose.textContent).not.toMatch(/\\|\^|×|²/)}
   view.unmount();act(()=>useAppStore.setState({textbookProgress:{}}))
  }
 },30000)
})
