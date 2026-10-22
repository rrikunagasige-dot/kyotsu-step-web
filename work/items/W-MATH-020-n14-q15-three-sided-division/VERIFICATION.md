# W-MATH-020 — verification
Status: VERIFYING

| Surface | Result |
| --- | --- |
| Original N14 Q15 'divide by positive 3 and final bounds' | SOURCE-LOCATED in live lesson and prior Word comparison records |
| Consecutive Q14 result / Q15 source / Q16 endpoint verification | SOURCE-LOCATED; independent complete audit open |
| Q15 proposed 3 formula blocks / 1 prose / 5 decision keys | DESIGN ONLY, NOT CODE |
| 320/390/1440 genuine app and control sizes | NOT RUN — no Q15 source implemented |
| Existing Q14 Gate① accepted | YES, separate earlier Work; do not reopen |
| Q15 user proposal approval | PENDING |
| Gate② overall cross-audit | OPEN |
| Gate③ full-app live user 「総チェックOK」 | NOT READY |

No production app changed.

## 2026-10-22 — native Q15 six-case source-SHA browser technical PASS; evidence directory normalized
- User-approved Q15 P-001 three-equation/five-choice learner code unchanged since screenshot [Chrome #39716176256](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39716176256). **6/6 PASS:** numbered reviewer and ordinary app at 320,390,1440, including former Q14→Q15 test selector bug fixed in test-only commit. QA retained full-size original choices, red × after wrong, gated five local answers, source-SHA and normal/reviewer progress.
- Captured original actual app SHA `4a59ca3f8ae9bd7a0ff50c8b06db226815d063c3`; evidence-only bot commit `9587fc7d42e0c292bec2062d6d2cda33dd8d70af`. Original workflow wrote 22 genuine files to a Q15 *misnamed* `three-sided-addition` folder (a copying oversight from Q14). Reused the **exact immutable GitHub blob IDs** of all 22 captured files to the canonical [evidence/gate1](./evidence/gate1/README.md) directory under `W-MATH-020-n14-q15-three-sided-division`. Retained original backup to preserve audit history; corrected the capture job output folder for next runs. No fake screenshots, no learner-source/DOM/answers/MathCSS change. Browser screenshots themselves inspected in review-before/wrong/bounds 320.
- Governance and review code CI PASS at source SHA; full math textbook + practice runs still need their final statuses checked. This is technical Gate① evidence **only**, not Q15 user `細部OK`; original accepted Q14/Q10/N11 remain accepted. Gate② and Gate③ OPEN, main/Pages unchanged.

## 2026-10-22 — Q15 genuine Gate① native QA and evidence audit
- [Actual Chromium six-case run #39716176256](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39716176256) at SHA `4a59ca3f8ae9bd7a0ff50c8b06db226815d063c3`: **PASS 6/6**, both numbered reviewer and ordinary N14 learning at 320, 390, 1440. All 5 Q15 choices and one explanation, canonical full-size blue 選択 / red × with wrong/hint/retry, keyboard and no clipping. GitHub native image files were saved in bot commit `9587fc7d42e0c292bec2062d6d2cda33dd8d70af`.
- The first evidence bot workflow accidentally used the non-authoritative folder name `W-MATH-020-n14-q15-three-sided-addition` (copied from earlier Q14) rather than the actual Q15 Work `...three-sided-division`. The authorized lesson source was never incorrect. Corrected the workflow to write to [canonical images](./evidence/gate1/README.md); a second genuine capture succeeded for source SHA `649a86b76b873f3b53766f64566b42c7dd2c986f` in bot commit `5001c6a1413ba9e907e4dc5cd5fa6aab784329a1`.
- To satisfy the existing one-Work-folder governance and avoid destructive loss, copied the first **22 exact original Git blob files** into [immutable historical evidence](./evidence/history/source-4a59ca3f8ae9bd7a0ff50c8b06db226815d063c3/README.md), then removed only the empty misnamed Work folder from the current Git tree **atomically**; all 22 files remain as byte-identical history, all 22 newest images remain under canonical Gate1. The earlier Git commits are also unchanged. No formula, answer, history migration, CSS, reviewer state or accepted Q14/Q10/N11 changes.
- This is **Q15 TECHNICAL Gate① PASS / USER VISUAL PENDING**, not user acceptance. Previously approved blocks remain accepted. Independent Gate② cross-audit and Gate③ exact-SHA playable full app remain OPEN. Governance/review code checks on candidate source passed; full Math textbook regression may have been cancelled by evidence-only branch updates, so report its actual final status rather than invent PASS. Main and published app unchanged.

## 2026-10-22 — authentic Q15 Gate① accepted; independent Gate② unfinished
- Q15 accepted limited user-selected mathematical layout: user direct **「続けて」** to the concise 3-formula, 2-visual-line, 5-hole Gate① review. Mark **BLOCK-VISUAL-OK (Q15 only)**, not all screenshot inspection. Authentic app reviewer and normal cases 320/390/1440 **PASS 6/6**, source-matched screenshots at [evidence/gate1](./evidence/gate1/README.md), existing accepted blocks unchanged.
- Full textbook CI #39717059416 initially FAILED at old Q14-to-Q15 test assertion. Failure trace at `e2e/new-batch-walkthrough.spec.ts:407` confirmed old final `n14-15` should now be locked while initial Q15 division choice is visible. Corrected test only, source math and CSS unchanged. Full Math textbook new run PENDING at this checkpoint; do not record full PASS prematurely.
- Independent Gate② all-mode/source/OMML audit NOT CROSS-VERIFIED, Gate③ SHA-matched whole-app user `総チェックOK` NOT STARTED, PR draft, main/Pages/public unchanged.


## 2026-10-22 — Q15 full Math CI closed, scoped Gate② still open
- [Math textbook full CI #39719059325](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39719059325) **SUCCESS** on exact source SHA `93dfa96de05803ef9cdeeb8ee00f1b5665bcca44` after correcting Q14→Q15 test expectation. [Math practice #39719059617](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39719059617), [Review Code #39719059324](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39719059324) and [Governance #39719059314](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39719059314) all SUCCESS on same SHA. No unauthorized learner changes.
- Verified teacher original Word v2 (archived handoff OOXML `word/document.xml`, file SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`): N14 original Q01–16 markers, Q14 “まず定数項をなくす変形”, Q15 “係数を1にし、最終的な範囲”, Q16 exact endpoint-substitution requirement. Original teacher separate answer book remains unavailable; do not assert all 123 source answers independently proven.
- Independent arithmetic and dependencies: |3x−2|≤4 iff −4≤3x−2≤4 iff −2≤3x≤6 iff −2/3≤x≤2; endpoints x=−2/3 and x=2 both give |3x−2|=4. Q10/Q14/Q15 previous Gate① concise user acceptances preserved, as are original source-locked 16 question markers and 1 N14 figure. Genuine 320/390/1440 Q15 review/normal screens pass 6/6, Q15 5 choices 3,3,3,−2/3,2 and selective 8→9 answer archive pass.
- New independent Gate② finding F-021-01: Q15 middle's after-wrong hint directly says `3x÷3=x` while answer `3` is unresolved. This is an after-wrong leakage, NOT a first-state leak, and is NOT authorized for unrequested repair. Exact one-sentence change in separate [W-MATH-021/P-001](../W-MATH-021-n14-q15-middle-hint/PROPOSAL_P001.md) **PROPOSED / USER APPROVAL REQUIRED** on isolated branch. Same-root old Q16 worked-value after-wrong hint separately CONFIRMED candidate. Q10/Q14 prior acceptances are NOT reopened.
- Per WORK_SYSTEM §12A and [scoped audit](./CROSS_BLOCK_AUDIT_20261022.md), full Gate② remains IN-PROGRESS / NOT CROSS-VERIFIED: the Q15 hint, old Q16 sibling and 123-question distractor/raw answer-key audit, other approved creation artifacts, other subjects' complete UI evidence are not all closed. Gate③ exact-SHA live whole-app user play `総チェックOK` NOT READY. Draft PR #109 open/unmerged, main/Pages/public unchanged.
