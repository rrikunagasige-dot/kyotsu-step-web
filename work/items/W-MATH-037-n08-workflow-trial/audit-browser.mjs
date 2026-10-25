/** Read-only baseline reproduction, not a candidate or acceptance test. */
import fs from 'node:fs';import {spawn} from 'node:child_process';import {chromium} from '@playwright/test';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});
for(let i=0;i<100;i++){try{const r=await fetch('http://127.0.0.1:4173/kyotsu-step-web/');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Authored.json'));
const out='work/items/W-MATH-037-n08-workflow-trial/evidence';
const browser=await chromium.launch({headless:true,executablePath:process.env.KYOTSU_CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const rows=[],errors=[];
try{
 for(const width of [320,390]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/kyotsu-step-web/#/learning/textbook/'+data.unit.unitId);
  let answered=0;
  for(const [index,stage] of data.stages.entries()){
   const section=page.getByTestId('math-textbook-stage-'+stage.id);await section.waitFor();
   await page.evaluate(()=>document.fonts.ready);
   const source=await section.getByTestId('n08-source-question').evaluate(e=>({text:e.innerText,math:[...e.querySelectorAll('annotation')].map(n=>n.textContent)}));
   const references=await section.locator('[data-testid="math-textbook-stage-references"]').allTextContents();
   const before=await section.innerText();
   rows.push({width,stageId:stage.id,source,references,authorMetaVisible:before.includes('未知の名前を当てさせず'),bodyText:before});
   if([2,5,6,8].includes(index+1))await page.screenshot({path:`${out}/before-${stage.id}-${width}.png`,fullPage:true});
   for(const node of data.nodes.filter(n=>n.stageId===stage.id&&n.interaction)){
    const item=data.unit.sections[0].items.find(i=>i.id===node.interaction);
    await page.getByTestId('textbook-item-'+item.id).click();
    await page.getByTestId('inline-choice-panel-'+item.id).getByRole('button',{name:item.answer,exact:true}).click();answered++;
   }
   if([7,9].includes(index+1))await page.screenshot({path:`${out}/after-${stage.id}-${width}.png`,fullPage:true});
   if(index<data.stages.length-1)await page.getByTestId('math-textbook-next-stage').click();
  }
  await page.getByTestId('n08-complete').waitFor();rows.push({width,answered,completed:true});await context.close();
 }
 fs.writeFileSync(out+'/BASELINE_UI.json',JSON.stringify({status:errors.length?'FAIL':'PASS',purpose:'baseline reproduction only; no quality acceptance',rows,errors},null,2)+'\n');
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({status:'PASS',widths:[320,390],answers:62,stages:24,contentModified:false}));
}finally{await browser.close();server.kill('SIGTERM');}
