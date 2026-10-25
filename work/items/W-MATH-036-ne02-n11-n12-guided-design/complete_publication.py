import json,sys,urllib.request,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from ready_dispatch import run
from contracts import manifest
from definitions import instantiate
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';codes=sys.argv[1].split(',');s=r.state(w);sha=s['candidate_sha'];suffix=sha[:8];release=json.loads((B/('evidence/PUBLICATION_RUN_'+suffix+'.json')).read_text());assert release['status']=='completed' and release['conclusion']=='success'
root='https://rrikunagasige-dot.github.io/kyotsu-step-web/';receipts=[]
for url in [root+'release.json?verified='+sha,root+'?verified='+sha]:
 with urllib.request.urlopen(url,timeout=30) as resp:
  data=resp.read();assert resp.status==200;receipts.append(dict(url=url,resolved_url=resp.url,status=resp.status,sha256=hashlib.sha256(data).hexdigest()))
  if 'release.json' in url:m=json.loads(data)
assert m['sourceSHA']==sha and m['workflowSHA']==release['head_sha'] and m['storageKey']=='kyotsu-step-gate3-math-20261023'
assert m['acceptedFirstTitle']=='22bc43ba53fa87bb85e82e18a25db13a5c8a485c' and m['acceptedN09N10']['sourceSHA']=='fa0eff271a97940fad08d83960ae50faeabc81b9'
for code in codes:
 ir=json.loads((B/(code.upper()+'_IR.json')).read_text());assert m['unitDesignHashes'][code]==next(b['content_design_hash'] for b in s['plan']['blocks'] if b['id']==code)
 report=json.loads((B/('evidence/HOSTED_'+code.upper()+'_'+suffix+'.json')).read_text());assert report['sourceSHA']==sha and report['status']=='PASS';assert len([x for x in report['results'] if x['code']==code])==4
(B/('evidence/HOSTED_MANIFEST_'+suffix+'.json')).write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');(B/('evidence/HOSTED_HTTP_'+suffix+'.json')).write_text(json.dumps(dict(sourceSHA=sha,receipts=receipts),indent=2)+'\n')
ev=[]
for name in ['PUBLICATION_RUN_'+suffix+'.json','HOSTED_MANIFEST_'+suffix+'.json','HOSTED_HTTP_'+suffix+'.json']:
 p=str((B/'evidence'/name).relative_to(R));ev.append(r.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual existing Pages run and HTTPS verification',verification_level='local_execution'))
for code in codes:
 op='W036-'+code+'-pages-'+sha[:8]
 if not r.state(w)['external'][op].get('outcome'):r.external_outcome(w,op,'SUCCESS',ev[0])
urls={}
for code in codes:
 url=root+'?v='+sha[:8]+'#/learning/textbook/math-numbers-expressions-'+code;urls[code]=url
 app=r.evidence(w,'app',dict(url=url,source_sha=sha,manifest_sha=sha,release_unit=code,reachable=True,auth_wall=False,mobile=True,desktop=True,progress_isolated=True,http_receipts=receipts,publication_run=release['id'],publication_workflow_sha=release['head_sha'],browser_widths=[320,390,430,1440]),source_ref='exact public manifest and complete four-width hosted learner play',verification_level='local_execution')
 nid='G3_HOST@'+code;s=r.state(w)
 if nid in s['results'] and r.node_status(s,instantiate(s['plan'])[nid])=='PASSED':continue
 job=run(r,w,nid,{'release.verify':{'appEvidence':app}});r.production_result(w,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=[app,*ev],capability_receipts=job['receipts'],sourceSHA=sha,release=dict(verified=True,sourceSHA=sha,url=url)))
render(r,w,B/'generated');(B/'PUBLICATION_CHECKPOINT.json').write_text(json.dumps(dict(sourceSHA=sha,publicationRun=release['id'],workflowSHA=release['head_sha'],codes=codes,urls=urls,userAccepted={c:False for c in codes},next='actual scoped user material evaluation; other approved leaves remain work until implemented'),ensure_ascii=False,indent=2)+'\n');print(json.dumps(urls))
