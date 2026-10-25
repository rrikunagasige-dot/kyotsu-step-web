"""Feasibility probe only; not a production verifier or a textbook acceptance receipt."""
import sympy as s,json
from pathlib import Path
A=s.Symbol('a',real=True);root=s.sqrt(5);rows=[]
def check(name,result,scope):
 value=bool(result);rows.append({'id':name,'status':'PASS' if value else 'FAIL','scope':scope})
check('distance_right',s.Rational(23,10)-0==s.Rational(23,10),'Q01 exact rational')
check('distance_left',0-(-5)==5,'Q01 arithmetic')
check('nonnegative_definition',s.refine(s.Abs(A),s.Q.nonnegative(A))==A,'Q02 conditional definition')
check('negative_definition',s.refine(s.Abs(A),s.Q.negative(A))==-A,'Q03 conditional definition')
check('substitute_negative',-s.Integer(-5)==5,'Q04 parentheses')
check('root_square',root**2==5 and s.Integer(3)**2==9,'Q05 exact squares')
check('root_order',root<3,'Q05 exact algebraic comparison, no decimal sampling')
check('root_difference',(root-3).is_negative is True,'Q06 exact sign')
check('root_abs',s.simplify(s.Abs(root-3)-(3-root))==0,'Q07 exact identity after sign')
check('pi_order',s.pi>3,'Q08 exact constant comparison; source decimal is the teaching basis')
check('pi_difference',(3-s.pi).is_negative is True,'Q08 exact sign')
check('pi_abs',s.simplify(s.Abs(3-s.pi)-(s.pi-3))==0,'Q09 exact expression')
check('zero_iff',s.solveset(s.Abs(A),A,domain=s.S.Reals)==s.FiniteSet(0),'Q10 zero locus only, not a pedagogic proof')
check('opposite_distance',s.simplify(s.Abs(A)-s.Abs(-A))==0,'Q11 real-symbol identity')
check('absolute_square',s.simplify(s.Abs(A)**2-A**2)==0,'Q12 real-symbol identity')
left=s.Interval.open(-s.oo,0);right=s.Interval(0,s.oo)
check('case_partition',s.Union(left,right)==s.S.Reals and left.intersect(right)==s.S.EmptySet,'Q02/03 and Q12 complete disjoint coverage incl zero')
# An equality may be true while failing the requested transformation.
check('distractor_true_but_wrong_target',s.simplify((A-0)-A)==0 and s.simplify((0+A)-A)==0,'Q03: true equalities, different input than 0-a; form/operation contract required')
out={'status':'PASS' if all(r['status']=='PASS' for r in rows) else 'FAIL','engine':'SymPy '+s.__version__,'productionAdapterUpgraded':False,'formalProof':False,'checks':rows}
Path('work/items/W-MATH-037-n08-workflow-trial/MATH_FEASIBILITY.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':out['status'],'checks':len(rows),'productionAdapterUpgraded':False}))
