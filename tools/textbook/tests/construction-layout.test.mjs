import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rat,add,sym,mul,statementLatex} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
import {validateConstructionPlan,verifyConstructionMath,assembleConstruction,gradeConstruction,compileConstruction,projectConstruction} from '../interaction/construction.mjs';
import {validateLayoutPlan,projectLayout,checkLayoutGeometry} from '../layout/plan.mjs';
import {createN08ConstructionPlan,createN08LayoutPlan,n08Revision6TransformationPlan,materializeN08Revision6Design} from '../transformation/n08-r6.mjs';
import {n08TransformationPlan} from '../transformation/n08.mjs';
import {validateTransformationPlan} from '../transformation/validate.mjs';
import {compileTransformationPresentation} from '../transformation/compile.mjs';
import {projectTransformationView} from '../transformation/visible.mjs';
import {prepareSolutionReview,importSolutionReview} from '../ai/solution-review.mjs';
import {verifyMathPayload} from '../solution/verify.mjs';
import {twoDecisionExample} from '../fixtures/transformation-examples.mjs';
import {planTransformations} from '../transformation/plan.mjs';
const ir=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Revision5.json'));
const clone=v=>JSON.parse(JSON.stringify(v)),plan=createN08ConstructionPlan(ir),layout=createN08LayoutPlan(ir),v2=n08Revision6TransformationPlan(ir),correct=i=>Object.fromEntries(i.parts.map(p=>[p.id,p.expected]));
const interaction=node=>plan.interactions.find(i=>i.sourceNodeId===node);
const product=parts=>parts.reduce((drafts,p)=>drafts.flatMap(d=>p.choices.map(c=>({...d,[p.id]:c.value}))),[{}]);

