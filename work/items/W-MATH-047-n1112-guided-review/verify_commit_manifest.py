"""Verify actual Git commit bytes before binding a remote mirror as the native candidate."""
import argparse,hashlib,json,subprocess,sys
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'workflow'))
from runtime import Runtime
ap=argparse.ArgumentParser();ap.add_argument('--commit',required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args()
r=Runtime(R/'work/items/W-MATH-032-n07-semantic-repair/runtime',R);s=r.state('W-MATH-047');rows=[]
for p,expected in s['candidate_manifest'].items():
 proc=subprocess.run(['git','show',a.commit+':'+p],cwd=R,capture_output=True)
 committed=hashlib.sha256(proc.stdout).hexdigest()if proc.returncode==0 else None
 working=hashlib.sha256((R/p).read_bytes()).hexdigest();rows.append({'path':p,'expectedNativeCandidateSHA256':expected,'committedSHA256':committed,'workingSHA256':working,'status':'PASS'if committed==working==expected else'FAIL'})
result={'status':'PASS'if all(x['status']=='PASS'for x in rows)else'FAIL','localCommit':subprocess.check_output(['git','rev-parse',a.commit],cwd=R,text=True).strip(),'localTree':subprocess.check_output(['git','rev-parse',a.commit+'^{tree}'],cwd=R,text=True).strip(),'purpose':'Commit bytes must equal native limited-patch candidate before a tree-equal remote SHA is bound','rows':rows,'published':False}
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':result['status'],'paths':len(rows),'mismatches':[x['path']for x in rows if x['status']!='PASS']}));sys.exit(0 if result['status']=='PASS'else 1)
