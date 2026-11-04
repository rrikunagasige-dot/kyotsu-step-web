"""Root-only native R04 preparation; no product patch or user approval."""
from pathlib import Path
import json,sys,hashlib,base64,os
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(R/'work/items/W-MATH-047-n1112-guided-review')]
from restore_native_snapshots import restore
restore()
from restore_w048_snapshots import restore_w048
restore_w048()
from runtime import Runtime
from capabilities import run_capability
from production import ai_request
from store import digest
from views import render
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-048'
def load(p):return json.loads((B/p).read_text())
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def evidence(paths):return[r.evidence(w,'file',{'path':str((B/p).relative_to(R)),'sha256':sha(B/p)},source_ref='W048 full-copy design/prototype; not applied product or hosted acceptance',verification_level='local_execution')for p in paths]
epoch=int(os.environ.get('W048_EPOCH','1'));pre='r'+str(epoch)+'/'if epoch>=2 else'';proposal='P'+str(epoch).zfill(3)+'_FINAL.md';design=pre+'DESIGN_INPUTS.json'
mode=sys.argv[1]
if mode=='revise':
 p=r.state(w)['plan'];assert not r.state(w)['claims'];p['proposal']={'id':('P-W048-'+str(epoch).zfill(3)),'hash':sha(B/proposal)}
 for b in p['blocks']:
  c=b['id'].upper();b['content_design_hash']=load('evidence/'+c+'_FULL_IR_CHECK.json')['irHash'];b['patch_hash']=digest(load(pre+c+'_PROPOSED_PATCH.json'))
 p['approval_bundles']=[dict(id='proposal',block_ids=['n13','n14'],proposal_hash=p['proposal']['hash'],content_hash=digest({b['id']:b['content_design_hash']for b in p['blocks']}))]
 if r.state(w)['plan']['proposal']!=p['proposal']:r.revise(w,p)
 write('WORKFLOW_PLAN.json',p)
 rows=load('IMPACT_LEDGER.json')['rows']
 for row in rows:
  if row['artifact'].endswith(('src/domain/textbook.ts','src/pages/TextbookUnitPage.tsx')):
   row.update(status='AFFECTED',phase='pre-design',rootCauseSignature='planned-revision-scoped-migration-and-formula-number-conduit',reason='R04 planned support change, not a newly found pre-existing shared defect. Exact revision branches only. Old R03 source-cause sweep preserved; this supplement explicitly expands planned patch impact. Other units and older revisions retain existing branch; R07/G2 regression mandatory.')
 write('PLANNED_IMPACT.json',{'rows':rows,'sourceCauseR03Unchanged':True,'implemented':False})
 print('Plan revised '+p['proposal']['id'])
