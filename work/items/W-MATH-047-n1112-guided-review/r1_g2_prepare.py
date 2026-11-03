"""Freeze the actual integrated N11 release for independent cross-audit."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from runner import run_code
from production import ai_request
from team_transport import bind_target,capture_harness,register_task
from store import digest
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047'
assert r.next(w)['task']['node']['id']=='G2_AUDIT@n11'
s=r.state(w);sha=s['release_versions']['n11'];assert sha=='2b7780b97bf8c3bde463742e71bf3e816ea8b562'
feedback={'quote':'いいよ続けて','sourceRef':'chatgpt-page:ac2ac082-94dc-49b5-81f7-85d946bcce1b','replyTo':'CONFIRM_N11_R1_2b7780b9.md','sourceSHA':sha,'blockIds':['n11-06/n11-tg-divide','n11-06/n11-tg-final'],'interpretation':'The continuation reply to the pending visual-confirmation request is treated as limited assent to the two presented checkpoints. Literal wording retained; not a claim of actual app playthrough, proposal approval, publication permission, or quality label.','reviewLabel':'BLOCK-VISUAL-OK','images':['evidence/ci/41635935097/raw/n11-focus/r1-quotient-390-pending.png','evidence/ci/41635935097/raw/n11-focus/r1-quotient-390-correct.png']}
(B/'evidence/R1_GATE1_RESPONSE.json').write_text(json.dumps(feedback,ensure_ascii=False,indent=2)+'\n')
r.user(w,'accept_block',feedback['quote'],feedback['replyTo'],feedback['sourceRef'],block='n11',scope={'visualCheckpoints':feedback['blockIds'],'sourceSHA':sha,'images':feedback['images'],'interpretation':feedback['interpretation']},event_id='w047-r1-visual-ac2ac082')
job=run_code(r,w,{'protected.verify':{},'impact.inventory':{}});q=ai_request(r,w,job['node'])
proof=json.loads((B/'evidence/N11_CI_CAPTURE_REFS.json').read_text());refs=[proof['ciRef'],proof['captureRef'],*proof['screenshotRefs']]
doc={'sourceSHA':sha,'releaseUnit':'n11','requiredInventory':[{'block_id':b['id'],'artifact':p}for b in s['plan']['blocks']if b['release_unit']=='n11'for p in b['sources']],'protectedManifest':s['plan']['protected_manifest'],'ciManifest':json.loads((B/'evidence/N11_CI_VISIBLE_TARGET_2b7780b9.json').read_text()),'scope':'First integrated-release audit of source2b after R1, distinct from prior4a09 G2 and component R07 reviews; all original source/math/47nodes/39answers and wrong gates/figures/numbering/hints/transitions/history/migration/reset390/nextN12/back/protected sixteen paths/correction siblings/historical CI exceptions covered. Other modes statically unaffected; no claim of full other-mode playthrough. N12 baseline only. No publication permission.'}
p=B/'evidence/R1_G2_TARGET.json';p.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n');h=hashlib.sha256(p.read_bytes()).hexdigest();refs.append(r.evidence(w,'file',{'path':str(p.relative_to(R)),'sha256':h},source_ref='Exact integrated release audit target',verification_level='local_execution'))
target=bind_target(r,w,job['node'],'render',job['receipts'],refs,{'integrated-release':h})
a={'assignmentId':'w047-r1-g2-'+q['task']['input_hash'][:12],'roleEpoch':10,'node':job['node'],'block':None,'facet':'render','claimRefs':['integrated-release'],'performerRef':'/root/w047_layout_sourcefirst','role':'reviewer','inputHash':q['task']['input_hash'],'sourceSHA':sha,'artifactHashes':{'integrated-release':h},'allowedPaths':[],'writeMode':'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','dependsOnTasks':[],'budget':{'tokenBudget':None},'independent':True,'targetManifestRef':target['targetManifestRef']}
packet={'baseNodeInputHash':a['inputHash'],'sourceRefs':list(s['plan']['source_manifest']),'authorHistory':[{'claimRef':'integrated-release','facet':'render','block':'n11','semanticContributorRefs':['/root','/root/w046_source_review']}],'contextExposure':{'forkMode':'filtered','authorRationaleVisibleAtFirstPass':False,'previousReviewExposure':'Reviewer has seen draft/local preview and component R07 images. This is the initial observation of the new source2b integrated-release scope, not a new first viewing of each image or a blind review.'}};packet['packetHash']=digest(packet)
c=capture_harness(r,w,{'agentRef':a['performerRef'],'taskRef':'W047-R1-G2-B','parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'target':a['performerRef'],'task':'Read-only integrated-release cross-audit; actual followup_task invoked in this conversation'},'attestationMethod':'transcribed-tool-result'})
reg=register_task(r,w,a,packet,{'agentRef':a['performerRef'],'taskRef':'W047-R1-G2-B','parentRef':'/root','logicalRole':'B','toolResultRef':c['artifactRef'],'attestationMethod':'transcribed-tool-result'})
out={'job':job,'request':q,'assignment':a,'packet':packet,'registration':reg,'evidenceRefs':refs,'target':doc};(B/'evidence/R1_G2_PENDING.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'targetHash':h,'inputHash':a['inputHash'],'inventory':doc['requiredInventory']}),flush=True)
