# MATH LEARNING MODE — PROPOSITION READING RESTORATION DESIGN

Status: **DESIGN FROZEN / IMPLEMENTATION NOT STARTED**

Target:
- `math-propositions-reading`
- source: 深進数学I p.92〜95 相当
- current revision: 1
- current holes: 18

Authority:
1. `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1`
2. 2026-10-03 math learning-mode Recovery / Freeze contract
3. user-reviewed mathematics textbook-mode mother examples
4. source textbook order
5. current implementation

This document restores the unit to the already-frozen mathematics learning-mode architecture.
It does not invent a new pedagogy.

---

# 1. Restoration goal

Current unit is locally correct but too often reads as:

```text
short prose
→ choice
→ short prose
→ choice
→ another mini-example
→ choice
→ conclusion choice
```

Restore it to:

```text
worked concrete example
→ thinking node(s)
→ result meaning
→ name / notation
→ generalization
→ immediate example
→ fade support
```

The source examples stay.
The main operation is to **reassign roles and remove redundant post-conclusion choices**.

---

# 2. Hole-type legend

MASTER hole types:

- A = 問題理解
- B = 復習
- C = 状態更新
- D = 方針選択
- E = 式生成
- F = 導出
- G = 理由
- H = 意味・解釈

Disposition:

- KEEP = interaction stays essentially as-is
- MOVE = interaction stays but moves to a clearer concept-cycle position
- MERGE = mathematical step stays, but no longer as a separate interaction; merge into prose / resolved example
- REMOVE = interaction is deleted with no independent thinking-node loss
- ADD = genuinely missing thinking node must be added
- REWRITE = same node remains interactive but prompt/presentation changes

---

# 3. Restored concept cycles

## Cycle R1 — 命題と (p\Rightarrow q)

### Introduction worked example

[
p:-2\le x\le1,qquad q:x<3
]

Learning line:

1. What does p allow?
2. Does every allowed x also satisfy q?
3. Therefore the statement is true.
4. Only now introduce:
   - 命題
   - (p\Rightarrow q)
5. Re-express the same relation with sets (P,Q).
6. Learner notices (P\subset Q).
7. Generalize:
   [
   p\Rightarrow q	ext{ is true}iff P\subset Q.
   ]

### Interactions

- `prop-a01`: KEEP
  - hole type: H（条件の意味・包含関係を読む）
  - role: introduction worked-example core judgment
- `prop-a02`: KEEP / MOVE into the generalization step
  - hole type: H（言葉→集合表現）
  - role: representation link, not a second independent quiz

### Concept boundary

After `prop-a01`:
- 「真偽を判断できる文を命題という」
- (p\Rightarrow q)

After `prop-a02`:
- implication ↔ set inclusion generalization

No extra terminology-recall interaction is needed.

---

## Cycle R2 — 反例

### Introduction worked example

[
p:x<2,qquad q:x>0
]

Learning line:

1. To test “every p also satisfies q,” look for one x that satisfies p but breaks q.
2. Find (x=-1).
3. Interpret what that one example does to the statement.
4. Conclude the implication is false.
5. Only now introduce the name **反例**.
6. Show the P/Q figure after the judgment.

### Interactions

- `prop-a03`: KEEP
  - hole type: D/H（反例候補を選ぶ）
  - role: find the breaking example
- `prop-a04`: KEEP
  - hole type: G/H（1例の失敗が命題全体を崩す意味）
  - role: concept-formation conclusion

This two-step pair is **not redundant** because this is the first time the learner experiences
“find one counterexample → universal statement becomes false.”

### Immediate example 1

[
x^2=9\Rightarrow x=3
]

- `prop-a05`: KEEP
  - hole type: H
  - role: immediate use of the newly learned counterexample idea
- `prop-a06`: MERGE
  - current step: choose “偽” after already selecting (-3)
  - reason: once (-3) is correctly identified as the counterexample, a second choice panel asking “真/偽” no longer adds an independent thinking node
  - restored prose:
    “(-3) は前件を満たすが後件を満たさない。したがってこの命題は偽である。”

