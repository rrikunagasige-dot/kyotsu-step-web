import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n07Authored.json','utf8'));
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/';
const out=process.env.EVIDENCE_DIR??'/tmp/ks-n07-browser';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const errors=[],results=[];
try{
for(const width of (process.env.WIDTHS??'320,390,1440').split(',').map(Number)){
 const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(root+'#/learning/textbook/'+data.unit.unitId);
 await page.getByTestId('textbook-item-'+data.unit.sections[0].items[0].id).waitFor();
 let answered=0;
 async function geometry(label){
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
  const failures=await page.locator('.n07-reading').evaluate(el=>{
   const issues=[];
   if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
   for(const node of el.querySelectorAll('[data-typeset-source]')){
    if(!node.getClientRects().length||node.closest('details:not([open])'))continue;
    const box=node.getBoundingClientRect();
    for(const math of node.querySelectorAll('.typeset-line .katex, .reading-formula-choice, .typeset-table-cell .katex')){
     const r=math.getBoundingClientRect();if(r.width>0&&(r.left<box.left-2||r.right>box.right+2))issues.push('formula overflow '+node.dataset.typesetSource);
    }
   }
   for(const eq of el.querySelectorAll('.numbered-equation')){
    if(!eq.getClientRects().length||eq.closest('details:not([open])'))continue;
    const tag=eq.querySelector('.numbered-equation-label').getBoundingClientRect();
    for(const m of eq.querySelectorAll('.numbered-equation-body .katex, .reading-formula-choice')){const r=m.getBoundingClientRect();if(r.width&&r.right>tag.left+1&&r.left<tag.right-1&&r.bottom>tag.top+1&&r.top<tag.bottom-1)issues.push('number collision '+eq.dataset.equationNumber);}
   }
   return [...new Set(issues)];
  });assert.deepEqual(failures,[],label+' width'+width+': '+JSON.stringify(failures));
  assert.equal(await page.locator('.katex-error').count(),0);
 }
 for(const [stageIndex,stage]of data.stages.entries()){
  const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();
  const ns=data.nodes.filter(n=>n.stageId===stage.id);
  for(const node of ns){
   const visible=current.locator('[data-node-id="'+node.id+'"]');await visible.waitFor();
   if(node.interaction){
    const item=data.unit.sections[0].items.find(i=>i.id===node.interaction.id),button=page.getByTestId('textbook-item-'+item.id);
    await button.click();const panel=page.getByTestId('inline-choice-panel-'+item.id);
    await geometry(node.id+' choices');
    // Exercise every wrong answer, then the actual correct answer, through real controls.
    for(const wrong of item.choices.filter(c=>c!==item.answer)){
     await panel.getByRole('button',{name:wrong,exact:true}).click();
     assert.equal(await visible.locator('[data-testid="resolved-'+item.id+'"]').count(),0);
     assert.equal(await page.getByTestId('textbook-hint-'+item.id).count(),1);
     const next=data.nodes[data.nodes.indexOf(node)+1];if(next&&next.stageId===stage.id)assert.equal(await current.locator('[data-node-id="'+next.id+'"]').count(),0);
    }
    if(node.id==='n07-q07-left-form'&&width===390)await page.screenshot({path:out+'/q07-before.png',fullPage:true});
    await panel.getByRole('button',{name:item.answer,exact:true}).click();answered++;
    await page.getByTestId('resolved-'+item.id).first().waitFor();
    await geometry(node.id+' answered');
   }
  }
  if(stageIndex===1)assert.equal(await page.getByTestId('n07-remainder-table').count(),1);
  if([1,6,10].includes(stageIndex)){await page.screenshot({path:out+'/width-'+width+'-stage-'+(stageIndex+1)+'.png',fullPage:true});}
  if(stageIndex===6){await page.reload();await current.waitFor();await geometry('reload');}
  if(stageIndex<data.stages.length-1){await page.getByTestId('math-textbook-next-stage').click();}
 }
 assert.equal(answered,36);await page.getByTestId('n07-complete').waitFor();
 await page.getByTestId('n07-history-toggle').click();
 assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(),13);
 await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('expanded history');
 await page.screenshot({path:out+'/width-'+width+'-history.png',fullPage:true});
 await page.reload();await page.getByTestId('n07-complete').waitFor();
 results.push({width,answered,stages:14,allWrongChoices:true,reload:true,history:true,geometry:'PASS'});await context.close();
}
assert.deepEqual(errors,[],'browser errors');fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',root,results,errors},null,2));console.log(JSON.stringify({status:'PASS',results}));
}finally{await browser.close();}
