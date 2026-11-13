// Successor metadata adapters. Original learner assertions and publisher files stay intact.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const SOURCE='384021f539967038a20fd98bd146e0e499f0df65';
export const BASELINE='1ac9f31ec205424f393a488f0d17cb3bb8bc75fd';
const MAIN='1efb90d5cc1303500efa220ab9fe91985776f0db';
const ENGINE='a23df3e005fbbcd7bc47ae43db0a32381f1b73238692399f6797b19b18d87c52';
const OLD_CONTRACT='eb7b6c7390b03fd03c76e675d8b79dec8ddb7798a189c01ecd8be3d5b14061be';
const PROJECTION='1b367dff0a5a9fcef810a4ed4863f39a536d19f05fcc5b72e2c3221a969a6f77';
const QA='work/items/W-MATH-051-n0106-visual-consistency/B_QA';
const PAGE='src/pages/TextbookUnitPage.tsx';
const NESTED='src/domain/textbookNestedContract.test.ts';
const NESTED_OLD='602ce098699789ff44233677c008a855049f4d6af54ebcc80a6260103dd59e20';
const NESTED_NEW='6607e24957033f655956c298bd4a8035e3107e5972b00a23b161b7349efc07a1';
const hash=b=>createHash('sha256').update(b).digest('hex');
const sha=p=>hash(fs.readFileSync(p));
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
const git=(root,...args)=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
const contains=(a,b)=>{const r=path.relative(a,b);return r===''||(!r.startsWith('..'+path.sep)&&r!=='..'&&!path.isAbsolute(r));};
function realFuture(p){let q=path.resolve(p),tail=[];while(!fs.existsSync(q)){tail.unshift(path.basename(q));q=path.dirname(q);}return path.resolve(fs.realpathSync(q),...tail);}
function separate(out,...roots){out=realFuture(out);for(const r of roots){const actual=fs.realpathSync(r);assert.ok(!contains(actual,out)&&!contains(out,actual),'EXTERNAL_OUTPUT_REQUIRED');}return out;}
export function replaceExact(text,before,after,label,records=[]){assert.ok(before.length>0);assert.equal(text.split(before).length-1,1,'EXACT_SINGLE_ADAPTER_SITE '+label);const result=text.replace(before,after);records.push({label,before,after,count:1,beforeSHA256:hash(text),afterSHA256:hash(result)});return result;}

export function projectContract(old,projection){
 assert.equal(hash(JSON.stringify(projection)),PROJECTION,'FROZEN_EXACT_SOURCE_PROJECTION');
 const c=structuredClone(old),protectedKey=Object.hasOwn(c,'protectedSourceHashes')?'protectedSourceHashes':'retained319';
 const protectedMap=c[protectedKey];assert.equal(Object.keys(protectedMap).length,319);assert.equal(Object.keys(c.productHashes).length,8);
 const seen=new Set();for(const row of projection.changedOriginalProtected){assert.ok(!seen.has(row.path));seen.add(row.path);assert.equal(protectedMap[row.path],row.beforeSHA256,'EXACT_OLD_PROTECTED '+row.path);protectedMap[row.path]=row.afterSHA256;}
 for(const row of projection.addedCurrentProtected){assert.ok(!seen.has(row.path));seen.add(row.path);assert.ok(!Object.hasOwn(protectedMap,row.path)&&!Object.hasOwn(c.productHashes,row.path));protectedMap[row.path]=row.afterSHA256;}
 assert.equal(projection.changedOriginalProtected.length,15);assert.equal(projection.addedCurrentProtected.length,5);
 assert.equal(projection.productRebinding.length,1);for(const row of projection.productRebinding){assert.equal(row.path,PAGE);assert.equal(c.productHashes[row.path],row.beforeSHA256);c.productHashes[row.path]=row.afterSHA256;}
 assert.equal(Object.keys(protectedMap).length,324);assert.equal(new Set([...Object.keys(protectedMap),...Object.keys(c.productHashes)]).size,332);
 return c;
}


