from pathlib import Path
import json,hashlib,copy
S=Path('/workspace/scratch/6ff917b2ec4a/w046-ux05-release-frozen');O=Path('/tmp/w046-r04');O.mkdir(exist_ok=True)
source='691d3d160493bf684ca8a31a22476d31d98caeec';allnodes={}
for u in ['n09','n10']:
 c=json.loads((S/f'src/data/textbook/math/numbers/{u}ConstructionCompiled.json').read_text());allnodes.update({n['nodeId']:n for n in c['nodeDesign']})
blocks=[]
def part(key,expected,wrong,prompt,action,keep=None):
 return {'key':key,'expected':expected,'kind':'math','prompt':prompt,'learningAction':action,'choices':[{'value':expected,'feedback':'この式の関係を確定し、続く導出へ使います。'}]+[{'value':v,'feedback':f}for v,f in wrong],'identityPolicy':{'action':'KEEP_EXACT_GRADING_CONTRACT' if keep else 'NEW','oldPartId':keep,'newId':None if keep else key}}
def row(text,keys=[],intro='',kind='math'):
 return {'kind':kind,'template':text,'partKeys':keys,'intro':intro}
def block(id,goal,lead,solution,parts,rows,after,refs,reason):
 n=allnodes[id];prior=[]
 for i,r in enumerate(rows):
  r['id']=f'{id}::ux06-proposal-row-{i+1:02}';r['requiresCorrectKeys']=prior.copy();r['mathGroupId']=id+'-ux06-derivation' if r['kind']=='math' else None
  for k in r['partKeys']:
   if k not in prior:prior.append(k)
 for p in parts:
  p['partId']=p['identityPolicy']['oldPartId'] or id+'::'+p['key']
  if p['identityPolicy']['oldPartId']:
   old=next(x for x in n['parts'] if x['id']==p['identityPolicy']['oldPartId']);p['oldContract']=copy.deepcopy(old);p['prompt']=old['prompt'];p['learningAction']=old['learningAction'];p['kind']=old['kind'];p['choices']=copy.deepcopy(old['choices'])
   assert p['expected']==old['expected']
 kept=[p['partId'] for p in parts if p['identityPolicy']['oldPartId']];retired=[p['id']for p in n['parts']if p['id']not in kept]
 b={'nodeId':id,'sourceStage':n['stageId'],'goal':goal,'rootPrincipleRefs':['MASTER §§7–12/20/45/52/53','latest user: formula-embedded letters/numbers/symbols'],'availableBefore':refs,'lead':lead,'unblankedDerivation':solution,'parts':parts,'visibleSequence':rows,'afterVisibleText':after,'upstreamResultRefs':n['requiredResultRefs'],'onEntry':'既存stageの原問題と認定済み参照、lead、条件（in-context指定以外）、最初の行を表示。未来の行/introはrequiresCorrectKeys正答後に解放。introとafterVisibleTextは実text rowへ変換し、metadataだけに置かない。正答した行は通常の数式として同じ導出に残す。','wrongGate':'誤答は当該穴のまま。次段/未来intro/正答後本文/terminalを解放しない。採点rationaleを公開本文に流用しない。','completion':'全parts正答後のみ結果を認定。afterVisibleTextはterminal metadataではなく実際に描画されるtext rowへ置く。','keepPartIds':kept,'retirePartIds':retired,'why':reason,'visual':'既存共通ページで連続導出として表示。式内部のslotは因子/項/指数/符号の構文位置を保持。選択肢は現在の行の直後。長式は等号等の意味境界で改行し、根号/分数/括弧の中を分断しない。','reviewStatus':'DRAFT_NEEDS_NONAUTHOR_REVIEW'}
 blocks.append(b);return b
b=block('n09-q01-negative','負号を含む基底を二因子として構成し、候補の平方を確かめる。','正の候補に続いて、負の候補も調べます。2乗する対象が括弧のどこまでかに注意しましょう。',[r'(-4)^2=(-4)(-4)=16'],[
 part('ux06RepeatedBase',r'-4',[(r'4','括弧の中の負号も基底に含まれます。'),(r'-8','2乗は2倍ではありません。')],'同じ基底をもう一度掛ける形にします。','指数の作用対象を積の因子として構成'),
 part('value','16',[],'負の候補を2回掛けた値を計算します。','候補の平方を計算', 'n09-q01-negative::value')],
 [row(r'(-4)^2=(-4)\times({ux06RepeatedBase})',['ux06RepeatedBase']),row(r'={value}',['value'],'二つの因子を掛け、平方の値を確かめます。')],
 '4と−4が候補であることは確かめられました。次は、ほかに解がないことまで示します。',['直前n09-q01-positiveの4²=16','実数の積・平方の定義'],'text選択powerActionを式内の基底構成へ置換する。16の既存計算契約は保持し、すべての実数解を示す次nodeの因数分解/零条件は変えない。')
