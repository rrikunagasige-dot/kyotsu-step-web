"""P-004 regression fixtures; no fixture result represents real learner acceptance."""
import copy,json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from runtime import Runtime
from contracts import Rejected,manifest
from definitions import instantiate
from graphs import normalized
from store import digest
from capabilities import run_stage,run_capability
from production import ai_request
from views import rendered

class Integration(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        for name in ('a.json','b.json'):(self.root/name).write_text('{}')
        (self.root/'rules.md').write_text('fixture rules')
        self.rt=Runtime(self.root/'ledger',self.root)
        self.plan=self.make_plan();self.rt.open(self.plan);self.work=self.plan['work_id']
        self.ev=self.rt.evidence(self.work,'file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
    def tearDown(self):self.tmp.cleanup()
    def make_plan(self,command='CMD-WORK-002',work='fixture'):
        return {'work_id':work,'profile':'material','workflow_version':'production/2','command':command,'subject':'math','mode':'textbook','source_sha':'a'*40,
                'source_manifest':manifest(self.root,['a.json','b.json']),'rules':manifest(self.root,['rules.md']),
                'proposal':{'id':'fixture-proposal','hash':digest('proposal'),'contentDesignHash':digest('content')},'scope':{'paths':['a.json','b.json'],'preserve':[]},
                'blocks':[{'id':'a','sources':['a.json'],'release_unit':'u1'},{'id':'b','sources':['b.json'],'release_unit':'u2'}],
                'simulation':True}
    def fake_service(self,rt,work,stage,inputs):
        if stage=='S18':return {'status':'PASS','compiled':{'irHash':digest('content')}}
        if stage=='S04':return {'status':'PASS','cases':[]}
        return {'status':'PASS','fixture':True}
    def result(self,node,receipts):
        r={k:['fixture: '+k] for k in node['required']}
        r.update(verdict='PASS',evidence_refs=[self.ev],unknowns=[],unresolved=[],capability_receipts=receipts)
        req=ai_request(self.rt,self.work,node['id'])
        r['aiReview']={'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'simulation-reviewer','evidence':'simulation assertion, not pedagogy proof'}
        stage=node['stage_kind'];s=self.rt.state(self.work)
        if stage.startswith('R03'):
            r['impact_rows']=[{'originFinding':'fixture','rootCauseSignature':'fixture-root','artifact':p,'version':s['candidate_sha'] if node['phase']=='post-fix' else s['plan']['source_sha'],'approvedCreationWork':'fixture-origin','block_id':b['id'],'evidence_refs':[self.ev],'status':'NOT-AFFECTED','phase':node['phase']} for b in s['plan']['blocks'] for p in b['sources']]
        if stage=='R04_PROPOSAL':r['proposal_hash']=s['plan']['proposal']['hash']
        if stage=='G2_AUDIT':r.update(audit_rows=[{'surface':path,'artifact':path,'block_id':b['id'],'version':s['release_versions'][node['release_unit']],'status':'PASS','evidence_refs':[self.ev]} for b in s['plan']['blocks'] if b['release_unit']==node['release_unit'] for path in b['sources']],release_readiness='READY',impact_sweep_completion='COMPLETE',audit_method={'method':'simulation','reviewer':'fixture','independent':False})
        if stage=='G3_HOST':
            app=self.app(node['release_unit']);r.update(sourceSHA=s['candidate_sha'],evidence_refs=[app])
        if stage in ('L01_LEARNING','R08_CAPTURE_LEARNING'):
            cases=[{'id':k,'quality':'UNKNOWN','disposition':'TEST','links':[self.ev],'resolution':'VERIFIED_FIXED','repair_evidence_refs':[self.ev]} for k in s['issues']]
            r.update(case_updates=cases,rule_links=[],regression_links=[],unresolved=[],deduplication='no new cases',modelDisposition='NOT_TRAINABLE')
        return r
    def app(self,unit):
        return self.rt.evidence(self.work,'app',{'url':'https://example.invalid/#/'+unit,'source_sha':self.rt.state(self.work)['candidate_sha'],'manifest_sha':self.rt.state(self.work)['candidate_sha'],'release_unit':unit,'reachable':True,'auth_wall':False,'mobile':True,'desktop':True,'progress_isolated':True},source_ref='simulation:app',verification_level='simulation')
    def step(self):
        nxt=self.rt.next(self.work);self.assertIn(nxt['status'],('READY','WAITING'),nxt)
        n=nxt['task']['node'];nid=n['id'];actor=n['actor']
        if actor=='CODE':self.rt.execute(self.work,nid)
        elif actor=='USER':
            if 'APPROVAL' in nid:
                u=self.rt.approval(self.rt.state(self.work),n)
                ref=u['id'] if u else self.rt.user(self.work,'approve_proposal','simulation approval',self.plan['proposal']['hash'],'simulation:approval',verification_level='simulation')
            else:
                s=self.rt.state(self.work);host=self.rt.store.get(s['results']['G3_HOST@'+n['release_unit']]['artifact'])
                ref=self.rt.user(self.work,'accept_app','確認した',host['evidence_refs'][0],'simulation:accept',verification_level='simulation',release_unit=n['release_unit'])
            self.rt.accept(self.work,nid,ref,[self.ev])
        else:
            inputs={c:{} for c in n['capability_requests']}
            for c in ('source.audit',):
                if c in inputs:inputs[c]={'coverage':{},'sourceBlocks':[],'candidate':{}}
            if 'case.finalize' in inputs and self.rt.state(self.work)['issues']:
                inputs['case.finalize']={'caseUpdates':[{'caseId':k,'regressionRef':'simulation:regression','ruleDisposition':'TEST','datasetDisposition':'UNKNOWN'} for k in self.rt.state(self.work)['issues']]}
            if 'release.verify' in inputs:inputs['release.verify']={'appEvidence':self.app(n['release_unit'])}
            with patch('runner.code_operation',self.fake_service):job=run_stage(self.rt,self.work,inputs)
            r=self.result(n,job['receipts'])
            method=self.rt.submit if actor=='AI' else self.rt.production_result
            method(self.work,nid,job['claimToken'],r)
        return nid
    def until(self,node):
        for _ in range(100):
            nxt=self.rt.next(self.work)
            if nxt.get('task',{}).get('node',{}).get('id')==node:return
            self.step()
        self.fail('node unreachable '+node)
    def test_two_entry_graphs_are_distinct_scoped_and_acyclic(self):
        c=instantiate(self.plan);r=instantiate(self.make_plan('CMD-WORK-001'))
        self.assertIn('C05_DESIGN@a',c);self.assertIn('R02_CAUSE@a',r);self.assertIn('R03_IMPACT_SWEEP@u1',r)
        self.assertFalse(any(k.startswith('G1') for k in c));self.assertNotEqual(set(c),set(r))
        self.assertTrue(c['C05_DESIGN@a']['capability_requests']);self.assertEqual(c['C06_APPROVAL@a']['depends_on'],['C05_DESIGN@a','C05_DESIGN@b'])
    def test_shared_approval_does_not_deadlock_or_repeat_and_unit_can_finish_first(self):
        visited=[]
        for _ in range(100):
            if self.rt.next(self.work)['status']=='DONE':break
            visited.append(self.step())
        self.assertEqual(self.rt.next(self.work)['status'],'DONE')
        self.assertLess(visited.index('C05_DESIGN@b'),visited.index('C06_APPROVAL@a'))
        self.assertLess(visited.index('G3_FINAL@u1'),visited.index('C07_BUILD@b'))
        self.assertEqual(sum(u['intent']=='approve_proposal' for u in self.rt.state(self.work)['users'].values()),1)
        self.assertTrue(rendered(self.rt,self.work)['snapshot.json'])
        self.assertEqual(Runtime(self.root/'ledger',self.root).next(self.work)['status'],'DONE')
    def test_correction_full_fixture_has_distinct_pre_post_receipts(self):
        self.plan=self.make_plan('CMD-WORK-001','repair');self.work='repair';self.rt.open(self.plan)
        self.ev=self.rt.evidence(self.work,'file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
        for _ in range(100):
            if self.rt.next(self.work)['status']=='DONE':break
            self.step()
        self.assertEqual(self.rt.next(self.work)['status'],'DONE')
        s=self.rt.state(self.work);pre=self.rt.store.get(s['results']['R03_IMPACT@a']['artifact']);post=self.rt.store.get(s['results']['R03_IMPACT_SWEEP@u1']['artifact'])
        self.assertNotEqual(pre['capability_receipts'],post['capability_receipts'])
        from requests import historically_closed,pending
        self.assertTrue(historically_closed(self.rt,self.work,s))
        with patch.object(self.rt,'integrity',return_value='future tool change requires migration'):
            self.assertFalse(any(row.get('origin')=='unfinished-correction' for row in pending(self.rt,s)))
        self.rt.issue(self.work,{'id':'new-after-close','root_cause':'new-cause','evidence_refs':[self.ev],'description':'new versioned finding','version':'a'*40})
        self.assertFalse(historically_closed(self.rt,self.work,self.rt.state(self.work)))
    def test_render_change_preserves_solution_design_and_approval(self):
        self.until('C07_BUILD@a');s=self.rt.state(self.work);before=dict(s['results']);approval=self.rt.approval(s)
        art=self.rt.store.put({'layout':'new'});self.rt.block_context(self.work,'a',{'render':art},[self.ev]);s=self.rt.state(self.work);nodes=instantiate(s['plan'])
        for k in ('C04_SOLUTION@a','C05_DESIGN@a','C06_APPROVAL@a'):self.assertEqual(self.rt.node_status(s,nodes[k]),'PASSED',k)
        self.assertEqual(self.rt.approval(s)['id'],approval['id']);self.assertEqual(s['results'],before)
    def test_math_change_invalidates_design_and_scoped_approval(self):
        self.until('C07_BUILD@a');self.rt.block_context(self.work,'a',{'math':self.rt.store.put({'formula':'changed'})},[self.ev])
        s=self.rt.state(self.work);nodes=instantiate(s['plan'])
        self.assertEqual(self.rt.node_status(s,nodes['C04_SOLUTION@a']),'INVALIDATED');self.assertIsNone(self.rt.approval(s,nodes['C06_APPROVAL@a']))
    def test_fact_change_invalidates_consumer_without_inventing_known_fact(self):
        p=self.make_plan(work='facts');p['blocks'][1]['fact_dependencies']=['a'];self.rt.open(p)
        n=instantiate(p);self.assertIn('C04_SOLUTION@a',n['C02_CONCEPT@b']['depends_on'])
        self.assertNotIn('C04_SOLUTION@a',instantiate(self.plan)['C02_CONCEPT@b']['depends_on'])
    def test_external_registry_blocks_creation_despite_empty_store_issues(self):
        path=self.root/'feedback.json';path.write_text(json.dumps({'sourceSHA':'a'*40,'cases':[{'id':'F01','status':'RESOLVED','rejected':'unverified resolution flag'}]}))
        p=self.make_plan(work='queued');p['correction_queue_refs']=['feedback.json'];self.rt.open(p)
        self.assertEqual(self.rt.pending_issues(),[]);n=self.rt.next('queued');self.assertEqual(n['reason'],'CORRECTION_FIRST');self.assertEqual(n['issues'][0]['id'],'F01')
    def test_request_capture_interrupts_without_deleting_approval_or_results(self):
        from requests import intake
        self.until('C07_BUILD@a');before=self.rt.state(self.work)
        req={'id':'new-request','kind':'correction','quote':'直して','source_ref':'conversation:test','version':'a'*40}
        intake(self.rt,self.work,req);self.assertEqual(self.rt.next(self.work)['reason'],'CORRECTION_FIRST')
        self.assertEqual(self.rt.state(self.work)['results'],before['results']);self.assertEqual(self.rt.approval(self.rt.state(self.work)),self.rt.approval(before))
    def test_feedback_is_captured_immediately_not_on_acceptance(self):
        self.rt.user(self.work,'quality_negative','式が読めない','evidence','simulation:comment',verification_level='simulation')
        rows=[e for e in self.rt.store.events() if e['kind']=='feedback_captured'];self.assertEqual(len(rows),1);self.assertEqual(rows[0]['payload']['quality'],'NEGATIVE')
    def test_quality_positive_cannot_accept_app(self):
        self.until('G3_FINAL@u1');u=self.rt.user(self.work,'quality_positive','良い','fixture','simulation:comment',verification_level='simulation',release_unit='u1')
        with self.assertRaises(Rejected):self.rt.accept(self.work,'G3_FINAL@u1',u,[self.ev])
    def test_wrong_unit_acceptance_rejected(self):
        self.until('G3_FINAL@u1');s=self.rt.state(self.work);host=self.rt.store.get(s['results']['G3_HOST@u1']['artifact'])
        u=self.rt.user(self.work,'accept_app','確認',host['evidence_refs'][0],'simulation:comment',verification_level='simulation',release_unit='u2')
        with self.assertRaises(Rejected):self.rt.accept(self.work,'G3_FINAL@u1',u,[self.ev])
    def test_runner_receipts_cannot_be_forged_from_user_pass_flag(self):
        self.until('C01_SOURCE@a');c=self.rt.claim(self.work,'C01_SOURCE@a','fixture');n=c['node'];r=self.result(n,[])
        with self.assertRaises(Rejected):self.rt.submit(self.work,n['id'],c['claim_token'],r)
    def test_unsupported_code_blocks_ai_pass(self):
        self.until('C01_SOURCE@a');n=self.rt.next(self.work)['task']['node']
        inputs={c:{} for c in n['capability_requests']}
        with patch('runner.code_operation',return_value={'status':'UNSUPPORTED'}):job=run_stage(self.rt,self.work,inputs)
        with self.assertRaises(Rejected):self.rt.submit(self.work,n['id'],job['claimToken'],self.result(n,job['receipts']))
    def test_capability_cache_reuses_output_but_binds_to_current_node_and_phase(self):
        n=instantiate(self.plan)['C01_SOURCE@a'];r1=run_capability(self.rt,self.work,n,'source.fixed',{})
        r2=run_capability(self.rt,self.work,n,'source.fixed',{})
        self.assertFalse(self.rt.store.get(r1)['reused']);self.assertTrue(self.rt.store.get(r2)['reused'])
        self.assertEqual(self.rt.store.get(r1)['output'],self.rt.store.get(r2)['output'])
    def test_migration_archives_results_but_does_not_fake_cause_impact_pass(self):
        from migrations import migrate
        p=self.make_plan('CMD-WORK-001','old');p['workflow_version']='production/1';self.rt.open(p)
        ev=self.rt.evidence('old','file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
        new=copy.deepcopy(p);new['workflow_version']='production/2';migrate(self.rt,'old',new,[ev]);s=self.rt.state('old')
        self.assertEqual(s['results'],{});self.assertIn('R02_CAUSE',s['migration']['missing_contracts']);self.assertEqual(self.rt.next('old')['task']['node']['id'],'S00_RECOVER')
    def test_three_diagrams_share_ledger_head(self):
        out=rendered(self.rt,self.work);head=self.rt.store.head
        for name in ('FIRE_DIAGRAM.md','BLOCK_FIRE_DIAGRAM.md','CAPABILITY_FIRE_DIAGRAM.md'):self.assertIn(head,out[name]);self.assertIn('flowchart TD',out[name])
    def test_invalid_ids_cycles_and_partitions_rejected(self):
        p=self.make_plan();p['blocks'][0]['depends_on_blocks']=['b'];p['blocks'][1]['depends_on_blocks']=['a']
        with self.assertRaises(Rejected):instantiate(p)
        p=self.make_plan();p['blocks'][0]['id']='bad"] --> evil'
        with self.assertRaises(Rejected):instantiate(p)
    def test_layout_only_correction_uses_small_capability_set(self):
        p=self.make_plan('CMD-WORK-001');p['blocks'][0]['change_facets']=['render'];n=instantiate(p)['R04_PROPOSAL@a']
        self.assertNotIn('math.solve',n['capability_requests']);self.assertNotIn('blank.plan',n['capability_requests']);self.assertIn('ir.verify',n['capability_requests'])
    def test_real_source_receipt_is_actual_manifest(self):
        n=instantiate(self.plan)['C01_SOURCE@a'];r=run_capability(self.rt,self.work,n,'source.fixed',{})
        output=self.rt.store.get(self.rt.store.get(r)['output']);self.assertEqual(output['status'],'PASS');self.assertEqual(output['sourceManifest'],self.plan['source_manifest'])


    def prepare(self,nid):
        self.until(nid);n=self.rt.next(self.work)['task']['node'];inputs={c:{} for c in n['capability_requests']}
        if 'source.audit' in inputs:inputs['source.audit']={'coverage':{},'sourceBlocks':[],'candidate':{}}
        with patch('runner.code_operation',self.fake_service):job=run_stage(self.rt,self.work,inputs)
        return n,job,self.result(n,job['receipts'])
    def repair_fixture(self):
        self.plan=self.make_plan('CMD-WORK-001','repair');self.work='repair';self.rt.open(self.plan)
        self.ev=self.rt.evidence(self.work,'file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
    def test_impact_phase_and_missing_inventory_rows_rejected(self):
        self.repair_fixture();n,j,r=self.prepare('R03_IMPACT@a');r['impact_rows'][0]['phase']='post-fix'
        with self.assertRaises(Rejected):self.rt.submit(self.work,n['id'],j['claimToken'],r)
        r=self.result(n,j['receipts']);r['impact_rows'].pop()
        with self.assertRaises(Rejected):self.rt.submit(self.work,n['id'],j['claimToken'],r)
    def test_impact_visited_has_no_duplicate_same_phase_and_tracks_new_version(self):
        from impact import record_visits
        r={'rootCauseSignature':'cause','artifact':'a.json','version':'a'*40,'phase':'post-fix'}
        record_visits(self.rt,self.work,[r]);record_visits(self.rt,self.work,[r]);r['version']='b'*40;record_visits(self.rt,self.work,[r])
        self.assertEqual(len([e for e in self.rt.store.events() if e['kind']=='impact_visited']),2)
    def test_g2_new_regression_cannot_be_queued_as_release_ready(self):
        n,j,r=self.prepare('G2_AUDIT@u1');r['audit_rows'][0].update(new_regression=True)
        with self.assertRaises(Rejected):self.rt.submit(self.work,n['id'],j['claimToken'],r)
        r['audit_rows'][0].update(new_regression=False,status='UNVERIFIED')
        with self.assertRaises(Rejected):self.rt.submit(self.work,n['id'],j['claimToken'],r)
    def test_pending_correction_work_without_issue_is_seen(self):
        p=self.make_plan('CMD-WORK-001','unstarted-repair');self.rt.open(p)
        n=self.rt.next(self.work);self.assertEqual(n['reason'],'CORRECTION_FIRST');self.assertIn('unstarted-repair',[r['id'] for r in n['issues']])
    def test_unit_sha_binding_does_not_erase_other_unit_acceptance(self):
        self.until('C07_BUILD@b');self.rt.bind_candidate(self.work,'b'*40,release_units=['u2']);s=self.rt.state(self.work);nodes=instantiate(s['plan'])
        self.assertEqual(self.rt.node_status(s,nodes['G3_FINAL@u1']),'PASSED');self.assertEqual(s['release_versions'],{'u1':'a'*40,'u2':'b'*40})
    def test_explicit_old_content_approval_survives_migration_without_faking_analysis(self):
        from migrations import migrate
        p=self.make_plan('CMD-WORK-001','legacy-approved');p['workflow_version']='production/1';self.rt.open(p)
        ev=self.rt.evidence('legacy-approved','file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
        old=self.rt.user('legacy-approved','approve_proposal','simulation old approval',p['proposal']['hash'],'simulation:old',verification_level='simulation')
        p['workflow_version']='production/2';migrate(self.rt,'legacy-approved',p,[ev]);s=self.rt.state('legacy-approved')
        self.assertEqual(self.rt.approval(s)['id'],old);self.assertEqual(s['results'],{})
    def test_scoped_bundle_revision_preserves_other_bundle_approval(self):
        p=self.make_plan(work='bundles');p['approval_bundles']=[{'id':bid,'block_ids':[bid],'proposal_hash':digest(bid+'proposal'),'content_hash':digest(bid+'content')} for bid in ('a','b')];self.rt.open(p)
        u=self.rt.user('bundles','approve_proposal','simulation both',p['proposal']['hash'],'simulation:both',verification_level='simulation')
        revised=copy.deepcopy(p);revised['proposal']['hash']=digest('new master');revised['approval_bundles'][0]['proposal_hash']=digest('new a');self.rt.revise('bundles',revised);s=self.rt.state('bundles');nodes=instantiate(s['plan'])
        self.assertIsNone(self.rt.approval(s,nodes['C06_APPROVAL@a']));self.assertEqual(self.rt.approval(s,nodes['C06_APPROVAL@b'])['id'],u)
    def test_mid_claim_input_change_is_rejected(self):
        self.until('C01_SOURCE@a');self.rt.claim(self.work,'C01_SOURCE@a','fixture')
        with self.assertRaises(Rejected):self.rt.block_context(self.work,'a',{'render':self.rt.store.put({'a':1})},[self.ev])
    def test_fake_closure_of_own_issue_without_repair_proof_rejected(self):
        self.repair_fixture();self.rt.issue(self.work,{'id':'own','root_cause':'cause','evidence_refs':[self.ev],'description':'fixture problem','version':'a'*40,'block':'a'})
        with self.assertRaises(Rejected):self.rt.close_integration_issues(self.work,self.rt.state(self.work),instantiate(self.rt.state(self.work)['plan']))
    def test_real_source_import_reads_block_not_other_cached_block(self):
        nodes=instantiate(self.plan);a=run_capability(self.rt,self.work,nodes['C01_SOURCE@a'],'source.import',{});b=run_capability(self.rt,self.work,nodes['C01_SOURCE@b'],'source.import',{})
        self.assertEqual(set(self.rt.store.get(self.rt.store.get(a)['output'])['sourceIndex']),{'a.json'});self.assertEqual(set(self.rt.store.get(self.rt.store.get(b)['output'])['sourceIndex']),{'b.json'})


    def test_verified_local_repair_closes_without_self_child_deadlock(self):
        self.repair_fixture();self.rt.issue(self.work,{'id':'own','root_cause':'cause','evidence_refs':[self.ev],'description':'fixture problem','version':'a'*40,'block':'a'})
        for _ in range(100):
            if self.rt.next(self.work)['status']=='DONE':break
            self.step()
        self.assertEqual(self.rt.next(self.work)['status'],'DONE');self.assertEqual(self.rt.state(self.work)['issues']['own']['resolved_by'],self.work)
    def test_sibling_pre_scope_can_be_queued_but_post_fix_requires_completion(self):
        from impact import check
        self.repair_fixture();p=self.make_plan('CMD-WORK-001','sibling');p['parent_impact']={'work':self.work,'signature':'fixture-root','artifact':'a.json','version':'a'*40};self.rt.open(p)
        nodes=instantiate(self.rt.state(self.work)['plan']);pre=nodes['R03_IMPACT@a'];r=self.result(pre,[]);r['impact_rows'][0].update(sibling=True,linkedCorrection='sibling',status='AFFECTED')
        check(self.rt,self.work,pre,r)
        post=nodes['R03_IMPACT_SWEEP@u1'];r=self.result(post,[]);r['impact_rows'][0].update(sibling=True,linkedCorrection='sibling',status='AFFECTED')
        with self.assertRaises(Rejected):check(self.rt,self.work,post,r)
        p['work_id']='duplicate-sibling'
        with self.assertRaises(Rejected):self.rt.open(p)
    def test_revision_cannot_bypass_explicit_workflow_migration(self):
        p=self.make_plan();p['workflow_version']='production/1';p['proposal']['hash']=digest('revised')
        with self.assertRaises(Rejected):self.rt.revise(self.work,p)


    def test_adopt_verified_child_composes_existing_approvals_without_new_user_event(self):
        from adapters import apply_patch
        self.until('C07_BUILD@a');parent=self.work;parent_ev=self.ev;parent_solution=self.rt.state(parent)['results']['C04_SOLUTION@a']['artifact']
        text='{"value":"fixed"}';import hashlib
        delta={'files':[{'path':'a.json','before_sha256':manifest(self.root,['a.json'])['a.json'],'after_text':text,'after_sha256':hashlib.sha256(text.encode()).hexdigest()}]}
        p=self.make_plan('CMD-WORK-001','child');p['parent_work']=parent;p['proposal']['patch_hash']=digest(delta)
        for b in p['blocks']:b['change_facets']=['render']
        self.rt.open(p);self.plan=p;self.work='child';self.ev=self.rt.evidence('child','file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
        for _ in range(100):
            nxt=self.rt.next('child')
            if nxt['status']=='DONE':break
            if nxt.get('task',{}).get('node',{}).get('id')=='R06_PATCH@a':
                n=nxt['task']['node']
                with patch('runner.code_operation',self.fake_service):job=run_stage(self.rt,'child',{c:{} for c in n['capability_requests']})
                apply_patch(self.rt,'child',n['id'],job['claimToken'],delta);self.rt.bind_candidate('child','b'*40)
                self.rt.production_result('child',n['id'],job['claimToken'],self.result(n,job['receipts']))
            else:self.step()
        self.assertEqual(self.rt.next('child')['status'],'DONE')
        result=self.rt.adopt_correction(parent,'child',{'a':'a'},[parent_ev]);s=self.rt.state(parent)
        self.assertEqual(len(s['users']),1);self.assertIsNotNone(self.rt.approval(s));self.assertEqual(s['results']['C04_SOLUTION@a']['artifact'],parent_solution)
        self.assertEqual(self.rt.node_status(s,instantiate(s['plan'])['C04_SOLUTION@a']),'PASSED');self.assertEqual(s['candidate_sha'],'b'*40);self.assertIn('required_rechecks',result)
    def test_new_non_simulation_material_cannot_open_old_production_graph(self):
        (self.root/'governance').mkdir();(self.root/'governance/REVIEW_POLICY.json').write_text(json.dumps({'screenshotApprovalRequired':False}))
        p=self.make_plan(work='new-old-graph');p['workflow_version']='production/1';p['simulation']=False
        with self.assertRaises(Rejected):self.rt.open(p)
    def test_protected_manifest_cannot_be_replaced_with_after_hash(self):
        p=self.make_plan(work='preserved');p['scope']['preserve']=['b.json'];self.rt.open(p);(self.root/'b.json').write_text('{"changed":true}')
        self.assertIn('保護対象',self.rt.next('preserved')['reason'])


    def test_learning_catalog_is_stored_and_training_cannot_take_unbound_examples(self):
        from learning import finalize,training_inputs
        out=finalize(self.rt,self.work,{'caseUpdates':[]});self.assertEqual(out['status'],'PASS');self.assertEqual(self.rt.store.get(out['catalogArtifact'])['caseUpdates'],[])
        with self.assertRaises(Rejected):training_inputs(self.rt,{'request':{'examples':[{'label':1}]}})
        with self.assertRaises(Rejected):training_inputs(self.rt,{'corpus_artifact':out['catalogArtifact'],'request':{}})
    def test_learning_cannot_invent_gold_evaluation_from_unrelated_observation(self):
        from learning import finalize
        with self.assertRaises(Rejected):finalize(self.rt,self.work,{'caseUpdates':[],'curation':{'observations':[{'id':'invented'}],'decisions':[{'id':'invented','observationId':'invented','quality':'POSITIVE','evidenceTier':'USER_GOLD'}]}})

if __name__=='__main__':unittest.main()
