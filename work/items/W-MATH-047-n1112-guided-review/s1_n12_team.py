"""Bind N12's actual inactive render to source-first reviewers through existing team/1."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import bind_target,capture_harness,register_task,record_output,reconcile_task
from team import project
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';nid='R04_PROPOSAL@n12'
load=lambda p:json.loads(Path(p).read_text())
def write(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
p=load(B/'evidence/n12-R04_PENDING_TEAM.json');tp=B/'evidence/N12_INACTIVE_RENDER_TARGET.json';h=hashlib.sha256(tp.read_bytes()).hexdigest();mode=sys.argv[1]
assert r.task(w,nid)['input_hash']==p['inputHash']
if mode=='prepare':
 refs=list(p['result']['evidence_refs'])
 for f in [tp,B/'evidence/S1_N12_MATERIALIZATION_A.json',B/'MATERIALIZED_N12.json',B/'PATCH_N12.json']:
  refs.append(r.evidence(w,'file',{'path':str(f.relative_to(R)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()},source_ref='Actual inactive N12 render / approved P006 only; not publication or Gate1',verification_level='local_execution'))
 bundles=[]
 for logical,agent,facet,claim,kind in [('A','/root/w047_review_design','design','teaching','source-review'),('B','/root/w047_layout_sourcefirst','render','layout','learner-visible-review')]:
  target=bind_target(r,w,nid,facet,p['job']['receipts'],refs,{claim:h})
  a={'assignmentId':'w047-s1-n12-render-'+logical+'-'+p['inputHash'][:10],'roleEpoch':8,'node':nid,'block':'n12','facet':facet,'claimRefs':[claim],'performerRef':agent,'role':'reviewer','inputHash':p['inputHash'],'sourceSHA':r.state(w)['plan']['source_sha'],'artifactHashes':{claim:h},'allowedPaths':[],'writeMode':'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','dependsOnTasks':[],'budget':{'tokenBudget':None},'independent':True,'targetManifestRef':target['targetManifestRef']}
  packet={'baseNodeInputHash':a['inputHash'],'sourceRefs':r.state(w)['plan']['blocks'][1]['sources'],'authorHistory':[{'claimRef':claim,'facet':facet,'block':'n12','semanticContributorRefs':['/root','/root/w046_render_review']}],'contextExposure':{'forkMode':'filtered','authorRationaleVisibleAtFirstPass':False,'priorExposure':'P006 plan/old IR/source and S1 known; fresh actual render observed before capture report/manifest commentary. Not blind. B assisted capture-tool code, not lesson content.'}}
  packet['packetHash']=digest(packet)
  task='W047-S1-N12-actual-render-'+logical
  cap=capture_harness(r,w,{'agentRef':agent,'taskRef':task,'parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'target':agent,'actualTask':'Primary source first, then new actual render PNGs before capture diagnostic/report; preserve first observations and prior exposure'},'attestationMethod':'transcribed-tool-result'})
  harness={'agentRef':agent,'taskRef':task,'parentRef':'/root','logicalRole':logical,'toolResultRef':cap['artifactRef'],'attestationMethod':'transcribed-tool-result'}
  reg=register_task(r,w,a,packet,harness);bundles.append({'logical':logical,'assignment':a,'packet':packet,'harness':harness,'registration':reg,'reviewKind':kind,'evidenceRefs':refs})
 write(B/'evidence/S1_N12_R04_TEAM.json',bundles);print('N12 actual-render target bound '+h,flush=True)
elif mode=='collect':
 regs=[];outputs=[];allpass=True
 for bundle in load(B/'evidence/S1_N12_R04_TEAM.json'):
  a=bundle['assignment'];reg=bundle['registration'];refs=bundle['evidenceRefs'];raw=load(B/('evidence/N12_INACTIVE_FIRST_'+bundle['logical']+'.json'))
  assert raw['targetHash']==h and raw['sourceFirst'] and raw['firstPass'] and raw['authorSeparation']
  first=r.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'rawFirstObservations':raw['firstObservations'],'rawReport':raw})
  out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'performerRef':a['performerRef'],'verdict':raw['verdict'],'findings':[],'claimRef':a['claimRefs'][0],'facet':a['facet'],'targetHash':h,'reviewKind':bundle['reviewKind'],'authorSeparation':True,'sourceFirst':True,'firstPass':True,'firstPassArtifactRef':first,'evidenceRefs':refs,'rationale':raw['rationale']}
  for f in raw.get('findings',[]):
   if f.get('status')not in ('OPEN','UNRESOLVED','VERIFIED_FIXED'):continue
   finding={'findingId':f['id'],'claimRef':a['claimRefs'][0],'facet':a['facet'],'reason':f['reason'],'evidenceRefs':refs,'resolution':'VERIFIED_FIXED'if f['status']=='VERIFIED_FIXED'else'OPEN','affectedRefs':f.get('targetIds',[])}
   if finding['resolution']=='VERIFIED_FIXED':
    history=project(r.store.events(),w);old=next(ref for ref,v in history['outputs'].items()if any(x['findingId']==f['id']and x['resolution']=='OPEN'and x['claimRef']==a['claimRefs'][0]and x['facet']==a['facet']and x.get('block')=='n12'for x in v['output']['findings']))
    finding.update(resolvesOutputRef=old,resolutionEvidenceRef=r.store.put({'targetHash':h,'reason':f['reason'],'evidenceRefs':refs}))
   out['findings'].append(finding)
  cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':bundle['harness']['taskRef'],'attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':raw,'structuredOutputHash':digest(out)})
  out['harnessOutputRef']=cap['artifactRef'];rec=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[cap['artifactRef']]);regs.append(reg['registrationRef']);outputs.append(rec['outputRef']);allpass=allpass and raw['verdict']=='PASS'
 result=p['result'];result['evidence_refs']=refs;result['teamCollection']={'submissionActor':'M','registrationRefs':regs,'outputRefs':outputs}
 result['aiReview']['evidence']='Existing math/teaching/step/blank/prose/figure CODE at exact approved P006 IR plus independent first actual inactive-render observations. Prior plan exposure and B capture-tool assistance disclosed. Authored candidate remains inactive until R05/R06; CI/learner acceptance not inferred.'
 if allpass:r.submit(w,nid,p['job']['claimToken'],result)
 write(B/'evidence/S1_N12_R04_RESULT.json',{'result':result,'targetHash':h,'submitted':allpass});print('N12 R04 submitted='+str(allpass),flush=True)
else:raise ValueError(mode)
