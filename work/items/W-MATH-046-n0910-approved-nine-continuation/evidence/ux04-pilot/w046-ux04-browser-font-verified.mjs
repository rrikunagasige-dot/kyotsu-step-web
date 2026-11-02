import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='/workspace/scratch/6ff917b2ec4a/w046-ux04-pilot',require=createRequire(root+'/package.json'),{chromium}=require('@playwright/test');
const {checkNestedMeasurements}=await import(root+'/tools/textbook/layout/nested-measurements.mjs');
const {checkEquationTag}=await import(root+'/tools/textbook/layout/equation-tag-measurements.mjs');
const code=process.argv[2]??'n09',widths=(process.argv[3]??'320,390,430,1440').split(',').map(Number);
assert(['n09','n10'].includes(code));assert(widths.every(w=>[320,390,430,1440].includes(w)));
const json=p=>JSON.parse(fs.readFileSync(root+'/'+p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const compiled=json('src/data/textbook/math/numbers/'+code+'ConstructionCompiled.json');
const oldRevision=code==='n09'?5:3,oldCompiled=json('src/data/textbook/math/numbers/'+code+'ConstructionCompiledR'+oldRevision+'.json');
const sourceSHA=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
if(process.env.W046_EXPECTED_SHA)assert.equal(sourceSHA,process.env.W046_EXPECTED_SHA,'not expected frozen source');
const sourcePaths=['src','tools/textbook','public'].flatMap(dir=>fs.readdirSync(root+'/'+dir,{recursive:true,withFileTypes:true}).filter(f=>f.isFile()).map(f=>path.relative(root,path.join(f.parentPath,f.name)))).concat(['package.json','pnpm-lock.yaml','work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json']);
const manifest=()=>Object.fromEntries(sourcePaths.sort().map(p=>[p,sha(fs.readFileSync(root+'/'+p))]));
const sourceManifest=manifest(),scriptHash=sha(fs.readFileSync(new URL(import.meta.url)));
const out=process.env.W046_OUTPUT??'/tmp/w046-ux04-pilot-'+code+'-'+Date.now();fs.mkdirSync(out,{recursive:true});
const namespace='w046-ux04-pilot-'+code,port=code==='n09'?4340:4341,url='http://127.0.0.1:'+port+'/kyotsu-step-web/';
// Independent approved H01-H17 expectation. Other nodes retain exact baseline part contracts.
const targets={
 'n09-q01-negative':{powerAction:'負号を含む−4全体を、同じ二因子の積にする',productSign:'+',value:'16'},
 'n09-01':{balanceOperation:'-',factorSign:'+',zeroLogic:'または',leftInverseOperation:'+',rightInverseOperation:'-'}
};
const normalize=s=>s.replace(/\\times/g,'×').replace(/[\s{}]/g,'').replace(/−/g,'-').replace(/\\gt/g,'>').replace(/\\lt/g,'<');
const contract=p=>({id:p.id,key:p.key,kind:p.kind,role:p.role,expected:p.expected,prompt:p.prompt,choices:p.choices.map(c=>({value:c.value,kind:c.kind,display:c.display,latex:c.latex,feedback:c.feedback,misconception:c.misconception}))});
assert.equal(compiled.unitId,'math-numbers-expressions-'+code);assert.equal(compiled.toRevision,code==='n09'?6:4);assert.equal(compiled.nodeDesign.length,code==='n09'?41:45);assert.deepEqual(compiled.nodeDesign.map(n=>n.nodeId),oldCompiled.nodeDesign.map(n=>n.nodeId),'node order');assert.deepEqual(compiled.stages,oldCompiled.stages,'original stages unchanged');
const protectedNodes=[],changes=[];
for(const node of compiled.nodeDesign){
 const old=oldCompiled.nodeDesign.find(n=>n.nodeId===node.nodeId);assert(old,'unexpected node '+node.nodeId);assert.deepEqual(node.prerequisiteNodeIds,old.prerequisiteNodeIds,'node prerequisites '+node.nodeId);assert.deepEqual(node.requiredResultRefs,old.requiredResultRefs,'result prerequisites '+node.nodeId);assert.deepEqual(node.displayExtras,old.displayExtras,'protected extras '+node.nodeId);
 if(targets[node.nodeId]){for(const [key,answer]of Object.entries(targets[node.nodeId])){const p=node.parts.find(p=>p.key===key);assert(p,'missing approved part '+node.nodeId+'::'+key);const correct=p.choices.find(c=>c.value===p.expected);assert.equal(normalize(p.kind==='text'?(correct?.display??p.expected):p.expected),normalize(answer),'approved correct value '+p.id);assert.equal(p.choices.filter(c=>c.value===p.expected).length,1,'unique answer '+p.id);assert(p.choices.every(c=>c.feedback&&c.misconception),'feedback '+p.id);}changes.push(node.nodeId);}
 else{assert.deepEqual(node.parts.map(contract),old.parts.map(contract),'protected part contract '+node.nodeId);assert.deepEqual(node.partOrder,old.partOrder,'protected order '+node.nodeId);protectedNodes.push(node.nodeId);}
}
const expectedParts=compiled.nodeDesign.flatMap(n=>n.partOrder.map(key=>n.parts.find(p=>p.key===key))),targetIds=new Set(changes);
const addedIds=expectedParts.filter(p=>!oldCompiled.nodeDesign.flatMap(n=>n.parts).some(old=>old.id===p.id)).map(p=>p.id);
const results=[],failures=[],errors=[],screenshots=[],packets=[],lifecycle=[],networkFailures=[],httpErrors=[],fontChecks=[],neutralStates=new Map();let stateCount=0,geometryCount=0;
const server=spawn(root+'/node_modules/.bin/vite',['--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:root,env:{...process.env,VITE_STORAGE_NAMESPACE:namespace},stdio:'ignore'});
for(let i=0;i<100;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
const browser=await chromium.launch({headless:true,executablePath:'/tmp/w046-browser/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox','--disable-dev-shm-usage']});
async function install(page){await page.evaluate(async()=>{
 window.measureNestedMathDOM=(await import('/kyotsu-step-web/src/components/textbook/nestedMathGeometry.ts')).measureNestedMathDOM;
 window.collectTag=shell=>{
  const row=shell.closest('.construction-lesson-math-row'),tag=row?.querySelector(':scope > .construction-lesson-equation-number');if(!tag)return null;
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}};
  const formula=shell.querySelector('.nested-math-formula'),gathered=Boolean(shell.dataset.rootBreakPath),table=gathered?formula.querySelector('.katex-html > .base > .mord > .mtable'):null;
  const cells=table?[...table.querySelectorAll(':scope > .col-align-c > .vlist-t > .vlist-r > .vlist > span')].map(e=>e.querySelector(':scope > .mord')).filter(Boolean):[...formula.querySelectorAll('.katex-html > .base')];
  if(!cells.length||gathered&&!table)throw Error('NUMBER_ROOT_BASELINE_UNVERIFIED');
  const baselines=cells.map(cell=>{const zero=document.createElement('i');zero.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline';cell.append(zero);const y=zero.getBoundingClientRect().top;zero.remove();return y});
  const baseline=tag.querySelector('[data-number-baseline]').getBoundingClientRect().top,style=getComputedStyle(tag),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw Error('NUMBER_FONT_INK_UNVERIFIED');ctx.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
  const text=[...tag.childNodes].find(n=>n.nodeType===Node.TEXT_NODE),range=document.createRange();range.selectNodeContents(text);const start=range.getBoundingClientRect(),metrics=ctx.measureText(tag.textContent.trim());
  return{label:tag.textContent.trim(),font:style.fontSize,placement:row.dataset.numberPlacement,rect:rect(tag),ink:{x:start.left-metrics.actualBoundingBoxLeft,y:baseline-metrics.actualBoundingBoxAscent,width:metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight,height:metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent},baseline,finalMathBaseline:Math.max(...baselines),baselineSource:gathered?'zero-inline-root-row':'zero-inline-root-base'};
 };
});}
async function settle(page,all=false){await page.evaluate(()=>document.fonts.ready);const fonts=await page.evaluate(()=>({status:document.fonts.status,main:document.fonts.check('18px KaTeX_Main'),math:document.fonts.check('italic 18px KaTeX_Math'),errors:[...document.fonts].filter(f=>f.status==='error').map(f=>({family:f.family,style:f.style})),loaded:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,style:f.style}))}));assert(fonts.main&&fonts.math&&!fonts.errors.length&&fonts.loaded.some(f=>f.family==='KaTeX_Main')&&fonts.loaded.some(f=>f.family==='KaTeX_Math'&&f.style==='italic'),'KATEX_FONT_NOT_LOADED '+JSON.stringify(fonts));fontChecks.push(fonts);await page.waitForFunction(all=>[...document.querySelectorAll((all?'.construction-lesson-reading':'.construction-lesson-stage')+' .nested-math-shell')].every(e=>e.dataset.neutralStatus==='MEASURED'),all);}
async function measure(page,label,{all=false,math=true}={}){
 await settle(page,all);const p=await page.evaluate(({all,label})=>{
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}};
  const base=all?'.construction-lesson-reading':'.construction-lesson-stage';
  return{label,width:innerWidth,pageWidth:document.documentElement.scrollWidth,headers:document.querySelectorAll('h1').length,panels:document.querySelectorAll('[data-active-part-id]').length,memos:document.querySelectorAll('[data-certified-memo]').length,
   formulas:[...document.querySelectorAll(base+' .nested-math-shell')].map(e=>({id:e.id,overflow:e.dataset.layoutOverflow,geometry:window.measureNestedMathDOM(e),equationTag:window.collectTag(e),font:getComputedStyle(e).fontSize})),
   textSlots:[...document.querySelectorAll(base+' [data-text-part-id]')].map(e=>({id:e.dataset.textPartId,button:e.tagName==='BUTTON',rect:rect(e),state:e.dataset.slotState})),
   editable:[...document.querySelectorAll(base+' [data-editable="true"]')].map(e=>({id:e.dataset.partKey??e.dataset.textPartId,rect:rect(e)}))};
 },{all,label});
 assert(p.pageWidth<=p.width+1,label+' PAGE_OVERFLOW');assert.equal(p.headers,1,label+' header');assert(p.panels<=1,label+' choice panel');assert.equal(p.memos,0,label+' duplicate memo');
 const axes=new Map();
 if(math)for(const f of p.formulas){geometryCount++;assert.equal(f.overflow,'false',label+' overflow '+f.id);assert.equal(f.font,'18px',label+' font '+f.id);const check=checkNestedMeasurements(f.geometry);assert.equal(check.status,'PASS',label+' '+f.id+' '+JSON.stringify(check.findings));
  const owner=compiled.nodeDesign.find(n=>n.rows.some(r=>(all?'history-':'')+r.id===f.id)||n.rows.some(r=>r.id===f.id));const row=owner?.rows.find(r=>(all?'history-':'')+r.id===f.id||r.id===f.id);
  // Every actually displayed tag is checked independently; metadata binds its content.
  if(f.equationTag){const expected=owner?[owner.equationNumber,...(owner.numberAliases??[])].join(' / '):undefined;assert.equal(f.equationTag.label,'('+expected+')',label+' tag label');const tag=checkEquationTag(f,f.equationTag.label);assert.equal(tag.status,'PASS',label+' '+f.id+' TAG '+JSON.stringify(tag.findings));}
  const neutralKey=label.replace(/:(initial|wrong:.*|correct)$/,'')+':'+f.id,first=neutralStates.get(neutralKey);if(!first)neutralStates.set(neutralKey,f.geometry);else{for(const dim of ['width','height'])assert(Math.abs(f.geometry.frame[dim]-first.frame[dim])<=1,label+' STATE_FRAME '+f.id+' '+dim);for(const slot of f.geometry.slots){const old=first.slots.find(s=>s.id===slot.id);if(old)for(const dim of ['x','y'])assert(Math.abs((slot.rect[dim]-f.geometry.frame[dim])-(old.rect[dim]-first.frame[dim]))<=1,label+' STATE_SLOT_ANCHOR '+f.id+' '+slot.id+' '+dim);}}
  const a=f.geometry.groupAlignment;if(a?.status==='ALIGNED'){const xs=axes.get(a.groupId)||[];xs.push(a.relationX);axes.set(a.groupId,xs);}}
 for(const [group,xs]of axes)assert(Math.max(...xs)-Math.min(...xs)<=1,label+' GROUP_AXIS '+group);
 for(const t of p.textSlots)if(t.button)assert(t.rect.width>=43.9&&t.rect.height>=43.9,label+' TEXT_HIT '+t.id);
 for(const t of p.editable)assert(t.rect.width>=43.9&&t.rect.height>=43.9,label+' EDITABLE_HIT '+t.id);
 stateCount++;packets.push(p);
}
async function nextIfNeeded(page){if(!await page.locator('[data-active-part-id]').count()){const next=page.getByTestId('math-textbook-next-stage');if(await next.count()){await next.click();await settle(page);}}}
async function choose(page,p,value=p.expected){const a=page.locator('[data-active-part-id]');await a.waitFor();assert.equal(await a.getAttribute('data-active-part-id'),p.id);await a.locator('button[data-choice-value]').evaluateAll((bs,v)=>{const b=bs.find(b=>b.dataset.choiceValue===v);if(!b)throw Error('CHOICE_MISSING '+v);b.click()},value);}
async function shot(page,width,nodeId,state,whole=false){await settle(page);const filepath=out+'/'+width+'-'+nodeId+'-'+state+'.png';await page.evaluate(()=>window.scrollTo(0,0));if(whole)await page.screenshot({path:filepath,fullPage:true});else{const n=page.locator('[data-node-id="'+nodeId+'"]');const b=await n.boundingBox();await page.setViewportSize({width,height:Math.max(900,Math.ceil(b.height)+180)});await n.screenshot({path:filepath});await page.setViewportSize({width,height:900});}screenshots.push({width,nodeId,state,path:filepath,sha256:sha(fs.readFileSync(filepath))});}
try{
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900}});page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push({width,message:e.message}));page.on('response',r=>{if(r.status()>=400)httpErrors.push({width,url:r.url(),status:r.status()})});page.on('requestfailed',r=>networkFailures.push({width,url:r.url(),failure:r.failure()?.errorText}));
  await page.goto(url+'#/learning/textbook/'+compiled.unitId);await page.waitForSelector('[data-active-part-id]');await install(page);let wrongs=0;const keys={slotFocus:false,Enter:false,Space:false,Escape:false};
  for(const node of compiled.nodeDesign)for(const key of node.partOrder){const p=node.parts.find(p=>p.key===key);await nextIfNeeded(page);if(!targetIds.has(node.nodeId)){await choose(page,p);continue;}assert.equal(await page.locator('[data-active-part-id]').getAttribute('data-active-part-id'),p.id);await measure(page,width+':'+p.id+':initial');
   if(targetIds.has(node.nodeId))await shot(page,width,node.nodeId,key+'-initial');
   const slot=page.locator('[data-node-id="'+node.nodeId+'"] [data-editable="true"]').first();await slot.focus();await slot.press('Enter');assert(await page.evaluate(()=>Boolean(document.activeElement?.closest('[data-active-part-id]')&&document.activeElement?.hasAttribute('data-choice-value'))),p.id+' keyboard focus');keys.slotFocus=true;await page.keyboard.press('Escape');assert.equal(await page.locator('[data-active-part-id]').getAttribute('data-active-part-id'),p.id);keys.Escape=true;
   for(const [i,c]of p.choices.filter(c=>c.value!==p.expected).entries()){if(i<2){const handle=page.locator('[data-active-part-id] [data-choice-value='+JSON.stringify(c.value)+']');await handle.focus();await handle.press(i===0?'Enter':'Space');keys[i===0?'Enter':'Space']=true;}else await choose(page,p,c.value);assert.equal(await page.locator('[data-active-part-id]').getAttribute('data-active-part-id'),p.id,'wrong advanced');assert((await page.locator('[data-active-part-id] [role=status]').innerText()).trim(),p.id+' wrong feedback');await measure(page,width+':'+p.id+':wrong:'+c.value);if(i===0&&targetIds.has(node.nodeId))await shot(page,width,node.nodeId,key+'-wrong');wrongs++;}
   await choose(page,p);await measure(page,width+':'+p.id+':correct');if(targetIds.has(node.nodeId))await shot(page,width,node.nodeId,key+'-correct');
   if(key===node.partOrder.at(-1)&&targetIds.has(node.nodeId))await shot(page,width,node.nodeId,'stage-completed',true);
  }
  // Auto-only trailing node/stage is still rendered after the last answer.
  assert(await page.getByTestId('textbook-unit-complete').count(),'completion');await page.reload();await page.getByTestId('textbook-unit-complete').waitFor();await install(page);await measure(page,width+':completed-reload');
  await page.getByRole('button',{name:'前の段階を見る',exact:true}).click();await page.locator('[data-readonly-history] details').evaluateAll(es=>es.forEach(e=>e.open=true));await settle(page,true);assert.equal(await page.locator('[data-readonly-history] button:not(:disabled)').count(),0);await measure(page,width+':history',{all:true});
  const before=await page.evaluate(()=>JSON.stringify({...localStorage}));await page.goto(url+'#/learning/textbook/'+compiled.unitId+'?version='+oldRevision);await page.getByTestId('n0910-archive-page').waitFor();const oldActive=page.locator('[data-active-part-id]'),oldId=await oldActive.count()?await oldActive.getAttribute('data-active-part-id'):null;if(oldId){const oldp=oldCompiled.nodeDesign.flatMap(n=>n.parts).find(p=>p.id===oldId);await choose(page,oldp);}assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),before,'old trial changed storage');
  await page.goto(url+'#/learning/textbook/'+compiled.unitId);await page.getByTestId('textbook-unit-complete').waitFor();const beforeCancel=await page.evaluate(()=>JSON.stringify({...localStorage}));page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'この単元を最初から',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),beforeCancel,'reset cancel changed');page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'この単元を最初から',exact:true}).click();await page.waitForSelector('[data-active-part-id]');assert.equal(await page.locator('[data-active-part-id]').getAttribute('data-active-part-id'),expectedParts[0].id);await page.reload();await page.waitForSelector('[data-active-part-id]');assert.equal(await page.locator('[data-active-part-id]').getAttribute('data-active-part-id'),expectedParts[0].id);
  await page.goto(url+'#/learning/textbook/math-numbers-expressions-n08');await page.getByTestId('textbook-reading-flow').waitFor();await page.evaluate(()=>document.fonts.ready);assert.equal(await page.getByRole('button',{name:'この単元を最初から',exact:true}).count(),1);await page.screenshot({path:out+'/'+width+'-n08-reference.png',fullPage:true});await page.goto(url+'#/learning/textbook/math-numbers-expressions-n11');await page.getByTestId('textbook-reading-flow').waitFor();await page.evaluate(()=>document.fonts.ready);assert(!await page.locator('[role=alert]').count());
  lifecycle.push({width,completedReload:true,readonlyHistory:true,oldTrialStorageUnchanged:true,resetCancel:true,resetReload:true,n08:true,n11:true,keyboard:keys});results.push({width,parts:expectedParts.length,wrongCandidates:wrongs});await page.close();console.log('PASS',code,width,'parts',expectedParts.length,'wrong',wrongs);
 }
}catch(e){failures.push({message:e.message,stack:e.stack});console.error(e.stack);}
finally{await browser.close();server.kill();for(const f of networkFailures)if(!f.failure?.includes('ERR_ABORTED'))failures.push({message:'NETWORK_FAILURE '+f.url+' '+f.failure});const sourceManifestAfter=manifest();if(JSON.stringify(sourceManifest)!==JSON.stringify(sourceManifestAfter)||sourceSHA!==execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim())failures.push({message:'SOURCE_CHANGED_DURING_RUN'});for(const e of httpErrors)failures.push({message:'HTTP_ERROR '+e.status+' '+e.url});const result={status:failures.length||errors.length?'FAIL':'PASS',sourceSHA,compiledHash:compiled.compiledHash,oldCompiledHash:oldCompiled.compiledHash,code,widths,results,protectedNodes,changedNodes:changes,addedPartIds:addedIds,stateCount,geometryCount,lifecycle,failures,errors,networkFailures,httpErrors,fontChecks,screenshots,sourceManifest,sourceManifestAfter,scriptHash};fs.writeFileSync(out+'/RESULT.json',JSON.stringify(result,null,2));fs.writeFileSync(out+'/MEASUREMENTS.json',JSON.stringify(packets));console.log(JSON.stringify({status:result.status,output:out,stateCount,geometryCount,results,failures:failures.map(f=>f.message),errors}));if(failures.length||errors.length)process.exitCode=1;}
