"""Revalidate actual mixed-version R01 after the recorded approved shared patch.

Does not replay a patch, alter guards, or promote old browser reports to PASS.
"""
import hashlib,json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
sys.path[:0]=[str(R/'workflow'),str(B)]
from restore_w048_snapshots import restore_w048
restore_w048()
from runtime import Runtime
from runner import run_code
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-048'
nxt=r.next(w);assert nxt.get('task',{}).get('node',{}).get('id')=='R01_CAPTURE@n13',nxt
paths=['r3/PROPOSED_PATCH_INDEX.json','r3/DESIGN_INPUTS.json','evidence/RECOVERY_EXECUTION.json','evidence/RECOVERY_CURRENT_CONTRACTS.json','evidence/N13_SOURCE_INDEX.json','evidence/N14_SOURCE_INDEX.json']
refs=[r.evidence(w,'file',{'path':str((B/p).relative_to(R)),'sha256':hashlib.sha256((B/p).read_bytes()).hexdigest()},source_ref='Current recovery observation; fixed original source and actual N13-only patch; no browser PASS implied',verification_level='local_execution')for p in paths]
for row in json.loads((B/'r3/PROPOSED_PATCH_INDEX.json').read_text())['files']:
 expected=row['before_sha256']if row['path'].endswith('/n14Lesson.ts')else row['after_sha256']
 assert hashlib.sha256((R/row['path']).read_bytes()).hexdigest()==expected
job=run_code(r,w,{'source.fixed':{},'feedback.capture':{}})
for ref in job['receipts']:
 assert r.store.get(r.store.get(ref)['output'])['status']=='PASS'
req=job['aiRequest']
result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':job['receipts'],
 'complaint':'Continue exactly approved N13/N14 correction while recovering missing execution records; continuation is not a new quality label.',
 'before_evidence':['Original source index and original N13 r4/N14 r10 retained in immutable snapshot','Exact r3 frozen patch index'],
 'reproduction':'Current mixed version is N13 r5/18 answers plus revision-scoped domain/Page after hashes, N14 r10/38 answers before hash. Original 25 questions/79 blocks/3 figures remain authoritative. N13 original symptoms are historical diagnosis, not declared still present; N14 planned correction is not applied. Current browser/non-author R07 remains unverified.',
 'target_versions':{'original':'f129ba78e496f0ccbce917c762357a81b92b0a2c','recordedN13Product':'17e39f0aa4a93318a6de8dc9ece34b5a7416a451','n13Revision':5,'n14Revision':10,'currentHashes':'r3 index: N13/domain/Page AFTER, N14 BEFORE'},
 'aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M current recovery diagnosis; separate A read-only source/hash check retained in chat','evidence':refs}}
(B/'evidence/CURRENT_R01_RESULT.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
r.submit(w,job['node'],job['claimToken'],result)
render(r,w,B/'generated')
print(json.dumps({'submitted':job['node'],'next':r.next(w),'guardsChanged':False},ensure_ascii=False))
