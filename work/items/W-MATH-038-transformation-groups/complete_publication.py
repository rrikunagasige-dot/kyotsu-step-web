from pathlib import Path
import json,sys,urllib.request,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from contracts import sha
from definitions import instantiate
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-038';s=rt.state(W);candidate=s['candidate_sha']
def load(p):return json.loads((B/p).read_text())
def save(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
run=load('evidence/PUBLICATION_RUN.json');report=load('evidence/HOSTED_N11_BROWSER.json');verification=load('evidence/HOSTED_VERIFICATION_RUN.json');assert run['status']=='completed'and run['deploymentStepConclusion']=='success'
assert verification['status']=='completed'and verification['conclusion']=='success'and verification['appSourceSHA']==candidate
assert report['sourceSHA']==candidate and report['status']=='PASS'
assert {r['width']for r in report['results']}=={320,390,430,1440}and all(r['answered']==39 and r['wrongCount']==109 and r['migration']and r['history']for r in report['results'])
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';receipts=[]
for url in [root+'release.json?verified='+candidate,root+'?verified='+candidate]:
 with urllib.request.urlopen(url,timeout=30)as response:
  body=response.read();assert response.status==200;receipts.append(dict(url=url,resolved_url=response.url,status=response.status,sha256=hashlib.sha256(body).hexdigest()))
  if 'release.json'in url:m=json.loads(body)
p=json.loads((R/'src/data/textbook/math/numbers/n11Transformation.json').read_text())
assert m['sourceSHA']==candidate and m['workflowSHA']==run['head_sha']and m['work']=='W-MATH-038'and m['storageKey']=='kyotsu-step-gate3-math-20261023'
assert m['transformation']['planHash']==p['planHash']and m['transformation']['baseIRHash']==p['baseIRHash']and m['transformation']['compiledPresentationHash']==p['compiledPresentationHash']
assert m['oldN08']['sha256']==s['plan']['protected_manifest']['src/data/textbook/math/numbers/n08Authored.json']and m['activeN08Revision']==5
assert next(u for u in m['units']if u['id']==p['unitId'])['revision']==11
save('evidence/HOSTED_MANIFEST.json',m);save('evidence/HOSTED_HTTP.json',dict(sourceSHA=candidate,receipts=receipts))
ev=[]
for name in ['PUBLICATION_RUN.json','HOSTED_VERIFICATION_RUN.json','HOSTED_N11_BROWSER.json','HOSTED_MANIFEST.json','HOSTED_HTTP.json','FIGURE_HTTP.json']:
 path=str((B/'evidence'/name).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=path,sha256=sha(R/path)),source_ref='Actual Pages run, exact presentation manifest and full public N11 plays',verification_level='local_execution'))
op=load('LOCAL_QA_CHECKPOINT.json')['externalIntent']
if not rt.state(W)['external'][op].get('outcome'):rt.external_outcome(W,op,'SUCCESS',ev[0])
url=root+'?v='+candidate[:8]+'#/learning/textbook/'+p['unitId']
app=rt.evidence(W,'app',dict(url=url,source_sha=candidate,manifest_sha=candidate,release_unit='n11',reachable=True,auth_wall=False,mobile=True,desktop=True,progress_isolated=True,http_receipts=receipts,publication_run=run['id'],publication_workflow_sha=run['head_sha'],publication_step_success=True,publication_run_conclusion=run['conclusion'],verification_run=verification['id'],verification_workflow_sha=verification['head_sha'],browser_widths=[320,390,430,1440],planHash=p['planHash'],originalLayoutURL=url+'?layout=original'),source_ref='Verified public manifest and four-width39 correct/109 wrong public plays; original layout and progress preservation',verification_level='local_execution')
nid='G3_HOST@n11'
if rt.node_status(rt.state(W),instantiate(rt.state(W)['plan'])[nid])!='PASSED':
 job=run_code(rt,W,{'release.verify':{'appEvidence':app}});assert job['node']==nid
 rt.production_result(W,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=[app,*ev],capability_receipts=job['receipts'],sourceSHA=candidate,release=dict(verified=True,sourceSHA=candidate,url=url)))
render(rt,W,B/'generated');save('PUBLICATION_CHECKPOINT.json',dict(sourceSHA=candidate,publisherSHA=run['head_sha'],publicationRun=run['id'],publicationStepSuccess=True,publicationRunConclusion=run['conclusion'],hostedVerificationRun=verification['id'],hostedVerificationConclusion=verification['conclusion'],url=url,originalLayoutURL=url+'?layout=original',planHash=p['planHash'],next=rt.next(W),userAccepted=False,qualityLabelsAdded=0,newModelFit=False,modelDisposition='OFFLINE_ONLY'))
print(json.dumps(dict(url=url,next='G3_FINAL@n11; current user app evaluation, not assumed. N08 next concrete proposal ready.'),ensure_ascii=False))
