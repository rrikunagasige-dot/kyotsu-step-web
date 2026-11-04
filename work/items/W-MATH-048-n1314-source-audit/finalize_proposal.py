"""Final append-only proposal checkpoint; never accepts a user gate."""
from pathlib import Path
P=Path(__file__).resolve().parent/'record_r04.py'
exec(compile(P.read_text().split('epoch=int')[0],str(P),'exec'))
from definitions import instantiate
s=r.state(w);nodes=instantiate(s['plan'])
assert all(r.node_status(s,nodes['R04_PROPOSAL@'+c])=='PASSED'for c in ['n13','n14'])
assert r.next(w)['reason']=='USER_DECISION'and r.next(w)['task']['node']['id']=='R05_APPROVAL@n13'
assert not s['claims'];assert not r.integrity(s)
# Registered file evidence keeps exact historical bytes, including failed drafts.
changed=[]
for ref,e in s['evidence'].items():
 if e['kind']=='file'and e['data'].get('sha256'):
  p=R/e['data']['path']
  if sha(p)!=e['data']['sha256']:changed.append({'evidence':ref,'path':str(p)})
assert not changed,changed
check={'status':'PASS_NATIVE_PROPOSAL_CHECKPOINT','proposal':s['plan']['proposal'],'nativeR04':{c:s['results']['R04_PROPOSAL@'+c]for c in ['n13','n14']},'registeredHistoricalFilesUnchanged':True,'next':'R05_APPROVAL@n13','userDecisionNeeded':'Exact P-W048-003 full IR/projection and four-file patch for N13/N14; not old continue/acceptance reused','implemented':False,'hosted':False,'actualDOM':False,'teamCount':2,'sourceFirstOrigin':'Original primary-source observations retained; N14 current-target author rationale prior exposure explicitly disclosed, not blind.'}
write('evidence/FINAL_NATIVE_CHECK.json',check)
refs=evidence(['evidence/FINAL_NATIVE_CHECK.json','evidence/TEAM_INVENTORY.json','evidence/TASK_WORDING_CORRECTION.json','VERIFICATION.md'])
render(r,w,B/'generated')
assert render(r,w,B/'generated',check=True)
write('evidence/FINAL_FLOW_CHECK.json',{'status':'PASS_SAME_HEAD_THREE_DIAGRAMS','head':r.store.head,'snapshotHash':__import__('store').digest(load('generated/snapshot.json')),'viewsMatchNative':True,'next':r.next(w),'sourceUnchanged':not bool(r.integrity(r.state(w)))})
print('P-W048-003: both R04 PASSED; exact next R05_APPROVAL@n13 WAITING USER',flush=True)
