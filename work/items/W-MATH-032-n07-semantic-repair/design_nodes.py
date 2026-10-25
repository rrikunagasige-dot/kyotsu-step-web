"""Proposed semantic spans and per-node designs, not app implementation."""
import json,re
from pathlib import Path
BASE=Path(__file__).resolve().parent;ROOT=BASE.parents[2]
p=json.loads((ROOT/'src/data/textbook/math/numbers/n07Authored.json').read_text())
aliases={'p/(2^u5^v)':r'\frac{p}{2^u5^v}','2^(h−u)5^(h−v)':r'2^{h-u}5^{h-v}','2^h5^h=10^h':r'2^h5^h=10^h','0.75=75/100':r'0.75=\frac{75}{100}','5×2^r':r'5\times2^r','h−u,h−v':r'h-u,\ h-v','10−1=9':'10-1=9','100−1=99':'100-1=99','r=0,1,2':'r=0,1,2','r=3':'r=3','n≠0':r'n\ne0','33≠0':r'33\ne0','2≤a≤20':r'2\le a\le20','m,n':'m,n','u,v':'u,v','a=2':'a=2','b=3':'b=3','a−b':'a-b','a/b':r'\frac{a}{b}','m/n':r'\frac{m}{n}','10^k':'10^k','h−u':'h-u','h−v':'h-v','n−1':'n-1','√2':r'\sqrt{2}','π':r'\pi','9x':'9x','99x':'99x','1x':'1x','2−3':'2-3','−1':'-1','2×5':r'2\times5'}
# Only explicit mathematical forms or declared symbols; never blanket-convert all numerals.
patterns=[re.escape(s) for s in sorted(aliases,key=len,reverse=True)]+[r'\d+/\d+',r'\d+\.\d+(?:…)?',r'(?<![A-Za-z])[xmnkuvpharb](?![A-Za-z])']
pat=re.compile('|'.join(patterns))
terms={'n07-q04-definitions':[('有理数','有理数と'),('有限小数','有限小数、'),('無限小数','無限小数と'),('循環小数','循環小数です')], 'n07-q11-factor-ten':[('素数','素数は'),('素因数分解','素因数分解とは')], 'n07-q13-difference':[('自然数','自然数は')], 'n07-q14-real-definition':[('無理数','無理数といい'),('実数','実数と呼び')]} 
def parts(s,nid,field):
 marks=[]
 for term,anchor in terms.get(nid,[]) if field=='before' else []:
  start=s.index(anchor);marks.append((start,start+len(term),{'kind':'term','text':term,'usage':'first_definition','termId':nid+'-'+term}))
 for m in pat.finditer(s):
  if any(m.start()<b and m.end()>a for a,b,_ in marks):continue
  raw=m.group();latex=aliases.get(raw)
  if latex is None:
   if '/' in raw:a,b=raw.split('/');latex='\\frac{'+a+'}{'+b+'}'
   else:latex=raw.replace('…',r'\ldots')
  marks.append((m.start(),m.end(),{'kind':'math','latex':latex}))
 marks.sort();out=[];i=0
 for a,b,value in marks:
  if a>i:out.append({'kind':'text','text':s[i:a],'sourceText':s[i:a]})
  out.append(dict(value,sourceText=s[a:b]));i=b
 if i<len(s):out.append({'kind':'text','text':s[i:],'sourceText':s[i:]})
 assert ''.join(v['sourceText'] for v in out)==s
 for i,v in enumerate(out):v['id']=f'{nid}-{field}-{i:03}'
 return out