b=block('n09-q02-negative-square','負号を含む平方を積へ戻し、符号と根号の平方を区別する。','先ほどの負の数と同じように、今度は根号を含む数を2乗します。括弧内全体を二つの因子に戻しましょう。',[r'(-\sqrt5)^2=(-\sqrt5)(-\sqrt5)=(-1)(-1)(\sqrt5)(\sqrt5)=1(\sqrt5)^2=5'],[
 part('ux06RootBase',r'-\sqrt5',[(r'\sqrt5','負号は括弧の中にあります。'),(r'-5','基底は5ではなく根号を含む数です。')],'二つ目の因子を入れます。','負号と根号を含む基底の構成'),
 part('ux06SignProduct','1',[('-1','負と負の積の符号を確かめます。'),('2','二つの因子の積を計算します。和ではありません。')],'負号の部分を掛けた結果を入れます。','符号の積を平方の外側の因子へ反映'),
 part('signedRootSquareUX05','5',[],'負号を含む括弧全体の平方(−√5)²を求めます。','根号の平方の定義を具体的に適用','n09-q02-negative-square::signedRootSquareUX05')],
 [row(r'(-\sqrt5)^2=(-\sqrt5)({ux06RootBase})',['ux06RootBase']),row(r'=(-1)(-1)(\sqrt5)(\sqrt5)',intro='掛ける順を入れ替え、符号の部分と根号の部分をまとめます。'),row(r'={ux06SignProduct}(\sqrt5)^2',['ux06SignProduct']),row(r'={signedRootSquareUX05}',['signedRootSquareUX05'],'根号の定義を、残った平方へ適用します。')],
 '負号も含めて同じ数を2回掛けたので、結果は正になりました。√16の値と、この平方の値を区別して記録します。',['n09-q01-negativeの負数の平方','根号の定義 (√a)²=a, a≥0'],'完成結果回答後のAUTO解法を先行する構成行へ移す。(uv)²公式の無根拠な既習前提を外す。既存5の採点契約を保持し、新しい前提なしで旧完了を流用しない。')
b['assumptionsDisplayOverride']='in-context';b['assumptionPolicy']='既存assumptions/assumptionPartsを保持する。問題目標はstage.sourceQuestionPartsに一度表示、各nodeの同文反復だけをin-contextで抑制。';b['noLeakNote']='根号定義を見える参照として出すことは可。具体的な最終5を独立した未来行として先出ししない。行のintroは行の解放時だけ表示。'
b=block('n09-q04-negative','非負性と同じ平方を確かめて、√(a²)の値を同定する。','次はa<0の場合です。根号は非負の値を表すので、符号を反対にした−aが条件に合うか、符号と平方の両方を調べます。',[r'a<0\Rightarrow-a>0',r'(-a)^2=(-a)(-a)=a^2',r'\sqrt{a^2}=-a'],[
 part('ux06CandidateSign','>',[('<','a<0の両辺に−1を掛けると不等号の向きが変わります。'),('=','aは0ではありません。')],'候補−aの符号を入れます。','非負性の条件を具体的に確かめる'),
 part('ux06CandidateSquare',r'a^2',[(r'-a^2','負号も二つの因子の中にあります。'),(r'2a','平方は2倍ではありません。')],'候補−aを2回掛けた平方を入れます。','平方が元のa²へ戻ることを構成'),
 part('value','-a',[],'負のaの平方について、非負の方を選びます。','非負かつ平方が同じという二条件から同定','n09-q04-negative::value')],
 [row(r'a<0\quad\Rightarrow\quad -a\ {ux06CandidateSign}\ 0',['ux06CandidateSign']),row(r'(-a)^2=(-a)(-a)={ux06CandidateSquare}',['ux06CandidateSquare'],'続いて候補の平方を確かめます。'),row(r'\sqrt{a^2}={value}',['value'],'候補は正で、その平方はa²です。根号の定義に合う値を結論にします。')],
 'aの符号によって、aそのものを使う場合と−aを使う場合が分かれました。次は条件と結果を対にしてまとめます。',['a∈R,a<0','根号の非負性と平方による定義','直前のa≥0の場合'],'√a√b証明の正性→平方→同定という良い順序を使う。−aを最初に候補として示すことと、二条件を確かめず答えと認定することを分ける。')
b=block('n09-decimal-method','平方公式を生徒自身が導き、1.41²/1.42²の具体計算に使う。','√2を小数で挟むために、候補1.41と1.42をそれぞれ2乗して2と比べます。141²と142²を計算しやすくするため、まず和の平方の作り方を確かめましょう。',[r'(A+B)^2=(A+B)(A+B)',r'=(A+B)A+(A+B)B',r'=A^2+AB+AB+B^2',r'=A^2+2AB+B^2'],[
 part('ux06BinomialBase',r'A+B',[(r'A-B','同じ和を二つ掛けます。符号を変えません。'),(r'A^2+B^2','先に各項を平方する操作ではありません。')],'平方を同じ二つの因子の積に直します。','二項式全体の平方の意味を構成'),
 part('ux06DistributeA','A',[('B','後ろの括弧の第1項へ掛ける部分です。'),('2','指数2を掛ける操作に変えません。')],'後ろの括弧の第1項へ掛ける因子を入れます。','分配法則の一つ目の積を作る'),
 part('ux06DistributeB','B',[('A','今度は後ろの括弧の第2項への積です。'),('AB','後ろの括弧の一項だけを対応させます。')],'後ろの括弧の第2項へ掛ける因子を入れます。','分配法則のもう一つの積を作る'),
 part('ux06CrossProduct','BA',[(r'A+B','AとBを掛ける項です。'),(r'A^2','異なる文字を掛けています。')],'最初の括弧のBへAを掛けてできる積の項を入れます。','分配してできる交差項を式内に構成'),
 part('ux06LastSquare',r'B^2',[(r'2B','Bを二回掛けることと2倍を区別します。'),('AB','最後はB同士の積です。')],'BとBからできる項を入れます。','同じ文字の積を平方として構成'),
 part('ux06LikeTermCount','2',[('1','ABは二つあります。'),('4','四項すべてがABではありません。')],'同類項をまとめたABの係数を入れます。','二つの交差項の和を係数として表す')],
 [row(r'(A+B)^2=(A+B)({ux06BinomialBase})',['ux06BinomialBase']),row(r'=(A+B){ux06DistributeA}+(A+B){ux06DistributeB}',['ux06DistributeA','ux06DistributeB'],'後ろの括弧のAとBへ、それぞれ前の括弧を掛けます。'),row(r'=A^2+{ux06CrossProduct}+AB+{ux06LastSquare}',['ux06CrossProduct','ux06LastSquare'],'さらに各括弧を分配し、二つの積から四つの項を作ります。'),row(r'=A^2+AB+AB+B^2',intro='BAは積の順を入れ替えてABと書けます。'),row(r'=A^2+{ux06LikeTermCount}AB+B^2',['ux06LikeTermCount'],'同じABの項をまとめると、どの係数になるでしょうか。'),row(r'1.41=\frac{141}{100},\quad1.42=\frac{142}{100}',intro='これで和の平方が導けました。次は分数に直し、141=140+1、142=140+2にこの式を使います。'),row(r'\left(\frac pq\right)^2=\frac pq\frac pq=\frac{p^2}{q^2}\quad(q\ne0)',intro='分数の平方は同じ分数どうしの積なので、分子と分母をそれぞれ2乗できます。'),row(r'140^2=14^2\times100=19600,\quad100^2=10000',intro='共通して使う平方を先に計算しておきます。1²と2²は各候補の計算で使います。')],
 '導いた和の平方へ、まずA=140、B=1を対応させます。その計算が終わったらB=2の場合へ進みます。',['N04に既存の平方展開教材はあるが、受講完了を前提にしない','実数の分配/交換法則と平方の定義','今回の目標：候補1.41と1.42の平方で√2を挟む（既認定事実ではない）'],'一般公式を完成形で積み上げるAUTOを除き、本人指定の5段階を同一導出内で構成する。具体平方・中項・和・小数結果は後続の既存4partずつを保持する。')
