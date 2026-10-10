# MATH SETS — GOLDEN WORD vs APP STRUCTURE AUDIT 2026-10-04

Status: **AUDIT ONLY / NO APP REPAIR YET**

Golden source:
- user-approved `集合_教科書モード_完成版_v1`
- this Word file is the mother implementation for mathematics textbook mode

Target:
- current published app unit `math-sets`
- branch `chatgpt/math-textbook-sets-v1`

Scope:
- mathematics textbook mode only
- no practice mode
- no physics
- no proposition repair in this document

---

# 1. Golden structure from the Word mother

The mother document fixes the textbook-mode learning line as:

```text
問題
→ 何を見るか確認
→ 一段考える
→ 穴に答える
→ 意味を確認
→ 概念化
→ 概念の性質を説明
→ 必要なら証明 / 導出
→ 例題・確認で使う
```

Important:
- concept introduction is not the end of a cycle
- after naming a concept, explain its properties
- if a property needs proof/derivation, prove it there
- if no proof is needed, skip the proof layer
- then use the concept/property in an example or confirmation

The Word visually distinguishes:
- 第1部 / 第2部 / 第3部
- 例題
- 確認
- まとめ

Formal concept terms are learner-facing textbook text and should be visually identifiable as **black bold terms**, not semantic color coding.

Dialogue roles are part of the mother:
- 花子: natural noticing / contrast
- 太郎: mathematical organization
- 先生: focus / cue
- dialogue never replaces the textbook prose

---

# 2. Golden order — exact macro sequence

## 第1部 集合を表す

### Example 1
24の正の約数
→ 集合
→ 要素
→ ∈ / ∉
→ immediate use with 12 and 10

### Example 2
`B={2n-1 | n∈N}`
→ condition representation
→ listing representation
→ same set in two forms
→ finite / infinite set

## 第2部 集合どうしの関係を見る

### Example 3
`A={2,3,5,7}`, `B={1,3,5,7,9}`
→ 共通部分
→ 和集合
→ two-set meaning
→ three-set extension

### Example 4
`A={1,2,3}`, `B={1,3}`, `C={1,4}`
→ 部分集合
→ 空集合
→ all subsets of A
→ equality via mutual inclusion

## 第3部 集合の外側まで考える

### Example 5
universal set U / complement
→ 全体集合
→ 補集合
→ immediate complement exercise
→ operations with complement
→ complement properties:
  - A∪Ā=U
  - A∩Ā=∅
  - double complement
  - Ū=∅
  - ∅̄=U

### Example 6
De Morgan derivation by regions
→ build two regions in two ways
→ derive first law
→ derive second law
→ name ド・モルガンの法則
→ property: complement swaps ∪ and ∩

### 確認
Same De Morgan relation by listing elements
→ verify both sides agree

### Example 7
real-number sets on number lines
→ endpoint inclusion
→ complements
→ intersection / union
→ direct complement
→ De Morgan again
→ compare results

### まとめ
Full summary of:
- membership
- representation
- intersection/union
- subset/empty set
- universal/complement
- De Morgan
- real-line endpoint logic

---

# 3. Current app macro sequence

Current app has:

```text
集合を表す
→ subset / empty set / equality
→ intersection / union
→ complement
→ De Morgan
→ verification prose
→ real-line transfer
→ summary prose
```

The largest order mismatch is in Part 2:

**Golden Word**
```text
intersection/union
→ subset
```

**Current app**
```text
subset
→ intersection/union
```

This is not a cosmetic difference.
The transition prose was also rewritten to support the reversed order.

Therefore:
- current app does not preserve the approved mother learning line
- Part 2 must be restored to the Word order

---

# 4. Visual-role mismatch

## 4.1 Example labels are lost

Golden Word visibly places `例題` before each major example.

Current app:
- no `例題` block type
- no learner-facing `例題` marker
- examples are rendered as ordinary paragraphs/formulas

Result:
- concept introduction example
- property derivation
- transfer example

