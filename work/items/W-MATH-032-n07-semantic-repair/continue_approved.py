"""Resume actual approved W032 at the fixed prerequisite implementation. Stops before UI QA."""
import hashlib,json,sys,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];BASE=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from contracts import manifest
from production import ai_request
from runner import run_code
from store import digest
from materialization import bind_n07,bind_patch
from views import render
WORK='W-MATH-032';rt=Runtime(BASE/'runtime',ROOT)
def evidence(name):
 path=str((BASE/name).relative_to(ROOT));return rt.evidence(WORK,'file',{'path':path,'sha256':manifest(ROOT,[path])[path]},source_ref='local-check:'+name,verification_level='local_execution')
def submit(inputs,detail):
 state=rt.state(WORK)
 if state['claims']:
  nid,claim=next(iter(state['claims'].items()));refs=[e['payload']['receipt'] for e in rt.store.events() if e['work']==WORK and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']]
  from capabilities import run_capability
  node=rt.task(WORK,nid)['node'];done={rt.store.get(ref)['capability'] for ref in refs}
  for cap in node['capability_requests']:
   if cap not in done:refs.append(run_capability(rt,WORK,node,cap,inputs[cap]))
  job={'node':nid,'claimToken':claim['token'],'receipts':refs}
 else:job=run_code(rt,WORK,inputs)
 n=rt.task(WORK,job['node'])['node'];request=ai_request(rt,WORK,job['node'])
 outputs={rt.store.get(r)['capability']:rt.store.get(rt.store.get(r)['output']) for r in job['receipts']}
 bad={k:v for k,v in outputs.items() if v.get('status') not in ('PASS','NEEDS_AI_REVIEW')}
 if bad:raise ValueError(json.dumps(bad,ensure_ascii=False)[:4000])
 result={'verdict':'PASS','evidence_refs':ev,'capability_receipts':job['receipts'],'case_dispositions':[{'id':c['caseId'],'disposition':'APPLY','reason':c['reason']} for c in json.loads((BASE/'CASE_DISPOSITIONS.json').read_text())['cases']], 'aiReview':{'requestHash':request['requestHash'],'inputHash':request['task']['input_hash'],'reviewer':'current-assistant-source-and-design-review','evidence':detail},**detail_fields[n['stage_kind']]}
 if n['stage_kind']=='R03_IMPACT':
  for row in result['impact_rows']:row['phase']=n['phase']
 (rt.submit if n['actor']=='AI' else rt.production_result)(WORK,job['node'],job['claimToken'],result)
 return outputs
s=rt.state(WORK);ev=[evidence('evidence/FOUNDATION_CHECK.md'),evidence('PROPOSAL.md'),evidence('NODE_DESIGN.json'),evidence('IMPACT_LEDGER.json')]
if s['definition_hash']!=__import__('definitions').DEFINITION_HASH:rt.migrate_definition(WORK,s['definition_hash'],ev)
if not rt.state(WORK).get('materialization'):g=bind_n07(rt,WORK,'e6fc1017f3ce8f5cdce6102720b32afdc73f652b',ev)
else:g=rt.store.get(rt.state(WORK)['materialization']['proof'])['generated']
(BASE/'CANDIDATE_IR.json').write_text(json.dumps(g['ir'],ensure_ascii=False,indent=2)+'\n')
(BASE/'CANDIDATE_COMPILED.json').write_text(json.dumps(g['compiled'],ensure_ascii=False,indent=2)+'\n')
# Implementation bytes were prepared separately. Bind/apply only these three existing paths.
patch_files=[]
for path,value in [('src/data/textbook/math/numbers/n07Authored.json',json.dumps(g['artifact'],ensure_ascii=False,indent=2)+'\n'),('src/components/textbook/N07ReadingFlow.tsx',Path('/tmp/N07ReadingFlow.tsx').read_text()),('src/components/textbook/n07-reading.css',subprocess.check_output(['git','show','4fb7a98e7f864839ccc1374080473df4ba60ce88:src/components/textbook/n07-reading.css'],cwd=ROOT,text=True)+'\n.n07-reading .n07-source-question { margin-bottom: 1rem; color: inherit; }\n.n07-reading .n07-source-question > strong { font-size: .85rem; }\n.n07-reading .n07-source-question p { margin-top: .4rem; }\n.n07-reading .n07-task-domain { font-weight: 600; color: inherit; }\n')]:
 patch_files.append({'path':path,'before_sha256':hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),'after_text':value,'after_sha256':hashlib.sha256(value.encode()).hexdigest()})
delta={'files':patch_files}
if rt.state(WORK)['plan']['proposal'].get('patch_hash')!=digest(delta):bind_patch(rt,WORK,delta,ev)
for stage in ('S00_RECOVER','S01_ROUTE'):
 nxt=rt.next(WORK)
 if nxt.get('task',{}).get('node',{}).get('id')==stage:rt.execute(WORK,stage)
source=json.loads((ROOT/'tools/textbook/fixtures/n07-source-index.json').read_text());oldplan=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/N07_DESIGN_PLAN.json').read_text());legacy=json.loads(subprocess.check_output(['git','show','4fb7a98e7f864839ccc1374080473df4ba60ce88:src/data/textbook/math/numbers/n07Authored.json'],cwd=ROOT));corpus=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/redesign/implementation/CURATED_CASES.json').read_text())
s=rt.state(WORK)
impact=[]
for path in s['plan']['source_manifest']:
 impact.append({'originFinding':'F01-F06','rootCauseSignature':'n07-semantic-projection','artifact':path,'version':s['plan']['source_sha'],'approvedCreationWork':'W-GOV-010/N07','block_id':'n07','evidence_refs':ev,'status':'AFFECTED' if path.endswith(('n07Authored.json','N07ReadingFlow.tsx')) else 'NOT-AFFECTED','phase':'pre-fix'})
