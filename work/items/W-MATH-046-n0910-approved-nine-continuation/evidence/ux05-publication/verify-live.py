from pathlib import Path
import urllib.request,urllib.parse,json,hashlib,concurrent.futures,time,re
BASE='https://rrikunagasige-dot.github.io/kyotsu-step-web/'
SOURCE='691d3d160493bf684ca8a31a22476d31d98caeec'
PUBLISHER='f4c50963e26d3d4f9b33c3ca9f43e91e57dbdb75'
STORAGE='kyotsu-step-gate3-math-20261023'
ROOT=Path('/workspace/scratch/6ff917b2ec4a/w046-ux05-release-frozen')
OUT=Path('/tmp/w046-ux05-hosted');OUT.mkdir(exist_ok=True)
def sha(b):return hashlib.sha256(b).hexdigest()
def fetch(name):
 if urllib.parse.urlparse(name).scheme or name.startswith('/') or '..' in Path(name).parts:raise ValueError('UNSAFE_ASSET_PATH')
 url=urllib.parse.urljoin(BASE,name)
 req=urllib.request.Request(url,headers={'Cache-Control':'no-cache','User-Agent':'W046-release-verification'})
 with urllib.request.urlopen(req,timeout=30)as r:
  resolved=urllib.parse.urlparse(r.url)
  if resolved.hostname!='rrikunagasige-dot.github.io' or not resolved.path.startswith('/kyotsu-step-web/'):raise ValueError('HOST_REDIRECT')
  b=r.read();return b,{'url':url,'resolvedURL':r.url,'status':r.status,'sha256':sha(b),'bytes':len(b),'contentType':r.headers.get('Content-Type'),'etag':r.headers.get('ETag')}
raw,http=fetch('w046-release.json');manifest=json.loads(raw)
assert manifest['sourceSHA']==SOURCE,'HOSTED_SOURCE_MISMATCH'
assert manifest['publisherSHA']==PUBLISHER,'HOSTED_PUBLISHER_MISMATCH'
assert manifest['storageKey']==STORAGE,'STORAGE_NAMESPACE_MISMATCH'
for code,revision in [('n09',8),('n10',5)]:
 c=json.loads((ROOT/f'src/data/textbook/math/numbers/{code}ConstructionCompiled.json').read_text());u=next(x for x in manifest['units']if x['code']==code);assert u['revision']==revision and u['compiledHash']==c['compiledHash']
publisher=Path('/tmp/w046-ux05-full/publisher/w046-publish-check.mjs').read_text()
expected=json.loads(re.search(r'const required=(\{.*?\});',publisher,re.S).group(1))
assert manifest['requiredSourceHashes']==expected and len(expected)==32,'SOURCE_PATH_SET_MISMATCH'
assert isinstance(manifest['files'],dict)and len(manifest['files'])==121 and {'index.html','release.json'}<=set(manifest['files']),'ASSET_SET_INCOMPLETE'
assert all(re.fullmatch('[a-f0-9]{64}',v)for v in manifest['files'].values()),'ASSET_DIGEST_FORMAT'
for p,h in manifest['requiredSourceHashes'].items():
 assert not Path(p).is_absolute() and '..' not in Path(p).parts
 assert sha((ROOT/p).read_bytes())==h,p
(OUT/'w046-release.json').write_bytes(raw)
assets=[];errors=[]
def verify_asset(item):
 name,expected=item;b,meta=fetch(name);assert meta['sha256']==expected,'HOSTED_ASSET_BYTES_MISMATCH '+name
 if name=='release.json':
  release=json.loads(b);assert release['sourceSHA']==SOURCE and release['workflowSHA']==PUBLISHER and release['storageKey']==STORAGE
  (OUT/'release.json').write_bytes(b)
 return {'file':name,**meta}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as pool:
 futures=[pool.submit(verify_asset,item)for item in manifest['files'].items()]
 for f in concurrent.futures.as_completed(futures):
  try:assets.append(f.result())
  except Exception as e:errors.append(str(e))
result={'status':'PASS'if not errors and len(assets)==len(manifest['files'])else'FAIL','sourceSHA':SOURCE,'publisherSHA':PUBLISHER,'baseURL':BASE,'manifestHTTP':http,'requiredSourcePathsVerified':len(manifest['requiredSourceHashes']),'assetCountExpected':len(manifest['files']),'assetCountVerified':len(assets),'assets':sorted(assets,key=lambda x:x['file']),'errors':errors,'scope':'Independent public raw HTTP and source/hash verification; not an additional browser playthrough or user acceptance','userAcceptance':False,'formalStoreReceipt':False}
(OUT/'HTTP_VERIFICATION.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:result[k]for k in ['status','sourceSHA','publisherSHA','assetCountExpected','assetCountVerified','errors']},ensure_ascii=False))
if result['status']!='PASS':raise SystemExit(1)
