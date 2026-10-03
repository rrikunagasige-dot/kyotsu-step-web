# Math Rendering Rules — 数式レンダリング技術QA

Status: **PROJECT-WIDE TECHNICAL AUTHORITY**

Purpose:
このファイルは、教材内容や導出 pedagogy ではなく、数式を App 上で一貫して正しく表示するための技術ルールと既知不具合をまとめる。

Chapter 1 の実App QAでは、数式そのものが正しくても tokenizer / normalization / formula assembly / KaTeX / resolved-state UI のどこかが違うだけで、赤raw表示、添字崩れ、二重記号、plain-text選択肢、変な根号などが繰り返し発生した。

したがって Math Rendering は独立した quality gate とする。

---

## 0. Scope — 何がこの文書の管轄か

### この文書の管轄

- inline math tokenization
- Unicode → LaTeX normalization
- combined subscript / superscript
- vector / bar / average notation
- radical / fraction / bracket
- trig typography
- formula-hole assembly
- choice math rendering
- resolved-answer rendering
- KaTeX parse / strict warning
- inline / block visual consistency
- mobile math layout

### 別の文書の管轄

次は数式と関係するが、主原因は Math Rendering ではない。

- 一つの導出が複数の白カードに分断される
  → `FORMULA_DERIVATION_RULES.md` / derivation UI
- 同じ完成式を無意味に二度出す
  → pedagogy / content duplication
- 公式の途中導出が足りない
  → derivation pedagogy
- 穴の場所が弱い
  → hole-quality pedagogy

症状が似ていても root cause を混同しない。

---

## 1. Core invariant

> **同じ数学的表現は、本文inline・formula block・choice・resolved answer のどこに現れても、同じ数学的単位として解釈され、自然なKaTeX表示になる。**

Acceptance は6段階:

1. semantic correctness
2. tokenization correctness
3. normalization correctness
4. formula-assembly correctness
5. KaTeX compile correctness
6. visual/mobile correctness

「読める」「KaTeX errorがない」だけではPASSにしない。

---

## 2. Historical defect catalog — 実際に起きた既知バグ

この表は一般論ではなく、Chapter 1 の実装・user QAで実際に発生したもの。

| ID | 症状 | Root cause | 修正原則 | Status / evidence |
|---|---|---|---|---|
| MR01 | 数式穴を含む式が raw TeX / 赤表示になる | `\\frac{` + hole + `}{` + hole + `}` のように、LaTeXを断片ごとにKaTeX compile | **式全体を組み立ててから一度だけcompile** | FIXED in P27; `docs/physics-ch01/WORKLOG.md` |
| MR02 | `v₀ₓ`, `v₀ᵧ` が `v_0_x` のような不正LaTeXになる | Unicode combined subscript を単純置換し、subscriptを二重生成 | combined subscript sequenceを一つの `_{...}` にまとめる | FIXED; `textbookMath.test.ts` |
| MR03 | inline と display/formula で同じ式の見た目が違う | 別tokenization/rendering path | normalization semanticsを共有する | PARTIAL; radical issueで再発 |
| MR04 | source内で Unicode / ASCII風 / TeX風表記が混在 | source authoring形式が統一されていない | source差異はnormalization layerで吸収し、learner UIで統一 | ACTIVE RULE |
| MR05 | clickable formula-holeで KaTeX strict warning | interactive metadataをKaTeX HTML extensionへ埋め込んだ | interactionはReact側、KaTeXは純粋なmath renderingに限定 | FIXED; P39 R2 |
| MR06 | formula choiceが plain text のまま表示 | choice pathがmath rendererを通らない | formula answer/choiceは同じnormalization + KaTeX pathへ | FIXED; P39 |
| MR07 | 正答後も穴だけ箱付きfragmentに見える | unresolved UI表現をresolved後も保持 | resolved stateは普通の完成数式へ戻す | FIXED; `textbookFormula.test.ts` |
| MR08 | prose中の `r⃗`, `vₓ`, `vᵧ`, `Δr` がraw Unicode/textになる | prose tokenizerがmath tokenとして拾わない | inline tokenizerでmath token化してKaTeXへ | FIXED for recorded cases |
| MR09 | `sin/cos/tan` のspacing/typographyが不統一 | plain lettersとKaTeX operatorsの混在 | `\\sin`, `\\cos`, `\\tan`へnormalize | RULE EXISTS; direct coverageを強化する |
| MR10 | 平均速度 `v̄⃗` がbar + vector arrowの二重記号に見える | combining marksを字面通り重ねた | learner UIは意味を保ち自然なnotationへ正規化: `\\vec{v}_{\\mathrm{avg}}` | FIXED; direct unit test |
| MR11 | `√(v₀²+g²t²)` の根号だけ他の式と違って崩れる | inline tokenizerが `√` 始まりの式を一math tokenとして拾えない | radical全体をtokenize → `\\sqrt{...}`へnormalize | **FIXED 2026-10-02 / run 249** |
| MR12 | formula typographyが場所によって textbook-grade でない | multiple rendering surfaces + inconsistent token boundaries | surface matrixで同じ式を比較する | ONGOING visual QA |
| MR13 | `θ=45°`, `2θ=90°` がinline mathとして一体化しない危険 | inline tokenizerがθ始まり・degree sign・数字+θを十分に扱っていない | θ/° tokenization + degree normalization + trig regression | **FIXED 2026-10-02 / run 256 attempt 2** |
| MR14 | Math practiceで `overline(A) ∩ B` が raw prose として表示される | prompt / hint / choice の text surface が共通 math tokenizer を通っていなかった。また集合演算記号のnormalize/tokenize coverageがなかった | set notationをshared normalizationへ追加し、Math practiceのproblem/prompt/choice/hint/resolved answerを同じinline-math surfaceへ通す | **REPAIR 2026-10-03 / pilot 87,94,97** |

