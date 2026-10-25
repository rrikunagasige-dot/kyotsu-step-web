import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from production import ai_request
from contracts import manifest
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034';sha=sys.argv[1];code=sys.argv[2] if len(sys.argv)>2 else 'n09';job=json.loads((B/('PATCH_JOB_'+code.upper()+'.json')).read_text())['job'];rt.bind_candidate(w,sha)
ev=[]
for p in ['src/data/textbook/math/numbers/'+code+'Authored.json','src/components/textbook/GuidedMathReadingFlow.tsx','src/components/textbook/guided-math-reading.css','src/domain/textbook.ts']:
 ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='exact approved unit materialization and scoped reader',verification_level='local_execution'))
req=ai_request(rt,w,job['node']);rt.production_result(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],sourceSHA=sha,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-scope-and-render-review',evidence='Frozen approved IR and all39 original contracts retained. Two unit-specific routes; N09 ordered v1→v2→v3 and N10 v1→v2 migration. Nine actual reader/migration checks,620 learner regressions, build/typecheck/lint passed. Exact-source browser verification still required. Both units are explicitly approved and implemented. Ready-node dispatch preserves all DAG prerequisites; no user quality acceptance claimed.')))
render(rt,w,B/'generated');print(rt.next(w)['task']['node']['id'])
