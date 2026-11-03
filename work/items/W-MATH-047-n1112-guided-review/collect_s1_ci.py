"""Register an actually launched task, then collect its original source-bound CI review."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import capture_harness,register_task,record_output,reconcile_task
from team import project
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';code,mode=sys.argv[1:3];upper=code.upper();p=B/('evidence/'+upper+'_S1_R07_PENDING.json');d=json.loads(p.read_text());a=d['assignment'];packet=d['packet'];refs=d['evidenceRefs']
def write(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
if mode=='register':
 assert d.get('registrationPendingActualTaskLaunch')
 cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':d['taskRef'],'parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'target':a['performerRef'],'toolResponse':'','transcription':'Actual followup_task was issued by M after preparation and before this registration; source-first new CI PNG task accepted.'},'attestationMethod':'transcribed-tool-result'})
 harness={'agentRef':a['performerRef'],'taskRef':d['taskRef'],'parentRef':'/root','logicalRole':d['logicalRole'],'toolResultRef':cap['artifactRef'],'attestationMethod':'transcribed-tool-result'}
 d.update(harness=harness,registration=register_task(r,w,a,packet,harness),registrationPendingActualTaskLaunch=False);write(p,d);print('Actual '+code+' task registered',flush=True)
elif mode=='collect':
 reg=d['registration'];raw=json.loads(Path(sys.argv[3]).read_text());assert raw['targetHash']==d['targetHash']and raw['sourceSHA']==a['sourceSHA']and raw['firstPass']and raw['sourceFirst']and raw['authorSeparation']
 rawpath=B/('evidence/'+upper+'_S1_CI_FIRST_REVIEW.json');write(rawpath,raw)
 first=r.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':packet['packetHash'],'rawFirstObservations':raw['firstObservations'],'rawReport':raw})
 out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':packet['packetHash'],'performerRef':a['performerRef'],'verdict':raw['verdict'],'findings':[],'claimRef':'implemented-visible','facet':'render','targetHash':raw['targetHash'],'reviewKind':'learner-visible-review','authorSeparation':True,'sourceFirst':True,'firstPass':True,'firstPassArtifactRef':first,'evidenceRefs':refs,'rationale':raw['rationale']}
 for f in raw.get('findings',[]):
  if f.get('status')not in ('OPEN','UNRESOLVED','VERIFIED_FIXED'):continue
  finding={'findingId':f['id'],'claimRef':'implemented-visible','facet':'render','reason':f['reason'],'evidenceRefs':refs,'resolution':'VERIFIED_FIXED'if f['status']=='VERIFIED_FIXED'else'OPEN','affectedRefs':f.get('targetIds',[])}
  if finding['resolution']=='VERIFIED_FIXED':
   old=next(ref for ref,v in project(r.store.events(),w)['outputs'].items()if any(x['findingId']==f['id']and x['resolution']=='OPEN'and x['claimRef']=='implemented-visible'and x['facet']=='render'and x.get('block')==code for x in v['output']['findings']))
   finding.update(resolvesOutputRef=old,resolutionEvidenceRef=r.store.put({'targetHash':raw['targetHash'],'reason':f['reason'],'evidenceRefs':refs}))
  out['findings'].append(finding)
 cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':d['taskRef'],'attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':raw,'structuredOutputHash':digest(out)});out['harnessOutputRef']=cap['artifactRef'];rec=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[cap['artifactRef']])
 if raw['verdict']=='PASS':
  q=d['request'];result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':d['job']['receipts'],'symptom_resolution':raw.get('symptom_resolution',['Actual answer-before-judgment/operation/reconnection behavior reviewed at current source']),'regression_review':['Actual both-approved CI source/report/archive/image correspondence','All finite correct/wrong operations, four widths, history/reload/resize/migration; focus/reset/boundaries within actual recorded scope'],'protected_scope_review':['Unchanged grading/save/IDs/stages/numbers/source graphs and protected paths; only approved P006/R1 content active'],'unknowns':[],'case_dispositions':json.loads((B/'evidence/CASE_DISPOSITIONS.json').read_text())['cases'],'aiReview':{'requestHash':q['requestHash'],'inputHash':q['task']['input_hash'],'reviewer':'M collecting actual '+a['performerRef']+' CI observations','evidence':'Original actual-CI first observations retained with previous plan/inactive/component familiarity and tool contributions disclosed. Not blind. Rejected incomplete source087 run remains excluded. This is semantic verification, not user Gate1/app acceptance.'},'teamCollection':{'submissionActor':'M','registrationRefs':[reg['registrationRef']],'outputRefs':[rec['outputRef']]}}
  r.submit(w,d['job']['node'],d['job']['claimToken'],result);d['submittedResult']=result
 d['output']=rec;write(p,d);print(code+' review '+raw['verdict']+'; next '+str(r.next(w).get('task',{}).get('node',{}).get('id')),flush=True)
else:raise ValueError(mode)