test('exact approved N08 inventory: fresh eleven parents and fifteen independent parts',()=>{
 assert.equal(validateConstructionPlan(plan).status,'PASS');assert.equal(plan.interactions.length,11);assert.equal(plan.interactions.flatMap(i=>i.parts).length,15);
 const approved=JSON.parse(fs.readFileSync('work/items/W-MATH-040-n08-construction-layout/CONSTRUCTION_CONTRACTS.json'));
 assert.deepEqual(plan.interactions.map(i=>[i.sourceNodeId,i.id,i.parts.map(p=>[p.id,p.role,p.expected,p.choices.map(c=>c.value)])]),approved.interactions.map(i=>[i.sourceNodeId,i.newInteractionId,i.parts.map(p=>[p.id,p.role,p.expected,p.candidates])]));
});
test('full materializer keeps all 39 source nodes and all 38 original math segments',()=>{
 const sourceBundle=JSON.parse(fs.readFileSync('work/items/W-MATH-037-n08-workflow-trial/SOLUTION_BUNDLE_R5.json')),out=materializeN08Revision6Design(ir,{sourceBundle});
 assert.deepEqual(out.inventory,{sourceNodes:39,legacyAnswers:34,unchangedAnswers:22,newConstructionParents:11,independentParts:15,requiredParentAnswers:33,noAnswerNodes:6});
 assert.equal(out.sourceBundleVerified,true);assert.equal(out.sourceSegmentCount,38);assert.equal(out.nodes.length,39);assert.equal(out.nodes.filter(n=>n.interactionId).length,33);assert.equal(out.activeLessonChanged,false);
 assert.equal(out.retiredOnlyInRevision6[0].oldRecordPreserved,true);const changed=clone(sourceBundle);changed.problems[0].segments.pop();assert.throws(()=>materializeN08Revision6Design(ir,{sourceBundle:changed}),/SOURCE_BUNDLE_CHANGED/);
});
test('no parent grading occurs before all independent parts are present',()=>{
 const i=interaction('n08-q07-distribute'),draft={[i.parts[0].id]:'-'};
 const r=gradeConstruction(i,draft);assert.equal(r.status,'INCOMPLETE');assert.equal(r.complete,false);assert.ok(!Object.hasOwn(r,'correct'));
 assert.equal(gradeConstruction(i,{...draft,[i.parts[1].id]:'3'}).correct,true);
 assert.equal(gradeConstruction(i,{...draft,[i.parts[1].id]:'-3'}).correct,false);
 assert.equal(assembleConstruction(i,{unknown:'3'}).status,'FAIL');
});
test('remaining term follows the chosen signed term, including a wrong requested order',()=>{
 const i=interaction('n08-07'),p=i.parts[0];assert.equal(p.choices.length,2);
 const before=projectConstruction(i);assert.ok(before.formula.tokens.some(t=>t.type==='derived-slot'));assert.ok(!JSON.stringify(before).includes('expected'));
 const wrong={[p.id]:'-\\sqrt5'},built=gradeConstruction(i,wrong);assert.equal(built.correct,false);assert.equal(built.reason,'SPECIFIED_ORDER_MISMATCH');assert.equal(built.latex,'-\\sqrt{5}+3');
 const visible=projectConstruction(i,wrong);assert.equal(visible.formula.tokens.map(t=>t.latex??'').join(''),'-\\sqrt{5}+3');
 assert.equal(gradeConstruction(i,correct(i)).latex,'3-\\sqrt{5}');
});
test('all finite combinations assemble and are independently checked as expressions',()=>{
 const cases=plan.interactions.flatMap(i=>product(i.parts).map((draft,index)=>({i,draft,index})));assert.equal(cases.length,33);
 const items=cases.map(({i,draft,index})=>{
  const built=assembleConstruction(i,draft);assert.equal(built.status,'COMPLETE');
  const actual=built.statement.kind==='expression'?built.statement.expression:built.statement.right;
  const expected=i.expectedStatement.kind==='expression'?i.expectedStatement.expression:i.expectedStatement.right;
  return {id:i.id+'-'+index,payload:{graph:{states:[{id:'a',statement:{kind:'expression',expression:expected}},{id:'b',statement:{kind:'expression',expression:actual}}],transitions:[{id:'rewrite',from:'a',to:'b',ruleId:'rewrite'}]}}};
 });
 const checked=verifyMathPayload({kind:'batch',items});assert.equal(checked.results.length,33);
 for(const [index,c]of cases.entries()){
  const grade=gradeConstruction(c.i,c.draft),equivalent=checked.results[index].status==='PASS';
  if(c.i.gradingPurpose==='specified-order')assert.equal(equivalent,true,'both orders have the same value');
  else assert.equal(grade.correct,equivalent,c.i.id+JSON.stringify(c.draft));
 }
});
test('runtime math validator checks every finite combination and algebraically duplicate candidates',()=>{
 const out=verifyConstructionMath(plan);assert.equal(out.status,'PASS',JSON.stringify(out.findings));assert.equal(out.caseCount,33);assert.ok(out.candidateCheckCount>0);assert.equal(out.formalProof,false);
 assert.ok(out.caseReceipts.some(r=>r.specifiedOrderMismatch&&r.mathematicallyEquivalent));
 const p=clone(plan);p.interactions[0].parts[0].choices.push({value:'zero-as-sum',expression:add(rat(0),rat(0))});assert.equal(validateConstructionPlan(p).status,'PASS');
 const bad=verifyConstructionMath(p);assert.equal(bad.status,'FAIL');assert.ok(bad.findings.some(f=>f.ruleId==='CONSTRUCTION_EQUIVALENT_CHOICE'));
 assert.equal(verifyConstructionMath(plan,{maxTotalCases:1}).status,'UNSUPPORTED');assert.equal(verifyConstructionMath(plan,{python:'/definitely/missing/python'}).status,'UNSUPPORTED');
});
for(const [name,mutate,rule]of [
 ['whole expression in rational hole',p=>p.interactions[3].parts[0].choices[0].expression=add(rat(2),rat(3)),'STRUCTURE_ROLE_MISMATCH'],
 ['unary sign declared binary',p=>p.interactions[2].parts[0].role='binary-operation','STRUCTURE_ROLE_MISMATCH'],
 ['duplicate equivalent rational choice',p=>p.interactions[3].parts[0].choices.push({value:'10/2',expression:rat(10,2)}),'CONSTRUCTION_EQUIVALENT_CHOICE'],
 ['corrupted expected assembly',p=>p.interactions[3].expectedStatement.right=rat(6),'CONSTRUCTION_ASSEMBLY'],
 ['derived term silently made correct',p=>p.interactions[6].assembly.expression.right.terms.reverse(),'CONSTRUCTION_DERIVED_POOL'],
 ['self prerequisite',p=>p.interactions[0].prerequisiteInteractionIds=[p.interactions[0].id],'CONSTRUCTION_PREREQUISITE'],
])test('reject '+name,()=>{const p=clone(plan);mutate(p);const out=validateConstructionPlan(p);assert.equal(out.status,'FAIL');assert.ok(out.findings.some(f=>f.ruleId===rule),JSON.stringify(out));});

