// Successor metadata adapters. Original learner assertions and publisher files stay intact.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const SOURCE='ccd434a38faa1826caa9f671df4551dc8adc33df';
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
 assert.equal(overlay.beforeSourceSHA,HISTORICAL_SOURCE);assert.equal(overlay.afterSourceSHA,'384021f539967038a20fd98bd146e0e499f0df65');
 const c=structuredClone(projected),key=Object.hasOwn(c,'protectedSourceHashes')?'protectedSourceHashes':'retained319';
 assert.equal(Object.keys(c[key]).length,324);assert.equal(Object.keys(c.productHashes).length,8);
 assert.equal(overlay.rows.length,6);assert.equal(new Set(overlay.rows.map(r=>r.path)).size,6);
 for(const row of overlay.rows){const map=row.bucket==='product'?c.productHashes:c[key];assert.ok(Object.hasOwn(map,row.path),'OVERLAY_EXISTING_PATH');assert.equal(map[row.path],row.beforeSHA256,'OVERLAY_BEFORE_HASH '+row.path);map[row.path]=row.afterSHA256;}
 assert.equal(overlay.rows.filter(r=>r.bucket==='product').length,1);assert.equal(overlay.rows.filter(r=>r.bucket==='protected').length,5);
 assert.equal(new Set([...Object.keys(c[key]),...Object.keys(c.productHashes)]).size,332);
 return c;
}


