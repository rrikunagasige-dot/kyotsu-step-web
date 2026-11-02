import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const SOURCE='691d3d160493bf684ca8a31a22476d31d98caeec';
const STORAGE='kyotsu-step-gate3-math-20261023';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const request=(url,options={})=>fetch(url,{...options,signal:AbortSignal.timeout(30000)});
const required={
  "package.json": "7e65e33d4a9679015258b7700320bd7b426648868ea60ca01f770e5b36d6858e",
  "pnpm-lock.yaml": "ece56e44c910c8282e1ebd41b5cfe4402627721c3a48e56651e41e571b03d006",
  "src/components/textbook/ConstructionLessonReadingFlow.tsx": "b19b87e143db7db3f838cc9740745e2d4b2afa236775dbe8a11829c0ef5dd959",
  "src/components/textbook/NestedConstructionMath.tsx": "1bd91a39e382fe73fffd67170fb3fc7be8beec4e36f53002f3f6f14baf6dce9e",
  "src/components/textbook/nestedMathGeometry.ts": "bd1eab249c57ac8308327b1cacc27e928a94b2dcf29d56087d53de12c5c12256",
  "src/components/textbook/nestedMathTemplate.ts": "446db868ff28c0036cb9c0ec1b3954c82fbe495510e418876f28693ab9042633",
  "src/domain/nestedLesson.ts": "090c6c7dd9a24173f5accb9aee48b8786e344933fc8555fe791494af5b919f09",
  "src/domain/nestedMigration.ts": "3c56c6fc4362b68e64629c2729666cc23d2a12f6eb3e7952472e10f583ad5a09",
  "src/domain/nestedLessonStorage.ts": "892b205b7f3f47fbca1a3c13cff98fbd42aadb32fe844329708fbb46a21099cc",
  "src/domain/textbookSchema.ts": "2bf2a9ee9383f6c8069295b11b0069a76d37438fca2e7af81a0105cd14acf114",
  "src/pages/N0910RevisionPage.tsx": "547e81a490a736cba6af8a3b5cf4b766f9be61b667ba8c3af0ca64ea69f8ad49",
  "src/pages/N0910ArchivePage.tsx": "b3c38ef0f66c5322b7aa85deab8f0b578e6a004483214fc0321ec4ddfabd0cd6",
  "src/pages/TextbookUnitPage.tsx": "211ccd4fa65e77c0d30ce5ded8b5e51d4e2c0da8ff8d4d6baeeea822900abed5",
  "src/data/textbook/math/numbers/n09ConstructionCompiled.json": "d0820e4d7d795d9c16bde659fe1b58105f0cb364760d5352dd1e87f654a4dcb3",
  "src/data/textbook/math/numbers/n10ConstructionCompiled.json": "ec66a8247aeeab32684e92868db78a2fff346fb286669a974646c76c0ad75f71",
  "src/data/textbook/math/numbers/n0910CandidatePins.json": "e8b29eaae2c442eaa1cf05cef00d88da21287587fd3027fa12ad8b46a0f7dc1f",
  "src/components/textbook/construction-lesson-reading.css": "c0580689710aebdd458fdef015b70fbc563372f6da6622da4d1bc78cd76f53a0",
  "src/domain/compiledNestedLesson.ts": "a2c64fef736e78e0f12df3c50fe2d8c710b83e0b9cfa96f6f1f8d819a453054d",
  "src/data/textbook/math/numbers/n09Revision5.json": "d517c524d835149c504188228b3da6f898abc60e597828b42d2807a29b436fe8",
  "src/data/textbook/math/numbers/n10Revision4.json": "7b36a44d76ba627a192cdcbae3751715a6c628d6a1d2ba94d2bc87a6e7f1d9a2",
  "src/data/textbook/math/numbers/n09Lesson.ts": "e773703cd34374fc6e72937f432b7f5f23eead43b3d3d3d2abf94b4bb9497d05",
  "src/data/textbook/math/numbers/n10Lesson.ts": "b42fe52ed0e50faa1d39f7dbecbf91bf616babe81e56a57419483e4d642dbacb",
  "src/data/textbook/math/numbers/n09ConstructionCompiledR4.json": "b36753fa12a5aca2523f510075918694db8b0afc1aa35bad646477f45f9015bb",
  "src/data/textbook/math/numbers/n10ConstructionCompiledR3.json": "b271f90586aa4c5e83dc9bcdc9e3752a5cb244c62a064d4aa2a713760293f94d",
  "src/data/textbook/math/numbers/n10ConstructionCompiledPilotR4.json": "0152153cf8f11d38ab099003b655527e151a0a403cb5e967138a51d73b1c9ecb",
  "src/data/textbook/math/numbers/n0910Ux05Migration.json": "87b845986a50202926dfe5ce94b08d17539df57809090dd6bce455282824034a",
  "src/data/textbook/math/numbers/n09Revision8.json": "e5c39dd71989ab5a3bf787ac60f508750084e8d9619ced3d54a0ba8bc9be2962",
  "src/data/textbook/math/numbers/n10Revision5.json": "29be27d2115894da8265b08c07b5ef46524b8856c17608c0b75055e8e0556487",
  "src/data/textbook/math/numbers/n09ConstructionCompiledR5.json": "c9a881c4d4a27dfc9ebcd218fa25aeb094d02486d5cc4da3bcedae099f6fc05b",
  "src/data/textbook/math/numbers/n09ConstructionCompiledR6.json": "5b9db2503a303bab5a1c230bafc23d5d133ce3e641cb85c1a93940d5a174e7b2",
  "src/data/textbook/math/numbers/n09ConstructionCompiledR7.json": "3e5d6899e66522a039ee27247cd7771fda8e73d6101c613f17afa7b5bfb12b49",
  "src/data/textbook/math/numbers/n10ConstructionCompiledR4.json": "969b3fe063f8ea21f35904812d06b1fd4842961912077811377bb384f92cd41e"
};
for(const [p,h] of Object.entries(required))if(sha(fs.readFileSync(p))!==h)throw Error('SOURCE_BYTES_MISMATCH '+p);
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==SOURCE)throw Error('SOURCE_COMMIT_MISMATCH');
const units=['n09','n10'].map(code=>({code,compiled:read('src/data/textbook/math/numbers/'+code+'ConstructionCompiled.json')}));
if(process.argv[2]==='manifest'){
 const old=read('dist/release.json');if(old.sourceSHA!==SOURCE||old.storageKey!==STORAGE||old.activeN08Revision!==7)throw Error('RETAINED_RELEASE_MISMATCH');
 const files={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.isFile()&&p!=='dist/w046-release.json')files[p.slice(5)]=sha(fs.readFileSync(p));}}walk('dist');
 const m={work:'W-MATH-046',sourceSHA:SOURCE,publisherSHA:process.env.GITHUB_SHA??null,storageKey:STORAGE,approvalScope:'P-W046-UX-05; representative visual accepted, remaining 23 CHANGE; separate deployment approval required',userAcceptance:false,Gold:false,fit:false,requiredSourceHashes:required,retainedN08Revision:7,retainedN11PlanHash:old.retainedN11,units:units.map(({code,compiled:c})=>({code,id:c.unitId,revision:c.toRevision,previousRevision:c.fromRevision,compiledHash:c.compiledHash})),files};
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
 const advanceStage=async page=>{let guard=0;while(!await page.locator('[data-active-part-id]').count()&&await page.getByTestId('math-textbook-next-stage').count()){if(++guard>100)throw Error('STAGE_ADVANCE_LOOP');await page.getByTestId('math-textbook-next-stage').click();await ready(page);}};
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
   await advanceStage(page);if(await active.count())throw Error('NOT_COMPLETE');await page.getByTestId('textbook-unit-complete').waitFor();
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
