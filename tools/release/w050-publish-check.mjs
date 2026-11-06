// W050 publisher proposal only. It never edits checked-out product or old receipts.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const contractPath=path.join(here,'w050-release-contract.json');
const c=JSON.parse(fs.readFileSync(contractPath)), mode=process.argv[2];
const hash=b=>createHash('sha256').update(b).digest('hex'),sha=p=>hash(fs.readFileSync(p));
const work='work/items/W-MATH-050-n0107-layout-prose';
function bytes(){
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),c.sourceSHA,'EXACT_W050_MATERIAL_HEAD');
 assert.equal(process.env.CANDIDATE_SHA,c.sourceSHA);
 assert.equal(process.env.VITE_STORAGE_NAMESPACE,c.storageKey);
 assert.equal(process.env.VITE_BASE_PATH,c.basePath);
 for(const[p,h]of Object.entries({...c.productHashes,...c.verificationHashes}))assert.equal(sha(p),h,'W050_EXACT_SOURCE '+p);
 for(const[p,h]of Object.entries(c.retainedPublisherHashes))assert.equal(sha(path.join(here,path.basename(p))),h,'W050_RETAINED_PUBLISHER '+p);
 // Existing exact reverse-four-parts check also validates all370 protected bytes.
 execFileSync('python',[work+'/verify_source.py'],{stdio:'inherit'});
}
function outside(){
 const out=process.env.EVIDENCE_DIR;assert.ok(out&&path.isAbsolute(out),'EXPLICIT_ABSOLUTE_EVIDENCE_DIR');
 const real=p=>{let q=path.resolve(p),missing=[];while(!fs.existsSync(q)){missing.unshift(path.basename(q));const parent=path.dirname(q);assert.notEqual(parent,q);q=parent;}return path.resolve(fs.realpathSync(q),...missing);};
 const contains=(a,b)=>{const r=path.relative(a,b);return r===''||(r!=='..'&&!r.startsWith('..'+path.sep)&&!path.isAbsolute(r));};
 for(const[a,b]of [[path.resolve('.'),path.resolve(out)],[fs.realpathSync('.'),real(out)]])assert.ok(!contains(a,b)&&!contains(b,a),'EVIDENCE_ROOT_MUST_BE_DISJOINT');
 fs.mkdirSync(out,{recursive:true});return out;
}
function allFiles(){const files={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);assert.ok(!e.isSymbolicLink(),'DIST_SYMLINK');if(e.isDirectory())walk(p);else if(e.isFile()&&p!=='dist/w050-release.json')files[p.slice(5)]=sha(p);}}walk('dist');return files;}
bytes();
if(mode==='bytes-only')console.log(JSON.stringify({status:'PASS_W050_EXACT_BYTES',sourceSHA:c.sourceSHA,nativeReceipt:false}));
else if(mode==='w048-current'){
 const out=outside(),original=c.w048CurrentAdapter.originalPath;
 assert.equal(sha(original),c.w048CurrentAdapter.originalSHA256,'ORIGINAL_W048_VERIFIER_BYTE_GUARD');
 let script=fs.readFileSync(original,'utf8');
 const old="function alignmentPageState(actual, row) {\n  assert.ok([row.before_sha256, row.after_sha256].includes(actual), 'UNKNOWN_ALIGNMENT_PAGE_BYTES');";
 const replacement="function alignmentPageState(actual, row) {\n  if(actual === '"+c.productHashes['src/pages/TextbookUnitPage.tsx']+"') {\n    assert.equal(row.after_sha256, '"+c.w048CurrentAdapter.retainedAlignmentPageSHA256+"', 'W050_EXTENDS_EXACT_ALIGNMENT_AFTER');\n    return 'APPLIED_FIXED_ALIGNMENT_PLUS_W050_SCOPED_COMPOSITION';\n  }\n  assert.ok([row.before_sha256, row.after_sha256].includes(actual), 'UNKNOWN_ALIGNMENT_PAGE_BYTES');";
 assert.equal(script.split(old).length,2,'EXACT_SINGLE_PAGE_GUARD_ADAPTER_SITE');script=script.replace(old,replacement);
 const dependency="import { createServer } from 'vite';";
 assert.equal(script.split(dependency).length,2,'EXACT_SINGLE_VITE_IMPORT');
 // The generated verification-only script lives outside source; resolve installed
 // Vite from the app checkout without changing the app's node_modules or source.
 script=script.replace(dependency,"import {createRequire} from 'node:module';\nimport {pathToFileURL} from 'node:url';\nconst require=createRequire(path.resolve('package.json'));\nconst {createServer}=await import(pathToFileURL(require.resolve('vite')).href);");
 const generated=path.join(out,'W048_CURRENT_W050_ADAPTER.mjs');assert.ok(!fs.existsSync(generated),'ORIGINAL_ATTEMPT_MUST_NOT_BE_OVERWRITTEN');
 fs.writeFileSync(generated,script);
 fs.writeFileSync(path.join(out,'W048_ADAPTER_PROVENANCE.json'),JSON.stringify({sourceSHA:c.sourceSHA,original,originalSHA256:sha(original),generatedSHA256:hash(script),changes:['One exact Page guard accepts the fixed approved W050 Page after only','Vite import resolves from immutable app installation'],productOrOriginalVerifierModified:false,nativeReceipt:false},null,2)+'\n');
 execFileSync(process.execPath,[generated],{stdio:'inherit',env:process.env});
}else if(mode==='manifest'){
 assert.ok(!fs.existsSync('dist/w050-release.json'),'CLEAN_DIST_W050_REQUIRED');
 for(const name of c.manifestOrder.slice(0,-1)){const m=JSON.parse(fs.readFileSync('dist/'+name));assert.equal(m.sourceSHA,c.sourceSHA);assert.equal(m.storageKey,c.storageKey);assert.equal(m.publisherSHA??m.workflowSHA,process.env.GITHUB_SHA);}
 const m={schemaVersion:'w050-publication-manifest/1',work:'W-MATH-050',sourceSHA:c.sourceSHA,publisherSHA:process.env.GITHUB_SHA,storageKey:c.storageKey,basePath:c.basePath,contractSHA256:sha(contractPath),unit:c.unit,productHashes:c.productHashes,composition:c.composition,manifestOrder:c.manifestOrder,userAcceptance:false,Gold:false,fit:false,files:allFiles()};
 assert.match(m.publisherSHA??'',/^[0-9a-f]{40}$/);assert.notEqual(m.publisherSHA,m.sourceSHA);
 fs.writeFileSync('dist/w050-release.json',JSON.stringify(m,null,2)+'\n');
}else if(mode==='verify'){
 const out=outside(),base=process.env.APP_URL;assert.ok(base&&/^https?:\/\//.test(base)&&base.endsWith('/'),'EXPLICIT_APP_URL');
 assert.ok(!fs.existsSync(path.join(out,'W050_HOST_CONTRACT.json')),'FRESH_ATTEMPT_REQUIRED');
 const raw=fs.readFileSync('dist/w050-release.json'),manifest=JSON.parse(raw),result={status:'RUNNING',sourceSHA:c.sourceSHA,publisherSHA:manifest.publisherSHA,base,filesVerified:0,publicHost:/^https:\/\/rrikunagasige-dot\.github\.io\/kyotsu-step-web\/$/.test(base),userAcceptance:false,nativeReceipt:false};
 try{
  assert.equal(manifest.sourceSHA,c.sourceSHA);assert.equal(manifest.contractSHA256,sha(contractPath));assert.deepEqual(manifest.files,allFiles(),'DIST_CHANGED_AFTER_LAST_MANIFEST');
  let match=false,last='';for(let i=0;i<60;i++){try{const r=await fetch(new URL('w050-release.json?source='+c.sourceSHA,base),{cache:'no-store',signal:AbortSignal.timeout(30000)});if(r.ok&&hash(Buffer.from(await r.arrayBuffer()))===hash(raw)){match=true;break;}last='manifest bytes differ';}catch(e){last=String(e)}await new Promise(r=>setTimeout(r,2000));}assert.ok(match,'ACTUAL_HOST_W050_MANIFEST '+last);
  for(const[p,h]of Object.entries(manifest.files)){assert.ok(!p.startsWith('/')&&!p.split('/').includes('..')&&!p.includes('://'),'UNSAFE_DIST_PATH');const response=await fetch(new URL(p,base),{cache:'no-store',signal:AbortSignal.timeout(30000)});assert.ok(response.ok,'ASSET_HTTP '+p);assert.equal(hash(Buffer.from(await response.arrayBuffer())),h,'ASSET_BYTES '+p);result.filesVerified++;}
  const browserOut=path.join(out,'browser');
  execFileSync(process.execPath,[work+'/verify_browser.mjs'],{stdio:'inherit',env:{...process.env,SOURCE_SHA:c.sourceSHA,STORAGE_KEY:c.storageKey,APP_URL:base,EVIDENCE_DIR:browserOut},timeout:1500000});
  const browser=JSON.parse(fs.readFileSync(path.join(browserOut,'REPORT.json')));assert.equal(browser.status,'PASS_DECLARED_BROWSER_SCOPE');assert.equal(browser.sourceSHA,c.sourceSHA);assert.deepEqual(browser.widths,[320,390,430,1440]);assert.equal(browser.cases.length,32);assert.deepEqual(browser.failures,[]);
  for(const row of browser.cases)assert.equal(row.status,'PASS');result.browserCases=32;result.status='PASS_EXACT_BYTES_AND_DECLARED_N04_STAGE1_OPERATIONS';
 }catch(e){result.status='FAIL';result.error={message:e.message,stack:e.stack};throw e;}finally{fs.writeFileSync(path.join(out,'W050_HOST_CONTRACT.json'),JSON.stringify(result,null,2)+'\n');}
}else throw Error('Use bytes-only, w048-current, manifest or verify');
