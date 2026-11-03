// Execute the proposed two-file bridge only in an isolated temporary copy.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
const b='work/items/W-MATH-047-n1112-guided-review/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),save=(p,x)=>fs.writeFileSync(b+p,JSON.stringify(x,null,2)+'\n');
const sha=s=>createHash('sha256').update(s).digest('hex');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'w047-bridge-'));
fs.cpSync('tools/textbook',path.join(tmp,'tools/textbook'),{recursive:true});
fs.symlinkSync(path.resolve('node_modules'),path.join(tmp,'node_modules'),'dir');
fs.symlinkSync(path.resolve('src'),path.join(tmp,'src'),'dir');
const files=['n11-source-binding.mjs','validate.mjs'];
for(const f of files)fs.copyFileSync(b+'proposed-tooling/'+f,path.join(tmp,'tools/textbook/transformation',f));
const {compileTransformationPresentation:compile}=await import(pathToFileURL(path.join(tmp,'tools/textbook/transformation/compile.mjs')));
const {validateTransformationPlan:check}=await import(pathToFileURL(path.join(tmp,'tools/textbook/transformation/validate.mjs')));
const prior=JSON.parse(execFileSync('git',['show','8d130e0f:src/data/textbook/math/numbers/n11Authored.json'],{encoding:'utf8'}));
const current=read(b+'MATERIALIZED_N11.json'),plan=n11TransformationPlan(current),oldPlan=n11TransformationPlan(prior);
const old=compile(prior,oldPlan),next=compile(current,plan);assert.equal(old.status,'PASS');assert.equal(next.status,'PASS');
next.compiled=JSON.parse(JSON.stringify(next.compiled));
const cases=[{id:'exact-old-source',status:old.status},{id:'exact-P006-source',status:next.status}];
const unknown=structuredClone(current);unknown.unit.title+='未登録の変更';
const badSource=check(unknown,n11TransformationPlan(unknown),{verifyMath:false});assert.equal(badSource.status,'FAIL');assert.ok(badSource.findings.some(f=>f.ruleId==='TG03_COVERAGE'));cases.push({id:'unknown-source-rejected',status:'PASS',actual:badSource.status});
for(const kind of ['changed','missing','additional','duplicate']){
 const bad=structuredClone(plan);
 if(kind==='changed')bad.graphs[0].states[0].statement.right.n='999';
 if(kind==='missing')bad.graphs.pop();
 if(kind==='additional')bad.graphs.push({...bad.graphs[0],id:'unregistered-graph'});
 if(kind==='duplicate')bad.graphs[2]=structuredClone(bad.graphs[0]);
 const r=check(current,bad,{verifyMath:false});assert.equal(r.status,'FAIL');assert.ok(r.findings.some(f=>f.ruleId==='TG03_COVERAGE'));cases.push({id:kind+'-graph-rejected',status:'PASS',actual:r.status});
}
const priorOverlay=read('src/data/textbook/math/numbers/n11Transformation.json');
for(const key of ['groups','interactions','gradingHash','numberAliases','scope'])assert.deepEqual(next.compiled[key],priorOverlay[key],key);
save('proposed-tooling/MATERIALIZED_N11_TRANSFORMATION.json',next.compiled);
save('evidence/PROPOSED_BRIDGE_CHECK.json',{status:'PASS',execution:'isolated temporary tooling copy; active tools/product unchanged',cases,groupsUnchanged:true,interactionsUnchanged:true,gradingHashUnchanged:true,oldSourceAccepted:true,unknownSourceRejected:true,newBaseIRHash:next.compiled.baseIRHash,mathReceipts:next.mathReceipts??next.validation?.mathReceipts??null});
const patch={files:files.map(f=>{const p='tools/textbook/transformation/'+f,before=fs.readFileSync(p,'utf8'),after=fs.readFileSync(b+'proposed-tooling/'+f,'utf8');return {path:p,before_sha256:sha(before),after_sha256:sha(after),after_text:after};})};save('proposed-tooling/PATCH.json',patch);
const activePath='src/data/textbook/math/numbers/n11Transformation.json',before=fs.readFileSync(activePath,'utf8'),after=JSON.stringify(next.compiled,null,2)+'\n';
const learner=read(b+'PATCH_N11.json');learner.files.push({path:activePath,before_sha256:sha(before),after_sha256:sha(after),after_text:after});save('proposed-tooling/PATCH_N11_WITH_BRIDGE.json',learner);
console.log(JSON.stringify({status:'PASS',cases:cases.length,activeToolsChanged:false,productChanged:false,newBaseIRHash:next.compiled.baseIRHash}));
