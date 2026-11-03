// Focused captures supplement the existing all-answer four-width harness.
import fs from 'node:fs';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import {execFileSync} from 'node:child_process';
const base='work/items/W-MATH-047-n1112-guided-review/',out=process.env.EVIDENCE_DIR??base+'evidence/browser-n11';fs.mkdirSync(out,{recursive:true});
const d=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Authored.json'));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
try{
const page=await browser.newPage({viewport:{width:390,height:900}});
await page.goto((process.env.APP_URL??'http://127.0.0.1:4391/kyotsu-step-web/')+'#/learning/textbook/'+d.unit.unitId);
const targets=['n11-03','n11-07','n11-10','n11-q11-constant','n11-11','n11-12'];
for(const stage of d.stages){
 const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();
 for(const n of d.nodes.filter(n=>n.stageId===stage.id)){
  if(n.id==='n11-fraction-problem'){const context=current.locator('[data-node-id="'+n.id+'"]');await context.waitFor();await context.screenshot({path:out+'/'+n.id+'-context.png'});}
  if(!n.interaction)continue;
  const item=d.unit.sections[0].items.find(i=>i.id===n.interaction);await page.getByTestId('textbook-item-'+item.id).click();
  const panel=page.getByTestId('inline-choice-panel-'+item.id);await panel.waitFor();
  if(targets.includes(n.id)){await page.evaluate(()=>document.fonts.ready);await current.screenshot({path:out+'/'+n.id+'-initial.png'});await current.locator('[data-node-id="'+n.id+'"]').screenshot({path:out+'/'+n.id+'-focus-initial.png'});}
  await panel.getByRole('button',{name:item.answer,exact:true}).click();
  if(targets.includes(n.id)){await current.screenshot({path:out+'/'+n.id+'-complete.png'});await current.locator('[data-node-id="'+n.id+'"]').screenshot({path:out+'/'+n.id+'-focus-complete.png'});}
 }
 if(stage!==d.stages.at(-1))await page.getByTestId('math-textbook-next-stage').click();
}
assert.equal(await page.locator('.katex-error').count(),0);
fs.writeFileSync(out+'/FOCUSED_CAPTURE.json',JSON.stringify({status:'PASS',width:390,targetNodes:targets,contextOnlyNodes:['n11-fraction-problem'],states:['initial-choice-open','completed'],sourceSHA:process.env.CANDIDATE_SHA??process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()},null,2)+'\n');
}finally{await browser.close();}
