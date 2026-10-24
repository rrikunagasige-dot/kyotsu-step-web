"""Authored whole-solution edits. Baseline is frozen; no answers inferred by UI."""
import json,copy,pathlib
root=pathlib.Path(__file__).parent
base=json.loads((root/'BASELINE.json').read_text())
plans={}
class Edit:
 def __init__(self,key):
  self.key=key;self.old=base['math-numbers-expressions-'+key];self.f=copy.deepcopy(self.old['sections'][0]['readingFlow']);self.new=[];self.notes=[]
 def at(self,id):
  a=[i for i,b in enumerate(self.f) if b['id']==id];assert len(a)==1,(self.key,id);return a[0]
 def b(self,id):return self.f[self.at(id)]
 def p(self,id,text):return {'id':id,'type':'paragraph','parts':[{'type':'text','text':text}]}
 def m(self,id,math):return {'id':id,'type':'formula','parts':[{'type':'math','latex':math}]}
 def h(self,id,text):return {'id':id,'type':'heading','text':text}
 def text(self,id,text):self.b(id).update(parts=[{'type':'text','text':text}])
 def math(self,id,math):self.b(id).update(parts=[{'type':'math','latex':math}])
 def before(self,id,blocks):self.f[self.at(id):self.at(id)]=blocks
 def after(self,id,blocks):self.f[self.at(id)+1:self.at(id)+1]=blocks
 def drop(self,*ids):
  for id in ids:self.f.pop(self.at(id))
 def move(self,ids,before):
  blocks=[self.b(id) for id in ids];self.drop(*ids);self.before(before,blocks)
 def range(self,start,end,blocks):self.f[self.at(start):self.at(end)]=blocks
 def cluster(self,item):
  # Supporting operation's lead/formula/after + its authored worked equations.
  return [b['id'] for b in self.f if b['id'].startswith(item+'-') or b['id'].startswith(self.key+'-bridge-worked-'+item+'-')]
 def worked(self,item,latex=None):
  q=next(q for q in self.old['sections'][0]['items'] if q['id']==item)
  for b in self.f:
   if b['type'] in ['paragraph','formula']:
    b['parts']=[{'type':'math' if q['answerType']=='formula' else 'text', 'latex' if q['answerType']=='formula' else 'text':q['answer']} if p['type']=='choice' and p['itemId']==item else p for p in b['parts']]
  if latex:
   hits=[b for b in self.f if b['id'] in ['formula-'+item,self.key+'-formula-'+item.split('-')[-1],item+'-formula']]
   assert len(hits)==1,(item,[x['id'] for x in hits]);hits[0]['parts']=[{'type':'math','latex':latex}]
 def hole(self,name,stem,answer,wrong,tail='',prompt='',hint='',kind='formula'):
  id=self.key+'-s4-'+name
  self.new.append({'id':id,'label':id.upper(),'prompt':prompt,'answer':answer,'answerType':kind,'acceptedAnswers':[],'choices':[answer]+wrong,'purpose':'causal-reasoning','scaffoldLevel':'medium','hints':[hint]})
  parts=([{'type':'math','latex':stem}] if stem else [])+[{'type':'choice','itemId':id}]+([{'type':'math','latex':tail}] if tail else [])
  return {'id':id+'-formula','type':'formula' if kind=='formula' else 'paragraph','parts':parts}
 def finish(self,stages,contexts,regions):
  ids=[b['id'] for b in self.f];assert len(set(ids))==len(ids)
  active=[p['itemId'] for b in self.f for p in b.get('parts',[]) if p['type']=='choice'];assert len(active)==len(set(active)),self.key
  olditems={q['id']:q for q in self.old['sections'][0]['items']};newitems={q['id']:q for q in self.new};assert all(id in olditems or id in newitems for id in active)
  if active[0] in newitems:newitems[active[0]]['scaffoldLevel']='strong'
  retired=[id for id in olditems if id not in active]
  positions=[ids.index(x[0]) for x in stages];assert positions[0]==0 and positions==sorted(set(positions)),self.key
  # A continuous block of prose/equations is one frame; headings mark new subgoals.
  keep_sample=False;chain=0;previous=False
  for b in self.f:
   if self.key=='n01' and b['id']=='marker-degree-check':keep_sample=True
   if keep_sample:continue
   eligible=b['type'] in ['paragraph','formula','note']
   if eligible:
    if not previous or b['id'] in [x[0] for x in stages]:chain+=1
    b['derivationId']=self.key+'-s4-chain-'+str(chain)
   previous=eligible
  for anchor,refs in contexts.items():
   assert anchor in ids,(self.key,anchor)
   for ref in refs:assert ref in ids and ids.index(ref)<ids.index(anchor),(anchor,ref)
  plans[self.key]={'baselineRevision':self.old['revision'],'readingFlow':self.f,'newItems':self.new,'itemPrompts':{q['id']:next((b['parts'][0]['text'] for b in self.f if b['id']==q['id']+'-lead' and b.get('parts',[{}])[0].get('type')=='text'),q['prompt']) for q in self.old['sections'][0]['items'] if q['id'] in active},'retiredItems':retired,'stages':stages,'contexts':contexts,'auditedRegions':regions}

# N01 — accepted late example is immutable; rebuild its earlier counterpart.
e=Edit('n01')
e.text('n01-bridge-explain-n01-01-before','まず−x²y²を「数×文字×文字…」の形に戻します。前の負号を数の部分に含め、xとyがそれぞれ何回掛かっているか見えるようにします。')
e.move(['n01-bridge-explain-n01-01-after'],'n01-r3-coefficient-intro')
e.range('n01-bridge-worked-n01-04-before-0-lead','marker-variable-check',[
 e.p('n01-s4-y-goal','同じ5x³yを、今度はyについて読みます。yを一つ残し、それ以外を係数の側にまとめます。'),
 e.m('n01-s4-y-reorder','5x^3y=(5x^3)y^1'),
 e.hole('y-coefficient','\\text{yの係数}=', '5x^3',['5y','5'],prompt='yに掛かっている式を入れます。',hint='変化させる文字yを残し、それ以外を一つにまとめます。'),
 e.hole('y-degree','\\text{yについての次数}=', '1',['3','4'],prompt='yだけの個数を数えます。',hint='xの指数ではなく、yの指数を読みます。'),
 e.p('n01-s4-y-result','yについて見ると係数は5x³、次数は1です。xについて見たときと、残す文字が変わっています。')])
e.range('n01-bridge-explain-n01-05-before','heading-like-terms',[
 e.p('n01-s4-axy-goal','次はaxyに同じ方法を使います。まずxに注目します。掛け算の順序を変え、xだけを右に残します。'),
 e.hole('axy-x','axy=(', 'ay',['ax','a'],')x',prompt='xに掛かる係数の部分を入れます。',hint='aとyが、残したxに掛かっています。'),
 e.p('n01-s4-axy-switch','xの係数はayでした。今度はyだけを右に残し、同じ式を読み直します。'),
 e.hole('axy-y','axy=(', 'ax',['ay','a'],')y',prompt='yに掛かる係数の部分を入れます。',hint='今度はaとxが係数側に残ります。'),
 e.p('n01-s4-axy-conclusion','元の式は変わりません。注目する文字を変えると、その文字に掛かる係数の見方が変わります。')])
