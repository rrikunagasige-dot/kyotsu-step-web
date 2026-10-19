# W-MATH-003/P-003-R1 — Gate② 横断監査（既存 W-GOV-008/P-003 様式）

Status: **IN-PROGRESS** — **NOT CROSS-VERIFIED**  
Work / approved scope: W-MATH-003 / P-001 + 承認済み P-003-R1（一括8単元）  
Audit target (exact full branch SHA before this evidence-only record): `71c650c3167aae5bab1ca288feb7b1dbb53469da`  
App code / full 127-operations test source SHA: `aa1c6a748665f34462a08c2b4a1641d5164d5e92` (the later head updates Work documentation only)  
Baseline live main: `537c3cbf28d40f45228d8a0c4bdd20327136aa93`  
Date: 2026-10-19 JST / Auditor: ChatGPT  
Modes / units: 数学・教科書 N04,N05,N06,N07,N08,N11,N13,N14 (original Word markers 123; guided operations 127).  
Previously accepted blocks: N01,N02,N03,N09,N10,N12; user accepted consolidated authentic screenshot Gate① for all new eight with 「結構いいぞ。承認する！」. `BLOCK-VISUAL-OK` only, not app-wide acceptance.

## Confirmed evidence

- [Latest math-textbook Actions #39256098487](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39256098487): SUCCESS at exact audit head `71c650...`. Steps: typecheck, selected eslint, textbook Vitest, build, original 127-choice batch E2E on `mobile-chromium` and `desktop-chromium`, N01/N03/N12/N02/N09 regressions, Physics textbook, Math practice setup.
- [Latest governance Actions #39256098473](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39256098473): SUCCESS. [Review code check #39256098569](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39256098569): SUCCESS; its browser/screenshot steps are SKIPPED, so its SUCCESS alone is **not** new visual E2E evidence.
- `src/data/textbook/math/numbers/newBatchCoverage.test.ts`: all sequential 123 *authored mapping keys* and 127 item IDs, four unique choices/item, unique answer/KaTeX, nine unchanged original PNG SHA-256, figure-block positions. These assertions **do not compare the entire text of 123 questions against independently re-read Word or independently solve all 123 equations**.
- `e2e/new-batch-walkthrough.spec.ts`: all 127 correct choices on Pixel-7-device and desktop Chromium, completion, no `.katex-error`, image decodes, horizontal overflow check, saved completion after reload; not the wrong/retry branches. Playwright config uses Pixel 7 and desktop width 1440, **not explicit 320 px and 390 px for these eight units**.
- [Authentic 8-unit screenshot gallery](./evidence/n04-n14-gallery/README.md): 66 real app views on smartphone/desktop, numbered checking points and figure-stage screenshots.
- GitHub comparison `537c3cbf...` → `71c650c...`: 12 commits ahead/0 behind; existing six lesson source files are not changed; only eight new lessons/helper/tests/figures plus relevant catalog, review, CI, Work records.
- Source identity recorded in `SOURCE_OMML_AUDIT.md`: teacher-edited `01_数と式_教科書モード_対話段階導入版_v2`, 212863 B / SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`, 233 chapter markers, 14 embedded figures; separate official answer booklet unavailable. This record predates P-003-R1 and is **not** an independent full N04–N14 answer audit.
- During this audit, the exact `v2(2).docx` was located in the user's Library metadata (size 212863 B), but a page read failed with **403 Forbidden**; the source content was not obtained. Do not relabel unavailable access as source-read PASS.
- `P-003-R1_IMPLEMENTATION_RECORD.md` references `N04_N14_SOURCE_SOLUTION_AUDIT.md` and `N04_N14_LEARNER_DESIGN_MAP.md`; neither file exists in this Work directory at the audited head. Whether these exist outside the repository or were omitted remains **UNVERIFIED**, not a verified 123-answer proof.

## Audit ledger

| Required surface | Target | Result | Evidence and remaining gap |
| --- | --- | --- | --- |
| Original source/IDs/wording fidelity | N04–N14 123 source labels | **UNVERIFIED** | 123 ID positions PASS in `newBatchCoverage.test.ts`, original figure SHA PASS; full Word formula/wording cross-compare not repeatable here because source read returned 403 |
| Math chain and dependencies across blocks | Eight new lessons + three learner themes | **UNVERIFIED** | Catalog route and source mapping CI PASS; full source-to-derivation audit / inter-unit prerequisite reasoning not attached |
| Correct answers, choice types, missing-term representation | 127 authored decisions | **UNVERIFIED** | Exactly one authored key and four syntactically distinct KaTeX-valid choices per item PASS; no independent full 123-answer derivation artifact |
| Premature answers, hints, leakage | All new prose and gated figures | **UNVERIFIED** | Nine source-image placements and visible gates tested; no exhaustive pre-answer copy/hint leakage audit for 127 decisions |
| Figure/cell values/KaTeX and mobile visual fit | Nine original PNGs, 66 screenshots | **PASS for documented scope** | Original PNG hashes, all image loads, KaTeX and saved screenshots confirmed by current branch tests and gallery; small 320/390 widths audited separately below |
| Wrong/retry/correct sequence and chapter navigation | New guided steps + chapter setup | **UNVERIFIED** | All correct-path 127 selections and chapter navigation CI PASS; new eight-unit incorrect-choice/retry path not covered by `new-batch-walkthrough.spec.ts` |
| Shared UI and affected other subjects/modes | Existing six math units, Math Practice setup, Physics Textbook | **PASS for tested regressions** | No existing lesson sources changed in GitHub diff; N01/N03/N12, Math Practice setup and Physics textbook Actions steps passed. Physics Practice has no changed dependency shown in diff |
| Explicit phone 320/390 px and desktop | Eight new units | **UNVERIFIED** | Pixel 7 and 1440 desktop tested; distinct 320/390 new-unit runs absent from cited E2E |
| Learner progress persistence/reset and review isolation | Eight review-only IDs | **UNVERIFIED** | Reload persistence, `status:review` and cleared localStorage start PASS; independent 320/390 reset/cross-review isolation and hosted-user progress separation not proved |
| Prior corrections and accepted blocks | N01/N02/N03/N09/N10/N12 | **PASS for changed scope** | Their lesson files unchanged and related regression CI PASS. Accepted visual checks are not final hands-on acceptance |

## Correction-first / impact ledger

- Checked current Work and previous findings F-003/F-007/F-012/F-013/F-025/F-026: historical corrections resolved/accepted or separate closed scopes, not new user-app correction requests. The latest user's objection to mixing `作成` with `修正` is a **process explanation correction**; no code/Constitution/dictionary change has been authorized or made.
- **No new reproducible application defect confirmed** in this audit. Missing evidence is recorded as `UNVERIFIED`, not silently treated as PASS or used to justify changing approved learner content.
- Root-cause signature for the evidence gap: *source/independent answer artifact unavailable at this checkpoint*; related artifact: N04–N14 on `71c650...`; result `UNVERIFIED` (not `CONFIRMED` software defect).
- Additional correction Work / approvals: none opened or assumed; if a real source/content defect is confirmed later, route through exact `CMD-WORK-001` and W-GOV-007 §12B before any fix.
- Lessons: no new rule promoted; existing source-fidelity, test-evidence and permission-stop rules already cover the gap.

## Close criteria

- [ ] All required rows PASS (or justified NOT-APPLICABLE), no FAIL/UNVERIFIED
- [x] GitHub branch/code/CI and screenshot provenance tied to recorded 40-character SHAs
- [x] No new app-content change, merge, publication, Vercel modification or billing
- [x] User Gate① accepted as image-only, not final app-wide acceptance
- [ ] Prepare/freeze final candidate and verify **playable** app URL after Gate② closes

**Gate②: IN-PROGRESS / NOT CROSS-VERIFIED. Gate③: FINAL-REVIEW-NOT-READY.** The existing Vercel auto-PR preview's GitHub "Ready" comment does not establish that its URL is user-accessible or matches a tested candidate; prior Vercel access was 403. Do not substitute old main Pages or an image gallery for the app.


## 2026-10-20 addendum — source recovered, eight pedagogical defects confirmed

This appendix supersedes the older source-403 limitation and the older statement "No new reproducible application defect confirmed" **for the evidence now available**. Preserve prior observations as chronology rather than silently deleting them.

Source re-acquired: teacher-edited original Word, 212863 bytes, SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`; eight-unit original question markers 123; app authored operations 127. Full question/key inventory and the original nine figure mappings are now in [N04_N14_SOURCE_SOLUTION_AUDIT.md](./N04_N14_SOURCE_SOLUTION_AUDIT.md), commit `c89355b38d207ba5fb7055a97004337057bf8aa4`. This is a source-to-app cognitive-fidelity check, **not** an official-answer-booklet comparison or fully independent proof of all 123 keys.

| Required Gate② surface | Updated status | Evidence |
| --- | --- | --- |
| Source identity, question IDs, original PNG bytes | **PASS for identity/coverage** | Original Word SHA, 123 marker inventory, nine PNG SHA matches; question cognitive-fidelity separately FAIL |
| Source question/cognitive-operation fidelity | **FAIL** | N04-Q13, N05-Q17, N06-Q08, N07-Q06, N08-Q05, N11-Q05, N14-Q06, N14-Q11 |
| Mathematical key correctness/complete independent derivation | **UNVERIFIED** | Authored keys inventoried, no demonstrably false algebraic final key found in this comparison, official booklet absent; exhaustive independent solution/distractor proof not documented |
| Pre-answer leakage, decision timing | **FAIL** | N06-Q08, N07-Q06, N11-Q05, N14-Q06, N14-Q11; additional N14-Q05 risk pending assessment |
| Wrong/retry branch, 320px/390px, reset/isolation | **UNVERIFIED** | Existing E2E confirms correct paths only; no new runs claimed |
| Figure hashes and existing verified Pixel7/desktop snapshots | **PASS within prior tested scope** | Prior CI and 66 screenshots; does not imply 320/390 PASS |
| Previous math/physics regressions | **PASS within prior tested scope** | Prior CI unchanged; changes still need new regression after approved repair |

**Correction-first entry:** the eight confirmed pedagogical gaps are a correction queue under CMD-WORK-001 and WORK_SYSTEM §12B. Root-cause hypotheses: (a) original multi-operation question reduced to one answer choice (N04-Q13, N05-Q17, N08-Q05); (b) pre-answer lead gives away the learner decision (N06-Q08, N07-Q06, N11-Q05, N14-Q06, N14-Q11). Check all other approved creation artifacts for the same mechanisms, distinguishing true defects from intentional taught scaffolding. This diagnosis is **not** permission to edit those artifacts. The previously approved creation is paused at Gate② until the exact repair proposal is approved, repairs verified, and impact loop closed. Original Word, main, release/deployment, review statuses, stable progress and image bytes remain untouched.

**Current: Gate② FAILED-VERIFICATION / NOT CROSS-VERIFIED. Gate③ FINAL-REVIEW-NOT-READY.**
