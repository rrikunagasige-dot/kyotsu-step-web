"""Execute the new services through native capability receipts; authored fixtures only."""
import json,os,tempfile,unittest
from pathlib import Path
from contracts import manifest,Rejected
from runtime import Runtime
from definitions import instantiate
from capabilities import run_capability,requests_for
from graphs import normalized
from store import digest

ROOT=Path(__file__).resolve().parents[1]
BASE='tools/textbook/fixtures/solution-generated/'

class SolutionPipeline(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.rt=Runtime(Path(self.tmp.name)/'ledger',ROOT)
  self.ir=json.loads((ROOT/BASE/'linear-ir.json').read_text());self.graph=self.ir['problems'][0]['graph']
  self.plan={'work_id':'solution-fixture','profile':'material','workflow_version':'production/2','solution_pipeline':'solution/1','command':'CMD-WORK-002','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':manifest(ROOT,[BASE+'linear-ir.json']),'rules':manifest(ROOT,['AGENTS.md']),'proposal':{'id':'fixture','hash':digest('fixture'),'contentDesignHash':digest(self.ir)},'scope':{'paths':[BASE],'preserve':[]},'blocks':[{'id':'linear','sources':[BASE+'linear-ir.json']}],'simulation':True}
  self.rt.open(self.plan)
 def tearDown(self):self.tmp.cleanup()
 def node(self,stage):return instantiate(self.plan)[stage+'@linear']
 def call(self,stage,cap,inputs):
  ref=run_capability(self.rt,'solution-fixture',self.node(stage),cap,inputs)
  receipt=self.rt.store.get(ref);return receipt,self.rt.store.get(receipt['output'])
 def test_services_used_by_creation_and_correction_are_real(self):
  for cap,inputs in [('teaching.plan',{'graph':self.graph}),('step.plan',{'graph':self.graph}),('blank.plan',{'graph':self.graph,'candidates':[]}),('interaction.plan',{'graph':self.graph,'candidates':[]}),('prose.compose',self.ir),('text.verify',self.ir),('figure.verify',{'figures':[],'noFigureReason':'authored symbolic fixture'}),('ir.verify',self.ir),('source.audit',{'coverage':self.ir['coverage'],'sourceBlocks':self.ir['sourceBlocks'],'candidate':self.ir}),('novice.audit',{'ir':self.ir})]:
   with self.subTest(cap=cap):
    receipt,out=self.call('C05_DESIGN',cap,inputs);self.assertIn(out['status'],('PASS','NEEDS_AI_REVIEW'));self.assertEqual(receipt['phase'],'pre-design');self.assertFalse(receipt['reused'])
  for stage,cap,inputs in [('C01_SOURCE','source.coverage',{'ir':self.ir}),('C04_SOLUTION','math.solve',{'kind':'solution','graph':self.graph}),('C04_SOLUTION','math.verify',{'kind':'solution','graph':self.graph}),('C04_SOLUTION','solution.validate',{'graph':self.graph}),('C07_BUILD','render.solution',{'ir':self.ir}),('C07_BUILD','ir.compile',self.ir)]:
   with self.subTest(cap=cap):self.assertEqual(self.call(stage,cap,inputs)[1]['status'],'PASS')
  self.assertTrue(self.call('C07_BUILD','render.solution',{'ir':self.ir})[0]['reused'])
 def test_opt_in_is_explicit_and_no_third_entry_added(self):
  self.assertIn('solution.validate',self.node('C04_SOLUTION')['capability_requests'])
  p=dict(self.plan);del p['solution_pipeline'];self.assertNotIn('solution.validate',instantiate(p)['C04_SOLUTION@linear']['capability_requests'])
  p['solution_pipeline']='future/999'
  with self.assertRaises(Rejected):normalized(p)
  p=dict(self.plan,command='CMD-WORK-001');nodes=instantiate(p)
  self.assertIn('solution.review',nodes['R04_PROPOSAL@linear']['capability_requests']);self.assertIn('render.solution',nodes['R06_PATCH@linear']['capability_requests'])
  self.assertNotIn('G1_VISUAL@linear',nodes)
 def test_environment_and_phase_are_cache_bindings(self):
  first=self.call('C04_SOLUTION','solution.validate',{'graph':self.graph})[0]
  second=self.call('C08_VERIFY','solution.validate',{'graph':self.graph})[0]
  self.assertNotEqual(first['cache_key'],second['cache_key'])
  from unittest.mock import patch
  with patch('capabilities.solution_environment',return_value={'sympy':'different-runtime'}):
   third=self.call('C04_SOLUTION','solution.validate',{'graph':self.graph})[0]
  self.assertNotEqual(first['cache_key'],third['cache_key']);self.assertFalse(third['reused'])

if __name__=='__main__':unittest.main()
