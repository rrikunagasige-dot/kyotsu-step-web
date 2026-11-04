"""Verify the actual GitHub Pages build archive against authentic live manifests."""
from pathlib import Path,PurePosixPath
import json,zipfile,tarfile,io,hashlib,shutil,sys
B=Path(__file__).resolve().parent;D=B/'evidence/g3-live-ci/41760954117';ci=json.loads((B/'evidence/G3_LIVE_CI.json').read_text());meta=ci['pagesBuildArtifact'];p=Path(sys.argv[1]);raw=p.read_bytes();sha=lambda b:hashlib.sha256(b).hexdigest()
assert len(raw)==meta['size_in_bytes']and sha(raw)==meta['digest'].removeprefix('sha256:')
idx=json.loads((D/'ARTIFACT_INDEX.json').read_text());prefix=D/'raw-json/home/runner/work/kyotsu-step-web/kyotsu-step-web/dist'
man={n:(prefix/n).read_bytes()for n in ['release.json','w046-release.json','w047-release.json']};m=json.loads(man['w047-release.json']);expected={**m['files'],'w046-release.json':sha(man['w046-release.json']),'w047-release.json':sha(man['w047-release.json'])};assert len(expected)==123
with zipfile.ZipFile(p)as z:
 entries=[x for x in z.infolist()if not x.is_dir()];assert len(entries)==1 and entries[0].filename=='artifact.tar'and entries[0].file_size<100_000_000;body=z.read(entries[0])
seen={}
with tarfile.open(fileobj=io.BytesIO(body),mode='r:')as t:
 members=t.getmembers();assert len(members)<1000 and sum(x.size for x in members)<100_000_000
 for member in members:
  if member.isdir():continue
  name=member.name.removeprefix('./');q=PurePosixPath(name);assert member.isfile()and str(q)==name and not q.is_absolute()and '..'not in q.parts and name not in seen and name in expected
  data=t.extractfile(member).read(member.size+1);assert len(data)==member.size and sha(data)==expected[name];seen[name]={'sha256':sha(data),'bytes':len(data)}
assert set(seen)==set(expected)
for name,data in man.items():assert seen[name]['sha256']==sha(data)
shutil.copyfile(p,D/'PAGES_BUILD.zip')
proof={'status':'PASS_ACTUAL_PAGES_BUILD_BYTES','runId':41760954117,'artifactId':meta['id'],'artifactBytes':len(raw),'artifactSHA256':sha(raw),'tarSHA256':sha(body),'sourceSHA':m['sourceSHA'],'publisherSHA':m['publisherSHA'],'files':seen,'fileCount':len(seen),'publicHTTPProbe':'evidence/G3_PUBLIC_HTTP_PROBE.json','liveReportArchiveSHA256':idx['archiveSHA256'],'scope':'All123actualdistributionfilebytes independently compared with original generated live manifest map, including3manifestbodies. PublicHTTPallassetchecks are separately recorded in actual live runner reports.','studentAcceptance':False};(D/'PAGES_BUILD_INDEX.json').write_text(json.dumps(proof,indent=2)+'\n');print(json.dumps({k:v for k,v in proof.items()if k!='files'},indent=2))
