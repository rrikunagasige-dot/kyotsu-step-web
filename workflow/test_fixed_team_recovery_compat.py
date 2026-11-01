"""Recovery fixtures only: no real agent creation, user acceptance or old-ledger mutation."""
import copy,json,tempfile,time,unittest,subprocess,sys,zipfile
from pathlib import Path
from unittest.mock import patch
from contracts import Rejected,manifest
from runtime import Runtime
from definitions import DEFINITION_HASH
from store import digest
from team import default_policy,validate_policy
from agent_guard import verify_agent_inventory,validate_policy_work,enforce_registered_pool
from team_transport import capture_harness


def fixed_policy(limit=3):
    p=default_policy();p.update(max_active_subagents=limit,max_total_subagents=limit,count_completed_subagents=True,
      fixed_subagents={'A':'/root/a','B':'/root/b','MONITOR':'/root/monitor'},monitor_agent_ref='/root/monitor',authorization_ref='TEST_FIXTURE_AUTHORIZATION',guard_session='fixture-session')
    if limit==4:
        p['fixed_subagents']['REVIEWER']='/root/reviewer'
        p['review_extension']={'work_id':'fixture','previous_total':3,'additional_reviewers':1,'reviewer_ref':'/root/reviewer','fork_turns':'none','authorization_ref':p['authorization_ref']}
    return p


def inventory(policy,operation='execute',nonce='one'):
    return {'agentRef':'/root','taskRef':'/root','attestationMethod':'transcribed-tool-result','toolName':'collaboration.list_agents',
      'session':policy['guard_session'],'operation':operation,'nonce':nonce,'observed_at_ms':time.time()*1000,
      'rawResult':{'agents':[{'agent_name':n,'agent_status':'completed' if n.endswith('/a') else 'running'} for n in ['/root',*policy['fixed_subagents'].values()]]}}

class FixedPolicyRecovery(unittest.TestCase):
    def test_standard_two_unchanged_and_four_work_scoped(self):
        self.assertEqual(validate_policy(default_policy()),default_policy())
        p=fixed_policy(4);self.assertEqual(validate_policy(p),p);validate_policy_work(p,'fixture')
        with self.assertRaises(Rejected):validate_policy_work(p,'other')
        p.pop('authorization_ref')
        with self.assertRaises(Rejected):validate_policy(p)
    def test_fresh_inventory_and_replay_unknown_grandchild_excess_rejected(self):
        p=fixed_policy();r=inventory(p);now=time.time()*1000
        self.assertEqual(verify_agent_inventory(p,r,session=p['guard_session'],operation='execute',nonce='one',now_ms=now)['childCount'],3)
        for mutate in [lambda d:d.update(observed_at_ms=now-120001),lambda d:d.update(session='other'),lambda d:d['rawResult']['agents'].append({'agent_name':'/root/a/grandchild','agent_status':'running'}),lambda d:d['rawResult']['agents'].append({'agent_name':'/root/extra','agent_status':'completed'}),lambda d:d['rawResult']['agents'][1].update(agent_status='mystery')]:
            d=copy.deepcopy(r);mutate(d)
            with self.assertRaises(Rejected):verify_agent_inventory(p,d,session=p['guard_session'],operation='execute',nonce='one',now_ms=now)
        with self.assertRaises(Rejected):verify_agent_inventory(p,r,session=p['guard_session'],operation='execute',nonce='one',now_ms=now,used_nonces=['one'])
    def test_completed_registered_children_are_not_free_slots(self):
        p=fixed_policy();regs={str(i):{'harness':{'agentRef':a,'logicalRole':role}} for i,(role,a)in enumerate(p['fixed_subagents'].items())}
        enforce_registered_pool(p,regs,{'agentRef':'/root/a','logicalRole':'A'})
        with self.assertRaises(Rejected):enforce_registered_pool(p,regs,{'agentRef':'/root/replacement','logicalRole':'A'})
    def test_execute_guard_nonce_is_consumed_once_without_auto_bypass(self):
        with tempfile.TemporaryDirectory()as d:
            root=Path(d);(root/'a.json').write_text('{}');p=fixed_policy();rt=Runtime(root/'ledger',root)
            plan={'work_id':'fixture','profile':'material','workflow_version':'production/2','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':manifest(root,['a.json']),'rules':{},'proposal':{'id':'fixture','hash':digest('p')},'scope':{'paths':['a.json'],'preserve':[]},'blocks':[{'id':'a','sources':['a.json']}],'simulation':True,'agent_team':p}
            rt.open(plan)
            with self.assertRaises(Rejected):rt.execute('fixture','S00_RECOVER')
            raw=inventory(p);ref=capture_harness(rt,'fixture',raw)['artifactRef'];rt.execute('fixture','S00_RECOVER',agent_guard_ref=ref)
            with self.assertRaises(Rejected):rt.execute('fixture','S01_ROUTE',agent_guard_ref=ref)
            self.assertEqual(sum(e['kind']=='agent_guard_consumed'for e in rt.store.events()),1)
            proc=subprocess.run([sys.executable,str(Path(__file__).with_name('cli.py')),'--root',str(root),'--store',str(root/'ledger'),'auto','--work','fixture'],capture_output=True,text=True)
            self.assertNotEqual(proc.returncode,0);self.assertIn('capture',proc.stdout+proc.stderr)

