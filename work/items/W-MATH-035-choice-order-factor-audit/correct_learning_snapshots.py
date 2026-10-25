"""Supplemental corrected learning receipts; preserve first native fit as superseded history."""
import json,sys,subprocess,copy,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R),str(R/'workflow')]
from runtime import Runtime
from learning import finalize
from capabilities import run_capability
from definitions import instantiate
from tools.textbook.corpus.core import learner_text,examples,split_groups
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-035'
def put(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
for name in ['LEARNING_CORPUS.json','TRAINING_EXAMPLES.json','LEARNING_RESULT.json','MODEL_RESULT_N09.json','MODEL_RESULT_N10.json','FEATURE_RECEIPTS.json']:
 dest=B/'evidence'/('SUPERSEDED_METADATA_SNAPSHOT_'+name)
 if not dest.exists():dest.write_bytes((B/name).read_bytes())
prior=json.loads((B/'evidence/SUPERSEDED_METADATA_SNAPSHOT_LEARNING_CORPUS.json').read_text());cases=copy.deepcopy(prior['cases']);snapshots=[]
for code,nid in [('n09','n09-08'),('n10','n10-q17-factor')]:
 c=next(c for c in cases if c['id']==code.upper()+'-REJECTED-20261025');raw=json.loads(subprocess.check_output(['git','show',c['artifactVersion']+':src/data/textbook/math/numbers/'+code+'Authored.json'],cwd=R,text=True));node=next(n for n in raw['semantic']['nodes'] if n['id']==nid);item=next(i for i in raw['unit']['sections'][0]['items'] if i['id']==nid)
 visible=dict(before=node['before'],after=node['after'],choices=[dict(parts=raw['semanticDisplay'][nid]['choices'][v]) for v in item['choices']]);txt=learner_text(visible);assert len(txt)>100 and ('latex' in txt or 'text' in txt),txt
 c['inputSnapshot']=dict(kind='learner_artifact',text=txt);snapshots.append(dict(caseId=c['id'],sourceSHA=c['artifactVersion'],semanticNode=nid,inputCharacters=len(txt),containsActualVisibleMath=True,oldInput='[] metadata projection rejected',currentInputSHA256=hashlib.sha256(txt.encode()).hexdigest()))
observations=json.loads((R/'work/items/W-GOV-010-learning-production-workflow/redesign/RECOVERED_CASE_INDEX.json').read_text())['records'];seen={o['id'] for o in observations}
for e in rt.store.events():
 if e['kind']=='feedback_captured':
  p=e['payload']
  if p['id'] not in seen:observations.append(dict(id=p['id'],sourceType='versioned_user_feedback_registry',quote=p['quote'],sourceRef=p['source_ref']));seen.add(p['id'])
base=rt.store.put(dict(curatedCorpus=prior));parent=rt.state('W-MATH-034');ids=[e['payload']['id'] for e in rt.store.events() if e['work']=='W-MATH-034' and e['kind']=='feedback_captured']+list(parent['issues']);rows=[dict(caseId=i,regressionRef='work/items/W-MATH-035-choice-order-factor-audit/implementation.test.tsx',ruleDisposition='same original event/label/scope, correct actual visible input',datasetDisposition='repair empty metadata snapshot; no additional examples') for i in ids]
cert=finalize(rt,'W-MATH-034',dict(caseUpdates=rows,curation=dict(observations=observations,decisions=cases),baseCatalogArtifact=base));assert cert['status']=='PASS',cert
s=rt.state(w);original=rt.store.get(s['results']['L01_LEARNING@n10']['artifact']);oldcase=next(rt.store.get(rt.store.get(r)['output']) for r in original['capability_receipts'] if rt.store.get(r)['capability']=='case.finalize');case_rows=oldcase['caseUpdates']
final_inputs=dict(caseUpdates=case_rows,curation=dict(observations=observations,decisions=cases),baseCatalogArtifact=cert['catalogArtifact'])
node=instantiate(s['plan'])['L01_LEARNING@n10'];fref=run_capability(rt,w,node,'case.finalize',final_inputs);fo=rt.store.get(rt.store.get(fref)['output']);assert fo['status']=='PASS';catref=fo['catalogArtifact'];catalog=rt.store.get(catref)['curatedCorpus'];training=examples(catalog)
assert len(training)==15 and all(r['text'] not in ['[]','{}','null',''] and len(r['text'])>2 for r in training)
inputs=dict(corpus_artifact=catref,python='/tmp/kyotsu-n07-ml-20261025/bin/python',request=dict(cache='/tmp/kyotsu-n07-encoder-20261025',encoder=dict(local_only=True)))
mref=run_capability(rt,w,node,'ml.train',inputs);m=rt.store.get(rt.store.get(mref)['output']);assert m['status']=='PASS' and m['trainingRun'] is True and not m['advisoryEligible'];assert len(m['featureReceipts'])==15 and all(not r['truncated'] and r['inputTokens']==r['processedTokens'] for r in m['featureReceipts'])
put('LEARNING_CORPUS.json',catalog);put('TRAINING_EXAMPLES.json',training);put('MODEL_RESULT_CORRECTED.json',m);put('FEATURE_RECEIPTS.json',m['featureReceipts'])
summary=json.loads((B/'evidence/SUPERSEDED_METADATA_SNAPSHOT_LEARNING_RESULT.json').read_text());summary.update(modelHash=m['modelHash'],catalogHash=catalog['hash'],split=split_groups(training),correction='two original negative inputs corrected from metadata-only [] to actual semantic prose/math/choices; old fit preserved and superseded',currentModelFile='MODEL_RESULT_CORRECTED.json',nativeFirstFits='historical L01 results; superseded for current ML use',supplementalCodeReceipts=[fref,mref],evaluatedCases=len(catalog['cases']))
put('LEARNING_RESULT.json',summary);put('LEARNING_INPUT_CORRECTION.json',dict(status='PASS',sourceSnapshots=snapshots,exampleCountBefore=15,exampleCountAfter=15,newLabels=0,supplementalCodeReceipts=[fref,mref],catalogHash=catalog['hash'],modelHash=m['modelHash'],allVisibleInputsNonempty=True,allTokensProcessed=True,supervisedFit=True,workflow='same case.finalize -> ml.train services, supplemental real receipts after native closure; no fabricated second approval or second stage completion',historicalResultsPreserved=True))
proof=rt.store.put(dict(summary=summary,snapshots=snapshots,receipts=[fref,mref]));rt.append('learning_input_correction_verified',w,dict(artifact=proof,supersedesModelHash=json.loads((B/'evidence/SUPERSEDED_METADATA_SNAPSHOT_LEARNING_RESULT.json').read_text())['modelHash'],currentModelHash=m['modelHash'],catalogHash=catalog['hash'],reason='visible-source projection must select semantic.nodes, not presentation metadata nodes'))
print(json.dumps(dict(status='PASS_CORRECTED',cases=len(catalog['cases']),inputCharacters=[r['inputCharacters'] for r in snapshots],modelHash=m['modelHash'],catalogHash=catalog['hash'],groups=summary['split']['groupCount'])))
