"""Bind a connector-created exact-source commit and finish the active R06 claim."""
import json,sys,re
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from production import ai_request
from contracts import manifest
from views import render
sha=sys.argv[1];assert re.fullmatch('[0-9a-f]{40}',sha)
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-033';job=json.loads((B/'PATCH_JOB.json').read_text())['job']
rt.bind_candidate(w,sha,release_units=['n08']);ev=[]
for p in ['src/data/textbook/math/numbers/n08Authored.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css']:
 ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='approved N08 materialization and scoped render correction',verification_level='local_execution'))
req=ai_request(rt,w,job['node']);rt.production_result(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],sourceSHA=sha,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-render-and-logic-review',evidence='Frozen approved IR/answers unchanged. Long prose mathematics wraps, solved -0 equation frames replace unanswered ones, and logical arrows connect complete conditions. Six reader/history/migration/logic tests and typecheck/lint pass. Exact-source browser QA remains required.')))
render(rt,w,B/'generated');(B/'IMPLEMENTATION_CHECKPOINT.json').write_text(json.dumps(dict(sourceSHA=sha,next=rt.next(w),previousFailureCI=40160278621,workTests=6,browser='PENDING_EXACT_SOURCE_CI'),ensure_ascii=False,indent=2)+'\n')
print(rt.next(w)['task']['node']['id'])
