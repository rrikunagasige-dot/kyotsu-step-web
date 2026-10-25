import unittest,sys,tempfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'research'))
from extract import extract
class HTMLMath(unittest.TestCase):
 def parse(self,s):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'test.html';p.write_text(s);return extract(p,'test')
 def test_mathjax_root_beats_misleading_accessibility_text(self):
  r=self.parse('<p>前<mjx-container aria-label="a"><span data-mml-node="math" data-latex="|a|"><i data-latex="a">a</i></span></mjx-container>後</p>')
  self.assertEqual([b['kind'] for b in r['blocks']],['text','math','text']);m=r['blocks'][1];self.assertEqual(m['latex'],'|a|');self.assertEqual(m['accessibleLabel'],'a');self.assertIn('data-latex',m['originalMathMarkup']);self.assertFalse(r['mathCertified'])
 def test_katex_is_not_duplicated(self):
  r=self.parse('<p><span class="katex"><span><math><semantics><mi>a</mi><annotation encoding="application/x-tex">|a|</annotation></semantics></math></span><span class="katex-html">a</span></span></p>')
  self.assertEqual(len(r['blocks']),1);self.assertEqual(r['blocks'][0]['latex'],'|a|')
 def test_mathml_without_tex_is_flagged(self):
  r=self.parse('<math><mi>a</mi></math>');self.assertEqual(r['blocks'][0]['extractionMethod'],'mathml-needs-review');self.assertIsNone(r['blocks'][0]['latex'])
 def test_unclosed_math_is_not_silently_discarded(self):
  with self.assertRaisesRegex(ValueError,'UNCLOSED_MATH'):self.parse('<p>前<math><mi>a</mi>')
