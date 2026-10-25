from pathlib import Path
import json,sys
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from runner import run_code
from production import ai_request
from contracts import sha
from definitions import instantiate
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-037';candidate=sys.argv[1]
def load(p):return json.loads((B/p).read_text())
def save(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
report=load('evidence/implementation/LOCAL_FINAL_BROWSER.json');assert report['sourceSHA']==candidate and report['status']=='PASS'
assert {r['width']for r in report['results']}=={320,390,430,1440}
assert all(r['answers']==34 and r['wrongCount']==80 and r['migration']and r['oldArchive']and r['oneAttemptPerSelection']for r in report['results'])
rt.bind_candidate(W,candidate)
ev=[]
for name in ['VERIFICATION.md','evidence/implementation/LOCAL_FINAL_BROWSER.json','evidence/implementation/IMAGE_AUDIT.json','evidence/implementation/w37-workflow.log','evidence/implementation/w37-tests.log','evidence/implementation/w37-build.log','evidence/implementation/w37-bundle.log','evidence/implementation/w37-solution.log','evidence/implementation/w37-extraction.log']:
 path=str((B/name).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=path,sha256=sha(R/path)),source_ref='Actual exact app-source local checks, full plays and same-assistant image audit',verification_level='local_execution'))
ev.append(rt.evidence(W,'check',dict(source_sha=candidate,checks=['mobile_play','desktop_play','progress_isolation','no_auth_wall'],command='verify_app.mjs exact-source four-width complete local play',status='PASS'),source_ref='local full browser execution',verification_level='local_execution'))
ir=load('CANDIDATE_IR_R5.json');bundle=load('SOLUTION_BUNDLE_R5.json');cases=load('CASE_DISPOSITIONS.json')['cases']
def submit(kind,inputs,fields,review):
 nid=kind+'@n08';s=rt.state(W)
 if rt.node_status(s,instantiate(s['plan'])[nid])=='PASSED':return
 job=run_code(rt,W,inputs);assert job['node']==nid,(job['node'],nid)
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output'])for ref in job['receipts']};assert all(v['status']in('PASS','NEEDS_AI_REVIEW')for v in outputs.values()),outputs
 req=ai_request(rt,W,nid);result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=cases,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant source, visible-state and real-image pass; not independent AI',evidence=review),**fields)
 (rt.production_result if req['task']['node']['actor']=='TOOL'else rt.submit)(W,nid,job['claimToken'],result);save(kind+'_FINAL_RESULT.json',result);print(nid+' PASS',flush=True)
submit('R07_VERIFY',{'math.verify':bundle,'ir.verify':ir,'browser.verify':dict(browserReceipt=dict(sourceSHA=candidate,status='PASS',widths=[320,390,430,1440],semanticIdsVerified=True,statesVerified=True,semanticEvidence='Exact 39-node IR/semantic artifact binding, all visible node IDs in complete browser plays; formula/choice rendering and actual images reviewed')),'protected.verify':{},'solution.validate':bundle},dict(sourceSHA=candidate),'38 exact mathematical segments and 36 adversarial/solution tests pass; all39 nodes and all34 correct/80 wrong choices per width were visited. Shared two-side choices record one attempt; all31 legacy records, old archive view, reload, history, resize and another unit’s progress are preserved. Scope is N08 elementary math, not general absolute inequalities.')
submit('R07_SEMANTIC',{'source.audit':dict(coverage=ir['coverage'],sourceBlocks=ir['sourceBlocks'],candidate=ir),'novice.audit':dict(ir=ir),'solution.review':load('SOLUTION_REVIEWS_IMPLEMENTATION.json')},dict(symptom_resolution=['Same original example remains across stages05-07 and08-09','Each added operation has a stated objective; two-side slots are one decision','Previous conclusions keep their condition and current-problem identity','Definition/closing teach the learner; Q09 does not announce its rule answer','All choices use comparable rows; extra distribution steps and whole-expression brackets preserved'],regression_review=['620 applicable app regressions;7 dedicated preservation tests','135 workflow tests;21 extraction/context tests;36 exact-math/solution regressions','Full four-width plays and actual image review; previous accepted N08 preserved'],protected_scope_review=['Original r4 JSON, reader, CSS and PNG byte-identical','N07/N09/N10/N11/N12 protected hashes pass','Existing storage namespace retained'],unknowns=[]),'Each of39 separate learner-visible states was reviewed using masked current rows, prior results and available conditions; expected-answer metadata was excluded from those requests. Images confirm the new brackets, rows and references. Same assistant, no independent second AI or user material acceptance claimed. Trial permission creates no model quality label.')
rows=[dict(block_id='n08',artifact=p,version=candidate,status='PASS',surface='Changed app source, preserved original, exact design and complete local learner play',evidence_refs=ev)for p in rt.state(W)['candidate_manifest']]
submit('G2_AUDIT',{'protected.verify':{},'impact.inventory':{}},dict(audit_rows=rows,release_readiness='READY',impact_sweep_completion='COMPLETE',audit_method=dict(method='code scope/hash checks plus full correct/wrong browser plays and same-assistant real-image review',reviewer='current assistant and code',independent=False),unknowns=[]),'Protected hashes, all candidate source paths, archive route, reversible migration and public namespace are checked. Existing global lint failures in unrelated code are not called green. No current changed-scope regression remains.')
op='W037-n08-pages-'+candidate[:8]
if op not in rt.state(W)['external']:rt.external_intent(W,'DEPLOY',rt.state(W)['plan']['proposal']['hash'],op,release_unit='n08')
render(rt,W,B/'generated');save('LOCAL_QA_CHECKPOINT.json',dict(sourceSHA=candidate,stage='G2_AUDIT_PASS',externalIntent=op,next=rt.next(W),userAccepted=False,learningLabelsAdded=0));print('Current exact source ready for authorized existing-app publication')
