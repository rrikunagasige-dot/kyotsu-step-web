"""Losslessly archive only new large native objects; shared Store remains unchanged."""
from pathlib import Path
import gzip,hashlib,json,subprocess
B=Path(__file__).resolve().parent;R=B.parents[2];A=R/'work/items/W-MATH-032-n07-semantic-repair/runtime/artifacts';manifest=B/'NATIVE_SNAPSHOT_ARCHIVES.json'
rows=json.loads(manifest.read_text())['files']if manifest.exists()else[];known={r['name']for r in rows}
files=subprocess.check_output(['git','ls-files','--others','--exclude-standard',str(A.relative_to(R))],cwd=R,text=True).splitlines()
for name in files:
 p=R/name
 if p.suffix!='.json'or p.stat().st_size<200000 or p.name in known:continue
 raw=p.read_bytes();v=json.loads(raw);canonical=json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode();assert hashlib.sha256(canonical).hexdigest()==p.stem
 packed=gzip.compress(raw,compresslevel=9,mtime=0);out=p.with_suffix('.json.gz');out.write_bytes(packed);assert gzip.decompress(out.read_bytes())==raw
 rows.append(dict(name=p.name,archive=out.name,bytes=len(raw),rawSHA256=hashlib.sha256(raw).hexdigest(),archiveSHA256=hashlib.sha256(packed).hexdigest(),nativeCanonicalDigest=p.stem));p.unlink()
manifest.write_text(json.dumps({'format':'lossless-native-json-gzip/1','sharedRuntimeChanged':False,'files':rows},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'archivedNativeObjects':len(rows)}))
