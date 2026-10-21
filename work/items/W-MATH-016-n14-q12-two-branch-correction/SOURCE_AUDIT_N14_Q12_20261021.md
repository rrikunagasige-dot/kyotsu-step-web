# W-MATH-016/P-001 N14 Q12 — independent source, algebra and history audit
Status: VERIFIED
Review: source and mathematical audit only; entire Gate② is NOT complete
Date: 2026-10-21 JST

## Primary checkpoint §12C
User explicitly approved unchanged P-001 with 「承認」. Isolated PR #106 test-source SHA cd79fa26ff0cd17163c05d9dceab383ce289224f, review-only accepted parent cf5b3285d01b958a3c6eea7c1e152320a9228bab. No main/host/publish permission.
Initial checks: governance #39548305571 SUCCESS, Review Preview Code Check #39548305562 SUCCESS, full math textbook CI #39548305543 IN_PROGRESS. CI success is not assumed.
N11 Q01–04/Q11/Q14 and N14 Q07/Q08 human Gate① previously accepted. Q12 Gate① PENDING, overall Gate②/Gate③ PENDING.

## Mathematics
Original N14 Q11: (x+3<=−2) OR (x+3>=2). Independent deductions: x+3<=−2 iff x<=−5, x+3>=2 iff x>=−1. The common subtraction by 3 preserves each non-strict inequality. Result: x<=−5 OR x>=−1, endpoints included. 9 representative x values (−100,−20,−6,−5,−4,−2,−1,0,200) had 0 contradictions against Q11's original condition.
New left answer x<=−5, wrong: x<−5 (lost equality), x>=−5 (reversed), x<=−1 (arithmetic). New right answer x>=−1, wrong: x>−1 (lost equality), x<=−1 (reversed), x>=1 (constant sign). Existing original n14-12 final answer and all three authored false alternatives remain verbatim.

## Source and cognitive order
One original source marker N14-Q12 maps to new IDs n14-wm016-q12-left, n14-wm016-q12-right, existing n14-12. 16 original N14 source markers unchanged. Expected rev6 N14 22 decisions, total 142 pending actual test.
Each new answer is formula-local after its own lead, each solution explanation only after that choice; the complete final combined OR is not shown in the leading blocks before n14-12. Original after-text preserved and OR endpoint explanation appended answer-gated.
Compared prior accepted source: original Q07, Q08 and Q12 final correct/error keys unchanged; approved Q07 and Q08 source flows preserved. Existing source wrapper is renamed to q08Content to insert Q12; this is not a change to earlier approved content. No new figures, schema/renderer/global style/mode changes.

## Historical data
N14 v5→v6 migration normalizes older revisions via existing approved migration chain, archives v5 including previous answers/times/provenance, preserves old n14-07, n14-08, n14-12 answers and old Q07/Q08 newly added node progress; only two new Q12 IDs are unresolved. Explicit migration unit tests are included but have not yet received runtime CI confirmation.

## Pending work and compliance
Only once exact math CI passes, may integrate PR #106 into review-only PR #101 (NOT main) and run native screenshot workflow. Expected 3 Q12 states×2 widths×3 states=18 real PNGs, verify file existence and full code SHA, then user Q12 Gate① small-block visual review. Gate② broad cross-source audit and Gate③ full user play need separate existing workflow; do not conflate.
§12C: audited source, choice plausibility, solution endpoints and old historical data while CI ran; no arbitrary 12/30 second polling. Existing old Q12 hint may merit user readability check during Gate①, not an unapproved change.

## Later workflow result / unchanged approval boundary
Standalone code Math CI #39548305543 SUCCESS; independent review source Math CI #39549620273 SUCCESS for matching source SHA 43ef4fae17b8ce9d0d9eb62358e392c47146cac1. Real native screenshot #39549614892 SUCCESS: 18 Q12 frames saved nonempty by PNG-only commit 6bfac2e58a20fbe80db3148c713200ed433f5e9b. User Q12 Gate① remains PENDING. This audit is not final Gate②, not authorization to merge main or publish. Actual mobile evidence also flags formula/prose adjacency and existing OR-branch hint language for human review.