special={
'n07-q03-cycle':('文脈復元','Q02の問題23÷11、整数部分2・開始余り1、確定済みの商/余り表2行を回答前に表示する。周期の結論は回答後まで表示しない。','数値列の予測（既存値を維持）','Q02の既知数値と繰返しの判断を分ける。'),
'n07-q06-scale':('倍率・原条件','原文p315にある10,100,1000,…という正の10の累乗と、最小を探す条件を回答前へ戻す。倍率を文中の穴として表示し、孤立したoutputLatex=10を出さない。','両辺を［10］倍して、小数部分をそろえます。','100/1000倍も整列するが最小でない、と誤答理由を記す。'),
'n07-q09-scale':('倍率・定義域','Q06で使った10,100,1000,…の範囲を明示してから、69の周期に合う最小倍率を選ぶ。孤立した100は出さない。','両辺を［100］倍して、小数部分をそろえます。','1倍を許す曖昧な「最小」にはしない。'),
'n07-q07-subtract':('操作を文へ','上下の二式を保持。上の式から元の式を［引く］ことで、同じ小数部分を消します。と一文へ穴を埋める。','上の式から元の式を［引く］ことで、同じ小数部分を消します。','引く向きと二式の参照を保持。単語だけの正答行を作らない。'),
'n07-q09-subtract':('操作を文へ','100xの式と元のxの式を示し、上の式から元の式を［引く］ことで、同じ小数部分を消します。とつなぐ。','上の式から元の式を［引く］ことで、同じ小数部分を消します。','Q07と同じ意味型・表示契約で処理。'),
'n07-q07-coefficient':('等式の接続',r'(10-1)x=［9］x の一つのequality groupへ。入力と正答を独立した式番号に分けない。',r'(10-1)x=［9］x','左辺の計算として表示し、右辺を求めたことにはしない。'),
'n07-q09-coefficient':('等式の接続',r'(100-1)x=［99］x の一つのequality groupへ。',r'(100-1)x=［99］x','Q07と共通のrelationChain contract。'),
'n07-q02-remainder-0':('裸の数値回答',r'10-11×0=［10］という計算の穴へ統合。余り10の孤立行を作らない。',r'10-11\times0=［10］','被除数・商・余りの順を維持。'),
'n07-q02-remainder-1':('裸の数値回答',r'100-11×9=［1］という計算の穴へ統合。確定後の表は同じsource resultへ結ぶ。',r'100-11\times9=［1］','Q03の参照には、このnodeの確定した表だけを選択して渡す。'),
'n07-q12-include-five':('上限の意味','条件を満たす最大のrは［2］です。という文章の穴にする。rの定義・範囲・5を二つ含むと25以上という既存説明を保持。','条件を満たす最大のrは［2］です。','新しいr_maxという記号は導入しない。'),
'n07-q10-reduce':('約分の接続',r'x=\frac{69}{99}=［\frac{23}{33}］の一つの変形groupへ。単独の23/33を再出力しない。',r'x=\frac{69}{99}=［\frac{23}{33}］','既約条件と旧item ID n07-10を保持。Q14には元の循環小数も付けて復元。'),
'n07-q11-converse':('証明・組版','p/(2^u5^v)、指数差、補う因数、分母10^hをすべてmath partsへ。既存の文章を条件→hの選択→因数を補う→分母が10^h→結論の順で式の間へ配置する。','穴なし（既存の証明を保持）','h=max(u,v)の意味と指数差が非負であることを式より先に示す。余分な新設問は作らない。'),
'n07-q14-reuse':('明示的再利用','Q09/10の元問題0.696969…と、確定した23/33を同時に参照。Q06のxとの混同を避ける。','分類の理由（既存値を維持）','原問題scopeを付け、未来の結果や別のxを流用しない。')}
rows=[]
for n in p['nodes']:
 q=n.get('interaction');b=n['before'];a=n['after']
 if n['id']=='n07-q06-scale':b='この数をxと置きます。両辺を10、100、1000、…倍した形を比べます。このうち、小数部分が元と同じ並びになる最小の倍率を選びます。'
 if n['id']=='n07-q09-scale':b='前の例と比べて、繰り返す部分の桁数を確認します。両辺を10、100、1000、…倍した形のうち、小数部分が元と同じになる最小の倍率を選びます。'
 kind,design,slot,guard=special.get(n['id'],('意味属性の保持','本文の数学区間を下の明示partsに置換し、既存の計算・説明・穴・順序を保持する。','既存の穴を保持' if q else '穴なし（定義/性質/まとめを保持）','誤答選択肢・前結果・履歴にも同じsource partsを使う。'))
 if n['id'] in terms:design+=' 定義語のfirst_definition位置だけを黒字太字にする。'
 row={'id':n['id'],'sourceQuestion':n['problemId'],'role':n['role'],'stageId':n['stageId'],'sourceRefs':n['sourceRefs'],'changeKind':kind,'design':design,'answerPresentation':slot,'guard':guard,'beforeParts':parts(b,n['id'],'before'),'afterParts':parts(a,n['id'],'after'),'interaction':q,'inputLatex':n['inputLatex'],'originalOutputLatex':n['outputLatex'],'knownRefs':n['knownRefs'],'table':n.get('table'),'choiceDisplayParts':{choice:parts(choice,n['id'],'choice-'+str(i)) for i,choice in enumerate(q['choices'])} if q and q['answerType']=='text' else {},'hintDisplayParts':[parts(t,n['id'],'hint-'+str(i)) for i,t in enumerate(q['hints'])] if q else [],'distractorDisplayParts':{c:parts(t,n['id'],'feedback-'+str(i)) for i,(c,t) in enumerate(q.get('distractorReasons',{}).items())} if q else {}}
 if n['id'] in ('n07-q06-scale','n07-q09-scale'):
  row['taskDomain']={'kind':'positive-powers-of-ten','minimumExponent':1,'criterion':'smallest multiplier whose fractional digits align','displayIn':['prose','choice-panel']}
 rows.append(row)
(BASE/'NODE_DESIGN.json').write_text(json.dumps({'status':'PROPOSED','appliedToApp':False,'sourceSHA':'4fb7a98e7f864839ccc1374080473df4ba60ce88','nodes':rows},ensure_ascii=False,indent=2)+'\n')
lines=['# N07 全41ノードの具体設計','', 'Status: PROPOSED。アプリへ未適用。［ ］は既存の穴。正答は設計者確認用で、未回答画面には出さない。','']
for i,r in enumerate(rows,1):
 lines += [f'## {i:02} / {r["id"]}', '', f'原問: {r["sourceQuestion"]} / role: {r["role"]} / source: '+', '.join(r['sourceRefs']), '', '**変更**: '+r['design'],'','**穴の置き方**: '+r['answerPresentation'],'','**本文（前）**: '+''.join(('$'+x['latex']+'$') if x['kind']=='math' else '**'+x['text']+'**' if x['kind']=='term' else x['text'] for x in r['beforeParts']),'','**本文（後・正答後）**: '+''.join(('$'+x['latex']+'$') if x['kind']=='math' else x.get('text','') for x in r['afterParts']),'','**参照**: '+(', '.join(r['knownRefs']) or 'なし。必要な条件は同じ例題scopeの問題見出しへ。'),'','**検査**: '+r['guard'],'']
 if r['interaction']:lines += ['既存item: `'+r['interaction']['id']+'`。正答・選択肢・答えの型は保持。','']
(BASE/'NODE_DESIGN.md').write_text('\n'.join(lines)+'\n')
assert len(rows)==41 and sum(bool(r['interaction']) for r in rows)==36
print(json.dumps({'nodes':len(rows),'items':sum(bool(r['interaction']) for r in rows),'semanticParts':sum(len(r[k]) for r in rows for k in ('beforeParts','afterParts')),'firstDefinitionTerms':sum(v['kind']=='term' for r in rows for v in r['beforeParts'])}))
