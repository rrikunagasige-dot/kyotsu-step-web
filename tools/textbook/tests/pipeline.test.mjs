import { test } from 'node:test';import assert from 'node:assert/strict';
import { mkdtempSync,readFileSync,rmSync } from 'node:fs';import { tmpdir } from 'node:os';import { join,resolve } from 'node:path';
import { fraction,division,repeating,finite,finiteDenominators,answerCheck } from '../rules/n07.mjs';
import { verifyPlan } from '../verify.mjs';import { compileLesson } from '../compile-lesson.mjs';import { readJSON,hash } from '../util.mjs';
import { authorN07 } from '../fixtures/n07-author.mjs';import { safeOutput } from '../cli.mjs';import { runStage } from '../jobs.mjs';import { validateReviewPolicy } from '../../review-policy.mjs';
import { startState,currentNode,exposedResults,submit,advance } from '../visibility.mjs';
const fixture=readJSON(new URL('../fixtures/n07-source-index.json',import.meta.url));
const plan=()=>authorN07(fixture);
for(const [n,d,decimal,cycle] of [['3','4','0.75',null],['23','11','2.09',0],['1','6','0.16',1],['-1','8','-0.125',null],['2','1','2.',null]])test('exact long division '+n+'/'+d,()=>{const v=division(n,d);assert.equal(v.decimal,decimal);assert.equal(v.cycleStart,cycle);for(const s of v.steps){assert.equal(10n*BigInt(s.incoming),BigInt(d)*BigInt(s.digit)+BigInt(s.remainder));assert.ok(BigInt(s.remainder)>=0n&&BigInt(s.remainder)<BigInt(d));}});
test('zero divisor is rejected',()=>assert.throws(()=>division('1','0'),/zero denominator/));
for(const [digits,scale,answer] of [['8','10','8/9'],['69','100','23/33'],['6969','100','23/33'],['09','100','1/11']])test('cycle value and minimum scale '+digits,()=>{const r=repeating(digits);assert.equal(r.scale,scale);assert.equal(r.exact,answer);assert.equal(r.trace.length,9)});
test('0/9 repeating profiles do not manufacture a teaching trace',()=>{for(const x of ['0','9'])assert.equal(repeating(x).status,'UNSUPPORTED')});
test('finite decimal checks reduced denominator',()=>{assert.equal(finite('6/15').exact,'2/5');assert.equal(finite('6/15').finite,true);assert.equal(finite('1/12').finite,false);assert.equal(finite('2').finite,true)});
test('all19 range candidates are checked',()=>{const x=finiteDenominators(2,20);assert.equal(x.length,19);assert.deepEqual(x.filter(v=>v.finite).map(v=>v.a),[2,4,5,8,10,16,20])});
test('equivalence and required form differ',()=>{assert.deepEqual(answerCheck('69/99','23/33',{reduced:true}),{equivalent:true,formOK:false,correct:false});assert.equal(answerCheck('\\frac{23}{33}','23/33').correct,true)});
test('complete N07 design validates and compiles deterministically',()=>{const p=plan();assert.equal(verifyPlan(p).status,'PASS');assert.equal(hash(compileLesson(p)),hash(compileLesson(plan())));assert.equal(compileLesson(p).publishable,false);assert.equal(compileLesson(p).tables.length,1)});
const mutationCases=[
 ['future reference','FUTURE_RESULT',p=>p.nodes[0].knownRefs=[p.nodes.at(-1).resultId]],
 ['unintroduced definition','UNTAUGHT_CONCEPT',p=>p.nodes[0].requires.push('unknown-definition')],
 ['answer shown early','PREMATURE_RESULT',p=>p.nodes[0].visibleBeforeResults=[p.nodes[0].resultId]],
 ['wrong problem scope','CROSS_PROBLEM_SCOPE',p=>p.nodes[3].knownRefs=[p.nodes[0].resultId]],
 ['missing unnumbered source','SOURCE_OMISSION',p=>p.coverage.pop()],
 ['duplicate item','DUPLICATE_ITEM',p=>p.nodes[1].interaction.id=p.nodes[0].interaction.id],
 ['equivalent distractor','EQUIVALENT_DISTRACTOR',p=>{const q=p.nodes.find(n=>n.interaction?.answer==='\\frac{23}{33}').interaction;q.taskContract='exact';q.choices.push('69/99')}],
 ['source reverse correspondence','REVERSE_COVERAGE_LINK',p=>{const c=p.coverage.find(c=>c.nodeIds.length>1);c.nodeIds.pop()}],
 ['original question mismatch','SOURCE_QUESTION_MISMATCH',p=>p.sourceCatalog.find(s=>s.questionMarkers.length).questionMarkers=[14]],
 ['missing order node','ORDER_COVERAGE',p=>p.orderedNodeIds.pop()],
];
for(const [name,code,change] of mutationCases)test('fault injection: '+name,()=>{const p=plan();change(p);assert.ok(verifyPlan(p).findings.some(f=>f.code===code));assert.throws(()=>compileLesson(p))});
test('empty selected unit cannot PASS',()=>assert.equal(verifyPlan({...plan(),nodes:[],orderedNodeIds:[]}).status,'FAIL'));
test('past known result reuse is permitted when designed',()=>{const p=plan();const n=p.nodes.find(n=>n.operation==='reuse');assert.ok(n.knownRefs.length);assert.equal(verifyPlan(p).status,'PASS')});
test('raw source stays out of public repo and production writes are refused',()=>{for(const p of ['src/candidate.json','public/candidate.json','.github/candidate.json'])assert.throws(()=>safeOutput(p),/production/);assert.throws(()=>safeOutput('work/raw-source.json',{source:true}),/raw source/)});
test('source revision mismatch stops authoring',()=>assert.throws(()=>authorN07({...fixture,documentHash:'0'.repeat(64)}),/revision mismatch/));
test('job reuse fingerprints inputs, implementation and stored output; failure is resumable',()=>{const temp=mkdtempSync(join(tmpdir(),'ks-job-'));try{const path=join(temp,'job.json');let count=0;const opts={path,stage:'author',input:{x:1},implementationHash:'a',produce:()=>({n:++count})};assert.equal(runStage(opts).cached,false);assert.equal(runStage(opts).cached,true);assert.equal(runStage({...opts,implementationHash:'b'}).cached,false);assert.throws(()=>runStage({...opts,input:{x:2},produce:()=>{throw Error('interrupted')}}));assert.equal(readJSON(path).stages.author.resumeStage,'author');assert.equal(runStage({...opts,input:{x:2}}).cached,false);assert.ok(readJSON(path).history.some(e=>e.status==='FAIL'))}finally{rmSync(temp,{recursive:true,force:true})}});
test('current review policy rejects retired approval requirements',()=>{const policy=JSON.parse(readFileSync(resolve('governance/REVIEW_POLICY.json'),'utf8'));assert.deepEqual(validateReviewPolicy(policy),[]);for(const key of ['screenshotApprovalRequired','repeatPublicationApproval'])assert.ok(validateReviewPolicy({...policy,[key]:true}).length);assert.ok(validateReviewPolicy({...policy,exactSourceRequired:false}).length)});