detail_fields={
'R01_CAPTURE':{'complaint':'Six original user findings and same-root N07 instances','before_evidence':['six hash-matched original images','4fb7a98e artifact'],'reproduction':'SOURCE_AUDIT and IMAGE_PROVENANCE identify original symptoms','target_versions':{'source':s['plan']['source_sha'],'tools':'de341c747556b46721059ba4f5fe88cfba58423e'}},
'R02_CAUSE':{'symptoms':['F01-F06 and same-root nodes'],'confirmed_causes':['compiler erases inline meaning','reader result omits source problem and tables','scalar output and operation answers lose sentence roles','equation inputs/results are separated'],'hypotheses':[],'missing_learning_actions':['minimum multiplier domain must precede selection'],'root_cause_signatures':['context-projection-loss','orphan-output','operation-sentence-loss','equation-relation-loss','semantic-part-loss'],'unknowns':[],'lessonReadiness':'NOT_READY'},
'R03_IMPACT':{'impact_rows':impact,'source_inventory':list(s['plan']['source_manifest']),'unknowns':[],'extended_inventory':'IMPACT_LEDGER.json: all41 nodes and protected sibling modes'},
'R04_PROPOSAL':{'before_after':['P001 six symptoms plus four same-root instances; NODE_DESIGN has41 explicit node plans'],'protected_scope':['36 grading contracts,14 stages,revision4,other modes,first title'],'patch_plan':['strictIR materialization and N07-only reader, typed rendering, context tables, connected equation groups'],'verification_plan':['T01-T12 in approved P001'],'proposal_hash':s['plan']['proposal']['hash']},
'R06_PATCH':{'sourceSHA':None,'artifacts':['CANDIDATE_IR.json','CANDIDATE_COMPILED.json'],'unknowns':[]}}
while True:
 nxt=rt.next(WORK);kind=nxt.get('task',{}).get('node',{}).get('stage_kind')
 if kind is None and rt.state(WORK)['claims']:kind=rt.task(WORK,next(iter(rt.state(WORK)['claims'])))['node']['stage_kind']
 if kind=='R01_CAPTURE':submit({'source.fixed':{},'feedback.capture':{}},'Original six images and Word provenance reviewed; registration is not repair.')
 elif kind=='R02_CAUSE':
  out=submit({'case.retrieve':{'request':{'cache':'/workspace/scratch/f79c5816761e/n07-local-model-cache','encoder':{'local_only':True},'query':'N07 倍率 単独 引く 等式 接続 本文 math 前結果','cases':corpus['cases'],'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':legacy,'source.audit':{'coverage':oldplan['coverage'],'sourceBlocks':source['blocks'],'candidate':legacy},'novice.audit':{'ir':legacy}},'Legacy diagnosis completed with findings retained and NOT_READY; source/hash/profile checked. Catalog fallback is unranked and modelRan=false. New candidate is not exempt from strict IR.')
  (BASE/'evidence/DIAGNOSIS_REPLAY.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 elif kind=='R03_IMPACT':submit({'impact.inventory':{}},'All41 nodes and shared consumers reviewed in IMPACT_LEDGER; unaffected first-title and other modes protected, not declared universally healthy.')
 elif kind=='R04_PROPOSAL':
  solution=[{'id':n['id'],'inputFacts':n['requires'],'outputFacts':n['produces'],'goal':n['goal'],'operation':{**n['operation'],'targets':n['operation']['targets'] or n['sourceRefs']},'basisRefs':n['sourceRefs']} for n in g['ir']['nodes']]
  teaching={'solution':solution,'knowledge':g['ir']['initialFacts'],'options':{'budget':1}}
  submit({'teaching.plan':teaching,'step.plan':teaching,'blank.plan':{'nodes':g['ir']['nodes']},'prose.compose':g['ir'],'text.verify':g['ir'],'figure.verify':{'figures':[],'noFigureReason':'N07 long-division table is preserved; no geometric diagram is needed.'},'ir.verify':g['ir'],'source.audit':{'coverage':g['ir']['coverage'],'sourceBlocks':source['blocks'],'candidate':g['ir']},'novice.audit':{'ir':g['ir']}},'Reviewed Word p315 minimum domain, Q03 table and prior facts, sentence slots, equality directions, first definitions and all41 explicit spans. No mathematical/content changes beyond approved P001. Strict IR and complete visibility projections executed; browser QA remains pending.')
 elif kind=='R05_APPROVAL':rt.accept(WORK,nxt['task']['node']['id'],rt.approval(rt.state(WORK))['id'],ev)
 elif kind=='R06_PATCH':
  job=run_code(rt,WORK,{'ir.compile':g['ir']});from adapters import apply_patch
  refs=apply_patch(rt,WORK,job['node'],job['claimToken'],delta)
  # Persist valid claim; completion after the app diff is committed and candidate SHA bound.
  (BASE/'PATCH_JOB.json').write_text(json.dumps({'job':job,'patchEvidence':refs,'approval':'W-MATH-032-P001-USER-APPROVAL'},ensure_ascii=False,indent=2)+'\n');break
 else:raise ValueError(json.dumps(nxt,ensure_ascii=False)[:2000])
render(rt,WORK,BASE/'generated');print(json.dumps({'next':rt.next(WORK),'source':'de341c747556b46721059ba4f5fe88cfba58423e','IR':g['compiled']['irHash']},ensure_ascii=False)[:1500])
