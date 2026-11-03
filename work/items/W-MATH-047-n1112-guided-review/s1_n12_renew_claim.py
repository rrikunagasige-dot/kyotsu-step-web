import json,time,sys,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from production import ai_request
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';nid='R04_PROPOSAL@n12';p=B/'evidence/n12-R04_PENDING_TEAM.json';d=json.loads(p.read_text());s=r.state(w);old=s['claims'][nid]
assert old['expires_at']<time.time();assert r.task(w,nid)['input_hash']==d['inputHash']
proof={'status':'CLAIM_EXPIRED_BEFORE_SUBMISSION','node':nid,'oldClaim':old,'sameInputHash':d['inputHash'],'completedCodeReceipts':d['job']['receipts'],'reason':'Actual image reviews continued beyond execution-right lease. Pedagogic results and original observations retained.','initialEvidenceAttempt':'Rejected check kind: it correctly requires PASS and current source SHA. No native check was registered; corrected to a factual file record.'}
f=B/'evidence/S1_N12_R04_CLAIM_EXPIRATION.json';f.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
e=r.evidence(w,'file',{'path':str(f.relative_to(R)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()},source_ref='Actual claim expiration / unchanged R04 inputs',verification_level='local_execution')
(B/'evidence/S1_N12_R04_EXPIRED_CLAIM.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
r.reconcile_claim(w,nid,'FAILED',[e]);c=r.claim(w,nid,'M actual review collection',seconds=14400);assert c['input_hash']==d['inputHash'];d['job']['claimToken']=c['claim_token'];d['job']['aiRequest']=ai_request(r,w,nid);d['claimRenewal']={'oldClaim':old,'newClaim':c,'reasonEvidence':e,'sameCodeReceiptsRetained':True,'newFirstPassClaimed':False};p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print('Expired R04 right formally reconciled; unchanged CODE receipts and actual original observations retained; 4h collection claim',flush=True)
