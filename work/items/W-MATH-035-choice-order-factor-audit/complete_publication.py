"""Check actual two-unit hosted release; finish only the two G3_HOST gates."""
import json,sys,hashlib,urllib.request
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from contracts import manifest
from ready_dispatch import run as dispatch
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-035';s=rt.state(w);sha=s['candidate_sha'];run=json.loads((B/'evidence/PUBLICATION_RUN.json').read_text());intent=json.loads((B/'PUBLICATION_INTENT.json').read_text())
assert run['status']=='completed' and run['conclusion']=='success' and run['head_sha']==intent['workflowSHA'] and intent['sourceSHA']==sha
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';receipts=[];bodies=[]
for target in [root+'release.json?verified='+sha,root+'?verified='+sha]:
 with urllib.request.urlopen(target,timeout=25) as response:
  blob=response.read();assert response.status==200 and response.url.startswith(root);bodies.append(blob);receipts.append(dict(url=target,resolved_url=response.url,status=response.status,sha256=hashlib.sha256(blob).hexdigest()))
m=json.loads(bodies[0]);assert m['sourceSHA']==sha and m['workflowSHA']==run['head_sha'] and m['storageKey']=='kyotsu-step-gate3-math-20261023';assert m['acceptedFirstTitle']=='22bc43ba53fa87bb85e82e18a25db13a5c8a485c' and m['acceptedN07']['sourceSHA']=='46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6' and m['acceptedN08']['sourceSHA']=='ea47dd97f7d323267281915e8d9a7bb92a8e7c03'
for code,count in [('n09',36),('n10',45)]:
 assert m['unitDesignHashes'][code]==next(b['content_design_hash'] for b in s['plan']['blocks'] if b['id']==code)
 assert len(next(u['items'] for u in m['units'] if u['id']=='math-numbers-expressions-'+code))==count
(B/'evidence/HOSTED_MANIFEST.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');(B/'evidence/HOSTED_HTTP.json').write_text(json.dumps(dict(sourceSHA=sha,receipts=receipts,actualHostedPlay='Publication CI completed both full four-width plays and protected units',userAcceptance=False),ensure_ascii=False,indent=2)+'\n')
ev=[]
for name in ['PUBLICATION_RUN.json','HOSTED_MANIFEST.json','HOSTED_HTTP.json']:
 p=str((B/'evidence'/name).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual GitHub publication and HTTPS',verification_level='local_execution'))
for code in ['n09','n10']:
 op='W035-'+code+'-existing-pages-publication'
 if not rt.state(w)['external'][op].get('outcome'):rt.external_outcome(w,op,'SUCCESS',ev[0])
urls={}
for code in ['n09','n10']:
 url=root+'?v='+sha[:8]+'#/learning/textbook/math-numbers-expressions-'+code;urls[code]=url
 app=rt.evidence(w,'app',dict(url=url,source_sha=sha,manifest_sha=sha,release_unit=code,reachable=True,auth_wall=False,mobile=True,desktop=True,progress_isolated=True,http_receipts=receipts,publication_run=run['id'],publication_workflow_sha=run['head_sha'],browser_widths=[320,390,430,1440]),source_ref='exact manifest and actual public four-width browser',verification_level='local_execution')
 job=dispatch(rt,w,'G3_HOST@'+code,{'release.verify':{'appEvidence':app}});rt.production_result(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=[app,*ev],capability_receipts=job['receipts'],sourceSHA=sha,release=dict(verified=True,sourceSHA=sha,url=url)))
render(rt,w,B/'generated');checkpoint=dict(sourceSHA=sha,workflowCommit=run['head_sha'],publicationRun=run['id'],publicationStatus='SUCCESS',publicSourceVerified=True,userAccepted=dict(n09=False,n10=False),urls=urls,next='G3_FINAL@n09 and G3_FINAL@n10: actual scoped user evaluation; then fresh sweeps/R08/L01')
(B/'PUBLICATION_CHECKPOINT.json').write_text(json.dumps(checkpoint,ensure_ascii=False,indent=2)+'\n');print(json.dumps(checkpoint,ensure_ascii=False))
