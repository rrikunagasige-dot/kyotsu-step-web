// Input adapter: existing approved compiler + unchanged active presentation.
// Writes only inactive Work artifacts. Product changes go through Runtime patch.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {operate} from '../../../tools/textbook/operations.mjs';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
const base='work/items/W-MATH-047-n1112-guided-review/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const save=(p,x)=>fs.writeFileSync(base+p,JSON.stringify(x,null,2)+'\n');
const hash=x=>createHash('sha256').update(x).digest('hex');
const snapshot='8d130e0f';
const historical=p=>JSON.parse(execFileSync('git',['show',snapshot+':'+p],{encoding:'utf8'}));
const ids=x=>Array.isArray(x)?x.flatMap(ids):x&&typeof x==='object'?[...(x.id?[x.id]:[]),...Object.values(x).flatMap(ids)]:[];
const patches={},report={status:'PASS',baseline:snapshot,units:{},aliasMap:{}};
for(const code of ['n11','n12']){
 const path='src/data/textbook/math/numbers/'+code+'Authored.json';
 const active=historical(path),out=structuredClone(active);
 const original=read('work/items/W-MATH-036-ne02-n11-n12-guided-design/'+code.toUpperCase()+'_IR.json');
 const ir=read(base+code.toUpperCase()+'_CANDIDATE_IR.json');
 const result=operate('compile-ir',ir);assert.equal(result.status,'PASS');
 const compiled=result.compiled,changed=[];
 assert.deepEqual(original.nodes.map(n=>n.interaction),ir.nodes.map(n=>n.interaction));
 for(let i=0;i<ir.nodes.length;i++){
  const old=original.nodes[i],node=ir.nodes[i];assert.equal(old.id,node.id);
  const fields=Object.keys(node).filter(k=>JSON.stringify(node[k])!==JSON.stringify(old[k]));
  if(!fields.length)continue;
  assert.ok(fields.every(k=>['before','after'].includes(k)));
  const source=compiled.nodes.find(n=>n.id===node.id),target=out.semantic.nodes.find(n=>n.id===node.id);
  for(const field of fields){
   let blocks=structuredClone(source[field]);
   // The paragraph slot replaces the same displayed question; retain its stable block ID.
   if(node.id==='n12-q13-operation'&&field==='before'){
    const b=blocks.find(b=>b.id===node.id+'-interaction');
    b.id=node.id+'-interaction-0';report.aliasMap[node.id+'-interaction']=b.id;
   }
   if(node.id==='n12-04'&&field==='after'){
    const explanation=blocks.find(b=>b.id==='w47-n12-04-endpoint-explanation');
    const existing=blocks.find(b=>b.id==='n12-04-after');
    existing.parts=[...explanation.parts,{type:'text',text:' '},...existing.parts];
    blocks=blocks.filter(b=>b!==explanation);
    report.aliasMap[explanation.id]=existing.id;
   }
   target[field]=blocks;
  }
  changed.push({id:node.id,fields});
 }
 assert.equal(changed.length,code==='n11'?6:5);
 out.irHash=compiled.irHash;out.semantic.irHash=compiled.irHash;
 out.semantic.semanticMap=compiled.semanticMap;
 out.semantic.expectedSemanticIds=compiled.expectedSemanticIds;
 out.unit.sections[0].readingFlow=out.semantic.nodes.flatMap(n=>[...n.before,...n.after]);
 out.approvedCommit='36a781c732a9638289430cab2ded37d7b5404bdd';
 out.proposalHash=read(base+'APPROVAL.json').proposal.hash;
 assert.deepEqual(out.nodes,active.nodes);assert.deepEqual(out.stages,active.stages);
 assert.deepEqual(out.unit.sections[0].items,active.unit.sections[0].items);
 assert.equal(out.unit.revision,active.unit.revision);assert.equal(out.unit.unitId,active.unit.unitId);
 assert.deepEqual(out.equationNumbers,active.equationNumbers);
 assert.deepEqual(out.semanticDisplay,active.semanticDisplay);
 assert.deepEqual(ids(out),ids(active),'All stable id/order fields remain identical');
 for(const node of active.semantic.nodes)if(!changed.some(c=>c.id===node.id))assert.deepEqual(out.semantic.nodes.find(n=>n.id===node.id),node);
 const before=execFileSync('git',['show',snapshot+':'+path],{encoding:'utf8'}),after=JSON.stringify(out,null,2)+'\n';
 patches[code]={files:[{path,before_sha256:hash(before),after_sha256:hash(after),after_text:after}]};
 report.units[code]={irHash:compiled.irHash,changed,answers:out.unit.sections[0].items.length,revision:out.unit.revision,stableIds:'IDENTICAL',grading:'IDENTICAL',numbering:'IDENTICAL',semanticDisplay:'IDENTICAL'};
 save('MATERIALIZED_'+code.toUpperCase()+'.json',out);
 if(code==='n11'){
  const old=historical('src/data/textbook/math/numbers/n11Transformation.json');
  const plan=n11TransformationPlan(out),result=compileTransformationPresentation(out,plan);save('evidence/N11_REBIND_COMPILE.json',result);
  save('N11_TRANSFORMATION_PLAN.json',plan);
  if(result.status!=='PASS'){
   report.status='BLOCKED';report.bindingFailure=result;
  }else{
  result.compiled=JSON.parse(JSON.stringify(result.compiled));
  for(const key of ['groups','gradingHash','coverage','numberAliases'])if(key in old)assert.deepEqual(result.compiled[key],old[key],key);
  const p='src/data/textbook/math/numbers/n11Transformation.json',prior=execFileSync('git',['show',snapshot+':'+p],{encoding:'utf8'}),next=JSON.stringify(result.compiled,null,2)+'\n';
  assert.deepEqual(ids(result.compiled),ids(old));
  patches[code].files.push({path:p,before_sha256:hash(prior),after_sha256:hash(next),after_text:next});
  save('N11_TRANSFORMATION_PLAN.json',plan);save('evidence/N11_REBIND_COMPILE.json',result);
  }
 }
 save('PATCH_'+code.toUpperCase()+'.json',patches[code]);
}
save('evidence/MATERIALIZATION_CHECK.json',report);
console.log(JSON.stringify(report));
if(report.status!=='PASS')process.exitCode=1;
