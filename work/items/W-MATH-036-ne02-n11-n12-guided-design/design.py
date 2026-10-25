"""Exact proposed copy and IR only; never mutates learner source or approves design."""
import json,re,hashlib
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
units={u:json.loads((B/f'evidence/{u.upper()}_CURRENT.json').read_text())['unit'] for u in ['ne02','n11','n12']}
old={u:{q['id']:q for q in d['sections'][0]['items']} for u,d in units.items()};rows=[];unit='ne02'
def add(key,q,goal,before,formula=None,answer=None,wrong=None,after='',action='expression',role='substep',anchor=False,refs=None,known=None):
 nid=key if key.startswith(unit+'-') else unit+'-'+key
 if anchor:
  orig=old[unit][nid];answer=orig['answer'];wrong=[(c,'計算対象・条件・符号を直前の式と照合します。'+orig['hints'][0]) for c in orig['choices'] if c!=answer]
 assert answer is None or wrong,(nid,'missing distractors')
 source_start={'ne02':{1:666,2:667,3:668,4:669,5:672,6:673,7:674,8:676,9:681,10:682,11:683,12:684},'n11':{1:479,2:482,3:484,4:487,5:492,6:493,7:495,8:498,9:500,10:501,11:507,12:508,13:511,14:512},'n12':{1:518,2:519,3:525,4:526,5:531,6:532,7:536,8:541,9:542,10:543,11:544,12:547,13:548,14:550,15:551}}
 refs=refs or [source_start[unit][q]]
 rows.append(dict(id=nid,unit=unit,q=q,stageId=unit+'-stage-'+str(q).zfill(2),goal=goal,before=before,formula=formula,answer=answer,wrong=wrong or [],after=after or '確定した結果を記録し、次の操作に使います。',hint='いま使う条件と、式のどの部分を変える操作かを先に確かめます。',sourceRefs=[f'word-p-{i:06}' for i in refs],action=action,role=role,itemId=nid if answer is not None else None,anchor=anchor,known=known or []))
