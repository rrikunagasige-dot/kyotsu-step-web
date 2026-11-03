// Current approved contract checks; historical Work files remain immutable.
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
import {validateTransformationPlan} from '../../../tools/textbook/transformation/validate.mjs';
const b='work/items/W-MATH-047-n1112-guided-review/',out=process.env.EVIDENCE_DIR??'/tmp/w047-current-check';fs.mkdirSync(out,{recursive:true});
const ref=process.env.BASELINE_REF??'929f3c5677758b55bcc583b84a6166b92a600f10';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),historical=p=>JSON.parse(execFileSync('git',['show',ref+':'+p],{encoding:'utf8'}));
const rows=[];
for(const c of ['n11','n12']){
 const p='src/data/textbook/math/numbers/'+c+'Authored.json',active=read(p),prior=historical(p),approved=read(b+'MATERIALIZED_'+c.toUpperCase()+'.json');
 const mode=JSON.stringify(active)===JSON.stringify(approved)?'APPROVED':'BASELINE';
 assert.deepEqual(active,mode==='APPROVED'?approved:prior,'Only fixed baseline or approved content is allowed');
 if(c==='n11')assert.equal(mode,'APPROVED');
 for(const k of ['nodes','stages','equationNumbers','semanticDisplay'])assert.deepEqual(active[k],prior[k],k);
 assert.equal(active.unit.unitId,prior.unit.unitId);assert.equal(active.unit.revision,prior.unit.revision);assert.deepEqual(active.unit.sections[0].items,prior.unit.sections[0].items);
 assert.deepEqual(active.unit.sections[0].readingFlow,active.semantic.nodes.flatMap(n=>[...n.before,...n.after]));
 const changes=active.semantic.nodes.filter((n,i)=>JSON.stringify(n)!==JSON.stringify(prior.semantic.nodes[i])).map(n=>n.id);
 assert.equal(changes.length,mode==='APPROVED'?(c==='n11'?6:5):0);
 rows.push({code:c,mode,changes,answers:active.unit.sections[0].items.length,revision:active.unit.revision});
}
const n11=read('src/data/textbook/math/numbers/n11Authored.json'),prior=historical('src/data/textbook/math/numbers/n11Authored.json');
const plan=n11TransformationPlan(n11),before=compileTransformationPresentation(prior,n11TransformationPlan(prior)),after=compileTransformationPresentation(n11,plan);
assert.equal(before.status,'PASS');assert.equal(after.status,'PASS');
const compiled=JSON.parse(JSON.stringify(after.compiled));assert.deepEqual(compiled,read('src/data/textbook/math/numbers/n11Transformation.json'));
assert.deepEqual(plan,read(b+'evidence/N11_G2_CORRECTION_DRAFT_PLAN.json'),'Only exact approved R1 presentation is allowed');
assert.deepEqual(compiled,read(b+'evidence/R1_COMPILED.json'),'Generated full artifact equals approved frozen R1 bytes');
for(const k of ['groups','interactions','gradingHash','numberAliases','scope'])assert.deepEqual(compiled[k],JSON.parse(JSON.stringify(before.compiled))[k]);
const cases=['old-source-accepted','approved-source-accepted'];
const unknown=structuredClone(n11);unknown.unit.title+='unregistered';
assert.ok(validateTransformationPlan(unknown,n11TransformationPlan(unknown),{verifyMath:false}).findings.some(f=>f.ruleId==='TG03_COVERAGE'));cases.push('unknown-source-rejected');
for(const mode of ['changed','missing','additional','duplicate']){
 const p=structuredClone(plan);if(mode==='changed')p.graphs[0].states[0].statement.right.n='999';if(mode==='missing')p.graphs.pop();if(mode==='additional')p.graphs.push({...p.graphs[0],id:'unregistered'});if(mode==='duplicate')p.graphs[2]=structuredClone(p.graphs[0]);
 const result=validateTransformationPlan(n11,p,{verifyMath:false});assert.equal(result.status,'FAIL');assert.ok(result.findings.some(f=>f.ruleId==='TG03_COVERAGE'));cases.push(mode+'-graph-rejected');
}
const projection=JSON.parse(execFileSync(process.execPath,['--experimental-strip-types',b+'verify_r1_projection.mjs'],{encoding:'utf8'}));
const result={status:'PASS',sourceSHA:process.env.CANDIDATE_SHA??process.env.GITHUB_SHA??null,rows,bridgeCases:cases,W038:'APPROVED_R1_TWO_ROW_RELOCATION; grading/graphs/numberAliases preserved',projection};
fs.writeFileSync(out+'/CURRENT_CONTRACTS.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