Primary historical evidence:
- `docs/physics-ch01/P39_LIVE_APP_DEFECT_AUDIT.md`
- `docs/physics-ch01/WORKLOG.md`
- `CHATGPT_README_FIRST.md`
- `src/domain/textbookMath.test.ts`
- `src/domain/textbookFormula.test.ts`
- `e2e/chapter1-learning-smoke.spec.ts`

---

## 3. Architecture rule — math pipelineは一方向にする

Preferred pipeline:

```text
source string
↓
identify complete mathematical token / formula
↓
normalize Unicode / notation
↓
assemble full expression including resolved holes
↓
KaTeX render
↓
React interaction/UI around the rendered math
```

禁止:

```text
LaTeX fragment
↓
KaTeX
+
button
+
LaTeX fragment
↓
KaTeX
```

特に `\\frac`, `\\sqrt`, `\\left(...\\right)` の内部をUI fragment単位でcompileしてはいけない。

---

## 4. Whole-formula rule

P27で発見されたroot causeを恒久ルール化する。

例えば、

```text
\\frac{ [hole numerator] }{ [hole denominator] }
```

を、

```text
"\\frac{"
[interactive hole]
"}{"
[interactive hole]
"}"
```

として各fragmentを別々にKaTeXへ渡すと構文として壊れる。

Hard rule:

> **interactive holeがあっても、数学構文としては一つの完成式を構築してからrenderする。**

interactionのクリック対象・stable item ID・wrong state等はReact layerで管理し、数学構文を壊して埋め込まない。

---

## 5. Unicode normalization rules

Sourceでは以下を許容するが、learner-facingでは一貫したLaTeXへ変換する。

### Combined subscripts

- `v₀ₓ` → `v_{0x}`
- `v₀ᵧ` → `v_{0y}`
- `v_0_x` → `v_{0x}`

二重subscriptを生成しない。

### Vectors

- `r⃗₁` → `\\vec{r}_{1}`
- `Δr⃗` → `\\Delta \\vec{r}`
- `v⃗_A` → `\\vec{v}_A`

raw combining vector markをUIに残さない。

### Average vector

- source `v̄⃗`
- learner rendering `\\vec{v}_{\\mathrm{avg}}`

意味を保ちながら視覚的なbar+arrowの重なりを避ける。

### Operators / symbols

- `Δ` → `\\Delta`
- `θ` → `\\theta`
- `×` → `\\times`
- `·` → `\\cdot`
- `−` → math minus
- `²`, `³` → superscript

### Trigonometric functions

- `sin` → `\\sin`
- `cos` → `\\cos`
- `tan` → `\\tan`

