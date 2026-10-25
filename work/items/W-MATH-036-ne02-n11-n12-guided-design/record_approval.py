import json,sys,hashlib,subprocess
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from ready_dispatch import accept_design
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';s=r.state(w);inputs=json.loads((B/'DESIGN_INPUTS.json').read_text());sha='3d0310b8889c03244b8ec9e09f4d2251c5b15ffb'
for p,h in inputs.items():
 assert hashlib.sha256((B/p).read_bytes()).hexdigest()==h
 assert subprocess.check_output(['git','show',sha+':'+str((B/p).relative_to(R))],cwd=R)==(B/p).read_bytes()
event='W036-THREE-UNITS-P001-APPROVED-20261025'
if event not in s['users']:r.user(w,'approve_proposal','いいぞ',s['plan']['proposal']['hash'],'current-conversation: explicit approval immediately after exact P001 and all three node design links',event_id=event)
for code in ['ne02','n11','n12']:
 if 'R05_APPROVAL@'+code not in r.state(w)['results']:accept_design(r,w,'R05_APPROVAL@'+code,event)
a=dict(event=event,quote='いいぞ',approvedCommit=sha,proposalHash=s['plan']['proposal']['hash'],contentDesignHash=s['plan']['proposal']['contentDesignHash'],blockHashes={b['id']:b['content_design_hash'] for b in s['plan']['blocks']},designInputs=inputs,scope=s['plan']['scope']);(B/'APPROVAL.json').write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n');render(r,w,B/'generated');print('exact P001 approved; all three native R05 gates passed')
