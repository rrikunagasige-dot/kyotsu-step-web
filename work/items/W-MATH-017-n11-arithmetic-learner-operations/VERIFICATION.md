# W-MATH-017 — VERIFICATION
Status: PENDING
2026-10-21 source + screenshot evaluation only (no implementation, no CI claimed).
- Verified live Q01 screenshot shows `-2 ? -5` plus selected `-2>-5`, matched N11 formula source; mathematical direction itself correct.
- Verified live Q05 screenshot and authored `n11-05` answer: complete operation/result selected as one answer; confirmed there is no Q05 result computation hole.
- Checked Set chapter's concrete→choice→meaning→formalization pattern and original math-teaching MASTER §§8–11/53.
- Read-only §12B sibling scan: N11 Q05/06/08/09/13, N14 Q10/14/15. All need individual cognition analysis, not automatic new faults or permission to edit.
- P-001/Q01 & P-002/Q05 scope proposals NOT APPROVED; N11 revision migration/grading semantics unverified, no new Playwright PNGs/CI. Affected Gate② status REOPENED pending repair; Gate③ user final play FAILED/REOPENED (not FINAL-APP-ACCEPTED). Main/publication existing state unchanged. Preserve prior historical proof, no retroactive deletion of previously passed CI.


## P-003 new candidate technical gate — NOT YET PASS
Candidate code commit: `1739a98f55e1320209795131442044ef81fc39fe` (earlier docs+source commits referenced above).
- Source-structure audit: 123/123 Word markers in eight specified units **enumerated**; not independently visually played.
- Candidate static tests added: source item map 123 and now 143 learner actions, Q01 embedded relation, Q05 operation + numeric result, N11 v7 archive; historical v6 expectations separately preserved.
- Draft PR [#107](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107) for CI only. Initial governance CI [39576274721](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39576274721) **FAIL** (missing canonical `PROPOSAL.md`, fixed in this documentation commit). Math textbook [39576274614](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39576274614), review code check [39576274619](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39576274619) **RUNNING at prior observation**; no PASS inference on current changed HEAD.
- Gate① **BLOCK-CHECK-PENDING** (authentic 320/390 screenshots not yet verified); Gate② **OPEN**; Gate③ **FAILED/REOPENED**, no final user `総チェックOK` and no new hosting/merge authorization.


## P-003 Gate① authentic browser evidence, 2026-10-21
- Learner/test source SHA: `0a5d695ec5622519a5398274b7b14bbecb2fb587`. No main/deploy modification. Source code N11 revision7; Word/figure hashes unchanged.
- Real App Gate① capture and photo provenance at [evidence/p003-gate1/README.md](./evidence/p003-gate1/README.md); committed by screenshot-only GitHub Actions job at `07b7104eb6a3ff2c682d6bdcbe2157c2700f600d`. **42 authentic PNGs**, including normal full N11 learner route progressing first 9 proof decisions through Q05 (15 screens), plus numbered yellow-marked review-only before/wrong/hint/resolved (27 screens), across 320/390/1440px.
- Review Preview Check [39581161131](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39581161131) **PASS**, including bounded screenshot job. Governance check [39581161063](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39581161063) **PASS**. Full Math Textbook CI [39581161230](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39581161230) **RUNNING at this snapshot** (specific single tests/typecheck/build/mobile smoke already PASS); never infer final result.
- Original N11 Q01 relation and Q05 independent operation/numeric computation are correct in actual normal learner UI, without a detached formula-choice box; yellow frames only mark review blocks, not normal learner appearance. The remainder of older N11 author's formula blocks are not modified/approved by this Gate①.
- Gate① STATUS: `REAL-IMAGES-READY / USER-SMALL-BLOCK-ACCEPTANCE-PENDING`; Gate② `OPEN / §12B sibling impact ongoing`; Gate③ `FAILED/REOPENED`. No user `細部OK` or `総チェックOK` has been received at this point.


## Review-feedback status
P-003 correctness CI PASS and screenshot files do not amount to Gate① user acceptance. User raised an additional **pedagogical continuity** defect for generic learner `確認` markers; P-004 is proposed only, no new Gate① PASS. Original answer/revision invariants untouched pending P-004 approval.


## P-005 technical verification / exact SHA 0bb59e4b7…
- User directly approved four vertically continuous equations with holes, replacing earlier unapproved P-004 prose-led variant. Exact P-005 is `PROPOSAL_P005_FOUR_LINE_DERIVATION.md`, status APPROVED.
- Authored N11 version 8 uses grouped formula blocks `n11-lead-05`, `n11-formula-05`, `n11-after-05`, `n11-formula-06`; all same `derivationId`. No inherited normal-learner `n11-marker-2` `確認`. Numbered yellow Gate① review-only boxes remain separate and never appear on the normal learner route.
- Source mapping 123/123 original Word markers passes; math choices 144 including an extra independent balancing operation. v7->v8 migration archives entire v7 answer ledger, reopens only old n11-06 answer, and preserves n11-01 / n11-wm017-q05-operation / n11-05. Old v1–v6 migration tests preserved.
- Review screenshot source SHA `0bb59e4e9fa6314dcdda7b8d5dd5559f7fd92944`. See [real normal-app and marked screenshots](./evidence/p003-gate1/README.md), generated by passing GitHub Actions [39587993923](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993923). Actual normal screenshot inspection confirms a **single connected four-line derivation frame**, and final `x<7/3` after solving.
- [39587993960](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993960) governance PASS; [39587993923](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993923) review/screenshot PASS; full [39587993927](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993927) has Typecheck/Lint/Vitest/Build/mobile smoke PASS individually, full CI RUNNING as of last read. Earlier failed runs preserved historically, not promoted to final PASS.
- Gate① images READY, USER review PENDING. Gate② cross-block not yet PASS, Gate③ no whole-app SHA-matched approval. No main/production merge.


## P-006 technical and visual verification (2026-10-21)
- Source SHA 2c568703cb3e56b5ef4ab119b411bdb89e674cc6. Four formulas and two paragraphs share derivation ID n11-q05-q06-chain in the exact order F1, F2, cancellation explanation, F3, positive-division explanation, F4. Postchain paragraph shortened and does not disclose Q07 answer.
- Real Chromium normal learner flow at 320px, 390px and 1440px captured. Exact new text is shown only after required preceding arithmetic. All original four formula answer holes remain. No mobile horizontal overflow in screenshot assertions. Both short explanations visibly lie inside the *same* grouped formula frame.
- Review-only Gate① two numbered markers point exclusively to n11-p006-q05-cancel-explain and n11-p006-q06-positive-explain. Ordinary learner UI has no yellow markers.
- Initial review-image workflow 39592697619 FAIL because its screenshot test still assumed a removed formula review marker; normal learner tests for all 3 widths PASS. Fixed only the test expectation; later screenshot workflow 39593071069 PASS, saving source-SHA images in ./evidence/p003-gate1/README.md.
- Unit/Typecheck/Lint/Build and N12 26-step browser QA PASS in workflow 39593071259, whose full conclusion was still RUNNING at this record time. No claim of entire Gate② QA or Gate③ acceptance.
- Current user Gate①: REAL-IMAGES-READY / USER-ACCEPTANCE-PENDING. Gate② independent cross-audit OPEN. Gate③ frozen-SHA live whole-app acceptance OPEN. Binary teacher Word was not available for fresh independent verification here.


## P-006 FINAL CI + human Gate①
- [Math CI #39593071259](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39593071259): **SUCCESS** on tested code SHA `2c568703cb3e56b5ef4ab119b411bdb89e674cc6`, includes math textbook mobile/desktop, all 134 batch interactions, N11 proof and Q11/Q14, original N12 derivation, physics textbook and math practice setup regressions.
- [Actual review and screenshots #39593071069](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39593071069): **SUCCESS** on same code SHA; artifact/screenshot-only commit `540e2eee7671fe6b540dd6c68b0273eca1d04780` matches.
- User replied 「可以这样就行了继续」 immediately after P-006 screenshot review request: **BLOCK-VISUAL-OK** for P-006 two explanation paragraphs. [Exact acceptance record](./P006_GATE1_VISUAL_ACCEPTANCE.md). No formal app-wide `総チェックOK`.
- [Partial Gate② result](./P006_GATE2_CROSS_BLOCK_AUDIT.md) is IN-PROGRESS/BLOCKED; confirmed same-root Q08/Q09 and other sibling corrections still require separately approved design, full Word fidelity check UNVERIFIED. No MAIN merge, no new publish or Pages acceptance.

## P-007 QA source and screenshot evidence (2026-10-21)
- Exact source full SHA `76ab0e708f0706fbbfa7df1109f19d5263c7db19`, N11 revision9, Q08–Q09 original labels, five independent blanks, four formula lines and two explanatory paragraphs in one derivation.
- [Review+capture run 39598038524](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038524) SUCCESS with real Chromium screenshots at 320/390/1440, review marker ①–⑤ and unmarked normal learner from Q01→Q10. Code hash is captured SHA; image-only bot commit `55cb9fdfe06a819eb230789de7d797fe74daa084` is *not* itself the student rendered build.
- [Source/visual Gate① GitHub review sheet](./P007_GATE1_REVIEW_SHEET.md). **User response pending**; not accepted merely because tests passed.
- Progress: N11 v8→v9 archive exactly all v8 answers; reopen n11-08/n11-09 only. Historical v3→9 path and previously accepted answers verified in focused Vitest. No Q05/Q06 P-006 regression or hidden new visual marks.
- Full math CI [39598038354](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038354) unit/schema/typecheck/lint/build/N12+mobile steps passed at last observation, further jobs pending; final verdict not assumed.
- Gate② overall OPEN/NOT CROSS-VERIFIED due other confirmed same-root siblings and new Word direct read UNVERIFIED; Gate③ not ready, no main Pages release.


## P-007 confirmed user small-block acceptance + full QA result
- [P007_GATE1_REVIEW_SHEET.md](./P007_GATE1_REVIEW_SHEET.md) now records user's exact positive reply **「いいよ」** directly to `細部OK / 要修正` screenshot request (2026-10-21 JST). Five Q08/Q09 numbered new blocks only, exact tested SHA `76ab0e708f0706fbbfa7df1109f19d5263c7db19`. This is display acceptance only, no browser user play or `総チェックOK`.
- [Math full CI 39598038354](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038354) **SUCCESS** and [actual image/preview CI 39598038524](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038524) **SUCCESS**, both on same tested source SHA. Source map 14 markers, 28 choices; selective v8→9 progress archival PASS. Screenshot-only/docs commits do not change these student source results.
- Gate② overall **NOT CROSS-VERIFIED**: N11-Q13 and N14-Q10/Q14/Q15 same-root defects still need exact proposals and source word DOCX fresh comparison remains UNVERIFIED. Gate③ `FINAL-REVIEW-NOT-READY`. Next P-008 is proposal only until approval.


## P-008 learner QA + GitHub image checkpoint (source SHA `62c1702fa41175bec3bb5dfa7b468e61dc5e80b4`)
- Scope N11 Q13 original Word marker, rev10, 31 graded decisions and original 14 source labels. Four formula blocks + two reasoning `paragraph` blocks under `n11-q13-chain`, numeric answer keys `3,3,6,3`; old `n11-13` key archived/reset selectively. Focused unit/Vitest checks math equivalence `(x-2)/3≤2x+1 ⟺ x-2≤3(2x+1) ⟺ x-2≤6x+3`, Q14 unchanged and v3→v10 archived history.
- Actual Chromium screenshots and wrong/retry/hint at 320px/390px/1440px from [run #39608141779](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39608141779) **SUCCESS**, screenshot commit `17dc9635c8533d0d4dcb61a58a02442cb37ad5fa`, authentic [normal and marked image sheet](./P008_GATE1_REVIEW_SHEET.md). Original P-007 accepted markers absent; no reacceptance of earlier blocks.
- First E2E false-negative `constant placeholder count==0` was invalid for two gaps sharing one row. Fixed the test assertion only. No original pedagogy change.
- Math CI [#39608141804](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39608141804) typecheck/lint/Vitest/build + SVG decode/N12/mobile smoke individual PASS, final report not yet confirmed at write time.
- P-008 Gate① HUMAN PENDING, Gate② `NOT CROSS-VERIFIED` (fresh original DOCX unavailable, N14 Q10/Q14/Q15 same-root still open), Gate③ FINAL-REVIEW-NOT-READY. Main unmerged.