elif mode=='prepare':
 c=sys.argv[2].upper();bid=c.lower();nid='R04_PROPOSAL@'+bid
 assert r.next(w)['task']['node']['id']==nid,r.next(w)
 ir=load(c+'_FULL_IR.json');source=load('evidence/'+c+'_SOURCE_INDEX.json');unit=load(c+'_CANDIDATE.json')['unit']
 paths=[proposal,design,'PLANNED_IMPACT.json',pre+'PROPOSED_PATCH_INDEX.json','evidence/FULL_DESIGN_CHECK.json','evidence/DESIGN_STATE_CHECK.json','evidence/R04_CANDIDATE_CHECK.json',c+'_FULL_IR.json',c+'_ROW_PROJECTION.json',c+'_CANDIDATE.json',pre+c+'_PROPOSED_PATCH.json',c+'_LEARNER_REVIEW.json','evidence/'+c+'_SOURCE_INDEX.json','evidence/MATH_CHECK.json']
 paths += [p for p in ['evidence/PROPOSED_MIGRATION_CHECK.json','evidence/PROTOTYPE_TYPECHECK.json','evidence/PROTOTYPE_DOM_UNAVAILABLE.json','evidence/PRESERVATION_CHECK.json','r3/CSS_CASCADE_CHECK.json','evidence/R04_SOURCE_FIRST_A.json','evidence/R04_SOURCE_FIRST_B.json']if (B/p).exists()]
 refs=evidence(paths)
 teaching={'solution':[dict(id=n['id'],inputFacts=n.get('requires',[]),outputFacts=n.get('produces',[]),goal=n.get('goal',''),operation=n.get('operation',''),basisRefs=n.get('sourceRefs',[]))for n in ir['nodes']],'knowledge':ir['initialFacts'],'options':{'budget':1}}
 figures=[]
 for f in unit['sections'][0].get('figures',[]):
  path='public'+f['src'];figures.append(dict(id=f['id'],sourcePath=path,sourceRef=source['blocks'][0]['id'],purpose=f['caption'],howToRead=f['alt'],visibleWhen='Original figure anchor and preceding interaction gates from row projection',contentHash=hashlib.sha256(base64.b64encode((R/path).read_bytes())).hexdigest()))
 inputs={'teaching.plan':teaching,'step.plan':teaching,'blank.plan':{'nodes':ir['nodes']},'prose.compose':ir,'text.verify':ir,'figure.verify':{'figures':figures},'ir.verify':ir,'source.audit':{'coverage':ir['coverage'],'sourceBlocks':source['blocks'],'candidate':ir},'novice.audit':{'ir':ir}}
 pending=pre+'evidence/'+c+'_R04_PENDING.json';(B/pre/'evidence').mkdir(exist_ok=True)
 claim=r.claim(w,nid,'M-full-copy-design',seconds=14400);receipts=[]
 for cap in claim['node']['capability_requests']:
  ref=run_capability(r,w,claim['node'],cap,inputs[cap]);receipts.append(ref);out=r.store.get(r.store.get(ref)['output']);print(cap+': '+out['status'],flush=True);assert out['status']in ['PASS','NEEDS_AI_REVIEW'],out
 req=ai_request(r,w,nid)
 result=dict(verdict='PASS',evidence_refs=refs,capability_receipts=receipts,aiReview={'requestHash':req['requestHash'],'inputHash':claim['input_hash'],'reviewer':'M with actual separately collected A/B reports','evidence':refs},before_after={'before':'old source audit recorded in R01-R03','after':c+'_LEARNER_REVIEW.json','fullIR':c+'_FULL_IR.json','displayProjection':c+'_ROW_PROJECTION.json'},protected_scope=r.state(w)['plan']['protected_manifest'],patch_plan=pre+c+'_PROPOSED_PATCH.json',verification_plan=proposal+': R06/R07/G2/G3, exact frozen after_text only',proposal_hash=r.state(w)['plan']['proposal']['hash'],case_dispositions=load('evidence/R02_CAUSE_n13_RESULT.json')['case_dispositions'],plannerDisposition={'adopted':'Source-grounded dependency order and atomic interaction candidates aligned with explicit projection','notAdopted':'Automatic blanket conversion of every explanatory sentence into a blank, replacing physical multi-slot row by multiple rendered lines, or calling CODE quality acceptance','coverage':'59 student judgments mapped to original 25 questions; all full copy retained'},plannedImpact='PLANNED_IMPACT.json')
 write(pending,{'job':{'node':nid,'claimToken':claim['claim_token'],'inputHash':claim['input_hash'],'receipts':receipts},'result':result})
 reviewers=[]
 for logical,facet,key,kind in [('A','design','teaching','source-review'),('B','render','layout','learner-visible-review')]:
  packet={'baseNodeInputHash':claim['input_hash'],'sourceRefs':next(b['sources']for b in r.state(w)['plan']['blocks']if b['id']==bid),'authorHistory':[{'claimRef':key,'facet':facet,'block':bid,'semanticContributorRefs':['/root']}],'contextExposure':{'forkMode':'filtered','authorRationaleVisibleAtFirstPass':False,'priorExposure':'Old draft/constraints and initial primary-source observations known before new full learner target. Not blind. Original learner-copy first observations retained across CSS-only revision if epoch2; revised consumer is rechecked after initial FAIL, not a new blind first encounter. A assisted transport script only; B assisted prototype check script only. Neither authored lesson copy.'}}
  if bid=='n14':
   packet['contextExposure'].update(firstPassOrigin='Original primary-source N14 observation fixed in R04_SOURCE_FIRST_A/B before P001/P002 final rationale; that source-first origin is retained. Current full-learner target review is exposed, not a fresh blind first encounter.',currentTargetAuthorRationalePreviouslySeen=True,priorExposure='A read P002 all including N14 plan; B read P001 all including N14 plan during N13 reviews. Both already saw shared consumer/CSS contracts. Neither has read new N14 learner target. No claim of unexposed or model-independent current-target review.',originalSourceFirstRefs=['work/items/W-MATH-048-n1314-source-audit/evidence/R04_SOURCE_FIRST_'+logical+'.json'])
  reviewers.append(dict(logical=logical,agentRef='/root/w048_review_'+logical.lower(),taskRef='W048-P'+str(epoch).zfill(3)+'-'+bid+'-R04-'+logical,facet=facet,claim=key,reviewKind=kind,artifactHashes={key:sha(B/(c+'_LEARNER_REVIEW.json'))},packet=packet,reportPath=str(B/pre/'evidence'/(c+'_R04_FIRST_'+logical+'.json')),launchPath='/tmp/w048-e'+str(epoch)+'-'+bid+'-launch-'+logical+'.json',finalPath='/tmp/w048-e'+str(epoch)+'-'+bid+'-final-'+logical+'.json'))
 cfg=dict(root=str(R),store=str(r.store.root),work=w,node=nid,inputHash=claim['input_hash'],roleEpoch=epoch,artifactRefs=receipts,evidenceRefs=refs,reviewers=reviewers)
 write(pre+'evidence/'+c+'_R04_TEAM_CONFIG.json',cfg);render(r,w,B/'generated');print('PREPARED '+c,flush=True)
elif mode=='submit':
 c=sys.argv[2].upper();p=load(pre+'evidence/'+c+'_R04_PENDING.json');result=load(pre+'evidence/'+c+'_R04_RESULT.json');r.submit(w,p['job']['node'],p['job']['claimToken'],result);render(r,w,B/'generated');print('SUBMITTED '+c)
else:raise ValueError(mode)