old={q['id']:q for q in e.old['sections'][0]['items']}
def oldhole(id,stem,tail=''):
 return {'id':'s4-local-'+id,'type':'formula','parts':[{'type':'math','latex':stem},{'type':'choice','itemId':id}]+([{'type':'math','latex':tail}] if tail else [])}
e.range('heading-like-terms','marker-degree-check',[
 e.h('heading-like-terms','同類項をまとめる：問題と見通し'),
 e.p('n01-s4-like-goal','3x²−5x+6−5x²+2x−3を簡単にします。二次の項、一次の項、定数項の順に、一組ずつ計算してから全体を組み立てます。'),
 e.m('formula-like-original','3x^2-5x+6-5x^2+2x-3'),
 e.p('paragraph-term-concept','引き算は負の数を足すこととして読めます。符号を含む一つ一つのまとまりを項、単項式の和を多項式といいます。文字の部分が同じ項が同類項です。項を取り出すときも前の符号を一緒に扱います。'),
 e.h('n01-s4-like-square','① 二次の項をまとめる'),
 e.p('n01-s4-like-square-target','文字の部分がx²の項を、元の式から符号ごと取り出します。'),
 oldhole('n01-06a','\\text{二次の項：}'),
 e.p('n01-s4-like-square-reason','二つの項は同じx²の何倍かを表します。係数を引き、文字の部分x²を残します。'),
 e.m('n01-s4-square-factor','3x^2-5x^2=(3-5)x^2'),oldhole('n01-r3-q07-x2coef','(3-5)x^2=(',')x^2'),
 e.m('n01-s4-square-result','\\text{二次の項：}-2x^2'),
 e.h('n01-s4-like-linear','② 一次の項をまとめる'),
 e.p('n01-s4-like-linear-target','文字の部分がxの項は−5xと+2xです。同じxを残し、係数−5と+2を足します。'),
 e.m('n01-s4-linear-factor','-5x+2x=(-5+2)x'),oldhole('n01-r3-q07-xcoef','(-5+2)x=(',')x'),
 e.m('n01-s4-linear-result','\\text{一次の項：}-3x'),
 e.h('n01-s4-like-constant','③ 定数項をまとめる'),
 e.p('n01-s4-like-constant-target','文字を含まない項は+6と−3です。この二つを計算します。'),oldhole('n01-r3-q07-const','6-3='),
 e.m('n01-s4-constant-result','\\text{定数項：}3'),
 e.h('n01-s4-like-assembly','④ 結果を戻し、式を読む'),
 e.p('n01-s4-like-assembly-text','二次の項−2x²、一次の項−3x、定数項3が求まりました。これらを次数の高い順に並べます。異なる次数の項は、これ以上まとめません。'),
 e.m('formula-n01-07','3x^2-5x+6-5x^2+2x-3=-2x^2-3x+3'),
 e.p('n01-s4-like-degree-text','多項式の次数は、整理後に残る項の次数の最大値です。いまの式で最も高い次数を読みます。'),
 e.hole('like-degree','\\text{次数}=', '2',['3','1'],prompt='整理後の最大の次数を入れます。',hint='−2x²の項が残っています。'),
 e.p('n01-s4-like-constant-read','次に、整理後の式から文字を含まない項を読みます。'),
 e.hole('like-constant','\\text{定数項}=', '3',['-3','2'],prompt='整理後の文字を含まない項を入れます。',hint='−3xは文字を含むので定数項ではありません。')])
e.finish([['heading-factors','数と文字に分けて読む'],['heading-variable','注目する文字を変える'],['marker-variable-check','別の式へ使う'],['heading-like-terms','問題と整理の見通し'],['n01-s4-like-square','二次の項をまとめる'],['n01-s4-like-linear','一次の項をまとめる'],['n01-s4-like-constant','定数項をまとめる'],['n01-s4-like-assembly','結果を戻して式を読む'],['marker-degree-check','例題と解き方の見通し'],['n01-r3-linear-heading','① 一次の項をまとめる'],['n01-r3-quadratic-heading','② 二次の項を確かめる'],['n01-r3-cubic-heading','③ 三次の項をまとめる'],['n01-r3-constant-heading','④ 定数項を確かめる'],['n01-r3-assembly-heading','⑤ 式全体をまとめる'],['n01-r3-interpret-heading','整理後の次数を読む']],{'n01-s4-like-linear':['formula-like-original'],'n01-s4-like-constant':['formula-like-original'],'n01-s4-like-assembly':['n01-s4-square-result','n01-s4-linear-result','n01-s4-constant-result'],'n01-r3-linear-heading':['formula-cancellation-original'],'n01-r3-quadratic-heading':['formula-cancellation-original'],'n01-r3-cubic-heading':['formula-cancellation-original'],'n01-r3-constant-heading':['formula-cancellation-original'],'n01-r3-interpret-heading':['n01-r3-final-equation']},['Q01','Q02','Q03-05','Q06-08','Q09-10 accepted'])

