"""Apply reversible approved implementation/verification support deltas with old bytes retained."""
import hashlib
from store import digest
def apply(rt,w,node,root,files,reason):
 h=lambda v:hashlib.sha256(v).hexdigest();raw={p:(v.encode() if isinstance(v,str) else v) for p,v in files.items()};raw={p:v for p,v in raw.items() if not (root/p).exists() or (root/p).read_bytes()!=v}
 if not raw:return
 assert not rt.integrity(rt.state(w))
 old={p:(root/p).read_bytes() if (root/p).exists() else None for p in raw};proof=rt.store.put(dict(files_hex={p:v.hex() if v is not None else None for p,v in old.items()},new_hashes={p:h(v) for p,v in raw.items()},reason=reason));op='W036-support-'+proof[:20]
 rt.append('patch_intent',w,dict(node=node,patch_hash=digest({p:h(v) for p,v in raw.items()}),backup=proof,before={p:h(v) if v is not None else None for p,v in old.items()}),event_id=op)
 for p,v in raw.items():(root/p).parent.mkdir(parents=True,exist_ok=True);(root/p).write_bytes(v)
 rt.append('patch_applied',w,dict(node=node,operation=op,after_manifest={p:h(v) for p,v in raw.items()}))
