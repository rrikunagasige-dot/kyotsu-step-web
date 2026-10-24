import json,os
from pathlib import Path
from ..corpus.core import digest

def promote(model,registry,expected=None):
    # A fit result alone can never enable production use.
    if not model.get('advisoryEligible') or model.get('status')!='ADVISORY' or not model.get('shadowEvidence') or not model.get('unseenEvaluation'):raise ValueError('evaluation and shadow evidence required')
    if digest({k:v for k,v in model.items() if k!='modelHash'})!=model['modelHash']:raise ValueError('model hash')
    p=Path(registry);old=json.loads(p.read_text()) if p.exists() else None
    if (old or {}).get('active')!=expected:raise ValueError('registry CAS conflict')
    v={'active':model['modelHash'],'previous':expected};p.parent.mkdir(parents=True,exist_ok=True);temp=p.with_suffix('.tmp');temp.write_text(json.dumps(v));os.replace(temp,p);return v
