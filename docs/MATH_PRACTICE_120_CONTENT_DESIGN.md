# MATH PRACTICE 120 CONTENT DESIGN
## 「条件から命題を読む」第14問

Status: PRE-IMPLEMENTATION PREP ONLY
Do not enable 120 until 119 passes its gate.

Source:
次の各場合について、\(y\) を \(x\) の式で表せ。また、\(x\) の変域も示せ。

(1) 底辺が6 cm、高さが \(x\) cm の三角形の面積を \(y\) cm² とする。

(2) 15 km の道のりを時速3 kmで歩くとき、歩き始めてから \(x\) 時間後の残りの道のりを \(y\) km とする。

Theme:
- 条件から命題を読む

Type:
- I with internal linear stages

Core idea:
- 文章中の量を式へ変換する。
- 式ができた後で、\(x\) が現実に取り得る範囲を文章条件から決める。
- 変域は式の付録ではなく、モデルの一部。
- (1),(2) は独立。

---

# 1. (1) 三角形の面積

## 穴なし完成文章

三角形の面積は

\[
\frac12\times\text{底辺}\times\text{高さ}
\]

である。

今回、底辺は6、高さは \(x\) なので、

\[
y=\frac12\cdot6\cdot x
\]

したがって、

\[
y=3x
\]

である。

次に変域を考える。

\(x\) は三角形の高さを表す。
長さなので負にはならず、また \(x=0\) では面積をもつ三角形にならない。

したがって、

\[
x>0
\]

である。

Final:
\[
y=3x,\qquad x>0
\]

Recommended stages:
1. p1-formula
   - triangle area formula
2. p1-model
   - substitute base 6 and height x → \(y=3x\)
3. p1-domain-meaning
   - x is height; negative impossible; x=0 invalid
4. p1-domain
   - \(x>0\)

Dependencies:
- p1-model ← p1-formula
- p1-domain-meaning may use source directly
- p1-domain ← p1-domain-meaning + p1-model only if final combined result is needed

Hole focus:
- formula recall
- verbal quantities → formula
- physical meaning of x
- boundary inclusion/exclusion

Avoid:
- isolated hole “3”
- separate trivial multiplication holes
- asking “高さ” after the sentence has already directly stated it unless the learner must use it to decide domain

---

# 2. (2) 残りの道のり

## 穴なし完成文章

速さは3 km/h、時間は \(x\) 時間。

進んだ距離は

\[
\text{速さ}\times\text{時間}=3x
\]

km。

最初の道のりは15 kmなので、残りの道のりは

\[
y=15-3x
\]

である。

次に変域を考える。

歩き始めた瞬間は

\[
x=0
\]

である。

15 kmを時速3 kmで歩き終える時間は

\[
\frac{15}{3}=5
\]

時間。

したがって、

\[
0\le x\le5
\]

である。

Final:
\[
y=15-3x,\qquad 0\le x\le5
\]

Recommended stages:
1. p2-distance-rule
   - distance = speed × time
2. p2-traveled
   - traveled distance \(3x\)
3. p2-model
   - remaining \(=15-3x\)
4. p2-start
   - start time \(x=0\)
5. p2-end
   - finish time \(15/3=5\)
6. p2-domain
   - \(0\le x\le5\)

Dependencies:
- p2-traveled ← p2-distance-rule
- p2-model ← p2-traveled
- p2-domain ← p2-start + p2-end
- no dependency from subproblem (1)

Hole focus:
- quantity relation
- “remaining” means initial minus traveled
- start/end boundary inclusion
- finish-time calculation

Avoid:
- isolated holes for units
- making 15 or 3 into number-guess holes
- determining domain without first identifying what x represents

---

# 3. Current-stage compression

Target order:
1. p1-formula
2. p1-model
3. p1-domain-meaning
4. p1-domain
5. p2-distance-rule
6. p2-traveled
7. p2-model
8. p2-start
9. p2-end
10. p2-domain

