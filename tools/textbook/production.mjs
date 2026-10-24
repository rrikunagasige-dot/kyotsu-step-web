import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname,resolve } from 'node:path';
import { hash,invariant } from './util.mjs';
import { authorN07 } from './fixtures/n07-author.mjs';
import { verifyPlan } from './verify.mjs';
import { validateIR,compileIR } from './ir/index.mjs';
import { runStage } from './jobs.mjs';
import {implementationFingerprint} from './fingerprint.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
export function python(operation,input,{python=process.env.KYOTSU_ML_PYTHON??'python',out}={}){
 const r=spawnSync(python,[resolve(root,'tools/textbook/production_cli.py'),operation,...(out?['--out',out]:[])],{input:JSON.stringify(input),encoding:'utf8',cwd:root,maxBuffer:32*1024*1024});
 invariant(r.status===0,r.stderr||r.stdout||'production Python adapter failed');return JSON.parse(r.stdout);
}
export function prepareProduction(source,context={}){
 invariant(context.cases?.every(c=>c.id&&c.artifactVersion&&c.dimension&&c.evidenceRef)??true,'unversioned feedback');
 const plan=authorN07(source);const validation=verifyPlan(plan);
 const matches=(context.cases??[]).map(c=>({id:c.id,dimension:c.dimension,quality:c.quality,scope:c.scope,evidenceRef:c.evidenceRef,artifactVersion:c.artifactVersion,inputSnapshot:c.inputSnapshot}));
 const bundle={schemaVersion:'authoring-request/1',sourceHash:plan.sourceHash,plan,validation,
  evidence:{cases:matches,corpusHash:context.corpusHash??null,modelHash:context.modelHash??null,mlReceipt:context.mlReceipt??{status:'ABSTAIN',reason:'NOT_TRAINED'}},
  requiredAudit:matches.filter(c=>c.quality==='NEGATIVE').map(c=>({caseId:c.id,dimension:c.dimension,task:'inspect actual candidate, report applicability and evidence; do not assume repaired'})),
  constraints:['教える順・目的・根拠・前結果を本文で接続する','取得した事例ごとに適用/非適用と根拠を返す','承認・学習済み・修正済みを生成しない']};
 return {...bundle,inputHash:hash(bundle),status:'NEEDS_AI_REVIEW'};
}
export function importProductionResponse(request,response){
 const {inputHash:requestHash,status:_status,...requestBody}=request;invariant(hash(requestBody)===requestHash,'request bundle hash mismatch');
 invariant(response.inputHash===request.inputHash,'stale AI response');
 invariant(response.ir?.sourceHash===request.sourceHash&&response.ir?.unitId===request.plan.unitId,'AI response source or unit mismatch');
 const requiredSources=request.plan.sourceCatalog.map(c=>c.id).sort();invariant(JSON.stringify(response.ir.sourceBlocks.map(c=>c.id).sort())===JSON.stringify(requiredSources),'AI response dropped source blocks');
 invariant(response.state!=='approved','AI cannot approve');
 const decisions=new Map((response.caseDispositions??[]).map(c=>[c.caseId,c]));
 for(const c of request.evidence.cases)invariant(decisions.get(c.id)?.evidence&&['APPLIED','NOT_APPLICABLE','UNRESOLVED'].includes(decisions.get(c.id)?.status),'feedback not actually consumed: '+c.id);
 const check=validateIR(response.ir);invariant(check.status==='PASS',JSON.stringify(check.findings));
 return {ir:response.ir,compiled:compileIR(response.ir,{warningResolutions:response.warningResolutions??[]}),receipt:{inputHash:request.inputHash,corpusHash:request.evidence.corpusHash,modelHash:request.evidence.modelHash,usedCaseIds:[...decisions.keys()],caseDispositions:response.caseDispositions,status:response.caseDispositions.some(c=>c.status==='UNRESOLVED')?'NEEDS_REVIEW':'PASS',aiApproval:false}};
}
export function productionJob({path,source,context,parentRun}){return runStage({path,stage:'production-prepare',input:{source,context},implementationHash:implementationFingerprint(resolve(root,'tools/textbook')),parentRun,evidenceContext:{corpusHash:context.corpusHash,modelHash:context.modelHash,caseIds:context.cases?.map(c=>c.id)??[]},produce:()=>({status:'PASS',request:prepareProduction(source,context)})});}