class DefinitionRecovery(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);(self.root/'a.json').write_text('{}');(self.root/'rules.md').write_text('fixture')
        self.rt=Runtime(self.root/'ledger',self.root);self.work='fixture';self.plan={'work_id':self.work,'profile':'material','workflow_version':'production/2','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':manifest(self.root,['a.json']),'rules':manifest(self.root,['rules.md']),'proposal':{'id':'fixture','hash':digest('p')},'scope':{'paths':['a.json'],'preserve':[]},'blocks':[{'id':'a','sources':['a.json']}],'simulation':False}
        self.rt.open(self.plan);self.user=self.rt.user(self.work,'approve_proposal','TEST_FIXTURE_APPROVAL_ONLY',self.plan['proposal']['hash'],'test-fixture:synthetic-authority');self.rt.execute(self.work,'S00_RECOVER');self.rt.execute(self.work,'S01_ROUTE')
        self.source_store=self.rt.store.root;self.archive=self.root/'fixture-origin.zip'
        with zipfile.ZipFile(self.archive,'w') as z:
            for f in self.source_store.rglob('*.json'):z.write(f,'runtime/'+str(f.relative_to(self.source_store)))
        dest=Runtime.create_recovery_copy(self.root,self.archive,'runtime',self.work);self.rt=Runtime(dest,self.root)
    def tearDown(self):self.tmp.cleanup()
    def proof(self,new):
        s=self.rt.state(self.work);p={'schemaVersion':'recovery-definition-preflight/1','work':self.work,'fromDefinition':s['definition_hash'],'toDefinition':new,'planHash':digest(s['plan']),'sourceManifestHash':digest(s['plan']['source_manifest']),'candidateManifestHash':digest(s['candidate_manifest']),'rulesHash':digest(s['plan']['rules']),'userRecordsHash':digest(s['users']),'ledgerHead':self.rt.store.head,'storeRoot':str(self.rt.store.root),'copyOriginHash':digest(self.rt.verify_recovery_copy_origin(self.work)),'sourceRoot':str(self.root),'copyOnly':True,'resultDispositions':[{'node':n,'artifact':v['artifact'],'disposition':'INVALIDATED_BY_DEFINITION','reason':'Fixture engine version change invalidates input hash'}for n,v in s['results'].items()]};return p
    def evidence(self,p):
        f=self.root/'preflight.json';f.write_text(json.dumps(p));return self.rt.evidence(self.work,'file',{'path':f.name,'sha256':manifest(self.root,[f.name])[f.name]},source_ref='test-fixture:preflight')
    def test_migration_preserves_approval_and_history_invalidates_and_resumes(self):
        new='b'*64;p=self.proof(new);before=self.rt.store.events();users=copy.deepcopy(self.rt.state(self.work)['users']);ref=self.evidence(p)
        with patch('runtime.DEFINITION_HASH',new):
            self.assertEqual(self.rt.next(self.work)['status'],'BLOCKED');self.rt.migrate_definition(self.work,DEFINITION_HASH,[ref]);s=self.rt.state(self.work)
            self.assertEqual(s['users'],users);self.assertEqual(self.rt.approval(s)['id'],self.user);self.assertEqual(self.rt.node_status(s,__import__('definitions').instantiate(s['plan'])['S00_RECOVER']),'INVALIDATED')
            self.assertEqual(self.rt.next(self.work)['task']['node']['id'],'S00_RECOVER');self.rt.execute(self.work,'S00_RECOVER');self.rt.execute(self.work,'S01_ROUTE');self.assertEqual(self.rt.next(self.work)['task']['node']['id'],'R01_CAPTURE@a')
            self.rt.user(self.work,'pause','TEST_FIXTURE_PAUSE','state','test-fixture');self.assertEqual(self.rt.next(self.work)['status'],'WAITING');self.rt.user(self.work,'resume','TEST_FIXTURE_RESUME','state','test-fixture');self.assertEqual(self.rt.next(self.work)['task']['node']['id'],'R01_CAPTURE@a')
        self.assertEqual(self.rt.store.events()[:len(before)],before)
    def test_missing_or_wrong_scope_target_or_dispositions_cannot_migrate(self):
        for field,value in [('planHash','f'*64),('toDefinition','c'*64),('sourceManifestHash','f'*64),('userRecordsHash','f'*64),('resultDispositions',[]),('copyOnly',False)]:
            p=self.proof('b'*64);p[field]=value;ref=self.evidence(p);head=self.rt.store.head
            with patch('runtime.DEFINITION_HASH','b'*64):
                with self.assertRaises(Rejected):self.rt.migrate_definition(self.work,DEFINITION_HASH,[ref])
            self.assertEqual(self.rt.store.head,head)
    def test_source_or_rule_change_after_preflight_rejected(self):
        p=self.proof('b'*64);ref=self.evidence(p);(self.root/'a.json').write_text('changed')
        with patch('runtime.DEFINITION_HASH','b'*64):
            with self.assertRaises(Rejected):self.rt.migrate_definition(self.work,DEFINITION_HASH,[ref])
    def test_bare_evidence_cannot_change_definition(self):
        ref=self.rt.evidence(self.work,'file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='test-fixture')
        with patch('runtime.DEFINITION_HASH','b'*64):
            with self.assertRaises(Rejected):self.rt.migrate_definition(self.work,DEFINITION_HASH,[ref])

    def test_original_store_or_wrong_store_marker_cannot_migrate(self):
        copied=self.rt;original=Runtime(self.source_store,self.root)
        self.rt=original
        ref=original.evidence(self.work,'file',{'path':'a.json','sha256':manifest(self.root,['a.json'])['a.json']},source_ref='TEST_FIXTURE_ONLY')
        with patch('runtime.DEFINITION_HASH','b'*64):
            with self.assertRaisesRegex(Rejected,'専用コピーStore'):original.migrate_definition(self.work,DEFINITION_HASH,[ref])
        self.rt=copied
        marker=copied.store.root/'.recovery-copy-origin.json';data=json.loads(marker.read_text());data['storeRoot']=str(self.source_store);marker.write_text(json.dumps(data))
        with self.assertRaises(Rejected):copied.verify_recovery_copy_origin(self.work)
    def test_copy_original_prefix_and_archive_tampering_rejected(self):
        origin=self.rt.verify_recovery_copy_origin(self.work)
        f=self.rt.store.root/next(iter(origin['files']));raw=f.read_bytes();f.write_bytes(raw+b' ')
        with self.assertRaises(Rejected):self.rt.verify_recovery_copy_origin(self.work)
        f.write_bytes(raw);self.archive.write_bytes(self.archive.read_bytes()+b'changed')
        with self.assertRaises(Rejected):self.rt.verify_recovery_copy_origin(self.work)
    def test_historical_handoff_interrupts_claim_without_erasing_event(self):
        node='R01_CAPTURE@a';self.rt.append('claimed',self.work,{'node':node,'actor':'TEST_FIXTURE_OLD_REVIEWER','input_hash':'f'*64,'expires_at':time.time()+60,'token':'TEST_FIXTURE'})
        before=self.rt.store.events();plan=copy.deepcopy(self.rt.state(self.work)['plan']);plan['agent_team']=fixed_policy(4)
        self.rt.append('team_policy_adopted',self.work,{'plan':plan,'invalidated_results':[],'reviewer_handoff':{'interruptedClaims':[node]}})
        self.assertNotIn(node,self.rt.state(self.work)['claims']);self.assertEqual(self.rt.store.events()[:len(before)],before)

    def test_symlink_alias_cannot_make_original_store_a_copy(self):
        dest=self.rt.store.root;origin=self.rt.verify_recovery_copy_origin(self.work);dest.rename(dest.with_name('retained-copy'));dest.symlink_to(self.source_store,target_is_directory=True)
        origin['storeRoot']=str(self.source_store)
        (self.source_store/'.recovery-copy-origin.json').write_text(json.dumps(origin))
        alias=Runtime(dest,self.root)
        with self.assertRaisesRegex(Rejected,'専用コピーStore'):alias.verify_recovery_copy_origin(self.work)
    def test_copy_creation_rejects_dot_and_parent_names(self):
        for work in ['.','..','../outside','/absolute']:
            with self.assertRaises(Rejected):Runtime.create_recovery_copy(self.root,self.archive,'runtime',work)

class FixedReviewerRegistration(unittest.TestCase):
    def test_fixed_reviewer_registers_but_self_review_still_rejected(self):
        import test_team as fixtures
        from team_transport import register_task
        with tempfile.TemporaryDirectory()as d:
            rt=fixtures.FixtureRuntime(Path(d)/'ledger');p=fixed_policy(4);p['review_extension']['work_id']='W';rt.s['plan']['agent_team']=p
            node=__import__('definitions').instantiate(rt.s['plan'])['C01_SOURCE@a'];who='/root/reviewer'
            def call(aid,authors):
                a={'assignmentId':aid,'roleEpoch':1,'node':node['id'],'block':'a','facet':'render','claimRefs':['layout'],'performerRef':who,'role':'reviewer','inputHash':rt.input_hash(rt.s,node),'sourceSHA':'a'*40,'artifactHashes':{'layout':digest('layout')},'allowedPaths':[],'writeMode':'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX','dependsOnTasks':[],'budget':{'tokenBudget':None},'independent':True}
                packet={'baseNodeInputHash':a['inputHash'],'sourceRefs':['source-a'],'authorHistory':[{'claimRef':'layout','facet':'render','semanticContributorRefs':authors}],'contextExposure':{'forkMode':'none','authorRationaleVisibleAtFirstPass':False}};packet['packetHash']=digest(packet)
                raw=rt.store.put({'agentRef':who,'taskRef':aid,'parentRef':'/root','toolName':'collaboration.followup_task','rawResult':{'task_name':who}})
                h={'agentRef':who,'taskRef':aid,'parentRef':'/root','logicalRole':'REVIEWER','toolResultRef':raw,'attestationMethod':'simulation'}
                return register_task(rt,'W',a,packet,h)
            self.assertTrue(call('review',[])['registrationRef'])
            with self.assertRaisesRegex(Rejected,'作者'):call('self-review',[who])

class PolicyOnlyAuthorization(unittest.TestCase):
    """Synthetic authority fixtures: policy approval never grants content approval."""
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);(self.root/'a.json').write_text('{}')
        self.rt=Runtime(self.root/'ledger',self.root);self.work='fixture';self.old=fixed_policy(4)
        self.plan={'work_id':self.work,'profile':'material','workflow_version':'production/2','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':manifest(self.root,['a.json']),'rules':{},'proposal':{'id':'fixture','hash':digest('p')},'scope':{'paths':['a.json'],'preserve':[]},'blocks':[{'id':'a','sources':['a.json']}],'simulation':True,'agent_team':self.old}
        self.rt.open(self.plan);self.old_approval=self.rt.user(self.work,'approve_proposal','FIXTURE_OLD_CONTENT_APPROVAL',self.plan['proposal']['hash'],'fixture:old-content',verification_level='simulation')
    def tearDown(self):self.tmp.cleanup()
    def test_policy_only_adoption_preserves_old_content_approval_and_history(self):
        from team_migration import adopt_team_policy
        before=self.rt.state(self.work);events=self.rt.store.events();policy=default_policy()
        ref=self.rt.user(self.work,'authorize_team_policy','FIXTURE_POLICY_ONLY',self.plan['proposal']['hash'],'fixture:policy-only',team_policy_hash=digest(policy),verification_level='simulation')
        self.assertNotIn('approved_bundles',self.rt.state(self.work)['users'][ref]);self.assertEqual(self.rt.approval(self.rt.state(self.work))['id'],self.old_approval);adopt_team_policy(self.rt,self.work,policy,ref,self.rt.store.head)
        after=self.rt.state(self.work);self.assertEqual(after['plan']['agent_team'],policy);self.assertEqual(self.rt.approval(after)['id'],self.old_approval);self.assertEqual(after['users'][self.old_approval],before['users'][self.old_approval]);self.assertEqual(self.rt.store.events()[:len(events)],events)
    def test_policy_authorization_without_original_content_does_not_create_content_approval(self):
        # New fixture has no content approval at all.
        w='no-content';plan=copy.deepcopy(self.plan);plan['work_id']=w;plan['agent_team']=default_policy();self.rt.open(plan)
        self.rt.user(w,'authorize_team_policy','FIXTURE_ONLY_POLICY',plan['proposal']['hash'],'fixture:no-content',team_policy_hash=digest(default_policy()),verification_level='simulation');self.assertIsNone(self.rt.approval(self.rt.state(w)))
    def test_policy_authorization_requires_exact_proposal_and_policy_hash_without_bundle(self):
        for kw in [{},{'team_policy_hash':'bad'},{'team_policy_hash':digest(default_policy()),'bundle_ids':['proposal']}]:
            head=self.rt.store.head
            with self.subTest(kw=kw),self.assertRaises(Rejected):self.rt.user(self.work,'authorize_team_policy','FIXTURE',self.plan['proposal']['hash'],'fixture',verification_level='simulation',**kw)
            self.assertEqual(self.rt.store.head,head)
        with self.assertRaises(Rejected):self.rt.user(self.work,'authorize_team_policy','FIXTURE','f'*64,'fixture',team_policy_hash=digest(default_policy()),verification_level='simulation')
    def test_other_policy_cannot_consume_policy_only_approval(self):
        from team_migration import adopt_team_policy
        p=default_policy();ref=self.rt.user(self.work,'authorize_team_policy','FIXTURE',self.plan['proposal']['hash'],'fixture',team_policy_hash=digest(p),verification_level='simulation');other=copy.deepcopy(p);other['required_scopes']=other['required_scopes'][:-1]
        head=self.rt.store.head
        with self.assertRaises(Rejected):adopt_team_policy(self.rt,self.work,other,ref,head)
        self.assertEqual(self.rt.store.head,head)
    def test_policy_authorization_rejects_other_scope(self):
        head=self.rt.store.head
        with self.assertRaises(Rejected):self.rt.user(self.work,'authorize_team_policy','FIXTURE',self.plan['proposal']['hash'],'fixture',scope={'paths':['other.json']},team_policy_hash=digest(default_policy()),verification_level='simulation')
        self.assertEqual(self.rt.store.head,head)
