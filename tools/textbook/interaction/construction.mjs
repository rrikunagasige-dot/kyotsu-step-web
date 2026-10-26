/** Typed, finite construction contracts. Display strings are never parsed or evaluated. */
import {z} from 'zod';
import {expressionSchema,statementSchema,expressionLatex,statementLatex,rat,add,mul} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
import {verifyMathPayload} from '../solution/verify.mjs';

const id=z.string().min(1).max(160),ids=z.array(id);
export const partRoles=['coordinate','operand','rational','coefficient','unary-sign','binary-operation','signed-term'];
const choiceSchema=z.object({value:id,expression:expressionSchema.optional()}).strict();
export const constructionExpressionSchema=z.lazy(()=>z.union([
 expressionSchema,
 z.object({kind:z.literal('part'),partId:id}).strict(),
 z.object({kind:z.literal('unary'),sign:z.object({partId:id}).strict(),argument:constructionExpressionSchema}).strict(),
 z.object({kind:z.literal('binary'),operation:z.union([z.enum(['+','-']),z.object({partId:id}).strict()]),left:constructionExpressionSchema,right:constructionExpressionSchema}).strict(),
 z.object({kind:z.literal('remaining-term'),id,fromPartId:id,terms:z.array(choiceSchema).length(2)}).strict(),
 z.object({kind:z.literal('absolute'),argument:constructionExpressionSchema}).strict(),
 z.object({kind:z.literal('add'),args:z.array(constructionExpressionSchema).min(2).max(12)}).strict(),
 z.object({kind:z.literal('multiply'),args:z.array(constructionExpressionSchema).min(2).max(12)}).strict(),
 z.object({kind:z.literal('power'),base:constructionExpressionSchema,exponent:z.number().int().min(0).max(4)}).strict(),
 z.object({kind:z.literal('divide'),numerator:constructionExpressionSchema,denominator:constructionExpressionSchema}).strict(),
]));
const assemblySchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('expression'),expression:constructionExpressionSchema}).strict(),
 z.object({kind:z.literal('relation'),operator:z.enum(['=','<','<=','>','>=']),left:constructionExpressionSchema,right:constructionExpressionSchema}).strict(),
]);
export const constructionInteractionSchema=z.object({
 id,sourceNodeId:id,sourceRefs:ids.min(1),prerequisiteInteractionIds:ids,
 learnerDecision:z.string().min(1),nextUseRef:id,activePrompt:z.string().min(1),
 parts:z.array(z.object({id,role:z.enum(partRoles),expected:id,choices:z.array(choiceSchema).min(2).max(12)}).strict()).min(1).max(8),
 assembly:assemblySchema,expectedStatement:statementSchema,
 gradingPurpose:z.enum(['mathematical-value','specified-order']).default('mathematical-value'),
}).strict();
export const constructionPlanSchema=z.object({schemaVersion:z.literal('construction-plan/1'),unitId:id,revision:z.number().int().positive(),interactions:z.array(constructionInteractionSchema).min(1)}).strict();

