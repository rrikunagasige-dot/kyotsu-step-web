import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n09Authored.json'));
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/';
const out=process.env.EVIDENCE_DIR??'/tmp/n09-browser';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],results=[];
try{
for(const width of (process.env.WIDTHS??'320,390,430,1440').split(',').map(Number)){
 const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(root+'#/learning/textbook/'+data.unit.unitId);
 let answered=0,wrongCount=0;
 async function geometry(label){
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
  const failures=await page.locator('.guided-reading').evaluate(el=>{
   const issues=[];
   if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
   for(const node of el.querySelectorAll('[data-typeset-source]')){
    if(!node.getClientRects().length||node.closest('details:not([open])'))continue;
    const box=node.getBoundingClientRect();
    for(const m of node.querySelectorAll('.typeset-line .katex,.reading-inline-blank')){
     const r=m.getBoundingClientRect();if(r.width&&(r.left<box.left-2||r.right>box.right+2))issues.push('formula overflow '+node.dataset.typesetSource);
    }
   }
   for(const eq of el.querySelectorAll('.numbered-equation')){
    if(!eq.getClientRects().length||eq.closest('details:not([open])'))continue;
    const tag=eq.querySelector('.numbered-equation-label').getBoundingClientRect();
    for(const m of eq.querySelectorAll('.numbered-equation-body .katex,.reading-inline-blank')){
     const r=m.getBoundingClientRect();if(r.width&&r.right>tag.left+1&&r.left<tag.right-1&&r.bottom>tag.top+1&&r.top<tag.bottom-1)issues.push('number collision '+eq.dataset.equationNumber);
    }
   }
   for(const node of el.querySelectorAll('.reading-choice-option')){
    const r=node.getBoundingClientRect();if(r.width&&(r.left<0||r.right>innerWidth+1))issues.push('option overflow');
   }
   return [...new Set(issues)];
  });
  if(failures.length){
   await page.screenshot({path:out+'/failure-'+width+'.png',fullPage:true});
   const overflow=await page.locator('.guided-reading').evaluate(el=>[...el.querySelectorAll('*')].filter(n=>n.getClientRects().length&&n.getBoundingClientRect().right>innerWidth+1).map(n=>({tag:n.tagName,class:n.className,text:n.textContent.slice(0,160),right:n.getBoundingClientRect().right})).slice(0,30));
   fs.writeFileSync(out+'/failure-'+width+'.json',JSON.stringify({label,failures,overflow},null,2));
  }
  assert.deepEqual(failures,[],label+' width'+width);assert.equal(await page.locator('.katex-error').count(),0);
 }
 for(const [stageIndex,stage]of data.stages.entries()){
  const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();
  assert.equal(await current.getByTestId('guided-source-question').count(),1);
  for(const node of data.nodes.filter(n=>n.stageId===stage.id)){
   const visible=current.locator('[data-node-id="'+node.id+'"]');await visible.waitFor();
   const compiled=data.semantic.nodes.find(n=>n.id===node.id);
   if(node.interaction){
    assert.equal(await visible.locator('[data-block-id="'+node.id+'-result"]').count(),0,'future result hidden');
    const item=data.unit.sections[0].items.find(i=>i.id===node.interaction);
    await page.getByTestId('textbook-item-'+item.id).click();const panel=page.getByTestId('inline-choice-panel-'+item.id);
    await geometry(node.id+' options');
    for(const wrong of item.choices.filter(x=>x!==item.answer)){
     await panel.getByRole('button',{name:wrong,exact:true}).click();wrongCount++;
     await page.getByTestId('textbook-hint-'+item.id).waitFor();
     assert.equal(await page.getByTestId('textbook-item-'+item.id).count(),1);
     const nextIndex=data.nodes.indexOf(node)+1,next=data.nodes[nextIndex];
     if(next?.stageId===stage.id)assert.equal(await current.locator('[data-node-id="'+next.id+'"]').count(),0,'wrong answer must not unlock next');
    }
    await panel.getByRole('button',{name:item.answer,exact:true}).click();answered++;
    assert.equal(await visible.locator('[data-block-id^="'+node.id+'-interaction"]').count(),0,'unanswered equation replaced once');
   }
   await geometry(node.id+' complete');
   const shown=[...compiled.before.filter(b=>!node.interaction||!b.id.startsWith(node.id+'-interaction')),...compiled.after];
   for(const b of shown.filter(b=>b.type==='paragraph'))for(const p of b.parts.filter(p=>p.type==='math'||p.type==='term')){
    const actual=visible.locator('[data-semantic-id="'+p.semanticId+'"]');assert.equal(await actual.count(),1,'paragraph semantic token rendered '+p.semanticId);
    if(p.type==='term')assert.ok(await actual.evaluate(el=>Number(getComputedStyle(el).fontWeight)>=600));
   }
   for(const block of compiled.after){
    if(block.type==='formula'&&node.id!=='n09-14'){
     const f=visible.locator('[data-typeset-source="'+block.id+'"]');assert.equal(await f.count(),1);
     const source=await f.locator('annotation[encoding="application/x-tex"]').allTextContents();
     assert.ok(source.length,'actual formula rendered '+block.id);
    }
   }
  }
  if(stageIndex<6)assert.equal(await page.getByTestId('guided-original-figure').count(),0,'original labels hidden before Q10');
  if(stageIndex===6)assert.equal(await current.getByTestId('guided-original-figure').count(),1,'original image after Q10');
  if(stageIndex===10){assert.equal(await current.getByTestId('n09-14-table').locator('tbody tr').count(),2);const refs=current.getByTestId('math-textbook-stage-references');for(const id of ['n09-11-result','n09-12-result','n09-13-result'])assert.equal(await refs.locator('[data-result-source="'+id+'"]').count(),1);}
  if([0,3,4,5,6,7,10].includes(stageIndex))await current.screenshot({path:out+'/width-'+width+'-stage-'+(stageIndex+1)+'.png'});
  if(stageIndex===6){await page.reload();await current.waitFor();await geometry('reload');}
  if(stageIndex<data.stages.length-1)await page.getByTestId('math-textbook-next-stage').click();
 }
 assert.equal(answered,36);await page.getByTestId('n09-complete').waitFor();
 await page.getByTestId('n09-history-toggle').click();assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(),10);
 await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('full history');
 await page.screenshot({path:out+'/width-'+width+'-history.png',fullPage:true});
 await page.reload();await page.getByTestId('n09-complete').waitFor();
 const old=JSON.parse(fs.readFileSync('work/items/W-MATH-034-n09-n10-guided-design/evidence/N09_CURRENT.json')).unit;
 for(const revision of [1,2]){
  const anchors=Object.fromEntries(old.sections[0].items.filter(i=>revision===2||!i.id.includes('p001')).map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'original-wrong-first',resolved:true,isFirstCorrect:false,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]));
  await page.evaluate(({unitId,anchors,revision})=>{
   const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});
   const value=JSON.parse(localStorage.getItem(key));value.state.textbookProgress[unitId]={unitId,unitRevision:revision,startedAt:1,updatedAt:2,completedAt:2,answers:anchors};value.state.textbookProgress['untouched-unit']={unitId:'untouched-unit',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};localStorage.setItem(key,JSON.stringify(value));
  },{unitId:data.unit.unitId,anchors,revision});
  await page.reload();const first=data.unit.sections[0].items[0];await page.getByTestId('textbook-item-'+first.id).click();
  await page.getByTestId('inline-choice-panel-'+first.id).getByRole('button',{name:first.answer,exact:true}).click();
  const stores=await page.evaluate(()=>Object.keys(localStorage).flatMap(key=>{try{const s=JSON.parse(localStorage.getItem(key));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);
  const migrated=stores[data.unit.unitId];assert.equal(migrated.unitRevision,3);assert.equal(migrated.completedAt,undefined);assert.deepEqual(migrated.archivedRevisions[String(revision)].answers,anchors);assert.equal(Object.keys(migrated.answers).length,revision===1?1:19);if(revision===2)for(const[id,v]of Object.entries(anchors))assert.deepEqual(migrated.answers[id],v);assert.equal(stores['untouched-unit'].updatedAt,11);
 }
 results.push({width,answered,wrongCount,stages:11,history:true,reload:true,migration:true,legacyMigrationRevisions:[1,2],geometry:'PASS'});await context.close();
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',sourceSHA:process.env.GITHUB_SHA??null,root,results,errors},null,2));console.log(JSON.stringify({status:'PASS',results}));
}finally{await browser.close();}
