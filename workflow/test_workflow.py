import base64,copy,json,tempfile,unittest,zipfile,io,time
from pathlib import Path
from unittest.mock import patch
from runtime import Runtime
from definitions import instantiate
from store import Store,digest,Conflict,CorruptLedger
from contracts import Rejected,sha,manifest,relative,file,result_check
from adapters import apply_patch,import_capture,git_export,in_scope,authoring
from views import render,snapshot

PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a+XcAAAAASUVORK5CYII=')
class Fixture(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.data=self.root/'data';self.data.mkdir()
        for name,body in [('a.json','{"id":"a","text":"before","progress":{"q":1}}'),('b.json','{"id":"b","text":"preserve"}'),('rules.md','rules v1')]: (self.data/name).write_text(body)
        self.rt=Runtime(self.root/'ledger',self.data);self.plan=self.make_plan();self.rt.open(self.plan)
        self.ref=self.rt.evidence('W','file',{'path':'a.json','sha256':sha(self.data/'a.json')},source_ref='fixture',verification_level='simulation')
    def tearDown(self):self.tmp.cleanup()
    def make_plan(self,command='CMD-WORK-002',profile='material',work='W'):
        return {'work_id':work,'profile':profile,'command':command,'subject':'math','mode':'textbook','source_sha':'a'*40,'rules':manifest(self.data,['rules.md']),'proposal':{'id':'P1','hash':digest({'specific':'design'})},'scope':{'paths':['a.json'],'preserve':['b.json']},'blocks':[{'id':'A','sources':['a.json']},{'id':'B','sources':['b.json']}],'source_manifest':manifest(self.data,['a.json','b.json']),'simulation':True}
    def approve(self):return self.rt.user('W','approve_proposal','実装してよい',self.rt.state('W')['plan']['proposal']['hash'],'sim:proposal',verification_level='simulation')
    def output(self,n,ref=None):
        r={k:'根拠のある模擬課題結果' for k in n['required']};r.update(verdict='PASS',evidence_refs=[ref or self.ref])
        for k in ('unknowns','unresolved','case_updates','rule_links','regression_links'): 
            if k in r:r[k]=[]
        if n['id'].startswith('R03'):r['impact_rows']=[{'artifact':'a.json','version':'a'*40,'status':'AFFECTED','evidence_refs':[self.ref]},{'artifact':'b.json','version':'a'*40,'status':'NOT-AFFECTED','evidence_refs':[self.ref]}]
        if n['id'].startswith('R04'):r['proposal_hash']=self.rt.state('W')['plan']['proposal']['hash']
        if n['actor']=='AUDITOR':r.update(audit_rows=[{'surface':'all','status':'PASS','evidence_refs':[self.ref]}],independence={'reviewer':'independent-test','method':'separate fixture reviewer, not actual audit'},original_source_refs=[self.ref])
        return r
    def ci(self,sha_value=None):
        return self.rt.evidence('W','ci',{'id':1,'head_sha':sha_value or self.rt.state('W')['candidate_sha'],'status':'completed','conclusion':'success','html_url':'https://github.com/test/runs/1'},source_ref='simulation:ci',verification_level='simulation')
    def screenshot(self,block):
        (self.data/'capture.png').write_bytes(PNG);ci=self.ci();h=sha(self.data/'capture.png');current=self.rt.state('W')['candidate_sha']
        capture=self.rt.evidence('W','capture',{'ci_ref':ci,'source_sha':current,'artifact_sha256':'f'*64,'files':{'capture.png':h}},source_ref='sim:zip',verification_level='simulation')
        return self.rt.evidence('W','screenshot',{'path':'capture.png','sha256':h,'block':block,'source_sha':current,'capture_ref':capture},source_ref='sim:png',verification_level='simulation')
    def step(self):
        n=self.rt.next('W');self.assertIn(n['status'],('READY','WAITING'),n);node=n['task']['node'];nid=node['id'];actor=node['actor']
        if actor=='CODE':self.rt.execute('W',nid)
        elif actor=='USER':
            if 'APPROVAL' in nid:
                u=self.rt.approval(self.rt.state('W'));self.assertTrue(u);self.rt.accept('W',nid,u['id'])
            elif nid.startswith('G1'):
                ref=self.screenshot(node['block']);u=self.rt.user('W','accept_block','この細部を確認した',ref,'sim:block',block=node['block'],verification_level='simulation');self.rt.accept('W',nid,u,[ref])
            else:
                ref=self.rt.store.get(self.rt.state('W')['results']['G3_HOST']['artifact'])['evidence_refs'][0]
                u=self.rt.user('W','accept_app','全体をプレイした。総チェックOK',ref,'sim:app',verification_level='simulation');self.rt.accept('W',nid,u,[ref])
        else:
            task=self.rt.claim('W',nid,'independent-test' if actor=='AUDITOR' else 'fixture-author');token=task['claim_token']
            if actor in ('AI','AUDITOR'):self.rt.submit('W',nid,token,self.output(node))
            else:
                ref=self.ref
                if 'VERIFY' in nid:ref=self.ci()
                if nid=='G3_HOST':ref=self.rt.evidence('W','app',{'url':'https://example.invalid','source_sha':self.rt.state('W')['candidate_sha'],'manifest_sha':self.rt.state('W')['candidate_sha'],'reachable':True,'auth_wall':False,'mobile':True,'desktop':True,'progress_isolated':True},source_ref='sim:host',verification_level='simulation')
                self.rt.tool_result('W',nid,token,[ref])
        return nid
    def until(self,prefix):
        for _ in range(100):
            n=self.rt.next('W');nid=n.get('task',{}).get('node',{}).get('id','')
            if nid.startswith(prefix):return n['task']['node']
            self.step()
        self.fail('node unreachable:'+prefix)
    def finish(self):
        for _ in range(100):
            if self.rt.next('W')['status']=='DONE':return
            self.step()
        self.fail('did not close')
    def replace_plan(self,command='CMD-WORK-001',profile='material'):
        self.tmp.cleanup();self.setUp();self.plan['command']=command;self.plan['profile']=profile
        # new isolated store; old fixture is intentionally discarded
        self.rt=Runtime(self.root/'other-ledger',self.data);self.rt.open(self.plan)
        self.ref=self.rt.evidence('W','file',{'path':'a.json','sha256':sha(self.data/'a.json')},source_ref='sim',verification_level='simulation')

class Routes(Fixture):
    def test_creation_full(self):self.approve();self.finish();self.assertTrue(snapshot(self.rt,'W')['application_accepted'])
    def test_correction_full(self):self.replace_plan();self.approve();self.finish();self.assertTrue(snapshot(self.rt,'W')['application_accepted'])
    def test_technical_not_app_acceptance(self):self.replace_plan('GOVERNANCE','technical');self.approve();self.finish();self.assertFalse(snapshot(self.rt,'W')['application_accepted'])
    def test_no_ai_skip(self):
        self.step();self.step()
        with self.assertRaises(Rejected):self.rt.claim('W','C02_CONCEPT@A','x')
    def test_ai_not_started_until_claim(self):
        self.until('C01');self.assertEqual(self.rt.next('W')['status'],'READY');self.rt.claim('W','C01_SOURCE@A','x');self.assertEqual(self.rt.next('W')['reason'],'AI_RESULT')
    def test_no_blank_approval(self):
        self.until('C06');self.assertEqual(self.rt.next('W')['reason'],'USER_DECISION')
        with self.assertRaises(Rejected):self.rt.accept('W','C06_APPROVAL@A',self.ref)
    def test_existing_approval_suffices(self):self.approve();self.until('C06');self.step();self.assertTrue(self.rt.next('W')['task']['node']['id'].startswith('C07'))
    def test_approved_flag_is_not_user_authority(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);r['approved']=True
        with self.assertRaises(Rejected):self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r)
    def test_missing_required_output(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);del r['source_versions']
        with self.assertRaises(Rejected):self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r)
    def test_unknown_is_not_pass(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);r['unknowns']=['source missing']
        with self.assertRaises(Rejected):self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r)
    def test_unknown_keeps_blocked(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);r['unknowns']=['source missing'];r['verdict']='UNVERIFIED';self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r);self.assertEqual(self.rt.next('W')['status'],'BLOCKED')
    def test_missing_ref_rejected(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);r['evidence_refs']=['nonexistent']
        with self.assertRaises(Rejected):self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r)
    def test_duplicate_result_rejected(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r)
        with self.assertRaises(Rejected):self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r)
    def test_stale_ci(self):
        with self.assertRaises(Rejected):self.ci('b'*40)
    def test_rule_drift(self):(self.data/'rules.md').write_text('v2');self.assertEqual(self.rt.next('W')['status'],'BLOCKED')
    def test_source_drift(self):(self.data/'a.json').write_text('edited');self.assertEqual(self.rt.next('W')['status'],'BLOCKED')
    def test_pause_resume(self):
        self.rt.user('W','pause','止めて','W','chat:1');self.assertEqual(self.rt.next('W')['reason'],'USER_PAUSED');self.rt.user('W','resume','続けて','W','chat:2');self.assertEqual(self.rt.next('W')['status'],'READY')
    def test_resume_preserves_claim(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');other=Runtime(self.root/'ledger',self.data);self.assertEqual(other.next('W')['claim']['token'],t['claim_token'])
    def test_expired_claim_requires_reconcile(self):
        self.until('C01');self.rt.claim('W','C01_SOURCE@A','x',seconds=-1);self.assertEqual(self.rt.next('W')['status'],'BLOCKED');self.rt.reconcile_claim('W','C01_SOURCE@A','NOT_EXECUTED',[self.ref]);self.assertEqual(self.rt.next('W')['status'],'READY')
    def test_creation_waits_correction(self):
        self.rt.issue('W',{'id':'i1','root_cause':'skipped_reason','description':'missing','evidence_refs':[self.ref],'version':'a'*40});self.assertEqual(self.rt.next('W')['reason'],'CORRECTION_FIRST')
    def test_explicit_priority_override(self):
        self.test_creation_waits_correction();self.rt.user('W','priority_override','仕組み整備を先行','W','chat:scope');self.assertEqual(self.rt.next('W')['status'],'READY')
    def test_no_scope_widening_approval(self):
        self.approve();p=copy.deepcopy(self.plan);p['scope']['paths'].append('b.json');p['proposal']['hash']='new';self.rt.revise('W',p);self.assertIsNone(self.rt.approval(self.rt.state('W')))
    def test_unverified_impact_cannot_pass(self):
        self.replace_plan();self.until('R03');t=self.rt.claim('W','R03_IMPACT@A','x');r=self.output(t['node']);r['impact_rows'][1]['status']='UNVERIFIED'
        with self.assertRaises(Rejected):self.rt.submit('W','R03_IMPACT@A',t['claim_token'],r)
    def test_nested_impact_refs_checked(self):
        self.replace_plan();self.until('R03');t=self.rt.claim('W','R03_IMPACT@A','x');r=self.output(t['node']);r['impact_rows'][1]['evidence_refs']=['fake']
        with self.assertRaises(Rejected):self.rt.submit('W','R03_IMPACT@A',t['claim_token'],r)
    def test_auditor_cannot_be_creator(self):
        self.approve();self.until('G2');t=self.rt.claim('W','G2_AUDIT','fixture-author');r=self.output(t['node']);r['independence']['reviewer']='fixture-author'
        with self.assertRaises(Rejected):self.rt.submit('W','G2_AUDIT',t['claim_token'],r)
    def test_continue_is_not_quality_positive(self):
        self.replace_plan('GOVERNANCE','technical');self.approve();self.until('L01');u=self.rt.user('W','continue','いいよ続けて','W','chat:continue');t=self.rt.claim('W','L01_LEARNING','x');r=self.output(t['node']);r['case_updates']=[{'id':'c1','disposition':'TEST','quality':'POSITIVE','evaluation_event':u,'target_version':'a'*40,'links':['test'] }]
        with self.assertRaises(Rejected):self.rt.submit('W','L01_LEARNING',t['claim_token'],r)
    def test_no_real_work_simulated_evidence(self):
        p=self.make_plan(work='REAL');p['simulation']=False;self.rt.open(p)
        with self.assertRaises(Rejected):self.rt.evidence('REAL','file',{'path':'a.json','sha256':sha(self.data/'a.json')},source_ref='fake',verification_level='simulation')
    def test_no_real_work_simulated_user(self):
        p=self.make_plan(work='REAL');p['simulation']=False;self.rt.open(p)
        with self.assertRaises(Rejected):self.rt.user('REAL','continue','はい','W','sim',verification_level='simulation')
    def test_external_authority_is_distinct(self):
        p=self.make_plan(work='REAL');p['simulation']=False;self.rt.open(p);self.rt.user('REAL','approve_proposal','実装して',p['proposal']['hash'],'chat')
        with self.assertRaises(Rejected):self.rt.external_intent('REAL','DEPLOY','request','deploy1')
    def test_external_unknown_stops_and_no_repeat(self):
        p=self.make_plan(work='REAL');p['simulation']=False;self.rt.open(p);self.rt.user('REAL','authorize_deploy','この公開操作を許可','request','chat');self.rt.external_intent('REAL','DEPLOY','request','deploy1');self.assertEqual(self.rt.next('REAL')['status'],'BLOCKED')
        with self.assertRaises(Rejected):self.rt.external_intent('REAL','DEPLOY','request','deploy1')
    def test_original_snapshot_immutable(self):
        first=self.rt.store.events()[0];original=self.rt.store.get(first['payload']['original_snapshot']);(self.data/'a.json').write_text('changed');self.assertIn('before',bytes.fromhex(original['files_hex']['a.json']).decode())
    def test_views_deterministic_and_drift_detected(self):
        out=self.root/'views';render(self.rt,'W',out);self.assertTrue(render(self.rt,'W',out,check=True));(out/'CURRENT_POSITION.md').write_text('fake');self.assertFalse(render(self.rt,'W',out,check=True))
    def test_visual_acceptance_preserves_unchanged_block(self):
        self.approve();self.until('G2');s=self.rt.state('W');node=instantiate(s['plan'])['G1_VISUAL@A'];before=self.rt.input_hash(s,node);self.rt.bind_candidate('W','b'*40);self.assertEqual(before,self.rt.input_hash(self.rt.state('W'),node));self.assertEqual(self.rt.node_status(self.rt.state('W'),node),'PASSED')
    def test_verification_invalidated_on_new_sha(self):
        self.approve();self.until('C09');self.rt.bind_candidate('W','b'*40);s=self.rt.state('W');self.assertEqual(self.rt.node_status(s,instantiate(s['plan'])['C08_VERIFY@A']),'INVALIDATED')
    def test_fake_issue_close_rejected(self):
        self.rt.issue('W',{'id':'i','root_cause':'missing','description':'x','evidence_refs':[self.ref],'version':'a'*40});p=self.make_plan(work='CHILD');p['parent_issue']={'work':'W','id':'i'};self.rt.open(p)
        with self.assertRaises(Rejected):self.rt.resolve_issue('W','i','CHILD')

class PatchTests(Fixture):
    def setup_patch(self):
        before=sha(self.data/'a.json');after='{"id":"a","text":"after with reasons","progress":{"q":1}}';import hashlib
        diff={'files':[{'path':'a.json','before_sha256':before,'after_text':after,'after_sha256':hashlib.sha256(after.encode()).hexdigest()}]}
        self.replace_plan();self.plan['proposal']['patch_hash']=digest(diff)
        # this fixture proposal is fixed before opening a new store
        self.rt=Runtime(self.root/'patch-ledger',self.data);self.rt.open(self.plan);self.ref=self.rt.evidence('W','file',{'path':'a.json','sha256':before},source_ref='sim',verification_level='simulation');self.approve();self.until('R06');t=self.rt.claim('W','R06_PATCH@A','patch-tool');return diff,t
    def test_limited_patch_actual_and_preserve(self):
        diff,t=self.setup_patch();protected=(self.data/'b.json').read_bytes();refs=apply_patch(self.rt,'W','R06_PATCH@A',t['claim_token'],diff);self.assertIn('after with reasons',(self.data/'a.json').read_text());self.assertEqual(protected,(self.data/'b.json').read_bytes());self.rt.tool_result('W','R06_PATCH@A',t['claim_token'],refs);self.rt.bind_candidate('W','b'*40);self.assertEqual(self.rt.next('W')['task']['node']['id'],'R07_VERIFY@A')
    def test_wrong_patch_hash_refused(self):
        diff,t=self.setup_patch();diff['files'][0]['path']='b.json'
        with self.assertRaises(Rejected):apply_patch(self.rt,'W','R06_PATCH@A',t['claim_token'],diff)
    def test_preserved_path_not_allowed(self):self.assertFalse(in_scope('b.json',self.plan['scope']))
    def test_path_traversal(self):
        for value in ('../x','/tmp/x','.git/config','a/../b','a\\b'):
            with self.subTest(value=value),self.assertRaises(Rejected):relative(value)
    def test_symlink_refused(self):
        (self.data/'link').symlink_to('/tmp')
        with self.assertRaises(Rejected):file(self.data,'link/x')
    def test_capture_zip_traversal(self):
        ci=self.ci();z=self.root/'bad.zip'
        with zipfile.ZipFile(z,'w') as f:f.writestr('../escape.png',PNG)
        with self.assertRaises(Rejected):import_capture(self.rt,'W',z,ci,'screens')
    def test_capture_actual_import(self):
        ci=self.ci();z=self.root/'ok.zip'
        with zipfile.ZipFile(z,'w') as f:f.writestr('A.png',PNG)
        ref=import_capture(self.rt,'W',z,ci,'screens');self.assertEqual(self.rt.state('W')['evidence'][ref]['data']['files']['screens/A.png'],sha(self.data/'screens/A.png'))
    def test_git_export_has_cas(self):
        export=git_export(self.rt,'W','b'*40,'work/ledger');self.assertEqual(export['expected_head'],'b'*40);self.assertTrue(export['tree_elements'])

class LedgerTests(unittest.TestCase):
    def setUp(self):self.tmp=tempfile.TemporaryDirectory();self.s=Store(self.tmp.name)
    def tearDown(self):self.tmp.cleanup()
    def test_idempotent_event(self):self.s.append('x','W',{},event_id='one');self.s.append('x','W',{},event_id='one');self.assertEqual(len(self.s.events()),1)
    def test_same_id_conflict(self):
        self.s.append('x','W',{},event_id='one')
        with self.assertRaises(Conflict):self.s.append('x','W',{'different':1},event_id='one')
    def test_cas(self):
        head=self.s.head;self.s.append('x','W',{})
        with self.assertRaises(Conflict):self.s.append('x','W',{},expected=head)
    def test_corruption(self):
        self.s.append('x','W',{});p=next((self.s.root/'events').glob('*.json'));p.write_text('{}')
        with self.assertRaises(CorruptLedger):self.s.events()
    def test_artifact_corruption(self):
        h=self.s.put({'a':1});(self.s.root/'artifacts'/(h+'.json')).write_text('{}')
        with self.assertRaises(CorruptLedger):self.s.get(h)
    def test_event_id_cannot_escape(self):
        with self.assertRaises(Conflict):self.s.append('x','W',{},event_id='../escape')
    def test_existing_lock_no_auto_clear(self):
        (self.s.root/'.writer-lock').write_text('{}')
        with self.assertRaises(Conflict):self.s.append('x','W',{})

if __name__=='__main__':unittest.main()

class AddedBoundaries(Fixture):
    def test_late_negative_invalidates_learning(self):
        self.replace_plan('GOVERNANCE','technical');self.approve();self.finish();self.rt.user('W','quality_negative','この結果には誤りがある','W','chat:negative');self.assertEqual(self.rt.next('W')['task']['node']['id'],'L01_LEARNING')
    def test_reject_block_invalidates_only_its_gate(self):
        self.approve();self.until('G2');self.rt.user('W','reject_block','Aの途中式が不足','A','chat:reject',block='A');s=self.rt.state('W');ns=instantiate(s['plan']);self.assertEqual(self.rt.node_status(s,ns['G1_VISUAL@A']),'INVALIDATED');self.assertEqual(self.rt.node_status(s,ns['G1_VISUAL@B']),'PASSED')
    def test_changed_candidate_cannot_bypass_patch_adapter(self):
        self.approve();(self.data/'a.json').write_text('{"id":"a","text":"untracked"}')
        with self.assertRaises(Rejected):self.rt.bind_candidate('W','b'*40)
    def test_no_unregistered_issue_evidence(self):
        with self.assertRaises(Rejected):self.rt.issue('W',{'id':'i','root_cause':'x','evidence_refs':['fake'],'description':'x','version':'a'*40})
    def test_quality_unknown_can_be_recorded_without_invented_praise(self):
        self.replace_plan('GOVERNANCE','technical');self.approve();self.until('L01');t=self.rt.claim('W','L01_LEARNING','x');r=self.output(t['node']);r['case_updates']=[{'id':'new-test','disposition':'TEST','quality':'UNKNOWN','links':['test_workflow.py']}];self.rt.submit('W','L01_LEARNING',t['claim_token'],r);self.step();self.assertEqual(self.rt.next('W')['status'],'DONE')
    def test_actual_positive_is_bound_to_target_version(self):
        self.replace_plan('GOVERNANCE','technical');self.approve();self.until('L01');u=self.rt.user('W','quality_positive','この版のこの説明が良い','W','chat:specific');t=self.rt.claim('W','L01_LEARNING','x');r=self.output(t['node']);r['case_updates']=[{'id':'c','disposition':'EXISTING_RULE','quality':'POSITIVE','target_version':'wrong','evaluation_event':u,'links':['rule']}]
        with self.assertRaises(Rejected):self.rt.submit('W','L01_LEARNING',t['claim_token'],r)
    def test_original_rule_change_cannot_be_smuggled_into_revision(self):
        p=copy.deepcopy(self.plan);p['proposal']['hash']='new';p['rules']={}
        with self.assertRaises(Rejected):self.rt.revise('W',p)
    def test_pending_patch_intent_blocks_even_before_first_file(self):
        self.rt.store.append('patch_intent','W',{'node':'R06','before':{}},event_id='patch-test');self.assertEqual(self.rt.next('W')['status'],'BLOCKED')
    def test_cli_next_roundtrip(self):
        import subprocess,sys
        result=subprocess.run([sys.executable,str(Path(__file__).with_name('cli.py')),'--root',str(self.data),'--store',str(self.root/'ledger'),'next','--work','W'],text=True,capture_output=True);self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(json.loads(result.stdout)['task']['node']['id'],'S00_RECOVER')

class RecoveryTests(Fixture):
    setup_patch=PatchTests.setup_patch
    def test_patch_interruption_before_write_can_restore(self):
        from adapters import reconcile_patch
        diff,t=self.setup_patch()
        original_replace=__import__('os').replace
        def fail_only_material(src,dst):
            if Path(dst).name=='a.json':raise OSError('network/process interruption fixture')
            return original_replace(src,dst)
        with patch('adapters.os.replace',side_effect=fail_only_material):
            with self.assertRaises(OSError):apply_patch(self.rt,'W','R06_PATCH@A',t['claim_token'],diff)
        self.assertEqual(self.rt.next('W')['status'],'BLOCKED');op=next(iter(self.rt.state('W')['patches']))
        reconcile_patch(self.rt,'W',op,'RESTORE_BEFORE',[self.ref]);self.assertEqual(self.rt.next('W')['status'],'READY')
    def test_after_write_before_receipt_recovered_without_reapply(self):
        from adapters import reconcile_patch
        diff,t=self.setup_patch();original=self.rt.append
        def append(kind,*args,**kwargs):
            if kind=='patch_applied':raise OSError('receipt lost')
            return original(kind,*args,**kwargs)
        with patch.object(self.rt,'append',side_effect=append):
            with self.assertRaises(OSError):apply_patch(self.rt,'W','R06_PATCH@A',t['claim_token'],diff)
        op=next(iter(self.rt.state('W')['patches']));reconcile_patch(self.rt,'W',op,'RECORD_COMPLETED',[self.ref]);self.assertIsNone(self.rt.integrity(self.rt.state('W')))

class ResumeAnalysis(Fixture):
    def test_unverified_analysis_reissued_with_recovery_evidence(self):
        self.until('C01');t=self.rt.claim('W','C01_SOURCE@A','x');r=self.output(t['node']);r['verdict']='UNVERIFIED';r['unknowns']=['missing source'];self.rt.submit('W','C01_SOURCE@A',t['claim_token'],r);self.rt.reopen('W','C01_SOURCE@A','追加資料を確認した',[self.ref]);self.assertEqual(self.rt.next('W')['status'],'READY')
    def test_passed_analysis_cannot_be_silently_deleted(self):
        self.until('C02')
        with self.assertRaises(Rejected):self.rt.reopen('W','C01_SOURCE@A','erase accepted work',[self.ref])

class ExportProvenance(unittest.TestCase):
    def test_exact_export_preserves_blob(self):
        from contracts import verify_git_export
        import hashlib
        data='規則\n'.encode();blob=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest();self.assertEqual(verify_git_export(data,blob),hashlib.sha256(data).hexdigest())
    def test_extra_newline_export_refused(self):
        from contracts import verify_git_export
        import hashlib
        data=b'rules\n';blob=hashlib.sha1(b'blob 6\0'+data).hexdigest()
        with self.assertRaises(Rejected):verify_git_export(data+b'\n',blob)