# N02 — complete each polynomial before moving to the next.
e=Edit('n02')
e.before('formula-n02-02',[e.p('n02-s4-order-map','一次の項は3bxになりました。残る項はx³、−ax²、5cです。xの個数が3個、2個、1個、0個となる順に、符号を保って並べます。')])
e.move(['n02-bridge-worked-n02-04-before-0-lead','n02-bridge-worked-n02-04-before-0-equation-0'],'n02-bridge-detail-linear-coefficient-lead')
e.before('n02-bridge-detail-linear-coefficient-formula',[e.m('n02-s4-coefficient-factors','2xy=(2y)x,\\qquad -3x=(-3)x')])
e.worked('n02-03');e.math('formula-n02-03','\\text{一次係数：}2y-3,\\qquad\\text{定数部分：}y^2-3y+2')
e.drop('n02-bridge-worked-n02-04-before-1-lead','n02-bridge-worked-n02-04-before-1-equation-0')
e.before('formula-n02-04',[e.p('n02-s4-reuse-goal','二次の項x²はそのまま残します。求めた一次係数をxの前へ戻し、xを含まない部分を最後へ置きます。'),e.hole('reuse-linear','x^2+(', '2y-3',['2y+3','2y'],' )x+(y^2-3y+2)',prompt='先ほど求めた一次係数を元の位置へ戻します。',hint='2xy−3xをまとめたときの、xに掛かる括弧を使います。')])
e.worked('n02-04')
e.before('n02-bridge-audit-sum-cube-lead',[e.m('n02-s4-sum-align','\\begin{aligned}A&=2x^3-3x^2+1x-1\\\\B&=-x^3+2x^2+0x+2\\end{aligned}')])
e.before('n02-bridge-audit-sum-cube-lead',[e.m('n02-s4-sum-regroup','A+B=(2-1)x^3+(-3+2)x^2+(1+0)x+(-1+2)')])
e.worked('n02-06');e.after('formula-n02-06',[e.p('n02-s4-sum-close','三次・二次・一次・定数の四つの結果を、A+Bの各位置へ戻しました。係数1は省略して書いています。')])
e.before('n02-bridge-audit-diff-cube-lead',[e.m('n02-s4-diff-align','A-B=A+(-B)=(2+1)x^3+(-3-2)x^2+(1+0)x+(-1-2)')])
e.worked('n02-07');e.worked('n02-08')
e.move(e.cluster('n02-bridge-detail-cube-coefficient'),'n02-bridge-twice-square-lead')
e.move(e.cluster('n02-bridge-audit-twice-linear')+e.cluster('n02-bridge-audit-twice-constant'),'n02-bridge-minus-multiplier-lead')
e.text('n02-bridge-detail-cube-coefficient-lead','分配して各項の積ができました。最初の三次項から、係数2と2の積を計算し、x³を残します。')
e.worked('n02-bridge-twice-square')
e.before('n02-bridge-minus-multiplier-lead',[e.m('n02-s4-twice-result','2A=4x^3-6x^2+2x-2'),e.h('n02-s4-minus-three-goal','次に−3Bを完成させる'),e.p('n02-s4-minus-three-text','2Aの計算は終わりました。今度はB全体に−3を掛けます。Aの計算へ戻らず、Bの三次項、二次項、定数項を順に処理します。')])
e.worked('n02-09');e.math('formula-n02-09','-3B=3x^3-6x^2-6')
e.move(e.cluster('n02-bridge-cube-sum'),'n02-bridge-like-square-lead')
e.move(['n02-bridge-worked-n02-10-assemble-0-lead','n02-bridge-worked-n02-10-assemble-0-equation-0'],'n02-bridge-constant-sum-lead')
e.before('n02-bridge-cube-sum-lead',[e.m('n02-s4-multiple-align','2A-3B=(4+3)x^3+(-6-6)x^2+(2+0)x+(-2-6)')])
e.worked('n02-10')
e.move(['n02-bridge-worked-n02-bridge-group-coefficients-after-0-lead','n02-bridge-worked-n02-bridge-group-coefficients-after-0-equation-0'],'n02-bridge-group-coefficients-formula')
e.worked('n02-bridge-group-coefficients');e.worked('n02-11');e.worked('n02-bridge-reuse')
e.text('n02-bridge-reuse-lead','ここで得た2A−3Bは、前の段階で計算済みです。その結果を使い、AとBをもう一度展開する計算を省きます。')
e.text('n02-bridge-explain-n02-09-after','−3Bの計算も終わりました。次は、完成済みの2Aと−3Bを足します。三次から定数まで一列ずつ計算します。')
e.finish([['heading-variable','注目文字と整理'],['marker-variable-check','文字式の係数を作る'],['heading-add','次数をそろえて足す'],['heading-minus','−Bを完成させる'],['paragraph-minus-add','Aに−Bを足す'],['marker-multiply-check','2Aを完成させる'],['n02-s4-minus-three-goal','−3Bを完成させる'],['paragraph-multiple-collect','二式の結果を足す'],['heading-structure','AとBのまま整理して再利用']],{'heading-minus':['formula-ab-definition'],'paragraph-minus-add':['formula-ab-definition','formula-n02-07'],'marker-multiply-check':['formula-ab-definition'],'n02-s4-minus-three-goal':['formula-ab-definition'],'paragraph-multiple-collect':['n02-s4-twice-result','formula-n02-09'],'heading-structure':['formula-n02-10']},['Q01-02','Q03-04','Q05-06','Q07-08','Q09-10','Q11-12'])

# N03 — keep sound diagrams/distribution, make local-to-global assembly explicit.
e=Edit('n03')
e.after('paragraph-powers-rules',[e.m('n03-s4-rules-summary','\\begin{array}{c|c}\\text{同じ底の積}&a^ma^n=a^{m+n}\\\\\\text{累乗の累乗}&(a^m)^n=a^{mn}\\\\\\text{積の累乗}&(ab)^n=a^nb^n\\end{array}'),e.p('n03-s4-rule-distinction','積では個数を足し、同じ組を繰り返すときは個数に組数を掛けます。括弧が何をまとめているかを見て、使う関係を区別します。')])
e.before('formula-n03-06',[e.m('n03-s4-parts-results','(-2)^3=-8,\\qquad(x^3)^3=x^9,\\qquad(y^2)^3=y^6'),e.p('n03-s4-parts-return','係数−8、xの部分x⁹、yの部分y⁶がそろいました。三つを掛けた形へ戻します。')])
e.text('n03-bridge-audit-product-fourth-lead','まずx²とx²の積です。同じ底xの積なので指数2と2を足します。')
e.text('n03-bridge-audit-product-negative-lead','次はx²と−3xです。係数−3を残し、xの指数2と1を足します。')
e.text('n03-bridge-audit-product-last-lead','最後はx²と定数4です。数4を前へ置き、x²はそのまま残します。')
e.before('n03-bridge-audit-product-negative-formula',[e.m('n03-s4-product-count','x^2(-3x)=-3x^{2+1}'),e.hole('product-exponent','\\text{xの指数}=2+1=', '3',['2','-3'],'',prompt='文字xの指数2+1を計算します。',hint='係数の−3を指数の計算へ混ぜません。')])
e.after('formula-n03-08',[e.p('n03-s4-distribute-close','三つの積は四次・三次・二次で、互いに同類項ではありません。計算結果を元の三つの位置へ戻したので、これで展開は終わりです。')])
e.text('n03-bridge-worked-n03-12-before-0-lead','前の3xと−1を、それぞれ後ろの括弧全体へ掛けます。後ろの三項を、途中で省略せず同じ形のまま保ちます。')
e.math('n03-bridge-worked-n03-12-before-0-equation-0','(3x-1)(2x^2-x+5)=3x(2x^2-x+5)+(-1)(2x^2-x+5)')
e.move(['n03-bridge-worked-n03-bridge-second-row-before-0-equation-1'],'n03-bridge-second-row-formula')
e.text('n03-bridge-worked-n03-bridge-second-row-before-0-lead','後半は−1を掛けた行です。二次項、一次項、定数項の順に計算します。まず−1を2x²へ掛けます。')
e.before('n03-bridge-worked-n03-bridge-second-row-before-0-equation-1',[e.p('n03-s4-minus-last','一次項は+xになりました。最後に、−1を定数5へ掛けます。')])
e.before('n03-bridge-collect-square-lead',[e.m('n03-s4-six-products','(6x^3-3x^2+15x)+(-2x^2+x-5)=6x^3+(-3x^2-2x^2)+(15x+x)-5')])
e.finish([['heading-indices','個数から指数法則を作る'],['marker-powers-check','係数と文字を分けて累乗する'],['heading-distribute','三つの積を順に作る'],['paragraph-two-brackets','図で四つの積を対応させる'],['marker-final-check','二項×三項の見通し'],['n03-bridge-explain-n03-13-before','3xを掛けた行を作る'],['n03-bridge-second-row-lead','−1を掛けた行を作る']],{'n03-bridge-explain-n03-13-before':['formula-n03-12'],'n03-bridge-second-row-lead':['formula-n03-12','n03-bridge-first-row-formula']},['Q01-04','Q05-06','Q07-08','Q09-11','Q12-13'])