all look too similar.

This directly causes the user-reported problem:
“例題、証明の区分が不明显で混乱する.”

## 4.2 Confirmation label is lost

Golden Word has an explicit `確認` section before the element-wise De Morgan verification.

Current app only says:
“最後に、図で見た法則を実際の要素でも確かめる。”

There is no visible `確認` marker.

Result:
- the learner cannot distinguish “new concept derivation” from “check what was just learned.”

## 4.3 Summary label is lost

Golden Word has an explicit `まとめ`.

Current app has only `paragraph-set-summary`.

Result:
- summary content exists
- summary role is visually lost

---

# 5. Concept-term emphasis mismatch

User requirement:
- formal concept terms should be **black bold**
- no semantic color coding

Golden terms that should be visibly identifiable include at minimum:
- 集合
- 要素
- 有限集合
- 無限集合
- 共通部分
- 和集合
- 部分集合
- 空集合
- 全体集合
- 補集合
- ド・モルガンの法則

Current schema:
`TextbookReadingPartSchema`
supports only:
- `text`
- `math`
- `choice`

Current UI renders ordinary text uniformly in `.reading-paragraph`.

Therefore:
- app currently cannot mark a concept term as black bold semantically
- this is a schema/rendering gap, not merely missing CSS

Required later:
- add a minimal semantic inline representation for formal term emphasis
- render it black + font-weight bold
- do not add concept colors

---

# 6. Example / proof / confirmation role representation gap

Current block schema supports:
- heading
- paragraph
- formula
- figure
- note

It has no learner-facing role marker for:
- 例題
- 証明 / 導出
- 確認
- まとめ

Section role exists at the section level, but `math-sets` is one continuous section.
Therefore internal example/proof/check roles cannot currently be expressed cleanly.

This is the structural reason the current app feels flat.

Important:
- do not create excessive subheadings
- the mother uses short role labels, not a new large title every few lines

Required later:
- represent role labels as compact black textbook markers
- examples/proofs/checks must be visually distinct but not colorful
- use the mother Word as the visual contract

---

# 7. Dialogue mismatch

Golden Word contains selective dialogue at important thinking points, including:

- 花子 after the 24-divisor set is built
- 先生 before membership notation
- 太郎 when comparing the two representations of B
- 太郎 when distinguishing intersection vs union
- 花子 when contrasting B and C in the subset example
- 先生 before defining the universal set
- 太郎 after the first De Morgan region comparison
- 花子 before complement endpoints on the number line

Current app:
- 花子 occurrences: 0
- 太郎 occurrences: 0
- 先生 occurrences: 0

Therefore the entire dialogue layer was stripped.

This is a direct divergence from the approved mother.

Repair later:
- restore only the mother dialogues
- do not invent extra chatter
- keep dialogue subordinate to the prose

---

# 8. Content fidelity by part

## Part 1 — 集合を表す

### Mostly preserved
- 24-divisor example
- concept of set/element
- membership judgments
- ∈ / ∉
- condition/list representations
- finite/infinite distinction

### Missing / flattened
- explicit Example 1 / Example 2 separation
- 花子 / 先生 / 太郎 dialogue
- concept-term black bold
- mother’s textbook-role rhythm

Assessment:
**content mostly present, structure flattened**

## Part 2 — 集合どうしの関係を見る

### Major mismatch
Order is reversed.

Golden:
1. 共通部分 / 和集合
2. 部分集合 / 空集合 / equality

Current:
1. 部分集合 / 空集合 / equality
2. 共通部分 / 和集合

This must be restored.

### Also missing
- explicit example labels
- dialogue
- black-bold concept terms

Assessment:
**content present but approved learning order broken**

## Part 3A — 全体集合 / 補集合

### Mostly preserved
- define U from a bounded universe
- define complement
- compute complement
- combine with intersection/union
- derive complement properties

### Missing / flattened
- explicit example label
- 先生 cue before whole-universe definition
- concept-term bold
- clear visual boundary between “concept definition” and “properties”

