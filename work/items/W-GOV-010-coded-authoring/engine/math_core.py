"""有理係数・一変数多項式の限定検算。eval、外部CAS、ネットワークは使わない。"""
import ast
from fractions import Fraction

class Unsupported(ValueError): pass

def tree(expression):
    if not isinstance(expression,str) or len(expression)>2000:
        raise Unsupported('式の長さ／型が対象外')
    try: node=ast.parse(expression,mode='eval').body
    except (SyntaxError,ValueError) as e: raise Unsupported('数式の構文が対象外') from e
    if sum(1 for _ in ast.walk(node))>300: raise Unsupported('式が複雑すぎる')
    return node

def trim(p):
    while len(p)>1 and p[-1]==0: p.pop()
    return p

def plus(a,b):
    return trim([(a[i] if i<len(a) else 0)+(b[i] if i<len(b) else 0) for i in range(max(len(a),len(b)))])

def times(a,b):
    if len(a)+len(b)-2>8: raise Unsupported('次数8超は対象外')
    out=[Fraction(0)]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b): out[i+j]+=x*y
    return trim(out)

def polynomial(expression):
    def visit(n):
        if isinstance(n,ast.Constant) and type(n.value) is int and abs(n.value)<=10**9: return [Fraction(n.value)]
        if isinstance(n,ast.Name) and n.id=='x': return [Fraction(0),Fraction(1)]
        if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.USub,ast.UAdd)):
            a=visit(n.operand); return [-v for v in a] if isinstance(n.op,ast.USub) else a
        if isinstance(n,ast.BinOp):
            if isinstance(n.op,ast.Pow):
                if not isinstance(n.right,ast.Constant) or type(n.right.value) is not int or not 0<=n.right.value<=8:
                    raise Unsupported('非整数・負の指数は対象外')
                base=visit(n.left)
                out=[Fraction(1)]
                for _ in range(n.right.value): out=times(out,base)
                return out
            a,b=visit(n.left),visit(n.right)
            if isinstance(n.op,ast.Add): return plus(a,b)
            if isinstance(n.op,ast.Sub): return plus(a,[-v for v in b])
            if isinstance(n.op,ast.Mult): return times(a,b)
            if isinstance(n.op,ast.Div) and len(b)==1 and b[0]!=0: return [v/b[0] for v in a]
        raise Unsupported('一変数多項式と非零定数による除算だけに対応')
    return trim(visit(tree(expression)))

def raw_value(expression,x):
    """係数展開と別の再帰処理で、原式を有理数点に直接代入する。"""
    polynomial(expression)  # 許可領域の検査。係数の値は利用しない。
    def visit(n):
        if isinstance(n,ast.Constant): return Fraction(n.value)
        if isinstance(n,ast.Name): return Fraction(x)
        if isinstance(n,ast.UnaryOp):
            return -visit(n.operand) if isinstance(n.op,ast.USub) else visit(n.operand)
        a,b=visit(n.left),visit(n.right)
        if isinstance(n.op,ast.Add): return a+b
        if isinstance(n.op,ast.Sub): return a-b
        if isinstance(n.op,ast.Mult): return a*b
        if isinstance(n.op,ast.Div): return a/b
        return a**int(b)
    return visit(tree(expression))

def same(a,b): return polynomial(a)==polynomial(b)

def independent_identity(a,b):
    """次数上界dの二多項式をd+1個の相異なる有理数点で厳密比較する。"""
    def bound(n):
        if isinstance(n,ast.Constant): return 0
        if isinstance(n,ast.Name): return 1
        if isinstance(n,ast.UnaryOp): return bound(n.operand)
        if isinstance(n.op,ast.Pow): return bound(n.left)*n.right.value
        if isinstance(n.op,ast.Mult): return bound(n.left)+bound(n.right)
        if isinstance(n.op,ast.Div): return bound(n.left)
        return max(bound(n.left),bound(n.right))
    polynomial(a); polynomial(b)
    d=max(bound(tree(a)),bound(tree(b)))
    if d>8: raise Unsupported('独立検算の構文上次数が8を超える')
    return all(raw_value(a,Fraction(2*i-3,2))==raw_value(b,Fraction(2*i-3,2)) for i in range(d+1))

def expression(coefficients):
    return '+'.join(f'({v})*x**{i}' for i,v in enumerate(coefficients)) or '0'

def display(expression_):
    # 正規形を表示する箇所専用。元の計算過程の表示は呼出側が別に持つ。
    p=polynomial(expression_); terms=[]
    for i in reversed(range(len(p))):
        c=p[i]
        if not c: continue
        mag=abs(c); number=str(mag.numerator) if mag.denominator==1 else f'({mag.numerator}/{mag.denominator})'
        body=number if i==0 else ('' if mag==1 else number)+'x'+('' if i==1 else str(i).translate(str.maketrans('0123456789','⁰¹²³⁴⁵⁶⁷⁸⁹')))
        terms.append(('-' if c<0 else '+' if terms else '')+body)
    return ''.join(terms) or '0'
