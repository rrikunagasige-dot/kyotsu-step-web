"""Bind actual first observations of the new inactive render, not an old IR layout."""
import sys,json,hashlib,shutil
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import bind_target,capture_harness,register_task,record_output,reconcile_task
from store import digest
from team import project
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';mode=sys.argv[1]
load=lambda p:json.loads(Path(p).read_text())
def write(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
p=load(B/'evidence/R1_R04_PENDING.json');nid=p['job']['node'];h=hashlib.sha256((B/'evidence/R1_RENDER_TARGET.json').read_bytes()).hexdigest()
if mode=='prepare':
 refs=list(p['result']['evidence_refs'])
 for path in [B/'evidence/R1_RENDER_TARGET.json',B/'r1_relocation.py',B/'evidence/R1_RELOCATION_CONTRACT.json',*sorted((B/'evidence/r1-inactive-preview').glob('r1-quotient-*.png'))]:refs.append(r.evidence(w,'file',{'path':str(path.relative_to(R)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},source_ref='Actual isolated inactive candidate render / exact approved migration; not publication evidence',verification_level='local_execution'))
 bundles=[]
 for logical,agent,facet,claim,kind in [('A','/root/w047_review_design','design','teaching','source-review'),('B','/root/w047_layout_sourcefirst','render','layout','learner-visible-review')]:
  target=bind_target(r,w,nid,facet,p['job']['receipts'],refs,{claim:h});a={'assignmentId':'w047-r1-render-r04-'+logical+'-'+p['request']['task']['input_hash'][:10],'roleEpoch':7,'node':nid,'block':'n11','facet':facet,'claimRefs':[claim],'performerRef':agent,'role':'reviewer','inputHash':p['request']['task']['input_hash'],'sourceSHA':r.state(w)['plan']['source_sha'],'artifactHashes':{claim:h},'allowedPaths':[],'writeMode':'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','dependsOnTasks':[],'budget':{'tokenBudget':None},'independent':True,'targetManifestRef':target['targetManifestRef']}
  packet={'baseNodeInputHash':a['inputHash'],'sourceRefs':r.state(w)['plan']['blocks'][0]['sources'],'authorHistory':[{'claimRef':claim,'facet':facet,'block':'n11','semanticContributorRefs':['/root','/root/w046_source_review']}],'contextExposure':{'forkMode':'filtered','authorRationaleVisibleAtFirstPass':False,'priorExposure':'Both know draft plan; first actual images of the newly compiled inactive candidate seen before manifest/author capture report. Not blind. Historical IR is not used as a layout target.'}};packet['packetHash']=digest(packet)
  history=project(r.store.events(),w)
  originals=[v for v in history['registrations'].values()if v['assignment']['performerRef']==agent and v['assignment']['node']==nid and v['assignment']['artifactHashes'].get(claim)==h]
  if originals:
   original=originals[-1];a['roleEpoch']=original['assignment']['roleEpoch']+1
   packet['contextExposure']['historicalUnchangedRenderRebind']={'originalRegistrationRef':original['registrationRef'],'unchangedTargetHash':h,'newFirstPassClaimed':False,'originalHarnessRetained':True}
   packet['packetHash']=digest({k:v for k,v in packet.items()if k!='packetHash'})
   harness=original['harness']
  else:
   cap=capture_harness(r,w,{'agentRef':agent,'taskRef':'W047-R1-R04-'+logical,'parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'target':agent,'actualTask':'Source first, then actual new render PNGs; no manifest/capture report until first observations fixed'},'attestationMethod':'transcribed-tool-result'})
   harness={'agentRef':agent,'taskRef':'W047-R1-R04-'+logical,'parentRef':'/root','logicalRole':logical,'toolResultRef':cap['artifactRef'],'attestationMethod':'transcribed-tool-result'}
  reg=register_task(r,w,a,packet,harness)
  bundles.append({'logical':logical,'assignment':a,'packet':packet,'registration':reg,'kind':kind,'evidenceRefs':refs})
 write(B/'evidence/R1_R04_TEAM.json',bundles);print(json.dumps({'targetHash':h,'nativeOriginalSourceSHA':r.state(w)['plan']['source_sha'],'inactiveCandidate':'R1_RENDER_TARGET.json','registrationCount':len(bundles)}),flush=True)
elif mode=='collect':
 refs=[];regs=[];evs=[]
 for bundle in load(B/'evidence/R1_R04_TEAM.json'):
  logical=bundle['logical'];raw=load('/tmp/w047-r1-render-first-'+logical.lower()+'.json');a=bundle['assignment'];reg=bundle['registration'];evs=bundle['evidenceRefs']
  history=project(r.store.events(),w)
  candidates=[(ref,v)for ref,v in history['outputs'].items()if history['registrations'][v['registrationRef']]['assignment']['performerRef']==a['performerRef']and history['registrations'][v['registrationRef']]['assignment']['node']==nid and history['registrations'][v['registrationRef']]['assignment']['inputHash']==a['inputHash']and v['output'].get('targetHash')==h]
  if candidates:
   latest=history['registrations'][candidates[-1][1]['registrationRef']];a=latest['assignment'];reg={'registrationRef':candidates[-1][1]['registrationRef'],'assignmentHash':latest['assignmentHash']};bundle['assignment']=a;bundle['registration']=reg
  assert raw['targetHash']==h and raw['firstPass']and raw['sourceFirst']and raw['authorSeparation']and raw['verdict']in ['PASS','PASS_FIRST_RENDER_OBSERVATION'],raw
  previous=[(ref,v)for ref,v in project(r.store.events(),w)['outputs'].items()if v['registrationRef']==reg['registrationRef']]
  if previous and r.store.get(previous[-1][1]['output']['firstPassArtifactRef']).get('rawReport')==raw:
   refs.append(previous[-1][0]);regs.append(reg['registrationRef']);continue
  if previous:
   a=dict(a);a['assignmentId']+='-supplement';a['roleEpoch']+=1
   launch=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':'W047-R1-R04-'+logical,'parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'actualTask':'Verify old P006 resolution against newly captured source-matched images; preserve original first observations'},'attestationMethod':'transcribed-tool-result'})
   reg=register_task(r,w,a,bundle['packet'],{'agentRef':a['performerRef'],'taskRef':'W047-R1-R04-'+logical,'parentRef':'/root','logicalRole':logical,'toolResultRef':launch['artifactRef'],'attestationMethod':'transcribed-tool-result'})
   bundle['assignment']=a;bundle['registration']=reg
  dst=B/('evidence/R1_R04_'+logical+'_RAW.json');shutil.copyfile('/tmp/w047-r1-render-first-'+logical.lower()+'.json',dst)
  first=r.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'rawFirstObservations':raw.get('firstObservations',raw.get('observations')),'rawReport':raw})
  out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'performerRef':a['performerRef'],'verdict':'PASS','findings':[],'claimRef':a['claimRefs'][0],'facet':a['facet'],'targetHash':h,'reviewKind':bundle['kind'],'authorSeparation':raw['authorSeparation'],'sourceFirst':raw['sourceFirst'],'firstPass':raw['firstPass'],'firstPassArtifactRef':first,'evidenceRefs':evs,'rationale':raw.get('rationale','Original first actual render observations and exact image hashes; prior plan exposure disclosed, not blind.')}
  for f in raw.get('findings',[]):
   if f.get('status')=='VERIFIED_FIXED':
    history=project(r.store.events(),w)
    oldref=next(ref for ref,v in history['outputs'].items()if any(x['findingId']==f['id']and x['resolution']=='OPEN'and x['claimRef']==a['claimRefs'][0]and x['facet']==a['facet']for x in v['output']['findings']))
    proof=r.store.put({'targetHash':h,'reason':f['reason'],'evidenceRefs':evs})
    out['findings'].append({'findingId':f['id'],'claimRef':a['claimRefs'][0],'facet':a['facet'],'reason':f['reason'],'evidenceRefs':evs,'resolution':'VERIFIED_FIXED','resolvesOutputRef':oldref,'resolutionEvidenceRef':proof})
  cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':'W047-R1-R04-'+logical,'attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':raw,'structuredOutputHash':digest(out)});out['harnessOutputRef']=cap['artifactRef'];rec=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[cap['artifactRef']]);refs.append(rec['outputRef']);regs.append(reg['registrationRef'])
 result=p['result'];result['evidence_refs']=evs;result['teamCollection']={'submissionActor':'M','registrationRefs':regs,'outputRefs':refs};result['aiReview']['evidence']='First actual new inactive render reviewed independently by A/B after primary source and before capture manifest; previous plan exposure disclosed. Full compiled display target replaces old IR-only layout target. Migration CODE separately tested and reviewed.'
 r.submit(w,nid,p['job']['claimToken'],result);write(B/'evidence/R1_R04_ACCEPTED.json',{'result':result,'targetHash':h});print('R04 new actual render accepted; next '+r.next(w)['task']['node']['id'],flush=True)
else:raise ValueError(mode)
