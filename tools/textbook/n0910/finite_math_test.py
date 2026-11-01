import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('finite_math', Path(__file__).with_name('finite-math.py'))
math = importlib.util.module_from_spec(spec); spec.loader.exec_module(math)


class FiniteMathTests(unittest.TestCase):
    def design(self, expected='0.9', choices=None):
        part = {'id': 'p', 'expected': expected, 'choices': [{'value': x} for x in (choices or ['0.9', '-0.9', '5.1'])], 'mathAssertion': {'kind': 'exact-evaluation', 'expression': '-2.1-(-3)', 'sourceRefs': ['source-minus-negative']}}
        return {'units': [{'nodes': [{'parts': [part]}]}]}

    def test_decimal_is_rational_not_float_approximation(self):
        self.assertEqual(math.expression('-2.1-(-3)'), math.expression('9/10'))
        self.assertEqual(math.verify(self.design())['status'], 'PASS')

    def test_wrong_author_key_rejected_by_actual_operation(self):
        self.assertEqual(math.verify(self.design('-0.9'))['status'], 'FAIL')

    def test_equivalent_wrong_candidate_is_a_grading_bug(self):
        result = math.verify(self.design(choices=['0.9', '9/10']))
        self.assertEqual(result['status'], 'FAIL')

    def test_symbolic_teaching_claim_is_not_code_pass(self):
        d = self.design(); d['units'][0]['nodes'][0]['parts'][0]['mathAssertion'] = {'kind': 'source-scope', 'codeSupported': False}
        self.assertEqual(math.verify(d)['status'], 'PARTIAL')

    def test_unregistered_functions_and_arbitrary_python_rejected(self):
        for text in ["__import__('os').system('true')", '(lambda:1)()', 'sin(1)', '[1][0]', '1/0', '2**1000']:
            with self.assertRaises((ValueError, SyntaxError)): math.expression(text)

    def test_nested_roots_and_signed_fractions(self):
        self.assertEqual(math.latex_value('\\frac{-3}{2}'), math.expression('-3/2'))
        self.assertEqual(math.latex_value('2\\sqrt{5}'), math.expression('2*sqrt(5)'))

    def test_closed_latex_operation_and_all_candidates_are_checked(self):
        d = self.design('4', ['4', '-4', '16'])
        d['units'][0]['nodes'][0]['parts'][0]['mathAssertion']['expression'] = '\\sqrt{16}'
        self.assertEqual(math.verify(d)['status'], 'PASS')
        d['units'][0]['nodes'][0]['parts'][0]['expected'] = '-4'
        self.assertEqual(math.verify(d)['status'], 'FAIL')

    def test_latex_does_not_enable_unregistered_tex_or_code(self):
        for text in ['\\input{secret}', '\\htmlClass{x}{4}', '\\sqrt{-1}']:
            with self.assertRaises((ValueError, SyntaxError)): math.latex_value(text)


if __name__ == '__main__': unittest.main()
