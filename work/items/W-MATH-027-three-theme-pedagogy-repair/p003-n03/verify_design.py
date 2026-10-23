import ast,json
from pathlib import Path
base=Path(__file__).resolve().parent;d=json.loads((base/'DESIGN.json').read_text());zero=(0,0)
def norm(p):return {k:v for k,v in p.items() if v}
def plus(a,b):
 c=dict(a)
 for k,v in b.items():c[k]=c.get(k,0)+v
 return norm(c)
def times(a,b):
 c={}
 for (i,j),v in a.items():
  for (k,l),w in b.items():c[i+k,j+l]=c.get((i+k,j+l),0)+v*w
 return norm(c)
def evaluate(text):
 def go(n):
  if isinstance(n,ast.Constant) and type(n.value) is int:return norm({zero:n.value})
  if isinstance(n,ast.Name):return {'x':{(1,0):1},'y':{(0,1):1}}[n.id]
  if isinstance(n,ast.UnaryOp) and isinstance(n.op,ast.USub):return {k:-v for k,v in go(n.operand).items()}
  if isinstance(n,ast.BinOp):
   a,b=go(n.left),go(n.right)
   if isinstance(n.op,ast.Add):return plus(a,b)
   if isinstance(n.op,ast.Sub):return plus(a,{k:-v for k,v in b.items()})
   if isinstance(n.op,ast.Mult):return times(a,b)
   if isinstance(n.op,ast.Pow):
    assert set(b)<={zero};power=b.get(zero,0);assert power>=0
    out={zero:1}
    for _ in range(power):out=times(out,a)
    return out
  raise ValueError(ast.dump(n))
 return go(ast.parse(text,mode='eval').body)
checked=[];holes=[]
for b in d['blocks']:
 for row in b['steps']:
  a,c=row.split('=');assert evaluate(a)==evaluate(c),(b['id'],row);checked.append({'block':b['id'],'equation':row,'status':'PASS'})
 for h in b['holes']:
  assert evaluate(h['expression'])==evaluate(h['answer']),h
  values=[evaluate(x) for x in [h['answer']]+h['wrong']]
  assert len({tuple(sorted(x.items())) for x in values})==len(values),h
  holes.append({'id':h['id'],'status':'PASS'})
assert d['counts']['actions_after']==17+len(d['new_ids'])==19
assert len({h['id'] for h in holes})==len(holes)
out={'status':'PASS','method':'exact bivariate integer polynomial coefficients; no numerical sampling','equations':checked,'holes':holes,'implementation':False,'limits':['図の本文との関係・読みやすさはAIによる設計判断','実画面・履歴移行・汎化・生徒の学習効果は未検証']}
(base/'MATH_CHECK.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'PASS','equalities':len(checked),'answer_sets':len(holes),'implemented':False}))
