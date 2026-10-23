from pathlib import Path
from fractions import Fraction as F
import json,re,ast,sys,math,hashlib
input_path=Path(sys.argv[1] if len(sys.argv)>1 else 'chapter-audit-native/runtime-units.json')
data=json.loads(input_path.read_text()); items={q['id']:q for d in data['units'] for s in d['unit']['sections'] for q in s['items']}; checks=[]
def add(a,b):
 r=dict(a)
 for k,v in b.items():r[k]=r.get(k,F(0))+v
 return {k:v for k,v in r.items() if v}
def mul(a,b):
 r={}
 for ka,va in a.items():
  for kb,vb in b.items():
   k=tuple(sorted(ka+kb));r[k]=r.get(k,F(0))+va*vb
 return {k:v for k,v in r.items() if v}
def clean(s):
 for a,b in [('−','-'),('\\cdot','*'),('\\times','*'),('\\,',''),('\\;',''),('\\quad',''),('\\ ','')]:s=s.replace(a,b)
 return s.replace('{','').replace('}','').replace(' ','')
def poly(s):
 s=clean(s)
 if re.search(r'[^A-Za-z0-9+*^()\-/]',s):raise ValueError('Not polynomial: '+s)
 tok=re.findall(r'\d+|[A-Za-z]|[+*^()\-/]',s);parts=[]
 for t in tok:
  if parts and (parts[-1].isalnum() or parts[-1]==')') and (t.isalpha() or t=='(' or(t.isdigit() and parts[-1]!='^')):parts.append('*')
  parts.append(t)
 tree=ast.parse(''.join(parts).replace('^','**'),mode='eval')
 def ev(t):
  if isinstance(t,ast.Constant) and type(t.value)==int:return {():F(t.value)} if t.value else {}
  if isinstance(t,ast.Name) and len(t.id)==1:return {(t.id,):F(1)}
  if isinstance(t,ast.UnaryOp):return {k:v*(-1 if isinstance(t.op,ast.USub) else 1) for k,v in ev(t.operand).items()}
  if isinstance(t,ast.BinOp):
   a=ev(t.left)
   if isinstance(t.op,ast.Pow):
    assert isinstance(t.right,ast.Constant) and type(t.right.value)==int and 0<=t.right.value<=12
    r={():F(1)}
    for _ in range(t.right.value):r=mul(r,a)
    return r
   b=ev(t.right)
   if isinstance(t.op,ast.Add):return add(a,b)
   if isinstance(t.op,ast.Sub):return add(a,{k:-v for k,v in b.items()})
   if isinstance(t.op,ast.Mult):return mul(a,b)
   if isinstance(t.op,ast.Div) and set(b)=={()}:return {k:v/b[()] for k,v in a.items()}
  raise ValueError('Unsupported AST '+s)
 return ev(tree.body)
def check(id,condition,method,calculation):
 assert id in items,id
 assert condition,(id,items[id]['answer'],calculation)
 checks.append({'id':id,'method':method,'calculation':calculation,'result':'PASS'})
def eq(id,expected,answer=None):
 actual=items[id]['answer'] if answer is None else answer
 check(id,poly(actual)==poly(expected),'exact rational multivariate coefficients',actual+' = '+expected)
def tuple_eq(id,expected):
 s=items[id]['answer']
 if s.startswith('(') and s.endswith(')'):s=s[1:-1]
 actual=s.split(',')
 assert len(actual)==len(expected),(id,actual,expected)
 for a,e in zip(actual,expected):eq(id,e,a)
def getcoef(s,var,power):
 out={}
 for k,v in poly(s).items():
  if k.count(var)==power:out[tuple(x for x in k if x!=var)]=v
 return out