function walk(value,fn,path=''){
 if(!value||typeof value!=='object')return;
 fn(value,path);
 for(const [k,v]of Object.entries(value))if(v&&typeof v==='object')Array.isArray(v)?v.forEach((x,i)=>walk(x,fn,path?`${path}.${k}.${i}`:`${k}.${i}`)):walk(v,fn,path?`${path}.${k}`:k);
}
const partMap=i=>new Map(i.parts.map(p=>[p.id,p]));
function resolvePart(i,draft,partId){const p=i.parts.find(p=>p.id===partId);return p?.choices.find(c=>c.value===draft[partId]);}
function expression(i,node,draft){
 if(node.kind==='part'){const c=resolvePart(i,draft,node.partId);if(!c?.expression)throw Error('PART_INCOMPLETE_OR_ROLE');return c.expression;}
 if(node.kind==='unary'){const c=resolvePart(i,draft,node.sign.partId);if(!c)throw Error('PART_INCOMPLETE');const a=expression(i,node.argument,draft);return c.value==='-'?mul(rat(-1),a):a;}
 if(node.kind==='binary'){const op=typeof node.operation==='string'?node.operation:resolvePart(i,draft,node.operation.partId)?.value;if(!op)throw Error('PART_INCOMPLETE');const a=expression(i,node.left,draft),b=expression(i,node.right,draft);return add(a,op==='-'?mul(rat(-1),b):b);}
 if(node.kind==='remaining-term'){const chosen=draft[node.fromPartId];if(!node.terms.some(c=>c.value===chosen))throw Error('PART_INCOMPLETE');return node.terms.find(c=>c.value!==chosen).expression;}
 if(node.kind==='absolute')return {...node,argument:expression(i,node.argument,draft)};
 if(node.kind==='add'||node.kind==='multiply')return {...node,args:node.args.map(a=>expression(i,a,draft))};
 if(node.kind==='power')return {...node,base:expression(i,node.base,draft)};
 if(node.kind==='divide')return {...node,numerator:expression(i,node.numerator,draft),denominator:expression(i,node.denominator,draft)};
 return node;
}
export function assembleConstruction(interaction,draft={}){
 if(!draft||typeof draft!=='object'||Array.isArray(draft))return {status:'FAIL',reason:'DRAFT_OBJECT_REQUIRED'};
 const invalid=Object.keys(draft).filter(k=>!interaction.parts.some(p=>p.id===k)||!resolvePart(interaction,draft,k));
 if(invalid.length)return {status:'FAIL',reason:'UNKNOWN_PART_OR_CHOICE',invalidParts:invalid};
 const missing=interaction.parts.filter(p=>!Object.hasOwn(draft,p.id)).map(p=>p.id);
 if(missing.length)return {status:'INCOMPLETE',missingParts:missing};
 try{const s=interaction.assembly,statement=s.kind==='expression'?{kind:'expression',expression:expression(interaction,s.expression,draft)}:{kind:'relation',operator:s.operator,left:expression(interaction,s.left,draft),right:expression(interaction,s.right,draft)};
  const parsed=statementSchema.safeParse(statement);if(!parsed.success)return {status:'FAIL',reason:'ASSEMBLED_AST_INVALID'};
  return {status:'COMPLETE',statement,latex:statementLatex(statement)};
 }catch(error){return {status:'FAIL',reason:error.message};}
}
export function gradeConstruction(interaction,draft={}){
 const built=assembleConstruction(interaction,draft);if(built.status!=='COMPLETE')return {...built,complete:false};
 const correct=interaction.parts.every(p=>draft[p.id]===p.expected);
 return {...built,complete:true,correct,...(!correct?{reason:interaction.gradingPurpose==='specified-order'?'SPECIFIED_ORDER_MISMATCH':'MATHEMATICAL_VALUE_MISMATCH'}:{})};
}

