// Inactive W048 publisher proposal. Source and publisher SHAs are distinct.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const contractPath=path.join(here,'w048-release-contract.json');
const c=JSON.parse(fs.readFileSync(contractPath)), mode=process.argv[2];
const digest=b=>createHash('sha256').update(b).digest('hex'), sha=p=>digest(fs.readFileSync(p));
const work='work/items/W-MATH-048-n1314-source-audit';
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
assert.equal(head,c.sourceSHA,'SOURCE_HEAD_MISMATCH');
assert.equal(process.env.CANDIDATE_SHA,c.sourceSHA,'CANDIDATE_SHA_MISMATCH');
assert.equal(process.env.VITE_STORAGE_NAMESPACE,c.storageKey,'EXISTING_STORAGE_NAMESPACE_REQUIRED');
assert.equal(process.env.VITE_BASE_PATH,c.basePath,'EXISTING_BASE_PATH_REQUIRED');
for(const[p,h]of Object.entries({...c.requiredProductHashes,...c.originalFigureHashes,...c.verificationSourceHashes}))assert.equal(sha(p),h,'EXACT_SOURCE_BYTES_MISMATCH '+p);
assert.deepEqual(c.units.map(u=>[u.code,u.revision,u.itemIds.length]),[['n13',5,18],['n14',11,41]]);
assert.equal(sha(path.join(here,'w047-release-contract.json')),c.retainedContractTransition.newW047ContractSHA256,'RETAINED_CONTRACT_TRANSITION_MISMATCH');
const allFiles=()=>{const files={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);assert.ok(!e.isSymbolicLink(),'DIST_SYMLINK_REJECTED');if(e.isDirectory())walk(p);else if(e.isFile()&&!['dist/w048-release.json','dist/w050-release.json'].includes(p))files[p.slice(5)]=sha(p);}}walk('dist');return files;};
if(mode==='bytes-only')console.log(JSON.stringify({status:'PASS_EXACT_SOURCE_BYTES_ONLY',sourceSHA:head,nativeGates:c.nativeGateStateAtDraft,publication:false}));
else if(mode==='manifest'){
 assert.ok(!fs.existsSync('dist/w048-release.json'),'CLEAN_DIST_W048_MANIFEST_ALREADY_EXISTS');
 for(const name of ['release.json','w047-release.json','w046-release.json']){const m=JSON.parse(fs.readFileSync('dist/'+name));assert.equal(m.sourceSHA,c.sourceSHA,'RETAINED_MANIFEST_SOURCE '+name);assert.equal(m.storageKey,c.storageKey,'RETAINED_MANIFEST_STORAGE '+name);}
 const m={schemaVersion:'w048-publication-manifest/1',work:'W-MATH-048',sourceSHA:c.sourceSHA,publisherSHA:process.env.GITHUB_SHA??null,storageKey:c.storageKey,basePath:c.basePath,contractSHA256:sha(contractPath),units:c.units,requiredProductHashes:c.requiredProductHashes,originalFigureHashes:c.originalFigureHashes,manifestOrder:c.manifestOrder,userAcceptance:false,Gold:false,fit:false,files:allFiles()};
 assert.ok(/^[a-f0-9]{40}$/.test(m.publisherSHA??''),'ACTUAL_PUBLISHER_SHA_REQUIRED');assert.notEqual(m.publisherSHA,m.sourceSHA,'PUBLISHER_SOURCE_MUST_BE_DISTINCT');
 for(const name of ['release.json','w047-release.json','w046-release.json'])assert.ok(m.files[name]);
 fs.writeFileSync('dist/w048-release.json',JSON.stringify(m,null,2)+'\n');console.log('W048_MANIFEST_CREATED_BEFORE_W050');
}else if(mode==='verify'){
 const base=process.env.APP_URL,out=process.env.EVIDENCE_DIR;assert.ok(base&&/^https?:\/\//.test(base)&&base.endsWith('/'));assert.ok(out&&path.isAbsolute(out),'TEMP_EVIDENCE_OUTSIDE_SOURCE_REQUIRED');
 // Resolve existing ancestors too: a not-yet-created evidence directory under
 // a symlink must not bypass the source-root boundary. This is an instructed
 // output boundary, not a claim of an OS sandbox or concurrent-mutation guard.
 const sourceRoot=fs.realpathSync(process.cwd());
 const realDestination=p=>{let cursor=path.resolve(p);const missing=[];while(!fs.existsSync(cursor)){const parent=path.dirname(cursor);assert.notEqual(parent,cursor,'EVIDENCE_EXISTING_ANCESTOR_REQUIRED');missing.unshift(path.basename(cursor));cursor=parent;}return path.resolve(fs.realpathSync(cursor),...missing);};
 const evidenceRoot=realDestination(out);
 const contains=(parent,child)=>{const relative=path.relative(parent,child);return relative===''||(relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative));};
 const disjoint=(a,b)=>!contains(a,b)&&!contains(b,a);
 assert.ok(disjoint(path.resolve(process.cwd()),path.resolve(out))&&disjoint(sourceRoot,evidenceRoot),'TEMP_EVIDENCE_OUTSIDE_SOURCE_REQUIRED');
 fs.mkdirSync(out,{recursive:true});
 const expected=fs.readFileSync('dist/w048-release.json'),m=JSON.parse(expected);
 assert.equal(m.sourceSHA,c.sourceSHA);assert.equal(m.contractSHA256,sha(contractPath));assert.deepEqual(m.units,c.units);assert.deepEqual(m.files,allFiles(),'DIST_CHANGED_AFTER_FINAL_MANIFEST');
 const result={sourceSHA:c.sourceSHA,publisherSHA:m.publisherSHA,base,status:'RUNNING',filesVerified:0,namespaceChecks:[],scope:'Actual requested app URL; old-revision extension remains a local current-Page fixture.',userAcceptance:false};
 try{
  let matched=false,last='';for(let i=0;i<60;i++){try{const response=await fetch(new URL('w048-release.json?source='+c.sourceSHA,base),{cache:'no-store',signal:AbortSignal.timeout(30000)}),bytes=Buffer.from(await response.arrayBuffer());if(response.ok&&digest(bytes)===digest(expected)){matched=true;break;}last='Complete manifest bytes differ';}catch(e){last=String(e)}await new Promise(r=>setTimeout(r,2000));}assert.ok(matched,'HOST_W048_MANIFEST_NOT_REACHED '+last);
  for(const[p,h]of Object.entries(m.files)){assert.ok(!p.startsWith('/')&&!p.split('/').includes('..'),'UNSAFE_ASSET_PATH');const response=await fetch(new URL(p,base),{cache:'no-store',signal:AbortSignal.timeout(30000)});assert.ok(response.ok,'HOST_ASSET_HTTP '+p);assert.equal(digest(Buffer.from(await response.arrayBuffer())),h,'HOST_ASSET_BYTES '+p);result.filesVerified++;}
  const fixtureOut=path.join(out,'contracts'),browserOut=path.join(out,'browser');
  execFileSync(process.execPath,[path.join(here,'w050-publish-check.mjs'),'w048-current'],{stdio:'inherit',env:{...process.env,EVIDENCE_DIR:fixtureOut}});
  const fixtures=JSON.parse(fs.readFileSync(path.join(fixtureOut,'BROWSER_FIXTURES.json')));assert.deepEqual(fixtures.fixtures.map(f=>f.code),['n13','n14']);
  for(const u of c.units){const f=fixtures.fixtures.find(f=>f.code===u.code);assert.equal(f.unit.revision,u.revision);assert.deepEqual(f.unit.sections[0].items.map(i=>i.id),u.itemIds);assert.deepEqual(f.contract,u.displayContract);}
  const require=createRequire(path.resolve('package.json')),{chromium}=require('@playwright/test'),browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{for(const u of c.units){const context=await browser.newContext({viewport:{width:390,height:1000}}),page=await context.newPage();try{await page.goto(new URL('#'+u.route,base).href);await page.getByTestId('textbook-reading-flow').waitFor();const first=page.locator('button[data-testid^="textbook-item-"]:visible').first(),id=(await first.getAttribute('data-testid')).slice('textbook-item-'.length),f=fixtures.fixtures.find(f=>f.code===u.code),item=f.unit.sections[0].items.find(i=>i.id===id);assert.ok(item);await first.click();await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:item.answer,exact:true}).click();const observed=await page.evaluate(({key,unitId,itemId})=>{const raw=localStorage.getItem(key);return{keys:Object.keys(localStorage),record:raw&&JSON.parse(raw).state?.textbookProgress?.[unitId]?.answers?.[itemId]};},{key:c.storageKey,unitId:u.unitId,itemId:id});assert.ok(observed.record?.resolved,'EXISTING_NAMESPACE_RECORD_REQUIRED');assert.ok(!observed.keys.includes('kyotsu-step-store'),'DEFAULT_NAMESPACE_FALLBACK_REJECTED');result.namespaceChecks.push({code:u.code,itemId:id,storageKey:c.storageKey,recordResolved:true});}finally{await context.close();}}}finally{await browser.close();}
  execFileSync(process.execPath,[work+'/ci-review/capture_current.mjs'],{stdio:'inherit',env:{...process.env,APP_URL:base,W048_FIXTURES:path.join(fixtureOut,'BROWSER_FIXTURES.json'),EVIDENCE_DIR:browserOut},timeout:1500000});
  const summary=JSON.parse(fs.readFileSync(path.join(browserOut,'reports/EXTENDED_SUMMARY.json')));assert.equal(summary.sourceSHA,c.sourceSHA);assert.equal(summary.status,'PASS_ALL_CONFIGURED_EXTENSIONS');assert.deepEqual(summary.appliedUnits,['n13','n14']);
  result.status='PASS_EXACT_HOSTED_BYTES_AND_BOUNDED_OPERATIONS';result.legacyFixtureIsHostedRoute=false;
 }catch(e){result.status='FAIL';result.error={message:e.message,stack:e.stack};throw e;}finally{fs.writeFileSync(path.join(out,'W048_HOST_CONTRACT.json'),JSON.stringify(result,null,2)+'\n');}
}else throw Error('Use bytes-only, manifest or verify');
