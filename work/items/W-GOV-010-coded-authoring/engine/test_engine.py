import copy
import json
import unittest
import tempfile
from pathlib import Path
from engine import compile_project,solve,verify_solution,bind_blanks,choices_for,verify_choices,design_hash,render,run
from math_core import polynomial,independent_identity,Unsupported
from make_examples import lesson,project,review

class EngineTests(unittest.TestCase):
    def setUp(self): self.p=review(project([lesson('test','distribute_binomials',[3,1,1,2],'展開',True)]))
    def fails(self,p): self.assertEqual(compile_project(p)[1]['status'],'FAIL')
    def test_valid_polynomial_and_cancellation(self):
        self.assertTrue(independent_identity('(3*x+1)*(x+2)','3*x**2+7*x+2'))
        self.assertFalse(independent_identity('(3*x+1)*(x+2)','3*x**2+8*x+2'))
        self.assertTrue(independent_identity('(x-x)**2','0'))
    def test_unsupported_domains_and_no_eval(self):
        for expr in ['1/x','x**-1','x**0.5','sqrt(x)','y+1',"__import__('os').system('false')",'unknown()**0','x**9']:
            with self.assertRaises(Unsupported,msg=expr):polynomial(expr)
    def test_title_budget(self):
        self.p['themes'].append({'title':'参考・発展','units':[]});self.fails(self.p)
    def test_unit_coverage_and_order(self):
        self.p['scope']['expected_units'].append('missing');self.fails(self.p)
    def test_duplicate_membership(self):
        self.p['themes'][1]['units']=['test'];self.fails(self.p)
    def test_source_mismatch(self):
        self.p['lessons'][0]['original_expression']='x+1';self.fails(self.p)
    def test_solution_skip(self):
        s=solve(self.p['lessons'][0]);s['steps'].pop(0)
        with self.assertRaisesRegex(ValueError,'必須途中'):verify_solution(s,'distribute_binomials')
    def test_wrong_intermediate(self):
        s=solve(self.p['lessons'][0]);s['steps'][0]['right']='4*x**2'
        with self.assertRaises(ValueError):verify_solution(s,'distribute_binomials')
    def test_late_prerequisite(self):
        s=solve(self.p['lessons'][0]);s['steps'][0]['depends_on']=['collect']
        with self.assertRaises(ValueError):verify_solution(s,'distribute_binomials')
    def test_blank_is_bound_to_one_ast_result(self):
        self.p['lessons'][0]['blank_targets']=[['product1.result','product2.result']];self.fails(self.p)
    def test_no_keyword_replacement(self):
        self.p['lessons'][0]['blank_targets']=['6'];self.fails(self.p)
    def test_equivalent_distractors_rejected(self):
        l=self.p['lessons'][0]; b=bind_blanks(l,solve(l))[0]; options=choices_for(b)
        options[1]['value']=options[0]['value']
        with self.assertRaises(ValueError):verify_choices(b,options)
    def test_zero_answer_has_unique_choices(self):
        l=lesson('zero','linear_combination',[2,-3,3,1,2,-4],'相殺');s=solve(l)
        for b in bind_blanks(l,s):verify_choices(b,choices_for(b))
    def test_missing_figure_method(self):
        self.p['lessons'][0]['figure']['how_to_read']='';self.fails(self.p)
    def test_late_figure(self):
        self.p['lessons'][0]['figure']['position']='after_distribution';self.fails(self.p)
    def test_unknown_pattern_stops(self):
        self.p['lessons'][0]['pattern']='four_factors'
        self.assertEqual(compile_project(self.p)[1]['status'],'UNVERIFIED')
    def test_semantic_review_not_inferred(self):
        self.p.pop('semantic_review');self.assertEqual(compile_project(self.p)[1]['status'],'SEMANTIC_REVIEW_REQUIRED')
    def test_stale_semantic_review_invalidated(self):
        self.p['lessons'][0]['prose']['goal']='別の目的';self.assertEqual(compile_project(self.p)[1]['semantic_review']['status'],'PENDING')
    def test_no_release_approval_from_ai(self):
        _,report=compile_project(self.p);self.assertFalse(report['release_accepted']);self.assertFalse(report['semantic_review']['user_acceptance'])
    def test_deterministic_compilation(self):
        self.assertEqual(compile_project(self.p),compile_project(copy.deepcopy(self.p)))
    def test_mode_boundary(self):
        self.p['mode']='practice';self.p['lessons'][0].pop('prerequisite_result_ids');self.fails(self.p)
    def test_empty_source_and_lesson(self):
        self.p['lessons']=[];self.p['scope']['expected_units']=[];self.fails(self.p)
    def test_degenerate_case_is_explicitly_unsupported(self):
        self.p['lessons'][0]['params']=[3,0,1,2]
        self.assertEqual(compile_project(self.p)[1]['status'],'UNVERIFIED')
    def test_incomplete_build_does_not_leave_playable_stale_output(self):
        with tempfile.TemporaryDirectory() as temp:
            p=Path(temp);source=p/'input.json';source.write_text(json.dumps(self.p))
            run(source,p/'out');self.assertTrue((p/'out/preview.html').exists())
            self.p['lessons'][0]['pattern']='unsupported';source.write_text(json.dumps(self.p))
            run(source,p/'out');self.assertFalse((p/'out/preview.html').exists())
            self.assertTrue((p/'out/preview.html.stale').exists())

if __name__=='__main__': unittest.main()
