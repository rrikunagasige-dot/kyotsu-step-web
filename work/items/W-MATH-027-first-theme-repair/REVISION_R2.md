# R2 — full first-theme derivation and choice audit

User request:「选项，挤在一起了」「前面做的不错的但是后面就没推导了」「推导不详细」「其他地方的类似的错误也有很多全部找出来然后改掉」.
Scope remains the same first theme: N01–N06 and NE01. Layout feedback remains positive; content acceptance is still pending.
Baseline public source:f16275079d3b39758f2da9ceb6b4e156a48c4b9e.

## Reproductions and causes

| Attachment | Actual target | Cause | Repair |
|---|---|---|---|
|021316|N01-06b|Removing quad separators made two requested groups resemble a product|Separate labelled x-term / constant rows|
|021447|N01-09a/09b|Desktop two-column choices; later example skipped coefficient evaluation and zero-term removal|One-column options; calculate cubic0 and linear4, then explicitly remove0x³|
|021820|N02-04|Final assembly jumped from the original expression to the answer|Write regrouping identity, common-x factorization, and return the result to the original expression|

Underlying layout cause: independent KaTeX chunks lost leading binary-operator spacing; long factors and math text could also exceed the inner option width.
Options now use one column, semantic rows, explicit multiplication between adjacent factors, readable operator spacing,
mathematical wrapping inside long parentheses, and normal wrapping for prose. Grading values are unchanged.
The browser checks the inside of every option at320/390/1440px, including actual font size and chunk bounds.

## Full impact audit

R2_AUDIT.json records all206 previous first-theme decisions. R2_BASELINE.json preserves all399 previous chapter decisions.
The author reviewed the original questions and existing84 intermediate decisions, rather than assuming a passing technical test established detail.
A single already-supported classification, arithmetic operation or assembly from completed results is retained.
Multi-operation calculation, substitution, regrouping, cancellation and restoration gaps receive explicit equations and local decisions.

| Unit | Missing derivations repaired |
|---|---|
|N01|Later-example cubic cancellation and linear coefficient; explicit common-factor identities|
|N02|Regroup→factor→restore; every column of addition/subtraction; all coefficients of2A; A/B coefficient collection|
|N03|Each distributed product, same-degree collection and negative distribution|
|N04|Symbolic four products, crossing signs/cancellation, both formula substitutions, three-term squares, paired factors, T expansion/restoration|
|N05|Reverse expansion, common factors, square recognition, sum/product candidates, coefficient conditions and final substitutions|
|N06|Every X/T restoration, y-grouping, factor-pair comparisons, coefficient sums and return to the x-polynomial|
|NE01|Square before cube, both distributed rows, central coefficients, rearrangement for cube sums, negative substitution, cube recognition and numeric formula application|

Derivation rows have before / assemble / after positions relative to actual questions and their explicit dependencies.
The renderer rejects missing or duplicate derivation targets. Results are assembled after prerequisite decisions, not silently placed before their questions.
Semantic stages are split where the longer derivation adds a new goal; only earlier required results are pinned.
Existing choices, answers, hints, diagrams and source IDs are retained. New revisions archive prior attempts and reopen new IDs only.

## Verification before freeze

39 test files /433 tests passed.132 independent polynomial decision checks and141 written-equation checks passed.
A21-flow browser suite exercised813 correct interactions plus wrong/retry and restart across seven units at three widths.
Additional screenshot captures reproduce the three reported positions. The final frozen source repeats all checks in CI before publication.
The source and artifact SHA, public release manifest, live21-flow result and pending user review are recorded at publication close.

A temporary local exec transport disconnection interrupted verification. The filesystem recovered intact; no partially checked learner version was published.

## Exact-source public delivery

Learner source:204d901ec78c2fe8e214fd9b582f19cb3caeb2f4.
Hosting workflow:88264e3c74ed5017156e0124c01ff537a9b4da6e.
[Run40055604651](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40055604651) completed SUCCESS.
433 tests,132 independent polynomial checks,141 written-equation checks, compiled21 flows and public21 flows passed.
Each full-flow suite covered813 correct interactions, wrong/retry, history and restart at320/390/1440px.
Option-internal geometry, one-column layout and readable font were checked on every displayed choice.
Public16 routes/reload/history isolation passed; release manifest matched204d901e, three themes,16 units,464 decisions.
All399 previous graded decisions and nine out-of-scope lesson editions were protected by hashes.
State: PUBLISHED_FOR_USER_REVIEW. R2 pedagogical acceptance and independent Gate2 remain unclaimed.
