import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const SOURCE='db99a485f857b1aefa7fb738456f36a830514158';
const STORAGE='kyotsu-step-gate3-math-20261023';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const request=(url,options={})=>fetch(url,{...options,signal:AbortSignal.timeout(30000)});
const required={
  "package.json": "7e65e33d4a9679015258b7700320bd7b426648868ea60ca01f770e5b36d6858e",
  "pnpm-lock.yaml": "ece56e44c910c8282e1ebd41b5cfe4402627721c3a48e56651e41e571b03d006",
  "src/components/textbook/ConstructionLessonReadingFlow.tsx": "32419cda3ebca2df261e4c45b79e6e7fa62ac5e3ae4f3139f7539d48be54ff6a",
  "src/components/textbook/NestedConstructionMath.tsx": "5d86eb5112a2f70f27d7e243c362debf8f0c2ab5f3a2664e2948bc194aac7cdf",
  "src/components/textbook/nestedMathGeometry.ts": "bbbde7387e06ce1c411698536fc2c3c12d6baadab0210c903c318fa23d030ab6",
  "src/components/textbook/nestedMathTemplate.ts": "d32a6e94dda602cef4b0d886ef10c778e031d0ce10d1bb3fef1c520a93efa566",
  "src/domain/nestedLesson.ts": "b091b49f1b370db7e2d436c70dfb9a53e897dafb526d609e996e3cd22f01ba12",
  "src/domain/nestedMigration.ts": "c32edae2fe60e7f6c969459398f82413bbfc9553f4fbe0797c34e028ca22e818",
  "src/domain/nestedLessonStorage.ts": "892b205b7f3f47fbca1a3c13cff98fbd42aadb32fe844329708fbb46a21099cc",
  "src/domain/textbookSchema.ts": "d0c9b6db6b9864c81aeb345475979a37107a83b8cd9fa41c24134ca101739d19",
  "src/pages/N0910RevisionPage.tsx": "2a9149365944ffbe2c1b06b194b5adcf175824fdc524deddccba20332d8aca5f",
  "src/pages/N0910ArchivePage.tsx": "570d52b983ae4f3d1d95c75be8e1aa7e446b77abc93bd7c49de5ac4b44dd05ad",
  "src/pages/TextbookUnitPage.tsx": "babfb270efed877a4d199849aec8665d608fdb1966b1b04c1ffa57df4b8d10c2",
  "src/data/textbook/math/numbers/n09ConstructionCompiled.json": "c9a881c4d4a27dfc9ebcd218fa25aeb094d02486d5cc4da3bcedae099f6fc05b",
  "src/data/textbook/math/numbers/n10ConstructionCompiled.json": "969b3fe063f8ea21f35904812d06b1fd4842961912077811377bb384f92cd41e",
  "src/data/textbook/math/numbers/n0910CandidatePins.json": "ec7c360a418be66bbe2a73f653f291390715a2842e32b535f7e16436afe1af4b",
  "src/components/textbook/construction-lesson-reading.css": "6da50ce94d45e0a06a3b9703239870a7c73f4fd3d49e1313bfda1f6e173ce279",
  "src/domain/compiledNestedLesson.ts": "b1fd6c30f5966bc5c93f45358d35f0130b7eae016b6835cacb30bed5be2ae06a",
  "src/data/textbook/math/numbers/n09Revision5.json": "d517c524d835149c504188228b3da6f898abc60e597828b42d2807a29b436fe8",
  "src/data/textbook/math/numbers/n10Revision4.json": "7b36a44d76ba627a192cdcbae3751715a6c628d6a1d2ba94d2bc87a6e7f1d9a2",
  "src/data/textbook/math/numbers/n09Lesson.ts": "83897db5c7cc856cd07cefe9682ae9dd60f7b3a925303fb2d79df7521dfe2771",
  "src/data/textbook/math/numbers/n10Lesson.ts": "6437238658b084ee69df9d9267c6b1055232e16b7fcdd868bc8842d0419d9146",
  "src/data/textbook/math/numbers/n09ConstructionCompiledR4.json": "b36753fa12a5aca2523f510075918694db8b0afc1aa35bad646477f45f9015bb",
  "src/data/textbook/math/numbers/n10ConstructionCompiledR3.json": "b271f90586aa4c5e83dc9bcdc9e3752a5cb244c62a064d4aa2a713760293f94d",
  "src/data/textbook/math/numbers/n10ConstructionCompiledPilotR4.json": "0152153cf8f11d38ab099003b655527e151a0a403cb5e967138a51d73b1c9ecb"
};
for(const [p,h] of Object.entries(required))if(sha(fs.readFileSync(p))!==h)throw Error('SOURCE_BYTES_MISMATCH '+p);
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==SOURCE)throw Error('SOURCE_COMMIT_MISMATCH');
const units=['n09','n10'].map(code=>({code,compiled:read('src/data/textbook/math/numbers/'+code+'ConstructionCompiled.json')}));
if(process.argv[2]==='manifest'){
 const old=read('dist/release.json');if(old.sourceSHA!==SOURCE||old.storageKey!==STORAGE||old.activeN08Revision!==7)throw Error('RETAINED_RELEASE_MISMATCH');
 const files={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.isFile()&&p!=='dist/w046-release.json')files[p.slice(5)]=sha(fs.readFileSync(p));}}walk('dist');
 const m={work:'W-MATH-046',sourceSHA:SOURCE,publisherSHA:process.env.GITHUB_SHA??null,storageKey:STORAGE,approvalScope:'P-W046-UX-03 H01-H17 and N08-based layout; separate deployment approval required',userAcceptance:false,Gold:false,fit:false,requiredSourceHashes:required,retainedN08Revision:7,retainedN11PlanHash:old.retainedN11,units:units.map(({code,compiled:c})=>({code,id:c.unitId,revision:c.toRevision,previousRevision:c.fromRevision,compiledHash:c.compiledHash})),files};
 fs.writeFileSync('dist/w046-release.json',JSON.stringify(m,null,2)+'\n');console.log('W046_RELEASE_MANIFEST_OK');
}else if(process.argv[2]==='verify'){
 const rawBase=process.env.APP_URL;if(!rawBase||!/^https?:\/\//.test(rawBase))throw Error('APP_URL_REQUIRED');const base=rawBase.endsWith('/')?rawBase:rawBase+'/';
 const expected=fs.readFileSync('dist/w046-release.json'),manifest=JSON.parse(expected),out=process.env.EVIDENCE_DIR??'/tmp/w046-release-check';fs.mkdirSync(out,{recursive:true});
 const result={sourceSHA:SOURCE,base,cases:[],filesVerified:0,userAcceptance:false};
 let matched=false,last='';for(let i=0;i<30;i++){try{const r=await request(new URL('w046-release.json?source='+SOURCE,base),{cache:'no-store'});if(r.ok&&sha(Buffer.from(await r.arrayBuffer()))===sha(expected)){matched=true;break;}last='manifest differs';}catch(e){last=String(e);}await new Promise(r=>setTimeout(r,2000));}if(!matched)throw Error('HOST_MANIFEST_MISMATCH '+last);
 for(const [name,h] of Object.entries(manifest.files)){const r=await request(new URL(name,base),{cache:'no-store'});if(!r.ok||sha(Buffer.from(await r.arrayBuffer()))!==h)throw Error('HOST_ASSET_MISMATCH '+name);result.filesVerified++;}
 const require=createRequire(path.resolve('package.json')),{chromium}=require('@playwright/test');const browser=await chromium.launch({headless:true});
 const snapshot=page=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
 const ready=async page=>{await page.locator('.construction-lesson-reading').first().waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.querySelectorAll('.construction-lesson-stage .nested-math-shell')].every(e=>e.dataset.neutralStatus==='MEASURED'));if(await page.locator('[role=alert]').count())throw Error('READER_ALERT');};
 const advanceStage=async page=>{if(!await page.locator('[data-active-part-id]').count()&&await page.getByTestId('math-textbook-next-stage').count()){await page.getByTestId('math-textbook-next-stage').click();await ready(page);}};
 const answer=async(page,p,value)=>{const active=page.locator('[data-active-part-id]');await active.waitFor();if(await active.getAttribute('data-active-part-id')!==p.id)throw Error('FRONTIER_MISMATCH '+p.id);await active.locator('button[data-choice-value]').evaluateAll((buttons,value)=>{const b=buttons.find(b=>b.dataset.choiceValue===value);if(!b)throw Error('CHOICE_MISSING');b.click();},value);await ready(page);};
 const unchanged=(before,after)=>{for(const key of new Set([...Object.keys(before),...Object.keys(after)]))if(after[key]!==before[key])throw Error('ARCHIVE_CHANGED_STORAGE '+key);};
 try{for(const {code,compiled:c}of units)for(const width of [320,390,430,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();const row={code,width,errors:[],networkFailures:[],correct:0,wrong:0};result.cases.push(row);page.on('pageerror',e=>row.errors.push(e.message));page.on('requestfailed',r=>row.networkFailures.push(r.url()));
  const oldSource=read('src/data/textbook/math/numbers/'+code+'ConstructionCompiledR'+c.fromRevision+'.json'),other=units.find(u=>u.code!==code).compiled;
  const protectedLedgers=[other,oldSource].map(l=>{const time=Date.now();return {key:'math-textbook-nested-v1:@scope:'+encodeURIComponent(STORAGE)+':'+l.unitId+':r'+l.toRevision+':'+l.compiledHash,value:JSON.stringify({schemaVersion:'nested-reader-storage/1',ledger:{schemaVersion:'nested-lesson-progress/1',unitId:l.unitId,revision:l.toRevision,compiledHash:l.compiledHash,draft:{},records:{},parents:{},processedEventIds:[],startedAt:time,updatedAt:time}})};});
  await context.addInitScript(entries=>{for(const {key,value}of entries)if(localStorage.getItem(key)===null)localStorage.setItem(key,value);},protectedLedgers);
  try{
   await page.goto(new URL('#/learning/textbook/'+c.unitId,base).href,{waitUntil:'networkidle'});await ready(page);
   if(await page.getByTestId('n0910-revision-page').getAttribute('data-compiled-hash')!==c.compiledHash)throw Error('READER_HASH_MISMATCH');
   const active=page.locator('[data-active-part-id]');
   for(const p of c.nodeDesign.flatMap(n=>n.parts)){
    await advanceStage(page);const wrong=p.choices.find(x=>x.value!==p.expected);
    if(wrong){await answer(page,p,wrong.value);if(await active.getAttribute('data-active-part-id')!==p.id)throw Error('WRONG_ADVANCED '+p.id);row.wrong++;}
    await answer(page,p,p.expected);row.correct++;
    const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,errors:document.querySelectorAll('.katex-error').length,mathOverflow:document.querySelectorAll('.construction-lesson-stage [data-layout-overflow=true]').length}));
    if(layout.overflow||layout.errors||layout.mathOverflow)throw Error('VISIBLE_LAYOUT_FAILURE '+p.id);
   }
   if(await active.count())throw Error('NOT_COMPLETE');await page.getByTestId('textbook-unit-complete').waitFor();
   await page.reload({waitUntil:'networkidle'});await ready(page);if(await active.count())throw Error('RELOAD_LOST_COMPLETION');
   await page.getByRole('button',{name:'前の段階を見る',exact:true}).click();await page.locator('[data-readonly-history]').waitFor();await page.locator('[data-readonly-history] details').evaluateAll(es=>es.forEach(e=>e.open=true));await page.evaluate(()=>document.fonts.ready);
   if(await page.locator('[data-readonly-history] button:not(:disabled)').count())throw Error('HISTORY_EDITABLE');
   await page.screenshot({path:out+'/'+code+'-'+width+'.png',fullPage:true});
   const saved=await snapshot(page),key='math-textbook-nested-v1:@scope:'+encodeURIComponent(STORAGE)+':'+c.unitId+':r'+c.toRevision+':'+c.compiledHash,stored=JSON.parse(saved[key]??'null');
   if(!stored||stored.schemaVersion!=='nested-reader-storage/1'||stored.ledger.unitId!==c.unitId||stored.ledger.revision!==c.toRevision||stored.ledger.compiledHash!==c.compiledHash||Object.keys(saved).some(k=>k==='kyotsu-step-store'||k.startsWith('math-textbook-nested-v1:')&&!k.startsWith('math-textbook-nested-v1:@scope:'+encodeURIComponent(STORAGE)+':')))throw Error('BROWSER_STORAGE_NAMESPACE_OR_BINDING_MISMATCH');row.storageBinding='PASS';
   const fonts=await page.evaluate(()=>({status:document.fonts.status,katex:[...document.fonts].some(f=>f.family.includes('KaTeX_Main')&&f.status==='loaded'),errors:document.querySelectorAll('.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1}));if(fonts.status!=='loaded'||!fonts.katex||fonts.errors||fonts.overflow)throw Error('FONT_OR_PAGE_LAYOUT_FAILURE');row.fontAndPageLayout=fonts;
   // The previous native revision is an isolated reader with its own compiled source.
   const old=read('src/data/textbook/math/numbers/'+code+'ConstructionCompiledR'+c.fromRevision+'.json');
   await page.goto(new URL('#/learning/textbook/'+c.unitId+'?version='+c.fromRevision,base).href,{waitUntil:'networkidle'});await page.getByTestId('n0910-archive-page').waitFor();await ready(page);
   if(await page.getByTestId('n0910-archive-page').getAttribute('data-revision')!==String(c.fromRevision))throw Error('ARCHIVE_REVISION_MISMATCH');
   const id=await active.getAttribute('data-active-part-id').catch(()=>null);if(id){const p=old.nodeDesign.flatMap(n=>n.parts).find(p=>p.id===id);if(!p)throw Error('ARCHIVE_PART_UNKNOWN');await answer(page,p,p.expected);}
   unchanged(saved,await snapshot(page));row.archiveTrialStorageUnchanged='PASS';
   await page.goto(new URL('#/learning/textbook/'+c.unitId,base).href,{waitUntil:'networkidle'});await ready(page);if(await active.count())throw Error('ARCHIVE_CHANGED_CURRENT_PROGRESS');row.archiveNavigationPreservesCompletion='PASS';
   const beforeCancel=await snapshot(page);page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'この単元を最初から',exact:true}).click();if(JSON.stringify(await snapshot(page))!==JSON.stringify(beforeCancel))throw Error('RESET_CANCEL_CHANGED_STORAGE');page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'この単元を最初から',exact:true}).click();await active.waitFor();const first=c.nodeDesign.flatMap(n=>n.parts)[0].id;if(await active.getAttribute('data-active-part-id')!==first)throw Error('RESET_FRONTIER');for(const {key,value}of protectedLedgers)if((await snapshot(page))[key]!==value)throw Error('RESET_CHANGED_PROTECTED_LEDGER '+key);row.resetProtectedLedgers='PASS';await page.reload({waitUntil:'networkidle'});await ready(page);if(await active.getAttribute('data-active-part-id')!==first)throw Error('RESET_RELOAD_FRONTIER');row.resetCancelAndReload='PASS';
   if(row.errors.length||row.networkFailures.length)throw Error('BROWSER_ERRORS');row.status='PASS';
  }catch(e){row.status='FAIL';row.failure=String(e);throw e;}finally{await context.close();fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2));}
 }}finally{await browser.close();fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2));}
 console.log('W046_HOSTED_BYTES_AND_OPERATIONS_PASS');
}else throw Error('Use manifest or verify');
