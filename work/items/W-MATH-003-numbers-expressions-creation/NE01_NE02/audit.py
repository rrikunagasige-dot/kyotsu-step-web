from pathlib import Path
from fractions import Fraction as F
import json,hashlib,sys
from zipfile import ZipFile
from lxml import etree as E
items=json.loads((Path(__file__).parent / 'items.json').read_text())
items[18]['lead']='交差項の係数をそろえて比べられるよう、4√5を係数2と一つの根号の積へ直す。和と積を別々の条件にする。'
(Path(__file__).parent / 'items.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
class P:
 def __init__(self,d):self.d={k:F(v) for k,v in (d if isinstance(d,dict) else {(0,0):d}).items() if v}
 def __add__(self,o):
  o=o if isinstance(o,P) else P(o);d=dict(self.d)
  for k,v in o.d.items():d[k]=d.get(k,F(0))+v
  return P(d)
 __radd__=__add__
 def __neg__(self):return P({k:-v for k,v in self.d.items()})
 def __sub__(self,o):return self+-o if isinstance(o,P) else self+(-o)
 def __rsub__(self,o):return -self+o
 def __mul__(self,o):
  o=o if isinstance(o,P) else P(o);d={}
  for k,v in self.d.items():
   for l,w in o.d.items():
    z=tuple(a+b for a,b in zip(k,l));d[z]=d.get(z,F(0))+v*w
  return P(d)
 __rmul__=__mul__
 def __pow__(self,n):
  r=P(1)
  for _ in range(n):r=r*self
  return r
 def __eq__(self,o):return self.d==(o.d if isinstance(o,P) else P(o).d)
a=x=P({(1,0):1});b=y=P({(0,1):1})
checks=[]
def eq(id,l,r):
 assert l==r,id;checks.append({'id':id,'result':'PASS'})
forms=[('(x+3)*(x*x+6*x+9)','(x+3)**3'),('x**3+9*x*x+27*x+27','(x+3)**3'),('(a+b)*(a*a+2*a*b+b*b)','(a+b)**3'),('a**3+2*a*a*b+a*b*b+a*a*b+2*a*b*b+b**3','(a+b)**3'),('a**3+3*a*a*b+3*a*b*b+b**3','(a+b)**3'),('a**3-3*a*a*b+3*a*b*b-b**3','(a-b)**3'),('x**3-6*x*x+12*x-8','(x-2)**3'),('3*a*b*(a+b)','3*a*a*b+3*a*b*b'),('(a+b)*((a+b)**2-3*a*b)','a**3+b**3'),('(a+b)*(a*a-a*b+b*b)','a**3+b**3'),('(a-b)*(a*a+a*b+b*b)','a**3-b**3'),('(2*x)**3+(3*y)**3','8*x**3+27*y**3'),('(2*x+3*y)*(4*x*x-6*x*y+9*y*y)','8*x**3+27*y**3')]
for i,(l,r) in enumerate(forms,1):eq('ne01-%02d'%i,eval(l),eval(r))
eq('ne01-12-first-cube',x**3-1**3,x**3-1)
eq('ne01-13-first-factor',(x-1)*(x*x+x+1),x**3-1)
# Reuse only the exact rational radical arithmetic definitions; do not execute the prior audit's runtime input/output.
s=(Path(__file__).parent / 'audit_radical_support.py').read_text()
s='\n'.join(t for t in s.splitlines() if not t.startswith('x=json.loads('))
ns={};exec(s,ns);v=ns['value'];times=ns['times']
for id,left,right in [
 ('ne02-04-square',r'(\sqrt2+\sqrt3)^2',r'5+2\sqrt6'),
 ('ne02-06-coefficient',r'4\sqrt5',r'2\sqrt{20}'),
 ('ne02-07-square-plus',r'(\sqrt5-2)^2',r'9-4\sqrt5'),
 ('ne02-07-square-minus',r'(2-\sqrt5)^2',r'9-4\sqrt5'),
 ('ne02-09-radicand',r'\frac{6+2\sqrt5}{2}',r'3+\sqrt5'),
 ('ne02-11-numerator',r'(\sqrt5+1)^2',r'6+2\sqrt5'),
 ('ne02-12-rationalization',r'\frac{\sqrt5+1}{\sqrt2}',r'\frac{\sqrt{10}+\sqrt2}{2}'),
 ('ne02-12-square',r'(\frac{\sqrt{10}+\sqrt2}{2})^2',r'3+\sqrt5')]:eq(id,v(left),v(right))
for tag,pair,sm,prod in [('ne02-03',(2,3),5,6),('ne02-07',(5,4),9,20),('ne02-11',(5,1),6,5)]:
 eq(tag+'-sum',sum(pair),sm);eq(tag+'-product',pair[0]*pair[1],prod)
# Exact signs: sqrt(5)>2 because both are positive and 5>4; all sums have positive terms.
assert 5>2**2;checks.append({'id':'ne02-08-principal-root-sign','result':'PASS','proof':'sqrt(5) and 2 positive; 5>4 implies sqrt(5)>2'})
p=Path(sys.argv[1])
r=E.fromstring(ZipFile(p).read('word/document.xml'));wn='http://schemas.openxmlformats.org/wordprocessingml/2006/main';mn='http://schemas.openxmlformats.org/officeDocument/2006/math';nsx={'w':wn,'m':mn};ps=r.find('w:body',nsx).findall('w:p',nsx)
def cv(n):
 t=E.QName(n).localname
 def c(k):
  z=n.find('m:'+k,nsx);return cv(z) if z is not None else ''
 if t.endswith('Pr'):return ''
 if t=='t':return n.text or ''
 if t=='sSup':return '{'+c('e')+'}^{'+c('sup')+'}'
 if t=='sSub':return '{'+c('e')+'}_{'+c('sub')+'}'
 if t=='f':return r'\frac{'+c('num')+'}{'+c('den')+'}'
 if t=='rad':return r'\sqrt{'+c('e')+'}'
 if t=='d':return '('+c('e')+')'
 return ''.join(cv(z) for z in n)
source=[{'paragraph':i,'text':cv(p),'omml':len(p.findall('.//m:oMath',nsx))} for i,p in enumerate(ps) if i>=618]
(Path(__file__).parent / 'source.json').write_text(json.dumps({'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'paragraphs':source},ensure_ascii=False,indent=2)+'\n')
for item in items:
 expected=int(item['id'][-2:]);text=cv(ps[item['sourceParagraph']]);assert text.startswith('【'+str(expected)+'】'),item
assert len(set(q['id'] for q in items))==25
result={'status':'DESIGN-MATH-CHECKED / APP-NOT-IMPLEMENTED','sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sourceQuestions':25,'sourceMathObjects':sum(q['omml'] for q in source),'sourceFigures':0,'exactChecks':checks,'exactCheckCount':len(checks),'designRows':len(items),'authoredDistractors':50,'semanticReview':'All 25 completions and 50 distractors reviewed by this assistant; not an independent reviewer. Exact checks above validate the listed identities, conditions and signs, not a full general TeX parser.','appRendering':'UNVERIFIED: design only','userAcceptance':'PENDING'}
(Path(__file__).parent / 'audit-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:result[k] for k in ['sourceQuestions','sourceMathObjects','sourceFigures','exactCheckCount','designRows','authoredDistractors']}))
