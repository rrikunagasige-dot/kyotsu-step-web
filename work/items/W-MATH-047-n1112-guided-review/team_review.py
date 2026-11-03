"""Bind real source-first reviewer tasks to the existing team/1 transport."""
import json,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from store import digest
from team_transport import bind_target,capture_harness,register_task,record_output,reconcile_task
from production import ai_request
from views import render
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);W='W-MATH-047'
def load(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
mode,code=sys.argv[1:3];jobfile=B/('evidence/'+code+'-R04_PENDING_TEAM.json');job=load(jobfile);nid='R04_PROPOSAL@'+code
if mode=='register':
 registrations=[]
 for role,facet,claim,kind in [('A','design','teaching','source-review'),('B','render','layout','learner-visible-review')]:
  agent='/root/w047_review_'+role.lower();harnessTask='W047-'+code+'-'+role+'-source-first'
  rawResult={'task_name':agent} if code=='n11' else ''
  captured=capture_harness(rt,W,dict(agentRef=agent,taskRef=harnessTask,parentRef='/root',toolName='collaboration.spawn_agent'if code=='n11'else'collaboration.followup_task',rawResult=rawResult,attestationMethod='transcribed-tool-result'))
  irhash=load(B/('evidence/'+code+'-candidate-compile-ir.json'))['compiled']['irHash']
  target=bind_target(rt,W,nid,facet,job['job']['receipts'],job['result']['evidence_refs'],artifact_hashes={claim:irhash})
  s=rt.state(W);a=dict(assignmentId='w047-'+code+'-'+claim,roleEpoch=1,node=nid,block=code,facet=facet,claimRefs=[claim],performerRef=agent,role='reviewer',inputHash=job['inputHash'],sourceSHA=s['plan']['source_sha'],artifactHashes={claim:irhash},allowedPaths=['work/items/W-MATH-047-n1112-guided-review/REVIEW_'+code.upper()+('_DESIGN_FIRST_A.json'if role=='A'else'_LAYOUT_FIRST_B.json')],writeMode='OWN_OUTPUT_ONLY',dependsOnTasks=[],budget={'tokenBudget':None},independent=True,targetManifestRef=target['targetManifestRef'])
  packet=dict(baseNodeInputHash=job['inputHash'],sourceRefs=s['plan']['blocks'][0 if code=='n11'else 1]['sources'],authorHistory=[dict(claimRef=claim,facet=facet,semanticContributorRefs=['/root','/root/w046_source_review'if code=='n11'else'/root/w046_render_review'])],nativeEvidenceRefs=job['result']['evidence_refs'],contextExposure=dict(forkMode='none'if code=='n11'else'all',authorRationaleVisibleAtFirstPass=False))
  packet['packetHash']=digest(packet)
  harness=dict(agentRef=agent,taskRef=harnessTask,parentRef='/root',logicalRole=role,toolResultRef=captured['artifactRef'],attestationMethod='transcribed-tool-result')
  registered=register_task(rt,W,a,packet,harness);registrations.append(dict(role=role,facet=facet,claim=claim,kind=kind,assignment=a,packet=packet,harness=harness,registered=registered))
 write(B/('evidence/'+code+'-TEAM_REGISTRATIONS.json'),registrations)
 print('Registered real reviewer tasks',code,flush=True)
elif mode=='collect':
 refs=[];regs=load(B/('evidence/'+code+'-TEAM_REGISTRATIONS.json'))
 imports=[]
 import subprocess,hashlib
 requests=load(B/('evidence/'+code+'-PUBLIC_REVIEW_REQUESTS.json'))
 for reg in regs:
  role=reg['role'];name='REVIEW_'+code.upper()+('_DESIGN_FIRST_A.json'if role=='A'else'_LAYOUT_FIRST_B.json');report=load(B/name)
  supplementName='REVIEW_'+code.upper()+('_DESIGN_SUPPLEMENT_A.json'if role=='A'else'_LAYOUT_SUPPLEMENT_B.json');supplement=load(B/supplementName)if (B/supplementName).exists()else report
  verdict=supplement.get('staticVerdict',supplement.get('verdict'));assert verdict in ('PASS','FAIL','UNVERIFIED')
  responses=report.get('responses',report.get('rows'));assert len(responses)==3
  for request,response in zip(requests['rows'],responses):
   if 'response'in response:response=response['response']
   assert response['requestHash']==request['request']['requestHash']
   payload=dict(request=request['request'],response=response)
   proc=subprocess.run(['node','tools/textbook/operations.mjs','solution-review'],input=json.dumps(payload),cwd=R,text=True,capture_output=True)
   checked=json.loads(proc.stdout);assert checked['status']in('PASS','NEEDS_AI_REVIEW'),checked
   imports.append(dict(reviewer=reg['harness']['agentRef'],node=request['id'],status=checked['status'],review=checked))
  first=rt.store.put(dict(assignmentHash=reg['registered']['assignmentHash'],packetHash=reg['packet']['packetHash'],reportPath=name,reportSHA256=hashlib.sha256((B/name).read_bytes()).hexdigest(),rawReport=report))
  output=dict(kind='review',assignmentHash=reg['registered']['assignmentHash'],packetHash=reg['packet']['packetHash'],performerRef=reg['harness']['agentRef'],verdict=verdict,findings=report.get('findings',[]),claimRef=reg['claim'],facet=reg['facet'],targetHash=next(iter(reg['assignment']['artifactHashes'].values())),reviewKind=reg['kind'],authorSeparation=True,sourceFirst=True,firstPass=True,firstPassArtifactRef=first,evidenceRefs=job['result']['evidence_refs'],rationale=supplement.get('staticVerdictScope',supplement.get('verdictScope','R04 static proposal only; rendered UI not verified.')))
  captured=capture_harness(rt,W,dict(agentRef=reg['harness']['agentRef'],taskRef=reg['harness']['taskRef'],parentRef='/root',toolName='collaboration.agent_result',attestationMethod='transcribed-tool-result',channel='subagent-final',rawResult=dict(firstReport=report,supplement=supplement),structuredOutputHash=digest(output)))
  output['harnessOutputRef']=captured['artifactRef'];recorded=record_output(rt,W,reg['registered']['registrationRef'],output);refs.append(recorded['outputRef'])
  reconcile_task(rt,W,reg['registered']['registrationRef'],'COMPLETED',[captured['artifactRef']])
 write(B/('evidence/'+code+'-U07_REVIEW_IMPORTS.json'),dict(status='PASS_BOUNDED'if all(x['status']!='FAIL'for x in imports)else'FAIL',imports=imports,pendingImplementationChecks='Initial geometry case UNRESOLVED remains future R06/R07; supplements explicitly limit PASS to static R04. No candidate image/geometry PASS inferred.'))
 result=job['result'];result['teamCollection']=dict(submissionActor='M',registrationRefs=[r['registered']['registrationRef']for r in regs],outputRefs=refs)
 result['pendingImplementationChecks']=['Four-width actual images/geometry','Completed-state reconnection and grading/save regression','Existing main user review/publication gates']
 rt.submit(W,nid,job['job']['claimToken'],result);render(rt,W,B/'generated');write(B/'evidence/RUNTIME_CURRENT.json',rt.next(W));print('Submitted source-first R04',code,flush=True)
else:raise ValueError(mode)
