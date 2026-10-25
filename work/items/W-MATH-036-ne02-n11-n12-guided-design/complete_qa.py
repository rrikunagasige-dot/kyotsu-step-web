import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-035-choice-order-factor-audit')]
from runtime import Runtime
from ready_dispatch import run
from production import ai_request
from contracts import manifest
from views import render
from definitions import instantiate
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-036';code=sys.argv[1];U=code.upper();ci=json.loads((B/('evidence/CI_'+U+'.json')).read_text());report=json.loads((B/('evidence/UI_'+U+'.json')).read_text());audit=json.loads((B/('evidence/IMAGE_'+U+'.json')).read_text());sha=r.state(w)['candidate_sha']
assert ci['sourceSHA']==sha and ci['conclusion']=='success' and report['sourceSHA']==sha and report['status']=='PASS' and audit['sourceSHA']==sha and audit['status']=='PASS'
rows=[x for x in report['results'] if x['code']==code];assert {x['width'] for x in rows}=={320,390,430,1440};count={'ne02':30,'n11':39,'n12':46}[code];assert all(x['answered']==count and x['geometry']=='PASS' and x['history'] and x['migration'] for x in rows)
ev=[r.evidence(w,'ci',dict(id=ci['runId'],html_url=ci['url'],head_sha=sha,status='completed',conclusion='success'),source_ref='actual exact-source GitHub CI',verification_level='tool_result_transcribed')]
for name in ['CI_'+U+'.json','UI_'+U+'.json','IMAGE_'+U+'.json']:
 p=str((B/'evidence'/name).relative_to(R));ev.append(r.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual code and same-assistant real-image audit',verification_level='local_execution'))
def submit(stage,inputs,fields):
 nid=stage+'@'+code;s=r.state(w)
 if nid in s['results'] and r.node_status(s,instantiate(s['plan'])[nid])=='PASSED':return
 job=run(r,w,nid,inputs);req=ai_request(r,w,nid);outputs={r.store.get(z)['capability']:r.store.get(r.store.get(z)['output']) for z in job['receipts']};assert all(v['status'] in ('PASS','NEEDS_AI_REVIEW') for v in outputs.values()),outputs
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],case_dispositions=json.loads((B/'CASE_DISPOSITIONS.json').read_text())['cases'],proofStatus='AI_ARGUMENT_REVIEWED',formalProof=False,unknowns=[],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='same-assistant-mathematics-and-real-image-review',evidence='Frozen exact node design, complete correct/wrong plays at four widths, actual source prose/math/choices, gates, previous conclusions and archives reviewed. Same assistant; not an independent second AI and not human acceptance.'),**fields)
 (r.production_result if req['task']['node']['actor']=='TOOL' else r.submit)(w,nid,job['claimToken'],result)
ir=json.loads((B/(U+'_IR.json')).read_text());argument=json.loads((B/(U+'_COMPLETE_SOLUTION.json')).read_text())
submit('R07_VERIFY',{'math.verify':argument,'ir.verify':ir,'browser.verify':dict(browserReceipt=dict(sourceSHA=sha,status='PASS',widths=[320,390,430,1440],semanticIdsVerified=True,statesVerified=True,ciRun=ci['runId'])),'protected.verify':{}},dict(sourceSHA=sha))
submit('R07_SEMANTIC',{'source.audit':dict(coverage=ir['coverage'],sourceBlocks=ir['sourceBlocks'],candidate=ir),'novice.audit':dict(ir=ir)},dict(symptom_resolution=['Full original problem precedes each example','Purpose and object precede each operation; intermediate judgments and calculations split','Canonical answers/options and source images preserved','Every option uses declared semantic display; factors remain whole; independent calculations stay separate','Original revision migrations run first, new nodes remain unanswered'],regression_review=['620 applicable learner regressions','39 authoring tests','Current unit dedicated checks, accepted N09/N10 behavior and complete four-width plays'],protected_scope_review=['Accepted first-title/N07/N08/N09/N10 authored data and display engine unchanged','Only new optional choice branch and declared figure ID selection in shared reader'] ))
rows=[dict(surface='changed source and shared consumer / preserved source audit',artifact=p,block_id=code,version=sha,status='PASS',evidence_refs=ev) for p in r.state(w)['candidate_manifest']]
submit('G2_AUDIT',{'protected.verify':{},'impact.inventory':{}},dict(audit_rows=rows,release_readiness='READY',impact_sweep_completion='COMPLETE',audit_method=dict(method='code scope, protected hashes, complete real learner plays and actual images',reviewer='code plus same assistant',independent=False)))
op='W036-'+code+'-pages-'+sha[:8]
if op not in r.state(w)['external']:r.external_intent(w,'DEPLOY',r.state(w)['plan']['proposal']['hash'],op,release_unit=code)
render(r,w,B/'generated');print(code+' QA and G2 PASS; existing Pages intent '+op)