# N04 — each concrete formula application is a complete independent problem.
e=Edit('n04')
e.before('paragraph-n04-four-products',[e.p('n04-s4-square-plan','目標は、括弧をなくして同類項をまとめた式です。まず四つの積を一つずつ求め、次に同じ文字の項だけを足し、最後に元の平方の答えへ戻します。')])
e.before('n04-lead-04',[e.p('n04-s4-general-map','具体例で二つのまとまりだった5xと4yを、一般の数aとbへ広げます。四マスのどの位置を掛けるかは変わりません。')])
e.text('n04-lead-06','差の平方(a−b)²を、同じ括弧二つの積へ戻して導きます。和の平方のときと同じ四組を作り、負号のある積を一つずつ計算します。')
e.before('n04-bridge-audit-negative-cross-sign-lead',[e.m('n04-s4-negative-first','(a-b)^2=(a-b)(a-b),\\qquad a\\cdot a=a^2')])
e.move(['n04-bridge-worked-n04-06-assemble-0-lead','n04-bridge-worked-n04-06-assemble-0-equation-0'],'n04-bridge-audit-negative-square-sign-lead')
a_sub=[copy.deepcopy(e.b(x)) for x in e.cluster('n04-bridge-formula-substitute')]
a_sq=[copy.deepcopy(e.b(x)) for x in e.cluster('n04-bridge-audit-square-2a')]
a_cross=[copy.deepcopy(e.b(x)) for x in e.cluster('n04-bridge-cross-coefficient')]
b_sq=[copy.deepcopy(e.b(x)) for x in e.cluster('n04-bridge-audit-square-3x')]
e.range('n04-lead-09','n04-lead-11',[
 e.p('n04-s4-square-problem','まず(2a−5)²を展開します。同じ括弧を二つ掛けた式であることに着目し、既に導いた公式のどれを使うか考えます。'),
 e.hole('square-rule','', '差の平方',['和と差の積','和の平方'],prompt='この式の形に対応する公式を選びます。',hint='同じ差の括弧を二つ掛けています。',kind='text'),
 e.p('n04-s4-square-map','差の平方の二つのまとまりは2aと5です。公式の各位置へ、まとまり全体を括弧ごと代入します。'),*a_sub,
 e.p('n04-s4-square-order','代入できたので、最初の平方、中央の積、最後の平方の順に計算します。まず2a全体を二乗します。'),*a_sq,*a_cross,
 e.m('n04-s4-five-square','5^2=5\\cdot5=25'),
 e.p('n04-s4-square-return','三つの結果は4a²、−20a、25です。これらを元の公式の三つの位置へ戻して、一問目を終えます。'),
 e.m('n04-s4-square-result','(2a-5)^2=4a^2-20a+25'),
 e.h('n04-s4-product-heading','次の問題：二つの括弧を調べる'),
 e.p('n04-s4-product-problem','今度は(3x−2)(3x+2)を展開します。二つの括弧は、同じ3xと2を使い、符号だけが反対です。'),
 e.hole('product-rule','', '和と差の積',['差の平方','和の平方'],prompt='この二つの括弧に対応する公式を選びます。',hint='同じ差を二つ掛ける式とは異なります。',kind='text'),
 e.p('n04-s4-product-map','和と差の積では交差項が打ち消し合います。二つのまとまり3xと2を、平方の差へ代入します。'),
 e.m('n04-s4-product-substitute','(3x-2)(3x+2)=(3x)^2-2^2'),*b_sq,
 e.m('n04-s4-two-square','2^2=2\\cdot2=4'),
 e.m('n04-s4-product-result','(3x-2)(3x+2)=9x^2-4'),
 e.p('n04-s4-application-summary','一問ずつ、式の形を見分ける→まとまりを対応させる→括弧ごと代入する→計算して戻す、という順に進めました。')])
e.before('n04-bridge-audit-concrete-cross-lead',[e.p('n04-s4-coefficient-map','一般式のa=3、b=1、c=1、d=2に当たります。一次項は交差する二組からできるので、まずその二つを求めます。')])
e.before('n04-bridge-audit-concrete-linear-lead',[e.m('n04-s4-second-cross','1\\cdot x=x')])
e.worked('n04-13');e.math('n04-formula-13','(3x+1)(x+2)=3x^2+7x+2')
e.before('n04-lead-14',[e.p('n04-s4-three-goal','次は(a+b+c)²を展開します。三項を一度に扱う代わりに、a+bを一つのまとまりTと呼び、二項の平方として計算してから元へ戻します。'),e.m('n04-s4-three-source','T=a+b,\\qquad(a+b+c)^2=(T+c)^2')])
e.move(['n04-bridge-worked-n04-17-after-0-lead','n04-bridge-worked-n04-17-after-0-equation-0','n04-bridge-worked-n04-17-after-0-equation-1'],'n04-formula-17')
e.before('n04-formula-17',[
 e.hole('shared-part','\\text{共通する部分}=', 'x^2+1',['x^2+x','x+1'],prompt='二つの括弧に同じ形で現れる部分を入れます。',hint='並べ替えた二式で、+xと−x以外を比べます。'),
 e.hole('opposite-part','\\text{符号だけが違う部分}=', 'x',['1','x^2'],prompt='片方で足し、もう片方で引いている部分を入れます。',hint='二式の最後にある+xと−xを比べます。')])
