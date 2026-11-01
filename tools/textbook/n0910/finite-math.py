"""Exact finite candidate audit. A closed Python AST; never eval/sympify source text.

Operation assertions and source correspondence remain separate responsibilities.
Unsupported pedagogical/symbolic claims are retained, never promoted to PASS.
"""
import ast
import hashlib
import json
import re
import sys
import sympy as sp


def expression(text):
    text = str(text)
    tree = ast.parse(text, mode='eval')
    if len(list(ast.walk(tree))) > 100:
        raise ValueError('expression budget')

    def visit(node):
        if isinstance(node, ast.Constant) and type(node.value) in (int, float):
            token = ast.get_source_segment(text, node)
            return sp.Rational(token)
        if isinstance(node, ast.Name) and node.id == 'pi': return sp.pi
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
            return visit(node.operand) * (-1 if isinstance(node.op, ast.USub) else 1)
        if isinstance(node, ast.BinOp):
            a, b = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Add): return a + b
            if isinstance(node.op, ast.Sub): return a - b
            if isinstance(node.op, ast.Mult): return a * b
            if isinstance(node.op, ast.Div):
                if b == 0: raise ValueError('zero denominator')
                return a / b
            if isinstance(node.op, ast.Pow) and b.is_Integer and -4 <= b <= 4: return a ** b
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and not node.keywords and len(node.args) == 1:
            a = visit(node.args[0])
            if node.func.id == 'sqrt' and a.is_nonnegative: return sp.sqrt(a)
            if node.func.id == 'floor': return sp.floor(a)
            if node.func.id == 'Abs': return sp.Abs(a)
        raise ValueError('unsupported expression')
    return visit(tree.body)


def latex_value(text):
    s = str(text).replace(' ', '').replace('−', '-').replace('\\left', '').replace('\\right', '')
    s = s.replace('\\times', '*').replace('\\cdot', '*').replace('\\pi', 'pi')

    def group(start):
        if s[start] != '{': raise ValueError('group required')
        depth = 1
        for end in range(start + 1, len(s)):
            depth += (s[end] == '{') - (s[end] == '}')
            if not depth: return s[start + 1:end], end + 1
        raise ValueError('unclosed group')

    # Replace complete nested command arguments recursively, not with greedy regex.
    while '\\sqrt' in s or '\\frac' in s:
        match = re.search(r'\\(?:sqrt|frac)', s)
        start, end = match.span()
        if match.group() == '\\sqrt':
            if end < len(s) and s[end] == '{': arg, stop = group(end)
            elif end < len(s) and s[end].isdigit(): arg, stop = s[end], end + 1
            else: raise ValueError('unsupported root')
            replacement = 'sqrt(' + str(latex_value(arg)) + ')'
        else:
            a, stop = group(end); b, stop = group(stop)
            replacement = '(' + str(latex_value(a)) + ')/(' + str(latex_value(b)) + ')'
        s = s[:start] + replacement + s[stop:]
    s = re.sub(r'\^\{(-?\d+)\}', r'**(\1)', s)
    s = re.sub(r'\^(-?\d+)', r'**(\1)', s)
    s = re.sub(r'(?<=[0-9)])(?=sqrt|pi)', '*', s)
    s = s.replace(')(', ')*(')
    return expression(s)


def verify(design):
    rows, candidates, failures = [], 0, []
    for unit in design.get('units', []):
        for node in unit['nodes']:
            for part in node['parts']:
                key = part['id']; assertion = part.get('mathAssertion', {})
                try:
                    if assertion.get('kind') == 'exact-evaluation':
                        if not assertion.get('expression') or not assertion.get('sourceRefs'): raise ValueError('unbound operation')
                        operation = assertion['expression']
                        actual = latex_value(operation) if '\\' in operation else expression(operation)
                        authored_expected = latex_value(part['expected'])
                        if sp.simplify(actual - authored_expected) != 0: raise ArithmeticError('operation result differs from expected part')
                        for choice in part['choices']:
                            value = latex_value(choice['value'])
                            holds = sp.simplify(value - actual) == 0
                            grade = choice['value'] == part['expected']
                            candidates += 1
                            if bool(holds) != grade: failures.append({'partId': key, 'candidate': choice['value'], 'rule': 'VALUE_GRADING_DISAGREEMENT'})
                        rows.append({'partId': key, 'status': 'PASS', 'scope': 'exact operation value and candidate grading', 'sourceRefs': assertion['sourceRefs']})
                    elif assertion.get('kind') == 'relation':
                        a, b = expression(assertion['left']), expression(assertion['right'])
                        ops = {'<': lambda: a < b, '>': lambda: a > b, '=': lambda: sp.Eq(a, b), '\\ne': lambda: sp.Ne(a, b)}
                        for choice in part['choices']:
                            if choice['value'] not in ops: raise ValueError('unsupported relation candidate')
                            holds = sp.simplify(ops[choice['value']]())
                            if holds not in (sp.true, sp.false): raise ValueError('unresolved relation')
                            candidates += 1
                            if bool(holds) != (choice['value'] == part['expected']): failures.append({'partId': key, 'candidate': choice['value'], 'rule': 'RELATION_GRADING_DISAGREEMENT'})
                        rows.append({'partId': key, 'status': 'PASS', 'scope': 'numeric relation only; teaching provenance requires separate review'})
                    else:
                        raise ValueError('symbolic/source-scope/teaching claim requires explicit review')
                except ArithmeticError as error:
                    failures.append({'partId': key, 'rule': 'OPERATION_ASSERTION', 'detail': str(error)})
                    rows.append({'partId': key, 'status': 'FAIL'})
                except (ValueError, KeyError, SyntaxError, TypeError) as error:
                    rows.append({'partId': key, 'status': 'UNSUPPORTED', 'detail': str(error), 'required': 'source-bound nonauthor review or solver extension'})
    unsupported = sum(r['status'] == 'UNSUPPORTED' for r in rows)
    return {'status': 'FAIL' if failures else 'PARTIAL' if unsupported else 'PASS', 'partCount': len(rows), 'candidateCount': candidates, 'unsupportedParts': unsupported, 'failures': failures, 'results': rows, 'sympyVersion': sp.__version__, 'meaningReviewRequired': True, 'appVerificationStatus': 'NOT_RUN'}


if __name__ == '__main__':
    data = sys.stdin.buffer.read() if sys.argv[1] == '-' else open(sys.argv[1], 'rb').read(); result = verify(json.loads(data))
    result['designSha256'] = hashlib.sha256(data).hexdigest()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(1 if result['status'] == 'FAIL' else 0)
