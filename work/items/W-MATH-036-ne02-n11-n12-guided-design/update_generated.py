import json,hashlib,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';code=sys.argv[1];assert r.approval(r.state(w)) and not r.integrity(r.state(w));p='src/data/textbook/math/numbers/'+code+'Authored.json';v=(B/('MATERIALIZED_'+code.upper()+'.json')).read_bytes();old=(R/p).read_bytes();
if v==old:print('Generated output already current '+code);raise SystemExit(0)
h=lambda x:hashlib.sha256(x).hexdigest();proof=r.store.put(dict(files_hex={p:old.hex()},new_hashes={p:h(v)}));op='W036-render-'+proof[:20];node='R06_PATCH@'+code;r.append('patch_intent',w,dict(node=node,patch_hash=digest({p:h(v)}),backup=proof,before={p:h(old)}),event_id=op);(R/p).write_bytes(v);r.append('patch_applied',w,dict(node=node,operation=op,after_manifest={p:h(v)}));print('Approved render iteration '+code)
