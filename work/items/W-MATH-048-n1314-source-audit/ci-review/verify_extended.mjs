// B-owned bounded CODE probe. Writes temporary evidence only; no product/Store-ledger edits.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const out=process.env.EVIDENCE_DIR;
assert.ok(out && path.isAbsolute(out) && !path.resolve(out).startsWith(path.resolve('.')+path.sep), 'explicit output outside repository required');
fs.mkdirSync(out,{recursive:true});
const input=JSON.parse(fs.readFileSync(process.env.W048_FIXTURES||'/tmp/w048-ci-final/reports/w048-evidence/contracts/BROWSER_FIXTURES.json'));
const fixture=input.fixtures.find(f=>f.code==='n13');assert.ok(fixture);
const {unit,legacy,visibleChoices,contract}=fixture, section=unit.sections[0], itemMap=new Map(section.items.map(i=>[i.id,i]));
const app=process.env.APP_URL||'http://127.0.0.1:4391/kyotsu-step-web/';
const report={status:'RUNNING',fixtureSourceSHA:input.sourceSHA,scope:'B_CODE_EXTENDED_N13_ONLY_NOT_FORMAL_R07',rows:[],failures:[],limits:['Synthetic old-answer records are seeded into real browser persistence; this is not authentic historical learner data.','This script covers N13; N14/44 partial-slot evidence is produced separately by verify_n14_extended.','No old-image baseline comparison, other-mode exhaustive regression, semantic teaching acceptance or formal native R07 packet.','Equal-axis probe measures visible formula starts and computed flex/grid alignment, not mathematical relation-glyph alignment across arbitrary line breaks.','A pointer click and keyboard Enter exercise real browser actionability; exhaustive keyboard tab order and assistive technology audit are not covered.'],images:[]};
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--disable-software-rasterizer','--no-zygote','--single-process']});
const check=(ok,label,data)=>{if(!ok)report.failures.push({label,data});};
const rec=(i)=>({itemId:i.id,value:i.answer,firstValue:'old-original-wrong',resolved:true,isFirstCorrect:false,attemptCount:3,firstAnsweredAt:111,lastAnsweredAt:222});
async function load(page,id=unit.unitId){await page.goto(app+'#/learning/textbook/'+id);await page.getByTestId('textbook-reading-flow').waitFor();await page.evaluate(()=>document.fonts.ready);}
async function ids(page){return page.locator('button[data-testid^="textbook-item-"]:visible').evaluateAll(ns=>ns.map(n=>n.dataset.testid.slice('textbook-item-'.length)));}
async function nextUntilPending(page){for(let n=0;n<100;n++){const pending=await ids(page);if(pending.length)return pending;const b=page.getByTestId('math-textbook-next-stage');if(!await b.count())return [];await b.click();}throw Error('stage loop limit');}
async function shot(page,name){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
async function measure(page,label,width){
 const m=await page.locator('.textbook-reading-flow').evaluate((root,{contract,label})=>{
 const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
 const visible=e=>Boolean(e.getClientRects().length);
 const formulas=[...root.querySelectorAll('.reading-formula-line')].filter(visible).map(line=>{const exp=line.querySelector('.reading-formula-expression');const math=exp?.querySelector('.katex-html');return {id:line.dataset.testid,font:getComputedStyle(line).fontSize,katex:[...line.querySelectorAll('.katex')].map(k=>getComputedStyle(k).fontSize),derivation:line.closest('[data-derivation-id]')?.dataset.derivationId,display:exp&&getComputedStyle(exp).display,justify:exp&&getComputedStyle(exp).justifyContent,justifyItems:exp&&getComputedStyle(exp).justifyItems,expression:exp&&rect(exp),firstMath:math&&rect(math)};});
 const options=[...root.querySelectorAll('.reading-choice-option strong')].filter(visible).map(e=>({font:getComputedStyle(e).fontSize,katex:[...e.querySelectorAll('.katex')].map(k=>getComputedStyle(k).fontSize)}));
 const numbers=[...root.querySelectorAll('[data-equation-number]')].filter(visible).map(e=>{const l=e.querySelector('.numbered-equation-label'),b=l&&rect(l);const candidates=[...e.querySelectorAll('.katex-html,button')].filter(visible).map(rect);return {number:Number(e.dataset.equationNumber),formulaIds:[...e.querySelectorAll('[data-testid^="textbook-formula-"]')].map(x=>x.dataset.testid.slice('textbook-formula-'.length)),label:b,collision:b&&candidates.some(r=>r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top)};});
 const figures=[...root.querySelectorAll('img')].filter(visible).map(e=>({src:e.getAttribute('src'),naturalWidth:e.naturalWidth,box:rect(e),caption:e.closest('figure')?.querySelector('figcaption')?.textContent}));
 return {label,formulas,options,numbers,figures,overflow:document.documentElement.scrollWidth>innerWidth+1};
 },{contract,label});
 check(!m.overflow,`${width}/${label}/document-overflow`,m);
 for(const f of m.formulas){check(f.font==='18px',`${width}/${label}/formula-18px`,f);check(f.katex.every(v=>v==='18px'),`${width}/${label}/formula-katex-inherits18`,f);if(f.derivation&&f.expression){check(f.justify==='flex-start'&&f.justifyItems==='start',`${width}/${label}/derivation-flex-grid-left`,f);}}
 for(const o of m.options){check(o.font==='18px'&&o.katex.every(v=>v==='18px'),`${width}/${label}/choice18`,o);}
 const seen=new Set();for(const n of m.numbers){check(!seen.has(n.number),`${width}/${label}/number-unique`,n);seen.add(n.number);check(!n.collision,`${width}/${label}/number-collision`,n);check(n.label.left>=-1&&n.label.right<=width+1,`${width}/${label}/number-within-viewport`,n);check(n.formulaIds.length===1&&contract.equationNumbers[n.formulaIds[0]]===n.number,`${width}/${label}/number-final-row-map`,n);}
 return m;
}
try{
 for(const width of [320,390,430,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await load(page);
  const row={width,states:[],answered:[],figureGates:[],saveTests:[],navigation:[],pointerSelections:0,keyboardSelections:0};report.rows.push(row);
  for(let guard=0;guard<100;guard++){
   const available=await nextUntilPending(page);if(!available.length)break;const id=available[0],item=itemMap.get(id);assert.ok(item);assert.ok(!row.answered.includes(id));
   const figureSrcs=await page.locator('.textbook-reading-flow img').evaluateAll(ns=>ns.map(n=>n.getAttribute('src')));
   const beforeQ01=!row.answered.includes('n13-01'),beforeQ04=!row.answered.includes('n13-04');
   check(figureSrcs.some(s=>s.includes('n13-f02'))===!beforeQ01,`${width}/${id}/f02-gate`,figureSrcs);
   check(figureSrcs.some(s=>s.includes('n13-f01'))===!beforeQ04,`${width}/${id}/f01-gate`,figureSrcs);
   row.figureGates.push({id,figureSrcs});row.states.push(await measure(page,id+'-unanswered',width));
   const button=page.getByTestId('textbook-item-'+id);await button.click();
   const panel=page.getByTestId('inline-choice-panel-'+id);await panel.waitFor();row.states.push(await measure(page,id+'-options',width));
   const wrong=visibleChoices[id].find(v=>v!==item.answer);assert.ok(wrong);
   await panel.getByRole('button',{name:wrong,exact:true}).click();row.pointerSelections++;
   check((await ids(page)).includes(id),`${width}/${id}/wrong-remains`);
   await button.focus();await page.keyboard.press('Enter');await panel.waitFor();await page.getByTestId('textbook-hint-'+id).waitFor();
   row.states.push(await measure(page,id+'-wrong-hint',width));
   await panel.getByRole('button',{name:item.answer,exact:true}).focus();await page.keyboard.press('Enter');row.keyboardSelections++;
   await panel.waitFor({state:'detached'});row.answered.push(id);row.states.push(await measure(page,id+'-correct',width));
  }
  check(row.answered.length===section.items.length,`${width}/all18`,row.answered);
  const history=page.getByTestId('math-textbook-history-toggle');if(await history.count()){await history.click();await page.getByTestId('math-textbook-expand-all').click();}
  const final=await measure(page,'all-history',width);row.states.push(final);check(final.numbers.length===9&&new Set(final.numbers.map(n=>n.number)).size===9,`${width}/all-nine-equation-numbers`,final.numbers);
  await shot(page,`n13-${width}-extended-history`);
  // Navigate using actual completion link, then reload both neighboring source units.
  const nextUnit=page.getByTestId('textbook-next-unit');if(await nextUnit.count()){const href=await nextUnit.getAttribute('href');await nextUnit.click();await page.getByTestId('textbook-reading-flow').waitFor();row.navigation.push({method:'actual-next-link',href,url:page.url()});check(page.url().includes('n14'),`${width}/next-N14`,page.url());}else report.limits.push(`${width}: no completion next-unit link found`);
  for(const neighbor of ['n12','n14']){await load(page,'math-numbers-expressions-'+neighbor);const expectedClass=neighbor==='n14'&&input.fixtures.some(f=>f.code==='n14');check((await page.locator('.w048-reading-flow').count()>0)===expectedClass,`${width}/${neighbor}/revision-scoped-W048-class`);row.navigation.push({method:'direct-route-smoke',neighbor,url:page.url()});}
  await load(page);
  // Seed real persisted schema with synthetic metadata; fresh page context keeps user data isolated.
  const storageKey=await page.evaluate(()=>Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}}));assert.ok(storageKey);
  const sentinel={unitId:'w048-probe-sentinel',unitRevision:1,startedAt:77,updatedAt:88,answers:{}};
  for(const revision of [1,2,3,4]){
   const anchors=legacy.sections[0].items.filter(i=>revision===4||/^n13-\d\d$/.test(i.id)||(revision===3&&i.id==='n13-wm023-q05-right'));
   const old={unitId:unit.unitId,unitRevision:revision,startedAt:11,updatedAt:22,completedAt:33,answers:Object.fromEntries(anchors.map(i=>[i.id,rec(i)]))};
   await page.evaluate(({key,old,sentinel})=>{const v=JSON.parse(localStorage.getItem(key));v.state.textbookProgress[old.unitId]=old;v.state.textbookProgress[sentinel.unitId]=sentinel;localStorage.setItem(key,JSON.stringify(v));for(const k of Object.keys(localStorage))if(k.startsWith('math-textbook-compact-v1:'))localStorage.removeItem(k);},{key:storageKey,old,sentinel});
   await page.reload();await page.getByTestId('textbook-reading-flow').waitFor();const pending=await nextUntilPending(page);check(pending.includes('n13-w048-q04-positive'),`${width}/r${revision}/first-added-resume`,pending);
   await page.getByTestId('textbook-item-n13-w048-q04-positive').click();await page.getByTestId('inline-choice-panel-n13-w048-q04-positive').getByRole('button',{name:itemMap.get('n13-w048-q04-positive').answer,exact:true}).click();
   const state=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).state.textbookProgress,storageKey),saved=state[unit.unitId];
   check(saved.unitRevision===5&&saved.completedAt===undefined,`${width}/r${revision}/revision-incomplete`,saved);
   for(const id of ['n13-01','n13-02','n13-03','n13-04','n13-06','n13-07','n13-09'])check(JSON.stringify(saved.answers[id])===JSON.stringify(old.answers[id]),`${width}/r${revision}/${id}/record-metadata`,{before:old.answers[id],after:saved.answers[id]});
   check(saved.archivedRevisions?.['4']&&saved.previousRevisionCompletedAt===33,`${width}/r${revision}/archive-previous-completion`,saved);
   check(JSON.stringify(state[sentinel.unitId])===JSON.stringify(sentinel),`${width}/r${revision}/other-unit-preserved`,state[sentinel.unitId]);
   const newIds=section.items.filter(i=>!legacy.sections[0].items.some(j=>j.id===i.id)).map(i=>i.id);check(newIds.filter(id=>id!=='n13-w048-q04-positive').every(id=>saved.answers[id]===undefined),`${width}/r${revision}/later-added-unanswered`,saved.answers);
   row.saveTests.push({revision,seeded:old,pending,persisted:saved,sentinelPreserved:JSON.stringify(state[sentinel.unitId])===JSON.stringify(sentinel)});
  }
  page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'この単元を最初から',exact:false}).last().click();await page.reload();await page.getByTestId('textbook-reading-flow').waitFor();check((await ids(page)).includes('n13-01'),`${width}/reset-reload-first-question`);
  const reset=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).state.textbookProgress,storageKey);check(JSON.stringify(reset[sentinel.unitId])===JSON.stringify(sentinel),`${width}/reset-other-unit-preserved`);row.reset={firstPending:await ids(page),saved:reset[unit.unitId]??null};
  check(errors.length===0,`${width}/page-errors`,errors);await shot(page,`n13-${width}-reset`);// Keep isolated contexts alive until browser.close: this constrained single-process runtime exits when a context closes.
 }
 report.status=report.failures.length?'FAIL':'PASS_BOUNDED_EXTENDED_CODE';
}catch(e){report.status='FAIL';report.failures.push({message:e.message,stack:e.stack});}
finally{await browser.close();report.images=fs.readdirSync(out).filter(n=>n.endsWith('.png')).map(name=>({name,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(out,name))).digest('hex')}));fs.writeFileSync(path.join(out,'EXTENDED_REPORT.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,widths:report.rows.map(r=>({width:r.width,answered:r.answered.length,saveTests:r.saveTests.length})),failures:report.failures.length,firstFailures:report.failures.slice(0,3),output:out}));if(report.status==='FAIL')process.exitCode=1;}
