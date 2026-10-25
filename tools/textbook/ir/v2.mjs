/** v2 is opt-in; v1 authoring and existing learner data keep their contracts. */
import {z} from 'zod';
import {hash,invariant} from '../util.mjs';
import {graphSchema,validateGraph} from '../solution/graph.mjs';
import {expressionSchema,statementSchema,intervalSchema,statementLatex,expressionLatex} from '../solution/expression.mjs';
import {verifyMathPayload} from '../solution/verify.mjs';
const id=z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/),text=z.string().min(1);
const part=z.discriminatedUnion('type',[
 z.object({type:z.literal('text'),id,text}).strict(),
 z.object({type:z.literal('math'),id,expression:expressionSchema.optional(),statement:statementSchema.optional()}).strict().refine(p=>Boolean(p.expression)!==Boolean(p.statement)),
 z.object({type:z.literal('term'),id,text,usage:z.enum(['first_definition','recall','ordinary'])}).strict(),
 z.object({type:z.literal('slot'),id,interactionId:id,label:z.string().regex(/^[A-Z][0-9]?$/)}).strict(),
]);
const literal=z.object({kind:z.literal('literal'),value:text}).strict();
const answer=z.union([expressionSchema,literal]);
const choiceRow=z.object({id,expression:expressionSchema.optional(),statement:statementSchema.optional()}).strict().refine(r=>Boolean(r.expression)!==Boolean(r.statement));
const interaction=z.object({id,learningAction:z.enum(['judgment','relation','expression','calculation','meaning','selection']),
 learnerDecision:text,availableFacts:z.array(id),withheldKnowledge:text,nextUse:text,
 expected:answer,choices:z.array(z.object({id,value:answer,feedback:z.array(part).min(1),misconception:text.optional(),rows:z.array(choiceRow).optional()}).strict()).min(2),
 hints:z.array(z.array(part).min(1)).max(3),
 supportPolicy:z.object({level:z.enum(['strong','medium','light']),nextProblemAction:text}).strict(),
}).strict();
export const irV2Schema=z.object({schemaVersion:z.literal('production-ir/2'),unitId:id,sourceHash:text,
 sourceBlocks:z.array(z.object({id,kind:text}).strict()).min(1),
 coverage:z.array(z.object({sourceId:id,stepIds:z.array(id),disposition:z.enum(['taught','structural','excluded']),reason:text}).strict()),
 problems:z.array(z.object({id,title:text,prompt:z.array(part).min(1),conditions:z.array(part),goal:text,
  layout:z.enum(['concept','derivation','calculation','cases','word-problem']),graph:graphSchema,
  plot:z.object({id,sourceStateId:id,visibleAfterStateId:id,domain:intervalSchema,alt:text}).strict().optional(),
  steps:z.array(z.object({id,transitionId:id,sourceRefs:z.array(id).min(1),purpose:z.array(part).min(1),
   reason:z.array(part).min(1),afterText:z.array(part).min(1),
   promptParts:z.array(part),interaction:interaction.optional(),noBlankReason:text.optional(),
   slotTargets:z.array(z.object({id,interactionId:id,label:z.string().regex(/^[A-Z][0-9]?$/),path:text}).strict()),
   detail:z.array(part),rejoinStateRef:id.optional(),numberId:id,
  }).strict()).min(1),
 }).strict()).min(1),
}).strict();
export function getPath(value,path){
 const keys=path.split('.');invariant(keys.every(k=>/^(?:[a-zA-Z][a-zA-Z0-9_]*|\d+)$/.test(k)&&!['__proto__','prototype','constructor'].includes(k)),'UNSAFE_TARGET');
 let obj=value;for(const key of keys){invariant(obj&&Object.hasOwn(obj,key),'MISSING_TARGET');obj=obj[key];}return obj;
}
function setPath(value,path,replacement){const keys=path.split('.');getPath(value,path);let o=value;for(const k of keys.slice(0,-1))o=o[k];o[keys.at(-1)]=replacement;}
const answerText=a=>a.kind==='literal'?a.value:expressionLatex(a);
const publicPart=p=>p.type==='math'?{type:'math',id:p.id,latex:p.statement?statementLatex(p.statement):expressionLatex(p.expression)}:{...p};
const equalAnswer=(a,b)=>hash(a)===hash(b);
export function validateIRV2(input,{math=true}={}){
 const pending=[{value:input,depth:0}];let count=0;
 while(pending.length){const {value,depth}=pending.pop();if(++count>50000||depth>48)return {status:'FAIL',findings:[{ruleId:'V2_INPUT_LIMIT'}]};if(value&&typeof value==='object')for(const child of Object.values(value))pending.push({value:child,depth:depth+1});}
 const parsed=irV2Schema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'V2_SCHEMA',detail:parsed.error.message}]};
 const ir=parsed.data,findings=[],ids=new Set(),stepIds=new Set(),sourceIds=new Set(ir.sourceBlocks.map(s=>s.id)),mathReceipts=[],mathJobs=[];
 const add=(ruleId,detail)=>findings.push({ruleId,detail});
 const register=id=>{if(ids.has(id))add('DUPLICATE_ID',id);ids.add(id);};
 if(sourceIds.size!==ir.sourceBlocks.length)add('DUPLICATE_SOURCE',ir.unitId);
 for(const p of ir.problems){
  register(p.id);const gc=validateGraph(p.graph);findings.push(...gc.findings);
  const root=p.graph.states.find(s=>s.id===p.graph.rootStateId);
  if(!p.graph.givens.some(g=>hash(g.statement)===hash(root?.statement)))add('ROOT_NOT_GIVEN',p.id);
  if(math&&gc.status==='PASS')mathJobs.push({id:p.id,payload:{graph:p.graph}});
  const stateMap=new Map(p.graph.states.map(s=>[s.id,s])),edgeMap=new Map(p.graph.transitions.map(e=>[e.id,e]));
  if(p.plot&&(!stateMap.has(p.plot.sourceStateId)||!stateMap.has(p.plot.visibleAfterStateId)))add('FIGURE_STATE',p.id);
  const taught=new Set();const facts=new Set(p.graph.initialFacts);let current=p.graph.rootStateId;
  for(const a of [...p.prompt,...p.conditions])register(a.id);
  for(const s of p.steps){
   register(s.id);register(s.numberId);stepIds.add(s.id);const edge=edgeMap.get(s.transitionId);
   if(!edge){add('UNKNOWN_TRANSITION',s.id);continue;}
   if(edge.from!==current)add('SOLUTION_SEQUENCE',s.id);current=edge.to;taught.add(edge.id);
   if(s.sourceRefs.some(r=>!sourceIds.has(r)))add('SOURCE_REF',s.id);
   if(s.detail.length&&s.rejoinStateRef!==edge.to)add('LOCAL_CALCULATION_NOT_REJOINED',s.id);
   const allParts=[...s.purpose,...s.reason,...s.afterText,...s.promptParts,...s.detail];
   for(const a of allParts)register(a.id);
   if(!s.interaction){if(!s.noBlankReason||s.slotTargets.length||s.promptParts.some(a=>a.type==='slot'))add('BLANK_DECISION',s.id);}
   else{
    const q=s.interaction;register(q.id);
    if(q.availableFacts.some(f=>!facts.has(f)))add('UNLEARNED_FACT',q.id);
    if([...s.purpose,...s.promptParts,...s.detail].some(a=>a.type==='math'&&a.expression&&equalAnswer(a.expression,q.expected)))add('ANSWER_LEAKAGE',q.id);
    const slots=[...s.slotTargets,...s.promptParts.filter(a=>a.type==='slot')];
    if(!slots.length||slots.some(a=>a.interactionId!==q.id))add('ANSWER_BINDING',q.id);
    for(const target of s.slotTargets){
     register(target.id);
     try{if(!equalAnswer(getPath(stateMap.get(edge.to).statement,target.path),q.expected))add('SLOT_VALUE_MISMATCH',target.id);}catch(e){add('SLOT_TARGET',e.message);}
    }
    if(q.expected.kind==='literal'){
     if(q.choices.some(c=>c.value.kind!=='literal')||q.choices.filter(c=>equalAnswer(c.value,q.expected)).length!==1||new Set(q.choices.map(c=>answerText(c.value))).size!==q.choices.length)add('CHOICE_EQUIVALENCE',q.id);
    }else if(math){
     if(q.choices.some(c=>c.value.kind==='literal'))add('CHOICE_TYPE',q.id);
     else mathJobs.push({id:q.id,payload:{kind:'choices',expected:q.expected,choices:q.choices}});
    }
    for(const c of q.choices){register(c.id);if(!equalAnswer(c.value,q.expected)&&!c.misconception)add('DISTRACTOR_BASIS',c.id);for(const a of c.feedback)register(a.id);for(const a of c.rows??[])register(a.id);}
    for(const hint of q.hints)for(const a of hint)register(a.id);
   }
   for(const f of edge.produces)facts.add(f);
  }
  if(p.graph.transitions.some(e=>!taught.has(e.id)))add('UNTAUGHT_TRANSITION',p.id);
  if(!p.graph.goalStateIds.includes(current))add('GOAL_NOT_REACHED',p.id);
 }
 for(const source of sourceIds){const rows=ir.coverage.filter(c=>c.sourceId===source);if(rows.length!==1||rows[0].disposition==='taught'&&!rows[0].stepIds.length)add('SOURCE_COVERAGE',source);}
 for(const c of ir.coverage)if(!sourceIds.has(c.sourceId)||c.stepIds.some(id=>!stepIds.has(id)))add('COVERAGE_REF',c.sourceId);
 for(const p of ir.problems)for(const s of p.steps)for(const ref of s.sourceRefs)if(!ir.coverage.some(c=>c.sourceId===ref&&c.stepIds.includes(s.id)))add('REVERSE_COVERAGE',s.id);
 if(math&&mathJobs.length){
  const batch=verifyMathPayload({kind:'batch',items:mathJobs});
  if(!batch.results)add('MATH_ADAPTER',batch);
  for(const row of batch.results??[]){mathReceipts.push(row);if(row.status!=='PASS')add(mathJobs.find(j=>j.id===row.id)?.payload.kind==='choices'?'CHOICE_EQUIVALENCE':row.status==='UNSUPPORTED'?'MATH_UNSUPPORTED':'MATH_TRANSITION',row);}
 }
 return {status:findings.length?'FAIL':'PASS',findings,irHash:hash(ir),mathReceipts,mathStatus:math?'RUN':'NOT_RUN',meaningAuditRequired:true};
}
export function compileIRV2(input){
 const check=validateIRV2(input);invariant(check.status==='PASS',JSON.stringify(check.findings));const ir=irV2Schema.parse(input);
 let num=0;const numbers=new Map();
 return {schemaVersion:'solution-reading/1',unitId:ir.unitId,sourceHash:ir.sourceHash,irHash:hash(ir),
  problems:ir.problems.map(p=>({id:p.id,title:p.title,prompt:p.prompt.map(publicPart),conditions:p.conditions.map(publicPart),goal:p.goal,layout:p.layout,
   ...(p.plot?{plot:compilePlot(p)}:{}),
   initial:{id:p.graph.rootStateId,latex:statementLatex(p.graph.states.find(s=>s.id===p.graph.rootStateId).statement)},
   steps:p.steps.map(s=>{
    const e=p.graph.transitions.find(e=>e.id===s.transitionId),state=p.graph.states.find(a=>a.id===e.to),masked=structuredClone(state.statement);
    for(const slot of s.slotTargets)setPath(masked,slot.path,{kind:'slot',label:slot.label});
    if(!numbers.has(s.numberId))numbers.set(s.numberId,++num);
    const q=s.interaction;
    return {id:s.id,beforeId:e.from,afterId:e.to,purpose:s.purpose.map(publicPart),reason:s.reason.map(publicPart),afterText:s.afterText.map(publicPart),
     promptParts:s.promptParts.map(publicPart),detail:s.detail.map(publicPart),
     formula:{id:s.numberId,number:numbers.get(s.numberId),masked:statementLatex(masked),completed:statementLatex(state.statement)},
     binding:q?{interactionId:q.id,slotIds:[...s.slotTargets,...s.promptParts.filter(a=>a.type==='slot')].map(a=>a.id)}:null,
     interaction:q?{id:q.id,action:q.learnerDecision,correctValue:answerText(q.expected),hints:q.hints.map(h=>h.map(publicPart)),
      choices:q.choices.map(c=>({id:c.id,value:answerText(c.value),isMath:c.value.kind!=='literal',rows:c.rows?.map(r=>({id:r.id,latex:r.statement?statementLatex(r.statement):expressionLatex(r.expression)}))??[],feedback:c.feedback.map(publicPart)})),support:q.supportPolicy}:null};
   }),
  })),mathReceipts:check.mathReceipts,meaningAuditRequired:true};
}
function compilePlot(p){
 const state=p.graph.states.find(s=>s.id===p.plot.sourceStateId).statement;
 invariant(state.kind==='expression','PLOT_SOURCE_EXPRESSION');
 const result=verifyMathPayload({kind:'quadratic-plot',variable:p.graph.variable,function:state.expression,domain:p.plot.domain});
 invariant(result.status==='PASS','PLOT_UNSUPPORTED');
 return {id:p.plot.id,visibleAfterStateId:p.plot.visibleAfterStateId,alt:p.plot.alt,...result.plot};
}
export function visibleSnapshotV2(ir,stepId,solvedIds=[],view={}){
 return visibleFromCompiledV2(compileIRV2(ir),stepId,solvedIds,view);
}
export function visibleFromCompiledV2(compiled,stepId,solvedIds=[],{choicesOpen=false,hintCount=0,detailOpen=false}={}){
 const solved=new Set(solvedIds);
 const p=compiled.problems.find(p=>p.steps.some(s=>s.id===stepId));invariant(p,'UNKNOWN_STEP');
 const i=p.steps.findIndex(s=>s.id===stepId);invariant(p.steps.slice(0,i).every(s=>!s.interaction||solved.has(s.id)),'UNSOLVED_PREREQUISITE');
 const step=p.steps[i],q=step.interaction;
 invariant(Number.isInteger(hintCount)&&hintCount>=0&&hintCount<=(q?.hints.length??0),'HINT_STATE');
 // Do not include author rationale, correct values, future rows, feedback, or unopened hints.
 return {problemId:p.id,prompt:p.prompt,conditions:p.conditions,goal:p.goal,initial:p.initial,
  completed:p.steps.slice(0,i).map(s=>({id:s.id,latex:s.formula.completed,purpose:s.purpose,reason:s.reason,afterText:s.afterText})),
  current:{id:stepId,purpose:step.purpose,promptParts:step.promptParts,latex:step.formula.masked,
   choices:choicesOpen?q?.choices.map(({feedback:_feedback,...c})=>c)??[]:[],
   hints:choicesOpen?q?.hints.slice(0,hintCount)??[]:[],detail:detailOpen?step.detail:[]},meaningAuditRequired:true};
}
