"""Native technical Work for the one explicitly approved new workflow path."""
import sys,json,hashlib,subprocess
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from contracts import manifest
from store import digest
from adapters import apply_patch
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-TECH-049'
path='.github/workflows/w047-n1112-verification.yml';p=R/path;before=p.read_text();assert before==''
after=(B/'proposed-ci/w047-n1112-verification.yml').read_text();sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
patch={'files':[{'path':path,'before_sha256':sha(before),'after_sha256':sha(after),'after_text':after}]}
proposal=B/'CI_SCOPE_ADDENDUM.md';h=hashlib.sha256(proposal.read_bytes()).hexdigest();head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()
plan={'work_id':w,'profile':'technical','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':head,'source_manifest':manifest(R,[path]),'rules':r.state('W-MATH-047')['plan']['rules'],'proposal':{'id':'P-W047-06/T2','hash':h,'patch_hash':digest(patch)},'scope':{'paths':[path],'preserve':[]},'blocks':[{'id':'current-source-ci','sources':[path]}],'parent_work':'W-MATH-047'}
r.open(plan);ev=r.evidence(w,'file',{'path':str(proposal.relative_to(R)),'sha256':h},source_ref='T2 exact one-path user approval 68d67aad-6d1b-410d-8255-69b7a4d59d69',verification_level='local_execution')
for n in ['S00_RECOVER','S01_ROUTE']:r.execute(w,n)
t=r.claim(w,'T01_ANALYSIS','M',seconds=3600)['claim_token'];r.submit(w,'T01_ANALYSIS',t,{'verdict':'PASS','evidence_refs':[ev],'rule_mapping':['Keep frozen historical tests; add current-source checks and CI provenance'],'design':['contents:read only; specific work branch push; actual four-width browser artifacts'],'protected_scope':['No learner-content/grading/storage/main/publication changes'],'unknowns':[]})
u=r.user(w,'approve_proposal','いいよ',h,'conversation:68d67aad-6d1b-410d-8255-69b7a4d59d69',event_id='w047-t2-user-approval-68d67aad');r.accept(w,'T02_APPROVAL',u)
t=r.claim(w,'T03_BUILD','M',seconds=3600)['claim_token'];refs=apply_patch(r,w,'T03_BUILD',t,patch);r.tool_result(w,'T03_BUILD',t,refs)
(B/'evidence/T2_INSTALLED.json').write_text(json.dumps({'work':w,'approvalEvent':u,'proposalHash':h,'path':path,'afterHash':sha(after),'patchHash':digest(patch),'evidenceRefs':refs,'newPathBaseline':'Explicit empty-file local commit '+head,'next':'Push full approved workflow; actual CI success required before T04'},ensure_ascii=False,indent=2)+'\n');print('Approved one-path CI installed',flush=True)