export const HISTORICAL_SOURCE='46af88381ceba8d5e01ae5e26c64477eab42dbe9';
export const SOURCE_OVERLAY_SHA256='3eb22c59e93f98a5c8c6658b4de0c2d7a3ece09c26ee4a5a5e207f13e0514051';
const SOURCE_OVERLAY={"schema":"qf01-six-path-overlay/1","beforeSourceSHA":"46af88381ceba8d5e01ae5e26c64477eab42dbe9","afterSourceSHA":"384021f539967038a20fd98bd146e0e499f0df65","appByteEquivalentP011SHA":"ad5f0c22202b1cb78e1578646415aa858480b9e9","rows":[{"path":"src/data/textbook/math/mathCatalog.test.ts","beforeSHA256":"0ae2cfa4d5d25d37e07c430b2d4a15a6cf1d0e60b3454aad6f243a9774e58d18","afterSHA256":"e62d14488c4a00a35ba25426e455b77d15a36101686f5f95f3666865d4b1e615","bucket":"protected"},{"path":"src/data/textbook/math/mathCatalog.ts","beforeSHA256":"ddf09759921bfb7f254f41a4479704be8a0635f8b3eb9c972c5a9dd70a8a387e","afterSHA256":"3e89a3851bc8bfdf27d981307750f646f91724802e25af1a46d35beba46c48c6","bucket":"protected"},{"path":"src/data/textbook/math/quadratic/qf01Lesson.ts","beforeSHA256":"e2151cb0879d80a4d0b4bb58ac587c31d4fc9ef2dd9f9ee29470654855fd9b9e","afterSHA256":"f9e1d2957dbc2160eafb6274ace8dd83449f99f9c956ae46e94c7b04228fa43a","bucket":"protected"},{"path":"src/domain/textbookMath.test.ts","beforeSHA256":"ee16ad1a1db6ffac6d9987035919ced23d10dc48b176a98df9839e2c90d28db3","afterSHA256":"9aa400c208dc733e4d30998e87d92de06343da95676b10d98517bf239b964b3c","bucket":"protected"},{"path":"src/pages/LearningSetupPage.tsx","beforeSHA256":"830707a236991cdf3d70574dfa100bb53028d50712a3e6acb0a18c7fdb5a8e22","afterSHA256":"e6d9b80ed1c5c6fa4b11c8d2ab584796e3e6aa2e5e7c92b1e2b7f3f59e98d892","bucket":"protected"},{"path":"src/pages/TextbookUnitPage.tsx","beforeSHA256":"81de2df3dfa1047ac1805f2fe43ca3ec67874f59f109fd716ab35a638b29e279","afterSHA256":"4d707eba705517612df88f04c1864bca2b6aab2d05aeda8596f4e406bfcec117","bucket":"product"}],"scope":"Same332keys; sixexistingpaths;5protected1product; no newremovedsource","evidence":"Current raw p012-repo source bytes compared to exact main611 contract map; root/CI source384 equivalence must remain independently bound."};
export function overlayCurrentSource(projected, overlay){
 assert.equal(hash(JSON.stringify(overlay)),SOURCE_OVERLAY_SHA256,'FROZEN_SIX_SOURCE_OVERLAY');
 assert.deepEqual(overlay,SOURCE_OVERLAY,'EXACT_SIX_SOURCE_OVERLAY');
 assert.equal(overlay.beforeSourceSHA,HISTORICAL_SOURCE);assert.equal(overlay.afterSourceSHA,SOURCE);
 const c=structuredClone(projected),key=Object.hasOwn(c,'protectedSourceHashes')?'protectedSourceHashes':'retained319';
 assert.equal(Object.keys(c[key]).length,324);assert.equal(Object.keys(c.productHashes).length,8);
 assert.equal(overlay.rows.length,6);assert.equal(new Set(overlay.rows.map(r=>r.path)).size,6);
 for(const row of overlay.rows){const map=row.bucket==='product'?c.productHashes:c[key];assert.ok(Object.hasOwn(map,row.path),'OVERLAY_EXISTING_PATH');assert.equal(map[row.path],row.beforeSHA256,'OVERLAY_BEFORE_HASH '+row.path);map[row.path]=row.afterSHA256;}
 assert.equal(overlay.rows.filter(r=>r.bucket==='product').length,1);assert.equal(overlay.rows.filter(r=>r.bucket==='protected').length,5);
 assert.equal(new Set([...Object.keys(c[key]),...Object.keys(c.productHashes)]).size,332);
 return c;
}

