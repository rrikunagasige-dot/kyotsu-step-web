from pathlib import Path
import json,sys,subprocess
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow')]
from runtime import Runtime
from runner import run_code
from production import ai_request
from contracts import sha
from definitions import instantiate
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-038'
def load(p):return json.loads((B/p).read_text())
def save(p,v):(B/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
ci=load('evidence/CI_RESULT.json');candidate=ci['sourceSHA'];report=load('evidence/CI_N11_BROWSER.json')
assert ci['conclusion']=='success' and report['sourceSHA']==candidate and report['status']=='PASS'
assert {r['width']for r in report['results']}=={320,390,430,1440}and all(r['answered']==39 and r['wrongCount']==109 and r['migration']for r in report['results'])
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==candidate
rt.bind_candidate(W,candidate)
ev=[rt.evidence(W,'ci',dict(id=ci['runId'],html_url=ci['url'],head_sha=candidate,status='completed',conclusion='success'),source_ref='Actual GitHub run and job121395083811 logs; not local run relabeled',verification_level='tool_result_transcribed')]
for name in ['VERIFICATION.md','evidence/CI_RESULT.json','evidence/CI_N11_BROWSER.json','evidence/LOCAL_N11_BROWSER.json','evidence/LOCAL_FIXTURE_BROWSER.json','evidence/GALLERY.html']:
 path=str((B/name).relative_to(R));ev.append(rt.evidence(W,'file',dict(path=path,sha256=sha(R/path)),source_ref='Actual code, local real images and exact frozen-source CI; same assistant, not independent AI',verification_level='local_execution'))
ir=json.loads((R/'src/data/textbook/math/numbers/n11Authored.json').read_text());tp=load('N11_TRANSFORMATION_PLAN.json');wrap=dict(ir=ir,transformationPlan=tp)
legacy=json.loads((R/'work/items/W-MATH-036-ne02-n11-n12-guided-design/N11_IR.json').read_text());cases=load('CASE_DISPOSITIONS.json')['cases']
def submit(kind,inputs,fields,review):
 nid=kind+'@n11';node=instantiate(rt.state(W)['plan'])[nid]
 if rt.node_status(rt.state(W),node)=='PASSED':return
 job=run_code(rt,W,inputs);assert job['node']==nid,(job['node'],nid)
 outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output'])for ref in job['receipts']};assert all(v['status']in('PASS','NEEDS_AI_REVIEW')for v in outputs.values()),outputs
 req=ai_request(rt,W,nid);result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=cases,aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant source, visible-state and genuine local-image review; not independent AI',evidence=review),**fields)
 (rt.production_result if node['actor']=='TOOL' else rt.submit)(W,nid,job['claimToken'],result);save(kind+'_FINAL_RESULT.json',result);print(nid+' PASS',flush=True)
submit('R07_VERIFY',{'ir.verify':wrap,'browser.verify':dict(browserReceipt=dict(sourceSHA=candidate,status='PASS',widths=[320,390,430,1440],semanticIdsVerified=True,statesVerified=True,ciRun=ci['runId'],semanticEvidence='Source AST bridge, all39 correct/109 wrong choices per width, full typed relation rows and old-save paths; same exact source CI.')),'protected.verify':{},'solution.validate':wrap},dict(sourceSHA=candidate),'69 exact/negative tests,139 workflow,21 source/context,620 learner,6 new UI,7 N08 preservation,19 prior3-unit and39 authoring checks passed. Shared-slot fixtures and four-width N11 all-choice plays passed. Current grading source and protected units are byte-identical.')
submit('R07_SEMANTIC',{'source.audit':dict(coverage=legacy['coverage'],sourceBlocks=legacy['sourceBlocks'],candidate=wrap),'novice.audit':wrap,'solution.review':load('SOLUTION_REVIEWS_IMPLEMENTATION.json')},dict(symptom_resolution=['The same source problem remains at the head of the grouped relation sequence','Local cancellation/divisor helpers return to the whole inequality','The next divisor is not announced before its blank','Comparison signs align; each inequality is a complete statement; terminal is not re-carded','Stage07 retains meaningful boundary interpretation'],regression_review=['Current exact source CI covers every correct/wrong choice and old save revisions1-10','Original/new layout switch preserves39 answers, times, attempts and completion','Source, AST, conditional role and actual mathematical glyphs reviewed separately'],protected_scope_review=['Original N11 revision11 and all39 grading contracts unchanged','N08 r4/r5 data/readers/CSS and accepted earlier units retained','No model fit, new quality label or human app acceptance inferred'],unknowns=[]),'Five visible-only states reviewed before author keys. Genuine local images show relation columns, full factors, internal fraction slots and source numbering. Exact frozen-source CI confirms all states. Definition/proof/case units are not flattened; only declared N11 scope opts in.')
paths=subprocess.check_output(['git','diff','--name-only','f297503b574e92f1d2f120f9f9d09d7da6cd0af9',candidate],cwd=R,text=True).splitlines();paths=list(dict.fromkeys(list(rt.state(W)['candidate_manifest'])+[p for p in paths if p.startswith(('src/','tools/','workflow/','.github/'))]))
rows=[dict(block_id='n11',artifact=p,version=candidate,status='PASS',surface='Exact changed code or protected source; bound CI, source bridge and complete real-browser play',evidence_refs=ev)for p in paths]
submit('G2_AUDIT',{'protected.verify':{},'impact.inventory':{}},dict(audit_rows=rows,release_readiness='READY',impact_sweep_completion='COMPLETE',audit_method=dict(method='deterministic source/math/hash tests, full real-browser choice/state/save plays and same-assistant image/meaning audit',reviewer='code and current assistant',independent=False),unknowns=[]),'All changed implementation paths and immutable original inputs are covered. Unsupported source/pattern boundaries fail explicitly. Existing textbook/physics exclusions are named; no blanket whole-repository audit pass is claimed.')
op='W038-n11-pages-'+candidate[:8]
if op not in rt.state(W)['external']:rt.external_intent(W,'DEPLOY',rt.state(W)['plan']['proposal']['hash'],op,release_unit='n11')
render(rt,W,B/'generated');save('LOCAL_QA_CHECKPOINT.json',dict(sourceSHA=candidate,stage='G2_AUDIT_PASS',externalIntent=op,next=rt.next(W),userAccepted=False,modelFit=False));print('Ready for authorized existing Pages publication.')
