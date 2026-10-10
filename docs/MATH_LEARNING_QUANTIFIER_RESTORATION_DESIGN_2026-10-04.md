# MATH LEARNING MODE — QUANTIFIER RESTORATION DESIGN

Status: **DESIGN FROZEN / IMPLEMENTATION NOT STARTED**

Target:
- `math-quantifiers-all-exists`
- source: 深進数学I p.100〜101 相当
- current revision: 3
- current holes: 13

Authority:
1. `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1`
2. 2026-10-03 math learning-mode Recovery / Freeze contract
3. user-reviewed mathematics textbook-mode mother examples
4. source textbook order
5. current implementation

---

# 1. Main restoration problem

Current source order is preserved, but two concept introductions are pedagogically reversed.

Current “ある” start:

```text
「ある」を真にするには何個必要？ → 1つ
→ では具体例を選ぶ
```

MASTER order:

```text
具体例を実際に1つ見つける
→ それだけで命題が真になったと気づく
→ 「ある」は1例でよいと一般化
```

Current “すべて” start:

```text
「すべて」を偽にするには反例何個？ → 1つ
→ では2を選ぶ
```

MASTER order:

```text
具体的に2を見つける
→ 「すべて」が崩れたと確認
→ 1反例で十分と一般化
```

Therefore the restoration is primarily:
**example first, rule second**.

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

## Cycle Q1 — 「ある」/ witness

### Introduction worked example

Source statement ①:

“ある素数の組 ((a,b)) に対して、積 (ab) は偶数である。”

Restore the learning line:

1. Do not state the existential rule first.
2. Ask the learner to find one actual pair.
3. Learner selects (a=2,b=3).
4. Check: both are prime and the product is even.
5. Now observe:
   “1つ実例が見つかっただけで、『ある』という主張は成立した。”
6. Generalize the meaning of “ある”.

### Interactions

- `quant-a02`: KEEP / MOVE to become the first interaction
  - MASTER type: H
  - role: find a witness in a concrete example
- `quant-a01`: MERGE
  - current prompt asks the general rule before experience
  - restored prose after a02:
    “『ある〜』という主張は、条件を満たす例を1つ見つければ真だと示せる。”
  - no separate choice panel needed

This is the key inversion repair.

### Negation of “ある”

After the witness meaning is understood:

- `quant-a03`: KEEP
  - MASTER type: E/H
  - role: construct the negation from meaning
  - learner moves from
    “there exists one satisfying example”
    to
    “no satisfying example exists”
    = “all examples fail the property”

Then generalize:

[

eg(exists x,p(x))iff orall x,
eg p(x).
]

Do not present the symbolic/general rule before a03.

### Immediate example

Source statement ②:

“ある実数 (x) に対して (x^2=-1) である。”

- `quant-b01`: KEEP
  - MASTER type: G/H
  - role: decide existence using (x^2ge0)
- `quant-b02`: KEEP
  - MASTER type: E/H
  - role: immediate use of the newly learned existential-negation rule

This pair is a proper “すぐ使ってみる.”

---

## Cycle Q2 — 「すべて」/ counterexample

### Introduction worked example

Source statement ③:

“すべての素数は奇数である。”

Learning line:

1. Ask for a prime that breaks “odd.”
2. Learner finds 2.
3. Confirm that one valid exception destroys the universal statement.
4. Only then generalize:
   “『すべて』は、反例が1つ見つかれば崩れる.”
5. Connect to the already learned concept of counterexample from the previous unit.

### Interactions

- `quant-c02`: KEEP / MOVE to become the first interaction of the cycle
  - MASTER type: B/H
  - role: use the previously learned counterexample idea
- `quant-c01`: MERGE
  - current “何個の反例が必要？” is a rule question before the concrete experience
  - restored prose after c02:
    “反例は1つで十分である。『すべて』という主張は例外を1つ許しただけで偽になる。”

This is also a **復習 point**:
- “反例” is already known from proposition-reading.
- Do not turn it into a standalone memory quiz.

### Negation of “すべて”

- `quant-c03`: KEEP
  - MASTER type: E/H
  - role: convert the concrete counterexample into the negated statement

Then generalize:

[

eg(orall x,p(x))iff exists x,
eg p(x).
]

Again, rule after experience.

---

## Cycle Q3 — ordinary sentences with hidden universal scope

Source statement ④:

“2つの無理数の積は無理数である。”

This is useful because the word “すべて” is not explicitly written.

Learning line:

1. Interpret the ordinary sentence as universal:
   “どの2つの無理数を選んでも…”
2. To test it, look for one pair that breaks it.
3. Compute (sqrt2sqrt8=4).
4. Interpret 4 as rational.
5. Therefore the universal statement is false.
6. Construct its negation:
   “ある2つの無理数の積は有理数である.”

### Interactions

- `quant-d01`: KEEP
  - MASTER type: A/H
  - role: interpret hidden quantifier / scope
