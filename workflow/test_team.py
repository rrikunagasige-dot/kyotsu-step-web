"""Negative team fixtures. Synthetic harness records are not real agent acceptance."""
import copy
import tempfile
import unittest
from pathlib import Path
from contracts import Rejected
from store import Store, digest
from graphs import normalized
from team import default_policy, validate_policy, node_requirements, project, check_collection, effective_authors, validate_target
from team_transport import register_task, record_output, reconcile_task, capture_harness, bind_target
from team_migration import adopt_team_policy


class FixtureRuntime:
    """Use the real Store, with stable node inputs independent of concurrent edits."""
    def __init__(self, path):
        self.root=Path(path).parent
        (self.root/'preview.txt').write_text('static fixture design')
        self.store = Store(path); self._head = self.store.head; self.input_epoch = 0
        policy = default_policy()
        policy['required_scopes'] = [dict(stage_kind='C01_SOURCE', claimRef='layout', facet='render', reviewKind='learner-visible-review', independent=True, sourceFirst=True, firstPass=True)]
        plan = dict(work_id='W', profile='material', workflow_version='production/2', command='CMD-WORK-002', subject='math', mode='textbook', source_sha='a'*40,
                    source_manifest={'a.json':digest('a'), 'b.json':digest('b')}, rules={}, proposal={'id':'P','hash':digest('proposal'),'contentDesignHash':digest('content')},
                    scope={'paths':['a.json','b.json'],'preserve':[]}, blocks=[{'id':'a','sources':['a.json']},{'id':'b','sources':['b.json']}], simulation=True, agent_team=policy)
        self.s = dict(plan=normalized(plan), claims={}, external={}, results={}, users={}, evidence={}, definition_hash=digest('definition'), candidate_sha='a'*40)
    def fingerprint_refs(self,s,refs):
        for ref in refs:
            if ref not in s['evidence']: raise Rejected('missing native evidence')
    def state(self, work):
        self._head = self.store.head
        return copy.deepcopy(self.s)
    def append(self, kind, work, payload, **kw):
        e = self.store.append(kind,work,payload,expected=self._head,**kw); self._head=e['hash']
        return e
    def input_hash(self, s, node): return digest([node['id'], self.input_epoch])