italic variable letters `s i n` のように見せない。

---

## 6. Inline math rule

Inline proseは最も再発しやすい。

理由:
formula blockは最初から「全部math」だが、proseはtextとmathの境界を tokenizer が判断する必要がある。

Hard rule:

> **normalize関数が正しくても、tokenizerが式を途中で切ったらFAIL。**

必ず両方をテストする。

Example:

`速さは v=√(v₀²+g²t²) である。`

期待token:

```text
text: "速さは "
math: "v=\\sqrt{v_0^2+g^2t^2}"
text: " である。"
```

`√` や括弧内だけがtext fragmentへ逃げてはいけない。

---

## 7. Radical-specific gate

今回の1E defectを一般化する。

最低限:

- `√(a²+b²)`
- `√(v₀²+g²t²)`
- `√((−10)²+(−10)²)`
- `v=√(v₀²+g²t²)`
- 日本語文中のradical
- choice内radical
- formula block内radical
- resolved answer内radical

Expected:
- complete radicalが一つのmath unit
- `\\sqrt{...}` へnormalize
- raw `√` がplain textで残らない
- radical barがradicand全体を覆う
- subscript/superscriptがradical内で自然
- inline baselineが不自然にずれない
- Pixel-widthでoverflowしない

---

## 8. Resolved-hole rule

Unresolvedとresolvedは見た目の意味が違う。

### Unresolved
interactiveであることが分かる必要がある。

### Resolved
完成した教科書数式として読める必要がある。

Hard rule:

> **正答後は「穴を埋めたUI」ではなく「普通の完成式」に戻る。**

禁止:
- resolved answerだけ箱が残る
- answer fragmentだけfont/baselineが違う
- answer fragmentだけplain text
- completed formulaが複数rendererの継ぎ接ぎに見える

Existing regression:
`src/domain/textbookFormula.test.ts` が resolved answerで `\\boxed{}` を禁止している。

---

## 9. Choice rendering rule

Formula choiceも数学である。

例えば:
- `(v cosθ, v sinθ)`
- `√(vₓ²+vᵧ²)`
- `(v−v₀)/a`

をplain textで出さない。

Choice surfaceも:
- same tokenizer/normalizer
- same KaTeX typography
- no raw Unicode leakage

を満たす。

---

## 10. KaTeX warning/error rule

Required:
- `.katex-error = 0`
- parse error = 0
- avoid strict-mode warnings caused by unsupported/HTML-extension hacks

Past lesson:
interactive metadataをKaTeX commandへ埋め込む方式はやめ、React component側へ分離した。

Do not reintroduce:
- `\\htmlData`
- `\\htmlClass`
- `\\href`

for textbook hole interaction.

Existing regression:
`src/domain/textbookFormula.test.ts` がこれらを禁止している。

---

## 11. Surface matrix — 同じsyntaxを全表示面で見る

新しい数式syntaxを導入・修正するときは、一箇所だけ見ない。

| Surface | Must test |
|---|---|
| formula block | compile + visual |
| Japanese prose inline | token boundary + visual |
| choice | normalization + visual |
| unresolved hole formula | full expression compile |
| resolved hole formula | natural completed appearance |
| hint / feedback if math appears | no raw notation |
| mobile | baseline / wrapping / overflow |
| desktop | typography consistency |

同じsyntaxが複数surfaceへ出るなら、最低2surface以上のtestを持つ。

---

## 12. Current automated coverage

### Already covered

`src/domain/textbookMath.test.ts`
- combined Unicode subscripts
- vectors / vector subscripts
- average-velocity normalization
- ordinary symbolic subscripts
- prose-level combined subscript extraction

`src/domain/textbookFormula.test.ts`
- all Chapter-1 formula blocks unresolved: no KaTeX error
- no KaTeX HTML-extension interaction commands
- resolved holes: no boxed fragment
- prose-level vector symbols become inline math
- all Chapter-1 formula blocks resolved: no KaTeX error

`e2e/chapter1-learning-smoke.spec.ts`
- raw `v_0_x`, `v_0_y` leakage forbidden in 1F
- `.katex-error` must remain zero
- mobile + desktop Chapter-1 progression

### Coverage gaps identified now

