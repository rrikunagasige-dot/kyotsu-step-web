"""Exact finite audit. Wrong values may make a weaker inequality true: verify ALL transition assertions."""
import json,sys,itertools
try: import sympy as sp
except ImportError:
 print(json.dumps({'status':'UNSUPPORTED','reason':'MATH_DEPENDENCY_MISSING'}));sys.exit(0)
plan=json.load(sys.stdin);results=[]
try:
 for i in plan['interactions']:
  assumptions=i['assumptions']
  supported={'a>0','a<0','a>=0','a is real','u<0','pi>3','sqrt(5)>=0','3>=0','5<9','sqrt(5)-3<0','3-pi<0'}
  if any(x not in supported for x in assumptions):raise ValueError('unsupported assumption')
  if 'a>0' in assumptions and 'a<0' in assumptions:raise ValueError('contradictory assumptions')
  a=sp.Symbol('a',positive=True) if 'a>0' in assumptions else sp.Symbol('a',negative=True) if 'a<0' in assumptions else sp.Symbol('a',nonnegative=True) if 'a>=0' in assumptions else sp.Symbol('a',real=True);u=sp.Symbol('u',negative=True) if 'u<0' in assumptions else sp.Symbol('u',real=True)
  parts={p['key']:p for p in i['parts']}
  def exp(n,d):
   k=n['kind']
   if k=='rational':return sp.Rational(int(n['n']),int(n['d']))
   if k=='symbol':return {'a':a,'u':u}[n['name']]
   if k=='constant':return sp.pi if n['name']=='pi' else (_ for _ in ()).throw(ValueError('constant'))
   if k=='sqrt':return sp.sqrt(exp(n['argument'],d))
   if k=='absolute':return sp.Abs(exp(n['argument'],d))
   if k=='add':return sum(exp(x,d) for x in n['args'])
   if k=='multiply':return sp.Mul(*(exp(x,d) for x in n['args']))
   if k=='divide':return exp(n['numerator'],d)/exp(n['denominator'],d)
   if k=='power':return exp(n['base'],d)**n['exponent']
   if k=='part-key':return exp(d[n['key']]['expression'],d)
   if k=='bound-subtree-part':return exp(i['boundSourceTree']['subtreeMap'][d[n['partKey']]['subtreeRef']],d)
   if k=='unary':return (-1 if d[n['signPartKey']]['value']=='-' else 1)*exp(n['argument'],d)
   if k=='binary':
    left,right,op=exp(n['left'],d),exp(n['right'],d),d[n['operationPartKey']]['value'];return left*right if op=='\\times' else left+right if op=='+' else left-right if op=='-' else (_ for _ in ()).throw(ValueError('operator'))
   raise ValueError('unsupported AST '+k)
  def holds(n,d):
   if n['kind']=='meaning':
    fact=sp.simplify(exp(n['expression'],d)<0)
    if fact!=True:raise ValueError('unproven meaning fact')
    return d[n['valuePartKey']]['value']=='負'
   left,right=exp(n['left'],d),exp(n['right'],d);op=n.get('operator',d.get(n.get('operatorPartKey'),{}).get('value'))
   if op=='=':return sp.simplify(left-right)==0
   if op=='<':return sp.simplify(left<right)==True
   if op=='>':return sp.simplify(left>right)==True
   raise ValueError('unsupported relation')
  count=0
  for candidates in itertools.product(*(p['choices'] for p in i['parts'])):
   d={p['key']:c for p,c in zip(i['parts'],candidates)};grade=all(d[p['key']]['value']==p['expected'] for p in i['parts']);actual=all(holds(n,d) for n in i['assertions']);count+=1
   if grade!=actual:results.append({'parentRef':i['id'],'status':'FAIL','draft':{k:c['id'] for k,c in d.items()},'grade':grade,'assertionsHold':actual})
  results.append({'parentRef':i['id'],'status':'PASS' if not any(x.get('parentRef')==i['id'] and x['status']=='FAIL' for x in results) else 'FAIL','caseCount':count})
 print(json.dumps({'status':'FAIL' if any(r['status']=='FAIL' for r in results) else 'PASS','caseCount':sum(r.get('caseCount',0) for r in results),'parentCount':len(plan['interactions']),'results':results}))
except (ValueError,KeyError,TypeError) as e:print(json.dumps({'status':'UNSUPPORTED','reason':str(e)}))
