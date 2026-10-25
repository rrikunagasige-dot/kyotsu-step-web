"""Consume actual four-width CI and image audit; never creates user acceptance."""
import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from production import ai_request
from contracts import manifest
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-033'
ci=json.loads((B/'evidence/CI_RESULT.json').read_text());report=json.loads((B/'evidence/UI_REPORT.json').read_text());audit=json.loads((B/'evidence/IMAGE_AUDIT.json').read_text())
s=rt.state(w);sha=s['candidate_sha'];assert ci['sourceSHA']==sha and ci['conclusion']=='success'
assert report['sourceSHA']==sha and report['status']=='PASS' and {r['width'] for r in report['results']}=={320,390,430,1440}
assert all(r['answered']==31 and r['migration'] and r['history'] and r['geometry']=='PASS' for r in report['results'])
assert all(r.get('legacyMigrationRevisions')==[1,2,3] for r in report['results'])
assert all(r.get('retiredChoiceRecovered') for r in report['results'])
assert audit['sourceSHA']==sha and audit['status']=='PASS' and audit['actualImagesReviewed']
ev=[rt.evidence(w,'ci',{'id':ci['runId'],'head_sha':sha,'status':'completed','conclusion':'success','html_url':'https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/'+str(ci['runId'])},source_ref='GitHub connector run and artifact matched to exact source',verification_level='tool_result_transcribed')]
for name in ['evidence/UI_REPORT.json','evidence/CI_RESULT.json','evidence/IMAGE_AUDIT.json','evidence/LOCAL_IMPLEMENTATION_CHECKS.json']:
 p=str((B/name).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual N08 QA output',verification_level='local_execution'))
ir=json.loads((B/'CANDIDATE_IR.json').read_text());argument=json.loads((B/'COMPLETE_SOLUTION.json').read_text())
dispositions=json.loads((B/'CASE_DISPOSITIONS.json').read_text())['cases']
def submit(inputs,extra):
 job=run_code(rt,w,inputs);req=ai_request(rt,w,job['node']);node=req['task']['node']
 outputs={rt.store.get(x)['capability']:rt.store.get(rt.store.get(x)['output']) for x in job['receipts']}
 assert all(o['status'] in ('PASS','NEEDS_AI_REVIEW') for o in outputs.values()),outputs
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=dispositions,unknowns=[],proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-source-and-actual-image-audit',evidence='Frozen36-node design and source compared with actual four-width complete learner play, wrong retries, conditional records, equations, full history, migration and protected source. Actual image audit is attached. Same-assistant audit; not independent second AI or user acceptance.'),**extra)
 (rt.production_result if node['actor']=='TOOL' else rt.submit)(w,job['node'],job['claimToken'],result)
submit({'math.verify':argument,'ir.verify':ir,'browser.verify':{'browserReceipt':{'sourceSHA':sha,'status':'PASS','widths':[320,390,430,1440],'semanticIdsVerified':True,'statesVerified':True,'ciRun':ci['runId']}},'protected.verify':{}},{'sourceSHA':sha})
submit({'source.audit':{'coverage':ir['coverage'],'sourceBlocks':ir['sourceBlocks'],'candidate':ir},'novice.audit':{'ir':ir}},{'symptom_resolution':['全12原問が問いと解法を区別して表示','Q07/Q09の規則選択・全体の括弧・二項への負号を別の穴へ','前結果と記録に条件と式を保持','term/math属性と全等式groupを描画','12旧回答履歴を保存し19新途中回答を未解答に保つ'],'regression_review':['620 learner regression tests and5 N08 migration/reader checks','real four-width all31 correct, every wrong choice, history, reload, actual persisted revision3 migration'],'protected_scope_review':['Accepted N07/first-title original bytes and original N08 image retained; only approved six learner implementation paths plus test fixtures/boundary updates']})
rows=[dict(surface='N08 source/shared consumer/protected artifact',artifact=p,block_id='n08',version=sha,status='PASS',evidence_refs=ev) for p in rt.state(w)['candidate_manifest']]
submit({'protected.verify':{},'impact.inventory':{}},{'audit_rows':rows,'release_readiness':'READY','impact_sweep_completion':'COMPLETE','audit_method':{'method':'source hashes and actual complete four-width browser execution with image inspection','reviewer':'same assistant plus deterministic code','independent':False}})
rt.external_intent(w,'DEPLOY',rt.state(w)['plan']['proposal']['hash'],'W033-N08-existing-pages-publication-v2',release_unit='n08')
render(rt,w,B/'generated');print(json.dumps({'next':rt.next(w),'sourceSHA':sha},ensure_ascii=False)[:1000])
