import { planSchema } from './schema.mjs';
import { answerCheck } from './rules/n07.mjs';
export function verifyPlan(input){
 const parsed=planSchema.safeParse(input);
 if(!parsed.success)return {status:'FAIL',findings:parsed.error.issues.map(x=>({code:'SCHEMA',path:x.path.join('.'),message:x.message}))};
 const plan=parsed.data,findings=[],add=(code,node,message)=>findings.push({code,node,message});
 if(plan.audit.status==='reviewed'&&plan.audit.findings.length)add('OPEN_AUDIT_FINDINGS',null,'review still has open findings');
 const ids=new Set(),items=new Set(),results=new Map(),sourceIds=new Set(plan.sourceCatalog.map(s=>s.id));
 if(sourceIds.size!==plan.sourceCatalog.length)add('DUPLICATE_SOURCE',null,'source IDs repeat');
 for(const n of plan.nodes){if(ids.has(n.id))add('DUPLICATE_NODE',n.id,n.id);ids.add(n.id);if(results.has(n.resultId))add('DUPLICATE_RESULT',n.id,n.resultId);results.set(n.resultId,n);}
 if(plan.orderedNodeIds.length!==ids.size||new Set(plan.orderedNodeIds).size!==ids.size||plan.orderedNodeIds.some(id=>!ids.has(id)))add('ORDER_COVERAGE',null,'ordered nodes must cover every node once');
 const nodes=new Map(plan.nodes.map(n=>[n.id,n])),available=new Set(),concepts=new Set(plan.initialConcepts);
 for(const id of plan.orderedNodeIds){const n=nodes.get(id);if(!n)continue;
  for(const c of n.teachesBefore)concepts.add(c);
  for(const c of n.requires)if(!concepts.has(c))add('UNTAUGHT_CONCEPT',id,c);
  for(const ref of n.knownRefs){if(!available.has(ref))add('FUTURE_RESULT',id,ref);const producer=results.get(ref);if(producer&&producer.problemId!==n.problemId&&!n.traceRefs.includes('designed-cross-problem-reuse:'+ref))add('CROSS_PROBLEM_SCOPE',id,ref);}
  for(const ref of n.visibleBeforeResults)if(!available.has(ref))add('PREMATURE_RESULT',id,ref);
  if(n.sourceRefs.some(s=>!sourceIds.has(s)))add('UNKNOWN_SOURCE',id,'source reference missing');
  if(n.interaction){const a=n.interaction;if(items.has(a.id))add('DUPLICATE_ITEM',id,a.id);items.add(a.id);
   for(const c of a.choices.filter(c=>c!==a.answer))if(!a.distractorReasons[c])add('MISSING_DISTRACTOR_REASON',id,c);
   if(new Set(a.choices).size!==a.choices.length)add('DUPLICATE_CHOICE',id,'duplicate choice');
   if(a.choices.filter(c=>c===a.answer).length!==1)add('ANSWER_CHOICES',id,'answer must appear exactly once');
   for(const c of a.choices.filter(c=>c!==a.answer))if(answerCheck(c,a.answer,{reduced:a.taskContract==='reduced'}).correct)add('EQUIVALENT_DISTRACTOR',id,c);
  }
  available.add(n.resultId);for(const c of n.teachesAfter)concepts.add(c);
 }
 const coverage=new Map();for(const c of plan.coverage){if(coverage.has(c.sourceId))add('DUPLICATE_COVERAGE',null,c.sourceId);coverage.set(c.sourceId,c);if(!sourceIds.has(c.sourceId))add('UNKNOWN_SOURCE',null,c.sourceId);if(c.disposition==='taught'&&!c.nodeIds.length)add('EMPTY_SOURCE_MAPPING',null,c.sourceId);for(const id of c.nodeIds)if(!ids.has(id)||!nodes.get(id).sourceRefs.includes(c.sourceId))add('COVERAGE_LINK',id,c.sourceId);}
 for(const s of sourceIds)if(!coverage.has(s))add('SOURCE_OMISSION',null,s);
 for(const n of plan.nodes)for(const s of n.sourceRefs)if(coverage.has(s)&&!coverage.get(s).nodeIds.includes(n.id))add('REVERSE_COVERAGE_LINK',n.id,s);
 for(const s of plan.sourceCatalog)for(const q of s.questionMarkers){const problem='N07-Q'+String(q).padStart(2,'0');if(!plan.nodes.some(n=>n.problemId===problem&&n.sourceRefs.includes(s.id)))add('SOURCE_QUESTION_MISMATCH',null,s.id+' / '+problem);}
 for(let q=1;q<=14;q++)if(!plan.nodes.some(n=>n.problemId==='N07-Q'+String(q).padStart(2,'0')))add('QUESTION_OMISSION',null,'Q'+q);
 return {status:findings.length?'FAIL':'PASS',layer:'structural',pedagogicalReview:plan.audit.status,nodes:plan.nodes.length,items:items.size,sourceBlocks:sourceIds.size,findings,limits:['Natural-language coherence and semantic answer leakage require the separate AI audit.','This report does not verify app integration, UI or publication.']};
}