export const REPAIR_OVERLAY_SHA256="1e40a99b221f972d762e00bd5b13d6d313de6ab82f0b7787947ccc4dc1f8e935";
export const REPAIR_OVERLAY={"schema":"qf01-thirteen-path-repair-overlay/1","beforeSourceSHA":"384021f539967038a20fd98bd146e0e499f0df65","afterSourceSHA":"a113022f03c5d28acd06af93a845bfcca8b08ff2","rows":[{"path":"src/data/textbook/math/quadratic/qf01Unit.json","beforeSHA256":"5d0868d5ec2cdd6d1851e2e8b0c83f7c3db51ec703e7db75aa26d77074afea74","afterSHA256":"de8e6f70e33d26a7e92503401e435edcfc0639d2a4580af58080083f1fb93928","bucket":"protected"},{"path":"src/data/textbook/math/quadratic/qf01Presentation.json","beforeSHA256":"06e761a97c4c8ecd11816842b4bb392ceff7cc92568ce43056ea4539cc62d0b4","afterSHA256":"32bce9d3cb89809ee1024f986d52020cd56e4f825908d633768b1f26ef4bea6f","bucket":"protected"},{"path":"src/data/textbook/math/quadratic/qf01Lesson.ts","beforeSHA256":"f9e1d2957dbc2160eafb6274ace8dd83449f99f9c956ae46e94c7b04228fa43a","afterSHA256":"769975c725cc3f43155a589c7b852f6aaf084429617a7ee100253741cf246cd0","bucket":"protected"},{"path":"src/data/textbook/math/quadratic/qf01Lesson.test.tsx","beforeSHA256":"2e39e34d336b2ef91b61ea00cade9ca0317280b1069c88e53685da0479df4ca4","afterSHA256":"f9da4ba5a66ded0996c959c995bca4319406f497827ca8b76e34ce6cf9e6261d","bucket":"protected"},{"path":"src/components/textbook/GuidedMathReadingFlow.tsx","beforeSHA256":"7a3b182ab039ca811d9d7374e66cc8efc9fd661d523e32dbb00d70595aa0b99e","afterSHA256":"afa170098dd26e7703102cb79b710d6928fb40d3166a42be813d00dc16aa874c","bucket":"protected"},{"path":"src/components/textbook/guided-math-reading.css","beforeSHA256":"3ddb0eb284c9cd7c544cecbac069eb1daad5b0fab10b6ceef993d3ee914e5272","afterSHA256":"dbf8bdb4c146fc3aa8afc63f62521c69d10bc42351a48daea2b908817afc9e1e","bucket":"protected"},{"path":"src/pages/TextbookUnitPage.tsx","beforeSHA256":"4d707eba705517612df88f04c1864bca2b6aab2d05aeda8596f4e406bfcec117","afterSHA256":"e862027297c25bccfd6caa4632153927a96096310d735823086266665c887e32","bucket":"product"},{"path":"src/domain/textbook.ts","beforeSHA256":"3897884d158e27ce63f907c10e55fca6bc2264bcbdf2e3a186e599c7327e3a5a","afterSHA256":"e3682ee50cf10d377416676872f9d491e2ad4fcd6816d7159d1ca162d911444c","bucket":"protected"},{"path":"src/domain/textbook.test.ts","beforeSHA256":"a00c2583f390d6dbbd45ea1c803b6880ea77b9a3f318119969550f9f798ff3fb","afterSHA256":"62a20e50ab6dcd67e52391cf0d0b7957f01445c29d6fa3e084ce4dba12fa72a5","bucket":"protected"},{"path":"src/domain/textbookMath.test.ts","beforeSHA256":"9aa400c208dc733e4d30998e87d92de06343da95676b10d98517bf239b964b3c","afterSHA256":"034b79dc81b4d7fec62ae4b7a6ef2d87234cd211e03a951ebc5f3a90062c8ce0","bucket":"protected"},{"path":"src/data/textbook/math/mathCatalog.test.ts","beforeSHA256":"e62d14488c4a00a35ba25426e455b77d15a36101686f5f95f3666865d4b1e615","afterSHA256":"01a08515b52d2ce49aaff0d7d115ed26df7e30efa77cf1fdb0f614405c116252","bucket":"protected"},{"path":"src/domain/textbookSchema.ts","beforeSHA256":"f6156ad017672b66b0dc5b01926240efe038a215e755799c2491425ac423c246","afterSHA256":"a97764f177a1d5e5f2bcf643e56abff8d2ec399f593de30033f8493ac6dd3af3","bucket":"protected"},{"path":"src/domain/textbookSchema.test.ts","beforeSHA256":"cfcae58ab34cb5f74239f1a962af60f5df37c0a2c0d7fec60277305e8cd91e0d","afterSHA256":"c5f3feaefb76ddb02e2296b55c12ad8c4cc6267fede6ddf2020dcc6086ba67c6","bucket":"protected"}],"scope":"Same332keys; exact13approvedexistingpaths;12protected1product; no app/public/config additions or removals","proposalSHA256":"c2e9da6b90992565c00149044711435a9849400f1fd146db1710bef109724fe3","patchHash":"6f2e9f4d02ebfc18d0f00d0887246946673e8eff4f83c65e2b8bd8d91c873648"};
export function overlayRepairSource(projected,overlay){
 assert.equal(hash(JSON.stringify(overlay)),REPAIR_OVERLAY_SHA256,'FROZEN_EXACT_REPAIR_OVERLAY');assert.deepEqual(overlay,REPAIR_OVERLAY,'EXACT_APPROVED_THIRTEEN_PATH_REPAIR');
 const c=structuredClone(projected),key=Object.hasOwn(c,'protectedSourceHashes')?'protectedSourceHashes':'retained319';
 assert.equal(overlay.rows.length,13);assert.equal(new Set(overlay.rows.map(r=>r.path)).size,13);
 for(const row of overlay.rows){const map=row.bucket==='product'?c.productHashes:c[key];assert.ok(Object.hasOwn(map,row.path));assert.equal(map[row.path],row.beforeSHA256,'REPAIR_BEFORE_HASH '+row.path);map[row.path]=row.afterSHA256;}
 assert.equal(overlay.rows.filter(r=>r.bucket==='product').length,1);assert.equal(overlay.rows.filter(r=>r.bucket==='protected').length,12);assert.equal(Object.keys(c[key]).length,324);assert.equal(new Set([...Object.keys(c[key]),...Object.keys(c.productHashes)]).size,332);return c;
}

