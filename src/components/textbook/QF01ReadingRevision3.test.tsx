// @vitest-environment jsdom
import { createHash, webcrypto } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import katex from 'katex'
import { GuidedMathReadingFlow, R3FeedbackMath, R3BodyText, R3MixedText } from './GuidedMathReadingFlow'
import * as transformationReading from '../../domain/transformationReading'
import { validateQF01R3Reading, projectQF01R3Block, qf01R3Solved } from '../../domain/transformationReading'
import { QF01Revision2Archive } from './QF01Revision2Archive'
import { useAppStore } from '../../stores/useAppStore'
import { answerTextbookItem, getTextbookChoices } from '../../domain/textbook'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { mathQuadraticQF01Unit as unit, qf01GuidedPresentation as presentation, qf01ReadingPresentation as reading, qf01Revision2Unit as r2 } from '../../data/textbook/math/quadratic/qf01Lesson'
const items=unit.sections[0].items
const active=unit.requiredInteractionRefs!.map(id=>items.find(item=>item.id===id)!)
const {validateSource:validateQF01R3BodySource,slice:qf01R3BodySlice,origins:qf01R3BodyOrigins}=R3BodyText
function Lesson(){const progress=useAppStore(state=>state.textbookProgress[unit.unitId]);return <GuidedMathReadingFlow unit={unit} section={unit.sections[0]} progress={progress} presentation={presentation} readingPresentation={reading} storageScope="r3-react-dom-test"/>}
function clickChoice(id:string,value:string){const panel=screen.getByTestId('inline-choice-panel-'+id);const candidate=within(panel).getAllByRole('button').find(button=>button.getAttribute('aria-label')?.endsWith('、'+value));expect(candidate).toBeTruthy();fireEvent.click(candidate!)}
beforeEach(()=>{Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});localStorage.clear();useAppStore.setState({textbookProgress:{}});window.scrollBy=vi.fn();Element.prototype.scrollIntoView=vi.fn();window.requestAnimationFrame=cb=>window.setTimeout(()=>cb(0),0);window.cancelAnimationFrame=id=>window.clearTimeout(id)
 // jsdom has no layout: model measurable canonical sources explicitly, never
 // interpret its default zero rectangles as real visibility or a pixel PASS.
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return this.getAttribute('data-source-view')==='canonical'?new DOMRect(20,100,240,60):new DOMRect(0,0,0,0)})
})
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()})
describe('承認R3の実React DOM（ピクセル測定ではない）',()=>{
 it('完成した右辺の負数を二項演算子へ変えず、符号と数字を一体表示する',async()=>{
  act(()=>{for(const item of active.slice(0,4))useAppStore.getState().answerTextbook(unit,item.id,item.answer)})
  localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test','1')
  render(<Lesson/>);await waitFor(()=>expect(document.querySelector('[data-source-block="qf01-r3-c1-s02-f03"][data-source-view="canonical"] .typeset-right .katex')).toBeTruthy())
  const right=document.querySelector('[data-source-block="qf01-r3-c1-s02-f03"][data-source-view="canonical"] .typeset-right')!
  expect(right.querySelector('annotation')?.textContent).toBe('-10')
  expect([...right.querySelectorAll('.mbin')].some(atom=>atom.textContent==='−')).toBe(false)
 })
 it('外枠寸法が一定でも内側の数式幅が変われば番号衝突を再測定する',async()=>{
  // Deterministic observer lifecycle regression; real pixels are checked in Edge.
  const observers:ObserverProbe[]=[]
  class ObserverProbe {
   readonly targets=new Set<Element>()
   constructor(readonly callback:ResizeObserverCallback){observers.push(this)}
   observe(target:Element){this.targets.add(target)}
   unobserve(target:Element){this.targets.delete(target)}
   disconnect(){this.targets.clear()}
   fire(){this.callback([],this as unknown as ResizeObserver)}
  }
  let inkRight=200
  vi.stubGlobal('ResizeObserver',ObserverProbe)
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){
   if(this.classList.contains('r3-inline-baseline')){const tag=this.closest<HTMLElement>('.numbered-equation-label');return new DOMRect(0,tag?parseFloat(tag.style.top||'0')+14:30,0,0)}
   if(this.classList.contains('numbered-equation-label'))return new DOMRect(278,parseFloat(this.style.top||'0'),20,20)
   if(this.classList.contains('katex-html'))return new DOMRect(10,20,inkRight-10,20)
   if(this.classList.contains('numbered-equation')||this.classList.contains('numbered-equation-body')||this.classList.contains('typeset-line')||this.classList.contains('typeset-formula-body'))return new DOMRect(0,0,300,48)
   return new DOMRect(0,0,0,0)
  })
  try{
   render(<Lesson/>);await screen.findByTestId('textbook-item-'+active[0].id)
   const numbered=document.querySelector<HTMLElement>('[data-source-block="qf01-r3-c1-s01-f01"] .r3-exact-number')!
   await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20))})
   expect(numbered.classList.contains('numbered-equation--below')).toBe(false)
   const inner=observers.filter(observer=>[...observer.targets].some(target=>target.classList.contains('katex-html')))
   expect(inner.length).toBeGreaterThan(0)
   inkRight=295;act(()=>{for(const observer of inner)observer.fire()})
   await waitFor(()=>expect(numbered.classList.contains('numbered-equation--below')).toBe(true))
  }finally{vi.unstubAllGlobals()}
 })
 it('35実回答をstoreへ保存し、本文math2・意味穴・誤答・再読込・参照・履歴・まとめを結ぶ',async()=>{
  const warnings=vi.spyOn(console,'warn')
  let view=render(<Lesson/>);await screen.findByTestId('textbook-item-'+active[0].id,{}, {timeout:10000});let advances=0;let mathematicalProse=0;let nearbyRefs=0,preludeRefs=0,priorStageRefs=0
  for(const [index,item]of active.entries()){
   while(!screen.queryByTestId('textbook-item-'+item.id)&&advances<8){fireEvent.click(screen.getByRole('button',{name:'次の段階へ'}));advances++;await waitFor(()=>expect(document.querySelector('.math-textbook-stage--current')).toBeTruthy())}
   const button=screen.getByTestId('textbook-item-'+item.id);expect(button.tagName).toBe('BUTTON');expect(button.getAttribute('aria-label')).not.toContain(item.answer)
   expect(document.querySelector('.math-textbook-stage--current .reading-role-marker--example')).toBeTruthy()
   expect(button.closest('[data-reading-layout-scope]')?.querySelector('[data-reading-layout-body] [data-reading-layout-chain] [data-reading-layout-block]')).toBeTruthy()
   if(index===0)expect(button.closest('[data-reading-layout-body]')?.querySelector('[data-reading-layout-spacing="reason-equation"]')).toBeTruthy()
   expect(document.querySelector('[data-source-block$="-registry"]')).toBeNull();expect(screen.queryByTestId('textbook-item-qf01-n20-answer')).toBeNull()
   if(['qf01-r3-n14-perimeter-expression-answer','qf01-r3-n16-target-answer'].includes(item.id)){expect(button.closest('.reading-paragraph')).toBeTruthy();mathematicalProse++}
   if(item.id==='qf01-r3-n19-endpoints-answer')expect(document.querySelector('.math-textbook-stage--current')?.textContent).not.toContain('x=0では縦の辺が0')
   const refRow=reading.viewContracts.INTERACTION_REFERENCES.rows.find(r=>r.currentInteractionId===item.id)!
   const states=JSON.parse(screen.getByTestId('textbook-reading-flow').getAttribute('data-qf01-nearby-visibility')!)
   const preludes:Record<string,string[]>=reading.viewContracts.FRAME_CONTRACT.stagePreludeRefs
   const prelude=preludes[reading.interactions.find(q=>q.id===item.id)!.stageId]??[]
   for(const rid of refRow.nearbyReferenceRecordIds){const ref=reading.viewContracts.RESULT_REGISTRY.records.find(r=>r.id===rid)!;nearbyRefs++;expect(states[ref.sourceRef.blockId]?.status).toMatch(/^(IN_VIEW|NOT_MOUNTED_BY_DESIGN)$/);if(prelude.includes(ref.sourceRef.blockId)){preludeRefs++;expect(states[ref.sourceRef.blockId].status).toBe('IN_VIEW')}if(ref.stageId!==reading.interactions.find(q=>q.id===item.id)!.stageId){priorStageRefs++;expect(states[ref.sourceRef.blockId].status).toBe('NOT_MOUNTED_BY_DESIGN')}}
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
  expect([nearbyRefs,preludeRefs,priorStageRefs]).toEqual([56,11,8])
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
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return this.getAttribute('data-source-view')==='canonical'&&['qf01-r3-c3-s07-v01','qf01-r3-c3-s07-p03'].includes(this.getAttribute('data-source-block')??'')?new DOMRect(0,-200,246,50):original.call(this)})
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
   if(this.getAttribute('data-source-view')==='canonical'&&['qf01-r3-c3-s07-v01','qf01-r3-c3-s07-p03'].includes(this.getAttribute('data-source-block')??''))return new DOMRect(0,1080-scroll,600,50)
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

// D03 uses actual React/metadata/store with explicitly simulated rectangles.
// These tests prove classifications and interaction guards, not painted pixels.
describe('D03 source別nearby境界と失敗停止',()=>{
 const endpoint='qf01-r3-n19-endpoints-answer',p06='qf01-r3-c3-s08-p06'
 function prepare(id:string){const at=active.findIndex(item=>item.id===id);act(()=>{for(const prior of active.slice(0,at))useAppStore.getState().answerTextbook(unit,prior.id,prior.answer)});const stage=reading.interactions.find(q=>q.id===id)!.stageId;localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test',String(Number(stage.split('-').at(-1))-1));return active[at]}
 function states():Record<string,{status:string;reason:string}>{return JSON.parse(screen.getByTestId('textbook-reading-flow').getAttribute('data-qf01-nearby-visibility')!)}
 function copies(id:string){return document.querySelectorAll('[data-source-view="nearby-"][data-source-block="'+id+'"]')}
 function canonical(id:string){return document.querySelector<HTMLElement>('[data-source-view="canonical"][data-source-block="'+id+'"]')!}
 function mockSourceRect(id:string,rect:()=>DOMRect){const original=HTMLElement.prototype.getBoundingClientRect;vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return this.getAttribute('data-source-view')==='canonical'&&this.getAttribute('data-source-block')===id?rect():original.call(this)})}
 async function tick(){await act(async()=>{await new Promise(resolve=>setTimeout(resolve,30))})}

 it('n19正答直後、topが画面外でも完全可視p06をendpointsの前へ複製しない',async()=>{
  const item=prepare('qf01-n19-answer'),original=HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){if(this.classList.contains('math-textbook-stage-reference-content'))return new DOMRect(0,-500,246,60);if(this.getAttribute('data-source-block')===p06&&this.getAttribute('data-source-view')==='canonical')return new DOMRect(38,114.15625,246,161.953125);return original.call(this)})
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+item.id);fireEvent.click(screen.getByTestId('textbook-item-'+item.id));clickChoice(item.id,item.answer)
  await waitFor(()=>expect(states()[p06]?.status).toBe('IN_VIEW'));expect(copies(p06)).toHaveLength(0)
  fireEvent.click(screen.getByTestId('textbook-item-'+endpoint));clickChoice(endpoint,prepareChoice(endpoint,false))
  await tick();expect(states()[p06].status).toBe('IN_VIEW');expect(copies(p06)).toHaveLength(0)
  fireEvent.click(screen.getByRole('button',{name:'前の段階を見る'}));fireEvent.click(screen.getByRole('button',{name:'全文を開く'}))
  expect(copies(p06)).toHaveLength(0);expect(screen.getAllByTestId('textbook-item-'+endpoint)).toHaveLength(1)
 })
 function prepareChoice(id:string,correct:boolean){const item=active.find(item=>item.id===id)!;return correct?item.answer:item.choices!.find(choice=>choice!==item.answer)!}

 it('複数sourceを個別判定し、双方向scroll/resizeはコピーだけを変えてfocusと保存を動かさない',async()=>{
  const ids=['qf01-r3-c1-s01-p01','qf01-r3-c1-s01-p02'];let outside=0
  for(const [index,id] of ids.entries())mockSourceRect(id,()=>new DOMRect(20,index===outside?-100:100,240,60))
  render(<Lesson/>);await waitFor(()=>expect(copies(ids[0])).toHaveLength(1));expect(copies(ids[1])).toHaveLength(0)
  await tick();const before=JSON.stringify(useAppStore.getState().textbookProgress),focus=document.activeElement;vi.mocked(window.scrollBy).mockClear()
  outside=1;fireEvent.scroll(window);await waitFor(()=>expect(copies(ids[1])).toHaveLength(1));expect(copies(ids[0])).toHaveLength(0)
  outside=0;fireEvent.resize(window);await waitFor(()=>expect(copies(ids[0])).toHaveLength(1));expect(copies(ids[1])).toHaveLength(0)
  await tick();expect(window.scrollBy).not.toHaveBeenCalled();expect(document.activeElement).toBe(focus);expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before)
  expect(document.querySelector('.qf01-nearby-references button')).toBeNull()
 })

 it.each([
  ['header部分clip',new DOMRect(20,70,240,100),'OUT_OF_VIEW'],
  ['header境界ちょうど',new DOMRect(20,76,240,100),'IN_VIEW'],
  ['footer部分clip',new DOMRect(20,650,240,70),'OUT_OF_VIEW'],
  ['左clip',new DOMRect(-1,100,240,60),'OUT_OF_VIEW'],
  ['右clip',new DOMRect(900,100,240,60),'OUT_OF_VIEW'],
 ] as const)('%sを可読viewportで分類する',async(_label,rect,expected)=>{
  prepare(endpoint);vi.stubGlobal('innerHeight',800);vi.stubGlobal('innerWidth',1024)
  const header=document.createElement('header'),nav=document.createElement('nav');header.style.cssText='position:fixed;top:0';nav.style.cssText='position:fixed;bottom:0';document.body.append(header,nav)
  const original=HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){if(this===header)return new DOMRect(0,0,1024,64);if(this===nav)return new DOMRect(0,700,1024,100);return original.call(this)})
  mockSourceRect(p06,()=>rect)
  try{render(<Lesson/>);await waitFor(()=>expect(states()[p06]?.status).toBe(expected));expect(copies(p06)).toHaveLength(expected==='IN_VIEW'?0:1)}finally{header.remove();nav.remove()}
 })

 it('祖先の横clip・内側scroll・font準備後の実rectを再判定する',async()=>{
  prepare(endpoint);const fonts=new EventTarget();Object.assign(fonts,{ready:Promise.resolve()})
  const prior=Object.getOwnPropertyDescriptor(document,'fonts');Object.defineProperty(document,'fonts',{value:fonts,configurable:true})
  let x=20;mockSourceRect(p06,()=>new DOMRect(x,100,240,60))
  try{
   render(<Lesson/>);await waitFor(()=>expect(states()[p06]?.status).toBe('IN_VIEW'))
   const chain=canonical(p06).parentElement!;chain.style.overflowX='hidden';Object.defineProperty(chain,'clientWidth',{value:220,configurable:true})
   const original=HTMLElement.prototype.getBoundingClientRect;vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return this===chain?new DOMRect(0,50,220,500):original.call(this)})
   fireEvent.scroll(window);await waitFor(()=>expect(states()[p06]?.status).toBe('OUT_OF_VIEW'));expect(copies(p06)).toHaveLength(1)
   await tick();chain.style.overflowX='visible';x=30;fireEvent.scroll(chain,{bubbles:false})
   await waitFor(()=>expect(states()[p06]?.status).toBe('IN_VIEW'));expect(copies(p06)).toHaveLength(0)
   await tick();x=-1;act(()=>fonts.dispatchEvent(new Event('loadingdone')))
   await waitFor(()=>expect(states()[p06]?.status).toBe('OUT_OF_VIEW'));expect(copies(p06)).toHaveLength(1)
   x=30;act(()=>fonts.dispatchEvent(new Event('loadingdone')))
   await waitFor(()=>expect(states()[p06]?.status).toBe('IN_VIEW'));expect(copies(p06)).toHaveLength(0)
  }finally{if(prior)Object.defineProperty(document,'fonts',prior);else Reflect.deleteProperty(document,'fonts')}
 })

 it.each(['zero','NaN','throw','missing','duplicate'] as const)('同段階canonicalの%sは画面外扱いせず回答を停止する',async(kind)=>{
  const item=prepare(endpoint);let invalid=false
  mockSourceRect(p06,()=>{if(!invalid)return new DOMRect(20,100,240,60);if(kind==='throw')throw new Error('TEST_MEASUREMENT_FAILURE');return new DOMRect(20,kind==='NaN'?NaN:100,kind==='zero'?0:240,60)})
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+endpoint);fireEvent.click(screen.getByTestId('textbook-item-'+endpoint));await tick()
  const source=canonical(p06),before=JSON.stringify(useAppStore.getState().textbookProgress);let duplicate:HTMLElement|undefined
  if(kind==='missing')source.dataset.sourceView='history-full-'
  else if(kind==='duplicate'){duplicate=source.cloneNode(true) as HTMLElement;source.parentElement!.append(duplicate)}else invalid=true
  fireEvent.scroll(window);await waitFor(()=>expect(states()[p06]?.status).toBe('UNVERIFIED'))
  expect(screen.getByTestId('qf01-r3-nearby-error')).toBeTruthy();expect(copies(p06)).toHaveLength(0);expect((screen.getByTestId('textbook-item-'+endpoint) as HTMLButtonElement).disabled).toBe(true)
  const candidate=screen.getByRole('button',{name:/^候補1/}) as HTMLButtonElement;expect(candidate.disabled).toBe(true);fireEvent.click(candidate);expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before);expect(useAppStore.getState().textbookProgress[unit.unitId].answers[endpoint]?.value).not.toBe(item.answer)
  duplicate?.remove();source.dataset.sourceView='canonical';invalid=false;fireEvent.resize(window)
  await waitFor(()=>expect(states()[p06]?.status).toBe('IN_VIEW'));expect(screen.queryByTestId('qf01-r3-nearby-error')).toBeNull()
 })

 it('前段階の正本はhistoryを代用せずNOT_MOUNTED_BY_DESIGNのreadonly一件を保つ',async()=>{
  const id='qf01-r3-n04-value-meaning-answer',prior='qf01-r3-c1-s01-p06';prepare(id)
  render(<Lesson/>);await waitFor(()=>expect(states()[prior]?.status).toBe('NOT_MOUNTED_BY_DESIGN'));expect(canonical(prior)).toBeNull();expect(copies(prior)).toHaveLength(1)
  fireEvent.click(screen.getByRole('button',{name:'前の段階を見る'}));fireEvent.click(screen.getByRole('button',{name:'全文を開く'}))
  await waitFor(()=>expect(document.querySelector('[data-source-view="history-full-"][data-source-block="'+prior+'"]')).toBeTruthy())
  expect(states()[prior].status).toBe('NOT_MOUNTED_BY_DESIGN');expect(copies(prior)).toHaveLength(1);expect(copies(prior)[0].querySelector('button')).toBeNull()
 })

 it('前段階の式を再掲しても原関係番号9を一つだけ保持し、解答slotを増やさない',async()=>{
  const id='qf01-n21-answer',prior='qf01-r3-c3-s08-f04';prepare(id)
  render(<Lesson/>);await waitFor(()=>expect(states()[prior]?.status).toBe('NOT_MOUNTED_BY_DESIGN'))
  expect(copies(prior)).toHaveLength(1);expect(copies(prior)[0].querySelectorAll('.numbered-equation-label')).toHaveLength(1)
  expect(copies(prior)[0].querySelector('.numbered-equation-label')?.getAttribute('aria-label')).toBe('式9')
  expect(copies(prior)[0].querySelector('button')).toBeNull();expect(screen.getAllByTestId('textbook-item-'+id)).toHaveLength(1)
 })

 it('reset/reloadで旧currentの再掲状態を捨て、別scopeのcursor保存を変更しない',async()=>{
  prepare(endpoint);mockSourceRect(p06,()=>new DOMRect(20,-100,240,60))
  const other='math-textbook-compact-v1:'+unit.unitId+':r3:scope:other-kept';localStorage.setItem(other,'4')
  let view=render(<Lesson/>);await waitFor(()=>expect(copies(p06)).toHaveLength(1))
  act(()=>useAppStore.getState().resetTextbookUnit(unit.unitId,unit))
  await screen.findByTestId('textbook-item-'+active[0].id);expect(states()[p06]).toBeUndefined();expect(copies(p06)).toHaveLength(0)
  expect(localStorage.getItem(other)).toBe('4');const before=JSON.stringify(useAppStore.getState().textbookProgress)
  view.unmount();await act(async()=>{await useAppStore.persist.rehydrate()});view=render(<Lesson/>);await screen.findByTestId('textbook-item-'+active[0].id)
  expect(states()[p06]).toBeUndefined();expect(copies(p06)).toHaveLength(0);expect(localStorage.getItem(other)).toBe('4');expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before)
 })

 it('コピー挿入で可視判定が振動する場合は有限frameでUNVERIFIED停止する',async()=>{
  const frames=new Map<number,FrameRequestCallback>();let next=0
  window.requestAnimationFrame=callback=>{frames.set(++next,callback);return next};window.cancelAnimationFrame=id=>{frames.delete(id)}
  const id='qf01-r3-c1-s01-p01';mockSourceRect(id,()=>new DOMRect(20,copies(id).length?100:-100,240,60))
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+active[0].id)
  for(let turn=0;turn<24&&frames.size;turn++)act(()=>{const pending=[...frames.values()];frames.clear();for(const callback of pending)callback(0)})
  expect(states()[id]).toEqual({status:'UNVERIFIED',reason:'NON_CONVERGENT_LAYOUT'});expect(frames.size).toBe(0);expect(copies(id)).toHaveLength(0)
  expect((screen.getByTestId('textbook-item-'+active[0].id) as HTMLButtonElement).disabled).toBe(true);expect(Object.keys(useAppStore.getState().textbookProgress)).toHaveLength(0)
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

describe('D04 source-bound R3本文math（実ピクセル合格ではない）',()=>{
 function prepareBody(id:string){const at=active.findIndex(item=>item.id===id);act(()=>{for(const item of active.slice(0,at))useAppStore.getState().answerTextbook(unit,item.id,item.answer)});const q=reading.interactions.find(q=>q.id===id)!;localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test',String(Number(q.stageId.split('-').at(-1))-1));return active[at]}
 function bodyAnnotations(element:Element){return [...element.querySelectorAll('[data-qf01-prose-math] annotation')].map(node=>{const match=/^\{\\relax ([\s\S]*)\}$/.exec(node.textContent!);expect(match).not.toBeNull();return match![1]})}
 function sourceParagraph(source:Awaited<ReturnType<typeof validateQF01R3Reading>>,id:string){const block=source.blocks.get(id)!;if(block.type!=='paragraph')throw Error('TEST_PARAGRAPH');return block}
 it('本文140 typed単位と原math22を一baseに保ち、内部字間/演算/単位を変えない',async()=>{
  const source=await validateQF01R3Reading(unit,reading),latex:string[]=[]
  for(const id of source.metadata.canonicalBlockIds){const b=source.blocks.get(id)!;if(b.type!=='paragraph')continue
   b.parts.forEach((part,partIndex)=>{if(part.type==='math')latex.push(part.latex);if(part.type==='text')latex.push(...qf01R3BodySlice(source,{blockId:id,partIndex,start:0,end:part.text.length,kind:'whole-part'},part.text).flatMap(t=>t.type==='math'?[t.latex]:[]))})
  }
  expect(latex).toHaveLength(162)
  for(const value of latex){const plain=normalizeTextbookMath(value),grouped=R3BodyText.atomicLatex(value)
   expect(normalizeTextbookMath(grouped)).toBe(grouped)
   const original=document.createElement('div'),rendered=document.createElement('div');original.innerHTML=katex.renderToString(plain,{throwOnError:true});rendered.innerHTML=katex.renderToString(grouped,{throwOnError:true})
   const bases=[...original.querySelector('.katex-html')!.children],groupBases=[...rendered.querySelector('.katex-html')!.children];expect(groupBases).toHaveLength(1)
   const inner=bases.flatMap(base=>[...base.children].filter(c=>!c.classList.contains('strut'))).map(c=>c.outerHTML).join('')
   const group=[...groupBases[0].children].filter(c=>!c.classList.contains('strut'));expect(group).toHaveLength(1);expect(group[0].className).toBe('mord');expect(group[0].innerHTML).toBe(inner)
   expect(rendered.querySelector('annotation')?.textContent).toBe(grouped);expect(rendered.querySelector('.katex-error')).toBeNull()
  }
 })
 it('007相当の原math partも本文専用groupへ渡し、原source文字列を保持する',async()=>{
  prepareBody('qf01-n03-answer');render(<Lesson/>);await screen.findByTestId('textbook-item-qf01-n03-answer')
  const row=document.querySelector('[data-source-block="qf01-r3-c1-s02-p01"][data-source-view="canonical"]')!,paragraph=row.querySelector('.reading-paragraph')!
  expect([...paragraph.querySelectorAll('annotation')].map(n=>n.textContent)).toContain('{\\relax f(x)=4x-6}')
  for(const math of paragraph.querySelectorAll('.katex-html'))expect(math.children).toHaveLength(1)
  const source=await validateQF01R3Reading(unit,reading);expect(sourceParagraph(source,'qf01-r3-c1-s02-p01').parts[1]).toMatchObject({type:'math',latex:'f(x)=4x-6'})
 })
 it('既存の長式display分岐でもgroupの括弧/符号を失わず一単位で描く（模擬寸法）',async()=>{
  const source=await validateQF01R3Reading(unit,reading),id='qf01-r3-c2-s06-p07',part=sourceParagraph(source,id).parts[0];if(part.type!=='text')throw Error('TEST_TEXT')
  const measure=HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return this.classList.contains('typeset-inline-probe')?new DOMRect(0,0,180,24):measure.call(this)})
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockImplementation(function(this:HTMLElement){return this.classList.contains('reading-paragraph')?224:0})
  const view=render(<p className="reading-paragraph"><R3BodyText source={source} origin={{blockId:id,partIndex:0,start:0,end:part.text.length,kind:'whole-part'}} visibleText={part.text} sourceId={id} unitId={unit.unitId}/></p>)
  await waitFor(()=>expect(view.container.querySelectorAll('.typeset-inline-math--display').length).toBeGreaterThan(0))
  for(const wrapper of view.container.querySelectorAll('[data-qf01-prose-math]')){expect(wrapper.querySelectorAll('.katex')).toHaveLength(1);expect(wrapper.querySelector('.katex-error')).toBeNull();expect(wrapper.querySelector('.katex-html')!.children).toHaveLength(1);expect(wrapper.querySelector('annotation')?.textContent).toMatch(/^\{\\relax [\s\S]*\}$/)}
  expect(bodyAnnotations(view.container)).toEqual(['a^2-a-a+1','a'])
 })
 it('実102 text partsの字面を保持し、63 parts140単位と5つのcmを境界付きで扱う',async()=>{
  const source=await validateQF01R3Reading(unit,reading);validateQF01R3BodySource(source)
  let parts=0,math=0,withMath=0,quantities=0
  for(const id of source.metadata.canonicalBlockIds){const b=source.blocks.get(id)!;if(b.type!=='paragraph'&&b.type!=='formula')continue
   b.parts.forEach((part,partIndex)=>{if(part.type!=='text')return;parts++
    const tokens=qf01R3BodySlice(source,{blockId:id,partIndex,start:0,end:part.text.length,kind:'whole-part'},part.text)
    expect(tokens.map(t=>t.type==='text'?t.text:part.text.slice(t.start,t.end)).join('')).toBe(part.text)
    const typed=tokens.filter(t=>t.type==='math');math+=typed.length;if(typed.length)withMath++
    for(const token of typed)if(token.unit){quantities++;expect(token.unit).toBe('cm');expect(token.latex).toMatch(/^(40|x|y)\\,\\mathrm\{cm\}$/)}
   })
  }
  expect([parts,withMath,math,quantities]).toEqual([102,63,140,5])
  expect(source.metadata.canonicalBlockIds).toEqual(reading.canonicalBlockIds);expect(source.metadata.interactions.map(q=>q.id)).toEqual(active.map(item=>item.id))
 })
 it.each([
  ['qf01-r3-c1-s01-p05',2,['f(x)','f','x','x']],
  ['qf01-r3-c2-s06-p05',0,['-1(a-1)','a^2-a']],
  ['qf01-r3-c2-s06-p06',0,['+1']],
  ['qf01-r3-c2-s06-p07',0,['a^2-a-a+1','a']],
  ['qf01-r3-c3-s08-p05',0,['x<20','x>0']],
  ['qf01-r3-c3-s09-p08',0,['y<20','20-y>0','y>0','20-y<20','x=20-y','0<x<20']],
 ] as const)('%s part%sの関数/符号/指数/連鎖比較を完全な数学単位へ保つ',async(id,index,expected)=>{
  const source=await validateQF01R3Reading(unit,reading),part=sourceParagraph(source,id).parts[index];if(part.type!=='text')throw Error('TEST_TEXT')
  const tokens=qf01R3BodySlice(source,{blockId:id,partIndex:index,start:0,end:part.text.length,kind:'whole-part'},part.text)
  expect(tokens.filter(t=>t.type==='math').map(t=>t.latex)).toEqual(expected)
 })
 it('日本語の辺の名詞を数式化せず、異なる英語/原textは同じsourceとして受け入れない',async()=>{
  const source=await validateQF01R3Reading(unit,reading),id='qf01-r3-c3-s07-p01',part=sourceParagraph(source,id).parts[0];if(part.type!=='text')throw Error('TEST_TEXT')
  const origin={blockId:id,partIndex:0,start:0,end:part.text.length,kind:'whole-part' as const}
  expect(qf01R3BodySlice(source,origin,part.text)).toEqual([{type:'text',text:part.text}])
  expect(()=>qf01R3BodySlice(source,origin,part.text+' Step 1 uses cm and HTML')).toThrow(/VISIBLE_SLICE/)
  const changed={...source,blocks:new Map(source.blocks)},block=sourceParagraph(source,id)
  changed.blocks.set(id,{...block,parts:[{...part,text:'Step 1 uses cm and HTML'}]})
  expect(()=>validateQF01R3BodySource(changed)).toThrow(/SOURCE_BINDING/)
 })
 it('実pending paragraph10件は原piecesへ結び、答えと可視外の22数学単位を描かない',async()=>{
  const source=await validateQF01R3Reading(unit,reading);let paragraphs=0,hidden=0,visibleText=0
  for(const [at,q]of source.metadata.interactions.entries()){
   const pieces=q.projection.pending.pieces;if(!pieces)continue
   const solved=new Set(source.metadata.interactions.slice(0,at).map(q=>q.id)),projected=projectQF01R3Block(source,q.source.blockId,solved,{helpFor:q.id})!
   expect(projected).toBeTruthy();const origins=qf01R3BodyOrigins(source,q.source.blockId,projected,solved),block=sourceParagraph(source,q.source.blockId)
   expect(origins.map(o=>o.partIndex)).toEqual(pieces.map(p=>p.partIndex));paragraphs++
   for(const [index,origin]of origins.entries()){
    const original=block.parts[origin.partIndex];if(original.type!=='text')continue
    const all=qf01R3BodySlice(source,{...origin,kind:'whole-part',start:0,end:original.text.length},original.text).filter(t=>t.type==='math')
    if(origin.kind==='slot'){hidden+=all.length;expect(projected.parts![index]).toMatchObject({type:'choice',itemId:q.id});continue}
    const part=projected.parts![index];if(part.type!=='text')throw Error('TEST_VISIBLE_TEXT')
    const tokens=qf01R3BodySlice(source,origin,part.text);expect(part.text).toBe(original.text.slice(origin.start,origin.end));visibleText++
    const math=tokens.filter(t=>t.type==='math');expect(math.every(t=>t.start>=origin.start&&t.end<=origin.end)).toBe(true);hidden+=all.length-math.length
   }
  }
  expect([paragraphs,visibleText,hidden]).toEqual([10,20,22])
 })
 it.each([
  ['qf01-r3-c3-s08-p08','0<x<20'],
  ['qf01-r3-c1-s03-p03','4(a−1)'],
  ['qf01-r3-c3-s07-p02','40cm'],
 ] as const)('%sの%sを可視slice境界で切ったら補完せず停止する',async(id,lexeme)=>{
  const source=await validateQF01R3Reading(unit,reading),part=sourceParagraph(source,id).parts[0];if(part.type!=='text')throw Error('TEST_TEXT')
  const start=part.text.indexOf(lexeme);expect(start).toBeGreaterThanOrEqual(0)
  expect(()=>qf01R3BodySlice(source,{blockId:id,partIndex:0,kind:'text-span',start:start+1,end:part.text.length},part.text.slice(start+1))).toThrow(/SPLIT_MATH_UNIT/)
  expect(()=>qf01R3BodySlice(source,{blockId:id,partIndex:0,kind:'text-span',start:0,end:start+lexeme.length-1},part.text.slice(0,start+lexeme.length-1))).toThrow(/SPLIT_MATH_UNIT/)
  expect(()=>qf01R3BodySlice(source,{blockId:id,partIndex:0,kind:'text-span',start:-1,end:part.text.length},part.text)).toThrow(/VISIBLE_SLICE/)
  expect(()=>qf01R3BodySlice(source,{blockId:id,partIndex:0,kind:'slot',start:0,end:0},'')).toThrow(/HIDDEN_SLOT/)
 })
 it('current本文の比較を実KaTeX一単位ずつへ描き、誤答では後半の境界説明を出さない',async()=>{
  const id='qf01-r3-n19-endpoints-answer',item=prepareBody(id)
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+id)
  const context=document.querySelector('[data-source-block="qf01-r3-c3-s08-p05"][data-source-view="canonical"]')!
  expect(bodyAnnotations(context)).toEqual(['x<20','x>0'])
  const paragraph=()=>document.querySelector('[data-source-block="qf01-r3-c3-s08-p07"][data-source-view="canonical"]')!
  const visible=()=>[...paragraph().querySelectorAll('[data-qf01-prose-math]')].map(n=>[n.getAttribute('data-qf01-prose-part'),n.getAttribute('data-qf01-prose-start'),n.getAttribute('data-qf01-prose-end'),n.querySelector('annotation')?.textContent])
  const before=visible();expect(before).toHaveLength(2);expect(paragraph().querySelector('[data-qf01-prose-part="2"]')).toBeNull()
  fireEvent.click(screen.getByTestId('textbook-item-'+id));clickChoice(id,item.choices!.find(v=>v!==item.answer)!)
  expect(visible()).toEqual(before);expect(paragraph().querySelector('[data-qf01-prose-part="2"]')).toBeNull()
  expect(useAppStore.getState().textbookProgress[unit.unitId].answers[id].resolved).toBe(false)
  clickChoice(id,item.answer);await waitFor(()=>expect(paragraph().querySelectorAll('[data-qf01-prose-part="2"]')).toHaveLength(6))
  expect(bodyAnnotations(paragraph())).toEqual(['0','20','x=0','0','x=20','y=20-x=0','0','40'])
 })
 it('全solved/history/summaryの140原単位とcmを描き、view別source IDと保存を保持する',async()=>{
  act(()=>{for(const item of active)useAppStore.getState().answerTextbook(unit,item.id,item.answer)})
  localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test','8')
  const saved=JSON.stringify(useAppStore.getState().textbookProgress);render(<Lesson/>);await screen.findByTestId('qf01-unit-summary')
  fireEvent.click(screen.getByRole('button',{name:'前の段階を見る'}));fireEvent.click(screen.getByRole('button',{name:'全文を開く'}))
  const wrappers=[...document.querySelectorAll<HTMLElement>('[data-qf01-prose-math]')],identities=new Set(wrappers.map(n=>[n.dataset.qf01ProseBlock,n.dataset.qf01ProsePart,n.dataset.qf01ProseStart,n.dataset.qf01ProseEnd].join(':')))
  expect(identities.size).toBe(140);expect(new Set(wrappers.map(n=>n.dataset.qf01ProseSourceId)).size).toBe(wrappers.length)
  const units=wrappers.filter(n=>n.dataset.qf01ProseUnit==='cm'),unitIds=new Set(units.map(n=>[n.dataset.qf01ProseBlock,n.dataset.qf01ProsePart,n.dataset.qf01ProseStart].join(':')))
  expect(unitIds.size).toBe(5)
  for(const wrapper of wrappers){expect(wrapper.querySelectorAll('.katex')).toHaveLength(1);expect(wrapper.querySelector('.katex-error')).toBeNull()}
  for(const wrapper of units){expect(wrapper.dataset.qf01ProseKind).toBe('quantity');expect(wrapper.querySelector('annotation')?.textContent).toMatch(/\\mathrm\{cm\}/);expect([...wrapper.querySelectorAll('.mathnormal')].some(n=>n.textContent==='c'||n.textContent==='m')).toBe(false)}
  const prose=document.querySelector('[data-source-block="qf01-r3-c3-s07-p01"][data-source-view="history-full-"]')!
  expect(prose.querySelector('[data-qf01-prose-math]')).toBeNull();expect(prose.textContent).toContain('縦を決めたときに横がどう決まるか')
  expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(saved)
 },15000)
 it('実projectorの可視parts対応が壊れたらalert/disabled/inertで回答を止める',async()=>{
  const original=transformationReading.projectQF01R3Block
  vi.spyOn(transformationReading,'projectQF01R3Block').mockImplementation((...args)=>{const projected=original(...args);if(args[1]!=='qf01-r3-c1-s01-p01'||!projected?.parts)return projected;return {...projected,parts:projected.parts.map((p,index)=>index===0&&p.type==='text'?{...p,text:p.text.slice(1)}:p)}})
  render(<Lesson/>);await screen.findByTestId('qf01-r3-prose-error')
  const slot=screen.getByTestId('textbook-item-'+active[0].id);expect(slot.hasAttribute('disabled')).toBe(true);expect(document.querySelector('.math-textbook-stage--current')?.hasAttribute('inert')).toBe(true)
  const saved=JSON.stringify(useAppStore.getState().textbookProgress);fireEvent.click(slot);expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(saved)
  expect(screen.queryByTestId('inline-choice-panel-'+active[0].id)?.querySelector('button:not([disabled])')).toBeNull()
 })
 it('旧R2 archiveへ本文source-bound描画を適用しない',async()=>{
  render(<MemoryRouter><QF01Revision2Archive/></MemoryRouter>);await screen.findByTestId('qf01-revision2-archive')
  expect(document.querySelector('[data-qf01-prose-math]')).toBeNull();expect(document.querySelector('[data-qf01-revision="3"]')).toBeNull()
 })
})

