import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {n08TransformationPlan} from '../transformation/n08.mjs';
import {validateTransformationPlan} from '../transformation/validate.mjs';
import {compileTransformationPresentation} from '../transformation/compile.mjs';
import {projectTransformationView} from '../transformation/visible.mjs';
const ir=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Revision5.json')),plan=n08TransformationPlan(ir),clone=v=>JSON.parse(JSON.stringify(v));
const result=compileTransformationPresentation(ir,plan);assert.equal(result.status,'PASS');
test('four source-bound groups, eleven unchanged grading interactions and two meaning overrides',()=>{
 assert.equal(plan.groups.length,4);assert.equal(plan.candidates.length,11);assert.equal(plan.proseOverrides.length,2);assert.deepEqual(plan.groups.map(g=>g.number),[13,17,20,23]);
 assert.deepEqual(clone(result.compiled),JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Transformation.json')));
});
test('old source, original figure, grading and N11 display remain byte-identical',()=>{
 const manifest=JSON.parse(fs.readFileSync('work/items/W-MATH-039-n08-grouped-transformations/PROTECTED_MANIFEST.json'));
 const {createHash}=requireCrypto();for(const [path,digest]of Object.entries(manifest))assert.equal(createHash('sha256').update(fs.readFileSync(path)).digest('hex'),digest,path);
});
import * as crypto from 'node:crypto';function requireCrypto(){return crypto;}
test('unknown source is never admitted by the numeric N08 bridge',()=>{const source=clone(ir);source.unit.title+='x';const p=n08TransformationPlan(source);assert.equal(validateTransformationPlan(source,p,{verifyMath:false}).status,'FAIL');});
for(const [name,mutate] of [
 ['one-sided subtraction',p=>p.graphs[0].states[1].statement.right.args[1].args[1].n='2'],
 ['relation reversal',p=>p.graphs[2].states[2].statement.operator='>'],
 ['one-term negative',p=>p.graphs[1].states[2].statement.expression.args[1].args[0].n='1'],
 ['changed root',p=>p.graphs[0].states[0].statement.left.argument.n='6'],
 ['symbolic absolute without cases',p=>p.graphs[1].states[0].statement.expression.argument={kind:'symbol',name:'u'}],
 ['lost source block',p=>p.coverage.pop()],
 ['two unrelated answers in shared slots',p=>p.groups[0].rows[1].slots[1].interactionRef='n08-q06-subtract-answer'],
 ['forward calculation leak',p=>p.groups[0].rows[2].visibleAfter=[]],
 ['wrong prose source',p=>p.proseOverrides[0].sourceRefs=['invented']],
 ['self-answer prose gate',p=>p.proseOverrides[0].visibleAfterNodeId='n08-08'],
 ['changed grading choice',p=>p.candidates[0].choices.push('7')],
])test('reject '+name,()=>{const p=clone(plan);mutate(p);assert.equal(validateTransformationPlan(ir,p,{verifyMath:false}).status,'FAIL');});
test('external source boundaries prevent showing absolute rule application early',()=>{
 const v=projectTransformationView(result.compiled,[],{stageId:'n08-stage-07'});assert.deepEqual(v.groups,[]);
 const shown=projectTransformationView(result.compiled,[],{stageId:'n08-stage-07',boundarySolvedNodeIds:['n08-q07-rule']});assert.equal(shown.groups[0].rows.at(-1).current.id,'n08-q07-bracket-answer');assert.equal(shown.groups[0].rows.length,2);
});
test('two subtraction slots have one original answer and the subtraction symbol remains visible',()=>{
 const p=result.compiled.groups[0].rows[1];assert.equal(p.slots.length,2);assert.equal(new Set(p.slots.map(s=>s.interactionRef)).size,1);assert.deepEqual(p.masked.left.filter(x=>x.type==='math').map(x=>x.latex),['\\sqrt{5}','-']);
});
test('the multiplication model row retains both complete negative factors',()=>{
 assert.equal(result.compiled.groups[1].rows[2].completed.right[0].latex,'(-1)\\sqrt{5}+(-1)(-3)');assert.equal(result.compiled.groups[3].rows[2].completed.right[0].latex,'(-1)3+(-1)(-\\pi)');
});
test('saved later answers remain recorded but cannot open their missing prerequisites',()=>{
 const v=projectTransformationView(result.compiled,['n08-07'],{stageId:'n08-stage-07',boundarySolvedNodeIds:['n08-q07-rule']});assert.equal(v.groups[0].rows.length,2);assert.equal(v.groups[0].rows.at(-1).current.id,'n08-q07-bracket-answer');
});
test('prose modifications change the same approved plan and learner-copy hashes',()=>{
 const p=clone(plan);p.proseOverrides[0].after[0].text+='確認';const c=compileTransformationPresentation(ir,p);assert.equal(c.status,'PASS');assert.notEqual(c.compiled.planHash,result.compiled.planHash);assert.notEqual(c.compiled.learnerCopyHash,result.compiled.learnerCopyHash);
});