export const FONT_OVERLAY={"schema":"qf01-one-css-font-overlay/1","beforeSourceSHA":"a113022f03c5d28acd06af93a845bfcca8b08ff2","afterSourceSHA":"7885a4481249d5d754aec49140b7ccf6300c58db","proposalSHA256":"ea8c825cfbcd557c41181b2ff6d21207b7ad2f232b493549faf37bacdd5548df","patchHash":"5e03c6644cdc7ce3172705055ded4342b8fd5090e683bda09ed42d802d845cab","rows":[{"path":"src/components/textbook/guided-math-reading.css","beforeSHA256":"dbf8bdb4c146fc3aa8afc63f62521c69d10bc42351a48daea2b908817afc9e1e","afterSHA256":"e27892613c059a7774f542f2b53e108e2333fa1dc6165bf57f41bc0da187da84","bucket":"protected"}]};
export const FONT_OVERLAY_SHA256='612aec9a642fb6651e47d3b8eb162c809fb2405f36ac2348bec81ddaeca4604e';
export function overlayFontSource(projected,overlay){
 assert.equal(hash(JSON.stringify(overlay)),FONT_OVERLAY_SHA256,'FROZEN_ONE_CSS_FONT_OVERLAY');assert.deepEqual(overlay,FONT_OVERLAY,'EXACT_ONE_CSS_FONT_OVERLAY');
 const c=structuredClone(projected),key=Object.hasOwn(c,'protectedSourceHashes')?'protectedSourceHashes':'retained319',row=overlay.rows[0];assert.equal(overlay.rows.length,1);assert.equal(row.path,'src/components/textbook/guided-math-reading.css');assert.equal(c[key][row.path],row.beforeSHA256,'FONT_BEFORE_HASH');c[key][row.path]=row.afterSHA256;assert.equal(Object.keys(c[key]).length,324);assert.equal(new Set([...Object.keys(c[key]),...Object.keys(c.productHashes)]).size,332);return c;
}

export const TEST_OVERLAY={"schema":"qf01-two-test-source-overlay/1","beforeSourceSHA":"7885a4481249d5d754aec49140b7ccf6300c58db","afterSourceSHA":"ccd434a38faa1826caa9f671df4551dc8adc33df","proposalSHA256":"2e127c92e0800f05b3eb3d30f2a02d499ea9b47a16e5e2ed9ba2abc869744388","patchHash":"c98fffb829916d6b9404bde38799b18d8c9852fc654c407672be578ead6cf2e3","rows":[{"path":"src/domain/textbook.test.ts","beforeSHA256":"62a20e50ab6dcd67e52391cf0d0b7957f01445c29d6fa3e084ce4dba12fa72a5","afterSHA256":"03ead4595a1b8c47a4e0471dcf3effc3b8c845265b6a0051e8a4dbe6cf8bc572","bucket":"protected"},{"path":"src/data/textbook/math/quadratic/qf01Lesson.test.tsx","beforeSHA256":"f9da4ba5a66ded0996c959c995bca4319406f497827ca8b76e34ce6cf9e6261d","afterSHA256":"a1a6cc5b42d9e1364b5cccdfd45f74b13f54e1bf2f771b54c9d6d41b90f5b743","bucket":"protected"}]};
export const TEST_OVERLAY_SHA256='41f0aedbbc4258b07699bd59b900c296a090937fb452fd3a2fa4cb65a9af67d3';
export function overlayTestSource(projected,overlay){
 assert.equal(hash(JSON.stringify(overlay)),TEST_OVERLAY_SHA256,'FROZEN_TWO_TEST_OVERLAY');assert.deepEqual(overlay,TEST_OVERLAY,'EXACT_TWO_TEST_OVERLAY');
 const c=structuredClone(projected),key=Object.hasOwn(c,'protectedSourceHashes')?'protectedSourceHashes':'retained319';assert.equal(c[key][FONT_OVERLAY.rows[0].path],FONT_OVERLAY.rows[0].afterSHA256,'FONT_LAYER_BEFORE_TEST_LAYER');assert.equal(overlay.rows.length,2);assert.equal(new Set(overlay.rows.map(r=>r.path)).size,2);for(const row of overlay.rows){assert.equal(row.bucket,'protected');assert.ok(Object.hasOwn(c[key],row.path));assert.equal(c[key][row.path],row.beforeSHA256,'TEST_OVERLAY_BEFORE_HASH '+row.path);c[key][row.path]=row.afterSHA256;}assert.equal(Object.keys(c[key]).length,324);assert.equal(new Set([...Object.keys(c[key]),...Object.keys(c.productHashes)]).size,332);return c;
}