test('verification FAIL never becomes a cached successful job',()=>{const temp=mkdtempSync(join(tmpdir(),'ks-fail-job-'));try{const path=join(temp,'job.json');assert.throws(()=>runStage({path,stage:'verify',input:{},implementationHash:'a',produce:()=>({status:'FAIL',findings:['bad proof']})}),/stage verification failed/);assert.equal(readJSON(path).stages.verify.status,'FAIL')}finally{rmSync(temp,{recursive:true,force:true})}});

test('exact arithmetic refuses already-rounded numeric input',()=>{assert.throws(()=>division(Number.MAX_SAFE_INTEGER+1,3),/unsafe/);assert.throws(()=>fraction(0.1),/exact strings/)});
test('all designed interactions require correct answers; wrong answers never reveal future results',()=>{const p=plan();let state=startState(),count=0;while(state.cursor<p.orderedNodeIds.length){const n=currentNode(p,state);assert.equal(exposedResults(p,state).has(n.resultId),false);for(const ref of n.knownRefs)assert.equal(exposedResults(p,state).has(ref),true);if(n.interaction){const wrong=submit(p,state,n.interaction.id,false);assert.equal(exposedResults(p,wrong).has(n.resultId),false);assert.throws(()=>advance(p,wrong),/answer required/);state=submit(p,wrong,n.interaction.id,true);assert.equal(exposedResults(p,state).has(n.resultId),true);count++;}state=advance(p,state);}assert.equal(count,36);assert.equal(state.completed.length,36)});

test('unmapped source explanations cannot be automatically treated as headings',()=>{const altered=structuredClone(fixture);altered.blocks.push({id:'word-p-999999',locator:'word/document.xml:p[999999]',kind:'explanation',markers:[],mathStructures:[]});assert.throws(()=>authorN07(altered),/unmapped source content/)});
