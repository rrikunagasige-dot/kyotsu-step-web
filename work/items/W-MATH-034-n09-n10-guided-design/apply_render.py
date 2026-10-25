import json,hashlib,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from store import digest
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034';s=rt.state(w)
assert rt.approval(s) and not rt.integrity(s)
paths={'src/components/textbook/GuidedMathReadingFlow.tsx':B/'candidate/GuidedMathReadingFlow.tsx','src/components/textbook/guided-math-reading.css':B/'candidate/guided-math-reading.css'}
files={p:c.read_bytes() for p,c in paths.items() if (R/p).read_bytes()!=c.read_bytes()};assert files
h=lambda v:hashlib.sha256(v).hexdigest();backup=rt.store.put({'files_hex':{p:(R/p).read_bytes().hex() for p in files},'new_hashes':{p:h(v) for p,v in files.items()}});node=next(iter(s['claims']));op='W034-render-'+backup[:20]
rt.append('patch_intent',w,dict(node=node,patch_hash=digest({p:h(v) for p,v in files.items()}),backup=backup,before={p:h((R/p).read_bytes()) for p in files}),event_id=op)
for p,v in files.items():(R/p).write_bytes(v)
rt.append('patch_applied',w,dict(node=node,operation=op,after_manifest={p:h(v) for p,v in files.items()}));print(op)
