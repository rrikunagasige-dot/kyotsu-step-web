# Math Rendering Rules

Status: PROJECT-WIDE TECHNICAL AUTHORITY

Purpose: define technical QA rules for math tokenization, normalization, KaTeX rendering, and mobile visual consistency. This file is about rendering engineering, not pedagogy.

## Core invariant

The same mathematical expression must render with the same semantics and natural appearance whether it appears in prose, a formula block, a choice, or an answer.

Acceptance requires:
1. semantic correctness
2. tokenization correctness
3. normalization correctness
4. KaTeX compile correctness
5. visual correctness
6. mobile-width correctness

## Unicode math must not bypass the renderer

Source text may contain Unicode forms such as √, ², ₀, Δ, θ, ×, or combining vector marks.

These must not remain as plain-text fragments beside KaTeX math.

Example:
`√(v₀²+g²t²)`
must be treated as one math expression and normalized to a KaTeX radical over the complete radicand.

## Inline and block math must share the same normalization semantics

A mathematically identical expression must not look different merely because one copy is inside prose and another is in a formula block.

If radical length, subscript placement, vector marks, fractions, or bracket sizing differs by rendering path, treat that as a technical defect.

## Tokenizer tests are mandatory

Testing `normalizeTextbookMath()` alone is insufficient.

The full path must be tested:

source prose
→ inline tokenizer
→ math token boundary
→ normalizeTextbookMath
→ KaTeX render

For every new syntax, add:
- normalization unit test
- inline-tokenization unit test
- browser regression when layout-sensitive

## Radical regression gate

At minimum test:
- √(a²+b²)
- √(v₀²+g²t²)
- √((−10)²+(−10)²)
- radical inside Japanese prose
- radical inside a choice
- radical in a formula block

Expected:
- the complete radical expression is one math unit
- no raw Unicode radical remains outside KaTeX
- no KaTeX error
- the overbar covers the full radicand
- subscripts and parentheses sit naturally inside the radical

## Visual consistency is technical correctness

Compile PASS is still FAIL if:
- the radical bar does not cover the full radicand
- vector marks stack incorrectly
- subscripts split
- root/fraction/bracket heights look malformed
- inline baseline differs badly from surrounding math
- mobile width breaks the formula

## Fix the rendering layer before rewriting correct content

When physics/math content is correct but display is wrong:
1. verify source expression
2. inspect token boundaries
3. inspect normalization
4. inspect renderer
5. add regression tests
6. browser visual QA

Do not rewrite correct educational content merely to hide a rendering bug.

## 2026-10-02 — 1E inline radical defect

Observed in 1E:
`v = √(v₀²+g²t²)`

The inline radical looked different from previously correct radicals.

Current technical finding:
`normalizeTextbookMath()` can normalize `√(...)`, but `splitTextbookInlineMath()` uses a token pattern whose math token starts from letters/Δ rather than from the Unicode radical. Therefore a radical-starting inline expression can be split before normalization.

Classification: tokenizer/rendering defect, not pedagogy defect.

Required repair:
- radical-starting inline expressions must tokenize as one math unit
- add normalization and inline-tokenization regression tests
- verify the 1E inline formula at mobile width