export function validateConstructionPlan(input){
 const parsed=constructionPlanSchema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'CONSTRUCTION_SCHEMA',detail:parsed.error.message}]};
 const plan=parsed.data,findings=[],seen=new Set(),addFinding=(ruleId,detail)=>findings.push({ruleId,detail});
 const allIds=plan.interactions.map(i=>i.id);
 for(const i of plan.interactions){
  if(seen.has(i.id))addFinding('CONSTRUCTION_DUPLICATE_ID',i.id);seen.add(i.id);
  if(i.id===i.sourceNodeId)addFinding('CONSTRUCTION_FRESH_ID',i.id);
  const pm=partMap(i),uses=new Map(),derivedIds=new Set();
  for(const p of i.parts){
   if(seen.has(p.id))addFinding('CONSTRUCTION_DUPLICATE_ID',p.id);seen.add(p.id);
   if(new Set(p.choices.map(c=>c.value)).size!==p.choices.length||!p.choices.some(c=>c.value===p.expected))addFinding('CONSTRUCTION_CANDIDATES',p.id);
   const signs=['unary-sign','binary-operation'].includes(p.role);
   if(p.choices.some(c=>signs?c.expression||!['+','-'].includes(c.value):!c.expression))addFinding('STRUCTURE_ROLE_MISMATCH',p.id);
   if(['rational','coefficient'].includes(p.role)&&p.choices.some(c=>c.expression?.kind!=='rational'))addFinding('STRUCTURE_ROLE_MISMATCH',p.id);
   if(p.role==='signed-term'&&p.choices.some(c=>c.expression?.kind==='add'))addFinding('STRUCTURE_ROLE_MISMATCH',p.id);
   const keys=p.choices.map(c=>c.expression?hash(c.expression):c.value);
   if(new Set(keys).size!==keys.length)addFinding('CONSTRUCTION_EQUIVALENT_CHOICE',p.id);
   // Canonical small rationals catch e.g. 1 and 2/2, without a string parser.
   for(let a=0;a<p.choices.length;a++)for(let b=0;b<a;b++){const x=p.choices[a].expression,y=p.choices[b].expression;if(x?.kind==='rational'&&y?.kind==='rational'&&BigInt(x.n)*BigInt(y.d)===BigInt(y.n)*BigInt(x.d))addFinding('CONSTRUCTION_EQUIVALENT_CHOICE',p.id);}
  }
  walk(i.assembly,(node,path)=>{
   if(node.kind==='part'){uses.set(node.partId,(uses.get(node.partId)??0)+1);if(['unary-sign','binary-operation'].includes(pm.get(node.partId)?.role))addFinding('STRUCTURE_ROLE_MISMATCH',path);}
   if(node.kind==='unary'){uses.set(node.sign.partId,(uses.get(node.sign.partId)??0)+1);if(pm.get(node.sign.partId)?.role!=='unary-sign')addFinding('STRUCTURE_ROLE_MISMATCH',path);}
   if(node.kind==='binary'&&typeof node.operation!=='string'){uses.set(node.operation.partId,(uses.get(node.operation.partId)??0)+1);if(pm.get(node.operation.partId)?.role!=='binary-operation')addFinding('STRUCTURE_ROLE_MISMATCH',path);}
   if(node.kind==='remaining-term'){
    if(derivedIds.has(node.id)||seen.has(node.id))addFinding('CONSTRUCTION_DUPLICATE_ID',node.id);derivedIds.add(node.id);seen.add(node.id);
    const p=pm.get(node.fromPartId);if(p?.role!=='signed-term'||hash(node.terms)!==hash(p.choices)||node.terms.some(c=>!c.expression))addFinding('CONSTRUCTION_DERIVED_POOL',path);
   }
  });
  if(i.parts.some(p=>!uses.has(p.id))||[...uses.keys()].some(k=>!pm.has(k)))addFinding('CONSTRUCTION_PART_COVERAGE',i.id);
  if(i.prerequisiteInteractionIds.includes(i.id)||new Set(i.prerequisiteInteractionIds).size!==i.prerequisiteInteractionIds.length)addFinding('CONSTRUCTION_PREREQUISITE',i.id);
  const done=assembleConstruction(i,Object.fromEntries(i.parts.map(p=>[p.id,p.expected])));
  if(done.status!=='COMPLETE'||hash(done.statement)!==hash(i.expectedStatement))addFinding('CONSTRUCTION_ASSEMBLY',i.id);
 }
 // Internal dependencies must be acyclic; external prerequisites are retained for the unit adapter.
 const done=new Set();for(let pass=0;pass<allIds.length;pass++)for(const i of plan.interactions)if(i.prerequisiteInteractionIds.filter(k=>allIds.includes(k)).every(k=>done.has(k)))done.add(i.id);
 if(done.size!==allIds.length)addFinding('CONSTRUCTION_PREREQUISITE_CYCLE','interactions');
 return {status:findings.length?'FAIL':'PASS',findings,planHash:hash(input),partCount:plan.interactions.reduce((n,i)=>n+i.parts.length,0),meaningAuditRequired:true};
}

/** Finite runtime verification through the existing exact symbolic adapter.
 * Compare constructed sides with the source-bound expected construction, rather
 * than asserting Abs identities without their separately checked conditions.
 */