class TeamContracts(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.rt=FixtureRuntime(Path(self.tmp.name)/'ledger')
        self.node=dict(id='C01_SOURCE@a',stage_kind='C01_SOURCE',block='a',phase='pre-design')
    def tearDown(self): self.tmp.cleanup()
    def registration(self, who='A', role='reviewer', aid='task', epoch=1, authors=None, paths=None, block='a', exposed=False, independent=True,stage='C01_SOURCE',target=None):
        node=dict(self.node, id=stage+'@'+(block or 'unit'), block=block)
        a=dict(assignmentId=aid,roleEpoch=epoch,node=node['id'],block=block,facet='render',claimRefs=['layout'],performerRef=who,role=role,inputHash=self.rt.input_hash(self.rt.s,node),sourceSHA='a'*40,
               artifactHashes={'layout':digest('layout')},allowedPaths=paths or [],writeMode='PATCH_PROPOSAL' if paths else 'READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX',dependsOnTasks=[],budget={'tokenBudget':None},independent=independent)
        if target: a['targetManifestRef']=target
        p=dict(baseNodeInputHash=a['inputHash'],sourceRefs=['source-a'],authorHistory=[dict(claimRef='layout',facet='render',semanticContributorRefs=authors or [])],contextExposure={'forkMode':'all','authorRationaleVisibleAtFirstPass':exposed})
        p['packetHash']=digest(p)
        taskref=aid+'-'+str(epoch)
        raw=self.rt.store.put(dict(agentRef=who,taskRef=taskref,parentRef='/root',toolName='collaboration.spawn_agent',rawResult={'task_name':who}))
        h=dict(agentRef=who,taskRef=taskref,parentRef='/root',logicalRole=who if who in ('A','B') else 'A',toolResultRef=raw,attestationMethod='simulation')
        r=register_task(self.rt,'W',a,p,h)
        return r,a,p,h
    def output(self, registration, verdict='PASS', kind='review', findings=None, **extra):
        r,a,p,h=registration
        first=self.rt.store.put({'assignmentHash':r['assignmentHash'],'packetHash':p['packetHash'],'text':'first independent observations'})
        out=dict(kind=kind,assignmentHash=r['assignmentHash'],packetHash=p['packetHash'],performerRef=a['performerRef'],verdict=verdict,findings=findings or [],claimRef='layout',facet='render',targetHash=digest('layout'),reviewKind='learner-visible-review',authorSeparation=True,sourceFirst=True,firstPass=True,firstPassArtifactRef=first,evidenceRefs=['source-a'],rationale='Specific row baseline and current prompt inspected')
        out.update(extra)
        out['harnessOutputRef']=self.rt.store.put(dict(agentRef=a['performerRef'],taskRef=h['taskRef'],channel='simulation',rawResult='synthetic child report',structuredOutputHash=digest(out)))
        return out
    def completed(self, registration, **kwargs):
        out=self.output(registration,**kwargs); ref=record_output(self.rt,'W',registration[0]['registrationRef'],out)
        ev=self.rt.store.put({'toolName':'collaboration agent result','rawResult':out})
        reconcile_task(self.rt,'W',registration[0]['registrationRef'],'COMPLETED',[ev])
        return ref
    def result(self, registration, output):
        return dict(verdict='PASS',teamCollection=dict(submissionActor='M',registrationRefs=[registration[0]['registrationRef']],outputRefs=[output['outputRef']]))
    def test_valid_collection_and_transcription_not_blindness(self):
        r=self.registration(); o=self.completed(r)
        check_collection(self.rt,'W',self.node,self.result(r,o))
        self.assertEqual(project(self.rt.store.events(),'W')['registrations'][r[0]['registrationRef']]['packet']['contextExposure']['forkMode'],'all')
    def test_old_policy_is_noop(self):
        self.rt.s['plan'].pop('agent_team'); check_collection(self.rt,'W',self.node,{'verdict':'PASS'})
    def test_empty_real_policy_rejected(self):
        p=default_policy(); p['required_scopes']=[]
        with self.assertRaises(Rejected): validate_policy(p)
        self.assertEqual(validate_policy(p,allow_empty=True)['required_scopes'],[])
    def test_pool_limit_and_grandchildren(self):
        self.registration('A',aid='a'); self.registration('B',aid='b')
        with self.assertRaises(Rejected): self.registration('C',aid='c')
    def test_missing_review_cannot_pass(self):
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,{'verdict':'PASS'})
    def test_self_review_from_packet_refused(self):
        with self.assertRaises(Rejected): self.registration(authors=['A'])
    def test_author_reservation_survives_omitted_authored_claims(self):
        author=self.registration(role='author'); self.completed(author,kind='author')
        with self.assertRaises(Rejected): self.registration(role='reviewer',epoch=2)
    def test_unrelated_block_author_not_contaminated(self):
        author=self.registration(role='author',aid='author-a'); self.completed(author,kind='author')
        reg=self.registration(role='reviewer',aid='review-b',block='b')
        p=project(self.rt.store.events(),'W')
        self.assertNotIn('A',effective_authors(p,reg[2],'layout','render','b'))
    def test_active_epoch_change_refused(self):
        self.registration()
        with self.assertRaises(Rejected): self.registration(epoch=2)
    def test_delayed_old_output_refused(self):
        old=self.registration(); out=self.completed(old)
        self.registration(epoch=2)
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(old,out))
    def test_stale_node_input_refused(self):
        r=self.registration(); o=self.completed(r); self.rt.input_epoch=1
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_nonroot_collection_refused(self):
        r=self.registration(); o=self.completed(r); result=self.result(r,o); result['teamCollection']['submissionActor']='B'
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,result)
    def test_unreconciled_output_is_not_completed(self):
        r=self.registration(); o=record_output(self.rt,'W',r[0]['registrationRef'],self.output(r))
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_child_fail_cannot_become_pass(self):
        r=self.registration(); o=self.completed(r,verdict='FAIL')
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_context_exposure_is_not_source_first(self):
        r=self.registration(exposed=True); o=self.completed(r)
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_first_pass_artifact_must_match(self):
        r=self.registration(); other=self.rt.store.put({'assignmentHash':digest('old'),'packetHash':r[2]['packetHash']}); o=self.completed(r,firstPassArtifactRef=other)
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_design_conformance_not_educational_review(self):
        r=self.registration(); o=self.completed(r,reviewKind='design-conformance')
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_wrong_performer_and_claim_refused(self):
        r=self.registration()
        with self.assertRaises(Rejected): record_output(self.rt,'W',r[0]['registrationRef'],self.output(r,performerRef='B'))
        with self.assertRaises(Rejected): record_output(self.rt,'W',r[0]['registrationRef'],self.output(r,claimRef='other'))
    def test_nested_path_reservation_conflict(self):
        self.registration(aid='a',role='author',paths=['src'])
        with self.assertRaises(Rejected): self.registration('B',aid='b',role='author',paths=['src/a.ts'])
    def test_duplicate_output_idempotent_conflicting_output_rejected(self):
        r=self.registration(); out=self.output(r)
        one=record_output(self.rt,'W',r[0]['registrationRef'],out); head=self.rt.store.head
        two=record_output(self.rt,'W',r[0]['registrationRef'],out)
        self.assertEqual(one['outputRef'],two['outputRef']); self.assertEqual(head,self.rt.store.head)
        with self.assertRaises(Rejected): record_output(self.rt,'W',r[0]['registrationRef'],dict(out,rationale='different report'))
    def test_unresolved_omission_not_majority_pass(self):
        f=dict(findingId='F',claimRef='layout',facet='render',reason='overlap',evidenceRefs=['image'],resolution='UNRESOLVED')
        old=self.registration(aid='old'); self.completed(old,verdict='UNVERIFIED',findings=[f])
        new=self.registration('B',aid='new'); o=self.completed(new)
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(new,o))
    def approval(self, policy):
        self.rt.s['users']['U']=dict(id='U',intent='approve_proposal',quote='simulation explicitly approves team policy',source_ref='simulation:quote',scope=self.rt.s['plan']['scope'],proposal_hash=self.rt.s['plan']['proposal']['hash'],reply_to=self.rt.s['plan']['proposal']['hash'],team_policy_hash=digest(policy),verification_level='simulation')
    def test_migration_requires_explicit_policy_hash_and_head(self):
        policy=default_policy(); self.approval(policy)
        self.rt.s['users']['U'].pop('team_policy_hash')
        with self.assertRaises(Rejected): adopt_team_policy(self.rt,'W',policy,'U',self.rt.store.head)
        self.approval(policy)
        with self.assertRaises(Rejected): adopt_team_policy(self.rt,'W',policy,'U','0'*64+'x')
    def test_migration_archives_and_invalidates_only_required_and_downstream(self):
        policy=default_policy(); self.approval(policy)
        self.rt.s['results']={'C01_SOURCE@a':{'artifact':digest('source')},'C05_DESIGN@a':{'artifact':digest('design')},'C09_SEMANTIC@a':{'artifact':digest('visible')}}
        ev=adopt_team_policy(self.rt,'W',policy,'U',self.rt.store.head)
        self.assertIn('C05_DESIGN@a',ev['payload']['invalidated_results'])
        self.assertIn('C01_SOURCE@a',ev['payload']['retained_results'])
        archive=self.rt.store.get(ev['payload']['archive']); self.assertEqual(len(archive['results']),3)
    def test_migration_active_claim_rejected(self):
        policy=default_policy(); self.approval(policy); self.rt.s['claims']={'n':{'actor':'M'}}
        with self.assertRaises(Rejected): adopt_team_policy(self.rt,'W',policy,'U',self.rt.store.head)
    def test_grandchild_even_first_registration_rejected(self):
        r=self.registration(); reconcile_task(self.rt,'W',r[0]['registrationRef'],'CANCELLED',[r[3]['toolResultRef']])
        a=copy.deepcopy(r[1]); a['assignmentId']='grandchild'; a['performerRef']='grandchild'
        h=copy.deepcopy(r[3]); h.update(agentRef='grandchild',parentRef='A',taskRef='grandchild-task')
        h['toolResultRef']=self.rt.store.put(dict(agentRef='grandchild',taskRef='grandchild-task',parentRef='A',toolName='collaboration.spawn_agent',rawResult={}))
        with self.assertRaises(Rejected): register_task(self.rt,'W',a,r[2],h)
    def test_migration_active_subtask_rejected(self):
        self.registration(); policy=default_policy(); self.approval(policy)
        with self.assertRaises(Rejected): adopt_team_policy(self.rt,'W',policy,'U',self.rt.store.head)
    def test_real_work_rejects_simulation_transcript(self):
        r=self.registration(); reconcile_task(self.rt,'W',r[0]['registrationRef'],'CANCELLED',[r[3]['toolResultRef']])
        self.rt.s['plan']['simulation']=False
        with self.assertRaises(Rejected): self.registration('B',aid='real')
    def test_output_without_child_report_ref_rejected(self):
        r=self.registration(); out=self.output(r); out.pop('harnessOutputRef')
        with self.assertRaises(Rejected): record_output(self.rt,'W',r[0]['registrationRef'],out)
    def test_review_resolution_requires_new_proof_and_can_unblock(self):
        f=dict(findingId='F',claimRef='layout',facet='render',reason='overlap',evidenceRefs=['image'],resolution='UNRESOLVED')
        old=self.registration(aid='old'); prior=self.completed(old,verdict='UNVERIFIED',findings=[f])
        new=self.registration('B',aid='new')
        proof=self.rt.store.put(dict(targetHash=digest('layout'),reason='fixed baseline verified on frozen render',evidenceRefs=['new image']))
        fixed=dict(f,resolution='VERIFIED_FIXED',resolvesOutputRef=prior['outputRef'],resolutionEvidenceRef=proof)
        o=self.completed(new,findings=[fixed]); check_collection(self.rt,'W',self.node,self.result(new,o))
    def test_unverified_reconcile_can_later_be_resolved(self):
        r=self.registration(); ev=r[3]['toolResultRef']
        reconcile_task(self.rt,'W',r[0]['registrationRef'],'UNVERIFIED',[ev])
        self.completed(r)
        self.assertEqual(project(self.rt.store.events(),'W')['reconciliations'][r[0]['registrationRef']]['status'],'COMPLETED')
    def test_capture_harness_reuses_existing_store_and_is_idempotent(self):
        raw=dict(agentRef='A',taskRef='task1',parentRef='/root',toolName='collaboration.spawn_agent',rawResult={'task_name':'A'},attestationMethod='simulation')
        first=capture_harness(self.rt,'W',raw); head=self.rt.store.head
        second=capture_harness(self.rt,'W',raw)
        self.assertEqual(first['artifactRef'],second['artifactRef']); self.assertEqual(head,self.rt.store.head)
        self.assertEqual(self.rt.store.get(first['artifactRef'])['rawResult'],{'task_name':'A'})
        with self.assertRaises(Rejected): capture_harness(self.rt,'W',raw,submission_actor='A')
    def test_capture_output_requires_bound_hash_and_channel(self):
        raw=dict(agentRef='A',taskRef='task1',rawResult='child text',attestationMethod='simulation',structuredOutputHash=digest('structured'),channel='subagent-final')
        self.assertEqual(capture_harness(self.rt,'W',raw)['recordType'],'output')
        with self.assertRaises(Rejected): capture_harness(self.rt,'W',dict(raw,structuredOutputHash='bad'))
    def open_finding(self):
        f=dict(findingId='F',claimRef='layout',facet='render',reason='overlap',evidenceRefs=['image'],resolution='UNRESOLVED')
        old=self.registration(aid='old'); self.completed(old,verdict='UNVERIFIED',findings=[f])
    def test_input_change_does_not_clear_unresolved_finding(self):
        self.open_finding(); self.rt.input_epoch=1
        r=self.registration('B',aid='new'); o=self.completed(r)
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_later_g2_cannot_omit_earlier_block_finding(self):
        self.open_finding()
        node=dict(id='G2_AUDIT@unit',stage_kind='G2_AUDIT',block=None,release_unit='unit',phase='pre-release')
        with self.assertRaises(Rejected): check_collection(self.rt,'W',node,{'verdict':'PASS'})
    def test_finding_cannot_escape_assigned_scope(self):
        r=self.registration()
        f=dict(findingId='F',claimRef='foreign',facet='render',reason='x',evidenceRefs=['image'],resolution='UNRESOLVED')
        with self.assertRaises(Rejected): record_output(self.rt,'W',r[0]['registrationRef'],self.output(r,verdict='UNVERIFIED',findings=[f]))
    def test_authors_cannot_rename_claim_for_implementation_or_unit_review(self):
        author=self.registration(role='author',aid='author'); self.completed(author,kind='author')
        p=project(self.rt.store.events(),'W')
        for stage,claim,block in [('C09_SEMANTIC','implemented-visible','a'),('G2_AUDIT','integrated-release',None)]:
            n=dict(stage_kind=stage,block=block,release_unit='unit')
            self.assertIn('A',effective_authors(p,{'authorHistory':[]},claim,'render',block,node=n,plan=self.rt.s['plan']))
            with self.assertRaises(Rejected): self.registration(aid='new-'+stage,stage=stage,block=block)
    def test_foreign_block_review_cannot_resolve_original_finding(self):
        old=self.registration(aid='old'); f=dict(findingId='F',claimRef='layout',facet='render',reason='overlap',evidenceRefs=['img'],resolution='UNRESOLVED')
        prior=self.completed(old,verdict='UNVERIFIED',findings=[f])
        new=self.registration('B',aid='foreign',block='b'); proof=self.rt.store.put(dict(targetHash=digest('layout'),reason='different block',evidenceRefs=['img-b']))
        out=self.output(new,findings=[dict(f,resolution='VERIFIED_FIXED',resolvesOutputRef=prior['outputRef'],resolutionEvidenceRef=proof)])
        with self.assertRaises(Rejected): record_output(self.rt,'W',new[0]['registrationRef'],out)
    def target(self):
        import hashlib
        self.rt.s['evidence']['mock']=dict(kind='file',data={'path':'preview.txt','sha256':hashlib.sha256((self.rt.root/'preview.txt').read_bytes()).hexdigest()})
        artifact=self.rt.store.put({'layoutDesignHash':digest('layout')})
        return bind_target(self.rt,'W',self.node['id'],'render',[artifact],['mock'],{'layout':digest('layout')})['targetManifestRef']
    def test_fixed_target_rejects_changed_input_and_context(self):
        target=self.target(); r=self.registration(target=target); o=self.completed(r)
        self.rt.input_epoch=1
        with self.assertRaises(Rejected): self.registration('B',aid='new',target=target)
        self.rt.input_epoch=0; self.rt.s['block_contexts']={'a':{'render':digest('new layout')}}
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(r,o))
    def test_target_does_not_accept_self_declared_arbitrary_hash(self):
        self.target(); artifact=self.rt.store.put({'layoutDesignHash':digest('layout')})
        with self.assertRaises(Rejected): bind_target(self.rt,'W',self.node['id'],'render',[artifact],['mock'],{'layout':digest('invented')})
        self.rt.s['plan']['simulation']=False
        with self.assertRaises(Rejected): bind_target(self.rt,'W',self.node['id'],'render',[artifact],['mock'],{'layout':digest('layout')})
    def test_real_mode_requires_current_target_manifest(self):
        self.rt.s['plan']['simulation']=False
        with self.assertRaises(Rejected): self.registration()
    def test_late_finding_reopens_cached_pass_on_real_runtime(self):
        # Existing workflow fixture uses actual Runtime/Store and simulated CODE;
        # none of these events is a live user/app acceptance.
        from test_integration import Integration
        helper=Integration(methodName='test_two_entry_graphs_are_distinct_scoped_and_acyclic'); helper.setUp()
        try:
            plan=helper.make_plan(work='W'); plan['agent_team']=default_policy()
            helper.rt.open(plan); helper.work='W'; helper.plan=plan
            from contracts import manifest
            helper.ev=helper.rt.evidence(helper.work,'file',{'path':'a.json','sha256':manifest(helper.root,['a.json'])['a.json']},source_ref='simulation:fixture',verification_level='simulation')
            helper.until('C05_DESIGN@a')
            self.rt=helper.rt
            old=helper.rt.state(helper.work)
            from definitions import instantiate
            nodes=instantiate(old['plan']); self.assertEqual(helper.rt.node_status(old,nodes['C01_SOURCE@a']),'PASSED')
            rt=self.rt
            self.node=nodes['C01_SOURCE@a']; rt.s=rt.state('W')
            r=self.registration(aid='late')
            f=dict(findingId='late',claimRef='layout',facet='render',reason='newly observed mismatch',evidenceRefs=['fixture image'],resolution='UNRESOLVED')
            record_output(rt,'W',r[0]['registrationRef'],self.output(r,verdict='UNVERIFIED',findings=[f]))
            fresh=rt.state(helper.work)
            self.assertNotIn('C01_SOURCE@a',fresh['results'])
            self.assertEqual(rt.node_status(fresh,nodes['C04_SOLUTION@a']),'INVALIDATED')
        finally: helper.tearDown()
    def test_unreconciled_resolution_does_not_close_original_finding(self):
        old=self.registration(aid='old'); f=dict(findingId='F',claimRef='layout',facet='render',reason='overlap',evidenceRefs=['img'],resolution='UNRESOLVED')
        prior=self.completed(old,verdict='UNVERIFIED',findings=[f]); resolver=self.registration('B',aid='resolve')
        proof=self.rt.store.put(dict(targetHash=digest('layout'),reason='candidate fix',evidenceRefs=['new img']))
        out=self.output(resolver,findings=[dict(f,resolution='VERIFIED_FIXED',resolvesOutputRef=prior['outputRef'],resolutionEvidenceRef=proof)])
        record_output(self.rt,'W',resolver[0]['registrationRef'],out)
        other=self.registration('A',aid='clean'); result=self.completed(other)
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(other,result))
        reconcile_task(self.rt,'W',resolver[0]['registrationRef'],'CANCELLED',[resolver[3]['toolResultRef']])
        with self.assertRaises(Rejected): check_collection(self.rt,'W',self.node,self.result(other,result))
    def test_target_rejects_team_report_ref_as_native_evidence(self):
        r=self.registration(); out=self.completed(r)
        with self.assertRaises(Rejected): bind_target(self.rt,'W',self.node['id'],'render',[out['outputRef']],[out['outputRef']])
    def test_real_work_author_bootstrap_then_review_has_no_code_cycle(self):
        """Real Runtime contracts with simulation=False; transcripts are TEST FIXTURES,
        not a claim that any live child agent or user acceptance occurred."""
        from test_integration import Integration
        from contracts import manifest
        from definitions import instantiate
        helper=Integration(methodName='test_two_entry_graphs_are_distinct_scoped_and_acyclic'); helper.setUp()
        try:
            rt=helper.rt; work='real-contract-fixture'
            plan=helper.make_plan(work=work); plan['simulation']=False; plan['agent_team']=self.rt.s['plan']['agent_team']
            rt.open(plan)
            source=rt.evidence(work,'file',{'path':'a.json','sha256':manifest(helper.root,['a.json'])['a.json']},source_ref='local:test-fixture',verification_level='local_execution')
            (helper.root/'preview.html').write_text('<!doctype html><p>TEST STATIC DESIGN</p>')
            preview=rt.evidence(work,'file',{'path':'preview.html','sha256':manifest(helper.root,['preview.html'])['preview.html']},source_ref='local:test-static-design',verification_level='local_execution')
            state=rt.state(work); node=instantiate(state['plan'])['C01_SOURCE@a']; base=rt.input_hash(state,node)
            def packet():
                p=dict(baseNodeInputHash=base,sourceRefs=['source-a'],authorHistory=[],contextExposure={'forkMode':'all','authorRationaleVisibleAtFirstPass':False},sourceManifest=state['plan']['source_manifest'],sourceSHA='a'*40,blockContext={'a':{}},nativeEvidenceRefs=[source])
                p['packetHash']=digest(p); return p
            def register(who,role,hashes,target=None):
                a=dict(assignmentId=who+'-task',roleEpoch=1,node=node['id'],block='a',facet='render',claimRefs=['layout'],performerRef=who,role=role,inputHash=base,sourceSHA='a'*40,artifactHashes=hashes,allowedPaths=[],writeMode='READ_ONLY_BY_INSTRUCTION_NOT_OS_SANDBOX',dependsOnTasks=[],budget={'tokenBudget':None},independent=role=='reviewer')
                if target: a['targetManifestRef']=target
                p=packet(); raw=dict(agentRef=who,taskRef=who+'-run',parentRef='/root',toolName='collaboration.spawn_agent',rawResult='TEST FIXTURE, not live agent',attestationMethod='transcribed-tool-result')
                ref=capture_harness(rt,work,raw)['artifactRef']; h=dict(agentRef=who,taskRef=who+'-run',parentRef='/root',logicalRole=who,toolResultRef=ref,attestationMethod='transcribed-tool-result')
                return register_task(rt,work,a,p,h),a,p
            def report(reg,out):
                r,a,p=reg; out=dict(out,assignmentHash=r['assignmentHash'],packetHash=p['packetHash'],performerRef=a['performerRef'],verdict='PASS',findings=[])
                raw=dict(agentRef=a['performerRef'],taskRef=a['performerRef']+'-run',channel='subagent-final',rawResult='TEST FIXTURE FINAL, not live agent',structuredOutputHash=digest(out),attestationMethod='transcribed-tool-result')
                out['harnessOutputRef']=capture_harness(rt,work,raw)['artifactRef']
                ref=record_output(rt,work,r['registrationRef'],out)['outputRef']
                reconcile_task(rt,work,r['registrationRef'],'COMPLETED',[out['harnessOutputRef']]); return ref
            author=register('A','author',{'source':state['plan']['source_manifest']['a.json']})
            authored=report(author,dict(kind='author',producedArtifact={'layoutDesignHash':digest('new current layout')}))
            target=bind_target(rt,work,node['id'],'render',[authored],[source,preview],{'layout':digest('new current layout')})['targetManifestRef']
            review=register('B','reviewer',{'layout':digest('new current layout')},target)
            first=rt.store.put({'assignmentHash':review[0]['assignmentHash'],'packetHash':review[2]['packetHash'],'text':'TEST first-pass observations'})
            reviewed=report(review,dict(kind='review',claimRef='layout',facet='render',targetHash=digest('new current layout'),reviewKind='learner-visible-review',authorSeparation=True,sourceFirst=True,firstPass=True,firstPassArtifactRef=first,evidenceRefs=[preview],rationale='TEST static layout observations'))
            check_collection(rt,work,node,dict(verdict='PASS',teamCollection={'submissionActor':'M','registrationRefs':[review[0]['registrationRef']],'outputRefs':[reviewed]}))
        finally: helper.tearDown()


if __name__ == '__main__': unittest.main()
