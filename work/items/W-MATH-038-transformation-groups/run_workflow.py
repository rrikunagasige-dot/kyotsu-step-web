"""Execute the approved correction in the existing shared Runtime, never synthetic gates.
Preparation happened after explicit approval, before this receipt capture; it is not backdated.
"""
from pathlib import Path
import json,sys,subprocess
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from runner import run_code
from capabilities import run_capability
from production import ai_request
from definitions import instantiate
from contracts import manifest,sha
from store import digest
from views import render
from ready_dispatch import accept_design
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-038'
def load(p):return json.loads((B/p).read_text())
def save(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
approval=load('APPROVAL.json');assert sha(B/'PROPOSAL.md')==approval['proposalSha256']
ir=json.loads((R/'src/data/textbook/math/numbers/n11Authored.json').read_text());tp=load('N11_TRANSFORMATION_PLAN.json');compiled=json.loads((R/'src/data/textbook/math/numbers/n11Transformation.json').read_text())
legacy=json.loads((R/'work/items/W-MATH-036-ne02-n11-n12-guided-design/N11_IR.json').read_text())
corpus=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').read_text());model=json.loads((R/'work/items/W-MATH-035-choice-order-factor-audit/MODEL_RESULT_CORRECTED.json').read_text())
wrap=dict(ir=ir,transformationPlan=tp)
protected=list(json.loads((R/'work/items/W-MATH-037-n08-workflow-trial/IMPLEMENTATION_PLAN.json').read_text())['protected_manifest'])
protected+=['src/data/textbook/math/numbers/n08Authored.json','src/data/textbook/math/numbers/n08Revision5.json','src/data/textbook/math/numbers/n08ActiveVersion.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/N08SolutionReadingFlow.tsx','src/components/textbook/n08-reading.css','src/components/textbook/n08-solution-reading.css','src/data/textbook/math/numbers/n11Authored.json','src/domain/textbook.ts']
protected=list(dict.fromkeys(protected))
sources=['src/data/textbook/math/numbers/n11Authored.json','work/items/W-MATH-036-ne02-n11-n12-guided-design/N11_IR.json','work/items/W-MATH-036-ne02-n11-n12-guided-design/evidence/N11_SOURCE_INDEX.json']
rules=['governance/CONSTITUTION.md','governance/WORK_SYSTEM.md','governance/REVIEW_POLICY.json','subjects/mathematics/textbook/SPEC.md','memory/LESSONS/MATH_TYPESETTING_GROUPS.md']
paths=['src/components/textbook/GuidedMathReadingFlow.tsx','src/components/textbook/SolutionReadingFlow.tsx','src/components/textbook/TransformationReadingGroup.tsx','src/components/textbook/transformation-reading.css','src/domain/transformationReading.ts','src/pages/TextbookUnitPage.tsx','src/data/textbook/math/numbers/n11Transformation.json','tools/textbook/transformation/','tools/textbook/fixtures/transformation-examples.mjs','tools/textbook/tests/transformation.test.mjs','tools/textbook/solver/solution.py','tools/textbook/operations.mjs','tools/textbook/ai/solution-review.mjs','tools/textbook/interaction/plan.mjs','tools/textbook/SOLUTION_PIPELINE.md','workflow/integration.py','workflow/test_transformation.py',str(B.relative_to(R))+'/']
plan=dict(work_id=W,profile='material',command='CMD-WORK-001',workflow_version='production/2',solution_pipeline='solution/1',subject='math',mode='textbook',source_sha=approval['proposalCommit'],source_manifest=manifest(R,sources),rules=manifest(R,rules),proposal=dict(id=W+'/P-001',hash=approval['proposalSha256'],contentDesignHash=compiled['irHash']),scope=dict(paths=paths,preserve=protected),protected_manifest=manifest(R,protected),blocks=[dict(id='n11',sources=sources,release_unit='n11',change_facets=['design','render'],content_design_hash=compiled['irHash'],presentation_design_hash=compiled['planHash'])],release_units=[dict(id='n11',block_ids=['n11'],review_route='/learning/textbook/math-numbers-expressions-n11')],simulation=False)
if not any(e['work']==W and e['kind']=='opened' for e in rt.store.events()):
 rt.open(plan);rt.production_context(W,dict(corpusHash=corpus['hash'],modelHash=model['modelHash'],rulesHash=digest(plan['rules']),featureSchema='learner-visible-json/2'))
 rt.append('implementation_preparation_recorded',W,dict(approvalSource='APPROVAL.json',preparationAfterApproval=True,nativeReceiptCaptureAfterLocalPreparation=True,notBackdated=True,sourceScope='Immutable original N11 input, previous IR and Word index; implementation changes are approved independent branch changes, not a fake pre-approval baseline.'))
 save('WORKFLOW_PLAN.json',rt.state(W)['plan'])
if rt.state(W)['definition_hash']!=__import__('definitions').DEFINITION_HASH:
 proof=rt.evidence(W,'file',dict(path='workflow/test_transformation.py',sha256=sha(R/'workflow/test_transformation.py')),source_ref='Presentation opt-in preserves historical approval hashes exactly; current P001 unchanged',verification_level='local_execution')
 rt.migrate_definition(W,rt.state(W)['definition_hash'],[proof])
ev=[]
for p in ['APPROVAL.json','PROPOSAL.md','N11_TRANSFORMATION_PLAN.json','N11_MATH_CHECK.json','FINDINGS.md','CASE_DISPOSITIONS.json']:
 rel=str((B/p).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=rel,sha256=sha(R/rel)),source_ref='Current explicit design approval and exact source/display plan; no quality acceptance',verification_level='local_execution'))