e.worked('n04-17')
e.before('n04-bridge-pairing-lead',[e.p('n04-s4-four-plan','目標は四つの因子の積を展開することです。二組を選んで共通部分を作り、Tと置いて展開し、最後にxへ戻します。ここでは三つの組み方を比較して、二組の一次係数が一致するものを選びます。')])
e.after('n04-formula-22',[e.p('n04-s4-four-close','Tを元へ戻し、残る同類項も整理できました。最初の四つの因子の積に対する答えを、元の式と結んで書きます。'),e.m('n04-s4-four-result','(x+1)(x+2)(x+3)(x+4)=x^4+10x^3+35x^2+50x+24')])
e.finish([['heading-four-products','具体的な平方と四つの積'],['n04-heading-1','和の平方を一般化する'],['n04-lead-06','差の平方を四組から導く'],['n04-lead-08','和と差の積を導く'],['n04-heading-2','一問目：平方の式を調べる'],['n04-s4-product-heading','二問目：二つの括弧を調べる'],['n04-lead-11','一般の一次式と係数'],['n04-s4-three-goal','三項の平方と復元'],['n04-heading-3','二つの括弧を比較する'],['n04-lead-20','四因子を二組に分ける'],['n04-lead-21','共通部分をTと置いて展開'],['n04-lead-22','xへ戻して元の問題を終える']],{'n04-lead-06':['n04-formula-05'],'n04-lead-08':['n04-formula-05'],'n04-heading-2':['n04-formula-07'],'n04-s4-product-heading':['n04-formula-08'],'n04-s4-three-goal':['n04-formula-05'],'n04-lead-21':['n04-formula-20'],'n04-lead-22':['n04-lead-21','n04-formula-21']},['Q01-03','Q04-05','Q06-08','Q09-10','Q11-13','Q14-16','Q17-19','Q20-22'])

# N05 — distinguish candidate generation, comparison, selection and verification.
e=Edit('n05')
e.after('n05-formula-03',[e.p('n05-s4-check-original','元の式も分配法則で展開して、いま求めた積の展開結果と比べます。'),e.m('n05-s4-check-equation','x(y+5)-3(y+5)=xy+5x-3y-15'),e.p('n05-s4-check-conclusion','両方ともxy+5x−3y−15になりました。展開後の各項が一致するので、最初の式を(x−3)(y+5)へ因数分解できたことを確かめられます。')])
e.move(['n05-bridge-worked-n05-04-after-0-lead','n05-bridge-worked-n05-04-after-0-equation-0'],'n05-formula-04');e.worked('n05-04')
e.worked('n05-06');e.math('n05-formula-06','16x^2=(4x)^2,\\qquad9y^2=(3y)^2')
e.after('n05-formula-08',[e.m('n05-s4-square-close','16x^2+24xy+9y^2=(4x)^2+2(4x)(3y)+(3y)^2=(4x+3y)^2')])
e.text('n05-lead-09','次は整数の係数を持つ二次式を、整数係数の一次式の積に戻す場合を考えます。rとsを因数の定数部分を表す数とし、候補(a+r)(a+s)を展開して、必要な条件を作ります。')
e.before('n05-formula-10',[e.hole('factor-sum','r+s=', '-6',['6','-16'],prompt='一次係数と比べ、二数の和の条件を作ります。',hint='a²−6a−16のaの係数を読みます。'),e.hole('factor-product','rs=', '-16',['16','-6'],prompt='定数項と比べ、二数の積の条件を作ります。',hint='定数項は−16です。')]);e.worked('n05-10');e.math('n05-formula-10','r+s=-6,\\qquad rs=-16')
e.before('n05-bridge-factor-sign-lead',[e.p('n05-s4-factor-enumeration','整数で積の絶対値が16になる組は、順序を入れ替えたものを除くと(1,16)、(2,8)、(4,4)です。積を負にするため、一方だけを負にします。和も負なので、絶対値が大きい側を負にする必要があります。'),e.p('n05-s4-candidate-purpose','ここでは三候補の比較表を作り、和が目標の−6になる組を選びます。一つずつ計算するのは、積の条件だけでは候補を決められないことを比べるためです。')])
e.drop(*e.cluster('n05-bridge-factor-sign'))
e.before('n05-bridge-audit-factor-pair-select-lead',[e.m('n05-s4-candidate-table','\\begin{array}{c|r|r}\\text{候補}&\\text{和}&\\text{積}\\\\\\hline(1,-16)&-15&-16\\\\(2,-8)&-6&-16\\\\(4,-4)&0&-16\\end{array}')])
e.before('n05-lead-12',[e.p('n05-s4-general-definition','次はx²の係数が1でない式です。候補を(px+q)(rx+s)と書きます。pとrは各因数のxの係数、qとsは各因数の定数部分を表す数です。')])
e.before('n05-formula-13',[
 e.hole('quadratic-condition','pr=', '4',['7','3'],prompt='x²の係数を元の式と比べます。',hint='最初どうしの積prがx²に掛かります。'),
 e.hole('constant-condition','qs=', '3',['4','7'],prompt='定数項を元の式と比べます。',hint='最後どうしの積qsは文字xを含みません。'),
 e.hole('linear-condition','ps+qr=', '7',['4','3'],prompt='二つの交差積からできる一次係数を比べます。',hint='元の式の一次項は7xです。')])
e.worked('n05-13');e.math('n05-formula-13','pr=4,\\qquad ps+qr=7,\\qquad qs=3')
e.before('n05-show-n05-f01',[e.h('n05-s4-candidate-heading','候補を作り、交差積を比べる')])
e.before('n05-lead-14',[e.p('n05-s4-candidate-generation','pr=4には1と4、2と2という正の因数の組があり、qs=3には1と3があります。定数の置き方を変えると交差積も変わるので、ここでは図の三候補を比較します。')])
e.worked('n05-14');e.math('n05-formula-14','\\begin{array}{c|r}\\text{候補}&\\text{一次係数}\\\\\\hline A&8\\\\B&7\\\\C&13\\end{array}')
e.b('n05-heading-4')['text']='条件を立て、候補を比較する'
e.text('n05-group-4','次は5x²−2x−3です。まず因数の形を決め、展開から条件を作ります。その条件へ四つの整数候補を代入し、両方を満たす組を選ぶ練習をします。')
e.before('n05-formula-16',[
 e.hole('last-linear-condition','s+5r=', '-2',['2','-3'],prompt='展開した一次係数を、元の−2xと比べます。',hint='s+5rがxの係数です。'),
 e.hole('last-constant-condition','rs=', '-3',['3','-2'],prompt='展開した定数項を、元の定数項と比べます。',hint='rsは文字xを含まない部分です。')])
e.worked('n05-16');e.math('n05-formula-16','s+5r=-2,\\qquad rs=-3')
e.before('n05-bridge-search-rs-1-lead',[e.p('n05-s4-last-candidates','整数でrs=−3となる候補は、(1,−3)、(−1,3)、(3,−1)、(−3,1)です。今回は四候補の一次係数をすべて比べ、条件に合うものを選びます。')])
e.text('n05-bridge-detail-substitute-r-after','最初の因数の定数部分にr=−1を戻したので、x−1になりました。次に二番目の因数へsを戻します。')
e.worked('n05-bridge-detail-substitute-r');e.math('n05-bridge-detail-substitute-r-formula','x+r=x+(-1)=x-1')
e.before('n05-bridge-worked-n05-19-before-0-lead',[e.p('n05-s4-common-search','まず係数3と−12を比べると、どちらも3で割れます。文字は両項とも少なくともbを一つ含みます。共通して取り出せる最大の数の因子と文字を組み合わせます。'),
 e.hole('common-factor','\\text{共通因数}=', '3b',['3b^2','3a'],prompt='二つの項に共通して掛かる因数を選びます。',hint='一項目3a²bにはbは一つしかありません。')])
