"""W047 input adapter for the existing Runtime. Never supplies USER approvals."""
import os,sys,json,hashlib,base64
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from capabilities import run_capability
from production import ai_request
from contracts import manifest
from store import digest
from views import render
os.environ['PYTHONPATH']='/tmp/w046-sympy'+os.pathsep+os.environ.get('PYTHONPATH','')
W='W-MATH-047';rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R)
def load(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
old=R/'work/items/W-MATH-036-ne02-n11-n12-guided-design';corpus=load(R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json')
if not rt.state(W).get('production_context'):rt.production_context(W,dict(corpusHash=corpus['hash'],modelHash=load(R/'work/items/W-MATH-035-choice-order-factor-audit/MODEL_RESULT_CORRECTED.json')['modelHash'],rulesHash=digest(rt.state(W)['plan']['rules']),featureSchema='learner-visible-json/2'))
dispositions=[dict(id=c['id'],dimension=c['dimension'],disposition='APPLY',reason='今回の96nodeを原問・意味境界・操作対象・既認定結果・保存と照合。元事例の数値や品質ラベルは今回へ転記しない。')for c in corpus['cases']]
write(B/'evidence/CASE_DISPOSITIONS.json',dict(corpusHash=corpus['hash'],ranked=False,modelRan=False,cases=dispositions))
ev=[]
for path in ['PROPOSAL.md','N11_AUDIT_A.json','N12_AUDIT_B.json','N11_CANDIDATE_IR.json','N12_CANDIDATE_IR.json','evidence/CODE_CHECKS.json','evidence/CURRENT_MATERIALIZER.json']:
 rel=str((B/path).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=rel,sha256=manifest(R,[rel])[rel]),source_ref='W047 actual source audit / inactive candidate / existing CODE output',verification_level='local_execution'))