export function buildPinnedContractInputs({publisherRoot,baselineRoot}){
 publisherRoot=fs.realpathSync(publisherRoot);baselineRoot=fs.realpathSync(baselineRoot);
 assert.equal(git(baselineRoot,'rev-parse','HEAD').toString().trim(),BASELINE);
 const here=path.join(publisherRoot,'tools/release'),contractFile=path.join(here,'w051-p005-release-contract.json');
 assert.equal(sha(contractFile),OLD_CONTRACT);assert.equal(sha(path.join(here,'w051-p005-publish-check.mjs')),ENGINE);
 for(const name of ['w051-p005-release-contract.json','w051-p005-publish-check.mjs'])assert.equal(hash(git(publisherRoot,'show',MAIN+':tools/release/'+name)),sha(path.join(here,name)));
 const old=read(contractFile),pins={'tools/release/w051-p005-release-contract.json':OLD_CONTRACT,'tools/release/w051-p005-publish-check.mjs':ENGINE};
 for(const [name,h]of Object.entries(old.retainedOriginalPublisherHashes)){assert.equal(sha(path.join(here,name)),h);pins['tools/release/'+name]=h;}
 assert.equal(sha(path.join(here,'w050-figure-readiness-original.py')),old.readinessHelperSHA256);pins['tools/release/w050-figure-readiness-original.py']=old.readinessHelperSHA256;
 for(const [name,h]of Object.entries(old.qa4)){assert.equal(sha(path.join(baselineRoot,QA,name)),h);assert.equal(hash(git(baselineRoot,'show',BASELINE+':'+QA+'/'+name)),h);}
 return {publisherFiles:pins,sourceFiles:old.retainedSourceScripts,qaFiles:old.qa4,baselineSHA:BASELINE,publisherInputSHA:MAIN};
}

export function verifyProjectedSource({sourceRoot,publisherRoot,baselineRoot,contract}){
 assert.equal(contract.sourceSHA,SOURCE);assert.equal(contract.baselineSHA,BASELINE);
 assert.equal(contract.storageKey,'kyotsu-step-gate3-math-20261023');assert.equal(contract.basePath,'/kyotsu-step-web/');
 assert.equal(contract.publicBase,'https://rrikunagasige-dot.github.io/kyotsu-step-web/');
 const pins=buildPinnedContractInputs({publisherRoot,baselineRoot});assert.deepEqual(contract.inputPins,pins,'FROZEN_INPUT_PINS');
 const old=read(path.join(publisherRoot,'tools/release/w051-p005-release-contract.json')),projected=overlayCurrentSource(projectContract(old,contract.exactSourceProjection),contract.sourceOverlay);
 assert.equal(git(sourceRoot,'rev-parse','HEAD').toString().trim(),SOURCE);
 assert.equal(git(sourceRoot,'diff','--name-only','HEAD','--','src','public','package.json','pnpm-lock.yaml').toString().trim(),'','CLEAN_SOURCE');
 const all={...projected.productHashes,...projected.retained319};
 const actual=[];function walk(dir){for(const e of fs.readdirSync(path.join(sourceRoot,dir),{withFileTypes:true})){const p=path.posix.join(dir,e.name);assert.ok(!e.isSymbolicLink(),'NO_SRC_SYMLINK');if(e.isDirectory())walk(p);else{assert.ok(e.isFile());actual.push(p);}}}walk('src');
 assert.deepEqual(actual.sort(),Object.keys(all).sort(),'FULL_332_SOURCE_SET');
 for(const[p,h]of Object.entries(all)){assert.equal(sha(path.join(sourceRoot,p)),h,p);assert.equal(hash(git(sourceRoot,'show',SOURCE+':'+p)),h,'COMMITTED_SOURCE '+p);}
 for(const p of ['public','package.json','pnpm-lock.yaml'])assert.equal(git(sourceRoot,'rev-parse',SOURCE+':'+p).toString(),git(baselineRoot,'rev-parse',BASELINE+':'+p).toString(),'UNCHANGED_NON_SRC '+p);
 for(const[p,h]of Object.entries(pins.sourceFiles)){assert.equal(sha(path.join(sourceRoot,p)),h);assert.equal(hash(git(sourceRoot,'show',SOURCE+':'+p)),h);}
 for(const[name,h]of Object.entries(pins.qaFiles))assert.equal(sha(path.join(sourceRoot,QA,name)),h);
 return {projected,pins,sourceFiles:332,status:'VERIFIED_SOURCE_BYTES_ONLY'};
}

