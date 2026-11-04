"""Execute approved publication through existing native authorization/outcome records."""
from pathlib import Path
import sys,json,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(B),str(R/'workflow')]
from restore_native_snapshots import restore
restore()
from runtime import Runtime
from definitions import instantiate
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';mode=sys.argv[1]
load=lambda p:json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
request=load(B/'evidence/G3_PUBLICATION_REQUEST_HASH.json');h=hashlib.sha256((B/'G3_PUBLICATION_REQUEST.md').read_bytes()).hexdigest();assert h==request['sha256']=='ac15e68f3b5a9a1d4298a3c2541ad86251223eaca55f7e898e9362dd97c8a870'
merge='w047-g3-main-6cd11-2a472bf1';deploy='w047-g3-pages-6cd11-2a472bf1'
if mode=='authorize':
 pre=load(B/'evidence/G3_PUBLISH_PREFLIGHT.json');assert pre['main']['object']['sha']==request['mainExpected']and pre['publisher']['object']['sha']==request['publisherSHA']and len(pre['compare']['files'])==4
 s=r.state(w);assert s['candidate_sha']==request['sourceSHA']and not r.integrity(s)
 nodes=instantiate(s['plan'])
 for code in ['n11','n12']:assert r.node_status(s,nodes['G2_AUDIT@'+code])=='PASSED'
 scope={'requestId':request['requestId'],'requestSHA256':h,'mainExpected':request['mainExpected'],'publisherSHA':request['publisherSHA'],'sourceSHA':request['sourceSHA'],'paths':[x['path']for x in pre['compare']['files']],'releaseUnits':['n11','n12'],'operations':request['operations']}
 for intent,event in [('authorize_merge','w047-g3-merge-approval-2a472bf1'),('authorize_deploy','w047-g3-deploy-approval-2a472bf1')]:
  if event not in r.state(w)['users']:r.user(w,intent,'いいよ続けて',h,'conversation:2a472bf1-0286-4d8a-91b6-351335030481',scope=scope,event_id=event)
 if merge not in r.state(w)['external']:r.external_intent(w,'MERGE',h,merge)
 if deploy not in r.state(w)['external']:r.external_intent(w,'DEPLOY',h,deploy,release_unit='n11')
 s=r.state(w);write(B/'evidence/G3_PUBLICATION_AUTHORIZATION.json',{'actualUserSource':'conversation:2a472bf1-0286-4d8a-91b6-351335030481','quote':'いいよ続けて','replyTo':h,'interpretation':'Direct assent to concrete4path main fast-forward and existing Pages publication. One original utterance, two operation facets, not student acceptance.','users':{k:v for k,v in s['users'].items()if k.endswith('2a472bf1')},'externalOperations':{k:s['external'][k]for k in [merge,deploy]},'scope':scope,'studentAcceptance':False});print('Actual merge/deploy approval and two pending external intents recorded',flush=True)
elif mode in ['merged','deployed']:
 p=B/('evidence/G3_MAIN_APPLIED.json'if mode=='merged'else'evidence/G3_LIVE_DEPLOYMENT_OUTCOME.json');proof=load(p);assert proof['publisherSHA']==request['publisherSHA']and proof['sourceSHA']==request['sourceSHA'];op=merge if mode=='merged'else deploy
 if not r.state(w)['external'][op].get('outcome'):
  ev=r.evidence(w,'file',{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref='Actual GitHub CAS/verified live workflow outcome for approved publication',verification_level='local_execution');r.external_outcome(w,op,proof['outcome'],ev)
 print('External '+mode+' outcome recorded',flush=True)
else:raise ValueError(mode)
