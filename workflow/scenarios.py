"""模擬承認を明記した、作成／修正／技術経路の再現可能な通し実行。"""
import json,shutil,sys
from pathlib import Path
from test_workflow import Fixture
from views import render,snapshot

def run(destination):
    out=Path(destination);out.mkdir(parents=True,exist_ok=True)
    if any(out.iterdir()):raise ValueError('模擬出力先は空のディレクトリを指定する。既存台帳へ混在させない')
    reports=[]
    for name,command,profile in [('creation','CMD-WORK-002','material'),('correction','CMD-WORK-001','material'),('technical','GOVERNANCE','technical')]:
        f=Fixture();f.setUp()
        try:
            if command!='CMD-WORK-002':f.replace_plan(command,profile)
            f.approve();f.finish();target=out/name;target.mkdir(exist_ok=True)
            shutil.copytree(f.rt.store.root,target/'ledger',dirs_exist_ok=True);shutil.copytree(f.data,target/'fixtures',dirs_exist_ok=True)
            from runtime import Runtime
            replay=Runtime(target/'ledger',target/'fixtures')
            if replay.next('W')['status']!='DONE':raise RuntimeError('出力した模擬台帳を再生できない')
            render(replay,'W',target/'views');snap=snapshot(replay,'W');reports.append({'scenario':name,'simulation':True,'status':f.rt.next('W')['status'],'nodes':len(snap['nodes']),'events':len(f.rt.store.events()),'actual_user_acceptance':False,'ledger_head':f.rt.store.head})
        finally:f.tearDown()
    (out/'summary.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n');return reports

if __name__=='__main__':print(json.dumps(run(sys.argv[1]),ensure_ascii=False,indent=2))