### Immediate example 2 / faded transfer

“二等辺三角形なら正三角形である”

- `prop-a07`: KEEP / MOVE as the light transfer at the end of the cycle
  - hole type: H
  - role: transfer from algebra to geometry
- `prop-a08`: MERGE
  - same reason as a06
  - after the learner finds a valid geometric counterexample, prose states the implication is false

### Result

Current 6 interactions in this block:
a03/a04/a05/a06/a07/a08

Restored:
a03/a04/a05/a07 = 4 interactions

The mathematics is unchanged.
The “mini-quiz echo” after each counterexample is removed.

---

## Cycle R3 — 必要条件・十分条件

### Introduction worked example

[
p: ABCD	ext{ is a rectangle},qquad q: AC=BD
]

Learning line:

1. Check (p\Rightarrow q).
2. Reverse the direction and check (q\Rightarrow p).
3. See that the two directions behave differently.
4. Only now introduce:
   - p is a sufficient condition for q
   - q is a necessary condition for p
5. Express the definition in words before classification practice.

### Interactions

- `prop-b01`: KEEP
  - hole type: B/H
  - role: first-direction judgment using known rectangle property
- `prop-b02`: KEEP
  - hole type: H
  - role: reverse-direction judgment / counterexample reading
- `prop-b03`: MERGE
  - current step asks the newly taught terminology on the same example
  - this is primarily vocabulary retrieval, not a new mathematical thinking node
  - restored prose explicitly names AC=BD as a necessary condition after the definition

### Immediate example

[
p:x^2>0,qquad q:x>0
]

- `prop-b04`: KEEP
  - hole type: H
  - role: immediate application to a new algebraic example
  - support: medium

This is the real “すぐ使ってみる” node for the necessary/sufficient concept.

---

## Cycle R4 — 必要十分条件・同値

### Introduction worked example

[
p:x=0,qquad q:x(x^2+1)=0
]

Learning line:

1. Check both directions.
2. Learner reaches “both are true.”
3. Only now introduce:
   - 必要十分条件
   - 同値
   - (p\Longleftrightarrow q)
4. Generalize:
   both directions true ↔ necessary and sufficient ↔ equivalent.

### Interactions

- `prop-b05`: KEEP
  - hole type: H/G
  - role: concept-forming observation “both directions are true”
- `prop-b06`: MERGE
  - current prompt asks for the just-introduced name on the same example
  - no independent mathematical step
  - restored prose names the relation after the concept paragraph

### Note

Do **not** invent a new off-source example merely to satisfy a mechanical template.
If the source provides an additional iff example, it may be used later.
Otherwise the cycle ends after concept/generalization and moves on.

---

## Cycle R5 — 条件の否定

### Introduction worked example

For integer (n):

[
n<2
]

Learning line:

1. Find the integers for which the condition fails.
2. Obtain (n\ge2).
3. Only now introduce **否定**.
4. Connect to complement of a set.
5. Immediately use the idea on a direct sentence.

### Interactions

- `prop-c01`: KEEP
  - hole type: H
  - role: concept-forming boundary judgment
- `prop-c02`: KEEP
  - hole type: H
  - role: immediate simple use after definition

This pair already matches the MASTER well.

---

## Cycle R6 — 複合条件の否定 / ド・モルガン

### Introduction worked example

[
a<0quad	ext{and}quad b>0
]

Learning line:

1. Ask when the whole “and” condition fails.
2. Learner sees that at least one side can fail.
3. Construct:
   [
   a\ge0quad	ext{or}quad b\le0.
   ]
4. Only then generalize with condition De Morgan:
   - not (p and q) = not p or not q
   - not (p or q) = not p and not q
5. Immediate example:
   [
   x\le-1quad	ext{or}quad x\ge3
   ]
   → (-1<x<3)

### Interactions

- `prop-c03`: KEEP
  - hole type: E/H
  - role: construct the compound negation from meaning
- `prop-c04`: KEEP
  - hole type: E/H
  - role: immediate use with faded support

