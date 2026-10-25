import {z} from 'zod';
import {hash} from '../util.mjs';
const text=z.string().min(1),id=text;
export const researchSchema=z.object({schemaVersion:z.literal('research-manifest/1'),topic:text,
  requirements:z.array(z.object({id,description:text}).strict()).min(1),
  sources:z.array(z.object({id,url:z.url(),version:text,kind:z.enum(['source','reference','research','code']),
    uses:z.array(z.enum(['analyze','quote','reuse','train'])).min(1),rights:text,
    contentHash:z.string().regex(/^[a-f0-9]{64}$/).optional(),locations:z.array(text),requirementIds:z.array(id),
    state:z.enum(['DISCOVERED','EXTRACTED','REVIEWED','UNAVAILABLE']),
    reusePermission:z.boolean().default(false),trainingPermission:z.boolean().default(false),
  }).strict()),
}).strict();
export function inspectResearch(input){
 const parsed=researchSchema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'RESEARCH_SCHEMA',detail:parsed.error.message}]};
 const m=parsed.data,findings=[],seen=new Set(),requirements=new Set(m.requirements.map(r=>r.id));
 for(const s of m.sources){
  if(seen.has(s.id))findings.push({ruleId:'DUPLICATE_SOURCE',id:s.id});seen.add(s.id);
  if(s.requirementIds.some(r=>!requirements.has(r)))findings.push({ruleId:'UNKNOWN_REQUIREMENT',id:s.id});
  if((s.uses.includes('reuse')&&!s.reusePermission)||(s.uses.includes('train')&&!s.trainingPermission))findings.push({ruleId:'SOURCE_USE_NOT_GRANTED',id:s.id});
  if(s.state==='REVIEWED'&&(!s.contentHash||!s.locations.length))findings.push({ruleId:'SOURCE_LOCATION_MISSING',id:s.id});
 }
 const coverage=m.requirements.map(r=>({id:r.id,reviewedSources:m.sources.filter(s=>s.requirementIds.includes(r.id)&&s.state==='REVIEWED').map(s=>s.id)}));
 return {status:findings.length?'FAIL':coverage.some(r=>!r.reviewedSources.length)?'NEEDS_AI_REVIEW':'PASS',findings,coverage,manifestHash:hash(m),duplicates:m.sources.filter((s,i)=>m.sources.slice(0,i).some(a=>a.url===s.url||(s.contentHash&&a.contentHash===s.contentHash))).map(s=>s.id),automaticPedagogyApproval:false};
}
export function prepareResearchAnalysis(manifest,extraction){
 const check=inspectResearch(manifest);if(check.status==='FAIL')return check;
 const source=manifest.sources.find(s=>s.id===extraction.sourceId);
 if(!source||source.contentHash!==extraction.contentHash)return {status:'FAIL',reason:'EXTRACTION_SOURCE_HASH'};
 const request={schemaVersion:'research-analysis-request/1',sourceId:source.id,sourceHash:source.contentHash,topic:manifest.topic,requirements:manifest.requirements,
  blocks:extraction.blocks,required:['observedSteps','inferredMissingSteps','blankRoles','figureTiming','applicablePatterns','uncertainties'],
  constraints:['原本の記述と補った説明を区別する','無番号説明と条件と図も位置に対応させる','原文の転載と学習利用は用途の許可を別々に確認する']};
 return {status:'NEEDS_AI_REVIEW',request:{...request,requestHash:hash(request)}};
}
