"""模擬承認を明記した、作成／修正／技術経路の再現可能な通し実行。"""
import json,shutil,sys
from pathlib import Path
from test_workflow import Fixture
from views import render,snapshot

def run(destination):
    out=Path(destination);out.mkdir(parents=True,exist_ok=True);reports=[]
    for name,command,profile in [('creation','CMD-WORK-002','material'),('correction','CMD-WORK-001','material'),('technical','GOVERNANCE','technical')]:
        f=Fixture();f.setUp()
        try:
            if command!='CMD-WORK-002':f.replace_plan(command,profile)
            f.approve();f.finish();target=out/name;target.mkdir(exist_ok=True)
            shutil.copytree(f.rt.store.root,target/'ledger',dirs_exist_ok=True);shutil.copytree(f.data,target/'fixtures',dirs_exist_ok=True)
            render(f.rt,'W',target/'views');snap=snapshot(f.rt,'W');reports.append({'scenario':name,'simulation':True,'status':f.rt.next('W')['status'],'nodes':len(snap['nodes']),'events':len(f.rt.store.events()),'actual_user_acceptance':False,'ledger_head':f.rt.store.head})
        finally:f.tearDown()
    (out/'summary.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n');return reports

if __name__=='__main__':print(json.dumps(run(sys.argv[1]),ensure_ascii=False,indent=2))