export function prepareRetainedAdapters({sourceRoot,publisherRoot,baselineRoot,outputRoot,contract}){
 sourceRoot=fs.realpathSync(sourceRoot);publisherRoot=fs.realpathSync(publisherRoot);baselineRoot=fs.realpathSync(baselineRoot);
 const verified=verifyProjectedSource({sourceRoot,publisherRoot,baselineRoot,contract});
 outputRoot=separate(outputRoot,sourceRoot,publisherRoot,baselineRoot);assert.ok(!fs.existsSync(outputRoot),'FRESH_ADAPTER_DIRECTORY');fs.mkdirSync(outputRoot,{recursive:true});
 const here=path.join(publisherRoot,'tools/release'),old=read(path.join(here,'w051-p005-release-contract.json'));
 const c={...old,sourceSHA:SOURCE,productHashes:verified.projected.productHashes};
 const engine=fs.readFileSync(path.join(here,'w051-p005-publish-check.mjs'),'utf8');assert.equal(hash(engine),ENGINE);
 const start=engine.indexOf('function adapters(){'),end=engine.indexOf('\nfunction currentNative(){');assert.ok(start>0&&end>start);
 const records=[],once=(s,b,a,l)=>replaceExact(s,b,a,l,records),entry=fileURLToPath(import.meta.url);
 // The engine is fixed by its full raw hash; only its generator function executes.
 const context={fs,path,assert,execFileSync,process,JSON,structuredClone,c,root:sourceRoot,here,entry,sha,read,write,hash,pagePath:PAGE,oldWork:'work/items/W-MATH-050-n0107-layout-prose',w048:'work/items/W-MATH-048-n1314-source-audit',contractPath:path.join(here,'w051-p005-release-contract.json'),once,disjoint:p=>separate(p,sourceRoot,publisherRoot,baselineRoot),pinAdapterInputs:()=>publisherRoot};
 const previous=process.cwd(),saved=process.env.W050_ADAPTER_DIR,local=process.env.W051_LOCAL_BROWSER;let prepared;
 try{process.chdir(sourceRoot);process.env.W050_ADAPTER_DIR=outputRoot;delete process.env.W051_LOCAL_BROWSER;prepared=vm.runInNewContext(engine.slice(start,end)+'\nadapters();',context,{timeout:30000});}finally{process.chdir(previous);if(saved===undefined)delete process.env.W050_ADAPTER_DIR;else process.env.W050_ADAPTER_DIR=saved;if(local===undefined)delete process.env.W051_LOCAL_BROWSER;else process.env.W051_LOCAL_BROWSER=local;}
 const dir=path.dirname(prepared.paths.w046),attempt=path.dirname(dir);
 // JSON metadata transformations also retain their complete literal and byte binding.
 for(const name of ['w047-release-contract.json','w048-release-contract.json']){
  replaceExact(fs.readFileSync(path.join(here,name),'utf8'),fs.readFileSync(path.join(here,name),'utf8'),fs.readFileSync(path.join(dir,name),'utf8'),'original-engine-complete-JSON-metadata-'+name,records);
 }
 function edit(file,before,after,label){const s=fs.readFileSync(file,'utf8');fs.writeFileSync(file,once(s,before,after,label));}
 edit(prepared.paths.w046,JSON.stringify(NESTED)+': '+JSON.stringify(NESTED_OLD),JSON.stringify(NESTED)+': '+JSON.stringify(NESTED_NEW),'P004-exact-NestedContract-metadata');
 const c47=path.join(dir,'w047-release-contract.json'),old47hash=sha(c47);
 edit(c47,JSON.stringify(NESTED)+': '+JSON.stringify(NESTED_OLD),JSON.stringify(NESTED)+': '+JSON.stringify(NESTED_NEW),'P004-exact-NestedContract-contract-metadata');
 edit(path.join(dir,'w048-release-contract.json'),old47hash,sha(c47),'downstream-exact-W047-contract-digest');
 edit(prepared.paths.w048,"['dist/w048-release.json','dist/w050-release.json','dist/w051-release.json']","['dist/w048-release.json','dist/w050-release.json','dist/w051-release.json','dist/qf01-release.json']",'exact-successor-manifest-exclusion');
 const qaDir=path.join(attempt,'w051-qa');fs.mkdirSync(qaDir);
 const qaContract=overlayCurrentSource(projectContract(read(path.join(sourceRoot,QA,'B_contract.json')),contract.exactSourceProjection),contract.sourceOverlay),qaContractFile=path.join(qaDir,'B_contract.json');write(qaContractFile,qaContract);
 replaceExact(fs.readFileSync(path.join(sourceRoot,QA,'B_contract.json'),'utf8'),fs.readFileSync(path.join(sourceRoot,QA,'B_contract.json'),'utf8'),fs.readFileSync(qaContractFile,'utf8'),'B-complete-frozen-319-to-324-and-Page-projection',records);
 let verifier=fs.readFileSync(path.join(sourceRoot,QA,'B_verify_browser.mjs'),'utf8');
 verifier=once(verifier,old.qa4['B_contract.json'],sha(qaContractFile),'B-fixed-derived-contract-raw-SHA');
 verifier=once(verifier,'assert.equal(report.retainedHashes.length,319);','assert.equal(report.retainedHashes.length,324);','B-full-source-inventory-count-only');
 const browser=path.join(qaDir,'B_verify_browser.mjs');fs.writeFileSync(browser,verifier);
 for(const name of ['B_display_checks.mjs','B_inline_fragment_checks.mjs'])fs.copyFileSync(path.join(sourceRoot,QA,name),path.join(qaDir,name));
 const files=[];function inventory(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())inventory(p);else if(e.isFile()&&e.name!=='PROVENANCE.json'&&e.name!=='PREPARED.json')files.push({path:path.relative(attempt,p),sha256:sha(p)});else if(e.isSymbolicLink())assert.equal(p,path.join(attempt,'material/node_modules'));}}inventory(attempt);
 const result={schema:'qf01-retained-adapters/1',sourceRoot,publisherRoot,baselineRoot,sourceSHA:SOURCE,outputRoot:attempt,paths:{...prepared.paths,browser,qaContract:qaContractFile},inputPins:verified.pins,projectionSHA256:PROJECTION,sourceOverlaySHA256:SOURCE_OVERLAY_SHA256,replacements:records,files,executed:false,publication:false,learnerAssertionsModified:false};
 verifyProjectedSource({sourceRoot,publisherRoot,baselineRoot,contract});write(path.join(attempt,'PREPARED.json'),result);return result;
}