def A(key,q,before,formula=r'\square',after='',action='expression',refs=None,known=None):add(key,q,old[unit][key if key.startswith(unit+'-') else unit+'-'+key]['prompt'],before,formula,after=after,action=action,anchor=True,refs=refs,known=known)
def S(key,q,goal,before,formula,answer,wrong,after='',action='expression',refs=None,known=None):add(key,q,goal,before,formula,answer,wrong,after,action,refs=refs,known=known)
def T(key,q,goal,text,refs,role='property',after='この内容を、次の判断や変形の根拠に使います。'):add(key,q,goal,text,after=after,role=role,refs=refs)
# NE02: three original problems, all twelve original grading contracts preserved.
T('intro',1,'問題と方針を先に置く',r'例題は $\sqrt{5+2\sqrt6}$ を簡単にすることです。根号の中にさらに根号がある形を **二重根号** といいます。外側の根号を外すには、平方が $5+2\sqrt6$ と一致し、しかも非負である候補を作ります。N10で扱った平方根の定義と積の公式を使います。',[664,665],role='example')
S('q01-expand',1,'二乗を積へ戻し四項を作る',r'$a,b$ は正の実数とします。候補の和全体を二乗するので、同じ括弧を二つ掛けます。分配法則で、左の各項を右の各項へ掛けます。',r'(\sqrt a+\sqrt b)^2=\square',r'(\sqrt a)^2+\sqrt a\sqrt b+\sqrt b\sqrt a+(\sqrt b)^2',[(r'a+b','交差して掛ける二項が抜けています。'),(r'a+2\sqrt{a+b}+b','積の根号を和の根号に変えてはいけません。')],r'平方の項は $a,b$、交差する二項はどちらも $\sqrt{ab}$ です。')
A('01',1,r'四つの項のうち、同じ $\sqrt{ab}$ を二つまとめます。平方の項は両端にあるので、和と交差項が見える形にします。',r'(\sqrt a+\sqrt b)^2=\square',r'ここから、定数部分と交差項を別々に合わせる方針を立てます。')
S('q02-sum',2,'外側の和の条件を作る',r'候補の平方を元の $5+2\sqrt6$ と同じ形にするため、まず $a+b$ の部分を $5$ に合わせます。これは候補を作るための十分な条件です。',r'a+b=\square','5',[('6','根号の中の値と、根号の外の和を区別します。'),('11','別々の部分をまとめて足しません。')])
S('q02-product',2,'交差項の中身の条件を作る',r'残る交差項を合わせます。$2\sqrt{ab}$ を $2\sqrt6$ と同じにするには、二つの非負の根号の中身を合わせればよいので、積の条件を作ります。',r'ab=\square','6',[('3','係数2は両方にあるので中身を2で割りません。'),('5','和の条件と積の条件を入れ替えません。')])
A('02',2,r'いま作った和の条件と積の条件を、両方満たす候補を探せるように一組にします。',after=r'この二条件を満たす候補が一組見つかれば、平方と符号を検算して答えを確定できます。')
S('q03-pairs',3,'積6の自然数候補から和を選ぶ',r'簡単な候補として正の整数の組を探します。積が $6$ になる組は、順番を区別しなければ $(1,6)$ と $(2,3)$ です。実数の候補をすべて列挙する必要はありません。二組の和を計算して、和が $5$ の組を選びます。',r'\square',r'1+6=7,\quad2+3=5',[(r'1+6=5,\quad2+3=7','それぞれの和を別々に計算します。'),(r'1+6=6,\quad2+3=6','和の計算と積の条件を混同しています。')],r'和と積の条件を同時に満たす組を使います。',action='calculation')
A('03',3,r'和が $5$ で積が $6$ だった組を、$a,b$ の値として記録します。和は順序を交換しても同じです。',after=r'この値を、最初に置いた平方根の和へ代入します。')
S('q04-square',4,'候補を平方して元へ戻る',r'候補は $\sqrt2+\sqrt3$ です。先ほど作った平方の式に代入し、元の根号内に戻るかを確かめます。',r'(\sqrt2+\sqrt3)^2=\square',r'5+2\sqrt6',[(r'5+\sqrt6','交差項は二つです。'),(r'5+2\sqrt5','交差項の根号内は積です。')],r'平方の値は一致しました。次に候補の符号を確認します。',action='calculation')
S('q04-sign',4,'平方根の符号条件を確認する',r'$\sqrt2$ と $\sqrt3$ はどちらも正です。候補の和全体の符号を選びます。',r'\sqrt2+\sqrt3\ \square\ 0','>',[('<','正の数二つの和です。'),('=','どちらの項も0ではありません。')],r'非負で平方が同じ数は一つなので、この候補が元の根号の値です。',action='judgment')
A('04',4,r'候補の平方が元の根号内に一致し、候補が正であることを確かめました。二つの確認と元の根号の値をまとめます。',after=r'平方の一致だけでなく、根号が表す非負性まで確認して結論にしました。')
T('difference-problem',5,'二つ目の問題と差を選ぶ理由',r'次の例題は $\sqrt{9-4\sqrt5}$ です。根号を含む項が引かれているので、候補を平方根の差にして、負の交差項を作ります。',[670,671],role='example')
S('q05-expand',5,'負号を含む四つの積を作る',r'$(\sqrt a-\sqrt b)^2$ は、同じ差の括弧を二つ掛けることです。交差項では一方の因子だけに負号があるので、両方とも負になります。',r'(\sqrt a-\sqrt b)^2=\square',r'a-\sqrt{ab}-\sqrt{ab}+b',[(r'a+\sqrt{ab}+\sqrt{ab}+b','差の交差項の負号を落としています。'),(r'a-\sqrt{ab}-\sqrt{ab}-b','負と負の積でできる最後の項は正です。')])
A('05',5,r'同じ $-\sqrt{ab}$ の二項をまとめます。和の平方と比べて、交差項の符号だけが違う形になります。',r'(\sqrt a-\sqrt b)^2=\square',r'次は、元の係数4を、いまの展開の係数2にそろえます。')
S('q06-coefficient',6,'係数4を2と2へ分ける',r'交差項を $2\sqrt{ab}$ と比べられるよう、$4\sqrt5$ の係数 $4$ を $2\times2$ に分けます。',r'4\sqrt5=2(\square)',r'2\sqrt5',[(r'4\sqrt5','外へ出した2の分まで重複します。'),(r'\sqrt5','係数の残りの2が抜けています。')])
S('q06-radical',6,'残る2を根号の中へ入れる',r'括弧内の $2\sqrt5$ は正です。$2=\sqrt4$ として根号の積の公式を使うと、外の係数2を残したまま一つの根号にできます。',r'4\sqrt5=2\sqrt{\square}','20',[('10','根号の中へ入る2は平方して4になります。'),('5','括弧内の係数2を残していません。')],r'元の式は $9-2\sqrt{20}$ と同じです。',action='calculation')
A('06',6,r'元の式を $9-2\sqrt{20}$ とそろえました。$a+b-2\sqrt{ab}$ の和と積を、それぞれ同じ部分に対応させます。',after=r'和は9、積は20となる候補を探します。')
S('q07-pairs',7,'積20の組と和を照合する',r'正の整数の候補で積 $20$ を作る組は、順不同なら $(1,20),(2,10),(4,5)$ です。和を順に計算すると $21,12,9$ になります。条件の和が $9$ となる組を選びます。',r'\{a,b\}=\square',r'\{4,5\}',[(r'\{2,10\}','積は合っていても和が違います。'),(r'\{1,20\}','和の条件も同時に使います。')],r'差では順番を変えると符号が反対になるので、両方の差を残します。',action='judgment')
A('07',7,r'選んだ二数を平方根の差へ戻します。$\sqrt4=2$ なので、二通りの順序でできる候補を並べます。この段階では符号で一つに絞りません。',after=r'二つは符号が反対で平方が同じです。根号の値を決めるために大小を調べます。')
S('q08-squares',8,'正の二数を二乗して比べる',r'$\sqrt5$ と $2$ は正なので、二乗した大小と元の大小が一致します。まず左の平方、次に右の平方を計算してから比較します。',r'\square',r'(\sqrt5)^2=5,\quad2^2=4,\quad5>4',[(r'(\sqrt5)^2=5,\quad2^2=4,\quad5<4','最後の比較を確かめます。'),(r'(\sqrt5)^2=25,\quad2^2=4,\quad25>4','根号を二乗すると中身に戻ります。')],r'したがって $\sqrt5>2$ です。',action='judgment')
S('q08-nonnegative',8,'非負の差を選ぶ',r'$\sqrt5>2$ の両辺から $2$ を引くと、$\sqrt5-2>0$ です。もう一方の差はこれと符号が反対です。非負となる候補を選びます。',r'\square',r'\sqrt5-2',[(r'2-\sqrt5','大きい数を小さい数から引いています。'),(r'-\sqrt5-2','二つの候補のどちらでもありません。')],action='judgment')
A('08',8,r'いま確かめた大小関係と非負の候補を使い、元の根号の値をまとめます。',after=r'差の二乗を根号から戻す一般形は $\sqrt{(\sqrt a-\sqrt b)^2}=|\sqrt a-\sqrt b|$ です。絶対値が必要なのは、差の符号が順序によって変わるためです。',refs=[676,677])
T('third-problem',9,'三つ目の問題と係数をそろえる理由',r'確認問題は $\sqrt{3+\sqrt5}$ です。これまでの $2\sqrt{ab}$ と係数を合わせるため、根号内全体を分母2の分数に直します。一部の項だけを2倍すると元の値が変わってしまいます。',[678,679,680],role='check')
S('q09-double',9,'根号内全体を2倍した分子を作る',r'$3+\sqrt5$ の値を変えずに分母を $2$ にするには、和全体を分子で $2$ 倍します。分配法則で分子を展開します。',r'2(3+\sqrt5)=\square',r'6+2\sqrt5',[(r'6+\sqrt5','根号の項にも2を掛けます。'),(r'3+2\sqrt5','定数項にも2を掛けます。')])
A('09',9,r'いま作った分子を分母2の上へ置きます。分子と分母を同じ2倍にしているので元の値と等しい分数です。',r'3+\sqrt5=\square',r'分子は正、分母2も正です。この条件で平方根の商の公式を使えます。')
A('10',10,r'商の平方根の公式 $\sqrt{A/B}=\sqrt A/\sqrt B$ は、$A\ge0,B>0$ のとき使えます。ここでは $A=6+2\sqrt5>0$、$B=2>0$ です。分子の和全体を一つの根号に入れたまま分けます。',r'\sqrt{3+\sqrt5}=\square',r'分子だけに、最初の例題の方法を使います。',known=['ne02-01-result'])
S('q11-conditions',11,'分子の和と積の条件を作る',r'分子は $\sqrt{6+2\sqrt5}$ です。平方根の和の平方を対応させるため、和と積の条件を作ります。',r'\square',r'a+b=6,\quad ab=5',[(r'a+b=5,\quad ab=6','和と積の対応を入れ替えています。'),(r'a+b=6,\quad ab=10','中央の係数2は根号の外に共通です。')],known=['ne02-01-result'])
S('q11-candidate',11,'条件を満たす候補へ戻す',r'積 $5$ の正の整数の組 $(1,5)$ は、和も $6$ です。したがって平方根の和として作る候補を、$\sqrt1=1$ を使って書きます。',r'\square',r'\sqrt5+1',[(r'\sqrt6','和の平方根と平方根の和は異なります。'),(r'\sqrt5-1','交差項の符号は正です。')],r'候補は正で、平方すると $6+2\sqrt5$ になるので、分子の値として使えます。')
A('11',11,r'和と積の条件、選んだ二数、平方と非負性を確かめた分子の結果を一組にして記録します。',after=r'分母は前に残した $\sqrt2$ のままです。次は分子の結果を商の全体へ戻します。')
S('q12-factor',12,'有理化の因子を選ぶ',r'全体は $(\sqrt5+1)/\sqrt2$ です。分母の $\sqrt2$ と掛けて平方を作る因子を選び、同じ非零の因子を分子にも掛けます。',r'\frac{\sqrt5+1}{\sqrt2}\times\frac{\square}{\sqrt2}',r'\sqrt2',[('2','分子と分母に同じ因子を掛けます。'),(r'\sqrt5','分母の根号と同じ因子を使います。')],r'$\sqrt2>0$ なので、この分数を掛けても値は変わりません。',action='judgment')
S('q12-denominator',12,'分母の積を計算する',r'分母は同じ根号を二つ掛けた平方になります。分子の和全体の括弧は残します。',r'\frac{(\sqrt5+1)\sqrt2}{\sqrt2\sqrt2}=\frac{(\sqrt5+1)\sqrt2}{\square}','2',[('4','根号を二乗した値です。'),(r'2\sqrt2','積を和として扱っていませんか。')],action='calculation')
S('q12-numerator',12,'分子の和の両項へ分配する',r'分母は求まりました。分子では $\sqrt2$ を括弧内の両項へ掛け、根号の積を一つにまとめます。',r'(\sqrt5+1)\sqrt2=\square',r'\sqrt{10}+\sqrt2',[(r'\sqrt{10}+1','1の項にも根号を掛けます。'),(r'\sqrt{12}','和を一つの根号にまとめる公式はありません。')],action='calculation')
A('12',12,r'分子と分母を元の商へ戻し、初めの根号の値を一つの式で結論にします。',r'\sqrt{3+\sqrt5}=\square',r'根号内を平方の形へ合わせ、候補を作り、符号まで確かめました。ここで扱った方法がすべての二重根号に機械的に使えるわけではありません。',refs=[684,685])
# N11: retain every previously approved operation/answer ID; supplement proof and boundary reasoning.
unit='n11'
T('intro',1,'元の問題を例題として置く',r'例題は $2<5$ の両辺へ同じ操作をしたとき、大小がどう変わるかを調べることです。両辺から2を引くと $0<3$、正の4を掛けると $8<20$ です。次は $-1$ 倍を、元の数直線で確かめます。',[474,475,476,477,478],role='example')
A('01',1,r'$2$ を $-1$ 倍した数は $-2$、$5$ を $-1$ 倍した数は $-5$ です。元図で右側にある点の数が大きいことを使い、二数の大小を選びます。',r'(-2)\ \square\ (-5)',r'具体例では不等号の向きが変わりました。次に一般の文字で理由を調べます。',action='judgment')
T('difference-basis',2,'差の符号を使う根拠',r'ここからは導出です。$a<b$ とします。小さい $a$ から大きい $b$ までの差は正なので、$b-a>0$ です。操作した後も「右の式−左の式」の符号を調べれば、大小を判断できます。',[480,481],role='proof')
S('q02-open',2,'引く括弧の符号を配る',r'同じ $c$ を足した後の差は $(b+c)-(a+c)$ です。二つ目の括弧全体を引くため、中の二項の符号を両方変えて括弧を外します。',r'(b+c)-(a+c)=\square','b+c-a-c',[('b+c-a+c','引く括弧のcにも負号が付きます。'),('b+c+a+c','二つ目の括弧は引きます。')],r'次は同じcの項を打ち消します。')
A('02',2,r'展開した差は $b+c-a-c$ でした。$c$ と $-c$ が打ち消し合った後の差を記録します。',r'(b+c)-(a+c)=\square',r'元の差と同じ値になりました。')
A('wm011-q02-compare',2,r'$a<b$ より $b-a>0$ です。足した後の「右−左」の差が同じ正の数なので、どちらが大きいかを判断します。',after=r'同じ数を引くことも、反対の数を足す操作なので同じ規則を使えます。',action='judgment')
A('wm011-q03-factor',3,r'両辺へ同じ $c$ を掛けた後の差は $bc-ac$ です。二つの項に共通する因子を外へ出し、残る差を括弧にまとめます。',r'bc-ac=\square(b-a)',r'元の差 $b-a$ は正なので、掛けるcの符号を分けて調べます。')
A('wm011-q03-positive',3,r'まず $c>0$ の場合です。$b-a>0$ なので、$c(b-a)$ は正と正の積です。右から左を引いた差の符号と、両辺の大小を選びます。',after=r'正の数を掛ける場合、不等号の向きは変わりません。',action='judgment')
A('03',3,r'次は $c<0$ の場合です。$b-a>0$ と掛け合わせた差 $c(b-a)$ は負になります。「右−左」が負という意味から、右と左の大小を選びます。',after=r'負の数を掛ける場合、不等号の向きが逆になります。',action='judgment')
A('wm011-q03-zero',3,r'最後に $c=0$ の場合です。元の二数の大小に関係なく、両辺を0倍した結果を考えます。',after=r'0倍では元の厳密な大小は残りません。0で割る操作は定義されていません。',action='meaning')
T('division-basis',3,'割り算の規則も接続する',r'$c\ne0$ で割ることは、逆数 $1/c$ を掛けることです。逆数の符号は $c$ と同じなので、正の数で割れば向きはそのまま、負の数で割れば向きが逆になります。',[485],role='property')
A('wm011-q04-fraction',4,r'確認です。元の $a<b$ の両辺に $-1/5$ を掛けます。掛ける数が負であることを根拠に、不等号の向きと式を選びます。',after=r'この変形は、次の変形とは別の問題です。',action='judgment')
S('q04-negate',4,'元の大小へ戻り負の1倍をする',r'二つ目の確認では元の $a<b$ へ戻ります。まず両辺を $-1$ 倍し、次に3を足す二段階を順に行います。最初の段階の大小を選びます。',r'\square',r'-a>-b',[(r'-a<-b','負の数倍では向きが逆です。'),(r'-a=-b','元は厳密な大小です。')],action='judgment')
A('04',4,r'いまの $-a>-b$ の両辺へ同じ $3$ を足します。加法では向きはそのままで、定数を前へ書いた形にします。',after=r'先ほどの $-1/5$ 倍の式へ3を足したのではなく、元の不等式から別に作った結果です。')
T('solve-problem',5,'一つ目の一次不等式を提示',r'次の例題は $3x-2<5$ を満たすすべての実数 $x$ を求めることです。一つの値だけでなく、条件を満たす範囲全体を残します。まず左辺の定数 $-2$ を打ち消します。',[488,489,490,491],role='example')
A('wm017-q05-operation',5,r'$-2$ を打ち消して0にする数を、まず左辺で決めます。',r'-2+\square=0',r'この操作を右辺にも行います。',action='judgment')
A('wm017-q05-balance',5,r'同じ数を両辺へ足せば大小は保たれます。左辺で選んだ操作と同じ数を右辺にも足します。',r'3x-2+2<5+\square',r'左辺の定数が0になり、右辺に足し算が残りました。',action='judgment')
A('05',5,r'左辺では $-2+2=0$ です。右辺の $5+2$ を計算して、次に係数を1へ変えられる形にします。',r'3x<\square',r'次は両辺を正の3で割ります。',action='calculation')
S('q06-operation',6,'係数を1にする除数を選ぶ',r'$3x$ を $x$ にするには、係数3を割って1にします。両辺に同じ操作を行うため、割る数を選びます。',r'3\div\square=1','3',[('1','3を1で割っても係数は変わりません。'),('-3','係数が負の1になります。')],r'正の3で割るので、不等号の向きは変わりません。',action='judgment')
A('06',6,r'$3x<7$ の両辺を正の $3$ で割ります。$3x/3=x$ なので、右辺の商を入れて範囲を表します。',r'x<\square',r'この不等式で表される実数全体が解です。',action='calculation')
S('q07-substitution',7,'境界を元の式へ代入する',r'境界 $x=7/3$ が入るかは、元の $3x-2<5$ へ代入して確かめます。先に左辺の値を計算します。',r'3\times\frac73-2=\square','5',[('7','最後の−2まで計算します。'),('3','先に3倍してから2を引きます。')],r'境界では元の式が $5<5$ になります。',action='calculation')
A('07',7,r'境界を代入した $5<5$ は成り立ちません。元の不等号に等号が含まれていないことと照合して、境界の扱いを選びます。',after=r'解は $x<7/3$ で、境界は含みません。',action='meaning',refs=[494,495])
T('negative-problem',8,'負の係数の例題を提示',r'次の例題は $-2x+3\le5$ です。最初は正の係数の例題と同じように、左辺の定数項からなくします。',[496,497],role='example')
A('p007-q08-subtract-left',8,r'左辺の $+3$ を打ち消すため、左辺から引く数を決めます。',r'3-\square=0',action='judgment')
A('p007-q08-subtract-right',8,r'左辺から引いた数を、右辺からも同じように引きます。加減では不等号の向きを保ちます。',r'-2x+3-3\le5-\square',action='judgment')
A('08',8,r'左辺の定数を打ち消しました。右辺の $5-3$ を計算して、$x$ の係数だけを残します。',r'-2x\le\square',r'係数は負なので、割るときの向きを判断します。',action='calculation')
A('p007-q09-direction',9,r'$-2x\le2$ の両辺を負の $-2$ で割ります。向きの変化を先に決め、右辺の計算とは分けて答えます。',r'\frac{-2x}{-2}\ \square\ \frac2{-2}',r'次に右辺の値を計算します。',action='judgment',refs=[499,500])
A('09',9,r'左辺の係数は1になりました。右辺の $2\div(-2)$ を計算して範囲を記録します。',r'x\ge\square',r'不等号の向きと右辺の符号を別々に確認できました。',action='calculation')
S('q10-substitution',10,'境界を代入した左辺を求める',r'境界 $x=-1$ を、元の式へ括弧付きで代入します。負と負の積を先に計算してから3を足します。',r'-2(-1)+3=\square','5',[('1','負と負の積は正です。'),('-5','積の符号と最後の加法を分けます。')],r'境界では $5\le5$ となります。',action='calculation')
A('10',10,r'$5\le5$ は等号の場合なので成り立ちます。元の条件と端点を照合し、境界を含むかを選びます。',after=r'ここまでの二例を元図で比べます。○は端点を含まず、●は含みます。',action='meaning',refs=[501,502,503])
T('linear-definition',11,'一次不等式と移項を定義する',r'すべての項を左へ集めた左辺が $ax+b$（$a\ne0$）になる不等式を **一次不等式** といいます。**移項** は両辺に同じ数や式を加減する操作をまとめた書き方です。理由なしに符号だけを変える規則ではありません。',[504],role='definition')
T('bracket-problem',11,'括弧のある確認問題を提示',r'確認問題は $3(2x+3)\ge10x-17$ です。まず分配法則で括弧を外し、それから $x$ の項、定数項の順にまとめます。',[505,506],role='check')
A('wm012-q11-expand',11,r'左辺の3を、括弧内の $2x$ と $3$ の両方へ掛けます。',r'3(2x+3)=\square',r'この展開結果を元の不等式の左辺へ戻します。')
A('wm012-q11-xcoef',11,r'元の不等式は $6x+9\ge10x-17$ になりました。両辺から $10x$ を引き、左辺の $6x-10x$ をまとめます。',r'(6-10)x+9\ge-17,\quad6-10=\square',r'左辺のxの係数が求まりました。',action='calculation')
S('q11-constant',11,'定数を同じ操作でまとめる',r'いまの式は $-4x+9\ge-17$ です。左辺の9を打ち消すため両辺から9を引き、右辺を計算します。',r'-4x\ge-17-9=\square','-26',[('-8','負の数から正の9を引きます。'),('26','右辺の符号を残します。')],action='calculation')
A('11',11,r'係数の計算と定数の計算の結果を元の不等式へ戻して、$x$ の項だけを左に残した形をまとめます。',after=r'次は負の係数を1にする段階です。')
S('q12-sign',12,'負数で割る向きを判断する',r'$-4x\ge-26$ を負の $-4$ で割ります。右辺を簡単にする前に、不等号の向きを選びます。',r'x\ \square\ \frac{-26}{-4}',r'\le',[(r'\ge','負の数で割ると向きは逆です。'),('<','元は等号を含みます。')],action='judgment')
A('12',12,r'右辺 $(-26)/(-4)=26/4=13/2$ と約分し、いま選んだ向きのまま最終的な範囲をまとめます。',after=r'式を解く過程の同値な条件は等号ではなく、段階ごとの不等式として並べます。')
T('fraction-problem',13,'分数の確認問題を提示',r'次は $(x-2)/3\le2x+1$ です。分母の3は正なので、両辺を3倍しても不等号の向きは変わりません。分子の差全体と右辺の和全体を、それぞれ一つの対象として扱います。',[509,510],role='check')
A('p008-q13-mul-left',13,r'分母の3を打ち消す数を左辺で選びます。',r'\frac{x-2}{3}\times\square=x-2',action='judgment')
A('p008-q13-mul-right',13,r'左辺を3倍したので、右辺の和全体にも同じ数を掛けます。',r'x-2\le\square(2x+1)',r'右辺の括弧を外します。',action='judgment')
A('13',13,r'右辺では3を $2x$ と $1$ の両方へ掛けます。まず $x$ の項の係数を計算します。',r'3(2x+1)=(\square)x+3\times1',action='calculation')
A('p008-q13-constant',13,r'同じ分配法則の残る項 $3\times1$ を計算します。',r'x-2\le6x+\square',r'両辺からxを引き、次に両辺から定数を引きます。',action='calculation')
A('wm013-q14-xcoef',14,r'$x-2\le6x+3$ の両辺から $x$ を引きます。右辺の $6x-x$ の係数をまとめます。',r'-2\le(\square)x+3',action='calculation')
A('wm013-q14-const',14,r'いまの式は $-2\le5x+3$ です。両辺から3を引き、左辺の定数を計算します。',r'\square\le5x',action='calculation')
S('q14-divide',14,'正の係数で割り向きを読む',r'$-5\le5x$ の両辺を正の5で割ります。大小を保ち、まず左に定数を置いた形で書きます。',r'\square',r'-1\le x',[(r'-1\ge x','正の数で割ると向きは変わりません。'),(r'1\le x','左辺の−5の負号を残します。')],r'同じ関係をxから読むと、xは−1以上です。')
A('14',14,r'$-1\le x$ と同じ範囲を、$x$ を先に書いた形で表します。辺を入れ替えると、不等号が指す大小も合わせて書き替えます。',after=r'一つずつの不等式を解く方法ができました。次は複数の条件を同時に満たす範囲を残します。',refs=[512,513])
# N12: keep old small operations; add missing checks of simultaneous truth and real/integer interpretation.
unit='n12'
T('intro',1,'連立の原問題を先に置く',r'例題は $x-2<3x+5$ と $x+4\le5-x$ を同時に満たす実数 $x$ を求めることです。まず一つずつ解き、その後で両方に共通する範囲を選びます。二つの条件は別々に記録します。',[516,517],role='example')
S('q01-subtract-x',1,'移項を両辺の同じ操作に戻す',r'一つ目の $x$ の項を右へまとめます。左の $x$ を打ち消すため、まず両辺から同じ式を引きます。',r'x-2-\square<3x+5-x','x',[('2','打ち消す対象は左のxです。'),('-x','引くと逆にxが増えます。')],action='judgment')
A('p002-q01-coef',1,r'左辺の $x-x=0$ を消し、右辺の $3x-x$ をまとめます。',r'-2<(\square)x+5',action='calculation')
A('p002-q01-const',1,r'$-2<2x+5$ の両辺から5を引き、左辺を計算します。',r'\square<2x',action='calculation')
A('01',1,r'$-7<2x$ の両辺を正の2で割ると $-7/2<x$ です。同じ範囲を $x$ から書き、第一の条件として記録します。',after=r'この結果は後で二つ目の条件と合わせるまで保持します。')
A('p002-q02-coef',2,r'二つ目の条件 $x+4\le5-x$ へ戻ります。両辺に $x$ を足し、左辺の $x+x$ の係数を求めます。',r'(\square)x+4\le5',action='calculation')
A('p002-q02-const',2,r'$2x+4\le5$ の両辺から4を引き、右辺を計算します。元の等号を含む不等号はそのまま残します。',r'2x\le\square',action='calculation')
A('02',2,r'$2x\le1$ の両辺を正の2で割り、第二の条件を記録します。第一の条件は上書きせず、二つを並べて残します。',after=r'元図の二段の数直線も、この二条件をそれぞれ表します。',refs=[519,520,521,522])
S('q03-first',3,'試す数が第一条件を満たすか調べる',r'「同時に」の意味を、$x=1$ で確かめます。まず元の一つ目へ代入すると、左辺は $1-2=-1$、右辺は $3\times1+5=8$ です。大小を選びます。',r'-1\ \square\ 8','<',[('>','二つの計算結果を比べます。'),('=','異なる数を等号で結びません。')],r'一つ目は満たします。次に、同じxを二つ目にも代入します。',action='judgment',refs=[523,524,525])
S('q03-second',3,'同じ数を第二条件へ代入する',r'元の二つ目 $x+4\le5-x$ にも $x=1$ を代入します。左辺は $5$、右辺は $4$ になります。$5\le4$ が成り立つかを判断します。',r'\square','成り立たない',[('成り立つ','5は4以下ではありません。'),('一つ目を満たせばよい','元の問題は同時に両方を満たす条件です。')],action='judgment')
A('03',3,r'同じ $x=1$ を両方へ代入した結果、一つ目は満たし、二つ目は満たしませんでした。この数を今回の解へ入れてよいか、根拠とまとめます。',after=r'片方だけでは不十分です。両方へ入る共通部分を探します。',action='meaning')
S('q04-left-end',4,'左端を含むか条件で判断する',r'記録した二条件は $x>-7/2$ と $x\le1/2$ です。左端 $-7/2$ は第一の条件で等号になり、厳密な不等号を満たしません。左端側の記号を選びます。',r'-\frac72\ \square\ x','<',[(r'\le','左端は第一の厳密な条件に入りません。'),('>','残すのは左端より右側です。')],action='judgment',known=['n12-01-result','n12-02-result'])
A('04',4,r'二本の数直線の重なる範囲を残します。左端は含まず、右端 $1/2$ は第二の条件に含まれ、第一の条件も満たします。端点の扱いを残して一つにまとめます。',after=r'二つ以上の不等式を組にしたものを **連立不等式** といい、その解はすべての条件を同時に満たす数です。',refs=[526,527],known=['n12-01-result','n12-02-result'])
T('triple-problem',5,'三連不等式の確認問題を提示',r'確認問題は $3x+2\le2x+4\le9-x$ です。中央の式が二つの比較に共通しています。左端と右端だけの比較へ置き換えず、左と中央、中央と右の二条件を残します。',[528,529,530],role='check')
A('05',5,r'中央の $2x+4$ をそれぞれに残した、同時に満たす二つの不等式を選びます。',after=r'分けた条件を、一つずつ解きます。',action='judgment')
A('p002-q06-left-coef',6,r'左側の $3x+2\le2x+4$ の両辺から $2x$ を引きます。$3x-2x$ の係数をまとめます。',r'(\square)x+2\le4',action='calculation')
A('p002-q06-left-const',6,r'係数1は普通省いて $x$ と書きます。$x+2\le4$ の両辺から2を引き、右辺を計算します。',r'x\le\square',action='calculation')
A('p002-q06-right-coef',6,r'次は右側の $2x+4\le9-x$ です。両辺に $x$ を足し、左辺の係数をまとめます。',r'(\square)x+4\le9',action='calculation')
A('p002-q06-right-const',6,r'$3x+4\le9$ の両辺から4を引いて、右辺の定数を計算します。',r'3x\le\square',action='calculation')
A('06',6,r'左側は $x\le2$ でした。右側は $3x\le5$ を正の3で割ります。二つの結果は別の条件なので、等号でつながず二行で記録します。',after=r'元図の共通縮尺で、二つの上限を比較します。',refs=[532,533,534,535])
S('q07-boundary',7,'大きい方の上限を実際に試す',r'$x=2$ を元の三連不等式へ代入すると、三つの式は順に $8,8,7$ になります。左の $8\le8$ は成り立ちます。右の $8\le7$ が成り立つかを選びます。',r'\square','成り立たない',[('成り立つ','8は7以下ではありません。'),('左だけで決まる','二つの比較を同時に満たす必要があります。')],r'$x=2$ は解へ入れられません。小さい方の上限までに絞ります。',action='judgment')
A('07',7,r'$5/3<2$ なので、$x\le5/3$ に入る数は $x\le2$ も満たします。両方の条件を残す範囲を選びます。',after=r'元の中央の式を使う二つの比較が必要であり、両端の比較だけでは不十分です。',refs=[536,537],known=['n12-06-result'])
T('count-problem',8,'文章題の条件を先に全部示す',r'例題です。50円の箱に、1個180円のシュークリームと1個130円のプリンを合わせて20個入れます。箱を含む合計を3200円以上3300円未満にします。シュークリームの個数を $x$ とし、何個入れられるかを求めます。',[538,539,540],role='example')
A('08',8,r'全部で20個で、シュークリームが $x$ 個です。残りをすべてプリンにするので、全体からシュークリームの個数を引いて表します。',r'\text{プリンの個数}=\square',r'次に、計算前に個数として許されるxの条件を記録します。')
A('09',9,r'個数は整数で、0個より少なくできず、全体20個より多くできません。$x$ の数の種類と範囲を一緒に記録します。',after=r'この整数条件は、実数の不等式を解いている間も保存します。',action='meaning')
A('p003-q10-meaning',10,r'$T(x)$ を、いまから作る合計金額の記号として導入します。箱代も含めて、何の金額を表す記号なのかを確認します。',after=r'金額の単位は円です。以後、式T(x)の値を円単位で扱います。',action='meaning')
A('p003-q10-cream-coef',10,r'シュークリームの代金は、単価180円に個数 $x$ を掛けます。式の係数へ単価を対応させます。',r'\text{シュークリーム代}=(\square)x',action='meaning')
A('p003-q10-pudding-coef',10,r'プリンの個数は、すでに求めた $20-x$ です。単価130円を、その差全体に掛けます。',r'\text{プリン代}=(\square)(20-x)',action='meaning',known=['n12-08-result'])
A('p003-q10-box-fee',10,r'箱の代金は菓子の内訳に関係なく一箱分です。問題文の箱代を固定の代金として対応させます。',r'\text{箱代}=\square\ \text{円}',action='meaning')
A('10',10,r'箱代、シュークリーム代、プリン代を足して合計を作ります。プリンの個数の括弧を残し、全体を一つの金額の式へまとめます。',r'T(x)=\square',r'次は合計金額に課された下限と上限を式にします。')
A('p003-q11-lower-sign',11,r'3200円以上には3200円と等しい場合も入ります。下限の数、合計金額の順に並べた記号を選びます。',r'3200\ \square\ T(x)',action='judgment')
A('p003-q11-upper-sign',11,r'3300円未満には3300円と等しい場合は入りません。合計金額、上限の順に並べた記号を選びます。',r'T(x)\ \square\ 3300',action='judgment')
A('11',11,r'二つの金額条件を同時に満たすように並べ、中央の $T(x)$ を先ほど作った合計金額の式に置き換えます。',after=r'金額条件を式へ移せました。次は括弧を展開します。',known=['n12-10-result'])
A('p003-q12-product-constant',12,r'プリン代の括弧へ130を分配します。まず定数20へ掛け、プリン20個分の金額を計算します。',r'130\times20=\square',action='calculation')
A('p002-q12-signed-coef',12,r'残る $-x$ の項にも130を掛けます。符号を含めた係数を入れ、先に求めた定数項を残します。',r'130(20-x)=2600+(\square)x',action='calculation')
A('p003-q12-total-constant',12,r'合計金額へ戻ると、定数項は箱代50と2600です。この二項だけを先にまとめます。',r'50+2600=\square',action='calculation')
A('p003-q12-x-coef',12,r'次に $x$ の項だけをまとめます。シュークリーム代の $180x$ とプリン代の $-130x$ に共通する $x$ を残し、係数を計算します。',r'180x-130x=(\square)x',r'定数の結果と係数の結果を別々に得たので、全体へ戻します。',action='calculation')
A('12',12,r'$T(x)=2650+50x$ となりました。この短い式を、元の3200円以上3300円未満という条件の中央へ戻します。',after=r'次は中央を50xだけにするため、三つの辺へ同じ操作をします。')
S('q13-operation',13,'三辺へ行う操作を選ぶ',r'$3200\le2650+50x<3300$ の中央の定数を打ち消します。左右の端にも同じ数を引き、二つの大小関係を保ちます。',r'2650-\square=0','2650',[('50','消したいのは中央の定数です。'),('3200','下限を消す操作ではありません。')],r'三辺から2650を引くと $3200-2650\le50x<3300-2650$ です。',action='judgment')
A('p002-q13-lower',13,r'三辺から同じ2650を引いた式の、左端の差を先に計算します。右端の差は次の段階で計算します。',r'\square\le50x<3300-2650',action='calculation')
A('p002-q13-upper',13,r'左端の計算結果を残し、右端の $3300-2650$ を計算します。',r'550\le50x<\square',action='calculation')
S('q13-lower-divide',13,'下限を50で割る',r'三辺を正の50で割るので、二つの不等号の向きはそのままです。中央は $x$ になり、左端の商を先に計算します。',r'\frac{550}{50}=\square','11',[('10','550を50で割ります。'),('13','上限の商と入れ替えません。')],action='calculation')
S('q13-upper-divide',13,'上限を50で割る',r'同じ操作で右端の商を計算します。3300円未満の厳密な不等号はそのまま残ります。',r'\frac{650}{50}=\square','13',[('12','650を50で割ります。'),('11','下限と上限を入れ替えません。')],action='calculation')
A('13',13,r'求めた二つの商を、中央 $x$ の左右へ戻します。左は等号を含み、右は含まない範囲としてまとめます。',after=r'これは実数としての範囲です。まだ菓子の個数としての答えではありません。')
S('q14-integer',14,'範囲に入る整数を選ぶ',r'保存した条件は $x\in\mathbb Z,0\le x\le20$ です。$11\le x<13$ に入る整数を残します。上端13は含まれません。',r'\square',r'11,\ 12',[(r'11,\ 12,\ 13','上端の不等号は厳密です。'),('12','左端は等号を含みます。')],r'二つとも最初の0以上20以下の条件も満たします。',action='judgment',known=['n12-09-result','n12-13-result'])
A('14',14,r'整数条件と計算した範囲を合わせて、シュークリームの個数を答えます。「または」は二つの可能な内訳を表します。',after=r'最後にそれぞれを元の金額へ戻して検算します。',action='meaning')
S('q15-eleven',15,'11個の内訳で元の金額を検算する',r'$x=11$ ならプリンは $20-11=9$ 個です。箱代と二種類の菓子代を、最初に作った式で計算します。',r'T(11)=50+180\times11+130\times9=\square','3200',[('3150','箱代50も含めます。'),('3250','12個の場合と区別します。')],r'3200以上の下限を等号で満たし、3300未満にも入ります。',action='calculation',known=['n12-10-result'])
S('q15-twelve',15,'12個の内訳も別に検算する',r'$x=12$ ならプリンは8個です。前の検算と別の一行で、同じ合計金額の式へ代入します。',r'T(12)=50+180\times12+130\times8=\square','3250',[('3200','11個の場合と区別します。'),('3300','上端そのものにはなりません。')],r'こちらも3200以上3300未満です。',action='calculation',known=['n12-10-result'])
A('15',15,r'二つの検算は別の内訳なので、一つの等式の連鎖にはしません。各金額をそれぞれの個数に対応させ、二行で結果をまとめます。',after=r'元のまとめの図は、この検算が終わってから表示します。式を解いた後も、最初の量の意味と整数条件へ戻ることが必要です。',refs=[551,552,553,554])
next(n for n in rows if n['id']=='ne02-q08-squares')['sourceRefs'].append('word-p-000675')
next(n for n in rows if n['id']=='n11-wm011-q03-factor')['sourceRefs'].append('word-p-000483')
next(n for n in rows if n['id']=='n12-12')['sourceRefs'] += ['word-p-000545','word-p-000546']
next(n for n in rows if n['id']=='n12-q14-integer')['sourceRefs'].append('word-p-000549')
next(n for n in rows if n['id']=='ne02-q02-sum')['before']=r'元の $5+2\sqrt6$ に合わせるため、展開した $a+b+2\sqrt{ab}$ のうち、根号の外の和を対応させます。これは同じ平方を作るための十分な条件を選ぶ操作です。'
next(n for n in rows if n['id']=='ne02-q12-factor')['before']=r'全体は $(\sqrt5+1)/\sqrt2$ です。分母の因子と掛けて平方を作る因子を選び、同じ非零の因子を分子にも掛けます。'
next(n for n in rows if n['id']=='n11-wm011-q03-factor')['before']=r'両辺に同じ数を掛けた後の差は $bc-ac$ です。二つの項に共通する因子を外へ出し、残る差を括弧にまとめます。'
next(n for n in rows if n['id']=='n12-q01-subtract-x')['before']=r'一つ目の $x-2<3x+5$ で、文字の項を右へまとめます。左の文字の項を打ち消すため、まず両辺から同じ式を引きます。'
n=next(n for n in rows if n['id']=='ne02-q12-factor');n['formula']=r'c=\square';n['before']=r'全体は $(\sqrt5+1)/\sqrt2$ です。元の分母と掛けて平方を作る非零の因子を $c$ とします。まず因子を選び、その後に分子と分母の両方へ掛けます。';n['after']=r'選んだ因子は正なので0ではありません。この因子を分子と分母の両方へ掛けても値は変わりません。'
# Explicit render design: original grading keys untouched, per-option math/text spans are not guessed at runtime.
serial=0
def parts(s):
 global serial
 out=[]
 for t in re.split(r'(\$[^$]+\$|\*\*[^*]+\*\*)',s):
  if not t:continue
  serial+=1;p='w36-p-'+str(serial)
  if t.startswith('$'):out.append(dict(id=p,kind='math',latex=t[1:-1],mathRole='expression',semanticRef=p))
  elif t.startswith('**'):out.append(dict(id=p,kind='term',text=t[2:-2],termId=p,usage='first_definition'))
  else:out.append(dict(id=p,kind='text',text=t))
 return out
