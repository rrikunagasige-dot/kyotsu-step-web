# W-MATH-018 — VERIFICATION
Status: VERIFYING — P-004 TECHNICAL PASS / Gate① USER PENDING
Updated: 2026-10-22 JST

| Check | Status |
| --- | --- |
| P-001 exact execution approval by user | APPROVED: direct 「続けて」 |
| Scoped N14 Q10 implementation | IMPLEMENTED IN DRAFT PR ONLY |
| Original 16 N14 Word source marker IDs retained | SELF-CHECKED; automated verification pending |
| Three formula rows, one explanation, five independent holes | IMPLEMENTED; real screenshots pending |
| Correct numeric answers and sign | Static maths checked; separate focused unit test awaiting CI |
| N14 revision6→7 selective archive | IMPLEMENTED; focused source and history tests awaiting CI |
| Previously approved Q07/Q08/Q12 and F01 unchanged | Diff scope confirmed; automated regression pending |
| Original Word embedded equation glyphs | UNVERIFIED: Library indexed text yes, raw OOXML no |
| Gate① exact-SHA live Chromium + user `細部OK` | NOT READY / PENDING |
| Gate② independent audits and other affected N14 Q14/Q15 | NOT CROSS-VERIFIED |
| Gate③ full SHA-matched playable app + user `総チェックOK` | FINAL-REVIEW-NOT-READY |
| main/public app | NO MERGE / NO PUBLICATION |

Do not mark a CI PASS or user acceptance until results obtained. Keep older accepted P-008 screenshot SHA and approval records protected.


## 2026-10-22 P001 actual image audit and CI result
- Real Chromium Gate① capture #39629959612 successfully stored genuine 320/390/1440 screenshots. Source SHA e1e913f2230c42175bc5e67a53e726d030752634, evidence commit 06643939685a06f6d3c23046b3b85730a5cc4244. VISUAL FAIL/NEEDS-FIX at 320 and 390: Q10 formula row's last incomplete operand clipped. Full screenshot defect proof P001_GATE1_VISUAL_DEFECT.md; Gate① cannot be offered.
- Math CI #39629959584 overall FAIL: original Q07/Q08/Q12 E2E revision6 expectations obsolete under Q10 revision7, six mobile cases; the source/maths/unit schema, build and smaller E2Es passed prior stage. Test-only correction 0b63f8a1fc9b6d70d8ce6c0f90732345d431e8a9 must be rerun. No P002 CSS changes implemented.
- Need new P002 exact responsive CSS proposal approval and 320/390 real screenshot no *inner* scroll/clipping before human Gate①. Gate② open, full Word OMML still UNVERIFIED, sibling Q14/Q15 open; Gate③ FINAL-REVIEW-NOT-READY.


## P002 exact-scope verification (await actual result)
- User direct 「続けて」 approved responsive compact display for n14-q10-chain at <=430px, not other lessons.
- Candidate CSS added, test now FAILS on any *inner* formula scroll overflow, any missing/clipped unfinished hole or sub-2rem×34px active control at 320/390 and checks aria-label and □/↻. Genuine P002 screenshot run to confirm before Gate①.
- Old P001 clipped images retained under `evidence/p001-gate1`; new tests/images `evidence/p002-gate1` and source SHA to be recorded after run. Gate① pending, Gate②/③ open.


## 2026-10-22 P002 exact-SHA browser failure and required new approval
- P002 current tested source SHA `936a9a0b7fdee86de8df02519255df7a2652b14b` in GitHub Actions [39634288270](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39634288270) **FAIL** for real reviewed Q10 formula: scrollWidth 300 vs clientWidth213 or241 at 320, and 300 vs283 at 390. Neither old P001 nor P002 has acceptable Gate① mobile screenshot. No visual acceptance to request.
- P002 CSS improperly targets `button.reading-inline-blank` while formula displays `button.reading-formula-choice`. The user specifically asked to preserve hole design; new `□/↻` was not accepted as equivalent to the existing blue 「選択」/red 「×」 controls.
- Replaced proposed plan is [P003 unchanged canonical button + mobile-only equation wrapping](./PROPOSAL_P003_CANONICAL_CHOICES_WRAP.md) with strict inner overflow/visibility tests. P003 PROPOSED ONLY, no implementation. Whole Math CI for P002 was RUNNING when checked; do not claim PASS. Gate②/③ remain open, main untouched.