cases=load('CASE_DISPOSITIONS.json')['cases']
for nid in ['S00_RECOVER','S01_ROUTE']:
 if rt.node_status(rt.state(W),instantiate(rt.state(W)['plan'])[nid])!='PASSED':rt.execute(W,nid)
def submit(kind,inputs,fields,review):
 nid=kind+'@n11';s=rt.state(W);node=instantiate(s['plan'])[nid]
 if rt.node_status(s,node)=='PASSED':return
 if nid in s['claims']:
  claim=s['claims'][nid];refs=[run_capability(rt,W,node,c,inputs[c]) for c in node['capability_requests']];job=dict(node=nid,claimToken=claim['token'],receipts=refs)
 else:job=run_code(rt,W,inputs)
 assert job['node']==nid,(job['node'],nid)
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output'])for ref in job['receipts']}
 save(kind+'_CODE.json',outputs)
 assert all(v['status']in('PASS','NEEDS_AI_REVIEW')for v in outputs.values()),{k:v for k,v in outputs.items()if v['status']not in('PASS','NEEDS_AI_REVIEW')}
 req=ai_request(rt,W,nid)
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=cases,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant source and visible-state pass; not independent AI',evidence=review),**fields)
 (rt.production_result if node['actor']=='TOOL' else rt.submit)(W,nid,job['claimToken'],result)
 save(kind+'_RESULT.json',result);print(nid+' actual receipts PASS',flush=True)
