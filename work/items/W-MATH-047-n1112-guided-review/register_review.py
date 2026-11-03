"""Transcribe actual source-first child task launches into the existing team transport."""
import sys,json
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import capture_harness,register_task
c,facet=sys.argv[1:];rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047';p=B/f'evidence/REVIEW_{c}_{facet}.json';bundle=json.loads(p.read_text());a=bundle['assignment'];agent=a['performerRef']
launch='collaboration.followup_task' if a['roleEpoch']>1 else 'collaboration.spawn_agent'
record={'agentRef':agent,'taskRef':agent,'parentRef':'/root','toolName':launch,'attestationMethod':'transcribed-tool-result','rawResult':{'task_name':agent} if launch=='collaboration.spawn_agent' else {},'instructionPacket':str(p.relative_to(R)),'contextProvided':'Source-first primary paths only; no author rationale or diagnostic reports supplied'}
captured=capture_harness(rt,w,record)
h={'agentRef':agent,'taskRef':agent,'parentRef':'/root','logicalRole':bundle['logicalRole'],'toolResultRef':captured['artifactRef'],'attestationMethod':'transcribed-tool-result'}
registration=register_task(rt,w,a,bundle['packet'],h);bundle['registration']=registration;bundle['harness']=h;p.write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'code':c,'facet':facet,**registration}))
