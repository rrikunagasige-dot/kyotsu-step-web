"""Validate real hosted source and close G3_HOST only; N08 acceptance remains open."""
import json,sys,hashlib,urllib.request
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from contracts import manifest
from runner import run_code
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034';s=rt.state(w);sha=s['candidate_sha']
run=json.loads((B/'evidence/PUBLICATION_RUN.json').read_text());intent=json.loads((B/'PUBLICATION_INTENT.json').read_text())
assert run['status']=='completed' and run['conclusion']=='success' and run['head_sha']==intent['workflowSHA']
assert intent['sourceSHA']==sha
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';url=root+'?v='+sha[:8]+'#/learning/textbook/math-numbers-expressions-n09'
receipts=[];bodies=[]
for target in [root+'release.json?verified='+sha,root+'?verified='+sha]:
 with urllib.request.urlopen(target,timeout=25) as response:
  blob=response.read();assert response.status==200 and response.url.startswith(root)
  bodies.append(blob);receipts.append(dict(url=target,resolved_url=response.url,status=response.status,sha256=hashlib.sha256(blob).hexdigest()))
m=json.loads(bodies[0]);assert m['sourceSHA']==sha and m['workflowSHA']==run['head_sha']
assert m['storageKey']=='kyotsu-step-gate3-math-20261023' and m['irHash']==next(b['content_design_hash'] for b in s['plan']['blocks'] if b['id']=='n09')
assert m['acceptedFirstTitle']=='22bc43ba53fa87bb85e82e18a25db13a5c8a485c' and m['acceptedN07']['sourceSHA']=='46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6'
assert m['acceptedN08']['sourceSHA']=='ea47dd97f7d323267281915e8d9a7bb92a8e7c03'
assert len(next(u['items'] for u in m['units'] if u['id']=='math-numbers-expressions-n09'))==36
for name,value in [('HOSTED_MANIFEST.json',m),('HOSTED_HTTP.json',dict(receipts=receipts,sourceSHA=sha,route=url,actualHostedPlay='Publication CI ran all36 correct/all wrong choices/history/migration at four widths; accepted first-title checks passed.',userAcceptance=False))]:
 (B/'evidence'/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
ev=[]
for name in ['evidence/PUBLICATION_RUN.json','evidence/HOSTED_MANIFEST.json','evidence/HOSTED_HTTP.json']:
 p=str((B/name).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='GitHub publication run, hosted Playwright and actual HTTPS',verification_level='local_execution'))
if not rt.state(w)['external'][intent['operation']].get('outcome'):rt.external_outcome(w,intent['operation'],'SUCCESS',ev[0])
app=rt.evidence(w,'app',dict(url=url,source_sha=sha,manifest_sha=m['sourceSHA'],release_unit='n09',reachable=True,auth_wall=False,mobile=True,desktop=True,progress_isolated=True,http_receipts=receipts,publication_run=run['id'],publication_workflow_sha=run['head_sha'],browser_widths=[320,390,430,1440]),source_ref='actual HTTPS and four-width hosted publication CI',verification_level='local_execution')
job=run_code(rt,w,{'release.verify':{'appEvidence':app}});rt.production_result(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=[app,*ev],capability_receipts=job['receipts'],sourceSHA=sha,release=dict(verified=True,sourceSHA=sha,url=url)))
render(rt,w,B/'generated');checkpoint=dict(sourceSHA=sha,workflowCommit=run['head_sha'],publicationRun=run['id'],publicationStatus='SUCCESS',publicSourceVerified=True,userAccepted=False,route=url,next='G3_FINAL@n09: actual scoped user evaluation; then fresh post-fix sweep/R08/L01')
(B/'PUBLICATION_CHECKPOINT.json').write_text(json.dumps(checkpoint,ensure_ascii=False,indent=2)+'\n');print(json.dumps(checkpoint,ensure_ascii=False))
