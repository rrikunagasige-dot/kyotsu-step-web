# MATH PRACTICE 108 CONTENT DESIGN
## 「命題を証明する」第1問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
a,b は実数とする。次の2つの条件 p,q は同値であることを証明せよ。

\[
p:\ a>1\text{ かつ }b>1
\]

\[
q:\ a+b>2\text{ かつ }(a-1)(b-1)>0
\]

Theme:
- 命題を証明する

Core idea:
- 「同値」は、見た目が似ていることではなく \(p\Rightarrow q\) と \(q\Rightarrow p\) の両方向が成り立つこと。
- forward と reverse は別の証明として扱う。
- reverse の本質は \((a-1)(b-1)>0\) から「同符号」の2枝を作り、\(a+b>2\) で負側を排除すること。
- 最終結論では、完成済みの2方向の結果だけを compact link として再利用する。

---

# 0. 共通準備 — 同値を何で示すか

## 穴なし完成文章

2つの条件 p,q が同値であることを示すには、

\[
p\Rightarrow q
\]

と

\[
q\Rightarrow p
\]

の両方を示せばよい。

## Thinking node

- 108-rule
  - prompt: 「p と q が同値であることを示すには」
  - correct: 「p⇒q と q⇒p の両方を示す」
  - purpose: proof goal を2方向へ分解する

Result node:
- label: 同値の証明方針
- result: p⇒q と q⇒p

Important:
- ここでは各方向の具体的な計算までは先に見せない。

---

# 1. S1 — \(p\Rightarrow q\)

## 穴なし完成文章

p を仮定する。

\[
a>1,\qquad b>1
\]

なので、

\[
a+b>2
\]

である。

また、

\[
a-1>0,\qquad b-1>0
\]

だから、

\[
(a-1)(b-1)>0
\]

である。

したがって q の2条件がともに成り立つので、

\[
p\Rightarrow q
\]

が示された。

## Thinking node

- 108-forward
  - prompt: 「p から q の2条件をどう示すか」
  - correct: 「a+b>2 かつ a-1,b-1>0 より積も正なので q」
  - purpose: p の2不等式から q の和条件・積条件をまとめて作る

Result node:
- label: 一方向目
- result: \(p\Rightarrow q\)

Hole quality:
- 「2」だけを埋める数字穴にしない
- \(a-1>0\), \(b-1>0\) を別々の低価値穴へ分割しない

---

# 2. S2 — \(q\Rightarrow p\)

## 穴なし完成文章

次に q を仮定する。

\[
a+b>2,\qquad (a-1)(b-1)>0
\]

積が正なので、2因子 \(a-1,b-1\) は同符号である。

したがって可能性は、

\[
a-1>0,\quad b-1>0
\]

または

\[
a-1<0,\quad b-1<0
\]

の2通りである。

後者なら

\[
a<1,\qquad b<1
\]

なので、

\[
a+b<2
\]

となり、q の条件 \(a+b>2\) と矛盾する。

したがって後者は除かれ、

\[
a-1>0,\qquad b-1>0
\]

すなわち

\[
a>1,\qquad b>1
\]

が残る。

よって p が成り立ち、

\[
q\Rightarrow p
\]

が示された。

## Thinking nodes

- 108-reverse-sign
  - prompt: 「\((a-1)(b-1)>0\) から因子の符号について言えることは」
  - correct: 「同符号なので、両方正または両方負」
  - purpose: reverse proof の核心分岐を作る

- 108-reverse-eliminate
  - prompt: 「\(a+b>2\) を使うと、どちらの符号ケースが残るか」
  - correct: 「両方負なら a+b<2 で矛盾。両方正が残り a>1,b>1」
  - purpose: q のもう1条件を使って負側の枝を排除し、p を導く

Result node:
- label: 二方向目
- result: \(q\Rightarrow p\)

Leakage guard:
- reverse-sign の解答前に「同符号」を本文へ出さない
- reverse-eliminate の解答前に「負側が矛盾」「a>1,b>1」を結論として出さない

---

# 3. S3 — 両方向をまとめる

## 穴なし完成文章

以上より、

\[
p\Rightarrow q
\]

と

\[
q\Rightarrow p
\]

の両方が成り立つ。

したがって、

\[
p\Longleftrightarrow q
\]

であり、p と q は同値である。

## Thinking node

- 108-equivalence
  - prompt: 「2つの証明結果から最終的に言えることは」
  - correct: 「両方向が成り立つので p と q は同値」
  - purpose: R1 と R2 を統合して equivalence を結論する

Dependencies:
- S3 ← S1, S2
- S3 では S1,S2 の長い導出を再表示せず、
  - 「一方向目: p⇒q」
  - 「二方向目: q⇒p」
  の compact result links のみ表示する

---

# 4. Current-stage compression

Target order:
1. basis
2. forward
3. reverse
4. conclude

Rules:
- basis completion → forward
- forward completion後、forward full derivationは畳む
- reverse は forward の結果を表示せず、basis のみを参照して独立に解く
- conclude のみ forward/reverse 両resultを compact link として表示
- future proof steps are hidden
- completed proof detail is tap-to-expand only when dependencyとして必要

---

# 5. Hole quality audit

Keep:
- 同値には2方向必要
- p⇒q の q 条件生成
- 積が正 → 同符号の2ケース
- 和条件で負側を排除
- 両方向 → 同値

Do not create:
- \(a+b>2\) の「2」だけの穴
- \(>\) の記号だけを選ぶ穴
- a-1 と b-1 の同型穴を別々に量産
- 最終結論を先に本文へ書いてから「同値」を選ばせる穴

---

# 6. Rendering / mobile audit

Required math surfaces:
- \(p\Rightarrow q\)
- \(q\Rightarrow p\)
- \(p\Longleftrightarrow q\)
- \((a-1)(b-1)>0\)
- 2つの符号case

Required:
- TypeScript sourceのTeX backslash保持
- raw Rightarrow / Longleftrightarrow / text commandを表示しない
- 数式重複なし
- reverse の2caseがmobileで横にはみ出さない
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 7. Acceptance gate before 110

108 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile browser smoke
5. desktop browser smoke
6. deploy

Only after this gate may the next 「命題を証明する」 problem be enabled.