test('known subtrees stay compact and all rendered independent slots have typed roles',()=>{
 const i=interaction('n08-q07-bracket'),c=compileConstruction(i);
 assert.deepEqual(c.tokens.map(t=>t.type),['slot','math','math','math']);assert.equal(c.tokens[2].latex,'\\sqrt{5}-3');
 assert.equal(c.tokens[0].role,'unary-sign');assert.equal(compileConstruction(interaction('n08-09')).completed.latex,'\\pi-3');
});
test('layout has four rows and one essential note for each numeric absolute derivation',()=>{
 assert.equal(validateLayoutPlan(layout).status,'PASS');
 const g=layout.groups[1],i=interaction('n08-q07-bracket'),d=interaction('n08-q07-distribute'),last=interaction('n08-07');
 assert.equal(g.rowIds.length,4);assert.equal(g.prose.filter(p=>p.role==='essential-note').length,1);
 const initial=projectLayout(layout,g.id,{visibleRowIds:g.states.initial,currentInteractionId:i.id});assert.equal(initial.prose.filter(p=>p.role==='active-prompt').length,1);assert.equal(initial.prose.filter(p=>p.role==='essential-note').length,0);assert.equal(initial.numberVisible,true);assert.equal(initial.numberRowRef,g.states.initial.at(-1));assert.notEqual(initial.numberRowRef,initial.completeNumberRowRef);
 const partial=projectLayout(layout,g.id,{visibleRowIds:g.states.partial,solvedIds:[i.id],currentInteractionId:d.id});assert.equal(partial.prose.filter(p=>p.role==='essential-note').length,1);
 const complete=projectLayout(layout,g.id,{visibleRowIds:g.states.complete,solvedIds:[i.id,d.id,last.id]});assert.equal(complete.prose.filter(p=>p.role==='active-prompt').length,0);assert.equal(complete.prose.filter(p=>p.role==='interpretation').length,1);assert.ok(!complete.prose.some(p=>p.role==='detail'));assert.equal(complete.numberRowRef,complete.completeNumberRowRef);
});
test('reject font enlargement, essential facts hidden in detail and number on a nonterminal row',()=>{
 for(const mutate of [p=>p.tokens.katexScale=1.21,p=>p.groups[1].prose.find(p=>p.role==='essential-note').role='detail',p=>p.groups[1].numberRowRef=p.groups[1].rowIds[0]]){const p=clone(layout);mutate(p);assert.equal(validateLayoutPlan(p).status,'FAIL');}
 assert.equal(checkLayoutGeometry([{ref:'row',fontPx:18,relationDeltaPx:0,centerDeltaPx:0,overflow:false,hitOverlap:false}]).status,'PASS');
 assert.equal(checkLayoutGeometry([{ref:'row',fontPx:21.78,relationDeltaPx:0,centerDeltaPx:0,overflow:false,hitOverlap:false}]).status,'FAIL');assert.equal(checkLayoutGeometry([]).status,'FAIL');
});
test('v1 compilation stays byte-for-byte identical to the published v1 artifact',()=>{
 const c=compileTransformationPresentation(ir,n08TransformationPlan(ir));assert.equal(c.status,'PASS');assert.deepEqual(clone(c.compiled),JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Transformation.json')));
});
test('v2 keeps source math checks, new hashes, merged first row and nonleaking partial view',()=>{
 const c=compileTransformationPresentation(ir,v2);assert.equal(c.status,'PASS',JSON.stringify(c.findings));assert.deepEqual(c.compiled.groups.map(g=>g.rows.length),[3,4,3,4]);
 assert.equal(c.compiled.constructionDesignHash,hash(v2.constructionPlan));assert.equal(c.compiled.layoutDesignHash,hash(v2.layoutPlan));
 const opts={stageId:'n08-stage-07',boundarySolvedNodeIds:['n08-q07-rule']};
 const first=projectTransformationView(c.compiled,[],opts);assert.equal(first.groups[0].rows.length,1);assert.ok(!JSON.stringify(first).includes('expected'));assert.ok(!JSON.stringify(first).includes('correctValue'));assert.ok(!JSON.stringify(first).includes('3-\\\\sqrt'));
 const i=interaction('n08-q07-bracket'),d=interaction('n08-q07-distribute'),partial=projectTransformationView(c.compiled,[i.id],{...opts,constructionDrafts:{[d.id]:{[d.parts[0].id]:'-'}}});assert.equal(partial.groups[0].rows.length,3);assert.equal(partial.groups[0].rows[2].current.parts.filter(p=>p.value).length,1);
 const complete=projectTransformationView(c.compiled,[i.id,d.id,interaction('n08-07').id],opts);assert.equal(complete.groups[0].rows.length,4);assert.equal(complete.groups[0].layout.prose.filter(p=>p.role==='active-prompt').length,0);
});
test('v2 cannot lose a source row, invent an unbound construction, or silently change symbolic math',()=>{
 for(const mutate of [p=>p.layoutPlan.groups[0].rowIds.pop(),p=>{p.constructionBindings.pop();},p=>{const i=p.constructionPlan.interactions[0];i.assembly.right.left.expression=rat(9);i.expectedStatement.right=rat(9);},p=>p.sourcePlan.graphs[0].states[0].statement.left.argument.n='6']){const p=clone(v2);mutate(p);assert.equal(validateTransformationPlan(ir,p,{verifyMath:false}).status,'FAIL');}
});
test('v2 interaction planning exposes fifteen parts instead of crashing on the wrapper',()=>{
 const out=planTransformations({ir,transformationPlan:v2});assert.equal(out.status,'PASS');assert.equal(out.constructionCandidates.length,15);assert.equal(out.decisions.filter(d=>d.blankRole==='construction').length,11);
});
test('source binding compares typed AST, never matching just colliding LaTeX strings',()=>{
 const f=twoDecisionExample(),source=f.plan.graphs[0].states[3].statement;
 source.left.numerator=sym('ab');f.ir.solutionGraphs[0].states[3].statement=clone(source);f.plan.baseIRHash=hash(f.ir);
 const expected=clone(source);expected.left.numerator=mul(sym('a'),sym('b'));
 assert.equal(statementLatex(source),statementLatex(expected));assert.equal(validateTransformationPlan(f.ir,f.plan,{verifyMath:false}).status,'PASS');
 const c={id:'node3-build',sourceNodeId:'node3',sourceRefs:['block3'],prerequisiteInteractionIds:[],learnerDecision:'construct right side',nextUseRef:'row4',activePrompt:'right operand',parts:[{id:'operand',role:'operand',expected:'ratio',choices:[{value:'ratio',expression:clone(source.right)},{value:'zero',expression:rat(0)}]}],assembly:{kind:'relation',operator:source.operator,left:expected.left,right:{kind:'part',partId:'operand'}},expectedStatement:expected,gradingPurpose:'mathematical-value'};
 const group=f.plan.groups[0],rowIds=group.rows.map(r=>r.id),p={schemaVersion:'transformation-plan/2',sourcePlan:f.plan,constructionPlan:{schemaVersion:'construction-plan/1',unitId:f.plan.unitId,revision:2,interactions:[c]},layoutPlan:{schemaVersion:'layout-plan/1',unitId:f.plan.unitId,tokens:clone(layout.tokens),groups:[{id:group.id,rowIds,numberRowRef:rowIds.at(-1),numberCollision:'below-final-row',prose:[],states:{initial:rowIds.slice(0,2),partial:rowIds.slice(0,3),complete:rowIds}}]},constructionBindings:[{rowRef:'row3',constructionRef:c.id}],rootRowMerges:[]};
 const out=validateTransformationPlan(f.ir,p,{verifyMath:false});assert.equal(out.status,'FAIL');assert.ok(out.findings.some(f=>f.ruleId==='TG_V2_SOURCE_ASSEMBLY'));
});
test('generic left-side construction parts stay masked before an answer',()=>{
 const i={...clone(interaction('n08-04')),id:'left-build',sourceNodeId:'left-node',parts:[{id:'left-part',role:'rational',expected:'5',choices:[{value:'5',expression:rat(5)},{value:'0',expression:rat(0)}]}],assembly:{kind:'relation',operator:'=',left:{kind:'part',partId:'left-part'},right:rat(5)},expectedStatement:{kind:'relation',operator:'=',left:rat(5),right:rat(5)}};
 const group={id:'left-group',kind:'relation-sequence',stageIds:['stage'],boundaryNodeIds:[],number:1,numberId:'num',rows:[{id:'left-row',sourceNodeId:'left-node',stateRef:'state',role:'main',continuation:false,interactionRef:i.id,constructionRef:i.id,visibleAfter:[],completed:{left:[{type:'math',latex:'5'}],relation:'=',right:[{type:'math',latex:'5'}]},masked:{left:[{type:'slot',partId:'left-part'}],relation:'=',right:[{type:'math',latex:'5'}]}}]};
 const presentation={schemaVersion:'transformation-reading/2',unitId:'fixture',presentationVersion:2,planHash:'p',groups:[group],numberAliases:{},interactions:[{id:i.id,prerequisiteInteractionIds:[],blankRole:'construction'}],constructionPlan:{interactions:[i]},layoutPlan:{tokens:layout.tokens,groups:[{id:group.id,rowIds:['left-row'],numberRowRef:'left-row',numberCollision:'below-final-row',prose:[]}]}};
 const visible=projectTransformationView(presentation);assert.equal(visible.groups[0].rows[0].formula.left[0].type,'slot');assert.equal(visible.groups[0].rows[0].formula.left[0].partId,'left-part');
});

function reviewFixture(){
 const visible={initial:{id:'row1',formula:{right:[{type:'math',latex:'a'}]},parts:[{id:'part1',role:'unary-sign'}]},current:{id:'row1',formula:{right:[{type:'slot',partId:'part1'}]},parts:[{id:'part1',role:'unary-sign'}]}};
 const reviewScope=[{rowId:'row1',partId:'part1',state:'partial',imageRef:'image1',geometryRef:'geometry1'}],evidenceManifest=[{id:'image1',kind:'image',sha256:'a'.repeat(64),state:'partial'},{id:'geometry1',kind:'geometry',sha256:'b'.repeat(64),state:'partial'}];
 const prepared=prepareSolutionReview(visible,{phase:'post-implementation',sourceRefs:['source1'],profile:'construction-layout',reviewScope,evidenceManifest,teamBinding:{assignmentHash:'c'.repeat(64),reviewerTaskRef:'actual-task1'}});assert.equal(prepared.status,'NEEDS_AI_REVIEW');
 const request=prepared.request,response={requestHash:request.requestHash,phase:request.phase,reviewer:'agentB',reviewerTaskRef:'actual-task1',assignmentHash:'c'.repeat(64),caseDispositions:[],findings:[],...Object.fromEntries(request.required.filter(k=>!['findings','reviewRows'].includes(k)).map(k=>[k,'specific observation'])),reviewRows:[{...reviewScope[0],decision:'ADOPT',learnerDecision:'apply unary sign',availableInformation:'negative case',copyRisk:'sign selected, value not given',nextUse:'next multiplication row',misconception:'one term only negated',prosePlacement:'one essential note',quoteOrMathRef:'row1',evidenceRefs:['image1','geometry1']}]};
 return {visible,request,response};
}
test('AI construction profile requires concrete row/part/state render evidence and real binding',()=>{
 const {request,response}=reviewFixture();assert.equal(importSolutionReview(request,response).status,'PASS');
 for(const mutate of [r=>r.reviewRows=[],r=>r.reviewRows[0].evidenceRefs=['image1'],r=>r.reviewRows[0].quoteOrMathRef='unseen praise',r=>r.reviewerTaskRef='other-task',r=>r.reviewRows[0].state='complete']){const r=clone(response);mutate(r);assert.equal(importSolutionReview(request,r).status,'FAIL');}
 const r=clone(response);r.reviewRows[0].decision='REVISE';assert.equal(importSolutionReview(request,r).status,'NEEDS_AI_REVIEW');
 assert.equal(prepareSolutionReview(reviewFixture().visible,{phase:'design',sourceRefs:['s'],profile:'construction-layout'}).status,'FAIL');
});
test('AI evidence cannot pair a row with a part belonging to a different visible row',()=>{
 const {visible,request}=reviewFixture();visible.initial={id:'row2',formula:{right:[{type:'slot',partId:'part2'}]},parts:[{id:'part2',role:'rational'}]};
 const out=prepareSolutionReview(visible,{phase:'design',sourceRefs:['s'],profile:'construction-layout',reviewScope:[{...request.reviewScope[0],partId:'part2'}],evidenceManifest:request.evidenceManifest});
 assert.equal(out.status,'FAIL');assert.equal(out.reason,'ROW_PART_STATE_EVIDENCE_REQUIRED');
 const f=reviewFixture();f.response.findings=[{problemId:'p',stepId:'other-row',state:'partial',quoteOrMathRef:'row1',reason:'unscoped claim',affectedRefs:['row1'],resolution:'RESOLVED'}];assert.equal(importSolutionReview(f.request,f.response).status,'FAIL');
});
