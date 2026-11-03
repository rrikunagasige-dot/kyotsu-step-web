"""Approved T1 technical child: native immutable scope and patch guard."""
import sys,json,hashlib,subprocess,os
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from contracts import manifest
from store import digest
from adapters import apply_patch
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-TECH-048'
patch=json.loads((B/'proposed-tooling/PATCH.json').read_text());paths=[x['path'] for x in patch['files']]
proposal=B/'TECHNICAL_SCOPE_ADDENDUM.md';h=hashlib.sha256(proposal.read_bytes()).hexdigest()
plan=dict(work_id=w,profile='technical',command='CMD-WORK-001',subject='math',mode='textbook',source_sha='929f3c5677758b55bcc583b84a6166b92a600f10',rules=rt.state('W-MATH-047')['plan']['rules'],proposal={'id':'P-W047-06/T1','hash':h,'patch_hash':digest(patch)},scope={'paths':paths,'preserve':[]},blocks=[{'id':'n11-exact-bridge','sources':paths}],source_manifest=manifest(R,paths),parent_work='W-MATH-047')
if not any(e['work']==w and e['kind']=='opened' for e in rt.store.events()):rt.open(plan)
def claim(n):
 s=rt.state(w)
 return s['claims'][n]['token'] if n in s['claims'] else rt.claim(w,n,'M',seconds=3600)['claim_token']
ev=rt.evidence(w,'file',{'path':str(proposal.relative_to(R)),'sha256':h},source_ref='Approved T1 exact scope: conversation 49c00293-fb93-4f5a-ba16-cb3f566654d5',verification_level='local_execution')
for n in ['S00_RECOVER','S01_ROUTE']:
 if n not in rt.state(w)['results']:rt.execute(w,n)
token=claim('T01_ANALYSIS')
rt.submit(w,'T01_ANALYSIS',token,dict(verdict='PASS',evidence_refs=[ev],rule_mapping=['Keep old exact source/graph pin and unknown-source rejection'],design=['Exact new source to same graph set; no learner change'],protected_scope=['All 85 answer contracts, W038 groups/slots/numbers, existing source pin'],unknowns=[]))
u=rt.user(w,'approve_proposal','いいよ続けて',h,'conversation:49c00293-fb93-4f5a-ba16-cb3f566654d5',event_id='w047-t1-user-approval-49c00293')
rt.accept(w,'T02_APPROVAL',u)
token=claim('T03_BUILD');applied=apply_patch(rt,w,'T03_BUILD',token,patch);rt.tool_result(w,'T03_BUILD',token,applied)
# Same seven-case script now reads the actually applied two files as its starting copy.
env=dict(os.environ,PYTHONPATH='/tmp/w046-sympy'+os.pathsep+os.environ.get('PYTHONPATH',''))
p=subprocess.run(['node',str(B/'check_bridge.mjs')],cwd=R,env=env,capture_output=True,text=True)
(B/'evidence/APPLIED_BRIDGE_CHECK.log').write_text(p.stdout+p.stderr);assert p.returncode==0,p.stderr
check=rt.evidence(w,'check',{'status':'PASS','source_sha':rt.state(w)['candidate_sha'],'checks':['Actual applied bytes equal T1 patch','Old and P006 exact sources accepted','Unknown source rejected','Graph modified/missing/additional/duplicate rejected','W038 groups/interactions/grading/numbers/scope unchanged']},source_ref=str((B/'evidence/APPLIED_BRIDGE_CHECK.log').relative_to(R)),verification_level='local_execution')
token=claim('T04_VERIFY');rt.tool_result(w,'T04_VERIFY',token,[check])
token=claim('L01_LEARNING');rt.submit(w,'L01_LEARNING',token,dict(verdict='PASS',evidence_refs=[check],case_updates=[],rule_links=['Exact source/AST mapping remains bounded'],regression_links=['check_bridge.mjs seven cases'],unresolved=[],deduplication='Existing exact bridge extended; no quality/training label'))
rt.execute(w,'Z01_CLOSE');render(rt,w,B/'technical-generated')
(B/'evidence/T1_APPLIED.json').write_text(json.dumps(dict(work=w,userEvent=u,patchHash=digest(patch),checks=check,files=manifest(R,paths),closed=bool(rt.state(w)['closed'])),ensure_ascii=False,indent=2)+'\n')
print('T1 child completed with exact approved scope',flush=True)
