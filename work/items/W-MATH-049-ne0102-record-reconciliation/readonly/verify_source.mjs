// Proposed read-only source/HTTP checks. Does not modify app files or persistence.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const contract=JSON.parse(fs.readFileSync(process.env.QA_CONTRACT,'utf8'));
const out=path.resolve(process.env.EVIDENCE_DIR);
fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const localSHA=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
assert.equal(localSHA,contract.sourceSHA,'Immutable material checkout');
execFileSync('git',['diff','--exit-code','HEAD','--','src','public'],{stdio:'pipe'});
const checked=[];
for(const [relative,expected] of Object.entries(contract.sourceHashes)){
 assert.ok(!path.isAbsolute(relative)&&!relative.split('/').includes('..'));
 const actual=sha(fs.readFileSync(relative));assert.equal(actual,expected,relative);
 checked.push({path:relative,sha256:actual});
}
const authored=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/ne02Authored.json','utf8'));
assert.equal(authored.unit.unitId,contract.NE02.unitId);
assert.equal(authored.unit.revision,2);
assert.equal(authored.unit.sections.reduce((n,s)=>n+s.items.length,0),30);
async function get(relative){
 const url=new URL(relative,contract.base);url.searchParams.set('source',contract.sourceSHA);
 const res=await fetch(url,{signal:AbortSignal.timeout(30000),redirect:'error'});
 assert.equal(res.status,200,url.href);
 const bytes=Buffer.from(await res.arrayBuffer());return {url:url.href,bytes};
}
const retained={};
for(const name of ['release.json','w047-release.json','w046-release.json','w048-release.json']){
 const r=await get(name);assert.equal(sha(r.bytes),contract.manifestHashes[name],name+' exact published manifest');
 const m=JSON.parse(r.bytes.toString());assert.equal(m.sourceSHA,contract.sourceSHA,name);
 assert.equal(m.storageKey,contract.storageKey,name);
 assert.equal(m.publisherSHA??m.workflowSHA,contract.publisherSHA,name);
 fs.writeFileSync(path.join(out,name),r.bytes);retained[name]={manifest:m,sha256:sha(r.bytes),url:r.url};
}
const top=retained['w048-release.json'].manifest;
assert.equal(Object.keys(top.files).length,contract.filesExpected);
for(const name of ['release.json','w047-release.json','w046-release.json'])assert.equal(top.files[name],retained[name].sha256);
const publicFiles=[];
for(const [relative,expected] of Object.entries(top.files)){
 assert.ok(!relative.startsWith('/')&&!relative.split('/').includes('..')&&!relative.includes('://'));
 const r=await get(relative),actual=sha(r.bytes);assert.equal(actual,expected,relative);
 publicFiles.push({path:relative,sha256:actual,url:r.url});
}
fs.writeFileSync(path.join(out,'SOURCE_HTTP_REPORT.json'),JSON.stringify({status:'PASS_EXACT_SOURCE_AND_HTTP_BYTES',sourceSHA:localSHA,publisherSHA:contract.publisherSHA,base:contract.base,storageKey:contract.storageKey,localSourceHashes:checked,publicFilesVerified:publicFiles.length,publicFiles,NE02:{revision:2,answers:30},NE01:'Accepted numbers-data/helper closure remains unchanged; not a new NE01 browser review',userAcceptance:false,deploy:false},null,2)+'\n');
console.log(JSON.stringify({status:'PASS_EXACT_SOURCE_AND_HTTP_BYTES',sourceSHA:localSHA,files:publicFiles.length}));
