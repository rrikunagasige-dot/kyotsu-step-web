import json,sys,tempfile,unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[3]))
from tools.textbook.ml.train import train
from tools.textbook.ml.predict import predict
from tools.textbook.ml.registry import promote
from tools.textbook.ml.rank import rank,train_pairs
from tools.textbook.corpus.core import digest
class EncoderFixture:
    manifest={'featureSchema':'fixture/1'};manifestHash=digest(manifest)
    def encode(self,text,prefix='query: '):return np.array([len(text),text.count('x')],dtype=float),{'fixture':True}
class ML(unittest.TestCase):
    def test_fit_is_real_but_insufficient_groups_cannot_promote(self):
        rows=[{'id':'one','text':'x','label':1,'dimension':'layout','familyId':'f','episodeId':'e','inputHash':'a'}, {'id':'two','text':'xx','label':0,'dimension':'layout','familyId':'f','episodeId':'e','inputHash':'b'}, {'id':'three','text':'x','label':1,'dimension':'derivation','familyId':'f','episodeId':'e','inputHash':'c'}]
        with tempfile.TemporaryDirectory() as d:
            m=train(rows,EncoderFixture(),Path(d)/'model.json');self.assertTrue(m['trainingRun']);self.assertIn('layout',m['heads']);self.assertNotIn('derivation',m['heads']);self.assertEqual(m['evaluation']['layout']['status'],'NOT_ESTIMABLE');self.assertEqual(predict(m,'x',EncoderFixture(),'layout')['status'],'ABSTAIN')
            self.assertEqual(predict(m,'x',EncoderFixture(),'layout',allow_offline=True)['status'],'OFFLINE_PREDICTION')
            with self.assertRaises(ValueError):promote(m,Path(d)/'active.json')
            m['heads']['layout']['intercept']=100;self.assertEqual(predict(m,'x',EncoderFixture(),'layout')['reason'],'MODEL_HASH_MISMATCH')
    def test_invalid_candidates_not_ranked_and_no_pairs_abstain(self):
        self.assertEqual(train_pairs([])['status'],'ABSTAIN');self.assertEqual(rank([{'id':'bad','validationStatus':'FAIL'},{'id':'good','validationStatus':'PASS'}],lambda _: {'status':'ABSTAIN'} )[0]['candidateId'],'good')

class VisibleSchemaCompatibility(unittest.TestCase):
    def test_new_schema_is_rejected_before_encoding_without_opt_in(self):
        row={'featureInputSchema':'learner-visible-json/3','text':'visible'}
        class NoEncoding:
            def encode(self,text):raise AssertionError('must reject before encoding')
        with tempfile.TemporaryDirectory() as d, self.assertRaises(ValueError):
            train([row],NoEncoding(),Path(d)/'model.json')
    def test_new_input_cannot_use_legacy_model_even_offline(self):
        encoder=EncoderFixture();m={'encoderHash':encoder.manifestHash,'heads':{},'advisoryEligible':False};m['modelHash']=digest(m)
        self.assertEqual(predict(m,'{}',encoder,'layout',allow_offline=True,input_schema='learner-visible-json/3')['reason'],'FEATURE_SCHEMA_MISMATCH')