b['equivalencePolicy']='交差項の正答にはABとBAの同値を許容する。選択肢は両方を同時に出して片方を誤答にしない。左右の分配因子は構文位置によりA/Bを区別する。'
b=block('n09-parts-target','定義から整数部分を探す区間条件を導く。','−2.1を整数部分と小数部分に分けます。x=n+r、nは整数、0≤r<1を満たすnを整数部分、rを小数部分と定めます。この定義から、nを探すときに使える不等式を作りましょう。',[r'x=n+r\Rightarrow r=x-n',r'0\le x-n<1',r'n\le x<n+1'],[
 part('ux06IntervalLower','n',[('0','不等式の各辺にnを加えた後の左端です。'),('n-1','各辺に同じnを加えます。')],'各辺にnを加えた後の下端を入れます。','定義の下限を元のxの区間へ変換'),
 part('ux06IntervalUpper','n+1',[('n','上端は1にもnを加えます。'),('n-1','nを引く操作ではありません。')],'同じ操作をした後の上端を入れます。','上限1を整数部分基準の上端へ変換')],
 [row(r'r=x-n',intro='x=n+rをrについて書き直します。'),row(r'0\le x-n<1',intro='小数部分rの条件へ、いまの式を代入します。'),row(r'{ux06IntervalLower}\le x<{ux06IntervalUpper}',['ux06IntervalLower','ux06IntervalUpper'],'不等式の各辺に同じnを加え、中央をxにします。')],
 '整数部分は、この幅1の区間の左端になる整数です。負の数でも桁を切り取るだけでよいか、次に−2.1で確かめます。',['定義x=n+r,n∈Z,0≤r<1','不等式の各辺へ同じ数を加える性質'],'定義自体は与え、そこから導く区間だけを本人が構成。単純な移項を別小問に増やさず、上下端を同じ行で扱う。')
b=block('n10-q01-square','t√5の平方を因子と指数から構成し、候補を調べる準備をする。','√125を簡単にするため、125=25×5に着目し、t>0として候補t√5を調べます。候補の平方が125になるよう、まず平方を積に戻します。根号の積の公式はまだ使いません。',[r'(t\sqrt5)^2=(t\sqrt5)(t\sqrt5)=t^2(\sqrt5)^2=5t^2'],[
 part('ux06ProductBase',r't\sqrt5',[(r't^2\sqrt5','平方前の基底全体をもう一度掛けます。'),(r'5t','√5を勝手に5へ変えません。')],'2乗の基底をもう一つの因子にします。','文字と根号を含む基底全体を構成'),
 part('ux06CoefficientExponent','2',[('1','tが二つ掛かっています。'),('4','t²同士を掛けているのではありません。')],'t同士をまとめた指数を入れます。','交換結合後の同じ文字の積を累乗へ変換'),
 part('rootSquare','5',[],'√5の平方を計算します。','根号定義の適用','n10-q01-square::rootSquare')],
 [row(r'(t\sqrt5)^2=(t\sqrt5)({ux06ProductBase})',['ux06ProductBase']),row(r'=t^{ux06CoefficientExponent}(\sqrt5)^2',['ux06CoefficientExponent'],'積の順を入れ替え、t同士と√5同士をまとめます。'),row(r'={rootSquare}t^2',['rootSquare'],'根号の定義を使って、平方を計算します。')],
 '候補の平方は5t²と表せました。これを125に等しくするtを次に求めます。',['N09の平方/根号定義','t>0、実数積の交換結合'],'既存5の計算は保持し、指数/因子をAUTOから構成へ。次nodeの125÷5を再び細分化しない。')
