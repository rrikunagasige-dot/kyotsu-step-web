"""Restore authentic CI JSON bytes from a bounded, lossless repository archive."""
from pathlib import Path,PurePosixPath
import json,hashlib,tarfile,os,sys,tempfile
B=Path(__file__).resolve().parent/'evidence/g3-final-ci'
def restore(destination=None):
 info=json.loads((B/'RAW_JSON_ARCHIVE.json').read_text());index=json.loads((B/'ARTIFACT_INDEX.json').read_text());archive=B/info['file'];sha=lambda b:hashlib.sha256(b).hexdigest()
 assert archive.stat().st_size==info['bytes']and sha(archive.read_bytes())==info['sha256']
 expected={r['path']:r for r in index['files']if r['path'].endswith('.json')};assert len(expected)==info['originalFiles']
 dest=Path(destination)if destination else B/'raw-json';assert not dest.is_symlink();dest.mkdir(parents=True,exist_ok=True);seen=set();restored=0
 with tarfile.open(archive,'r:gz')as t:
  members=t.getmembers();assert len(members)==info['originalFiles']and sum(m.size for m in members)==info['originalBytes']
  for m in members:
   p=PurePosixPath(m.name);assert m.isfile()and not p.is_absolute()and '..'not in p.parts and str(p)==m.name and m.name not in seen and m.name in expected;seen.add(m.name);row=expected[m.name];assert m.size==row['bytes']
   data=t.extractfile(m).read(m.size+1);assert len(data)==m.size and sha(data)==row['sha256'];q=dest.joinpath(*p.parts)
   parent=dest
   for part in p.parts[:-1]:parent=parent/part;assert not parent.is_symlink();parent.mkdir(exist_ok=True)
   assert not q.is_symlink()
   if q.exists():assert q.is_file()and sha(q.read_bytes())==row['sha256']
   else:
    fd,tmp=tempfile.mkstemp(prefix='.g3-restore-',dir=q.parent)
    try:
     with os.fdopen(fd,'wb')as f:f.write(data);f.flush();os.fsync(f.fileno())
     os.replace(tmp,q);restored+=1
    finally:
     if os.path.exists(tmp):os.unlink(tmp)
 assert seen==set(expected)
 return {'verifiedOriginalFiles':len(seen),'restored':restored,'archiveSHA256':info['sha256'],'originalArtifactSHA256':info['originalArtifactSHA256'],'nativeGuardsChanged':False}
if __name__=='__main__':print(json.dumps(restore(sys.argv[1]if len(sys.argv)>1 else None)))
