# MATH PRACTICE 107 CONTENT DESIGN
## 「条件から命題を読む」第10問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y,z は実数とする。次の□に、
「必要条件であるが十分条件ではない」
「十分条件であるが必要条件ではない」
「必要十分条件である」
「必要条件でも十分条件でもない」
のどれが入るか判定する。

(1) \((x-y)(y-z)=0\) は \(x=y=z\) であるための□。

(2) 「\(x>0\) かつ \(y<0\)」は、\(xy<0\) であるための□。

(3) \(x=y=0\) は、「\(xy=0\) かつ \(x+y=0\)」であるための□。

(4) \(\angle A<90^\circ\) は、△ABC が鋭角三角形であるための□。

(5) △ABC の3辺 BC,CA,AB の長さをそれぞれ a,b,c とする。
\[
(a-b)(a^2+b^2-c^2)=0
\]
は、△ABC が直角二等辺三角形であるための□。

Theme:
- 条件から命題を読む

Core idea:
- 104で作った「p⇒q = 十分」「q⇒p = 必要」をもう一度基準にする。
- ただし今回は、積=0、符号、連立条件、図形、三角形の辺条件へ適用する。
- 各小問では p⇒q と q⇒p を独立に判定し、その後に分類する。
- (1)〜(5) は互いに独立。

---

# 0. 共通準備 — 分類規則の再確認

p が q であるための条件を調べるとき、

- \(p\Rightarrow q\) が真 → p は十分条件
- \(q\Rightarrow p\) が真 → p は必要条件

4分類は次の通り。

- 真 / 偽 → 十分だが必要でない
- 偽 / 真 → 必要だが十分でない
- 真 / 真 → 必要十分
- 偽 / 偽 → 必要でも十分でもない

Thinking node:
- 107-rule
  - correct: 上記の方向対応
  - purpose: 言葉からではなく双方向含意で分類する

Result node:
- label: 双方向判定表
- result: p⇒q=十分、q⇒p=必要

---

# 1. (1)

\[
p:(x-y)(y-z)=0,\qquad q:x=y=z
\]

q が成り立つなら
\[
x-y=0,\qquad y-z=0
\]
なので p は成り立つ。よって \(q\Rightarrow p\) は真。

一方、p は2因子のうち少なくとも一方が0ならよい。

たとえば
\[
x=0,\quad y=0,\quad z=1
\]
なら p は成り立つが q は成り立たない。

よって \(p\Rightarrow q\) は偽。

結論:
- p⇒q: 偽
- q⇒p: 真
- p は必要条件だが十分条件ではない

Thinking node:
- 107-p1-classification
  - correct: necessary-only
  - key misconception: 「積=0」から両因子0と誤認しない

---

# 2. (2)

\[
p:x>0\text{ かつ }y<0,\qquad q:xy<0
\]

正×負は負なので \(p\Rightarrow q\) は真。

しかし \(xy<0\) となるのは
- x>0, y<0
- x<0, y>0

の2通り。

したがって q から p は決まらない。
例えば \(x=-1,y=1\) は q を満たすが p を満たさない。

結論:
- p⇒q: 真
- q⇒p: 偽
- p は十分条件だが必要条件ではない

Thinking node:
- 107-p2-classification
  - correct: sufficient-only
  - purpose: 積が負になる符号パターンを全て考える

---

# 3. (3)

\[
p:x=y=0,\qquad q:xy=0\text{ かつ }x+y=0
\]

p を q に代入すれば両条件が成立するので \(p\Rightarrow q\) は真。

逆に q では、\(xy=0\) から少なくとも一方が0。
仮に x=0 なら x+y=0 から y=0。
y=0 の場合も同様に x=0。

したがって q から x=y=0 が必ず出る。

結論:
- p⇒q: 真
- q⇒p: 真
- p は必要十分条件

Thinking node:
- 107-p3-classification
  - correct: iff
  - purpose: 2条件を同時に使う

---

# 4. (4)

\[
p:\angle A<90^\circ,\qquad q:\triangle ABC\text{ が鋭角三角形}
\]

鋭角三角形なら3角すべてが90°未満なので、q⇒p は真。

しかし \(\angle A<90^\circ\) だけでは B,C まで鋭角とは限らない。

例えば
\[
A=60^\circ,\quad B=100^\circ,\quad C=20^\circ
\]
なら p は満たすが q は満たさない。

結論:
- p⇒q: 偽
- q⇒p: 真
- p は必要条件だが十分条件ではない

Thinking node:
- 107-p4-classification
  - correct: necessary-only
  - purpose: 一つの角が鋭角 ≠ 三角形全体が鋭角

---

# 5. (5)

\[
p:(a-b)(a^2+b^2-c^2)=0
\]

積が0なので、p は

\[
a=b
\]

または

\[
a^2+b^2=c^2
\]

を意味する。

前者は A=B の二等辺三角形、後者は \(\angle C=90^\circ\) の直角三角形を表す。
どちらか一方だけで「直角二等辺」とは限らない。

例えば正三角形 \(a=b=c\) は p を満たすが直角三角形ではない。
したがって \(p\Rightarrow q\) は偽。

逆向きも常には成り立たない。
直角が A にある直角二等辺三角形では、\(b=c\), \(a=\sqrt2\,b\)。
このとき一般に
\[
a-b\ne0,\qquad a^2+b^2-c^2=2b^2\ne0
\]
なので p は成り立たない。

したがって \(q\Rightarrow p\) も偽。

結論:
- p⇒q: 偽
- q⇒p: 偽
- p は必要条件でも十分条件でもない

Thinking node:
- 107-p5-classification
  - correct: neither
  - purpose:
    - product-zero の2枝を意味へ翻訳する
    - 「直角二等辺」の直角位置が C に固定されていないことを確認する
  - critical guard:
    - q⇒p を「直角二等辺なら当然 a=b」としてはいけない
    - a,b,c はそれぞれ A,B,C の対辺であり、直角位置により等しい辺が変わる

---

# 6. Current-stage compression

Target order:
1. basis
2. s1
3. s2
4. s3
5. s4
6. s5

Rules:
- 各小問は basis のみに依存
- 前小問の分類・反例は次へ持ち越さない
- 各stageの本文では、その小問に必要な2方向の根拠だけを表示
- basis は compact dependency chip
- future subproblem は隠す
- completed full derivation は畳む

---

# 7. Hole quality audit

Keep:
- 双方向含意→分類
- 各小問の最終分類
- (5)では「直角位置が変わる」という本質を本文で理解させる

Do not create:
- x-y=0 の0だけを埋める穴
- 正×負=負の「負」だけを単独で聞く穴
- 反例の3数値を別々の穴にする
- 分類後に同じ必要/十分語をもう一度聞く

---

# 8. Rendering / mobile audit

Required:
- \(\Rightarrow,\ne,\sqrt{},^\circ\) のTeX保持
- (5)の式がスマホ横幅からはみ出さない
- raw TeX command wordsを表示しない
- 数式重複なし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 9. Acceptance gate before 108

107 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 108 be enabled.
