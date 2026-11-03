"""Apply/rebind the immutable P006 N12 patch with the existing generic adapter."""
import sys,json,hashlib,os
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'));os.environ['PYTHONPATH']='/tmp/w046-sympy'
from runtime import Runtime
from runner import run_code
from production import ai_request
from adapters import apply_patch
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';load=lambda p:json.loads(Path(p).read_text())
if r.next(w).get('task',{}).get('node',{}).get('id')=='R05_APPROVAL@n12':r.accept(w,'R05_APPROVAL@n12','w047-s1-approval-3052d970')
patch=load(B/'PATCH_N12.json');assert len(patch['files'])==1
job=run_code(r,w,{'ir.compile':load(B/'N12_CANDIDATE_IR.json')});assert job['node']=='R06_PATCH@n12'
q=ai_request(r,w,job['node']);change=patch['files'][0];current=hashlib.sha256((R/change['path']).read_bytes()).hexdigest()
if current==change['before_sha256']:refs=apply_patch(r,w,job['node'],job['claimToken'],patch)
elif current==change['after_sha256']:refs=load(B/'evidence/S1_N12_APPLIED.json')['evidenceRefs']
else:raise AssertionError('Unknown N12 bytes; do not overwrite')
record={'patchHash':digest(patch),'appliedAfterHash':change['after_sha256'],'evidenceRefs':refs,'job':job,'notReapplied':current==change['after_sha256']}
(B/'evidence/S1_N12_APPLIED.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
if r.task(w,job['node'])['input_hash']!=q['task']['input_hash']:
 r.reconcile_claim(w,job['node'],'RESULT_LOST_REVIEW_REQUIRED',refs);print('N12 applied; CODE inputs changed, revalidation required, no reapplication',flush=True)
else:
 r.production_result(w,job['node'],job['claimToken'],{'verdict':'PASS','evidence_refs':refs,'capability_receipts':job['receipts'],'aiReview':{'requestHash':q['requestHash'],'inputHash':q['task']['input_hash'],'reviewer':'M approved P006 integration','evidence':'Existing generic adapter checked exact immutable patch, actual new-scope user approval, stable full ID/order and original bytes. Five-node before/after composition was independently regenerated;44 KEEP/46 grading/save contracts and aligned06/15 preserved. A/B reviewed actual inactive render before activation.'}});print('N12 R06 accepted',flush=True)
print('Next:',r.next(w).get('task',{}).get('node',{}).get('id'),flush=True)