Rules:
- current stage only
- (1),(2) independent
- previous subproblem derivation disappears when (2) begins
- formula result may be compactly reused inside the same subproblem
- no “because solved earlier” links

---

# 4. Rendering / mobile audit

Required:
- \(\frac12\cdot6\cdot x\)
- \(y=3x\)
- \(x>0\)
- \(y=15-3x\)
- \(15/3=5\)
- \(0\le x\le5\)

QA:
- inequalities and fraction render cleanly
- units stay prose, not overloaded into math
- no raw TeX
- no mobile horizontal overflow
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana

---

# 5. Acceptance gate

120 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

After 120:
- 87–120 integration is complete.
- Run a batch-level user QA pass focused on:
  - theme navigation
  - current-stage compression
  - result links / external theorem link
  - math rendering
  - mobile layout
  - answer leakage
  - final titles and learner-facing continuity.


---

# Implementation-ready thinking nodes

(1):
- 120-p1-formula
  - correct: 三角形の面積 \(=\frac12\times\)底辺\(\times\)高さ
  - purpose: retrieve the geometric relation
- 120-p1-model
  - correct: \(y=\frac12\cdot6\cdot x=3x\)
  - purpose: map prose quantities into the formula
- 120-p1-domain-meaning
  - correct: \(x\) is height; negative values impossible; \(x=0\) does not form a triangle with positive area
  - purpose: interpret the variable before choosing inequalities
- 120-p1-domain
  - correct: \(x>0\)
  - purpose: convert the physical constraint into the mathematical domain

(2):
- 120-p2-distance-rule
  - correct: distance = speed × time
- 120-p2-traveled
  - correct: \(3x\) km
- 120-p2-model
  - correct: \(y=15-3x\)
  - purpose: recognize “remaining = initial - traveled”
- 120-p2-start
  - correct: \(x=0\)
- 120-p2-end
  - correct: \(15/3=5\) hours
- 120-p2-domain
  - correct: \(0\le x\le5\)

Distractor design:
- p1 formula: base+height, base×height, \(\frac12\)(base+height)
- p1 domain: \(x\ge0\), \(x<0\)
- p2 model: \(15+3x\), \(3x-15\)
- p2 end: \(15-3=12\), \(15\times3=45\)
- p2 domain: \(0<x<5\), \(x\ge0\) without upper bound

Leakage checks:
- do not expose \(x>0\) before the learner interprets height and zero
- do not expose finish time 5 before the learner forms the speed-time relation
- do not show final combined answer \(y=15-3x,\ 0\le x\le5\) while the domain stage is unresolved


---

# Pre-implementation dependency / leakage audit

Canonical stage graph:

\[
\text{p1-formula}\rightarrow\text{p1-model}
\]

\[
\text{p1-domain-meaning}\rightarrow\text{p1-domain}
\]

The formula branch and domain branch both read the source, but neither should expose the other's answer early. At the final domain stage, showing \(y=3x\) is optional rather than logically required, so do not create a convenience dependency solely to keep old work visible.

For (2):

\[
\text{p2-distance-rule}\rightarrow\text{p2-traveled}\rightarrow\text{p2-model}
\]

and independently,

\[
\text{p2-start},\text{p2-end}\rightarrow\text{p2-domain}.
\]

Important implementation choice:
- p2-end may use the source numbers 15 and 3 directly; it does not need the solved p2-model result.
- p2-domain must import only p2-start and p2-end.
- when p2 starts, all of (1)'s derivation disappears from the default view.

Answer-leakage matrix:
- p1-formula: must not show \(y=3x\) or \(x>0\)
- p1-model: may show the area formula result, must not show the domain
- p1-domain-meaning: must not show \(x>0\) as a finished inequality
- p1-domain: may show the compact interpretation result, then resolve \(x>0\)
- p2-distance-rule: must not show \(3x\), \(15-3x\), or 5
- p2-traveled: may show speed×time, must not show the remaining-distance formula
- p2-model: may show \(3x\), must not show endpoint 5
- p2-start: must not show the finish time
- p2-end: must not show the final interval
- p2-domain: may show start and end results, then resolve \(0\le x\le5\)

