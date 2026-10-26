import unittest
from integration import compiled_design_matches, bundle_fingerprint
class TransformationApprovalTests(unittest.TestCase):
 def test_ir_and_plan_must_match_the_same_artifact(self):
  self.assertTrue(compiled_design_matches([{'compiled':{'irHash':'ir','planHash':'plan'}}],'ir','plan'))
  self.assertFalse(compiled_design_matches([{'compiled':{'irHash':'ir','planHash':'old'}}],'ir','plan'))
  self.assertFalse(compiled_design_matches([{'compiled':{'irHash':'old','planHash':'plan'}}],'ir','plan'))
  self.assertFalse(compiled_design_matches([{'compiled':{'irHash':'ir','planHash':'old'}},{'compiled':{'irHash':'old','planHash':'plan'}}],'ir','plan'))
 def test_legacy_compiler_without_plan_keeps_original_ir_binding(self):
  self.assertTrue(compiled_design_matches([{'compiled':{'irHash':'ir'}}],'ir'))
  self.assertFalse(compiled_design_matches([{'compiled':{'irHash':'old'}}],'ir'))
 def test_presentation_change_invalidates_scoped_approval(self):
  p={'workflow_version':'production/2','profile':'material','command':'CMD-WORK-001','scope':{'paths':[],'preserve':[]},'source_manifest':{},'blocks':[{'id':'n11','sources':['source'],'presentation_design_hash':'old'}],'proposal':{'hash':'proposal'}}
  s={'plan':p};b={'id':'proposal','block_ids':['n11']}
  before=bundle_fingerprint(s,b);p['blocks'][0]['presentation_design_hash']='new'
  self.assertNotEqual(bundle_fingerprint(s,b),before)

 def test_unopted_historical_approval_hash_is_identical(self):
  from store import digest
  p={'workflow_version':'production/2','profile':'material','command':'CMD-WORK-001','scope':{'paths':[],'preserve':[]},'source_manifest':{},'blocks':[{'id':'n11','sources':['source']}],'proposal':{'hash':'proposal'}}
  b={'id':'proposal','block_ids':['n11']};s={'plan':p}
  previous=digest({'bundle':b,'scope':p['scope'],'patches':{'n11':None},'facets':{'n11':{}}})
  self.assertEqual(bundle_fingerprint(s,b),previous)
