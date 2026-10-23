"""提案に書かれた等式を、整数係数の多項式として厳密に照合する。UI/教育効果の証明ではない。"""
import ast,json
from pathlib import Path
base=Path(__file__).resolve().parent
design=json.loads((base/'DESIGN.json').read_text())
def clean(p):return {k:v for k,v in p.items() if v}
def add(a,b):
 c=dict(a)
 for k,v in b.items():c[k]=c.get(k,0)+v
 return clean(c)
def neg(a):return {k:-v for k,v in a.items()}
def mul(a,b):
 c={}
 for i,x in a.items():
  for j,y in b.items():c[i+j]=c.get(i+j,0)+x*y
 return clean(c)
env={'x':{1:1}}
def calc(expr):
 def go(n):
  if isinstance(n,ast.Constant) and type(n.value) is int:return clean({0:n.value})
  if isinstance(n,ast.Name):return env[n.id]
  if isinstance(n,ast.UnaryOp) and isinstance(n.op,ast.USub):return neg(go(n.operand))
  if isinstance(n,ast.BinOp):
   a,b=go(n.left),go(n.right)
   if isinstance(n.op,ast.Add):return add(a,b)
   if isinstance(n.op,ast.Sub):return add(a,neg(b))
   if isinstance(n.op,ast.Mult):return mul(a,b)
   if isinstance(n.op,ast.Pow):
    assert set(b)<={0} and b.get(0,0)>=0
    p={0:1}
    for _ in range(b.get(0,0)):p=mul(p,a)
    return p
  raise ValueError(ast.dump(n))
 return go(ast.parse(expr,mode='eval').body)
env['A']=calc(design['givens']['A']);env['B']=calc(design['givens']['B'])
equations=[];holes=[]
for b in design['blocks']:
 last_by_left={}
 for text in b['steps']:
  lhs,rhs=text.split('=');a,c=calc(lhs),calc(rhs);assert a==c,(b['id'],text,a,c)
  if lhs in last_by_left:assert c==last_by_left[lhs],(b['id'],'chain mismatch')
  last_by_left[lhs]=c;equations.append({'block':b['id'],'equation':text,'status':'PASS'})
 for h in b['holes']:
  if h['expression'] is None:
   assert h['answer']=='+' and h['wrong']==['-'];assert calc('-(A-B)')==calc('-A+B');assert calc('-(A-B)')!=calc('-A-B')
  else:
   expected=calc(h['expression']);assert calc(h['answer'])==expected,h
   options=[calc(x) for x in [h['answer']]+h['wrong']]
   assert len({tuple(sorted(x.items())) for x in options})==len(options),h
  holes.append({'id':h['id'],'status':'PASS','wrong_choices':len(h['wrong'])})
assert len(holes)==10 and len({x['id'] for x in holes})==10
assert design['actions_after']==5+len(holes)==15
assert design['chapter_actions_after']==315-12+15==318
assert sum(design['topic_counts_after'])==318
new={x['id'] for x in holes}-{'n02-'+str(i).zfill(2) for i in range(1,13)}
assert new==set(design['new_item_ids'])
result={'status':'PASS','method':'exact integer polynomial coefficients, no numerical sampling','candidate_is_design_only':True,'source_sha':design['baseline_sha'],'equations':equations,'holes':holes,'counts':{'original_source_questions':12,'actions_before':12,'actions_after':15,'chapter_actions_after':318},'not_proven':['実画面・実装・履歴移行は未実施','文章の読みやすさ・学習効果はコード検算から断定しない']}
(base/'MATH_CHECK.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'PASS','exact_equations':len(equations),'hole_answer_sets':len(holes),'implementation':False}))
