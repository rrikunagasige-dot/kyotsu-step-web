import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verifyBundle,validateBundle} from '../solution/bundle.mjs';
import {n08Bundle} from '../fixtures/n08-bundle.mjs';
import {rat as r,sym,relation,realLine} from '../solution/expression.mjs';
const design=JSON.parse(fs.readFileSync('work/items/W-MATH-037-n08-workflow-trial/NODE_DESIGN.json'));
const make=()=>n08Bundle(design);
const segment=(b,id)=>b.problems.flatMap(p=>p.segments).find(s=>s.id===id);
test('all N08 elementary segments are checked, without certifying prose',()=>{
 const out=verifyBundle(make());assert.equal(out.status,'PASS');assert.equal(out.checks.length,38);assert.equal(out.formalProof,false);assert.equal(out.meaningAuditRequired,true);
 const rows=out.checks.find(s=>s.segmentId==='positive-distance-form').choices;
 assert.deepEqual(rows.find(r=>r.id==='sum-of-coordinates'),{id:'sum-of-coordinates',mathStatus:'PASS',formStatus:'FAIL'});
});
test('Abs(a)=a without its sign restriction fails',()=>{
 const b=make();segment(b,'definition-nonnegative').domain=realLine;assert.equal(verifyBundle(b).status,'FAIL');
});
test('conditional results cannot escape their domain',()=>{
 const b=make();segment(b,'negative-substitution').requires=['definition-nonnegative-fact'];assert.ok(verifyBundle(b).checks.some(r=>r.reason==='CONDITIONAL_FACT_OUTSIDE_SCOPE'));
});
test('case joins detect a missing zero and overlapping branches',()=>{
 for(const kind of ['gap','overlap']){const b=make();const s=segment(b,'opposite-all');
 if(kind==='gap')s.check.branches=s.check.branches.slice(0,2);
 else {s.check.branches[0].domain.lowerOpen=false;segment(b,'opposite-positive').domain.lowerOpen=false;}
 assert.equal(verifyBundle(b).status,'FAIL');}
});
test('squared order is not used with negative original numbers',()=>{
 const b=make();const s=segment(b,'positive-root-order');s.check.left=r(-3);s.check.right=r(-2);s.check.operator='>';assert.equal(verifyBundle(b).status,'FAIL');
});
test('false pi/root signs and distribution are rejected exactly',()=>{
 for(const id of ['pi-order','root-negative','root-distribute']){const b=make(),s=segment(b,id);
 if(s.check.statement)s.check.statement.operator='>';else s.check.right=r(3);
 assert.equal(verifyBundle(b).status,'FAIL',id);}
});
test('equivalence needs both correctly scoped implications',()=>{
 const b=make();segment(b,'zero-forward').domain=realLine;assert.equal(verifyBundle(b).status,'FAIL');
 const c=make();segment(c,'zero-iff').check.reverseProof='zero-forward-fact';assert.equal(verifyBundle(c).status,'FAIL');
});
test('future or another problem facts cannot be referenced',()=>{
 for(const fact of ['root-final-fact','distance-right-fact']){const b=make();segment(b,'root-square').requires=[fact];assert.equal(validateBundle(b).status,'FAIL');}
});
test('case proof must establish the declared claim',()=>{
 const b=make();segment(b,'opposite-positive').check.statement=relation(sym('a'),'=',sym('a'));assert.equal(verifyBundle(b).status,'FAIL');
});
test('unknown AST and arbitrary radical arguments stay outside supported scope',()=>{
 const b=make();segment(b,'root-square').check.left={kind:'sqrt',argument:sym('a')};assert.equal(verifyBundle(b).status,'FAIL');
});
import {planBundleBlanks} from '../interaction/plan.mjs';
import {operate} from '../operations.mjs';
test('blank candidates cannot acquire a future or other problem fact',()=>{
 const bundle=make(),candidate={id:'c',nodeId:'n08-r5-q06-operation',segmentId:'root-both-sides',learnerDecision:'choose the common subtrahend',nextUse:'form the original interior',target:'operand',availableFacts:['positive-root-order-fact']};
 assert.equal(planBundleBlanks({bundle,candidates:[candidate]}).candidates[0].eligibility,'ELIGIBLE');candidate.availableFacts=['root-final-fact'];assert.equal(planBundleBlanks({bundle,candidates:[candidate]}).candidates[0].eligibility,'INELIGIBLE');
});
test('batched meaning review keeps each visible state separate and rejects answer leakage',()=>{
 const input={reviews:[{id:'n',visible:{initial:{latex:'|a|'},current:{latex:'|a|=A'}},context:{phase:'pre-design',sourceRefs:['original']}}]};
 assert.equal(operate('solution-review',input).status,'NEEDS_AI_REVIEW');input.reviews[0].visible.current.expected='a';assert.equal(operate('solution-review',input).status,'FAIL');
});

test('a transformation must start from an established, true premise',()=>{
 const b=make();segment(b,'root-both-sides').requires=['root-square-fact'];assert.equal(verifyBundle(b).status,'FAIL');
 const c=make();const s=segment(c,'root-both-sides');s.check.before=relation(r(3),'<',r(2));s.check.after=relation(r(0),'<',r(-1));assert.equal(verifyBundle(c).status,'FAIL');
});
