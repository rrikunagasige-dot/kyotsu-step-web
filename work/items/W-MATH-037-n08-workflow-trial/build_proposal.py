"""Compile the assistant's explicit node design into a reviewable proposal. No app writes."""
from pathlib import Path
import json,hashlib
B=Path(__file__).resolve().parent
ROOT=B.parents[2]
data=json.loads((ROOT/'src/data/textbook/math/numbers/n08Authored.json').read_text())
inv=json.loads((B/'NODE_INVENTORY.json').read_text());old={n['id']:n for n in inv['nodes']}
# Each entry is an authored decision, not an automatic quality label.
rows=[
('n08-q01-right','維持・手本','数直線の右側の点を、右の座標から左の座標を引いて求める。','手本を提示。穴を増やさない。','同じ方法を左側へ使う。'),
('n08-q01-left','維持','負の座標を括弧で扱い、距離を計算する。','既存の計算穴5を保つ。','座標の符号と距離の符号を区別する。'),
('n08-01','統合確認と表示','二つの距離を原問の順序へ戻す。','既存回答を保持。選択肢の二値を同じ順序の二行で表示する。','Q01の結論を定義への具体例として記録する。'),
('n08-definition','本文修正','原点からの距離を絶対値と名付け、式全体を囲む記号だと説明する。','新概念名を穴にしない。黒字太字で定義する。','a≥0とa<0の二つの条件へ進む。'),
('n08-02','導出を追加','右側又は原点にある点の距離を整理する。','直前に距離の式a−0を作る新穴を追加。既存の|a|=aはまとめとして残す。','非負の場合の条件付き結論を保存する。'),
('n08-q03-order','維持・条件表示','a<0では右側の点が0、左側の点がaであることから距離の式を作る。','既存0-aを選ぶ式生成の穴を保つ。','0-aを簡単な形にする。'),
('n08-03','解答契約を明示','与えられた0-aを、符号が反対の数-aへ整理する。','真の等式でも開始式が異なる選択肢を区別。既存採点キーは変えない。','a<0なら|a|=-aを条件と一緒に記録する。'),
('n08-q04-substitute','維持','-aのaへ負の数-5を括弧付きで代入する。','既存-(-5)の式生成穴を保つ。','外側の負号の計算へ進む。'),
('n08-04','一つの等式へ復帰','-(-5)を計算し、最初の距離と一致することを確かめる。','既存回答-(-5)=5を保つ。','|−5|=−(−5)=5を一まとまりに記録する。'),
('n08-cases','維持・参照固定','二つの場合を条件と式の表でまとめる。','穴なし。表の0以上/負を保持する。','後続の絶対値の外し方の参照表になる。'),
('n08-q05-square','独立計算の整列','同じ例題の中身の符号を決めるため、正の二数の二乗を比べる準備をする。','√5の二乗を教え、次の行で3の二乗9を計算させる。','二乗の大小から元の二数の大小へ進む。'),
('n08-q05-compare','維持','二乗した値5と9を比較する。','不等号<を選ぶ判断穴を保つ。','非負である条件を使い元の数へ戻す。'),
('n08-05','選択肢と依存を明示','二乗の比較と元の二数の比較を対応させる。','全選択肢で「二乗した値」→「元の数」の二行順にする。','√5<3を次の両辺操作の根拠として保存する。'),
('n08-q06-subtract','両辺操作を追加','前の大小関係を、元の絶対値の中身√5−3と0の比較へ変える。','直前に両辺から引く数3の共有穴を追加。既存の右辺0の計算穴も保つ。','中身の符号が決まる。'),
('n08-06','維持・判断の役割','不等式で表した比較を、負という符号の判断へ結ぶ。','既存の符号穴を保つ。これは数値計算とは別の読み取り。','定義の負の側を選べるようになる。'),
('n08-q07-rule','維持・全体への参照','uを中身全体とし、判定済みの負という条件に合う規則を選ぶ。','既存|u|=-uを選ぶ判断穴を保つ。','uを√5−3へ戻す。'),
('n08-q07-bracket','維持・対象全体','負号を式全体へ作用させるため、括弧を保って代入する。','既存−(√5−3)の式生成穴を保つ。','絶対値を外す操作と括弧を外す計算を区別する。'),
('n08-q07-distribute','式の小段階を補足','−1を二つの項へ分配し、その後に符号を計算する。','既存の和−√5+3の計算穴を保つ。分配した未計算式を前に置く。','項の順序を整える。'),
('n08-07','一問の結論','加法の交換法則で項の順序を整え、原問の答えに戻る。','既存3−√5を保つ。','大小→符号→定義→計算の全過程をまとめて再読できる。'),
('n08-q08-order','参照を整理','円周率の与条件から3とπを比較する。','既存<の判断穴。前の例の具体的な答えは前提欄へ出さない。','同じ手順を別の数へ使う。'),
('n08-q08-difference','両辺操作を追加','3<πを、3−πと0の比較へ変形する。','直前に両辺から引く数πの共有穴を追加。既存の不等号の穴は方向確認。','差の符号を理由と結ぶ。'),
('n08-08','維持・理由の統合','差が負であることを、π>3という根拠と組にする。','既存の意味・理由を選ぶ穴を保つ。','中身の符号から外し方を本人が選べる。'),
('n08-q09-bracket','支援を少し減らす','負という条件を定義のどちらの側へ使うか、前の例から移して考える。','先に「負号を付けます」と答えを言わず、既存−(3−π)を選ばせる。','括弧を外す計算へ進む。'),
('n08-q09-distribute','前例と同じ整列','−1を二項へ分配してから計算する。','既存−3+πの穴を保つ。','正の項を先に並べる。'),
('n08-09','一問の結論','元の|3−π|へ戻してπ−3を結論にする。','既存の最終回答を保つ。','前例との共通する手順を、具体値と別に再利用できる。'),
('n08-q10-forward','論理の向きを維持','距離0なら点が原点と同じ位置にあることから、元の数を決める。','既存0の穴。距離の意味を考える役割を明記する。','逆向きも必要だとつなぐ。'),
('n08-q10-reverse','論理の向きを維持','点が原点にあるときの距離を求める。','既存0の穴を保つ。前向きの式と等号で連結しない。','二つの含意から同値へまとめる。'),
('n08-10','統合確認','元の数の条件と、その位置の意味をまとめる。','既存の数式＋理由の回答契約を保ち、math/textを別描画する。','|a|=0⇔a=0を記録する。'),
('n08-q11-positive','場合の対照表','a>0の条件で、|a|と|-a|の二つをそれぞれ求める。','既存aの計算穴を保つ。','この場合に二つが一致することを比較する。'),
('n08-q11-negative','場合の対照表','a<0では−a>0を先に示し、二つの絶対値を比べる。','既存−aの穴を保つ。','正の場合と混ぜず別の行へ残す。'),
('n08-q11-zero','維持・境界を明示','a=0なら両方の距離が0だと確かめる。','穴なし。数値0の反復を増やさない。','正・負・0で全実数を覆ったと確認する。'),
('n08-11','場合の結合','三つの場合で同じ関係が成り立つことをまとめる。','既存|a|=|-a|の性質を選ぶ穴を保つ。','左右対称な点の距離という意味も残す。'),
('n08-q12-nonnegative','条件付きの等式列','a≥0では|a|=aを二乗する。','既存a²の穴を保つ。','0を含めた一方の場合を記録する。'),
('n08-q12-negative','積の説明を追加','a<0では−a全体を二乗し、負号二つが掛かる計算へつなぐ。','既存a²の穴を保つ。括弧ごとの二乗を描画検査する。','非負の場合と同じ式になる。'),
('n08-12','統合確認','二つの場合を覆い、任意の実数での結論をまとめる。','既存の最終a²を保ち、独立した新計算と数えない。','|a|²=a²を条件なしの性質として記録する。'),
('n08-closing','本文修正','距離→符号→定義→計算という使い方を自分の言葉で振り返れる文にする。','穴なし。次単元の公式を推測させない。','今の単元の結論で閉じる。'),
]
assert {r[0] for r in rows}==set(old) and len(rows)==36
# Replacement paragraphs are exact proposed learner prose. All other existing paragraphs remain.
replace={
'n08-definition':{'after':[r'この記号が表すのは、座標の正負ではなく、原点からの距離です。次に、点の位置に応じてこの距離を式で表します。']},
'n08-02':{'before':[r'前の式では、右側の座標から原点の座標を引いて距離を表しました。引き算を整理し、絶対値を外した式をまとめます。']},
'n08-q05-square':{'before':[r'求めたいのは $|\sqrt5-3|$ を絶対値記号のない式で表すことです。まず中身の符号を決めるため、$\sqrt5$ と $3$ を比べます。',r'$\sqrt5$ は正で、二乗すると $5$ になる数です。二つの数はともに正なので、二乗した値を比べて元の数の大小を決められます。はじめに $\sqrt5$ の二乗を確かめ、次に $3$ の二乗を計算します。']},
'n08-q06-subtract':{'before':[r'右辺に同じ数の差が残りました。左辺は元の絶対値の中身です。右辺を計算し、中身の符号を読み取れる形に整理します。']},
'n08-q07-distribute':{'before':[r'括弧の前の負号は、括弧全体に $-1$ を掛けることを表します。分配法則を使い、$\sqrt5$ と $-3$ の両方へ $-1$ を掛けてから計算します。']},
'n08-q08-order':{'before':[r'次は $|3-\pi|$ を絶対値記号のない式で表します。与えられた $\pi=3.14159\ldots$ を使い、まず中身の符号を決めるために $3$ と $\pi$ を比べます。']},
'n08-q08-difference':{'before':[r'左辺は元の絶対値の中身になりました。右辺の差を計算して、$0$ との比較に整理します。両辺から同じ数を引いたときの不等号の向きにも注意します。']},
'n08-q09-bracket':{'before':[r'中身の符号を、場合分けの定義の条件に当てはめます。前の例で使った順序で、絶対値記号のない式を作ります。']},
'n08-q09-distribute':{'before':[r'括弧全体に掛かる $-1$ を、$3$ と $-\pi$ のそれぞれに分配してから計算します。']},
'n08-closing':{'before':[r'絶対値は原点からの距離を表します。中身が式のときも、まずその式全体の符号を調べ、定義に当てはめてから計算します。'],'after':[r'点の位置から距離を考える方法と、符号から絶対値を外す方法を結び付けて使えるようになりました。']},
}
new=[
{'id':'n08-r5-q02-distance','interactionId':'n08-r5-q02-distance-answer','stageId':'n08-stage-02','insertBefore':'n08-02','purpose':'右側の点と原点の距離の式を作る','before':r'$a\ge0$ の場合、点は原点か右側にあります。右側の点の座標は $a$ です。左側にある原点の座標を使い、「右の座標−左の座標」で距離を表します。','masked':r'|a|=\boxed{A}','completed':r'|a|=a-0','answer':'a-0','choices':['a-0','0-a','0+a'],'role':'式生成・操作の目的','bindings':['expression'],'after':r'原点の座標を引く式になりました。この引き算を整理し、絶対値を外した式をまとめます。'},
{'id':'n08-r5-q06-operation','interactionId':'n08-r5-q06-operation-answer','stageId':'n08-stage-06','insertBefore':'n08-q06-subtract','purpose':'前の大小関係から中身の符号へつなぐ','before':r'元の絶対値の中身は $\sqrt5-3$ です。先ほど得た $\sqrt5<3$ を、この中身と比べられる形に変えます。両辺から同じ数を引く式を作ります。','masked':r'\sqrt5-\boxed{A}<3-\boxed{A}','completed':r'\sqrt5-3<3-3','answer':'3','choices':['3','-3','0'],'role':'操作の選択・式生成','bindings':['left.subtrahend','right.subtrahend'],'after':r'両辺に同じ操作をしたので、不等号の向きは変わりません。右辺を整理して中身の符号を調べます。'},
{'id':'n08-r5-q08-operation','interactionId':'n08-r5-q08-operation-answer','stageId':'n08-stage-08','insertBefore':'n08-q08-difference','purpose':'別の例で同じ両辺操作を組み立てる','before':r'今回調べたい中身は $3-\pi$ です。$3<\pi$ の両辺へ同じ操作を行い、左辺にこの中身が現れる式を作ります。','masked':r'3-\boxed{A}<\pi-\boxed{A}','completed':r'3-\pi<\pi-\pi','answer':r'\pi','choices':[r'\pi','3',r'-\pi'],'role':'操作の選択・転移','bindings':['left.subtrahend','right.subtrahend'],'after':r'前の例と同じ手順で、中身と右辺の差を比較する形になりました。右辺を整理します。'},
]
# The same original problem remains visible across its local stages.
groups=[
{'id':'n08-distance','stages':['n08-stage-01'],'goal':'原点と二点との距離を求める','root':r'2.3,\quad-5'},
{'id':'n08-definition-group','stages':['n08-stage-02','n08-stage-03','n08-stage-04'],'goal':'距離の意味から絶対値を外す規則を導く','root':r'|a|\quad(a\in\mathbb R)'},
{'id':'n08-root-example','stages':['n08-stage-05','n08-stage-06','n08-stage-07'],'goal':'絶対値記号のない式で表す','root':r'|\sqrt5-3|','milestones':['中身の符号を調べる','定義に当てはめる','括弧を外して答えにする']},
{'id':'n08-pi-example','stages':['n08-stage-08','n08-stage-09'],'goal':'絶対値記号のない式で表す','root':r'|3-\pi|','givens':r'\pi=3.14159\ldots','milestones':['中身の符号を調べる','定義に当てはめて計算する']},
{'id':'n08-zero-property','stages':['n08-stage-10'],'goal':'距離が0になる条件を両方向から確かめる','root':r'|a|=0'},
{'id':'n08-opposite-property','stages':['n08-stage-11'],'goal':'符号が反対の二数の距離を比べる','root':r'|a|,\quad|-a|'},
{'id':'n08-square-property','stages':['n08-stage-12'],'goal':'絶対値を二乗した式を求める','root':r'|a|^2'},
]
forms={
'n08-q05-square':[r'(\sqrt5)^2=5',r'3^2=\boxed A'],
'n08-q07-distribute':[r'-(\sqrt5-3)=(-1)\sqrt5+(-1)(-3)',r'=\boxed B'],
'n08-q09-distribute':[r'-(3-\pi)=(-1)3+(-1)(-\pi)',r'=\boxed B'],
'n08-q11-positive':[r'a>0:\quad |a|=a',r'|-a|=-(-a)=\boxed A'],
'n08-q11-negative':[r'a<0:\quad |a|=-a',r'|-a|=\boxed B'],
'n08-q12-negative':[r'a<0:\quad |a|^2=(-a)^2',r'=(-a)(-a)=\boxed B'],
}
refchanges={'n08-q08-order':{'remove':['n08-07-result'],'use':['source-given-pi'],'strategy':'前例の手順（数値の答えとは別）'},'n08-q10-forward':{'remove':['n08-09-result'],'use':['n08-definition-result']},'n08-q11-positive':{'remove':['n08-10-result'],'use':['n08-cases-result']},'n08-q12-nonnegative':{'remove':['n08-11-result'],'use':['n08-cases-result']}}
design={'schemaVersion':'n08-repair-design/1','status':'PROPOSAL_ONLY','sourceSHA':'69014b5b149f730c5f738129c9febbd19a96214a','sourceHash':inv['sourceSHA256'],'unitId':data['unit']['unitId'],'fromRevision':4,'proposedRevision':5,'preserveAllExistingInteractionIds':True,'existingInteractionCount':31,'newInteractionCount':3,'proposedInteractionCount':34,'problemGroups':groups,'replacements':replace,'newNodes':new,'formulaRows':forms,'referenceChanges':refchanges,'nodeDecisions':[{'id':i,'action':action,'teachingPurpose':purpose,'blankDecision':blank,'nextUse':nextuse,'existingInteractionId':old[i].get('interaction'),'answer':old[i].get('answer'),'before':old[i]['before'],'after':old[i]['after']} for i,action,purpose,blank,nextuse in rows]}
(B/'NODE_DESIGN.json').write_text(json.dumps(design,ensure_ascii=False,indent=2)+'\n')
fence=chr(96)*3
text=r'''# N08「絶対値」修正案 P-001

Status: PROPOSAL_ONLY / 教材・共通コードの実装前。日付2026年10月26日（日本時間）。

対象をN08「絶対値」と本人が確定した。最初の「不等式N08」をN11へ推測変換しない。
目的は、承認済みN08の説明と小段階を生かし、新しい制作基盤で一問全体の流れ・式生成の穴・条件付き検算を改善すること。
この文書とNODE_DESIGN.jsonが今回の具体案。W-GOV-011の技術承認を、この新しい本文の承認へ流用しない。

## 現状の評価と変更の中心

現行は12段階・36node・31回答・元図1点。定義、場合分け、前結果、履歴、括弧の導出は既にある。ここを全否定して作り直さない。

1. 一問を解く流れ：Q05〜Q07を一つの例題として扱い、Q08〜Q09も別の一つの例題として扱う。ページの短さは保つ。
2. 本人の操作：既存の31回答に加え、距離の式と二つの両辺操作の3回答を追加する。両辺の二枠は1回答に結ぶ。
3. 本文：制作者に向けた文を学習者に向けた数学の説明へ直す。Q09では適用すべき操作を先に言い切らない。
4. 参照と式：今回使わない別例の具体的な答えを前提欄から外し、現在の問題の解法を累積して見られるようにする。
5. 検算：現行の新ASTには絶対値・平方根・π・条件下の証明がない。未対応をAIでPASSにせず、対応契約と否定試験を先に用意する。

現行数学が誤っているとの判定ではない。既存の専用検算と今回のSymPy実験では数学は成立する。一方、実験の成功を制作基盤への接続完了とは呼ばない。

## 原典の使い方

栃木県総合教育センターの実践報告では、定義・式の意味・言葉・数直線を行き来させて理解を促す方針が示される。今回も距離の意味を残し、場合分けと計算だけにしない。特定校の実践を、本アプリでの効果の証明にはしない。

FTEXTでは中身の符号を調べてから絶対値を外す手順と、性質を条件別に確かめる構成を参照した。元の数値や本文を複製するのではなく、N08の既存の問題へ順序を適用する。

OpenStaxとPenn Stateは距離の定義と符号操作の区別を照合する参考。SymPy公式Refineは条件に応じた絶対値の変形の実装参考。

参照先・位置・取得成否はREFERENCES.mdとREFERENCE_MANIFEST.json。取得できたHTMLも、抽出されたテキストだけで数式の正しさを確定しない。

## 学習画面の構成

12のstage IDを保つ。画面の上には「元の問題」、その下に「今の小目標」、本文と式、下に「ここまでの解法」を置く。同じ例題に属するページでも元の問題を変更しない。

| ページ | 常に保持する問題 | 小目標 |
|---|---|---|
| stage05 | \(|\sqrt5-3|\)を絶対値なしで表す | 中身の二数の大小を求める |
| stage06 | 同じ問題 | 中身の符号を求める |
| stage07 | 同じ問題 | 定義を使って計算し、答えへ戻す |
| stage08 | \(|3-\pi|\)を絶対値なしで表す | 与条件から中身の符号を求める |
| stage09 | 同じ問題 | 前の手順を使い、定義から答えへ進む |

前結果には条件と、その結果が属する問題を付ける。完了した現在の問題の式は通常表示、以前の説明全文は任意展開にする。未来の式・正答はDOMへ入れない。別例の答えは現在の問題の必要条件と混ぜない。

一問の累積欄は、比較・条件の判断と、等号でつながる変形列を分ける。例えば二乗の比較を絶対値の式へ等号で直結しない。

## Q05〜Q07の完成時の流れ

元の問題：\(|\sqrt5-3|\)を絶対値記号なしで表す。

まず中身の符号を決めるため、\(\sqrt5\)と\(3\)を比べる。\(\sqrt5>0\)と\(3>0\)を明示する。

\[
\begin{aligned}
(\sqrt5)^2&=5,\\
3^2&=9.
\end{aligned}
\]

二乗した値を比べると\(5<9\)。二つとも非負なので\(\sqrt5<3\)。次に、元の中身\(\sqrt5-3\)の符号が分かる形へ、両辺に同じ操作をする。

\[
\begin{aligned}
\sqrt5&<3,\\
\sqrt5-\boxed A&<3-\boxed A,\\
\sqrt5-3&<3-3,\\
\sqrt5-3&<\boxed B.
\end{aligned}
\]

Aは両辺で同じ一つの回答で3、Bは既存回答で0。Aの表示は同時に二枠へ反映し、attemptを二重計上しない。

中身が負と分かったので、\(u<0\)の場合の\(|u|=-u\)を選び、\(u\)を中身全体へ戻す。ここからは等号でつながる。

\[
\begin{aligned}
|\sqrt5-3|&=-(\sqrt5-3)\\
&=(-1)\sqrt5+(-1)(-3)\\
&=-\sqrt5+3\\
&=3-\sqrt5.
\end{aligned}
\]

最後の四行を回答前に一括表示しない。規則選択→括弧付きの式生成→分配と符号の計算→整序という既存回答の進度に沿って現れる。上記は完成時の全体像である。

## Q08〜Q09の完成時の流れ

元の問題：\(|3-\pi|\)。与条件\(\pi=3.14159\ldots\)を問題欄へ残す。

\[
\begin{aligned}
3&<\pi,\\
3-\boxed A&<\pi-\boxed A,\\
3-\pi&<\pi-\pi,\\
3-\pi&<0.
\end{aligned}
\]

新Aは\(\pi\)、両辺で1回答。既存の不等号を選ぶ穴と、符号＋理由を選ぶ穴は役割を区別して残す。

Q09では「負号を付けます」と操作を先に言わず、判定済みの符号と定義を使って本人が式を作る。

\[
\begin{aligned}
|3-\pi|&=-(3-\pi)\\
&=(-1)3+(-1)(-\pi)\\
&=-3+\pi\\
&=\pi-3.
\end{aligned}
\]

## 各nodeの具体案

全36nodeを次に列挙する。元の回答IDと正答は変えない。新しい3回答は別IDを持つ。変更指示のない既存説明は保持する。
'''
for index,(id,action,purpose,blank,nextuse) in enumerate(rows,1):
 n=old[id]
 text+=f'\n### {index:02d} {id}\n\n- 方針：{action}\n- 考えること：{purpose}\n- 穴と採点：{blank}\n'
 if n.get('interaction'):
  display_answer=n['answer'].replace(chr(92)*2,chr(92))
  item=next(i for section in data['unit']['sections'] for i in section['items'] if i['id']==n['interaction'])
  display_value='「'+display_answer+'」' if item['answerType']=='text' else chr(92)+'('+display_answer+chr(92)+')'
  text+=f'- 維持する回答ID：{n["interaction"]}。正答：{display_value}。元の選択肢キーとfirstValue/attemptCountを保持。\n'
 else:text+='- このnodeに回答を要求しない。\n'
 if id in replace:
  for side,paras in replace[id].items():text+=f'- 差し替える{ "回答前" if side=="before" else "回答後" }本文：'+ ' '.join(paras)+'\n'
 else:text+='- 本文：既存の説明を保持し、前提の条件を同じ問題欄・式の直近へ置く。\n'
 if id in forms:text+='- 式の表示順：'+ ' → '.join('\\('+s+'\\)' for s in forms[id])+'。回答後は枠を正答へ置換。\n'
 for newnode in new:
  if newnode['insertBefore']==id:
   text+=f'- 直前に追加：{newnode["id"]} / 回答ID {newnode["interactionId"]}。本文「{newnode["before"]}」式\\({newnode["masked"]}\\)。正答\\({newnode["answer"]}\\)、選択肢：'+ ' / '.join(newnode['choices'])+'。'+newnode['after']+'\n'
 text+=f'- 次への役割：{nextuse}\n'
