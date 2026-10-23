"""CI/ローカル共通検証。固定期待値を満たさなければ非零終了。"""
import argparse,json,subprocess,sys,tempfile,unittest
from pathlib import Path
from adapters import authoring

def main():
    p=argparse.ArgumentParser();p.add_argument('--engine',required=True);p.add_argument('--out',required=True);a=p.parse_args();here=Path(__file__).resolve().parent;out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True);engine=Path(a.engine).resolve()
    result=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.discover(str(here),pattern='test_workflow.py'))
    if not result.wasSuccessful():return 1
    original=subprocess.run([sys.executable,'-m','unittest','discover','-p','test_engine.py','-v'],cwd=engine,text=True,capture_output=True)
    (out/'P001-tests.txt').write_text(original.stdout+original.stderr)
    if original.returncode:return 1
    subprocess.run([sys.executable,'evaluate.py'],cwd=engine,check=True,stdout=subprocess.DEVNULL)
    evaluation=json.loads((engine/'evaluation.json').read_text());(out/'P001-evaluation.json').write_text(json.dumps(evaluation,ensure_ascii=False,indent=2)+'\n')
    adapters=[]
    for mode in ('textbook','practice'):
        r=authoring(engine,engine/('example_'+mode+'.json'),out/mode,engine/'approved_plans.json')
        if r['returncode'] or r['report']['status'] not in ('TECHNICAL_PASS','SEMANTIC_REVIEW_REQUIRED'):raise RuntimeError('P001接続試験失敗')
        adapters.append({'mode':mode,'returncode':r['returncode'],'status':r['report']['status'],'semantic_acceptance':False})
    summary={'workflow_tests':result.testsRun,'workflow_failures':len(result.failures)+len(result.errors),'P001_tests_returncode':original.returncode,'adapters':adapters,'educational_effectiveness':'NOT_MEASURED','actual_user_acceptance':False}
    (out/'verification.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False));return 0
if __name__=='__main__':raise SystemExit(main())