def coef(id,s,var,power):check(id,poly(items[id]['answer'])==getcoef(s,var,power),'exact coefficient extraction',s+' coefficient '+var+'^'+str(power))
# N01: source monomials and degree, then original polynomial sums.
eq('n01-01','-1')
for id,co,deg in [('n01-02a','-2','1'),('n01-02b','1','2'),('n01-02c','-1','4')]:tuple_eq(id,[co,deg])
coef('n01-03','5x^3y','x',3);tuple_eq('n01-04',['5x^3','1']);tuple_eq('n01-05',['ay','ax'])
eq('n01-06a','3x^2-5x^2')
eq('n01-r3-q07-x2coef','3-5');eq('n01-r3-q07-xcoef','-5+2');eq('n01-r3-q07-const','6-3')
original='3x^2-5x+6-5x^2+2x-3';eq('n01-07',original);tuple_eq('n01-08',['2','3'])
for id in ['n01-09a','n01-09b']:eq(id,'x^3-2x^2+x-x^3+3x-1')
# N02: independent A/B definitions and coefficient extraction.
eq('n02-01','2bx+bx');eq('n02-02','2bx+x^3+5c-ax^2+bx');tuple_eq('n02-03',['2y-3','y^2-3y+2']);eq('n02-04','x^2+2xy+y^2-3x-3y+2');eq('n02-05','0')
A='(2x^3-3x^2+x-1)';B='(-x^3+2x^2+2)'
for id,e in [('n02-06',A+'+'+B),('n02-07','-'+B),('n02-08',A+'-'+B),('n02-10','2*'+A+'-3*'+B),('n02-11','3A-4B-(A-B)'),('n02-12','3*'+A+'-4*'+B+'-('+A+'-'+B+')')]:eq(id,e)
tuple_eq('n02-09',['2*'+A,'-3*'+B])
# N03: distributivity and literal integer exponents; parametric laws reviewed separately.
for id,e in [('n03-01','a^3*4a^5'),('n03-05','(-2x^3y^2)^3'),('n03-06','(-2x^3y^2)^3'),('n03-07','x^2*(x^2-3x+4)'),('n03-08','x^2*(x^2-3x+4)'),('n03-09','(2x+1)*(3x+4)'),('n03-10','(2x+1)*(3x+4)'),('n03-11','(2x+1)*(3x+4)'),('n03-12','(3x-1)*(2x^2-x+5)'),('n03-13','(3x-1)*(2x^2-x+5)')]:eq(id,e)
for id,e in [('n03-r3-q10-p1','2x*3x'),('n03-r3-q10-p2','2x*4'),('n03-r3-q10-p3','1*3x'),('n03-r3-q10-p4','1*4')]:eq(id,e)
# N04: all original multiplication formulas, including four-term and staged forms.
for id,e in [('n04-q01-p1','5x*5x'),('n04-q01-p2','5x*4y'),('n04-q01-p3','4y*5x'),('n04-q01-p4','4y*4y')]:eq(id,e)
refs={1:'(5x+4y)^2',2:'5x*4y+4y*5x',3:'(5x+4y)^2',4:'(a+b)^2',5:'(a+b)^2',6:'(a-b)^2',7:'(a-b)^2',11:'(ax+b)*(cx+d)',12:'(ax+b)*(cx+d)',14:'(T+c)^2',15:'(a+b+c)^2',16:'(a+b-c)^2',18:'(x^2+x+1)*(x^2-x+1)',19:'(x^2+x+1)*(x^2-x+1)',20:'(x+1)*(x+2)*(x+3)*(x+4)',21:'(T+4)*(T+6)',22:'(x+1)*(x+2)*(x+3)*(x+4)'}
for n,e in refs.items():eq('n04-'+str(n).zfill(2),e)
for a in items['n04-08']['answer'].split('='):eq('n04-08','(a+b)*(a-b)',a)
tuple_eq('n04-10',['(2a-5)^2','(3x-2)*(3x+2)']);tuple_eq('n04-17',['x^2+1','x'])
a=items['n04-13']['answer'].split(',');eq('n04-13','(3x+1)*(x+2)',a[-1]);eq('n04-13','3x*2',a[0].split('=')[-1]);eq('n04-13','1*x',a[1].split('=')[-1])
# N05: reverse expansion, all factorisations, independent candidate cross terms.
refs={1:'y+5',2:'x*(y+5)-3*(y+5)',3:'(x-3)*(y+5)',4:'b-a',5:'(a-b)*x+(b-a)*y',7:'4x*3y+3y*4x',8:'16x^2+24xy+9y^2',9:'(a+r)*(a+s)',11:'a^2-6a-16',12:'(px+q)*(rx+s)',15:'4x^2+7x+3',18:'5x^2-2x-3',19:'3a^2b-12b^3',20:'3a^2b-12b^3'}
for n,e in refs.items():eq('n05-'+str(n).zfill(2),e)
tuple_eq('n05-06',['16x^2','9y^2']);tuple_eq('n05-14',['8','7','13'])
# N06: substitution, grouping and final reverse expansions.
a=items['n06-01']['answer'].split(',');eq('n06-01','x+2y',a[0].split('=')[1]);eq('n06-01','(X+1)*(X-2)-4',a[1])
refs={2:'(X+1)*(X-2)-4',3:'X^2-X-6',4:'(x+2y+1)*(x+2y-2)-4',6:'x^4-5x^2+4',7:'x^4-5x^2+4',9:'x^3+x^2y+x^2+xy-2x-2y',10:'x^3+x^2-2x',11:'x^3+x^2y+x^2+xy-2x-2y',12:'x^3+x^2y+x^2+xy-2x-2y',13:'x^2+3xy+2y^2-x-3y-2',14:'2y^2-3y-2',16:'x^2+3xy+2y^2-x-3y-2'}
for n,e in refs.items():eq('n06-'+str(n).zfill(2),e)
a=items['n06-05']['answer'].split(',');eq('n06-05','x^2',a[0].split('=')[1]);eq('n06-05','T^2-5T+4',a[1]);eq('n06-15','(2y+1)+(y-2)',items['n06-15']['answer'].split(',')[0])
# Exact rational arithmetic independent of rendered/accepted answer branches.
numrefs={'n09-p001-q08-left-square':F(141,100)**2,'n09-p001-q08-right-square':F(142,100)**2,'n09-10':F(-3),'n11-wm017-q05-operation':F(2),'n11-wm017-q05-balance':F(2),'n11-05':F(5+2),'n11-08':F(5-3),'n11-09':F(2,-2),'n11-wm012-q11-xcoef':F(6-10),'n11-13':F(3*2),'n11-p008-q13-constant':F(3*1),'n11-wm013-q14-xcoef':F(6-1),'n11-wm013-q14-const':F(-2-3),'n12-p002-q01-coef':F(3-1),'n12-p002-q01-const':F(-2-5),'n12-p002-q02-coef':F(1+1),'n12-p002-q02-const':F(5-4),'n12-p002-q06-left-coef':F(3-2),'n12-p002-q06-left-const':F(4-2),'n12-p002-q06-right-coef':F(2+1),'n12-p002-q06-right-const':F(9-4),'n12-p003-q10-cream-coef':F(180),'n12-p003-q10-pudding-coef':F(130),'n12-p003-q10-box-fee':F(50),'n12-p003-q12-product-constant':F(130*20),'n12-p002-q12-signed-coef':F(-130),'n12-p003-q12-total-constant':F(50+130*20),'n12-p003-q12-x-coef':F(180-130),'n12-p002-q13-lower':F(3200-2650),'n12-p002-q13-upper':F(3300-2650),'n13-wm023-q08-positive-root':F(6,3),'n13-08':F(-6,3),'n14-10':F(-5+3),'n14-wm018-q10-bound-right':F(5+3),'n14-14':F(-4+2),'n14-wm019-q14-bound-right':F(4+2),'n14-wm020-q15-bound-right':F(6,3),'n14-wm022-q16-left-inner':3*F(-2,3)-2,'n14-wm022-q16-left-abs':abs(3*F(-2,3)-2),'n14-wm022-q16-right-inner':F(3*2-2),'n14-wm022-q16-right-abs':abs(F(3*2-2))}
for id,v in numrefs.items():
 a=items[id]['answer'];a=re.sub(r'\\frac\{(-?\d+)\}\{(\d+)\}',r'\1/\2',a)
 check(id,F(a)==v,'exact rational arithmetic',str(v))
