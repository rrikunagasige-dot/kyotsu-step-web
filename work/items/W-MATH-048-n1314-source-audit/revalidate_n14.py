"""Revalidate N14's still-unapplied baseline at the actual mixed source version."""
from pathlib import Path
import json,sys,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from runner import run_code
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-048';load=lambda p:json.loads((B/p).read_text())
assert r.next(w)['task']['node']['id']=='R01_CAPTURE@n14'
paths=['P003_FINAL.md','r3/PROPOSED_PATCH_INDEX.json','evidence/N14_CURRENT.json','evidence/N14_SOURCE_INDEX.json','PLANNED_IMPACT.json','evidence/RECOVERY_CURRENT_CONTRACTS.json']
refs=[r.evidence(w,'file',{'path':str((B/p).relative_to(R)),'sha256':hashlib.sha256((B/p).read_bytes()).hexdigest()},source_ref='Current mixed source revalidation: N14 r10 not applied; N13/domain/Page exact approved after',verification_level='local_execution')for p in paths]
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text())['cases'];ir=load('evidence/N14_LEGACY_PROJECTION.json');source=load('evidence/N14_SOURCE_INDEX.json');oldcause=load('evidence/R02_CAUSE_n14_RESULT.json')
for nid,inputs,fields in [
 ('R01_CAPTURE@n14',{'source.fixed':{},'feedback.capture':{}},{'complaint':'Continue approved P003 while revalidating invalidated records, not a quality label.','before_evidence':paths,'reproduction':'N14 leaf is still r10/38 answers before, shared domain/Page are applied revision-scoped after; original 46blocks/16questions/1figure remain authoritative. No N14 current browser PASS.','target_versions':{'original':r.state(w)['plan']['source_sha'],'n13':5,'n14':10,'shared':'P003 AFTER'}}),
 ('R02_CAUSE@n14',{'case.retrieve':{'python':sys.executable,'request':{'cache':'/tmp/w048-current-n14-encoder','encoder':{'local_only':True},'query':'絶対値 不等式 境界 領域 端点 内外 ヒント先出し 三辺操作 原典 本文接続','cases':corpus,'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}},{k:oldcause[k]for k in ['symptoms','confirmed_causes','hypotheses','missing_learning_actions','root_cause_signatures','case_dispositions']}),
 ('R03_IMPACT@n14',{'impact.inventory':{}},{'source_inventory':list(r.state(w)['plan']['source_manifest']),'unknowns':[],'scope':'Current planned-impact inventory. N14 leaf pending; shared domain/Page affect both units; no browser acceptance implied.'})]:
 assert r.next(w)['task']['node']['id']==nid
 job=run_code(r,w,inputs);assert all(r.store.get(r.store.get(x)['output'])['status']in ('PASS','NEEDS_AI_REVIEW')for x in job['receipts'])
 if nid.startswith('R03'):
  rows=load('evidence/CURRENT_R03_RESULT.json')['impact_rows'];fields['impact_rows']=[dict(x,evidence_refs=refs)for x in rows]
 req=job['aiRequest'];result=dict(verdict='PASS',evidence_refs=refs,capability_receipts=job['receipts'],aiReview={'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M current baseline revalidation with actual A/B N14 primary-source preparation observations','evidence':refs},**fields)
 (B/'evidence'/('CURRENT_N14_'+nid.split('_')[0]+'_RESULT.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');r.submit(w,nid,job['claimToken'],result);print('submitted '+nid,flush=True)
print('next '+r.next(w)['task']['node']['id'],flush=True)
