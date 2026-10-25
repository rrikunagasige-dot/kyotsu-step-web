import {test} from 'node:test';
import assert from 'node:assert/strict';
import {linearExample,squareExample,extremaExample,supportVariant} from '../fixtures/solution-examples.mjs';
import {validateIR,compileIR,visibleSnapshot} from '../ir/index.mjs';
import {validateGraph} from '../solution/graph.mjs';
import {verifySolution,verifyMathPayload} from '../solution/verify.mjs';
import {rat as r,sym,add,expr,relation,realLine} from '../solution/expression.mjs';
import {planBlanks,verifyBlankDecisions} from '../interaction/plan.mjs';
import {prepareSolutionReview,importSolutionReview} from '../ai/solution-review.mjs';
import {inspectResearch,prepareResearchAnalysis} from '../research/manifest.mjs';
import {importResearchAnalysis} from '../research/patterns.mjs';
import {hash} from '../util.mjs';

test('three authored families compile through the public v1/v2 entry with exact checks',()=>{
 for(const make of [linearExample,squareExample,extremaExample]){
  const ir=make(),out=compileIR(ir);assert.equal(validateIR(ir).status,'PASS');
  assert.equal(out.schemaVersion,'solution-reading/1');assert.equal(out.meaningAuditRequired,true);
  assert.ok(out.mathReceipts.every(r=>r.status==='PASS'));
 }
});
test('one decision binds both sides without becoming two questions',()=>{
 const c=compileIR(linearExample());const s=c.problems[0].steps[0];
 assert.equal(s.binding.slotIds.length,2);assert.equal((s.formula.masked.match(/boxed/g)??[]).length,2);
 assert.equal(c.problems[0].steps.filter(s=>s.interaction).length,4);
});
test('incorrect arithmetic and negative division direction are detected',()=>{
 const ir=linearExample();ir.problems[0].graph.states[2].statement.right=r(7);
 assert.ok(validateIR(ir).findings.some(f=>f.ruleId==='MATH_TRANSITION'));
 const g=linearExample().problems[0].graph;
 g.transitions=g.transitions.slice(0,1);g.transitions[0]={...g.transitions[0],ruleId:'divide-both-sides',operand:r(-2)};
 g.states=g.states.slice(0,2);g.states[1].statement=relation(add({kind:'multiply',args:[r(-3,2),sym('x')]},r(2)),'<=',r(-1));g.goalStateIds=[g.states[1].id];
 assert.equal(verifySolution(g).status,'FAIL');g.states[1].statement.operator='>=';assert.equal(verifySolution(g).status,'PASS');
});
test('numerically matching a few points does not replace identity checks',()=>{
 const ir=squareExample();ir.problems[0].graph.states[3].statement.expression.args[1]=r(-5);
 assert.equal(validateIR(ir).status,'FAIL');
});
test('vertex outside domain and open-domain non-attainment are handled exactly',()=>{
 const g=extremaExample().problems[0].graph;
 g.states[2].statement.value=r(1);g.states[2].statement.at=[r(3)];assert.equal(verifySolution(g).status,'FAIL');
 g.states[2].statement.value=r(2);g.states[2].statement.domain.upperOpen=true;g.states[2].statement.at=[];g.states[2].statement.attained=false;
 assert.equal(verifySolution(g).status,'PASS');
});
test('case partitions reject gaps, overlaps and missing endpoints',()=>{
 const cut={lower:r(0),upper:r(1),lowerOpen:false,upperOpen:false};
 const a={lower:r(0),upper:r(1,2),lowerOpen:false,upperOpen:true},b={lower:r(1,2),upper:r(1),lowerOpen:false,upperOpen:false};
 assert.equal(verifyMathPayload({kind:'partition',domain:cut,cases:[a,b]}).status,'PASS');
 b.lowerOpen=true;assert.equal(verifyMathPayload({kind:'partition',domain:cut,cases:[a,b]}).status,'FAIL');
 b.lowerOpen=false;a.upperOpen=false;assert.equal(verifyMathPayload({kind:'partition',domain:cut,cases:[a,b]}).status,'FAIL');
});
test('a mathematically equivalent answer can fail the requested form separately',()=>{
 const g=squareExample().problems[0].graph;
 g.transitions[0].requiredForm='completed-square';const out=verifySolution(g);
 assert.equal(out.checks[0].mathStatus,'PASS');assert.equal(out.checks[0].formStatus,'FAIL');
 g.transitions[0].requiredForm='expanded';assert.equal(verifySolution(g).checks[0].status,'PASS');
});
test('unjustified substitutions and unknown signs cannot silently pass',()=>{
 const g=linearExample().problems[0].graph;
 g.transitions[0]={...g.transitions[0],ruleId:'substitute',substitutions:{x:r(3)}};
 assert.equal(verifySolution(g).status,'FAIL');
 g.transitions[0]={...g.transitions[0],ruleId:'divide-both-sides',operand:sym('x')};
 assert.equal(verifySolution(g).status,'UNSUPPORTED');
});
test('equivalent distractors and broken factor grouping are rejected',()=>{
 const ir=linearExample();ir.problems[0].steps[0].interaction.choices[1].value=r(8,2);
 assert.ok(validateIR(ir).findings.some(f=>f.ruleId==='CHOICE_EQUIVALENCE'));
 const c=compileIR(squareExample());assert.match(c.problems[0].steps[1].formula.completed,/left\(x\+3/);
});
test('graph cycles, orphan states and future prerequisites fail structurally',()=>{
 const g=linearExample().problems[0].graph;g.transitions[0].requires.push('future');assert.equal(validateGraph(g).status,'FAIL');
 const b=linearExample().problems[0].graph;b.transitions[0].to=b.rootStateId;assert.equal(validateGraph(b).status,'FAIL');
});
test('semantic target tampering and local calculations not rejoined are detected',()=>{
 const ir=linearExample();ir.problems[0].steps[0].slotTargets[0].path='left.__proto__.x';assert.equal(validateIR(ir).status,'FAIL');
 const b=linearExample();b.problems[0].steps[0].detail=[{type:'text',id:'detail-text',text:'補助計算'}];
 assert.ok(validateIR(b).findings.some(f=>f.ruleId==='LOCAL_CALCULATION_NOT_REJOINED'));
});
test('visible review excludes rationale, answers, unopened hints and future rows',()=>{
 const ir=linearExample(),v=visibleSnapshot(ir,'fixture-linear-step0');const raw=JSON.stringify(v);
 assert.ok(!raw.includes('correctValue'));assert.ok(!raw.includes('feedback'));assert.ok(!raw.includes('商を計算'));assert.equal(v.completed.length,0);
 assert.throws(()=>visibleSnapshot(ir,'fixture-linear-step2',[]),/UNSOLVED/);
});
test('support variants share checked math rather than drifting copies',()=>{
 const ir=squareExample(),light=supportVariant(ir,'light');assert.equal(hash(ir.problems[0].graph),hash(light.problems[0].graph));
 assert.equal(compileIR(light).problems[0].steps.filter(s=>s.interaction).length,1);
});
test('blank roles require available facts and an explicit adoption decision',()=>{
 const graph=linearExample().problems[0].graph;
 const plan=planBlanks({graph,candidates:[{id:'c',stateId:graph.rootStateId,availableFacts:['future'],learnerDecision:'操作',target:'left',nextUse:'next'}]});
 assert.equal(plan.candidates[0].eligibility,'INELIGIBLE');
 assert.equal(verifyBlankDecisions(plan,[{candidateId:'c',decision:'ADOPT',reason:'必要',evidence:'step'}]).status,'FAIL');
});
test('meaning reviews are bound to visible inputs, phase, sources and case consumption',()=>{
 const v=visibleSnapshot(linearExample(),'fixture-linear-step0');
 const request=prepareSolutionReview(v,{phase:'pre-design',sourceRefs:['source'],caseIds:['case']}).request;
 const response={requestHash:request.requestHash,phase:'pre-design',reviewer:'same-assistant',learnerDecision:'定数を消す',availableInformation:'元の不等式と既習性質',reasonToProceed:'同じ数を両辺へ足せる',nextWholeState:'両辺に加えた式',misconception:'片辺だけの操作',reducedSupportVariant:'次は操作も選ぶ',findings:[],caseDispositions:[{caseId:'case',status:'APPLIED',evidence:'対象の穴'}]};
 assert.equal(importSolutionReview(request,response).status,'PASS');response.phase='post-implementation';assert.equal(importSolutionReview(request,response).status,'FAIL');
 assert.equal(prepareSolutionReview({...v,expected:4},{phase:'x',sourceRefs:['s']}).status,'FAIL');
});
test('research analysis keeps source positions, observation and inference separate',()=>{
 const extraction={sourceId:'s',contentHash:'a'.repeat(64),blocks:[{id:'b1',text:'平方完成',location:{line:1}}]};
 const manifest={schemaVersion:'research-manifest/1',topic:'二次関数',requirements:[{id:'q',description:'平方完成'}],sources:[{id:'s',url:'https://example.org/source',version:'1',kind:'reference',uses:['analyze'],rights:'分析のみ',contentHash:'a'.repeat(64),locations:['b1'],requirementIds:['q'],state:'REVIEWED'}]};
 assert.equal(inspectResearch(manifest).status,'PASS');
 const req=prepareResearchAnalysis(manifest,extraction).request;
 const res={requestHash:req.requestHash,reviewer:'same-assistant',observedSteps:[{description:'平方完成の形を示す',blockIds:['b1']}],inferredMissingSteps:[],blankRoles:[],figureTiming:[],applicablePatterns:[],uncertainties:[]};
 assert.equal(importResearchAnalysis(req,res).status,'PASS');res.observedSteps[0].blockIds=['missing'];assert.equal(importResearchAnalysis(req,res).status,'FAIL');
 manifest.sources[0].uses.push('train');assert.equal(inspectResearch(manifest).status,'FAIL');
});
test('figure is generated from original function and is gated after the answer',()=>{
 const c=compileIR(extremaExample()),p=c.problems[0];assert.equal(p.plot.visibleAfterStateId,p.steps.at(-1).afterId);
 assert.equal(p.plot.domainPoints.at(-1)[1],2);assert.deepEqual(p.plot.vertex,[3,1]);
});