export function verifyConstructionMath(input,{maxCasesPerParent=512,maxTotalCases=2048,...mathOptions}={}){
 const structural=validateConstructionPlan(input);if(structural.status!=='PASS')return structural;
 if(!Number.isSafeInteger(maxCasesPerParent)||maxCasesPerParent<1||maxCasesPerParent>512||!Number.isSafeInteger(maxTotalCases)||maxTotalCases<1||maxTotalCases>2048)return {status:'FAIL',reason:'CONSTRUCTION_FINITE_BUDGET_CONFIG'};
 const cases=[],items=[],candidateChecks=[],knownResults=[];
 for(const i of input.interactions){
  const count=i.parts.reduce((n,p)=>n*p.choices.length,1);
  if(count>maxCasesPerParent||cases.length+count>maxTotalCases)return {status:'UNSUPPORTED',reason:'CONSTRUCTION_FINITE_BUDGET',parentRef:i.id,caseCount:count,maxCasesPerParent,maxTotalCases};
  for(const p of i.parts){
   if(['unary-sign','binary-operation'].includes(p.role))continue;
   const id=i.id+':choices:'+p.id;candidateChecks.push(id);
   items.push({id,payload:{kind:'choices',expected:p.choices.find(c=>c.value===p.expected).expression,choices:p.choices.map(c=>({id:c.value,value:c.expression}))}});
  }
  const drafts=i.parts.reduce((rows,p)=>rows.flatMap(d=>p.choices.map(c=>({...d,[p.id]:c.value}))),[{}]);
  for(const [index,draft]of drafts.entries()){
   const grade=gradeConstruction(i,draft),expected=i.expectedStatement,actual=grade.statement;
   if(!actual)return {status:'FAIL',findings:[{ruleId:'CONSTRUCTION_FINITE_ASSEMBLY',detail:i.id}]};
   const pairs=(actual.kind==='expression'?[[expected.expression,actual.expression]]:[[expected.left,actual.left],[expected.right,actual.right]]).filter(([a,b])=>hash(a)!==hash(b));
   const states=pairs.flatMap(([a,b],n)=>[{id:'expected'+n,statement:{kind:'expression',expression:a}},{id:'actual'+n,statement:{kind:'expression',expression:b}}]);
   const id=i.id+':case:'+index;cases.push({id,parentRef:i.id,draft,correct:grade.correct,gradingPurpose:i.gradingPurpose??'mathematical-value'});
   if(!pairs.length)knownResults.push({id,status:'PASS',checks:[],proofStatus:'STRUCTURAL_AST_IDENTITY'});
   else items.push({id,payload:{graph:{states,transitions:pairs.map((_,n)=>({id:'compare'+n,from:'expected'+n,to:'actual'+n,ruleId:'rewrite'}))}}});
  }
 }
 const results=[...knownResults];
 for(let offset=0;offset<items.length;offset+=150){
  const batch=verifyMathPayload({kind:'batch',items:items.slice(offset,offset+150)},mathOptions);
  if(!Array.isArray(batch.results))return {status:batch.status==='FAIL'?'FAIL':'UNSUPPORTED',reason:batch.reason??'CONSTRUCTION_MATH_ADAPTER',receipt:batch};
  results.push(...batch.results);
 }
 const findings=[],byId=new Map(results.map(r=>[r.id,r]));
 const unsupported=results.filter(r=>r.status==='UNSUPPORTED');if(unsupported.length)return {status:'UNSUPPORTED',reason:'CONSTRUCTION_MATH_DOMAIN',receipts:unsupported};
 for(const id of candidateChecks)if(byId.get(id)?.status!=='PASS')findings.push({ruleId:'CONSTRUCTION_EQUIVALENT_CHOICE',detail:id,receipt:byId.get(id)});
 const caseReceipts=cases.map(c=>{
  const receipt=byId.get(c.id),equivalent=receipt?.status==='PASS';
  if(!receipt||!['PASS','FAIL'].includes(receipt.status)||c.correct&&!equivalent||c.gradingPurpose==='mathematical-value'&&c.correct!==equivalent)findings.push({ruleId:'CONSTRUCTION_GRADING_EQUIVALENCE_MISMATCH',detail:c.id,receipt});
  return {parentRef:c.parentRef,draft:c.draft,correct:c.correct,mathematicallyEquivalent:equivalent,...(c.gradingPurpose==='specified-order'&&!c.correct?{specifiedOrderMismatch:true}:{}),receipt};
 });
 return {status:findings.length?'FAIL':'PASS',findings,constructionDesignHash:hash(input),caseCount:cases.length,candidateCheckCount:candidateChecks.length,caseReceipts,meaningAuditRequired:true,formalProof:false,proofStatus:'FINITE_SYMBOLIC_COMPARISONS',automaticAcceptance:false};
}

