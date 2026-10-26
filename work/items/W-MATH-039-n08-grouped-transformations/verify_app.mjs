import fs from 'node:fs';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import {spawn} from 'node:child_process';
const base='work/items/W-MATH-037-n08-workflow-trial/',data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Revision5.json')),old=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Authored.json'));
const out=process.env.EVIDENCE_DIR??'/tmp/w39-browser';fs.mkdirSync(out,{recursive:true});
let server;const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/';
if(!process.env.APP_URL){server=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4173'],{stdio:'ignore'});for(let i=0;i<80;i++){try{if((await fetch(root)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}}
const presentation=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Transformation.json'));
const browser=await chromium.launch({headless:true,...(process.env.KYOTSU_CHROMIUM_PATH?{executablePath:process.env.KYOTSU_CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']}:{})}),results=[],errors=[];let page;
async function geometry(label){
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
 const issues=await page.locator('.n08-reading').evaluate(el=>{
  const issues=[];if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
  for(const eq of el.querySelectorAll('.numbered-equation')){
   if(!eq.getClientRects().length||eq.closest('details:not([open])'))continue;const label=eq.querySelector('.numbered-equation-label');if(!label)continue;const tag=label.getBoundingClientRect();
   for(const m of eq.querySelectorAll('.numbered-equation-body .katex,.reading-inline-blank')){const r=m.getBoundingClientRect();if(r.width&&r.right>tag.left+1&&r.left<tag.right-1&&r.bottom>tag.top+1&&r.top<tag.bottom-1)issues.push('number collision '+eq.dataset.equationNumber);}
  }
  for(const group of el.querySelectorAll('[data-transformation-group]')){if(!group.getClientRects().length||group.closest('details:not([open])'))continue;const b=group.getBoundingClientRect();for(const cell of group.querySelectorAll('.transformation-equation .katex,.transformation-equation .reading-inline-blank')){const r=cell.getBoundingClientRect();if(r.width&&(r.left<b.left-2||r.right>b.right+2))issues.push('group overflow '+group.dataset.transformationGroup);}}
  for(const group of el.querySelectorAll('[data-transformation-group]')){if(group.closest('details:not([open])'))continue;const tag=group.querySelector('.numbered-equation-label'),eq=group.querySelector('.numbered-equation');const rows=[...group.querySelectorAll('.transformation-equation')],last=rows.at(-1),maths=last?[...last.querySelectorAll('.katex')]:[];if(!tag||!last||eq.classList.contains('numbered-equation--below'))continue;const m=(maths.at(-1)??last).getBoundingClientRect(),t=tag.getBoundingClientRect();if(Math.abs((m.top+m.bottom-t.top-t.bottom)/2)>8)issues.push('number not anchored to main equation '+group.dataset.transformationGroup);}
  for(const option of el.querySelectorAll('.reading-choice-option')){const b=option.getBoundingClientRect();if(b.width&&(b.left<0||b.right>innerWidth+1))issues.push('option overflow');for(const m of option.querySelectorAll('.katex-html')){const r=m.getBoundingClientRect();if(r.width&&(r.left<b.left-1||r.right>b.right+1))issues.push('option math overflow '+option.getAttribute('aria-label'));}}
  return [...new Set(issues)];
 });assert.deepEqual(issues,[],label);assert.equal(await page.locator('.katex-error').count(),0,'KaTeX');
}
try{
 for(const width of (process.env.WIDTHS??'320,390,430,1440').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:1000}});page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'#/learning/textbook/'+data.unit.unitId);await page.locator('[data-n08-revision="5"]').waitFor();let answers=0,wrongCount=0;
  for(const [index,stage]of data.stages.entries()){
   const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();const group=data.problemGroups.find(p=>p.stages.includes(stage.id));assert.equal(await current.getByTestId('n08-source-question').getAttribute('data-problem-id'),group.id);
   if(index===5||index===6||index===8)assert.equal(await current.getByTestId('n08-problem-record').count(),1);
   for(const node of data.nodes.filter(n=>n.stageId===stage.id)){
    const grouped=presentation.scope.nodeIds.includes(node.id);
    const visible=grouped?current.locator('[data-transformation-row][data-source-node="'+node.id+'"]').last():current.locator('[data-node-id="'+node.id+'"]');await visible.waitFor();
    if(node.interaction){const item=data.unit.sections[0].items.find(i=>i.id===node.interaction);const blanks=current.getByTestId('textbook-item-'+item.id);const shared=node.id==='n08-r5-q06-operation'||node.id==='n08-r5-q08-operation';assert.equal(await blanks.count(),shared?2:1);
     await blanks.last().click();const panel=page.getByTestId('inline-choice-panel-'+item.id);assert.equal(await panel.count(),1,'one panel for shared blanks');await geometry(node.id+' options');
     if(['n08-01','n08-05'].includes(node.id))for(const option of await panel.locator('.reading-choice-option').all())assert.equal(await option.locator('.n08-choice-rows > span').count(),2,'all comparable choices use two rows');
     for(const wrong of item.choices.filter(x=>x!==item.answer&&!item.acceptedAnswers.includes(x))){await panel.getByRole('button',{name:wrong,exact:true}).click();wrongCount++;await page.getByTestId('textbook-hint-'+item.id).waitFor();const next=data.nodes[data.nodes.indexOf(node)+1];if(next?.stageId===stage.id&&next.interaction)assert.equal(await current.getByTestId('textbook-item-'+next.interaction).count(),0,'wrong does not reveal next answer');}
     if(width===390&&['n08-r5-q06-operation','n08-05','n08-q07-distribute','n08-q09-distribute'].includes(node.id))await current.screenshot({path:out+'/'+node.id+'-options.png'});
     await panel.getByRole('button',{name:item.answer,exact:true}).click();answers++;assert.equal(await blanks.count(),0);assert.equal(await panel.count(),0);
    }
    await geometry(node.id+' complete');assert.ok(await visible.locator('.numbered-equation-label').count()<=1,'one number per completed node '+node.id);
   }
   if([1,4,5,6,8,10,11].includes(index))await current.screenshot({path:out+'/'+width+'-stage-'+(index+1)+'.png'});
   if(index===5){await page.reload();await current.waitFor();assert.equal(await current.getByTestId('n08-problem-record').count(),1);}
   if(index<data.stages.length-1)await page.getByTestId('math-textbook-next-stage').click();
  }
  assert.equal(answers,34);await page.getByTestId('n08-complete').waitFor();await page.getByTestId('n08-history-toggle').click();await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('history');await page.setViewportSize({width:width===320?390:320,height:1000});await geometry('resize');await page.reload();await page.getByTestId('n08-complete').waitFor();
  const savedRecords=await page.evaluate(()=>Object.keys(localStorage).flatMap(k=>{try{const v=JSON.parse(localStorage.getItem(k));return v.state?.textbookProgress?[v.state.textbookProgress]:[]}catch{return[]}})[0]);
  for(const node of data.nodes.filter(n=>n.id.includes('-operation'))){const record=savedRecords[data.unit.unitId].answers[node.interaction];assert.equal(record.attemptCount,3,'two-sided blank records one attempt per selected choice');}
  const before=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}}).map(k=>[k,localStorage.getItem(k)])));
  await page.goto(root+'#/learning/textbook/'+data.unit.unitId+'?layout=original');await page.getByTestId('n08-complete').waitFor();assert.equal(await page.locator('[data-n08-layout="original"]').count(),1);assert.equal(await page.locator('[data-transformation-group]').count(),0);
  const originalRecords=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(before));assert.deepEqual(originalRecords,before,'original r5 preserves progress');
  await page.goto(root+'#/learning/textbook/'+data.unit.unitId);await page.getByTestId('n08-complete').waitFor();assert.equal(await page.locator('[data-n08-layout="grouped"]').count(),1);
  await page.goto(root+'#/learning/textbook/'+data.unit.unitId+'?version=4');await page.getByTestId('n08-archive-page').waitFor();assert.equal(await page.locator('[data-n08-revision="5"]').count(),0);await geometry('old version');
  const after=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(before));assert.deepEqual(after,before,'old view leaves active progress intact');
  const anchors=Object.fromEntries(old.unit.sections[0].items.map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'old-first-wrong',isFirstCorrect:false,resolved:true,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]));
  await page.evaluate(({unitId,anchors})=>{const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});const value=JSON.parse(localStorage.getItem(key));value.state.textbookProgress[unitId]={unitId,unitRevision:4,startedAt:1,updatedAt:2,completedAt:2,answers:anchors};value.state.textbookProgress['untouched-unit']={unitId:'untouched-unit',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};localStorage.setItem(key,JSON.stringify(value));localStorage.removeItem('math-textbook-compact-v1:'+unitId+':r5');},{unitId:data.unit.unitId,anchors});
  await page.goto(root+'#/learning/textbook/'+data.unit.unitId);await page.reload();await page.locator('[data-n08-revision="5"]').waitFor();
  for(let i=0;await page.getByTestId('textbook-item-n08-r5-q02-distance-answer').count()===0;i++){assert.ok(i<12);await page.getByTestId('math-textbook-next-stage').click();}
  await page.getByTestId('textbook-item-n08-r5-q02-distance-answer').click();await page.getByTestId('inline-choice-panel-n08-r5-q02-distance-answer').getByRole('button',{name:'a-0',exact:true}).click();
  const migrated=await page.evaluate(()=>Object.keys(localStorage).flatMap(k=>{try{const v=JSON.parse(localStorage.getItem(k));return v.state?.textbookProgress?[v.state.textbookProgress]:[]}catch{return[]}})[0]);const progress=migrated[data.unit.unitId];assert.equal(progress.unitRevision,5);assert.equal(progress.completedAt,undefined);assert.deepEqual(progress.archivedRevisions['4'].answers,anchors);for(const[id,v]of Object.entries(anchors))assert.deepEqual(progress.answers[id],v);assert.equal(migrated['untouched-unit'].updatedAt,11);
  results.push({width,answers,wrongCount,stages:12,sharedBinding:true,oneAttemptPerSelection:true,oldArchive:true,originalLayout:true,history:true,reload:true,migration:true,geometry:'PASS'});await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',sourceSHA:process.env.CANDIDATE_SHA??null,root,results},null,2));console.log(JSON.stringify({status:'PASS',results}));
}catch(e){fs.writeFileSync(out+'/ERROR.json',JSON.stringify({error:e.message,url:page?.url(),errors},null,2));if(page)await page.screenshot({path:out+'/ERROR.png',fullPage:true});throw e;}finally{await browser.close();if(server)server.kill();}
