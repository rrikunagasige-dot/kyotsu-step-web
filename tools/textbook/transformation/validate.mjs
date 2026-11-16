import {validateTransformationV3} from './v3.mjs';
import {planSchema,getPath} from './schema.mjs';
import {graphSchema} from '../solution/graph.mjs';
import {n08SourceBinding} from './n08-source-binding.mjs';
import {n11SourceBinding,n11AdditionalSourceBindings} from './n11-source-binding.mjs';
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
 if(Object.hasOwn(input??{},'mixedCanonical'))return validateMixedCanonicalPlan(ir,input,{verifyMath});
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
  const sourceHash=hash(ir),binding=sourceHash===n11SourceBinding.sourceHash?n11SourceBinding:n11AdditionalSourceBindings[sourceHash];
  if(!binding||p.graphs.length!==Object.keys(binding.graphs).length||new Set(p.graphs.map(g=>g.id)).size!==p.graphs.length||p.graphs.some(g=>binding.graphs[g.id]!==hash(g)))add('TG03_COVERAGE','N11 frozen source/AST bridge changed');
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

/** QF r3: existing v3 without mixedCanonical keeps its original branch. */
import {verifyMixedOwnerBinding,mixedCanonicalHash} from './schema.mjs';
import {validateIR} from '../ir/index.mjs';
import {validateConstructionPlan,verifyConstructionMath} from '../interaction/construction.mjs';
import {validateLayoutPlan} from '../layout/plan.mjs';