- `quant-d02`: KEEP
  - MASTER type: F
  - role: actual calculation inside the worked example
- `quant-d03`: KEEP
  - MASTER type: E/H
  - role: form the negation from the counterexample

These 3 interactions stay because they are not three independent mini-questions;
they are three stages of **one worked example**.

### Important writing requirement

The UI/text must visually read as one example unfolding.
Do not insert unrelated headings or card-like breaks between d01, d02, d03.

---

## Cycle Q4 — final faded transfer

Source statement ⑤:

“ひし形は平行四辺形である.”

Read it as:
“すべてのひし形は平行四辺形である.”

Learning line:

1. Judge the original statement.
2. Judge the negation.
3. Confirm original and negation have opposite truth values.
4. Close with the full quantifier summary.

### Interactions

- `quant-e01`: KEEP
  - MASTER type: B/H
  - role: faded transfer using known geometry
- `quant-e02`: KEEP
  - MASTER type: G/H
  - role: connect original truth to negation falsity

Unlike a06/a08 in proposition-reading, e02 is not merely a repeated “therefore false” button.
It explicitly checks the logical relation between a statement and **its negation**, so it remains a meaningful node.

---

# 4. All 13 holes — final disposition table

| Hole | MASTER type | Current role | Disposition | Restored role |
|---|---|---|---|---|
| quant-a01 | rule/generalization | concept formation | MERGE | witness experience後の本文一般化 |
| quant-a02 | H | transfer | KEEP/MOVE | Q1導入例の最初のthinking node |
| quant-a03 | E/H | representation link | KEEP | 「ある」の否定を構成 |
| quant-b01 | G/H | causal reasoning | KEEP | existential ruleの即時例題 |
| quant-b02 | E/H | transfer | KEEP | existential negationの即時利用 |
| quant-c01 | rule/review | concept formation | MERGE | 反例2を経験後に「1つで十分」と本文化 |
| quant-c02 | B/H | transfer | KEEP/MOVE | Q2導入例の最初のthinking node |
| quant-c03 | E/H | representation link | KEEP | 「すべて」の否定を構成 |
| quant-d01 | A/H | representation link | KEEP | 隠れたuniversal scopeを読む |
| quant-d02 | F | transfer | KEEP | 反例計算 |
| quant-d03 | E/H | transfer | KEEP | hidden universalの否定を構成 |
| quant-e01 | B/H | transfer | KEEP | final faded transfer |
| quant-e02 | G/H | causal reasoning | KEEP | 元命題と否定の真偽関係 |

Summary:
- KEEP / KEEP+MOVE: 11
- MERGE: 2
- REMOVE: 0
- ADD: 0

No new hole is needed in the first restoration pass.

---

# 5. Restored learner-facing rhythm

```text
[例題] ある素数の組で積が偶数
→ a02 witnessを見つける
→ 「ある」は1例でよい、と意味を整理
→ a03 否定を作る
→ ∃ の否定規則を一般化

[すぐ使う] x²=-1
→ b01
→ b02

[例題] すべての素数は奇数
→ c02 反例2
→ 「反例1つで十分」を復習・一般化
→ c03 否定
→ ∀ の否定規則を一般化

[例題] 2つの無理数の積は無理数
→ d01 隠れた「すべて」を読む
→ d02 √2×√8
→ d03 否定

[自分で使う] ひし形は平行四辺形
→ e01
→ e02
→ summary
```

This is much closer to:
**example → meaning → concept/rule → immediate use → fade**
than the current source-example-as-question-list structure.

---

# 6. Writing changes required later

1. Move a02 before a01’s current rule content.
2. Convert a01 to prose/generalization; remove its choice panel.
3. Keep a03 after witness experience.
4. Use b01/b02 explicitly as “すぐ使ってみる”.
5. Move c02 before c01’s rule content.
6. Convert c01 to prose / review-generalization.
7. Keep d01/d02/d03 physically close as one worked example.
8. Keep e01/e02 as the final low-support transfer.
9. Make the “ある” and “すべて” concept boundaries visible without adding excessive headings.
10. Preserve source order of the five statements, but do **not** let “source statement order” become “five equal quiz cards.”

---

# 7. Concept naming / terminology policy

The unit should not force learners to guess:
- existential
- universal
- quantifier
- ∃
- ∀

unless the source explicitly introduces such formal notation in this range.

Learner-facing language stays:
- 「ある」
- 「すべて」
- 条件を満たす例
- 反例
- 否定

Formal symbols may be internal/generalization support only if source fidelity allows.

---

# 8. Acceptance gate before code

Ready for implementation only when:
- Q1–Q4 concept cycles are accepted
- all 13 holes have a disposition
- a01/c01 no longer precede the concrete experience as abstract rules
- no new off-source example is invented
- source statement order remains recognizable
- result reads as worked textbook prose rather than 13 consecutive questions

Until implementation approval:
- unit remains `review`
- no publish
- no merge
