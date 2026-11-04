"""Reproduce missing R05/R06 on an isolated pre-patch checkout, never on current src."""
import hashlib,json,sys
from pathlib import Path

root=Path(sys.argv[1]).resolve()
current=Path(__file__).resolve().parents[3]
assert root!=current, 'Use the isolated pre-patch checkout'
sys.path.insert(0,str(root/'workflow'))
sys.path.insert(0,str(root/'work/items/W-MATH-048-n1314-source-audit'))
from restore_w048_snapshots import restore_w048
restore_w048()
from runtime import Runtime
from adapters import apply_patch
from capabilities import run_capability
from views import render

b=root/'work/items/W-MATH-048-n1314-source-audit'
rt=Runtime(root/'work/items/W-MATH-032-n07-semantic-repair/runtime',root)
w='W-MATH-048'
s=rt.state(w)
assert s['plan']['proposal']['id']=='P-W048-003'
assert rt.integrity(s) is None
assert not s['patches'], 'Do not replay an already recovered patch'
eid=rt.user(w,'approve_proposal','承認',s['plan']['proposal']['hash'],
 'conversation:c646881040:2026-11-04:P-W048-003; prior approval retrieved and continuation expressly requested in current chat',
 event_id='W048-P003-RECOVERED-APPROVAL-20261104',verification_level='conversation_transcribed')
while True:
 nxt=rt.next(w);node=nxt.get('task',{}).get('node',{})
 if node.get('actor')=='USER' and 'APPROVAL' in node.get('id',''):
  rt.accept(w,node['id'],eid)
 elif node.get('actor')=='CODE':rt.execute(w,node['id'])
 else:break
assert node['id']=='R06_PATCH@n13',nxt
claim=rt.claim(w,node['id'],'M-recovery-20261104',seconds=14400)
ir=json.loads((b/'N13_FULL_IR.json').read_text())
receipt=run_capability(rt,w,claim['node'],'ir.compile',ir)
out=rt.store.get(rt.store.get(receipt)['output'])
assert out['status']=='PASS',out
patch=json.loads((b/'r3/N13_PROPOSED_PATCH.json').read_text())
refs=apply_patch(rt,w,node['id'],claim['claim_token'],patch)
matches=[]
for row in patch['files']:
 actual=(root/row['path']).read_bytes();committed=(current/row['path']).read_bytes()
 assert actual==committed
 matches.append({'path':row['path'],'sha256':hashlib.sha256(actual).hexdigest(),'matches_saved_17e39f0a':True})
report={'status':'R05_AND_PATCH_REPRODUCED_NOT_R07_PASS','origin':'Current recovery execution, not fabricated historical events',
 'approvalSource':'conversation_transcribed','compileReceipt':receipt,'patchEvidence':refs,
 'matches':matches,'claim':claim,'next':rt.next(w),'r07':'UNVERIFIED: prior browser evidence unavailable',
 'guardsChanged':False,'n14Applied':False}
(b/'evidence/RECOVERY_EXECUTION.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
render(rt,w,b/'generated')
print(json.dumps({k:report[k] for k in ('status','matches','next','guardsChanged')},ensure_ascii=False))
