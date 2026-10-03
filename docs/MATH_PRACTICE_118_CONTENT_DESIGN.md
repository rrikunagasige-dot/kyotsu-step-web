# MATH PRACTICE 118 CONTENT DESIGN
## 「条件から命題を読む」第12問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
次のうち、「y は x の関数である」といえるものはどれか。

(1) 円周の長さが \(x\) である円の半径の長さ \(y\)

(2) 正の数 \(x\) の平方根 \(y\)

(3) 面積が1である長方形の縦の長さ \(x\) と横の長さ \(y\)

App placement:
- Learner-facing theme: 「条件から命題を読む」
- Original source chapter: 第3章「2次関数」
- Do not create a fourth learner-facing theme.

Type:
- C + I

Core criterion:
- \(y\) is a function of \(x\) exactly when each allowed \(x\) determines one and only one \(y\).

The three subproblems share only this criterion. Their results do not depend on one another.

---

# 0. 共通準備 — 関数の判定基準

For every allowed input \(x\), ask:

\[
\text{その }x\text{ に対応する }y\text{ はただ1つか}
\]

Thinking node:
- 118-rule
  - correct: 「1つの x に対して y がただ1つ決まる」
  - purpose: learner should judge uniqueness, not whether a formula merely exists

Result node:
- label: 関数の判定基準

---

# 1. (1) 円周 → 半径

円周が \(x\)、半径が \(y\) なら、

\[
x=2\pi y
\]

なので、

\[
y=\frac{x}{2\pi}
\]

である。

1つの円周 \(x\) を決めると、半径 \(y\) はただ1つに決まる。

Therefore:
- 関数である

Thinking node:
- 118-p1
  - correct: \(y=x/(2\pi)\)、1つの \(x\) に1つの \(y\)、関数である
  - purpose: relation → unique output → judgment を一体で確認する

No need for separate holes:
- dividing by \(2\pi\)
- “出る/出ない”
- “である/ではない”
Those would become mechanical repeats after the relation is known.

---

# 2. (2) 正の数の平方根

To disprove functionhood, it is enough to find one allowed \(x\) with two different \(y\)'s.

For example,

\[
x=4
\]

has two square roots:

\[
y=2,\quad -2
\]

The same \(x=4\) corresponds to two different outputs.

Therefore:
- 関数ではない

Thinking node:
- 118-p2
  - correct: \(x=4\Rightarrow y=2,-2\)、therefore not a function
  - purpose: concrete counterexample to uniqueness
  - avoid asking the learner to guess the number 4 alone

Important semantic distinction:
- 「4の平方根」は \(2,-2\)
- 「\(\sqrt4\)」is the principal nonnegative square root \(2\)
- The source says “平方根 y”, so the \(\pm\) ambiguity is the key.

---

# 3. (3) 面積1の長方形

縦が \(x\)、横が \(y\)、area is1, so

\[
xy=1
\]

Because side lengths are positive,

\[
x>0
\]

and therefore

\[
y=\frac1x
\]

For each positive \(x\), exactly one positive \(y\) is determined.

Therefore:
- 関数である

Thinking node:
- 118-p3
  - correct: \(xy=1\Rightarrow y=1/x\), positive \(x\) gives exactly one \(y\), so it is a function
  - purpose: physical-domain condition + uniqueness

---

# 4. Current-stage compression

Target order:
1. basis
2. p1
3. p2
4. p3

Dependencies:
- p1 ← basis
- p2 ← basis
- p3 ← basis
- no subproblem-to-subproblem dependency

Rules:
- show current subproblem only
- common criterion may appear as compact dependency result
- previous subproblem derivations disappear
- no result link merely because the learner solved the previous number
- final answers must not leak into headings

---

# 5. Hole quality audit

Keep:
- uniqueness criterion
- relation + uniqueness judgment for (1)
- one complete counterexample for (2)
- area relation + domain + uniqueness judgment for (3)

Do not create:
- a standalone number hole for \(x=4\)
- separate “出る/出ない” then “である/ではない” holes after the logic is already decided
- terminology-only hole asking “関数” before uniqueness meaning is established

---

# 6. Rendering / mobile audit

Required:
- \(x=2\pi y\)
- \(y=x/(2\pi)\)
- \(x=4,\ y=2,-2\)
- \(xy=1\)
- \(y=1/x\)

Required QA:
- \(\pi\), fractions, minus signs render cleanly
- no raw authoring syntax
- no horizontal overflow
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
- mobile/desktop smoke

---

# 7. Acceptance gate before 119

118 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 119 be enabled.