b=block('n10-q11-formula','差の平方の符号と交差項の係数を導き、根号二項式へ適用する。','次は(√2−√3)²です。和の平方との違いを確認するため、差の平方も同じ二つの因子へ戻し、分配して中項の符号と係数を確かめます。',[r'(A-B)^2=(A-B)(A-B)=A(A-B)-B(A-B)',r'=A^2-AB-AB+B^2=A^2-2AB+B^2',r'(\sqrt2-\sqrt3)^2=(\sqrt2)^2-2\sqrt2\sqrt3+(\sqrt3)^2'],[
 part('ux06LastProductSign','+',[('-','最後は負の項同士の積です。'),(r'\pm','積の符号は一意に決まります。')],'最後のB同士の積の符号を入れます。','負の因子同士の積を展開の符号へ反映'),
 part('ux06DifferenceCount','2',[('1','−ABが二つあります。'),('4','四項すべてが交差項ではありません。')],'同類項をまとめたABの係数を入れます。','負の交差項二つを中項の係数へまとめる'),
 part('signedMiddleTermUX05',r'-2\sqrt2\sqrt3',[],'(√2−√3)²を差の平方公式で展開します。中項を入れます。','一般式の中項を具体的な二つの根号へ対応','n10-q11-formula::signedMiddleTermUX05')],
 [row(r'(A-B)^2=(A-B)(A-B)'),row(r'=A(A-B)-B(A-B)',intro='分配法則でAへの積と−Bへの積に分けます。'),row(r'=A^2-AB-AB\ {ux06LastProductSign}\ B^2',['ux06LastProductSign'],'各括弧をさらに分配します。最後は−Bと−Bの積です。'),row(r'=A^2-{ux06DifferenceCount}AB+B^2',['ux06DifferenceCount'],'−ABどうしをまとめます。'),row(r'(\sqrt2-\sqrt3)^2=(\sqrt2)^2\ {signedMiddleTermUX05}+(\sqrt3)^2',['signedMiddleTermUX05'],'導いた式へA=√2、B=√3を対応させます。')],
 '中項の符号と係数を保ったまま、次に左右の平方、最後に根号の積を計算します。',['N04差平方教材は存在するが完了を仮定しない','平方の意味・分配・実数の積の符号'],'既習台帳にない完了を仮定せず、短い可視の導出をその場で再構成。左右平方2/3や√6は後続の既存計算に残す。')
b['postCorrectNormalization']='符号込みの中項slotを二つの平方の間へ直接置き、正答後は通常の引き算として描画。新しい正規化処理は追加しない。'
b=block('n10-q13-identity','和と差の積で打ち消し合う交差項を作り、平方差へつなげる。','今度は(√7+√2)(√7−√2)です。和と差の積を分配し、どの項が残るかを確かめましょう。',[r'(A+B)(A-B)=A^2-AB+BA-B^2',r'-AB+BA=0',r'(A+B)(A-B)=A^2-B^2',r'(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=(\sqrt7)^2-(\sqrt2)^2'],[
 part('ux06CrossSign','-',[('+','Aと−Bからできる項です。'),(r'\pm','因子の符号から積の符号は一意です。')],'Aと−Bからできる交差項の符号を入れます。','分配時の因子の符号を項へ対応'),
 part('ux06CrossSum','0',[('2AB','二つの交差項の符号は反対です。'),('-2AB','どちらも負ではありません。')],'交差項どうしの和を入れます。','交換法則と逆符号の和による相殺'),
 part('cancellingPairUX05','opposite-cross-products',[],'この積を分配したとき、互いに打ち消し合う交差項の組を選びます。組の順序は問いません。','一般式の相殺を具体的な根号へ対応','n10-q13-identity::cancellingPairUX05')],
 [row(r'(A+B)(A-B)=A^2\ {ux06CrossSign}\ AB+BA-B^2',['ux06CrossSign']),row(r'-AB+BA={ux06CrossSum}',['ux06CrossSum'],'AB=BAなので、交差項の和をまとめます。'),row(r'(A+B)(A-B)=A^2-B^2',intro='交差項が消え、二つの平方の差が残りました。'),row('相殺する交差項の組：{cancellingPairUX05}',['cancellingPairUX05'],'同じ構造を√7と√2の場合で確かめます。','text'),row(r'(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=(\sqrt7)^2-(\sqrt2)^2')],
 '残った左右の平方を計算し、その差を求めます。',['N04q8資産あり。受講完了を仮定せず、分配/交換を可視で確認','根号の積の交換'],'完成四項を一つで答えさせる要求にはしない。既存の具体的交差項の組と後続7/2/差5の段階計算を保持。')
# Existing non-math enum contract stays exact, even when the surrounding derivation changes.
b['parts'][-1]['kind']='text'
b=block('n10-15','分母を変えるとき分子にも同じ因子が必要なことを式内で構成する。','分母の根号へ掛ける因子は√3と決まりました。元の値を保つため、分子側にもどの因子を掛けるかを式の中に入れます。',[r'\frac1{2\sqrt3}=\frac{1\times\sqrt3}{(2\sqrt3)\times\sqrt3}=\frac{\sqrt3}{2(\sqrt3)^2}'],[
 part('ux06CompensatingFactor',r'\sqrt3',[('1','分母だけに因子を掛けると分数の値が変わります。'),('3','分母へ掛けた因子と同じ数を分子にも掛けます。')],'分母へ√3を掛けるとき、値を保つため分子に掛ける因子を入れます。','分子分母の等しい倍率を式へ適用'),
 part('ux06DenominatorPower','2',[('1','√3が二因子あります。'),('3','因子の中の数と指数を区別します。')],'分母の√3同士の積を累乗にまとめます。','分母の根号をなくす平方の構造を作る')],
 [row(r'\frac1{2\sqrt3}=\frac{1\times{ux06CompensatingFactor}}{(2\sqrt3)\times\sqrt3}',['ux06CompensatingFactor']),row(r'=\frac{\sqrt3}{2(\sqrt3)^{ux06DenominatorPower}}',['ux06DenominatorPower'],'分子1×√3は√3です。分母は二つの√3をまとめます。')],
 '分母が根号の平方を含む形になりました。次に、その平方と係数2の積を計算します。',['n10-14の値を保つ操作','n10-q15-factorのc=√3>0','√3≠0'],'1倍の計算を中心にせず、倍率を上下へ反映する操作を担わせる。1×√3の旧numeratorは廃止保存、因子選択自体は再設計しない。')
