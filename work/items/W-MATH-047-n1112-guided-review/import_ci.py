"""Import actual successful Actions PNGs using the existing native capture adapter."""
import sys,json,zipfile,hashlib,stat
from pathlib import Path,PurePosixPath
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from adapters import import_capture
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R)
archive=Path(sys.argv[1]);meta=json.loads((Path(sys.argv[2])if len(sys.argv)>2 else B/'evidence/T2_CI_RUN.json').read_text());run=meta['run'];artifact=meta['artifact'];sha=run['head_sha'];w='W-MATH-047'
assert run['status']=='completed' and run['conclusion']=='success' and sha==r.state(w)['candidate_sha']
root=B/'evidence/ci'/str(run['id']);raw=root/'raw';raw.mkdir(parents=True,exist_ok=True);files={};pngs={}
with zipfile.ZipFile(archive)as z:
 assert sum(i.file_size for i in z.infolist())<100_000_000
 for info in z.infolist():
  if info.is_dir():continue
  p=PurePosixPath(info.filename);assert not p.is_absolute() and '..'not in p.parts and str(p)==info.filename and stat.S_IFMT(info.external_attr>>16)!=stat.S_IFLNK
  data=z.read(info);target=raw/str(p);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data);files[str(p)]=hashlib.sha256(data).hexdigest()
  if str(p).startswith(('n11/','n11-focus/'))and str(p).endswith('.png'):pngs[str(p)]=data
contracts=json.loads((raw/'static/CURRENT_CONTRACTS.json').read_text());n11=json.loads((raw/'n11/REPORT.json').read_text());n12=json.loads((raw/'n12/REPORT.json').read_text());focus=json.loads((raw/'n11-focus/FOCUSED_CAPTURE.json').read_text())
for d in [contracts,n11,n12,focus]:assert d['status']=='PASS'and d['sourceSHA']==sha
assert next(x for x in contracts['rows']if x['code']=='n11')['mode']=='APPROVED'
assert {x['width']for x in n11['results']}=={320,390,430,1440}
assert all(x['answered']==39 and x['wrongCount']==109 and x['migration']and x['geometry']=='PASS'for x in n11['results'])
pngzip=root/'N11_PNG_CAPTURE.zip'
if not pngzip.exists():
 with zipfile.ZipFile(pngzip,'w',zipfile.ZIP_DEFLATED)as z:
  for path,data in pngs.items():z.writestr(path,data)
else:
 with zipfile.ZipFile(pngzip)as z:
  assert set(z.namelist())==set(pngs) and all(z.read(p)==blob for p,blob in pngs.items())
existing=r.state(w)['evidence'];ci=next((ref for ref,e in existing.items()if e['kind']=='ci'and e['data'].get('id')==run['id']and e['data'].get('head_sha')==sha),None)
ci=ci or r.evidence(w,'ci',{'id':run['id'],'html_url':run['html_url'],'status':'completed','conclusion':'success','head_sha':sha},source_ref='GitHub Actions API: actual dedicated workflow run',verification_level='tool_result_transcribed')
capture=next((ref for ref,e in existing.items()if e['kind']=='capture'and e['data'].get('ci_ref')==ci and e['data'].get('source_sha')==sha),None)
capture=capture or import_capture(r,w,pngzip,ci,str((root/'capture').relative_to(R)))
def screenshot(path):
 target=root/'capture'/path;data={'path':str(target.relative_to(R)),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'capture_ref':capture,'source_sha':sha,'block':'n11'}
 prior=next((ref for ref,e in r.state(w)['evidence'].items()if e['kind']=='screenshot'and e['data']==data),None)
 return prior or r.evidence(w,'screenshot',data,source_ref='Actual CI artifact '+str(artifact['id'])+' / '+path,verification_level='local_execution')
screens=[]
for path in ['n11-focus/n11-q11-constant-focus-initial.png','n11-focus/n11-q11-constant-focus-complete.png','n11-focus/n11-11-focus-initial.png','n11-focus/n11-11-focus-complete.png','n11-focus/n11-local-result-complete-context-viewport.png','n11-focus/n11-whole-state-initial-context-viewport.png',*[f'n11/n11-{n}-stage-7.png'for n in [320,390,430,1440]]]:
 if not (root/'capture'/path).exists():raise AssertionError('Required actual screenshot missing: '+path)
 target=root/'capture'/path;screens.append(screenshot(path))
for path in [f'n11-focus/r1-quotient-{width}-{state}.png'for width in [320,390,430,1440]for state in ['pending','wrong','correct']]+['n11-focus/r1-reset-reload-start.png']:
 target=root/'capture'/path
 if target.exists():screens.append(screenshot(path))
proof={'run':run,'artifact':artifact,'downloadedArchiveSHA256':hashlib.sha256(archive.read_bytes()).hexdigest(),'derivedPNGArchiveSHA256':hashlib.sha256(pngzip.read_bytes()).hexdigest(),'rawFiles':files,'ciRef':ci,'captureRef':capture,'screenshotRefs':screens,'n11Mode':'APPROVED','n12Mode':next(x for x in contracts['rows']if x['code']=='n12')['mode'],'localImagesUsedAsCI':False}
(root/'CAPTURE_PROOF.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');(B/'evidence/N11_CI_CAPTURE_REFS.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print('Actual CI capture registered',run['id'],len(pngs),'PNGs',flush=True)