text+=r'''
## 型別の組版

- 式番号は式と別の列。短い一等式は一行。等号でつながる列は等号位置をそろえる。
- 独立した二つの計算は上から順に置く。選択肢も全候補で同じ順序と粒度にする。Q01の二つの距離は「原問の先の点→後の点」、Q05は「二乗の比較→元の二数の比較」。
- Q10は含意・同値の型を持つ。\(\Rightarrow\)を\(=\)へ置換しない。
- Q11はa>0、a<0、a=0をそれぞれ独立した場合として並べる。別の場合の式を一つの等式列でつながない。
- Q12はa≥0とa<0を明記して各場合を調べる。0は前者に含める。両方の結論が一致した後に全体の性質を示す。
- 初出の「絶対値」は黒字太字。文中の式はmath partにし、通常文字の代用をしない。
- 一問の中で同じ式を「前結果」「本文」「完成式」と三重に常時出さない。必要な前提と、任意の全文履歴を区別する。
- 既存のTypesetFormula/NumberedEquationと元図を使う。設計図のboxed Aは穴の識別記号で、実装の穴は既存reading-inline-blankと集合で受入済みの枠の見た目を再利用する。固定の巨大な余白や全画面縮小で収めない。

## 制作コードの不足と改修仕様

今回、既存のsource、research、厳密検算サービスを実際に用いて分析した結果、次が必要になった。

| 改修先 | 現在 | 変更仕様 | 必須の否定試験 |
|---|---|---|---|
| research/extract.py | HTMLのテキスト抽出中心 | MathJaxの根mathノードのdata-latex、MathMLのannotation、通常文を型付きで保持。原本位置・原値・抽出方法を記録 | 本文a²=a²でも元TeXが絶対値を含む例、svg断片分割、aria-labelとの不一致、二重取込 |
| research/patterns.mjs | blankRolesとfigureTimingを検証するが、import結果から落としている | 元reviewと同じ二配列をimport成果物へ保持し、次工程の参照もhashで結ぶ | 穴の目的・図の時点の消失、元reviewとimport結果の不一致 |
| solution/expression.mjs | 有理数/文字/四則/整数冪 | absolute、非負有理数のsqrt、定数piだけを追加。任意文字列をevalしない | 負のsqrt、未許可定数、深すぎるAST、分母0 |
| solution/graph.mjs | 単一種類の直線的な変形中心 | solution-bundle/1として、元の問題・型別segment・結果の依存を束ねる。各segmentには既存graphを使い、別種類の判断へ結果を渡す | 異なるproblemの数値結果混入、未導出の符号、未来fact、循環 |
| solver/solution.py | 条件なし多項式等が中心 | 条件domain内の検算、Absの条件付き外し、正の根号比較、piの厳密な順序、Q10の解集合照合 | 中身の符号未確定でAbsを外す、二乗の比較に非負条件なし、近似値だけの検算 |
| solution-bundleのcaseJoin | 一般場合分け未対応 | N08の一実数・有理区間の有限場合だけを初期対象とし、全域被覆/重複/各場合で同一主張成立を検査 | a=0の欠落、場合の重複、空条件による自明な証明、違う主張の合流 |
| interaction/IR adapter | 値としての同値判定が中心 | 回答型を値・符号・変形・論理関係で区別。変形はfrom/to/目的の形まで検査 | Q03のa−0=aや新Q02の0+aを単に値が同じだから正答にする、同じ数式の表記だけ違う誤答 |
| operations/runner/capabilities | 新graphの必須receiptを要求 | solution.validate/math.verifyをbundleへdispatch。旧IR v1は維持し、必要なN08の検算を新bundleへ結ぶ | 部分計算PASSをN08全体PASSへ広げる、UNSUPPORTEDを意味監査で昇格 |
| n08のcompiler/materializer | 旧12stage/36nodeを生成 | 同じ凍結設計からauthoredとproblem context/solution bundleを生成。二重手書き禁止 | authoredとsidecarのhash不一致、消失node、元問/説明/図の欠落 |
| N08ReadingFlow/n08 CSS | stage単位の問題欄とknownRefs | 同じproblemIdの元問と累積解法を保持。前例の手順と数値結果を区別。共有穴を1IDで動かす | 答えの先出し、未回答後続表示、history/前提欄での条件落ち、両辺を二回答化 |
| TextbookUnitPage/進捗adapter | revision4専用route | revision5を明示登録。v4の全回答を保持し、新しい3穴だけ未回答にする | 旧回答の消失/初回値の書換え、別単元のrevisionへ適用、3穴を自動正答化 |

solution-bundleは単に未知の式をliteralへ変えて通す抜け道にはしない。目標、各segmentの入力/結果、依存fact、適用domain、結論を持つ。比較から式の変形へ移る際も、元の問題が同じであることを検査する。

根号はN08に必要な「非負有理数の平方根」、πは固定定数に限る。文字の根号・未知符号の除算・一般の絶対値方程式や不等式の網羅solverはこの案に含めない。扱えないものはUNSUPPORTED。

### 実装順

1. 先に抽出欠落、Abs未対応、条件抜け、場合の0欠落、真だが目的不一致の選択肢について、否定fixtureを固定する。
2. 制作側の閉じたAST/検算/bundle adapterを実装し、既存の一次不等式・平方完成・極値の23試験も維持する。
3. N08の12問・全36既存nodeと追加3nodeをbundleへ対応させ、source/条件/図/結論のcoverageを照合する。
4. 凍結したNODE_DESIGNから候補IRと表示artifactを生成。候補の採点・進捗IDが承認案と一致するか照合する。
5. 新しい一問contextと既存の組版部品をN08へ限定適用する。
6. 四幅で全選択肢、正誤、前結果、履歴、旧保存、shared slotを操作し、可視状態からAIが再審査する。
7. 既存公開appへcompileして、N08への直接リンクを渡す。画像票や公開の再承認を追加しない。

## R01〜R08にどう置くか

R01で元版・依頼・実画面を固定。R02で教材上の症状と制作基盤の未対応を分ける。R03の事前影響表はN08と共通コード利用先を別行にする。R04の案がこの文書である。

現行の新adapterではAbsを表現できないため、新しい厳密検算のreceiptをN08全体PASSにはできない。本提案の範囲が承認されたら、制作側拡張を先行する技術Workで行い、同じN08修正WorkのR02へ実検算を戻す。その後R03/R04を正式再照合し、同じ凍結案の既承認をR05へ結ぶ。本文修正はR06から行う。未対応を回避するために工程の合格を捏造しない。

今回の具体案に対する一度の承認を、明記した制作コード拡張とN08の内容設計の両方へscope別に記録する。同じ具体案について二度の承認を要求しない。案自体の変更が必要になったときだけ差分を示す。

## 保護・変更の境界

- 対象：N08本文の指定箇所、3追加回答、問題のまとまり/参照/式の表示、必要な制作コードとN08用adapter。
- 保持：旧31回答のID・正答キー・既存の誤答キー、12stage ID、元図のbyte、原問12問、既存の知識・条件・履歴。
- 進捗：unit revision4→5。旧履歴をarchiveへ残し、旧回答を再利用する。新しい3回答のみ追加で求める。旧v1〜v3の既存移行を先に通す。
- 同じnamespaceを保つ。前の版の単元全体受入を、修正後の新しい3穴や新しい本文への本人評価に流用しない。
- N07/N09/N10/N11等の本文をこのWorkで同時改変しない。共通コードの回帰検査と、別教材の内容修正を区別する。

## 完了条件と反証試験

内容は12原問と無番号の定義/性質/図が全対応し、39node・34interactionになる。三つの追加回答は距離の式a−0、両辺から引く3、両辺から引くπ。a−0を選ぶ穴は、単に原点の数字を写すのでなく、「右の座標−左の座標」を組み立てる行為である。slotは計5か所だが進捗は3回答。

320/390/430/1440pxで、問題の保持、全選択肢の縦配置、括弧と冪、等号と論理矢印の区別、番号、文中math、前結果、履歴、全正誤、再読込、resize、旧保存を確認する。全体や他教材に波及する型変更がある場合は既存の読者テストと四幅の代表操作も行う。

AIは「この穴で何を本人が考えるか」「必要な情報だけで進めるか」「前例の答えを不用意に前提にしていないか」「本文が操作を先に答えていないか」を、正答非表示の各状態で読む。CODEのPASSを教育上の合格理由にそのまましない。

本人の新しい品質評価はapp確認後に、対象版・範囲と結ぶ。今の「試す」という依頼も、この提案への承認も、新しいGold labelへ変換しない。

## 承認と版の固定

承認対象はこの提案書とNODE_DESIGN.jsonである。Workのproposal hashと各approval bundleのproposal_hashを同じ提案書のSHA256へ結び、設計JSONのhashをcontent_hashへ結ぶ。将来のIR生成物のhashを、設計JSONのhashと同じものだと扱わない。承認後の生成は同じ凍結設計から行い、既存のmaterialization記録で対応を示す。本文や採点の契約が変わるなら、差分を明示して案を改訂する。

## 今回すでに行った確認

実教材は変更していない。現行N08を320/390pxで全12stage・全31正答ずつ操作した。実画面で元問欄が途中目標に変わる箇所と、制作者向け本文を確認した。

制作基盤の検算は既存で表現できる3つの部分計算がPASS。Abs/根号/πの3canaryは現契約では表現不可。別のSymPy実験17件はPASSだが、production adapterの拡張・接続はまだ行っていない。

実物の旧版：https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=397788f1#/learning/textbook/math-numbers-expressions-n08

このリンクは今回の修正版ではない。修正版は承認された具体案の実装・QA・配信照合後に渡す。
'''
(B/'PROPOSAL.md').write_text(text.replace(chr(92)*2+'(',chr(92)+'(').replace(chr(92)*2+')',chr(92)+')'))
print(json.dumps({'nodeDecisions':len(rows),'added':len(new),'plannedNodes':len(rows)+len(new),'plannedInteractions':34,'status':'PROPOSAL_ONLY'},ensure_ascii=False))
