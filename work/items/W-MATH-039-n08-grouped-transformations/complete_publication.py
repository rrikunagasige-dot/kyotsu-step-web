from pathlib import Path
import json,sys,urllib.request,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from contracts import sha
from definitions import instantiate
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-039';s=rt.state(W);candidate=s['candidate_sha']
def load(p):return json.loads((B/p).read_text())
def save(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
run=load('evidence/PUBLICATION_RUN.json');report=load('evidence/HOSTED_N08_BROWSER.json');n11=load('evidence/HOSTED_N11_BROWSER.json')
assert run['status']=='completed'and run['conclusion']=='success'and run['deploymentStepConclusion']=='success'
assert run['appSourceSHA']==candidate and report['sourceSHA']==candidate and report['status']=='PASS'
assert {r['width']for r in report['results']}=={320,390,430,1440}and all(r['answers']==34 and r['wrongCount']==80 and r['migration']and r['history']and r['originalLayout']for r in report['results'])
assert n11['sourceSHA']==candidate and n11['status']=='PASS'and {r['width']for r in n11['results']}=={320,390,430,1440}and all(r['answered']==39 and r['wrongCount']==109 for r in n11['results'])
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';receipts=[]
for url in [root+'release.json?verified='+candidate,root+'?verified='+candidate]:
 with urllib.request.urlopen(url,timeout=30)as response:
  body=response.read();assert response.status==200;receipts.append(dict(url=url,resolved_url=response.url,status=response.status,sha256=hashlib.sha256(body).hexdigest()))
  if 'release.json'in url:m=json.loads(body)
p=json.loads((R/'src/data/textbook/math/numbers/n08Transformation.json').read_text());q=json.loads((R/'src/data/textbook/math/numbers/n11Transformation.json').read_text())
assert m['sourceSHA']==candidate and m['workflowSHA']==run['head_sha']and m['work']=='W-MATH-039'and m['storageKey']=='kyotsu-step-gate3-math-20261023'
assert m['transformation']['planHash']==p['planHash']and m['transformation']['baseIRHash']==p['baseIRHash']and m['transformation']['compiledPresentationHash']==p['compiledPresentationHash']
assert m['oldN08']['sha256']==s['plan']['protected_manifest']['src/data/textbook/math/numbers/n08Authored.json']and m['activeN08Revision']==5
assert m['originalN08']['sha256']==s['plan']['protected_manifest']['src/data/textbook/math/numbers/n08Revision5.json']and m['retainedN11']==q['planHash']
assert len(m['units'])==16 and next(u for u in m['units']if u['id']==p['unitId'])['revision']==5
save('evidence/HOSTED_MANIFEST.json',m);save('evidence/HOSTED_HTTP.json',dict(sourceSHA=candidate,receipts=receipts))
ev=[]
for name in ['PUBLICATION_RUN.json','HOSTED_N08_BROWSER.json','HOSTED_N11_BROWSER.json','HOSTED_MANIFEST.json','HOSTED_HTTP.json']:
 path=str((B/'evidence'/name).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=path,sha256=sha(R/path)),source_ref='Actual Pages run, exact source/plan manifest and full public N08/N11 plays',verification_level='tool_result_transcribed'if'BROWSER'in name else 'local_execution'))
op=load('LOCAL_QA_CHECKPOINT.json')['externalIntent']
if not rt.state(W)['external'][op].get('outcome'):rt.external_outcome(W,op,'SUCCESS',ev[0])
url=root+'?v='+candidate[:8]+'#/learning/textbook/'+p['unitId']
app=rt.evidence(W,'app',dict(url=url,source_sha=candidate,manifest_sha=candidate,release_unit='n08',reachable=True,auth_wall=False,mobile=True,desktop=True,progress_isolated=True,http_receipts=receipts,publication_run=run['id'],publication_workflow_sha=run['head_sha'],publication_step_success=True,browser_widths=[320,390,430,1440],planHash=p['planHash'],originalLayoutURL=url+'?layout=original',archivedLayoutURL=url+'?version=4'),source_ref='Verified public source and four-width34correct/80wrong N08 plays; original layout and progress preservation; protected N11',verification_level='local_execution')
nid='G3_HOST@n08'
if rt.node_status(rt.state(W),instantiate(rt.state(W)['plan'])[nid])!='PASSED':
 job=run_code(rt,W,{'release.verify':{'appEvidence':app}});assert job['node']==nid
 rt.production_result(W,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=[app,*ev],capability_receipts=job['receipts'],sourceSHA=candidate,release=dict(verified=True,sourceSHA=candidate,url=url)))
render(rt,W,B/'generated');save('PUBLICATION_CHECKPOINT.json',dict(sourceSHA=candidate,publisherSHA=run['head_sha'],publicationRun=run['id'],publicationConclusion=run['conclusion'],url=url,originalLayoutURL=url+'?layout=original',archivedLayoutURL=url+'?version=4',planHash=p['planHash'],next=rt.next(W),userAccepted=False,qualityLabelsAdded=0,newModelFit=False,modelDisposition='OFFLINE_ONLY'))
print(json.dumps(dict(url=url,next='G3_FINAL@n08; actual user app evaluation, not assumed.'),ensure_ascii=False))