e.after('n05-formula-20',[e.m('n05-s4-final-source','3a^2b-12b^3=3b(a^2-4b^2)=3b(a-2b)(a+2b)')])
e.finish([['n05-heading-1','共通因数をくくり、検算する'],['n05-lead-04','符号をそろえて共通因数を作る'],['n05-heading-2','平方の候補と中央項を比べる'],['n05-lead-09','展開から和と積の条件を作る'],['n05-heading-3','一般の係数と三条件'],['n05-s4-candidate-heading','候補を比較して積を決める'],['n05-heading-4','条件を立てる練習'],['n05-lead-18','四候補を比較して元へ戻す'],['n05-lead-19','共通因数の後も分解する']],{'n05-s4-candidate-heading':['n05-formula-13'],'n05-lead-18':['n05-formula-16']},['Q01-03','Q04-05','Q06-08','Q09-11','Q12-15','Q16-18','Q19-20'])

# N06 — goal first; discover the substitution before evaluating it.
e=Edit('n06')
e.before('n06-lead-01',[e.p('n06-s4-first-goal','(x+2y+1)(x+2y−2)−4を因数分解します。繰り返す部分にXという名前を付け、Xの二次式として因数分解してから、最後にxとyへ戻します。')])
e.before('n06-formula-01',[e.hole('substitution-part','X=', 'x+2y',['x+2y+1','x+2y-2'],prompt='二つの括弧に同じ形で現れる部分を選びます。',hint='一方に+1、もう一方に−2が残るように共通部分を取り出します。')])
e.worked('n06-01');e.math('n06-formula-01','X=x+2y,\\qquad(X+1)(X-2)-4')
e.before('n06-lead-03',[e.p('n06-s4-pair-method','前に学んだ(X+r)(X+s)=X²+(r+s)X+rsを使います。Xの係数が−1、定数が−6なので、積が−6になる整数の組から、和が−1になる組を選びます。')])
e.move(['n06-bridge-worked-n06-05-after-0-lead','n06-bridge-worked-n06-05-after-0-equation-0','n06-bridge-worked-n06-05-after-0-equation-1'],'n06-formula-05')
e.math('n06-bridge-worked-n06-05-after-0-equation-0','x^4=(x^2)^2')
e.math('n06-bridge-worked-n06-05-after-0-equation-1','x^4-5x^2+4=(x^2)^2-5(x^2)+4')
e.before('n06-formula-05',[e.hole('fourth-substitution','T=', 'x^2',['x^4','x'],prompt='二乗と一乗の形で繰り返す部分を選びます。',hint='x⁴を(x²)²と読むと、x²が一つのまとまりとして使えます。')])
e.worked('n06-05');e.math('n06-formula-05','T=x^2,\\qquad x^4-5x^2+4=T^2-5T+4')
e.text('n06-bridge-worked-n06-05-after-0-lead','まずx⁴を、ある式を二乗した形に戻します。次に元の三項を、その同じ式で読み直します。')
e.before('n06-formula-08',[
 e.hole('x-degree','\\text{xについての次数}=', '3',['2','1'],prompt='xだけに注目した最高次数を読みます。',hint='x³という項があります。yは係数側へ含めます。'),
 e.hole('y-degree','\\text{yについての次数}=', '1',['3','2'],prompt='今度はyだけに注目した最高次数を読みます。',hint='yを含む項は、どれもyが一つ掛かっています。'),
 e.p('n06-s4-variable-reason','この式ではyについて見ると一次式です。yを含む部分と含まない部分の二つに分けられるので、共通部分を探しやすくなります。'),
 e.hole('choose-variable','', 'yについて整理',['xについて整理','項をすべて別々に二乗'],prompt='二つの部分に分けるため、今回使う見方を選びます。',hint='最高次数が1だった文字に注目します。',kind='text')])
e.move(['n06-s4-variable-reason'],'n06-formula-08')
e.worked('n06-08')
e.move(['n06-bridge-worked-n06-11-after-0-lead','n06-bridge-worked-n06-11-after-0-equation-0'],'n06-formula-11')
e.before('n06-heading-4',[e.p('n06-s4-previous-close','二次の因子も分解し、元の式の全体が(x+y)(x+2)(x−1)になりました。共通因数x+yは、最後まで残して使っています。')])
e.before('n06-lead-13',[e.p('n06-s4-last-goal','x²+3xy+2y²−x−3y−2を因数分解します。まずxの二次式へ整理し、定数部分を二因子へ分け、その二因子の和が一次係数にも一致するか調べます。'),
 e.p('n06-s4-rule-definition','U,Vはxを含まない式を表す仮の名前です。yを含んでいても、xについては定数として扱えます。前に学んだ関係を、この場合にも使います。'),
 e.m('n06-s4-factor-rule','(x+U)(x+V)=x^2+(U+V)x+UV')])
e.text('n06-bridge-explain-n06-14-before','定数部分2y²−3y−2を因数分解します。候補の形を(2y+r)(y+s)と置き、展開から条件を作ります。r,sはここで決める整数です。候補を決めるのは、二条件を比べた後です。')
e.drop('n06-bridge-worked-n06-14-before-0-lead')
e.move(e.cluster('n06-bridge-constant-cross'),'n06-formula-14')
e.text('n06-bridge-constant-cross-lead','選んだr=1、s=−2を(2y+r)(y+s)へ戻すと、候補は(2y+1)(y−2)です。この実際の積の交差項でも、元の−3yへ戻ることを検算します。')
e.worked('n06-bridge-constant-cross')
e.before('n06-formula-15',[e.m('n06-s4-factor-sum','(2y+1)+(y-2)=3y-1'),e.p('n06-s4-sum-compare','定数部分の二因子の積は2y²−3y−2でした。いま求めた和3y−1を、元のxの一次係数3y−1と比べます。'),e.hole('sum-match','', '和も一次係数に一致する',['積だけ一致し、和は一致しない','和は比較しなくてよい'],prompt='二因子をxの因数へ使えるか、和の条件を確認します。',hint='定数部分の積だけでなく、xの一次係数にも一致する必要があります。',kind='text')])
e.worked('n06-15');e.math('n06-formula-15','U+V=3y-1,\\qquad UV=2y^2-3y-2')
e.before('n06-formula-16',[e.p('n06-s4-last-return','U=2y+1、V=y−2とすると、U+VとUVが元の一次係数・定数部分に両方一致します。したがって、(x+U)(x+V)のU,Vへこの二因子を入れます。')])
e.after('n06-formula-16',[e.m('n06-s4-final-source','x^2+3xy+2y^2-x-3y-2=(x+2y+1)(x+y-2)')])
e.finish([['n06-heading-1','因数分解の目標と置換'],['n06-s4-pair-method','Xで因数分解し、元へ戻す'],['n06-heading-2','四次式の繰り返しを見つける'],['n06-lead-07','残る因子も最後まで分解する'],['n06-heading-3','二つの文字の次数を比べる'],['n06-lead-09','yを含む部分と残りをまとめる'],['n06-lead-11','共通因数を使って全体を分解する'],['n06-heading-4','xの二次式として条件を作る'],['n06-lead-14','定数部分の二因子を探す'],['n06-lead-15','和も照合し、元の式へ戻す']],{'n06-s4-pair-method':['n06-formula-01','n06-formula-02'],'n06-lead-07':['n06-formula-06'],'n06-lead-09':['n06-lead-08'],'n06-lead-11':['n06-formula-09','n06-formula-10'],'n06-lead-14':['n06-formula-13','n06-s4-factor-rule'],'n06-lead-15':['n06-formula-13','n06-formula-14','n06-s4-factor-rule']},['Q01-04','Q05-07','Q08-12','Q13-16'])

