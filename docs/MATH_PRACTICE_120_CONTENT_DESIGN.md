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
