"""Native technical continuation; external dry-run proof stays distinct from source metadata."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(B),str(R/'workflow')]
from restore_native_snapshots import restore
restore()
from runtime import Runtime
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-TECH-052';mode=sys.argv[1]
def write(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def file_ref(p,source):
 return r.evidence(w,'file',{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},source_ref=source,verification_level='local_execution')
if mode=='approve':
 s=r.state(w);h=hashlib.sha256((B/'G3_PUBLISHER_PROPOSAL.md').read_bytes()).hexdigest();assert h==s['plan']['proposal']['hash'];u='w047-g3-scope-approval-89b1ef8f'
 if u not in s['users']:r.user(w,'approve_proposal','ネットが切れた続けて',h,'conversation:89b1ef8f-3abe-4024-a51f-a390ace3cb16',event_id=u)
 if 'T02_APPROVAL'not in r.state(w)['results']:r.accept(w,'T02_APPROVAL',u)
 write(B/'evidence/G3_TECH_APPROVAL.json',{'proposalHash':h,'userEvent':u,'actualUserRecord':r.state(w)['users'][u],'interpretation':'Continuation of concrete4path/main-based branch/no-delivery dry-run question. No main merge, manualfalse or publication permission. Restored after interrupted unsaved local state; original user source retained.'})
 if 'T03_BUILD'not in r.state(w)['results']and 'T03_BUILD'not in r.state(w)['claims']:r.claim(w,'T03_BUILD','M',seconds=14400)
elif mode=='built':
 proof=json.loads((B/'evidence/G3_PUBLISHER_BRANCH.json').read_text());assert proof['mainBase']=='04b823259a0873235e39099864d454330eed5d81'and len(proof['files'])==4 and proof['publicationAuthorized']is False
 refs=[file_ref(B/'evidence/G3_PUBLISHER_BRANCH.json','Actual initial original-four-path publisher branch creation, independently of failed dry-run')]
 for source in r.state(w)['plan']['blocks'][0]['sources']:refs.append(file_ref(R/source,'Original approved draft matched actual initial6808 branch; repair has separate hash/proof'))
 s=r.state(w);r.tool_result(w,'T03_BUILD',s['claims']['T03_BUILD']['token'],refs)
elif mode=='complete':
 import subprocess
 subprocess.run([sys.executable,str(B/'check_g3_binding.py')],cwd=R,check=True,capture_output=True,text=True)
 subprocess.run([sys.executable,str(B/'restore_g3_reports.py')],cwd=R,check=True,capture_output=True,text=True)
 ci=json.loads((B/'evidence/G3_FINAL_CI.json').read_text());idx=json.loads((B/'evidence/g3-final-ci/ARTIFACT_INDEX.json').read_text());a=json.loads((B/'evidence/G3_ACTUAL_REVIEW_A.json').read_text());b=json.loads((B/'evidence/G3_ACTUAL_REVIEW_B.json').read_text());identity=json.loads((B/'evidence/G3_FINAL_IDENTITY_CHECK.json').read_text())
 pub='6cd11dc1e65810281ed897f865eed3e52b974992';source='f129ba78e496f0ccbce917c762357a81b92b0a2c';meta='188476b10ea366c116409fa46677818569da824b'
 assert r.state(w)['candidate_sha']==meta and not r.integrity(r.state(w))
 assert ci['run']['id']==41754189894 and ci['run']['head_sha']==pub and ci['run']['conclusion']=='success'
 assert {j['name']:j['conclusion'] for j in ci['jobs']['jobs']}=={'verify':'success','publish':'skipped'} and len(ci['deliveryStepsSkipped'])==6
 assert idx['status']=='PASS_ACTUAL_FINAL_ARTIFACT_BYTES' and idx['publisherSHA']==pub and idx['appSourceSHA']==source and idx['archiveSHA256']==ci['artifact']['digest'].removeprefix('sha256:')
 assert a['verdict']=='ACTUAL_DRYRUN_EVIDENCE_SUFFICIENT_FOR_T04_COMPOSITE_CHECK'and not a['findings']and a['identities']['actualPublisher']==pub
 assert b['verdict']=='PASS_ACTUAL_NONPUBLIC_DRY_RUN_ARTIFACT'and b['publisherSHA']==pub and b['sourceSHA']==source and b['runId']==41754189894
 assert all(f['status']=='VERIFIED_FIXED'for f in b['findings']) and identity['originalMetadataManifestPaths']==73 and identity['requiredAppSourcePaths']==69 and identity['actualPublisherFiles']==4
 proof={'status':'PASS_SCOPED_COMPOSITE_TECHNICAL_CHECK','source_sha':meta,'meaningOfSourceSHA':'Original native metadata/input manifest verification target; never asserted as actual GitHub CI head.','actualAppSourceSHA':source,'actualPublisherSHA':pub,'actualCIHeadSHA':ci['run']['head_sha'],'actualRunId':ci['run']['id'],'artifactId':ci['artifact']['id'],'archiveSHA256':idx['archiveSHA256'],'checks':['original73metadataInputsUnchanged','fixedAppSource69PathsCurrentAndGitShowEqual','fourActualPublisherBlobsEqual','original57caTo58daToFinal9b22BoundedRepairChain','actualFinalCIAndSixDeliverySkips','all2665OriginalArtifactHashes','threeOriginalGeneratedManifestsAndMaps','all85Answers236WrongChoicesFourWidths','retainedN08N09N10Operations','focusResetAndBoundaries390Only','actualABReviewAndResolvedEvidenceGap','lossless1212JSONRestoration'],'actualPublicHost':'UNVERIFIED_OUTSIDE_DRYRUN_SCOPE','publicationAuthorized':False,'studentAcceptance':False,'scope':'Approved four-path/main-based nondeployment publisher dry-run only. Original6808 creation and failed/preliminary runs retained.'}
 p=B/'evidence/G3_FINAL_TECHNICAL_CHECK.json';write(p,proof)
 if 'T04_VERIFY'not in r.state(w)['results']:
  refs=[]
  for rel in ['evidence/G3_FINAL_TECHNICAL_CHECK.json','evidence/G3_FINAL_IDENTITY_CHECK.json','evidence/G3_FINAL_CI.json','evidence/G3_FINAL_CI_JOB.log','evidence/g3-final-ci/ARTIFACT_INDEX.json','evidence/g3-final-ci/RAW_JSON_ARCHIVE.json','evidence/g3-final-ci/RAW_JSON.tar.gz','evidence/G3_REPORT_RESTORATION_CHECK.json','evidence/G3_REPORT_STORAGE.json','evidence/G3_ACTUAL_REVIEW_A.json','evidence/G3_ACTUAL_REVIEW_B.json','evidence/G3_REPRESENTATIVE_IMAGES.json','evidence/G3_FINAL_MAIN_PREFLIGHT.json','check_g3_binding.py','restore_g3_reports.py']:
   refs.append(file_ref(B/rel,'Actual final dry-run composite input/output/ZIP/report/review proof; identities distinct'))
  refs.append(r.evidence(w,'check',dict(proof,status='PASS',verificationClass=proof['status']),source_ref='Local original metadata73/current fixedsource69/exactpublisher4 mapping plus actual final-run original evidence and two reviewers; not kind=ci at metadataSHA',verification_level='local_execution'))
  s=r.state(w);r.tool_result(w,'T04_VERIFY',s['claims']['T04_VERIFY']['token'],refs)
 if 'L01_LEARNING'not in r.state(w)['results']:
  refs=r.store.get(r.state(w)['results']['T04_VERIFY']['artifact'])['evidence_refs'];r.claim(w,'L01_LEARNING','M',seconds=14400)
  cases=[{'id':'W047-G3-ENVIRONMENT-PRE-RUN-REJECTION','disposition':'EXISTING_RULE','quality':'UNKNOWN','links':['evidence/G3_DRY_RUN_01_FAILURE.json','evidence/G3_REPAIR_INPUT.json','evidence/G3_FINAL_CI.json'],'lesson':'Keep protected deployment environment on publishing; a nondeployment read-only verification job must be separate. Original failed run remains failed.'},{'id':'G3-B-EVIDENCE-01','disposition':'TEST','quality':'UNKNOWN','links':['evidence/G3_ARTIFACT_COMPLETENESS_REPAIR.json','evidence/g3-final-ci/ARTIFACT_INDEX.json','evidence/G3_ACTUAL_REVIEW_B.json'],'lesson':'Retain original generated manifest bytes. Final actual ZIP independently resolves the missing-evidence finding; preliminary run is not relabelled.'},{'id':'W047-G3-MULTIPLE-IDENTITIES','disposition':'EXISTING_RULE','quality':'UNKNOWN','links':['check_g3_binding.py','evidence/G3_FINAL_TECHNICAL_CHECK.json'],'lesson':'Distinguish original metadata input, appsource, publisher, actual CI head/run and artifact digest; never register different-head CI at metadata SHA.'}]
  assert set(r.state(w)['issues'])<={x['id']for x in cases}
  result={'verdict':'PASS','evidence_refs':refs,'case_updates':cases,'rule_links':['governance/WORK_SYSTEM.md#11','governance/WORK_SYSTEM.md#12A','governance/WORK_SYSTEM.md#12B','docs/MASTER_APP_LESSONS.md'],'regression_links':['check_g3_binding.py','restore_g3_reports.py','evidence/G3_FINAL_CI.json','evidence/G3_REPORT_RESTORATION_CHECK.json'],'unresolved':[],'deduplication':['Technical environment/evidence/identity cases only; existing authorization and exact-source rules retained. No new lesson quality label or duplicated student evaluation.'],'scope_exclusions':['Public main merge/Pages delivery and parent G3_HOST','Student final-app acceptance and parent learning closure']};write(B/'evidence/G3_TECH_LEARNING.json',result);s=r.state(w);r.submit(w,'L01_LEARNING',s['claims']['L01_LEARNING']['token'],result)
 if r.next(w)['status']!='DONE':r.execute(w,'Z01_CLOSE')
 write(B/'evidence/G3_TECH_DONE.json',{'technicalNext':r.next(w),'technicalWork':w,'parentWork':'W-MATH-047','parentNext':r.next('W-MATH-047').get('task',{}).get('node',{}).get('id'),'actualPublisherSHA':pub,'actualAppSourceSHA':source,'publicationAuthorized':False,'studentAcceptance':False})
 render(r,'W-MATH-047',B/'generated')
elif mode!='diagram':raise ValueError(mode)
render(r,w,B/'generated-publisher');print('Next:',r.next(w).get('task',{}).get('node',{}).get('id'),flush=True)
