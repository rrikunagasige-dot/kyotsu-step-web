import {hash} from '../util.mjs';
export function importResearchAnalysis(request,response){
 const {requestHash,...body}=request;
 if(hash(body)!==requestHash||response.requestHash!==requestHash)return {status:'FAIL',reason:'STALE_RESEARCH_REVIEW'};
 const required=request.required;
 if(required.some(k=>!Array.isArray(response[k]))||!response.reviewer||response.approved)return {status:'FAIL',reason:'RESEARCH_REVIEW_CONTRACT'};
 const ids=new Set(request.blocks.map(b=>b.id));
 const observations=response.observedSteps;
 if(!observations.length||observations.some(o=>!o.description||!o.blockIds?.length||o.blockIds.some(b=>!ids.has(b))))return {status:'FAIL',reason:'OBSERVATION_LOCATION'};
 const patterns=response.applicablePatterns;
 if(patterns.some(p=>!p.id||!p.goal||!p.prerequisites||!p.steps?.length||!p.applicability||!p.exclusions||!p.sourceBlockIds?.length||p.sourceBlockIds.some(id=>!ids.has(id))))return {status:'FAIL',reason:'PATTERN_CONTRACT'};
 return {status:response.uncertainties.length?'NEEDS_AI_REVIEW':'PASS',patterns:patterns.map(p=>({...p,sourceId:request.sourceId,sourceHash:request.sourceHash,origin:'AI_ANALYZED_REFERENCE',reviewer:response.reviewer,requestHash})),observedSteps:observations,inferredMissingSteps:response.inferredMissingSteps,uncertainties:response.uncertainties,automaticPedagogyApproval:false};
}
export function retrievePatterns(patterns,{family,prerequisites=[]}){
 const known=new Set(prerequisites);
 return {status:'PASS',candidates:patterns.filter(p=>p.family===family).map(p=>({pattern:p,missingPrerequisites:p.prerequisites.filter(x=>!known.has(x)),decision:'NEEDS_AI_SELECTION'}))};
}