const math=latex=>({type:'math',latex});
function renderExpression(i,n,draft){
 // Keep already known mathematical subtrees intact (e.g. sqrt(5)-3), rather than
 // re-expanding their negative factors merely because another subtree has a hole.
 try{const known=expression(i,n,draft);if(expressionSchema.safeParse(known).success)return [math(expressionLatex(known))];}catch{/* unresolved typed parts are rendered below */}
 const slot=p=>({type:'slot',id:p.id,partId:p.id,interactionRef:i.id,role:p.role});
 if(n.kind==='part'){const p=i.parts.find(p=>p.id===n.partId),c=resolvePart(i,draft,n.partId);return c?[math(expressionLatex(c.expression))]:[slot(p)];}
 if(n.kind==='unary'){const p=i.parts.find(p=>p.id===n.sign.partId),c=resolvePart(i,draft,p.id),a=n.argument,wrap=['add','binary','unary'].includes(a.kind);return [...(c?[math(c.value)]:[slot(p)]),...(wrap?[math('(')]:[]),...renderExpression(i,a,draft),...(wrap?[math(')')]:[])];}
 if(n.kind==='binary'){
  const a=renderExpression(i,n.left,draft),b=renderExpression(i,n.right,draft),p=typeof n.operation==='string'?null:i.parts.find(p=>p.id===n.operation.partId),op=p?resolvePart(i,draft,p.id)?.value:n.operation;
  let right;try{right=expression(i,n.right,draft);}catch{/* pending part */}
  const negative=right?.kind==='rational'&&right.n.startsWith('-')||right?.kind==='multiply'&&right.args[0]?.kind==='rational'&&right.args[0].n.startsWith('-');
  return [...a,...(op?[...(op==='+'&&negative?[]:[math(op)])]:[slot(p)]),...(op==='-'&&negative?[math('('),...b,math(')')]:b)];
 }
 if(n.kind==='remaining-term'){const chosen=draft[n.fromPartId],c=n.terms.some(c=>c.value===chosen)?n.terms.find(c=>c.value!==chosen):null;return c?[math(expressionLatex(c.expression))]:[{type:'derived-slot',id:n.id,partId:n.id,interactionRef:i.id,fromPartId:n.fromPartId,gradedIndependently:false}];}
 if(n.kind==='absolute')return [math('\\left|'),...renderExpression(i,n.argument,draft),math('\\right|')];
 if(n.kind==='add'||n.kind==='multiply')return n.args.flatMap((v,index)=>[...(index?[math(n.kind==='add'?'+':'\\cdot ')]:[]),...renderExpression(i,v,draft)]);
 if(n.kind==='power')return [...renderExpression(i,n.base,draft),math(`^{${n.exponent}}`)];
 if(n.kind==='divide')return [{type:'fraction',numerator:renderExpression(i,n.numerator,draft),denominator:renderExpression(i,n.denominator,draft)}];
 return [math(expressionLatex(n))];
}
function rendered(i,draft){
 const s=i.assembly,parts=s.kind==='expression'?{left:[],relation:'',right:renderExpression(i,s.expression,draft)}:{left:renderExpression(i,s.left,draft),relation:({'<=':'\\le','>=':'\\ge'})[s.operator]??s.operator,right:renderExpression(i,s.right,draft)};
 return {...parts,tokens:s.kind==='expression'?parts.right:[...parts.left,math(parts.relation),...parts.right]};
}
export function compileConstruction(interaction){
 const checked=validateConstructionPlan({schemaVersion:'construction-plan/1',unitId:'single-construction',revision:1,interactions:[interaction]});if(checked.status!=='PASS')return checked;
 const all=Object.fromEntries(interaction.parts.map(p=>[p.id,p.expected])),assembled=assembleConstruction(interaction,all);
 if(assembled.status!=='COMPLETE')return assembled;
 return {status:'PASS',schemaVersion:'construction-reading/1',id:interaction.id,sourceNodeId:interaction.sourceNodeId,sourceRefs:interaction.sourceRefs,prerequisiteInteractionIds:interaction.prerequisiteInteractionIds,learnerDecision:interaction.learnerDecision,activePrompt:interaction.activePrompt,gradingPurpose:interaction.gradingPurpose,parts:interaction.parts,assembly:interaction.assembly,expectedStatement:interaction.expectedStatement,masked:rendered(interaction,{}),completed:{...rendered(interaction,all),latex:assembled.latex},tokens:rendered(interaction,{}).tokens,constructionHash:hash(interaction)};
}
export function projectConstruction(interaction,draft={},view={}){
 const checked=assembleConstruction(interaction,draft);if(checked.status==='FAIL')throw Error(checked.reason);
 const formula=rendered(interaction,draft);
 return {schemaVersion:'construction-visible/1',id:interaction.id,sourceNodeId:interaction.sourceNodeId,learnerDecision:interaction.learnerDecision,activePrompt:view.solved?'':interaction.activePrompt,formula,
  parts:interaction.parts.map(p=>({id:p.id,role:p.role,...(Object.hasOwn(draft,p.id)?{value:draft[p.id]}:{}),...(view.choicesOpen===p.id?{choices:p.choices.map(({value,expression})=>({value,...(expression?{latex:expressionLatex(expression)}:{})}))}:{})})),complete:checked.status==='COMPLETE'};
}
