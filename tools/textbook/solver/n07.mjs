import { division,repeating,finite,answerCheck } from '../rules/n07.mjs';
import { completeN07Solutions } from '../complete-solutions.mjs';
export function solve(problem){
 try{
 const actions={'long-division':()=>division(problem.numerator,problem.denominator),'recurring-to-fraction':()=>repeating(problem.repeat),'finite-decimal':()=>finite(problem.value)};
 if(!actions[problem.kind])return {status:'UNSUPPORTED',domain:'N07 rational arithmetic',reason:'unknown problem kind'};
 const payload=actions[problem.kind]();return {status:payload.status??'PASS',domain:'N07 rational arithmetic',proofStatus:'COMPUTED',payload};
 }catch(error){return {status:'UNSUPPORTED',reason:error.message,proofStatus:'UNVERIFIED'};}
}
export function solutionReceipts(){return Object.entries(completeN07Solutions().questions).map(([problemId,q])=>({problemId,proofStatus:q.proof?'AI_ARGUMENT_REVIEWED':q.trace||q.division||q.allCases?'COMPUTED':'UNVERIFIED',formalProof:false,payload:q}));}
export {answerCheck};
