"""Verify the actual existing Pages response and close host gate; user acceptance stays open."""
import json,hashlib,sys,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];BASE=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from contracts import manifest
from runner import run_code
from views import render
r=Runtime(BASE/'runtime',ROOT);w='W-MATH-032';s=r.state(w);sha=s['candidate_sha']
run=json.loads((BASE/'evidence/PUBLICATION_RUN.json').read_text());assert run['status']=='completed' and run['conclusion']=='success';assert run['head_sha']=='a99031f7d970fe4059ca4425c87f3a6d509f56ad'
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';url=root+'?v='+sha[:8]+'#/learning/textbook/math-numbers-expressions-n07'
receipts=[];bodies=[]
for target in (root+'release.json?verified='+sha,root+'?verified='+sha):
 with urllib.request.urlopen(target,timeout=20) as response:
  body=response.read();assert response.status==200;assert response.url.startswith(root)
  bodies.append(body);receipts.append({'url':target,'resolved_url':response.url,'status':response.status,'sha256':hashlib.sha256(body).hexdigest()})
m=json.loads(bodies[0]);assert m['sourceSHA']==sha;assert m['workflowSHA']==run['head_sha'];assert m['storageKey']=='kyotsu-step-gate3-math-20261023';assert m['repair']['irHash']==s['plan']['proposal']['contentDesignHash'];assert m['acceptedFirstTitle']=='22bc43ba53fa87bb85e82e18a25db13a5c8a485c'
for name,value in [('HOSTED_MANIFEST.json',m),('HOSTED_HTTP.json',{'receipts':receipts,'sourceSHA':sha,'route':url,'actualHostedPlay':'Four-width hosted all-correct/all-wrong, history/migration; publication CI succeeded.','userAcceptance':False})]:
 (BASE/'evidence'/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
ev=[]
for name in ('evidence/PUBLICATION_RUN.json','evidence/HOSTED_MANIFEST.json','evidence/HOSTED_HTTP.json'):
 p=str((BASE/name).relative_to(ROOT));ev.append(r.evidence(w,'file',{'path':p,'sha256':manifest(ROOT,[p])[p]},source_ref='GitHub connector run and actual HTTPS verification',verification_level='local_execution'))
if not r.state(w)['external']['W-MATH-032-existing-pages-publication'].get('outcome'):r.external_outcome(w,'W-MATH-032-existing-pages-publication','SUCCESS',ev[0])
app=r.evidence(w,'app',{'url':url,'source_sha':sha,'manifest_sha':m['sourceSHA'],'release_unit':'n07','reachable':True,'auth_wall':False,'mobile':True,'desktop':True,'progress_isolated':True,'http_receipts':receipts,'publication_run':run['id'],'publication_workflow_sha':run['head_sha'],'browser_widths':[320,390,430,1440]},source_ref='actual HTTPS + hosted Playwright publication run',verification_level='local_execution')
job=run_code(r,w,{'release.verify':{'appEvidence':app}})
r.production_result(w,job['node'],job['claimToken'],{'verdict':'PASS','evidence_refs':[app,*ev],'capability_receipts':job['receipts'],'sourceSHA':sha,'release':{'verified':True,'sourceSHA':sha,'url':url}})
render(r,w,BASE/'generated')
checkpoint={'sourceSHA':sha,'internalCI':40154122715,'internalCIConclusion':'success','workflowCommit':run['head_sha'],'publicationRun':run['id'],'publicationStatus':'SUCCESS','publicSourceVerified':True,'userAccepted':False,'route':url,'next':'G3_FINAL@n07: user scoped natural-language acceptance; then post-fix sweep/R08/L01'}
(BASE/'PUBLICATION_CHECKPOINT.json').write_text(json.dumps(checkpoint,ensure_ascii=False,indent=2)+'\n');print(json.dumps(checkpoint,ensure_ascii=False))
