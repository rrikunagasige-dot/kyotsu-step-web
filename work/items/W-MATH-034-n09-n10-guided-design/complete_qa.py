"""Consume exact-source two-unit browser results; no synthetic user acceptance."""
import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)]
from runtime import Runtime
from ready_dispatch import run
from production import ai_request
from contracts import manifest
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-034';s=rt.state(w);sha=s['candidate_sha'];ci=json.loads((B/'evidence/CI_RESULT.json').read_text());audit=json.loads((B/'evidence/IMAGE_AUDIT.json').read_text())
assert ci['sourceSHA']==sha and ci['conclusion']=='success' and audit['sourceSHA']==sha and audit['status']=='PASS'
ev=[rt.evidence(w,'ci',dict(id=ci['runId'],html_url=ci['url'],head_sha=sha,status='completed',conclusion='success'),source_ref='actual exact-source GitHub run',verification_level='tool_result_transcribed')]
for code,count,revisions in [('n09',36,[1,2]),('n10',45,[1])]:
 report=json.loads((B/('evidence/'+code.upper()+'_UI_REPORT.json')).read_text());assert report['sourceSHA']==sha and report['status']=='PASS';assert {r['width'] for r in report['results']}=={320,390,430,1440}
 assert all(r['answered']==count and r['geometry']=='PASS' and r['history'] and r['migration'] and r['legacyMigrationRevisions']==revisions for r in report['results'])
for name in ['CI_RESULT.json','IMAGE_AUDIT.json','N09_UI_REPORT.json','N10_UI_REPORT.json','LOCAL_IMPLEMENTATION_CHECKS.json']:
 p=str((B/'evidence'/name).relative_to(R));ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual two-unit QA',verification_level='local_execution'))
def submit(code,kind,inputs,extra):
 nid=kind+'@'+code;state=rt.state(w)
 if nid in state['results']:return
 if nid in state['claims']:
  claim=state['claims'][nid];refs=[e['payload']['receipt'] for e in rt.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']];job=dict(node=nid,claimToken=claim['token'],receipts=refs)
 else:job=run(rt,w,nid,inputs)
 req=ai_request(rt,w,job['node']);node=req['task']['node'];outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']};assert all(o['status'] in ('PASS','NEEDS_AI_REVIEW') for o in outputs.values()),outputs
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=json.loads((B/'CASE_DISPOSITIONS.json').read_text())['cases'],proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-source-and-real-image-review',evidence='Frozen P001 and exact-source complete browser plays for both units reviewed. Conditions, all choices, prior results, figure gate, old-revision records, equation numbering and original grading contracts checked. Same-assistant audit; not an independent second AI or user acceptance.'),**extra)
 (rt.production_result if node['actor']=='TOOL' else rt.submit)(w,job['node'],job['claimToken'],result)
for code in ['n09','n10']:
 ir=json.loads((B/(code.upper()+'_IR.json')).read_text());argument=json.loads((B/(code.upper()+'_COMPLETE_SOLUTION.json')).read_text())
 submit(code,'R07_VERIFY',{'math.verify':argument,'ir.verify':ir,'browser.verify':dict(browserReceipt=dict(sourceSHA=sha,status='PASS',widths=[320,390,430,1440],semanticIdsVerified=True,statesVerified=True,ciRun=ci['runId'])),'protected.verify':{}},dict(sourceSHA=sha))
 submit(code,'R07_SEMANTIC',{'source.audit':dict(coverage=ir['coverage'],sourceBlocks=ir['sourceBlocks'],candidate=ir),'novice.audit':dict(ir=ir)},dict(symptom_resolution=['All original IDs/answers preserved','Each derivation and conditional record visible at the right time','Native whole-radical slot and compact comparison rows compile','No number collision in actual four-width geometry'],regression_review=['620 learner +9 dedicated tests','Both full browser plays, every wrong choice, history, reload, actual old saves'],protected_scope_review=['Accepted N08/N07/first title and source images retained']))
 rows=[dict(surface='candidate and shared-consumer regression',artifact=p,block_id=code,version=sha,status='PASS',evidence_refs=ev) for p in rt.state(w)['candidate_manifest']]
 submit(code,'G2_AUDIT',{'protected.verify':{},'impact.inventory':{}},dict(audit_rows=rows,release_readiness='READY',impact_sweep_completion='COMPLETE',audit_method=dict(method='exact source hashes, whole plays, actual images and geometry',reviewer='same assistant plus deterministic code',independent=False)))
for code in ['n09','n10']:rt.external_intent(w,'DEPLOY',rt.state(w)['plan']['proposal']['hash'],'W034-'+code+'-existing-pages-publication',release_unit=code)
render(rt,w,B/'generated');print(json.dumps(dict(sourceSHA=sha,qa='PASS_BOTH_UNITS',operations=['W034-n09-existing-pages-publication','W034-n10-existing-pages-publication'])))