write(B/'evidence/REVIEW_EVIDENCE_REFS.json',ev)
for code in os.environ.get('W047_REVIEW_CODES','n11,n12').split(','):
 baseline=load(old/(code.upper()+'_IR.json'));candidate=load(B/(code.upper()+'_CANDIDATE_IR.json'));source=load(old/('evidence/'+code.upper()+'_SOURCE_INDEX.json'));argument=load(old/(code.upper()+'_COMPLETE_SOLUTION.json'))
 s=rt.state(W);inventory=list(s['plan']['source_manifest']);impact=[dict(originFinding='W047 source audit of current N11/N12',rootCauseSignature='answer-before-judgment / local-calculation-vs-whole-state / operation-object',artifact=p,version=s['plan']['source_sha'],approvedCreationWork='W-MATH-036; N11 active W-MATH-038 retained',block_id=owner['id'],evidence_refs=ev,status='AFFECTED' if p.endswith(owner['id']+'Authored.json') else 'NOT-AFFECTED',phase='pre-design',resolution='Limited eleven-node candidate; original contracts and shared consumers retained')for owner in s['plan']['blocks'] for p in owner['sources']]
 teaching=dict(solution=[dict(id=n['id'],inputFacts=n['requires'],outputFacts=n['produces'],goal=n['goal'],operation=n['operation'],basisRefs=n['sourceRefs'])for n in candidate['nodes']],knowledge=candidate['initialFacts'],options=dict(budget=1))
 figures=[]
 for f in load(old/'DISPLAY_SPEC.json')['figures']:
  if f['id'].startswith(code+'-'):figures.append(dict(id=f['id'],purpose='元の数直線と確定した条件を対応させる',howToRead='端点と範囲を読む。未回答の結論を先出ししない',sourceRef=source['blocks'][0]['id'],visibleWhen=f['gate'],sourcePath=f['sourcePath'],contentHash=hashlib.sha256(base64.b64encode((R/f['sourcePath']).read_bytes())).hexdigest()))
 jobs=[('R01_CAPTURE',{'source.fixed':{},'feedback.capture':{}},dict(complaint='本人のN11/N12次単元着手・工程順守の依頼。AIの発見を本人の否定評価としない。',before_evidence=[str((old/('evidence/'+code.upper()+'_SOURCE_INDEX.json')).relative_to(R)),str((B/(code.upper()+'_AUDIT_'+('A'if code=='n11'else'B')+'.json')).relative_to(R))],reproduction='現Authoredのbefore/after全件、原Word位置付き抽出、旧承認、N11 active overlayを照合。Word再renderや候補実装を主張しない。',target_versions=dict(source=s['plan']['source_sha'],n11Revision=11,n12Revision=4))),
 ('R02_CAUSE',{'case.retrieve':{'request':dict(cache='/tmp/w047-local-encoder',encoder=dict(local_only=True),query='判断の先代行と局所計算から元式への復帰',cases=corpus['cases'],scope=dict(subject='math',mode='textbook'))},'knowledge.ledger':{'symbols':[dict(id=f,definitionRef='原資料/既承認単元の条件と既認定結果',scope=code)for f in baseline['initialFacts']]},'math.solve':argument,'math.verify':argument,'ir.verify':baseline,'source.audit':dict(coverage=baseline['coverage'],sourceBlocks=source['blocks'],candidate=baseline),'novice.audit':dict(ir=baseline)},dict(symptoms=['本文が今回の境界/符号/共通部分を回答前に説明する箇所','局所計算の足場で次の合成結果まで表示する箇所'],confirmed_causes=['条件・操作説明と判断結果の表示境界が一部で混在','原問の局所計算と本体再構成の役割が重複'],hypotheses=[],missing_learning_actions=['未約分の商から境界を得る','二つの上限から共通範囲を得る'],root_cause_signatures=['answer-before-judgment','local-vs-whole-state'])),
 ('R03_IMPACT',{'impact.inventory':{}},dict(impact_rows=impact,source_inventory=inventory,unknowns=[])),
 ('R04_PROPOSAL',{'math.solve':argument,'math.verify':argument,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':dict(nodes=candidate['nodes']),'prose.compose':candidate,'text.verify':candidate,'figure.verify':dict(figures=figures),'ir.verify':candidate,'source.audit':dict(coverage=candidate['coverage'],sourceBlocks=source['blocks'],candidate=candidate),'novice.audit':dict(ir=candidate)},dict(before_after=['N11 41KEEP/6CHANGE; N12 44KEEP/5CHANGE (q13 optional adopted)','85 IDs/answers/choices/dependencies unchanged'],protected_scope=s['plan']['scope']['preserve'],patch_plan=['Only eleven node copies/operation scaffolds','Use existing compile and preserve current postprocessing/overlay','No renderer/schema/namespace replacement'],verification_plan=['Existing compile/coverage/snapshots and proposal audits','After approval: four widths/initial-partial-completed/85 answers and allwrong','Preserve saved/archive histories, N09/N10 and five original diagrams'],proposal_hash=next(a['proposal_hash'] for a in s['plan']['approval_bundles'] if code in a['block_ids']),proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False))]
 for kind,inputs,fields in jobs:
  nid=kind+'@'+code;state=rt.state(W)
  if nid in state['results'] and rt.node_status(state,rt.task(W,nid)['node'])=='PASSED':continue
  if nid in state['claims']:
   claim=state['claims'][nid];node=rt.task(W,nid)['node'];refs=[]
   for cap in node['capability_requests']:
    matches=[e['payload']['receipt']for e in rt.store.events()if e['work']==W and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash'] and rt.store.get(e['payload']['receipt'])['capability']==cap]
    refs.append(matches[-1]if matches else run_capability(rt,W,node,cap,inputs[cap]))
   job=dict(node=nid,claimToken=claim['token'],receipts=refs)
  else:job=run_code(rt,W,inputs)
  assert job['node']==nid
  outputs={rt.store.get(r)['capability']:rt.store.get(rt.store.get(r)['output'])for r in job['receipts']}
  write(B/('evidence/'+code+'-'+kind+'-CODE.json'),{k:dict(status=v.get('status'),retrievalMode=v.get('retrievalMode'),modelRan=v.get('modelRan'))for k,v in outputs.items()})
  assert all(v['status']in('PASS','NEEDS_AI_REVIEW')for v in outputs.values()),outputs
  req=ai_request(rt,W,nid)
  if kind=='R03_IMPACT':
   for row in fields['impact_rows']:row['phase']=req['task']['node']['phase']
  result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=dispositions,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='M integrating actual A/B source reports',evidence='Read all96-node reports and current source. Input conditional results vs current decisions distinguished; no forced hole expansion. Exact source/candidate/operation objects checked. Original questions and all grading preserved. CODE cannot certify prose meaning. Source ZIP and candidate rendered UI are not claimed.'),**fields)
  if 'math.solve'in inputs:result.update(proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False)
  if kind=='R04_PROPOSAL':
   write(B/('evidence/'+code+'-R04_PENDING_TEAM.json'),dict(job=job,result=result,inputHash=req['task']['input_hash']))
   render(rt,W,B/'generated');print('R04 CODE ready for actual nonauthor team collection',code,flush=True);sys.exit(0)
  rt.submit(W,nid,job['claimToken'],result);print('SUBMITTED',nid,flush=True)
render(rt,W,B/'generated')
