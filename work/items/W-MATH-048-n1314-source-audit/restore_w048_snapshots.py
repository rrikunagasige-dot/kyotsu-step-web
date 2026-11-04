"""Restore exact native snapshot bytes before Runtime access; never alters native guards."""
import gzip,hashlib,json,os,re,uuid,importlib.util
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];A=R/'work/items/W-MATH-032-n07-semantic-repair/runtime/artifacts'
def restore_w048():
 previous=R/'work/items/W-MATH-047-n1112-guided-review/restore_native_snapshots.py'
 spec=importlib.util.spec_from_file_location('w047_exact_snapshot_restorer',previous);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);mod.restore()
 if not (B/'NATIVE_SNAPSHOT_ARCHIVES.json').exists():return []
 restored=[]
 for row in json.loads((B/'NATIVE_SNAPSHOT_ARCHIVES.json').read_text())['files']:
  name=row['name'];assert re.fullmatch(r'[0-9a-f]{64}\.json',name)and row['archive']==name+'.gz';assert row['nativeCanonicalDigest']==name[:-5]
  target=A/name;assert not target.is_symlink();assert not (A/row['archive']).is_symlink()
  if target.exists():data=target.read_bytes()
  else:
   packed=(A/row['archive']).read_bytes();assert hashlib.sha256(packed).hexdigest()==row['archiveSHA256']
   with gzip.GzipFile(fileobj=__import__('io').BytesIO(packed))as z:data=z.read(row['bytes']+1)
  assert len(data)==row['bytes']and hashlib.sha256(data).hexdigest()==row['rawSHA256']
  value=json.loads(data);canonical=json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode();assert hashlib.sha256(canonical).hexdigest()==row['nativeCanonicalDigest']
  if not target.exists():
   tmp=A/('.restore-'+uuid.uuid4().hex+'.tmp')
   try:
    with tmp.open('xb')as f:f.write(data);f.flush();os.fsync(f.fileno())
    os.replace(tmp,target);restored.append(name)
   finally:tmp.unlink(missing_ok=True)
 return restored
if __name__=='__main__':print(json.dumps({'exactNativeSnapshotsRestored':restore_w048(),'sharedRuntimeGuardsChanged':False}))