b=block('n10-17','選んだ共役因子を分数へ適用し、分母の和全体を掛ける対象として保つ。','選んだc=√3−√2は0でないと確かめました。c/c=1を掛ける操作を、元の分子と分母へそれぞれ反映しましょう。',[r'\frac{\sqrt3}{\sqrt3+\sqrt2}\frac cc=\frac{\sqrt3c}{(\sqrt3+\sqrt2)c}',r'=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}'],[
 part('ux06NumeratorProduct',r'\sqrt3c',[(r'\sqrt3','分子にもcを掛けます。'),('c','元の分子√3を落としません。')],'元の分子へcを掛けた積を入れます。','分数の値保持を分子の積へ適用'),
 part('ux06DenominatorScope',r'\sqrt3+\sqrt2',[(r'\sqrt3','元の分母の和全体に掛けます。'),(r'\sqrt2','元の分母の一項だけには掛けません。')],'分母でcを掛ける対象を括弧の中へ入れます。','分母全体という作用範囲を構成')],
 [row(r'\frac{\sqrt3}{\sqrt3+\sqrt2}\frac cc=\frac{ {ux06NumeratorProduct} }{({ux06DenominatorScope})c}',['ux06NumeratorProduct','ux06DenominatorScope']),row(r'=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}',intro='cに選んだ差を戻します。分母は和と差の積になりました。')],
 '先に分母を平方の差で計算し、それから分子を分配して求めます。',['n10-q17-factorの選択','n10-q17-nonzeroの非零性','n10-14/15の上下の同じ倍率'],'cの値をもう一度写させる穴ではなく、分子の積と分母の対象範囲を作る。後続の分母3/2/差1と分子√6の計算は保持。')
b=block('n10-20','同じ分数内で、分子の差の平方と分母の和差積を別々に構成する。','元の分母と、選んだ因子2−√3が0でないことは確かめました。同じ因子を上下へ掛けると、分子と分母では異なる積ができます。',[r'\frac{2-\sqrt3}{2+\sqrt3}\frac{2-\sqrt3}{2-\sqrt3}=\frac{(2-\sqrt3)^2}{(2+\sqrt3)(2-\sqrt3)}',r'=\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}=\frac{(2-\sqrt3)^2}{4-3}'],[
 part('ux06NumeratorPower','2',[('1','分子には同じ差が二因子あります。'),('4','平方した因子を二つ掛けているのではありません。')],'分子の同じ二因子の積を累乗にします。','差全体に平方が作用する範囲を構成'),
 part('ux06DenominatorSign','-',[('+','和と差の積では交差項が相殺し、平方の差が残ります。'),(r'\times','二つの平方の積へはなりません。')],'分母の和と差の積を平方差に直します。','相殺後に残る平方の関係を符号で構成')],
 [row(r'\frac{2-\sqrt3}{2+\sqrt3}\frac{2-\sqrt3}{2-\sqrt3}=\frac{(2-\sqrt3)^{ux06NumeratorPower}}{(2+\sqrt3)(2-\sqrt3)}',['ux06NumeratorPower']),row(r'=\frac{(2-\sqrt3)^2}{2^2\ {ux06DenominatorSign}\ (\sqrt3)^2}',['ux06DenominatorSign'],'分子の平方は保ち、今度は分母の和と差の積を直します。'),row(r'=\frac{(2-\sqrt3)^2}{4-3}',intro='比較で確かめた2²=4、(√3)²=3を使います。')],
 '分母の差を求めた後、分子の差の平方を展開して計算します。両方を確定してから最終形を記録します。',['n10-q20-factorの因子/非零/比較','n10-q11-formulaの差平方','n10-q13-identityの和差積'],'完成分数一選択を廃止し、指数と符号を別の推論として同じ導出に置く。既認定4/3は再計算させない。')
# Explicit public conditions replace old complete-formula assumptions before deriving them.
for bb in blocks:
 if bb['nodeId']=='n09-decimal-method':
  bb['assumptionOverride']=['A,Bは実数。小数候補の平方を2と比較する。'];bb['assumptionPartsOverride']=[[{'type':'math','latex':r'A,B\in\mathbb R'},{'type':'text','text':'。小数候補の平方を'},{'type':'math','latex':'2'},{'type':'text','text':'と比較する。'}]]
 if bb['nodeId']=='n10-q11-formula':
  bb['assumptionOverride']=['A,Bは実数。具体例の根号の中は2と3。'];bb['assumptionPartsOverride']=[[{'type':'math','latex':r'A,B\in\mathbb R'},{'type':'text','text':'。具体例は'},{'type':'math','latex':r'(\sqrt2-\sqrt3)^2'},{'type':'text','text':'。'}]]
 bb['initialVisiblePrefix']=[r['id'] for r in bb['visibleSequence'] if not r['requiresCorrectKeys']]
 bb['onEntry']='既存stage原問題と認定済み参照、lead、条件（in-context指定以外）とinitialVisiblePrefix全行を表示。各introは対応行と同じgateで実text rowへ変換。未来行は前提正答後のみ。afterVisibleTextも全正答gateの実text row。正答した式は通常組版で残す。'

