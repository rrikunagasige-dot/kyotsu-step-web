"""Inspect authentic live publication CI ZIP bytes; keep reports/manifests and full file hashes."""
from pathlib import Path,PurePosixPath
import sys,zipfile,hashlib,json,stat
B=Path(__file__).resolve().parent;zpath=Path(sys.argv[1]);dest=Path(sys.argv[2]);out=B/'evidence/g3-live-ci/41760954117';out.mkdir(parents=True,exist_ok=True)
assert not dest.exists(),'Use a new extraction directory';dest.mkdir(parents=True)
sha=lambda b:hashlib.sha256(b).hexdigest();source='f129ba78e496f0ccbce917c762357a81b92b0a2c';publisher='6cd11dc1e65810281ed897f865eed3e52b974992'
archive=zpath.read_bytes();assert len(archive)<500_000_000
index=[];seen=set();reports={}
with zipfile.ZipFile(zpath) as z:
 assert sum(x.file_size for x in z.infolist())<1_000_000_000
 for i in z.infolist():
  if i.is_dir():continue
  p=PurePosixPath(i.filename);assert str(p)==i.filename and not p.is_absolute()and '..'not in p.parts and i.filename not in seen and not stat.S_ISLNK(i.external_attr>>16);seen.add(i.filename)
  data=z.read(i);q=dest.joinpath(*p.parts);q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(data);index.append({'path':i.filename,'bytes':len(data),'sha256':sha(data)})
  if p.suffix=='.json':
   v=json.loads(data);reports[i.filename]=v;target=(out/'raw-json').joinpath(*p.parts);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
def one(suffix):
 found=[(p,v) for p,v in reports.items() if p.endswith(suffix)];assert len(found)==1,(suffix,[p for p,_ in found]);return found[0]
manifests={n:one('/dist/'+n) for n in ['release.json','w046-release.json','w047-release.json']}
for name,(p,m) in manifests.items():assert m['sourceSHA']==source and m.get('publisherSHA',m.get('workflowSHA'))==publisher,(name,m.get('publisherSHA',m.get('workflowSHA')))
m=manifests['w047-release.json'][1];contract=json.loads((B/'G3_PUBLISHER_DRAFT/w047-release-contract.json').read_text());assert m['contractSHA256']==sha((B/'G3_PUBLISHER_DRAFT/w047-release-contract.json').read_bytes());assert {x['code']:x['answers'] for x in m['units']}=={'n11':39,'n12':46}
release=manifests['release.json'][1];old=manifests['w046-release.json'][1];assert m['retainedN08']==release['construction']
assert release['activeN08Revision']==old['retainedN08Revision']==7 and len(release['units'])==16
assert release['construction']['requiredParents']==30 and release['construction']['independentParts']==42
assert len(old['requiredSourceHashes'])==46
for p,h in old['requiredSourceHashes'].items():assert contract['required'][p]==h
for code in ['n09','n10']:
 row=next(x for x in old['units'] if x['code']==code);compiled=json.loads((B.parents[2]/('src/data/textbook/math/numbers/'+code+'ConstructionCompiled.json')).read_text());assert row['compiledHash']==compiled['compiledHash']and row['revision']==compiled['toRevision']
for unit in m['units']:assert unit['authoredSHA256']==contract['required']['src/data/textbook/math/numbers/'+unit['code']+'Authored.json']
for name in ['release.json','w047-release.json']:
 p,_=manifests[name];actual=next(x['sha256'] for x in index if x['path']==p);assert old['files'][name]==actual
assert m['files']=={k:v for k,v in old['files'].items() if k!='w047-release.json'}
_,host=one('/w047-prepublish/HOST_CONTRACT.json');assert host['status']=='PASS'and host['sourceSHA']==source and host['publisherSHA']==publisher and host['actualAssetBytesVerified']==len(m['files'])
for code,answers,wrongs in [('n11',39,109),('n12',46,127)]:
 _,r=one('/w047-prepublish/'+code+'/REPORT.json');assert r['status']=='PASS'and r['sourceSHA']==source and not r['errors'];assert {x['width'] for x in r['results']}=={320,390,430,1440}
 for row in r['results']:assert row['answered']==answers and row['wrongCount']==wrongs and all(row[k] is True for k in ['history','reload','resize','migration'])and row['geometry']=='PASS'
 _,f=one('/w047-prepublish/'+code+'-focus/FOCUSED_CAPTURE.json');assert f['status']=='PASS'and f['sourceSHA']==source
