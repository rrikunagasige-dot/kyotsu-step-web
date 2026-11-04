"""M-only exact child resolution capture and native R04 collection; no product changes."""
from pathlib import Path
import sys,json,hashlib
B=Path(__file__).resolve().parent.parent;R=B.parents[2];O=B/'scroll-review/evidence/registered-a998f7b101fb';sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import capture_harness,record_output,reconcile_task
from team import project,check_collection
from definitions import instantiate
from store import digest
r=Runtime('/tmp/w048-scroll-execution-store',R);w='W-MATH-048';row=json.loads((O/'N13_R04_B_RESOLUTION_BOUND.json').read_text());a=row['assignment'];reg=row['registration'];raw=json.loads(Path(row['reviewer']['reportPath']).read_text());h=hashlib.sha256(Path(row['reviewer']['reportPath']).read_bytes()).hexdigest();assert h=='9220b1efec3f1d3d113994c7addaa9df8415875a90f66e280b95b57ded367e73'
assert raw['verdict']=='PASS'and raw['inputHash']==a['inputHash'];findings=[]
for f in raw['findings']:
 assert f['resolution']=='VERIFIED_FIXED'and f['resolvesOutputRef']
 proof=r.store.put(dict(targetHash=raw['targetHash'],reason=f['reason'],evidenceRefs=f['evidenceRefs'],actualReportSHA256=h,scope='Current input R04 static design resolution only; not R07'))
 findings.append(dict(f,resolutionEvidenceRef=proof))
out=dict(kind='review',assignmentHash=reg['assignmentHash'],packetHash=row['packet']['packetHash'],performerRef=a['performerRef'],verdict=raw['verdict'],findings=findings,claimRef='layout',facet='render',targetHash=raw['targetHash'],reviewKind='learner-visible-review',authorSeparation=True,sourceFirst=False,firstPass=False,evidenceRefs=raw['evidenceRefs'],rationale=raw['rationale'])
final='判定：**PASS（R04静的解決審査）**。専用改訂assignmentへmetadataを補正し、同一input・targetと非作者の条件を確認しました。元報告・所見・二件の解決内容は保持しています。\n\npath: `/workspace/scratch/55b12fe3f8aa/repo/work/items/W-MATH-048-n1314-source-audit/scroll-review/evidence/registered-a998f7b101fb/N13_R04_B_RESOLUTION.json`\n\nSHA256: `9220b1efec3f1d3d113994c7addaa9df8415875a90f66e280b95b57ded367e73`'
cap=capture_harness(r,w,dict(agentRef=a['performerRef'],taskRef=row['reviewer']['taskRef'],attestationMethod='transcribed-tool-result',channel='subagent-final',rawResult=final,report=raw,structuredOutputHash=digest(out)));out['harnessOutputRef']=cap['artifactRef'];recorded=record_output(r,w,reg['registrationRef'],out);reconcile_task(r,w,reg['registrationRef'],'COMPLETED',[cap['artifactRef']])
team=json.loads(Path('/tmp/w048-scroll-n13-r04-team-state.json').read_text());areg=team['rows'][0]['registration']['registrationRef'];proj=project(r.store.events(),w);aref=next(k for k,v in proj['outputs'].items()if v['registrationRef']==areg)
result=json.loads((O/'N13_R04_RESULT_M.json').read_text());result['teamCollection']=dict(submissionActor='M',registrationRefs=[areg,reg['registrationRef']],outputRefs=[aref,recorded['outputRef']]);check_collection(r,w,instantiate(r.state(w)['plan'])[a['node']],result)
(O/'N13_R04_RESULT.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');pending=json.loads((O/'N13_R04_PENDING.json').read_text());r.submit(w,pending['job']['node'],pending['job']['claimToken'],result);print('SUBMITTED R04_PROPOSAL@n13; old finding resolutions retained',flush=True)