# Prose uses existing native math rows; typed lead copy uses existing NestedCopy.
copy_replacements={
'4と−4が候補であることは確かめられました。':'正負の候補が条件に合うことは確かめられました。',
'負号も含めて同じ数を2回掛けたので、結果は正になりました。√16の値と、この平方の値を区別して記録します。':'負号も含めて同じ数を二回掛けたので、結果は正になりました。根号自体の値と、負号を含む数の平方の値を区別して記録します。',
'aの符号によって、aそのものを使う場合と−aを使う場合が分かれました。':'元の数の符号によって、その数自体を使う場合と符号を反対にする場合が分かれました。',
'導いた和の平方へ、まずA=140、B=1を対応させます。その計算が終わったらB=2の場合へ進みます。':'導いた和の平方へ、まず下側の小数候補の分子を対応させます。その計算が終わったら、上側の候補へ進みます。',
'整数部分は、この幅1の区間の左端になる整数です。負の数でも桁を切り取るだけでよいか、次に−2.1で確かめます。':'整数部分は、いま導いた区間の左端になる整数です。負の数でも桁を切り取るだけでよいか、次に元の小数で確かめます。',
'候補の平方は5t²と表せました。これを125に等しくするtを次に求めます。':'候補の平方が式で表せました。次に、これを元の被開平数と等しくする係数を求めます。',
'その平方と係数2の積を計算します。':'その平方に残った係数を掛けます。',
'候補は正で、その平方はa²です。':'候補は正で、その平方は元の数の平方と一致します。',
'後ろの括弧のAとBへ、それぞれ前の括弧を掛けます。':'後ろの括弧の各項へ、それぞれ前の括弧を掛けます。',
'BAは積の順を入れ替えてABと書けます。':'積の順を入れ替え、二つの交差項を同じ順にそろえます。',
'同じABの項をまとめると、どの係数になるでしょうか。':'同じ交差項をまとめると、どの係数になるでしょうか。',
'これで和の平方が導けました。次は分数に直し、141=140+1、142=140+2にこの式を使います。':'これで和の平方が導けました。次は小数を分数に直し、分子を計算しやすい二項の和として、この式を使います。',
'分子と分母をそれぞれ2乗できます。':'分子と分母をそれぞれ平方できます。',
'共通して使う平方を先に計算しておきます。1²と2²は各候補の計算で使います。':'共通して使う平方を先に計算しておきます。残る小さい平方は各候補の計算で使います。',
'x=n+rをrについて書き直します。':'定義の式を、小数部分について書き直します。',
'小数部分rの条件へ、いまの式を代入します。':'小数部分の条件へ、いまの式を代入します。',
'不等式の各辺に同じnを加え、中央をxにします。':'各辺に同じ整数部分を加え、中央を元の数だけにします。',
'積の順を入れ替え、t同士と√5同士をまとめます。':'積の順を入れ替え、係数同士と根号同士をまとめます。',
'分配法則でAへの積と−Bへの積に分けます。':'分配法則で、第一項への積と、符号を含む第二項への積に分けます。',
'各括弧をさらに分配します。最後は−Bと−Bの積です。':'各括弧をさらに分配します。最後は負の項同士の積です。',
'−ABどうしをまとめます。':'同じ負の交差項どうしをまとめます。',
'導いた式へA=√2、B=√3を対応させます。':'導いた式へ、元の問題の二つの根号を対応させます。',
'AB=BAなので、交差項の和をまとめます。':'積の順を入れ替えて同じ大きさと確かめ、交差項の和をまとめます。',
'同じ構造を√7と√2の場合で確かめます。':'同じ構造を、元の二つの根号の場合で確かめます。',
'分子1×√3は√3です。分母は二つの√3をまとめます。':'分子の積は、掛けた因子そのものです。分母は同じ根号の二つの因子をまとめます。',
'cに選んだ差を戻します。':'因子の文字に、選んだ差を戻します。',
'比較で確かめた2²=4、(√3)²=3を使います。':'比較で確かめた二つの平方の値を使います。'
}
import re
math_tokens={'(√7+√2)(√7−√2)':r'(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)','(√2−√3)²':r'(\sqrt2-\sqrt3)^2','c=√3−√2':r'c=\sqrt3-\sqrt2','c/c=1':r'c/c=1','125=25×5':r'125=25\times5','x=n+r':'x=n+r','0≤r<1':r'0\le r<1','a<0':'a<0','t>0':'t>0','t√5':r't\sqrt5','√125':r'\sqrt{125}','√2':r'\sqrt2','√3':r'\sqrt3','2−√3':r'2-\sqrt3','−2.1':'-2.1','−a':'-a','141²':'141^2','142²':'142^2','A=140':'A=140','B=1':'B=1','B=2':'B=2','142=140+2':'142=140+2','1.41':'1.41','1.42':'1.42','125':'125','n':'n','r':'r','c':'c','0':'0'}
pattern=re.compile('|'.join(re.escape(x) for x in sorted(math_tokens,key=len,reverse=True)))
def typed_lead(text):
 out=[];at=0
 for m in pattern.finditer(text):
  if m.start()>at:out.append({'type':'text','text':text[at:m.start()]})
  out.append({'type':'math','latex':math_tokens[m.group()]});at=m.end()
 if at<len(text):out.append({'type':'text','text':text[at:]})
 return out
