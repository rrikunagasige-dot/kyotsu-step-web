import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n07Authored.json','utf8'));
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/';
const out=process.env.EVIDENCE_DIR??'/tmp/ks-n07-browser';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const errors=[],results=[];
try{
for(const width of (process.env.WIDTHS??'320,390,430,1440').split(',').map(Number)){
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
   const semantic=data.semantic.nodes.find(n=>n.id===node.id);
   if(node.interaction){
    assert.equal(await visible.locator('[data-semantic-id^="'+node.id+'-after-"]').count(),0,'future after text hidden');
    if(node.id==='n07-q03-cycle'){
     const refs=page.getByTestId('math-textbook-stage-references');
     assert.equal(await refs.getByTestId('n07-remainder-table').count(),1);
     assert.equal(await refs.getByTestId('n07-remainder-table').locator('tbody tr').count(),2);
     assert.match(await refs.innerText(),/整数部分は2/);assert.doesNotMatch(await refs.innerText(),/繰り返される/);
    }

    const item=data.unit.sections[0].items.find(i=>i.id===node.interaction.id),button=page.getByTestId('textbook-item-'+item.id);
    await button.click();const panel=page.getByTestId('inline-choice-panel-'+item.id);
    await geometry(node.id+' choices');
    if(node.id==='n07-q06-scale'||node.id==='n07-q09-scale'){
     assert.match(await panel.innerText(),/最小/);assert.match(await panel.innerText(),/1000/);
     assert.equal(await visible.locator('.reading-inline-blank').count(),1);
    }
    if(node.id.endsWith('-subtract'))assert.match(await visible.innerText(),/上の式から元の式を/);
    if(node.id.endsWith('-coefficient')||node.id==='n07-q10-reduce')assert.equal(await visible.locator('.numbered-equation').count(),1,'one connected group');
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
    if(node.id.endsWith('-coefficient')||node.id==='n07-q10-reduce')assert.match(await visible.innerText(),/=/);
    if(node.id.endsWith('-subtract'))assert.match(await visible.innerText(),/上の式から元の式を引くことで/);

   }
   const found=await visible.evaluate(el=>[
    ...[...el.querySelectorAll('[data-semantic-id]')].map(n=>n.dataset.semanticId),
    ...[...el.querySelectorAll('[data-formula-semantic-parts]')].flatMap(n=>JSON.parse(n.dataset.formulaSemanticParts).map(p=>p.semanticId).filter(Boolean))
   ]);
   const expected=[...semantic.before,...semantic.after].flatMap(b=>b.parts.filter(p=>p.type!=='text').map(p=>p.semanticId).filter(Boolean));
   assert.deepEqual(expected.filter(id=>!found.includes(id)),[],node.id+' semantic projection loss');
   for(const term of [...semantic.before,...semantic.after].flatMap(b=>b.parts.filter(p=>p.type==='term'&&p.usage==='first_definition'))){
    const element=visible.locator('strong[data-semantic-id="'+term.semanticId+'"]');
    assert.equal(await element.count(),1);assert.ok(await element.evaluate(el=>Number(getComputedStyle(el).fontWeight)>=600));
   }
  }
  if(stageIndex===1)assert.equal(await page.getByTestId('n07-remainder-table').count(),1);
  if([1,2,5,6,8,10].includes(stageIndex)){await current.screenshot({path:out+'/width-'+width+'-stage-'+(stageIndex+1)+'.png'});}
  if(stageIndex===6){await page.reload();await current.waitFor();await geometry('reload');}
  if(stageIndex<data.stages.length-1){await page.getByTestId('math-textbook-next-stage').click();}
 }
 assert.equal(answered,36);await page.getByTestId('n07-complete').waitFor();
 await page.getByTestId('n07-history-toggle').click();
 assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(),13);
 await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('expanded history');
 await page.screenshot({path:out+'/width-'+width+'-history.png',fullPage:true});
 await page.reload();await page.getByTestId('n07-complete').waitFor();
 // Real persisted v3→v4 upgrade, including an unrelated unit in the same store.
 const retained=Object.fromEntries(['n07-10','n07-14'].map(id=>{const item=data.unit.sections[0].items.find(item=>item.id===id);return[id,{itemId:id,value:item.answer,resolved:true,isFirstCorrect:true,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]}));
 await page.evaluate(({unitId,retained})=>{
  const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});
  const store=JSON.parse(localStorage.getItem(key));
  store.state.textbookProgress[unitId]={unitId,unitRevision:3,startedAt:1,updatedAt:2,completedAt:2,answers:{...retained,'n07-01':{itemId:'n07-01',value:'old compound',resolved:true,isFirstCorrect:true,attemptCount:3,firstAnsweredAt:1,lastAnsweredAt:2}}};
  store.state.textbookProgress['untouched-unit']={unitId:'untouched-unit',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};
  localStorage.setItem(key,JSON.stringify(store));
 },{unitId:data.unit.unitId,retained});
 await page.reload();const first=data.unit.sections[0].items[0];await page.getByTestId('textbook-item-'+first.id).click();
 await page.getByTestId('inline-choice-panel-'+first.id).getByRole('button',{name:first.answer,exact:true}).click();
 const saved=await page.evaluate(()=>Object.keys(localStorage).flatMap(key=>{try{const s=JSON.parse(localStorage.getItem(key));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);
 const migrated=saved[data.unit.unitId];assert.equal(migrated.unitRevision,4);assert.equal(migrated.completedAt,undefined);
 assert.equal(Object.keys(migrated.answers).length,3);assert.deepEqual(migrated.answers['n07-10'],retained['n07-10']);assert.deepEqual(migrated.answers['n07-14'],retained['n07-14']);assert.equal(migrated.archivedRevisions['3'].answers['n07-01'].value,'old compound');assert.equal(saved['untouched-unit'].updatedAt,11);
 results.push({width,answered,stages:14,allWrongChoices:true,reload:true,history:true,migration:true,geometry:'PASS'});await context.close();
}
assert.deepEqual(errors,[],'browser errors');fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',root,results,errors},null,2));console.log(JSON.stringify({status:'PASS',results}));
}finally{await browser.close();}
