# MATH PRACTICE 100 CONTENT DESIGN
## 「条件から命題を読む」第3問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y は実数、n は自然数とする。次の命題が偽であることを示せ。

(1) \(x^2=3\Rightarrow x=\sqrt3\)

(2) \(|x|>|y|\Rightarrow x>y\)

(3) n は奇数 \(\Rightarrow 10n+1\) は素数

Core idea:
- 偽を示すには、前件を満たし後件を満たさない反例を1つ作ればよい。
- (1)〜(3) は独立。
- 完成した反例を次の小問へ持ち越さない。

# 0. 共通準備 — 反例の条件

反例は「前件が真、後件が偽」となる具体例である。

Thinking node:
- 100-rule
  - correct: 「前件を満たし、後件を満たさない具体例」
  - purpose: 反例の定義を共通基準として作る

# 1. (1)

\(x^2=3\) を満たす実数は

\[
x=\sqrt3,\quad x=-\sqrt3
\]

である。

後件 \(x=\sqrt3\) を満たさない方を選べばよいので、

\[
x=-\sqrt3
\]

が反例である。

Thinking node:
- 100-p1-counterexample
  - correct: \(x=-\sqrt3\)
  - leakage guard: 選択前に \(-\sqrt3\) を本文へ明示しない

# 2. (2)

絶対値の大小は、元の数の大小と一致するとは限らない。

たとえば

\[
x=-2,\qquad y=1
\]

とすると、

\[
|x|=2>|y|=1
\]

だが、

\[
x=-2<1=y
\]

なので \(x>y\) は成り立たない。

Thinking node:
- 100-p2-counterexample
  - correct: \(x=-2,y=1\)
  - purpose: absolute-value order と signed order の違いを使う
  - leakage guard: 選択前に \(-2\) を明示しない

# 3. (3)

奇数 n の中から \(10n+1\) が合成数になる値を1つ探す。

\[
n=5
\]

なら

\[
10n+1=51=3\times17
\]

であり、51 は素数ではない。

したがって \(n=5\) が反例である。

Thinking node:
- 100-p3-counterexample
  - correct: \(n=5\)
  - reason: \(51=3\times17\)
  - leakage guard: 選択前に 5 や 51 を正答として本文へ出さない

# Current-stage compression

Target order:
1. basis
2. s1
3. s2
4. s3

Rules:
- each subproblem depends only on basis
- previous subproblem derivations collapse completely
- basis remains a compact dependency chip
- future counterexamples remain hidden

# Hole quality

Keep:
- definition of a valid counterexample
- the actual counterexample in each subproblem

Do not add:
- separate arithmetic holes such as \(10\times5+1\)
- duplicated “よって偽” holes after the counterexample already proves falsity
- copy-only holes

# Rendering / QA

Required:
- escaped TeX backslashes
- no raw sqrt/times source visible
- no horizontal overflow
- Japanese/Chinese grading parity
- mobile and desktop smoke

# Acceptance gate before 101

1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy
