from pathlib import Path
import json,hashlib,sys
p=Path(sys.argv[1]);x=json.loads(p.read_text());calc=json.loads(Path('p017-audit/independent-math-results.json').read_text());checked={c['id'] for c in calc['checks']}
# These are mathematical reasons applied while reading every current item and
# all 926 actually generated choices; they are not executable CAS claims.
reasons={
'01':'指定変数以外を係数へ含める。単項式の次数は指数の和、整理後の次数は残る最大次数。x³項の相殺と定数項を原式で照合。',
'02':'元のA,Bを独立に展開し、和・差・係数倍を照合。降べき順と定数部分のまとまりは値の同値性だけで採点しない。欠項0xの意味を保持。',
'03':'正整数指数の積・累乗・積の累乗は因子の個数から導く。係数は指数に足さない。全4積を残す段階と同類項整理後を区別。',
'04':'二項・三項の平方、平方差、一般二項積の係数を照合。未整理の四項と整理後の三項を区別。四因子の組分けは一次係数が共通となる条件も必要。',
'05':'共通因数、逆展開、係数比較3条件を使う。和−6/積−16、s+5r=−2/rs=−3を両方照合。符号の理由に積の条件を使う。',
'06':'X=x+2y/T=x²を元の変数へ戻す。各因子の逆展開と、xについて3次/yについて1次を照合。最後までの因数分解と途中形を区別。',
'07':'3/4=0.75、23/11=2+9/99。余り10→1の復帰から周期09。最小倍率10/100で循環部分をそろえ、8/9と23/33を得る。有限小数の既約分母の素因数は2,5のみ。自然数は正整数。',
'08':'距離は非負。a≥0で|a|=a、a<0で|a|=−a。5<9とπ>3から差の符号を決め、負の中身全体を反転。|a|²=a²は全実数で成立。',
'09':'平方根の正負2解と根号の非負1値を区別。平方比較は両辺非負で用いる。1.41²<2<1.42²。整数部分はfloorで小数部分が[0,1)、−√10の整数部分は−4。',
'10':'根号の積/商の証明は平方値と正値条件の両方が必要。b>0で商を定義。√48=4√3、√8+√50=7√2、平方差と共役因子で有理化。比を保つだけでは現在求める有理化の因子とは限らない。',
'11':'a<bでb−a>0。加法は差を維持、c正/負で積の差の符号が決まり、c=0では厳密順序を失う。負数で割ると不等号反転、等号の有無と境界代入を別途照合。',
'12':'共通部分はAND、離れた解の和集合と混同しない。上限min(2,5/3)=5/3。20個の整数条件と箱代50を保持。T=2650+50x、3200≤T<3300より11≤x<13、整数11,12、代金3200,3250。',
'13':'|ax+b|=c>0はax+b=±cの2枝、c=0は中身0、c<0は実数解なし。xと1の距離の左右別表式、各一次方程式と全解の漏れを照合。',
'14':'a>0で|X|<aは内側AND、|X|>aは外側OR。端点の開閉を元の記号から維持。|x−3|<5→−2<x<8、|x+3|≥2→x≤−5またはx≥−1、|3x−2|≤4→−2/3≤x≤2。両端の元式の絶対値はいずれも4。'
}
rows=[];all_choices=[]
for d in x['units']:
 u=d['unit'];cs={r['id']:r['choices'] for r in d['visibleChoices']}
 for section in u['sections']:
  for q in section['items']:
   assert q['answer'] in cs[q['id']]
   rows.append({'unit':d['code'],'item':q['id'],'answer':q['answer'],'choices':cs[q['id']],'method':'exact-calculation-plus-semantic-review' if q['id'] in checked else 'semantic-review-of-source-premise-and-required-form','reason':reasons[d['code']],'result':'PASS reviewed scope'})
   all_choices.extend(cs[q['id']])
assert len(rows)==290 and len(all_choices)==926
out={'source':x['metadata']['executedHead'],'runtimeExportSHA256':hashlib.sha256(p.read_bytes()).hexdigest(),'reviewedItems':len(rows),'visibleChoices':len(all_choices),'units':len(x['units']),'rows':rows,'limitations':'An assistant semantic review with exact calculation support, not an independent agent, official answer booklet or proof that every prose sentence is verbatim Word text. Original208 question prompts were read from exact Word paragraph map; authored reformulations preserve teaching purpose. Existing figure-gate and source/math regressions are tracked separately. User visual/final-app acceptance is not inferred.'}
Path('p017-audit/semantic-review-all290.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:out[k] for k in ['source','reviewedItems','visibleChoices','units']}))
