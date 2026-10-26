import {hash} from '../util.mjs';
export function prepareSolutionReview(visible,{phase,sourceRefs,caseIds=[],profile,reviewScope=[],evidenceManifest=[],teamBinding}){
 const forbidden=new Set(['correctValue','expected','expectedStatement','targetLatex','gradingHash','feedback','graph','graphs','mathReceipts','withheldKnowledge','constructionPlan','constructionInteractions']);
 const inspect=v=>v&&typeof v==='object'&&(Object.keys(v).some(k=>forbidden.has(k))||Object.values(v).some(x=>inspect(x)));
 if(!visible?.current||!visible?.initial||!sourceRefs?.length||inspect(visible))return {status:'FAIL',reason:'VISIBLE_ONLY_REVIEW_REQUIRED'};
 const request={...(profile?{profile}:{}),schemaVersion:'solution-review/1',phase,visible,sourceRefs,caseIds,
  required:['learnerDecision','availableInformation','reasonToProceed','nextWholeState','misconception','reducedSupportVariant','findings'],
  constraints:['可視状態だけで次へ進めるかを先に検討する','作成者の理由欄を合格根拠にしない','同一AIの別passを独立モデルと呼ばない']};
 if(profile==='ordinary-transformation')request.required.push('patternDecision','groupBoundaryReview','blankDecisionReview','prosePlacementReview','terminalRoleReview','visibleProgressionReview');
 if(profile==='construction-layout'){
  const refs=new Set(),rowParts=new Map();
  const partsWithin=(v,found=new Set())=>{if(!v||typeof v!=='object')return found;for(const [key,item]of Object.entries(v)){if(key==='partId'&&typeof item==='string')found.add(item);if(key==='parts'&&Array.isArray(item))for(const part of item)if(part?.id)found.add(part.id);if(item&&typeof item==='object')partsWithin(item,found);}return found;};
  const collect=v=>{if(!v||typeof v!=='object')return;if(typeof v.id==='string'&&(v.formula||v.sourceNodeId||v.parts)){const found=rowParts.get(v.id)??new Set();for(const part of partsWithin(v))found.add(part);rowParts.set(v.id,found);}for(const [k,x]of Object.entries(v)){if(['id','partId','sourceNodeId','rowId'].includes(k)&&typeof x==='string')refs.add(x);if(x&&typeof x==='object')collect(x);}};collect(visible);
  const keys=new Set(),manifest=new Map(evidenceManifest.map(e=>[e.id,e]));
  if(!reviewScope.length||manifest.size!==evidenceManifest.length||evidenceManifest.some(e=>!e.id||!['image','geometry'].includes(e.kind)||!/^[a-f0-9]{64}$/.test(e.sha256)))return {status:'FAIL',reason:'RENDER_EVIDENCE_REQUIRED'};
  for(const s of reviewScope){
   const key=[s.rowId,s.partId??'',s.state].join(':');
   if(keys.has(key)||!refs.has(s.rowId)||!rowParts.has(s.rowId)||s.partId&&!rowParts.get(s.rowId).has(s.partId)||!['initial','partial','complete'].includes(s.state)||manifest.get(s.imageRef)?.kind!=='image'||manifest.get(s.geometryRef)?.kind!=='geometry'||[s.imageRef,s.geometryRef].some(ref=>manifest.get(ref)?.state!==s.state))return {status:'FAIL',reason:'ROW_PART_STATE_EVIDENCE_REQUIRED'};
   keys.add(key);
  }
  request.reviewScope=reviewScope;request.evidenceManifest=evidenceManifest;
  request.required.push('reviewRows');
  if(teamBinding){if(!teamBinding.assignmentHash||!teamBinding.reviewerTaskRef)return {status:'FAIL',reason:'REVIEW_ASSIGNMENT_REQUIRED'};request.teamBinding=teamBinding;}
 }
 return {status:'NEEDS_AI_REVIEW',request:{...request,requestHash:hash(request)}};
}
export function importSolutionReview(request,response){
 const {requestHash,...body}=request;
 if(hash(body)!==requestHash||response.requestHash!==requestHash||response.phase!==request.phase)return {status:'FAIL',reason:'STALE_OR_WRONG_PHASE_REVIEW'};
 if(!response.reviewer||response.approved||request.required.some(k=>k!=='findings'&&!response[k])||!Array.isArray(response.findings))return {status:'FAIL',reason:'MEANING_REVIEW_CONTRACT'};
 if(response.findings.some(f=>!f.problemId||!f.stepId||!f.state||!f.quoteOrMathRef||!f.reason||!f.affectedRefs||!f.resolution))return {status:'FAIL',reason:'FINDING_EVIDENCE'};
 if(response.caseDispositions?.length!==request.caseIds.length||request.caseIds.some(id=>!response.caseDispositions.some(c=>c.caseId===id&&c.evidence&&['APPLIED','NOT_APPLICABLE','UNRESOLVED'].includes(c.status))))return {status:'FAIL',reason:'CASE_CONSUMPTION'};
 if(request.profile==='construction-layout'){
  const key=s=>[s.rowId,s.partId??'',s.state].join(':'),rows=response.reviewRows;
  if(!Array.isArray(rows)||rows.length!==request.reviewScope.length||new Set(rows.map(key)).size!==rows.length)return {status:'FAIL',reason:'ROW_REVIEW_COVERAGE'};
  for(const s of request.reviewScope){
   const r=rows.find(r=>key(r)===key(s));
   if(!r||!['ADOPT','REVISE','UNRESOLVED'].includes(r.decision)||['learnerDecision','availableInformation','copyRisk','nextUse','misconception','prosePlacement','quoteOrMathRef'].some(k=>typeof r[k]!=='string'||!r[k].trim())||!Array.isArray(r.evidenceRefs)||![s.imageRef,s.geometryRef].every(ref=>r.evidenceRefs.includes(ref)))return {status:'FAIL',reason:'ROW_REVIEW_EVIDENCE'};
   if(!JSON.stringify(request.visible).includes(r.quoteOrMathRef))return {status:'FAIL',reason:'ROW_REVIEW_QUOTE_NOT_VISIBLE'};
  }
  if(request.teamBinding&&(response.reviewerTaskRef!==request.teamBinding.reviewerTaskRef||response.assignmentHash!==request.teamBinding.assignmentHash))return {status:'FAIL',reason:'REVIEW_ASSIGNMENT_MISMATCH'};
  if(response.findings.some(f=>!request.reviewScope.some(s=>s.rowId===f.stepId&&s.state===f.state)||!['RESOLVED','VERIFIED_FIXED','DISPROVEN','OUT_OF_SCOPE','OPEN','UNRESOLVED','REVISE'].includes(f.resolution)))return {status:'FAIL',reason:'FINDING_REVIEW_SCOPE'};
  if(response.findings.some(f=>['OPEN','UNRESOLVED','REVISE'].includes(f.resolution)))return {...response,status:'NEEDS_AI_REVIEW',automaticAcceptance:false};
  if(rows.some(r=>r.decision!=='ADOPT'))return {...response,status:'NEEDS_AI_REVIEW',automaticAcceptance:false};
 }
 return {...response,status:response.findings.some(f=>f.resolution==='UNRESOLVED')||response.caseDispositions.some(c=>c.status==='UNRESOLVED')?'NEEDS_AI_REVIEW':'PASS',automaticAcceptance:false};
}
