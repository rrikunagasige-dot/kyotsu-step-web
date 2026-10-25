"""Journal only render implementation iterations within the same approved R06."""
import json,sys,hashlib,os
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from adapters import in_scope
from store import digest
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-033';s=rt.state(w)
assert not rt.integrity(s) and rt.approval(s)
files={'src/data/textbook/math/numbers/n08Authored.json':B/'MATERIALIZED_APP.json','src/components/textbook/N08ReadingFlow.tsx':B/'candidate/N08ReadingFlow.tsx'}
changed={p:v.read_bytes() for p,v in files.items() if (R/p).read_bytes()!=v.read_bytes()}
if not changed:print('No changed candidate bytes');sys.exit(0)
before={p:(R/p).read_bytes() for p in changed};h=lambda b:hashlib.sha256(b).hexdigest()
assert all(in_scope(p,s['plan']['scope']) and s['candidate_manifest'][p]==h(before[p]) for p in changed)
node='R06_PATCH@n08';job=json.loads((B/'PATCH_JOB.json').read_text())
assert node in s['claims'] and s['claims'][node]['token']==job['job']['claimToken']
backup=rt.store.put({p:v.hex() for p,v in before.items()});op='W033-iteration-'+digest({p:h(v) for p,v in changed.items()})[:20]
rt.append('patch_intent',w,dict(node=node,patch_hash=digest({p:h(v) for p,v in changed.items()}),backup=backup,before={p:h(v) for p,v in before.items()}),event_id=op)
for p,v in changed.items():
 tmp=(R/p).with_suffix('.w033.tmp');tmp.write_bytes(v);os.replace(tmp,R/p)
rt.append('patch_applied',w,dict(node=node,operation=op,after_manifest={p:h(v) for p,v in changed.items()}))
print(json.dumps({'updated':list(changed),'scope':'same exact approved IR; implementation metadata/render iteration'}))
