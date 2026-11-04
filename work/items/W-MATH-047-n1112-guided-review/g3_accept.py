"""Bind one actual pair acceptance to the existing per-unit app gates in CODE order."""
from pathlib import Path
import sys,json,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(B),str(R/'workflow')]
from restore_native_snapshots import restore
restore()
from runtime import Runtime
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';mode=sys.argv[1]
p=json.loads((B/'evidence/G3_PAIR_APP_CONFIRMATION_REQUEST.json').read_text());assert hashlib.sha256((R/p['document']).read_bytes()).hexdigest()==p['documentSHA256']=='361e77db48a2675b6725204936b6f127f15c2e3582225f94ebf3ff24d815935d'
assert r.state(w)['candidate_sha']==p['sourceSHA']=='f129ba78e496f0ccbce917c762357a81b92b0a2c'
def write(path,data):path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
if mode=='record':
 for code in ['n11','n12']:
  event='w047-live-accept-'+code+'-6cb6aef5'
  if event not in r.state(w)['users']:r.user(w,'accept_app','いいよ。そして続けてまた残っているNはあるかい？',p['appRefs'][code],'conversation:6cb6aef5-5796-40d4-a828-3770700d2187',release_unit=code,event_id=event)
 s=r.state(w);write(B/'evidence/G3_PAIR_APP_ACCEPTANCE.json',{'quote':'いいよ。そして続けてまた残っているNはあるかい？','sourceRef':'conversation:6cb6aef5-5796-40d4-a828-3770700d2187','replyContext':p,'interpretation':'Direct positive reply to the published fixed-source pair app confirmation question, followed by remaining-N question. One original utterance transcribed for two unit gates, not two independent evaluations or quality-positive labels.','nativeUserRecords':{c:s['users']['w047-live-accept-'+c+'-6cb6aef5']for c in ['n11','n12']},'quality':'UNKNOWN','formalGateAcceptanceFollowsCodeOrder':True});print('One actual pair acceptance recorded for both unit gates; no quality label',flush=True)
elif mode in ['n11','n12']:
 nid='G3_FINAL@'+mode;s=r.state(w)
 if nid not in s['results']:
  assert r.next(w)['task']['node']['id']==nid;r.accept(w,nid,'w047-live-accept-'+mode+'-6cb6aef5',[p['appRefs'][mode]])
 print('Accepted '+nid+'; next '+str(r.next(w).get('task',{}).get('node',{}).get('id')),flush=True)
else:raise ValueError(mode)
if '--no-render'not in sys.argv:render(r,w,B/'generated')
