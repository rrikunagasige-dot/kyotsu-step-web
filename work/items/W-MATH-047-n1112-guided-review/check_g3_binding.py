"""Reproducible identity checks; static output never claims actual CI success."""
from pathlib import Path
import hashlib,json,subprocess,yaml
B=Path(__file__).resolve().parent;R=B.parents[2]
read=lambda p:json.loads(p.read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
plan=read(B/'G3_TECH_PLAN.json');contract=read(B/'G3_PUBLISHER_DRAFT/w047-release-contract.json');proof=read(B/'evidence/G3_FINAL_APPLIED.json')
assert proof['publisherSHA']=='6cd11dc1e65810281ed897f865eed3e52b974992'
assert proof['sourceSHA']==contract['sourceSHA']=='f129ba78e496f0ccbce917c762357a81b92b0a2c'
for p,h in plan['source_manifest'].items():assert sha((R/p).read_bytes())==h,p
assert len(contract['required'])==69
for p,h in contract['required'].items():
 assert sha((R/p).read_bytes())==h,p
 assert sha(subprocess.check_output(['git','show',proof['sourceSHA']+':'+p],cwd=R))==h,p
mapped={'.github/workflows/deploy-pages.yml':B/'G3_PUBLISHER_FINAL/deploy-pages.yml',**{'tools/release/'+n:B/'G3_PUBLISHER_DRAFT'/n for n in ['w046-publish-check.mjs','w047-publish-check.mjs','w047-release-contract.json']}}
assert set(mapped)==set(plan['scope']['externalPublisherPaths'])=={x['path'] for x in proof['files']}
for row in proof['files']:
 body=mapped[row['path']].read_bytes();blob=hashlib.sha1(b'blob '+str(len(body)).encode()+b'\0'+body).hexdigest();assert blob==row['sha'],row['path']
old=yaml.safe_load((B/'G3_PUBLISHER_DRAFT/deploy-pages.yml').read_text());mid=yaml.safe_load((B/'G3_PUBLISHER_REPAIR/deploy-pages.yml').read_text());final=yaml.safe_load(mapped['.github/workflows/deploy-pages.yml'].read_text())
assert {k:v for k,v in old.items() if k!='jobs'}=={k:v for k,v in final.items() if k!='jobs'}
for name in ['verify','publish']:
 a=dict(final['jobs'][name]);assert a['steps'][-1]['with']['path'].startswith('dist/release.json\ndist/w046-release.json\ndist/w047-release.json\n')
 a['steps'][-1]['with']['path']=a['steps'][-1]['with']['path'].removeprefix('dist/release.json\ndist/w046-release.json\ndist/w047-release.json\n');assert a==mid['jobs'][name]
 p=dict(mid['jobs']['publish']);p.pop('if');assert p==old['jobs']['publish']
v=dict(mid['jobs']['verify']);v.pop('if');assert v.pop('permissions')=={'contents':'read'};p=dict(old['jobs']['publish']);p.pop('environment');assert v==p
out={'status':'PASS_LOCAL_IDENTITY_ONLY','source_sha':plan['source_sha'],'actualPublisherSHA':proof['publisherSHA'],'actualAppSourceSHA':proof['sourceSHA'],'actualRunId':proof['runId'],'originalMetadataManifestPaths':len(plan['source_manifest']),'requiredAppSourcePaths':69,'actualPublisherFiles':4,'exactGitBlobMatch':True,'originalDraftPreserved':True,'finalWorkflowSHA256':sha(mapped['.github/workflows/deploy-pages.yml'].read_bytes()),'actualCI':'PENDING_SEPARATE_EVIDENCE','publicHost':'UNVERIFIED','publicationAuthorized':False}
(B/'evidence/G3_FINAL_IDENTITY_CHECK.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
