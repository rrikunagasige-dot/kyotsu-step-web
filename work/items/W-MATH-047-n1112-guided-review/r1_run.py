"""Explicit approved R1 orchestration. Shared workflow guards are never edited."""
import sys,json,hashlib,subprocess,os,copy,base64
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
os.environ['PYTHONPATH']='/tmp/w046-sympy'+os.pathsep+os.environ.get('PYTHONPATH','')
from runtime import Runtime
from contracts import manifest
from store import digest
from adapters import apply_patch
from runner import run_code
from production import ai_request
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-047'
load=lambda p:json.loads(Path(p).read_text())
def write(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def evidence(p):return r.evidence(W,'file',{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref='R1 exact approved source-bound artifact',verification_level='local_execution')
def claim(w,n):
 s=r.state(w);return s['claims'][n]['token']if n in s['claims']else r.claim(w,n,'M',seconds=14400)['claim_token']
mode=sys.argv[1];approval=load(B/'evidence/R1_APPROVAL.json');h=approval['proposalHash']
if mode=='adapter':
 w='W-TECH-050';patch=load(B/'evidence/R1_ADAPTER_PATCH.json');paths=[f['path']for f in patch['files']]
 if not any(e['work']==w and e['kind']=='opened'for e in r.store.events()):
  p={'work_id':w,'profile':'technical','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'1f359078b429fe26f8b813a13bb270a239dd0eb5','source_manifest':manifest(R,paths),'rules':r.state(W)['plan']['rules'],'proposal':{'id':'W047/G2-R1-adapter','hash':h,'patch_hash':digest(patch)},'scope':{'paths':paths,'preserve':[]},'blocks':[{'id':'n11-quotient-display','sources':paths}],'parent_work':W};r.open(p)
 ev=r.evidence(w,'file',{'path':str((B/'G2_CORRECTION_PROPOSAL.md').relative_to(R)),'sha256':h},source_ref=approval['sourceRef'],verification_level='local_execution')
 for n in ['S00_RECOVER','S01_ROUTE']:
  if n not in r.state(w)['results']:r.execute(w,n)
 if 'T01_ANALYSIS'not in r.state(w)['results']:r.submit(w,'T01_ANALYSIS',claim(w,'T01_ANALYSIS'),{'verdict':'PASS','evidence_refs':[ev],'rule_mapping':['MASTER8/17/20; exact approved two-row relocation'],'design':['Generate quotient in S3; completed S4 only after correct answer'],'protected_scope':['Source AST and all39 grading/save contracts, original figures and other units'],'unknowns':[]})
 u='w047-r1-adapter-approval-8faa9b19'
 if u not in r.state(w)['users']:r.user(w,'approve_proposal',approval['quote'],h,approval['sourceRef'],event_id=u)
 if 'T02_APPROVAL'not in r.state(w)['results']:r.accept(w,'T02_APPROVAL',u)
 if 'T03_BUILD'not in r.state(w)['results']:
  t=claim(w,'T03_BUILD');refs=apply_patch(r,w,'T03_BUILD',t,patch);r.tool_result(w,'T03_BUILD',t,refs)
 print('Approved adapter applied through existing generic guard; current compiled app remains unchanged until R06',flush=True)
elif mode=='revise':
 s=r.state(W);p=copy.deepcopy(s['plan']);patch=load(B/'evidence/R1_DATA_PATCH.json')
 if p['proposal']['hash']!=h:
  p['scope']['paths']=list(dict.fromkeys(p['scope']['paths']+['tools/textbook/transformation/n11.mjs']))
  p['proposal']={'id':'W047/G2-R1','hash':h,'contentDesignHash':p['proposal']['contentDesignHash']}
  oldbundle=copy.deepcopy(p['approval_bundles'][0]);oldbundle.update(id='n12-p006',block_ids=['n12'])
  p['approval_bundles']=[{'id':'n11-r1','block_ids':['n11'],'proposal_hash':h,'content_hash':p['blocks'][0]['content_design_hash']},oldbundle]
  p['blocks'][0]['patch_hash']=digest(patch)
  p['design_inputs'][str((B/'G2_CORRECTION_PROPOSAL.md').relative_to(R))]=h
  p['design_inputs'][str((B/'evidence/N11_G2_CORRECTION_DRAFT_PLAN.json').relative_to(R))]=hashlib.sha256((B/'evidence/N11_G2_CORRECTION_DRAFT_PLAN.json').read_bytes()).hexdigest()
  r.revise(W,p)
 write(B/'WORKFLOW_PLAN.json',r.state(W)['plan'])
 u='w047-r1-proposal-approval-8faa9b19'
 if u not in r.state(W)['users']:r.user(W,'approve_proposal',approval['quote'],h,approval['sourceRef'],bundle_ids=['n11-r1'],event_id=u)
 print('R1 exact approval registered for N11 only; original N12 P006 approval remains historical, not reinterpreted',flush=True)
elif mode=='preflight':
 s=r.state(W);refs=[evidence(B/p)for p in ['G2_CORRECTION_PROPOSAL.md','evidence/R1_APPROVAL.json','evidence/N11_G2_B_RAW.json','evidence/N11_G2_CORRECTION_DRAFT_CHECK.json','evidence/R1_GENERATED.json']]
 ir=load(B/'N11_CANDIDATE_IR.json');old=R/'work/items/W-MATH-036-ne02-n11-n12-guided-design';source=load(old/'evidence/N11_SOURCE_INDEX.json');argument=load(old/'N11_COMPLETE_SOLUTION.json');corpus=load(R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json')
 figures=[]
 for f in load(old/'DISPLAY_SPEC.json')['figures']:
  if f['id'].startswith('n11-'):figures.append({'id':f['id'],'purpose':'元の数直線と確定条件を対応させる','howToRead':'端点と範囲を読む。未回答の結論を先出ししない','sourceRef':source['blocks'][0]['id'],'visibleWhen':f['gate'],'sourcePath':f['sourcePath'],'contentHash':hashlib.sha256(base64.b64encode((R/f['sourcePath']).read_bytes())).hexdigest()})
 teaching={'solution':[{'id':n['id'],'inputFacts':n['requires'],'outputFacts':n['produces'],'goal':n['goal'],'operation':n['operation'],'basisRefs':n['sourceRefs']}for n in ir['nodes']],'knowledge':ir['initialFacts'],'options':{'budget':1}}
 inputs={
 'R01_CAPTURE':({'source.fixed':{},'feedback.capture':{}},{'complaint':'G2 independently confirmed W038 quotient answer exposed before learner generation; R1 exact correction approved.','before_evidence':['N11_G2_A_RAW.json','N11_G2_B_RAW.json'],'reproduction':'At four predecessor interactions solved, S3 completed7/3 and S4 unfilled same quotient coexist. No new authored/grading changes.','target_versions':{'actual':'4a09de7a0f910669946466daf918ab28c820a5f2','original':s['plan']['source_sha']}}),
 'R02_CAUSE':({'case.retrieve':{'request':{'cache':'/tmp/w047-local-encoder','encoder':{'local_only':True},'query':'未回答の商が直前の完成式に露出する','cases':corpus['cases'],'scope':{'subject':'math','mode':'textbook'}}},'knowledge.ledger':{'symbols':[{'id':f,'definitionRef':'Original positioned source and acknowledged results','scope':'n11'}for f in ir['initialFacts']]},'math.solve':argument,'math.verify':argument,'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}},{'symptoms':['Unsolved quotient is already printed in a concurrently completed row'],'confirmed_causes':['S3 interaction=null and S4 share the same prerequisite gate'],'hypotheses':[],'missing_learning_actions':['Generate right quotient from the chosen divisor'],'root_cause_signatures':['UNSOLVED_QUOTIENT_REVEALED_BY_CONCURRENT_COMPLETED_ROW']}),
 'R03_IMPACT':({'impact.inventory':{}},{'impact_rows':[{'originFinding':'W047-G2-L01','rootCauseSignature':'UNSOLVED_QUOTIENT_REVEALED_BY_CONCURRENT_COMPLETED_ROW','artifact':p,'version':s['plan']['source_sha'],'approvedCreationWork':'W-MATH-036/W-MATH-038','block_id':b['id'],'evidence_refs':refs,'status':'AFFECTED'if p.endswith('n11Transformation.json')else'NOT-AFFECTED','phase':'pre-design','resolution':'N11 two-row display correction only; N12 baseline remains unchanged'}for b in s['plan']['blocks']for p in b['sources']],'source_inventory':list(s['plan']['source_manifest']),'unknowns':[]}),
 'R04_PROPOSAL':({'math.solve':argument,'math.verify':argument,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':{'nodes':ir['nodes']},'prose.compose':ir,'text.verify':ir,'figure.verify':{'figures':figures},'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}},{'before_after':['Only S3 quotient slot and S4 after-correct gate; original authored IR unchanged'],'protected_scope':s['plan']['scope']['preserve'],'patch_plan':['Exact approved plan a3f9; source adapter technical child; data uses explicit approved relocation validation'],'verification_plan':['All39/109 operations at four widths','Fresh quotient initial/wrong/correct images and reset/chapter links','Protected N12 baseline and shared surfaces'],'proposal_hash':h,'proofStatus':'AI_ARGUMENT_REVIEWED','formalProof':False})}
 for stage,(args,fields)in inputs.items():
  nid=stage+'@n11';s=r.state(W)
  if nid in s['results']and r.node_status(s,r.task(W,nid)['node'])=='PASSED':continue
  job=run_code(r,W,args);assert job['node']==nid,job['node'];q=ai_request(r,W,nid)
  result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':job['receipts'],'case_dispositions':load(B/'evidence/CASE_DISPOSITIONS.json')['cases'],'aiReview':{'requestHash':q['requestHash'],'inputHash':q['task']['input_hash'],'reviewer':'M integrating source-bound A/B diagnosis and exact approved relocation','evidence':'Source AST, unchanged authored IR and two-row operation boundary inspected. No grading/save/schema change. Technical evidence is not user quality evaluation.'},**fields}
  if 'math.solve'in args:result.update(proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False)
  if stage=='R04_PROPOSAL':write(B/'evidence/R1_R04_PENDING.json',{'job':job,'request':q,'result':result});print('R04 ready for exact source-first team review',flush=True);break
  r.submit(W,nid,job['claimToken'],result);print('Submitted '+nid,flush=True)
 render(r,W,B/'generated')
else:raise ValueError(mode)
