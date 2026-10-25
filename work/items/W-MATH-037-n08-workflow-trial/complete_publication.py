from pathlib import Path
import json,sys,urllib.request,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow')]
from runtime import Runtime
from runner import run_code
from contracts import sha
from definitions import instantiate
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-037';s=rt.state(W);candidate=s['candidate_sha']
def load(p):return json.loads((B/p).read_text())
def save(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
run=load('evidence/implementation/PUBLICATION_RUN.json');report=load('evidence/implementation/HOSTED_BROWSER.json');assert run['status']=='completed'and run['conclusion']=='success';assert report['sourceSHA']==candidate and report['status']=='PASS'
assert {r['width']for r in report['results']}=={320,390,430,1440}and all(r['answers']==34 and r['wrongCount']==80 and r['migration']and r['oldArchive']for r in report['results'])
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';receipts=[]
for url in [root+'release.json?verified='+candidate,root+'?verified='+candidate]:
 with urllib.request.urlopen(url,timeout=30)as response:
  body=response.read();assert response.status==200;receipts.append(dict(url=url,resolved_url=response.url,status=response.status,sha256=hashlib.sha256(body).hexdigest()))
  if 'release.json'in url:m=json.loads(body)
assert m['sourceSHA']==candidate and m['workflowSHA']==run['head_sha']and m['storageKey']=='kyotsu-step-gate3-math-20261023'
assert m['oldN08']['revision']==4 and m['oldN08']['sha256']==s['plan']['protected_manifest']['src/data/textbook/math/numbers/n08Authored.json']
assert next(u for u in m['units']if u['id']=='math-numbers-expressions-n08')['revision']==5
save('evidence/implementation/HOSTED_MANIFEST.json',m);save('evidence/implementation/HOSTED_HTTP.json',dict(sourceSHA=candidate,receipts=receipts))
ev=[]
for name in ['PUBLICATION_RUN.json','HOSTED_BROWSER.json','HOSTED_MANIFEST.json','HOSTED_HTTP.json']:
 path=str((B/'evidence/implementation'/name).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=path,sha256=sha(R/path)),source_ref='Actual Pages deployment, complete public plays and exact-source HTTPS response',verification_level='local_execution'))
op=load('LOCAL_QA_CHECKPOINT.json')['externalIntent']
if not rt.state(W)['external'][op].get('outcome'):rt.external_outcome(W,op,'SUCCESS',ev[0])
url=root+'?v='+candidate[:8]+'#/learning/textbook/math-numbers-expressions-n08';oldurl=url+'?version=4'
app=rt.evidence(W,'app',dict(url=url,source_sha=candidate,manifest_sha=candidate,release_unit='n08',reachable=True,auth_wall=False,mobile=True,desktop=True,progress_isolated=True,http_receipts=receipts,publication_run=run['id'],publication_workflow_sha=run['head_sha'],browser_widths=[320,390,430,1440],oldN08URL=oldurl),source_ref='Exact public manifest and all34 answers/all80 wrong choices at four widths; original-view isolation',verification_level='local_execution')
nid='G3_HOST@n08'
if rt.node_status(rt.state(W),instantiate(rt.state(W)['plan'])[nid])!='PASSED':
 job=run_code(rt,W,{'release.verify':{'appEvidence':app}});assert job['node']==nid
 rt.production_result(W,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=[app,*ev],capability_receipts=job['receipts'],sourceSHA=candidate,release=dict(verified=True,sourceSHA=candidate,url=url)))
render(rt,W,B/'generated');save('PUBLICATION_CHECKPOINT.json',dict(sourceSHA=candidate,publisherSHA=run['head_sha'],publicationRun=run['id'],url=url,oldURL=oldurl,oldRevision4Preserved=True,next=rt.next(W),userAccepted=False,qualityLabelsAdded=0,modelDisposition='OFFLINE_ONLY'))
print(json.dumps(dict(url=url,oldURL=oldurl,next='G3_FINAL@n08: current user hands-on evaluation, not assumed')))