1. radical-starting inline expression — **COVERED 2026-10-02**
2. inline `v=√(...)` as one token — **COVERED 2026-10-02**
3. trig typography/spacing direct regression — **COVERED for 1F sin/cos/tan 2026-10-02**
4. same expression inline vs formula-block comparison — weak
5. mobile visual radical geometry — no dedicated assertion/screenshot
6. long fraction/root overflow near phone width — weak

These gaps are not hidden by the existing “all formula blocks compile” test because the current radical defect is specifically in the **prose inline path**.

---

## 13. Visual QA checklist

Compile PASS後に実ブラウザで見る。

### Radical
- bar length
- root height
- parentheses height
- nested superscript/subscript
- baseline

### Subscript / superscript
- no double subscript
- no raw Unicode fragment
- no unexpected line break between base and subscript

### Vector / average notation
- no stacked double mark
- arrow length natural
- subscript aligned

### Trig
- `sin/cos/tan` upright operator
- spacing before argument natural

### Fraction
- numerator/denominator not clipped
- interactive state does not break brace structure

### Completed formula
- resolved answer visually merges into surrounding expression

### Mobile
- no horizontal overflow
- no clipped radical/fraction
- choice button can contain formula without shrinking into illegibility

---

## 14. Debug order for future defects

数式がおかしい時、contentを先に書き換えない。

```text
1. source expression is mathematically correct?
↓
2. tokenizer produced the intended complete math token?
↓
3. normalizeTextbookMath produced valid LaTeX?
↓
4. formula assembler preserved one complete expression?
↓
5. KaTeX compiled without error/warning?
↓
6. React/CSS altered baseline/box/overflow?
↓
7. mobile + desktop visual QA
```

各層を分けて原因を確定する。

---

## 15. Regression rule after every math-rendering bug

新しいmath-rendering bugを一度見つけたら、修正だけで終わらない。

必ず:
1. symptomをこのknown-defect catalogへ追加
2. root causeを記録
3. smallest unit regressionを追加
4. surface-specific regressionを追加
5. mobile browserで確認
6. 修正後も同じsyntaxを別surfaceでspot-check

「一回直したから覚えている」は禁止。testを executable memory にする。

---

## 16. 2026-10-02 — 1E inline radical defect

Observed:
`v = √(v₀²+g²t²)`

Symptom:
formula blockの自然な根号と違い、本文inlineの根号だけ不自然に見える。

Current technical finding:
`normalizeTextbookMath()` は `√(...)` を処理できるが、`splitTextbookInlineMath()` のtoken patternは math token開始を主に letters / Δ から想定している。そのため Unicode `√` から始まる部分が完全なmath tokenとしてnormalizationへ届かない。

Classification:
**MR11 / tokenizer + inline-rendering defect**

This is NOT:
- physics error
- derivation pedagogy error
- formula-content error

Implemented repair:
- radical-starting inline expressionを一つのmath tokenとして取得,
- `v=√(...)` のような式を spaces around operators を含めて一つのmath tokenとして取得,
- balanced-parentheses radical normalizationを追加し、`√((−10)²+(−10)²)` も処理,
- normalization regression追加,
- inline-tokenization regression追加,
- 1E browser regressionで KaTeX expression 1個 / sqrt 1個 / no overflow / no KaTeX error を確認.

Validation:
- commit: `e54f49a179d8696b03ea74a9afecf8a8654aa1e3`
- GitHub Actions run: **249**
- typecheck PASS
- Chapter 1 audited data/math PASS
- P39 browser smoke PASS
- build PASS
- Pages deploy PASS

Do not rewrite the correct physical formula to avoid parser defects.

---

## 17. Historical sources / authority

Known defects were consolidated from:

- `docs/physics-ch01/P39_LIVE_APP_DEFECT_AUDIT.md`
  - E01 combined subscripts
  - E02 inline/display path split
  - E03 mixed source notation
  - E04 KaTeX strict warnings
  - E22 typography
  - E23 trig spacing
  - E24 resolved formula appearance
- `docs/physics-ch01/WORKLOG.md`
  - P27 raw-TeX / fragmented-LaTeX root cause
  - formula choices as plain text
  - boxed resolved fragments
  - Unicode inline math repair
