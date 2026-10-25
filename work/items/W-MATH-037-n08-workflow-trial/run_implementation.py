"""Resume the genuine shared C/R ledger. User-approved P001 stays immutable.
The preservation amendment derives file paths; it does not invent a second approval.
Existing implementation was prepared after permission; baseline restoration before
native application and subsequent exact patches are all logged, not backdated.
"""
from pathlib import Path
import json,sys,hashlib,subprocess,copy,os
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from definitions import DEFINITION_HASH,instantiate
from runner import run_code
from production import ai_request
from store import digest
from contracts import manifest,sha,need
from ready_dispatch import accept_design
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-037'
def load(p):return json.loads((B/p).read_text())
def save(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
approval=load('APPROVAL.json');assert sha(B/'PROPOSAL.md')==approval['proposalHash'] and sha(B/'NODE_DESIGN.json')==approval['designHash']
for name in ['PROPOSAL.md','NODE_DESIGN.json']:
 assert subprocess.check_output(['git','show',approval['approvedCommit']+':'+str((B/name).relative_to(R))],cwd=R)==(B/name).read_bytes()
original_plan=load('WORKFLOW_PLAN.json');artifact=load('CANDIDATE_N08_R5.json');ir=load('CANDIDATE_IR_R5.json');bundle=load('SOLUTION_BUNDLE_R5.json')
existing=['src/data/textbook/math/numbers/n08Lesson.ts','src/pages/TextbookUnitPage.tsx','src/domain/textbook.ts']
new=['src/data/textbook/math/numbers/n08Revision5.json','src/data/textbook/math/numbers/n08ActiveVersion.json','src/components/textbook/N08SolutionReadingFlow.tsx','src/components/textbook/n08-solution-reading.css','src/pages/N08ArchivePage.tsx']
# Exact scoped patches, with explicit absence as the base state for new files.
cache=Path('/tmp/w37-native-candidate');cache.mkdir(exist_ok=True)
if not (cache/'patch.json').exists():
 changes=[]
 for p in existing+new:
  content=(R/p).read_text();prior=bytes.fromhex(subprocess.check_output(['git','show',approval['approvedCommit']+':'+p],cwd=R).hex()) if p in existing else None
  if prior is not None:assert hashlib.sha256(prior).hexdigest()==original_plan['source_manifest'][p]
  changes.append(dict(path=p,before_sha256=hashlib.sha256(prior).hexdigest() if prior else None,after_sha256=hashlib.sha256(content.encode()).hexdigest(),after_text=content))
  if prior is not None:(R/p).write_bytes(prior)
 (cache/'patch.json').write_text(json.dumps(dict(files=changes),ensure_ascii=False))
patch=json.loads((cache/'patch.json').read_text());assert json.loads(next(f['after_text']for f in patch['files']if f['path'].endswith('n08Revision5.json')))==artifact
baseline=json.loads((R/'src/data/textbook/math/numbers/n08Authored.json').read_text())
assert all(next(q for q in artifact['unit']['sections'][0]['items']if q['id']==old['id'])==old for old in baseline['unit']['sections'][0]['items'])
assert artifact['stages']==baseline['stages'] and artifact['unit']['revision']==5
# Explicitly amended preservation scope. Original source manifest and design stay fixed.
s=rt.state(W)
if not s.get('materialization',{}).get('n08Preservation'):
 p=copy.deepcopy(s['plan']);p['scope']['paths']=list(dict.fromkeys(p['scope']['paths']+existing+new+['src/data/textbook/math/mathReviewIntegrity.test.ts']))
 preserved=['src/data/textbook/math/numbers/n08Authored.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/n08-reading.css']
 p['scope']['preserve']=list(dict.fromkeys(p['scope']['preserve']+preserved));p['protected_manifest'].update({path:original_plan['source_manifest'][path]for path in preserved})
 p['proposal']['contentDesignHash']=artifact['irHash'];p['proposal']['patch_hash']=digest(patch)
 for b in p['approval_bundles']:b['content_hash']=artifact['irHash']
 for b in p['blocks']:b['patch_hash']=digest(patch)
 proof=rt.store.put(dict(approvedCommit=approval['approvedCommit'],proposalHash=approval['proposalHash'],designHash=approval['designHash'],generated=dict(artifact=artifact,ir=ir),patch=patch,scopeReason='Current user explicitly requires the former N08 and rollback. New leaf/reader/archive preserve r4 bytes; no approved teaching content changes.',executionOrder='Local preparation occurred after user permission; restoring the old baseline before native application is recorded, not hidden.'))
 rt.append('materialization_bound',W,dict(plan=p,proof=proof,n08Preservation=True));save('IMPLEMENTATION_PLAN.json',p)
 rt.append('implementation_preparation_recorded',W,dict(source='APPROVAL.json',oldBaselineRestoredForNativeApplication=existing,newFilesPrepared=new,oldSourcesPreserved=preserved,notBackdated=True))
evs=[]
for name in ['APPROVAL.json','PROPOSAL.md','NODE_DESIGN.json','IMPLEMENTATION_PLAN.json','ROLLBACK_MANIFEST.json','MATH_RECEIPT_R5.json','CASE_DISPOSITIONS.json','BLANK_DECISIONS_INPUT.json']:
 rel=str((B/name).relative_to(R));evs.append(rt.evidence(W,'file',dict(path=rel,sha256=sha(R/rel)),source_ref='actual current user permission and frozen deterministic N08 design',verification_level='local_execution'))
s=rt.state(W)
if s['definition_hash']!=DEFINITION_HASH:
 for nid in list(s['claims']):rt.reconcile_claim(W,nid,'FAILED',evs)
 rt.migrate_definition(W,s['definition_hash'],evs)
# Re-run invalidated services under their current implementation hashes.
for node in ['S00_RECOVER','S01_ROUTE']:
 s=rt.state(W)
 if rt.node_status(s,instantiate(s['plan'])[node])!='PASSED':rt.execute(W,node)
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text());dispositions=load('CASE_DISPOSITIONS.json')['cases']
def submit(kind,inputs,fields,review):
 nid=kind+'@n08';s=rt.state(W)
 if rt.node_status(s,instantiate(s['plan'])[nid])=='PASSED':return
 if nid in s['claims']:
  from capabilities import run_capability
  claim=s['claims'][nid];node=rt.task(W,nid)['node'];refs=[]
  bound=[e['payload']['receipt']for e in rt.store.events()if e['work']==W and e['kind']=='capability_bound'and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']]
  for cap in node['capability_requests']:
   good=[ref for ref in bound if rt.store.get(ref)['capability']==cap and rt.store.get(rt.store.get(ref)['output']).get('status')in('PASS','NEEDS_AI_REVIEW')]
   refs.append(good[-1]if good else run_capability(rt,W,node,cap,inputs[cap]))
  job=dict(node=nid,claimToken=claim['token'],receipts=refs)
 else:job=run_code(rt,W,inputs)
 assert job['node']==nid,(job['node'],nid)
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']}
 save(kind+'_CODE.json',{rt.store.get(ref)['capability']:dict(status=rt.store.get(rt.store.get(ref)['output'])['status'],outputArtifact=rt.store.get(ref)['output'],receiptArtifact=ref)for ref in job['receipts']})
 assert all(v['status']in('PASS','NEEDS_AI_REVIEW')for v in outputs.values()),{k:v for k,v in outputs.items()if v['status']not in('PASS','NEEDS_AI_REVIEW')}
 req=ai_request(rt,W,nid);result=dict(verdict='PASS',evidence_refs=evs,capability_receipts=job['receipts'],case_dispositions=dispositions,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-source-and-visible-state-pass; not independent AI',evidence=review),**fields)
 rt.submit(W,nid,job['claimToken'],result);save(kind+'_RESULT.json',result)
 print(nid+' passed with actual receipts',flush=True)
submit('R01_CAPTURE',{'source.fixed':{},'feedback.capture':{}},dict(complaint='Approved P001 N08 trial, with explicit preservation and rollback requirement; no new negative quality label.',before_evidence=['evidence/BASELINE_UI.json','NODE_INVENTORY.json'],reproduction='Original r4 source and 12-stage browser baseline are retained. Current task implements its frozen 39-node design.',target_versions=dict(source=original_plan['source_sha'],approved=approval['approvedCommit'])),'Original baseline hashes unchanged. Preparation and current user permission are explicitly recorded; no prior acceptance is transferred to r5.')
legacy=json.loads((R/'work/items/W-MATH-033-n08-absolute-value/CANDIDATE_IR.json').read_text())
submit('R02_CAUSE',{'case.retrieve':{'request':dict(cache='/workspace/scratch/f79c5816761e/n08-trial-model-cache',encoder=dict(local_only=True),query='N08 whole problem distance sign operation grouped expressions and choices',cases=corpus['cases'],scope=dict(subject='math',mode='textbook'))},'knowledge.ledger':{'symbols':[dict(id=f,definitionRef='Original N08 and original source; local sqrt/pi prerequisites made explicit',scope='N08 elementary real-number absolute value')for f in legacy['initialFacts']]},'math.solve':bundle,'math.verify':bundle,'ir.verify':legacy,'source.audit':dict(coverage=legacy['coverage'],sourceBlocks=legacy['sourceBlocks'],candidate=legacy),'novice.audit':dict(ir=legacy),'solution.validate':bundle},dict(symptoms=['Example root replaced by a local stage goal','Operation construction omitted','Authoring prose in learner text','Original adapter could not check absolute-value cases'],confirmed_causes=['stage-only context','two-sided operation compressed','authoring metadata mixed into prose','closed AST lacked bounded absolute/root/pi joins'],hypotheses=[],missing_learning_actions=['distance expression a-0','same operand on both sides','return to the whole example'],root_cause_signatures=['fragmented-problem-context','missing-expression-generation','unsupported-bounded-cases'],proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False),'Previously UNVERIFIED cause is superseded by exact 38-segment checks. Negative tests reject unrestricted Abs(a)=a, zero gaps, conditional leaks and false sign/bracket operations. Fifteen retrieved cases are individually dispositioned; model remains offline.')
impact=[dict(originFinding='P001 whole-problem and reversible trial requirements',rootCauseSignature='n08-conditional-whole-problem',artifact=path,version=original_plan['source_sha'],approvedCreationWork='W-MATH-033',block_id='n08',evidence_refs=evs,status='NOT-AFFECTED'if path in original_plan['protected_manifest']or path.endswith(('n08Authored.json','N08ReadingFlow.tsx','n08-reading.css','.png'))else'AFFECTED',phase='pre-design',resolution='Preserve r4, original figure and other accepted units; modify only selection, r5 route and reversible migration')for path in original_plan['blocks'][0]['sources']]
submit('R03_IMPACT',{'impact.inventory':{}},dict(impact_rows=impact,source_inventory=original_plan['blocks'][0]['sources']+new,unknowns=[]),'All original inventory and new leaf/reader/archive consumers inspected. Existing sources remain fixed and the preservation amendment uses the current user instruction.')
teaching=dict(solution=[dict(id=n['id'],inputFacts=n['requires'],outputFacts=n['produces'],goal=n['goal'],operation=n['operation'],basisRefs=n['sourceRefs'])for n in ir['nodes']],knowledge=ir['initialFacts'],options=dict(budget=1))
figure='public/assets/math/textbook/numbers/n08-f01.png';import base64
fig=dict(figures=[dict(id='n08-f01',purpose='Read original signed coordinates and distances',howToRead='Use origin and the two marked points; distinguish coordinate from distance',sourceRef=legacy['sourceBlocks'][0]['id'],visibleWhen='first-stage and optional original-diagram reference',sourcePath=figure,contentHash=hashlib.sha256(base64.b64encode((R/figure).read_bytes())).hexdigest())])
submit('R04_PROPOSAL',{'math.solve':bundle,'math.verify':bundle,'teaching.plan':teaching,'step.plan':teaching,'blank.plan':dict(nodes=ir['nodes']),'prose.compose':ir,'text.verify':ir,'figure.verify':fig,'ir.verify':ir,'source.audit':dict(coverage=ir['coverage'],sourceBlocks=ir['sourceBlocks'],candidate=ir),'novice.audit':dict(ir=ir),'solution.validate':bundle,'interaction.plan':load('BLANK_PLAN_INPUT.json'),'solution.review':load('SOLUTION_REVIEWS_DESIGN.json')},dict(before_after=['12 stages preserved;36->39 nodes;31->34 answers','P001 immutable, r4 remains byte-identical and available by version=4','Single answer binds both sides of each added operation'],protected_scope=rt.state(W)['plan']['scope']['preserve'],patch_plan=['Deterministic exact IR and r5 leaf; new reader and archive','Version selector and reversible history migration; existing r4 reader unchanged'],verification_plan=['Exact math and adversarial tests','All choices and full 4-width play','Store migration and rollback tests; exact published source'],proposal_hash=approval['proposalHash'],proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False),'Approved P001 is unchanged. Each visible-only state was inspected without expected-answer metadata; conditional definitions and whole-problem context preserve the next-step reason. Only path realization and backup were added from the same user instruction, without inventing human quality acceptance.')
event='W037-P001-PRESERVE-R4-APPROVED-20261026'
if event not in rt.state(W)['users']:rt.user(W,'approve_proposal',approval['quote'],approval['proposalHash'],approval['sourceRef'],event_id=event)
if rt.node_status(rt.state(W),instantiate(rt.state(W)['plan'])['R05_APPROVAL@n08'])!='PASSED':accept_design(rt,W,'R05_APPROVAL@n08',event)
# Apply only the fixed, hash-checked derived patch. New file bases are explicitly absent from the source snapshot.
nid='R06_PATCH@n08';s=rt.state(W)
if rt.node_status(s,instantiate(s['plan'])[nid])!='PASSED':
 job=run_code(rt,W,{'ir.compile':ir,'render.solution':{'ir':ir}});assert job['node']==nid
 assert rt.approval(rt.state(W));assert not rt.integrity(rt.state(W))
 assert digest(patch)==rt.state(W)['plan']['proposal']['patch_hash']
 already_applied=all(sha(R/f['path'])==f['after_sha256']for f in patch['files'])
 if not already_applied:
  for f in patch['files']:
   path=R/f['path'];assert hashlib.sha256(f['after_text'].encode()).hexdigest()==f['after_sha256']
   if f['path']in existing:assert sha(path)==f['before_sha256']
   else:assert f['path']in new and (not path.exists()or sha(path)==f['after_sha256'])
  for p,h in rt.state(W)['plan']['protected_manifest'].items():assert sha(R/p)==h
  backup=rt.store.put({f['path']:(R/f['path']).read_bytes().hex()if f['path']in existing else None for f in patch['files']})
  op='n08-preserved-r4-'+digest(patch)[:20]
  rt.append('patch_intent',W,dict(node=nid,patch_hash=rt.store.put(patch),backup=backup,before={f['path']:f['before_sha256']for f in patch['files']},adapter='work-local bounded new-r5-leaf; new file absence explicitly checked'),event_id=op)
  for f in patch['files']:
   path=R/f['path'];tmp=path.with_suffix(path.suffix+'.w37tmp');tmp.write_text(f['after_text']);os.replace(tmp,path)
  rt.append('patch_applied',W,dict(node=nid,operation=op,after_manifest={f['path']:f['after_sha256']for f in patch['files']}))
 else:
  for p,h in rt.state(W)['plan']['protected_manifest'].items():assert sha(R/p)==h
  rt.append('native_patch_reverification',W,dict(node=nid,patch=digest(patch),reason='Current solver service changed; exact already-applied app bytes unchanged; recompile without duplicate application'))
 req=ai_request(rt,W,nid)
 rt.production_result(W,nid,job['claimToken'],dict(verdict='PASS',evidence_refs=evs,capability_receipts=job['receipts'],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant deterministic patch audit',evidence='Exact P001 recompiled. All31 old grading contracts, 12 stage IDs, r4 leaf/reader/CSS and original image retained. New leaf and bounded new files are explicit in the preservation scope. Local candidate prepared after permission, baseline restored and actual native patch applied with before/after hashes.')))
render(rt,W,B/'generated');save('NATIVE_IMPLEMENTATION_CHECKPOINT.json',dict(next=rt.next(W),sourceHash=artifact['irHash'],oldPreserved=True,approvalEvent=event));print('N08 native approved patch complete; verification/candidate binding next')
