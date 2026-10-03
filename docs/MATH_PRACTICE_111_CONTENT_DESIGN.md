# MATH PRACTICE 111 CONTENT DESIGN
## 「命題を証明する」第3問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y は実数、n は整数とする。対偶を考えて、次の命題を証明せよ。

(1) \(x^3\ne1\Rightarrow x\ne1\)

(2) \(x+y>3\Rightarrow (x>2\text{ または }y>1)\)

(3) \(n^2\) が3の倍数でないならば、n は3の倍数でない

(4) \(n^3+1\) が奇数ならば、n は偶数である

Theme:
- 命題を証明する

Core idea:
- 今回は source が「対偶を考えて」と指定しているため、「対偶を使うか」は穴にしない。
- 学習者が判断するのは、
  1. 元命題の対偶を正しく作る
  2. 対偶を直接証明する
  3. 対偶が真なので元命題も真と結ぶ
  の3段階。
- 各小問は独立。前小問の計算結果を次へ持ち越さない。
- 110で学んだ「対偶 = ¬q⇒¬p」は compact prerequisite として再確認してよいが、110の解答全文は表示しない。

---

# 0. 共通準備 — 対偶の形

元命題が
\[
p\Rightarrow q
\]
なら、対偶は
\[
\neg q\Rightarrow\neg p
\]
である。

Thinking node:
- 111-rule
  - correct: 「対偶は ¬q⇒¬p」
  - purpose: 今回使う証明形式を固定
  - note: strategy itself is source-given; only form is a thinking node

Result node:
- label: 対偶の形

---

# 1. (1)

元命題:
\[
x^3\ne1\Rightarrow x\ne1
\]

後件 \(x\ne1\) の否定は \(x=1\)。
前件 \(x^3\ne1\) の否定は \(x^3=1\)。

したがって対偶は、
\[
x=1\Rightarrow x^3=1
\]

左側を仮定すると、
\[
x^3=1^3=1
\]
なので対偶は真。

よって元命題も真。

Thinking nodes:
- 111-p1-contrapositive
  - correct: \(x=1\Rightarrow x^3=1\)
  - purpose: 2つの否定と向きの反転を正しく行う
- 111-p1-proof
  - correct: 「x=1 を代入して x³=1、対偶が真なので元も真」
  - purpose: 対偶を実際に証明し元命題へ戻る

---

# 2. (2)

元命題:
\[
x+y>3\Rightarrow (x>2\text{ または }y>1)
\]

後件の否定:
\[
x\le2\text{ かつ }y\le1
\]

前件の否定:
\[
x+y\le3
\]

したがって対偶は、
\[
x\le2\text{ かつ }y\le1
\Rightarrow
x+y\le3
\]

実際、
\[
x+y\le2+1=3
\]
なので対偶は真。

よって元命題も真。

Thinking nodes:
- 111-p2-negation
  - correct: OR の否定 → \(x\le2\) AND \(y\le1\)
  - purpose: De Morgan + inequality boundary
- 111-p2-proof
  - correct: \(x+y\le2+1=3\) より対偶が真 → 元も真
  - purpose: 否定した条件から直接不等式を作る

Leakage guard:
- p2-negation before answer: do not show both \(x\le2,y\le1\)
- p2-proof before answer: do not show final \(x+y\le3\)

---

# 3. (3)

元命題:
「\(n^2\) が3の倍数でない ⇒ n は3の倍数でない」

対偶は、
「n が3の倍数 ⇒ \(n^2\) は3の倍数」。

前件から、ある整数 k を用いて
\[
n=3k
\]
と書ける。

すると
\[
n^2=9k^2=3(3k^2)
\]
となり、\(n^2\) は3の倍数。

したがって対偶は真で、元命題も真。

Thinking nodes:
- 111-p3-contrapositive
  - correct: 「n が3の倍数 ⇒ n² が3の倍数」
  - purpose: 「3の倍数でない」の否定を正しく作る
- 111-p3-proof
  - correct: \(n=3k\Rightarrow n^2=3(3k^2)\)
  - purpose: 倍数定義を式へ変換して証明する

---

# 4. (4)

元命題:
「\(n^3+1\) が奇数 ⇒ n は偶数」

後件「n は偶数」の否定は「n は奇数」。
前件「\(n^3+1\) は奇数」の否定は「\(n^3+1\) は偶数」。

したがって対偶は、
「n が奇数 ⇒ \(n^3+1\) は偶数」。

n が奇数なら、ある整数 k を用いて
\[
n=2k+1
\]
と書ける。

代入すると、
\[
n^3+1=(2k+1)^3+1
\]
\[
=8k^3+12k^2+6k+2
\]
\[
=2(4k^3+6k^2+3k+1)
\]

よって \(n^3+1\) は偶数。

したがって対偶は真で、元命題も真。

Thinking nodes:
- 111-p4-contrapositive
  - correct: 「n が奇数 ⇒ n³+1 が偶数」
  - purpose: 偶奇の否定と対偶の方向を正しく作る
- 111-p4-form
  - correct: \(n=2k+1\)
  - purpose: 奇数という言葉を証明可能な式へ変換する
- 111-p4-proof
  - correct: 展開して \(2(\text{整数})\) の形へする
  - purpose: “偶数”を2×整数として示す

---

# 5. Current-stage compression

Target order:
1. basis
2. p1-contrapositive
3. p1-proof
4. p2-negation
5. p2-proof
6. p3-contrapositive
7. p3-proof
8. p4-contrapositive
9. p4-form
10. p4-proof

Rules:
- all subproblems depend only on basis
- within each subproblem, proof step depends on its own contrapositive/negation result
- previous subproblem derivation disappears
- imported result is only the compact contrapositive statement when the next proof step needs it
- future proof steps remain hidden
- no unrelated previous result links

---

# 6. Hole quality audit

Keep:
- correct contrapositive statement
- De Morgan negation in (2)
- multiple-of-3 representation in (3)
- odd integer representation in (4)
- proof-ending algebra to “3×integer” / “2×integer”

Do not create:
- “= / ≠” symbol-only holes
- “3” or “2” number-only holes
- “真” alone after a full proof
- strategy-choice hole asking whether to use contrapositive, because the source already specifies it

---

# 7. Rendering / mobile audit

Required:
- \(\Rightarrow,\ne,\le\)
- \(x^3\), \(n^2\), \(n^3+1\)
- \((2k+1)^3+1\)
- multi-line expansion on mobile without horizontal overflow
- raw TeX command wordsなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 8. Acceptance gate before 112

111 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 112 be enabled.
