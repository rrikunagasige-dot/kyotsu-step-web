import fs from 'node:fs';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/',out=process.env.EVIDENCE_DIR??'/tmp/w36-browser',base='work/items/W-MATH-036-ne02-n11-n12-guided-design/';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true}),results=[],errors=[];
try{for(const code of (process.env.CODES??'ne02').split(',')){
 const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/'+code+'Authored.json'));const old=JSON.parse(fs.readFileSync(base+'evidence/'+code.toUpperCase()+'_CURRENT.json')).unit;
 for(const width of (process.env.WIDTHS??'320,390,430,1440').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await page.goto(root+'#/learning/textbook/'+data.unit.unitId);let answered=0,wrongCount=0;const seenFigures=new Set();
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
    return [...new Set(issues)];
   });
   if(problems.length){await page.screenshot({path:out+'/'+code+'-'+width+'-FAIL.png',fullPage:true});fs.writeFileSync(out+'/'+code+'-'+width+'-FAIL.json',JSON.stringify({label,problems},null,2));}assert.deepEqual(problems,[],code+' '+width+' '+label);assert.equal(await page.locator('.katex-error').count(),0,'KaTeX compile errors');
  }
  for(const [stageIndex,stage]of data.stages.entries()){
   const current=page.getByTestId('math-textbook-stage-'+stage.id);await current.waitFor();assert.equal(await current.getByTestId('guided-source-question').count(),1);
   for(const node of data.nodes.filter(n=>n.stageId===stage.id)){
    const visible=current.locator('[data-node-id="'+node.id+'"]');await visible.waitFor();
    if(node.interaction){
     const item=data.unit.sections[0].items.find(i=>i.id===node.interaction);assert.equal(await visible.locator('[data-block-id="'+node.id+'-equation"]').count(),0,'future result hidden');await page.getByTestId('textbook-item-'+item.id).click();const panel=page.getByTestId('inline-choice-panel-'+item.id);assert.equal(await panel.locator('.reading-choice-option').count(),item.choices.length);await geometry(node.id+' options');
     for(const wrong of item.choices.filter(x=>x!==item.answer)){
      await panel.getByRole('button',{name:wrong,exact:true}).click();wrongCount++;await page.getByTestId('textbook-hint-'+item.id).waitFor();assert.equal(await page.getByTestId('textbook-item-'+item.id).count(),1);const next=data.nodes[data.nodes.indexOf(node)+1];if(next?.stageId===stage.id)assert.equal(await current.locator('[data-node-id="'+next.id+'"]').count(),0,'wrong must not unlock future');
     }
     if(width===390&&['ne02-q08-squares','ne02-07','n11-wm011-q03-positive','n12-06','n12-15'].includes(node.id))await panel.screenshot({path:out+'/'+node.id+'-options.png'});
     await panel.getByRole('button',{name:item.answer,exact:true}).click();answered++;assert.equal(await visible.locator('[data-block-id^="'+node.id+'-interaction"]').count(),0,'replace unanswered formula once');
    }
    await geometry(node.id+' complete');
    for(const f of data.nodes.filter(n=>n.extra.figure)){
     const expected=data.nodes.indexOf(f)<=data.nodes.indexOf(node);const count=await current.locator('[data-figure-id="'+f.extra.figure.id+'"]').count();if(!expected)assert.equal(count,0,'future figure including caption hidden');if(f.id===node.id){assert.equal(count,1,'figure revealed at its declared gate');seenFigures.add(f.extra.figure.id);assert.ok(await current.locator('[data-figure-id="'+f.extra.figure.id+'"] img').evaluate(im=>im.complete&&im.naturalWidth>0));}
    }
   }
   if([0,3,7,stageIndex===data.stages.length-1?stageIndex:-1].includes(stageIndex))await current.screenshot({path:out+'/'+code+'-'+width+'-stage-'+(stageIndex+1)+'.png'});
   if(stageIndex===3){await page.reload();await current.waitFor();await geometry('reload');}
   if(stageIndex<data.stages.length-1)await page.getByTestId('math-textbook-next-stage').click();
  }
  assert.equal(answered,data.unit.sections[0].items.length);await page.getByTestId(code+'-complete').waitFor();await page.getByTestId(code+'-history-toggle').click();assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(),data.stages.length-1);await page.getByRole('button',{name:'全文を開く',exact:true}).click();await geometry('expanded history');await page.screenshot({path:out+'/'+code+'-'+width+'-history.png',fullPage:true});await page.setViewportSize({width:width===320?390:320,height:1000});await geometry('resize');await page.setViewportSize({width,height:1000});await page.reload();await page.getByTestId(code+'-complete').waitFor();
  // Real persistence format, reconstructed baseline records, every original revision.
  const migrations=[];
  for(let revision=1;revision<=old.revision;revision++){
   const originals=old.sections[0].items.filter(i=>revision===old.revision||new RegExp('^'+code+'-\\d\\d$').test(i.id));const anchors=Object.fromEntries(originals.map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'original-wrong-first',resolved:true,isFirstCorrect:false,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]));
   await page.evaluate(({id,anchors,revision})=>{const key=Object.keys(localStorage).find(k=>{try{return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress)}catch{return false}});const value=JSON.parse(localStorage.getItem(key));value.state.textbookProgress[id]={unitId:id,unitRevision:revision,startedAt:1,updatedAt:2,completedAt:2,answers:anchors};value.state.textbookProgress['untouched-unit']={unitId:'untouched-unit',unitRevision:1,startedAt:10,updatedAt:11,answers:{}};localStorage.setItem(key,JSON.stringify(value));},{id:data.unit.unitId,anchors,revision});
   await page.reload();const pending=page.locator('.math-textbook-stage--current [data-testid^="textbook-item-"]').first();await pending.click();const itemId=(await pending.getAttribute('data-testid')).replace('textbook-item-','');const item=data.unit.sections[0].items.find(i=>i.id===itemId);await page.getByTestId('inline-choice-panel-'+itemId).getByRole('button',{name:item.answer,exact:true}).click();
   const stores=await page.evaluate(()=>Object.keys(localStorage).flatMap(k=>{try{const s=JSON.parse(localStorage.getItem(k));return s.state?.textbookProgress?[s.state.textbookProgress]:[]}catch{return[]}})[0]);const m=stores[data.unit.unitId];assert.equal(m.unitRevision,data.unit.revision);assert.equal(m.completedAt,undefined);assert.deepEqual(m.archivedRevisions[String(revision)].answers,anchors);if(revision===old.revision)for(const [id,v]of Object.entries(anchors))assert.deepEqual(m.answers[id],v);assert.equal(stores['untouched-unit'].updatedAt,11);migrations.push(revision);
  }
  results.push({code,width,answered,wrongCount,stages:data.stages.length,figures:[...seenFigures],history:true,reload:true,resize:true,migration:true,legacyMigrationRevisions:migrations,geometry:'PASS'});await context.close();
 }
}assert.deepEqual(errors,[]);fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',sourceSHA:process.env.CANDIDATE_SHA??process.env.GITHUB_SHA??null,root,results,errors},null,2));console.log(JSON.stringify({status:'PASS',results}));}finally{await browser.close();}
