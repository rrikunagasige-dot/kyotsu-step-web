# INFORMATION ARCHITECTURE RULES

Status: **PROJECT-WIDE LEARNING-UI AUTHORITY**

Purpose:
この文書は、教材内容そのものではなく、学習者に「どのくらいの数のまとまりとして内容を見せるか」を決めるための情報設計ルールを定義する。

これは pedagogy / math rendering / code implementation とは別の設計層である。

---

## 1. Core principle — title count is a cognitive-load decision

タイトルは単なる見た目ではない。

学習者は画面上の大見出しを、そのまま「別々に覚えるべき内容の数」として認識しやすい。

したがって:

> **major title の数を増やすほど、内容の因果関係が見えにくくなり、章全体が細切れに見える。**

タイトルが多いこと自体を「整理されている」とみなさない。

---

## 2. Major titles should represent conceptual chunks, not every source subsection

教科書sourceに 1A / 1B / 1C ... のような細かい単元境界があっても、それを learner-facing major title としてそのまま全部表示しない。

区別する:

```text
source / internal structure
1A 1B 1C 1D 1E 1F 1G
        ↓
learner-facing information architecture
a small number of conceptual chunks
```

Internal IDs, progress keys, tests, routes, provenance, revision historyは維持する。

表示上のタイトルだけを統合しても、内部データ構造を壊さない。

---

## 3. Chapter-level title budget

Chapter 1 については、learner-facing major title を **3つ**に圧縮する方針を採用する。

現在の設計方向:

1. **運動をどう表すか**
   - 旧 1A: 変位と速度
   - 旧 1B: 速度の合成と分解
   - 旧 1C: 相対速度

2. **速度が変わる運動**
   - 旧 1D: 加速度
   - 旧 1E: 水平投射
   - 旧 1F: 斜方投射

3. **力が運動をどう変えるか**
   - 旧 1G: 重力加速度・空気抵抗・終端速度

これは現在の Chapter 1 の設計方向であり、**最終表示文言は実装前にユーザー確認する**。

この3分割の目的は単なるタイトル削減ではなく、章全体を3つの conceptual chunk として理解できるようにすること。

---

## 4. Do not remove titles without repairing transitions

タイトルを減らすと、以前タイトルが担っていた「ここから話題が変わる」という信号も消える。

したがって title compression では必ず **bridge sentence** を設計する。

Example:

```text
[chunk 1]
位置 → 変位 → 速度
→ 合成・分解
→ 相対速度

bridge:
「ここまでは速度をどう表すかを考えてきた。
次は、その速度そのものが時間とともに変わる運動を考える。」

[chunk 2]
加速度
→ 等加速度運動
→ 水平投射
→ 斜方投射

bridge:
「ここまでは加速度を使って運動を求めてきた。
最後に、その加速度を生み出す力までさかのぼって考える。」

[chunk 3]
力
→ 加速度
→ 空気抵抗
→ 終端速度
```

Hard rule:

> **タイトルを削るだけで、意味の橋を削ってはいけない。**

---

## 5. Heading hierarchy must be visually unequal

すべての見出しを同じ大きさ・同じカード・同じ余白で見せると、学習者にはすべてが同じ階層に見える。

Therefore:

- major chunk title = strong visual hierarchy
- local explanation heading = visibly subordinate
- derivation label = even lighter
- internal unit code = hidden from learner UI

特に、旧 1A〜1G の名前をすべて major heading として残しながら、その上に3つの新titleを追加するのは禁止。

それではタイトル数がさらに増えるだけである。

---

## 6. Title wording rules

Learner-facing major title:

- 短い
- 1つのconceptual question / themeを表す
- 互いに同じ粒度
- 名詞列挙より、意味のある学習テーマを優先
- sourceの細目を全部タイトルへ詰め込まない
- 「重力加速度・空気抵抗・終端速度」のような長い列挙を major title にしない

Good:

- 運動をどう表すか
- 速度が変わる運動
- 力が運動をどう変えるか

Bad:

- 変位・速度・速度の合成・分解・相対速度
- 加速度・水平投射・斜方投射
- 重力加速度・空気抵抗・終端速度

後者は内容一覧であって、conceptual chunk titleではない。

---

## 6.1 Keep titles as short as possible

Hard rule:

> **タイトルは、意味が壊れない範囲でできるだけ短くする。説明はタイトルではなく本文へ置く。**

タイトルの役割は内容を全部説明することではなく、学習者に「今どのまとまりにいるか」を一瞬で示すこと。

Good:
- 運動を表す
- 速度の変化
- 力と運動

Acceptable when a question form helps:
- 運動をどう表すか
- 力が運動をどう変えるか

Avoid:
- 重力加速度・空気抵抗・終端速度
- 速度の合成・分解・相対速度について理解する

短くした結果、意味が不足する部分は bridge sentence / first paragraph で補う。

## 7. Learner-facing titles and internal taxonomy are different systems

Do not confuse:

1. **learning-flow title hierarchy**
2. **question-bank taxonomy**
3. **internal source/unit IDs**

`docs/taxonomy/PHYSICS_TITLE_GUIDE.md` は題庫分類のためのtitle guideであり、この文書は学習本文の情報階層を扱う。

例:

```text
Question-bank taxonomy:
物理 → 力学 → 運動

Learning chapter:
第1章 運動
  → 3 learner-facing conceptual chunks

Internal:
1A ... 1G
```

これらは同じ単語を使うことがあっても目的が違う。

---

## 8. Compression gate

major titleを統合する前に確認する:

1. 統合後も学習順序が自然か
2. 旧境界で失われる意味をbridge sentenceが補っているか
3. 同じchunk内の内容が一つの因果線でつながっているか
4. cross-unit retrievalが見えなくなっていないか
5. internal IDs / progress / testsは保持されるか
6. learner UIに内部unit codeが漏れないか
7. heading visual hierarchyが本当に3段階以上に増えていないか
8. mobileでtitle stackが画面を占有しすぎないか

---

## 9. Mobile-specific rule

スマホではタイトルの縦占有が特に大きい。

連続して大見出しが並ぶと、学習者は本文よりナビゲーションをスクロールしている感覚になる。

Therefore:

> **major headings should be rare; local transitions should usually be handled by prose, spacing, or a lightweight subheading rather than another full title card.**

タイトルを増やして「分かりやすくしたつもり」にならない。

---

## 10. Implementation rule for Chapter 1

When implementing the Chapter-1 title compression:

- keep 1A〜1G internal IDs and current URLs unless separately approved,
- do not delete progress/test history,
- introduce only 3 learner-facing major titles,
- demote or hide old per-unit titles instead of stacking them,
- insert explicit bridge sentences at the two conceptual boundaries,
- preserve the existing pedagogical content and interaction order,
- regression-test navigation and mobile layout,
- user QA the exact displayed title wording before considering the redesign complete.

---

## 11. General lesson

Good information architecture is not:

```text
more headings
= more organized
```

It is:

```text
fewer meaningful chunks
+ clear internal flow
+ explicit transitions
= easier mental model
```

The goal is for the learner to remember the **structure of the physics**, not the number of source files.
