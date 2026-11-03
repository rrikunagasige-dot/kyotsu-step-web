"""S1 orchestration: native guards unchanged; unchanged render reports rebound historically."""
import sys,runpy,json,os
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path[:0]=[str(R/'workflow'),str(B)];os.environ['PYTHONPATH']='/tmp/w046-sympy'
from runtime import Runtime
import views
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);w='W-MATH-047'
real_render=views.render
# Render the complete authoritative diagram once at each handoff, not between dependent adapters.
views.render=lambda *a,**k:None
def run(name,*args):
 sys.argv=[str(B/name),*args];runpy.run_path(str(B/name),run_name='__main__')
mode=sys.argv[1]
if mode=='n11-r04':
 run('r1_run.py','preflight');run('r1_team.py','prepare');run('r1_team.py','collect')
elif mode=='n11-apply':
 r.accept(w,'R05_APPROVAL@n11','w047-s1-approval-3052d970');run('r1_apply.py')
elif mode=='n11-verify':
 from team_transport import register_task
 from store import digest
 load=lambda p:json.loads(Path(p).read_text())
 previous=load(B/'evidence/REVIEW_n11_semantic.json')
 (B/'evidence/S1_N11_PREVIOUS_SEMANTIC_BINDING.json').write_text(json.dumps(previous,ensure_ascii=False,indent=2)+'\n')
 run('advance_ci_review.py')
 p=B/'evidence/REVIEW_n11_semantic.json';fresh=load(p)
 assert fresh['assignment']['artifactHashes']==previous['assignment']['artifactHashes']
 assert fresh['assignment']['sourceSHA']==previous['assignment']['sourceSHA']
 a=fresh['assignment'];a['assignmentId']+='-s1-historical-rebind';a['roleEpoch']=previous['assignment']['roleEpoch']+1
 fresh['packet']['contextExposure']['historicalUnchangedTargetRebind']={'originalRegistration':previous['registration'],'newFirstPassClaimed':False,'originalHarnessRetained':True,'sameActualCIArtifact':True}
 fresh['packet']['packetHash']=digest({k:v for k,v in fresh['packet'].items()if k!='packetHash'})
 fresh['harness']=previous['harness'];fresh['registration']=register_task(r,w,a,fresh['packet'],previous['harness'])
 p.write_text(json.dumps(fresh,ensure_ascii=False,indent=2)+'\n')
 run('collect_ci_review.py',str(B/'evidence/N11_CI_FIRST_VISIBLE_REVIEW.json'))
elif mode=='n12-preflight':
 os.environ['W047_REVIEW_CODES']='n12'
 try:run('advance_review.py')
 except SystemExit as e:
  if e.code not in (None,0):raise
elif mode=='n12-r04-apply':
 run('s1_n12_team.py','prepare');run('s1_n12_team.py','collect');run('s1_n12_apply.py')
elif mode=='diagram':real_render(r,w,B/'generated')
else:raise ValueError(mode)
print('S1 handoff next:',r.next(w).get('task',{}).get('node',{}).get('id'),flush=True)
