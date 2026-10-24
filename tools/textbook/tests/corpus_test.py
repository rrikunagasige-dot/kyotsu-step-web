import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[3]))
from tools.textbook.corpus.core import curate,examples,split_groups
class Corpus(unittest.TestCase):
    def decision(self,**kw):return dict({'observationId':'o','quality':'NEGATIVE','dimension':'layout','artifactVersion':'a'*40,'scope':'node','evidenceRef':'quote','evidenceTier':'USER_GOLD','inputSnapshot':{'kind':'learner_artifact','text':'3x-2<5'},'familyId':'f','episodeId':'e'},**kw)
    def test_partial_labels_unknown_and_conflict(self):
        c=curate([{'id':'o'}],[self.decision()]);r=examples(c);self.assertEqual(len(r),1);self.assertEqual(r[0]['dimension'],'layout');self.assertNotIn('meaning',r[0]);self.assertEqual(examples(curate([{'id':'o'}],[self.decision(quality='UNKNOWN')])),[])
        c=curate([{'id':'o'}],[self.decision(),self.decision(quality='POSITIVE')]);self.assertEqual(c['cases'][0]['quality'],'UNKNOWN')
    def test_summary_and_feedback_input_cannot_be_gold(self):
        with self.assertRaises(ValueError):curate([{'id':'o','sourceType':'personal_context_summary'}],[self.decision()])
        c=curate([{'id':'o'}],[self.decision(inputSnapshot={'kind':'learner_artifact','text':'x','feedback':'bad'})])
        with self.assertRaises(ValueError):examples(c)
    def test_group_union_covers_versions_and_duplicate_input(self):
        a={'id':'a','familyId':'f1','episodeId':'e1','inputHash':'x'};b={'id':'b','familyId':'f2','episodeId':'e1','inputHash':'y'};c={'id':'c','familyId':'f2','episodeId':'e3','inputHash':'z'}
        s=split_groups([a,b,c]);self.assertEqual(s['groupCount'],1);self.assertEqual(s['status'],'INSUFFICIENT_GROUPS')
