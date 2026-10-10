# MATH LEARNING MODE — PROPOSITION PROOF RESTORATION DESIGN

Status: **DESIGN FROZEN / IMPLEMENTATION NOT STARTED**

Target:
- `math-propositions-proof`
- source: 深進数学I p.96〜98 相当
- current revision: 2
- current holes: 23

Authority:
1. `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1`
2. 2026-10-03 math learning-mode Recovery / Freeze contract
3. user-reviewed mathematics textbook-mode mother examples
4. source textbook order
5. current implementation

---

# 1. Main conclusion

Among the 3 review units, this unit is already closest to the frozen mathematics learning-mode architecture.

The main problem is **not the number of holes**.

The current B/C sections already behave like worked examples:

```text
choose strategy
→ build expression
→ derive step by step
→ interpret result
→ reach proof conclusion
→ name / summarize method
```

The main restoration is:

1. make A start from a **concrete source proposition**, not abstract (p\Rightarrow q);
2. group A as one worked comparison rather than many unrelated mini-questions;
3. prevent the contradiction intro from explaining the whole proof strategy before `proof-c00`.

---

# 2. Hole-type legend

MASTER hole types:
- A 問題理解
- B 復習
- C 状態更新
- D 方針選択
- E 式生成
- F 導出
- G 理由
- H 意味・解釈

Disposition:
- KEEP
- MOVE
- MERGE
- REMOVE
- ADD
- REWRITE

---

# 3. Restored concept cycles

## Cycle P1 — 逆・裏・対偶を具体命題から作る

### Current issue

Current learner flow begins from the abstract:

[
p\Rightarrow q
]

and immediately asks:
- swap p/q
- negate both
- swap + negate

Only after that does the concrete source example

[
x^2=x\Rightarrow x=1
]

appear.

This is opposite to the frozen mathematics mode’s preferred order:
**concrete example → operation → common structure → name**.

### Restored introduction

Start with the source example:

[
x^2=x\Rightarrow x=1.
]

Set:

[
p: x^2=x,qquad q: x=1.
]

Then, within this one example:

1. swap front/back;
2. negate both without swapping;
3. swap and negate both.

Only after the learner has produced the three transformed statements, introduce the names together:

- (q\Rightarrow p): 逆
- (ar p\Rightarrowar q): 裏
- (ar q\Rightarrowar p): 対偶

Then generalize back to arbitrary (p\Rightarrow q).

### Interactions

- `proof-a01`: KEEP / MOVE / REWRITE
  - MASTER type: E/H
  - role: concrete proposition’s front/back swap
- `proof-a02`: KEEP / MOVE / REWRITE
  - MASTER type: E/H
  - role: concrete proposition’s both-side negation
- `proof-a03`: KEEP / MOVE / REWRITE
  - MASTER type: E/H
  - role: concrete proposition’s swap + negation

No new hole is needed.

### Important learner-facing rule

Do not render these as three independent “definition questions.”
They are three operations inside **one example**.

---

## Cycle P2 — 元命題・逆・裏・対偶の真偽を比べる

Continue with the same concrete example:

[
x^2=x\Rightarrow x=1.
]

Learning line:

1. Original is false because (x=0) is a counterexample.
2. Reverse is true.
3. Inverse is true.
4. Contrapositive is false because the same (x=0) breaks it.
5. The learner sees a pattern in truth values.

### Interactions

- `proof-a04`: KEEP
  - MASTER type: B/H
  - role: apply known counterexample logic to original
- `proof-a04r`: KEEP
  - MASTER type: H
  - role: truth of reverse
- `proof-a04i`: KEEP
  - MASTER type: H
  - role: truth of inverse
- `proof-a05`: KEEP
  - MASTER type: B/H
  - role: truth of contrapositive using counterexample

Although there are four interactions, they belong to **one truth-comparison worked example**.
Do not split them visually into four equal problem cards.

### Why no MERGE here

The four truth values are the data from which the later pair relation is noticed.
Removing them would make the later generalization feel asserted rather than observed.

---

## Cycle P3 — 別例で真偽ペアを確認し一般化

Source example:

[
n	ext{ is a multiple of }12
\Rightarrow
n	ext{ is a multiple of }6.
]

