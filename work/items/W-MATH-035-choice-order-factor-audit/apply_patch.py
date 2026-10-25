import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from store import digest
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-035';s=rt.state(w);assert rt.approval(s) and not rt.integrity(s)
files={}
for src,dst in [('n09Authored.json','src/data/textbook/math/numbers/n09Authored.json'),('n10Authored.json','src/data/textbook/math/numbers/n10Authored.json'),('GuidedMathReadingFlow.tsx','src/components/textbook/GuidedMathReadingFlow.tsx'),('guided-math-reading.css','src/components/textbook/guided-math-reading.css'),('guidedMathDisplayPolicy.ts','src/components/textbook/guidedMathDisplayPolicy.ts')]:files[dst]=(B/'candidate'/src).read_bytes()
files={p:v for p,v in files.items() if not (R/p).exists() or (R/p).read_bytes()!=v};assert files
h=lambda b:hashlib.sha256(b).hexdigest();backup=rt.store.put(dict(files_hex={p:(R/p).read_bytes().hex() if (R/p).exists() else None for p in files},new_hashes={p:h(v) for p,v in files.items()}));job=json.loads((B/'PATCH_JOB_N09.json').read_text());op='W035-bundle-'+backup[:20]
rt.append('patch_intent',w,dict(node=job['node'],patch_hash=digest({p:h(v) for p,v in files.items()}),backup=backup,before={p:h((R/p).read_bytes()) if (R/p).exists() else None for p in files}),event_id=op)
for p,v in files.items():(R/p).write_bytes(v)
rt.append('patch_applied',w,dict(node=job['node'],operation=op,after_manifest={p:h(v) for p,v in files.items()}));print('Applied approved two-unit bundle; N10 compilation verification remains after N09 native finish')