submit('R01_CAPTURE',{'source.fixed':{},'feedback.capture':{}},dict(complaint='Ordinary transformations should form one connected solution, with purposeful blanks and no duplicate terminal statement.',before_evidence=['SOURCE_AUDIT.json','PROPOSAL.md'],reproduction='Original N11 per-node reader and n11-05 divisor exposure inspected; original source remains frozen.',target_versions=dict(original=approval['proposalCommit'],publicSource='1e8d2ae4ea21b3ad5c4e2582fb806f56e86ce19c')),'The current quote approves P001 and schedules N08 next. It is not a positive or negative quality label for the new N11.')
request=dict(cache='/workspace/scratch/f79c5816761e/w038-model-cache',encoder=dict(local_only=True),query='ordinary transformation coherent solution missing prerequisites source equation blanks and relation alignment',cases=corpus['cases'],scope=dict(subject='math',mode='textbook'))
sourceAudit=dict(coverage=legacy['coverage'],sourceBlocks=legacy['sourceBlocks'],candidate=wrap)
submit('R02_CAUSE',{'case.retrieve':dict(request=request),'ir.verify':wrap,'source.audit':sourceAudit,'novice.audit':wrap,'solution.validate':wrap},dict(symptoms=['per-node display fragments ordinary transformations','later divisor is announced before its blank'],confirmed_causes=['no independent display grouping model','prose and current question were not audited as a whole episode','equation-only parser uses fixed equality relation'],hypotheses=[],missing_learning_actions=['choose the next operation inside the same whole solution'],root_cause_signatures=['ordinary-transformation-fragmentation','cross-step-answer-exposure','relation-render-contract']),'Source code and original N11 nodes inspected. CODE proves arithmetic and mappings; AI classifies the local goal and prose positions. The first-title and conceptual layouts remain protected.')
rows=[dict(block_id='n11',artifact=p,version=plan['source_sha'],phase='pre-design',approvedCreationWork='W-MATH-003',status='AFFECTED',rootCauseSignature='ordinary-transformation-fragmentation',originFinding='P001',evidence_refs=ev,resolution='Keep original immutable; use explicit opt-in sidecar and source/block coverage')for p in sources]
submit('R03_IMPACT',{'impact.inventory':{}},dict(impact_rows=rows,source_inventory=sources+paths,unknowns=[]),'N11 only stage05-06 is opted in. Stage07 interpretation and all existing grading IDs remain; N08 r4/r5 and other units are preserved. Shared components receive an optional presentation, not a global replacement.')
teaching=dict(graph=tp['graphs'][0],options=dict(budget=1))
submit('R04_PROPOSAL',{'teaching.plan':teaching,'step.plan':teaching,'blank.plan':wrap,'prose.compose':wrap,'text.verify':wrap,'figure.verify':dict(figures=[],noFigureReason='No new diagram for this symbolic transformation; the two original N11 figures stay byte-identical at their original gates.'),'ir.verify':wrap,'source.audit':sourceAudit,'novice.audit':wrap,'solution.validate':wrap,'interaction.plan':wrap,'solution.review':load('SOLUTION_REVIEWS_DESIGN.json')},dict(before_after=['One opt-in relation sequence instead of per-node captions','Five existing interactions,39 grading IDs and revision11 remain','Internal state/operation math is checked; terminal statement appears once'],protected_scope=protected,patch_plan=paths,verification_plan=['67 exact/negative tests and three approval-binding tests','Four-width39 correct and109 wrong choices; old save revisions and layout switch','Fixture shared slots and full source-matched hosted app'],proposal_hash=approval['proposalSha256']),'P001 unchanged. Five visible-only review states have individually recorded purposes and source references. Fifteen existing cases have dimension-specific dispositions. Whole-material acceptances are not reused as labels or proof.')
event='W038-P001-APPROVED-20261026'
if event not in rt.state(W)['users']:rt.user(W,'approve_proposal',approval['quote'],approval['proposalSha256'],'current conversation explicit P001 approval',event_id=event)
if rt.node_status(rt.state(W),instantiate(rt.state(W)['plan'])['R05_APPROVAL@n11'])!='PASSED':accept_design(rt,W,'R05_APPROVAL@n11',event)
submit('R06_PATCH',{'ir.compile':legacy,'render.solution':wrap},{},'The original production IR remains intact. The new render.solution receipt binds the authored input hash and display plan hash in one artifact. Local preparation after permission is explicitly logged; no approval or implementation timing is fabricated.')
render(rt,W,B/'generated');save('IMPLEMENTATION_CHECKPOINT.json',dict(status='NATIVE_R06_PASS',next=rt.next(W),qualityAccepted=False,modelFit=False));print('Native correction ready for exact candidate QA.')