This pair already matches the MASTER well.

---

# 4. All 18 holes — final disposition table

| Hole | MASTER type | Current role | Disposition | Restored role |
|---|---|---|---|---|
| prop-a01 | H | concept formation | KEEP | 命題導入例の核心判断 |
| prop-a02 | H | representation link | KEEP/MOVE | (p\Rightarrow qleftrightarrow P\subset Q) の一般化 |
| prop-a03 | D/H | concept formation | KEEP | 反例候補を見つける |
| prop-a04 | G/H | causal reasoning | KEEP | 1反例で命題が偽になる意味 |
| prop-a05 | H | transfer | KEEP | 反例の即時例題 |
| prop-a06 | H | transfer | MERGE | a05後の結論を本文化 |
| prop-a07 | H | transfer | KEEP/MOVE | 幾何へのlight transfer |
| prop-a08 | H | transfer | MERGE | a07後の結論を本文化 |
| prop-b01 | B/H | relation selection | KEEP | (p\Rightarrow q) 判断 |
| prop-b02 | H | relation selection | KEEP | (q\Rightarrow p) 判断 |
| prop-b03 | terminology | definition | MERGE | 定義説明へ統合 |
| prop-b04 | H | transfer | KEEP | 必要/十分の即時例題 |
| prop-b05 | G/H | concept formation | KEEP | 両方向trueを経験 |
| prop-b06 | terminology | transfer | MERGE | 必要十分/同値の概念説明へ統合 |
| prop-c01 | H | concept formation | KEEP | 否定の導入例 |
| prop-c02 | H | transfer | KEEP | 否定の即時例題 |
| prop-c03 | E/H | concept formation | KEEP | 複合否定を自分で構成 |
| prop-c04 | E/H | transfer | KEEP | ド・モルガンの即時例題 |

Summary:
- KEEP / KEEP+MOVE: 14
- MERGE: 4
- REMOVE: 0
- ADD: 0

Important:
The first restoration pass does **not** need more holes.
It needs fewer redundant interaction panels and clearer concept-cycle boundaries.

---

# 5. Learner-facing rhythm after restoration

Current feeling:

```text
judge
judge
judge
judge
judge
judge
...
```

Restored feeling:

```text
[例題] 条件pからqは言えるか
→ a01
→ 命題 / p⇒q
→ a02
→ 集合で一般化

[例題] 成り立たない例を探す
→ a03
→ a04
→ 「反例」
→ 図
→ a05
→ 結論は本文
→ a07
→ 結論は本文

[例題] 長方形と対角線
→ b01
→ b02
→ 必要条件 / 十分条件
→ b04

[例題] x=0 と x(x²+1)=0
→ b05
→ 必要十分条件 / 同値 / ↔

[例題] n<2 の外側
→ c01
→ 「否定」
→ c02

[例題] a<0 かつ b>0 の否定
→ c03
→ 条件版ド・モルガン
→ c04
```

The learner should feel:
“one example is unfolding”
rather than
“another question appeared.”

---

# 6. Writing changes required later

When implementation starts:

1. Add lightweight learner-facing markers only where useful:
   - 例題
   - 今の考え方を整理する
   - すぐ使ってみる

2. Do **not** create a heading for every 2–3 paragraphs.
   MASTER forbids excessive subheadings.

3. Merge a06/a08/b03/b06 into prose.
   Their mathematical conclusions remain visible after the prior thinking node is solved.

4. Keep current source examples.
   Do not import practice-number structure.

5. Preserve:
   - progressive reveal
   - answer leakage gates
   - wrong-answer unresolved state
   - figures
   - mobile layout
   - revision invalidation

6. Revision must increase when answer/item topology changes.

---

# 7. Acceptance gate before code

This reading-unit restoration is ready for implementation only if:

- the six concept cycles are accepted
- all 18 current holes have a disposition
- no new source example is invented
- no practice-mode numbering appears learner-facing
- the result matches:
  concrete example → thinking → concept → generalization → immediate use

Until then:
- status stays `review`
- do not publish
- do not merge PR #31
