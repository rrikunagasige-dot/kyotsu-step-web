"""Native technical continuation; external dry-run proof stays distinct from source metadata."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(B),str(R/'workflow')]
from restore_native_snapshots import restore
restore()
from runtime import Runtime
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-TECH-052';mode=sys.argv[1]
def write(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def file_ref(p,source):
 return r.evidence(w,'file',{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref=source,verification_level='local_execution')
if mode=='approve':
 s=r.state(w);h=hashlib.sha256((B/'G3_PUBLISHER_PROPOSAL.md').read_bytes()).hexdigest();assert h==s['plan']['proposal']['hash'];u='w047-g3-scope-approval-89b1ef8f'
 if u not in s['users']:r.user(w,'approve_proposal','ネットが切れた続けて',h,'conversation:89b1ef8f-3abe-4024-a51f-a390ace3cb16',event_id=u)
 if 'T02_APPROVAL'not in r.state(w)['results']:r.accept(w,'T02_APPROVAL',u)
 write(B/'evidence/G3_TECH_APPROVAL.json',{'proposalHash':h,'userEvent':u,'actualUserRecord':r.state(w)['users'][u],'interpretation':'Continuation of concrete4path/main-based branch/no-delivery dry-run question. No main merge, manualfalse or publication permission. Restored after interrupted unsaved local state; original user source retained.'})
 if 'T03_BUILD'not in r.state(w)['results']and 'T03_BUILD'not in r.state(w)['claims']:r.claim(w,'T03_BUILD','M',seconds=14400)
elif mode=='built':
 proof=json.loads((B/'evidence/G3_PUBLISHER_BRANCH.json').read_text());assert proof['mainBase']=='04b823259a0873235e39099864d454330eed5d81'and len(proof['files'])==4 and proof['publicationAuthorized']is False
 refs=[file_ref(B/'evidence/G3_PUBLISHER_BRANCH.json','Actual initial original-four-path publisher branch creation, independently of failed dry-run')]
 for source in r.state(w)['plan']['blocks'][0]['sources']:refs.append(file_ref(R/source,'Original approved draft matched actual initial6808 branch; repair has separate hash/proof'))
 s=r.state(w);r.tool_result(w,'T03_BUILD',s['claims']['T03_BUILD']['token'],refs)
elif mode!='diagram':raise ValueError(mode)
render(r,w,B/'generated-publisher');print('Next:',r.next(w).get('task',{}).get('node',{}).get('id'),flush=True)
