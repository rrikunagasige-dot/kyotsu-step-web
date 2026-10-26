import fs from 'node:fs';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
const root='http://127.0.0.1:4173/kyotsu-step-web/',out=process.env.EVIDENCE_DIR??'/tmp/w38-fixtures';fs.mkdirSync(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});for(let i=0;i<100;i++){try{if((await fetch(root)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});const results=[];
try{for(const width of [320,390,430,1440]){const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function geometry(id){await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('.katex-error').count(),0);const overflow=await page.evaluate(()=>{const issues=[];if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page');for(const el of document.querySelectorAll('.transformation-equation .katex,.transformation-equation button')){const r=el.getBoundingClientRect();if(r.width&&(r.left<0||r.right>innerWidth))issues.push(el.textContent)}return issues;});assert.deepEqual(overflow,[],id+' '+width);}
 for(const id of ['F01','F02','F03','F04','F05','F08','F10','F11']){await page.goto(root+'work/items/W-MATH-038-transformation-groups/fixture.html?id='+id);await page.locator('[data-transformation-group]').waitFor();await geometry(id);
  if(id==='F01'){
   for(const [index,q,answer]of [[0,'A','2'],[1,'C','3']]){assert.equal(await page.getByTestId('slot-'+q).count(),2);await page.getByTestId('slot-'+q).nth(index).click();assert.equal(await page.getByTestId('panel-'+q).count(),1);await page.getByTestId('panel-'+q).getByRole('button',{name:answer,exact:true}).click();assert.equal(await page.getByTestId('slot-'+q).count(),0);assert.equal(await page.getByTestId('attempts').textContent(),String(index+1));await geometry(id+'-'+q);}
   assert.equal(await page.locator('[data-transformation-row]').count(),5);assert.equal(await page.locator('[data-state-ref="S4"]').count(),1);
  }
  if(width===320||width===390)await page.screenshot({path:out+'/'+id+'-'+width+'.png',fullPage:true});results.push({id,width,status:'PASS'});
 }
 assert.deepEqual(errors,[]);await context.close();}fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',results},null,2));console.log(JSON.stringify({status:'PASS',cases:results.length}));}finally{await browser.close();server.kill();}
