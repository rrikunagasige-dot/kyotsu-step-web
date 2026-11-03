from pathlib import Path
import subprocess,json,tempfile,shutil,hashlib
B=Path(__file__).resolve().parent;R=B.parents[2];D=B/'G3_PUBLISHER_DRAFT';rows=[]
def call(args,name,success):
 p=subprocess.run(args,cwd=R,capture_output=True,text=True);(B/'evidence'/('G3_DRAFT_'+name+'.log')).write_text(p.stdout+p.stderr);assert (p.returncode==0)==success,(name,p.stderr);rows.append({'check':name,'expectedSuccess':success,'exitCode':p.returncode})
call(['node','--check',str(D/'w047-publish-check.mjs')],'syntax_w047',True);call(['node','--check',str(D/'w046-publish-check.mjs')],'syntax_w046',True)
call(['node',str(D/'w047-publish-check.mjs'),'bytes-only'],'bytes_69_and_retained_contract',True)
call(['node',str(D/'w047-publish-check.mjs'),'retained-check'],'reject_local_metadata_head_as_production_source',False)
with tempfile.TemporaryDirectory(prefix='w047-g3-negative-')as tmp:
 t=Path(tmp);shutil.copyfile(D/'w047-publish-check.mjs',t/'w047-publish-check.mjs');c=json.loads((D/'w047-release-contract.json').read_text());c['required']['src/data/textbook/math/numbers/n11Authored.json']='0'*64;(t/'w047-release-contract.json').write_text(json.dumps(c));call(['node',str(t/'w047-publish-check.mjs'),'bytes-only'],'reject_unknown_authored_hash',False)
import yaml
wf=yaml.safe_load((D/'deploy-pages.yml').read_text());steps=wf['jobs']['publish']['steps'];condition="${{ (github.event_name == 'push' && github.ref == 'refs/heads/main') || (github.event_name == 'workflow_dispatch' && inputs.dry_run == false) }}";gated=[x for x in steps if x.get('if')==condition];assert len(gated)==6
assert all(x.get('if')==condition for x in steps if x.get('uses','').startswith(('actions/configure-pages','actions/upload-pages-artifact','actions/deploy-pages')))
assert 'dry_run' in (wf.get('on',wf.get(True)))['workflow_dispatch']['inputs'];assert wf['jobs']['publish']['env']['CANDIDATE_SHA']=='f129ba78e496f0ccbce917c762357a81b92b0a2c'
assert 'work/w047-publisher-g3-20261104' in wf.get('on',wf.get(True))['push']['branches']
for event,ref,dry,want in [('push','refs/heads/main',None,True),('push','refs/heads/work/w047-publisher-g3-20261104',None,False),('workflow_dispatch','refs/heads/work/w047-publisher-g3-20261104',True,False),('workflow_dispatch','refs/heads/work/w047-publisher-g3-20261104',False,True)]:
 assert ((event=='push' and ref=='refs/heads/main')or(event=='workflow_dispatch' and dry is False))==want
rows.append({'check':'yaml_publisher_branch_push_dryrun_and_four_case_six_step_delivery_truth_table','status':'PASS'})
result={'status':'PASS_BOUNDED_DRAFT_ONLY','rows':rows,'mainFilesApplied':False,'publisherBranchCreated':False,'fullPublisherCIExecuted':False,'publicationPermission':False,'sourceSHA':'f129ba78e496f0ccbce917c762357a81b92b0a2c','limits':'Local bytes-only and explicit rejection tests, not actual publisher dry-run/build/browser/hosting PASS; those require approval of the new four-path publisher scope.'};(B/'evidence/G3_DRAFT_CHECKS.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(result['status'],len(rows))
