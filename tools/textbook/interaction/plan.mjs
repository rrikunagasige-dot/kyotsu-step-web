import {planTransformations} from '../transformation/plan.mjs';
import {hash} from '../util.mjs';
import {validateBundle} from '../solution/bundle.mjs';
import {validateGraph} from '../solution/graph.mjs';
/** Eligibility is a mechanical filter; adoption remains an explicit teaching decision. */
export function planBlanks(input){
 if(input.transformationPlan)return planTransformations(input);
 if(input.bundle)return planBundleBlanks(input);
 const {graph,candidates}=input;
 const checked=validateGraph(graph);if(checked.status!=='PASS')return checked;
 const states=new Map(graph.states.map(s=>[s.id,s]));
 const available=new Map([[graph.rootStateId,new Set([...graph.initialFacts,...graph.givens.map(g=>g.id)])]]);
 const pending=[...graph.transitions];
 while(pending.length){const i=pending.findIndex(t=>available.has(t.from));if(i<0)break;const [t]=pending.splice(i,1);available.set(t.to,new Set([...available.get(t.from),...t.produces]));}
 const rows=candidates.map(c=>{
  const facts=available.get(c.stateId)??new Set();
  const missing=(c.availableFacts??[]).filter(f=>!facts.has(f));
  const state=states.get(c.stateId);
  const reasons=[];
  if(!state)reasons.push('UNKNOWN_STATE');
  if(!c.learnerDecision||!c.nextUse||!c.target)reasons.push('BLANK_ROLE_MISSING');
  if(missing.length)reasons.push('PREREQUISITE_NOT_AVAILABLE');
  return {...c,eligibility:reasons.length?'INELIGIBLE':'ELIGIBLE',reasons,missingFacts:missing,adoption:'NEEDS_AI_SELECTION'};
 });
 return {status:rows.some(r=>r.eligibility==='INELIGIBLE')?'NEEDS_AI_REVIEW':'PASS',candidates:rows,planHash:hash(rows),meaningAuditRequired:true};
}
export function verifyBlankDecisions(plan,decisions){
 const ids=new Set(decisions.map(d=>d.candidateId));const findings=[];
 if(ids.size!==decisions.length||plan.candidates.some(c=>!ids.has(c.id))||decisions.some(d=>!plan.candidates.some(c=>c.id===d.candidateId)))findings.push('CANDIDATE_COVERAGE');
 for(const d of decisions){const c=plan.candidates.find(c=>c.id===d.candidateId);if(!['ADOPT','REJECT','UNRESOLVED'].includes(d.decision)||!d.reason||!d.evidence)findings.push('DECISION_EVIDENCE');if(d.decision==='ADOPT'&&c?.eligibility!=='ELIGIBLE')findings.push('ADOPT_INELIGIBLE');}
 return {status:findings.length?'FAIL':decisions.some(d=>d.decision==='UNRESOLVED')?'NEEDS_AI_REVIEW':'PASS',findings,decisions,aiApproval:false};
}

/** Map a proposed teaching blank to a checked, already ordered mathematical segment.
 * Eligibility does not choose the blank or certify its teaching value. */
export function planBundleBlanks({bundle,candidates}){
 const checked=validateBundle(bundle);if(checked.status!=='PASS')return checked;
 const ids=new Set();const rows=candidates.map(c=>{
  const problem=bundle.problems.find(p=>p.segments.some(s=>s.id===c.segmentId));
  const segment=problem?.segments.find(s=>s.id===c.segmentId);const reasons=[];
  if(ids.has(c.id))reasons.push('DUPLICATE_CANDIDATE');ids.add(c.id);
  if(!segment||!segment.nodeIds.includes(c.nodeId))reasons.push('UNKNOWN_SEGMENT_OR_TARGET_NODE');
  if(!c.learnerDecision||!c.nextUse||!c.target)reasons.push('BLANK_ROLE_MISSING');
  const allowed=new Set([...(problem?.initialFacts??[]),...(segment?.requires??[])]);
  const missing=(c.availableFacts??[]).filter(f=>!allowed.has(f));
  if(missing.length)reasons.push('PREREQUISITE_NOT_AVAILABLE');
  return {...c,eligibility:reasons.length?'INELIGIBLE':'ELIGIBLE',reasons,missingFacts:missing,adoption:'NEEDS_AI_SELECTION'};
 });
 return {status:rows.some(r=>r.eligibility==='INELIGIBLE')?'NEEDS_AI_REVIEW':'PASS',bundleHash:checked.bundleHash,candidates:rows,planHash:hash(rows),meaningAuditRequired:true};
}
