import {hash} from '../util.mjs';
import {validateGraph} from '../solution/graph.mjs';
/** Eligibility is a mechanical filter; adoption remains an explicit teaching decision. */
export function planBlanks({graph,candidates}){
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
