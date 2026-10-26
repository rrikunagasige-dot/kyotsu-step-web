import json,itertools,pathlib,collections
import sympy as sp
b=pathlib.Path('work/items/W-MATH-041-n08-inline-derivation-alignment');r=json.loads((b/'NODE_DESIGN.json').read_text());orig=json.load(open('src/data/textbook/math/numbers/n08Revision6.json'))
assert [n['nodeId']for n in r['nodes']]==[n['id']for n in orig['nodes']]
parents=[n for n in r['nodes']if n['parts']];assert len(parents)==30 and sum(len(n['parts'])for n in parents)==42
seen=set();partIds=[];choiceIds=[]
for n in r['nodes']:
 assert set(n['prerequisiteNodeIds'])<=seen;seen.add(n['nodeId'])
 assert n['partOrder']==[p['key']for p in n['parts']]
 for p in n['parts']:
  assert len(p['choices'])>=2 and len({c['value']for c in p['choices']})==len(p['choices']);assert next(c['value']for c in p['choices']if c['choiceId']==p['correctChoiceId'])==p['correct'];assert p['choiceOrder']==[c['choiceId']for c in p['choices']]
  partIds.append(p['id']);choiceIds += p['choiceOrder']
 known=set()
 for st in n.get('steps',[]):
  assert set(st.get('requiresCorrectParts',[]))<=known
  keys=[p['key']for p in n['parts']if '{'+p['key']+'}' in st.get('formula','')]
  keys += [p['key']for p in n['parts']if any(c.get('partKey')==p['key']for c in st.get('proseTemplate',[]))]
  known.update(keys)
assert len(set(partIds))==42 and len(set(choiceIds))==len(choiceIds)
by={n['nodeId']:n for n in r['nodes']}
def nearestParents(id):
 n=by[id]
 if n['parts']:return[n['newInteractionId']]
 return list(dict.fromkeys(x for dep in n['prerequisiteNodeIds']for x in nearestParents(dep)))
for n in r['nodes']:
 expected=list(dict.fromkeys(x for dep in n['prerequisiteNodeIds']for x in nearestParents(dep)))
 assert n['effectivePrerequisiteInteractionIds']==expected,(n['nodeId'],n['effectivePrerequisiteInteractionIds'],expected)
import hashlib
for n in r['nodes']:
 for refkey in ('sourceItemContractRef','sourceInteractionContractRef'):
  if refkey not in n:continue
  ref=n[refkey];obj=json.load(open(ref['path']))
  for key in ref['jsonPointer'].strip('/').split('/'):obj=obj[int(key)] if isinstance(obj,list) else obj[key]
  assert hashlib.sha256((json.dumps(obj,ensure_ascii=False,indent=2)+'\n').encode()).hexdigest()==ref['sha256']
  if n['status']=='KEEP_LEGACY_LOCAL_DECISION':assert n['parts'][0]['correct']==obj['answer'] and {c['value']for c in n['parts'][0]['choices']}==set(obj['choices']) and n['newInteractionId']==obj['id']
  if n['status']=='KEEP_CONSTRUCTION_MEANING':
   assert n['newInteractionId']==obj['id'] and len(n['parts'])==len(obj['parts'])
   for a,bpart in zip(n['parts'],obj['parts']):assert a['id']==bpart['id'] and a['correct']==bpart['expected'] and {c['value']for c in a['choices']}=={c['value']for c in bpart['choices']}
results=[]
for n in r['nodes']:
 if n['status']!='REVISE_MEANING_NEW_CONSTRUCTION':continue
 positive=n['nodeId']=='n08-q11-positive';negative=n['nodeId']in('n08-q11-negative','n08-q12-negative');nonnegative=n['nodeId']in('n08-02','n08-q12-nonnegative')
 a=sp.Symbol('a',positive=True)if positive else sp.Symbol('a',negative=True)if negative else sp.Symbol('a',nonnegative=True)if nonnegative else sp.Symbol('a',real=True);u=sp.Symbol('u',negative=True)
 def val(s):
  return {'a':a,'-a':-a,'0':sp.Integer(0),'1':sp.Integer(1),'-1':sp.Integer(-1),'3':sp.Integer(3),'-3':sp.Integer(-3),'a^2':a**2,'\\pi':sp.pi,'-\\pi':-sp.pi,'-\\sqrt5':-sp.sqrt(5)}[s]
 def expr(x,d):
  k=x['kind']
  if k=='rational':return sp.Rational(int(x['n']),int(x['d']))
  if k=='symbol':return {'a':a,'u':u}[x['name']]
  if k=='constant':return sp.pi
  if k=='sqrt':return sp.sqrt(expr(x['argument'],d))
  if k=='absolute':return sp.Abs(expr(x['argument'],d))
  if k=='add':return sum(expr(v,d)for v in x['args'])
  if k=='multiply':return sp.Mul(*(expr(v,d)for v in x['args']))
  if k=='power':return expr(x['base'],d)**x['exponent']
  if k=='part-key':return val(d[x['key']])
  if k=='bound-subtree-part':return expr(n['boundSourceTree']['subtreeMap'][d[x['partKey']]],d)
  if k=='unary':return (-1 if d[x['signPartKey']]=='-'else 1)*expr(x['argument'],d)
  if k=='binary':
   l,v=expr(x['left'],d),expr(x['right'],d);op=d[x['operationPartKey']];return l*v if op=='\\times'else l+v if op=='+'else l-v
  raise AssertionError(k)
 def truth(x,d):
  if x['kind']=='meaning':
   assert sp.simplify(expr(x['expression'],d)<0)==True
   return d[x['valuePartKey']]=='負'
  l,v=expr(x['left'],d),expr(x['right'],d);op=x.get('operator',d.get(x.get('operatorPartKey')))
  if op=='=':return sp.simplify(l-v)==0
  return sp.simplify(l<v if op=='<'else l>v)==True
 count=0
 for combo in itertools.product(*(p['choices']for p in n['parts'])):
  draft={p['key']:c['value']for p,c in zip(n['parts'],combo)};expected=all(draft[p['key']]==p['correct']for p in n['parts']);actual=all(truth(ast,draft)for ast in n['proposedRowAssertions']);assert expected==actual,(n['nodeId'],draft,expected,actual);count+=1
 results.append({'node':n['nodeId'],'candidateCombinations':count,'status':'PASS'})
report=dict(kind='PROPOSAL_CONSISTENCY_AND_EXACT_SYMBOLIC_CHECK',appQA=False,implementationCompleted=False,sourceSHA=r['sourceSHA'],nodes=39,parents=30,totalDecisions=42,newMeaningParents=len(results),newParentCandidateCombinations=sum(x['candidateCombinations']for x in results),checks=['source node identity/order','all original contract refs hash-bound; 16 same-meaning parents values/choices/IDs preserved','parent/part counts','unique IDs/correct-choice/order','acyclic earlier-node prerequisites','intra-parent step prerequisite order','effective parent IDs resolve all authoritative node prerequisites','all14 changed-parent finite candidate combinations: all intermediate assertions vs intended grading'],results=results,status='PASS',limitations=['not production compiler/schema/renderer validation','no new app browser test','meaning sign classification bound to exact proven source fact','old16 meaning-preserved parent checks rely on original contracts; executable production regression remains future'])
(b/'PROPOSAL_CHECK.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k not in('results','checks','limitations')},ensure_ascii=False))