## 2026-10-22 P-003 verified checkpoint — STOP; P-004 proposal-only
**Exact P-003 CSS+test SHA:** `98de588ec8950b62b745aa397bc7d94a3276799e`.
- Approval: P-003 exact user 「承認する。」 **APPROVED** (no release rights).
- CSS scope: removed P-002 mistaken pseudo design; canonical formula button JSX/style unchanged; P-003 mobile two-row only. **IMPLEMENTED IN DRAFT**.
- [Review Preview #39642196191](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191): code-check job PASS, real-screen job **FAIL**: marked Q10 320px first state requires 216px but formula `clientWidth=213`, even after allowed side padding zero. Other 5 real reviewed/normal 320/390/1440 cases PASS; none provides Gate① approval.
- [Raw real screenshot artifact](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191/artifacts/12364463820) retains 320 normal, 390/1440 regular/review screenshots; failed marked-review 320 state assertion logs exist, but its image was NOT committed/retained in this artifact. Do not re-label normal320 as failing marked320.
- [Repository governance #39642196256](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196256) SUCCESS; [math practice #39642196216](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196216) SUCCESS. Full Math Textbook #39642196185 was **still IN PROGRESS at this checkpoint**, not claimed PASS.
- Outcome: **FAILED-VERIFICATION (P-003 review mobile)**; W-MATH-018 returns **REVISE-PROPOSAL**, exact new P-004 awaiting user approval. Keep P-003 content/math approval and previous block Gate① acceptances. Gate① Q10 not ready; Gate② and Gate③ not accepted; no main/Pages/host.

## 2026-10-22 P-004 exact-source verification and independent gate boundaries
- User exact P-004 approval: **APPROVED**; `src/review/review.css` Q10 yellow review frame only. Learner source math, original Q10 3 logical lines / 1 explanation / 5 decisions, wrong keys, N14 revision7 selective archive all **unchanged**.
- Tested source full SHA `f058ec38a6e21f2925fc4535c34d0c741f356046` (not the screenshot-only branch head `044525020a58394361f2fb0a3be711b617b781a5`). [Real screenshot/E2E run #39643764980](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764980) **SUCCESS**. Six valid tests: actual learner Q01→Q11 and numbered reviewer at 320/390/1440; inner scrollWidth <= clientWidth+1; all 6 formula parts in bounds; original blue「選択」/red「×」; canonical button size, focus/keyboard; 5 answers, wrong/hint/retry, explanation timing; mobile two visible rows / desktop one.
- [Math Textbook Full CI #39643764939](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764939) **SUCCESS**, [Math Practice #39643765326](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643765326) **SUCCESS**, [Repository Governance #39643764970](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764970) **SUCCESS**. Previously accepted N11/N14 and protected Physics/Math practice regression covered. Source teacher OMML still UNVERIFIED; separate N14 Q14/Q15 remain OPEN.
- Actual GitHub screenshot storage commit `044525020a58394361f2fb0a3be711b617b781a5`; [correct P004 Gate① sheet](./GATE1_P004_N14_Q10_REVIEW_SHEET.md) binds three annotated photo states to source `f058ec38a6e21f2925fc4535c34d0c741f356046`. [GitHub comment mirror](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107#issuecomment-6322494573). **Gate① SCREENSHOT READY, user `細部OK` / `要修正` PENDING — do not infer acceptance**.
- **Gate② global independent cross audit OPEN**, with separate source Word and sibling findings. **Gate③ FINAL-REVIEW-NOT-READY**, no verified exact-SHA hosted playable full app or user `総チェックOK`. PR #107 remains Draft/unmerged; main and public app untouched.

## 2026-10-22 bounded contextual review outcome
User literal **「对对对，可以的继续」** after requesting only the concise mathematical representation of N14 Q10, after authentic app screens had already been displayed earlier in the conversation. Mark only the compact formula visual/layout accepted by the user; do not invent separate inspection of each screenshot. Gate② independent cross-audit OPEN; Gate③ and public release NOT ACCEPTED.