Assessment:
**mathematical path preserved, role distinction flattened**

## Part 3B — De Morgan

### Preserved
- region-first derivation
- first law
- second law
- name after derivation
- ∪/∩ swap observation
- element-wise verification afterward

### Missing / flattened
- explicit example marker before derivation
- 太郎’s organizing dialogue
- explicit `確認` marker before verification
- concept-term bold for ド・モルガンの法則
- derivation/proof visually looks too similar to ordinary example prose

Assessment:
**pedagogy mostly preserved, visual semantics lost**

## Part 3C — real-number sets

### Preserved
- endpoint membership
- number line
- complement endpoint logic
- intersection/union
- direct complement
- De Morgan re-use

### Missing / flattened
- explicit Example marker
- 花子 dialogue at endpoint reasoning
- role separation between worked example and prior confirmation

Assessment:
**content preserved, example identity lost**

## Summary

Golden:
- explicit `まとめ`

Current:
- plain paragraph only

Assessment:
**summary text present, summary role lost**

---

# 9. Figure-position audit

Golden Word:
- figures appear after the learner has made the relevant judgment
- blank/neutral figure can appear before answer
- answer-bearing/shaded figure appears after the corresponding thinking node
- number-line figures sit next to endpoint reasoning
- De Morgan figures are part of the derivation, not decoration

Current app:
- neutral and answer-bearing figures are largely preserved
- figure timing is mostly compatible with the mother
- however, because Example / Confirmation / Derivation labels are absent, the learner cannot tell **why** a figure is appearing

Conclusion:
- figure assets are not the main problem
- figure role labeling/context is

---

# 10. Hole-position audit

Good:
- most holes are still genuine thinking nodes
- answer leakage gates remain
- progressive reveal remains
- wrong answer behavior remains

Mismatch:
- because the role labels/dialogue/concept typography were stripped, the same holes now feel like a continuous quiz stream
- the problem is not simply “too many holes”
- the surrounding textbook structure was flattened

Therefore:
- do not mass-delete holes in `math-sets`
- first restore the approved textbook structure around them
- only then re-evaluate whether any hole is redundant

---

# 11. Schema/UI gaps confirmed

Current app cannot faithfully render the Word mother because it lacks:

1. inline black-bold semantic term
2. compact `例題` marker
3. compact `証明/導出` marker
4. compact `確認` marker
5. compact `まとめ` marker
6. selective dialogue presentation for 花子 / 太郎 / 先生

Current `heading` is too large/structural to substitute mechanically for every role label.
Current `note` is styled as a colored/muted box and does not match the black textbook role contract.

This is why simply rearranging lesson data is insufficient.

---

# 12. Mother-contract repair order

Do not modify content yet.

Repair should occur in this order:

## Layer A — representation support
Add only the minimal representations needed to express the existing Word mother:
- black-bold formal term
- compact role label: 例題 / 証明・導出 / 確認 / まとめ
- dialogue block: 花子 / 太郎 / 先生

No new pedagogy.
No concept colors.

## Layer B — restore `math-sets` exactly
- restore Part 2 order:
  intersection/union → subset
- restore all mother role labels
- restore the approved dialogues
- mark formal terms black bold
- restore explicit Confirmation and Summary identity
- preserve current good holes/figures/progressive reveal

## Layer C — mother-vs-app re-audit
Check the app screen against all 15 Word pages:
- order
- role markers
- text
- holes
- formulas
- figures
- dialogue
- concept terms
- confirmation
- summary

Only after `math-sets` matches the golden mother should proposition units be changed.

---

# 13. Critical conclusion

The current problem is **not** that mathematics textbook mode needs redesign.

The user-approved Word already is the design and implementation mother.

The current app diverged during structural conversion:
- role markers were flattened
- dialogue was stripped
- concept typography was lost
- Part 2 order was reversed
- confirmation/summary identity was lost

Therefore the next work is:
**restore the app to the Word mother, not redesign the Word mother.**
