"""Current R02 evidence, with historical causes distinguished from applied repair."""
from pathlib import Path
import sys,json,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from restore_w048_snapshots import restore_w048
restore_w048()
from runtime import Runtime
from runner import run_code
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-048'
assert r.next(w)['task']['node']['id']=='R02_CAUSE@n13'
load=lambda p:json.loads((B/p).read_text())
ir=load('N13_FULL_IR.json');source=load('evidence/N13_SOURCE_INDEX.json')
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text())['cases']
paths=['P003_FINAL.md','r3/DESIGN_INPUTS.json','N13_FULL_IR.json','N13_ROW_PROJECTION.json','evidence/RECOVERY_CURRENT_CONTRACTS.json','evidence/CI_SUCCESS_BROWSER_REPORT.json']
refs=[r.evidence(w,'file',{'path':str((B/p).relative_to(R)),'sha256':hashlib.sha256((B/p).read_bytes()).hexdigest()},source_ref='Current N13 applied repair and retained exact P003 source evidence; bounded CI is not full R07',verification_level='local_execution')for p in paths]
job=run_code(r,w,{'case.retrieve':{'python':sys.executable,'request':{'cache':'/tmp/w048-revalidation-encoder','encoder':{'local_only':True},'query':'絶対値 方程式 二枝 符号 条件 独立判断 ヒント先出し 原典 本文接続','cases':corpus,'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}})
outputs={r.store.get(x)['capability']:r.store.get(r.store.get(x)['output'])for x in job['receipts']}
assert all(x['status']in('PASS','NEEDS_AI_REVIEW')for x in outputs.values()),outputs
old=load('evidence/R02_CAUSE_n13_RESULT.json');req=job['aiRequest']
result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':job['receipts'],
 'symptoms':['Historical baseline bundled the two branch computations and zero/negative distance decisions into final choices. Current N13 r5 is the applied P003 correction; those baseline symptoms are not claimed still present. N14 remains an unapplied sibling.'],
 'confirmed_causes':old['confirmed_causes'],'hypotheses':[],
 'missing_learning_actions':[],
 'root_cause_signatures':old['root_cause_signatures'],
 'currentDisposition':{'n13':'Fixed branch calculation/zero-negative decisions, Q02 transition, general-property placement and hint wording exactly match approved P003 bytes. CODE source/IR checks and bounded CI exist; full geometry/reading/figure/reset/non-author R07 is still pending.','n14':'Original baseline remains, approved correction not applied.'},
 'case_dispositions':[{**x,'reason':'Current revalidation: '+x['reason']+' P003 source and frozen candidate unchanged; APPLY means retained design rule, not a new user quality label.'}for x in old['case_dispositions']],
 'aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'M current-source cause revalidation','evidence':'Exact approved N13 after hashes, full IR/source mapping, retained baseline diagnosis and fresh capability receipts. Two branch calculations remain independent and return to the complete solution; zero and negative distance are separate decisions. Old corpus acceptance is not transferred.'}}
(B/'evidence/CURRENT_R02_RESULT.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
r.submit(w,job['node'],job['claimToken'],result)
render(r,w,B/'generated')
print(json.dumps({'submitted':job['node'],'next':r.next(w)['task']['node']['id'],'guardsChanged':False}))