This is the “すぐ使ってみる” example after P1/P2.

Learning line:

1. Judge the original.
2. Find one number that breaks reverse and inverse.
3. Judge the contrapositive.
4. Compare the truth pattern with P2.
5. Only now generalize:
   - original and contrapositive have the same truth value;
   - reverse and inverse have the same truth value.
6. Connect this to proof strategy:
   if the contrapositive is easier, prove it instead.

### Interactions

- `proof-a06`: KEEP
  - MASTER type: H
  - role: immediate transfer, original truth
- `proof-a07`: KEEP
  - MASTER type: B/H
  - role: find shared counterexample for reverse/inverse
- `proof-a08`: KEEP
  - MASTER type: H
  - role: contrapositive truth

The general relation remains prose/generalization after the example.

---

## Cycle P4 — 対偶を使って証明する

Target:

[
n^2	ext{ is a multiple of }3
\Rightarrow
n	ext{ is a multiple of }3.
]

This section already matches the MASTER well.

### Learning line

1. Before algebra, choose the easier direction.
2. Construct the contrapositive.
3. Represent a non-multiple of 3 by remainder 1 or 2.
4. Work the first case.
5. Work the second case.
6. Conclude the contrapositive is true.
7. Therefore the original is true.

### Interactions

- `proof-b00`: KEEP
  - MASTER type: D
  - role: proof-method planning
- `proof-b01`: KEEP
  - MASTER type: E
  - role: construct contrapositive
- `proof-b02`: KEEP
  - MASTER type: B/C
  - role: convert “not multiple of 3” to remainder cases
- `proof-b03`: KEEP
  - MASTER type: F
  - role: algebraic derivation (3(cdots)+1)
- `proof-b04`: KEEP
  - MASTER type: H
  - role: interpret second case
- `proof-b05`: KEEP
  - MASTER type: G/H
  - role: conclude exhaustive cases prove contrapositive

### Important

This section should remain a **single worked proof**.
Do not reduce it to “対偶とは何ですか?” style recall questions.

---

## Cycle P5 — 矛盾を作る証明

Target:

[
sqrt2x+sqrt3y=0,qquad x,y\in\mathbb Q
]

show (x=y=0), using the irrationality of (sqrt6).

### Current issue

Current intro says, before the first learner choice:

> 結論を否定したと仮定し、その仮定から矛盾が生じるかを確かめる。
> 矛盾が起きれば、最初の否定の仮定が誤りだったと分かる。

This gives away the whole strategy before `proof-c00`.

Then `proof-c00` asks:
“x=0を示すため、最初にその否定として何を仮定するか.”

So the prose has already answered the method.

### Restored intro

Do **not** name or fully explain the contradiction strategy first.

Use a focus sentence such as:

“この式から直接 (x=y=0) を取り出すのは難しい。既知の『(sqrt6) は無理数』という事実と両立しない状況が生じないか調べる。”

Then let the learner choose the assumption.

### Interactions

- `proof-c00`: KEEP / REWRITE surrounding prose
  - MASTER type: D
  - role: choose the temporary assumption (x\ne0)
- `proof-c01`: KEEP
  - MASTER type: F
  - role: divide by x
- `proof-c01b`: KEEP
  - MASTER type: F
  - role: multiply by (sqrt3)
- `proof-c02`: KEEP
  - MASTER type: B/H
  - role: recognize rational closure
- `proof-c03`: KEEP
  - MASTER type: G/H
  - role: identify contradiction
- `proof-c04`: KEEP
  - MASTER type: C/H
  - role: reject assumption and recover (x=0)
- `proof-c05`: KEEP
  - MASTER type: C/F
  - role: substitute back and obtain (y=0)

Only **after** this entire proof is complete:

“このように、結論を否定して仮定し、矛盾を導いてその仮定を退ける証明方法を背理法という。”

This part is already conceptually correct in the current unit.

---

# 4. All 23 holes — final disposition table

