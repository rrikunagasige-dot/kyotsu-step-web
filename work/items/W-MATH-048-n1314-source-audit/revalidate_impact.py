"""Revalidate the complete current planned-impact inventory without changing product."""
from pathlib import Path
import json,sys,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from restore_w048_snapshots import restore_w048
restore_w048()
from runtime import Runtime
from runner import run_code
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-048'
assert r.next(w)['task']['node']['id']=='R03_IMPACT@n13'
s=r.state(w);sha=lambda p:hashlib.sha256((R/p).read_bytes()).hexdigest()
actual={p:sha(p)for p in s['candidate_manifest']};assert actual==s['candidate_manifest']
protected={p:sha(p)for p in s['plan']['protected_manifest']};assert protected==s['plan']['protected_manifest']
rules={p:sha(p)for p in s['plan']['rules']};assert rules==s['plan']['rules']
f=B/'evidence/CURRENT_IMPACT_CHECK.json';f.write_text(json.dumps({'status':'PASS_HASH_BOUNDARY_ONLY','currentManifest':actual,'protectedManifest':protected,'rules':rules,'mixedVersion':'N13/domain/Page AFTER; N14 BEFORE','sharedScope':'Exact unit/revision branches only; N14 leaf not applied but shared dependencies affected','limits':'No cross-unit browser or learner acceptance implied'},ensure_ascii=False,indent=2)+'\n')
refs=[r.evidence(w,'file',{'path':str(f.relative_to(R)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()},source_ref='Actual current full source/protected/rules hashes plus M/A/B read-only revision-boundary inspection',verification_level='local_execution')]
job=run_code(r,w,{'impact.inventory':{}});receipt=r.store.get(job['receipts'][0]);out=r.store.get(receipt['output']);assert out['status']=='NEEDS_AI_REVIEW'
rows=[]
for row in out['inventory']:
 p=row['artifact'];changed=p.endswith(('n13Lesson.ts','n14Lesson.ts','src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx'))
 rows.append({**row,'originFinding':'W048 original source-first audit and approved P003 planned impact','rootCauseSignature':'bundled-independent-decisions-and-revision-scoped-display-save-support','version':s['plan']['source_sha'],'actualSHA256':actual.get(p,sha(p)),'approvedCreationWork':'W-MATH-003/W-MATH-048 P003','evidence_refs':refs,'status':'AFFECTED'if changed else'NOT-AFFECTED','phase':'pre-design','disposition':('N14 leaf is still BEFORE, approved correction pending; its shared dependencies already changed.'if p.endswith('n14Lesson.ts')else'Applied exact approved AFTER; revision-scoped regression still required.'if changed else'Bytes unchanged; original helper/source index preserved.')})
req=job['aiRequest'];result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':job['receipts'],'impact_rows':rows,'source_inventory':list(s['plan']['source_manifest']),'unknowns':[],'scope':'Current pre-design impact revalidation, not post-fix sweep. Shared domain/Page affect both units even while N14 leaf remains old. No new confirmed out-of-scope defect; R07/G2 remain necessary.','aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M integrating actual current A original-source and B display/save boundary read-only reviews','evidence':refs}}
(B/'evidence/CURRENT_R03_RESULT.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
r.submit(w,job['node'],job['claimToken'],result)
render(r,w,B/'generated');print(json.dumps({'submitted':job['node'],'next':r.next(w)['task']['node']['id'],'rows':len(rows),'guardsChanged':False}))
