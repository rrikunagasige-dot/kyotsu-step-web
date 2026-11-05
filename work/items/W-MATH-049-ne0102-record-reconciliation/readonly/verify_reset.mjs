// Additional proposed bounded reset check. Fresh CI contexts only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(path.resolve('package.json'));
const {chromium}=require('@playwright/test');
const contract=JSON.parse(fs.readFileSync(process.env.QA_CONTRACT,'utf8'));
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/ne02Authored.json','utf8'));
const out=path.resolve(process.env.EVIDENCE_DIR);fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const rows=[];let active;
try {
 for(const width of contract.browserScope.widths){
  const ctx=await browser.newContext({viewport:{width,height:1000}}),page=await ctx.newPage();active=page;
  await page.goto(contract.base+'?source='+contract.sourceSHA+'#/learning/textbook/'+data.unit.unitId);
  const pending=page.locator('.math-textbook-stage--current [data-testid^="textbook-item-"]').first();await pending.waitFor();
  const firstID=(await pending.getAttribute('data-testid')).replace('textbook-item-','');
  const item=data.unit.sections[0].items.find(i=>i.id===firstID);assert.ok(item);
  await pending.click();await page.getByTestId('inline-choice-panel-'+firstID).getByRole('button',{name:item.answer,exact:true}).click();
  const key=contract.storageKey,id=data.unit.unitId;
  const before=await page.evaluate(({key,id,firstID})=>{
   const value=JSON.parse(localStorage.getItem(key));if(!value?.state?.textbookProgress?.[id]?.answers?.[firstID]?.resolved)throw Error('REAL_ANSWER_NOT_PERSISTED');
   value.state.textbookProgress['w049-reset-sentinel']={unitId:'w049-reset-sentinel',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};
   localStorage.setItem(key,JSON.stringify(value));return value.state.textbookProgress[id];
  },{key,id,firstID});
  await page.reload();await page.locator('.guided-reading').waitFor();
  page.once('dialog',d=>d.dismiss());await page.locator('.textbook-reset').click();
  const cancelled=await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).state.textbookProgress[id],{key,id});assert.deepEqual(cancelled,before);
  page.once('dialog',d=>d.accept());await page.locator('.textbook-reset').click();
  await page.getByTestId('textbook-item-'+firstID).waitFor();
  const after=await page.evaluate(({key,id})=>{const all=JSON.parse(localStorage.getItem(key)).state.textbookProgress;return {progress:all[id]??null,sentinel:all['w049-reset-sentinel']};},{key,id});
  assert.equal(Object.keys(after.progress?.answers??{}).length,0);assert.ok(!after.progress?.completedAt);
  assert.deepEqual(after.sentinel,{unitId:'w049-reset-sentinel',unitRevision:1,startedAt:10,updatedAt:11,answers:{}});
  await page.reload();await page.getByTestId('textbook-item-'+firstID).waitFor();
  await page.screenshot({path:path.join(out,'ne02-'+width+'-reset.png'),fullPage:true});
  rows.push({width,firstID,realAnswerPersisted:true,cancelPreserved:true,resetReopenedFirst:true,sentinelPreserved:true,reload:true});
  await ctx.close();
 }
 fs.writeFileSync(path.join(out,'RESET_REPORT.json'),JSON.stringify({status:'PASS_BOUNDED_NE02_RESET',sourceSHA:contract.sourceSHA,base:contract.base,rows,scope:'One actual first answer followed by cancel/accept/reload and one synthetic unrelated ledger sentinel per width; not every saved state or real user data.'},null,2)+'\n');
} catch(e){fs.writeFileSync(path.join(out,'RESET_ERROR.json'),JSON.stringify({error:e.message,rows,url:active?.url()},null,2)+'\n');if(active)await active.screenshot({path:path.join(out,'RESET_ERROR.png'),fullPage:true});throw e;}
finally{await browser.close();}
