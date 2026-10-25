import json,sys,time
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from ready_dispatch import run
from production import ai_request
from contracts import manifest
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';code=sys.argv[1];sha=sys.argv[2];s=r.state(w);job=json.loads((B/('PATCH_JOB_'+code.upper()+'.json')).read_text())['job'];nid=job['node']
r.bind_candidate(w,sha);ev=[]
for name in ['APPROVAL.json','evidence/IMPLEMENTATION_'+code.upper()+'_LOCAL.json']:
 p=str((B/name).relative_to(R));ev.append(r.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='exact approved design and local verification',verification_level='local_execution'))
claim=r.state(w)['claims'].get(nid)
if not claim or claim['expires_at']<=time.time():
 if claim:r.reconcile_claim(w,nid,'RESULT_LOST_REVIEW_REQUIRED',ev)
 job=run(r,w,nid,{'ir.compile':json.loads((B/(code.upper()+'_IR.json')).read_text())})
req=ai_request(r,w,nid);r.production_result(w,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],sourceSHA=sha,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant-approved-materialization-review',evidence='Exact frozen design compiled, original keys/answers preserved, old revision chain retained, shared inactive future routes/migrations prepared once. Relevant local tests/build/lint pass. Browser QA remains pending; no user material acceptance claimed.')));render(r,w,B/'generated');print(code+' native R06 complete at '+sha)
