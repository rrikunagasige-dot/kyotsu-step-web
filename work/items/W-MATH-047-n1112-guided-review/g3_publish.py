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
elif mode=='apps':
 D=B/'evidence/g3-live-ci/41760954117';ci=load(B/'evidence/G3_LIVE_CI.json');idx=load(D/'ARTIFACT_INDEX.json');public=load(D/'PUBLIC_HOST_ASSERTIONS.json');a=load(B/'evidence/G3_LIVE_ACTUAL_REVIEW_A.json');b=load(B/'evidence/G3_LIVE_ACTUAL_REVIEW_B.json');source=request['sourceSHA'];publisher=request['publisherSHA'];s=r.state(w)
 assert ci['run']['id']==41760954117 and ci['run']['head_sha']==publisher and ci['run']['head_branch']=='main'and ci['run']['event']=='push'and ci['run']['conclusion']=='success'
 assert {j['name']:j['conclusion']for j in ci['jobs']['jobs']}=={'publish':'success','verify':'skipped'}and len(ci['deliveryStepsSucceeded'])==6
 assert idx['status']=='PASS_ACTUAL_LIVE_ARTIFACT_BYTES'and idx['appSourceSHA']==source and idx['publisherSHA']==publisher and idx['archiveSHA256']==ci['artifact']['digest'].removeprefix('sha256:')
 assert public['status']=='PASS_ACTUAL_PUBLIC_REPORTS'and public['sourceSHA']==source and public['publisherSHA']==publisher
 for review in [a,b]:assert review['verdict']=='PASS'and review['sourceSHA']==source and review['publisherSHA']==publisher and review['runId']==41760954117 and review['bothRoutesVerified']is True and review['publicBase']==public['publicBase']
 assert all(op.get('outcome')=='SUCCESS'for op in s['external'].values())and s['candidate_sha']==source and not r.integrity(s)
 refs=[]
 probe=load(B/'evidence/G3_PUBLIC_HTTP_PROBE.json');assert probe['status']=='PASS_ACTUAL_PUBLIC_HTTP'and probe['sourceSHA']==source and probe['publisherSHA']==publisher
 for p in [B/'evidence/G3_LIVE_CI.json',B/'evidence/G3_LIVE_CI_JOB.log',D/'ARTIFACT_INDEX.json',D/'PUBLIC_HOST_ASSERTIONS.json',D/'RAW_JSON_ARCHIVE.json',D/'RAW_JSON.tar.gz',B/'evidence/G3_LIVE_ACTUAL_REVIEW_A.json',B/'evidence/G3_LIVE_ACTUAL_REVIEW_B.json',B/'evidence/G3_LIVE_DEPLOYMENT_OUTCOME.json',B/'evidence/G3_PUBLIC_HTTP_PROBE.json']:
  refs.append(r.evidence(w,'file',{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref='Actual main publication run/public HTTP/original archive/independent reviews; not dry-run evidence',verification_level='local_execution'))
 check=r.evidence(w,'check',{'status':'PASS','source_sha':source,'actualPublisherSHA':publisher,'actualCIHeadSHA':publisher,'actualRunId':41760954117,'checks':['mobile_play','desktop_play','progress_isolation','no_auth_wall','public_manifest_full_hash','published_asset_bytes','both_unit_live_routes'],'publicBase':public['publicBase'],'archiveSHA256':idx['archiveSHA256'],'scope':'Actual hosted all-answer/wrong/fourwidth/migration/history/resize reports and source-bound public HTTP; reset390 only. Not an independent all-mode playthrough.'},source_ref='Actual public-root runner reports/HTTP manifest, independently audited original artifact',verification_level='local_execution');refs.append(check);apprefs={}
 for code in ['n11','n12']:
  unit=next(u for u in s['plan']['release_units']if u['id']==code);url=public['publicBase']+'#'+unit['review_route'].removeprefix('#')
  existing=next((key for key,e in r.state(w)['evidence'].items()if e['kind']=='app'and e['data'].get('release_unit')==code and e['data'].get('actual_ci_run')==41760954117),None)
  data={'release_unit':code,'url':url,'source_sha':source,'manifest_sha':source,'manifest_sha256':public['actualPublicReleaseSHA256'],'publisher_sha':publisher,'reachable':True,'auth_wall':False,'mobile':True,'desktop':True,'progress_isolated':True,'actual_ci_run':41760954117,'artifact_sha256':idx['archiveSHA256'],'check_refs':[check],'file_refs':refs,'actual_http_receipt':public['actualHTTPReceipt'],'operation_proof':{'report':'tmp/w047-hosted/'+code+'/REPORT.json','root':public['publicBase'],'widths':[320,390,430,1440],'history':True,'reload':True,'resize':True,'migration':True,'untouchedUnitSentinelVerified':True,'resetBoundaryWidth':390},'studentAcceptance':False}
  apprefs[code]=existing or r.evidence(w,'app',data,source_ref='Real public '+code+' route/HTTP/operation reports for immutable appsource and actual publisher/run',verification_level='local_execution')
 write(B/'evidence/G3_LIVE_NATIVE_APP_REFS.json',{'sourceSHA':source,'publisherSHA':publisher,'runId':41760954117,'publicBase':public['publicBase'],'fileRefs':refs,'checkRef':check,'appRefs':apprefs,'nativeFormalHostNodesNotYetSubmitted':all('G3_HOST@'+c not in r.state(w)['results']for c in ['n11','n12']),'studentAcceptance':False});print('Both real live-unit app evidence registered; not final user acceptance',flush=True)
elif mode in ['host-n11','host-n12']:
 from runner import run_code
 from views import render
 code=mode.removeprefix('host-');proof=load(B/'evidence/G3_LIVE_NATIVE_APP_REFS.json');assert proof['sourceSHA']==r.state(w)['candidate_sha']==request['sourceSHA'];nid='G3_HOST@'+code
 if nid not in r.state(w)['results']:
  pending=B/('evidence/G3_LIVE_HOST_'+code+'_PENDING.json')
  if nid in r.state(w)['claims']:job=load(pending)
  else:
   assert r.next(w)['task']['node']['id']==nid;job=run_code(r,w,{'release.verify':{'appEvidence':proof['appRefs'][code]}});write(pending,job)
  assert job['node']==nid
  result={'verdict':'PASS','sourceSHA':proof['sourceSHA'],'publisherSHA':proof['publisherSHA'],'evidence_refs':proof['fileRefs']+[proof['checkRef'],*proof['appRefs'].values()],'capability_receipts':job['receipts'],'release':{'verified':True,'sourceSHA':proof['sourceSHA'],'url':r.state(w)['evidence'][proof['appRefs'][code]]['data']['url']},'bothRoutesActuallyVerified':True,'nativeUnit':code,'studentAcceptance':False,'scope':'Actual hosted receipt for this release unit. Other unit real proof prepared; formal host/acceptance records follow native order.'}
  r.production_result(w,nid,job['claimToken'],result);write(B/('evidence/G3_LIVE_HOST_'+code+'_RESULT.json'),result)
 assert r.node_status(r.state(w),instantiate(r.state(w)['plan'])[nid])=='PASSED'
 render(r,w,B/'generated');print('Formal '+nid+' accepted; next '+str(r.next(w).get('task',{}).get('node',{}).get('id')),flush=True)
else:raise ValueError(mode)
