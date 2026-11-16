import {z} from 'zod';
import {graphSchema} from '../solution/graph.mjs';
import {constructionPlanSchema} from '../interaction/construction.mjs';
import {layoutPlanSchema} from '../layout/plan.mjs';
export const id=z.string().min(1).max(160);
const ids=z.array(id);
const copy=z.discriminatedUnion('type',[z.object({type:z.literal('text'),text:z.string()}).strict(),z.object({type:z.literal('math'),latex:z.string()}).strict(),z.object({type:z.literal('term'),text:z.string()}).strict()]);
export const planSchema=z.object({
 schemaVersion:z.literal('transformation-plan/1'),unitId:id,presentationVersion:z.number().int().positive(),baseIRHash:id,
 gradingHash:id,scope:z.object({problemId:id,nodeIds:ids,stageIds:ids,assumptionRefs:ids}).strict(),
 graphs:z.array(graphSchema).min(1),
 groups:z.array(z.object({id,kind:z.enum(['expression-chain','relation-sequence','independent-comparison']),patternId:id,graphRef:id,
  stageIds:ids,sourceNodeIds:ids,stepRefs:ids,number:z.number().int().positive(),numberId:id,
  boundaryReason:z.string().min(1),conclusion:z.object({kind:z.enum(['terminal-in-flow','interpretation','join','reference','restate-with-reason']),stateRef:id,reason:z.string().optional()}).strict(),
  boundaryNodeIds:ids.optional(),
  rows:z.array(z.object({id,graphRef:id,stateRef:id,sourceNodeId:id,sourceRefs:ids,role:z.enum(['main','auxiliary']),visibleAfter:ids,interactionRef:id.nullable(),slots:z.array(z.object({id,interactionRef:id,path:id}).strict()),
   displayForm:z.literal('explicit-products').optional(),before:z.array(copy),after:z.array(copy),afterVisible:z.boolean().default(true),continuation:z.boolean().default(false)}).strict()).min(1),
 }).strict()).min(1),
 proseOverrides:z.array(z.object({nodeId:id,sourceRefs:ids,visibleAfterNodeId:id,after:z.array(copy)}).strict()).optional(),
 candidates:z.array(z.object({id,nodeId:id,blankRole:z.enum(['operation','operand','target','expression','calculation','relation','justification','interpretation']),learnerDecision:z.string().min(1),availableFactRefs:ids,prerequisiteInteractionIds:ids,nextUseRef:id,taskContract:z.object({kind:id,requestedOperation:id}).strict(),decision:z.enum(['ADOPT','REJECT']),reason:z.string().min(1),expected:z.string(),targetLatex:z.string(),choices:ids}).strict()),
 coverage:z.array(z.object({sourceRef:id,disposition:z.enum(['main-row','auxiliary','prose','condition','reference','superseded-display']),rowRef:id,reason:z.string().min(1)}).strict()),
 numberAliases:z.record(z.string(),id),
}).strict();
/** Explicit wrapper: the unchanged v1 source plan keeps its original source/grading checks. */
export const planV2Schema=z.object({schemaVersion:z.literal('transformation-plan/2'),sourcePlan:planSchema,
 constructionPlan:constructionPlanSchema,layoutPlan:layoutPlanSchema,
 constructionBindings:z.array(z.object({rowRef:id,constructionRef:id}).strict()),
 rootRowMerges:z.array(z.object({rootRowRef:id,intoRowRef:id}).strict()).default([]),
}).strict();
export const getPath=(object,path)=>path.split('.').reduce((v,k)=>/^(?:[a-zA-Z][a-zA-Z0-9_]*|[0-9]+)$/.test(k)&&!['__proto__','prototype','constructor'].includes(k)&&v&&Object.hasOwn(v,k)?v[k]:undefined,object);
export function putPath(object,path,value){const keys=path.split('.');let out=object;for(const key of keys.slice(0,-1))out=out[key];out[keys.at(-1)]=value;}

