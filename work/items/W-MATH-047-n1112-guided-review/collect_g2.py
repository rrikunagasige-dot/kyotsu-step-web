"""Keep the actual repeated-review flags and record a failed cross-audit."""
import sys,json,hashlib,shutil
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import capture_harness,record_output,reconcile_task
from store import digest
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047'
p=json.loads((B/'evidence/N11_G2_PENDING.json').read_text());refs=list(p['evidenceRefs']);a=p['assignment'];reg=p['registration']
from team import project
history=project(r.store.events(),w)
existing=[(ref,v)for ref,v in history['outputs'].items()if v['registrationRef']==reg['registrationRef']]
if existing:
 recorded={'outputRef':existing[-1][0]};refs=existing[-1][1]['output']['evidenceRefs'];raw=json.loads((B/'evidence/N11_G2_B_RAW.json').read_text())
else:
 for role in ['a','b']:
  path=B/f'evidence/N11_G2_{role.upper()}_RAW.json';shutil.copyfile(f'/tmp/w047-g2-{role}.json',path)
  refs.append(r.evidence(w,'file',{'path':str(path.relative_to(R)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},source_ref=f'Actual subagent {role.upper()} cross-audit report',verification_level='local_execution'))
 raw=json.loads((B/'evidence/N11_G2_B_RAW.json').read_text());assert raw['targetHash']==a['artifactHashes']['integrated-release'] and raw['verdict']=='FAIL'
 first=r.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':p['packet']['packetHash'],'rawFirstObservations':raw['firstObservations'],'rawReport':raw})
 out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':p['packet']['packetHash'],'performerRef':a['performerRef'],'verdict':'FAIL','findings':[{'findingId':f['id'],'claimRef':'integrated-release','facet':'render','reason':f['reason'],'evidenceRefs':refs,'resolution':'OPEN','affectedRefs':f.get('targetIds',f.get('affectedRefs',['n11-06','n11-tg-divide','n11-tg-final']))}for f in raw['findings']],'claimRef':'integrated-release','facet':'render','targetHash':raw['targetHash'],'reviewKind':'learner-visible-review','authorSeparation':raw['authorSeparation'],'sourceFirst':raw['sourceFirst'],'firstPass':raw['firstPass'],'firstPassArtifactRef':first,'evidenceRefs':refs,'rationale':raw['rationale']}
 cap=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':'W047-N11-G2-B','attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':raw,'structuredOutputHash':digest(out)});out['harnessOutputRef']=cap['artifactRef'];recorded=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[cap['artifactRef']])
rows=[{'surface':x['surface'],'status':x['status'],'version':a['sourceSHA'],'evidence_refs':refs,'observation':x}for x in raw['rows']]
rows.extend({'surface':'Required source inventory','block_id':x['block_id'],'artifact':x['artifact'],'version':a['sourceSHA'],'status':'FAIL'if x['artifact'].endswith('n11Transformation.json')else'PASS','evidence_refs':refs}for x in raw['requiredInventory'])
q=p['request'];result={'verdict':'FAIL','evidence_refs':refs,'capability_receipts':p['job']['receipts'],'audit_rows':rows,'release_readiness':'BLOCKED','impact_sweep_completion':'BLOCKED','audit_method':{'method':'Source-first independent repeated integrated-release review plus supplementary pedagogy monitoring; actual source-bound CI and protected-byte checks','reviewer':a['performerRef'],'independent':True,'independence_evidence':'B is not an author of this integrated render; prior constituent R07 exposure explicitly disclosed. firstPass=false retained.'},'unknowns':[x for x in raw['rows']if x['status']=='UNVERIFIED'],'aiReview':{'requestHash':q['requestHash'],'inputHash':q['task']['input_hash'],'reviewer':'M integrates actual A/B reports without promoting technical PASS to meaning PASS','evidence':raw['rationale']},'teamCollection':{'submissionActor':'M','registrationRefs':[],'outputRefs':[]},'nonPassingTeamEvidence':{'registrationRef':reg['registrationRef'],'outputRef':recorded['outputRef'],'reason':'Actual firstPass=false report preserved in native output. It cannot satisfy the required firstPass=true PASS contract; no required-scope PASS is asserted.'}}
r.submit(w,p['job']['node'],p['job']['claimToken'],result)
issue=r.issue(w,{'id':'W047-G2-L01','block':'n11','root_cause':'UNSOLVED_QUOTIENT_REVEALED_BY_CONCURRENT_COMPLETED_ROW','evidence_refs':refs,'description':raw['findings'][0]['reason'],'version':a['sourceSHA'],'origin':'G2 independent cross-audit','proposalRef':'work/items/W-MATH-047-n1112-guided-review/G2_CORRECTION_PROPOSAL.md'})
(B/'evidence/N11_G2_RESULT.json').write_text(json.dumps({'result':result,'nativeOutputRef':recorded['outputRef'],'issue':issue,'next':r.next(w)},ensure_ascii=False,indent=2)+'\n');render(r,w,B/'generated');print(json.dumps({'issue':issue,'next':r.next(w)},ensure_ascii=False),flush=True)
