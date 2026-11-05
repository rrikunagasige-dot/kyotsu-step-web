// B-owned post-application bounded probe; product and native Store files are never edited.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const root=process.env.W048_APP_ROOT||'/workspace/scratch/55b12fe3f8aa/repo';
const require=createRequire(root+'/package.json');const {chromium}=require('@playwright/test');
const width=Number(process.env.W048_WIDTH||320),app=process.env.APP_URL||'http://127.0.0.1:4391/kyotsu-step-web/';
const out=process.env.EVIDENCE_DIR;assert.ok(out && out.startsWith('/') && !out.startsWith(root+'/'),'explicit output outside repository required');fs.mkdirSync(out,{recursive:true});
const input=JSON.parse(fs.readFileSync(process.env.W048_FIXTURES||'/tmp/w048-ci-final/reports/w048-evidence/contracts/BROWSER_FIXTURES.json'));
const fixture=input.fixtures.find(f=>f.code==='n13');assert.ok(fixture);const map=new Map(fixture.unit.sections[0].items.map(i=>[i.id,i]));
const report={scope:'POST_APPLICATION_SCROLL_ONLY_NOT_FORMAL_R07',width,status:'RUNNING',steps:[],limits:['N12 unaffected-revision no-op smoke only; N14r11 is verified separately.','Synthetic DOM scroll instrumentation observes calls and offsets, not exhaustive keyboard or historical saves.']};
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox', ...(process.env.W048_SINGLE_PROCESS === '1' ? ['--disable-dev-shm-usage','--disable-gpu','--disable-software-rasterizer','--no-zygote','--single-process'] : [])]});
try{
 const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();page.setDefaultTimeout(15000);
 await page.addInitScript(()=>{window.__w048ScrollCalls=[];const original=Element.prototype.scrollTo;Element.prototype.scrollTo=function(...args){if(this.dataset?.testid?.startsWith('textbook-formula-'))window.__w048ScrollCalls.push({id:this.dataset.testid,args});return original.apply(this,args);};});
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.goto(app+'#/learning/textbook/'+fixture.unit.unitId);await page.getByTestId('textbook-reading-flow').waitFor();await page.evaluate(()=>document.fonts.ready);
 let reached=false;
 for(let guard=0;guard<40;guard++){
  const ids=await page.locator('button[data-testid^="textbook-item-"]:visible').evaluateAll(ns=>ns.map(n=>n.dataset.testid.slice('textbook-item-'.length)));
  if(!ids.length){const next=page.getByTestId('math-textbook-next-stage');assert.ok(await next.count(),'Q04 must remain reachable');await next.click();continue;}
  const id=ids[0],item=map.get(id);assert.ok(item,id);const button=page.getByTestId('textbook-item-'+id);await button.click();const panel=page.getByTestId('inline-choice-panel-'+id);
  const target=await button.evaluate(e=>e.closest('[data-testid^="textbook-formula-"]')?.dataset.testid);
  const prepare=async()=>page.evaluate(testid=>{window.__w048ScrollCalls=[];const e=testid&&document.querySelector(`[data-testid="${testid}"]`);if(!e)return null;e.scrollLeft=20;return {id:testid,scrollLeft:e.scrollLeft,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth};},target);
  const inspect=async()=>page.evaluate(testid=>{const e=testid&&document.querySelector(`[data-testid="${testid}"]`);return {scrollLeft:e?.scrollLeft,calls:window.__w048ScrollCalls};},target);
  const wrong=fixture.visibleChoices[id].find(c=>c!==item.answer);assert.ok(wrong);
  const beforeWrong=await prepare();await panel.getByRole('button',{name:wrong,exact:true}).click();await settle();const afterWrong=await inspect();
  if(target){assert.equal(afterWrong.scrollLeft,0,id+' wrong left');assert.deepEqual(afterWrong.calls.map(c=>c.id),[target],id+' wrong only target');}
  assert.ok(await button.count(),id+' unresolved after wrong');
  await button.click();const beforeCorrect=await prepare();await panel.getByRole('button',{name:item.answer,exact:true}).click();await settle();const afterCorrect=await inspect();
  if(target){assert.equal(afterCorrect.scrollLeft,0,id+' correct left');assert.deepEqual(afterCorrect.calls.map(c=>c.id),[target],id+' correct only target');}
  report.steps.push({id,target,beforeWrong,afterWrong,beforeCorrect,afterCorrect});
  if(id==='n13-04'){reached=true;break;}
 }
 assert.ok(reached,'Q04 completed');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'/N13-Q04-post-answer.png',fullPage:true});
 // N12 is outside the exact N13r5/N14r11 scroll contract: no formula scrollTo on answer.
 await page.goto(app+'#/learning/textbook/math-numbers-expressions-n12');await page.getByTestId('textbook-reading-flow').waitFor();await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('.w048-reading-flow').count(),0,'N12 outside W048 contract');
 const oldButton=page.locator('button[data-testid^="textbook-item-"]:visible').first();await oldButton.waitFor();const oldId=(await oldButton.getAttribute('data-testid')).slice('textbook-item-'.length);await oldButton.click();
 await page.evaluate(()=>{window.__w048ScrollCalls=[];});await page.getByTestId('inline-choice-panel-'+oldId).locator('.reading-choice-option').first().click();await settle();const oldCalls=await page.evaluate(()=>window.__w048ScrollCalls);assert.deepEqual(oldCalls,[],'N12 answer must not invoke formula scrollTo');report.oldNoOp={unit:'n12-current-native',item:oldId,w048Class:false,calls:oldCalls};
 report.status='PASS_BOUNDED_POST_SCROLL';
}catch(e){report.status='FAIL';report.error={message:e.message,stack:e.stack};process.exitCode=1;}finally{await browser.close();fs.writeFileSync(out+'/POST_SCROLL.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,width,steps:report.steps.length,error:report.error,out}));}
