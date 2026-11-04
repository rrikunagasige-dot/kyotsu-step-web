"""Check listed concrete solution sets with the existing closed-AST solver."""
from pathlib import Path
import sys,json
B=Path(__file__).resolve().parent;R=B.parents[2];sys.path.insert(0,str(R/'tools/textbook/solver'))
import solution,bundle
import sympy as sp
x=sp.Symbol('x',real=True)
def num(n,d=1):return {'kind':'rational','n':str(n),'d':str(d)}
X={'kind':'symbol','name':'x'}
def linear(a,b):return {'kind':'add','args':[{'kind':'multiply','args':[num(a),X]},num(b)]}
def absolute(a,b):return {'kind':'absolute','argument':linear(a,b)}
rows=[]
for label,a,b,op,right,expected in [
 ('n13-q01',1,0,'=',5,sp.FiniteSet(-5,5)),('n13-q02-q04',1,-1,'=',4,sp.FiniteSet(-3,5)),
 ('n13-q06-q07',1,2,'=',3,sp.FiniteSet(-5,1)),('n13-q08',3,0,'=',6,sp.FiniteSet(-2,2)),
 ('n13-q09-zero',1,0,'=',0,sp.FiniteSet(0)),('n13-q09-negative',1,0,'=',-2,sp.S.EmptySet),
 ('n14-q01-q04',1,0,'<',3,sp.Interval.open(-3,3)),
 ('n14-q05-q06',1,0,'>=',4,sp.Union(sp.Interval(-sp.oo,-4),sp.Interval(4,sp.oo))),
 ('n14-q09-q10',1,-3,'<',5,sp.Interval.open(-2,8)),
 ('n14-q11-q12',1,3,'>=',2,sp.Union(sp.Interval(-sp.oo,-5),sp.Interval(-1,sp.oo))),
 ('n14-q13-q16',3,-2,'<=',4,sp.Interval(-sp.Rational(2,3),2)),
]:
 statement={'kind':'relation','left':absolute(a,b),'operator':op,'right':num(right)}
 actual=bundle.solution_set(statement,x);assert actual==expected,(label,actual,expected)
 rows.append({'id':label,'statement':statement,'actualSet':str(actual),'expectedSet':str(expected),'status':'PASS'})
for at in [sp.Rational(-2,3),sp.Integer(2)]:
 value=solution.ast(absolute(3,-2)).subs(x,at);assert value==4
 rows.append({'id':'n14-q16-endpoint-'+str(at),'value':str(value),'satisfiesOriginal':True,'status':'PASS'})
out={'status':'PASS_BOUNDED_EXACT_SOLUTION_SETS','engine':sp.__version__,'checks':rows,'formalProof':False,'limits':['Existing closed-AST exact solution_set function reused. General symbolic-a proofs, teaching quality, UI and saving are separate AI/implementation checks.']}
(B/'evidence/MATH_CHECK.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':out['status'],'checks':len(rows),'engine':sp.__version__}))
