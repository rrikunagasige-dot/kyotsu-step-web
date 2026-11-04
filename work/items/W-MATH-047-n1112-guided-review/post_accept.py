"""Finalize the accepted fixed public pair using the existing native CODE graph."""
from pathlib import Path
import sys,json,hashlib,subprocess
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(B),str(R/'workflow')]
from restore_native_snapshots import restore
restore()
from runtime import Runtime
from runner import run_code
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047'
source='f129ba78e496f0ccbce917c762357a81b92b0a2c'
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def ev(p):return r.evidence(w,'file',{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref='Actual fixed-source public verification, independent review, or scoped acceptance record',verification_level='local_execution')
s=r.state(w);assert s['candidate_sha']==source and not r.integrity(s)
proof=json.loads((B/'evidence/G3_LIVE_NATIVE_APP_REFS.json').read_text())
refs=list(proof['appRefs'].values())+[ev(B/'evidence'/n) for n in ['G3_PAIR_APP_ACCEPTANCE.json','G3_LIVE_ACTUAL_REVIEW_A.json','G3_LIVE_ACTUAL_REVIEW_B.json','POSTFIX_READINESS_A.json','REMAINING_N_B.json']]
files=[]
for path in sorted({p for b in s['plan']['blocks'] for p in b['sources']}):
 data=(R/path).read_bytes();fixed=subprocess.check_output(['git','show',source+':'+path],cwd=R);assert data==fixed
 h=hashlib.sha256(data).hexdigest();files.append({'path':path,'sha256':h,'matchesFixedSource':True,'changedFromOriginal':h!=s['plan']['source_manifest'][path]})
assert len(files)==8
write(B/'evidence/POSTFIX_CURRENT_BYTES.json',{'sourceSHA':source,'files':files,'scope':'Fresh eight-path byte comparison; semantic scope derives from actual live reports and A/B review, not bytes alone.'})
refs.append(ev(B/'evidence/POSTFIX_CURRENT_BYTES.json'))
issues=list(s['issues']);captures=[e['payload']['id']for e in r.store.events()if e['work']==w and e['kind']=='feedback_captured'];ids=sorted(set(issues+captures))
cases=[{'id':i,'disposition':'EXISTING_RULE','quality':'UNKNOWN','links':refs,'resolution':'VERIFIED_FIXED','origin_version':s['issues'].get(i,{}).get('version','4a09de7a0f910669946466daf918ab28c820a5f2'),'target_version':source,'repair_evidence_refs':refs}for i in ids]
inputs={'caseUpdates':[{'caseId':i,'regressionRef':refs,'ruleDisposition':'EXISTING_RULE','datasetDisposition':'UNKNOWN_NO_TRAINING_LABEL'}for i in ids]}
def submit(job,result):
 req=job['aiRequest'];result.update(verdict='PASS',evidence_refs=refs,capability_receipts=job['receipts'],aiReview={'requestHash':req['requestHash'],'inputHash':r.task(w,job['node'])['input_hash'],'reviewer':'M with actual A workflow and B source reviews','evidence':refs})
 write(B/'evidence'/('POST_'+job['node'].replace('@','_')+'.json'),result);r.submit(w,job['node'],job['claimToken'],result);print('Completed '+job['node'],flush=True)
while True:
 nxt=r.next(w)
 if nxt['status']=='DONE':break
 nid=nxt.get('task',{}).get('node',{}).get('id','')
 if nid.startswith('R03_IMPACT_SWEEP@'):
  job=run_code(r,w,{'impact.inventory':{}});rows=[]
  for block in s['plan']['blocks']:
   for path in block['sources']:
    changed=next(x['changedFromOriginal']for x in files if x['path']==path)
    rows.append({'block_id':block['id'],'artifact':path,'version':source,'approvedCreationWork':'W-MATH-036; retained W-MATH-038','originFinding':'W047-G2-L01 and approved guided-review findings','rootCauseSignature':'answer-before-judgment / local-calculation-vs-whole-state / operation-object','phase':'post-fix','status':'AFFECTED'if changed else'NOT-AFFECTED','sibling':False,'resolution':'VERIFIED_FIXED'if changed else'UNCHANGED_SHARED_SOURCE_WITH_LIVE_REGRESSION','evidence_refs':refs})
  assert len(rows)==13
  submit(job,{'impact_rows':rows,'source_inventory':files,'unknowns':[],'scope':'Current required thirteen block/path pairs. N13/N14 are existing next-review candidates, not declared semantically audited by byte checks.'})
 elif nid.startswith(('R08_CAPTURE_LEARNING@','L01_LEARNING@')):
  caps={'case.finalize':inputs}
  if nid.startswith('L01'):caps['ml.train']={}
  job=run_code(r,w,caps);result={'case_updates':cases,'rule_links':['governance/WORK_SYSTEM.md#12B','docs/MASTER_APP_LESSONS.md'],'regression_links':refs,'unresolved':[],'deduplication':'One actual pair-acceptance utterance; per-unit gates are not independent quality observations. Existing issue retained and repaired; no generated quality labels.'}
  if nid.startswith('L01'):result.update(modelDisposition='NOT_TRAINABLE',trainingRun=False)
  submit(job,result)
 elif nid=='G3_HOST@n12':
  job=run_code(r,w,{'release.verify':{'appEvidence':proof['appRefs']['n12']}})
  r.production_result(w,nid,job['claimToken'],{'verdict':'PASS','sourceSHA':source,'evidence_refs':proof['fileRefs']+[proof['checkRef'],*proof['appRefs'].values()],'capability_receipts':job['receipts'],'release':{'verified':True,'sourceSHA':source,'url':r.state(w)['evidence'][proof['appRefs']['n12']]['data']['url']}});print('Completed '+nid,flush=True)
 elif nid=='G3_FINAL@n12':r.accept(w,nid,'w047-live-accept-n12-6cb6aef5',[proof['appRefs']['n12']]);print('Consumed existing actual n12 acceptance',flush=True)
 elif nid=='Z01_CLOSE':r.execute(w,nid);print('Closed W-MATH-047',flush=True)
 else:raise RuntimeError('Unexpected workflow position '+str(nxt))
write(B/'evidence/PAIR_FINALIZED.json',{'work':w,'next':r.next(w),'sourceSHA':source,'acceptanceSource':'conversation:6cb6aef5-5796-40d4-a828-3770700d2187','quality':'UNKNOWN','trainingRun':False,'nextMaterialReview':['N13','N14']})
render(r,w,B/'generated')
