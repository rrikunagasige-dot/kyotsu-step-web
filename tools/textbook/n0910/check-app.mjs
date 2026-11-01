import{spawn,execFileSync}from'node:child_process';import{createRequire}from'node:module';import fs from'node:fs';import{createHash}from'node:crypto';
const root=process.cwd(),require=createRequire(root+'/package.json'),{chromium}=require('playwright');
const {checkNestedMeasurements}=await import(root+'/tools/textbook/layout/nested-measurements.mjs');
const {checkEquationTag}=await import(root+'/tools/textbook/layout/equation-tag-measurements.mjs');
const sourceSHA=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const width=Number(process.argv[2]??320), code=process.argv[3]??'n09';
const port=45000+width*2+(code==='n10'?1:0),listen='http://127.0.0.1:'+port+'/kyotsu-step-web/';
const compiled=JSON.parse(fs.readFileSync(root+'/src/data/textbook/math/numbers/'+code+'ConstructionCompiled.json'));
const sourcePaths=execFileSync('git',['ls-files','src','public','package.json','pnpm-lock.yaml','tools/textbook','workflow','work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json'],{cwd:root,encoding:'utf8'}).trim().split('\n').sort();const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');const sourceManifest=Object.fromEntries(sourcePaths.map(p=>[p,hash(root+'/'+p)]));const scriptHash=hash(new URL(import.meta.url));
const output='/tmp/n0910-app-'+code+'-'+width+'-'+Date.now();fs.mkdirSync(output,{recursive:true});
const server=spawn(root+'/node_modules/.bin/vite',['--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:root,stdio:'ignore'});for(let i=0;i<80;i++){try{if((await fetch(listen)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))};
const browser=await chromium.launch({executablePath:process.env.KYOTSU_CHROMIUM_PATH??'/tmp/kyotsu-browser-20261030/runtime/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote','--disable-gpu'],env:{...process.env,FONTCONFIG_PATH:'/etc/fonts'}});
const browserVersion=browser.version();
const page=await browser.newPage({viewport:{width,height:900}}),errors=[],failures=[],packets=[];page.on('pageerror',e=>errors.push(e.message));
const url=listen+'#/learning/textbook/'+compiled.unitId;
const active=page.locator('[data-active-part-id]');
const expectedParts=compiled.nodeDesign.flatMap(n=>n.parts);
const stageLastParts=new Map(compiled.stages.map(stage=>[stage.id,compiled.nodeDesign.filter(n=>n.stageId===stage.id).flatMap(n=>n.parts).at(-1)?.id]));
const auxiliaryPackets=[];
const keyboardChecks={slotFocus:false,Enter:false,Space:false,Escape:false};
const lifecycle={completed:false,reloaded:false,historyReadonly:false,resetReloaded:false};
async function capture(part,state,selectedValue){
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.querySelectorAll('.construction-lesson-stage:last-of-type .nested-math-shell')].every(e=>e.dataset.neutralStatus==='MEASURED'));
 const result=await page.evaluate(({part,state,selectedValue})=>{
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
  const node=document.querySelector('[data-node-id="'+part.split('::')[0]+'"]');
  const formulas=[...node.querySelectorAll('.nested-math-shell')].map(window.collectNestedFormula);
  const textSlots=[...node.querySelectorAll('[data-text-part-id]')].map(e=>({rowId:e.closest('[data-text-row-id]').dataset.textRowId,id:e.dataset.textPartId,key:e.dataset.textPartKey,value:e.dataset.textPartValue,state:e.dataset.slotState,editable:e.dataset.editable==='true',button:e.tagName==='BUTTON',rect:rect(e)}));
  return{part,state,selectedValue,formulas,textSlots,viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,readerWidth:document.querySelector('.construction-lesson-reading').getBoundingClientRect().width};
 },{part,state,selectedValue});
 packets.push(result);
 for(const f of result.formulas){const number=checkEquationTag(f,f.equationTag?.label);if(number.status!=='PASS')failures.push({part,state,rule:'EQUATION_TAG',id:f.id,findings:number.findings,tag:f.equationTag});const verified=checkNestedMeasurements(f.geometry);if(verified.status!=='PASS')failures.push({part,state,rule:'NESTED_GEOMETRY_VALIDATOR',id:f.id,findings:verified.findings});if(f.geometry.status!=='PASS')failures.push({part,state,rule:'STRUCTURE_LINE_COLLISION',id:f.id,collisions:f.geometry.collisions});if(f.overflow==='true'||f.formula.width>f.rect.width+1)failures.push({part,state,rule:'FORMULA_WIDTH',id:f.id,available:f.rect.width,actual:f.formula.width});if(f.font!=='18px')failures.push({part,state,rule:'FONT',id:f.id,font:f.font});for(const s of f.slots)if(s.rect.width<43.9||s.rect.height<43.9)failures.push({part,state,rule:'HIT_SIZE',id:f.id,key:s.key,rect:s.rect});}
 for(const t of result.textSlots)if(t.button&&(t.rect.width<43.9||t.rect.height<43.9))failures.push({part,state,rule:'TEXT_HIT_SIZE',id:t.id,rect:t.rect});
 if(result.pageWidth>width+1)failures.push({part,state,rule:'PAGE_OVERFLOW',actual:result.pageWidth});
 if(failures.length)throw Error('MEASUREMENT_FAILED '+part+':'+state);
}
async function installCollector(){await page.evaluate(async()=>{window.measureNestedMathDOM=(await import('/kyotsu-step-web/src/components/textbook/nestedMathGeometry.ts')).measureNestedMathDOM;window.collectEquationTag=(shell,geometry)=>{
 const row=shell.closest('.construction-lesson-math-row'),tag=row?.querySelector(':scope > .construction-lesson-equation-number');if(!tag)return null;
 const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}};
 const formula=shell.querySelector('.nested-math-formula'),gathered=Boolean(shell.dataset.rootBreakPath),table=gathered?formula.querySelector('.katex-html > .base > .mord > .mtable'):null;
 const cells=table?[...table.querySelectorAll(':scope > .col-align-c > .vlist-t > .vlist-r > .vlist > span')].map(e=>e.querySelector(':scope > .mord')).filter(Boolean):[...formula.querySelectorAll('.katex-html > .base')];
 if(!cells.length||gathered&&!table)throw Error('NUMBER_ROOT_BASELINE_UNVERIFIED');
 const baselines=cells.map(cell=>{const zero=document.createElement('i');zero.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline';cell.append(zero);const y=zero.getBoundingClientRect().top;zero.remove();return y;});
 const baseline=tag.querySelector('[data-number-baseline]').getBoundingClientRect().top,style=getComputedStyle(tag),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw Error('NUMBER_FONT_INK_UNVERIFIED');ctx.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
 const text=[...tag.childNodes].find(n=>n.nodeType===Node.TEXT_NODE),range=document.createRange();range.selectNodeContents(text);const start=range.getBoundingClientRect(),metrics=ctx.measureText(tag.textContent.trim());
 return{label:tag.textContent.trim(),font:style.fontSize,placement:row.dataset.numberPlacement,rect:rect(tag),ink:{x:start.left-metrics.actualBoundingBoxLeft,y:baseline-metrics.actualBoundingBoxAscent,width:metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight,height:metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent},baseline,finalMathBaseline:Math.max(...baselines),baselineSource:gathered?'zero-inline-root-row':'zero-inline-root-base'};
};window.collectNestedFormula=e=>{const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};const geometry=window.measureNestedMathDOM(e);return ({geometry,equationTag:window.collectEquationTag(e,geometry),mode:e.dataset.nestedRenderMode,template:e.querySelector('.nested-math-formula').dataset.compiledTemplate,id:e.id,rect:rect(e),formula:rect(e.querySelector('.nested-math-formula')),status:e.dataset.neutralStatus,overflow:e.dataset.layoutOverflow,font:getComputedStyle(e).fontSize,slots:[...e.querySelectorAll('[data-part-key]')].map(s=>({key:s.dataset.partKey,state:s.dataset.slotState,rect:rect(s)}))});};});}
async function captureAuxiliary(kind){
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.querySelectorAll('.construction-lesson-reading .nested-math-shell')].every(e=>e.dataset.neutralStatus==='MEASURED'));
 const ids=compiled.nodeDesign.filter(n=>!n.parts.length).map(n=>n.nodeId);
 const packet=await page.evaluate(({kind,ids})=>({kind,viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,formulas:kind==='history'?[...document.querySelectorAll('[data-readonly-history] .nested-math-shell')].map(window.collectNestedFormula):ids.flatMap(id=>[...document.querySelector('[data-node-id="'+id+'"]')?.querySelectorAll('.nested-math-shell')??[]].map(window.collectNestedFormula))}),{kind,ids});
 auxiliaryPackets.push(packet);
 for(const f of packet.formulas){const number=checkEquationTag(f,f.equationTag?.label);if(number.status!=='PASS')failures.push({rule:'AUXILIARY_EQUATION_TAG',kind,id:f.id,findings:number.findings});const v=checkNestedMeasurements(f.geometry);if(v.status!=='PASS'||f.geometry.status!=='PASS'||f.font!=='18px'||f.status!=='MEASURED'||f.overflow==='true')failures.push({rule:'AUXILIARY_GEOMETRY',kind,id:f.id,findings:v.findings});}
}
try{
 await page.goto(url,{waitUntil:'networkidle'});await active.waitFor({timeout:20000});await installCollector();
 for(const part of expectedParts){
  const id=await active.getAttribute('data-active-part-id');if(id!==part.id)throw Error('FRONTIER '+id+' expected '+part.id);
  await capture(part.id,'initial');
  const control=page.locator('[data-node-id='+JSON.stringify(part.id.split('::')[0])+'] [data-editable="true"]').first();
  await control.focus();await control.press('Enter');
  if(!await page.evaluate(()=>Boolean(document.activeElement?.closest('.construction-lesson-choice-panel')&&document.activeElement?.hasAttribute('data-choice-value'))))throw Error('SLOT_FOCUS');keyboardChecks.slotFocus=true;
  await page.keyboard.press('Escape');if(await active.getAttribute('data-active-part-id')!==part.id)throw Error('ESCAPE_ADVANCED');keyboardChecks.Escape=true;
  for(const c of part.choices.filter(c=>c.value!==part.expected)){
   const choice=page.locator('[data-choice-value='+JSON.stringify(c.value)+']');if(c===part.choices.filter(c=>c.value!==part.expected)[0]){await choice.focus();await choice.press('Enter');keyboardChecks.Enter=true}else if(c===part.choices.filter(c=>c.value!==part.expected)[1]){await choice.focus();await choice.press('Space');keyboardChecks.Space=true}else await choice.click();
   if(await active.getAttribute('data-active-part-id')!==part.id)throw Error('WRONG_ADVANCED '+part.id);
   await capture(part.id,'wrong',c.value);
  }
  await page.locator('[data-choice-value='+JSON.stringify(part.expected)+']').click();
  await capture(part.id,'filled',part.expected);if(expectedParts.indexOf(part)%10===0)console.log(JSON.stringify({progress:part.id,width,code}));
  if([320,1440].includes(width)){const stageId=compiled.nodeDesign.find(n=>n.parts.some(p=>p.id===part.id)).stageId;if(stageLastParts.get(stageId)===part.id)await page.locator('[data-stage-id='+JSON.stringify(stageId)+']').screenshot({path:output+'/stage-'+stageId+'.png'});}
  if(['n09-07::sign','n09-p001-q08-left-square::L3','n10-q11-formula::middleSign','n10-q21-expand::Q'].includes(part.id))await page.locator('[data-node-id="'+part.id.split('::')[0]+'"]').screenshot({path:output+'/'+part.id.replace(/:/g,'-')+'.png'});
 }
 if(await active.count())throw Error('NOT_COMPLETED');lifecycle.completed=true;
 await page.reload({waitUntil:'networkidle'});await page.waitForSelector('.construction-lesson-reading');if(await active.count())throw Error('COMPLETE_RELOAD_LOST');lifecycle.reloaded=true;await installCollector();await captureAuxiliary('auto');
 await page.getByRole('button',{name:'確定した計算の履歴',exact:true}).click();await page.waitForSelector('[data-readonly-history]');if(await page.locator('[data-readonly-history] button').count())throw Error('EDITABLE_HISTORY');lifecycle.historyReadonly=true;await captureAuxiliary('history');
 await page.getByRole('button',{name:'この版をやり直す',exact:true}).click();await active.waitFor();if(await active.getAttribute('data-active-part-id')!==expectedParts[0].id)throw Error('RESET_FRONTIER');
 await page.reload({waitUntil:'networkidle'});await active.waitFor();if(await active.getAttribute('data-active-part-id')!==expectedParts[0].id)throw Error('RESET_RELOAD');lifecycle.resetReloaded=true;
 await page.screenshot({path:output+'/reset.png',fullPage:true});
}catch(e){failures.push({rule:'EXCEPTION',message:e.message});await page.screenshot({path:output+'/failure.png',fullPage:true}).catch(()=>{});}
finally{await browser.close();server.kill();const groups=new Map();for(const p of packets)for(const f of p.formulas){const key=p.part+':'+f.id+':'+f.mode;const first=groups.get(key);if(!first)groups.set(key,f);else if(f.mode==='interactive'){for(const dim of ['width','height'])if(Math.abs(f.formula[dim]-first.formula[dim])>1)failures.push({rule:'STATE_FRAME_CHANGED',part:p.part,id:f.id,dim});for(const slot of f.slots){const before=first.slots.find(x=>x.key===slot.key);if(before)for(const dim of ['x','y'])if(Math.abs((slot.rect[dim]-f.formula[dim])-(before.rect[dim]-first.formula[dim]))>1)failures.push({rule:'STATE_ANCHOR_CHANGED',part:p.part,id:f.id,key:slot.key,dim});}}}
const sourceManifestAfter=Object.fromEntries(sourcePaths.map(p=>[p,hash(root+'/'+p)]));if(sourceSHA!==execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()||JSON.stringify(sourceManifest)!==JSON.stringify(sourceManifestAfter)||scriptHash!==hash(new URL(import.meta.url)))failures.push({rule:'SOURCE_CHANGED_DURING_RUN'});const result={sourceSHA,port,browserVersion,nodeVersion:process.version,dependencyVersions:{katex:require('katex/package.json').version,playwright:require('playwright/package.json').version},fontSha256:hash('/root/.fonts/NotoSansJP-Regular.otf'),sourceManifest,sourceManifestAfter,scriptHash,width,code,compiledHash:compiled.compiledHash,lifecycle,keyboardChecks,packets,auxiliaryPackets,errors,failures};fs.writeFileSync(output+'/result.json',JSON.stringify(result,null,2));console.log(JSON.stringify({width,code,packetCount:packets.length,errors,failures:failures.slice(0,25),failureCount:failures.length,output}));process.exitCode=errors.length||failures.length?1:0;}
