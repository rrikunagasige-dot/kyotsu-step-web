# MATH PRACTICE 117 CONTENT DESIGN
## 「命題を証明する」第9問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
次の等式を満たす有理数 \(p,q\) の値を求めよ。

\[
(1)\quad (\sqrt2-1)p+q\sqrt2=2+\sqrt2
\]

\[
(2)\quad \frac{p}{\sqrt2-1}+\frac{q}{\sqrt2}=1
\]

Theme:
- 命題を証明する

Type:
- X + I + L

Strong cross-problem dependency:
- Problem 116 theorem:
  \[
  A+B\sqrt2=0,\quad A,B\in\mathbb Q
  \Rightarrow
  A=B=0
  \]
- This is not merely a hint. It is the theorem that converts the grouped equation into two rational coefficient equations.
- UI should show one compact cross-problem result:
  「116の結果」
  and allow tap-to-expand a short theorem reminder.
- Do NOT force the learner to re-solve 116.
- Do NOT show 116's full derivation by default.

Core idea:
1. Rewrite each equation into
   \[
   (\text{rational coefficient})\sqrt2+(\text{rational part})=0.
   \]
2. Apply the 116 theorem.
3. Set both coefficients to zero.
4. Solve for \(p,q\).

Subproblems (1) and (2) are independent after importing the same theorem.

---

# 0. Cross-problem prerequisite — 116 theorem

For rational \(A,B\),

\[
A+B\sqrt2=0
\]

implies

\[
A=0,\qquad B=0.
\]

Why this is usable:
- \(\sqrt2\) is irrational.
- 116 proved the general statement \(p+qX=0\Rightarrow p=q=0\) when \(p,q\) are rational and \(X\) is irrational.

UI requirement:
- compact static result link:
  - label: 「116の結果」
  - result: \(A+B\sqrt2=0,\ A,B\in\mathbb Q\Rightarrow A=B=0\)
- tap expansion may show:
  「116では、もし \(B\ne0\) なら \(\sqrt2=-A/B\) が有理数になって矛盾するため \(B=0\)、その後 \(A=0\) と示した。」
- This prerequisite should be available in every 117 stage that applies coefficient separation.

---

# 1. (1) 展開して係数をまとめる

## 穴なし完成文章

まず左辺を展開する。

\[
(\sqrt2-1)p=p\sqrt2-p
\]

そこへ \(q\sqrt2\) を加えると、

\[
(\sqrt2-1)p+q\sqrt2
=
(p+q)\sqrt2-p
\]

である。

右辺 \(2+\sqrt2\) も左側へ移す。

\[
(p+q)\sqrt2-p-(2+\sqrt2)=0
\]

したがって、

\[
(p+q-1)\sqrt2-(p+2)=0
\]

となる。

Thinking nodes:
- 117-p1-expand
  - correct: \(p\sqrt2-p\)
  - purpose: distribute \(p\) correctly
- 117-p1-group
  - correct: \((p+q-1)\sqrt2-(p+2)=0\)
  - purpose: rational part と \(\sqrt2\) coefficient に整理

Result node:
- label: (1) の係数分離形
- result:
  \[
  (p+q-1)\sqrt2-(p+2)=0
  \]

Leakage guard:
- p1-expand before answer: do not show \((p+q)\sqrt2-p\)
- p1-group before answer: do not show final two coefficient equations

---

# 2. (1) 116を使って連立方程式にする

116の結果より、

\[
p+q-1=0
\]

かつ

\[
-p-2=0
\]

でなければならない。

第二式から、

\[
p=-2
\]

第一式へ代入して、

\[
-2+q-1=0
\]

だから、

\[
q=3
\]

である。

Thinking nodes:
- 117-p1-apply
  - correct: \(p+q-1=0,\ -p-2=0\)
  - purpose: theorem application; not mere copying
- 117-p1-solve
  - correct: \(p=-2,\ q=3\)
  - purpose: solve the resulting rational system

Final result (1):
\[
p=-2,\qquad q=3
\]

---

# 3. (2) 分母を有理化する

## 穴なし完成文章

\[
\frac{p}{\sqrt2-1}
\]

では、分母の共役 \(\sqrt2+1\) を使う。

\[
\frac{p}{\sqrt2-1}
\cdot
\frac{\sqrt2+1}{\sqrt2+1}
=
p(\sqrt2+1)
\]

なぜなら、

\[
(\sqrt2-1)(\sqrt2+1)=2-1=1
\]

だからである。

また、

\[
\frac{q}{\sqrt2}
=
\frac{q\sqrt2}{2}.
\]

したがって元の式は、

\[
p(\sqrt2+1)+\frac{q\sqrt2}{2}=1
\]

となる。

Thinking nodes:
- 117-p2-conjugate
  - correct: \((\sqrt2+1)/(\sqrt2+1)\)
  - purpose: choose conjugate based on denominator
