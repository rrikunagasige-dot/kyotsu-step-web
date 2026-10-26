import fs from 'node:fs';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/',out=process.env.EVIDENCE_DIR??'/tmp/w38-browser',base='work/items/W-MATH-036-ne02-n11-n12-guided-design/';fs.mkdirSync(out,{recursive:true});
const server=!process.env.APP_URL?spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'}):null;
if(server){let ready=false;for(let i=0;i<100;i++){try{if((await fetch(root)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready){server.kill();throw Error('LOCAL_SERVER_NOT_READY');}}
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']}),results=[],errors=[];let activePage;
try{for(const code of (process.env.CODES??'n11').split(',')){
 const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/'+code+'Authored.json'));const old=JSON.parse(fs.readFileSync(base+'evidence/'+code.toUpperCase()+'_CURRENT.json')).unit;
 for(const width of (process.env.WIDTHS??'320,390,430,1440').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();activePage=page;page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await page.goto(root+'#/learning/textbook/'+data.unit.unitId);let answered=0,wrongCount=0;const seenFigures=new Set();
  async function geometry(label){
   await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
   const problems=await page.locator('.guided-reading').evaluate(el=>{
    const issues=[];if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
    for(const node of el.querySelectorAll('[data-typeset-source]')){
     if(!node.getClientRects().length||node.closest('details:not([open])'))continue;const box=node.getBoundingClientRect();
     for(const m of node.querySelectorAll('.typeset-line .katex,.reading-inline-blank')){const r=m.getBoundingClientRect();if(r.width&&(r.left<box.left-2||r.right>box.right+2))issues.push('formula overflow '+node.dataset.typesetSource);}
    }
    for(const eq of el.querySelectorAll('.numbered-equation')){
     if(!eq.getClientRects().length||eq.closest('details:not([open])'))continue;const label=eq.querySelector('.numbered-equation-label');if(!label)continue;const tag=label.getBoundingClientRect();
     for(const m of eq.querySelectorAll('.numbered-equation-body .katex,.reading-inline-blank')){const r=m.getBoundingClientRect();if(r.width&&r.right>tag.left+1&&r.left<tag.right-1&&r.bottom>tag.top+1&&r.top<tag.bottom-1)issues.push('number collision '+eq.dataset.equationNumber);}
    }
    for(const node of el.querySelectorAll('.reading-choice-option')){const r=node.getBoundingClientRect();if(r.width&&(r.left<0||r.right>innerWidth+1))issues.push('option overflow');for(const m of node.querySelectorAll('.katex-html')){const mr=m.getBoundingClientRect();if(mr.width&&(mr.left<r.left-1||mr.right>r.right+1))issues.push('option math overflow '+node.getAttribute('aria-label'));}}
    for(const group of el.querySelectorAll('[data-transformation-group]')){if(!group.getClientRects().length||group.closest('details:not([open])'))continue;const box=group.getBoundingClientRect();for(const cell of group.querySelectorAll('.transformation-equation .katex,.transformation-equation .reading-inline-blank')){const r=cell.getBoundingClientRect();if(r.width&&(r.left<box.left-2||r.right>box.right+2))issues.push('transformation overflow '+group.dataset.transformationGroup);}}
    return [...new Set(issues)];
   });
   if(problems.length){await page.screenshot({path:out+'/'+code+'-'+width+'-FAIL.png',fullPage:true});fs.writeFileSync(out+'/'+code+'-'+width+'-FAIL.json',JSON.stringify({label,problems},null,2));}assert.deepEqual(problems,[],code+' '+width+' '+label);assert.equal(await page.locator('.katex-error').count(),0,'KaTeX compile errors');
  }
  async function separateChecks(scope){const tops=await scope.locator('.katex-html .mathnormal').evaluateAll(nodes=>nodes.filter(n=>n.textContent==='T').map(n=>n.getBoundingClientRect().top));assert.equal(tops.length,2,'two complete function evaluations');assert.ok(tops[1]>tops[0]+8,'independent checks occupy separate rows');}
  for(const [stageIndex,stage]of data.stages.entries()){
   const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();assert.equal(await current.getByTestId('guided-source-question').count(),1);
   for(const node of data.nodes.filter(n=>n.stageId===stage.id)){
    const grouped=code==='n11'&&['n11-solve-problem','n11-wm017-q05-operation','n11-wm017-q05-balance','n11-05','n11-q06-operation','n11-06'].includes(node.id);const visible=grouped?current.locator('[data-transformation-row][data-source-node="'+node.id+'"]').first():current.locator('[data-node-id="'+node.id+'"]');await visible.waitFor();
    if(node.interaction){
     const item=data.unit.sections[0].items.find(i=>i.id===node.interaction);assert.equal(await visible.locator('[data-block-id="'+node.id+'-equation"]').count(),0,'future result hidden');await page.getByTestId('textbook-item-'+item.id).click();const panel=page.getByTestId('inline-choice-panel-'+item.id);assert.equal(await panel.locator('.reading-choice-option').count(),item.choices.length);await geometry(node.id+' options');
     for(const wrong of item.choices.filter(x=>x!==item.answer)){
      await panel.getByRole('button',{name:wrong,exact:true}).click();wrongCount++;await page.getByTestId('textbook-hint-'+item.id).waitFor();assert.equal(await page.getByTestId('textbook-item-'+item.id).count(),1);const next=data.nodes[data.nodes.indexOf(node)+1];if(next?.stageId===stage.id)assert.equal(await current.locator('[data-node-id="'+next.id+'"]').count(),0,'wrong must not unlock future');
     }
     if(node.id==='n12-15')for(const option of await panel.locator('.reading-choice-option').all())await separateChecks(option);
     if(width===390&&['ne02-q08-squares','ne02-07','n11-wm011-q03-positive','n11-wm011-q03-zero','n12-06','n12-15'].includes(node.id))await panel.screenshot({path:out+'/'+node.id+'-options.png'});
     await panel.getByRole('button',{name:item.answer,exact:true}).click();answered++;assert.equal(await visible.locator('[data-block-id^="'+node.id+'-interaction"]').count(),0,'replace unanswered formula once');
    }
    await geometry(node.id+' complete');if(node.id==='n12-15')await separateChecks(visible.locator('.numbered-equation-body'));assert.ok(await visible.locator('.numbered-equation-label').count()<=1,'one number per result group');
    const compiled=data.semantic.nodes.find(n=>n.id===node.id);const shown=grouped?[]:[...compiled.before.filter(b=>!node.interaction||!b.id.startsWith(node.id+'-interaction')),...compiled.after];
    for(const b of shown){if(b.type==='paragraph')for(const part of b.parts.filter(p=>p.type==='math'||p.type==='term')){const actual=visible.locator('[data-semantic-id="'+part.semanticId+'"]');assert.equal(await actual.count(),1,'visible semantic token '+part.semanticId);if(part.type==='term')assert.ok(await actual.evaluate(el=>Number(getComputedStyle(el).fontWeight)>=600));}
     if(b.type==='formula'){const actual=visible.locator('[data-typeset-source="'+b.id+'"]');assert.equal(await actual.count(),1,'formula rendered '+b.id);assert.ok(await actual.locator('annotation[encoding="application/x-tex"]').count()>0,'actual rendered math '+b.id);}}
    for(const f of data.nodes.filter(n=>n.extra.figure)){
     const expected=data.nodes.indexOf(f)<=data.nodes.indexOf(node);const count=await current.locator('[data-figure-id="'+f.extra.figure.id+'"]').count();if(!expected)assert.equal(count,0,'future figure including caption hidden');if(f.id===node.id){assert.equal(count,1,'figure revealed at its declared gate');seenFigures.add(f.extra.figure.id);assert.ok(await current.locator('[data-figure-id="'+f.extra.figure.id+'"] img').evaluate(async im=>{await Promise.race([im.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error('FIGURE_DECODE_TIMEOUT')),30000))]);return im.complete&&im.naturalWidth>0}));}
    }
   }
   if([0,3,4,5,6,7,stageIndex===data.stages.length-1?stageIndex:-1].includes(stageIndex))await current.screenshot({path:out+'/'+code+'-'+width+'-stage-'+(stageIndex+1)+'.png'});
   if(stageIndex===3){await page.reload();await current.waitFor();await geometry('reload');}
   if(stageIndex<data.stages.length-1)await page.getByTestId('math-textbook-next-stage').click();
  }
  assert.equal(answered,data.unit.sections[0].items.length);await page.getByTestId(code+'-complete').waitFor();await page.getByTestId(code+'-history-toggle').click();assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(),data.stages.length-1);await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('expanded history');await page.screenshot({path:out+'/'+code+'-'+width+'-history.png',fullPage:true});await page.setViewportSize({width:width===320?390:320,height:1000});await geometry('resize');await page.setViewportSize({width,height:1000});await page.reload();await page.getByTestId(code+'-complete').waitFor();
  if(code==='n11'){
   const getRecords=()=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(k=>!k.startsWith('math-textbook-compact')).map(k=>[k,localStorage.getItem(k)])));
   const saved=await getRecords();await page.goto(root+'#/learning/textbook/'+data.unit.unitId+'?layout=original');await page.getByTestId(code+'-complete').waitFor();assert.equal(await page.locator('[data-transformation-group]').count(),0);assert.deepEqual(await getRecords(),saved,'old layout keeps grading and progress');await page.goto(root+'#/learning/textbook/'+data.unit.unitId);await page.getByTestId(code+'-complete').waitFor();await page.getByTestId(code+'-history-toggle').click();await page.getByRole('button',{name:'全文を開く',exact:true}).click();assert.ok(await page.locator('[data-transformation-group]').count()>0);assert.deepEqual(await getRecords(),saved,'new layout keeps grading and progress');
  }
  // Real persistence format, reconstructed baseline records, every original revision.
  const migrations=[];
  for(let revision=1;revision<=old.revision;revision++){
   const originals=old.sections[0].items.filter(i=>revision===old.revision||new RegExp('^'+code+'-\\d\\d$').test(i.id));const anchors=Object.fromEntries(originals.map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'original-wrong-first',resolved:true,isFirstCorrect:false,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]));
   await page.evaluate(({id,anchors,revision})=>{const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});const value=JSON.parse(localStorage.getItem(key));value.state.textbookProgress[id]={unitId:id,unitRevision:revision,startedAt:1,updatedAt:2,completedAt:2,answers:anchors};value.state.textbookProgress['untouched-unit']={unitId:'untouched-unit',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};localStorage.setItem(key,JSON.stringify(value));},{id:data.unit.unitId,anchors,revision});
   await page.reload();await page.locator('.guided-reading').waitFor();const pending=page.locator('.math-textbook-stage--current [data-testid^="textbook-item-"]').first();
   // The real saved cursor may reopen an earlier, already-complete page. Follow its normal next control.
   for(let step=0;await pending.count()===0;step++){
    assert.ok(step<data.stages.length,'a pending migration item must remain reachable');const previous=await page.locator('.math-textbook-stage--current').getAttribute('data-testid');const next=page.getByTestId('math-textbook-next-stage');assert.equal(await next.count(),1,'completed saved page has a next stage');await next.click();await page.waitForFunction(id=>document.querySelector('.math-textbook-stage--current')?.getAttribute('data-testid')!==id,previous);
   }
   await pending.click();const itemId=(await pending.getAttribute('data-testid')).replace('textbook-item-','');const item=data.unit.sections[0].items.find(i=>i.id===itemId);await page.getByTestId('inline-choice-panel-'+itemId).getByRole('button',{name:item.answer,exact:true}).click();
   const stores=await page.evaluate(()=>Object.keys(localStorage).flatMap(k=>{try{const s=JSON.parse(localStorage.getItem(k));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);const m=stores[data.unit.unitId];assert.equal(m.unitRevision,data.unit.revision);assert.equal(m.completedAt,undefined);assert.deepEqual(m.archivedRevisions[String(revision)].answers,anchors);if(revision===old.revision)for(const [id,v]of Object.entries(anchors))assert.deepEqual(m.answers[id],v);assert.equal(stores['untouched-unit'].updatedAt,11);migrations.push(revision);
  }
  results.push({code,width,answered,wrongCount,stages:data.stages.length,figures:[...seenFigures],history:true,reload:true,resize:true,migration:true,legacyMigrationRevisions:migrations,geometry:'PASS'});await context.close();
 }
}assert.deepEqual(errors,[]);fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',sourceSHA:process.env.CANDIDATE_SHA??process.env.GITHUB_SHA??null,root,results,errors},null,2));console.log(JSON.stringify({status:'PASS',results}));}catch(e){fs.writeFileSync(out+'/ERROR.json',JSON.stringify({error:e.message,errors,url:activePage?.url()},null,2));if(activePage)await activePage.screenshot({path:out+'/ERROR.png',fullPage:true});throw e;}finally{await browser.close();server?.kill();}
