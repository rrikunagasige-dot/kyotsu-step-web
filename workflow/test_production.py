import copy,json,tempfile,unittest
from pathlib import Path
from runtime import Runtime
from production import instantiate,ai_request,diagram
from contracts import Rejected,manifest
from store import digest
class Production(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name);(self.root/'source.json').write_text('{}');(self.root/'rules.md').write_text('v1')
        self.rt=Runtime(self.root/'ledger',self.root)
        self.plan={'work_id':'production-test','profile':'material','workflow_version':'production/1','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':manifest(self.root,['source.json']),'rules':manifest(self.root,['rules.md']),'proposal':{'id':'content-design','hash':digest({'content':'frozen'}),'contentDesignHash':digest({'content':'frozen'})},'scope':{'paths':['source.json'],'preserve':[]},'blocks':[{'id':'unit','sources':['source.json']}],'simulation':True}
        self.rt.open(self.plan);self.work=self.plan['work_id'];self.evidence=self.rt.evidence(self.work,'file',{'path':'source.json','sha256':manifest(self.root,['source.json'])['source.json']},source_ref='simulation-fixture',verification_level='simulation')
    def tearDown(self):self.temp.cleanup()
    def result(self,nid):
        req=ai_request(self.rt,self.work,nid);a=self.rt.store.put({'id':nid,'fixture':True,'compiled':{'irHash':self.plan['proposal']['contentDesignHash']}})
        return {'verdict':'PASS','evidence_refs':[self.evidence],'checks':[{'id':'fixture-check','status':'PASS','evidence':'simulation'}],'artifacts':[a],'unknowns':[],
            'aiReview':{'requestHash':req['requestHash'],'inputHash':req['task']['input_hash'],'reviewer':'fixture-pass','evidence':'simulation only'},'sourceSHA':'a'*40,
            'release':{'verified':True,'sourceSHA':'a'*40,'url':'https://example.invalid'},'trainingRun':False,'modelDisposition':'NOT_TRAINABLE'}
    def step(self):
        nxt=self.rt.next(self.work);nid=nxt['task']['node']['id'];actor=nxt['task']['node']['actor']
        if actor=='USER':
            intent='approve_proposal' if nid=='S17' else 'quality_positive'
            u=self.rt.user(self.work,intent,'simulation decision',self.plan['proposal']['hash'],'simulation:event',verification_level='simulation');self.rt.accept(self.work,nid,u,[self.evidence])
        else:
            c=self.rt.claim(self.work,nid,'fixture-worker');r=self.result(nid)
            if actor=='AI':self.rt.submit(self.work,nid,c['claim_token'],r)
            else:self.rt.production_result(self.work,nid,c['claim_token'],r)
        return nid
    def test_all_25_nodes_replay_without_retired_gates(self):
        nodes=instantiate(self.plan);self.assertEqual(len(nodes),25);self.assertFalse(any(k.startswith(('G1','G3')) for k in nodes))
        for _ in range(25):self.step()
        self.assertEqual(self.rt.next(self.work)['status'],'DONE');self.assertIn('S24',diagram(self.rt,self.work))
        restored=Runtime(self.root/'ledger',self.root);self.assertEqual(restored.next(self.work)['status'],'DONE')
    def test_tool_cannot_bypass_semantic_review(self):
        c=self.rt.claim(self.work,'S00','fixture-worker');r=self.result('S00');r.pop('aiReview')
        with self.assertRaises(Rejected):self.rt.production_result(self.work,'S00',c['claim_token'],r)
        with self.assertRaises(Rejected):self.rt.tool_result(self.work,'S00',c['claim_token'],[self.evidence])
    def test_context_invalidates_results_and_refuses_mid_claim_change(self):
        self.step();self.rt.production_context(self.work,{'corpusHash':'new','modelHash':None,'rulesHash':'v1','featureSchema':'one'})
        self.assertEqual(self.rt.next(self.work)['task']['node']['id'],'S00')
        c=self.rt.claim(self.work,'S00','fixture-worker')
        with self.assertRaises(Rejected):self.rt.production_context(self.work,{'corpusHash':'other'})
    def test_unresolved_and_old_ai_input_rejected(self):
        c=self.rt.claim(self.work,'S00','fixture-worker');r=self.result('S00');r['checks'][0]['status']='UNVERIFIED'
        with self.assertRaises(Rejected):self.rt.production_result(self.work,'S00',c['claim_token'],r)
        r=self.result('S00');r['aiReview']['inputHash']='stale'
        with self.assertRaises(Rejected):self.rt.production_result(self.work,'S00',c['claim_token'],r)
    def test_compiler_cannot_use_workflow_approval_as_lesson_approval(self):
        for _ in range(18):self.step()
        c=self.rt.claim(self.work,'S18','fixture-worker');r=self.result('S18');r['artifacts']=[self.rt.store.put({'compiled':{'irHash':'wrong-content'}})]
        with self.assertRaises(Rejected):self.rt.production_result(self.work,'S18',c['claim_token'],r)
    def test_actual_code_runner_uses_same_claim_and_ledger(self):
        from runner import run_code
        task=run_code(self.rt,self.work,{})
        self.assertEqual(task['node'],'S00');self.assertEqual(task['codeResult']['status'],'PASS');self.assertIn('S00',self.rt.state(self.work)['claims'])
    def test_publication_policy_inherits_only_scoped_existing_app_authority(self):
        p=copy.deepcopy(self.plan);p['work_id']='policy-test';p['simulation']=False
        (self.root/'governance').mkdir();(self.root/'governance/REVIEW_POLICY.json').write_text(json.dumps({'repeatPublicationApproval':False,'reviewSurface':'existing-public-app'}))
        self.rt.open(p);self.rt.user('policy-test','approve_proposal','fixture permission',p['proposal']['hash'],'test-only:approval')
        self.rt.external_intent('policy-test','DEPLOY',p['proposal']['hash'],'fixture-deploy-intent')
        with self.assertRaises(Rejected):self.rt.external_intent('policy-test','COST',p['proposal']['hash'],'fixture-no-cost')
