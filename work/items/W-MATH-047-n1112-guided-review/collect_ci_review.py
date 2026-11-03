"""Collect the actual first CI-visible review without rewriting first-pass flags."""
import sys,json
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import capture_harness,record_output,reconcile_task
from store import digest
from team import project
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';bundle=json.loads((B/'evidence/REVIEW_n11_semantic.json').read_text());a=bundle['assignment'];reg=bundle['registration'];raw=json.loads(Path(sys.argv[1]).read_text());pending=json.loads((B/'evidence/N11_R07_SEMANTIC_PENDING.json').read_text());refs=pending['evidenceRefs']
assert raw['targetHash']==a['artifactHashes']['implemented-visible'] and raw['sourceSHA']==a['sourceSHA']
first=r.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'rawFirstObservations':raw.get('firstObservations'),'rawReport':raw})
out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'performerRef':a['performerRef'],'verdict':raw['verdict'],'findings':[],'claimRef':'implemented-visible','facet':'render','targetHash':raw['targetHash'],'reviewKind':'learner-visible-review','authorSeparation':raw['authorSeparation'],'sourceFirst':raw['sourceFirst'],'firstPass':raw['firstPass'],'firstPassArtifactRef':first,'evidenceRefs':refs,'rationale':raw['rationale']}
for f in raw.get('findings',[]):
 if f.get('status')in ['OPEN','UNRESOLVED']:out['findings'].append({'findingId':f['id'],'claimRef':'implemented-visible','facet':'render','reason':f['reason'],'evidenceRefs':refs,'resolution':'OPEN','affectedRefs':f.get('targetIds',[])})
for f in raw.get('findings',[]):
 if f.get('status')=='VERIFIED_FIXED':
  history=project(r.store.events(),w)
  old=next(ref for ref,v in history['outputs'].items() if any(x['findingId']==f['id'] and x['resolution']=='OPEN' and x['claimRef']=='implemented-visible' and x['facet']=='render' and x.get('block')=='n11' for x in v['output']['findings']))
  proof=r.store.put({'targetHash':raw['targetHash'],'reason':f['reason'],'evidenceRefs':refs})
  out['findings'].append({'findingId':f['id'],'claimRef':'implemented-visible','facet':'render','reason':f['reason'],'evidenceRefs':refs,'resolution':'VERIFIED_FIXED','affectedRefs':f.get('targetIds',[]),'resolvesOutputRef':old,'resolutionEvidenceRef':proof})
captured=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':a['performerRef'],'attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':raw,'structuredOutputHash':digest(out)});out['harnessOutputRef']=captured['artifactRef'];recorded=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[captured['artifactRef']]);bundle['output']=recorded;(B/'evidence/REVIEW_n11_semantic.json').write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n');(B/'evidence/N11_CI_FIRST_VISIBLE_REVIEW.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2)+'\n')
if raw['verdict']!='PASS':
 print('Original non-PASS review recorded; no parent PASS submitted',flush=True)
 sys.exit(0)
q=pending['request'];result={'verdict':raw['verdict'],'evidence_refs':refs,'capability_receipts':pending['job']['receipts'],'symptom_resolution':['P006 six-node content fixes retained; R1 quotient slot is generated before completed range is revealed','Local arithmetic at26 returns to whole inequality at27; current CI normal viewport evidence retained'],'regression_review':['Actual CI source/image/report SHA match','All39 answers/109 wrong options at each of4 widths, history/reload/resize/old saves passed','N12 BASELINE remains a protected surface, not an implemented claim'],'protected_scope_review':['85 grading contracts, revisions, stages, numbers and source graph/alias contracts preserved; exactly two W038 display rows changed under approved R1'],'unknowns':[],'case_dispositions':json.loads((B/'evidence/CASE_DISPOSITIONS.json').read_text())['cases'],'aiReview':{'requestHash':q['requestHash'],'inputHash':q['task']['input_hash'],'reviewer':'M integrating actual independent first CI-visible report','evidence':'First observations of the actual current CI artifact retained; local preview/plan familiarity disclosed. B supplemental report retains firstPass=false and is not used for required first-pass scope. Exact source/API artifact/archive/raw image hashes verified. Not blind or model-independent. Integrated-release G2 finding closure remains for Gate1 then G2.'},'teamCollection':{'submissionActor':'M','registrationRefs':[reg['registrationRef']],'outputRefs':[recorded['outputRef']]}}
r.submit(w,pending['job']['node'],pending['job']['claimToken'],result);print('R07 semantic submitted',flush=True);render(r,w,B/'generated');print('Next',r.next(w).get('task',{}).get('node',{}).get('id'),flush=True)
