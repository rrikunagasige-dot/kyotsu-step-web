# MATH PRACTICE 99 CONTENT DESIGN
## 「条件から命題を読む」第2問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Mandatory read:
1. docs/MATH_PRACTICE_MASTER_LESSONS.md
2. docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md
3. docs/MATH_PRACTICE_98_CONTENT_DESIGN.md
4. docs/MATH_RENDERING_RULES.md

Source problem:
x を実数とする。条件を満たす集合の包含関係を用いて、次の命題の真偽を調べよ。

(1) \(1<x<2 \Rightarrow 1<x<3\)

(2) \(x<1 \Rightarrow 0<x<1\)

(3) \(x>3 \Rightarrow |x+1|>2\)

(4) \(|x|\le 2 \Rightarrow |x-1|<3\)

Theme:
- 条件から命題を読む

Core structure:
- common basis: \(p\Rightarrow q\) is true iff the set \(P\) satisfying \(p\) is contained in the set \(Q\) satisfying \(q\)
- (1)–(4) are mutually independent
- a false implication must be supported by one concrete counterexample from \(P\setminus Q\)
- no previous subproblem answer is imported into the next one

---

# 0. 共通準備 — 含意を集合包含へ直す

## 穴なし完成文章

条件 \(p\) を満たす実数全体の集合を \(P\)、条件 \(q\) を満たす実数全体の集合を \(Q\) とする。

命題 \(p\Rightarrow q\) が真であるとは、\(p\) を満たすすべての実数が \(q\) も満たすということである。

したがって、

\[
p\Rightarrow q \text{ が真}
\iff
P\subseteq Q
\]

である。

逆に \(P\subseteq Q\) でなければ、\(P\) には属するが \(Q\) には属さない値を1つ取れば、それが反例になる。

## Thinking node

- 99-rule
  - prompt: 「命題 \(p\Rightarrow q\) が真になる集合関係は」
  - correct: \(P\subseteq Q\)
  - purpose: implication ↔ inclusion の共通判定規則を作る

Result node:
- label: 判定規則
- result: \(P\subseteq Q\)

UI:
- basis is prepared once
- later subproblems show only a compact basis result
- full basis is tap-to-expand
- no completed subproblem result is inherited by the next subproblem

---

# 1. (1) \(1<x<2 \Rightarrow 1<x<3\)

## 穴なし完成文章

前件を満たす集合は

\[
P=(1,2)
\]

後件を満たす集合は

\[
Q=(1,3)
\]

である。

\((1,2)\) のすべての実数は \((1,3)\) に含まれるため、

\[
P\subseteq Q
\]

である。

したがって、(1) は**真**である。

## Thinking node

- 99-p1-result
  - prompt: 「\(P=(1,2), Q=(1,3)\) の関係から、(1)は」
  - correct: 「\(P\subseteq Q\) なので真」
  - purpose: interval containmentから真偽を確定する

Do not split into:
- “Pは何か”
- “Qは何か”
- “真か”
の3つのコピー穴。1つのreasoning nodeにまとめる。

---

# 2. (2) \(x<1 \Rightarrow 0<x<1\)

## 穴なし完成文章

前件を満たす集合は

\[
P=(-\infty,1)
\]

後件を満たす集合は

\[
Q=(0,1)
\]

である。

\(P\) には負の数も含まれるため、\(P\subseteq Q\) ではない。

たとえば

\[
x=-1
\]

は \(x<1\) を満たすが、\(0<x<1\) を満たさない。

したがって、\(x=-1\) は反例であり、(2) は**偽**である。

## Thinking nodes

- 99-p2-counterexample
  - correct: \(x=-1\)
  - purpose: \(P\setminus Q\) から具体的な反例を作る

- 99-p2-result
  - prompt: 「この反例があるので、(2)は」
  - correct: 「偽」
  - purpose: counterexample → false implication を確定する

Leakage guard:
- counterexample選択前に \(x=-1\) を本文に出さない
- 正答後に初めて完成文へ入る

---

# 3. (3) \(x>3 \Rightarrow |x+1|>2\)

## 穴なし完成文章

前件 \(x>3\) から

\[
x+1>4
\]

である。

したがって \(x+1\) は正であり、

\[
|x+1|=x+1>4>2
\]

となる。

よって、前件を満たすすべての \(x\) は後件も満たすので、(3) は**真**である。

## Thinking node

- 99-p3-result
  - prompt: 「\(x>3\) からどのように後件が従うか」
  - correct: 「\(x+1>4\) なので \(|x+1|>2\)、よって真」
  - purpose: inequality implicationを式変形から確定する

Do not create:
- “x+1>何？”
- “4>2？”
のような低価値な数字穴。

---

# 4. (4) \(|x|\le2 \Rightarrow |x-1|<3\)

## 穴なし完成文章

前件

\[
|x|\le2
\]

を満たす集合は

\[
P=[-2,2]
\]

である。

後件を変形すると、

\[
|x-1|<3
\iff
-3<x-1<3
\iff
-2<x<4
\]

なので、

\[
Q=(-2,4)
\]

である。

ここで \(x=-2\) は \(P\) には属するが、\(Q\) には属さない。

実際、

\[
|-2|=2\le2,\qquad |-2-1|=3
\]

なので、後件の \(|x-1|<3\) は成り立たない。

したがって、(4) は**偽**である。

## Thinking nodes

- 99-p4-q-set
  - prompt: 「\(|x-1|<3\) を区間で表すと」
  - correct: \(-2<x<4\)
  - purpose: absolute-value condition → set conversion

- 99-p4-counterexample-result
  - prompt: 「\(P=[-2,2], Q=(-2,4)\) を比べると」
  - correct: 「\(x=-2\) が反例なので偽」
  - purpose: endpoint strictnessを読み、false implicationを確定する

Leakage guard:
- q-setを問う前に \(-2<x<4\) を本文に表示しない
- final node前に \(x=-2\) を反例として明示しない

---

# 5. Current-stage compression

Target order:

1. basis — inclusion rule
2. s1 — (1)
3. s2 — (2)
4. s3 — (3)
5. s4 — (4)

Rules:
- current target only
- s1–s4 depend only on basis
- s1 result is not shown in s2
- s2 result is not shown in s3
- s3 result is not shown in s4
- common basis remains as a compact dependency chip
- future reasoning stays hidden
- completed full derivations collapse

---

# 6. Hole quality audit

Keep:
- inclusion criterion
- interval containment judgment
- construction of a counterexample
- absolute-value set conversion
- strict-endpoint counterexample

Do not create:
- arithmetic-only holes
- repeated “真 / 偽” after the conclusion is already encoded in the previous answer
- separate holes for every intermediate number
- result-copy holes

---

# 7. Rendering / mobile audit

Math surfaces:
- \(P\subseteq Q\)
- \(1<x<2\)
- \(x<1\)
- \(|x+1|>2\)
- \(|x|\le2\)
- \(|x-1|<3\)
- interval notation including \((-\infty,1)\), \([-2,2]\), \((-2,4)\)

Required:
- escaped TeX backslashes in TypeScript sources
- no raw authoring commands such as subseteq, infty, or le
- no duplicated inline formula caused by prose + explicit LaTeX rendering
- no horizontal overflow
- mobile and desktop smoke
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana

---

# 8. Acceptance gate before 100

99 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile browser smoke
5. desktop browser smoke
6. deploy

Only after this gate may problem 100 be enabled.