export function runRetained({prepared,mode,appURL,evidenceRoot,width,contract,env={}}){
 assert.equal(prepared.schema,'qf01-retained-adapters/1');verifyProjectedSource({...prepared,contract});
 for(const row of prepared.files)assert.equal(sha(path.join(prepared.outputRoot,row.path)),row.sha256,'FROZEN_ADAPTER_BYTES');
 assert.ok(/^https?:\/\//.test(appURL)&&appURL.endsWith('/'),'EXPLICIT_APP_URL');
 const out=separate(evidenceRoot,prepared.sourceRoot,prepared.publisherRoot,prepared.baselineRoot,prepared.outputRoot);assert.ok(!fs.existsSync(out),'FRESH_EVIDENCE_DIRECTORY');
 assert.ok(process.env.QF01_CONTRACT,'EXPLICIT_CONTRACT_FILE_FOR_RETAINED_SHIM');assert.deepEqual(read(process.env.QF01_CONTRACT),contract);
 const envCurrent={...process.env,...env,APP_URL:appURL,BASE_URL:appURL,EVIDENCE_DIR:out,SOURCE_SHA:SOURCE,CANDIDATE_SHA:SOURCE,VITE_PREVIEW_COMMIT:SOURCE,STORAGE_KEY:contract.storageKey,VITE_STORAGE_NAMESPACE:contract.storageKey,VITE_BASE_PATH:contract.basePath,QF01_PREPARED:path.join(prepared.outputRoot,'PREPARED.json'),QF01_CONTRACT:path.resolve(process.env.QF01_CONTRACT)};
 let script,args=[];if(/^w0(46|47|48)-(manifest|verify|retained-check|bytes-only)$/.test(mode)){const [name,action]=mode.split('-');script=prepared.paths[name];args=[action];}else if(mode==='focused')script=prepared.paths.focused;else if(mode==='w048-current')script=prepared.paths.current;else if(mode==='w051-width'){assert.ok([320,390,430,1440].includes(width));script=prepared.paths.browser;envCurrent.W051_QA_WIDTHS=String(width);envCurrent.W051_QA_CONTRACT=prepared.paths.qaContract;delete envCurrent.W051_QA_CODES;}else assert.fail('UNKNOWN_RETAINED_MODE');
 execFileSync(process.execPath,[script,...args],{cwd:prepared.sourceRoot,env:envCurrent,stdio:'inherit'});
 verifyProjectedSource({...prepared,contract});return {mode,width:width??null,evidenceRoot:out,exitCode:0,sourceSHA:SOURCE,scope:'ORIGINAL_RETAINED_ASSERTIONS_ON_CURRENT_DIST',publication:false};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 assert.equal(process.argv[2],'w048-current','MODULE_API_OR_W048_SHIM_ONLY');
 assert.ok(process.env.QF01_PREPARED&&process.env.QF01_CONTRACT,'EXPLICIT_PREPARED_AND_CONTRACT');
 const prepared=read(process.env.QF01_PREPARED),contract=read(process.env.QF01_CONTRACT);verifyProjectedSource({...prepared,contract});
 for(const row of prepared.files)assert.equal(sha(path.join(prepared.outputRoot,row.path)),row.sha256);
 execFileSync(process.execPath,[prepared.paths.current],{cwd:prepared.sourceRoot,env:process.env,stdio:'inherit'});
 verifyProjectedSource({...prepared,contract});
}
