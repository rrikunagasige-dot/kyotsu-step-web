"""Proposal artifacts only. Never writes learner files or creates approval events."""
import json,hashlib,re,subprocess
from pathlib import Path
B=Path(__file__).resolve().parent;R=B.parents[2]
def write(p,x):
 (B/p).parent.mkdir(parents=True,exist_ok=True)
 (B/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
source=json.loads((B/'evidence/SOURCE_INDEX.json').read_text())
rows=[]
def add(q,key,goal,before,formula,answer,wrong,after,hint,refs,action='expression',role='substep',requires=None):
 rows.append(dict(id='n08-'+key,q=q,goal=goal,before=before,formula=formula,answer=answer,
  wrong=wrong,after=after,hint=hint,sourceRefs=[f'word-p-{i:06}' for i in refs],
  action=action,role=role,requires=requires or [],itemId=('n08-'+str(q).zfill(2)) if key==str(q).zfill(2) else 'n08-'+key+'-answer' if answer is not None else None))
# $...$ is an explicit math span, not a guessed regular-expression extraction of prose.
add(1,'q01-right','右側の点から原点までの距離',r'図の右側にある $2.3$ の点を見ます。原点の座標は $0$ です。右側の座標から左側の座標を引き、距離を求めます。',r'2.3-0=\square','2.3',[('−2.3','座標の向きと距離の長さを混同しています。距離は非負です。'),('0','点は原点と別の位置にあります。')],r'右側の点は原点から $2.3$ 離れています。次は左側の点を同じ方法で見ます。','図の原点と右側の点の間の長さに注目します。',[343,344,345,347],action='calculation',role='example')
add(1,'q01-left','左側でも右の座標から左の座標を引く',r'$-5$ の点は原点の左側です。右側は $0$、左側は $-5$ なので、距離は $0-(-5)$ と表せます。',r'0-(-5)=\square','5',[('-5','負なのは座標です。距離が負になっていないか確かめます。'),('0','原点と重なってはいません。')],r'座標に負号が付いていても、原点からの距離は正です。','負の数を引く計算を思い出します。',[343,344,346,347],action='calculation')
add(1,'01','元の順序で二つの距離をまとめる',r'問題の順序は $2.3$ の点、次に $-5$ の点です。求めた二つの距離を、この順序でまとめます。',r'\square',r'2.3,\quad5',[(r'2.3,\quad-5','二つ目に座標をそのまま書いています。'),(r'-2.3,\quad5','右の点の距離も負にはなりません。'),(r'2.3,\quad-5.0','小数で書き直しても負の距離は距離になりません。')],r'どちらも向きではなく、原点との離れ具合を表しています。','二つの計算結果を、図ではなく問題文の順に並べます。',[347],action='meaning')
add(2,'definition','この距離を絶対値と名付ける',r'実数 $a$ を表す点と原点との距離を、**絶対値**といい、$|a|$ と書きます。縦の二本の線は、中にある式全体について距離を取る記号です。',None,None,[],r'未知の名前を当てさせず、ここで定義します。次に、座標の正負に応じてこの距離を式にします。','',[348],role='definition')
add(2,'02','原点か右側なら座標が距離になる',r'$a\ge0$ の場合を考えます。点は原点か右側にあるので、右の座標 $a$ から左の座標 $0$ を引きます。$a-0=a$ を絶対値の記号でまとめます。',r'\square',r'|a|=a',[(r'|a|=-a','この場合は座標がすでに非負です。'),(r'|a|=0','原点と一致するのは境界のときだけです。'),(r'|a|=a^2','距離を求める操作は二乗ではありません。')],r'$a=0$ の場合も含みます。左側の場合も調べれば、すべての実数を扱えます。','場合の条件と、左右の座標を確かめます。',[350,351],action='relation')
add(3,'q03-order','左側の点の距離を引き算で作る',r'$a<0$ なら、左に $a$、右に $0$ があります。距離の式は「右側の座標−左側の座標」の順に作ります。',r'|a|=\square',r'0-a',[(r'a-0','左側から右側を引いています。'),(r'0+a','距離を出す引き算になっていません。')],r'次は、この引き算を一つの項にします。','数直線で、二点の右と左を先に決めます。',[352,353],action='judgment')
add(3,'03','左側の距離を簡単にする',r'先ほど作った $0-a$ では、$0$ から $a$ を引いています。$a$ と符号が反対の数になるので、等式を完成させます。',r'\square',r'0-a=-a',[(r'0-a=a','引き算の符号が失われています。'),(r'a-0=a','前の段階で作った引き算を入れ替えています。'),(r'0+a=a','引く操作が足す操作に変わっています。')],r'$a<0$ のとき、$|a|=-a$ です。$-a$ という見た目だけで、値まで負と判断しないようにします。','0から引いた数は、元の数と符号が反対です。',[353],action='expression')
add(4,'q04-substitute','負の値は括弧を付けて代入する',r'いまの式 $-a$ の $a$ へ $-5$ を入れます。元からある負号と代入する負の数を区別するため、代入する数を括弧で囲みます。',r'-a=\square\quad(a=-5)',r'-(-5)',[(r'-5','元からあった負号を落としています。'),(r'-a','まだ数を代入していません。')],r'外側の負号は、括弧の中の数と符号が反対の数を作ります。','式に元からある負号を残して、文字の場所だけを置き換えます。',[354])
add(4,'04','代入した式の値を計算する',r'負の数 $-5$ と符号が反対の数を求めます。式と値を等号でつないで、左側の点の距離と照合します。',r'\square',r'-(-5)=5',[(r'-(-5)=-5','外側の負号の働きが反映されていません。'),(r'-5=5','値が違う二数を等号で結んでいます。'),(r'-(-5)=0','符号の反転は0を作る操作ではありません。')],r'初めに図から求めた距離と一致しました。$-a$ は、$a$ が負の場合には正になります。','外側の負号は符号を反対にする指示です。',[354],action='calculation')
add(4,'cases','絶対値を外す規則を二つにまとめる',r'ここまでの二つの場合を一つの表にまとめます。$a\ge0$ なら $|a|=a$、$a<0$ なら $|a|=-a$ です。',None,None,[],r'絶対値を外す前に、中の式全体がどちらの条件に当てはまるかを調べます。減号があるという理由だけでは決まりません。','',[355,356],role='property')
add(5,'q05-square','正の二数の大小を比べる準備',r'例題は $|\sqrt5-3|$ を絶対値記号なしで表すことです。ここでは $\sqrt5$ は正で、二乗すると $5$ になる数だと使います。正の二数では二乗しても大小の向きが保たれます。まず $3$ の二乗を計算します。',r'3^2=\square','9',[('6','二乗は2倍ではありません。'),('3','同じ数を二つ掛けます。')],r'$(\sqrt5)^2=5$ と、いま求めた値を比較します。','指数の2は、同じ数を二つ掛けることを表します。',[357,358,359,360,361,362],action='calculation',role='example')
add(5,'q05-compare','二乗した値の大小を決める',r'両方とも正なので、二乗した値の比較を元の二数の比較に戻せます。まず $5$ と $9$ の間の不等号を選びます。',r'5\ \square\ 9','<',[('>','左右の数の大きさをもう一度比べます。'),('=','二つは同じ数ではありません。')],r'ここでは二乗した値の比較ができました。次に元の二数について結論を出します。','数直線で右にある数が大きい数です。',[362],action='judgment')
add(5,'05','根拠と元の数の大小関係を結ぶ',r'比較している二数はともに非負です。先ほどの二乗の比較から、元の二数にも同じ向きの大小関係が成り立ちます。',r'\square',r'5<9,\quad\sqrt5<3',[(r'5>9,\quad\sqrt5>3','二乗した値の比較を逆にしています。'),(r'5<9,\quad\sqrt5>3','非負の数の大小を戻す向きが逆です。'),(r'5=9,\quad\sqrt5=3','値の違いを等号で結ぶことはできません。')],r'大小関係は、次の差の符号の根拠として記録します。','比較した値と元の数を、それぞれ同じ順序で対応させます。',[362],action='relation')
add(6,'q06-subtract','両辺から同じ数を引いて差の符号へ',r'記録した $\sqrt5<3$ の両辺から $3$ を引きます。同じ数を引いても不等号の向きは変わりません。右辺の $3-3$ を計算して、差を0と比べます。',r'\sqrt5-3<\square','0',[('3','右辺からも同じ数を引きます。'),('-3','同じ数どうしの差を確かめます。')],r'$\sqrt5-3<0$ なので、差の符号が決められます。','右辺で同じ数どうしを引きます。',[363],action='expression')
add(6,'06','差が0より小さいことを言葉で読む',r'絶対値の中身を0と比較できました。この結果を、正・0・負という言葉で読み取ります。',r'\sqrt5-3\text{ は }\square','負',[('正','0より小さいという不等式と逆です。'),('0','不等号は等号ではありません。'),('符号は決まらない','前の不等式から判断できます。')],r'中身が負だと分かりました。ここで初めて、絶対値を外す場合を選べます。','0との大小関係を符号の言葉に直します。',[363],action='judgment')
add(7,'q07-rule','負の場合に使う規則を選ぶ',r'使う規則では $u$ を絶対値の中にある式全体とします。今回は $u=\sqrt5-3$ で、その値は負です。どちらの式を使うか選びます。',r'\square',r'|u|=-u',[(r'|u|=u','これは中身が0以上のときの規則です。'),(r'|u|=0','中身が0のときだけの値です。')],r'式全体に負号を付けます。一つの項だけの符号を変えるのではありません。','中身の符号と、場合分け表の条件を照合します。',[355,356,364],action='judgment')
add(7,'q07-bracket','中身全体を括弧で囲んで負号を付ける',r'規則の $u$ を $\sqrt5-3$ に置き換えます。二つの項全体に負号が働くよう、括弧を付けます。',r'|\sqrt5-3|=\square',r'-(\sqrt5-3)',[(r'-\sqrt5-3','後ろの項まで負号を掛ける形になっていません。'),(r'\sqrt5-3','中身が負という判定を反映していません。')],r'絶対値を外す操作はここまでです。次は、できた括弧を外す計算をします。','括弧には中身をすべて入れ、その外に負号を置きます。',[364])
add(7,'q07-distribute','負号を括弧の二項へ掛ける',r'括弧の前の負号は $-1$ を掛けることです。$\sqrt5$ と $-3$ の両方へ掛けます。',r'-(\sqrt5-3)=\square',r'-\sqrt5+3',[(r'-\sqrt5-3','第2項にも負号を掛けます。'),(r'\sqrt5+3','第1項にも負号を掛けます。')],r'括弧の中の二つの項の符号が、それぞれ反対になりました。','第2項は負の数なので、その項にさらに負号を掛けます。',[364,365],action='calculation')
add(7,'07','正の項を先に並べて元の問いへ答える',r'$-\sqrt5+3$ は、加法の交換法則で項の順を変えられます。絶対値も括弧もない形を、元の問題の答えにします。',r'|\sqrt5-3|=\square',r'3-\sqrt5',[(r'\sqrt5-3','負と判定した中身をそのまま残しています。'),(r'-\sqrt5-3','二項目の符号が違います。'),(r'3+\sqrt5','根号の項の符号が違います。')],r'符号を判定する操作と、括弧を外す計算をつなげて答えられました。','値を変えず、正の項を先に書きます。',[364,365])
add(8,'q08-order','円周率と3を比べる',r'次は $|3-\pi|$ です。与えられた $\pi=3.14159\ldots$ を使い、最初に $3$ と $\pi$ を比べます。',r'3\ \square\ \pi','<',[('>','整数部分が同じでも、小数部分が続いています。'),('=','小数部分まで一致しているか確かめます。')],r'数の大小を、差の符号へつなげます。','与えられた小数表示の小数部分を見ます。',[366,367,368],action='judgment',role='check')
add(8,'q08-difference','同じ数を引いて0との比較へ',r'$3<\pi$ の両辺から $\pi$ を引きます。右辺は $\pi-\pi$ なので、0になります。',r'3-\pi\ \square\ 0','<',[('>','同じ数を引いても大小の向きは変わりません。'),('=','異なる二数の差は0にはなりません。')],r'中身と0を比べられました。元の小数表示も、根拠として残します。','不等式の両辺に同じ引き算をしています。',[368],action='relation')
add(8,'08','差の符号を根拠と組にする',r'いまの不等式が表す符号を読み、最初の大小関係を理由に付けて判断をまとめます。',r'\square','負（πは3より大きい）',[('正（3はπより大きい）','与えられた小数表示と反対です。'),('0（πは3と等しい）','小数部分を落としています。'),('符号は決められない','与えられた小数表示を根拠に判断できます。')],r'中身が負であるという結論を使い、絶対値を外します。','差の不等式と、比較に使った数の大小を組にします。',[368],action='meaning')
add(9,'q09-bracket','前の例と同じ負の規則を使う',r'$3-\pi<0$ なので、式全体に負号を付けます。先ほどと同じく、中身を括弧でまとめます。',r'|3-\pi|=\square',r'-(3-\pi)',[(r'3-\pi','中身をそのまま残す条件ではありません。'),(r'-3-\pi','第2項まで反転させる括弧が必要です。')],r'次に括弧を外します。','前例の数だけを写さず、規則を今回の式全体へ適用します。',[369])
add(9,'q09-distribute','負号を3と負の円周率へ掛ける',r'括弧の二項 $3$ と $-\pi$ の両方に $-1$ を掛けます。',r'-(3-\pi)=\square',r'-3+\pi',[(r'-3-\pi','負の項へさらに負号を掛けます。'),(r'3+\pi','第1項にも負号を掛けます。')],r'二項の符号がともに反転しました。','括弧全体への掛け算を一項ずつ行います。',[369],action='calculation')
add(9,'09','元の問題の答えをまとめる',r'項の順序を整え、正の項を先に書きます。',r'|3-\pi|=\square',r'\pi-3',[(r'3-\pi','これは絶対値を取る前の負の値です。'),(r'-\pi-3','符号の反転が正しくできていません。'),(r'3+\pi','元の二項をただ足す操作ではありません。')],r'二つの例とも、大小→差の符号→場合の選択→括弧全体の反転という順序で処理しました。','順番を変えても、各項の符号はその項に付けたままです。',[369])
add(10,'q10-forward','距離が0なら点はどこにあるか',r'ここからは性質です。$|a|=0$ は、$a$ の点と原点との距離が0という意味です。離れていない二点は同じ位置にあります。',r'|a|=0\ \Rightarrow\ a=\square','0',[('1','原点から離れると距離は0ではありません。'),('-1','原点の左側でも離れていれば距離は正です。')],r'絶対値が0なら、元の数も0です。逆向きも確かめます。','図の原点と重なる座標を読みます。',[370,371],action='meaning',role='proof')
add(10,'q10-reverse','逆に元の数が0なら距離も0',r'$a=0$ なら、点は最初から原点と一致します。場合分けの0以上の式を使っても $|0|=0$ になります。',r'a=0\ \Rightarrow\ |a|=\square','0',[('a^2+1','定義から求める距離ではありません。'),('1','同じ位置にある点どうしは離れていません。')],r'両方向が確かめられたので、$|a|=0$ と $a=0$ は同値です。','原点と原点の間の距離を考えます。',[371],action='relation',role='proof')
add(10,'10','元の性質を位置の意味と組にする',r'二方向の結論を、数直線上の理由とともにまとめます。数の条件だけで終えず、距離が0になる意味を説明します。',r'\square',r'a=0,\quad\text{原点と同じ位置にある}',[(r'a=0,\quad\text{原点から離れている}','値の条件と説明が矛盾しています。'),(r'a>0,\quad\text{原点と同じ位置にある}','原点より右側の点は原点そのものではありません。'),(r'a<0,\quad\text{原点と同じ位置にある}','原点より左側の点は原点そのものではありません。')],r'性質は $|a|=0\Leftrightarrow a=0$ と記録します。','条件と、その条件に合う位置の意味を照合します。',[371],action='meaning',role='property')
add(11,'q11-positive','正の場合に二つの距離を比べる',r'$a>0$ なら $-a<0$ です。場合分けより $|a|=a$、$|-a|=-(-a)$ です。後者の負号を計算します。',r'|-a|=-(-a)=\square','a',[(r'-a','外側の負号の働きが残っています。'),('0','互いに反対の位置であっても、距離が0とは限りません。')],r'この場合、二つの絶対値は同じ値になりました。','二重の負号を、前の具体例と同じように処理します。',[372],action='calculation',role='proof')
add(11,'q11-negative','負の場合にも二つの距離を比べる',r'$a<0$ なら $-a>0$ です。場合分けでは $|a|=-a$ となり、$-a$ の方はすでに正なのでそのまま距離になります。',r'|-a|=\square',r'-a',[(r'a','絶対値の中にある数を取り違えています。'),('0','原点以外の点の距離は0ではありません。')],r'この場合も $|a|$ と $|-a|$ は同じ値です。','今、絶対値の中に入っている数は元の文字そのものではなく、その反対の数です。',[372],action='judgment',role='proof')
add(11,'q11-zero','原点の場合も落とさない',r'$a=0$ の場合は $-a=0$ です。二点はともに原点なので、$|a|=|-a|=0$ です。',None,None,[],r'正・負・0の三つを確認できました。どの場合にも同じ関係が成り立ちます。','',[372],role='proof')
add(11,'11','すべての場合を一つの関係にまとめる',r'場合分けの計算は、原点を中心に左右対称な二点の距離が同じであることを表しています。任意の実数で成り立つ関係を選びます。',r'\square',r'|a|=|-a|',[(r'|a|=-|-a|','非負の距離どうしを負号で結んでいます。'),(r'|a|>|-a|','左右対称な点の距離は一方だけ大きくなりません。'),(r'|a|+|-a|=0','二つの距離の和が0なのは原点の場合だけです。')],r'元の数の符号を変えても、原点からの距離は変わりません。','正・負・0で共通して成り立った関係を取り出します。',[372],action='relation',role='property')
add(12,'q12-nonnegative','0以上の場合の絶対値を二乗する',r'$a\ge0$ なら $|a|=a$ です。両辺を二乗して、絶対値の二乗を求めます。',r'|a|^2=\square',r'a^2',[(r'a','両辺を二乗する操作が必要です。'),(r'2a','二乗と2倍は異なります。')],r'次に、負の場合でも同じ式になるか調べます。','二乗を右辺にも同じように付けます。',[373],action='expression',role='proof')
add(12,'q12-negative','負の場合は括弧ごと二乗する',r'$a<0$ なら $|a|=-a$ です。両辺を二乗すると $|a|^2=(-a)^2$ です。$(-a)(-a)$ では負号が二つ掛かります。',r'|a|^2=(-a)^2=\square',r'a^2',[(r'-a^2','括弧全体の二乗では負号も二つ掛かります。'),(r'-2a','二乗と2倍を混同しています。')],r'0以上の場合と同じ式になりました。','同じ負の因子を二つ掛けると積の符号は正です。',[373],action='calculation',role='proof')
add(12,'12','場合に関係なく成り立つ式を結論にする',r'二つの場合とも二乗した値は一致しました。したがって任意の実数について、絶対値の二乗を次のように表せます。',r'|a|^2=\square',r'a^2',[(r'|a|','絶対値そのものと、その二乗は一般に異なります。'),(r'-a^2','二乗した値は負になりません。'),(r'2a','二乗は2倍ではありません。')],r'絶対値を二乗すると、元の数を二乗した値と等しくなります。','二つの場合に共通して出た結果を記録します。',[373],action='relation',role='property')
add(12,'closing','距離と符号の学習を次へつなぐ',r'絶対値は位置の向きを捨て、原点からの距離を残します。式に使うときも、まず中身の符号を調べます。',None,None,[],r'次の平方根では、二乗が同じになる正負二つの数と、記号が表す非負の数を区別して学びます。ここではまだ次の単元の公式を答えとして提示しません。','',[374],role='summary')

# The right-hand distance is a worked anchor, not a literal-copy blank.
rows[0].update(answer=None,formula=None,itemId=None,after=r'$2.3-0=2.3$ です。右側の点は原点から $2.3$ 離れています。次は左側の点を同じ方法で見ます。')
rows[2]['wrong'][-1]=(r'5,\quad2.3','距離は正しくても、元の問題で指定された点の順序と逆です。')
next(n for n in rows if n['id']=='n08-q11-negative')['before']=r'$a<0$ なら $-a>0$ です。場合分けでは $|a|=-a$ となります。今度は反対の座標が正だという条件を使い、その点の距離を式にします。'
for n in rows:
 if n['id']=='n08-q10-reverse':n['before']=r'$a=0$ なら、点は最初から原点と一致します。このときの距離を求めて、逆向きの関係も確かめます。'
 if n['id']=='n08-cases':
  n['before']='ここまでの二つの場合を、条件と式が対応する表にまとめます。'
  n['after']=r'$a\ge0$ なら $|a|=a$、$a<0$ なら $|a|=-a$ です。絶対値を外す前に、中の式全体がどちらの条件に当てはまるかを調べます。減号があるという理由だけでは決まりません。'
 condition={'n08-02':r'$a\ge0$','n08-q03-order':r'$a<0$','n08-03':r'$a<0$','n08-q11-positive':r'$a>0$','n08-q11-negative':r'$a<0$','n08-q12-nonnegative':r'$a\ge0$','n08-q12-negative':r'$a<0$'}.get(n['id'])
 if condition:n['after']='条件 '+condition+' の場合の結論です。'+n['after']
# Stage references are deliberate: only previous established facts, never future answers.
for i,n in enumerate(rows):
 n['stageId']='n08-stage-'+str(n['q']).zfill(2)
 previous=rows[i-1:i]
 n['requires']=[p['id']+'-result' for p in previous]
 n['knownRefs']=[p['id']+'-result' for p in previous if p['q']!=n['q']]
 n['resultId']=n['id']+'-result'
 if n['q'] in (5,7,8,9):
  n['knownRefs']+=['n08-cases-result'] if n['q'] in (7,9) else []
 if n['q'] in (11,12):n['knownRefs']+=['n08-cases-result']
 n['requires']=list(dict.fromkeys(n['requires']+n['knownRefs']))

serial=0
def parts(s):
 global serial
 out=[]
 for j,t in enumerate(re.split(r'(\$[^$]+\$|\*\*[^*]+\*\*)',s)):
  if not t:continue
  serial+=1;pid=f'n08-part-{serial:04}'
  if t.startswith('$'):out.append(dict(kind='math',id=pid,latex=t[1:-1],mathRole='expression',semanticRef=pid))
  elif t.startswith('**'):out.append(dict(kind='term',id=pid,termId='absolute-value',text=t[2:-2],usage='first_definition'))
  else:out.append(dict(kind='text',id=pid,text=t))
 return out
def para(n,kind,s):return dict(id=n['id']+'-'+kind,kind='paragraph',parts=parts(s))
def chain(n,kind,values,operators=None,relation='equality',slot=False):
 bid=n['id']+'-'+kind;es=[]
 for i,x in enumerate(values):
  if slot:
   seq=x.split(r'\square');p=parts('$'+seq[0]+'$') if seq[0] else []
   p.append(dict(kind='answerSlot',id=n['id']+'-slot',interactionId=n['itemId'],semanticRef=n['itemId']))
   if len(seq)>1 and seq[1]:p+=parts('$'+seq[1]+'$')
  else:p=parts('$'+x+'$')
  es.append(dict(id=bid+'-expr-'+str(i),parts=p))
 return dict(id=bid,kind='relationChain',relation=relation,expressions=es,operators=operators or [],transformRef=n['id'],layoutProfile='aligned-transform' if len(es)>1 else 'single',numbering=dict(stableId=bid,mode='group-end'))
nodes=[]
for n in rows:
 before=[para(n,'before',n['before'])];after=[para(n,'after',n['after'])]
 if n['answer'] is not None:
  # Textual judgments stay in prose. Math slots remain in their equation context.
  istext=n['answer'] in ('負','<') or n['id']=='n08-08'
  if istext:
   p=parts('判断：' if n['answer']=='負' else '符号・根拠：' if n['id']=='n08-08' else '$'+n['formula'].split(r'\square')[0]+'$')
   p.append(dict(kind='answerSlot',id=n['id']+'-slot',interactionId=n['itemId'],semanticRef=n['itemId']))
   if n['answer']=='<' and n['formula'].split(r'\square')[1]:p+=parts('$'+n['formula'].split(r'\square')[1]+'$')
   before.append(dict(id=n['id']+'-interaction',kind='paragraph',parts=p))
  else:before.append(chain(n,'interaction',[n['formula']],relation='independent',slot=True))
  # Original mixed text/formula anchors remain answer contracts; display uses separate spans.
  resolved=n['formula'].replace(r'\square',n['answer'])
  if n['id']=='n08-08':after.insert(0,para(n,'answer',r'$3-\pi<0$ であり、$\pi>3$ だから負です。'))
  elif n['id']=='n08-10':after.insert(0,para(n,'answer',r'$a=0$、原点と同じ位置にある。'))
  elif n['answer']=='負':after.insert(0,para(n,'answer',r'$\sqrt5-3<0$、したがって負です。'))
  else:
   if n['id']=='n08-07':values=[r'|\sqrt5-3|',r'-(\sqrt5-3)',r'-\sqrt5+3',r'3-\sqrt5'];ops=['=']*3;relation='equality'
   elif n['id']=='n08-09':values=[r'|3-\pi|',r'-(3-\pi)',r'-3+\pi',r'\pi-3'];ops=['=']*3;relation='equality'
   elif r'\Rightarrow' in resolved:values=resolved.split(r'\Rightarrow');ops=[r'\Rightarrow'];relation='implication'
   elif '=' in resolved and r'\quad' not in resolved:values=resolved.split('=');ops=['=']*(len(values)-1);relation='equality'
   elif n['id']=='n08-q04-substitute':values=['-a',r'-(-5)'];ops=['='];relation='equality'
   else:values=[resolved];ops=[];relation='independent'
   after.insert(0,chain(n,'result',values,operators=ops,relation=relation))
 node=dict(id=n['id'],problemId='absolute-value',sourceRefs=n['sourceRefs'],requires=n['requires'],produces=[n['resultId']],role=n['role'],goal=n['goal'],purpose=n['goal'],operation=dict(kind=n['action'],targets=n['sourceRefs'],nextUseIds=[]),before=before,after=after,contextNeed=[dict(id=n['id']+'-context-'+str(i),problemId='absolute-value',factIds=[f],reason='この判断に使う既に確定した結果') for i,f in enumerate(n['knownRefs'])])
 if n['answer'] is None:node['noBlankReason']='未知の定義・全場合の表・境界確認・学習接続は教える本文として明示する。既知の判断を問う箇所は別nodeで穴にした。'
 else:
  node['interaction']=dict(id=n['itemId'],targetPath='interaction.expected.value',learningAction=n['action'],whyHere=n['goal'],prerequisiteIds=n['requires'],expected=dict(value=n['answer'],form='text' if istext else 'formula',semanticType=n['action']),choices=[dict(id=n['itemId']+'-correct',content=n['answer'],feedback=n['after'])]+[dict(id=n['itemId']+'-wrong-'+str(i),content=x,misconception=r,feedback=r) for i,(x,r) in enumerate(n['wrong'])],hints=[n['hint']],answerInsertion=dict(blockId=n['id']+'-interaction',slotId=n['id']+'-slot'))
 nodes.append(node)
coverage=[]
for b in source['blocks']:
 ns=[n['id'] for n in rows if b['id'] in n['sourceRefs']]
 coverage.append(dict(sourceId=b['id'],nodeIds=ns,disposition='taught' if ns else 'structural',reason='本文・判断・図の読取りに統合' if ns else '見出し・役割ラベル・次節の見出しを構造として保持。問題や重要説明の省略ではない。'))
ir=dict(schemaVersion='production-ir/1',unitId='math-numbers-expressions-n08',subject='math',mode='textbook',sourceHash=source['documentHash'],sourceBlocks=[dict(id=b['id'],kind=b['kind']) for b in source['blocks']],coverage=coverage,initialFacts=['signed-arithmetic','number-line','order-translation','positive-square-order','sqrt5-given','pi-given'],nodes=nodes)
write('NODE_DESIGN.json',dict(status='PROPOSED',stages=12,nodes=rows))
write('CANDIDATE_IR.json',ir)
write('SOURCE_COVERAGE.json',coverage)
text=['# N08 全ノードの具体設計','', 'Status: PROPOSED / 未実装。□はアプリ内の既存選択式穴。以下は制作者向けの正答・誤答を含む設計書。','',f'原12問 → {len(rows)}思考ノード・{sum(n["answer"] is not None for n in rows)}回答・12段階。元12採点IDと正答契約は保存。','']
for n in rows:
 text.extend([f'## {n["id"]} — {n["goal"]}','',f'原問Q{n["q"]:02} / {n["role"]} / 段階 {n["stageId"]} / 根拠 '+', '.join(n['sourceRefs']),'', '**回答前の本文**', '',n['before'].replace('$', '$'), ''])
 if n['answer'] is not None:
  text+=['**穴を含む式・文**','', '$'+n['formula'].replace(r'\square',r'\boxed{\phantom{0}}')+'$','',f'回答ID：`{n["itemId"]}`。学習行為：{n["action"]}。正答：`{n["answer"]}`。','', '| 選択肢（誤答） | 誤解と、その場の説明 |','|---|---|']
  text += ['| `'+x+'` | '+r+' |' for x,r in n['wrong']]
  text+=['','ヒント：'+n['hint'],'']
 else:text+=['穴を置かない理由：未知の定義、整理、境界例、次への接続として教える箇所。','']
 text+=['**回答後の本文・記録する意味**','',n['after'],'','前結果欄：'+(', '.join(n['knownRefs']) or 'この段階内で直前に確定した結果を使用。不要な過去全文は展開しない。'),'']
(B/'NODE_DESIGN.md').write_text('\n'.join(text)+'\n')
print(json.dumps(dict(nodes=len(rows),interactions=sum(n['answer'] is not None for n in rows),stages=12,sourceBlocks=len(coverage)),ensure_ascii=False))
