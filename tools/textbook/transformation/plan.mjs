import {validateTransformationPlan} from './validate.mjs';
import {transformationCandidates} from './patterns.mjs';
export function planTransformations({ir,transformationPlan}){
 const checked=validateTransformationPlan(ir,transformationPlan);
 return {...checked,candidates:transformationPlan.graphs.flatMap(g=>transformationCandidates(g).candidates),decisions:transformationPlan.candidates.map(({id,decision,reason,learnerDecision,blankRole})=>({id,decision,reason,learnerDecision,blankRole})),automaticAcceptance:false};
}
