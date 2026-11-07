"""原Dの同梱4ZIP+build1だけを検算。元path保持、抽出/再build/Native操作なし。"""
import argparse,json,hashlib,zipfile,stat
from pathlib import Path,PurePosixPath
p=argparse.ArgumentParser();p.add_argument('--contract',required=True);p.add_argument('--directory',required=True);p.add_argument('--restore-dist');a=p.parse_args();c=json.loads(Path(a.contract).read_text());d=Path(a.directory).resolve(strict=True);sha=lambda b:hashlib.sha256(b).hexdigest();source=c['sourceSHA'];q=c['sourceQA'];maps=[];total={k:0 for k in ['cases','stages','correct','wrong','states','images']}
# Root取得の原APIを入力に使う。未取得/別head/別runは拒否。
run=json.loads((d/'RUN_API.json').read_text());assert run['id']==q['runID'] and run['head_sha']==source and run['status']=='completed' and run['conclusion']=='success';assert run['path']==q['workflowPath'] and run['head_branch']==q['workflowBranch']
meta=json.loads((d/'ARTIFACTS_API.json').read_text())['artifacts'];jobs=json.loads((d/'JOBS_API.json').read_text())['jobs']
def archive(expected):
 m=next(x for x in meta if x['id']==expected['id']);assert m['name']==expected['name'];b=(d/(expected['name']+'.zip')).read_bytes();assert len(b)==expected['zipBytes']==m['size_in_bytes'];assert sha(b)==expected['zipSHA256']==m['digest'].removeprefix('sha256:');assert not m['expired'];assert m['workflow_run']['id']==q['runID'] and m['workflow_run']['head_sha']==source
 import io
 z=zipfile.ZipFile(io.BytesIO(b));assert len(z.namelist())==len(set(z.namelist()));files={};size=0
 for i in z.infolist():
  path=PurePosixPath(i.filename);assert str(path)==i.filename and not path.is_absolute() and '..' not in path.parts and '\\' not in i.filename;assert not stat.S_ISLNK(i.external_attr>>16)
  if i.is_dir():continue
  size+=i.file_size;assert size<512*1024*1024;files[i.filename]=z.read(i)
 return files
def canonical_term(parts):
 out=[]
 for p in parts:
  assert p['type']in ('math','text')
  q={'type':'math','value':''.join(p['annotations'])if 'annotations'in p else p['latex']}if p['type']=='math'else{'type':'text','value':p['text']}
  if q['type']=='text'and out and out[-1]['type']=='text':out[-1]['value']+=q['value']
  elif q['type']!='text'or q['value']:out.append(q)
 return out
def verify_term_state(state, fixtures, width):
 units={u['unit']['unitId']:u['unit']for u in fixtures['units']};unit=units[state['unitId']]
 assert state['revision']==unit['revision'],'Unknown revision requires explicit source fixture, not silent fallback'
 allterms=[{'blockId':b['id'],'index':i,'raw':p['text']}for b in unit['sections'][0]['readingFlow']for i,p in enumerate(b.get('parts',[]))if p['type']=='term']
 bykey={(t['blockId'],t['index']):t for t in allterms}
 expected=[t for t in allterms if t['blockId']in state['expectedVisibleBlockIds']];assert state['termBodySpecs']==expected
 body=[(t['blockId'],t['index'])for t in state['termEvidence']if t['body']];assert body==[(t['blockId'],t['index'])for t in expected]
 for t in state['termEvidence']:
  spec=bykey[t['blockId'],t['index']];assert t['tag']=='STRONG'and t['strong']and int(t['fontWeight'])>=700 and t['displayGate']and t['fontSize']==18
  parts=c['expectedTermMathByRaw'].get(spec['raw'],[{'type':'text','text':spec['raw']}]);assert canonical_term(t['parts'])==canonical_term(parts)
  maths=[p for p in parts if p['type']=='math'];assert len(t['roots'])==len(maths)
  for m,expected in zip(t['roots'],maths):
   assert expected['latex']=='x'and m['annotations']==['x']and m['rootFonts']==[18]and m['mathFaceLoaded']and len(m['glyphs'])==1
   g=m['glyphs'][0];assert g['text']=='x'and 'KaTeX_Math'in g['fontFamily']and g['fontStyle']=='italic'and g['fontSize']==18

