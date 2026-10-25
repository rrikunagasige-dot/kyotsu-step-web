import unittest,json
from tools.textbook.corpus.core import learner_text,examples
class LearnerInput(unittest.TestCase):
 def test_unknown_container_does_not_leak_identifiers_or_trace_strings(self):
  s=learner_text({'id':'private-node','content':[['word-p-000304','n07-q02-result'],{'text':'整数の比','latex':r'\frac{23}{11}'}],'artifactVersion':'a'*40})
  self.assertNotIn('word-p-',s);self.assertNotIn('q02-result',s);self.assertIn('整数の比',s);self.assertIn('23',s)
 def test_visible_choices_and_equations_are_not_dropped(self):
  s=learner_text({'sections':[{'parts':[{'type':'choice','itemId':'secret-id'},{'type':'math','latex':'x=2'}],'choices':['引く','足す']}]})
  self.assertIn('引く',s);self.assertIn('足す',s);self.assertIn('x=2',s);self.assertNotIn('secret-id',s)
 def test_examples_use_clean_input_hash_and_preserve_source_hash(self):
  c={'id':'one','label':0,'dimension':'layout','familyId':'family','episodeId':'episode','artifactVersion':'v','evidenceTier':'USER_GOLD','scope':'scope','inputSnapshot':{'kind':'learner_artifact','text':json.dumps({'id':'private-id','text':'本文'})}}
  r=examples({'cases':[c]})[0];self.assertNotIn('private-id',r['text']);self.assertNotEqual(r['inputHash'],r['sourceInputHash']);self.assertEqual(r['featureInputSchema'],'learner-visible-json/2')