// Only these three generated reference-metadata sites require the approved repair.
// Original input helpers/contracts remain byte-pinned; learner assertions are untouched.
export function projectRetainedRepairMetadata({w046,w047,w048},overlay=REPAIR_OVERLAY,records=[]){
 assert.equal(hash(JSON.stringify(overlay)),REPAIR_OVERLAY_SHA256,'FROZEN_EXACT_REPAIR_OVERLAY');
 assert.deepEqual(overlay,REPAIR_OVERLAY,'EXACT_APPROVED_THIRTEEN_PATH_REPAIR');
 // Full generated inputs bind every other key, hash, assertion and literal as well.
 const expected={w046:'7955e6c0d93189f98ec9735d908c5bbd9ac78486926c54d32644e1d6126db96a',w047:'005162fd594de1dd84e68ec946af213b171ab3784e60e89afdafbe77968faab8',w048:'c25481f8d4375bb1e4ff304ecb570e26958bb94dbf25cf138c95db6b5e0a11aa'};
 for(const [name,text]of Object.entries({w046,w047,w048}))assert.equal(hash(text),expected[name],'EXACT_GENERATED_REPAIR_INPUT '+name);
 const schema=overlay.rows.find(r=>r.path==='src/domain/textbookSchema.ts'),domain=overlay.rows.find(r=>r.path==='src/domain/textbook.ts');
 const before47=readJSON(w047),before48=readJSON(w048);
 assert.equal(before47.required[schema.path],schema.beforeSHA256,'EXACT_W047_SCHEMA_BEFORE');
 assert.equal(before48.requiredProductHashes[domain.path],domain.beforeSHA256,'EXACT_W048_DOMAIN_BEFORE');
 const literal=(p,h)=>JSON.stringify(p)+': '+JSON.stringify(h);
 w046=replaceExact(w046,literal(schema.path,schema.beforeSHA256),literal(schema.path,schema.afterSHA256),'approved13-W046-required-Schema',records);
 w047=replaceExact(w047,literal(schema.path,schema.beforeSHA256),literal(schema.path,schema.afterSHA256),'approved13-W047-required-Schema',records);
 w048=replaceExact(w048,literal(domain.path,domain.beforeSHA256),literal(domain.path,domain.afterSHA256),'approved13-W048-requiredProduct-domain',records);
 const expected47=structuredClone(before47),expected48=structuredClone(before48);
 expected47.required[schema.path]=schema.afterSHA256;expected48.requiredProductHashes[domain.path]=domain.afterSHA256;
 assert.deepEqual(readJSON(w047),expected47,'ONLY_W047_SCHEMA_METADATA_CHANGED');
 assert.deepEqual(readJSON(w048),expected48,'ONLY_W048_DOMAIN_METADATA_CHANGED');
 return {w046,w047,w048};
}
function readJSON(text){return JSON.parse(text);}

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
 const old=read(path.join(publisherRoot,'tools/release/w051-p005-release-contract.json')),projected=overlayTestSource(overlayFontSource(overlayRepairSource(overlayCurrentSource(projectContract(old,contract.exactSourceProjection),contract.sourceOverlay),contract.repairOverlay),contract.fontOverlay),contract.testOverlay);
 assert.equal(git(sourceRoot,'rev-parse','HEAD').toString().trim(),SOURCE);
 assert.equal(git(sourceRoot,'rev-parse',SOURCE+'^').toString().trim(),'7885a4481249d5d754aec49140b7ccf6300c58db','EXACT_TEST_SOURCE_PARENT');assert.deepEqual(git(sourceRoot,'diff','--name-only','7885a4481249d5d754aec49140b7ccf6300c58db',SOURCE).toString().trim().split('\n').sort(),TEST_OVERLAY.rows.map(r=>r.path).sort(),'EXACT_TWO_TEST_COMMIT');assert.equal(git(sourceRoot,'rev-parse','7885a4481249d5d754aec49140b7ccf6300c58db^').toString().trim(),'a113022f03c5d28acd06af93a845bfcca8b08ff2','EXACT_FONT_SOURCE_PARENT');assert.deepEqual(git(sourceRoot,'diff','--name-only','a113022f03c5d28acd06af93a845bfcca8b08ff2','7885a4481249d5d754aec49140b7ccf6300c58db').toString().trim().split('\n'),['src/components/textbook/guided-math-reading.css'],'EXACT_ONE_CSS_COMMIT');assert.equal(git(sourceRoot,'rev-parse','a113022f03c5d28acd06af93a845bfcca8b08ff2^').toString().trim(),'384021f539967038a20fd98bd146e0e499f0df65','EXACT_PRIOR_REPAIR_PARENT');
 assert.deepEqual(git(sourceRoot,'diff','--name-only','384021f539967038a20fd98bd146e0e499f0df65','a113022f03c5d28acd06af93a845bfcca8b08ff2').toString().trim().split('\n').sort(),REPAIR_OVERLAY.rows.map(r=>r.path).sort(),'EXACT_THIRTEEN_PATH_COMMIT');
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
 const c48=path.join(dir,'w048-release-contract.json');
 const repaired=projectRetainedRepairMetadata({w046:fs.readFileSync(prepared.paths.w046,'utf8'),w047:fs.readFileSync(c47,'utf8'),w048:fs.readFileSync(c48,'utf8')},contract.repairOverlay,records);
 fs.writeFileSync(prepared.paths.w046,repaired.w046);fs.writeFileSync(c47,repaired.w047);fs.writeFileSync(c48,repaired.w048);
 edit(c48,old47hash,sha(c47),'downstream-exact-W047-contract-digest');
 edit(prepared.paths.w048,"['dist/w048-release.json','dist/w050-release.json','dist/w051-release.json']","['dist/w048-release.json','dist/w050-release.json','dist/w051-release.json','dist/qf01-release.json']",'exact-successor-manifest-exclusion');
 const qaDir=path.join(attempt,'w051-qa');fs.mkdirSync(qaDir);
 const qaContract=overlayTestSource(overlayFontSource(overlayRepairSource(overlayCurrentSource(projectContract(read(path.join(sourceRoot,QA,'B_contract.json')),contract.exactSourceProjection),contract.sourceOverlay),contract.repairOverlay),contract.fontOverlay),contract.testOverlay),qaContractFile=path.join(qaDir,'B_contract.json');write(qaContractFile,qaContract);
 replaceExact(fs.readFileSync(path.join(sourceRoot,QA,'B_contract.json'),'utf8'),fs.readFileSync(path.join(sourceRoot,QA,'B_contract.json'),'utf8'),fs.readFileSync(qaContractFile,'utf8'),'B-complete-frozen-319-to-324-and-Page-projection',records);
 let verifier=fs.readFileSync(path.join(sourceRoot,QA,'B_verify_browser.mjs'),'utf8');
 verifier=once(verifier,old.qa4['B_contract.json'],sha(qaContractFile),'B-fixed-derived-contract-raw-SHA');
 verifier=once(verifier,'assert.equal(report.retainedHashes.length,319);','assert.equal(report.retainedHashes.length,324);','B-full-source-inventory-count-only');
 const browser=path.join(qaDir,'B_verify_browser.mjs');fs.writeFileSync(browser,verifier);
 for(const name of ['B_display_checks.mjs','B_inline_fragment_checks.mjs'])fs.copyFileSync(path.join(sourceRoot,QA,name),path.join(qaDir,name));
 const files=[];function inventory(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())inventory(p);else if(e.isFile()&&e.name!=='PROVENANCE.json'&&e.name!=='PREPARED.json')files.push({path:path.relative(attempt,p),sha256:sha(p)});else if(e.isSymbolicLink())assert.equal(p,path.join(attempt,'material/node_modules'));}}inventory(attempt);
 const result={schema:'qf01-retained-adapters/1',sourceRoot,publisherRoot,baselineRoot,sourceSHA:SOURCE,outputRoot:attempt,paths:{...prepared.paths,browser,qaContract:qaContractFile},inputPins:verified.pins,projectionSHA256:PROJECTION,sourceOverlaySHA256:SOURCE_OVERLAY_SHA256,repairOverlaySHA256:REPAIR_OVERLAY_SHA256,fontOverlaySHA256:FONT_OVERLAY_SHA256,testOverlaySHA256:TEST_OVERLAY_SHA256,replacements:records,files,executed:false,publication:false,learnerAssertionsModified:false};
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
