import unittest,json,tempfile,zipfile,sys,importlib.util
from pathlib import Path
from tools.textbook.corpus.solution_context import snapshot,observation,evaluability
from tools.textbook.corpus.core import learner_text,examples,split_groups

MODULE=Path(__file__).resolve().parents[1]/'research/extract.py'
spec=importlib.util.spec_from_file_location('research_extract',MODULE);extractor=importlib.util.module_from_spec(spec);spec.loader.exec_module(extractor)

class ContextTests(unittest.TestCase):
 def visible(self):return {'problemId':'p','prompt':[{'type':'text','text':'問題'}],'conditions':[{'type':'math','latex':'0<x'}],'initial':{'id':'s0','latex':'3x-4<=2'},'completed':[],'current':{'id':'step','purpose':[{'type':'text','text':'定数項を消す'}],'latex':'3x-4+A<=2+A','choices':[{'id':'choice','value':'4'}]}}
 def test_visible_context_is_preserved_without_evaluation(self):
  out=snapshot(self.visible());self.assertIn('3x-4',out['text']);self.assertIn('0<x',out['text']);self.assertIn('定数項を消す',out['text']);self.assertNotIn('problemId',out['text'])
  v=self.visible();v['current']['correctValue']='4'
  with self.assertRaises(ValueError):snapshot(v)
 def test_old_feature_schema_is_unchanged_by_opt_in(self):
  self.assertEqual(learner_text({'purpose':'metadata','latex':'x'}),'{"latex":"x"}')
  inp=snapshot(self.visible());c={'id':'case','label':1,'inputSnapshot':inp,'dimension':'solution_flow_broken','familyId':'f','episodeId':'e','artifactVersion':'a'*40,'evidenceTier':'USER_GOLD','scope':'s'}
  row=examples({'cases':[c]})[0];self.assertEqual(row['featureInputSchema'],'solution-visible-json/1');self.assertIn('3x',row['text'])
 def test_approvals_do_not_create_gold(self):
  o=observation('いいよじゃ作成よろしく','chat:approval','a'*40)
  self.assertEqual(o['label'],'UNKNOWN');self.assertIsNone(o['scope'])
  self.assertTrue(all(not r['advisoryEligible'] for r in evaluability({'cases':[]})['dimensions']))
 def test_episode_and_family_leakage_are_grouped(self):
  rows=[{'id':str(i),'familyId':f,'episodeId':e,'inputHash':h} for i,(f,e,h) in enumerate([('f1','e1','h1'),('f2','e1','h2'),('f2','e2','h3')])]
  self.assertEqual(split_groups(rows)['groupCount'],1)
 def test_html_keeps_unnumbered_explanations_and_figures(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'source.html';p.write_text('<h1>平方完成</h1><p>同じ数を足して引く。</p><figure><img src="g.svg" alt="放物線"></figure><script>ignore</script>')
   out=extractor.extract(p,'source');self.assertEqual(out['status'],'NEEDS_AI_REVIEW');self.assertFalse(out['mathCertified']);self.assertEqual(len(out['blocks']),3);self.assertEqual(out['blocks'][2]['kind'],'figure');self.assertTrue(all(b['location'] for b in out['blocks']))
 def test_word_preserves_math_xml_and_drawing_only_blocks(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'source.docx'
   xml='<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><w:body><w:p><w:r><w:t>条件</w:t></w:r><m:oMath><m:r><m:t>x</m:t></m:r></m:oMath></w:p><w:p><w:drawing/></w:p></w:body></w:document>'
   with zipfile.ZipFile(p,'w') as z:z.writestr('word/document.xml',xml)
   out=extractor.extract(p,'word');self.assertEqual(len(out['blocks']),2);self.assertEqual(out['blocks'][0]['kind'],'math-and-text');self.assertEqual(out['blocks'][1]['kind'],'figure-and-text')

if __name__=='__main__':unittest.main()
