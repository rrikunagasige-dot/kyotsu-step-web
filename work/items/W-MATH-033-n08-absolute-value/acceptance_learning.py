"""Record the actual N08 acceptance, fresh post-fix sweep and real R08/L01 fit."""
import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R),str(R/'workflow')]
from runtime import Runtime
from runner import run_code
from production import ai_request
from contracts import manifest
from views import render
from tools.textbook.corpus.core import learner_text,examples,split_groups
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-033';s=rt.state(w);sha=s['candidate_sha']
quote='我觉得可以.然后机械学习。那下面直接N09，N10。'
assert sha=='ea47dd97f7d323267281915e8d9a7bb92a8e7c03'
app=next(e for e in rt.store.get(s['results']['G3_HOST@n08']['artifact'])['evidence_refs'] if s['evidence'][e]['kind']=='app')
accept_id='W033-N08-APP-ACCEPTED-20261025';positive_id='W033-N08-POSITIVE-20261025'
data=dict(quote=quote,acceptanceEvent=accept_id,positiveEvent=positive_id,sourceSHA=sha,scope='published N08 overall presented material',individualDimensionLabelsInferred=False)
(B/'USER_ACCEPTANCE.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
if accept_id not in s['users']:rt.user(w,'accept_app',quote,app,'current-conversation: N08 app link followed by explicit acceptance',event_id=accept_id,release_unit='n08')
if positive_id not in rt.state(w)['users']:rt.user(w,'quality_positive',quote,app,'current-conversation: N08 positive evaluation and explicit machine learning request',event_id=positive_id,release_unit='n08')
if 'G3_FINAL@n08' not in rt.state(w)['results']:rt.accept(w,'G3_FINAL@n08',accept_id,[app])
ev=[app]
p=str((B/'USER_ACCEPTANCE.json').relative_to(R));ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual current N08 scoped acceptance',verification_level='local_execution'))
def execute(inputs,extra):
 job=run_code(rt,w,inputs);req=ai_request(rt,w,job['node']);node=req['task']['node']
 for ref in job['receipts']:
  out=rt.store.get(rt.store.get(ref)['output']);assert out['status'] in ('PASS','NEEDS_AI_REVIEW'),out
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-acceptance-and-learning-review',evidence='Actual N08 user quote and accepted ea47 source linked to hosted evidence. One overall positive only. All original negative cases preserved. Frozen encoder features use learner-visible content without IDs/labels. Same-assistant review, no model promotion or accuracy claim.'),**extra)
 (rt.submit if node['actor']=='AI' else rt.production_result)(w,job['node'],job['claimToken'],result)
 return job
s=rt.state(w)
if rt.next(w).get('task',{}).get('node',{}).get('stage_kind')=='R03_IMPACT_SWEEP':
 rows=[dict(originFinding='N08 compressed steps / rendering / revision migration',rootCauseSignature='n08-guided-semantic-flow',artifact=p,version=sha,approvedCreationWork='W-MATH-033/P-001',block_id='n08',evidence_refs=ev,status='NOT-AFFECTED',phase='post-fix',resolution='N08 repaired and tested; protected or unchanged source retained') for p in s['plan']['source_manifest']]
 execute({'impact.inventory':{}},dict(impact_rows=rows,source_inventory=list(s['plan']['source_manifest']),unknowns=[]))
 (B/'POST_ACCEPTANCE_SWEEP.json').write_text(json.dumps(dict(sourceSHA=sha,rows=rows,ciRun=40162373237,publicationRun=40162687421,protectedLearnerSource='N07/first title preserved',newLearnerSourceChanges=False),ensure_ascii=False,indent=2)+'\n')
prior=json.loads((R/'work/items/W-MATH-032-n07-semantic-repair/LEARNING_CORPUS.json').read_text())
observations=json.loads((R/'work/items/W-GOV-010-learning-production-workflow/redesign/RECOVERED_CASE_INDEX.json').read_text())['records']
seen={o['id'] for o in observations}
for event in rt.store.events():
 if event['kind']=='feedback_captured':
  c=event['payload']
  if c['id'] not in seen:observations.append(dict(id=c['id'],sourceType='versioned_user_feedback_registry',quote=c['quote'],sourceRef=c['source_ref']));seen.add(c['id'])
capture=next(e['payload'] for e in rt.store.events() if e['work']==w and e['kind']=='feedback_captured' and e['payload']['evaluation_event']==positive_id)
new=dict(id='N08-ACCEPTED-20261025',observationId=capture['id'],quality='POSITIVE',dimension='overall_material_acceptance',artifactVersion=sha,scope='N08 overall accepted material; no per-dimension labels inferred',evidenceTier='USER_GOLD',evidenceRef=positive_id,inputSnapshot=dict(kind='learner_artifact',text=learner_text(json.loads((B/'MATERIALIZED_APP.json').read_text()))),familyId='n08-absolute-value',episodeId='n08-acceptance-20261025',seen=True)
curation=dict(observations=observations,decisions=[*prior['cases'],new]);prior_ref=rt.store.put(dict(curatedCorpus=prior,provenance=dict(sourcePath='work/items/W-MATH-032-n07-semantic-repair/LEARNING_CORPUS.json')))
rows=[dict(caseId=capture['id'],regressionRef='work/items/W-MATH-033-n08-absolute-value/implementation.test.tsx',ruleDisposition='retain scoped positive only; preserve original negative examples',datasetDisposition='one genuine overall positive')]
updates=[dict(id=capture['id'],quality='POSITIVE',evaluation_event=positive_id,target_version=sha,resolution='ACCEPTED_POSITIVE',disposition='TEST',links=ev,repair_evidence_refs=ev)]
common=dict(case_updates=updates,rule_links=['memory/LESSONS/MATH_TYPESETTING_GROUPS.md'],regression_links=['work/items/W-MATH-033-n08-absolute-value/implementation.test.tsx','work/items/W-MATH-033-n08-absolute-value/verify_app.mjs'],unresolved=[])
finalize={'caseUpdates':rows,'curation':curation,'baseCatalogArtifact':prior_ref}
job=execute({'case.finalize':finalize},common)
catalog_ref=rt.store.get(rt.store.get(job['receipts'][0])['output'])['catalogArtifact'];catalog=rt.store.get(catalog_ref)['curatedCorpus']
(B/'LEARNING_CORPUS.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n');training=examples(catalog);(B/'TRAINING_EXAMPLES.json').write_text(json.dumps(training,ensure_ascii=False,indent=2)+'\n')
inputs={'case.finalize':dict(finalize,baseCatalogArtifact=catalog_ref),'ml.train':dict(corpus_artifact=catalog_ref,python='/tmp/kyotsu-n07-ml-20261025/bin/python',request=dict(cache='/tmp/kyotsu-n07-encoder-20261025',encoder=dict(local_only=True)))}
(B/'LEARNING_JOB_INPUT.json').write_text(json.dumps(inputs,ensure_ascii=False,indent=2)+'\n')
job=run_code(rt,w,inputs);(B/'LEARNING_JOB.json').write_text(json.dumps(job,indent=2)+'\n')
outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']};m=outputs['ml.train'];(B/'MODEL_RESULT.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
assert all(o['status'] in ('PASS','NEEDS_AI_REVIEW') for o in outputs.values()),outputs
req=ai_request(rt,w,job['node']);rt.submit(w,job['node'],job['claimToken'],dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],**common,modelDisposition=m['modelDisposition'],trainingRun=m['trainingRun'],deduplication='Prior10 real cases retained; exactly one N08 overall positive added; no individual dimension labels fabricated.',aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-label-and-model-review',evidence='N08 explicit accepted source is ea47. Actual fit result inspected; overall acceptance remains positive-only and is omitted. Offline only, no holdout accuracy or model promotion claimed.')))
rt.execute(w,'Z01_CLOSE');assert rt.next(w)['status']=='DONE'
summary=dict(sourceSHA=sha,humanAccepted=True,newPositiveCases=1,evaluatedCases=len(catalog['cases']),negativeCases=sum(c['quality']=='NEGATIVE' for c in catalog['cases']),positiveCases=sum(c['quality']=='POSITIVE' for c in catalog['cases']),trainingRun=m['trainingRun'],trainedHeads={k:len(v['rowIds']) for k,v in m['heads'].items()},omittedHeads=m.get('omittedHeads'),modelStatus='OFFLINE_ONLY',advisoryEligible=False,split=split_groups(training),unseenHoldout=False,evaluation='NOT_ESTIMABLE',encoder=m['encoder'],encoderHash=m['encoderHash'],modelHash=m['modelHash'],catalogHash=catalog['hash'])
(B/'LEARNING_RESULT.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');render(rt,w,B/'generated');print(json.dumps(summary,ensure_ascii=False)[:2500])
