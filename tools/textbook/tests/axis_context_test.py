import unittest
from tools.textbook.corpus.construction_context import axis_features
class AxisContextTest(unittest.TestCase):
 def packet(self):return {'schemaVersion':'construction-visible/2','sourceSHA':'e'*40,'measurements':[{'schemaVersion':'axis-measurement/1','baselineSource':'zero-inline-dom-marker','rows':[{'baselines':[10,10.2],'slots':[]}],'anchorDeltas':[{'deltaPx':3}]}],'visibilityFacts':[{'rendered':True,'prerequisitesAvailable':False}],'interactionFacts':[{'selectionShape':'part','operationProvenanceRequired':True,'operationProvenanceChecked':False}]}
 def test_observed_failures_not_labels(self):
  r=axis_features(self.packet());self.assertEqual(r['features']['renderedWithoutPrerequisite'],1);self.assertEqual(r['features']['maxAnchorMovePx'],3);self.assertEqual(r['features']['missingOperationProvenance'],1);self.assertIsNone(r['qualityLabel']);self.assertFalse(r['advisoryEligible'])
 def test_missing_measurement_not_zero(self):
  p=self.packet();p['measurements'][0]['rows'][0]['baselines']=[];r=axis_features(p);self.assertEqual(r['features']['baselineUnverifiedRows'],1);self.assertIsNone(r['features']['maxBaselineDeltaPx'])
 def test_old_context_cannot_use_new_feature_schema(self):
  p=self.packet();p['schemaVersion']='construction-visible/1'
  with self.assertRaises(ValueError):axis_features(p)
 def test_reject_answer_or_quality_injection(self):
  p=self.packet();p['measurements'][0]['rows'][0]['expected']='-'
  with self.assertRaises(ValueError):axis_features(p)

 def test_empty_rows_not_zero(self):
  p=self.packet();p['measurements'][0]['rows']=[]
  with self.assertRaises(ValueError):axis_features(p)

 def test_wrapped_lines_measured_separately(self):
  p=self.packet();p['measurements'][0]['rows'][0].update(layout='wrapped',baselines=[10,50,50.2],physicalLines=[{'cellRefs':['left'],'baselines':[10]},{'cellRefs':['relation','right'],'baselines':[50,50.2]}])
  r=axis_features(p);self.assertAlmostEqual(r['features']['maxBaselineDeltaPx'],.2);self.assertEqual(r['features']['baselineUnverifiedRows'],0)
 def test_wrapped_lines_missing_rejected(self):
  p=self.packet();p['measurements'][0]['rows'][0]['layout']='wrapped'
  with self.assertRaises(ValueError):axis_features(p)
