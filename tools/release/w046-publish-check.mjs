import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const SOURCE='94dfd300098484473211c22f5de73139b9002717';
const STORAGE='kyotsu-step-gate3-math-20261023';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const request=(url,options={})=>fetch(url,{...options,signal:AbortSignal.timeout(30000)});
const required={
 'package.json':'7e65e33d4a9679015258b7700320bd7b426648868ea60ca01f770e5b36d6858e',
 'pnpm-lock.yaml':'ece56e44c910c8282e1ebd41b5cfe4402627721c3a48e56651e41e571b03d006',
 'src/components/textbook/NestedConstructionMath.tsx':'5d86eb5112a2f70f27d7e243c362debf8f0c2ab5f3a2664e2948bc194aac7cdf',
 'src/components/textbook/nestedMathGeometry.ts':'bbbde7387e06ce1c411698536fc2c3c12d6baadab0210c903c318fa23d030ab6',
 'src/components/textbook/nestedMathTemplate.test.ts':'a25270a0a2372615ad822ae409415ac3f331be7047a06d75f49335c96bfdcb78',
 'src/components/textbook/nestedMathTemplate.ts':'d32a6e94dda602cef4b0d886ef10c778e031d0ce10d1bb3fef1c520a93efa566',
 'src/data/textbook/math/numbers/n09ConstructionCompiled.json':'b36753fa12a5aca2523f510075918694db8b0afc1aa35bad646477f45f9015bb',
 'src/data/textbook/math/numbers/n10ConstructionCompiled.json':'b271f90586aa4c5e83dc9bcdc9e3752a5cb244c62a064d4aa2a713760293f94d'
};
for(const [p,h] of Object.entries(required))if(sha(fs.readFileSync(p))!==h)throw Error('SOURCE_BYTES_MISMATCH '+p);
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==SOURCE)throw Error('SOURCE_COMMIT_MISMATCH');
const units=['n09','n10'].map(code=>({code,compiled:read('src/data/textbook/math/numbers/'+code+'ConstructionCompiled.json')}));
if(process.argv[2]==='manifest'){
 const old=read('dist/release.json');if(old.sourceSHA!==SOURCE||old.storageKey!==STORAGE||old.activeN08Revision!==7)throw Error('RETAINED_RELEASE_MISMATCH');
 const files={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.isFile()&&p!=='dist/w046-release.json')files[p.slice(5)]=sha(fs.readFileSync(p));}}walk('dist');
 const m={work:'W-MATH-046',sourceSHA:SOURCE,publisherSHA:process.env.GITHUB_SHA??null,storageKey:STORAGE,approvalScope:'P-G3-03 nine files + P-LAYOUT-01 four files; deployment approval recorded separately',userAcceptance:false,Gold:false,fit:false,requiredSourceHashes:required,retainedN08Revision:7,retainedN11PlanHash:old.retainedN11,units:units.map(({code,compiled:c})=>({code,id:c.unitId,revision:c.toRevision,previousRevision:c.fromRevision,compiledHash:c.compiledHash})),files};
 fs.writeFileSync('dist/w046-release.json',JSON.stringify(m,null,2)+'\n');console.log('W046_RELEASE_MANIFEST_OK');
}else if(process.argv[2]==='verify'){
 const rawBase=process.env.APP_URL;if(!rawBase||!/^https?:\/\//.test(rawBase))throw Error('APP_URL_REQUIRED');const base=rawBase.endsWith('/')?rawBase:rawBase+'/';
 const expected=fs.readFileSync('dist/w046-release.json'),manifest=JSON.parse(expected),out=process.env.EVIDENCE_DIR??'/tmp/w046-release-check';fs.mkdirSync(out,{recursive:true});
 const result={sourceSHA:SOURCE,base,cases:[],filesVerified:0,userAcceptance:false};
 let matched=false,last='';for(let i=0;i<30;i++){try{const r=await request(new URL('w046-release.json?source='+SOURCE,base),{cache:'no-store'});if(r.ok&&sha(Buffer.from(await r.arrayBuffer()))===sha(expected)){matched=true;break;}last='manifest differs';}catch(e){last=String(e);}await new Promise(r=>setTimeout(r,2000));}if(!matched)throw Error('HOST_MANIFEST_MISMATCH '+last);
 for(const [name,h] of Object.entries(manifest.files)){const r=await request(new URL(name,base),{cache:'no-store'});if(!r.ok||sha(Buffer.from(await r.arrayBuffer()))!==h)throw Error('HOST_ASSET_MISMATCH '+name);result.filesVerified++;}
 const require=createRequire(path.resolve('package.json')),{chromium}=require('@playwright/test');const browser=await chromium.launch({headless:true});
 try{for(const {code,compiled:c}of units)for(const width of [320,390,430,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();const row={code,width,errors:[],networkFailures:[],correct:0,wrong:0};result.cases.push(row);page.on('pageerror',e=>row.errors.push(e.message));page.on('requestfailed',r=>row.networkFailures.push(r.url()));
  try{await page.goto(new URL('#/learning/textbook/'+c.unitId,base).href,{waitUntil:'networkidle'});const active=page.locator('[data-active-part-id]');await active.waitFor({timeout:30000});
   for(const p of c.nodeDesign.flatMap(n=>n.parts)){if(await active.getAttribute('data-active-part-id')!==p.id)throw Error('FRONTIER_MISMATCH '+p.id);const wrong=p.choices.find(x=>x.value!==p.expected);if(wrong){await page.locator('[data-choice-value='+JSON.stringify(wrong.value)+']').click();if(await active.getAttribute('data-active-part-id')!==p.id)throw Error('WRONG_ADVANCED '+p.id);row.wrong++;}await page.locator('[data-choice-value='+JSON.stringify(p.expected)+']').click();row.correct++;}
   if(await active.count())throw Error('NOT_COMPLETE');await page.reload({waitUntil:'networkidle'});await page.locator('.construction-lesson-reading').waitFor();if(await active.count())throw Error('RELOAD_LOST_COMPLETION');await page.getByRole('button',{name:'確定した計算の履歴',exact:true}).click();await page.locator('[data-readonly-history]').waitFor();if(await page.locator('[data-readonly-history] button').count())throw Error('HISTORY_EDITABLE');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:out+'/'+code+'-'+width+'.png',fullPage:true});
   const saved=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));const key='math-textbook-nested-v1:@scope:'+encodeURIComponent(STORAGE)+':'+c.unitId+':r'+c.toRevision+':'+c.compiledHash;const stored=JSON.parse(saved[key]??'null');if(!stored||stored.schemaVersion!=='nested-reader-storage/1'||stored.ledger.unitId!==c.unitId||stored.ledger.revision!==c.toRevision||stored.ledger.compiledHash!==c.compiledHash||Object.keys(saved).some(k=>k==='kyotsu-step-store'||k.startsWith('math-textbook-nested-v1:')&&!k.startsWith('math-textbook-nested-v1:@scope:'+encodeURIComponent(STORAGE)+':')))throw Error('BROWSER_STORAGE_NAMESPACE_OR_BINDING_MISMATCH');row.storageBinding='PASS';
   const fontCheck=await page.evaluate(()=>({status:document.fonts.status,katex:[...document.fonts].some(f=>f.family.includes('KaTeX_Main')&&f.status==='loaded'),errors:document.querySelectorAll('.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1}));if(fontCheck.status!=='loaded'||!fontCheck.katex||fontCheck.errors||fontCheck.overflow)throw Error('FONT_OR_PAGE_LAYOUT_FAILURE');row.fontAndPageLayout=fontCheck;
   await page.goto(new URL('#/learning/textbook/'+c.unitId+'?version='+c.fromRevision,base).href,{waitUntil:'networkidle'});await page.getByTestId('n0910-archive-page').waitFor();if(await page.getByTestId('n0910-archive-page').getAttribute('data-revision')!==String(c.fromRevision))throw Error('ARCHIVE_REVISION_MISMATCH');row.legacyRoute='PASS';
   const legacy=read('src/data/textbook/math/numbers/'+code+'Authored.json').unit.sections[0].items[0];await page.getByTestId('textbook-item-'+legacy.id).click();await page.getByTestId('inline-choice-panel-'+legacy.id).getByRole('button',{name:legacy.answer,exact:true}).click();
   const afterTrial=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));for(const k of new Set([...Object.keys(saved),...Object.keys(afterTrial)])){if(k===STORAGE||k==='kyotsu-step-store'||k.startsWith('math-textbook-nested-v1:'))if(saved[k]!==afterTrial[k])throw Error('ARCHIVE_TRIAL_CHANGED_PERSISTENT_PROGRESS '+k);}row.archiveTrialStorageUnchanged='PASS';
   await page.goto(new URL('#/learning/textbook/'+c.unitId,base).href,{waitUntil:'networkidle'});await page.locator('.construction-lesson-reading').waitFor();if(await page.locator('[data-active-part-id]').count())throw Error('ARCHIVE_CHANGED_CURRENT_PROGRESS');row.archiveNavigationPreservesCompletion='PASS';
   if(row.errors.length||row.networkFailures.length)throw Error('BROWSER_ERRORS');row.status='PASS';
  }catch(e){row.status='FAIL';row.failure=String(e);throw e;}finally{await context.close();fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2));}
 }}finally{await browser.close();fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2));}
 console.log('W046_HOSTED_BYTES_AND_OPERATIONS_PASS');
}else throw Error('Use manifest or verify');
