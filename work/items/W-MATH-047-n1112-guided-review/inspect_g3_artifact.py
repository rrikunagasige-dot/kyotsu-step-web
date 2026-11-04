"""Inspect authentic final CI ZIP bytes; keep reports/manifests and full file hashes."""
from pathlib import Path,PurePosixPath
import sys,zipfile,hashlib,json,stat
B=Path(__file__).resolve().parent;zpath=Path(sys.argv[1]);dest=Path(sys.argv[2]);out=B/'evidence/g3-final-ci';out.mkdir(exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest();source='f129ba78e496f0ccbce917c762357a81b92b0a2c';publisher='6cd11dc1e65810281ed897f865eed3e52b974992'
archive=zpath.read_bytes();assert len(archive)<500_000_000
index=[];seen=set();reports={}
with zipfile.ZipFile(zpath) as z:
 assert sum(x.file_size for x in z.infolist())<1_000_000_000
 for i in z.infolist():
  if i.is_dir():continue
  p=PurePosixPath(i.filename);assert not p.is_absolute()and '..'not in p.parts and i.filename not in seen and not stat.S_ISLNK(i.external_attr>>16);seen.add(i.filename)
  data=z.read(i);q=dest.joinpath(*p.parts);q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(data);index.append({'path':i.filename,'bytes':len(data),'sha256':sha(data)})
  if p.suffix=='.json':
   v=json.loads(data);reports[i.filename]=v;target=(out/'raw-json').joinpath(*p.parts);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
def one(suffix):
 found=[(p,v) for p,v in reports.items() if p.endswith(suffix)];assert len(found)==1,(suffix,[p for p,_ in found]);return found[0]
manifests={n:one('/dist/'+n) for n in ['release.json','w046-release.json','w047-release.json']}
for name,(p,m) in manifests.items():assert m['sourceSHA']==source and m.get('publisherSHA',m.get('workflowSHA'))==publisher,(name,m.get('publisherSHA',m.get('workflowSHA')))
m=manifests['w047-release.json'][1];assert m['contractSHA256']==sha((B/'G3_PUBLISHER_DRAFT/w047-release-contract.json').read_bytes());assert {x['code']:x['answers'] for x in m['units']}=={'n11':39,'n12':46}
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
result={'status':'PASS_ACTUAL_FINAL_ARTIFACT_BYTES','runId':41754189894,'publisherSHA':publisher,'appSourceSHA':source,'archiveBytes':len(archive),'archiveSHA256':sha(archive),'files':index,'jsonFiles':len(reports),'manifests':{k:{'path':p,'sha256':next(x['sha256'] for x in index if x['path']==p)} for k,(p,v) in manifests.items()},'assetBytesVerified':host['actualAssetBytesVerified'],'localExtractedRoot':str(dest),'publication':False,'limits':'Actual localhost dry-run reports and ZIP bytes; no public deployment or student acceptance. Focus/reset boundaries390 only; four-width answer harness separately.'}
(out/'ARTIFACT_INDEX.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='files'},indent=2))
