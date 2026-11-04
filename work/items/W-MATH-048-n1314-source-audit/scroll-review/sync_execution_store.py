"""M-only append-only export of the verified execution ledger; never merges divergent histories."""
from pathlib import Path
import sys,json,os,uuid
R=Path(__file__).resolve().parents[4];sys.path.insert(0,str(R/'workflow'))
from store import Store
src=Path('/tmp/w048-scroll-execution-store');dst=R/'work/items/W-MATH-032-n07-semantic-repair/runtime'
a=Store(src).events();b=Store(dst).events();assert b==a[:len(b)],'Canonical ledger diverged; do not merge'
added=0
for p in (src/'artifacts').glob('*.json'):
 q=dst/'artifacts'/p.name;raw=p.read_bytes()
 if q.exists():assert q.read_bytes()==raw,p.name
 else:
  Store(src).get(p.stem)
  tmp=q.with_suffix('.export-'+uuid.uuid4().hex+'.tmp');tmp.write_bytes(raw);os.replace(tmp,q);added+=1
for event in a[len(b):]:
 matches=list((src/'events').glob(f'{event["seq"]:08d}-*.json'));assert len(matches)==1
 p=matches[0];q=dst/'events'/p.name;assert not q.exists();tmp=q.with_suffix('.export-'+uuid.uuid4().hex+'.tmp');tmp.write_bytes(p.read_bytes());os.replace(tmp,q)
assert Store(dst).events()==a
proof={'status':'VERIFIED_APPEND_ONLY_EXPORT','fromEvents':len(b),'toEvents':len(a),'head':a[-1]['hash'],'addedArtifacts':added,'source':str(src),'destination':str(dst),'noDivergentMerge':True}
(R/'work/items/W-MATH-048-n1314-source-audit/scroll-review/evidence/EXECUTION_STORE_EXPORT.json').write_text(json.dumps(proof,indent=2)+'\n')
print(json.dumps(proof))
