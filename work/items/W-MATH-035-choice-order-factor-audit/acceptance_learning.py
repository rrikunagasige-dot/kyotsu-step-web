"""Scoped actual N09/N10 acceptance and real offline learning; no inferred labels."""
import json,sys,subprocess,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R),str(R/'workflow'),str(B)]
from runtime import Runtime
from production import ai_request
from contracts import manifest
from views import render
from ready_dispatch import run, ready
from integration import accept as native_accept
from tools.textbook.corpus.core import learner_text,examples,split_groups
from learning import finalize as finalize_catalog
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-035';s=rt.state(w);sha=s['candidate_sha']
assert sha=='fa0eff271a97940fad08d83960ae50faeabc81b9'
def put(name,x):(B/name).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
quote='ごめんね。私が言っているのはN09,N10承認の意味。そして残っているNの作業また何かあるのか'
request='よし。まずN09,N10の機械学習そして次はNE02,N11,N12でよろしく'
ev=[];apps={};positives={}
for code in ['n09','n10']:
 s=rt.state(w);app=next(e for e in rt.store.get(s['results']['G3_HOST@'+code]['artifact'])['evidence_refs'] if s['evidence'][e]['kind']=='app');apps[code]=app;ev.append(app)
 aid=f'W035-{code.upper()}-APP-ACCEPTED-20261025';pid=f'W035-{code.upper()}-POSITIVE-20261025';positives[code]=pid
 if aid not in s['users']:rt.user(w,'accept_app',quote,app,'current-conversation: explicit clarification that approval means both N09/N10 material',event_id=aid,release_unit=code,block=code)
 if pid not in rt.state(w)['users']:rt.user(w,'quality_positive',quote,app,'current-conversation: scoped actual material acceptance, followed by explicit ML request',event_id=pid,release_unit=code,block=code)
 if 'G3_FINAL@'+code not in rt.state(w)['results']:
  _,node=ready(rt,w,'G3_FINAL@'+code);native_accept(rt,w,node,aid,[app])
put('USER_ACCEPTANCE.json',dict(quote=quote,learningRequest=request,sourceSHA=sha,units=['n09','n10'],scope='one overall material acceptance per unit',individualDimensionLabelsInferred=False))
p=str((B/'USER_ACCEPTANCE.json').relative_to(R));ev.append(rt.evidence(w,'file',dict(path=p,sha256=manifest(R,[p])[p]),source_ref='actual user scoped material acceptance and learning request',verification_level='local_execution'))
def execute(code,stage,inputs,extra):
 nid=stage+'@'+code;s=rt.state(w)
 if nid in s['results']:return None
 if nid in s['claims']:
  c=s['claims'][nid];refs=[e['payload']['receipt'] for e in rt.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==c['input_hash']];job=dict(node=nid,claimToken=c['token'],receipts=refs)
 else:job=run(rt,w,nid,inputs)
 req=ai_request(rt,w,nid);outputs={rt.store.get(ref)['capability']:rt.store.get(rt.store.get(ref)['output']) for ref in job['receipts']};assert all(o['status'] in ('PASS','NEEDS_AI_REVIEW') for o in outputs.values()),outputs
 result=dict(verdict='PASS',evidence_refs=ev,capability_receipts=job['receipts'],aiReview=dict(requestHash=req['requestHash'],inputHash=req['task']['input_hash'],reviewer='current-assistant-post-acceptance-review',evidence='Actual two-unit acceptance linked to exact hosted source. Fresh frozen materialization check passes. Original two negatives retain old source and narrow scope; only two overall positives added. AI findings are not USER_GOLD. Same-assistant review; offline only; no unseen accuracy or promotion.'),**extra)
 if stage=='L01_LEARNING':
  m=outputs['ml.train'];result.update(modelDisposition=m['modelDisposition'],trainingRun=m['trainingRun']);put('MODEL_RESULT_'+code.upper()+'.json',m)
 (rt.submit if req['task']['node']['actor']=='AI' else rt.production_result)(w,nid,job['claimToken'],result)
 return job
