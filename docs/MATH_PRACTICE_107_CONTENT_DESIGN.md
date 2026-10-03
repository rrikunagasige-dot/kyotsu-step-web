# MATH PRACTICE 107 CONTENT DESIGN
## 「条件から命題を読む」第10問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y,z は実数とする。左の条件を p、右の条件を q として、p が q であるための何条件かを判定する。

(1) \(p:(x-y)(y-z)=0\), \(q:x=y=z\)

(2) p: \(x>0\) かつ \(y<0\), q: \(xy<0\)

(3) p: \(x=y=0\), q: \(xy=0\) かつ \(x+y=0\)

(4) p: \(\angle A<90^\circ\), q: △ABC が鋭角三角形

(5) 辺 BC,CA,AB を a,b,c とするとき、
\(p:(a-b)(a^2+b^2-c^2)=0\),
q: △ABC が直角二等辺三角形

Theme:
- 条件から命題を読む

Core idea:
- 104と同じ判定法を再利用するが、答えそのものは持ち越さない。
- p⇒q が真なら p は十分条件。
- q⇒p が真なら p は必要条件。
- 真の方向は証明し、偽の方向は具体的反例を示す。
- (1)〜(5) は独立。

---

# 0. 共通準備 — 必要・十分の方向

Thinking node:
- 107-rule
  - correct: 「p⇒q が真→十分、q⇒p が真→必要」
  - purpose: 方向を固定してから各小問へ入る

Result node:
- label: 双方向判定の規則
- result: p⇒q=十分、q⇒p=必要

---

# 1. (1)

p から分かるのは

\[
x=y \quad\text{または}\quad y=z
\]

の少なくとも一方であり、3つすべてが等しいとは限らない。

たとえば

\[
x=0,\ y=0,\ z=1
\]

なら p は成り立つが q は成り立たないので p⇒q は偽。

一方 q なら \(x-y=0,\ y-z=0\) だから p は必ず成り立ち、q⇒p は真。

したがって p は **必要条件だが十分条件ではない**。

Thinking node:
- 107-p1-classification
  - correct: p⇒q偽、q⇒p真 → 必要のみ
  - leakage guard: 分類は選択前に表示しない

---

# 2. (2)

p なら正×負なので \(xy<0\)。よって p⇒q は真。

しかし \(xy<0\) では、符号が逆の

\[
x<0,\qquad y>0
\]

も可能。

たとえば \(x=-1,y=1\) は q を満たすが p を満たさないため q⇒p は偽。

したがって p は **十分条件だが必要条件ではない**。

Thinking node:
- 107-p2-classification
  - correct: p⇒q真、q⇒p偽 → 十分のみ

---

# 3. (3)

p の \(x=y=0\) からは \(xy=0,\ x+y=0\) が成り立つので p⇒q は真。

逆に q を仮定する。

\(xy=0\) なので x,y の少なくとも一方が0。
さらに \(x+y=0\) なので、一方が0ならもう一方も0。

よって q⇒p も真。

したがって p は **必要十分条件**。

Thinking node:
- 107-p3-classification
  - correct: 両方向真 → 必要十分

---

# 4. (4)

鋭角三角形なら3つの角はすべて90°未満なので、q⇒p は真。

しかし \(\angle A<90^\circ\) だけでは、他の角まで鋭角とは限らない。

たとえば

\[
A=60^\circ,\quad B=100^\circ,\quad C=20^\circ
\]

なら p は成り立つが、△ABC は鋭角三角形ではない。

したがって p⇒q は偽であり、p は **必要条件だが十分条件ではない**。

Thinking node:
- 107-p4-classification
  - correct: p⇒q偽、q⇒p真 → 必要のみ

---

# 5. (5)

p は

\[
a=b \quad\text{または}\quad a^2+b^2=c^2
\]

を意味する。

p⇒q は偽。
たとえば正三角形 \(a=b=c=1\) では a=b なので p は成り立つが、直角三角形ではない。

q⇒p も偽。
たとえば A が直角の直角二等辺三角形を取り、

\[
b=c=1,\qquad a=\sqrt2
\]

とする。このとき q は成り立つが、

\[
a\ne b,\qquad a^2+b^2-c^2=2\ne0
\]

なので p は成り立たない。

したがって p は **必要条件でも十分条件でもない**。

Thinking node:
- 107-p5-classification
  - correct: 両方向偽 → neither
  - purpose: 図形条件でも「向き」を固定して2種類の反例を作る

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
- s1〜s5 は basis のみに依存
- 前小問の分類や反例を次へ表示しない
- basis は compact dependency chip
- future subproblem reasoning は隠す
- completed full derivation は畳む

---

# 7. Hole quality audit

Keep:
- 必要/十分と含意方向の対応
- 各小問の2方向判定 + 最終分類を一体化した選択

Do not create:
- 反例の数値を1個ずつ細切れ穴
- p⇒q/q⇒p の真偽を確定した後に分類を別の重複穴で聞く
- 104の答えをそのまま見せる result link

---

# 8. Rendering / mobile audit

Required:
- \(\Rightarrow,\ne,\sqrt{},^\circ\) のTeXバックスラッシュ保持
- 三角形の角度・辺条件を崩さない
- raw TeX command wordsを表示しない
- 数式重複なし
- horizontal overflowなし
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
