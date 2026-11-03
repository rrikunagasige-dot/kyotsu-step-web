"""Meaningful adversarial checks of the explicit migration and the old guard."""
import json,sys,tempfile,hashlib,copy,shutil,time,os
from unittest.mock import patch as mock_patch
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from contracts import Rejected,manifest
from adapters import apply_patch
from store import digest
from r1_relocation import validate,apply as apply_relocation,PATH,SLOT
from definitions import instantiate
before=json.loads((R/PATH).read_text());after=json.loads((B/'evidence/R1_COMPILED.json').read_text());patch=json.loads((B/'evidence/R1_DATA_PATCH.json').read_text())
checks=[];validate(before,after,after);checks.append('Approved exact relocation accepted')
def reject(label,change):
 bad=copy.deepcopy(after);change(bad)
 try:validate(before,bad,bad)
 except Rejected:checks.append(label+' rejected')
 else:raise AssertionError(label)
reject('Added display ID',lambda v:v['groups'][0]['rows'].append({'id':'unauthorized'}))
reject('Other row ID reordered',lambda v:v['groups'][0]['rows'].__setitem__(slice(0,2),list(reversed(v['groups'][0]['rows'][:2]))))
reject('Early completed range gate',lambda v:v['groups'][0]['rows'][-1]['visibleAfter'].pop())
reject('Extra slot occurrence',lambda v:v['groups'][0]['rows'][-1]['slots'].append({'id':SLOT,'interactionRef':'n11-06','path':'right'}))
reject('Changed grading answer',lambda v:v['interactions'][-1].__setitem__('correctValue','3'))
reject('Changed numeric alias',lambda v:v['numberAliases'].__setitem__('n11-06-equation','n11-tg-divide'))
reject('Changed earlier teaching row',lambda v:v['groups'][0]['rows'][0].__setitem__('before',[]))
rejection=None
with tempfile.TemporaryDirectory()as td:
 root=Path(td);p=root/PATH;p.parent.mkdir(parents=True);p.write_bytes((R/PATH).read_bytes());(root/'rule.txt').write_text('Exact slot relocation guard test')
 rt=Runtime(root/'store',root);w='R1-GENERIC-GUARD-TEST';h='a'*64
 rt.open({'work_id':w,'profile':'technical','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'1f359078b429fe26f8b813a13bb270a239dd0eb5','source_manifest':manifest(root,[PATH]),'rules':manifest(root,['rule.txt']),'proposal':{'id':'fixture for real guard rejection','hash':h,'patch_hash':digest(patch)},'scope':{'paths':[PATH],'preserve':[]},'blocks':[{'id':'display','sources':[PATH]}],'simulation':True})
 for n in ['S00_RECOVER','S01_ROUTE']:rt.execute(w,n)
 ev=rt.evidence(w,'file',{'path':PATH,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref='Real copied artifact for guard regression',verification_level='simulation')
 t=rt.claim(w,'T01_ANALYSIS','test',seconds=3600)['claim_token'];rt.submit(w,'T01_ANALYSIS',t,{'verdict':'PASS','evidence_refs':[ev],'rule_mapping':['Test fixture only'],'design':['Assert unchanged generic adapter rejects relocation'],'protected_scope':['No production writes'],'unknowns':[]})
 u=rt.user(w,'approve_proposal','fixture approval, never a real user','a'*64,'fixture',verification_level='simulation');rt.accept(w,'T02_APPROVAL',u);t=rt.claim(w,'T03_BUILD','test',seconds=3600)['claim_token'];original=p.read_bytes()
 try:apply_patch(rt,w,'T03_BUILD',t,patch)
 except Rejected as exc:rejection=str(exc)
 else:raise AssertionError('Generic guard was weakened')
 assert p.read_bytes()==original
 assert not any(e['kind']in ['patch_intent','patch_applied']for e in rt.store.events())
assert rejection=='安定ID・順序の変更には移行を含む別の具体案が必要',rejection
checks.extend(['Unchanged generic guard rejects original approved relocation','Rejected generic patch writes neither file nor patch events'])
doc={'status':'PASS','negativeTests':'PASS','genericRejection':rejection,'genericAdapterHash':hashlib.sha256((R/'workflow/adapters.py').read_bytes()).hexdigest(),'approvedPlanHash':'a3f9b71b1c7776f4d86dcebd970d7874b095218bc92cb7b40fee97b7f6231282','checks':checks,'fixtureScope':'Isolated temp Runtime; simulated approval never registered in real Work'}
(B/'evidence/R1_RELOCATION_CONTRACT.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n');print(json.dumps(doc,ensure_ascii=False))

# Run the actual specialized transaction on isolated files and a real Runtime.
# Only the ready R06 fixture claim is seeded directly; this is not real Work evidence.
os.environ['PYTHONPATH']='/tmp/w046-sympy'
with tempfile.TemporaryDirectory()as td:
 root=Path(td)
 for folder in ['tools/textbook','src']:
  shutil.copytree(R/folder,root/folder)
 (root/'node_modules').symlink_to(R/'node_modules',target_is_directory=True)
 (root/'workflow').mkdir();shutil.copyfile(R/'workflow/adapters.py',root/'workflow/adapters.py')
 real=json.loads((B/'WORKFLOW_PLAN.json').read_text());real['work_id']='W-MATH-047';real['simulation']=True
 for p in set(real['source_manifest'])|set(real['rules'])|set(real['protected_manifest']):
  dest=root/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(R/p,dest)
 real['source_manifest']=manifest(root,real['source_manifest']);real['proposal']['hash']=json.loads((B/'evidence/R1_APPROVAL.json').read_text())['proposalHash']
 real['blocks'][0]['patch_hash']=digest(patch);real['approval_bundles'][0]['proposal_hash']=real['proposal']['hash']
 from integration import bundle_fingerprint
 def fixture(name):
  (root/PATH).write_bytes((R/PATH).read_bytes())
  rt=Runtime(root/('store-'+name),root);rt.open(real)
  # Explicit simulated approval in this disposable fixture only.
  rt.user('W-MATH-047','approve_proposal','いいよ続けて',real['proposal']['hash'],'conversation:8faa9b19-dca3-4a04-930b-14666afe5f57',verification_level='simulation')
  node=instantiate(rt.state('W-MATH-047')['plan'])['R06_PATCH@n11'];token=hashlib.sha256(('isolated-fixture-'+name).encode()).hexdigest()
  rt.append('claimed','W-MATH-047',{'node':node['id'],'actor':'fixture','token':token,'expires_at':time.time()+3600,'input_hash':rt.input_hash(rt.state('W-MATH-047'),node)})
  return rt,token
 def no_intent(label,setup,mutation=lambda p:p):
  rt,t=fixture(label);setup(rt);original=(root/PATH).read_bytes()
  try:apply_relocation(rt,'W-MATH-047','R06_PATCH@n11',t,mutation(copy.deepcopy(patch)))
  except (Rejected,KeyError):pass
  else:raise AssertionError(label)
  assert (root/PATH).read_bytes()==original
  assert not any(e['kind']in ['patch_intent','patch_applied']for e in rt.store.events())
  checks.append('Specialized apply '+label+' rejected before intent/write')
 no_intent('bad-token',lambda rt:rt.append('claim_reconciled','W-MATH-047',{'node':'R06_PATCH@n11','outcome':'FAILED'}))
 no_intent('wrong-patch',lambda rt:None,lambda p:{'files':[]})
 def bad_before(rt):(root/PATH).write_text((root/PATH).read_text()+' ')
 no_intent('stale-before',bad_before)
 def bad_approval(rt):rt.append('user','W-MATH-047',{'id':'invalid-fixture','intent':'approve_proposal','quote':'wrong','reply_to':'wrong','source_ref':'fixture','proposal_hash':real['proposal']['hash'],'scope':real['scope'],'candidate_sha':real['source_sha'],'approved_bundles':{b['id']:bundle_fingerprint(rt.state('W-MATH-047'),b)for b in real['approval_bundles']}})
 no_intent('wrong-approval',bad_approval)
 rt,t=fixture('success');ev=apply_relocation(rt,'W-MATH-047','R06_PATCH@n11',t,patch);assert json.loads((root/PATH).read_text())==after
 kinds=[e['kind']for e in rt.store.events()];assert kinds.index('patch_intent')<kinds.index('patch_applied');assert ev
 checks.append('Specialized apply success uses real Runtime backup/intent/replace/applied and exact bytes')
 # Deliberate filesystem failure after intent. Existing reconciliation can identify no write.
 rt,t=fixture('replace-failure')
 replace_original=os.replace
 def interrupted_replace(src,dest):
  if Path(dest)==root/PATH:raise OSError('fixture interrupted before replace')
  return replace_original(src,dest)
 with mock_patch('r1_relocation.os.replace',side_effect=interrupted_replace):
  try:apply_relocation(rt,'W-MATH-047','R06_PATCH@n11',t,patch)
  except OSError:pass
  else:raise AssertionError('Expected interrupted replace')
 assert json.loads((root/PATH).read_text())==before
 pending=[(k,v)for k,v in rt.state('W-MATH-047')['patches'].items()if not v.get('completed')];assert len(pending)==1
 from adapters import reconcile_patch
 # Reconciliation sees the original byte hash and records NOT_APPLIED through existing code.
 ev=rt.evidence('W-MATH-047','file',{'path':PATH,'sha256':hashlib.sha256((root/PATH).read_bytes()).hexdigest()},source_ref='Interrupted fixture exact before bytes',verification_level='simulation')
 reconciled=reconcile_patch(rt,'W-MATH-047',pending[0][0],'RESTORE_BEFORE',[ev]);checks.append('Interrupted pre-replace transaction restored through existing adapter')
 rt,t=fixture('after-replace');append_original=rt.append
 def interrupted_append(kind,*args,**kwargs):
  if kind=='patch_applied':raise OSError('fixture interrupted after replace')
  return append_original(kind,*args,**kwargs)
 with mock_patch.object(rt,'append',side_effect=interrupted_append):
  try:apply_relocation(rt,'W-MATH-047','R06_PATCH@n11',t,patch)
  except OSError:pass
  else:raise AssertionError('Expected interrupted completion event')
 assert json.loads((root/PATH).read_text())==after
 pending=[(k,v)for k,v in rt.state('W-MATH-047')['patches'].items()if not v.get('completed')];assert len(pending)==1
 ev=rt.evidence('W-MATH-047','file',{'path':PATH,'sha256':hashlib.sha256((root/PATH).read_bytes()).hexdigest()},source_ref='Interrupted fixture exact after bytes',verification_level='simulation')
 reconcile_patch(rt,'W-MATH-047',pending[0][0],'RECORD_COMPLETED',[ev]);checks.append('Interrupted post-replace transaction completed through existing adapter')
doc['checks']=checks;doc['specializedApplyExecuted']=True;doc['fixtureScope']='Isolated real Runtime and copied source trees; simulated approvals and seeded R06 fixture claim never enter real Work'
(B/'evidence/R1_RELOCATION_CONTRACT.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':'PASS','checks':len(checks),'specializedApplyExecuted':True}))
