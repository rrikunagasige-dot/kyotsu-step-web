# MATH PRACTICE 110 CONTENT DESIGN
## 「命題を証明する」第2問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
n は自然数、x は実数とする。次の命題の真偽を調べよ。また、その逆、対偶、裏を述べ、それらの真偽を調べよ。

(1) n は 9 の倍数である ⇒ n は 3 の倍数である

(2) x≠2 ⇒ x²-3x+2≠0

(3) x²-x=0 ⇒ 「x=0 または x=1」

Theme:
- 命題を証明する

Core idea:
- 元命題を p⇒q としたとき、
  - 逆: q⇒p
  - 対偶: ¬q⇒¬p
  - 裏: ¬p⇒¬q
- 形を正しく作ることと、その真偽を判定することは別の学習行為。
- 元命題と対偶は同値、逆と裏も同値だが、今回は答えを機械的に写さず、各命題を具体的に検証してから最終表にまとめる。
- (1)〜(3) は独立。前小問の結果を次へ持ち越さない。

---

# 0. 共通準備 — 4つの命題の形

元命題:
\[
p\Rightarrow q
\]

逆:
\[
q\Rightarrow p
\]

対偶:
\[
\neg q\Rightarrow\neg p
\]

裏:
\[
\neg p\Rightarrow\neg q
\]

Thinking node:
- 110-rule
  - correct: 上記4形
  - purpose: 方向と否定の位置を混同しない

Result node:
- label: 逆・対偶・裏の形
- result: converse / contrapositive / inverse mapping

---

# 1. (1)

Let
- p: n は9の倍数
- q: n は3の倍数

## 元命題

n が9の倍数なら、
\[
n=9k=3(3k)
\]
と書けるので、n は3の倍数。

したがって元命題は真。

Thinking node:
- 110-p1-original
  - correct: 「n=9k=3(3k) より真」
  - purpose: 倍数定義で p⇒q を直接証明

## 逆

逆は
「n は3の倍数 ⇒ n は9の倍数」。

これは偽。
例えば n=3 は3の倍数だが9の倍数ではない。

Thinking node:
- 110-p1-converse
  - correct: converse statement + n=3 counterexample + false

## 対偶

対偶は
「n は3の倍数でない ⇒ n は9の倍数でない」。

9の倍数なら必ず3の倍数なので、この命題は真。

Thinking node:
- 110-p1-contrapositive
  - correct: negated statement + true
  - do not simply copy original truth without understanding the statement

## 裏

裏は
「n は9の倍数でない ⇒ n は3の倍数でない」。

これは偽。
n=3 が反例。

Thinking node:
- 110-p1-inverse
  - correct: inverse statement + counterexample + false

Final truth table:
- 元: 真
- 逆: 偽
- 対偶: 真
- 裏: 偽

Thinking node:
- 110-p1-summary
  - purpose: four local judgmentsを1つのtruth tableへ統合

---

# 2. (2)

Let
- p: x≠2
- q: x²-3x+2≠0

Factor:
\[
x^2-3x+2=(x-1)(x-2)
\]

## 元命題

p⇒q は偽。

x=1 なら
- x≠2 は真
- x²-3x+2=0

なので反例。

Thinking node:
- 110-p2-original
  - correct: factorization + x=1 counterexample + false
  - leakage guard: x=1 を正答前に本文へ出さない

## 逆

逆:
\[
x^2-3x+2\ne0\Rightarrow x\ne2
\]

もし x=2 なら多項式は0なので、q が成り立つなら x=2 ではあり得ない。

したがって逆は真。

Thinking node:
- 110-p2-converse
  - correct: converse statement + true

## 対偶

対偶:
\[
x^2-3x+2=0\Rightarrow x=2
\]

しかし x=1 でも左辺は0。

したがって対偶は偽。

Thinking node:
- 110-p2-contrapositive
  - correct: contrapositive statement + x=1 counterexample + false

## 裏

裏:
\[
x=2\Rightarrow x^2-3x+2=0
\]

代入すれば成り立つので真。

Thinking node:
- 110-p2-inverse
  - correct: inverse statement + true

Final truth table:
- 元: 偽
- 逆: 真
- 対偶: 偽
- 裏: 真

Thinking node:
- 110-p2-summary

---

# 3. (3)

Let
- p: x²-x=0
- q: x=0 または x=1

Factor:
\[
x^2-x=x(x-1)
\]

## 元命題

積が0なら
\[
x=0\quad\text{または}\quad x=1
\]
なので真。

Thinking node:
- 110-p3-original
  - correct: zero-product reasoning + true

## 逆

逆:
「x=0 または x=1 ⇒ x²-x=0」。

x=0 と x=1 のどちらを代入しても左辺は0。

よって真。

Thinking node:
- 110-p3-converse
  - correct: converse statement + true

## 対偶

q の否定は、
\[
x\ne0\quad\text{かつ}\quad x\ne1
\]

p の否定は、
\[
x^2-x\ne0
\]

したがって対偶は
\[
x\ne0\text{ かつ }x\ne1
\Rightarrow
x^2-x\ne0
\]

これは因数 x と x-1 がともに0でないため真。

Thinking node:
- 110-p3-contrapositive
  - correct: OR negation becomes AND + true
  - purpose: De Morgan を含めた正しい対偶生成

## 裏

裏:
\[
x^2-x\ne0
\Rightarrow
x\ne0\text{ かつ }x\ne1
\]

もし x=0 または1なら左辺は0なので、左辺が0でないならどちらでもない。

よって真。

Thinking node:
- 110-p3-inverse
  - correct: inverse statement + true

Final truth table:
- 元: 真
- 逆: 真
- 対偶: 真
- 裏: 真

Thinking node:
- 110-p3-summary

---

# 4. Current-stage compression

Target order:
1. basis
2. p1-original
3. p1-converse
4. p1-contrapositive
5. p1-inverse
6. p1-summary
7. p2-original
8. p2-converse
9. p2-contrapositive
10. p2-inverse
11. p2-summary
12. p3-original
13. p3-converse
14. p3-contrapositive
15. p3-inverse
16. p3-summary

Rules:
- all relation stages depend on basis only
- summary stage depends on the four relation results within the same subproblem
- previous subproblem full derivation disappears
- summary receives compact result links only
- future relation answers remain hidden
- no cross-subproblem imports

---

# 5. Hole quality audit

Keep:
- relation form + truth together when meaningful
- counterexample selection
- factorization as evidence
- OR negation → AND
- final truth table consolidation

Do not create:
- “真/偽”だけの低文脈穴を大量に作る
- n=3 や x=1 の数字だけを単独で当てる穴
- 元命題と対偶が同値だから真偽をコピーするだけの穴
- p,q を毎回機械的に書き写すだけの穴

---

# 6. Rendering / mobile audit

Required:
- \(\Rightarrow,\ne,\neg\) の表示
- \(x^2-3x+2=(x-1)(x-2)\)
- \(x^2-x=x(x-1)\)
- 「x=0 または x=1」の否定が AND として正しく表示
- raw TeX command wordsなし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 7. Acceptance gate before 111

110 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 111 be enabled.
