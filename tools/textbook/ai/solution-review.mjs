import {hash} from '../util.mjs';
export function prepareSolutionReview(visible,{phase,sourceRefs,caseIds=[]}){
 const forbidden=new Set(['correctValue','expected','feedback','graph','mathReceipts','withheldKnowledge']);
 const inspect=v=>v&&typeof v==='object'&&(Object.keys(v).some(k=>forbidden.has(k))||Object.values(v).some(x=>inspect(x)));
 if(!visible?.current||!visible?.initial||!sourceRefs?.length||inspect(visible))return {status:'FAIL',reason:'VISIBLE_ONLY_REVIEW_REQUIRED'};
 const request={schemaVersion:'solution-review/1',phase,visible,sourceRefs,caseIds,
  required:['learnerDecision','availableInformation','reasonToProceed','nextWholeState','misconception','reducedSupportVariant','findings'],
  constraints:['可視状態だけで次へ進めるかを先に検討する','作成者の理由欄を合格根拠にしない','同一AIの別passを独立モデルと呼ばない']};
 return {status:'NEEDS_AI_REVIEW',request:{...request,requestHash:hash(request)}};
}
export function importSolutionReview(request,response){
 const {requestHash,...body}=request;
 if(hash(body)!==requestHash||response.requestHash!==requestHash||response.phase!==request.phase)return {status:'FAIL',reason:'STALE_OR_WRONG_PHASE_REVIEW'};
 if(!response.reviewer||response.approved||request.required.some(k=>k!=='findings'&&!response[k])||!Array.isArray(response.findings))return {status:'FAIL',reason:'MEANING_REVIEW_CONTRACT'};
 if(response.findings.some(f=>!f.problemId||!f.stepId||!f.state||!f.quoteOrMathRef||!f.reason||!f.affectedRefs||!f.resolution))return {status:'FAIL',reason:'FINDING_EVIDENCE'};
 if(response.caseDispositions?.length!==request.caseIds.length||request.caseIds.some(id=>!response.caseDispositions.some(c=>c.caseId===id&&c.evidence&&['APPLIED','NOT_APPLICABLE','UNRESOLVED'].includes(c.status))))return {status:'FAIL',reason:'CASE_CONSUMPTION'};
 return {...response,status:response.findings.some(f=>f.resolution==='UNRESOLVED')||response.caseDispositions.some(c=>c.status==='UNRESOLVED')?'NEEDS_AI_REVIEW':'PASS',automaticAcceptance:false};
}