# NE01 — no completed six-term row before its derivation; finish one problem at a time.
e=Edit('ne01')
e.before('ne01-problem-01',[e.p('ne01-s4-first-goal','(x+3)³を展開します。先に二因子を平方として計算し、残る一因子を分配し、同類項をまとめる順に進めます。')])
e.drop('ne01-before-02-2')
e.math('ne01-before-02-1','(x+3)(x^2+6x+9)=x(x^2+6x+9)+3(x^2+6x+9)')
e.worked('ne01-bridge-concrete-first');e.worked('ne01-bridge-concrete-second')
e.text('ne01-bridge-concrete-first-lead','まず前のxを掛けた行だけを作ります。相手のx²、6x、9の順に積を計算します。')
e.text('ne01-bridge-concrete-second-lead','xを掛けた行は完成しました。次に3を掛けた行を、同じ三項の順に作ります。')
e.worked('ne01-bridge-general-a');e.worked('ne01-bridge-general-b')
e.worked('ne01-bridge-even-sign');e.worked('ne01-bridge-odd-sign')
e.move(e.cluster('ne01-bridge-detail-quadratic-coefficient'),'ne01-bridge-linear-number-lead')
e.text('ne01-bridge-detail-quadratic-coefficient-lead','代入した式を左から見ます。先頭x³はそのままなので、次の二次項−3x²×2から計算します。')
e.text('ne01-bridge-linear-number-lead','二次項は−6x²になりました。次に一次項の係数3×2²を計算します。先に2²を求めます。')
e.drop('ne01-result-07-1')
e.drop('ne01-before-09-1','ne01-result-09-1')
e.text('ne01-lead-09','前の段階でa³+b³=(a+b)³−3ab(a+b)が得られました。三乗を積へ戻して、両項に共通するa+bを一度だけ取り出します。')
e.text('ne01-lead-11','次は3乗の差a³−b³を因数分解します。3乗の和a³+b³の因数分解でbを−bへ置き換え、両方の因子に同じ置換を行います。')
e.text('ne01-bridge-difference-substitute-lead','3乗の和の因数分解でbを−bへ置き換えます。左辺a³+(−b)³はa³−b³になるので、3乗の差の因数分解を作れます。')
e.before('ne01-bridge-difference-substitute-lead',[e.m('ne01-s4-difference-left','a^3+(-b)^3=a^3-b^3')])
first=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-factor-difference')]
root8=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-audit-cube-root-eight')]
root27=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-audit-cube-root-twentyseven')]
sub=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-factor-sum-substitute')]
a2=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-audit-cube-factor-square-a')]
ab=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-audit-cube-factor-product')]
b2=[copy.deepcopy(e.b(x)) for x in e.cluster('ne01-bridge-audit-cube-factor-square-b')]
e.f[e.at('ne01-heading-12'):]=[
 e.h('ne01-heading-12','一問目：x³−1を因数分解する'),
 e.p('ne01-s4-first-factor-goal','x³−1を因数分解します。まず二項を、それぞれ何の3乗かが分かる形に書きます。'),
 e.m('ne01-s4-first-factor-source','x^3-1=x^3-1^3'),
 e.hole('difference-rule','', '3乗の差',['差の3乗','平方の差'],prompt='x³−1³に対応する形を選びます。',hint='(x−1)³ではなく、三乗した二つの項の差です。',kind='text'),
 e.p('ne01-s4-first-factor-substitution','a³−b³の公式でa=x、b=1とします。二つの因子の両方へ代入し、1を掛ける部分と1の平方を整理します。'),
 e.m('ne01-s4-first-factor-insert','x^3-1=(x-1)(x^2+x\\cdot1+1^2)'),*first,
 e.p('ne01-s4-first-factor-close','一問目は(x−1)(x²+x+1)になりました。ここで計算を終え、次の問題へ移ります。'),
 e.h('ne01-s4-second-factor-heading','二問目：8x³+27y³を因数分解する'),
 e.p('ne01-s4-second-factor-goal','8x³+27y³を因数分解します。係数も含めて、二つの項をそれぞれ一つの式の3乗へ戻します。'),
 e.m('ne01-s4-second-factor-source','8x^3+27y^3'),*root8,*root27,
 e.m('ne01-s4-second-factor-rewrite','8x^3+27y^3=(2x)^3+(3y)^3'),
 e.hole('sum-rule','', '3乗の和',['和の3乗','3乗の差'],prompt='二つの3乗を足した形に対応する公式を選びます。',hint='括弧全体を三乗する式とは異なります。',kind='text'),
 e.p('ne01-s4-second-factor-map','今回はa=2x、b=3yです。a³+b³の公式へ、二つのまとまりを括弧ごと代入します。'),*sub,
 e.p('ne01-s4-second-factor-order','二次の因子の中を、最初の平方、中央の積、最後の平方の順に計算します。'),*a2,*ab,*b2,
 e.p('ne01-s4-second-factor-return','三つの結果4x²、6xy、9y²を、公式の二次の因子へ戻します。中央には元の公式のマイナスを残します。'),
 e.m('ne01-s4-second-factor-result','8x^3+27y^3=(2x+3y)(4x^2-6xy+9y^2)'),
 e.p('ne01-s4-final-summary','三乗の展開・因数分解も、平方の公式、分配法則、共通因数をつないで導けます。式の形を見分け、まとまりを対応させて代入し、計算結果を元の位置へ戻す順序を使いました。')]
e.finish([['ne01-heading-01','平方から具体的な三乗へ'],['ne01-lead-02','二つの行を作ってまとめる'],['ne01-heading-03','和の三乗を一般化する'],['ne01-lead-06','負の式を代入して差の三乗へ'],['ne01-heading-07','具体式を左から計算する'],['ne01-heading-08','三乗の和を積へ戻す'],['ne01-lead-11','三乗の差を因数分解する'],['ne01-heading-12','一問目：x³−1を因数分解する'],['ne01-s4-second-factor-heading','二問目：二項を三乗の形へ']],{'ne01-lead-02':['ne01-formula-01'],'ne01-lead-06':['ne01-formula-05'],'ne01-heading-07':['ne01-formula-06'],'ne01-lead-11':['ne01-formula-10'],'ne01-heading-12':['ne01-formula-11'],'ne01-s4-second-factor-heading':['ne01-formula-10']},['Q01-02','Q03-05','Q06','Q07','Q08-10','Q11','Q12-13'])


