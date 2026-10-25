"""Submit actual post-implementation QA; never creates user acceptance."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];BASE=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from contracts import manifest
from runner import run_code
from production import ai_request
from views import render
rt=Runtime(BASE/'runtime',ROOT);w='W-MATH-032';sha=rt.state(w)['candidate_sha']
ci=rt.evidence(w,'ci',{'id':40154122715,'head_sha':sha,'status':'completed','conclusion':'success','html_url':'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40154122715'},source_ref='GitHub connector verified run40154122715',verification_level='tool_result_transcribed')
ev=[ci]
for name in ('evidence/UI_REPORT.json','evidence/UI_CAPTURE_MANIFEST.json','evidence/LOCAL_CHECKS.json'):
 path=str((BASE/name).relative_to(ROOT));ev.append(rt.evidence(w,'file',{'path':path,'sha256':manifest(ROOT,[path])[path]},source_ref='verified GitHub artifact or local execution',verification_level='local_execution'))
ir=json.loads((BASE/'CANDIDATE_IR.json').read_text())
def execute(inputs,extra):
 job=run_code(rt,w,inputs);request=ai_request(rt,w,job['node']);node=request['task']['node']
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']}
 assert all(o['status'] in ('PASS','NEEDS_AI_REVIEW') for o in outputs.values()),outputs
 r={'verdict':'PASS','evidence_refs':ev,'capability_receipts':job['receipts'],'unknowns':[],'case_dispositions':[{'id':c['caseId'],'disposition':'APPLY','reason':c['reason']} for c in json.loads((BASE/'CASE_DISPOSITIONS.json').read_text())['cases']],
 'aiReview':{'requestHash':request['requestHash'],'inputHash':request['task']['input_hash'],'reviewer':'current-assistant-source-and-real-capture-review','evidence':'Actual four-width full play and all wrong choices passed. Visually inspected320px connected coefficient chain and original source/table,390px prime-factorization/proof; source and original six images compared. Semantic source IDs and KaTeX checked through every node. This is code plus same-assistant review, not an independent second AI or user acceptance.'},**extra}
 (rt.production_result if node['actor']=='TOOL' else rt.submit)(w,job['node'],job['claimToken'],r)
execute({'ir.verify':ir,'browser.verify':{'browserReceipt':{'sourceSHA':sha,'status':'PASS','widths':[320,390,430,1440],'semanticIdsVerified':True,'statesVerified':True,'ciRun':40154122715,'captureManifest':'evidence/UI_CAPTURE_MANIFEST.json'}},'protected.verify':{}},{'sourceSHA':sha})
execute({'source.audit':{'coverage':ir['coverage'],'sourceBlocks':ir['sourceBlocks'],'candidate':ir},'novice.audit':{'ir':ir}}, {'symptom_resolution':['F01 source and two-row table retained; no cycle conclusion before answering','F02 scale factors inserted into sentences with minimum domain','F03 operation target and direction in the sentence','F04 coefficient and reduction in connected groups','F05 nine first definitions strong/ink','F06 typed body, options, hints, results/history; UI semantic projection checks passed'],'regression_review':['All36 correct and all wrong choices at320/390/430/1440','Current-r4 persistence and actual old-r3 migration, unrelated progress retained','620 applicable learner regressions;129 workflow;39 authoring;6 repair Node tests'],'protected_scope_review':['First title bytes and other mode data match protected versions; actual source delta from190941 is only three N07 files']})
s=rt.state(w);unit=rt.next(w)['task']['node']['release_unit'];rows=[{'surface':'N07 source/render/source-index','artifact':p,'block_id':'n07','version':sha,'status':'PASS','evidence_refs':ev} for p in s['plan']['source_manifest']]
execute({'protected.verify':{},'impact.inventory':{}},{'audit_rows':rows,'release_readiness':'READY','impact_sweep_completion':'COMPLETE','audit_method':{'method':'source/scope comparison plus source-derived code assertions and actual screenshots','reviewer':'same assistant and deterministic code','independent':False}})
rt.external_intent(w,'DEPLOY',s['plan']['proposal']['hash'],'W-MATH-032-existing-pages-publication',release_unit=unit)
render(rt,w,BASE/'generated');print(json.dumps(rt.next(w),ensure_ascii=False)[:1000])
