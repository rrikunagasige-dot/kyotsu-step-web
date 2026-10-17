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
