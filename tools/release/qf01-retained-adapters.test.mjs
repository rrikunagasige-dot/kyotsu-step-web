import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {projectContract,replaceExact,SOURCE,BASELINE} from './qf01-retained-adapters.mjs';

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
 assert.equal(SOURCE,'46af88381ceba8d5e01ae5e26c64477eab42dbe9');assert.equal(BASELINE,'1ac9f31ec205424f393a488f0d17cb3bb8bc75fd');
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