| Hole | MASTER type | Current role | Disposition | Restored role |
|---|---|---|---|---|
| proof-a01 | E/H | representation link | KEEP/MOVE/REWRITE | concrete命題で逆を作る |
| proof-a02 | E/H | representation link | KEEP/MOVE/REWRITE | concrete命題で裏を作る |
| proof-a03 | E/H | representation link | KEEP/MOVE/REWRITE | concrete命題で対偶を作る |
| proof-a04 | B/H | transfer | KEEP | 元命題の真偽 |
| proof-a04r | H | transfer | KEEP | 逆の真偽 |
| proof-a04i | H | transfer | KEEP | 裏の真偽 |
| proof-a05 | B/H | causal reasoning | KEEP | 対偶の真偽 |
| proof-a06 | H | transfer | KEEP | 2つ目のsource例の元命題 |
| proof-a07 | B/H | transfer | KEEP | 逆/裏の共有反例 |
| proof-a08 | H | causal reasoning | KEEP | 対偶の真偽 |
| proof-b00 | D | solution planning | KEEP | 証明方法を選ぶ |
| proof-b01 | E | solution planning | KEEP | 対偶を構成 |
| proof-b02 | B/C | elimination | KEEP | 余り1/2へ場合分け |
| proof-b03 | F | transfer | KEEP | 式変形を作る |
| proof-b04 | H | transfer | KEEP | 第2場合を解釈 |
| proof-b05 | G/H | causal reasoning | KEEP | 対偶の証明完了 |
| proof-c00 | D | solution planning | KEEP/REWRITE | 仮定を自分で選ぶ |
| proof-c01 | F | representation link | KEEP | xで割る |
| proof-c01b | F | representation link | KEEP | (sqrt3)を掛ける |
| proof-c02 | B/H | causal reasoning | KEEP | 有理数性を確認 |
| proof-c03 | G/H | causal reasoning | KEEP | 矛盾を認識 |
| proof-c04 | C/H | causal reasoning | KEEP | 仮定を退けx=0 |
| proof-c05 | C/F | transfer | KEEP | 代入してy=0 |

Summary:
- KEEP / KEEP+MOVE+REWRITE: 23
- MERGE: 0
- REMOVE: 0
- ADD: 0

This unit does **not** need fewer thinking nodes in the first restoration pass.
It needs stronger worked-example framing and less strategy leakage.

---

# 5. Restored learner-facing rhythm

```text
[例題] x²=x ⇒ x=1
→ concrete命題から逆・裏・対偶を作る
→ ここで名称と一般形
→ 元/逆/裏/対偶の真偽を同じ例の中で比較

[すぐ使う] 12の倍数 ⇒ 6の倍数
→ a06
→ a07
→ a08
→ 元と対偶、逆と裏の真偽関係を一般化

[例題] n²が3の倍数 ⇒ nが3の倍数
→ b00 方法を選ぶ
→ b01 対偶
→ b02 余り
→ b03/b04 場合分け
→ b05 結論
→ 対偶による証明の意味を整理

[例題] √2x+√3y=0
→ c00 仮定を選ぶ
→ c01/c01b 変形
→ c02 有理数性
→ c03 矛盾
→ c04 仮定を退ける
→ c05 y=0
→ ここで初めて「背理法」
```

The learner should feel:
“one proof is unfolding”
rather than
“answer the next logic question.”

---

# 6. Writing changes required later

1. Move the concrete (x^2=x\Rightarrow x=1) example before abstract p/q construction.
2. Map concrete parts to p and q, then let a01/a02/a03 operate on that example.
3. Introduce 逆/裏/対偶 after the operations, then generalize symbolically.
4. Keep a04–a05 physically grouped as one truth-comparison example.
5. Keep a06–a08 physically grouped as one immediate transfer example.
6. Keep B as one worked proof.
7. Rewrite contradiction intro so it does not explain “negate conclusion → contradiction → reject” before c00.
8. Introduce the name 背理法 only after c05.
9. Preserve all current source examples and source order.
10. Do not add practice-mode examples or numbering.

---

# 7. Acceptance gate before code

Ready for implementation only when:
- P1–P5 cycles are accepted
- all 23 holes have a disposition
- abstract notation no longer precedes the first concrete transformation experience
- c00 is no longer answered by the preceding prose
- B/C remain continuous worked proofs
- no off-source example is invented

Until implementation approval:
- unit remains `review`
- no publish
- no merge