for width in [320,390,430,1440]:
 e=next(x for x in q['artifacts'] if x['name']=='w051-qa-'+str(width));files=archive(e);r=json.loads(files['REPORT.json']);dist=json.loads(files['DIST_FILES.json']);f=json.loads(files['FIXTURES.json']);assert r['sourceSHA']==r['qaProducerSHA']==r['checkoutCommitSHA']==r['finalCandidateSourceSHA']==source
 assert r['status']=='PASS_DECLARED_DIAGNOSTIC_SLICE_ONLY' and r['widths']==[width] and r['codes']==['n01','n02','n03','n04','n05','n06'] and not r['failures'] and not r['trackedProductDiff'];assert all(x['status']=='PASS' and not x.get('pageErrors') for x in r['cases'])
 for name,key in [('B_verify_browser.mjs','scriptSHA256'),('B_contract.json','qaContractSHA256'),('B_display_checks.mjs','additionalVerifierSHA256'),('B_inline_fragment_checks.mjs','inlineFragmentVerifierSHA256')]:assert r[key]==c['qa4'][name]
 assert {x['path']:x['sha256'] for x in r['retainedHashes']}==c['retained319'];assert {x['path']:x['sha256'] for x in r['productHashes']}==c['productHashes'];assert r['patchSHA256']==c['approvedCombinedSHA256']
 assert dist['schema']=='w051-original-qa-dist/3' and dist['sourceSHA']==dist['qaProducerSHA']==source;assert dist['productHashes']==r['productHashes'] and dist['scriptSHA256']==r['scriptSHA256'];assert dist['fileCount']==len(dist['fileHashes'])==120;assert sha(json.dumps(dist['fileHashes'],ensure_ascii=False,separators=(',',':')).encode())==dist['fileMapSHA256'];assert r['distIdentity']['sha256']==sha(files['DIST_FILES.json']) and r['distIdentity']['servedFilesVerified']==120;maps.append(dist['fileHashes'])
 assert r['termSourceInventory']==c['termSourceInventory'] and r['termCoverage']['sourceTerms']==c['termSourceInventory'];assert len(r['termSourceInventory'])==13 and sum(t['dictionaryHit']for t in r['termSourceInventory'])==1;assert set(r['termCoverage']['liveBodyKeys'])=={f"{width}:{t['code']}:{t['blockId']}#{t['index']}"for t in r['termSourceInventory']}
 assert len(r['states'])==2111 and len(r['images'])==43;expected={'REPORT.json','DIST_FILES.json','FIXTURES.json','PROGRESS.ndjson','N0106_SCOPE_HELPER.cjs'}|{x['file'] for x in r['states']}|{x['file'] for x in r['images']};assert set(files)==expected
 for kind in ['states','images']:
  for x in r[kind]:
   b=files[x['file']];assert sha(b)==x['sha256'] and x['sourceSHA']==source
   if kind=='images':assert len(b)==x['bytes'] and b.startswith(bytes([137,80,78,71,13,10,26,10]))
   else:
    state=json.loads(b);assert state['sourceSHA']==source;verify_term_state(state,f,width);view=state['viewport'];assert (view['width'] if isinstance(view,dict) else view)==width
 live=[x for x in r['cases'] if x['name'].startswith('live-')];assert len(live)==6
 for unit in f['units']:
  case=next(x for x in live if x['name']==f"live-{unit['code']}-{width}");assert [x['stageId'] for x in case['stages']]==[x['id'] for x in unit['stages']];assert {x['id'] for x in case['answers']}==set(unit['items']);assert all(x['correctPersisted'] for x in case['answers'])
 counts={'cases':len(r['cases']),'stages':sum(len(x['stages']) for x in live),'correct':sum(len(x['answers']) for x in live),'wrong':sum(len(y['wrongChoicesExercised']) for x in live for y in x['answers']),'states':len(r['states']),'images':len(r['images'])};assert counts==q['slice'];assert not r['coverage']['unverifiedStages'];assert r['coverage']['actualStageCompletions']==62 and r['coverage']['actualCorrectJudgments']==251 and r['coverage']['actualWrongChoices']==509
 job=next(x for x in jobs if x['name']==f'browser ({width})');assert job['run_id']==q['runID'] and job['status']=='completed' and job['conclusion']=='success';total={k:total[k]+counts[k] for k in total}
assert len(meta)==5 and len({m['id']for m in meta})==5;assert len(jobs)==4 and {j['name']for j in jobs}=={f'browser ({w})'for w in [320,390,430,1440]};assert all(x==maps[0] for x in maps);build=archive(next(x for x in q['artifacts'] if x['name']=='w051-original-build'));assert set(build)==set(maps[0]);assert all(sha(b)==maps[0][n] for n,b in build.items());assert sum(map(len,build.values()))==dist['totalBytes'];assert not any(n in build for n in c['manifestOrder'])
result={'status':'PASS_ORIGINAL_SOURCE_QA_BYTES_ONLY_NOT_NATIVE_OR_PUBLIC','sourceSHA':source,'sourceQARunID':q['runID'],'total':total,'fileCount':len(build),'fileHashes':maps[0],'distIdentity':dist,'appRebuilt':False,'newPNGViews':0}
# Only after all five immutable archives pass; fresh destination, no overwrite or symlink.
if a.restore_dist:
 target=Path(a.restore_dist).absolute();assert not target.exists() and not target.is_symlink()
 assert not any(x.is_symlink() for x in target.parents)
 target.mkdir(parents=True)
 for name,raw in build.items():
  f=target/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(raw);assert sha(f.read_bytes())==maps[0][name]
 result['restoredFreshDirectory']=str(target)
print(json.dumps(result,ensure_ascii=False))
