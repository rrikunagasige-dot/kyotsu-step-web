import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {projectContract,overlayCurrentSource,replaceExact,SOURCE,BASELINE} from './qf01-retained-adapters.mjs';

// Fixed fixtures are supplied from immutable publisher/baseline checkouts by CI.
// Unit guard cases use the same frozen projection embedded in the successor contract.
const contractPath=process.env.QF01_CONTRACT;
const contract=contractPath?JSON.parse(fs.readFileSync(contractPath)):null;
test('exact replacement refuses missing and duplicate assertion sites',()=>{
 assert.throws(()=>replaceExact('assert(A)','assert(B)','assert(C)','missing'));
 assert.throws(()=>replaceExact('assert(A);assert(A)','assert(A)','assert(C)','duplicate'));
 assert.throws(()=>replaceExact('abc','','x','empty'));
});
test('replacement records literal, single count and complete before/after hashes',()=>{
 const rows=[],before='prefix assert(A) suffix';
 const after=replaceExact(before,'assert(A)','assert(B)','fixed metadata',rows);
 assert.equal(after,'prefix assert(B) suffix');assert.equal(rows.length,1);assert.equal(rows[0].count,1);
 for(const[k,v]of [['beforeSHA256',before],['afterSHA256',after]])assert.equal(rows[0][k],createHash('sha256').update(v).digest('hex'));
});
test('unapproved projection fails before contract rebinding',()=>{
 assert.throws(()=>projectContract({retained319:{},productHashes:{}},{}),/FROZEN_EXACT_SOURCE_PROJECTION/);
});
test('frozen current identities cannot drift',()=>{
 assert.equal(SOURCE,'384021f539967038a20fd98bd146e0e499f0df65');assert.equal(BASELINE,'1ac9f31ec205424f393a488f0d17cb3bb8bc75fd');
});
test('full approved projection preserves all unknown entries and rejects old-map drift',{skip:!contract},()=>{
 const projection=contract.exactSourceProjection;
 const oldPath=process.env.QF01_ORIGINAL_CONTRACT;assert.ok(oldPath,'QF01_ORIGINAL_CONTRACT required');
 const old=JSON.parse(fs.readFileSync(oldPath)),before=structuredClone(old),current=projectContract(old,projection);
 assert.deepEqual(old,before,'input is immutable');assert.equal(Object.keys(current.retained319).length,324);assert.equal(Object.keys(current.productHashes).length,8);
 const changed=new Set(projection.changedOriginalProtected.map(x=>x.path));for(const[p,h]of Object.entries(old.retained319))if(!changed.has(p))assert.equal(current.retained319[p],h);
 const bad=structuredClone(old);bad.retained319[projection.changedOriginalProtected[0].path]='0'.repeat(64);assert.throws(()=>projectContract(bad,projection),/EXACT_OLD_PROTECTED/);
 const unknown=structuredClone(projection);unknown.changedOriginalProtected[0].afterSHA256='0'.repeat(64);assert.throws(()=>projectContract(old,unknown),/FROZEN_EXACT_SOURCE_PROJECTION/);
 const absent=structuredClone(old);delete absent.retained319[Object.keys(absent.retained319)[0]];assert.throws(()=>projectContract(absent,projection));
});

test('exact six-row overlay rejects unknown, duplicate, missing, wrong-before and extra source changes',()=>{
 const frozen={"schema":"qf01-six-path-overlay/1","beforeSourceSHA":"46af88381ceba8d5e01ae5e26c64477eab42dbe9","afterSourceSHA":"384021f539967038a20fd98bd146e0e499f0df65","appByteEquivalentP011SHA":"ad5f0c22202b1cb78e1578646415aa858480b9e9","rows":[{"path":"src/data/textbook/math/mathCatalog.test.ts","beforeSHA256":"0ae2cfa4d5d25d37e07c430b2d4a15a6cf1d0e60b3454aad6f243a9774e58d18","afterSHA256":"e62d14488c4a00a35ba25426e455b77d15a36101686f5f95f3666865d4b1e615","bucket":"protected"},{"path":"src/data/textbook/math/mathCatalog.ts","beforeSHA256":"ddf09759921bfb7f254f41a4479704be8a0635f8b3eb9c972c5a9dd70a8a387e","afterSHA256":"3e89a3851bc8bfdf27d981307750f646f91724802e25af1a46d35beba46c48c6","bucket":"protected"},{"path":"src/data/textbook/math/quadratic/qf01Lesson.ts","beforeSHA256":"e2151cb0879d80a4d0b4bb58ac587c31d4fc9ef2dd9f9ee29470654855fd9b9e","afterSHA256":"f9e1d2957dbc2160eafb6274ace8dd83449f99f9c956ae46e94c7b04228fa43a","bucket":"protected"},{"path":"src/domain/textbookMath.test.ts","beforeSHA256":"ee16ad1a1db6ffac6d9987035919ced23d10dc48b176a98df9839e2c90d28db3","afterSHA256":"9aa400c208dc733e4d30998e87d92de06343da95676b10d98517bf239b964b3c","bucket":"protected"},{"path":"src/pages/LearningSetupPage.tsx","beforeSHA256":"830707a236991cdf3d70574dfa100bb53028d50712a3e6acb0a18c7fdb5a8e22","afterSHA256":"e6d9b80ed1c5c6fa4b11c8d2ab584796e3e6aa2e5e7c92b1e2b7f3f59e98d892","bucket":"protected"},{"path":"src/pages/TextbookUnitPage.tsx","beforeSHA256":"81de2df3dfa1047ac1805f2fe43ca3ec67874f59f109fd716ab35a638b29e279","afterSHA256":"4d707eba705517612df88f04c1864bca2b6aab2d05aeda8596f4e406bfcec117","bucket":"product"}],"scope":"Same332keys; sixexistingpaths;5protected1product; no newremovedsource","evidence":"Current raw p012-repo source bytes compared to exact main611 contract map; root/CI source384 equivalence must remain independently bound."};
 const protectedMap=Object.fromEntries(Array.from({length:319},(_,i)=>['src/fixed-'+i,'a'.repeat(64)]));
 const productHashes=Object.fromEntries(Array.from({length:7},(_,i)=>['src/product-'+i,'b'.repeat(64)]));
 for(const r of frozen.rows)(r.bucket==='product'?productHashes:protectedMap)[r.path]=r.beforeSHA256;
 const base={retained319:protectedMap,productHashes},before=structuredClone(base);
 const current=overlayCurrentSource(base,frozen);assert.deepEqual(base,before);
 assert.equal(Object.keys(current.retained319).length,324);assert.equal(Object.keys(current.productHashes).length,8);
 for(const row of frozen.rows)assert.equal((row.bucket==='product'?current.productHashes:current.retained319)[row.path],row.afterSHA256);
 for(const change of [x=>x.rows.pop(),x=>x.rows.push(x.rows[0]),x=>x.rows[0].afterSHA256='0'.repeat(64),x=>x.rows[0].path='src/unknown',x=>x.afterSourceSHA='0'.repeat(40)]){const bad=structuredClone(frozen);change(bad);assert.throws(()=>overlayCurrentSource(base,bad),/FROZEN_SIX_SOURCE_OVERLAY/);}
 const drift=structuredClone(base),r=frozen.rows[0];(r.bucket==='product'?drift.productHashes:drift.retained319)[r.path]='0'.repeat(64);assert.throws(()=>overlayCurrentSource(drift,frozen),/OVERLAY_BEFORE_HASH/);
});