def para(n,s,suffix):return dict(id=n['id']+'-'+suffix,kind='paragraph',parts=parts(s))
def result_group(n,latex,bid):
 # Independent statements share a layout group, never a fabricated equality.
 chunks=re.split(r',\\quad\s*|;\\\s*|;\s*',latex)
 if len(chunks)>1:
  return dict(id=n['id']+'-equation',kind='relationChain',relation='independent',expressions=[dict(id=n['id']+'-result-expr-'+str(i),parts=parts('$'+t+'$')) for i,t in enumerate(chunks) if t],operators=[],transformRef=n['id'],layoutProfile='independent',numbering=dict(stableId=bid,mode='group-end'))
 # Split only top-level relation tokens; braces and text commands stay intact.
 vals=[];ops=[];depth=0;start=0;i=0
 while i<len(latex):
  char=latex[i]
  if char=='{':depth+=1
  elif char=='}':depth-=1
  op=None
  if depth==0:
   for token in [r'\le',r'\ge','<','>','=']:
    if latex.startswith(token,i) and (not token.startswith('\\') or i+len(token)==len(latex) or not latex[i+len(token)].isalpha()):op=token;break
  if op:vals.append(latex[start:i]);ops.append(op);i+=len(op);start=i;continue
  i+=1
 vals.append(latex[start:])
 if not ops or any(not t.strip() for t in vals):vals=[latex];ops=[]
 relation='equality' if ops and all(x=='=' for x in ops) else 'inequality' if ops else 'independent'
 return dict(id=n['id']+'-equation',kind='relationChain',relation=relation,expressions=[dict(id=n['id']+'-result-expr-'+str(i),parts=parts('$'+t+'$')) for i,t in enumerate(vals)],operators=ops,transformRef=n['id'],layoutProfile='aligned-transform' if ops else 'single',numbering=dict(stableId=bid,mode='group-end'))