- 117-p2-rationalize
  - correct:
    \[
    \frac{p}{\sqrt2-1}=p(\sqrt2+1),
    \quad
    \frac{q}{\sqrt2}=\frac{q\sqrt2}{2}
    \]
  - purpose: complete both rationalizations as one meaningful transformation

Result node:
- label: (2) の有理化後
- result:
  \[
  p(\sqrt2+1)+\frac{q\sqrt2}{2}=1
  \]

---

# 4. (2) 係数分離形へ整理する

展開すると、

\[
p\sqrt2+p+\frac q2\sqrt2=1
\]

なので、

\[
\left(p+\frac q2\right)\sqrt2+(p-1)=0
\]

となる。

分数を避けたいなら全体を2倍して、

\[
(2p+q)\sqrt2+(2p-2)=0
\]

としてもよい。

本教材では mobile readability と次の連立方程式の見やすさを優先し、

\[
(2p+q)\sqrt2+(2p-2)=0
\]

を canonical grouped form とする。

Thinking node:
- 117-p2-group
  - correct: \((2p+q)\sqrt2+(2p-2)=0\)
  - purpose: rational coefficient + irrational basis form に変換
  - avoid: q/2 only as isolated fraction manipulation hole

Result node:
- label: (2) の係数分離形
- result:
  \[
  (2p+q)\sqrt2+(2p-2)=0
  \]

---

# 5. (2) 116を使って解く

116の結果より、

\[
2p+q=0
\]

かつ

\[
2p-2=0
\]

である。

第二式から、

\[
p=1
\]

第一式へ代入して、

\[
2+q=0
\]

だから、

\[
q=-2
\]

である。

Thinking nodes:
- 117-p2-apply
  - correct: \(2p+q=0,\ 2p-2=0\)
  - purpose: theorem application
- 117-p2-solve
  - correct: \(p=1,\ q=-2\)
  - purpose: solve the system

Final result (2):
\[
p=1,\qquad q=-2
\]

---

# 6. Current-stage compression

Target order:
1. p1-expand
2. p1-group
3. p1-apply
4. p1-solve
5. p2-conjugate
6. p2-rationalize
7. p2-group
8. p2-apply
9. p2-solve

Dependencies:
- p1-group ← p1-expand
- p1-apply ← p1-group + external theorem R116
- p1-solve ← p1-apply
- p2-rationalize ← p2-conjugate
- p2-group ← p2-rationalize
- p2-apply ← p2-group + external theorem R116
- p2-solve ← p2-apply

Rules:
- (1),(2) independent
- current stage only
- previous long derivation collapses
- only immediately required local result links show
- external theorem R116 shows compactly only on theorem-application stages
- after (1) completes, none of its algebra should remain visible during (2)

---

# 7. Hole quality audit

Keep:
- distribution in (1)
- coefficient grouping
- theorem application
- system solving
- conjugate choice
- complete rationalization
- coefficient grouping after rationalization

Do not create:
- “√2” or “1” isolated token holes
- denominator \(2-1\) arithmetic-only hole
- one hole per tiny algebraic symbol
- final p/q value holes without the preceding coefficient equations

---

# 8. Cross-problem UI implementation requirement

117 is the first problem requiring a dependency from a different question.

Add a general presentation-level concept such as:

- external dependency id
- source question id
- label
- static result statement
- optional expandable reminder

Desired learner view:

「前に使える結果」
[116の結果]  \(A+B\sqrt2=0,\ A,B\in\mathbb Q\Rightarrow A=B=0\)

Tap:
- show short reminder of why the theorem holds
- optionally offer navigation to problem 116 if the current app architecture already supports it
- do not require 116 to be solved in the current session
- do not duplicate 116's entire page into 117

This mechanism should be generic enough for future cross-problem theorem reuse.

---

# 9. Rendering / mobile audit

Required:
- \((\sqrt2-1)p\)
- \((p+q-1)\sqrt2-(p+2)=0\)
- \(\frac{p}{\sqrt2-1}\)
- \(\frac{q}{\sqrt2}\)
- \(p(\sqrt2+1)+\frac{q\sqrt2}{2}=1\)
- \((2p+q)\sqrt2+(2p-2)=0\)
- external theorem statement with \(\mathbb Q\)

Required QA:
- no raw sqrt / frac / mathbb
- no MathML-duplicated brittle text assertions
- no horizontal overflow on mobile
- no leakage of final coefficient equations before grouping stage
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
- mobile/desktop smoke

---

# 10. Acceptance gate

117 must pass:
1. typecheck
2. source/catalog/parity tests
3. cross-problem dependency unit test
4. build
5. mobile smoke
6. desktop smoke
7. deploy

After 117, the proof-theme batch 108,110–117 is complete.
