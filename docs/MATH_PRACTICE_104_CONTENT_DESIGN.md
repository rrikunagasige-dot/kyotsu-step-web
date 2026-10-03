# MATH PRACTICE 104 CONTENT DESIGN
## 「条件から命題を読む」第7問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y は実数とする。下線部の条件を p、後ろの条件を q として、p が q であるための何条件かを分類する。

(1) \(p:x=2\), \(q:x^2-5x+6=0\)

(2) \(p:x\ne0\), \(q:(x-1)(x-2)=0\)

(3) \(p:xy=1\), \(q:x=1\)

(4) \(p:|x|=0\), \(q:x=0\)

(5) \(p:x=y=2\), \(q:2x-y=2y-2=2\)

(6) p: 四角形ABCDがひし形, q: 四角形ABCDが正方形

Theme:
- 条件から命題を読む

Core idea:
- 必要条件・十分条件は、言葉だけで覚えず p⇒q と q⇒p を必ず別々に調べる。
- p⇒q が真なら p は q の十分条件。
- q⇒p が真なら p は q の必要条件。
- 2方向の真偽を確定したあとで最後に分類名を付ける。
- (1)〜(6) は独立。

---

# 0. 共通準備 — 2方向の真偽と分類

p が q のための条件であるとき、

- \(p\Rightarrow q\) が真 → p は十分条件
- \(q\Rightarrow p\) が真 → p は必要条件

したがって、

\[
\begin{array}{c|c|c}
p\Rightarrow q & q\Rightarrow p & p\text{ の分類}\\
\hline
\text{真} & \text{偽} & \text{十分だが必要でない}\\
\text{偽} & \text{真} & \text{必要だが十分でない}\\
\text{真} & \text{真} & \text{必要十分}\\
\text{偽} & \text{偽} & \text{必要でも十分でもない}
\end{array}
\]

## Thinking node

- 104-rule
  - correct: 上の4対応を正しくまとめた選択肢
  - purpose: 「必要/十分」の言葉を、含意の向きへ固定する

Result node:
- label: 双方向判定表
- result: p⇒q = 十分、q⇒p = 必要

---

# 1. (1)

\[
p:x=2,\qquad q:x^2-5x+6=0
\]

p から q:
\[
2^2-5\cdot2+6=0
\]
なので真。

逆向き:
\[
x^2-5x+6=(x-2)(x-3)=0
\]
より \(x=2,3\)。

q を満たしても x=3 の場合があるので \(q\Rightarrow p\) は偽。

したがって、
- p⇒q: 真
- q⇒p: 偽
- p は **十分条件だが必要条件ではない**

Thinking node:
- 104-p1-classification
  - correct: 「p⇒q真、q⇒p偽 → 十分だが必要でない」
  - purpose: 方向と分類を一体で判断する

---

# 2. (2)

\[
p:x\ne0,\qquad q:(x-1)(x-2)=0
\]

q の解は \(x=1,2\) なので、q を満たせば必ず \(x\ne0\)。
よって \(q\Rightarrow p\) は真。

しかし \(x=3\) は p を満たすが q を満たさない。
よって \(p\Rightarrow q\) は偽。

したがって p は **必要条件だが十分条件ではない**。

Thinking node:
- 104-p2-classification
  - correct: 「p⇒q偽、q⇒p真 → 必要だが十分でない」

---

# 3. (3)

\[
p:xy=1,\qquad q:x=1
\]

p⇒q:
\(x=2,y=1/2\) なら xy=1 だが x=1 ではないため偽。

q⇒p:
\(x=1,y=0\) なら x=1 だが xy=1 ではないため偽。

したがって p は **必要条件でも十分条件でもない**。

Thinking node:
- 104-p3-classification
  - correct: 「両方向とも偽 → 必要でも十分でもない」

---

# 4. (4)

\[
p:|x|=0,\qquad q:x=0
\]

\(|x|=0\) なら \(x=0\)。
また \(x=0\) なら \(|x|=0\)。

両方向とも真なので p は **必要十分条件**。

Thinking node:
- 104-p4-classification
  - correct: 「両方向とも真 → 必要十分」

---

# 5. (5)

\[
p:x=y=2
\]

\[
q:2x-y=2y-2=2
\]

p から q は代入すれば成り立つ。

逆に q から、
\[
2y-2=2\Rightarrow y=2
\]
さらに
\[
2x-y=2\Rightarrow 2x-2=2\Rightarrow x=2
\]

よって q⇒p も真。

したがって p は **必要十分条件**。

Thinking node:
- 104-p5-classification
  - correct: 「両方向とも真 → 必要十分」
  - purpose: 逆向きは連立条件を実際に解いて確認する

---

# 6. (6)

p: 四角形ABCDがひし形  
q: 四角形ABCDが正方形

正方形なら4辺が等しいので、必ずひし形である。
したがって q⇒p は真。

しかし、ひし形は直角を持つとは限らず、正方形でないひし形がある。
したがって p⇒q は偽。

よって p は **必要条件だが十分条件ではない**。

Thinking node:
- 104-p6-classification
  - correct: 「p⇒q偽、q⇒p真 → 必要だが十分でない」

---

# 7. Current-stage compression

Target order:
1. basis
2. s1
3. s2
4. s3
5. s4
6. s5
7. s6

Rules:
- 各小問は basis のみに依存
- 各小問の visible reasoning では p⇒q と q⇒p の根拠を示す
- answer node は「2方向の真偽 + 分類」を一体で選ばせる
- 前小問の分類を次へ持ち越さない
- basis は compact dependency chip
- future subproblem は隠す
- completed full derivation は畳む

---

# 8. Hole quality audit

Keep:
- 必要/十分と含意方向の対応
- 各小問の2方向判定を踏まえた分類

Do not create:
- 「必要」「十分」という単語だけを当てる穴
- 代入結果 0 や因数分解の数字だけを細切れにする穴
- p⇒q と q⇒p を確定した後に、同じ情報を別穴で繰り返す
- 前問の分類をコピーさせる穴

---

# 9. Rendering / mobile audit

Required:
- \(\Rightarrow,\ne,\cdot\) のTeXバックスラッシュ保持
- p/q の方向表示を崩さない
- 数式重複なし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 10. Acceptance gate before 105

104 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 105 be enabled.