- `CHATGPT_README_FIRST.md`
  - whole-formula rendering rule
- `docs/physics-ch01/P39_LIVE_APP_DEFECT_AUDIT.md` POST-R9
  - average-velocity stacked bar + vector arrow
- current user QA
  - 1E inline radical defect

When older historical notes conflict with later explicit user QA, later user QA wins.


---

## 18. 2026-10-02 — 1F theta / degree / trig hardening

1F uses angle and trigonometric notation heavily, which exposed a separate risk from MR11 radicals.

Required syntax:
- `θ=45°`
- `2θ=90°`
- `sin²θ`
- `cos²θ`
- `sin2θ`
- trajectory formulas containing `tanθ`

Implemented:
- `θ` may start an inline math token,
- `2θ` / degree-bearing expressions are tokenized as math,
- `°` normalizes to `^{\\circ}`,
- direct unit regressions cover theta, degree, sin/cos/tan,
- 1F browser regression checks KaTeX annotations and page-level mobile overflow.

Validation complete:
- exact code HEAD: `48e9454fb0b4fd95702bfaf7a5a3fdc65e3510ef`
- GitHub Actions run 256, attempt 2: SUCCESS
- typecheck PASS
- Chapter 1 audited data/math PASS
- P39 browser smoke PASS
- production build PASS
- Pages deploy PASS

MR13 is CLOSED.


---

## 19. 2026-10-03 — Math practice set-notation surface repair

Observed in the deployed Math practice pilot:

`overline(A) ∩ B`

was shown as authoring text instead of learner-facing mathematical notation.

Root causes:
- Math practice blank prompts were rendered with plain React text,
- hint / choice / resolved-answer text used a different surface from formula blocks,
- the shared tokenizer/normalizer did not yet cover complement/intersection/union/membership notation.

Repair rule:
- do not rewrite mathematically correct content to avoid renderer defects,
- normalize `overline(A)`, `∩`, `∪`, `∈`, `∉`, and finite-set literals through the shared math path,
- use the same inline math renderer for original problem prose, blank prompts, choice content, hints, and resolved answers,
- require no visible raw `overline(` text in the Math practice browser gate,
- check both mobile and desktop.

This follows the same debugging order as MR11/MR13: source correctness → tokenization → normalization → React surface → browser visual QA.


---

## 20. 2026-10-03 — Math practice TypeScript TeX escape loss

Observed while auditing problem 88 before expanding the next batch.

Source strings in `src/data/mathPractice/setsBatchA.ts` had been authored with single backslashes inside ordinary TypeScript string literals, for example:

```ts
latex: '1\times36,\;2\times18'
```

In a TypeScript/JavaScript string literal, this is not equivalent to the intended learner-facing TeX source. In particular, `\t` becomes a tab character at runtime, so `\times` degraded into a tab followed by `imes`; other commands such as `\ldots`, `\text`, `\le` and spacing commands could also lose their TeX backslash.

Symptom seen in browser-test text:

```text
1imes36,;2imes18,...;ldots
```

Classification:
**MR15 / authoring-string escape defect**

Root cause:
- valid LaTeX was conceptually authored,
- but the host-language string literal was not escaped,
- therefore the corruption occurred **before** the math renderer/tokenizer.

Repair rule:

```ts
// Wrong in an ordinary TS string
latex: '1\times36'

// Correct source spelling
latex: '1\\times36'
```

Hard gate for Math-practice source files:
1. every explicit `type: 'latex'` string must preserve TeX backslashes at runtime,
2. unit tests must reject tab-character corruption and require representative commands such as `\\text`, `\\times`, `\\ldots`,
3. browser tests must verify learner-visible mathematical output rather than only build success,
4. when this defect is found in one generated batch, scan the sibling questions from the same authoring path before declaring the batch visually valid.

Repair scope after the 88 pilot gate passed:
- problem 88 first, then the same defect class scanned across 89–96
- PR #16
- source-file regression forbids isolated single TeX backslashes in `src/data/mathPractice/setsBatchA.ts`
- runtime regression checks representative `\\text`, `\\times`, `\\ldots` commands
- browser regression covers problem-88 leakage/compression on mobile and desktop

Do not “fix” this by replacing the mathematics with plain prose. Repair the host-language escaping.
