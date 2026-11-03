"""Current both-unit integrated audit, using native CODE/team/1 without publication."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from production import ai_request
from team_transport import bind_target,capture_harness,register_task,record_output,reconcile_task
from team import project
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';mode=sys.argv[1];code=sys.argv[2]if len(sys.argv)>2 else'n11'
load=lambda p:json.loads(Path(p).read_text())
def write(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
if mode=='visual':
 s=r.state(w);assert s['candidate_sha']=='f129ba78e496f0ccbce917c762357a81b92b0a2c';u='w047-s1-n12-visual-ed7d140b';doc='CONFIRM_N12_S1_f129ba78.md'
 feedback={'quote':'いいよ続けて','sourceRef':'conversation:ed7d140b-e4e3-4731-ba1f-f54a8419f35c','replyTo':doc,'sourceSHA':s['candidate_sha'],'interpretation':'Assent to the four-point/five-node N12 actual-image checkpoint previously requested. Not publication permission, full-app acceptance, or a quality-training label.','images':load(B/'evidence/S1_CONFIRMATION_IMAGES.json')['files'],'reviewLabel':'BLOCK-VISUAL-OK'}
 write(B/'evidence/S1_N12_GATE1_RESPONSE.json',feedback)
 if u not in s['users']:r.user(w,'accept_block',feedback['quote'],doc,feedback['sourceRef'],block='n12',scope={'sourceSHA':s['candidate_sha'],'visualCheckpoints':['n12-01','n12-q04-left-end/n12-04','n12-07','n12-q13-operation'],'interpretation':feedback['interpretation']},event_id=u)
 print('N12 actual visual assent recorded; no app acceptance/publication inferred',flush=True)
elif mode=='prepare':
 assert r.next(w)['task']['node']['id']=='G2_AUDIT@'+code;s=r.state(w);sha=s['candidate_sha'];assert sha=='f129ba78e496f0ccbce917c762357a81b92b0a2c'
 job=run_code(r,w,{'protected.verify':{},'impact.inventory':{}});q=ai_request(r,w,job['node']);refs=[]
 for c in ['N11','N12']:
  p=load(B/('evidence/'+c+'_CI_CAPTURE_REFS.json'));assert p['n11Mode']==p['n12Mode']=='APPROVED';refs.extend([p['ciRef'],p['captureRef'],*p['screenshotRefs']])
 doc={'sourceSHA':sha,'releaseUnits':['n11','n12'],'requiredInventory':[{'block_id':b['id'],'artifact':p}for b in s['plan']['blocks']for p in b['sources']],'protectedManifest':s['plan']['protected_manifest'],'ciRun':41657273611,'scope':'One integrated both-unit source audit, two native unit records. Original source/math/96nodes/85answers/236wrong options/four widths/figures/gates/numbering/hints/transitions/history/migration/reset390/boundaries/protected paths/correction history. Other modes static nonimpact only. No publication or app acceptance.'}
 tp=B/'evidence/S1_G2_TARGET.json'
 if tp.exists():assert load(tp)==doc
 else:write(tp,doc)
 h=hashlib.sha256(tp.read_bytes()).hexdigest();refs=list(dict.fromkeys(refs));refs.append(r.evidence(w,'file',{'path':str(tp.relative_to(R)),'sha256':h},source_ref='Exact current both-unit integrated release target',verification_level='local_execution'))
 target=bind_target(r,w,job['node'],'render',job['receipts'],refs,{'integrated-release':h});a={'assignmentId':'w047-s1-g2-'+code+'-'+q['task']['input_hash'][:12],'roleEpoch':12 if code=='n11'else 13,'node':job['node'],'block':None,'facet':'render','claimRefs':['integrated-release'],'performerRef':'/root/w047_layout_sourcefirst','role':'reviewer','inputHash':q['task']['input_hash'],'sourceSHA':sha,'artifactHashes':{'integrated-release':h},'allowedPaths':[],'writeMode':'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','dependsOnTasks':[],'budget':{'tokenBudget':None},'independent':True,'targetManifestRef':target['targetManifestRef']}
 packet={'baseNodeInputHash':a['inputHash'],'sourceRefs':list(s['plan']['source_manifest']),'authorHistory':[{'claimRef':'integrated-release','facet':'render','block':b['id'],'semanticContributorRefs':['/root','/root/w046_source_review'if b['id']=='n11'else'/root/w046_render_review']}for b in s['plan']['blocks']],'contextExposure':{'forkMode':'filtered','authorRationaleVisibleAtFirstPass':False,'priorExposure':'P006/R1/inactive/component R07 known. First observation of current both-unit integrated target, not blind. B capture/import tool contributor, not lesson author. Same actual integrated review transcribed per native unit, not two independent evaluations.'}};packet['packetHash']=digest(packet)
 cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':'W047-S1-G2-B','parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'target':a['performerRef'],'actualTask':'Both-unit integrated source-first cross-audit launched before this binding; target hash supplied after initial observation preservation'},'attestationMethod':'transcribed-tool-result'})
 reg=register_task(r,w,a,packet,{'agentRef':a['performerRef'],'taskRef':'W047-S1-G2-B','parentRef':'/root','logicalRole':'B','toolResultRef':cap['artifactRef'],'attestationMethod':'transcribed-tool-result'})
 write(B/('evidence/S1_G2_'+code+'_PENDING.json'),{'job':job,'request':q,'assignment':a,'packet':packet,'registration':reg,'evidenceRefs':refs,'target':doc});print('Prepared '+code+' target '+h,flush=True)
elif mode=='collect':
 p=load(B/('evidence/S1_G2_'+code+'_PENDING.json'));a=p['assignment'];reg=p['registration'];raw=load('/tmp/w047-s1-g2-b-bound.json');monitor=load('/tmp/w047-s1-g2-a.json');refs=p['evidenceRefs'];assert raw['targetHash']==a['artifactHashes']['integrated-release']and raw['sourceSHA']==a['sourceSHA'];assert raw['firstPass']and raw['sourceFirst']and raw['authorSeparation']
 write(B/'evidence/S1_G2_A_RAW.json',monitor);write(B/'evidence/S1_G2_B_RAW.json',raw)
 first=r.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':p['packet']['packetHash'],'rawFirstObservations':raw['firstObservations'],'rawReport':raw,'scope':'One actual both-unit integrated observation; per-unit transcriptions are not additional first observations or independent ratings'})
 out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':p['packet']['packetHash'],'performerRef':a['performerRef'],'verdict':raw['verdict'],'findings':[],'claimRef':'integrated-release','facet':'render','targetHash':raw['targetHash'],'reviewKind':'learner-visible-review','authorSeparation':True,'sourceFirst':True,'firstPass':True,'firstPassArtifactRef':first,'evidenceRefs':refs,'rationale':raw['rationale']}
 for f in raw.get('findings',[]):
  if f.get('status')not in ['OPEN','UNRESOLVED','VERIFIED_FIXED']:continue
  finding={'findingId':f['id'],'claimRef':'integrated-release','facet':'render','reason':f['reason'],'evidenceRefs':refs,'resolution':'VERIFIED_FIXED'if f['status']=='VERIFIED_FIXED'else'OPEN','affectedRefs':f.get('targetIds',[])}
  if finding['resolution']=='VERIFIED_FIXED':
   old=next(ref for ref,v in project(r.store.events(),w)['outputs'].items()if any(x['findingId']==f['id']and x['resolution']=='OPEN'and x['claimRef']=='integrated-release'and x['facet']=='render'and x.get('block')is None for x in v['output']['findings']));finding.update(resolvesOutputRef=old,resolutionEvidenceRef=r.store.put({'targetHash':raw['targetHash'],'reason':f['reason'],'evidenceRefs':refs}))
  out['findings'].append(finding)
 cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':'W047-S1-G2-B','attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':raw,'structuredOutputHash':digest(out)});out['harnessOutputRef']=cap['artifactRef'];rec=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[cap['artifactRef']])
 if raw['verdict']=='PASS'and monitor['verdict'].startswith('PASS'):
  rows=[{'surface':x['surface'],'status':x['status'],'version':a['sourceSHA'],'evidence_refs':refs,'observation':x}for x in raw['rows']];rows.extend({'surface':'Required source inventory','block_id':x['block_id'],'artifact':x['artifact'],'version':a['sourceSHA'],'status':'PASS','evidence_refs':refs}for x in p['target']['requiredInventory'])
  q=p['request'];result={'verdict':'PASS','evidence_refs':refs,'capability_receipts':p['job']['receipts'],'audit_rows':rows,'release_readiness':'READY','impact_sweep_completion':'QUEUED','audit_method':{'method':'Current actual both-unit source/CI/first integrated observations and original findings/protected inventory','reviewer':a['performerRef'],'independent':True,'independence_evidence':'B did not author lesson text/render; earlier component exposure and capture/import assistance disclosed. One both-unit audit, two native records, not blind/model-independent.'},'unknowns':[],'deferred_scope':['G3 hosting/publication permission and actual full-app acceptance','Formal post-acceptance impact sweep/learning/closure; original historical CI failures retained'],'aiReview':{'requestHash':q['requestHash'],'inputHash':q['task']['input_hash'],'reviewer':'M integrates actual A pedagogy/workflow monitoring and B current integrated cross-audit','evidence':'Actual source/CI/images and full required inventory audited. Original findings resolved only with current target evidence. No unsupported all-mode or all-history-row visual claim.'},'teamCollection':{'submissionActor':'M','registrationRefs':[reg['registrationRef']],'outputRefs':[rec['outputRef']]}}
  r.submit(w,p['job']['node'],p['job']['claimToken'],result);write(B/('evidence/S1_G2_'+code+'_RESULT.json'),{'result':result,'nativeOutputRef':rec['outputRef']})
 print('Collected '+code+' '+raw['verdict']+'; next '+str(r.next(w).get('task',{}).get('node',{}).get('id')),flush=True)
else:raise ValueError(mode)