describe('D05 V2の登録R3混在表面（実ピクセルPASSではない）',()=>{
 const recipes=R3MixedText.recipes
 type MixedRow=typeof recipes[number]
 const origin=(row:MixedRow)=>({field:row[0],owner:row[1],index:row[2],start:0,end:row[3].length})
 function original(source:Awaited<ReturnType<typeof validateQF01R3Reading>>,row:MixedRow){
  if(row[0]==='marker'){const b=source.blocks.get(row[1]);if(b?.type!=='marker')throw Error('TEST_MARKER');return b.text}
  const item=source.items.get(row[1])!,q=source.metadata.interactions.find(q=>q.id===row[1])!
  return row[0]==='choice'?item.choices![row[2]]:row[0]==='hint'?item.hints[row[2]]:q.wrongReasonByChoiceIndex[row[2]]!
 }
 it('原47＋feedback140の全187 source/hash/UTF16境界191を照合し、null35を表示候補へしない',async()=>{
  const source=await validateQF01R3Reading(unit,reading);await R3MixedText.validateSource(source)
  let math=0,withMath=0;const groups:Record<string,number>={}
  for(const row of recipes){
   const text=original(source,row);expect(text).toBe(row[3]);expect(createHash('sha256').update(text).digest('hex')).toBe(row[4])
   const tokens=R3MixedText.slice(source,origin(row),text)
   expect(tokens.map(t=>t.type==='text'?t.text:text.slice(t.start,t.end)).join('')).toBe(text)
   const typed=tokens.filter(t=>t.type==='math');math+=typed.length;if(typed.length)withMath++;groups[row[0]]=(groups[row[0]]??0)+1
  }
  expect([recipes.length,math,withMath]).toEqual([187,191,122]);expect(groups).toEqual({marker:23,choice:24,hint:70,'wrong-reason':70})
  expect(reading.interactions.flatMap(q=>q.wrongReasonByChoiceIndex).filter(x=>x===null)).toHaveLength(35)
  expect(recipes.some(r=>r[0]==='wrong-reason'&&r[2]===0)).toBe(false)
  expect(items.filter(i=>reading.interactions.some(q=>q.id===i.id&&q.answerDomain==='semantic')).every(i=>i.acceptedAnswers.length===0)).toBe(true)
 })
 it.each([
  ['marker','qf01-r3-c1-s01-m01',0,[]],
  ['marker','qf01-r3-c3-s07-m01',0,[]],
  ['marker','qf01-r3-c3-s08-m02',0,['x','0<x<20']],
  ['choice','qf01-r3-n14-boundary-answer',1,[]],
  ['choice','qf01-r3-n12c-constant-product-answer',1,['-1','a']],
  ['hint','qf01-r3-n04-value-meaning-answer',1,['f(\\text{入力})=\\text{対応する値}']],
  ['hint','qf01-n13-answer',1,['+1','-1']],
  ['hint','qf01-r3-n16-target-answer',1,[]],
  ['wrong-reason','qf01-n12a-answer',1,['-1']],
  ['wrong-reason','qf01-n12a-answer',2,['a-1']],
  ['wrong-reason','qf01-n14-answer',1,['\\text{縦}\\times \\text{横}']],
 ] as const)('%s/%s/%sの通常label/符号/placeholderを採用境界に保つ',async(field,owner,index,expected)=>{
  const source=await validateQF01R3Reading(unit,reading),row=recipes.find(r=>r[0]===field&&r[1]===owner&&r[2]===index)!
  expect(R3MixedText.slice(source,origin(row),original(source,row)).filter(t=>t.type==='math').map(t=>t.latex)).toEqual(expected)
 })
 it('候補191式のungrouped/groupedだけを比較し、元AST/内部HTML/spacingを保ち一baseへする',()=>{
  const clean=(value:unknown):unknown=>Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='loc').map(([key,v])=>[key,clean(v)])):value
  const parse=(katex as unknown as {__parse:(input:string)=>unknown}).__parse
  let count=0
  for(const row of recipes)for(const span of row[5]){
   const input=normalizeTextbookMath(span[3]),grouped=normalizeTextbookMath(R3BodyText.atomicLatex(span[3]))
   const oldAST=clean(parse(input)),newAST=clean(parse(grouped)) as {type:string;body:unknown}[]
   expect(newAST).toHaveLength(1);expect(newAST[0].type).toBe('ordgroup');expect(newAST[0].body).toEqual(oldAST)
   const plain=document.createElement('div'),group=document.createElement('div');plain.innerHTML=katex.renderToString(input,{throwOnError:true});group.innerHTML=katex.renderToString(grouped,{throwOnError:true})
   const bases=[...group.querySelector('.katex-html')!.children];expect(bases).toHaveLength(1)
   const ink=(base:Element)=>[...base.children].filter(n=>!n.classList.contains('strut')).map(n=>n.outerHTML).join('')
   const before=[...plain.querySelector('.katex-html')!.children].map(ink).join(''),outer=[...bases[0].children].filter(n=>!n.classList.contains('strut'))
   expect(outer).toHaveLength(1);expect(outer[0].className).toBe('mord');expect(outer[0].innerHTML).toBe(before)
   expect(group.querySelector('annotation')?.textContent).toBe(grouped);count++
  }
  expect(count).toBe(191)
 })
 it('wrong owner/index/null/原文変更/数学途中切断をplain fallbackで通さない',async()=>{
  const source=await validateQF01R3Reading(unit,reading),row=recipes.find(r=>r[0]==='marker'&&r[1]==='qf01-r3-c3-s08-m02')!,o=origin(row),text=row[3],start=text.indexOf('0<x<20')
  expect(()=>R3MixedText.slice(source,{...o,owner:'unknown'},text)).toThrow(/R3_MIXED_/)
  expect(()=>R3MixedText.slice(source,{...o,index:1},text)).toThrow(/R3_MIXED_/)
  expect(()=>R3MixedText.slice(source,{...o,start:start+1},text.slice(start+1))).toThrow(/SPLIT_MATH_UNIT/)
  expect(()=>R3MixedText.slice(source,{...o,end:start+4},text.slice(0,start+4))).toThrow(/SPLIT_MATH_UNIT/)
  expect(()=>R3MixedText.slice(source,o,text+' x=20')).toThrow(/VISIBLE_SLICE/)
  expect(()=>R3MixedText.slice(source,{field:'wrong-reason',owner:'qf01-n01-answer',index:0,start:0,end:0},'')).toThrow(/SOURCE_IDENTITY/)
  const changed={...source,blocks:new Map(source.blocks)},block=source.blocks.get(row[1])!;if(block.type!=='marker')throw Error('TEST_MARKER')
  changed.blocks.set(block.id,{...block,text:block.text+'変更'})
  await expect(R3MixedText.validateSource(changed)).rejects.toThrow(/SOURCE_IDENTITY/)
 })
 it('help0をone-flowで描き、実二誤答後だけhint1と別の理由を描く',async()=>{
  const id=active[0].id,item=active[0]
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+id)
  expect(document.querySelector('[data-qf01-mixed-field="hint"]')).toBeNull()
  fireEvent.click(screen.getByTestId('textbook-item-'+id));fireEvent.click(screen.getByRole('button',{name:'手掛かりを見る'}))
  const help=document.querySelector<HTMLElement>('[data-qf01-mixed-field="hint"][data-qf01-mixed-index="0"]')!
  expect(help.parentElement?.classList.contains('reading-choice-hint')).toBe(true);expect(help.parentElement?.children).toHaveLength(1)
  expect(help.parentElement?.childNodes).toHaveLength(1);expect(help.querySelectorAll('[data-qf01-mixed-math]')).toHaveLength(2)
  const wrongs=item.choices!.filter(v=>v!==item.answer);clickChoice(id,wrongs[0])
  expect(document.querySelector('[data-qf01-mixed-field="hint"][data-qf01-mixed-index="1"]')).toBeNull()
  clickChoice(id,wrongs[1]);expect(useAppStore.getState().textbookProgress[unit.unitId].answers[id].attemptCount).toBe(2)
  expect(document.querySelector('[data-qf01-mixed-field="hint"][data-qf01-mixed-index="1"]')).toBeTruthy()
  expect(document.querySelector('[data-qf01-mixed-field="wrong-reason"]')?.getAttribute('data-qf01-mixed-index')).toBe('2')
  clickChoice(id,item.answer);await waitFor(()=>expect(screen.queryByTestId('inline-choice-panel-'+id)).toBeNull())
  expect(document.querySelector('[data-qf01-mixed-field="hint"]')).toBeNull()
 })
 it('semantic全候補を描き、未知未来のmarker/help/semanticをDOMへ出さない',async()=>{
  const id='qf01-r3-n04-value-meaning-answer',at=active.findIndex(item=>item.id===id),item=active[at]
  act(()=>{for(const prior of active.slice(0,at))useAppStore.getState().answerTextbook(unit,prior.id,prior.answer)})
  localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r3:scope:r3-react-dom-test','1')
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+id);fireEvent.click(screen.getByTestId('textbook-item-'+id))
  const panel=screen.getByTestId('inline-choice-panel-'+id),choices=panel.querySelectorAll('[data-qf01-mixed-field="choice"]')
  const ordered=getTextbookChoices(unit,{...item,scaffoldLevel:'light'}),indices=ordered.map(value=>item.choices!.indexOf(value))
  expect(choices).toHaveLength(3);expect([...choices].map(n=>Number(n.getAttribute('data-qf01-mixed-index')))).toEqual(indices)
  expect([...choices].map(n=>n.querySelectorAll('[data-qf01-mixed-math]').length)).toEqual(indices.map(index=>[1,2,0][index]))
  expect(document.querySelector('[data-qf01-mixed-owner="qf01-r3-c3-s08-m02"]')).toBeNull()
  expect(document.querySelector('[data-qf01-mixed-field="hint"]')).toBeNull()
  clickChoice(id,item.choices![1]);expect(useAppStore.getState().textbookProgress[unit.unitId].answers[id].resolved).toBe(false)
  expect(document.querySelector('[data-testid="textbook-hint-'+id+'"] [data-qf01-mixed-field="choice"]')).toBeTruthy()
 })
 it('projected markerが原sourceと違えばalert/disabled/inertで回答を停止する',async()=>{
  const original=transformationReading.projectQF01R3Block
  vi.spyOn(transformationReading,'projectQF01R3Block').mockImplementation((...args)=>{const p=original(...args);if(p?.source.type!=='marker'||p.source.id!=='qf01-r3-c1-s01-m01')return p;return {...p,source:{...p.source,text:'source mismatch x=99'}}})
  render(<Lesson/>);await screen.findByTestId('qf01-r3-mixed-error')
  expect(screen.getByTestId('textbook-item-'+active[0].id).hasAttribute('disabled')).toBe(true)
  expect(document.querySelector('.math-textbook-stage--current')?.hasAttribute('inert')).toBe(true)
  expect(document.body.textContent).not.toContain('source mismatch x=99')
 })
 it('D06はR3の360px以下だけのpanel/入れ子asideへ局所規則を置く',async()=>{
  render(<Lesson/>);await screen.findByTestId('textbook-item-'+active[0].id)
  const style=document.querySelector<HTMLStyleElement>('[data-qf01-r3-narrow-inline-layout]')!
  expect(style.closest('[data-qf01-revision="3"]')).toBeTruthy();expect(style.textContent).toContain('@media (max-width:360px)')
  const media=style.sheet!.cssRules[0] as CSSMediaRule,rules=[...media.cssRules] as CSSStyleRule[]
  expect(media.conditionText).toBe('(max-width:360px)');expect(rules).toHaveLength(3)
  expect(rules.map(rule=>rule.selectorText)).toEqual(['[data-qf01-revision="3"] .reading-inline-choice-panel','[data-qf01-revision="3"] .reading-inline-choice-panel > aside.reading-choice-hint','[data-qf01-revision="3"] .reading-inline-choice-panel > aside.reading-choice-hint > p'])
  expect(rules.map(rule=>rule.style.getPropertyValue('padding-left'))).toEqual(['2px','0',''])
  expect(rules.map(rule=>rule.style.getPropertyValue('min-width'))).toEqual(['','0','0'])
  for(const rule of rules)for(let i=0;i<rule.style.length;i++){const property=rule.style[i];expect(['padding-left','padding-right','min-width']).toContain(property);expect(rule.style.getPropertyPriority(property)).toBe('')}
  fireEvent.click(screen.getByTestId('textbook-item-'+active[0].id));fireEvent.click(screen.getByRole('button',{name:'手掛かりを見る'}))
  const standalone=document.querySelector('[data-qf01-mixed-field="hint"][data-qf01-mixed-index="0"]')!.parentElement!
  expect(standalone.tagName).toBe('P');expect(standalone.classList.contains('reading-choice-hint')).toBe(true);expect(standalone.hasAttribute('style')).toBe(false)
 })
 it('旧R2にはD06局所styleも新mixed sourceも挿入しない',async()=>{
  render(<MemoryRouter><QF01Revision2Archive/></MemoryRouter>);await screen.findByTestId('qf01-revision2-archive')
  expect(document.querySelector('[data-qf01-r3-narrow-inline-layout]')).toBeNull();expect(document.querySelector('[data-qf01-mixed-inline-flow]')).toBeNull()
 })
})
