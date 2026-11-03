// Focused captures supplement the existing all-answer four-width harness.
import fs from 'node:fs';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import {execFileSync} from 'node:child_process';
const base='work/items/W-MATH-047-n1112-guided-review/',out=process.env.EVIDENCE_DIR??base+'evidence/browser-n11';fs.mkdirSync(out,{recursive:true});
const d=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Authored.json'));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
try{
const page=await browser.newPage({viewport:{width:390,height:900}});
await page.goto((process.env.APP_URL??'http://127.0.0.1:4391/kyotsu-step-web/')+'#/learning/textbook/'+d.unit.unitId);
const targets=['n11-03','n11-07','n11-10','n11-q11-constant','n11-11','n11-12'];
const contextFrames=[];
const quotientFrames=[];
async function quotientCapture(state){
 for(const width of [320,390,430,1440]){
  await page.setViewportSize({width,height:1200});
  const divide=page.locator('[data-transformation-row="n11-tg-divide"]');await divide.waitFor();
  await divide.scrollIntoViewIfNeeded();await page.evaluate(()=>{const n=document.querySelector('[data-transformation-row="n11-tg-divisor"]');window.scrollTo({top:scrollY+n.getBoundingClientRect().top-110,behavior:'instant'});});
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
  const final=page.locator('[data-transformation-row="n11-tg-final"]');assert.equal(await final.count(),state==='correct'?1:0,'Completed range cannot precede quotient answer');
  assert.equal(await page.getByTestId('textbook-item-n11-06').count(),state==='correct'?0:1,'One pending quotient interaction');
  const geometry=await divide.evaluate(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom}});assert.ok(geometry.top>=90&&geometry.bottom<=1180,'Current quotient row visible below header');
  await page.screenshot({path:out+'/r1-quotient-'+width+'-'+state+'.png',fullPage:false});quotientFrames.push({width,state,geometry,fullPage:false,layoutModified:false});
 }
 await page.setViewportSize({width:390,height:900});
}
async function viewportContext(name){
 await page.setViewportSize({width:390,height:1200});
 await page.evaluate(()=>{const n=document.querySelector('[data-node-id="n11-q11-constant"]');window.scrollTo({top:scrollY+n.getBoundingClientRect().top-110,behavior:'instant'});});
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
 const geometry=await page.evaluate(()=>['n11-q11-constant','n11-11'].map(id=>{const n=document.querySelector('[data-node-id="'+id+'"]'),r=n.getBoundingClientRect();return{id,top:r.top,bottom:r.bottom,height:r.height}}));
 assert.ok(geometry.every(r=>r.top>=90&&r.bottom<=1180),'Both the local result and next whole state fit below the real header');
 await page.screenshot({path:out+'/'+name+'-viewport.png',fullPage:false});
 contextFrames.push({name,width:390,height:1200,fullPage:false,geometry,layoutModified:false});
 await page.setViewportSize({width:390,height:900});
}
for(const stage of d.stages){
 const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();
 for(const n of d.nodes.filter(n=>n.stageId===stage.id)){
  if(n.id==='n11-fraction-problem'){const context=current.locator('[data-node-id="'+n.id+'"]');await context.waitFor();await context.screenshot({path:out+'/'+n.id+'-context.png'});}
  if(!n.interaction)continue;
  const item=d.unit.sections[0].items.find(i=>i.id===n.interaction);await page.getByTestId('textbook-item-'+item.id).click();
  const panel=page.getByTestId('inline-choice-panel-'+item.id);await panel.waitFor();
  if(targets.includes(n.id)){await page.evaluate(()=>document.fonts.ready);await current.screenshot({path:out+'/'+n.id+'-initial.png'});await current.locator('[data-node-id="'+n.id+'"]').screenshot({path:out+'/'+n.id+'-focus-initial.png'});}
  if(n.id==='n11-11')await viewportContext('n11-whole-state-initial-context');
  if(n.id==='n11-06'){
   await quotientCapture('pending');
   await panel.getByRole('button',{name:item.choices.find(c=>c!==item.answer),exact:true}).click();await page.getByTestId('textbook-hint-'+item.id).waitFor();await quotientCapture('wrong');
   await page.reload();await page.getByTestId('textbook-item-'+item.id).waitFor();assert.equal(await page.locator('[data-transformation-row="n11-tg-final"]').count(),0);await page.getByTestId('textbook-item-'+item.id).click();
  }
  await panel.getByRole('button',{name:item.answer,exact:true}).click();
  if(targets.includes(n.id)){await current.screenshot({path:out+'/'+n.id+'-complete.png'});await current.locator('[data-node-id="'+n.id+'"]').screenshot({path:out+'/'+n.id+'-focus-complete.png'});}
  if(n.id==='n11-q11-constant')await viewportContext('n11-local-result-complete-context');
  if(n.id==='n11-06')await quotientCapture('correct');
 }
 if(stage!==d.stages.at(-1))await page.getByTestId('math-textbook-next-stage').click();
}
assert.equal(await page.locator('.katex-error').count(),0);
await page.getByTestId('n11-complete').waitFor();
const next=page.getByTestId('textbook-next-unit');await next.waitFor();assert.ok((await next.getAttribute('href')).includes('math-numbers-expressions-n12'));await next.click();await page.locator('.guided-reading').waitFor();assert.ok(page.url().includes('math-numbers-expressions-n12'));
await page.goBack();await page.getByTestId('n11-complete').waitFor();
const storesBefore=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'この単元を最初から',exact:true}).first().click();await page.getByTestId('math-textbook-stage-'+d.stages[0].id).waitFor();assert.equal(await page.getByTestId('n11-complete').count(),0);await page.reload();await page.getByTestId('math-textbook-stage-'+d.stages[0].id).waitFor();
const progress=await page.evaluate(()=>Object.keys(localStorage).flatMap(k=>{try{const v=JSON.parse(localStorage.getItem(k));return v.state?.textbookProgress?[v.state.textbookProgress]:[]}catch{return[]}})[0]);assert.equal(Object.keys(progress[d.unit.unitId]?.answers??{}).length,0);
await page.screenshot({path:out+'/r1-reset-reload-start.png',fullPage:false});
fs.writeFileSync(out+'/FOCUSED_CAPTURE.json',JSON.stringify({status:'PASS',width:390,targetNodes:targets,contextOnlyNodes:['n11-fraction-problem'],contextFrames,quotientFrames,reset:{confirmedDialog:true,answersCleared:true,reloadStartsAtFirstStage:true},chapterBoundary:{nextToN12:true,browserBackToCompletedN11:true},states:['initial-choice-open','completed'],sourceSHA:process.env.CANDIDATE_SHA??process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()},null,2)+'\n');
}finally{await browser.close();}

// N12 focus joins the existing CI entry point only when the immutable P006 bytes are active.
if(fs.readFileSync("src/data/textbook/math/numbers/n12Authored.json","utf8")===fs.readFileSync(base+"MATERIALIZED_N12.json","utf8")){
 execFileSync(process.execPath,[base+"capture_n12.mjs"],{stdio:"inherit",env:{...process.env,EVIDENCE_DIR:out+"/../n12-focus"}});
}
