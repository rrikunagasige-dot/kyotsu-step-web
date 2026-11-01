"""Actual nested service/receipt tests; fixtures are not learner acceptance."""
import copy,json,subprocess,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from runtime import Runtime
from contracts import Rejected,manifest
from store import digest
from definitions import instantiate
from capabilities import run_capability,implementation_hash
from integration import check_result
ROOT=Path(__file__).resolve().parents[1];CP='src/data/textbook/math/numbers/n09ConstructionCompiled.json'
class NestedNativeBindings(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.compiled=json.loads((ROOT/CP).read_text())
  script="""import fs from'node:fs';import{createHash}from'node:crypto';import{buildNestedTransformationPlan}from'./tools/textbook/transformation/nested-lesson.mjs';const raw=fs.readFileSync('src/data/textbook/math/numbers/n09Authored.json','utf8'),ir=JSON.parse(raw),assets=Object.fromEntries(ir.unit.sections.flatMap(s=>s.figures).map(f=>[f.src,createHash('sha256').update(fs.readFileSync('public'+f.src)).digest('hex')]));console.log(JSON.stringify({ir,transformationPlan:buildNestedTransformationPlan(raw,fs.readFileSync('work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json','utf8'),ir.unit.unitId,assets)}));"""
  cls.inputs=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.rt=Runtime(Path(self.tmp.name)/'ledger',ROOT);c=self.compiled
  self.plan={'work_id':'nested-fixture','profile':'material','workflow_version':'production/2','command':'CMD-WORK-001','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':manifest(ROOT,[CP]),'rules':{},'proposal':{'id':'TEST_FIXTURE','hash':digest('p'),'contentDesignHash':c['irHash']},'scope':{'paths':[CP],'preserve':[]},'blocks':[{'id':'n09','sources':[CP],'construction_design_hash':c['constructionDesignHash'],'layout_design_hash':c['layoutDesignHash'],'learner_copy_hash':c['learnerCopyHash']}],'simulation':True,'solution_pipeline':'solution/1','construction_pipeline':'construction-layout/1','nested_math_pipeline':'nested-math/1'}
  self.rt.open(self.plan);self.work=self.plan['work_id'];self.node=instantiate(self.plan)['R04_PROPOSAL@n09']
 def tearDown(self):self.tmp.cleanup()
 def call(self,cap,inputs,node=None):
  ref=run_capability(self.rt,self.work,node or self.node,cap,inputs);r=self.rt.store.get(ref);return ref,r,self.rt.store.get(r['output'])
 def test_real_nested_finite_validator_and_tampered_plan(self):
  _,r,o=self.call('construction.validate',self.inputs);self.assertEqual(o['status'],'NEEDS_AI_REVIEW');self.assertEqual(o['math']['status'],'PARTIAL');self.assertFalse(o['formalProof']);self.assertEqual(o['constructionDesignHash'],self.compiled['constructionDesignHash']);self.assertEqual(r['implementation_hash'],implementation_hash(self.rt))
  bad=copy.deepcopy(self.inputs);bad['transformationPlan']['nodeDesign'][0]['leadParts']=[];self.assertEqual(self.call('construction.validate',bad)[2]['status'],'FAIL')
 def test_real_strict_checker_rejects_missing_width_states_despite_pass_label(self):
  _,_,o=self.call('layout.validate',{'layoutPlan':self.compiled['layoutPlan'],'nestedCompiled':self.compiled,'measurements':[{'status':'PASS'}],'measurementContext':{'sourceSHA':'a'*40}})
  self.assertEqual(o['status'],'FAIL');self.assertTrue(any(f['ruleId']=='NESTED_FOUR_RUNS_REQUIRED'for f in o['findings']))
 def test_postimplementation_requires_local_capture(self):
  node=instantiate(self.plan)['R07_VERIFY@n09']
  for cap,inp in [('layout.validate',{'layoutPlan':self.compiled['layoutPlan'],'nestedCompiled':self.compiled,'measurements':[]}),('browser.verify',{'compiled':self.compiled,'browserReceipt':{'status':'PASS','sourceSHA':'a'*40,'widths':[320,390,430,1440],'statesVerified':True,'semanticIdsVerified':True}})]:
   with self.assertRaisesRegex(Rejected,'NESTED_LOCAL_CAPTURE_REQUIRED'):self.call(cap,inp,node)
 def test_cache_phase_and_implementation_bindings(self):
  inp={'layoutPlan':self.compiled['layoutPlan']};a=self.call('layout.validate',inp)[1];b=self.call('layout.validate',inp)[1];self.assertFalse(a['reused']);self.assertTrue(b['reused'])
  with patch('capabilities.implementation_hash',return_value='f'*64):c=self.call('layout.validate',inp)[1]
  self.assertFalse(c['reused']);self.assertNotEqual(a['cache_key'],c['cache_key']);other=copy.deepcopy(self.node);other['phase']='analysis';d=self.call('layout.validate',inp,other)[1];self.assertNotEqual(a['cache_key'],d['cache_key'])
 def result_fixture(self,node,ref):
  r={k:['TEST_FIXTURE']for k in node['required']};r.update(verdict='PASS',capability_receipts=[ref],evidence_refs=['TEST_FIXTURE'],unknowns=[]);return r
 def test_native_result_rejects_actual_layout_failure(self):
  # Subset descriptor isolates the receipt validator. Public Runtime submit
  # always obtains its complete canonical descriptor, rejecting this subset.
  node=copy.deepcopy(self.node);node['capability_requests']=['layout.validate'];node['required_ai_receipts']=[]
  ref,_,o=self.call('layout.validate',{'layoutPlan':self.compiled['layoutPlan'],'nestedCompiled':self.compiled,'measurements':[{}]},node);self.assertEqual(o['status'],'FAIL')
  with self.assertRaisesRegex(Rejected,'失敗・未対応'):check_result(self.rt,self.work,node,self.result_fixture(node,ref))
 def test_native_result_rejects_changed_implementation_receipt(self):
  node=copy.deepcopy(self.node);node['capability_requests']=['layout.validate'];node['required_ai_receipts']=[];ref,_,_=self.call('layout.validate',{'layoutPlan':self.compiled['layoutPlan']},node)
  with patch('capabilities.implementation_hash',return_value='f'*64):
   with self.assertRaisesRegex(Rejected,'実行イベントのないcode receipt'):check_result(self.rt,self.work,node,self.result_fixture(node,ref))
