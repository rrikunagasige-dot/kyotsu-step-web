import copy,json,tempfile,unittest
from pathlib import Path
from types import SimpleNamespace
from contracts import manifest
from legacy_diagnostics import inspect,PATH,SOURCE
from store import digest
from views import snapshot
from tools.textbook.corpus.scoped_catalog import scoped_catalog

ROOT=Path(__file__).resolve().parents[1]
class LegacyDiagnostics(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        self.data=json.loads(__import__('subprocess').check_output(['git','show',SOURCE+':'+PATH],cwd=ROOT));p=self.root/PATH;p.parent.mkdir(parents=True);p.write_text(json.dumps(self.data))
        self.plan={'command':'CMD-WORK-001','source_sha':SOURCE,'source_manifest':manifest(self.root,[PATH])}
        self.rt=SimpleNamespace(root=self.root,state=lambda _: {'plan':self.plan})
    def tearDown(self):self.tmp.cleanup()
    def test_actual_legacy_diagnosis_does_not_certify_readiness(self):
        r=inspect(self.rt,'test',self.data,visible=True)
        self.assertEqual(r['status'],'NEEDS_AI_REVIEW');self.assertEqual(r['lessonReadiness'],'NOT_READY')
        self.assertFalse(r['productionIRValidated']);self.assertEqual(len(r['visibleStates']),41)
        self.assertTrue(all(not n['afterVisible'] for n in r['visibleStates']));self.assertTrue(r['findings'])
    def test_source_mismatch_cannot_bypass(self):
        d=copy.deepcopy(self.data);d['nodes'][0]['before']='edited';self.assertEqual(inspect(self.rt,'test',d)['status'],'FAIL')
        (self.root/PATH).write_text('{}');self.assertEqual(inspect(self.rt,'test',self.data)['status'],'FAIL')
    def test_only_registered_source_and_correction_format(self):
        for key,value in [('command','CMD-WORK-002'),('source_sha','a'*40)]:
            p=dict(self.plan);self.plan[key]=value;self.assertIsNone(inspect(self.rt,'test',self.data));self.plan=p
        d=dict(self.data,schemaVersion='production-ir/1');self.assertIsNone(inspect(self.rt,'test',d))

class CatalogFallback(unittest.TestCase):
    def setUp(self):
        self.cases=json.loads((ROOT/'work/items/W-GOV-010-learning-production-workflow/redesign/implementation/CURATED_CASES.json').read_text())['cases']
        self.data={'cases':self.cases,'corpusHash':digest(self.cases),'scope':{'subject':'math','mode':'textbook'},'mandatoryInputs':['F01','F02','F03','F04','F05','F06']}
    def test_all_scoped_cases_and_mandatory_findings_retained(self):
        r=scoped_catalog(self.data,'encoder unavailable');self.assertFalse(r['ranked']);self.assertFalse(r['modelRan'])
        self.assertEqual(len(r['hits']),len(self.cases));self.assertEqual(len(r['mandatoryInputs']),6)
    def test_corrupt_hash_or_incomplete_evidence_is_failure(self):
        d=copy.deepcopy(self.data);d['corpusHash']='bad'
        with self.assertRaises(ValueError):scoped_catalog(d,'unavailable')
        d=copy.deepcopy(self.data);d['cases'][0]['artifactVersion']='';d['corpusHash']=digest(d['cases'])
        with self.assertRaises(ValueError):scoped_catalog(d,'unavailable')
    def test_other_mode_not_retrieved(self):
        self.data['scope']['mode']='practice';self.assertEqual(scoped_catalog(self.data,'unavailable')['hits'],[])

class MaterializationBinding(unittest.TestCase):
    def setUp(self):
        from runtime import Runtime
        self.tmp=tempfile.TemporaryDirectory();self.rt=Runtime(Path(self.tmp.name)/'ledger',ROOT)
        self.plan=json.loads((ROOT/'work/items/W-MATH-032-n07-semantic-repair/WORKFLOW_PLAN.json').read_text());self.plan['simulation']=True;self.plan['source_manifest']=manifest(ROOT,self.plan['source_manifest'])
        self.rt.open(self.plan);self.work=self.plan['work_id']
        self.ev=self.rt.evidence(self.work,'file',{'path':PATH,'sha256':manifest(ROOT,[PATH])[PATH]},source_ref='simulation:binding-test',verification_level='simulation')
    def tearDown(self):self.tmp.cleanup()
    def test_binding_requires_approval_and_preserves_its_identity(self):
        from materialization import bind_n07
        from contracts import Rejected
        with self.assertRaises(Rejected):bind_n07(self.rt,self.work,'e6fc1017f3ce8f5cdce6102720b32afdc73f652b',[self.ev])
        ref=self.rt.user(self.work,'approve_proposal','simulation only',self.plan['proposal']['hash'],'simulation:binding',verification_level='simulation')
        generated=bind_n07(self.rt,self.work,'e6fc1017f3ce8f5cdce6102720b32afdc73f652b',[self.ev])
        s=self.rt.state(self.work);self.assertEqual(self.rt.approval(s)['id'],ref)
        self.assertEqual(s['plan']['proposal']['hash'],self.plan['proposal']['hash'])
        self.assertTrue(all(b['proposal_hash']==self.plan['proposal']['hash'] for b in s['plan']['approval_bundles']))
        self.assertEqual(s['plan']['proposal']['contentDesignHash'],generated['compiled']['irHash'])
    def test_wrong_approved_commit_rejected(self):
        from materialization import bind_n07
        self.rt.user(self.work,'approve_proposal','simulation only',self.plan['proposal']['hash'],'simulation:binding',verification_level='simulation')
        with self.assertRaises(Exception):bind_n07(self.rt,self.work,'4fb7a98e7f864839ccc1374080473df4ba60ce88',[self.ev])
    def test_patch_binding_rejects_unregistered_paths_and_different_artifact(self):
        from materialization import bind_n07,bind_patch
        from contracts import Rejected
        import hashlib
        self.rt.user(self.work,'approve_proposal','simulation only',self.plan['proposal']['hash'],'simulation:binding',verification_level='simulation')
        g=bind_n07(self.rt,self.work,'e6fc1017f3ce8f5cdce6102720b32afdc73f652b',[self.ev])
        rows=[]
        for path in [PATH,'src/components/textbook/N07ReadingFlow.tsx','src/components/textbook/n07-reading.css']:
            value=json.dumps(g['artifact'],ensure_ascii=False,indent=2)+'\n' if path==PATH else (ROOT/path).read_text()
            rows.append({'path':path,'before_sha256':manifest(ROOT,[path])[path],'after_text':value,'after_sha256':hashlib.sha256(value.encode()).hexdigest()})
        delta={'files':rows};ref=bind_patch(self.rt,self.work,delta,[self.ev]);self.assertTrue(ref);self.assertTrue(self.rt.approval(self.rt.state(self.work)))
        bad=copy.deepcopy(delta);bad['files'][0]['path']='other.json'
        with self.assertRaises(Rejected):bind_patch(self.rt,self.work,bad,[self.ev])
        bad=copy.deepcopy(delta);bad['files'][0]['after_text']='{}';bad['files'][0]['after_sha256']=hashlib.sha256(b'{}').hexdigest()
        with self.assertRaises(Rejected):bind_patch(self.rt,self.work,bad,[self.ev])