for u in units:
 ur=[n for n in rows if n['unit']==u];source=json.loads((B/f'evidence/{u.upper()}_SOURCE_INDEX.json').read_text());nodes=[]
 for i,n in enumerate(ur):
  n['resultId']=n['id']+'-result';n['requires']=list(dict.fromkeys(([ur[i-1]['resultId']] if i else [])+n['known']));n['knownRefs']=list(dict.fromkeys(n['known']+([ur[i-1]['resultId']] if i and ur[i-1]['stageId']!=n['stageId'] else [])))
  n['requires']=list(dict.fromkeys(n['requires']+n['knownRefs']));before=[para(n,n['before'],'before')];after=[para(n,n['after'],'after')]
  if n['answer'] is not None:
   slot=dict(id=n['id']+'-slot',kind='answerSlot',interactionId=n['itemId'],semanticRef=n['itemId']);bid=n['id']+'-interaction';a,b=(n['formula'] or r'\square').split(r'\square');p=parts('$'+a+'$') if a else [];p.append(slot)
   if b:p+=parts('$'+b+'$')
   # Textual decisions stay in a paragraph. All other equation slots use math groups.
   istext=(n['action']=='meaning' or n['answer'] in ['成り立たない','成り立つ'] or (n['anchor'] and old[u][n['itemId']]['answerType']=='text')) and not ('\\' in n['answer'] or '=' in n['answer'])
   if istext and n['formula']==r'\square':before.append(dict(id=bid,kind='paragraph',parts=[slot]));after.insert(0,para(n,n['answer'],'result'));form='text'
   else:
    before.append(dict(id=bid,kind='relationChain',relation='independent',expressions=[dict(id=bid+'-expr',parts=p)],operators=[],transformRef=n['id'],layoutProfile='single',numbering=dict(stableId=bid,mode='group-end')))
    resolved=(n['formula'] or r'\square').replace(r'\square',n['answer']);n['resolvedFormula']=resolved;after.insert(0,result_group(n,resolved,bid));form='formula'
  node=dict(id=n['id'],problemId=u,sourceRefs=n['sourceRefs'],requires=n['requires'],produces=[n['resultId']],role=n['role'],goal=n['goal'],purpose=n['goal'],operation=dict(kind=n['action'],targets=n['sourceRefs'],nextUseIds=[]),before=before,after=after,contextNeed=[dict(id=n['id']+'-context',problemId=u,factIds=n['knownRefs'],reason='別のページでも、いま使う条件付き結論だけを呼び戻す。')] if n['knownRefs'] else [])
  if n['answer'] is None:node['noBlankReason']='問題の条件・未知の定義・操作の根拠を教え、直後の適用で判断させる。'
  else:node['interaction']=dict(id=n['itemId'],targetPath='interaction.expected.value',learningAction=n['action'],whyHere=n['goal'],prerequisiteIds=n['requires'],expected=dict(value=n['answer'],form=form,semanticType=n['action']),choices=[dict(id=n['id']+'-correct',content=n['answer'],feedback=n['after'])]+[dict(id=n['id']+'-wrong-'+str(j),content=x,misconception=y,feedback=y) for j,(x,y) in enumerate(n['wrong'])],hints=[n['hint']],answerInsertion=dict(blockId=bid,slotId=n['id']+'-slot'))
  nodes.append(node)
 coverage=[]
 for b in source['blocks']:
  matched=[n['id'] for n in ur if b['id'] in n['sourceRefs']]
  structural=not b['math'] and (not b['text'] or b['text'] in ['例題','導出','確認'] or b['text'].startswith(('N11','N12','NE02','第3節')))
  assert matched or structural,('unmapped important source',u,b)
  coverage.append(dict(sourceId=b['id'],nodeIds=matched,disposition='taught' if matched else 'structural',reason='原問・条件・無番号説明・元図の役割を該当ノードへ保持' if matched else '役割ラベルまたは構造見出しとして段階へ統合'))
 ir=dict(schemaVersion='production-ir/1',unitId=units[u]['unitId'],subject='math',mode='textbook',sourceHash=source['documentHash'],sourceBlocks=[dict(id=b['id'],kind=b['kind']) for b in source['blocks']],coverage=coverage,initialFacts=['real-arithmetic','square-identities','accepted-n08-absolute-value','accepted-n09-root-definition','accepted-n10-root-product-quotient','accepted-n11-order-rules'] if u=='n12' else ['real-arithmetic','square-identities','accepted-n08-absolute-value','accepted-n09-root-definition','accepted-n10-root-product-quotient'],nodes=nodes)
 # Every old ID, correct answer and canonical choice key remains byte-identical.
 byid={n['itemId']:n for n in ur if n['itemId']};assert set(old[u])<=set(byid)
 for oid,q in old[u].items():assert byid[oid]['answer']==q['answer'] and {q['answer'],*(v[0] for v in byid[oid]['wrong'])}==set(q['choices'])
 write(u.upper()+'_NODE_DESIGN.json',dict(status='PROPOSED',nodes=ur));write(u.upper()+'_IR.json',ir);write(u.upper()+'_SOURCE_COVERAGE.json',coverage)
 argument=dict(kind='argument',claim=u.upper()+'の原問と追加途中段階が、明記した条件から成立する。',assumptions=['実数の四則・分配法則・順序','N08絶対値とN09非負の平方根の定義','N10根号の積商と平方公式']+(['N11同じ加減と正負の乗除の規則'] if u=='n12' else []),sourceRefs=[b['id'] for b in source['blocks']],steps=[dict(statement=n['before']+' '+n.get('resolvedFormula','')+' '+n['after'],basisRefs=n['sourceRefs'],dependsOn=n['requires']) for n in ur]);write(u.upper()+'_COMPLETE_SOLUTION.json',argument)
 lines=[f'# {u.upper()} 全ノード具体設計','',f'Status: PROPOSED。{len(ur)}ノード / {len(byid)}回答 / {len(set(n["stageId"] for n in ur))}段階。原{len(old[u])}回答・全choiceキー保持。制作者向けの正答入り設計。','']
 for n in ur:
  lines += [f'## {n["id"]} — {n["goal"]}','',f'段階：{n["stageId"]} / 役割：{n["role"]} / 原資料：'+', '.join(n['sourceRefs']),'','**回答前の本文**','',n['before'],'']
  if n['answer'] is not None:
   lines += ['**穴の位置**','',r'\['+n['formula'].replace(r'\square',r'\boxed{\phantom{0}}')+r'\]','',f'ID：`{n["itemId"]}` / 思考：{n["action"]} / 正答：`{n["answer"]}`','', '| 誤答キー（既存は維持） | 戻す根拠 |','|---|---|']
   lines += ['| `'+x.replace('|',r'\|')+'` | '+y.replace('|',r'\|')+' |' for x,y in n['wrong']];lines+=['','ヒント：'+n['hint'],'']
  else:lines+=['穴なし：問題文・定義・根拠を教える段階。次の適用で考えさせる。','']
  lines+=['**回答後の式と本文**','',('$'+n['resolvedFormula']+'$') if n.get('resolvedFormula') else '',n['after'],'','前結果：'+(', '.join(n['knownRefs']) or '段階内の直前結果。不要な過去全文は表示しない。'),'結果ID：`'+n['resultId']+'`。確定後だけ次のノードへ渡す。','']
 (B/(u.upper()+'_NODE_DESIGN.md')).write_text('\n'.join(lines)+'\n')
 print(u,len(ur),'nodes',len(byid),'answers')
