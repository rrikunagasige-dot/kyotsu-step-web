"""Freeze existing Runtime CODE targets before real source-first child reviews."""
import sys,json
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import bind_target
from store import digest
c,facet,performer,logical=sys.argv[1:];rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047'
pending=json.loads((B/f'evidence/{c}-R04_PENDING_TEAM.json').read_text());node=pending['job']['node'];s=rt.state(w)
assert rt.task(w,node)['input_hash']==pending['inputHash']
receipt=next(r for r in pending['job']['receipts'] if rt.store.get(r)['capability']=='ir.verify');output=rt.store.get(rt.store.get(receipt)['output']);claim='teaching' if facet=='design' else 'layout'
target=bind_target(rt,w,node,facet,[receipt],pending['result']['evidence_refs'],{claim:output['irHash']})
assignment={'assignmentId':f'w047-{c}-{facet}-fresh','roleEpoch':1,'node':node,'block':c,'facet':facet,'claimRefs':[claim],'performerRef':performer,'role':'reviewer','inputHash':pending['inputHash'],'sourceSHA':s['plan']['source_sha'],'artifactHashes':{claim:output['irHash']},'allowedPaths':[],'writeMode':'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','dependsOnTasks':[],'budget':{'tokenBudget':None},'independent':True,'targetManifestRef':target['targetManifestRef']}
assignment['assignmentId']+='-'+output['irHash'][:8]+'-'+pending['inputHash'][:8]+'-'+performer.rsplit('/',1)[-1]
assignment['roleEpoch']=3
authors=['/root','/root/w046_source_review' if c=='n11' else '/root/w046_render_review']
packet={'baseNodeInputHash':pending['inputHash'],'sourceRefs':[p for p in s['plan']['source_manifest'] if c in p], 'authorHistory':[{'claimRef':claim,'facet':facet,'block':c,'semanticContributorRefs':authors}],'contextExposure':{'forkMode':'filtered','authorRationaleVisibleAtFirstPass':False}}
packet['packetHash']=digest(packet)
bundle={'assignment':assignment,'packet':packet,'target':rt.store.get(target['targetManifestRef']),'logicalRole':logical,'reviewKind':'source-review' if facet=='design' else 'learner-visible-review','instruction':'Read the original positioned source and baseline current public snapshots before the inactive candidate. Do not read PROPOSAL.md or *_AUDIT_*.json before returning first observations. Review is proposal/static only; candidate rendered UI is not yet available.'}
(B/f'evidence/REVIEW_{c}_{facet}.json').write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'code':c,'facet':facet,'targetHash':output['irHash'],'packetHash':packet['packetHash']}))