s=rt.state(w);paths=list(s['plan']['source_manifest'])
checks=dict(sourceSHA=sha,sourceManifest=manifest(R,s['candidate_manifest']),protectedManifest=manifest(R,s['plan']['protected_manifest']),frozenOverlay='fresh materialize.mjs --check PASS',previousHostedRun=40172534338,newLearnerChanges=False,allSevenFindings='verified by exact hosted 4-width full plays and target display reports; source unchanged since those reports')
assert checks['sourceManifest']==s['candidate_manifest'];assert checks['protectedManifest']==s['plan']['protected_manifest'];put('POST_ACCEPTANCE_SWEEP.json',checks)
for code in ['n09','n10']:
 rows=[dict(originFinding='W035 F01-F07, scoped to N09/N10',rootCauseSignature='choice-operation-order-and-complete-factor-group',artifact=p,version=sha,approvedCreationWork='W-MATH-035/P-001',block_id=code,evidence_refs=ev,status='NOT-AFFECTED',phase='post-fix',resolution='Repair target already verified at accepted source; fresh source/protected hash check shows no further changes') for block in s['plan']['blocks'] for p in block['sources']]
 for row,block in zip(rows,[b for b in s['plan']['blocks'] for _ in b['sources']]):row['block_id']=block['id']
 execute(code,'R03_IMPACT_SWEEP',{'impact.inventory':{}},dict(impact_rows=rows,source_inventory=paths,unknowns=[]))
prior=json.loads((R/'work/items/W-MATH-033-n08-absolute-value/LEARNING_CORPUS.json').read_text());observations=json.loads((R/'work/items/W-GOV-010-learning-production-workflow/redesign/RECOVERED_CASE_INDEX.json').read_text())['records'];seen={o['id'] for o in observations}
feedback=[e for e in rt.store.events() if e['kind']=='feedback_captured']
for e in feedback:
 c=e['payload']
 if c['id'] not in seen:observations.append(dict(id=c['id'],sourceType='versioned_user_feedback_registry',quote=c['quote'],sourceRef=c['source_ref']));seen.add(c['id'])
new=[]
for code,event,nodes,dimension in [('n09','W034-N09-ORDER-NEGATIVE-20261025',['n09-08'],'operation_order'),('n10','W034-N10-FACTOR-NEGATIVE-20261025',['n10-q17-factor'],'factor_grouping')]:
 c=next(e['payload'] for e in feedback if e['work']=='W-MATH-034' and e['payload']['evaluation_event']==event);old=json.loads(subprocess.check_output(['git','show',c['target_version']+':src/data/textbook/math/numbers/'+code+'Authored.json'],cwd=R,text=True));snap=[dict(before=n['before'],after=n['after'],choices=[dict(parts=old['semanticDisplay'][n['id']]['choices'][v]) for v in next(q for q in old['unit']['sections'][0]['items'] if q['id']==n['id'])['choices']]) for n in old['semantic']['nodes'] if n['id'] in nodes];assert len(snap)==len(nodes) and len(learner_text(snap))>100
 new.append(dict(id=code.upper()+'-REJECTED-20261025',observationId=c['id'],quality='NEGATIVE',dimension=dimension,artifactVersion=c['target_version'],scope=','.join(nodes),evidenceTier='USER_GOLD',evidenceRef=event,inputSnapshot=dict(kind='learner_artifact',text=learner_text(snap)),familyId=code+'-lesson',episodeId=code+'-repair-20261025',seen=True))
for code in ['n09','n10']:
 c=next(e['payload'] for e in feedback if e['work']==w and e['payload']['evaluation_event']==positives[code]);snap=json.loads((R/('src/data/textbook/math/numbers/'+code+'Authored.json')).read_text())
 new.append(dict(id=code.upper()+'-ACCEPTED-20261025',observationId=c['id'],quality='POSITIVE',dimension='overall_material_acceptance',artifactVersion=sha,scope=code.upper()+' overall accepted material; no per-dimension labels inferred',evidenceTier='USER_GOLD',evidenceRef=positives[code],inputSnapshot=dict(kind='learner_artifact',text=learner_text(snap)),familyId=code+'-lesson',episodeId=code+'-repair-20261025',seen=True))
prior_ref=rt.store.put(dict(curatedCorpus=prior,provenance=dict(sourcePath='work/items/W-MATH-033-n08-absolute-value/LEARNING_CORPUS.json')))
# Validate old-source negatives in their original Work using actual original evaluation events.
parent=rt.state('W-MATH-034');parent_ids=[e['payload']['id'] for e in feedback if e['work']=='W-MATH-034']+list(parent['issues'])
parent_rows=[dict(caseId=i,regressionRef='work/items/W-MATH-035-choice-order-factor-audit/implementation.test.tsx',ruleDisposition='preserve original negative; approved child repaired exact pattern',datasetDisposition='two original negatives only; no AI finding labels') for i in parent_ids]
cert=finalize_catalog(rt,'W-MATH-034',dict(caseUpdates=parent_rows,curation=dict(observations=observations,decisions=[*prior['cases'],*new[:2]]),baseCatalogArtifact=prior_ref));assert cert['status']=='PASS',cert
put('PARENT_NEGATIVE_CATALOG_RECEIPT.json',dict(**cert,scope='catalog validation only, not parent stage completion or old-source acceptance'))
prior_ref=cert['catalogArtifact'];curation=dict(observations=observations,decisions=[*prior['cases'],*new])
# Failed earlier attempt produced no capability receipt; preserve failure then reclaim normally.
s=rt.state(w)
for nid in list(s['claims']):
 if nid.startswith('R08_CAPTURE_LEARNING'):
  receipts=[e for e in rt.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==s['claims'][nid]['input_hash']]
  if not receipts:rt.reconcile_claim(w,nid,'FAILED',ev)

