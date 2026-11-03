"""UNEXECUTED draft: actual N12 CI import through unchanged native import_capture.
B capture-tool assistance only; no lesson authorship. No image review performed.
Run only by Store owner after reviewing metadata. Transient zip never retained/committed.
"""
import argparse, hashlib, io, json, stat, sys, tempfile, zipfile
from pathlib import Path, PurePosixPath

LIMIT_ZIP=30_000_000
LIMIT_RAW=60_000_000
TARGETS={'n12-01','n12-q04-left-end','n12-04','n12-07','n12-q13-operation'}
WIDTHS={320,390,430,1440}
def digest(blob): return hashlib.sha256(blob).hexdigest()
def need(condition, message):
    if not condition: raise AssertionError(message)
def load(p): return json.loads(p.read_text())

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--repo',type=Path,required=True)
    ap.add_argument('--archive',type=Path,required=True)
    ap.add_argument('--meta',type=Path,required=True)
    ap.add_argument('--candidate-sha',required=True)
    ap.add_argument('--archive-sha256',required=True,help='Independently recorded actual GitHub artifact digest')
    a=ap.parse_args(); repo=a.repo.resolve(); base=repo/'work/items/W-MATH-047-n1112-guided-review'
    sys.path.insert(0,str(repo/'workflow'))
    from runtime import Runtime
    from adapters import import_capture
    rt=Runtime(repo/'work/items/W-MATH-032-n07-semantic-repair/runtime',repo); work='W-MATH-047'
    meta=load(a.meta); run=meta['run']; artifact=meta['artifact']; sha=a.candidate_sha
    need(run['status']=='completed' and run['conclusion']=='success','Actual successful run required')
    need(run['head_sha']==sha==rt.state(work)['candidate_sha'],'CI/candidate/state SHA mismatch')
    need(artifact.get('expired') is False,'Expired/unknown artifact')
    need(artifact['name']=='w047-n1112-evidence-'+sha,'Artifact source/name mismatch')
    arun=artifact['workflow_run']; need(arun['id']==run['id'] and arun['head_sha']==sha,'Artifact run mismatch')
    need(run['html_url'].endswith('/actions/runs/'+str(run['id'])),'Unexpected run URL')
    blob=a.archive.read_bytes(); need(len(blob)<=LIMIT_ZIP,'Archive compressed limit')
    original_digest=digest(blob)
    need(original_digest==a.archive_sha256.removeprefix('sha256:')==artifact['digest'].removeprefix('sha256:'),'Actual archive digest mismatch')
    root=base/'evidence/ci'/str(run['id']); raw=root/'raw'; files={}; contents={}
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        need(sum(i.file_size for i in z.infolist())<=LIMIT_RAW,'Archive expanded limit')
        for info in z.infolist():
            p=PurePosixPath(info.filename)
            need(not p.is_absolute() and '..' not in p.parts and '\\' not in info.filename and str(p)==info.filename.rstrip('/'),'Unsafe archive path')
            need(stat.S_IFMT(info.external_attr>>16)!=stat.S_IFLNK,'Archive symlink')
            if info.is_dir(): continue
            key=str(p); need(key not in contents,'Duplicate archive member')
            contents[key]=z.read(info); files[key]=digest(contents[key])
    # Reuse only an exactly matching safely expanded raw tree; never mix stale files.
    if raw.exists():
        actual={str(p.relative_to(raw)) for p in raw.rglob('*') if p.is_file()}
        need(not raw.is_symlink() and not any(p.is_symlink() for p in raw.rglob('*')),'Existing raw symlink')
        need(actual==set(files),'Existing raw inventory differs')
        need(all(digest((raw/k).read_bytes())==v for k,v in files.items()),'Existing raw bytes differ')
    else:
        # All zip validation completed before first write.
        for key,data in contents.items():
            dest=raw/key; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_bytes(data)
    def document(k): return json.loads(contents[k])
    contracts=document('static/CURRENT_CONTRACTS.json')
    reports={c:document(c+'/REPORT.json') for c in ('n11','n12')}
    focuses={c:document(c+'-focus/FOCUSED_CAPTURE.json') for c in ('n11','n12')}
    for d in [contracts,*reports.values(),*focuses.values()]:
        need(d['status']=='PASS' and d['sourceSHA']==sha,'Report status/source mismatch')
    for c,answers,wrong,stages in [('n11',39,109,14),('n12',46,127,15)]:
        rows=[r for r in contracts['rows'] if r['code']==c]
        need(len(rows)==1 and rows[0]['mode']=='APPROVED','Both active contracts must be APPROVED')
        rr=reports[c]['results']; need(len(rr)==4 and {r['width'] for r in rr}==WIDTHS,'Widths missing/duplicated')
        need(not reports[c].get('errors'),'Browser errors')
        for r in rr:
            need(r['code']==c and r['answered']==answers and r['wrongCount']==wrong and r['stages']==stages,'Grading/stages mismatch')
            need(all(r[k] for k in ['history','reload','resize','migration']) and r['geometry']=='PASS','Behavior/geometry failure')
    focus=focuses['n12']; need(set(focus['targetNodes'])==TARGETS,'Focused targets mismatch')
    expected={(n,s,w) for n in TARGETS for s in ('pending','wrong','correct') for w in WIDTHS}
    frames=focus['frames']; need(len(frames)==60 and {(f['nodeId'],f['state'],f['width']) for f in frames}==expected,'Focused matrix mismatch')
    need(all(not f['issues'] and f['layoutModified'] is False and f['fullPage'] is False for f in frames),'Focused layout issues')
    need(focus['answered']==46 and focus['focusedWrongCount']==5 and focus['allWrongCountNotTestedHere'] is True,'Focus grading scope')
    need(focus['history'] and focus['reload'] and all(focus['reset'].values()) and not focus['errors'],'Focus persistence failed')
    boundary=focus['chapterBoundary']; need(boundary['browserBackToCompletedN12'] and 'math-numbers-expressions-n13' in boundary['nextHref'] and 'math-numbers-expressions-n13' in boundary['nextURL'],'N13/back mismatch')
    need(focus['layoutModified'] is False,'Modified app layout')
    pngs={k:v for k,v in contents.items() if k.startswith(('n12/','n12-focus/')) and k.endswith('.png')}
    need(len([k for k in pngs if k.startswith('n12-focus/')])==135,'Expected exact135 focus PNGs')
    for n,s,w in expected:
        for suffix in ['viewport','focus']:
            need(f'n12-focus/{n}-{w}-{s}-{suffix}.png' in pngs,'Missing primary focused PNG')
    for name in ['n12-reset-reload-start.png','n12-next-unit-route.png','n12-390-history-full.png']:
        need('n12-focus/'+name in pngs,'Missing boundary/history PNG')
    # Build transient PNG-only archive before Store writes; native adapter rechecks format/limits.
    with tempfile.TemporaryDirectory(prefix='w047-n12-ci-') as tmp:
        pngzip=Path(tmp)/'N12_PNG_CAPTURE.zip'
        with zipfile.ZipFile(pngzip,'w',zipfile.ZIP_DEFLATED) as z:
            for k,v in sorted(pngs.items()):
                need(v.startswith(b'\x89PNG\r\n\x1a\n'),'Invalid PNG magic')
                info=zipfile.ZipInfo(k,date_time=(1980,1,1,0,0,0)); info.compress_type=zipfile.ZIP_DEFLATED; z.writestr(info,v)
        need(pngzip.stat().st_size<=LIMIT_ZIP and sum(map(len,pngs.values()))<=LIMIT_RAW,'PNG capture limits')
        capture_digest=digest(pngzip.read_bytes())
        state=rt.state(work); existing=state['evidence']
        ci=next((ref for ref,e in existing.items() if e['kind']=='ci' and e['data'].get('id')==run['id'] and e['data'].get('head_sha')==sha),None)
        if ci is None:
            ci=rt.evidence(work,'ci',{'id':run['id'],'html_url':run['html_url'],'status':'completed','conclusion':'success','head_sha':sha},source_ref='Actual GitHub Actions API metadata',verification_level='tool_result_transcribed')
        destination=str((root/'capture-n12').relative_to(repo))
        expected_files={destination+'/'+k:digest(v) for k,v in pngs.items()}
        # Unit-specific file inventory prevents accidental reuse of an N11 capture.
        capture=next((ref for ref,e in rt.state(work)['evidence'].items() if e['kind']=='capture' and e['data'].get('ci_ref')==ci and e['data'].get('source_sha')==sha and e['data'].get('files')==expected_files and e['data'].get('artifact_sha256')==capture_digest),None)
        if capture:
            need(all(digest((repo/k).read_bytes())==h for k,h in expected_files.items()),'Existing capture bytes differ')
        else: capture=import_capture(rt,work,pngzip,ci,destination)
        screens=[]
        for k,v in sorted(pngs.items()):
            data={'path':destination+'/'+k,'sha256':digest(v),'capture_ref':capture,'source_sha':sha,'block':'n12'}
            prior=next((ref for ref,e in rt.state(work)['evidence'].items() if e['kind']=='screenshot' and e['data']==data),None)
            screens.append(prior or rt.evidence(work,'screenshot',data,source_ref=f'Actual CI artifact {artifact["id"]} / {k}',verification_level='local_execution'))
    proof={'run':run,'artifact':artifact,'downloadedArchiveSHA256':original_digest,'derivedPNGArchiveSHA256':capture_digest,'rawFiles':files,'ciRef':ci,'captureRef':capture,'screenshotRefs':screens,'n11Mode':'APPROVED','n12Mode':'APPROVED','unit':'n12','localImagesUsedAsCI':False,'transientPNGArchiveRetained':False,'toolAssistance':'Reviewer B capture/import draft; not lesson authorship or visual acceptance'}
    root.mkdir(parents=True,exist_ok=True)
    (root/'N12_CAPTURE_PROOF.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
    (base/'evidence/N12_CI_CAPTURE_REFS.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
    print('Registered actual N12 CI capture',run['id'],capture,len(pngs),'PNGs')

if __name__=='__main__': main()
