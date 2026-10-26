/** Deterministic operations consumed by workflow.runner. No stage is auto-approved. */
import {readFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';import {resolve} from 'node:path';
import {validateIR,compileIR,visibleSnapshot} from './ir/index.mjs';
import {sourceCoverage} from './source/coverage.mjs';
import {solve,solutionReceipts} from './solver/n07.mjs';
import {teachingCandidates,rankValid} from './planner/graph.mjs';
import {blankCandidates,validateChoices} from './interaction/index.mjs';
import {hash} from './util.mjs';
import {validateConstructionPlan, verifyConstructionMath} from './interaction/construction.mjs';
import {verifyConstructionMathV2} from './interaction/construction-v2.mjs';
import {validateLayoutPlan} from './layout/plan.mjs';
import {validateLayoutMeasurements} from './layout/measurements.mjs';
import {inspectResearch,prepareResearchAnalysis} from './research/manifest.mjs';
import {importResearchAnalysis,retrievePatterns} from './research/patterns.mjs';
import {verifySolution} from './solution/verify.mjs';
import {verifyBundle} from './solution/bundle.mjs';
import {planBlanks,verifyBlankDecisions} from './interaction/plan.mjs';
import {prepareSolutionReview,importSolutionReview} from './ai/solution-review.mjs';
import {visibleFromCompiledV2} from './ir/v2.mjs';
import {planTransformations} from './transformation/plan.mjs';
import {validateTransformationPlan} from './transformation/validate.mjs';
import {compileTransformationPresentation} from './transformation/compile.mjs';
import {projectTransformationView} from './transformation/visible.mjs';
import {buildSnapshotsV3} from './transformation/v3.mjs';
import {checkAxisMeasurements} from './layout/axis-measurements.mjs';
export function operate(operation,input){
 if(operation==='construction-validate'){const plan=input.constructionPlan??input;return plan.schemaVersion==='construction-plan/2'?verifyConstructionMathV2(plan):verifyConstructionMath(plan);}
 if(operation==='layout-validate'){
  const result=validateLayoutPlan(input.layoutPlan??input,input.bindingContext??{});
  if(result.status!=='PASS'||!input.measurements)return result;
  const plan=input.layoutPlan??input;
  if(plan.schemaVersion==='layout-plan/2'){
   if(!Array.isArray(input.measurements)||!input.measurements.length)return {...result,status:'FAIL',reason:'ACTUAL_AXIS_MEASUREMENTS_REQUIRED',measurementCount:0};
   const packets=input.measurements.flatMap(m=>m.packets??[m]);if(!packets.length)return {...result,status:'FAIL',reason:'ACTUAL_AXIS_MEASUREMENTS_REQUIRED',measurementCount:0};const verified=packets.map(checkAxisMeasurements);const failures=verified.flatMap((r,index)=>r.status==='PASS'?[]:[{index,...r}]);
   return {...result,status:failures.length?'FAIL':'PASS',axisMeasurements:verified,findings:failures,measurementCount:packets.length,layoutHash:result.layoutHash};
  }
  return {...validateLayoutMeasurements(input.measurements,{...(input.measurementContext??{}),layoutHash:result.layoutHash,widths:[320,390,430,1440],groupIds:plan.groups.map(g=>g.id),groupRows:Object.fromEntries(plan.groups.map(g=>[g.id,g.rowIds])),groupStates:Object.fromEntries(plan.groups.map(g=>[g.id,g.states]))}),layoutHash:result.layoutHash};
 }
 if(operation==='construction-compile'){
  if(!['transformation-plan/2','transformation-plan/3'].includes(input.transformationPlan?.schemaVersion))return {status:'FAIL',reason:'BOUND_TRANSFORMATION_V2_REQUIRED'};
  return compileTransformationPresentation(input.ir,input.transformationPlan);
 }
 if(input.transformationPlan){
  if(['solution-validate','verify-ir'].includes(operation))return validateTransformationPlan(input.ir,input.transformationPlan);
  if(['interaction-plan','blank-candidates'].includes(operation))return planTransformations(input);
  if(['render-solution','compile-ir'].includes(operation))return compileTransformationPresentation(input.ir,input.transformationPlan);
  if(operation==='visible-snapshots'){
   const result=compileTransformationPresentation(input.ir,input.transformationPlan);if(result.status!=='PASS')return result;
   if(result.compiled.schemaVersion==='transformation-reading/3')return buildSnapshotsV3(result.compiled,input.viewContext??{});
   const interactions=result.compiled.interactions;
   if(result.compiled.schemaVersion==='transformation-reading/2'){
    if(!input.viewContext||!Array.isArray(input.viewContext.boundarySolvedNodeIds)||!Array.isArray(input.viewContext.externalSolvedIds))return {status:'NEEDS_AI_REVIEW',reason:'VISIBLE_BOUNDARY_CONTEXT_REQUIRED',snapshots:[],automaticAcceptance:false};
    const snapshots=[],pending=[];
    for(const [index,c]of interactions.entries()){
     const parent=result.compiled.constructionPlan.interactions.find(p=>p.id===c.id),solved=interactions.slice(0,index).map(p=>p.id),view={...input.viewContext,choicesOpen:parent?.parts[0]?.id??c.id};
     const initial=projectTransformationView(result.compiled,solved,view);
     if(!initial.groups.some(g=>g.rows.some(r=>r.current?.id===c.id))){pending.push({interactionId:c.id,reason:'GROUP_OR_PREREQUISITE_CONTEXT_REQUIRED'});continue;}
     snapshots.push({interactionId:c.id,state:'initial',visible:initial});
     if(parent){
      const first=parent.parts[0],partial=parent.parts.length>1?{[first.id]:first.expected}:{[first.id]:first.choices.find(v=>v.value!==first.expected).value};
      snapshots.push({interactionId:c.id,state:'partial',visible:projectTransformationView(result.compiled,solved,{...view,constructionDrafts:{[c.id]:partial}})});
     }
     snapshots.push({interactionId:c.id,state:'complete',visible:projectTransformationView(result.compiled,[...solved,c.id],{...view,choicesOpen:undefined})});
    }
    return {status:'NEEDS_AI_REVIEW',snapshots,pending,scope:'BOUND_TRANSFORMATION_GROUPS_ONLY',standaloneConstructionIds:result.compiled.constructionPlan.interactions.filter(c=>!result.compiled.groups.some(g=>g.rows.some(r=>r.constructionRef===c.id))).map(c=>c.id),automaticAcceptance:false};
   }
   return {status:'NEEDS_AI_REVIEW',snapshots:interactions.map((c,i)=>projectTransformationView(result.compiled,interactions.slice(0,i).map(c=>c.id),{choicesOpen:c.id})),automaticAcceptance:false};
  }
 }

 if(operation==='research-manifest')return inspectResearch(input.manifest??input);
 if(operation==='research-analysis')return input.response?importResearchAnalysis(input.request,input.response):prepareResearchAnalysis(input.manifest,input.extraction);
 if(operation==='research-patterns')return retrievePatterns(input.patterns,input.query);
 if(operation==='solution-validate')return input.schemaVersion==='solution-bundle/1'?verifyBundle(input):verifySolution(input.graph??input);
 if(operation==='interaction-plan')return input.decisions?verifyBlankDecisions(input.plan,input.decisions):planBlanks(input);
 if(operation==='render-solution')return {status:'PASS',compiled:compileIR(input.ir??input)};
 if(operation==='solution-review'&&input.reviews){
  if(!Array.isArray(input.reviews)||!input.reviews.length||input.reviews.length>200||new Set(input.reviews.map(r=>r.id)).size!==input.reviews.length)return {status:'FAIL',reason:'REVIEW_BATCH_COVERAGE'};
  const reviews=input.reviews.map(r=>({id:r.id,...(r.response?importSolutionReview(r.request,r.response):prepareSolutionReview(r.visible,r.context))}));
  return {status:reviews.some(r=>r.status==='FAIL')?'FAIL':reviews.some(r=>r.status==='NEEDS_AI_REVIEW')?'NEEDS_AI_REVIEW':'PASS',reviews,automaticAcceptance:false};
 }
 if(operation==='solution-review')return input.response?importSolutionReview(input.request,input.response):prepareSolutionReview(input.visible,input.context);
 if(operation==='coverage'){
  const ir=input.ir??input;
  if(ir.schemaVersion==='production-ir/2')return sourceCoverage(ir.sourceBlocks,ir.coverage.map(c=>({...c,nodeIds:c.stepIds})),ir.problems.flatMap(p=>p.steps));
  return sourceCoverage(input.blocks,input.coverage,input.nodes);
 }
 if(operation==='solve'&&input.schemaVersion==='solution-bundle/1')return verifyBundle(input);
 if(operation==='solve')return input.kind==='solution'||input.schemaVersion==='solution-graph/1'?verifySolution(input.graph??input):solve(input);
 if(operation==='solution-receipts')return {status:'PASS',receipts:solutionReceipts(),meaningAuditRequired:true};
 if(operation==='teaching-candidates'){
  if(input.graph?.schemaVersion==='solution-graph/1'){
   const checked=verifySolution(input.graph);if(checked.status!=='PASS')return checked;
   const solution=input.graph.transitions.map(t=>({id:t.id,inputFacts:t.requires,outputFacts:t.produces,goal:input.graph.states.find(s=>s.id===t.to).statement,operation:{kind:t.ruleId,targets:[t.to]},basisRefs:t.basisRefs}));
   return {status:'NEEDS_AI_REVIEW',graphHash:checked.graphHash,candidates:teachingCandidates(solution,input.graph.initialFacts.concat(input.graph.givens.map(g=>g.id)),input.options),meaningAuditRequired:true};
  }
  return {status:'PASS',candidates:teachingCandidates(input.solution,input.knowledge,input.options)};
 }
 if(operation==='blank-candidates'){
  if(input.graph?.schemaVersion==='solution-graph/1')return planBlanks(input);
  return {status:'PASS',candidates:input.nodes.flatMap(n=>blankCandidates(n).map(c=>({...c,nodeId:n.id})))};
 }
 if(operation==='choices')return validateChoices(input.choices,input.answer,input.options);
 if(operation==='verify-ir')return validateIR(input);
 if(operation==='compile-ir')return {status:'PASS',compiled:compileIR(input)};
 if(operation==='visible-snapshots'){
  if(input.ir.schemaVersion==='production-ir/2'){
   const compiled=compileIR(input.ir);
   return {status:'NEEDS_AI_REVIEW',snapshots:compiled.problems.flatMap(p=>p.steps.flatMap((s,i)=>{
    const solved=p.steps.slice(0,i).map(a=>a.id),views=[{choicesOpen:false},{choicesOpen:true},...(s.interaction?.hints.map((_,h)=>({choicesOpen:true,hintCount:h+1}))??[]),...(s.detail.length?[{choicesOpen:true,detailOpen:true}]:[])];
    return views.map(view=>({view,...visibleFromCompiledV2(compiled,s.id,solved,view)}));
   })),meaningAuditRequired:true};
  }
  return {status:'PASS',snapshots:input.ir.nodes.map((n,i)=>visibleSnapshot(input.ir,n.id,input.ir.nodes.slice(0,i).map(n=>n.id)))};
 }
 if(operation==='rank-valid')return {status:'PASS',ranked:rankValid(input.candidates)};
 if(operation==='figures'){
  const findings=[];for(const f of input.figures){if(!f.id||!f.purpose||!f.howToRead||!f.sourceRef||!f.visibleWhen)findings.push({id:f.id,rule:'FIGURE_MEANING'});if(f.sourcePath){const bytes=readFileSync(f.sourcePath);if(hash(bytes.toString('base64'))!==f.contentHash)findings.push({id:f.id,rule:'FIGURE_HASH'});}}
  if(!input.figures.length&&!input.noFigureReason)findings.push({rule:'FIGURE_DECISION_MISSING'});
  return {status:findings.length?'FAIL':'PASS',findings};
 }
 throw Error('unsupported operation '+operation);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log(JSON.stringify(operate(process.argv[2],JSON.parse(readFileSync(0,'utf8')))));}catch(e){console.log(JSON.stringify({status:'FAIL',error:e.message}));process.exitCode=1;}
}
