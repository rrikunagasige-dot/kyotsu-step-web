import { z } from 'zod';
import {expressionSchema,statementSchema,symbols} from './expression.mjs';
import {hash} from '../util.mjs';
const id=z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/);
export const graphSchema=z.object({
  schemaVersion:z.literal('solution-graph/1'),id,variable:id,parameters:z.array(id),initialFacts:z.array(id),
  givens:z.array(z.object({id,statement:statementSchema}).strict()).min(1),
  rootStateId:id,goalStateIds:z.array(id).min(1),
  states:z.array(z.object({id,statement:statementSchema,activeVariable:id,fixedParameters:z.array(id),facts:z.array(id)}).strict()).min(1),
  transitions:z.array(z.object({id,from:id,to:id,
    ruleId:z.enum(['rewrite','substitute','add-both-sides','divide-both-sides','multiply-both-sides','extrema']),
    requiredForm:z.enum(['expanded','completed-square','collected']).optional(),
    operand:expressionSchema.optional(),substitutions:z.record(z.string(),expressionSchema).optional(),
    requires:z.array(id),produces:z.array(id),basisRefs:z.array(id).min(1),
  }).strict()),
}).strict();
export function validateGraph(input){
  // Inspect depth before recursive schema validation as well as before the Python adapter.
  try{symbols(input);}catch(e){return {status:'FAIL',findings:[{ruleId:'AST_LIMIT',detail:e.message}]};}
  const parsed=graphSchema.safeParse(input);
  if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'GRAPH_SCHEMA',detail:parsed.error.message}]};
  const g=parsed.data,findings=[];const add=(ruleId,detail)=>findings.push({ruleId,detail});
  const states=new Map(g.states.map(s=>[s.id,s]));const tids=new Set(g.transitions.map(t=>t.id));
  if(states.size!==g.states.length||tids.size!==g.transitions.length)add('DUPLICATE_GRAPH_ID',g.id);
  const declarations=[...g.initialFacts,...g.givens.map(a=>a.id),...g.transitions.flatMap(t=>t.produces)];
  if(new Set(declarations).size!==declarations.length)add('DUPLICATE_FACT_DECLARATION',g.id);
  if(!states.has(g.rootStateId)||g.goalStateIds.some(id=>!states.has(id)))add('GRAPH_ENDPOINT',g.id);
  if(!g.givens.some(a=>hash(a.statement)===hash(states.get(g.rootStateId)?.statement)))add('ROOT_NOT_GIVEN',g.id);
  const allowed=new Set([g.variable,...g.parameters]);
  for(const s of g.states){
    if(!allowed.has(s.activeVariable)||s.fixedParameters.includes(s.activeVariable)||s.fixedParameters.some(v=>!allowed.has(v)))add('VARIABLE_ROLE',s.id);
    if(symbols(s.statement).some(x=>!allowed.has(x)))add('UNKNOWN_SYMBOL',s.id);
  }
  const bases=new Set([...g.initialFacts,...g.givens.map(g=>g.id)]);
  for(const t of g.transitions)for(const f of t.produces)bases.add(f);
  for(const t of g.transitions)if(t.basisRefs.some(f=>!bases.has(f)))add('UNKNOWN_BASIS',t.id);
  const facts=new Map([[g.rootStateId,new Set(g.initialFacts)]]);const pending=[...g.transitions];const done=new Set();
  for(let i=0;pending.length&&i<=g.transitions.length;i++){
    let progress=false;
    for(const t of [...pending]){
      if(!states.has(t.from)||!states.has(t.to)){add('DANGLING_TRANSITION',t.id);pending.splice(pending.indexOf(t),1);continue;}
      if(!facts.has(t.from))continue;
      if(t.to===g.rootStateId||done.has(t.to)){add('MERGE_OR_CYCLE_REQUIRES_EXPLICIT_BRANCH_MODEL',t.id);pending.splice(pending.indexOf(t),1);continue;}
      if(t.requires.some(f=>!facts.get(t.from).has(f)))add('UNLEARNED_FACT',t.id);
      if(t.basisRefs.some(f=>!facts.get(t.from).has(f)&&!g.givens.some(a=>a.id===f)))add('UNLEARNED_BASIS',t.id);
      if(['add-both-sides','divide-both-sides','multiply-both-sides'].includes(t.ruleId)&&!t.operand)add('MISSING_OPERAND',t.id);
      const next=new Set([...facts.get(t.from),...t.produces]);facts.set(t.to,next);done.add(t.to);progress=true;pending.splice(pending.indexOf(t),1);
    }
    if(!progress)break;
  }
  if(pending.length)add('CYCLE_OR_UNREACHABLE',pending.map(t=>t.id));
  for(const s of g.states)if(!facts.has(s.id))add('UNREACHABLE_STATE',s.id);
  // Numeric givens are not inferred as proved facts by merely including them in a later state.
  for(const s of g.states)if(facts.has(s.id)&&s.facts.some(f=>!facts.get(s.id).has(f)))add('UNPRODUCED_FACT',s.id);
  return {status:findings.length?'FAIL':'PASS',findings,graphHash:hash(g),mathStatus:'NOT_RUN',meaningAuditRequired:true};
}
