"""Reproducible P-004 diagrams plus read-only real adapters, never a lesson publication."""
import argparse,json,subprocess,tempfile
from pathlib import Path
from contracts import manifest
from runtime import Runtime
from graphs import normalized
from definitions import instantiate
from capabilities import run_capability
from requests import pending
from store import digest
from views import render


def write(path,value):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')


def verify(root,out):
    from test_integration import Integration
    summary={'schemaVersion':1,'proposal':'P-004','learnerAcceptance':False,'deploymentPerformed':False,'simulations':{}}
    for command,name in [('CMD-WORK-002','creation'),('CMD-WORK-001','correction')]:
        f=Integration();f.setUp()
        try:
            if command=='CMD-WORK-001':f.repair_fixture()
            visited=[]
            for _ in range(100):
                if f.rt.next(f.work)['status']=='DONE':break
                visited.append(f.step())
            assert f.rt.next(f.work)['status']=='DONE'
            render(f.rt,f.work,out/name)
            summary['simulations'][name]={'simulation':True,'status':'DONE','visited':visited,'approvalEvents':sum(u['intent']=='approve_proposal' for u in f.rt.state(f.work)['users'].values()),'firstReleaseBeforeSecondBuild':visited.index('G3_FINAL@u1')<visited.index(('C07_BUILD' if command=='CMD-WORK-002' else 'R06_PATCH')+'@b')}
        finally:f.tearDown()
    with tempfile.TemporaryDirectory() as temp:
        source='tools/textbook/fixtures/n07-source-index.json';rule='work/items/W-GOV-010-learning-production-workflow/integration/P004_INTEGRATION_DESIGN.md'
        sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
        plan=normalized({'work_id':'P004-READ-ONLY-PROBE','workflow_version':'production/2','profile':'material','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':sha,'source_manifest':manifest(root,[source]),'rules':manifest(root,[rule]),'proposal':{'id':'P004-adapter-probe','hash':manifest(root,[rule])[rule]},'scope':{'paths':['workflow/'],'preserve':[]},'blocks':[{'id':'metadata','sources':[source],'release_unit':'probe'}],'simulation':False})
        rt=Runtime(Path(temp)/'real',root);rt.open(plan);nodes=instantiate(plan);receipts={}
        receipts['source']=run_capability(rt,plan['work_id'],nodes['R01_CAPTURE@metadata'],'source.fixed',{})
        receipts['identity']=run_capability(rt,plan['work_id'],nodes['R02_CAUSE@metadata'],'math.verify',{'kind':'polynomial','left':'(10-1)*x','right':'9*x'})
        receipts['wrong_identity']=run_capability(rt,plan['work_id'],nodes['R02_CAUSE@metadata'],'math.verify',{'kind':'polynomial','left':'(10-1)*x','right':'10*x'})
        script="""import {readFileSync} from 'node:fs';import vm from 'node:vm';const text=readFileSync('tools/textbook/tests/production.test.mjs','utf8');const a=text.indexOf('const part=');const b=text.indexOf('\\ntest(',a);const code=text.slice(a,b).replace('export function fixture','function fixture');console.log(JSON.stringify(vm.runInNewContext(code+';fixture()',{})));"""
        ir=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=root,text=True))
        receipts['compile']=run_capability(rt,plan['work_id'],nodes['R06_PATCH@metadata'],'ir.compile',ir)
        outputs={k:rt.store.get(rt.store.get(ref)['output']) for k,ref in receipts.items()}
        assert outputs['source']['status']=='PASS' and outputs['identity']['status']=='PASS' and outputs['wrong_identity']['status']=='FAIL' and outputs['compile']['status']=='PASS'
        write(out/'READ_ONLY_PROBE.json',{'simulation':False,'isolatedCapabilityProbe':True,'flowSubmitted':False,'lessonAccepted':False,'sourceSHA':sha,'ledgerHead':rt.store.head,'events':rt.store.events(),'receipts':{k:rt.store.get(v) for k,v in receipts.items()},'outputs':outputs})
        summary['realAdapters']={k:v['status'] for k,v in outputs.items()}
        queue_plan=dict(plan,work_id='P004-QUEUE-PROBE',command='CMD-WORK-002');q=Runtime(Path(temp)/'queue',root);q.open(queue_plan)
        queue=q.next(queue_plan['work_id']);assert queue['reason']=='CORRECTION_FIRST';assert {f'N07-USER-F{i:02}' for i in range(1,7)}<={row['id'] for row in queue['issues']}
        render(q,queue_plan['work_id'],out/'actual-queue')
        summary['realQueue']={'status':queue['status'],'reason':queue['reason'],'caseIds':[r['id'] for r in queue['issues']]}
    write(out/'INTEGRATION_RECEIPTS.json',summary)
    return summary


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',default='.');p.add_argument('--out',required=True);a=p.parse_args()
    print(json.dumps(verify(Path(a.root).resolve(),Path(a.out)),ensure_ascii=False))
