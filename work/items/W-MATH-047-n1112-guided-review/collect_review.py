"""Import the actual child report through team/1, preserving its first observations."""
import sys,json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import capture_harness,record_output,reconcile_task
from store import digest
from team import project
c,facet,rawpath=sys.argv[1:];rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';p=B/f'evidence/REVIEW_{c}_{facet}.json';bundle=json.loads(p.read_text());reg=bundle['registration'];a=bundle['assignment'];report=json.loads(Path(rawpath).read_text());pending=json.loads((B/f'evidence/{c}-R04_PENDING_TEAM.json').read_text());refs=pending['result']['evidence_refs']
assert report['targetHash'] in a['artifactHashes'].values()
sf=report.get('sourceFirst');sf=sf if isinstance(sf,bool) else sf.get('satisfied',sf.get('value',False))
sep=report.get('authorSeparation');sep=sep if isinstance(sep,bool) else sep.get('independent',False)
fp=report.get('firstPass');fp=fp if isinstance(fp,bool) else bool(fp.get('fixedBeforeCandidate') or fp.get('sourceObservations') or fp.get('observations'))
first=rt.store.put({'assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'rawFirstObservations':report['firstPass'],'rawReport':report})
findings=[]
for f in report.get('findings',[]):
    if f.get('status') not in ['OPEN','UNRESOLVED','VERIFIED_FIXED']:continue
    finding={'findingId':f['id'],'claimRef':report['claimRef'],'facet':facet,'reason':f['reason'],'evidenceRefs':refs,'resolution':'OPEN' if f['status'] in ['OPEN','UNRESOLVED'] else 'VERIFIED_FIXED','affectedRefs':f.get('targetIds',[]),'sourceQuote':f.get('sourceQuote'),'visibleQuote':f.get('visibleQuote')}
    if finding['resolution']=='VERIFIED_FIXED':
        history=project(rt.store.events(),w)
        old=next(ref for ref,v in history['outputs'].items() if any(x['findingId']==f['id'] and x['resolution']=='OPEN' and x['claimRef']==report['claimRef'] and x['facet']==facet and x.get('block')==c for x in v['output']['findings']))
        finding['resolvesOutputRef']=old;finding['resolutionEvidenceRef']=rt.store.put({'targetHash':report['targetHash'],'reason':f['reason'],'evidenceRefs':refs})
    findings.append(finding)
out={'kind':'review','assignmentHash':reg['assignmentHash'],'packetHash':bundle['packet']['packetHash'],'performerRef':a['performerRef'],'verdict':report['verdict'],'findings':findings,'claimRef':report['claimRef'],'facet':facet,'targetHash':report['targetHash'],'reviewKind':bundle['reviewKind'],'authorSeparation':sep,'sourceFirst':sf,'firstPass':fp,'firstPassArtifactRef':first,'evidenceRefs':refs,'rationale':report['rationale']}
capture=capture_harness(rt,w,{'agentRef':a['performerRef'],'taskRef':a['performerRef'],'attestationMethod':'transcribed-tool-result','channel':'subagent-final','rawResult':report,'structuredOutputHash':digest(out)})
out['harnessOutputRef']=capture['artifactRef'];recorded=record_output(rt,w,reg['registrationRef'],out);reconcile_task(rt,w,reg['registrationRef'],'COMPLETED',[capture['artifactRef']])
bundle['output']=recorded;bundle['rawReportSHA256']=hashlib.sha256(Path(rawpath).read_bytes()).hexdigest();p.write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n')
(B/f'evidence/FIRST_{c}_{facet}_{report["targetHash"][:8]}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'code':c,'facet':facet,'verdict':report['verdict'],'openFindings':sum(f['resolution']=='OPEN' for f in findings),**recorded}))
