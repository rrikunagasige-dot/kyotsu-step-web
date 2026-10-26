import copy,json,unittest
from tools.textbook.corpus.construction_context import snapshot,visible_payload
from tools.textbook.corpus.core import examples,split_groups

class ConstructionContext(unittest.TestCase):
    def visible(self):
        return {'problemId':'n08-group07','prompt':'絶対値を外す','conditions':['中身は負'],
                'initial':{'latex':'|a|'},'completed':[],
                'current':{'parts':[{'type':'slot','role':'unary-sign','choices':['+','-']}]},
                'renderFacts':{'viewport':{'width':390,'height':844},'fontPx':18,'relationX':[120,120], 'gapPx':4,'centerX':195,'clipped':False,'hitOverlap':False},
                'renderedMath':[{'renderRef':'m1','latex':'|a|'}]}
    def test_geometry_and_part_roles_survive_examples(self):
        inp=snapshot(self.visible());case={'id':'c','label':1,'inputSnapshot':inp,'dimension':'layout_discomfort','familyId':'n08','episodeId':'same','artifactVersion':'v','evidenceTier':'USER_GOLD','scope':'layout'}
        row=examples({'cases':[case]})[0];self.assertEqual(row['featureInputSchema'],'learner-visible-json/3')
        data=json.loads(row['text']);self.assertEqual(data['renderFacts']['fontPx'],18)
        self.assertEqual(data['current']['parts'][0]['role'],'unary-sign')
    def test_collision_flags_are_boolean_not_numeric(self):
        self.assertIs(json.loads(snapshot(self.visible())['text'])['renderFacts']['hitOverlap'],False)
        v=self.visible();v['renderFacts']['hitOverlap']=2
        with self.assertRaises(ValueError):snapshot(v)
    def test_keys_cannot_smuggle_future_answer(self):
        for key in ['expected','correctValue','feedback','authorRationale','quality','evaluation']:
            v=self.visible();v['current'][key]='hidden'
            with self.subTest(key=key),self.assertRaises(ValueError):snapshot(v)
    def test_measurements_unknown_stay_unknown(self):
        v=self.visible();v['renderFacts']['fontPx']=None
        self.assertIsNone(json.loads(snapshot(v)['text'])['renderFacts']['fontPx'])
        for invalid in [0,float('nan'),True,'18px']:
            v['renderFacts']['fontPx']=invalid
            with self.subTest(invalid=invalid),self.assertRaises(ValueError):snapshot(v)
    def test_rendered_math_deduplicates_and_conflicts_rejected(self):
        v=self.visible();v['renderedMath']*=2;self.assertEqual(len(visible_payload(v)['renderedMath']),1)
        v['renderedMath'][1]=dict(renderRef='m1',latex='a')
        with self.assertRaises(ValueError):snapshot(v)
    def test_same_episode_three_agents_and_widths_are_one_group(self):
        rows=[{'id':str(i),'familyId':'n08','episodeId':'same','inputHash':str(i)} for i in range(12)]
        self.assertEqual(split_groups(rows)['groupCount'],1)
    def test_legacy_example_has_identical_schema(self):
        case={'id':'c','label':0,'inputSnapshot':{'kind':'learner_artifact','text':'{"prompt":"legacy"}'},'dimension':'layout','familyId':'f','episodeId':'e','artifactVersion':'v','evidenceTier':'USER_GOLD','scope':'s'}
        self.assertEqual(examples({'cases':[case]})[0]['featureInputSchema'],'learner-visible-json/2')
    def test_unknown_fields_rejected_instead_of_silently_losing_geometry(self):
        v=self.visible();v['renderFacts']['unregisteredMeasure']=21
        with self.assertRaises(ValueError):snapshot(v)
