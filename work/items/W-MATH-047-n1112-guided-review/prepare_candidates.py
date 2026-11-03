"""Inactive proposal inputs only. Product files and the workflow Store are not written."""
import copy, json
from pathlib import Path
B=Path(__file__).resolve().parent; R=B.parents[2]
def write(name,data): (B/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def prose(node,parts):
    block=node['before'][0]
    block['parts']=[dict(id=f"w47-{node['id']}-lead-{i}",kind=kind,**({'text':value} if kind=='text' else {'latex':value,'mathRole':'expression','semanticRef':f"w47-{node['id']}-lead-{i}"})) for i,(kind,value) in enumerate(parts)]
for code in ['n11','n12']:
    ir=json.loads((R/f'work/items/W-MATH-036-ne02-n11-n12-guided-design/{code.upper()}_IR.json').read_text())
    original=copy.deepcopy(ir); nodes={n['id']:n for n in ir['nodes']}
    if code=='n11':
        prose(nodes['n11-03'],[('text','次は '),('math','c<0'),('text',' の場合です。'),('math','b-a>0'),('text',' なので、差 '),('math','c(b-a)'),('text',' は負の数と正の数の積です。この差の符号を判断し、「右−左」の差から左右の大小を選びます。')])
        n=nodes['n11-q11-constant']; n['before'][1]['expressions'][0]['parts'][0]['latex']='-17-9='
        n['after'][0]['relation']='equality'; n['after'][0]['expressions']=n['after'][0]['expressions'][1:]; n['after'][0]['operators']=['=']
        prose(nodes['n11-12'],[('text','右辺 '),('math',r'\frac{-26}{-4}'),('text',' は負の数どうしの商です。約分して境界を求め、直前に選んだ不等号の向きで解の範囲を表します。')])
        prose(nodes['n11-07'],[('text','境界を代入した関係は '),('math','5<5'),('text',' です。この関係が成り立つかを確かめ、境界が解に含まれるかを判断します。')])
        prose(nodes['n11-10'],[('text','境界では '),('math',r'5\le5'),('text',' という関係になりました。元の不等号に注意して、この境界が条件を満たすかを判断します。')])
        prose(nodes['n11-fraction-problem'],[('text','次の不等式 '),('math',r'\frac{x-2}{3}\le2x+1'),('text',' です。分母をなくす操作を考えます。両辺に同じ数を掛けることを使い、分母を打ち消す数を選びましょう。')])
    else:
        prose(nodes['n12-01'],[('math','-7<2x'),('text',' の両辺を正の2で割り、'),('math','x'),('text',' を左にした形で第一の条件を記録します。正の数で割るので、不等号の向きは変わりません。')])
        prose(nodes['n12-q04-left-end'],[('text','記録した二条件は '),('math','x>-7/2'),('text',' と '),('math',r'x\le1/2'),('text',' です。左端 '),('math','-7/2'),('text',' が第一の条件を満たすかを調べ、左端側の記号を選びます。')])
        nodes['n12-q04-left-end']['after'][-1]['parts']=[{'id':'w47-n12-q04-left-end-explanation','kind':'text','text':'この端点は第一の厳密な不等号を満たさないため、含みません。確定した左端の扱いを、次に共通範囲へ使います。'}]
        prose(nodes['n12-04'],[('text','左端側の記号は決まりました。右端 '),('math',r'\frac12'),('text',' が元の二条件を満たすかを確かめ、重なる範囲を一つの不等式にまとめます。')])
        nodes['n12-04']['after'].insert(1,{'id':'w47-n12-04-endpoint-explanation','kind':'paragraph','parts':[{'id':'w47-n12-04-endpoint-reason','kind':'text','text':'左端は第一の条件を満たさず、右端は両方の条件を満たすので、左端を除き右端を含む範囲になります。'}]})
        prose(nodes['n12-07'],[('text','直前に求めた二つの条件は、どちらも上限を与えます。上限の '),('math','2'),('text',' と '),('math',r'\frac53'),('text',' を比べ、両方を満たす範囲を選びます。'),('math','x=2'),('text',' を除く必要は、元の式への代入で確かめました。')])
        n=nodes['n12-q13-operation']; block=n['before'][1]; slot=copy.deepcopy(block['expressions'][0]['parts'][1])
        n['before'][1]={'id':block['id'],'kind':'paragraph','parts':[{'id':'w47-n12-q13-operation-action','kind':'text','text':'中央の定数を消すために、三辺から同じ '},slot,{'id':'w47-n12-q13-operation-action-end','kind':'text','text':' を引きます。'}]}
        eq=n['after'][0];eq['relation']='inequality';eq['operators']=[r'\le','<']
        eq['expressions']=[dict(id=f'w47-n12-q13-side-{i}',parts=[dict(id=f'w47-n12-q13-side-math-{i}',kind='math',latex=value,mathRole='expression',semanticRef=f'w47-n12-q13-side-math-{i}')])for i,value in enumerate(['3200-2650','(2650+50x)-2650','3300-2650'])]
    changed=[n['id'] for n,o in zip(ir['nodes'],original['nodes']) if n!=o]
    assert len(changed)==(6 if code=='n11' else 5)
    assert all(n.get('interaction')==o.get('interaction') for n,o in zip(ir['nodes'],original['nodes']))
    write(code.upper()+'_CANDIDATE_IR.json',ir)
    write('evidence/'+code.upper()+'_CANDIDATE_SCOPE.json',{'changedNodes':changed,'nodes':len(ir['nodes']),'interactionContractsUnchanged':True,'learnerImplementation':False})
