import sympy as s,json
from pathlib import Path
r=s.sqrt;X=1/(2*r(3));Y=(2-r(3))/(2+r(3))
pairs=[(X*r(3)/r(3),r(3)/(2*r(3)**2)),(X*r(3),s.Rational(1,2)),(X*3/r(3),s.Rational(1,2)),(X*r(2)/r(2),r(2)/(2*r(6))),((2-r(3))**2/((2+r(3))*(2-r(3))),(2-r(3))**2/(4-3)),((2-r(3))**2/(2+r(3))**2,(2-r(3))**2/(7+4*r(3))),(Y*(2+r(3))/(2+r(3)),1/(2+r(3))**2),((2-r(3))**2/(4+3),(2-r(3))**2/7)]
rows=[dict(before=str(a),after=str(b),difference=str(s.simplify(a-b)),pass_=s.simplify(a-b)==0) for a,b in pairs];assert all(x['pass_'] for x in rows)
groups=[]
for node,a,b in [('n10-q17-factor',r(3),r(2)),('n10-q20-factor',s.Integer(2),r(3))]:
 groups.append(dict(node=node,current=str(s.expand((a+b)*a-b)),proposed=str(s.expand((a+b)*(a-b)))))
assert all(x['proposed']=='1' for x in groups)
B=Path(__file__).resolve().parent
(B/'evidence/EXACT_MATH_CHECKS.json').write_text(json.dumps(dict(status='PASS_PROPOSED_PROJECTIONS_ONLY',candidateValuePreservation=rows,groupingCounterexamples=groups),ensure_ascii=False,indent=2)+'\n')
print('8 exact option-value checks and 2 grouping counterexamples verified')
