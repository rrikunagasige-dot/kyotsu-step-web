"""Exact elementary, one-real-variable claims on explicit nonempty intervals."""
import sympy as sp
import solution as c

def value(v,x):
 e=c.ast(v);stack=[e]
 if e.free_symbols-{x}:raise c.Unsupported('one real variable only')
 for a in sp.preorder_traversal(e):
  if a.func==sp.Abs:
   try:degree=sp.Poly(a.args[0],x).degree()
   except sp.PolynomialError:raise c.Unsupported('absolute argument must be linear')
   if degree>1:raise c.Unsupported('absolute argument must be linear')
 residual=e.replace(lambda a:a.func==sp.Abs,lambda a:sp.Symbol('abs_placeholder',real=True))
 try:
  if sp.Poly(residual,x,*sorted(residual.free_symbols-{x},key=str)).total_degree()>4:raise c.Unsupported('degree limit')
 except sp.PolynomialError:raise c.Unsupported('expression exceeds bounded algebra')
 return e

def solution_set(s,x):
 a,b=value(s['left'],x),value(s['right'],x);op=s['operator']
 relation=c.OPS[op](a,b)
 if relation is sp.S.true:return sp.S.Reals
 if relation is sp.S.false:return sp.S.EmptySet
 result=sp.solveset(relation,x,domain=sp.S.Reals) if op=='=' else sp.solve_univariate_inequality(relation,x,relational=False)
 if result.has(sp.ConditionSet):raise c.Unsupported('unresolved solution set')
 return result

def holds(s,x,domain):return domain.is_subset(solution_set(s,x)) is True

def statement(check):
 k=check['kind']
 if k=='identity':return {'kind':'relation','left':check['left'],'right':check['right'],'operator':'='}
 if k in ('claim','case-join'):return check['statement']
 if k=='transformation':return check['after']
 if k=='square-order':return {'kind':'relation','left':check['left'],'right':check['right'],'operator':check['operator']}
 return None

def run(check,x,domain,facts):
 k=check['kind']
 if k in ('claim','identity'):return {'status':'PASS' if holds(statement(check),x,domain) else 'FAIL'}
 if k=='equivalence':
  left=domain.intersect(solution_set(check['left'],x));right=domain.intersect(solution_set(check['right'],x))
  forward=facts.get(check['forwardProof']);reverse=facts.get(check['reverseProof'])
  valid=forward and reverse and forward['domain']==left and reverse['domain']==right and forward['statement']==check['right'] and reverse['statement']==check['left']
  return {'status':'PASS' if valid and left==right else 'FAIL','reason':'EXACT_IMPLICATION_SCOPES_AND_EQUAL_SOLUTION_SETS'}
 if k=='square-order':
  zero={'kind':'rational','n':'0','d':'1'}
  nonnegative=all(holds({'kind':'relation','operator':'>=','left':check[side],'right':zero},x,domain) for side in ('left','right'))
  squared={'kind':'relation','operator':check['operator'],'left':{'kind':'power','base':check['left'],'exponent':2},'right':{'kind':'power','base':check['right'],'exponent':2}}
  return {'status':'PASS' if nonnegative and holds(squared,x,domain) and holds(statement(check),x,domain) else 'FAIL','nonnegativeVerified':nonnegative}
 if k=='transformation':
  if not holds(check['before'],x,domain) or not holds(check['after'],x,domain):return {'status':'FAIL','reason':'TRANSFORMATION_CLAIM_NOT_TRUE_ON_DOMAIN'}
  return c.transition(check['before'],check['after'],check)
 if k=='case-join':
  cases=[]
  for branch in check['branches']:
   d=c.interval(branch['domain']);f=facts.get(branch['proofId'])
   if d==sp.S.EmptySet or not f or f['domain']!=d or f['statement']!=check['statement']:return {'status':'FAIL','reason':'CASE_PROOF_DOMAIN_OR_CLAIM'}
   if not holds(check['statement'],x,d):return {'status':'FAIL','reason':'CASE_CLAIM_FALSE'}
   cases.append(d)
  covered=sp.Union(*cases)==domain;overlap=any(a.intersect(b)!=sp.S.EmptySet for i,a in enumerate(cases) for b in cases[:i])
  return {'status':'PASS' if covered and not overlap else 'FAIL','coverage':covered,'overlap':overlap}
 if k=='answer-form':
  expected=c.ast(check['expected']);right=c.ast(check['rightCoordinate']);left=c.ast(check['leftCoordinate'])
  def pattern(v):
   return v.get('kind')=='add' and len(v['args'])==2 and v['args'][0]==check['rightCoordinate'] and v['args'][1]=={'kind':'multiply','args':[{'kind':'rational','n':'-1','d':'1'},check['leftCoordinate']]}
  rows=[{'id':q['id'],'mathStatus':'PASS' if c.equal(c.ast(q['value']),expected) else 'FAIL','formStatus':'PASS' if pattern(q['value']) else 'FAIL'} for q in check['choices']]
  matches=[r for r in rows if r['mathStatus']=='PASS' and r['formStatus']=='PASS']
  return {'status':'PASS' if c.equal(expected,right-left) and pattern(check['expected']) and len(matches)==1 else 'FAIL','choices':rows}
 raise c.Unsupported('check kind')

def verify_bundle(bundle):
 rows=[]
 for problem in bundle['problems']:
  x=sp.Symbol(problem['variable'],real=True);root=c.interval(problem['domain']);facts={}
  if root==sp.S.EmptySet:return {'status':'FAIL','reason':'EMPTY_ROOT_DOMAIN'}
  for segment in problem['segments']:
   try:
    d=c.interval(segment.get('domain',problem['domain']))
    if d==sp.S.EmptySet or d.is_subset(root) is not True:raise ValueError('EMPTY_OR_OUTSIDE_DOMAIN')
    if segment['check']['kind'] not in ('case-join','equivalence'):
     for req in segment['requires']:
      if req in facts and d.is_subset(facts[req]['domain']) is not True:raise ValueError('CONDITIONAL_FACT_OUTSIDE_SCOPE')
    if segment['check']['kind']=='transformation' and not any(facts.get(req,{}).get('statement')==segment['check']['before'] for req in segment['requires']):raise ValueError('TRANSFORMATION_PREMISE_NOT_CONNECTED')
    r=run(segment['check'],x,d,facts)
    if r['status']=='PASS':facts[segment['produces']]={'domain':d,'statement':statement(segment['check'])}
   except (c.Unsupported,NotImplementedError) as ex:r={'status':'UNSUPPORTED','reason':str(ex)}
   except (ValueError,TypeError,KeyError,sp.PolynomialError) as ex:r={'status':'FAIL','reason':str(ex)}
   rows.append({'problemId':problem['id'],'segmentId':segment['id'],**r})
  for conclusion in problem['conclusions']:
   if conclusion not in facts or facts[conclusion]['domain']!=root:rows.append({'problemId':problem['id'],'status':'FAIL','reason':'CONCLUSION_NOT_ESTABLISHED_ON_ROOT_DOMAIN','fact':conclusion})
 return {'status':'FAIL' if any(r['status']=='FAIL' for r in rows) else 'UNSUPPORTED' if any(r['status']=='UNSUPPORTED' for r in rows) else 'PASS','checks':rows,'engineVersion':sp.__version__,'formalProof':False,'scope':'bounded exact mathematical segments; teaching and source audit required'}
