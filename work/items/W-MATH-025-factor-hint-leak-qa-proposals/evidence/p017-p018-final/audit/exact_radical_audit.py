from pathlib import Path
from fractions import Fraction as F
import ast,re,json,itertools,sys,math
x=json.loads(Path(sys.argv[1]).read_text());items={q['id']:q for d in x['units'] for s in d['unit']['sections'] for q in s['items']}
def add(a,b):
 r=dict(a)
 for k,v in b.items():r[k]=r.get(k,F(0))+v
 return {k:v for k,v in r.items() if v}
def times(a,b):
 r={}
 for ka,va in a.items():
  for kb,vb in b.items():
   g=math.gcd(ka,kb);k=ka*kb//(g*g);r[k]=r.get(k,F(0))+va*vb*g
 return {k:v for k,v in r.items() if v}
def root(a):
 if set(a)!={1} or a[1]<0:raise ValueError('root input')
 q=a[1]
 if not q:return {}
 n=q.numerator*q.denominator;outside=1;d=2
 while d*d<=n:
  while n%(d*d)==0:outside*=d;n//=d*d
  d+=1
 return {n:F(outside,q.denominator)} if outside else {}
def inv(a):
 if not a:raise ZeroDivisionError
 primes=set()
 for n in a:
  d=2
  while d*d<=n:
   if n%d==0:primes.add(d)
   while n%d==0:n//=d
   d+=1
  if n>1:primes.add(n)
 ps=sorted(primes);basis=[math.prod(v) for r in range(len(ps)+1) for v in itertools.combinations(ps,r)];N=len(basis)
 cols=[times(a,{b:F(1)}) for b in basis]
 m=[[cols[j].get(b,F(0)) for j in range(N)]+[F(b==1)] for b in basis]
 for j in range(N):
  pivot=next(i for i in range(j,N) if m[i][j]);m[j],m[pivot]=m[pivot],m[j];v=m[j][j];m[j]=[z/v for z in m[j]]
  for i in range(N):
   if i!=j:
    v=m[i][j];m[i]=[u-v*w for u,w in zip(m[i],m[j])]
 return {b:m[i][-1] for i,b in enumerate(basis) if m[i][-1]}
def tex(s):
 s=re.sub(r'\\+',lambda m:'\\',s).replace('−','-').replace(' ','')
 def arg(i):
  if i>=len(s):raise ValueError('missing arg')
  if s[i]=='{':
   depth=1;j=i+1
   while depth:
    if s[j]=='{':depth+=1
    if s[j]=='}':depth-=1
    j+=1
   return tex(s[i+1:j-1]),j
  if s[i].isalnum():return s[i],i+1
  raise ValueError('arg')
 out='';i=0
 while i<len(s):
  if s.startswith('\\sqrt',i):a,i=arg(i+5);out+='R('+a+')';continue
  if s.startswith('\\frac',i):a,j=arg(i+5);b,i=arg(j);out+='(('+a+')/('+b+'))';continue
  command=re.match(r'\\(cdot|times|quad|qquad|,|;| )',s[i:])
  if command:out+='*' if command[1] in ['cdot','times'] else '';i+=len(command[0]);continue
  if s[i] in '{}':out+='(' if s[i]=='{' else ')'
  elif s[i].isdigit() or s[i] in '.+-*/^()R':out+=s[i]
  else:raise ValueError('unsupported '+s)
  i+=1
 return out
def value(s):
 s=tex(s);tok=re.findall(r'\d+(?:\.\d+)?|R|[()+*/^\-]',s)
 if ''.join(tok)!=s:raise ValueError(s)
 out=[]
 for t in tok:
  if out and (out[-1][-1].isdigit() or out[-1]==')') and (t=='R' or t=='('):out.append('*')
  out.append(t)
 tree=ast.parse(''.join(out).replace('^','**'),mode='eval')
 def ev(t):
  if isinstance(t,ast.Constant) and type(t.value) in [int,float]:return {1:F(str(t.value))}
  if isinstance(t,ast.UnaryOp):return {k:v*(-1 if isinstance(t.op,ast.USub) else 1) for k,v in ev(t.operand).items()}
  if isinstance(t,ast.Call) and isinstance(t.func,ast.Name) and t.func.id=='R' and len(t.args)==1:return root(ev(t.args[0]))
  if isinstance(t,ast.BinOp):
   a=ev(t.left)
   if isinstance(t.op,ast.Pow):
    if not isinstance(t.right,ast.Constant) or type(t.right.value)!=int or not 0<=t.right.value<=12:raise ValueError('power')
    r={1:F(1)}
    for _ in range(t.right.value):r=times(r,a)
    return r
   b=ev(t.right)
   if isinstance(t.op,ast.Add):return add(a,b)
   if isinstance(t.op,ast.Sub):return add(a,{k:-v for k,v in b.items()})
   if isinstance(t.op,ast.Mult):return times(a,b)
   if isinstance(t.op,ast.Div):return times(a,inv(b))
  raise ValueError('AST')
 return {k:v for k,v in ev(tree.body).items() if v}
refs={'n09-03':'\\sqrt{(-4)^2}','n08-07':'3-\\sqrt5','n09-07':'\\sqrt5-2','n10-02':'\\sqrt{125}','n10-08':'\\sqrt6*\\sqrt8','n10-09':'\\sqrt8+\\sqrt{50}','n10-10':'\\sqrt8+\\sqrt{50}','n10-11':'(\\sqrt2-\\sqrt3)^2','n10-12':'(\\sqrt2-\\sqrt3)^2','n10-13':'(\\sqrt7+\\sqrt2)*(\\sqrt7-\\sqrt2)','n10-15':'\\frac1{2\\sqrt3}','n10-16':'\\frac1{2\\sqrt3}','n10-17':'\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}','n10-18':'3-2','n10-19':'\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}','n10-20':'\\frac{2-\\sqrt3}{2+\\sqrt3}','n10-21':'\\frac{2-\\sqrt3}{2+\\sqrt3}','n11-06':'7/3','n14-15':'-2/3'}
checks=[]
for id,ref in refs.items():
 for a in items[id]['answer'].split('='):
  assert value(a)==value(ref),(id,a,ref,value(a),value(ref));checks.append({'id':id,'actual':a,'reference':ref})
sets=[];unparsed=[];pairs=[]
for d in x['units']:
 for q in d['visibleChoices']:
  try:values=[value(a) for a in q['choices']]
  except (ValueError,ZeroDivisionError,SyntaxError,IndexError,StopIteration):unparsed.append(q['id']);continue
  sets.append(q['id'])
  for i,j in itertools.combinations(range(len(values)),2):
   if values[i]==values[j]:pairs.append({'id':q['id'],'choices':[q['choices'][i],q['choices'][j]]})
out={'source':x['metadata']['executedHead'],'method':'exact rational square-free radical basis; division solved by rational linear algebra; no floating-point sampling','referenceKeys':len(refs),'referenceChecks':len(checks),'fullyParsedScalarChoiceSets':len(sets),'unparsed':unparsed,'equalValuePairs':pairs,'checks':checks,'scope':'numeric scalar grammar only; unsupported parameters/relations/text are not certified by this parser'}
Path('p017-audit/exact-radical-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:out[k] for k in ['source','referenceKeys','referenceChecks','fullyParsedScalarChoiceSets','equalValuePairs']}))
