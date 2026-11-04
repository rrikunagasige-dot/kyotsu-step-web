"""M-only exact R05/R06 execution. No approval generation, no patch replay."""
from pathlib import Path
import sys,json,hashlib,argparse
B=Path(__file__).resolve().parent.parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from capabilities import run_capability
from adapters import apply_patch
from views import render
p=argparse.ArgumentParser();p.add_argument('--store',required=True);p.add_argument('--block',choices=['n13','n14'],required=True);a=p.parse_args()
r=Runtime(a.store,R);w='W-MATH-048';bid=a.block;s=r.state(w)
assert r.integrity(s) is None and not s['claims']
assert s['plan']['proposal']['id']=='P-W048-003-SCROLL-001'
node=r.next(w)['task']['node'];assert node['id']=='R05_APPROVAL@'+bid
u=r.approval(s,node);assert u and u['id']=='W048-SCROLL-001-APPROVAL-20261104'
r.accept(w,node['id'],u['id']);print('ACCEPTED '+node['id'],flush=True)
node=r.next(w)['task']['node'];assert node['id']=='R06_PATCH@'+bid
claim=r.claim(w,node['id'],'M-approved-scroll-and-retained-P003',seconds=14400)
ref=run_capability(r,w,claim['node'],'ir.compile',json.loads((B/(bid.upper()+'_FULL_IR.json')).read_text()))
from integration import compiled_design_matches
compiled_output=r.store.get(r.store.get(ref)['output']);assert compiled_output['status']=='PASS'
assert compiled_design_matches([compiled_output],next(b for b in s['plan']['blocks']if b['id']==bid)['content_design_hash'])
patchpath=B/('scroll-review/PROPOSED_PATCH.json'if bid=='n13'else'r3/N14_PROPOSED_PATCH.json')
patch=json.loads(patchpath.read_text())
refs=apply_patch(r,w,node['id'],claim['claim_token'],patch)
actual={x['path']:hashlib.sha256((R/x['path']).read_bytes()).hexdigest()for x in patch['files']}
assert actual=={x['path']:x['after_sha256']for x in patch['files']}
result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':[ref],'exactAppliedPatch':str(patchpath.relative_to(R)),'currentAfterManifest':actual,'scope':'Exact approved fixed delta, compiled retained content hash. No R07/CI/acceptance claim.'}
r.production_result(w,node['id'],claim['claim_token'],result)
(B/'scroll-review/evidence'/(bid.upper()+'_FORMAL_PATCH.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('APPLIED '+node['id'],flush=True)
render(r,w,B/'generated');print('NEXT '+r.next(w)['task']['node']['id'],flush=True)