# Explicit left sides reconnect legacy answer-only formula blocks to their problem.
stems={
 'n03':{'formula-n03-06':r'(-2x^3y^2)^3=', 'formula-n03-08':r'x^2(x^2-3x+4)=','formula-n03-10':r'(2x+1)(3x+4)=','formula-n03-11':r'(2x+1)(3x+4)=','formula-n03-13':r'(3x-1)(2x^2-x+5)='},
 'n04':{'n04-formula-02':r'20xy+20xy=','n04-formula-03':r'(5x+4y)^2=','n04-formula-04':r'(a+b)^2=','n04-formula-05':r'(a+b)^2=','n04-formula-06':r'(a-b)^2=','n04-formula-07':r'(a-b)^2=','n04-formula-08':r'(a+b)(a-b)=','n04-formula-11':r'(ax+b)(cx+d)=','n04-formula-12':r'(ax+b)(cx+d)=','n04-formula-14':r'(T+c)^2=','n04-formula-15':r'(a+b+c)^2=','n04-formula-16':r'(a+b-c)^2=','n04-formula-18':r'(x^2+1+x)(x^2+1-x)=','n04-formula-19':r'(x^2+1)^2-x^2=','n04-formula-20':r'(x+1)(x+2)(x+3)(x+4)=','n04-formula-21':r'(T+4)(T+6)=','n04-formula-22':r'(x^2+5x)^2+10(x^2+5x)+24='},
 'n05':{'n05-formula-01':r'\text{共通因数}=','n05-formula-02':r'x(y+5)-3(y+5)=','n05-formula-03':r'(x-3)(y+5)=','n05-formula-04':r'b-a=','n05-formula-05':r'(a-b)x+(b-a)y=','n05-formula-07':r'2(4x)(3y)=','n05-formula-08':r'16x^2+24xy+9y^2=','n05-formula-09':r'(a+r)(a+s)=','n05-formula-11':r'a^2-6a-16=','n05-formula-12':r'(px+q)(rx+s)=','n05-formula-15':r'4x^2+7x+3=','n05-formula-18':r'5x^2-2x-3=','n05-formula-19':r'3a^2b-12b^3=','n05-formula-20':r'3b(a^2-4b^2)='},
 'n06':{'n06-formula-02':r'(X+1)(X-2)-4=','n06-formula-03':r'X^2-X-6=','n06-formula-04':r'(X-3)(X+2)=','n06-formula-06':r'x^4-5x^2+4=','n06-formula-07':r'(x^2-1)(x^2-4)=','n06-formula-09':r'x^3+x^2y+x^2+xy-2x-2y=','n06-formula-10':r'x^3+x^2-2x=','n06-formula-11':r'y(x^2+x-2)+x(x^2+x-2)=','n06-formula-12':r'x^3+x^2y+x^2+xy-2x-2y=','n06-formula-13':r'x^2+3xy+2y^2-x-3y-2=','n06-formula-14':r'2y^2-3y-2=','n06-formula-16':r'x^2+(3y-1)x+(2y^2-3y-2)='}
}
for key,mapping in stems.items():
 for id,stem in mapping.items():
  block=next(b for b in plans[key]['readingFlow'] if b['id']==id)
  if block['parts'][0]['type']=='math' and block['parts'][0]['latex']=='=':block['parts'].pop(0)
  block['parts'].insert(0,{'type':'math','latex':stem})


# Preserve every mother-document question, including questions now taught as worked
# steps. Current mappings include surviving supporting decisions and new local slots.
original_maps=json.loads((root/'ORIGINAL_SOURCE_MAPS.json').read_text())
repair_nodes=json.loads(pathlib.Path('src/data/textbook/math/numbers/firstThemeRepair.json').read_text())
new_owners={
 'n01':{'Q04':['y-coefficient','y-degree'],'Q05':['axy-x','axy-y'],'Q08':['like-degree','like-constant']},
 'n02':{'Q04':['reuse-linear']},'n03':{'Q08':['product-exponent']},
 'n04':{'Q09':['square-rule','product-rule'],'Q17':['shared-part','opposite-part']},
 'n05':{'Q10':['factor-sum','factor-product'],'Q13':['quadratic-condition','constant-condition','linear-condition'],'Q16':['last-linear-condition','last-constant-condition'],'Q19':['common-factor']},
 'n06':{'Q01':['substitution-part'],'Q05':['fourth-substitution'],'Q08':['x-degree','y-degree','choose-variable'],'Q15':['sum-match']},
 'ne01':{'Q12':['difference-rule','sum-rule']},
}
for key,plan in plans.items():
 maps=original_maps[key];owners={id:q for q,ids in maps.items() for id in ids}
 parent={node['id']:node['target'] for node in repair_nodes[key]}
 def owner(id):
  visited=set()
  while id not in owners and id in parent:
   assert id not in visited;visited.add(id);id=parent[id]
  return owners.get(id)
 for q,names in new_owners[key].items():
  for name in names:owners[key+'-s4-'+name]=key.upper()+'-'+q
 if key=='n03':
  for n in range(1,5):owners['n03-r3-q10-p'+str(n)]='N03-Q10'
 if key=='n01':
  for suffix in ['x2coef','xcoef','const']:owners['n01-r3-q07-'+suffix]='N01-Q07'
 order=[p['itemId'] for b in plan['readingFlow'] for p in b.get('parts',[]) if p['type']=='choice']
 coverage={}
 for q,original in maps.items():
  live=[id for id in order if owner(id)==q]
  blocks=[b['id'] for b in plan['readingFlow'] if any(id in b['id'] or b['id']==key+'-formula-'+id.split('-')[-1] for id in original)]
  assert live or blocks,(key,q,'missing source question')
  coverage[q]={'originalItemIds':original,'activeItemIds':live,'workedBlockIds':blocks}
 plan['sourceCoverage']=coverage

(root/'COVERAGE.json').write_text(json.dumps({k:{'regions':v['auditedRegions'],'retired':v['retiredItems'],'new':[q['id'] for q in v['newItems']],'stages':len(v['stages'])} for k,v in plans.items()},ensure_ascii=False,indent=2))
out=pathlib.Path('src/data/textbook/math/numbers/firstSectionTeaching.json')
out.write_text(json.dumps(plans,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:{'blocks':len(v['readingFlow']),'retired':len(v['retiredItems']),'new':len(v['newItems']),'regions':len(v['auditedRegions'])} for k,v in plans.items()}))