// QF r3 explicit opt-in only; unchanged core expression schema.
import {expressionSchema,expressionLatex} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
/** 隔離候補。Bが承認compiler4内へ統合するQF限定wrapper。core ASTは変更しない。 */
const ref=z.object({blockId:z.string().min(1),partIndex:z.number().int().nonnegative(),blockHash:z.string().regex(/^[a-f0-9]{64}$/),partHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
const apply=z.object({kind:z.literal('function-application'),name:z.literal('f'),functionDefinitionRef:ref,argument:expressionSchema}).strict();
const quantity=z.object({kind:z.literal('named-quantity'),name:z.literal('output'),label:z.literal('出てくる数'),sourceRef:ref}).strict();
const operand=z.union([expressionSchema,apply,quantity]);
const relation=z.object({kind:z.literal('relation'),operator:z.enum(['=','<','<=','>','>=']),left:operand,right:operand}).strict();
export const mixedOwnerSchema=z.object({schemaVersion:z.literal('qf01-mixed-owner/1'),contextId:z.enum(['qf01-r3-context-rule-linear','qf01-r3-context-rule-square','qf01-r3-context-rectangle']),statement:z.union([
 z.object({kind:z.literal('expression'),expression:expressionSchema}).strict(),relation,
 z.object({kind:z.literal('conjunction'),connective:z.literal('かつ'),statements:z.array(relation).min(2).max(2)}).strict(),
 z.object({kind:z.literal('relation-chain'),operands:z.array(expressionSchema).length(3),operators:z.array(z.enum(['<','<=','>','>='])).length(2)}).strict()
])}).strict();
export function mixedGetPath(object,path){if(typeof path!=='string'||!path||!path.split('.').every(k=>/^(?:[a-zA-Z][a-zA-Z0-9_]*|\d+)$/.test(k)&&!['__proto__','constructor','prototype'].includes(k)))throw Error('MIXED_UNSAFE_PATH');return path.split('.').reduce((v,k)=>{if(!v||!Object.hasOwn(v,k))throw Error('MIXED_UNKNOWN_PATH');return v[k]},object)}
export function normalizeMathSurface(s){return s.replace(/\\text\{([^{}]*)\}/g,'$1').replaceAll('\\left','').replaceAll('\\right','').replaceAll('\\times','×').replaceAll('\\cdot','×').replaceAll('−','-').replaceAll('²','^2').replace(/[{}\s]/g,'')}
export function formatMixedOwner(owner,{targetPath=null,mask=false,notation={},slotMarker=null}={}){
 if(slotMarker!==null&&slotMarker!=='§0§')throw Error('MIXED_UNSAFE_SLOT_MARKER');
 mixedOwnerSchema.parse(owner);if(mask)mixedGetPath(owner,targetPath);
 const styleSchema=z.object({product:z.enum(['times','implicit']).optional(),group:z.boolean().optional(),explicitNegativeOne:z.boolean().optional(),signedCoefficient:z.boolean().optional(),signedAddend:z.boolean().optional()}).strict();
 for(const[path,style]of Object.entries(notation)){styleSchema.parse(style);const n=mixedGetPath(owner,path);if(style.product&&n.kind!=='multiply'||style.group&&n.kind!=='add'||style.explicitNegativeOne&&n.kind!=='multiply'||(style.signedCoefficient||style.signedAddend)&&n.kind!=='multiply')throw Error('MIXED_NOTATION_TARGET');}
 let count=0;const walk=(n,path,context='root')=>{
  if(++count>400)throw Error('MIXED_OWNER_LIMIT');if(mask&&path===targetPath)return slotMarker??'\\boxed{\\square}';
  const style=notation[path]??{};
  if(n.kind==='function-application')return 'f('+walk(n.argument,path+'.argument')+')';
  if(n.kind==='named-quantity')return '\\text{'+n.label+'}';
  if(n.kind==='relation')return walk(n.left,path+'.left')+({'<=':'\\le','>=':'\\ge'}[n.operator]??n.operator)+walk(n.right,path+'.right');
  if(n.kind==='expression')return walk(n.expression,path+'.expression');
  if(n.kind==='conjunction')return n.statements.map((s,j)=>walk(s,path+'.statements.'+j)).join('\\text{ かつ }');
  if(n.kind==='relation-chain')return n.operands.map((x,j)=>(j?({'<=':'\\le','>=':'\\ge'}[n.operators[j-1]]??n.operators[j-1]):'')+walk(x,path+'.operands.'+j)).join('');
  if(n.kind==='add')return n.args.map((a,j)=>{let v=walk(a,path+'.args.'+j,'add');if(notation[path+'.args.'+j]?.group)v='('+v+')';return (j&&!v.startsWith('-')&&!(mask&&(notation[path+'.args.'+j]?.signedCoefficient||notation[path+'.args.'+j]?.signedAddend)&&(targetPath===path+'.args.'+j||targetPath.startsWith(path+'.args.'+j+'.')))?'+':'')+v}).join('');
  if(n.kind==='multiply'){
   if(n.args.length===2&&n.args[0].kind==='rational'&&n.args[0].n==='-1'&&n.args[0].d==='1'&&!style.explicitNegativeOne){let v=walk(n.args[1],path+'.args.1','multiply');if(n.args[1].kind==='add')v='('+v+')';return '-'+v;}
   return n.args.map((a,j)=>{let v=walk(a,path+'.args.'+j,'multiply');if(a.kind==='add'||a.kind==='rational'&&a.n.startsWith('-')&&j>0)v='('+v+')';if(j&&style.product==='times')return '\\times'+v;return v}).join('');
  }
  if(n.kind==='power'){let v=walk(n.base,path+'.base','power');if(n.base.kind!=='symbol'&&!(n.base.kind==='rational'&&!n.base.n.startsWith('-')))v='('+v+')';return v+'^{'+n.exponent+'}';}
  if(n.kind==='divide')return '\\frac{'+walk(n.numerator,path+'.numerator')+'}{'+walk(n.denominator,path+'.denominator')+'}';
  // All remaining leaves are validated by unchanged core expressionSchema.
  return expressionLatex(n);
 };
 return walk(owner.statement,'statement');
}
export function verifyMixedOwnerBinding(binding,canonicalBlocks,definitions){
 const errors=[];const fail=s=>errors.push(s);
 try{
  mixedOwnerSchema.parse(binding.ownerAST);if(hash(binding.ownerAST)!==binding.ownerASTHash)fail('OWNER_HASH');
  if(hash(binding.targetAST)!==binding.targetASTHash)fail('TARGET_HASH');
  if(hash(binding.targetStatement.kind==='expression'?binding.targetStatement.expression:binding.targetStatement)!==binding.targetASTHash)fail('TARGET_STATEMENT_BINDING');
  if(hash(mixedGetPath(binding.ownerAST,binding.targetPath))!==binding.targetASTHash)fail('OWNER_TARGET_SUBTREE');
  const block=canonicalBlocks.get(binding.sourceOwnerRef.blockId);if(!block||hash(block)!==binding.sourceOwnerRef.blockHash||hash(block.parts)!==binding.sourceOwnerRef.partsHash)fail('SOURCE_OWNER');
  if(block?.contextId!==binding.ownerAST.contextId)fail('OWNER_CONTEXT');
  if(binding.canonicalTargetRef.blockId!==binding.sourceOwnerRef.blockId||binding.canonicalTargetRef.partIndex!==binding.sourceOwnerRef.targetPartIndex)fail('CANONICAL_TARGET_LOCATION');
  const part=block?.parts[binding.sourceOwnerRef.targetPartIndex];if(!part||part.type!=='math'||hash(part)!==binding.sourceOwnerRef.targetPartHash)fail('SOURCE_TARGET_PART');
  const checkRefs=n=>{if(!n||typeof n!=='object')return;
   if(n.kind==='function-application'){
    const def=definitions.find(d=>hash(d.sourceRef)===hash(n.functionDefinitionRef));
    if(def){expressionSchema.parse(def.body);const sourceDef=canonicalBlocks.get(def.sourceRef.blockId),readout='f('+def.variable+')='+expressionLatex(def.body);if(!sourceDef||sourceDef.contextId!==def.contextId||normalizeMathSurface(readout)!==normalizeMathSurface(sourceDef.parts[def.sourceRef.partIndex]?.latex??''))fail('FUNCTION_DEFINITION_BODY');}
    if(!def||def.contextId!==binding.ownerAST.contextId||def.name!==n.name)fail('FUNCTION_DEFINITION_SCOPE');
    const b=def&&canonicalBlocks.get(def.sourceRef.blockId);if(!b||hash(b)!==def.sourceRef.blockHash||hash(b.parts[def.sourceRef.partIndex])!==def.sourceRef.partHash)fail('FUNCTION_DEFINITION_SOURCE');
   }
   if(n.kind==='named-quantity'){const b=canonicalBlocks.get(n.sourceRef.blockId);if(!b||hash(b)!==n.sourceRef.blockHash||hash(b.parts[n.sourceRef.partIndex])!==n.sourceRef.partHash)fail('NAMED_QUANTITY_SOURCE');}
   for(const v of Object.values(n))if(v&&typeof v==='object')Array.isArray(v)?v.forEach(checkRefs):checkRefs(v);
  };checkRefs(binding.ownerAST);
  const full=formatMixedOwner(binding.ownerAST,{notation:binding.notation});
  const source=block?.type==='paragraph'?part?.latex:block?.parts.map(p=>p.latex??p.text).join('');
  if(normalizeMathSurface(full)!==normalizeMathSurface(source??''))fail('OWNER_SOURCE_SURFACE');
  const target=formatMixedOwner({schemaVersion:'qf01-mixed-owner/1',contextId:binding.ownerAST.contextId,statement:binding.targetStatement},{notation:binding.targetNotation??{}});
  if(normalizeMathSurface(target)!==normalizeMathSurface(part?.latex??''))fail('TARGET_SOURCE_SURFACE');
  const masked=formatMixedOwner(binding.ownerAST,{targetPath:binding.targetPath,mask:true,notation:binding.notation});
  const expectedMask=block?.type==='paragraph'?'\\boxed{\\square}':block?.parts.map((p,j)=>j===binding.sourceOwnerRef.targetPartIndex?'\\boxed{\\square}':p.latex??p.text).join('');
  if(normalizeMathSurface(masked)!==normalizeMathSurface(expectedMask??''))fail('MASK_SOURCE_PART_LOCATION');
  if(normalizeMathSurface(binding.expected.gradingValue)!==normalizeMathSurface(part?.latex??''))fail('GRADING_SOURCE_TARGET');
  if((masked.match(/\\boxed\{\\square\}/g)??[]).length!==1)fail('MASK_COUNT');
  return {status:errors.length?'FAIL':'PASS',errors,full,masked,target,qualification:'owner/target/source/formatter構造照合のみ。数学的導出・全候補採点・正式CODEとは別。'};
 }catch(e){return {status:'FAIL',errors:[...errors,e.message]}}
}

import {createHash} from 'node:crypto';
export const mixedCanonicalHash=value=>{const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;return createHash('sha256').update(JSON.stringify(sort(value))).digest('hex')};