_,retained=one('/w046-prepublish/result.json');assert retained['sourceSHA']==source and len(retained['cases'])==8 and retained['filesVerified']>0
for r in retained['cases']:assert not r['errors']and not r['httpErrors']and not r['networkFailures']
for suffix in ['/w046-prepublish-n08/REPORT.json','/w046-prepublish-r6/REPORT.json','/w046-prepublish-legacy/REPORT.json']:
 _,r=one(suffix);assert r['status']=='PASS'and r['sourceSHA']==source
assert not any(PurePosixPath(p).name in ['ERROR.json','ERROR.png']or '-FAIL.'in p for p in seen)
from urllib.parse import urlsplit,urljoin
_,http=one('/w041-hosted-release/HTTP.json');publicBase=urljoin(http['resolvedURL'],'./');parts=urlsplit(publicBase)
assert parts.scheme=='https'and parts.hostname=='rrikunagasige-dot.github.io'and parts.path=='/kyotsu-step-web/'
assert http['status']==200 and http['sourceSHA']==source and http['publisherSHA']==publisher and http['fullContractMatched']is True
publicPath,publicRelease=one('/w041-hosted-release/release.json');publicHash=next(x['sha256']for x in index if x['path']==publicPath)
assert publicRelease==release and publicHash==http['actualHash']==http['expectedHash']==next(x['sha256']for x in index if x['path']==manifests['release.json'][0])
_,liveContract=one('/w047-hosted/HOST_CONTRACT.json');assert liveContract['status']=='PASS'and liveContract['sourceSHA']==source and liveContract['publisherSHA']==publisher and liveContract['actualAssetBytesVerified']==len(m['files'])
for code,answers,wrongs in [('n11',39,109),('n12',46,127)]:
 _,r=one('/w047-hosted/'+code+'/REPORT.json');assert r['status']=='PASS'and r['sourceSHA']==source and r['root']==publicBase and not r['errors'];assert {x['width']for x in r['results']}=={320,390,430,1440}
 for row in r['results']:assert row['answered']==answers and row['wrongCount']==wrongs and row['geometry']=='PASS'and all(row[k]is True for k in ['history','reload','resize','migration'])
 _,f=one('/w047-hosted/'+code+'-focus/FOCUSED_CAPTURE.json');assert f['status']=='PASS'and f['sourceSHA']==source
_,hostedRetained=one('/w046-hosted/result.json');assert hostedRetained['sourceSHA']==source and hostedRetained['base']==publicBase and len(hostedRetained['cases'])==8 and hostedRetained['filesVerified']==122
for r in hostedRetained['cases']:assert not r['errors']and not r['httpErrors']and not r['networkFailures']
_,r=one('/w041-hosted/REPORT.json');assert r['status']=='PASS'and r['sourceSHA']==source and r['root']==publicBase
for suffix in ['/w041-hosted-r6/REPORT.json','/w041-hosted-legacy/REPORT.json']:
 _,r=one(suffix);assert r['status']=='PASS'and r['sourceSHA']==source
liveLog=(B/'evidence/G3_LIVE_CI_JOB.log').read_text();assert 'APP_URL: '+publicBase in liveLog and 'verify_revision6.mjs'in liveLog and 'verify_legacy.mjs'in liveLog
publicProof={'status':'PASS_ACTUAL_PUBLIC_REPORTS','sourceSHA':source,'publisherSHA':publisher,'runId':41760954117,'publicBase':publicBase,'actualHTTPReceipt':http,'actualPublicReleaseSHA256':publicHash,'requiredHostedReports':['n11','n12','n11-focus','n12-focus','n08r7','n08r6','n08legacy','n09','n10'],'legacyReportURLProvenance':'Original R6/legacy report schemas omit root. Public URL comes from actual live step environment in original job log and fixed verifier APP_URL input; it is not invented as a report field.','studentAcceptance':False}
(out/'PUBLIC_HOST_ASSERTIONS.json').write_text(json.dumps(publicProof,indent=2)+'\n')
result={'status':'PASS_ACTUAL_LIVE_ARTIFACT_BYTES','runId':41760954117,'publisherSHA':publisher,'appSourceSHA':source,'archiveBytes':len(archive),'archiveSHA256':sha(archive),'files':index,'jsonFiles':len(reports),'manifests':{k:{'path':p,'sha256':next(x['sha256'] for x in index if x['path']==p)} for k,(p,v) in manifests.items()},'assetBytesVerified':host['actualAssetBytesVerified'],'localExtractedRoot':str(dest),'publicBase':publicBase,'publication':True,'studentAcceptance':False,'limits':'Actual public deployment reports and original ZIP bytes. Reset/boundaries390 only; four-width answer harness separately. User final acceptance pending.'}
(out/'ARTIFACT_INDEX.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='files'},indent=2))
