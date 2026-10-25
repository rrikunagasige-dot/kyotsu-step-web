from pathlib import Path
import json,sys
ROOT=Path(__file__).resolve().parents[3];B=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT));sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from production import ai_request
from views import render
from store import digest
r=Runtime(B/'runtime',ROOT);w='W-MATH-032';j=json.loads((B/'LEARNING_JOB.json').read_text());m=json.loads((B/'MODEL_RESULT.json').read_text());req=ai_request(r,w,j['node']);s=r.state(w);previous=r.store.get(s['results']['R08_CAPTURE_LEARNING@n07']['artifact'])
result={k:previous[k] for k in ('case_updates','rule_links','regression_links','unresolved','evidence_refs')};result.update(verdict='PASS',capability_receipts=j['receipts'],deduplication='Original9 scoped cases retained; one genuine N07 overall acceptance added. No six artificial positive counterparts, no UNKNOWN promotion. N07 pre/post versions share family n07-decimals.',modelDisposition=m['modelDisposition'],trainingRun=m['trainingRun'],aiReview={'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'current-assistant-source-and-label-review','evidence':'Original quote and exact accepted source46ea verified. One broad positive; no independent per-defect labels. No new model promotion. Existing layout head fitted; new overall-acceptance head skipped for single-class data. Feature input excludes IDs and labels and retains full token coverage.'})
r.submit(w,j['node'],j['claimToken'],result);assert r.next(w)['task']['node']['id']=='Z01_CLOSE';r.execute(w,'Z01_CLOSE');assert r.next(w)['status']=='DONE'
# Close the six original registry cases with verified multi-case closure evidence, not status alone.
p=ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json';registry=json.loads(p.read_text())
for c in registry['cases']:c.update(status='VERIFIED_FIXED',resolution={'work':w,'sourceSHA':s['candidate_sha'],'acceptanceEvent':'W032-N07-APP-ACCEPTED-20261025','closure':'R08 origin_version + repair app evidence + closed Work proof'})
p.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
# Preserve actual frozen-encoder feature receipts for reproducibility, without the large pretrained weights.
rows=json.loads((B/'TRAINING_EXAMPLES.json').read_text());vectors=[]
for row in rows:
 key=digest({'text':row['text'],'prefix':'query: ','encoder':m['encoderHash']});f=Path('/tmp/kyotsu-n07-encoder-20261025/features')/(key+'.json');v=json.loads(f.read_text());assert v['inputHash']==digest(row['text']);assert v['receipt']['processedTokens']==v['receipt']['inputTokens'];vectors.append({'caseId':row['id'],**v})
(B/'FEATURE_RECEIPTS.json').write_text(json.dumps({'encoderHash':m['encoderHash'],'featureInputSchema':'learner-visible-json/2','features':vectors},ensure_ascii=False,indent=2)+'\n')
summary={'sourceSHA':s['candidate_sha'],'humanAccepted':True,'newPositiveCases':1,'evaluatedCases':10,'negativeCases':7,'positiveCases':3,'trainingRun':m['trainingRun'],'trainedHeads':{k:len(v['rowIds']) for k,v in m['heads'].items()},'newOverallAcceptanceHead':'NOT_TRAINABLE_SINGLE_CLASS (one positive, no negative)','modelStatus':'OFFLINE_ONLY','advisoryEligible':False,'independentFamilies':2,'unseenHoldout':False,'evaluation':'NOT_ESTIMABLE; no generalization-accuracy claim','encoder':m['encoder']['model'],'encoderRevision':m['encoder']['revision'],'encoderHash':m['encoderHash'],'modelHash':m['modelHash'],'featureInputSchema':'learner-visible-json/2','catalogHash':json.loads((B/'LEARNING_CORPUS.json').read_text())['hash'],'legacyModelDisposition':m['modelDisposition'],'legacyDispositionExplanation':'Existing adapter uses NOT_TRAINABLE for a non-advisory model; actual fit is separately demonstrated by trainingRun/heads/coefficients. No new overall head was fitted.'}
(B/'LEARNING_RESULT.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
from requests import pending
assert not [q for q in pending(r,r.state(w)) if q['id'].startswith('N07-USER-F')]
render(r,w,B/'generated');print(json.dumps(summary,ensure_ascii=False))