caseRows=[dict(caseId=c['id'],regressionRef='work/items/W-MATH-035-choice-order-factor-audit/implementation.test.tsx',ruleDisposition='overall acceptance only; original scoped negative remains at rejected source',datasetDisposition='one genuine overall positive per accepted unit') for e in feedback if e['work']==w for c in [e['payload']]]
updates=[dict(id=c['id'],quality='POSITIVE',evaluation_event=c['evaluation_event'],target_version=sha,resolution='ACCEPTED_POSITIVE',disposition='TEST',links=ev,repair_evidence_refs=ev) for e in feedback if e['work']==w for c in [e['payload']]]
common=dict(deduplication='Existing11 retained; exactly2 original negatives and2 unit-scoped overall positives; no AI findings converted to Gold.',case_updates=updates,rule_links=['memory/LESSONS/MATH_TYPESETTING_GROUPS.md'],regression_links=['work/items/W-MATH-035-choice-order-factor-audit/implementation.test.tsx','work/items/W-MATH-035-choice-order-factor-audit/verify_display.mjs'],unresolved=[])
finalize=dict(caseUpdates=caseRows,curation=curation,baseCatalogArtifact=prior_ref)
for code in ['n09','n10']:execute(code,'R08_CAPTURE_LEARNING',{'case.finalize':finalize},common)
# One corpus/bundle, separate native per-unit learning receipts. Encoder cache reuses features.
for code in ['n09','n10']:
 s=rt.state(w);r=rt.store.get(s['results']['R08_CAPTURE_LEARNING@'+code]['artifact'])['capability_receipts'][0];catref=rt.store.get(rt.store.get(r)['output'])['catalogArtifact'];catalog=rt.store.get(catref)['curatedCorpus'];put('LEARNING_CORPUS.json',catalog);put('TRAINING_EXAMPLES.json',examples(catalog))
 inputs={'case.finalize':dict(finalize,baseCatalogArtifact=catref),'ml.train':dict(corpus_artifact=catref,python='/tmp/kyotsu-n07-ml-20261025/bin/python',request=dict(cache='/tmp/kyotsu-n07-encoder-20261025',encoder=dict(local_only=True)))}
 execute(code,'L01_LEARNING',inputs,common)
models={code:json.loads((B/('MODEL_RESULT_'+code.upper()+'.json')).read_text()) for code in ['n09','n10']}
if 'Z01_CLOSE' not in rt.state(w)['results']:rt.execute(w,'Z01_CLOSE')
assert rt.next(w)['status']=='DONE',rt.next(w)
rt.resolve_request('W-MATH-034','W034-N0910-ALL-MISTAKES-AUDIT-20261025',w)
m=models['n10'];summary=dict(sourceSHA=sha,humanAccepted=['n09','n10'],newPositiveCases=2,newNegativeCases=2,aiFindingsGoldLabels=0,evaluatedCases=len(catalog['cases']),negativeCases=sum(c['quality']=='NEGATIVE' for c in catalog['cases']),positiveCases=sum(c['quality']=='POSITIVE' for c in catalog['cases']),trainingRun=m['trainingRun'],trainedHeads={k:len(v['rowIds']) for k,v in m['heads'].items()},omittedHeads=m.get('omittedHeads'),modelStatus='OFFLINE_ONLY',advisoryEligible=False,split=split_groups(examples(catalog)),unseenHoldout=False,evaluation='NOT_ESTIMABLE',encoder=m['encoder'],modelHash=m['modelHash'],catalogHash=catalog['hash'],parentHistoricalWork='W034 old-source gates not fabricated or accepted; child request resolved using W035 actual close')
put('LEARNING_RESULT.json',summary);render(rt,w,B/'generated');print(json.dumps(summary,ensure_ascii=False)[:3000])
