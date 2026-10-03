# MATH PRACTICE 98 CONTENT DESIGN
## 「条件から命題を読む」第1問 pilot

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Mandatory read:
1. docs/MATH_PRACTICE_MASTER_LESSONS.md
2. docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md
3. docs/MATH_RENDERING_RULES.md

Source problem:
次の文は命題か。命題なら真偽も答えよ。

(1) 23 を 3 で割ると余りは 2 である。  
(2) 二等辺三角形は正三角形である。  
(3) 3.14 は円周率 π のよい近似値である。

Theme:
- 条件から命題を読む

Structure:
- common concept basis
- (1),(2),(3) are mutually independent
- no subproblem answer is imported into another subproblem
- each subproblem may reuse only the common proposition criterion

---

# 0. 共通準備 — 命題の判定基準

## 穴なし完成文章

文が命題かどうかを判断するときは、その内容が**客観的に真・偽のどちらか一方に定まるか**を見る。

「多くの人が正しいと思うか」や「数式が含まれているか」ではなく、真偽を客観的に決められることが基準である。

この判定基準だけを、(1)〜(3)で共通して使う。

## Thinking node

- 98-definition
  - prompt completion: 「命題とは、内容が客観的に ___」
  - correct: 「真・偽のどちらか一方に定まる文」
  - purpose: 命題 / 非命題を分ける基準を構成する

Result node:
- label: 判定基準
- result: 真・偽のどちらか一方に定まる文

UI:
- 共通準備の長い説明は各小問へ残さない
- (1)〜(3)では compact result link のみ表示可能
- full preparation is tap-to-expand

---

# 1. (1) 23を3で割ると余りは2

## 穴なし完成文章

23を3で割ると、

[
23=3\times7+2
]

となるので、余りは2である。

この文は真か偽かを客観的に判定でき、実際に内容も正しい。

したがって、(1)は**命題であり、真である**。

## Thinking node

- 98-p1-result
  - visible evidence: (23=3\times7+2)
  - prompt completion: 「この計算から、(1)は ___」
  - correct: 「命題であり、真である」
  - purpose: 事実確認と命題分類を一つの判断に結びつける

Do not add:
- 「余りはいくつ？」だけの数字穴
- 「2」をコピーするだけの穴
- 表示済みの `23=3×7+2` をblank promptでもう一度重複表示すること

---

# 2. (2) 二等辺三角形は正三角形である

## 穴なし完成文章

二等辺三角形は2辺の長さが等しい三角形であり、すべてが正三角形とは限らない。

たとえば、**頂角が40°の二等辺三角形**を考えると、残りの2角は70°ずつであり、3角がすべて60°ではないので正三角形ではない。

したがって、この具体例は「二等辺三角形は正三角形である」という文の反例になる。

この文自体は真偽を客観的に判定できるので命題であり、反例があるため**偽**である。

## Thinking nodes

- 98-p2-counterexample
  - focus: 前件を満たし、主張を破る具体例
  - correct: 「頂角40°の二等辺三角形がある」
  - purpose: false statement を non-proposition と混同せず、反例で偽を確定する

- 98-p2-result
  - prompt completion: 「この反例があるので、(2)は ___」
  - correct: 「命題であり、偽である」
  - purpose: 反例の存在を命題の真偽へ解釈する

Leakage guard:
- counterexampleを問う前に「頂角40°」を本文へ表示しない
- 反例正答後に初めてその内容が完成文へ入る

---

# 3. (3) 3.14はπのよい近似値である

## 穴なし完成文章

「3.14はπの近似値である」といった数値関係そのものとは違い、ここでは**「よい近似値」**という表現が使われている。

「どの程度近ければ『よい』とするか」という基準が問題文で客観的に定められていないため、この文の真偽は一意に決められない。

したがって、(3)は**命題ではない**。

## Thinking nodes

- 98-p3-objectivity
  - prompt completion: 「『よい近似値』には、真偽を一意に決める客観的な基準が ___」
  - correct: 「定まっていない」
  - purpose: 主観的 / 曖昧な評価語を見抜く

- 98-p3-result
  - prompt completion: 「したがって、(3)は ___」
  - correct: 「命題ではない」
  - purpose: false statement と non-proposition の区別を確定する

---

# 4. Current-stage compression

Target order:

1. basis — 命題の判定基準
2. s1 — (1)
3. s2 — (2)
4. s3 — (3)

Rules:
- current target only
- s1,s2,s3 all depend only on basis
- s1 result is NOT shown in s2
- s2 result is NOT shown in s3
- basis result is compact
- future subproblem reasoning is hidden
- past full derivations are collapsed

---

# 5. Hole quality audit

Keep:
- proposition criterion
- classification after factual verification
- counterexample choice
- counterexample → false interpretation
- objective-standard judgment
- non-proposition classification

Remove / do not create:
- arithmetic-only remainder blank
- separate 「真」だけの duplicate blank after already classifying
- terminology guessing before definition
- final answer repeated twice

---

# 6. Rendering / mobile audit

Math surfaces:
- `23=3\\times7+2`
- `\pi` if rendered as explicit LaTeX
- angle values may stay prose for the counterexample choice

Required:
- TypeScript source must use escaped TeX backslashes
- no raw authoring syntax
- no horizontal overflow
- mobile and desktop smoke
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana

---

# 7. Acceptance gate before 99

98 is the pilot for the second learner-facing theme.

Do not batch-enable 99+ merely because content compiles.

Gate:
1. typecheck
2. unit/catalog/parity tests
3. build
4. mobile browser
5. desktop browser
6. deploy
7. user QA

After 98 passes technically, the next content design can proceed to 99, but the theme interaction itself remains anchored to this 98 pilot.
