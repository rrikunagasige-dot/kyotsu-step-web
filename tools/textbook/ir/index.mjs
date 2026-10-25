import { z } from 'zod';
import { hash,invariant } from '../util.mjs';
import {resolveTarget,validateChoices} from '../interaction/index.mjs';
import {validateIRV2,compileIRV2,visibleSnapshotV2} from './v2.mjs';
const id=z.string().min(1);
const text=z.string().min(1);
export const partSchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('text'),id,text}).strict(),
 z.object({kind:z.literal('math'),id,latex:text,mathRole:z.enum(['expression','factor','quantity','standalone-answer','condition','definition']),semanticRef:id,meaning:z.object({role:text,unit:text,appliesTo:id}).optional()}).strict(),
 z.object({kind:z.literal('term'),id,termId:id,text,usage:z.enum(['first_definition','recall','ordinary'])}).strict(),
 z.object({kind:z.literal('ref'),id,targetId:id,label:text}).strict(),
 z.object({kind:z.literal('answerSlot'),id,interactionId:id,semanticRef:id}).strict(),
]);
export const groupSchema=z.object({id,kind:z.literal('relationChain'),relation:z.enum(['equality','inequality','implication','equivalence','independent']),
 expressions:z.array(z.object({id,parts:z.array(partSchema).min(1)}).strict()).min(1),
 operators:z.array(z.enum(['=','<','>','\\le','\\ge','\\Rightarrow','\\Leftrightarrow'])).default([]),
 transformRef:id.optional(),layoutProfile:z.enum(['aligned-transform','single','independent']),
 numbering:z.object({stableId:id,mode:z.enum(['group-end','none'])}).strict()}).strict();
export const blockSchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('paragraph'),id,parts:z.array(partSchema).min(1)}).strict(),groupSchema,
]);
export const interactionSchema=z.object({id,targetPath:text,learningAction:z.enum(['judgment','relation','expression','calculation','meaning','selection']),
 whyHere:text,prerequisiteIds:z.array(id),expected:z.object({value:text,form:z.enum(['text','number','formula','reduced','minimum']),semanticType:text}),
 choices:z.array(z.object({id,content:text,misconception:text.optional(),feedback:text})).min(2),hints:z.array(text).max(3),
 answerInsertion:z.object({blockId:id,slotId:id})}).strict();
export const irSchema=z.object({schemaVersion:z.literal('production-ir/1'),unitId:id,subject:text,mode:z.enum(['textbook','practice']),sourceHash:text,
 sourceBlocks:z.array(z.object({id,kind:text})),coverage:z.array(z.object({sourceId:id,nodeIds:z.array(id),disposition:z.enum(['taught','structural','excluded']),reason:text})),
 initialFacts:z.array(id),nodes:z.array(z.object({id,problemId:id,sourceRefs:z.array(id).min(1),requires:z.array(id),produces:z.array(id),
 role:z.enum(['definition','property','proof','example','substep','check','summary']),goal:text,purpose:text,
 operation:z.object({kind:text,targets:z.array(id),direction:text.optional(),nextUseIds:z.array(id)}),
 before:z.array(blockSchema),after:z.array(blockSchema),interaction:interactionSchema.optional(),noBlankReason:text.optional(),
 contextNeed:z.array(z.object({id,problemId:id,factIds:z.array(id),reason:text,sourceQuestionRef:id.optional(),tableSelection:z.object({tableId:id,rows:z.array(z.number().int().nonnegative()),columns:z.array(z.number().int().nonnegative())}).optional()}))
 }).strict()).min(1)}).strict();
