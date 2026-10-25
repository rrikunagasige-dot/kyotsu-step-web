/** Bounded cross-segment proofs. This is not a general theorem prover. */
import {z} from 'zod';
import {expressionSchema as E,statementSchema,intervalSchema,symbols} from './expression.mjs';
import {verifyMathPayload} from './verify.mjs';
import {hash} from '../util.mjs';
const id=z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/),relation=statementSchema.options[1];
const check=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('identity'),left:E,right:E}).strict(),
 z.object({kind:z.literal('claim'),statement:relation}).strict(),
 z.object({kind:z.literal('equivalence'),left:relation,right:relation,forwardProof:id,reverseProof:id}).strict(),
 z.object({kind:z.literal('square-order'),left:E,right:E,operator:z.enum(['<','<=','>','>='])}).strict(),
 z.object({kind:z.literal('transformation'),before:relation,after:relation,ruleId:z.enum(['add-both-sides','multiply-both-sides','divide-both-sides']),operand:E}).strict(),
 z.object({kind:z.literal('case-join'),statement:relation,branches:z.array(z.object({domain:intervalSchema,proofId:id}).strict()).min(2).max(8)}).strict(),
 z.object({kind:z.literal('answer-form'),expected:E,choices:z.array(z.object({id,value:E}).strict()).min(2).max(6),pattern:z.literal('right-coordinate-minus-left'),rightCoordinate:E,leftCoordinate:E}).strict(),
]);
export const bundleSchema=z.object({schemaVersion:z.literal('solution-bundle/1'),id,
 sourceHash:id,nodeIds:z.array(id).min(1),
 problems:z.array(z.object({id,variable:id,sourceRefs:z.array(id).min(1),domain:intervalSchema,initialFacts:z.array(id),
  segments:z.array(z.object({id,nodeIds:z.array(id).min(1),requires:z.array(id),produces:id,domain:intervalSchema.optional(),check}).strict()).min(1).max(100),
  conclusions:z.array(id).min(1),
 }).strict()).min(1).max(20),
 nodeCoverage:z.array(z.object({nodeId:id,factRefs:z.array(id),meaningReason:z.string().min(1)}).strict()),
}).strict();
export function validateBundle(input){
 try{for(const p of input.problems??[])for(const s of p.segments??[])symbols(s);}catch(e){return {status:'FAIL',reason:'BUNDLE_AST_LIMIT',detail:e.message};}
 const parsed=bundleSchema.safeParse(input);if(!parsed.success)return {status:'FAIL',reason:'BUNDLE_SCHEMA',detail:parsed.error.message};
 const b=parsed.data,findings=[],nodes=new Set(b.nodeIds),ids=new Set(),allFacts=new Set();
 const add=(rule,id)=>findings.push({rule,id});
 if(nodes.size!==b.nodeIds.length)add('DUPLICATE_NODE',b.id);
 for(const p of b.problems){
  if(ids.has(p.id))add('DUPLICATE_ID',p.id);ids.add(p.id);
  const facts=new Set(p.initialFacts);
  for(const s of p.segments){
   if(ids.has(s.id)||allFacts.has(s.produces)||facts.has(s.produces))add('DUPLICATE_ID_OR_FACT',s.id);ids.add(s.id);
   if(s.nodeIds.some(n=>!nodes.has(n)))add('UNKNOWN_NODE',s.id);
   if(symbols(s).some(name=>name!==p.variable))add('UNKNOWN_OR_OTHER_PROBLEM_SYMBOL',s.id);
   if(s.requires.some(f=>!facts.has(f)))add('UNAVAILABLE_OR_CROSS_PROBLEM_FACT',s.id);
   if(s.check.kind==='equivalence'&&(!s.requires.includes(s.check.forwardProof)||!s.requires.includes(s.check.reverseProof)))add('IMPLICATION_PROOF_NOT_REQUIRED',s.id);
   if(s.check.kind==='case-join'&&s.check.branches.some(x=>!s.requires.includes(x.proofId)))add('CASE_PROOF_NOT_REQUIRED',s.id);
   facts.add(s.produces);allFacts.add(s.produces);
  }
  if(p.conclusions.some(f=>!facts.has(f)))add('MISSING_CONCLUSION',p.id);
 }
 if(b.nodeCoverage.length!==nodes.size||new Set(b.nodeCoverage.map(r=>r.nodeId)).size!==nodes.size)add('NODE_COVERAGE_COUNT',b.id);
 for(const r of b.nodeCoverage)if(!nodes.has(r.nodeId)||r.factRefs.some(f=>!allFacts.has(f)))add('NODE_COVERAGE_REF',r.nodeId);
 return {status:findings.length?'FAIL':'PASS',findings,bundleHash:hash(b),scope:'MATH_SEGMENTS_ONLY',meaningAuditRequired:true};
}
export function verifyBundle(bundle){const result=validateBundle(bundle);return result.status==='PASS'?{...verifyMathPayload(bundle),bundleHash:result.bundleHash,scope:result.scope,meaningAuditRequired:true}:result;}