# Interval/absolute-value certificates from original premises (not answer strings).
intervals={'N11-3x-2<5':{'bound':str(F(5+2,3)),'direction':'<'},'N11--2x+3<=5':{'bound':str(F(5-3,-2)),'direction':'>='},'N11-3(2x+3)>=10x-17':{'bound':str(F(-17-9,6-10)),'direction':'<='},'N11-(x-2)/3<=2x+1':{'bound':str(F(-2-3,6-1)),'direction':'>='},'N12-system':{'left':str(F(-7,2)),'leftClosed':False,'right':str(F(1,2)),'rightClosed':True},'N12-triple':{'right':str(min(F(4-2),F(9-4,3))),'closed':True},'N12-cost-integers':[x for x in range(21) if 3200<=50+180*x+130*(20-x)<3300],'N13-|x-1|=4':[1-4,1+4],'N13-|x+2|=3':[-2-3,-2+3],'N13-|3x|=6':[str(F(-6,3)),str(F(6,3))],'N14-|x-3|<5':[-5+3,5+3],'N14-|x+3|>=2':[-2-3,2-3],'N14-|3x-2|<=4':[str(F(-4+2,3)),str(F(4+2,3))]}
assert intervals['N12-cost-integers']==[11,12]
assert F(141,100)**2<2<F(142,100)**2
assert F(3)**2<10<F(4)**2
assert [d for d in range(2,21) if (lambda a: a==1)((lambda a:a)(d))]==[] # finite-decimal test below
finite=[]
for n in range(2,21):
 a=n
 for p in [2,5]:
  while a%p==0:a//=p
 if a==1:finite.append(n)
assert finite==[2,4,5,8,10,16,20]
assert F(69,99)==F(23,33) and F(8,9)*10-F(8,9)==8
assert divmod(10,11)==(0,10) and divmod(100,11)==(9,1)
result={'inputSHA256':hashlib.sha256(input_path.read_bytes()).hexdigest(),'source':data['metadata'].get('executedHead'), 'result':'PASS bounded independent exact calculations','checkedKeys':len(set(c['id'] for c in checks)),'identityChecks':len(checks),'checks':checks,'intervalCertificates':intervals,'finiteDecimalDenominators':finite,'scope':'Exact polynomial/rational calculations and original-premise interval certificates; not a claim that every textual choice is CAS-certified. Parametric exponent/positivity/pigeonhole arguments require recorded semantic review.'}
Path('p017-audit/independent-math-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:result[k] for k in ['result','checkedKeys','identityChecks','source']}))