for bb in blocks:
 for x,y in copy_replacements.items():
  bb['afterVisibleText']=bb['afterVisibleText'].replace(x,y)
  for rr in bb['visibleSequence']:rr['intro']=rr['intro'].replace(x,y)
 bb['leadParts']=typed_lead(bb['lead'].replace('2乗','平方'))
 bb['copyPolicy']='leadは既存NestedCopyのmath/text。理由文と後文の数式は既存math rowへ分離し、TextRowにplain数式を埋めない。新しいprose rendererは追加しない。'

# Prose changes outside the 11 redesigned nodes, not silent KEEP changes.
prose=[{'nodeId':'n09-02','changes':{'assumptionsDisplay':'in-context'},'reason':'問題目標の同じ文が再び表示される重複を除く。既存の結果対(4,5)とleadとrequiredResultRefsを保持。元の問いはn09-q02-root入口に置く。'}, {'nodeId':'n09-p001-q08-left-square','changes':{'lead':'導いた和の平方へA=140、B=1を対応させ、141²を求めます。まず中項を作り、その値・和・小数への戻しを順に計算しましょう。'},'reason':'公式から具体計算への接続を明示。既存4partの全採点契約は保持。'}, {'nodeId':'n09-p001-q08-right-square','changes':{'lead':'次は142=140+2です。同じ導出のA=140、B=2として、中項から順に計算します。'},'reason':'二つ目の上側候補が必要な理由と、変わる対応を明示。既存4part契約保持。'}]
for pp in prose:
 if 'lead' in pp['changes']:pp['changes']['leadParts']=typed_lead(pp['changes']['lead'])
resolution={r['nodeId']:{'action':'REDESIGN' if r['nodeId']in[b['nodeId']for b in blocks]else 'PROSE_ONLY' if r['nodeId']in[p['nodeId']for p in prose]else 'KEEP_REVIEWED','reason':'対象block/本文変更の具体案を参照' if r['nodeId']in[b['nodeId']for b in blocks]+[p['nodeId']for p in prose]else 'R03の個別評価を継承。上流修正後に依存・共通font・実画像を検証する。'} for r in json.loads(Path('/tmp/w046-re-audit/ALL_86.json').read_text())['rows']}
for id in ['n09-04','n09-05']:
 resolution[id]['reason']='q04の正性/平方/同定を本人が構成した後の認定結果の整理・絶対値表現。定義は公開されるため名称暗記だけとは扱わず、既存式/parts/前提を保持。上流未解消だったUNVERIFIEDを新設計のR07で再確認。'
