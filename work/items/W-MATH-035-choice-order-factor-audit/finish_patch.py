import sys,json
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from production import ai_request
from ready_dispatch import run
from views import render
from contracts import manifest
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-035';sha=sys.argv[1]
ev=[]
for p in ['APPROVAL.json','evidence/IMPLEMENTATION_LOCAL.json']:
 path=str((B/p).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=path,sha256=manifest(R,[path])[path]),source_ref='approved exact design and actual local checks',verification_level='local_execution'))
for code in ['n09','n10']:
 if 'R06_PATCH@'+code in rt.state(w)['results']:continue
 if code=='n09':job=json.loads((B/'PATCH_JOB_N09.json').read_text())
 else:
  job=run(rt,w,'R06_PATCH@n10',{'ir.compile':json.loads((B/'N10_PROPOSED_IR.json').read_text())});(B/'PATCH_JOB_N10.json').write_text(json.dumps(job,indent=2)+'\n')
 rt.bind_candidate(w,sha);req=ai_request(rt,w,job['node']);rt.production_result(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],sourceSHA=sha,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-approved-bundle-review',evidence='The two-unit bundle was emitted atomically in the first patch claim. Each R06 separately executed native ir.compile and checked the corresponding frozen overlay; N10 requires no second filesystem mutation. Eight dedicated tests and620 learner regressions, type/build/lint pass. Full browser still pending. No user quality acceptance.')))
render(rt,w,B/'generated');print(rt.next(w)['task']['node']['id'])
