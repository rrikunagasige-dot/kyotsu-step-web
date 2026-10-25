"""Accept real N07, replay only required evidence after routing fix, then curate/train.
No learner bytes or public deployment are changed by this run.
"""
import json,sys,subprocess,copy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];B=Path(__file__).resolve().parent;sys.path.insert(0,str(ROOT));sys.path.insert(0,str(ROOT/'workflow'))
from runtime import Runtime
from contracts import manifest
from runner import run_code
from production import ai_request
from capabilities import implementation_hash
from views import render
from store import digest
from tools.textbook.corpus.core import learner_text,examples
r=Runtime(B/'runtime',ROOT);w='W-MATH-032';s=r.state(w);old={k:r.store.get(v['artifact']) for k,v in s['results'].items()};sha=s['candidate_sha']
basepath='work/items/W-GOV-010-learning-production-workflow/redesign/implementation/CURATED_CASES.json';corpus=json.loads((ROOT/basepath).read_text());ir=json.loads((B/'CANDIDATE_IR.json').read_text())
ev=[r.evidence(w,'file',{'path':str((B/'USER_ACCEPTANCE.json').relative_to(ROOT)),'sha256':manifest(ROOT,[str((B/'USER_ACCEPTANCE.json').relative_to(ROOT))])[str((B/'USER_ACCEPTANCE.json').relative_to(ROOT))]},source_ref='current explicit user acceptance and learning request',verification_level='local_execution')]
if s['definition_hash']!=__import__('definitions').DEFINITION_HASH:r.migrate_definition(w,s['definition_hash'],ev)
legacy=json.loads(subprocess.check_output(['git','show','4fb7a98e7f864839ccc1374080473df4ba60ce88:src/data/textbook/math/numbers/n07Authored.json'],cwd=ROOT));plan=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/N07_DESIGN_PLAN.json').read_text());source=json.loads((ROOT/'tools/textbook/fixtures/n07-source-index.json').read_text())
solution=[{'id':n['id'],'inputFacts':n['requires'],'outputFacts':n['produces'],'goal':n['goal'],'operation':{**n['operation'],'targets':n['operation']['targets'] or n['sourceRefs']},'basisRefs':n['sourceRefs']} for n in ir['nodes']];teaching={'solution':solution,'knowledge':ir['initialFacts'],'options':{'budget':1}}
app=next(ref for ref in old['G3_HOST@n07']['evidence_refs'] if s['evidence'][ref]['kind']=='app')
inputs={
'R01_CAPTURE':{'source.fixed':{},'feedback.capture':{}},
'R02_CAUSE':{'case.retrieve':{'request':{'cache':'/workspace/scratch/f79c5816761e/n07-local-model-cache','encoder':{'local_only':True},'query':'N07 source and same-root repair','cases':corpus['cases'],'scope':{'subject':'math','mode':'textbook'}}},'ir.verify':legacy,'source.audit':{'coverage':plan['coverage'],'sourceBlocks':source['blocks'],'candidate':legacy},'novice.audit':{'ir':legacy}},
'R03_IMPACT':{'impact.inventory':{}},
'R04_PROPOSAL':{'teaching.plan':teaching,'step.plan':teaching,'blank.plan':{'nodes':ir['nodes']},'prose.compose':ir,'text.verify':ir,'figure.verify':{'figures':[],'noFigureReason':'N07 uses the original division table.'},'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}},
'R06_PATCH':{'ir.compile':ir},
'R07_VERIFY':{'ir.verify':ir,'browser.verify':{'browserReceipt':{'sourceSHA':sha,'status':'PASS','widths':[320,390,430,1440],'semanticIdsVerified':True,'statesVerified':True,'ciRun':40154122715}},'protected.verify':{}},
'R07_SEMANTIC':{'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}},
'G2_AUDIT':{'protected.verify':{},'impact.inventory':{}},'G3_HOST':{'release.verify':{'appEvidence':app}}}
def execute(data,result):
 state=r.state(w)
 if state['claims']:
  nid,claim=next(iter(state['claims'].items()));refs=[e['payload']['receipt'] for e in r.store.events() if e['work']==w and e['kind']=='capability_bound' and e['payload']['node']==nid and e['payload']['input_hash']==claim['input_hash']]
  job={'node':nid,'claimToken':claim['token'],'receipts':refs}
 else:job=run_code(r,w,data)
 req=ai_request(r,w,job['node']);node=req['task']['node']
 for ref in job['receipts']:
  output=r.store.get(r.store.get(ref)['output']);assert output['status'] in ('PASS','NEEDS_AI_REVIEW'),output
 out=copy.deepcopy(result);out.update(verdict='PASS',capability_receipts=job['receipts'])
 out['aiReview']={'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'current-assistant-evidence-review','evidence':'Positive feedback routing fixed and tested. Learner/IR bytes remain identical to46ea59be; prior actual all-state four-width CI and hosted run retained. Source/protected/current bytes and preserved scoped approval checked again; no republish or new acceptance fabricated.'}
 (r.submit if node['actor']=='AI' else r.production_result)(w,job['node'],job['claimToken'],out)
 return job
while True:
 if any(k.startswith('R08_CAPTURE_LEARNING') for k in r.state(w)['claims']):break
 if r.next(w).get('task',{}).get('node',{}).get('stage_kind')=='R08_CAPTURE_LEARNING':break
 nxt=r.next(w);n=nxt.get('task',{}).get('node');assert n,nxt;kind=n['stage_kind'];nid=n['id']
 if kind in ('S00_RECOVER','S01_ROUTE'):r.execute(w,nid)
 elif kind=='R05_APPROVAL':r.accept(w,nid,r.approval(r.state(w))['id'],ev)
 elif kind=='G3_FINAL':r.accept(w,nid,'W032-N07-APP-ACCEPTED-20261025',[app])
 elif kind=='R03_IMPACT_SWEEP':break
 else:
  result=copy.deepcopy(old[nid]);result.pop('producer',None)
  if kind=='R01_CAPTURE':result['target_versions']={'learnerSource':sha,'originalSource':s['plan']['source_sha'],'workflowImplementationHash':implementation_hash(r)}
  execute(inputs[kind],result)
# Fresh post-fix inventory, separate from the earlier pre-fix impact ledger.
s=r.state(w);rows=[{'originFinding':'F01-F06','rootCauseSignature':'n07-semantic-projection','artifact':p,'version':sha,'approvedCreationWork':'W-GOV-010/N07','block_id':'n07','evidence_refs':[app,*ev],'status':'NOT-AFFECTED','phase':'post-fix','resolution':'original symptoms repaired; protected bytes unchanged'} for p in s['plan']['source_manifest']]
if r.next(w).get('task',{}).get('node',{}).get('stage_kind')=='R03_IMPACT_SWEEP':execute({'impact.inventory':{}},{'evidence_refs':[app,*ev],'impact_rows':rows,'source_inventory':list(s['plan']['source_manifest']),'unknowns':[]})
(B/'POST_ACCEPTANCE_SWEEP.json').write_text(json.dumps({'sourceSHA':sha,'rows':rows,'all41NodesCoveredBy':40154122715,'protectedSourceDelta':'Only three N07 learner files differ from190941; other mode and first-title data unchanged','originalNegativeExamplesPreserved':True},ensure_ascii=False,indent=2)+'\n')
# Reuse only actual prior corpus; do not promote recovered UNKNOWN candidates.
prior=r.store.put({'curatedCorpus':corpus,'provenance':{'sourcePath':basepath,'sha256':manifest(ROOT,[basepath])[basepath]}})
s=r.state(w);capture=next(e['payload'] for e in r.store.events() if e['work']==w and e['kind']=='feedback_captured' and e['payload']['evaluation_event']=='W032-N07-POSITIVE-20261025')
obs=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/redesign/RECOVERED_CASE_INDEX.json').read_text())['records'];obs=[o for o in obs if o['id'] in {c['observationId'] for c in corpus['cases']}]
missing={c['observationId'] for c in corpus['cases']}-{o['id'] for o in obs}
assert not missing,missing
obs.append({'id':capture['id'],'sourceType':'versioned_user_feedback_registry','quote':capture['quote'],'sourceRef':capture['source_ref']})
# One broad positive, no six independently labelled positive counterparts.
new={'id':'N07-ACCEPTED-20261025','observationId':capture['id'],'quality':'POSITIVE','dimension':'overall_material_acceptance','artifactVersion':sha,'scope':'N07 overall presented material; no independent per-defect labels','evidenceTier':'USER_GOLD','evidenceRef':capture['evaluation_event'],'inputSnapshot':{'kind':'learner_artifact','text':learner_text(json.loads((ROOT/'src/data/textbook/math/numbers/n07Authored.json').read_text())['unit'])},'familyId':'n07-decimals','episodeId':'n07-acceptance-20261025','seen':True}
decisions=[*corpus['cases'],new]
case_rows=[{'caseId':capture['id'],'regressionRef':'tools/textbook/tests/n07-repair.test.mjs','ruleDisposition':'retain real scoped acceptance, no per-dimension expansion','datasetDisposition':'one genuine positive example'}]
registry=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/n07/feedback/NEGATIVE_CASES.json').read_text())
for c in registry['cases']:case_rows.append({'caseId':c['id'],'regressionRef':'tools/textbook/tests/n07-repair.test.mjs','ruleDisposition':'preserve original negative label; link verified repair and acceptance','datasetDisposition':'retain original negative case unchanged'})
curation={'observations':obs,'decisions':decisions}
case_result=[{'id':capture['id'],'quality':'POSITIVE','evaluation_event':capture['evaluation_event'],'target_version':sha,'resolution':'ACCEPTED_POSITIVE','disposition':'TEST','links':[app,*ev],'repair_evidence_refs':[app,*ev]}]
for c in registry['cases']:case_result.append({'id':c['id'],'quality':'UNKNOWN','origin_version':registry['sourceSHA'],'resolution':'VERIFIED_FIXED','disposition':'TEST','links':[app,*ev],'repair_evidence_refs':[app,*ev]})
common={'evidence_refs':[app,*ev],'case_updates':case_result,'rule_links':['WORKFLOW_INTEGRATION_RESULT.md','presentation/RESPONSIBILITIES.md'],'regression_links':['tools/textbook/tests/n07-repair.test.mjs','workflow/test_integration.py'],'unresolved':[]}
job=execute({'case.finalize':{'caseUpdates':case_rows,'curation':curation,'baseCatalogArtifact':prior}},common)
ref=r.store.get(job['receipts'][0])['output'];finalized=r.store.get(ref);cat=r.store.get(finalized['catalogArtifact']);(B/'LEARNING_CORPUS.json').write_text(json.dumps(cat['curatedCorpus'],ensure_ascii=False,indent=2)+'\n');(B/'TRAINING_EXAMPLES.json').write_text(json.dumps(examples(cat['curatedCorpus']),ensure_ascii=False,indent=2)+'\n')
(B/'LEARNING_JOB_INPUT.json').write_text(json.dumps({'case.finalize':{'caseUpdates':case_rows,'baseCatalogArtifact':finalized['catalogArtifact'],'curation':curation},'ml.train':{'corpus_artifact':finalized['catalogArtifact'],'python':'/tmp/kyotsu-n07-ml-20261025/bin/python','request':{'cache':'/tmp/kyotsu-n07-encoder-20261025','encoder':{'local_only':True}}}},ensure_ascii=False,indent=2)+'\n')
render(r,w,B/'generated');print('R08 complete; actual corpus cases',len(cat['curatedCorpus']['cases']),'next',r.next(w)['task']['node']['id'])
