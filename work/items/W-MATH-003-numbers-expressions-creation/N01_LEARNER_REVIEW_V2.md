# N01 学習本文レビュー v2 — 元の10問 → 15個の段階的な回答操作

Status: REVIEW-DRAFT — **USER ACCEPTANCE PENDING**
Date: 2026-10-17
Work/approval: W-MATH-003 / approved P-001「数と式」作成
Original: user-uploaded \`01_数と式_教科書モード_対話段階導入版_v2(1).docx\`, N01 Q1–Q10, exact original math in \`N01_source.md\` (not in repository), independently validated in \`PILOT_SOLUTION_AUDIT.md\`.
This is **not** a lesson deployed to the app. Source problem statements are retained as anchors; student text between them is a new adaptation and must not be mislabeled as a verbatim quotation from Word.

## 1. What changed from the first N01 draft

- **V2-01** Removed advanced "algebraic indeterminates/zero-specialization" lecture from the student paragraph about \(5x^3y\): not justified as an introductory teaching step. Teacher audit still notes the subtlety. Source itself says "y is treated as an unchanging number"; preserve this simple interpretation.
- **V2-02** Keep source question IDs Q1–Q10 exactly, but implement a **15-interaction draft**. A source question may have several small stages only where needed for reasoning; group them as one paragraph/table rather than 15 visually independent question cards.
- **V2-03** Q3 already obtains the x-coefficient of \(5x^3y\), so Q4 *reuses* that result and asks a new y-view rather than making the learner redundantly select the same x coefficient again. Original Q4 coverage is retained through Q3 result.
- **V2-04** Q6 classification becomes a compact two-stage grouping (quadratic terms, then linear+constant); Q7 then calculates the grouped expression. Preserve each term's sign.
- **V2-05** Q9 requires the learner to do the term grouping and simplification before presenting the conclusion. Q10 *then* asks the degree and the reason. No prefilled "the cubic terms cancel" clue in the student-facing text before Q9.
- **V2-06** Choices and misconception-specific feedback are **hidden until interacting with the current hole**; never show a long list of 15 separate A/B/C/D cards or a whole-page grid of blanks.
- **V2-07** Retain three compact, subordinate local transitions (not three new chapter-level title cards); one intro, one chosen-variable transition, one like-terms transition. No mandatory figure: N01 original has none.
- **V2-08** Preserve exact original mathematical entities and avoid introducing a new proof/theorem not in source. Proof label is not used; concept/definition and example are distinguished.

## 2. Student-visible proposed passage (holes use 【選ぶ】 as placeholder for app choice widget; choices/answers are NOT visible here)

### 式を掛け算に戻す

次の三つの式を比べよう。

\[
-2x,\qquad x^2,\qquad -x^2y^2
\]

例えば \(x^2=x\times x\) である。マイナスがあるときは、符号も数の部分に含めて考える。

\[
-x^2y^2=\boxed{\text{【選ぶ】}}\times x\times x\times y\times y
\]

同じように数と文字の積で表した式を**単項式**という。この章では文字の指数を0以上の整数として扱う。数の部分を**係数**、掛け合わせた文字の総数を**次数**という。

これらを見分けるときは、まず掛け算を読み取る。三つの式の「係数・次数」は次の表で完成させよう。

| 式 | 係数・次数（同じ行の1つの回答欄） |
| --- | --- |
| \(-2x\) | 【選ぶ】 |
| \(x^2\) | 【選ぶ】 |
| \(-x^2y^2\) | 【選ぶ】 |

式の前に数字が書かれていないからといって、係数が存在しないわけではない。

### どの文字を見るか

\(5x^3y\) を今度は \(x\) についての式として見よう。ここでは \(y\) を変わらない数とみなす。そうすると、\(x^3\) に掛かる部分は

\[
5x^3y=\boxed{\text{【選ぶ】}}\,x^3
\]

となる。すなわち \(x\) に注目した**係数と次数**は、いま得た結果から読み取れる。

では同じ式を \(y\) について見ると、どこが係数に入るだろう。\(y\) に注目した「係数・次数」は【選ぶ】。

同じ見方を \(axy\) に移してみよう。\(x\) に注目した係数と、\(y\) に注目した係数は、この順に【選ぶ】となる。

**注目する文字以外は、係数側で一つにまとめる。** 文字そのものを変える必要はない。

### 同じ種類の項を集める

次の式を簡単にしてみよう。

\[
3x^2-5x+6-5x^2+2x-3
\]

引き算は負の数を足すこととして読み取れる。符号も含めた一つ一つのまとまりを**項**といい、単項式の和として表された式を**多項式**という。

同じ文字の部分を持つ項を**同類項**という。同類項をまとめるときは、その項の符号まで一緒に扱う。

まず \(x^2\) の項を取り出すと【選ぶ】である。残りの \(x\) の項と定数の項を、それぞれの組に分けると【選ぶ】となる。

自分で分けた三組を使って係数を計算し、元の式の整理を完成させよう。

\[
=(3-5)x^2+(-5+2)x+(6-3)=\boxed{\text{【選ぶ】}}
\]

多項式の**次数**は、同類項をまとめた後に残る項の次数の最大値である。注目する文字を含まない項を**定数項**という。いま整理した多項式の「次数・定数項」は【選ぶ】となる。

では、整理する前に次数を決めてもよいのだろうか。次の式も同じ順番で考えてみよう。

\[
x^3-2x^2+x-x^3+3x-1
\]

まず同類項で組み直すと【選ぶ】、その係数を計算して整理すると【選ぶ】となる。

**整理した結果**を見て判断しよう。この式は【何次式：選ぶ】である。そう判断できる理由は【理由：選ぶ】。

式を読むときは、**注目する文字を決める → 同類項をまとめる → 残った項の次数を調べる**という順で考える。次は、この見方を長い式の整理・足し引きに使う。

## 3. Teacher-only source-to-widget map (must NEVER appear before learners answer)

15 *draft* interactive items, all linked to 10 exact original question markers. IDs remain internal/unique within new unit; source question IDs retained in provenance.

| Original | App item(s) | Internal accepted answer | Plausible distractor focus |
| --- | --- | --- | --- |
| Q1 | n01-01 | \(-1\) | omitting negative sign |
| Q2 | n01-02a, n01-02b, n01-02c | \((-2,1)\), \((1,2)\), \((-1,4)\) | exponent mistaken for coefficient, wrong sign/total degree |
| Q3 | n01-03 | \(5y\) | coefficient mistakenly \(5\) alone |
| Q4 | n01-04 | \((5x^3,1)\) for y-view; x-view \((5y,3)\) is context retrieved from Q3 | moving wrong variable into coefficient |
| Q5 | n01-05 | x coefficient \(ay\), y coefficient \(ax\) | mixing order, dropping variable factors |
| Q6 | n01-06a, n01-06b | \(3x^2-5x^2\); \( (-5x+2x), (6-3) \) | losing negative signs, grouping \(x\) with \(x^2\) |
| Q7 | n01-07 | \(-2x^2-3x+3\) | wrong sign / like-term operation |
| Q8 | n01-08 | \(2\)次, constant \(3\) | deciding from prior uncollected terms |
| Q9 | n01-09a, n01-09b | \((1-1)x^3-2x^2+(1+3)x-1\), then \(-2x^2+4x-1\) | missing cancellation / wrong x coefficient |
| Q10 | n01-10a, n01-10b | 2次; third-degree terms cancelled in simplification | false highest degree based on source view |
| **Total** | **15 interactions** | **10 source problems preserved** | **NO long choice stack** |

## 4. UX implementation contract

- Existing readingFlow supports inline \`choice\` entries pointing to \`items\`; equations are read as \`formula\` blocks with typed math/choice parts.
- In a sentence, choose compact inline choice with hidden options until clicked. In a formula, show full math expression with a single replaceable choice span; on correct answer, render mathematically valid complete expression.
- Keep each source question's subchoices adjacent, inside a single teaching paragraph/table; the user should perceive **10 meaningful original tasks**, not 15 separately titled cards.
- For the Q2 coefficient-degree comparison, avoid six independent holes. Use three row-level compound selections, each evaluated independently.
- For Q9, regrouping correct ⇒ stage Q9b simplification; final result correct ⇒ Q10 degree; Q10 degree correct ⇒ Q10 explanation.
- On feedback, show **which misconception caused the mistake**; don't expose future answer or select a wrongReason that repeats the correct alternative.
- Score/progress item state IDs are stable. Reset/swap existing learner data forbidden. Avoid source label N01 as chapter-level visible heading.
- Do not pre-render unseen future source or a hidden answer key into visible DOM/captions. Existing \`math-sets\` and other published paths must remain unchanged.
- The original Word's answer key is **separate and not supplied**; teacher answers above were independently derived from source expressions, not checked against that booklet.

## 5. Source and review gates

- Direct source \`N01_source.md\` was recovered by Pandoc from uploaded DOCX; Word itself remains the provenance. No N01 figure exists.
- 10/10 source question numbers covered, 15 app interaction mapping manually inspected. This is a proposed UI structure, not a claim of source Word's original interactive widget design.
- Reviewer should confirm the **pedagogical order and text** as a representative pilot before code. If reviewer requests substantive changes, create \`REVISE-PROPOSAL\` if outside approved P-001 scope, rather than silently mutating accepted changes.
- No \`src/\`, \`public/\`, production Pages, existing curriculum or live progress changes until review gate cleared.
