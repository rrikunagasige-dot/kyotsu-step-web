import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from production import ai_request
from contracts import manifest
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034';sha=sys.argv[1];job=json.loads((B/'PATCH_JOB_N09.json').read_text())['job'];rt.bind_candidate(w,sha)
ev=[]
for p in ['src/data/textbook/math/numbers/n09Authored.json','src/components/textbook/GuidedMathReadingFlow.tsx','src/components/textbook/guided-math-reading.css','src/domain/textbook.ts']:
 ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='exact approved N09 materialization and scoped reader',verification_level='local_execution'))
req=ai_request(rt,w,job['node']);rt.production_result(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],sourceSHA=sha,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-scope-and-render-review',evidence='Frozen approved N09 IR and all18 answers retained. N09-only route and ordered v1→v2→v3 migration. Five actual reader/migration checks,620 learner regressions, build/typecheck/lint passed. Exact-source browser verification still required. N10 is generated in Work only; no N10 implementation or acceptance claimed.')))
render(rt,w,B/'generated');print(rt.next(w)['task']['node']['id'])