export function partsOf(block){return block.kind==='paragraph'?block.parts:block.expressions.flatMap(e=>e.parts);}
export function tokens(ir){return ir.nodes.flatMap(n=>['before','after'].flatMap(state=>n[state].flatMap(b=>partsOf(b).map(p=>({...p,nodeId:n.id,state,blockId:b.id})))));}
export function visibleSnapshot(ir,nodeId,solvedIds=[]){
 if(ir.schemaVersion==='production-ir/2')return visibleSnapshotV2(ir,nodeId,solvedIds);
 const target=ir.nodes.findIndex(n=>n.id===nodeId);invariant(target>=0,'unknown node');const solved=new Set(solvedIds);
 return {nodeId,nodes:ir.nodes.slice(0,target+1).map((n,i)=>({id:n.id,problemId:n.problemId,before:n.before,...(solved.has(n.id)&&i<=target?{after:n.after}:{}),...(i===target?{interaction:n.interaction}: {})})),knownFacts:[...ir.initialFacts,...ir.nodes.slice(0,target).filter(n=>solved.has(n.id)||!n.interaction).flatMap(n=>n.produces)]};
}
function finding(rule,node,state,detail,severity='ERROR'){return {id:hash({rule,node,state,detail}),ruleId:rule,nodeId:node,state,detail,severity};}
export function validateIR(input){
 if(input.schemaVersion==='production-ir/2')return validateIRV2(input);
 const parsed=irSchema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[finding('SCHEMA',null,null,parsed.error.message)]};
 const ir=parsed.data,findings=[],ids=new Set(),facts=new Set(ir.initialFacts),producers=new Map();
 const add=(rule,n,s,d,sev)=>findings.push(finding(rule,n.id,s,d,sev));
 if(new Set(ir.nodes.map(n=>n.id)).size!==ir.nodes.length)findings.push(finding('DUPLICATE_NODE',null,null,'node ids'));

 for(const t of tokens(ir)){if(ids.has(t.id))findings.push(finding('DUPLICATE_TOKEN',t.nodeId,t.state,t.id));ids.add(t.id);}
 for(const n of ir.nodes){
  for(const r of n.requires)if(!facts.has(r))add('UNLEARNED_FACT',n,'before',r);
  if(!n.interaction&&!n.noBlankReason)add('BLANK_DECISION_MISSING',n,'before','noBlankReason required');
  for(const ref of n.contextNeed){if(ref.problemId!==n.problemId)add('CONTEXT_SCOPE',n,'before',ref.id);for(const f of ref.factIds)if(!facts.has(f))add('CONTEXT_FUTURE',n,'before',f);}
  if(n.operation.kind==='subtract'&&(!n.operation.direction||n.operation.targets.length!==2))add('OPERATION_TARGETS',n,'before','subtract requires two targets and direction');
  const local=new Set();for(const state of ['before','after'])for(const b of n[state]){
   if(local.has(b.id))add('DUPLICATE_BLOCK',n,state,b.id);local.add(b.id);
   if(b.kind==='relationChain'){
    if(b.relation==='independent'&&(b.operators.length||b.layoutProfile==='aligned-transform'))add('INDEPENDENT_RELATION',n,state,b.id);
    if(b.relation!=='independent'&&b.operators.length!==b.expressions.length-1)add('BROKEN_RELATION',n,state,b.id);
    if(b.relation==='equality'&&b.operators.some(x=>x!=='='))add('WRONG_RELATION',n,state,b.id);
    if(b.relation!=='independent'&&b.expressions.length>1&&!b.transformRef)add('MISSING_TRANSFORM',n,state,b.id);
   }
   for(const p of partsOf(b)){if(p.kind==='math'&&p.mathRole==='quantity'&&!p.meaning)add('ORPHAN_QUANTITY',n,state,p.id);}
   if(b.kind==='relationChain'&&b.expressions.length===1){const ps=partsOf(b);if(ps.length===1&&ps[0].kind==='math'&&/^\d+$/.test(ps[0].latex)&&ps[0].mathRole!=='standalone-answer'&&!ps[0].meaning)add('ORPHAN_OUTPUT',n,state,b.id);}
   for(const p of partsOf(b))if(p.kind==='text'&&/(?:[a-z]\s*[=<>]|\\frac|\/[\(a-z]|\^\{?\w)/i.test(p.text))add('TEXT_MAY_CONTAIN_MATH',n,state,p.text,'WARN');
  }
  if(n.role==='definition'&&![...n.before,...n.after].flatMap(partsOf).some(p=>p.kind==='term'&&p.usage==='first_definition'))add('DEFINITION_TERM_MISSING',n,'before',n.id);
  if(n.interaction){
   const q=n.interaction,slots=n.before.flatMap(partsOf).filter(p=>p.kind==='answerSlot'&&p.interactionId===q.id);
   if(slots.length!==1||slots[0].id!==q.answerInsertion.slotId||!n.before.some(b=>b.id===q.answerInsertion.blockId&&partsOf(b).some(p=>p.id===q.answerInsertion.slotId)))add('SLOT_INSERTION',n,'before',q.id);
   try{resolveTarget(n,q.targetPath);}catch{add('TARGET_PATH',n,'before',q.targetPath);}
   const choiceCheck=validateChoices(q.choices,q.expected.value,{form:q.expected.form});for(const rule of choiceCheck.errors)add(rule,n,'before',q.id);
   if(new Set(q.choices.map(c=>c.content)).size!==q.choices.length)add('DUPLICATE_CHOICE',n,'before',q.id);
   if(q.choices.filter(c=>c.content===q.expected.value).length!==1)add('ANSWER_COUNT',n,'before',q.id);
   const canonical=x=>x.replace(/\s+/g,'');
   const visible=n.before.flatMap(partsOf).filter(p=>p.kind==='math').map(p=>p.latex);
   if(visible.some(x=>canonical(x)===canonical(q.expected.value)))add('ANSWER_LEAKAGE',n,'before',q.id);
  }
  for(const fact of n.produces){if(facts.has(fact)||producers.has(fact))add('DUPLICATE_FACT',n,'after',fact);facts.add(fact);producers.set(fact,n.id);}
 }
 for(const n of ir.nodes)for(const ref of n.operation.nextUseIds)if(!ir.nodes.some(x=>x.id===ref&&x.requires.some(r=>n.produces.includes(r))))add('NEXT_USE_NOT_CONNECTED',n,'after',ref);
 const source=new Set(ir.sourceBlocks.map(b=>b.id)),nodeIds=new Set(ir.nodes.map(n=>n.id));
 for(const id of source){const rows=ir.coverage.filter(c=>c.sourceId===id);if(rows.length!==1)findings.push(finding('SOURCE_COVERAGE',null,null,id));}
 for(const c of ir.coverage){if(!source.has(c.sourceId)||c.nodeIds.some(n=>!nodeIds.has(n)))findings.push(finding('COVERAGE_REF',null,null,c.sourceId));if(c.disposition==='taught'&&!c.nodeIds.length)findings.push(finding('COVERAGE_EMPTY',null,null,c.sourceId));for(const nid of c.nodeIds)if(!ir.nodes.find(n=>n.id===nid).sourceRefs.includes(c.sourceId))findings.push(finding('REVERSE_COVERAGE',nid,null,c.sourceId));}
 for(const n of ir.nodes)for(const ref of n.sourceRefs)if(!source.has(ref)||!ir.coverage.some(c=>c.sourceId===ref&&c.nodeIds.includes(n.id)))add('SOURCE_REF',n,'before',ref);
 return {status:findings.some(f=>f.severity==='ERROR')?'FAIL':'PASS',findings,irHash:hash(ir),expectedSemanticIds:tokens(ir).filter(t=>t.kind!=='text').map(t=>t.id)};
}
export function compileIR(ir,{warningResolutions=[]}={}){
 if(ir.schemaVersion==='production-ir/2')return compileIRV2(ir);
 ir=irSchema.parse(ir);
 const check=validateIR(ir);invariant(check.status==='PASS',JSON.stringify(check.findings));
 const warnings=check.findings.filter(f=>f.severity==='WARN');invariant(warnings.every(f=>warningResolutions.some(r=>r.findingId===f.id&&r.evidence)),'unresolved semantic warning');
 const equationNumbers={};let number=0;for(const n of ir.nodes)for(const b of [...n.before,...n.after])if(b.kind==='relationChain'&&b.numbering.mode==='group-end'&&!Object.hasOwn(equationNumbers,b.numbering.stableId))equationNumbers[b.numbering.stableId]=++number;
 const semanticMap={};const convert=p=>{semanticMap[p.id]={kind:p.kind,semanticRef:p.semanticRef??p.termId??p.targetId??null};
  if(p.kind==='math')return {type:'math',latex:p.latex,semanticId:p.id};
  if(p.kind==='term')return {type:'term',text:p.text,semanticId:p.id,usage:p.usage};
  if(p.kind==='answerSlot')return {type:'choice',itemId:p.interactionId,semanticId:p.id};
  return {type:'text',text:p.kind==='ref'?p.label:p.text,semanticId:p.id};};
 const renderBlock=b=>{if(b.kind==='paragraph')return {id:b.id,type:'paragraph',parts:b.parts.map(convert)};
  const expressions=b.expressions.map(e=>e.parts.map(convert));
  if(b.relation==='independent')return expressions.map((parts,i)=>({id:b.id+'-'+i,type:'formula',parts,derivationId:b.id}));
  return {id:b.id,type:'formula',parts:expressions.flatMap((parts,i)=>i?[{type:'math',latex:b.operators[i-1]},...parts]:parts),derivationId:b.id};};
 return {schemaVersion:'production-compiled/1',irHash:hash(ir),nodes:ir.nodes.map(n=>({id:n.id,before:n.before.flatMap(renderBlock),after:n.after.flatMap(renderBlock),contextNeed:n.contextNeed,interaction:n.interaction})),semanticMap,equationNumbers,
 equationGroups:ir.nodes.flatMap(n=>[...n.before,...n.after].filter(b=>b.kind==='relationChain').map(b=>({id:b.id,...b.numbering,relation:b.relation,layoutProfile:b.layoutProfile}))),expectedSemanticIds:check.expectedSemanticIds};
}
export function verifyRendered(compiled,renderedIds,expectedIds=compiled.expectedSemanticIds){
 const rendered=new Set(renderedIds),expected=new Set(expectedIds);
 const missing=[...expected].filter(id=>!rendered.has(id)),unexpected=[...rendered].filter(id=>!expected.has(id));
 return {status:missing.length||unexpected.length?'FAIL':'PASS',missing,unexpected};
}
