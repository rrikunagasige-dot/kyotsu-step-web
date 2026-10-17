# N01 — 第1単元「式の見方」学習本文・対話設計（レビュー用）

Status: **REVIEW-DRAFT** (数学内容は原Wordと独立計算で確認済み、まだ実アプリ未実装)
Source: 2026-10-17 upload of \`01_数と式_教科書モード_対話段階導入版_v2(1).docx\`; original ID N01, Q1–Q10; see \`PILOT_SOLUTION_AUDIT.md\`.
Subject/mode: 数学 × 教科書.
Styling rules: 概念名は**太字の黒字**、定義と例題を視覚的に区別、式の連続導出は同一ブロック、色は穴/状態/フィードバックだけ。本文中の \`《 ... 》\` はUI上の穴の概念上の位置。**括弧内に正答は入れない**。

## 生徒向け・段階表示する本文案

### 式を掛け算に戻す

式 \(-2x,\ x^2,\ -x^2y^2\) を比べてみよう。見た目は違うが、どれも数と文字の掛け算として読める。例えば \(x^2=x\times x\) だ。負の符号も、数の側に含めて考える。

\[
-x^2y^2=\underbrace{\boxed{\phantom{-1}}}_{\text{数の部分}}\times x\times x\times y\times y
\]

**【N01-Q01】** 数の部分を穴に入れてみよう。

このように数や文字の積で表した式を**単項式**という（この章では文字の指数を0以上の整数とする）。数の部分を**係数**、掛け合わせた文字の総数を**次数**という。

今の三つの式を見直すと、係数と次数は次のように読み取れる。

| 式 | 係数 | 次数 |
| --- | --- | --- |
| \(-2x\) | 《穴》 | 《穴》 |
| \(x^2\) | 《穴》 | 《穴》 |
| \(-x^2y^2\) | 《穴》 | 《穴》 |

**【N01-Q02】** 数の前に1が書かれていなくても、数の部分を忘れずに考えよう。

### どの文字を変えるか

同じ \(5x^3y\) でも、どの文字だけを変えるかで見方が違う。たとえば \(x\) に注目すると \(y\) は係数側のまとまりになる。

\[
5x^3y=\boxed{\phantom{5y}}\,x^3
\]

**【N01-Q03】** \(x^3\) に掛かる数のまとまりを決めよう。

したがって、\(x\) に注目した係数と次数は《係数》《次数》。反対に \(y\) に注目した係数と次数は《係数》《次数》となる。

**【N01-Q04】** 変えているのは式ではなく、注目する文字だ。ここでは \(x,y\) を形式的な文字として扱い、変数以外を係数とみなしている。具体的な値を後から代入して係数が0になる場合は、次数の扱いを別に確かめる。

もう一度、\(axy\) を \(x\) についての式と \(y\) についての式として見て、それぞれの係数を《穴》《穴》へ入れよう。

**【N01-Q05】** 前の考え方を別の式に移す。

### 同じ文字の部分をまとめる

今度は
\[
3x^2-5x+6-5x^2+2x-3
\]
を簡単にする。まず、引き算を負の項を足すこととして読み直そう。一つ一つのまとまりを**項**といい、単項式の和で表した式を**多項式**という。

文字の部分が同じ項を**同類項**という。文字の部分を変えず、係数だけを足し引きできるので、まず次の三種類へ分類する。

\[
\underbrace{\boxed{\phantom{3x^2-5x^2}}}_{x^2\text{ の項}}
+\underbrace{\boxed{\phantom{-5x+2x}}}_{x\text{ の項}}
+\underbrace{\boxed{\phantom{6-3}}}_{\text{定数の項}}
\]

**【N01-Q06】** 文字部分だけで分類する。負号はその項と一緒に移そう。

それぞれの係数を計算すると
\[
=(3-5)x^2+(-5+2)x+(6-3)=\boxed{\phantom{-2x^2-3x+3}}.
\]

**【N01-Q07】** ひとつ前に自分で分けた三組を利用して計算しよう。

**多項式の次数**は、同類項をまとめた**後に残る**項の次数の最大値である。注目する文字を含まない項を**定数項**という。今の式の次数は《穴》、定数項は《穴》になる。

**【N01-Q08】** Q07の結果を見て判断する。

ただし、最初に見えていた最高次数が、最後まで残るとは限らない。次の式を考えよう。

\[
x^3-2x^2+x-x^3+3x-1
\]

\(x^3\) と \(-x^3\) は同類項であり、互いに打ち消し合う。したがって
\[
=(1-1)x^3-2x^2+(1+3)x-1
=\boxed{\phantom{-2x^2+4x-1}}.
\]

**【N01-Q09】** 打ち消し合う項まで整理し、式を完成させよう。

この式の次数は《穴》である。理由は、最高次に見えた \(x^3\) の項が《穴》ため、整理後に残る最高次の項が \(x^2\) だからである。

**【N01-Q10】** 次数だけでなく理由も答えよう。

**ここまでの要点。** 多項式を読むときは、まず**注目する文字**を決め、**同類項**をまとめ、その後で**次数**を判断する。この流れは、次の長い式の整理・足し引きにもそのまま使う。

## 正答と状態の分離（内部実装用、学習者には先出ししない）

| Original ID | Answer / expected reasoning | Unlock condition | Feedback on characteristic mistake |
| --- | --- | --- | --- |
| N01-Q01 | \(-1\) | 各定義の表示へ | 負号を文字側に残すと係数の符号が消える |
| N01-Q02 | \((-2,1),(1,2),(-1,4)\) | 次の例題へ | \(x^2\) の係数は2ではない；次数は指数の和 |
| N01-Q03 | \(5y\) | Q04へ | \(x\) に注目すれば \(y\) を係数側にまとめる |
| N01-Q04 | \(x\): \((5y,3)\), \(y\): \((5x^3,1)\) | Q05へ | 注目文字と定数扱いする文字の入れ替え |
| N01-Q05 | \(ay,\ ax\) | 多項式パートへ | \(a\) だけが係数ではない |
| N01-Q06 | \((3x^2-5x^2),(-5x+2x),(6-3)\) | Q07へ | 単項式の符号を保持する |
| N01-Q07 | \(-2x^2-3x+3\) | Q08へ | \(x^2\)項と\(x\)項はまとめない |
| N01-Q08 | \((2,3)\) | 独立確認へ | 整理前の次数を答えない |
| N01-Q09 | \(-2x^2+4x-1\) | Q10へ | \(x^3\)が消える |
| N01-Q10 | \(2\)次、\(x^3\)が打ち消し合う | 次単元へ | 見かけの3次で決めない |

### Design safety / 教訓との照合
- Total 10 original markers fully traced, but presentation may group multiple entries in one coherent flow rather than 10 disconnected quiz boxes.
- Do not display teacher-side table before learner corrects corresponding blank(s).
- Entire expression block is constructed before KaTeX compile; no separate raw math strings of half-open delimiters.
- The initial source’s names **単項式** / **係数** / **次数** must be introduced before asking for named classifications.
- \`N01-Q07\` result can be used as prior state for \`N01-Q08\`; \`N01-Q09\` must be solved before \`N01-Q10\`.
- No figure proposed; a formula and a compact comparison table explain the relationships. Source N01 had none.
- UI mock copy is for exact user-visible design review; not yet deployed or accepted.

### Notes requiring reviewer decision before shipping
1. Mathematical scope of \`5x^3y\`: wording explicitly treats x,y as algebraic indeterminates; clarifies the edge case of assigning \(y=0\) numerically (source did not spell that out).
2. Whether to display all 3 source-form coefficient-degree comparisons as compact table or one sentence with incremental holes (mobile must avoid title/card overstack).
3. If draft dialogue is needed, use sparingly: exposition must stand without unnecessary “先生/太郎/花子” turns.

## Next after review
Convert this exact approved learner-facing passage into the existing math-textbook app schema on a controlled branch; visual browser QA, then move to N03/N10/N12. No changes to existing Sets/Propositions/Physics/Practice modes.
