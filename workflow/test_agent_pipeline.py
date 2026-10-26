import copy,json,subprocess,tempfile,unittest
from pathlib import Path
from graphs import normalized,instantiate
from integration import compiled_design_matches,bundle_fingerprint,input_hash
from capabilities import requests_for
from team import default_policy
from store import digest
from contracts import Rejected

class AgentPipeline(unittest.TestCase):
    def plan(self):
        return {'work_id':'fixture','profile':'material','workflow_version':'production/2','command':'CMD-WORK-002','subject':'math','mode':'textbook','source_sha':'a'*40,'source_manifest':{'a.json':'b'*64},'rules':{},'scope':{'paths':['a.json'],'preserve':[]},'proposal':{'hash':'c'*64},'blocks':[{'id':'b','sources':['a.json']}]}
    def test_opt_out_nodes_and_normalization_are_byte_compatible(self):
        p=self.plan();new=normalized(p)
        self.assertNotIn('agent_team',new)
        self.assertTrue(all('team_requirements' not in n for n in instantiate(p).values()))
        source=subprocess.check_output(['git','show','0401a9241671011c415f91f7f429368e80438037:workflow/graphs.py'],text=True)
        scope={};exec(compile(source,'legacy_graphs','exec'),scope)
        self.assertEqual(scope['normalized'](p),new)
        self.assertEqual(scope['instantiate'](p),instantiate(p))
    def test_agent_policy_is_only_on_required_nodes(self):
        p=self.plan();base=instantiate(p);p['agent_team']=default_policy();nodes=instantiate(p)
        self.assertEqual(base['C01_SOURCE@b'],nodes['C01_SOURCE@b'])
        self.assertEqual(len(nodes['C05_DESIGN@b']['team_requirements']),2)
        self.assertEqual(set(base),set(nodes))
    def test_compile_hashes_must_match_same_output(self):
        contracts={'constructionDesignHash':'parts','layoutDesignHash':'layout','learnerCopyHash':'copy'}
        partial=[{'irHash':'ir','planHash':'plan','constructionDesignHash':'parts'}, {'irHash':'ir','layoutDesignHash':'layout','learnerCopyHash':'copy'}]
        self.assertFalse(compiled_design_matches(partial,'ir','plan',contracts))
        self.assertTrue(compiled_design_matches([dict(irHash='ir',planHash='plan',**contracts)],'ir','plan',contracts))
    def test_approval_binds_parts_not_just_old_formula(self):
        p=normalized(self.plan());s={'plan':p,'block_contexts':{}}
        old=bundle_fingerprint(s,p['approval_bundles'][0]);p['blocks'][0]['construction_design_hash']='d'*64
        self.assertNotEqual(old,bundle_fingerprint(s,p['approval_bundles'][0]))
    def test_capabilities_are_inside_existing_stages(self):
        p=self.plan();legacy=instantiate(p)
        p.update(solution_pipeline='solution/1',construction_pipeline='construction-layout/1')
        p['blocks'][0].update(construction_design_hash='d'*64,layout_design_hash='e'*64,learner_copy_hash='f'*64)
        nodes=instantiate(p);self.assertEqual(set(nodes),set(legacy))
        self.assertIn('construction.validate',nodes['C05_DESIGN@b']['capability_requests'])
        self.assertIn('layout.validate',nodes['C08_VERIFY@b']['capability_requests'])
        self.assertIn('construction.compile',nodes['C07_BUILD@b']['capability_requests'])
    def test_unknown_construction_mode_is_rejected(self):
        p=self.plan();p['construction_pipeline']='arbitrary'
        with self.assertRaises(Rejected):normalized(p)

    def test_missing_part_contract_hashes_cannot_enable_new_pipeline(self):
        p=self.plan();p.update(solution_pipeline='solution/1',construction_pipeline='construction-layout/1')
        with self.assertRaises(Rejected):normalized(p)