Mobile design:
- one current stage card
- at most two compact dependency results at p2-domain
- units remain prose adjacent to math
- no stacked three-card derivation for a single arithmetic step

Wrong-answer behavior:
- wrong choices do not advance
- hints explain the quantity relation or boundary meaning, not the final answer
- after correction, the resolved statement reads as natural prose/formula without an extra answer box


---

# Stable blank / choice matrix

Use these IDs unchanged in Japanese and Chinese sources.

## (1)

### p1-formula
Prompt purpose:
- retrieve triangle area formula

Correct:
- id: area-formula
- 三角形の面積 = \(\frac12\times\)底辺\(\times\)高さ

Distractors:
- id: base-times-height
- 底辺×高さ
- id: half-sum
- \(\frac12(\)底辺+高さ\()\)

### p1-model
Prompt purpose:
- substitute base 6 and height x into the formula

Correct:
- id: three-x
- \(y=\frac12\cdot6\cdot x=3x\)

Distractors:
- id: six-x
- \(y=6x\)
- id: three-plus-x
- \(y=3+x\)

### p1-domain-meaning
Prompt purpose:
- interpret the physical meaning before writing an inequality

Correct:
- id: positive-height
- \(x\) is height; it cannot be negative, and \(x=0\) does not give a nondegenerate triangle

Distractors:
- id: zero-allowed
- height may be 0
- id: negative-allowed
- height may be negative

### p1-domain
Correct:
- id: x-positive
- \(x>0\)

Distractors:
- id: x-nonnegative
- \(x\ge0\)
- id: x-negative
- \(x<0\)

## (2)

### p2-distance-rule
Correct:
- id: speed-times-time
- 距離 = 速さ×時間

Distractors:
- id: speed-plus-time
- 距離 = 速さ+時間
- id: time-div-speed
- 距離 = 時間÷速さ

### p2-traveled
Correct:
- id: three-x
- \(3x\) km

Distractors:
- id: fifteen-x
- \(15x\) km
- id: three-plus-x
- \(3+x\) km

### p2-model
Correct:
- id: fifteen-minus-three-x
- \(y=15-3x\)

Distractors:
- id: fifteen-plus-three-x
- \(y=15+3x\)
- id: three-x-minus-fifteen
- \(y=3x-15\)

### p2-start
Correct:
- id: zero
- \(x=0\)

Distractors:
- id: three
- \(x=3\)
- id: fifteen
- \(x=15\)

### p2-end
Correct:
- id: five
- \(15/3=5\) hours

Distractors:
- id: twelve
- \(15-3=12\)
- id: forty-five
- \(15\times3=45\)

### p2-domain
Correct:
- id: zero-to-five-closed
- \(0\le x\le5\)

Distractors:
- id: zero-to-five-open
- \(0<x<5\)
- id: nonnegative-only
- \(x\ge0\)

## Stage/result metadata

- p1-formula
  - result label: 三角形の面積公式
- p1-model
  - dependsOn: p1-formula
  - result label: (1) の関数式
- p1-domain-meaning
  - no dependency on p1-model
  - result label: x の意味と境界
- p1-domain
  - dependsOn: p1-domain-meaning

- p2-distance-rule
  - result label: 距離の関係
- p2-traveled
  - dependsOn: p2-distance-rule
  - result label: x時間で進む距離
- p2-model
  - dependsOn: p2-traveled
  - result label: (2) の関数式
- p2-start
  - result label: 始点
- p2-end
  - result label: 終点
- p2-domain
  - dependsOn: p2-start, p2-end

Do not invent cross-links between (1) and (2).
