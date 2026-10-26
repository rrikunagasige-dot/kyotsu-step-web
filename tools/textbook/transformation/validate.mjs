import {validateTransformationV3} from './v3.mjs';
import {planSchema,getPath} from './schema.mjs';
import {graphSchema} from '../solution/graph.mjs';
import {n08SourceBinding} from './n08-source-binding.mjs';
import {n11SourceBinding} from './n11-source-binding.mjs';
import {PATTERNS} from './patterns.mjs';
import {hash} from '../util.mjs';
import {verifySolution} from '../solution/verify.mjs';
import {answerCheck} from '../rules/n07.mjs';
import {expressionLatex} from '../solution/expression.mjs';
import {validateTransformationV2} from './v2.mjs';
export function gradingContract(ir){
 if(ir.schemaVersion==='production-ir/2')return ir.problems.flatMap(p=>p.steps.filter(s=>s.interaction).map(s=>s.interaction));
 if(ir.unit)return ir.unit.sections.flatMap(s=>s.items).map(({id,answer,acceptedAnswers,choices})=>({id,answer,acceptedAnswers,choices}));
 return ir.nodes.filter(n=>n.interaction).map(n=>n.interaction);
}
export function validateTransformationPlan(ir,input,{verifyMath=true}={}){
 if(input?.schemaVersion==='transformation-plan/3')return validateTransformationV3(ir,input,{verifyMath});
 if(input?.schemaVersion==='transformation-plan/2')return validateTransformationV2(ir,input,{verifyMath},validateTransformationPlan);
 const parsed=planSchema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'TG_SCHEMA',detail:parsed.error.message}]};
 const p=parsed.data,findings=[],add=(ruleId,detail)=>findings.push({ruleId,detail});
 if(p.baseIRHash!==hash(ir))add('TG12_HASH','base IR changed');
 if(p.gradingHash!==hash(gradingContract(ir)))add('TG11_STABLE_SAVE','grading contract changed');
 const unitId=ir.unit?.unitId??ir.unitId;if(unitId!==p.unitId)add('TG01_SCOPE','unit mismatch');
 const graphMap=new Map(p.graphs.map(g=>[g.id,g]));
 // A correct calculation over an invented root is not a source-backed solution.
 const sourceGraphs=ir.problems?.map(p=>p.graph)??ir.solutionGraphs;
 if(sourceGraphs){
  if(p.graphs.some(g=>!sourceGraphs.some(source=>source.id===g.id&&hash(graphSchema.parse(source))===hash(g))))add('TG03_COVERAGE','source AST differs from display graph');
 }else if(ir.schemaVersion==='guided-math-presentation/1'&&ir.unit?.unitId==='math-numbers-expressions-n11'){
  if(hash(ir)!==n11SourceBinding.sourceHash||p.graphs.length!==Object.keys(n11SourceBinding.graphs).length||p.graphs.some(g=>n11SourceBinding.graphs[g.id]!==hash(g)))add('TG03_COVERAGE','N11 frozen source/AST bridge changed');
 }else if(ir.unit?.unitId==='math-numbers-expressions-n08'){
  if(hash(ir)!==n08SourceBinding.sourceHash||p.graphs.length!==Object.keys(n08SourceBinding.graphs).length||p.graphs.some(g=>n08SourceBinding.graphs[g.id]!==hash(g)))add('TG03_COVERAGE','N08 frozen source/AST bridge changed');
 }else add('TG03_COVERAGE','NEEDS_MAPPING: no source AST or registered legacy bridge');

 const sourceNodes=ir.semantic?.nodes??ir.nodes??ir.problems?.flatMap(p=>p.steps)??[];
 const nodes=new Map(sourceNodes.map(n=>[n.id,n]));
 if(new Set(p.scope.nodeIds).size!==p.scope.nodeIds.length||p.scope.nodeIds.some(id=>!nodes.has(id)))add('TG01_SCOPE','unknown/duplicate node');
 const contracts=gradingContract(ir),contractMap=new Map(contracts.map(c=>[c.id,c]));
 const candidates=new Map(p.candidates.map(c=>[c.id,c]));
 const rowIds=p.groups.flatMap(g=>g.rows.map(r=>r.id));
 for(const [name,values] of Object.entries({graphs:p.graphs.map(g=>g.id),groups:p.groups.map(g=>g.id),rows:rowIds,candidates:p.candidates.map(c=>c.id),numbers:p.groups.map(g=>g.numberId),labels:p.groups.map(g=>g.number)}))if(new Set(values).size!==values.length)add('TG10_NUMBER',name+' duplicates');
 for(const [key,rowRef] of Object.entries(p.numberAliases))if(!key||!rowIds.includes(rowRef))add('TG10_NUMBER','dangling alias '+key);
 const mathReceipts=[];
 for(const graph of p.graphs){if(verifyMath){const r=verifySolution(graph);mathReceipts.push({graphId:graph.id,...r});if(r.status!=='PASS')add('TG05_CONDITION',{graph:graph.id,receipt:r});}}
 for(const o of p.proseOverrides??[]){
  const node=nodes.get(o.nodeId),refs=node?.after?.map(b=>b.id)??[];
  if(!node||o.visibleAfterNodeId!==o.nodeId||hash(o.sourceRefs)!==hash(refs)||p.scope.nodeIds.includes(o.nodeId))add('TG03_COVERAGE','invalid prose override '+o.nodeId);
 }
 const allSlots=[];
 for(const group of p.groups){
  if((group.boundaryNodeIds??[]).some(id=>!nodes.has(id)||p.scope.nodeIds.includes(id)))add('TG08_VISIBILITY','invalid external boundary '+group.id);
  const pattern=PATTERNS[group.patternId];if(!pattern||!pattern.supported)add('TG01_SCOPE','unsupported pattern '+group.patternId);
  const graph=graphMap.get(group.graphRef);
  if(!graph||group.sourceNodeIds.some(id=>!p.scope.nodeIds.includes(id))||group.stageIds.some(id=>!p.scope.stageIds.includes(id)))add('TG01_SCOPE',group.id);
  if(graph&&p.scope.assumptionRefs.some(f=>!graph.initialFacts.includes(f)))add('TG01_SCOPE','assumptions '+group.id);
  const mains=group.rows.filter(r=>r.role==='main');
  if(group.kind!=='independent-comparison'){
   if(mains.some(r=>r.graphRef!==group.graphRef))add('TG01_SCOPE','mixed graph');
   for(let i=1;i<mains.length;i++){const a=mains[i-1],b=mains[i];if(!graph?.transitions.some(t=>t.from===a.stateRef&&t.to===b.stateRef&&group.stepRefs.includes(t.id)))add('TG02_SEQUENCE',b.id);}
  }
  if(graph&&group.stepRefs.some(id=>!graph.transitions.some(t=>t.id===id)))add('TG02_SEQUENCE','unknown step');
  if(group.kind!=='independent-comparison'&&graph&&(mains[0]?.stateRef!==graph.rootStateId||!graph.goalStateIds.includes(mains.at(-1)?.stateRef)||graph.transitions.some(t=>!group.stepRefs.includes(t.id))))add('TG03_COVERAGE','graph steps not fully projected '+group.id);
  if(mains.at(-1)?.stateRef!==group.conclusion.stateRef)add('TG09_TERMINAL','terminal is not last main row');
  if(group.conclusion.kind==='restate-with-reason'&&!group.conclusion.reason)add('TG09_TERMINAL','missing restatement reason');
  const seen=new Set();
  for(const row of group.rows){
   const rg=graphMap.get(row.graphRef),state=rg?.states.find(s=>s.id===row.stateRef);
   if(!state){add('TG02_SEQUENCE',row.id);continue;}
   if(row.role==='main'&&rg&&(state.activeVariable!==rg.variable||JSON.stringify(state.fixedParameters)!==JSON.stringify(rg.parameters)))add('TG01_SCOPE','variable role '+row.id);
   if(!group.sourceNodeIds.includes(row.sourceNodeId)||!row.sourceRefs.length)add('TG03_COVERAGE',row.id);
   if(group.kind==='relation-sequence'&&row.role==='main'&&(state.statement.kind!=='relation'||row.continuation))add('TG04_RELATION',row.id);
   if(group.kind==='expression-chain'&&row.role==='main'&&(state.statement.kind!=='expression'||row.continuation!==(mains.indexOf(row)>0)))add('TG04_RELATION',row.id);
   if(group.kind==='independent-comparison'&&row.continuation)add('TG04_RELATION',row.id);
   const key=row.graphRef+':'+row.stateRef+':'+row.role;if(seen.has(key))add('TG09_TERMINAL',row.id);seen.add(key);
   for(const id of row.visibleAfter)if(!candidates.has(id)||candidates.get(id).decision!=='ADOPT')add('TG08_VISIBILITY','unknown gate '+id);
   const interaction=row.interactionRef?candidates.get(row.interactionRef):null;
   if(row.interactionRef&&(!interaction||interaction.decision!=='ADOPT'))add('TG06_BINDING',row.id);
   const priorIds=new Set(group.rows.slice(0,group.rows.indexOf(row)).map(r=>r.interactionRef).filter(Boolean));
   if(row.visibleAfter.some(id=>!priorIds.has(id)))add('TG08_VISIBILITY','future gate '+row.id);
   if(interaction&&interaction.prerequisiteInteractionIds.some(id=>!row.visibleAfter.includes(id)))add('TG08_VISIBILITY','missing prerequisite '+row.id);
   if(row.interactionRef&&row.visibleAfter.includes(row.interactionRef))add('TG08_VISIBILITY','current answer gates itself');
   if(row.slots.length&&!interaction)add('TG06_BINDING','slot without interaction');
   for(const slot of row.slots){
    allSlots.push(slot.id);const target=getPath(state.statement,slot.path);
    if(slot.interactionRef!==row.interactionRef||!target||!interaction||(typeof target==='string'?slot.path!=='operator':!target.kind))add('TG06_BINDING',slot.id);
    else if(typeof target==='string'?target!==interaction.targetLatex:expressionLatex(target)!==interaction.targetLatex)add('TG06_BINDING','expected target '+slot.id);
   }
   if(interaction&&!row.slots.length)add('TG06_BINDING','missing mask '+row.id);
  }
 }
 if(new Set(allSlots).size!==allSlots.length)add('TG06_BINDING','duplicate slot ID');
 const adopted=p.candidates.filter(c=>c.decision==='ADOPT');
 for(const c of p.candidates){
  if(!p.scope.nodeIds.includes(c.nodeId)||!c.availableFactRefs.length)add('TG01_SCOPE','candidate '+c.id);
  const known=new Set([...p.scope.assumptionRefs,...p.graphs.flatMap(g=>[...g.initialFacts,...g.givens.map(v=>v.id),...g.transitions.flatMap(t=>t.produces)])]);
  if(c.availableFactRefs.some(f=>!known.has(f)))add('TG08_VISIBILITY','unknown fact '+c.id);
  const binding=contractMap.get(c.id),answer=binding?.answer??binding?.correctValue??(binding?.expected?.kind?expressionLatex(binding.expected):binding?.expected?.value);
  const choiceValues=binding?.choices?.map(v=>typeof v==='string'?v:v.content??(v.value?.kind?expressionLatex(v.value):v.value))??[];
  if(c.decision==='ADOPT'&&binding&&(answer!==c.expected||JSON.stringify([...new Set([answer,...choiceValues])])!==JSON.stringify(c.choices)))add('TG11_STABLE_SAVE',c.id);
  for(let i=0;i<c.choices.length;i++)for(let j=0;j<i;j++)if(answerCheck(c.choices[i],c.choices[j]).equivalent)add('TG07_ANSWER_CONTRACT','equivalent choices '+c.id);
  if(new Set(c.choices.map(v=>v.replace(/\s/g,'').replace(/\{(-?\d+)\}/g,'$1'))).size!==c.choices.length||!c.choices.includes(c.expected))add('TG07_ANSWER_CONTRACT',c.id);
  if(c.decision==='ADOPT'&&!binding)add('TG11_STABLE_SAVE','unknown grading ID '+c.id);
  if(c.prerequisiteInteractionIds.some(id=>id===c.id||!adopted.some(a=>a.id===id)))add('TG08_VISIBILITY','invalid prerequisite '+c.id);
  if(c.decision==='ADOPT'&&p.groups.flatMap(g=>g.rows).filter(r=>r.interactionRef===c.id).length!==1)add('TG06_BINDING','unbound '+c.id);
 }
 const blocks=p.scope.nodeIds.flatMap(id=>{const n=nodes.get(id);return n?[...(n.before??[]),...(n.after??[])].map(b=>b.id):[]});
 const coverageIds=p.coverage.map(c=>c.sourceRef);
 if(new Set(coverageIds).size!==coverageIds.length||blocks.some(id=>!coverageIds.includes(id))||coverageIds.some(id=>!blocks.includes(id)))add('TG03_COVERAGE','source block coverage');
 if(p.coverage.some(c=>!rowIds.includes(c.rowRef)))add('TG03_COVERAGE','dangling projection');
 const consumed=new Set(p.groups.flatMap(g=>g.rows.flatMap(r=>r.sourceRefs)));
 if(blocks.some(id=>!consumed.has(id)))add('TG03_COVERAGE','unconsumed source block');
 return {status:findings.length?'FAIL':'PASS',findings,mathReceipts,baseIRHash:hash(ir),planHash:hash(input),learnerCopyHash:hash(p.proseOverrides?{rows:p.groups.flatMap(g=>g.rows.map(r=>[r.before,r.after])),proseOverrides:p.proseOverrides}:p.groups.flatMap(g=>g.rows.map(r=>[r.before,r.after]))),meaningAuditRequired:true};
}