protected=['n10-q03-expand','n10-03','n10-q04-sign','n10-04','n10-q05-denominator','n10-q05-square','n10-05','n10-q06-sign','n10-06']
p={'proposalId':'P-W046-UX-06','phase':'R04_PROPOSAL','sourceSHA':source,'sourceRevisions':{'n09':8,'n10':5},'targetRevisions':{'n09':9,'n10':6},'status':'DRAFT_NEEDS_NONAUTHOR_REVIEW','productChanged':False,'blocks':blocks,'proseOnly':prose,'all86Disposition':resolution,'protectedSqrtProofNodes':protected,'typography':{'source':'src/styles/global.css .reading-choice-option > strong font-size:.88rem','change':'construction-lesson-reading.cssに .construction-lesson-reading .reading-choice-option > strong {font-size:1em} 相当のnative限定規則を追加し親の18pxを継承。global.cssの全app指定は変更しない。番号は別role、KaTeX内部の指数/分数は一律18px化しない。','scope':'ConstructionLessonReadingFlowのN09/N10のbaseline69対話node（新案は72：N09+2、N10+1）と同rendererの旧版/archive/history。global classは他の7種reader等でも使うためglobal編集は除外。N07/N08/Guided/MathPracticeは変更しない。native routeのcomputed fontと非native保持をR07で確認。','acceptance':'320/390/430/1440でcomputed body/math/choice roleを比較し、同じ画面の実画像で確認。長い新候補、指数slot、文字slot、誤答/部分正答/完成/履歴を含む。現時点未実装/未検証。'},'migration':{'source':'N09r8 hash39634b3ca00c89f85a23137a32dd664f074a947cc4a98da505fc079813d44c33 / N10r5 hash6f86b3d250ca9bae45698aab208126031a7b9ea0a453a9772c7d2c848cac9b1c','target':'N09r9/N10r6。新compiledHashは実装時に生成し事前に捏造しない。','keep':'同一ID+expected+choice value/display/feedback+mathAssertion等の厳密採点契約が一致するpartsのみ旧正答を保持。新前提の後ろの旧正答は保存したままpending。旧terminal完成からNEWを埋めない。','retire':'廃止partは出所付きsnapshot/historyへ保存。既存r8/r5を不変snapshotに追加し、r7/r4以下の鎖/readonly/reset/namespaceを維持。','new':'NEWは未回答から開始。行/問い/学習行為変更が契約に含まれるか既存validatorで照合し、不一致ならKEEP主張を撤回してNEW IDへ。','unknown':'未知native compiledHashは破壊/上書きせず拒否。targetrevisionを再利用しない。'},'patchPlan':{'representative':'n09-decimal-methodの平方意味→分配→四項→同類項。ここを最初に限定実装し、n09-q08への接続を同画面で確認。','rationale':'今回本人が具体的に示した導出を代表にする。旧UX05のq01代表順序を今回へ無条件流用しない。','afterRepresentative':'本人細部OK後に残る承認済み対象のみ。source-bound NODE_DESIGN→既存nested-lesson/compileTransformationV3/validator→compiled/revision/pins/migration。','layout':'新renderer/card/free-input engineは要件としない。既存math slot/choice→通常数式へ戻す経路を利用。既存対応外があれば実装前に影響と案を明記。'},'verificationPlan':{'code':['source/IR/compiled候補の契約・前提順・循環・正答後式の検査','有限数値候補のmath.verifyとAIの作用範囲/分配/符号レビューを分離','exact KEEP/RETIRE/NEWとr8/r5移行。旧完了からNEWを認定しない','baseline69/target72対話node共通font影響と他unit利用調査、protected9node byte/契約','関連回帰・型/build・保存/reload/history/reset/旧版比較'], 'human':['Aが数学・既習・解法・保存の非作者レビュー、Bが理念と主担当の工程監視・組版/可視情報を反証','代表とその後の変更blockごとに実画像と公開状態で、紙なしで導出を構成できるか確認','R07本人代表細部確認。公開は後の別の具体的承認。'],'notYetRun':'本提案のCODE/実画像受入は未実行。R03の過去検査件数を新候補へ流用しない。'},'approval':'現在はR04具体案の作成のみ。レビュー後に案のhash/範囲でR05へ。UX05の承認を新設計へ流用しない。'}
(O/'PROPOSAL.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
# Draft human-readable proposal with every visible row / hole / distractor / gate.
md=['# P-W046-UX-06 — 導出を生徒が作るための具体的修正案','','R04案。製品未変更。固定source '+source+'。N09r8→r9 / N10r5→r6。既存UX05承認を新案へ流用しない。','', '## 案の中心','', '各導出を、目的→見える根拠→本人の式内構成→次の理由→認定結果の順につなぐ。文字・数字・符号一つの穴も、本人が因子/係数/作用対象/関係を決める場面として使う。全行に穴を設けることや穴数の最大化は要件にしない。','', '## 変更範囲','', '11nodeの導出再設計、3nodeの本文限定変更、共通choice font修正。全86nodeの処遇はPROPOSAL.jsonに一件ずつ固定。√a√bの積・商の証明9node、必要な具体計算、旧版の履歴は保護。','']
for b in blocks:
 md+=['## '+b['nodeId'], '', '**目的**：'+b['goal'],'','**回答前に見える根拠**：'+' / '.join(b['availableBefore']),'','**入口本文**：'+b['lead'],'','**穴なし解法**：','',*['$$'+x+'$$' for x in b['unblankedDerivation']],'','**実際の表示順**：','']
 for i,r in enumerate(b['visibleSequence']):
  md+=['- '+str(i+1)+'. 前提正答：'+(', '.join(r['requiresCorrectKeys'])or'なし')+'。'+('本文「'+r['intro']+'」'if r['intro']else'')+' 式/文：`'+r['template']+'`']
 md+=['','**穴の問い・全候補**：','']
 for part_ in b['parts']:
  if part_['identityPolicy']['oldPartId']:
   opts=part_['oldContract']['choices'];desc='既存の採点契約・全候補・feedbackを厳密保持（同梱JSONのoldContract）'
  else:opts=part_['choices'];desc='NEW'
  md+=['- `'+part_['key']+'`：'+part_['prompt']+' 正答 `'+part_['expected']+'`。'+desc+'。学習行為：'+part_['learningAction']]
  for c in opts:md+=['  - `'+c['value']+'`：'+c.get('feedback','')]
 md+=['','**全正答後の公開本文**：'+b['afterVisibleText'],'','**保持/廃止**：KEEP '+str(b['keepPartIds'])+' / RETIRE '+str(b['retirePartIds'])+'。新しい前提より後の旧正答は保存したままpending。','',b['why'],'']
md+=['## 本文限定変更','']
for x in prose:md+=['- '+x['nodeId']+'：'+json.dumps(x['changes'],ensure_ascii=False)+'。'+x['reason']]
md+=['','## 共通表示・保護・保存','','選択肢の本体text/mathは本文と同じ18pxを継承。番号やKaTeX内部の上下添字とは区別する。新しい式は同じ導出内、候補は現在行の直後。320/390/430/1440の未回答・部分正答・誤答・完成・履歴をR07で実見する。現時点は組版合格を主張しない。','','褒められた積・商の証明9nodeは変更しない。n09-04/05の条件付き結果と絶対値まとめも保持。q08の左右各4part、N10のt²=25・端の平方・差・根号の積は必要な計算として保持。','','r8/r5のsnapshot・旧版readonly・保存namespace・厳密hash鎖を維持し、r9/r6のNEWを旧terminalや完了率で埋めない。新前提より後の旧正答は消さずpending。KEEP契約に差が出た場合はNEWへ変更し、同じkeyの意味を流用しない。','','## 工程と検証','','代表は本人指定の和の平方の導出。R04の非作者審査・理念監視→R05で新案の承認照合→R06代表限定実装→R07 CODE/意味/実画像と本人細部確認→残り限定適用。R07成功を本人受入・公開承認へ読み替えない。正式Store26欠落特例は継続し、架空receiptを作らない。','','既存CODEの正確な接続・未対応はCODE_MAPを参照。段階候補を生成したことを本文の教育品質判定にせず、数学・文章・可視の審査を残す。']
(O/'PROPOSAL.md').write_text('\n'.join(md)+'\n')
print('draft',len(blocks),'redesign',len(prose),'prose',len(resolution),'all nodes',sum(len(x['parts'])for x in blocks),'target parts in redesigned nodes')
