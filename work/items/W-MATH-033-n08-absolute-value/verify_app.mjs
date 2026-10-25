import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Authored.json'));
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/';
const out=process.env.EVIDENCE_DIR??'/tmp/n08-browser';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],results=[];
try{
for(const width of (process.env.WIDTHS??'320,390,430,1440').split(',').map(Number)){
 const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(root+'#/learning/textbook/'+data.unit.unitId);
 let answered=0,wrongCount=0;
 async function geometry(label){
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
  const failures=await page.locator('.n08-reading').evaluate(el=>{
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
   const overflow=await page.locator('.n08-reading').evaluate(el=>[...el.querySelectorAll('*')].filter(n=>n.getClientRects().length&&n.getBoundingClientRect().right>innerWidth+1).map(n=>({tag:n.tagName,class:n.className,text:n.textContent.slice(0,160),right:n.getBoundingClientRect().right})).slice(0,30));
   fs.writeFileSync(out+'/failure-'+width+'.json',JSON.stringify({label,failures,overflow},null,2));
  }
  assert.deepEqual(failures,[],label+' width'+width);assert.equal(await page.locator('.katex-error').count(),0);
 }
 for(const [stageIndex,stage]of data.stages.entries()){
  const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();
  assert.equal(await current.getByTestId('n08-source-question').count(),1);
  for(const node of data.nodes.filter(n=>n.stageId===stage.id)){
   const visible=current.locator('[data-node-id="'+node.id+'"]');await visible.waitFor();
   const compiled=data.semantic.nodes.find(n=>n.id===node.id);
   if(node.interaction){
    assert.equal(await visible.locator('[data-block-id="'+node.id+'-result"]').count(),0,'future result hidden');
    const item=data.unit.sections[0].items.find(i=>i.id===node.interaction);
    await page.getByTestId('textbook-item-'+item.id).click();const panel=page.getByTestId('inline-choice-panel-'+item.id);
    await geometry(node.id+' options');
    if(node.id==='n08-q05-compare')assert.equal(await panel.locator('.reading-choice-option .katex').count(),3,'relation choices use math rendering');
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
    if(block.type==='formula'){
     const f=visible.locator('[data-typeset-source="'+block.id+'"]');assert.equal(await f.count(),1);
     const source=await f.locator('annotation[encoding="application/x-tex"]').allTextContents();
     assert.ok(source.length,'actual formula rendered '+block.id);
    }
   }
  }
  if(stageIndex===3){
   const table=current.getByTestId('n08-cases-table');assert.equal(await table.locator('tbody tr').count(),2);
   assert.match(await table.innerText(),/0/);
  }
  if(stageIndex===6){
   const refs=current.getByTestId('math-textbook-stage-references');assert.equal(await refs.getByTestId('n08-cases-table').count(),1);
   const group=current.locator('[data-typeset-source="n08-07-result"]');assert.ok((await group.locator('.typeset-relation').count())>=1);
  }
  if([0,3,4,6,9,10,11].includes(stageIndex))await current.screenshot({path:out+'/width-'+width+'-stage-'+(stageIndex+1)+'.png'});
  if(stageIndex===6){await page.reload();await current.waitFor();await geometry('reload');}
  if(stageIndex<data.stages.length-1)await page.getByTestId('math-textbook-next-stage').click();
 }
 assert.equal(answered,31);await page.getByTestId('n08-complete').waitFor();
 await page.getByTestId('n08-history-toggle').click();assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(),11);
 await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('full history');
 await page.screenshot({path:out+'/width-'+width+'-history.png',fullPage:true});
 await page.reload();await page.getByTestId('n08-complete').waitFor();
 // Upgrade actual persisted original anchors, preserving wrong-first attempts and unrelated unit.
 const anchors=Object.fromEntries(data.unit.sections[0].items.filter(i=>/^n08-\d\d$/.test(i.id)).map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'original-wrong-first',resolved:true,isFirstCorrect:false,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]));
 await page.evaluate(({unitId,anchors})=>{
  const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});
  const saved=JSON.parse(localStorage.getItem(key));saved.state.textbookProgress[unitId]={unitId,unitRevision:3,startedAt:1,updatedAt:2,completedAt:2,answers:anchors};
  saved.state.textbookProgress['untouched-unit']={unitId:'untouched-unit',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};
  localStorage.setItem(key,JSON.stringify(saved));
 },{unitId:data.unit.unitId,anchors});
 await page.reload();await page.getByTestId('math-textbook-stage-n08-stage-01').waitFor();
 const first=data.unit.sections[0].items[0];await page.getByTestId('textbook-item-'+first.id).click();
 await page.getByTestId('inline-choice-panel-'+first.id).getByRole('button',{name:first.answer,exact:true}).click();
 const saved=await page.evaluate(()=>Object.keys(localStorage).flatMap(key=>{try{const s=JSON.parse(localStorage.getItem(key));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);
 const migrated=saved[data.unit.unitId];assert.equal(migrated.unitRevision,4);assert.equal(migrated.completedAt,undefined);assert.equal(migrated.previousRevisionCompletedAt,2);
 assert.deepEqual(migrated.archivedRevisions['3'].answers,anchors);for(const [id,record]of Object.entries(anchors))assert.deepEqual(migrated.answers[id],record);
 assert.equal(Object.keys(migrated.answers).length,13);assert.equal(saved['untouched-unit'].updatedAt,11);
 for(const revision of [1,2]){
  const older=structuredClone(anchors);older['n08-10']={...older['n08-10'],value:'a=0',firstValue:'a=0',isFirstCorrect:true,attemptCount:1};
  if(revision===1)older['n08-05']={...older['n08-05'],value:'\\sqrt5<3',firstValue:'\\sqrt5<3',isFirstCorrect:true,attemptCount:1};
  await page.evaluate(({unitId,older,revision})=>{
   const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});
   const saved=JSON.parse(localStorage.getItem(key));saved.state.textbookProgress[unitId]={unitId,unitRevision:revision,startedAt:1,updatedAt:2,completedAt:2,answers:older};localStorage.setItem(key,JSON.stringify(saved));
  },{unitId:data.unit.unitId,older,revision});
  await page.reload();await page.getByTestId('textbook-item-'+first.id).click();
  await page.getByTestId('inline-choice-panel-'+first.id).getByRole('button',{name:first.answer,exact:true}).click();
  const stores=await page.evaluate(()=>Object.keys(localStorage).flatMap(key=>{try{const s=JSON.parse(localStorage.getItem(key));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);
  const value=stores[data.unit.unitId];assert.deepEqual(value.archivedRevisions[String(revision)].answers,older);
  assert.equal(value.answers['n08-10'],undefined);if(revision===1)assert.equal(value.answers['n08-05'],undefined);
  assert.equal(value.unitRevision,4);assert.equal(value.completedAt,undefined);assert.equal(stores['untouched-unit'].updatedAt,11);
 }
 const compound=data.unit.sections[0].items.find(i=>i.id==='n08-01'),retired='2.3,\\quad-5.0';
 await page.evaluate(({unitId,retired})=>{
  const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});
  const saved=JSON.parse(localStorage.getItem(key));saved.state.textbookProgress[unitId]={unitId,unitRevision:3,startedAt:1,updatedAt:2,answers:{'n08-01':{itemId:'n08-01',value:retired,firstValue:retired,resolved:false,isFirstCorrect:false,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:2}}};localStorage.setItem(key,JSON.stringify(saved));
 },{unitId:data.unit.unitId,retired});
 await page.reload();await page.getByTestId('textbook-item-'+first.id).click();
 await page.getByTestId('inline-choice-panel-'+first.id).getByRole('button',{name:first.answer,exact:true}).click();
 await page.getByTestId('textbook-item-'+compound.id).click();await page.getByTestId('textbook-hint-'+compound.id).waitFor();
 await page.getByTestId('inline-choice-panel-'+compound.id).getByRole('button',{name:compound.answer,exact:true}).click();
 const recoveredStores=await page.evaluate(()=>Object.keys(localStorage).flatMap(key=>{try{const s=JSON.parse(localStorage.getItem(key));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);
 const recovered=recoveredStores[data.unit.unitId];
 assert.equal(recovered.answers['n08-01'].firstValue,retired);assert.equal(recovered.answers['n08-01'].attemptCount,2);assert.equal(recovered.archivedRevisions['3'].answers['n08-01'].value,retired);
 results.push({width,answered,wrongCount,stages:12,history:true,reload:true,migration:true,legacyMigrationRevisions:[1,2,3],retiredChoiceRecovered:true,geometry:'PASS'});await context.close();
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',sourceSHA:process.env.GITHUB_SHA??null,root,results,errors},null,2));console.log(JSON.stringify({status:'PASS',results}));
}finally{await browser.close();}