export function validateMixedCanonicalPlan(ir,p,{verifyMath=true}={}){
 const findings=[],add=(ruleId,detail)=>findings.push({ruleId,detail});
 const eq=(a,b)=>hash(a)===hash(b),uniq=a=>new Set(a).size===a.length;
 try{
  if(p.schemaVersion!=='transformation-plan/3'||p.mixedCanonical!=='qf01-r3/1'||p.unitId!=='math-quadratic-qf01'||p.revision!==3)throw Error('MIXED_EXACT_OPT_IN');
  if(p.baseIRHash!==hash(ir)||!eq(p.sourceIR,ir))add('TG12_HASH','source IR');
  if(p.canonical?.fullLessonRawSHA256!=='cfc439665418ca87d907e5a79d66a6a994b387af1a6395865b8d65a5a2075bf6'||p.canonical?.interactionsRawSHA256!=='31419c379a9204181b0f8c7c8c3277594ca5a492c86b8743e9be38eb861ec0fe')add('TG03_COVERAGE','approved author sources');
  if(hash(p.canonical.fullLesson)!=='cfc439665418ca87d907e5a79d66a6a994b387af1a6395865b8d65a5a2075bf6'||hash(p.canonical.interactions)!=='35fbc9cd6e4396708a37fd8345895c8ad1b0227150a374f5c9230892809d2bfe')add('TG03_COVERAGE','approved canonical body changed');
  const expectedMetadata={"FRAME_CONTRACT.json": "3abaf9c0fac6c992aff505cee78fea6829531611f538d8543f9dcc421a56bce5", "RESULT_REGISTRY.json": "480a9d92b9b3d7e9fe3ee311222fe98661e5f320504738254a71d16b53947ecd", "INTERACTION_REFERENCES.json": "84435e202c6da1309ed0852e17a319511e0e4966c177388a6b98633e8ab9eb69", "STAGE_HISTORY_CONTRACT.json": "554d0c90148b16a404d380717d5c46e6cfbd0b8d5b6f25986d8ef94179d71608", "FIGURE_POLICY.json": "7513c57aa480729a49d40092db80dc16355794c098d445816e6a956187dd870d", "STATE_CONTRACT.json": "b5372167931023be7b305486ea980865b64ca393106c76cb03e030e3ad2a0f6c", "STATIC_PREVIEW_STATES.json": "722b1b09b3b24a4fdc3e514248f5e89327de2a7b7f4a931a0046f56912e625cb"};if(!eq(Object.keys(p.presentation).sort(),Object.keys(expectedMetadata).sort()))add('TG03_COVERAGE','presentation keys');for(const [name,expected]of Object.entries(expectedMetadata))if(hash(p.presentation[name]?.value)!==expected)add('TG03_COVERAGE','presentation '+name);
  const full=p.canonical.fullLesson,source=p.canonical.interactions,blocks=new Map(full.blocks.map(b=>[b.id,b])),items=source.interactions,targets=new Map(items.map(i=>[i.id,i]));
  if(blocks.size!==134||full.blocks.length!==134||items.length!==35||targets.size!==35)throw Error('MIXED_CANONICAL_COVERAGE');
  if(!Array.isArray(p.sourceBindings)||p.sourceBindings.length!==134||!uniq(p.sourceBindings.map(b=>b.canonicalBlockId))||!uniq(p.sourceBindings.map(b=>b.irNodeId)))throw Error('MIXED_SOURCE_BINDING_COVERAGE');
  const irChecked=validateIR(ir);if(irChecked.status!=='PASS')add('TG_SOURCE_IR',irChecked);
  const nodes=new Map(ir.nodes.map(n=>[n.id,n]));
  for(const [order,b]of full.blocks.entries()){
   const binding=p.sourceBindings[order],node=nodes.get(binding.irNodeId),item=items.find(i=>i.source.blockId===b.id);
   if(binding.canonicalOrder!==order||binding.canonicalBlockId!==b.id||binding.canonicalBlockSHA256!==mixedCanonicalHash(b)||binding.canonicalType!==b.type||!node||!node.sourceRefs.includes(b.id))add('TG03_COVERAGE',b.id);
   if(binding.interactionId!==(item?.id??null)||!eq(binding.targetRef,item?.source??null)||!eq(binding.pendingProjection,item?.projection.pending??null)||!eq(binding.correctProjection,item?.projection.correct??null))add('TG06_BINDING',b.id);
   if(!node)continue;
   if(item){const c=node.interaction;if(!c||c.id!==item.id||c.expected.value!==item.correct||!eq(c.choices.map(c=>c.content),item.choices)||!eq(c.prerequisiteIds,item.progressionRequires)||!eq(binding.completionResultUnit,item.completionResultUnit))add('TG11_STABLE_SAVE',item.id)}
   const tokens=[...node.before,...node.after].flatMap(block=>block.parts??block.expressions?.flatMap(e=>e.parts)??[]),mapped=binding.tokenBindings;
   if(tokens.length!==mapped.length||!uniq(mapped.map(t=>t.tokenId)))add('TG03_COVERAGE','token count '+b.id);
   for(const m of mapped){const token=tokens.find(t=>t.id===m.tokenId),part=b.parts?.[m.sourcePartIndex],piece=m.projectionPiece;if(!token||!part||m.sourcePartSHA256!==mixedCanonicalHash(part)){add('TG03_COVERAGE','source token '+m.tokenId);continue}
    if(piece.kind==='slot'){if(!item||m.sourcePartIndex!==item.source.partIndex||token.kind!=='answerSlot'||token.interactionId!==item.id)add('TG06_BINDING',m.tokenId)}
    else if(piece.kind==='whole-part'){if(part.type==='math'?(token.kind!=='math'||token.latex!==part.latex):(token.kind!=='text'||token.text!==part.text))add('TG03_COVERAGE','changed token '+m.tokenId)}
    else if(piece.kind==='text-span'){if(part.type!=='text'||!Number.isInteger(piece.start)||!Number.isInteger(piece.end)||piece.start<0||piece.end<piece.start||piece.end>part.text.length||token.kind!=='text'||token.text!==part.text.slice(piece.start,piece.end))add('TG08_VISIBILITY','text span '+m.tokenId)}
    else add('TG06_BINDING','unknown projection');
   }
  }
  if(!eq(p.requiredInteractionRefs,items.map(i=>i.id)))add('TG03_COVERAGE','required interaction order');
  const maths=items.filter(i=>i.answerDomain==='math'),semantics=items.filter(i=>i.answerDomain==='semantic');
  if(maths.length!==27||semantics.length!==8||p.astBindings.length!==27||!uniq(p.astBindings.map(b=>b.interactionId)))add('TG06_BINDING','typed domain coverage');
  for(const item of maths){const b=p.astBindings.find(b=>b.interactionId===item.id);if(!b||!eq(b.canonicalTargetRef,item.source)||b.expected.gradingValue!==item.correct||!eq(b.expected.choices,item.choices)){add('TG06_BINDING',item.id);continue}const receipt=verifyMixedOwnerBinding(b,blocks,p.functionDefinitions);if(receipt.status!=='PASS')add('TG06_BINDING',{interactionId:item.id,receipt})}
  for(const c of p.constructionPlan.interactions){
   const item=targets.get(c.id),owner=p.astBindings.find(b=>b.interactionId===c.id);
   if(!item||item.answerDomain!=='math'||!owner||!eq(c.expectedStatement,owner.targetStatement)||c.sourceNodeId!==item.nodeId||!c.sourceRefs.includes(item.source.blockId)||c.parts.length!==1||c.parts[0].expected!==item.correct||!eq(c.parts[0].choices.map(c=>c.value),item.choices)||!eq(c.prerequisiteInteractionIds,item.progressionRequires))add('TG06_BINDING','construction source/target '+c.id);
  }
  const construction=validateConstructionPlan(p.constructionPlan);if(construction.status!=='PASS')add('TG_CONSTRUCTION',construction);
  const layout=validateLayoutPlan(p.layoutPlan,{nodeIds:ir.nodes.map(n=>n.id),interactionIds:items.map(i=>i.id),partIds:p.constructionPlan.interactions.flatMap(i=>i.parts.map(p=>p.id))});if(layout.status!=='PASS')add('TG_LAYOUT',layout);
  if(p.constructionDesignHash!==hash(p.constructionPlan)||p.layoutDesignHash!==hash(p.layoutPlan))add('TG12_HASH','construction/layout contract');
  if(findings.length)return {status:'FAIL',findings};
  const mathReceipts=[];if(verifyMath){const receipt=verifyConstructionMath(p.constructionPlan);if(receipt.status!=='PASS')return receipt;mathReceipts.push(receipt)}
  const constructionIds=new Set(p.constructionPlan.interactions.map(i=>i.id)),remaining=maths.filter(i=>!constructionIds.has(i.id));
  // Hash/formatter matching cannot authorize ungenerated mathematical receipts.
  const evidence=p.mathEvidence;
  if(!evidence)return {status:'UNVERIFIED',findings:[{ruleId:'TG05_MIXED_EVIDENCE_PENDING',detail:remaining.map(i=>i.id)}],mathReceipts,meaningAuditRequired:true};
  if(evidence.schemaVersion!=='qf01-mixed-math-evidence/1'||!eq(evidence.canonicalSourceHashes,{fullLesson:p.canonical.fullLessonRawSHA256,interactions:p.canonical.interactionsRawSHA256}))throw Error('MIXED_MATH_SOURCE');
  const coverage=evidence.coverage,argumentsById=new Map(evidence.arguments.map(a=>[a.interactionId,a])),graphs=new Map(evidence.graphs.map(g=>[g.id,g]));
  if(!eq(coverage.map(c=>c.interactionId),remaining.map(i=>i.id))||argumentsById.size!==remaining.length||evidence.arguments.length!==remaining.length||graphs.size!==evidence.graphs.length)throw Error('MIXED_MATH_COVERAGE');
  const usedGraphs=new Set();
  for(const item of remaining){
   const a=argumentsById.get(item.id),c=coverage.find(c=>c.interactionId===item.id);
   if(!a||a.kind!=='argument'||!a.claim||!a.assumptions?.length||!a.steps?.length||!a.sourceRefs?.length||a.formalProof!==false||a.proofStatus!=='SOURCE_BACKED_ARGUMENT_REQUIRES_CURRENT_AI_AUDIT'||!eq(a.targetRef,item.source)||!eq(a.knownBeforeAnswerRefs,item.evidenceRefs)||c.sourceArgumentRequired!==true||c.formalProof!==false)throw Error('MIXED_ARGUMENT_CONTRACT '+item.id);
   const checkSource=ref=>{const block=blocks.get(ref.blockId);if(!block||hash(block)!==ref.blockHash||block.contextId!==ref.contextId)throw Error('MIXED_ARGUMENT_SOURCE '+item.id)};
   a.sourceRefs.forEach(checkSource);
   const basis=new Map(a.basisBindings.map(b=>[b.id,b]));if(basis.size!==a.basisBindings.length)throw Error('MIXED_ARGUMENT_BASIS_DUPLICATE');
   for(const b of basis.values()){if(!b.sourceRefs?.length)throw Error('MIXED_ARGUMENT_BASIS_EMPTY');b.sourceRefs.forEach(checkSource)}
   for(const [j,step]of a.steps.entries())if(!step.statement||!step.basisRefs?.length||step.basisRefs.some(id=>!basis.has(id))||!Array.isArray(step.dependsOn)||step.dependsOn.some(d=>!Number.isInteger(d)||d<0||d>=j))throw Error('MIXED_ARGUMENT_DEPENDENCY '+item.id);
   for(const step of a.steps)if(step.verificationSourceRefs){
    if(!Array.isArray(step.verificationSourceRefs)||step.verificationSourceRefs.some(id=>!basis.has(id)||step.basisRefs.includes(id))||!['after-inverse-and-sufficiency-proof','post-construction-sufficiency-verification'].includes(step.visibilityPhase))throw Error('MIXED_FUTURE_VERIFICATION_SOURCE');
   }
   if(!eq(a.machineGraphRefs.map(r=>r.graphId),c.machineGraphIds))throw Error('MIXED_GRAPH_COVERAGE '+item.id);
   for(const r of a.machineGraphRefs){const g=graphs.get(r.graphId);if(!g||hash(g)!==r.inputHash)throw Error('MIXED_GRAPH_HASH');usedGraphs.add(g.id)}
  }
  if(usedGraphs.size!==graphs.size)throw Error('MIXED_EXTRA_GRAPH');
  if(verifyMath)for(const graph of graphs.values()){const receipt=verifySolution(graph);mathReceipts.push({graphId:graph.id,...receipt});if(receipt.status!=='PASS')return {status:'FAIL',findings:[{ruleId:'TG05_MIXED_GRAPH',detail:receipt}],mathReceipts}}
  return {status:'PASS',findings:[],baseIRHash:hash(ir),planHash:hash(p),constructionDesignHash:hash(p.constructionPlan),layoutDesignHash:hash(p.layoutPlan),learnerCopyHash:hash({canonical:p.canonical,presentation:p.presentation}),mathReceipts,
   argumentReceipts:evidence.arguments.map(a=>({interactionId:a.interactionId,inputHash:hash(a),status:'NEEDS_AI_REVIEW',formalProof:false,proofStatus:'SOURCE_BACKED_ARGUMENT_REQUIRES_CURRENT_AI_AUDIT'})),meaningAuditRequired:true,formalProof:false};
 }catch(error){return {status:'FAIL',findings:[...findings,{ruleId:'MIXED_SCHEMA',detail:error.message}]}}
}
