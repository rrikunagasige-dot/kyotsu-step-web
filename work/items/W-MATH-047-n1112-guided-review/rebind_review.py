"""Rebind an unchanged target's preserved original report; never launch a child.
The old harness observation remains explicitly historical, not a new first pass.
"""
import sys,json,subprocess
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
from team_transport import register_task
c,facet=sys.argv[1:];p=B/f'evidence/REVIEW_{c}_{facet}.json';old=json.loads(p.read_text());performer=old['assignment']['performerRef'];logical=old['logicalRole']
rt=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R)
old_hash=next(iter(old['assignment']['artifactHashes'].values()))
subprocess.run([sys.executable,str(B/'freeze_review.py'),c,facet,performer,logical],cwd=R,check=True)
fresh=json.loads(p.read_text());assert fresh['assignment']['artifactHashes']==old['assignment']['artifactHashes']
fresh['assignment']['assignmentId']+='-native-rebind'
original=rt.store.get(old['harness']['toolResultRef'])
assert original['agentRef']==performer and original['taskRef']==performer
registration=register_task(rt,'W-MATH-047',fresh['assignment'],fresh['packet'],old['harness'])
fresh.update(registration=registration,harness=old['harness'],historicalRebind={'originalRegistration':old['registration'],'originalOutput':old.get('output'),'unchangedTarget':old_hash,'newPlatformTaskLaunched':False,'newFirstPassClaimed':False,'originalHarnessRetained':old['harness']['toolResultRef']})
p.write_text(json.dumps(fresh,ensure_ascii=False,indent=2)+'\n')
raw=B/f'evidence/FIRST_{c}_{facet}_{old_hash[:8]}.json'
subprocess.run([sys.executable,str(B/'collect_review.py'),c,facet,str(raw)],cwd=R,check=True)
