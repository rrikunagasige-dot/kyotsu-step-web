"""Bounded N09/N10 proposal data; never writes learner source or records approval."""
import json,re,hashlib,subprocess
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
def write(p,x):(B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
units={u:json.loads((B/f'evidence/{u.upper()}_CURRENT.json').read_text())['unit'] for u in ['n09','n10']}
old={u:{q['id']:q for q in d['sections'][0]['items']} for u,d in units.items()}
rows=[];unit='n09'
def display(s):return s.replace('\\\\','\\')
def add(stage,key,goal,before,formula,answer,wrong,after,hint,refs,action='expression',role='substep',anchor=None,extra=None,known=None):
 nid=unit+'-'+key;oid=anchor or nid
 if anchor:
  a=old[unit][anchor];answer=a['answer'];choices=[x for x in a['choices'] if x!=answer]
  if anchor in ('n09-p001-q08-lower-sign','n09-p001-q08-upper-sign'):wrong=wrong+['等しくなる場合を含めず、今回の二数の厳密な大小を選びます。']
  assert len(choices)==len(wrong),(anchor,choices,wrong)
  wrong=list(zip(choices,wrong))
 rows.append(dict(id=nid,unit=unit,stageId=f'{unit}-stage-{stage:02}',goal=goal,before=before,formula=formula,answer=answer,wrong=wrong,after=after,hint=hint,sourceRefs=[f'word-p-{i:06}' for i in refs],action=action,role=role,itemId=oid if answer is not None else None,anchor=bool(anchor),extra=extra or {},known=known or []))
# N09: retain all18 live answers (including the earlier four Q08 substeps).
add(1,'q01-positive','正の候補の平方',r'例題は、2乗すると $16$ になる実数をすべて求めることです。まず正の候補 $4$ を2回掛けて確かめます。',r'4^2=4\times4=\square','16',[('8','二乗を2倍にしています。'),('4','同じ数を2回掛けます。')],r'$4$ は条件を満たしました。符号が反対の候補も調べます。','同じ数どうしの積を計算します。',[378,379,380],action='calculation',role='example')
add(1,'q01-negative','負の候補も確かめる',r'負の数どうしの積は正です。候補 $-4$ に括弧を付けて2乗します。',r'(-4)^2=(-4)\times(-4)=\square','16',[('-16','負と負の積の符号を確かめます。'),('-8','2乗は2倍ではありません。')],r'正と負の候補が、どちらも同じ平方になりました。','符号と数の大きさを分けて掛けます。',[379,380],action='calculation')
add(1,'01','すべての解を答える',r'二つの候補を確かめました。これ以外の実数がないことは、$x^2-16=(x-4)(x+4)=0$ から確認できます。実数の積が0なら少なくとも一方が0です。条件を満たす実数をまとめます。',r'\square',None,['正の解だけでは「すべて」になりません。','負の解だけでは「すべて」になりません。','16を2乗しても16にはなりません。'],r'平方が同じでも、元の数の符号は二通りあります。','二つの平方計算の結果を合わせます。',[380],role='example',anchor='n09-01')
add(2,'definition','平方根と根号を区別する',r'2乗して $a$ になる数を $a$ の **平方根** といいます。$a>0$ のとき二つあり、正の方を $\sqrt a$、負の方を $-\sqrt a$ と書きます。**根号** $\sqrt a$ 自体は非負の一つの数を表します。',None,None,[],r'「平方根をすべて」と「根号の値」では、求める対象が違います。','',[381,382],role='definition')
add(2,'q02-root','根号は非負の方を取る',r'$\sqrt{16}$ は、2乗すると $16$ になる数のうち、非負の方を表します。',r'\sqrt{16}=\square','4',[('-4','根号で表す値は非負です。'),(r'\pm4','根号は二つの平方根をまとめた記号ではありません。')],r'もう一方の式では、外側の負号ごと2乗します。','根号の定義で、値の符号を確かめます。',[381,383],action='judgment')
add(2,'q02-negative-square','負号を含めて二乗する',r'$(-\sqrt5)^2$ は、$-\sqrt5$ 全体を2回掛ける式です。負と負の積の符号を先に見ます。',r'(-\sqrt5)^2=(-1)^2(\sqrt5)^2=\square','5',[('-5','括弧内の負号も2乗されます。'),('25','根号を2乗すると中の数に戻ります。')],r'根号の値と、負の数を2乗した結果を区別できました。','負号は括弧の内側です。',[383],action='calculation')
add(2,'02','二つの値を元の順序でまとめる',r'最初が $\sqrt{16}$、次が $(-\sqrt5)^2$ です。求めた値をこの順序の組にします。',r'\square',None,['根号の値を二つまとめた記号にしていませんか。','最初の根号は非負の値です。','2番目は負号ごと2乗した結果です。'],r'根号の選ぶ符号と、二乗の結果は別々に判断します。','直前に確定した二つの値を順に置きます。',[383],anchor='n09-02',action='meaning')
add(2,'boundary','0と負の数の境界',r'$0^2=0$ なので、$0$ の平方根は $0$ 一つです。$\sqrt0=0$ と書きます。実数の平方は非負なので、負の数の平方根は、この章で扱う実数の範囲にはありません。',None,None,[],r'以下では、根号の中が非負であることと、根号の値が非負であることを確認して使います。','',[384],role='property')
add(3,'q03-inside','内側の平方を先に求める',r'例題 $\sqrt{(-4)^2}$ では、根号を外す前に、括弧内の数を2乗します。',r'(-4)^2=\square','16',[('-16','負と負の積です。'),('4','2乗の計算をまだしていません。')],r'根号の内側が求まりました。次に非負の平方根を選びます。','負号も括弧の内側にあります。',[386,387],role='example',action='calculation')
add(3,'03','根号の非負の値を選ぶ',r'内側の値を戻すと $\sqrt{(-4)^2}=\sqrt{16}$ です。根号の定義に従って値を決めます。',r'\sqrt{(-4)^2}=\sqrt{16}=\square',None,['内側の負号をそのまま外へ出していませんか。','根号の表す値は一つです。','16は根号の内側の値です。'],r'元の $-4$ をそのまま取り出す操作にはなりません。','根号で指定される値の符号を確認します。',[387,388],anchor='n09-03')
add(4,'q04-nonnegative','0以上の場合',r'一般の実数 $a$ を調べます。$a\ge0$ なら、$a$ と $-a$ のうち非負の値を表す方として、$a$ を選べます。$a=0$ のときは両方とも0ですが、$a$ という式でこの場合全体を表せます。',r'a\ge0:\quad\sqrt{a^2}=\square','a',[(r'-a','aが正の場合にも非負になる方を選びます。'),(r'a^2','平方の値ではなく平方根を表します。')],r'次は負の場合に、非負の値を表す方を選びます。','この場合をまとめて表せる式を選びます。',[390],action='judgment',role='proof')
add(4,'q04-negative','負の場合',r'$a<0$ なら、$a$ 自体は負です。符号を反対にした数を選ぶと非負になります。その数を2乗しても $a^2$ です。',r'a<0:\quad\sqrt{a^2}=\square','-a',[('a','この場合のaは負です。'),('0','aは0より小さく、0ではありません。')],r'条件を変えると、根号の非負の値を表す式も変わります。','aの符号と、符号を反対にした数を比較します。',[390],action='judgment',role='proof')
add(4,'04','条件と結果の対応を保持する',r'順序は $a\ge0$ の場合、次に $a<0$ の場合です。この順序で、非負になる方の式をまとめます。',r'\square',None,['二つの場合に対応する式を逆にしています。','負の場合にaをそのまま使うと負になります。','0以上の場合に負の式を選んでいます。'],r'この対応を、N08で得た絶対値の規則と照らし合わせます。','条件と結果を同じ順序で並べます。',[390],anchor='n09-04',role='proof')
add(4,'05','二つの場合を絶対値へ統合する',r'N08で得た規則は、$a\ge0$ なら $|a|=a$、$a<0$ なら $|a|=-a$ でした。いまの二つの場合と一致する記号でまとめます。',r'\sqrt{a^2}=\square',None,['aが負の場合に式が非負になるか調べます。','aが正の場合に式が非負になるか調べます。','平方の値と平方根の値を区別します。'],r'すべての実数 $a$ で $\sqrt{a^2}=|a|$ です。条件付きの二つの場合も記録に残します。','直前の二場合と、N08の定義を対応させます。',[391,392],anchor='n09-05',role='property')
add(5,'q06-squares','非負の二数を平方で比較する',r'例題は $\sqrt{(2-\sqrt5)^2}$ です。根号の内側にある $2-\sqrt5$ の符号を先に決めます。$2$ と $\sqrt5$ は非負なので、平方の大小で比較できます。',r'2^2=\square','4',[('2','同じ数を2回掛けます。'),('5','平方根側の平方と取り違えています。')],r'$(\sqrt5)^2=5$ と、この結果を比べます。','整数側の平方を求めます。',[394,395],role='example',action='calculation')
add(5,'q06-order','平方の比較を元の数へ戻す',r'平方した値は $4<5$ です。非負の範囲では、元の二数にも同じ向きの大小関係が成り立ちます。',r'2\ \square\ \sqrt5','<',[('>','非負の二数では平方の大小と同じ向きです。'),('=','二つの平方は等しくありません。')],r'元の数の大小が分かりました。差が0より小さいことへつなぎます。','比較した左右の順を保ちます。',[395],action='judgment')
add(5,'06','差の符号へつなぐ',r'$2<\sqrt5$ の両辺から $\sqrt5$ を引きます。同じ数を引いても不等号の向きは変わりません。',r'\square',None,['非負の二数を平方で比較した向きを確認します。','平方が違うので元の数は等しくありません。','符号を決めるため、0との大小を読み取ります。'],r'根号を外すときに使う、中身の符号が確定しました。','右辺で同じ数を引いた結果を考えます。',[395],anchor='n09-06',action='judgment')
add(5,'q07-negation','負の式全体に負号を付ける',r'$\sqrt{u^2}=|u|$ に $u=2-\sqrt5$ を入れます。中身が負なので、N08の負の場合の規則を使い、式全体を括弧で囲みます。',r'|2-\sqrt5|=\square',r'-(2-\sqrt5)',[(r'2-\sqrt5','負の場合の絶対値の規則を使います。'),(r'-2-\sqrt5','元の式全体を括弧で囲み、まだ展開しません。')],r'次に、外側の負号を括弧内の両項に作用させます。','式の一項だけでなく全体を対象にします。',[396])
add(5,'07','両項の符号を変えて答える',r'$-(2-\sqrt5)=-2+\sqrt5$ です。加法の交換法則で正の項を先に置き、元の例題の答えにします。',r'\sqrt{(2-\sqrt5)^2}=\square',None,['負の中身をそのまま取り出しています。','外側の負号は両項に掛かります。','絶対値の中身の符号を確認した結果に戻ります。'],r'記録には、大小→差の符号→絶対値→括弧の計算の連鎖を一回だけ残します。','直前の展開で得た二項を並べ直します。',[396],anchor='n09-07')
add(6,'decimal-method','小数の平方の計算方法を示す',r'例題は $1.41<\sqrt2<1.42$ の確認です。端の数を分数にすると、$1.41=141/100$、$1.42=142/100$ です。整数の筆算結果 $141^2=19881$、$142^2=20164$ を使います。分母の $100^2=10000$ で割れば、小数の平方に戻せます。',None,None,[],r'携帯で筆算を別に行う必要がないよう、整数計算の内訳は補助欄にも残します。次の穴では小数への変換を行います。','',[399,400],role='example',extra={'calculationSupport':r'141^2=141(100+40+1)=14100+5640+141=19881;\quad142^2=14200+5680+284=20164'})
add(6,'p001-q08-left-square','左側の平方を小数へ戻す',r'$1.41^2=19881/10000$ です。小数点を4桁分動かして値を表します。',r'1.41^2=\square',None,['10000で割る位取りを確認します。','二乗する前の値ではありません。','割る数に合わせて小数点の位置を調べます。'],r'左側の平方が求まりました。次に右側を同じ方法で計算します。','分母は100の二乗です。',[400],anchor='n09-p001-q08-left-square',action='calculation')
add(6,'p001-q08-right-square','右側の平方を小数へ戻す',r'$1.42^2=20164/10000$ を小数で表します。',r'1.42^2=\square',None,['整数平方を10000で割ります。','二乗と2倍を区別します。','小数点の移動桁数を確認します。'],r'両端の平方がそろいました。2との大小を別々に判断します。','左側で使った位取りを同じように適用します。',[400],anchor='n09-p001-q08-right-square',action='calculation')
add(6,'p001-q08-lower-sign','左の平方と2を比べる',r'左側の平方と $2$ を比較します。整数部分を先に見ると大小を判断できます。',r'1.9881\ \square\ 2',None,['1点台と2の大小を比較します。','二つは同じ数ではありません。'],r'次に、右側の平方との比較を加えます。','小数の整数部分を見ます。',[400],anchor='n09-p001-q08-lower-sign',action='judgment')
add(6,'p001-q08-upper-sign','2と右の平方を比べる',r'$2$ と $2.0164$ は整数部分が同じです。小数部分を比べます。',r'2\ \square\ 2.0164',None,['小数部分が正であることを確かめます。','小数部分に違いがあります。'],r'二つの比較を同じ順序で接続します。','2を2.0000として比べます。',[400],anchor='n09-p001-q08-upper-sign',action='judgment')
add(6,'08','計算と比較を一つに記録する',r'両端の平方と、2を挟む二つの不等号が求まりました。左の平方から右の平方へ、対応を保って並べます。',r'\square',None,['両端の平方計算と比較の向きを個別に確認します。','左端と右端を入れ替えていませんか。','2の位置を二つの平方の間に置きます。'],r'平方した値の挟みが完成しました。次は非負性を確認して元へ戻します。','四つの直前の結果を同じ順序で使います。',[400],anchor='n09-08',action='meaning')
add(6,'09','非負性を使って根号を挟む',r'両端 $1.41,1.42$ と $\sqrt2$ は正です。非負の範囲で平方の大小と元の大小が対応するので、いまの挟みを元の数の挟みに戻します。',r'\square',None,['両端と根号の値を対応する順で戻します。','二乗した値をそのまま元の数の端点にしていませんか。','根号と整数2を取り違えていませんか。'],r'近似の暗記ではなく、厳密な小数平方と非負性から確認できました。','左の平方は左端の数、右の平方は右端の数に対応します。',[401],anchor='n09-09')
add(7,'parts-target','残りに課す条件を先に示す',r'例題は $-2.1$ を「整数＋0以上1未満の数」に分けることです。実数 $x$ を $x=n+r$ と書き、$n$ は整数、残り $r$ は $0\le r<1$ にそろえます。この条件は $n\le x<n+1$ と同じです。まず整数を選ぶ準備をします。',None,None,[],r'見た目の整数の桁だけを取り出す操作とは違います。','',[403,406,407,409],role='example')
add(7,'q10-reject-truncation','候補-2の残りを調べる',r'整数を $-2$ とした候補を調べます。残りは、元の数からその整数を引いて求めます。',r'-2.1-(-2)=\square','-0.1',[('0.1','負の数を引いた後の符号を確認します。'),('-4.1','負の数を引く計算と、負の数を足す計算を区別します。')],r'この候補では残りが負になり、今回の条件を満たしません。','括弧の前の減号は、括弧内の数の符号を反対にします。',[406,407],action='calculation')
add(7,'10','区間の左端の整数を選ぶ',r'$n\le-2.1<n+1$ を満たす整数を選びます。先ほどの候補より左側にある隣の整数から始めると、残りが非負になるか確かめられます。',r'n=\square',None,['-2を左端にすると左の不等式が成り立ちません。','隣り合う整数の幅は1です。','選んだ整数の次の整数までの区間に入るかを確認します。'],r'選んだ整数と次の整数の間に、$-2.1$ が入りました。ここで初めて元の数直線を表示します。','数直線では、負でも右側ほど大きい数です。',[407,404,405],anchor='n09-10',action='judgment',extra={'figure':{'id':'n09-f01','visibleAfter':'n09-10','sourcePath':'public/assets/math/textbook/numbers/n09-f01.png','reason':'元図の-3/-2ラベルは原Q10の答えを先出しするため、alt/captionも回答後までDOMに出さない。'}})
add(8,'q11-remainder','選んだ整数からの差を計算する',r'残りは $x-n$ です。元の数 $-2.1$ と、選んだ整数 $-3$ を括弧付きで代入します。',r'r=-2.1-(-3)=\square','0.9',[('-0.9','負の数を引く計算の符号を確かめます。'),('-5.1','引き算を足し算と取り違えています。')],r'残りは0以上1未満です。元の数へ足して戻ることも確認します。','-3を引くことは3を足すことです。',[408],action='calculation')
add(8,'11','元の数を整数と残りへ分ける',r'整数と残りを「整数＋残り」の順に並べます。足した結果が元の $-2.1$ になり、残りが条件を満たす形を選びます。',r'-2.1=\square',None,['残りが負なので今回の条件を満たしません。','足し戻すと元の数になるか確認します。','残りの符号と足し戻した値を確認します。'],r'この整数を **整数部分**、残りを **小数部分** といいます。$n\le x<n+1$、$r=x-n$、$0\le r<1$ を組にして記録します。','直前に求めた整数と残りを使います。',[408,409],anchor='n09-11',action='meaning')
add(9,'q12-lower','左側の整数の平方',r'次の例題は $\sqrt{10}$ と $-\sqrt{10}$ の整数部分・小数部分です。まず正の根号を挟みます。候補の整数 $3$ の平方を求めます。',r'3^2=\square','9',[('6','二乗は2倍ではありません。'),('3','同じ数を2回掛けます。')],r'もう一方の端になる整数も調べます。','3を2回掛けます。',[411,412],role='example',action='calculation')
add(9,'q12-upper','右側の整数の平方',r'隣の整数 $4$ の平方を求めます。',r'4^2=\square','16',[('8','二乗は2倍ではありません。'),('4','掛ける数は4自身です。')],r'$9<10<16$ なので、非負性を使って元の数の区間を決められます。','左端と同じ方法を使います。',[412],action='calculation')
add(9,'12','正の根号を隣接整数で挟む',r'$3,\sqrt{10},4$ は非負です。平方の挟みを、この三つの数の大小へ戻します。',r'\square',None,['10を挟む平方数と、その平方根を対応させます。','端点どうしは異なる整数です。','4の平方より10は小さいことを使います。'],r'整数部分は左端の整数から決められます。負の根号の区間も先に調べます。','3と4の平方に戻って確認します。',[412],anchor='n09-12')
add(10,'q13-reverse','負を掛けたときの不等号',r'$3<\sqrt{10}<4$ の各辺に $-1$ を掛けます。負の数を掛けると不等号の向きが逆になります。',r'-3\ \square\ -\sqrt{10}>-4','>',[('<','負の数を掛けたので向きを反対にします。'),('=','元の三つの数は等しくありません。')],r'この並びは大きい順です。次に左右を入れ替えて小さい順に読みます。','全ての辺に同じ負の数を掛けています。',[413],action='judgment')
add(10,'13','小さい順に区間を書く',r'得られた $-3>-\sqrt{10}>-4$ を右から左に読み、小さい順に並べ直します。',r'\square',None,['左右を逆にしたら不等号も読み直します。','端点の符号は平方根を反対にした結果と対応させます。','元の正の根号の区間を反転させます。'],r'負の根号の左端は、正の根号の整数部分に負号を付けただけの数とは異なります。','右端にあった最小の数を先に置きます。',[413],anchor='n09-13')
add(11,'q14-positive-integer','正の根号の整数部分',r'$3<\sqrt{10}<4$ を $n\le x<n+1$ と比べます。左端の整数を選びます。',r'\sqrt{10}\text{ の整数部分}=\square','3',[('4','右端は元の数より大きい数です。'),('10','根号の中の数ではなく、その値の位置を使います。')],r'残りは、元の数からこの整数を引いて作ります。','区間の左端に注目します。',[414],action='judgment')
add(11,'q14-positive-remainder','正の根号の小数部分',r'小数部分の定義 $r=x-n$ に、元の数といまの整数部分を代入します。',r'r=\square',r'\sqrt{10}-3',[(r'4-\sqrt{10}','右端からの距離ではなく、元の数から整数部分を引きます。'),(r'\sqrt{10}','整数部分を引く操作が残っています。')],r'元の区間の各辺から3を引けば、$0<\sqrt{10}-3<1$ と確認できます。','定義のxとnの場所を順に置き換えます。',[414])
add(11,'q14-negative-integer','負の根号の整数部分',r'$-4<-\sqrt{10}<-3$ の左端を、同じ整数部分の定義で読みます。',r'-\sqrt{10}\text{ の整数部分}=\square','-4',[('-3','右端を選ぶと元の数から引いた残りが負になります。'),('3','元の数は負の区間にあります。')],r'正の数の場合と同じく、次は元の数からこの整数を引きます。','負数でも左端の整数を選びます。',[414],action='judgment')
add(11,'q14-negative-remainder','負の根号でも同じ定義を使う',r'$x=-\sqrt{10}$、$n=-4$ を代入すると、$r=-\sqrt{10}-(-4)$ です。引き算を整理します。',r'r=\square',r'4-\sqrt{10}',[(r'\sqrt{10}-4','引く順序は元の数から整数部分です。'),(r'3-\sqrt{10}','整数部分は直前に選んだ値を使います。')],r'負の区間に4を足すと、$0<4-\sqrt{10}<1$ です。二つとも小数部分の条件を満たしました。','負の整数を引くので、符号を反対にして足します。',[414])
add(11,'14','正負の組をまとめて検算する',r'順序は $\sqrt{10}$、次に $-\sqrt{10}$。各組は「整数部分、小数部分」です。いま求めた四つの結果を対応する場所に置きます。',r'\square',None,['負数でも区間の左端の整数を選びます。','小数部分は元の数からその整数部分を引きます。','正の根号の左端は3です。'],r'両方とも、整数部分と小数部分を足して元へ戻り、小数部分は0以上1未満です。N10では、根号の非負性と平方の値を組にした確認を、積・商の証明へ使います。','四つの結果を、元の数と組の順序に合わせます。',[414,415],anchor='n09-14',action='meaning')
# N10: elementary squaring precedes the product/quotient theorem, avoiding circular proof.
unit='n10'
add(1,'q01-square','候補の平方を計算する',r'例題は $\sqrt{125}$ を、根号の中の数が小さい形に表すことです。$125=25\cdot5$ なので、$t>0$ として候補 $t\sqrt5$ を調べます。積の平方は各因子の平方の積です。ここではまだ根号の積の公式を使いません。',r'(t\sqrt5)^2=t^2(\sqrt5)^2=\square',r'5t^2',[(r'5t','tも2乗されます。'),(r'25t^2','根号を2乗した値を確認します。')],r'元の正の平方根と等しいために、候補の平方は125である必要があります。','平方根の定義から(√5)²を求めます。',[419,420,421],role='example')
add(1,'01','同じ数で割ってtの平方を取り出す',r'$5t^2=125$ の両辺を5で割ります。左の係数を1にして、右辺も同じ操作で計算します。',r'\square',None,['2乗されているtを、そのままtに変えません。','左辺を5で割ったら右辺も5で割ります。','125を5で割る計算を確かめます。'],r'tの平方が求まりました。次は最初に置いた正の条件を使います。','左の係数を1にする操作を両辺に行います。',[421],anchor='n10-01')
add(1,'q02-sign','正の条件で候補を一つに絞る',r'$t^2=25$ を満たす実数は $5$ と $-5$ です。ここでは $t>0$ として候補を探したので、条件を満たす方を選びます。',r't=\square','5',[('-5','最初の正の条件に戻ります。'),(r'\pm5','正の条件を使うと一つに決まります。')],r'このtを候補の式へ戻します。','平方の条件と符号の条件を両方使います。',[422],action='judgment')
add(1,'02','候補へ代入して平方根を確定する',r'候補は $t\sqrt5$ でした。求めた正のtを代入します。候補は正で、平方すると125なので、125の正の平方根と等しいと確定できます。',r'\sqrt{125}=\square',None,['正の平方根を表す符号を選びます。','tの平方ではなくt自身を代入します。','候補で残した根号の中身は5です。'],r'平方の値と正の符号を確認した、この手順を一般の積・商へ広げます。','候補の文字tの位置だけを置き換えます。',[422,423],anchor='n10-02')
add(2,'q03-expand','積を平方して因子をまとめる',r'ここからは **証明** です。条件は $a>0,b>0$。$(\sqrt a\sqrt b)^2$ を同じ積の2回の掛け算と読み、実数の積の交換・結合で同じ因子をまとめます。',r'(\sqrt a\sqrt b)^2=\square',r'(\sqrt a)^2(\sqrt b)^2',[(r'(\sqrt a)^2+(\sqrt b)^2','元は和ではなく積です。'),(r'\sqrt a(\sqrt b)^2','どちらの因子も2回ずつ現れます。')],r'各因子の平方には平方根の定義を使えます。','同じ因子を二つずつ集めます。',[424,425,426],role='proof')
add(2,'03','定義から積の平方を求める',r'$(\sqrt a)^2=a$、$(\sqrt b)^2=b$ を、いまの積へそれぞれ戻します。',r'(\sqrt a\sqrt b)^2=\square',None,['定義を代入しても、因子どうしの積は残ります。','平方した後の値と元の根号を区別します。','平方根の平方は中身に戻ります。'],r'積の平方がabであることが分かりました。符号の確認がまだ必要です。','二つの因子を、それぞれ定義どおり置き換えます。',[426],anchor='n10-03',role='proof')
add(2,'q04-sign','積の符号を確かめる',r'$a>0,b>0$ なので、$\sqrt a>0,\sqrt b>0$ です。正の数どうしの積の符号を判断します。',r'\sqrt a\sqrt b\ \square\ 0','>',[('<','二つの因子はどちらも正です。'),('=','二つとも0より大きいので積は0ではありません。')],r'平方の値に加え、候補が正であることも確認できました。','元の条件から各因子の符号を確認します。',[427],action='judgment',role='proof')
add(2,'04','正の平方根として積を確定する',r'候補は正で、平方はabです。abも正なので、この二条件から正の平方根として表します。',r'\sqrt a\sqrt b=\square',None,['候補は正であることを使います。','abは平方した後の値です。','平方根の積と和は区別します。'],r'条件 $a>0,b>0$ とともに積の性質を記録します。次は同じ二確認を商で行います。','正で、2乗するとabになる数を根号で表します。',[427],anchor='n10-04',role='proof')
add(3,'q05-denominator','割る前に0でないことを確かめる',r'商 $\sqrt a/\sqrt b$ を調べます。条件 $b>0$ から、分母の平方根は正です。割り算ができることを確認します。',r'\sqrt b\ \square\ 0',r'\ne',[('=','bは0ではなく正です。'),('<','根号の値は非負です。')],r'分母が0でないので、商を定義して計算できます。','正の数は0と等しいかを確認します。',[428],action='judgment',role='proof')
add(3,'q05-square','商の平方を分子分母へ分ける',r'分母が0でないと確認したので、商を2回掛け、分子と分母をそれぞれ平方にまとめます。',r'\left(\frac{\sqrt a}{\sqrt b}\right)^2=\square',r'\frac{(\sqrt a)^2}{(\sqrt b)^2}',[(r'\frac{\sqrt a}{(\sqrt b)^2}','分子も2回掛けられます。'),(r'\frac{(\sqrt b)^2}{(\sqrt a)^2}','分子と分母の順を保ちます。')],r'積の証明と同じように、各平方へ定義を代入します。','二つの同じ分数の積を書いてみます。',[429],role='proof')
add(3,'05','商の平方を定義で計算する',r'分子は $(\sqrt a)^2=a$、分母は $(\sqrt b)^2=b$ です。分子と分母の対応を保って戻します。',r'\left(\frac{\sqrt a}{\sqrt b}\right)^2=\square',None,['分子と分母の順が逆です。','平方した後の値を根号のままにしません。','元の操作は積でなく商です。'],r'商の平方が求まりました。次に元の商の符号を見ます。','分子へa、分母へbを対応させます。',[429],anchor='n10-05',role='proof')
add(3,'q06-sign','商の符号を確かめる',r'$\sqrt a,\sqrt b$ はどちらも正です。正の数を正の数で割った商の符号を判断します。',r'\frac{\sqrt a}{\sqrt b}\ \square\ 0','>',[('<','分子と分母の符号は同じです。'),('=','分子は0ではありません。')],r'商も正であり、平方した値と合わせて一つに決められます。','分子・分母の両方の符号を使います。',[430],action='judgment',role='proof')
add(3,'06','商を正の平方根として表す',r'商は正で、平方は $a/b$ です。正の平方根の定義で根号一つにまとめます。',r'\frac{\sqrt a}{\sqrt b}=\square',None,['正の商を表す符号を選びます。','a/bは平方した後の値です。','商を積に変えません。'],r'積と商の証明が終わりました。条件 $a>0,b>0$、分母が0でないこと、各候補の正の符号を、公式と一緒に記録します。','2乗した値と、元の商が正であることを合わせます。',[430,431,432],anchor='n10-06',role='property')
add(4,'q07-product','積の性質を具体的な数に使う',r'例題は $\sqrt6\sqrt8$ です。6と8が正なので、証明済みの積の性質を使い、根号の中の二数を掛けます。',r'\sqrt6\sqrt8=\sqrt{\square}','48',[('14','元の演算は足し算ではありません。'),('68','数を並べるのではなく掛けます。')],r'根号の中に、平方数の因子を探します。','6と8の積を計算します。',[435,436],role='example',action='calculation')
add(4,'07','平方数と残りの積に分ける',r'$48=16\cdot3$、$16=4^2$ を使います。元の積から、一つの根号にまとめた式と因数分解を等号でつなぎます。',r'\square',None,['積を和に置き換えていませんか。','示した二因子を掛けて元の数になるか確認します。','残りの因子を取り違えていませんか。'],r'中の平方数は、次の段階でその平方根を外へ出すために使います。','分けた二因子の積が直前の値になるか確認します。',[436],anchor='n10-07')
add(4,'q08-factor','平方数の平方根を外へ出す',r'積の公式を逆に使うと $\sqrt{16\cdot3}=\sqrt{16}\sqrt3$ です。非負の平方根 $\sqrt{16}$ を求めます。',r'\sqrt{16}=\square','4',[('16','根号を残したままの中の数です。'),(r'\pm4','根号の値は一つです。')],r'残りの因子は根号の中に残します。','2乗すると16になる非負の数を選びます。',[437],action='judgment')
add(4,'08','元の積の答えへ戻す',r'外へ出す数と、残った $\sqrt3$ を掛けた式で答えます。',r'\sqrt6\sqrt8=\square',None,['平方数そのものを係数にしません。','残りの因子は3です。','外へ出す数は16の非負の平方根です。'],r'計算記録は、積→一つの根号→平方因子→外へ出した形の連鎖です。','いま求めた係数と残った根号を掛けます。',[437],anchor='n10-08')
add(5,'q09-left','和は各項を別々に変形する',r'例題は $\sqrt8+\sqrt{50}$。今回は **和** なので、積の公式で一つの根号にはできません。まず $8=4\cdot2$ として左の項を変形します。',r'\sqrt8=\sqrt4\sqrt2=\square',r'2\sqrt2',[(r'4\sqrt2','平方数そのものではなく、その平方根を出します。'),(r'2\sqrt4','残す因子は2です。')],r'足し算を残したまま、右の項も変形します。','中の平方数4は、何を二乗した数か確認します。',[439,440,441],role='example')
add(5,'q09-right','右の項も同じ方法で変形する',r'$50=25\cdot2$ を使い、平方数25の非負の平方根を外へ出します。',r'\sqrt{50}=\sqrt{25}\sqrt2=\square',r'5\sqrt2',[(r'25\sqrt2','外へ出すのは平方根です。'),(r'5\sqrt{10}','残す因子は2です。')],r'左右の項が、同じ根号の部分をもつ形になりました。','25の非負の平方根を求めます。',[441])
add(5,'09','足し算を保って元の式へ戻す',r'各項の変形を、元の足し算の位置に戻します。この段階では、まだ二項を足し合わせません。',r'\sqrt8+\sqrt{50}=\square',None,['根号の和を一つの根号へまとめる公式は使っていません。','右の平方数の平方根を係数にします。','二つの項の残りの根号を確認します。'],r'次は共通する根号の部分を一つのまとまりとして、係数を集めます。','左の項と右の項を、それぞれ直前の結果へ置き換えます。',[441],anchor='n10-09')
add(5,'q10-coefficients','同じまとまりの係数を足す',r'共通する $\sqrt2$ を分配法則でくくると、$2\sqrt2+5\sqrt2=(2+5)\sqrt2$ です。括弧の中だけを計算します。',r'(2+5)\sqrt2=\square\sqrt2','7',[('10','足し算と掛け算を区別します。'),('3','元の式は差ではなく和です。')],r'根号の部分は変えずに、係数だけをまとめました。','同じまとまりが何個あるかを数えます。',[442],action='calculation')
add(5,'10','和の最終結果を答える',r'求めた係数と、共通していた根号の部分を合わせて元の式の答えにします。',r'\sqrt8+\sqrt{50}=\square',None,['根号の中身は足し合わせていません。','足したのは数の係数です。','係数の足し算を確認します。'],r'積の性質は各項の変形に使い、足し算の処理には分配法則を使いました。','直前に求めた係数をそのまま使います。',[442],anchor='n10-10')
add(6,'q11-formula','平方の公式を対象に対応させる',r'例題は $(\sqrt2-\sqrt3)^2$。既習の公式で $A=\sqrt2,B=\sqrt3$ と対応させます。使う公式を選びます。',r'\square',r'(A-B)^2=A^2-2AB+B^2',[(r'(A-B)^2=A^2-B^2','平方には二つの交差項があります。'),(r'(A-B)^2=A^2+2AB+B^2','元の式は和ではなく差です。')],r'選んだ公式のAとBへ、二つの根号を代入します。','同じ差を2回掛けたときの四つの項を思い出します。',[444,445],role='example',action='judgment')
add(6,'11','公式へ代入して展開する',r'$(\sqrt2)^2=2$、$(\sqrt3)^2=3$ です。中項の係数と符号を残し、根号の積は次の段階へ残します。',r'(\sqrt2-\sqrt3)^2=\square',None,['差の平方なので中項の符号を確認します。','中項には二つの交差項の係数があります。','最後の項は√3の平方です。'],r'次は根号の積と、普通の数の和を別々に計算します。','公式の三項と、A/Bの対応を保ちます。',[445],anchor='n10-11')
add(6,'q12-product','中項の根号の積を整理する',r'証明済みの積の性質を、中項の $\sqrt2\sqrt3$ に使います。外の係数 $-2$ はそのまま残します。',r'\sqrt2\sqrt3=\square',r'\sqrt6',[(r'\sqrt5','元の演算は積です。'),('6','根号の積を一つの根号にする段階です。')],r'残った普通の数は $2+3=5$ です。係数と合わせて元の式をまとめます。','根号の中の数どうしを掛けます。',[446])
add(6,'12','定数と中項をまとめる',r'定数の和と、整理した中項を合わせます。中項の $-2$ は元の公式から残っている係数です。',r'(\sqrt2-\sqrt3)^2=\square',None,['中項は負です。','中項の係数を落とさないようにします。','普通の数の和を確認します。'],r'公式の選択→代入→根号の積→同類項の順で進めました。','直前の二種類の計算結果を合わせます。',[446],anchor='n10-12')
add(7,'q13-identity','和と差の積の構造を見つける',r'例題は $(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)$。$A=\sqrt7,B=\sqrt2$ と対応する和と差の積です。使う公式を選びます。',r'\square',r'(A+B)(A-B)=A^2-B^2',[(r'(A+B)(A-B)=A^2+B^2','交差項は消え、B²の符号は負です。'),(r'(A+B)(A-B)=(A-B)^2','二つの括弧は同じではありません。')],r'公式へ代入すると、根号の平方だけが残ります。','展開すると+ABと-ABが打ち消し合います。',[448,449],role='example',action='judgment')
add(7,'13','平方差を計算する',r'$(\sqrt7)^2-(\sqrt2)^2$ の二つの平方を定義で置き換え、差を計算します。',r'(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=\square',None,['平方差なので最後は引き算です。','打ち消し合う交差項を残していませんか。','√2の平方は中の数に戻ります。'],r'和に対応する差を掛けると根号がなくなりました。この仕組みを分母へ使います。','平方の定義を両方の項へ適用します。',[449,450],anchor='n10-13')
add(8,'14','分数の値を保つ操作を確認する',r'例題は $1/(2\sqrt3)$ の分母の根号をなくすことです。分母だけを変えると値が変わります。$c\ne0$ なら $c/c=1$ なので、この1を掛ける方法を文章で選びます。',None,None,['分母だけを掛けると分子との比が変わります。','分子へ足す操作では比が保たれません。','根号は理由なく消せません。'],r'同じ0でない数を両方へ掛ければ、元の分数と等しいまま変形できます。','分数全体へ1を掛けることと同じになる操作を考えます。',[453,454,455],anchor='n10-14',action='meaning',role='example')
add(8,'q15-factor','分母の根号を平方にする因子',r'分母の $\sqrt3$ と掛けて平方を作る因子を選びます。$\sqrt3>0$ なので、この数を分子と分母へ掛けても割り算が定義できます。',r'\sqrt3\times\square=(\sqrt3)^2',r'\sqrt3',[('3','同じ根号の二つの積を平方としてまとめます。'),(r'\sqrt2','同じ数を二つ掛ける形にします。')],r'選んだ因子を、分子にも分母にも掛けた分数を作ります。','二乗は同じ数を二つ掛ける形です。',[456,457],action='judgment')
add(8,'15','掛けた直後の等価な分数を作る',r'元の分数へ、選んだ数の「同じ数÷同じ数」を掛けます。分子と分母をそれぞれまとめ、分母では根号の二乗を残します。',r'\square',None,['因子を分母にも掛ける必要があります。','掛ける分数が1に等しいか確認します。','分母の根号を平方にできる同じ因子を使います。'],r'元の分数と等しいことを示したまま、分母の平方を計算できる形になりました。','分子と分母の双方へ同じ因子があるか確かめます。',[457],anchor='n10-15')
add(8,'q16-denominator','分母全体の値を計算する',r'分母は $2(\sqrt3)^2$ です。根号の平方を先に計算し、元からあった係数2を掛けます。',r'2(\sqrt3)^2=\square','6',[('3','元からあった係数2も残します。'),('2','平方の値を掛ける操作が残っています。')],r'分子は変えず、求めた分母の値を戻します。','根号の平方と、その外の係数を別々に扱います。',[458],action='calculation')
add(8,'16','分母の根号のない形を得る',r'直前の分数で、分母だけを計算結果に置き換えます。分子にも同じ因子を掛けたことを確認します。',r'\frac1{2\sqrt3}=\square',None,['元の係数2を分母に含めます。','分子は掛けた因子がそのまま残っています。','元の分数と同じ形のままでは根号がなくなっていません。'],r'このように値を変えず、分母に根号のない形に直すことを **分母を有理化する** といいます。操作の根拠と名前を組にして記録します。','分子と分母の現在の値をそのまま使います。',[458,459],anchor='n10-16')
add(9,'q17-factor','和の分母へ対応する差を選ぶ',r'例題は $\sqrt3/(\sqrt3+\sqrt2)$。分母全体を $A+B$ と見て、直前に確認した和と差の積を作る因子を選びます。',r'(\sqrt3+\sqrt2)\times\square',r'\sqrt3-\sqrt2',[(r'\sqrt3+\sqrt2','和どうしの積だと交差項が残ります。'),(r'\sqrt3','分母全体の和に対応する因子を選びます。')],r'選んだ差を分子にも分母にも掛けます。その前に0でないことを確認します。','AとBの位置を変えずに、間の符号を差にします。',[461,462,463],role='example',action='judgment')
add(9,'q17-nonzero','掛ける差が0でない根拠',r'$3>2$ で、二つの根号は正です。非負の平方の比較から $\sqrt3>\sqrt2$。両辺から $\sqrt2$ を引いて差の符号を判断します。',r'\sqrt3-\sqrt2\ \square\ 0','>',[('=','平方の異なる非負の二数は等しくありません。'),('<','直前の大小から同じ数を引きます。')],r'この差は0でないので、同じ差を分子と分母に掛けて値を保てます。','右辺で同じ数どうしを引いた結果を使います。',[463],action='judgment')
add(9,'17','選んだ因子で等価な分数を作る',r'元の分数へ、いま選んだ差を分子・分母の両方に置いた「1」を掛けます。まだ展開は行いません。',r'\square',None,['和に和を掛けても平方差にはなりません。','和全体に対応する差を使います。','分母全体に対応する差を使います。'],r'次に分母、続いて分子と、計算対象を分けて進めます。','掛ける因子が分子と分母で同じか確認します。',[463],anchor='n10-17')
add(10,'18','分母を平方差で計算する',r'分母は $(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)$ です。和と差の積を平方差にしてから数の差を求めます。',r'(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)=\square',None,['平方差なので二つの平方を引きます。','交差する項は打ち消し合います。','平方根を2乗して中の数へ戻します。'],r'分母の値が求まりました。次は分子だけを展開します。','A²-B²の二つの平方に対応させます。',[464],anchor='n10-18')
add(10,'q19-distribute','分子へ分配法則を適用する',r'分子は $\sqrt3(\sqrt3-\sqrt2)$。外の因子を、括弧内の両項へ掛けます。',r'\sqrt3(\sqrt3-\sqrt2)=\square',r'\sqrt3\sqrt3-\sqrt3\sqrt2',[(r'\sqrt3\sqrt3-\sqrt2','外の因子は二項目にも掛かります。'),(r'\sqrt3\sqrt3+\sqrt3\sqrt2','元の差の符号を残します。')],r'平方と根号の積をそれぞれ計算し、分母の結果と合わせます。','二つの項の両方に同じ因子を掛けます。',[465])
add(10,'19','分数全体を最後まで整理する',r'分子の最初の積は $3$、二つ目の積は $\sqrt6$ です。分母は直前に求めた $1$ なので、分子の差がそのまま全体の値になります。',r'\frac{\sqrt3}{\sqrt3+\sqrt2}=\square',None,['元の括弧の差の符号を保ちます。','分子の最初の積は√3の平方です。','二つ目の積に余分な係数を付けません。'],r'元の分数→1を掛ける→分母と分子の計算→最終形を、同じ等式記録として残します。','分子の二項と、分母1を合わせます。',[465],anchor='n10-19')
add(11,'q20-factor','支援を減らして因子を選ぶ',r'例題は $(2-\sqrt3)/(2+\sqrt3)$ の有理化です。分母全体が和なので、平方差を作る因子を自分で選びます。',r'(2+\sqrt3)\times\square',r'2-\sqrt3',[(r'2+\sqrt3','分母の和に対応する差を使います。'),(r'\sqrt3','和全体を平方差へ変える因子を選びます。')],r'$2^2=4>3$ と $2,\sqrt3>0$ から、選んだ差は正で0ではありません。分子・分母へ同じ差を掛けられます。','直前の例題のA+Bに、今回の二項を対応させます。',[467,468],role='example',action='judgment')
add(11,'20','掛けた直後の分数を作る',r'分子は同じ差どうしの積になり、分母は和と差の積になります。分母を平方差へ移した段階まで書きます。',r'\square',None,['分母は和と差の積であり、和の平方ではありません。','使う因子は差です。','平方差の符号を確認します。'],r'次は、分母と分子を別々に計算します。','分子・分母それぞれに掛けた因子を確かめます。',[468],anchor='n10-20')
add(11,'q21-denominator','分母の平方差を計算する',r'直前の分母 $4-3$ を計算します。分子の平方は次の段階に残します。',r'4-3=\square','1',[('7','平方差は引き算です。'),('-1','左の数から右の数を引きます。')],r'分母が1なので、分子を計算すれば全体の値が決まります。','元の式の差の順序を保ちます。',[469],action='calculation')
add(12,'q21-expand','分子の平方を三項へ展開する',r'分子は $(2-\sqrt3)^2$。先ほど使った差の平方の公式へ $A=2,B=\sqrt3$ を入れます。',r'(2-\sqrt3)^2=\square',r'4-4\sqrt3+3',[(r'4+4\sqrt3+3','差の平方の中項は負です。'),(r'4-2\sqrt3+3','中項の係数は-2ABです。')],r'根号を含む項を残し、普通の数どうしを集めます。','公式の中項-2ABへ二つの数を代入します。',[469])
add(12,'q21-constants','普通の数だけを合計する',r'$4-4\sqrt3+3$ の普通の数は $4$ と $3$。加法の交換・結合でまとめます。',r'(4+3)-4\sqrt3=\square-4\sqrt3','7',[('1','普通の数は差ではなく和です。'),('12','二つの数は掛けるのではなく足します。')],r'分母1と合わせて、元の有理化の答えをまとめます。','根号を含まない二項を足します。',[469],action='calculation')
add(12,'21','有理化の最終結果を完成させる',r'分母が1で、分子の計算も終わりました。元の分数に等しい最終形を選びます。',r'\frac{2-\sqrt3}{2+\sqrt3}=\square',None,['差の平方の中項の符号を保ちます。','中項の係数を確認します。','普通の数の和を確認します。'],r'掛ける因子の判断、0でない条件、分母の処理、分子の展開を順に進めました。次の不等式では、変形で保つ対象を等しさから大小へ広げます。','直前に確定した分子と分母をそのまま使います。',[469,470],anchor='n10-21')

# Resolve real leakage findings without hiding the original problem or operands.
for n in rows:
 if n['id'] in ('n09-p001-q08-lower-sign','n09-p001-q08-upper-sign'):
  n['before']=n['before'].replace('整数部分','小数点より左側の数')
 if n['id']=='n10-q01-square':n['before']='根号は非負の値を表し、2乗すると中の数に戻ることを使います。'+n['before']
 if n['id']=='n09-05':
  n['after']=r'すべての実数 $a$ で $\sqrt{a^2}=|a|$ です。記録する二つの場合は、$a\ge0$ なら $\sqrt{a^2}=a$、$a<0$ なら $\sqrt{a^2}=-a$。N08の絶対値の二場合と同じ対応です。'
  n['extra']['table']={'caption':'根号の非負の値を選ぶ場合分け','headers':['条件','結果'],'rows':[[r'a\ge0',r'\sqrt{a^2}=a'],[r'a<0',r'\sqrt{a^2}=-a']]}
 if n['id']=='n09-parts-target':n['after']=r'分け方は $x=n+r$、$n$ は整数、$0\le r<1$。したがって $n\le x<n+1$、$r=x-n$ を使います。見た目の整数の桁だけを取り出す操作とは違います。'
 if n['id']=='n09-14':n['extra']['table']={'caption':'正負の根号の整数部分と小数部分','headers':['元の数','整数部分','小数部分'],'rows':[[r'\sqrt{10}','3',r'\sqrt{10}-3'],[r'-\sqrt{10}','-4',r'4-\sqrt{10}']],'visibleAfter':'n09-14'}
 if n['id']=='n10-13':n['after']=r'記録する道具は $(A+B)(A-B)=A^2-B^2$ です。今回の根号の和に、対応する差を掛けると根号がなくなりました。この仕組みを分母へ使います。'
 if n['id']=='n10-14':n['after']=r'$c\ne0$ のとき $c/c=1$。分子と分母の両方へ同じ0でない数を掛けるので、元の分数と等しいまま変形できます。'
 if n['id']=='n09-q01-positive':
  n.update(answer=None,itemId=None,wrong=[],formula=None,role='example',before=r'例題は、2乗すると $16$ になる実数をすべて求めることです。正の候補は $4$ で、$4^2=4\times4=16$ と確かめられます。これは計算方法を示す手本です。',after=r'正の候補の手本を見たので、次は符号が反対の候補を自分で確かめます。')
 if n['id']=='n09-q04-nonnegative':
  n['before']=r'一般の実数 $a$ を調べます。$a\ge0$ のとき、候補 $a$ と $-a$ のうち、この場合全体で非負の値を表す式を選びます。$a=0$ で二つが同じになることも含めて考えます。'
  n['after']=r'$a\ge0$ の場合は $\sqrt{a^2}=a$ です。境界 $a=0$ では両候補とも0ですが、この式で場合全体を表せます。次は負の場合です。'
  n['formula']=r'\sqrt{a^2}=\square'
  n['formula']=r'\square';n['answer']=r'\sqrt{a^2}=a';n['wrong']=[(r'\sqrt{a^2}=-a','aが正の場合にも非負になる式を選びます。'),(r'\sqrt{a^2}=a^2','平方の値ではなく平方根の値を表します。')]
 if n['id']=='n09-q04-negative':n['formula']=r'\sqrt{a^2}=\square'
 if n['id']=='n10-q02-sign':n['before']=r'$t^2=25$ では符号が反対の二つの実数が候補になります。最初の条件 $t>0$ も満たす方を選びます。'
 if n['id']=='n10-q15-factor':
  n['before']=r'分母の $\sqrt3$ と掛けて平方を作る因子を $c$ とします。どの因子を掛けるか、$c$ の式を選びます。分母が0になる操作はできません。'
  n['formula']=r'\square';n['answer']=r'c=\sqrt3';n['wrong']=[('c=3','同じ根号の二つの積を平方としてまとめます。'),(r'c=\sqrt2','同じ数を二つ掛ける形にします。')]
  n['after']=r'$c=\sqrt3$ なら、$\sqrt3\times\sqrt3=(\sqrt3)^2$ になります。また $\sqrt3>0$ なので $c$ は0ではありません。同じ因子を分子にも分母にも掛けます。'
# Stable per-unit dependency facts; references only point to already established results.
serial=0
def parts(s):
 global serial
 out=[]
 for t in re.split(r'(\$[^$]+\$|\*\*[^*]+\*\*)',s):
  if not t:continue
  serial+=1;p=f'n0910-part-{serial:05}'
  if t.startswith('$'):out.append(dict(id=p,kind='math',latex=display(t[1:-1]),mathRole='expression',semanticRef=p))
  elif t.startswith('**'):out.append(dict(id=p,kind='term',termId=p,text=t[2:-2],usage='first_definition'))
  else:out.append(dict(id=p,kind='text',text=t))
 return out
def paragraph(n,s,suffix):return dict(id=n['id']+'-'+suffix,kind='paragraph',parts=parts(s))
def result_group(n,latex,bid):
 # Preserve mixed =/< chains; never describe a comparison as an equality.
 terms=re.split(r'(\\le(?![A-Za-z])|\\ge(?![A-Za-z])|[=<>])',latex) if r'\begin{' not in latex else [latex]
 vals=terms[::2];ops=terms[1::2]
 relation=('equality' if all(x=='=' for x in ops) else 'inequality') if ops else 'independent'
 return dict(id=n['id']+'-equation',kind='relationChain',relation=relation,expressions=[dict(id=n['id']+'-equation-expr-'+str(i),parts=parts('$'+v+'$')) for i,v in enumerate(vals)],operators=ops,transformRef=n['id'],layoutProfile='aligned-transform' if ops else 'single',numbering=dict(stableId=bid,mode='group-end'))
for u in units:
 ur=[n for n in rows if n['unit']==u];source=json.loads((B/f'evidence/{u.upper()}_SOURCE_INDEX.json').read_text());nodes=[]
 for i,n in enumerate(ur):
  n['resultId']=n['id']+'-result';n['requires']=[ur[i-1]['id']+'-result'] if i else []
  stage=int(n['stageId'].split('-')[-1]);refs=[]
  if u=='n09':
   if stage==5:refs=['n09-05-result']
   if stage==8:refs=['n09-parts-target-result','n09-10-result']
   if stage==9:refs=['n09-11-result']
   if stage==10:refs=['n09-12-result']
   if stage==11:refs=['n09-11-result','n09-12-result','n09-13-result']
  else:
   if stage in (4,5,6,7):refs=['n10-04-result']
   if stage==9:refs=['n10-13-result','n10-14-result']
   if stage==10:refs=['n10-17-result']
   if stage==11:refs=['n10-13-result','n10-14-result']
   if stage==12:refs=['n10-20-result','n10-q21-denominator-result','n10-q11-formula-result']
  n['knownRefs']=list(dict.fromkeys(refs+([ur[i-1]['id']+'-result'] if i and ur[i-1]['stageId']!=n['stageId'] else [])))
  n['requires']=list(dict.fromkeys(n['requires']+n['knownRefs']))
  before=[paragraph(n,n['before'],'before')];after=[paragraph(n,n['after'],'after')]
  if n['answer'] is not None:
   form='text' if n['itemId']=='n10-14' else 'formula'
   slot=dict(id=n['id']+'-slot',kind='answerSlot',interactionId=n['itemId'],semanticRef=n['itemId']);bid=n['id']+'-interaction'
   if n['formula']:
    a,b=n['formula'].split(r'\square');p=parts('$'+a+'$') if a else [];p.append(slot)
    if b:p+=parts('$'+b+'$')
    before.append(dict(id=bid,kind='relationChain',relation='independent',expressions=[dict(id=bid+'-expr',parts=p)],operators=[],transformRef=n['id'],layoutProfile='single',numbering=dict(stableId=bid,mode='group-end')))
    n['resolvedFormula']=n['formula'].replace(r'\square',display(n['answer']))
    after.insert(0,result_group(n,n['resolvedFormula'],bid))
   else:before.append(dict(id=bid,kind='paragraph',parts=[slot]));after.insert(0,paragraph(n,n['answer'],'answer'))
  node=dict(id=n['id'],problemId=u,sourceRefs=n['sourceRefs'],requires=n['requires'],produces=[n['resultId']],role=n['role'],goal=n['goal'],purpose=n['goal'],operation=dict(kind=n['action'],targets=n['sourceRefs'],nextUseIds=[]),before=before,after=after,contextNeed=[dict(id=n['id']+'-context',problemId=u,factIds=n['knownRefs'],reason='前の段階で確定した条件と結果を、この操作で使用する。')] if n['knownRefs'] else [])
  if n['answer'] is None:node['noBlankReason']='未知の定義・境界・計算手順を教える箇所。続く適用で判断を穴にする。'
  else:node['interaction']=dict(id=n['itemId'],targetPath='interaction.expected.value',learningAction=n['action'],whyHere=n['goal'],prerequisiteIds=n['requires'],expected=dict(value=n['answer'],form=form,semanticType=n['action']),choices=[dict(id=n['id']+'-correct',content=n['answer'],feedback=n['after'])]+[dict(id=n['id']+'-wrong-'+str(j),content=x,misconception=y,feedback=y) for j,(x,y) in enumerate(n['wrong'])],hints=[n['hint']],answerInsertion=dict(blockId=bid,slotId=n['id']+'-slot'))
  nodes.append(node)
 # Include structural and unnumbered source passages in the coverage table; no silent omissions.
 coverage=[]
 for b in source['blocks']:
  matched=[n['id'] for n in ur if b['id'] in n['sourceRefs']]
  structural=not b['math'] and (not b['text'] or b['text'] in ['例題','証明','導出','確認'] or b['text'].startswith(('N09','N10','第2節','第3節')) or b['id'] in ['word-p-000397','word-p-000433','word-p-000451'])
  assert matched or structural,('unmapped important passage',b)
  coverage.append(dict(sourceId=b['id'],nodeIds=matched,disposition='taught' if matched else 'structural',reason='原問・条件・無番号説明を該当nodeへ統合' if matched else '見出し・役割表示・次節見出し・画像位置は段階構造へ保持'))
 ir=dict(schemaVersion='production-ir/1',unitId=units[u]['unitId'],subject='math',mode='textbook',sourceHash=source['documentHash'],sourceBlocks=[dict(id=b['id'],kind=b['kind']) for b in source['blocks']],coverage=coverage,initialFacts=['real-arithmetic','square-identities','n08-absolute-value-cases','nonnegative-square-order'],nodes=nodes)
 write(u.upper()+'_NODE_DESIGN.json',dict(status='PROPOSED',nodes=ur));write(u.upper()+'_IR.json',ir);write(u.upper()+'_SOURCE_COVERAGE.json',coverage)
 oldids=set(old[u]);newids={n['itemId'] for n in ur if n['itemId']};assert oldids<=newids,(u,oldids-newids)
 assert len(newids)==sum(n['answer'] is not None for n in ur)
 for n in ur:
  if n['anchor']:assert n['answer']==old[u][n['itemId']]['answer']
 lines=[f'# {u.upper()} 全ノード具体設計','',f'Status: PROPOSED。{len(ur)}node / {len(newids)}回答 / {len(set(n["stageId"] for n in ur))}段階。既存{len(oldids)}採点ID・正答保持。ここは制作者用で、正答や誤答を含みます。','']
 for n in ur:
  lines += [f'## {n["id"]} — {n["goal"]}','',f'段階：{n["stageId"]} / 役割：{n["role"]} / 原資料：'+', '.join(n['sourceRefs']),'','**回答前の本文**','',n['before'],'']
  if n['answer'] is not None:
   lines += ['**穴の位置**','',r'\['+(n['formula'] or r'\square').replace(r'\square',r'\boxed{\phantom{0}}')+r'\]','',f'ID：`{n["itemId"]}` / 思考：{n["action"]} / 正答：`{n["answer"]}`','', '| 誤答 | 戻す根拠 |','|---|---|']
   lines += ['| `'+x+'` | '+y+' |' for x,y in n['wrong']];lines += ['','ヒント：'+n['hint'],'']
  else:lines += ['穴なし：未知の定義・境界・手順は先に教え、直後の適用で考えさせる。','']
  lines += ['**回答後の式と本文**','',('$'+n['resolvedFormula']+'$') if n.get('resolvedFormula') else '',n['after'],'','前結果：'+(', '.join(n['knownRefs']) or '段階内の直前の結果。不要な過去全文は表示しない。'),'結果ID：`'+n['resultId']+'`。次nodeの入力へ接続。','']
  if n['extra']:lines+=['補助/表示契約：`'+json.dumps(n['extra'],ensure_ascii=False)+'`','']
 (B/(u.upper()+'_NODE_DESIGN.md')).write_text('\n'.join(lines)+'\n')
 print(u,len(ur),'nodes',len(newids),'answers',len(set(n['stageId'] for n in ur)),'stages')
