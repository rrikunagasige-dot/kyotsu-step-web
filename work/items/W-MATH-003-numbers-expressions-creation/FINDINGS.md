# Findings — W-MATH-003

## F-001 — CONFIRMED: Source draft and mode
Indexed original Word `01_数と式_教科書モード_対話段階導入版_v2.docx`, 53 pages, authored pedagogical draft, lists publisher textbook guide as its upstream. Target mode is `数学 × 教科書`; draft != publisher canonical original.

## F-002 — CONFIRMED: Coverage and pilot rationale
16 internal units / 233 question markers / 12 named figure IDs (structural count). Pilot N01 (terms and coefficients), N03 (exponent/distributive table), N10 (square root product/quotient proof), N12 (inequality overlap, integer context). N01 10, N03 13, N10 21, N12 15 original question markers.

## F-003 — RISK/BLOCKED: Source math unrecoverable from indexed text
Numerous original math glyphs/OMML expressions missing, figure graphics unavailable. Files raw-byte materialization rejected; mounted files and connected Mac Downloads/Documents searches found no matching original. DO NOT invent original equations/numerical results or claim complete content QA. User re-upload or another verified raw source required for source-dependent implementation.

## F-004 — CONFIRMED: Required authority
Imported mathematical textbook SPEC is CANONICAL-CANDIDATE subordinate to target-approved original. User-approved `集合` example emphasizes in-prose inline cognitive holes, natural teaching flow, concept→property→proof if needed→example. Common masters govern rendering, technical QA and title compression.

## F-005 — ERROR-PROCESS: Work Status line violates validator
CI run [38985852212](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38985852212) failed `WORK.md missing Status`. Root cause: used `Status: BLOCKED (source fidelity gate); design work proceeds` instead of the exact registered value `Status: BLOCKED` demanded by repository OS. Corrected to `Status: BLOCKED` on its own line with a separate `Blocker` description. The raw Word fidelity gate remains genuinely BLOCKED.

## F-006 — RESOLVED: Original Word source recovered
The user reattached original raw DOCX on 2026-10-17, 212863 bytes SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`. XML directly contains 397 `m:oMath` and 14 embedded PNG. Pandoc translated original OMML to mathematical expressions; previous Library text gaps were an indexing artifact, not necessarily missing Word math. F-003 source-byte blocker RESOLVED, do not delete original history.

## F-007 — ERROR-ANALYSIS: Previous count 12 diagrams was false
Correct figure inventory is **14** original diagrams, including overlooked **N05-F01** (coefficient arrows for たすき掛け) and **N05-F02** (example completed after explanation). All image1..image14 recovered and visually inspected. Correspondence and source-file ids in `SOURCE_OMML_AUDIT.md`.

## F-008 — OPEN-QUESTION: Answer booklet not attached
Word explicitly says `解答は別冊`. Teacher answer booklet not provided, so 59 pilot original question answers were derived independently and basic formulas cross-checked with SymPy. Do not misrepresent these as matched to an official answer key. Remaining 174 markers require independent full math/source audit before bulk deployment.

## F-009 — RECOMMENDATION: N01 variable-vs-parameter caveat
In source Q3/Q4, `5x³y` is regarded as an x-polynomial with coefficient `5y` and degree 3. Strictly this is valid in formal `R[y][x]` or generic y ≠ 0 numeric specialization; setting y=0 yields zero polynomial, whose degree is not 3. Clarify pedagogical scope without silently rewriting original problem. New N01 learner review draft includes a caveat.

## F-010 — EDITORIAL-QA: N01 prior-answer leakage fixed before user review
First `N01_LEARNER_PILOT_DRAFT.md` draft explicitly stated the cancellation/remaining highest term immediately before N01-Q10; this reduced Q10 to trivial retrieval. Replaced with a genuinely open demand to identify the resulting degree **and justify** from the Q9 expression, and made Q9 group-and-result holes explicit. This is a pilot-specific demonstration of CMD-WORK-002 leakage inspection. Original source/answers unaffected.
