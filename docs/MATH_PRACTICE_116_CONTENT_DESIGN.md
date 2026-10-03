# MATH PRACTICE 116 CONTENT DESIGN
## 「命題を証明する」第8問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
\(p,q\) が有理数、\(X\) が無理数で、
\[
p+qX=0
\]
であるならば、
\[
p=q=0
\]
であることを証明せよ。

Theme:
- 命題を証明する

Type:
- P + L

Core idea:
- 無理数 \(X\) に直接掛かっている係数 \(q\) を先に調べる。
- \(q\ne0\) と仮定すると、元の式から
  \[
  X=-\frac pq
  \]
  と書ける。
- \(p,q\) は有理数で \(q\ne0\) なので、右辺は有理数。
- すると \(X\) が有理数になり、「\(X\) は無理数」と矛盾。
- よって \(q=0\)。
- これを元の式へ戻すと \(p=0\)。
- したがって \(p=q=0\)。

Important theorem result:
- THEOREM R116
  - rational \(p,q\)
  - irrational \(X\)
  - \(p+qX=0\)
  - then \(p=q=0\)
- Problem 117 will import this theorem as a compact cross-problem result.
- 117 must not need to reopen the whole proof by default.

---

# 0. S0 — どの係数から調べるか

## 穴なし完成文章

結論には \(p=0\) と \(q=0\) の2つがある。

元の式
\[
p+qX=0
\]
で、無理数 \(X\) に直接掛かっている係数は \(q\)。

したがって、まず \(q\) が0でないと仮定したとき何が起こるかを調べる。

Thinking node:
- 116-target
  - correct: \(q\)
  - purpose: proof strategyを決める係数選択
  - this is not a symbol-guessing hole; it determines which nonzero assumption lets us isolate \(X\)

Result node:
- label: 最初に調べる係数
- result: \(q\)

---

# 1. S1 — \(q\ne0\) と仮定する

\(q=0\) を示したいので、背理法として反対に

\[
q\ne0
\]

と仮定する。

この仮定により \(q\) で割ることができる。

Thinking node:
- 116-assumption
  - correct: \(q\ne0\)
  - purpose: division by \(q\) を正当化する反対仮定

Result node:
- label: 反対仮定
- result: \(q\ne0\)

---

# 2. S2 — \(X\) を単独にする

元の式
\[
p+qX=0
\]
から、
\[
qX=-p
\]
なので、
\[
X=-\frac pq
\]

となる。

Thinking node:
- 116-isolate
  - correct: \(X=-p/q\)
  - purpose: irrational \(X\) を rational data \(p,q\) だけの式へ変換する

Result node:
- label: \(X\) の式
- result: \(X=-p/q\)

---

# 3. S3 — 矛盾から \(q=0\)

\(p,q\) は有理数で、今は \(q\ne0\)。

したがって
\[
-\frac pq
\]
は有理数。

よって
\[
X=-\frac pq
\]
から \(X\) が有理数になってしまう。

しかし問題の条件では \(X\) は無理数。

これは矛盾。

したがって \(q\ne0\) という仮定が誤りで、

\[
q=0
\]

である。

Thinking node:
- 116-q-zero
  - correct: RHS rational → contradiction with irrational \(X\) → \(q=0\)
  - purpose: rational quotient closure と contradiction を一つの論理段階として結ぶ

Result node:
- label: まず得た結論
- result: \(q=0\)

---

# 4. S4 — 元の式へ戻して \(p=0\)

今得た
\[
q=0
\]
を元の式
\[
p+qX=0
\]
へ戻すと、
\[
p+0\cdot X=0
\]
だから、
\[
p=0
\]

である。

したがって
\[
p=q=0
\]
が証明された。

Thinking node:
- 116-p-zero
  - correct: substitute \(q=0\) → \(p=0\)
  - purpose: contradiction resultを元の方程式へ戻し、残りの係数を決める

Final result node:
- theorem_id: R116
- label: 116の結果
- statement:
  \[
  p,q\in\mathbb Q,\quad X\notin\mathbb Q,\quad p+qX=0
  \Rightarrow p=q=0
  \]
- 117から compact result link で参照可能にする

---

# 5. Current-stage compression

Target order:
1. target
2. assumption
3. isolate
4. q-zero
5. p-zero

Dependencies:
- assumption ← target
- isolate ← assumption
- q-zero ← isolate
- p-zero ← q-zero

Rules:
- single linear proof
- current stage only
- current stageが必要とする直前結果だけ compact link
- full previous derivationはdefaultで閉じる
- \(X=-p/q\) をisolate stage前に見せない
- \(q=0\) をcontradiction stage前に見せない
- \(p=0\) をback-substitution stage前に見せない

---

# 6. Hole quality audit

Keep:
- why \(q\) is the coefficient to attack
- nonzero assumption \(q\ne0\)
- isolate \(X\)
- rational quotient contradiction
- back-substitution for \(p\)

Do not create:
- minus sign only hole
- denominator \(q\) only hole
- “有理数” as a vocabulary-only repeated hole after the quotient reasoning is already shown
- final “0” as an isolated numeric guess

---

# 7. Rendering / mobile audit

Required:
- \(p+qX=0\)
- \(q\ne0\)
- \(X=-p/q\) or fraction rendering
- \(q=0\)
- \(p+0X=0\)
- theorem R116 statement

Required QA:
- fraction, \(\ne\), and implication render correctly
- no raw TeX
- no duplicated formula fragments
- compact theorem result readable on mobile
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
- mobile/desktop smoke

---

# 8. Acceptance gate before 117

116 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 117 be enabled.
