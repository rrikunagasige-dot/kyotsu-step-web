# W-MATH-023 — N13 Q05/Q08 完成式の一括選択・ヒント先出し
Status: VERIFYING
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正 (linked to W-MATH-022 §12B impact audit)

## 2026-10-22 JST — Q08 Gate① ACCEPTED (verbatim user response)
- Immediately after the frozen genuine Q08 numbered sheet with checks ①–③ and a direct request for 「細部OK」/「要修正」, the user replied **「いいよ続けて」** (verbatim). This is an affirmative response to that *specific* Q08 two-root visual review, not a literal quoted 「細部OK」 and not a global app sign-off. Record Q08 **BLOCK-VISUAL-OK** only (source SHA `f5c0b2934ae1682a63f36401386d4bb24084c06a`; immutable evidence commit `43fb15e835c008d69cc5606612dbd26bbbc28185`; IDs `n13-wm023-q08-branches`, `n13-wm023-q08-positive-root`, `n13-08`). Q05 was previously user accepted and stays protected.
- Canonical §12A requirement: Q08 review target state is changed `awaiting-user`→`accepted`, so confirmed ①–③ markers will be hidden in subsequent preview. The 15 genuine old-screen screenshots and existing Work histories stay intact, not falsified/re-captured. Source answer choices, progression, stable IDs, figure hashes and student lessons are **unchanged**. Dedicated Q08 screenshot workflow is disabled after acceptance to prevent screenshot/provenance overwrite; the frozen before-acceptance evidence remains available.
- **Scoped Gate② impact audit has now found a confirmed same-root sibling at N05 Q18** where wrong-only hint directly gives r=−1,s=3 (exact target factors). Proposal-only [W-MATH-024/P-001](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-024-n05-q18-hint-leak-proposal-20261022/work/items/W-MATH-024-n05-q18-hint-leak/PROPOSAL_P001.md) is unapproved/unimplemented. W-MATH-023 cross audit must remain **NOT CROSS-VERIFIED** until the approved related fix and §12B second pass. See [audit ledger](./CROSS_BLOCK_AUDIT_20261022.md).
- The all-green predecessor SHA `9816954b94593389fd6e92bed47dede35621eee2` remains exact testing evidence of Q05/Q08 authored lesson before this review-marker-only change. Current review-marker-head requires its own native CI results and **must not be claimed tested in advance**. Q16 W-MATH-022 separate Gate① remains pending; Gate③ FINAL-REVIEW-NOT-READY. No main merge, Pages/Vercel hosting or fee authorized.

## 2026-10-22 JST — historical technical PASS for W-MATH-023/P-002 (human Q08 Gate① remains pending)
- **Exact all-green full-suite SHA:** `9816954b94593389fd6e92bed47dede35621eee2`. Independent GitHub workflows all SUCCESS at this very SHA: [Math textbook CI #39786779525](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39786779525) (27/27 job steps PASS, 229/229 Vitest, N04–N14 134 actions, source-repair 320/390, set keyboard history, physics and practice regressions), [Math practice #39786779552](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39786779552), [Governance #39786779527](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39786779527), [Review Code #39786779528](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39786779528).
- Full CI at earlier SHA failed on historical P-004-R5 two-line Q08 assertion; now corrected only that scenario (Q08 n13-08 is a one-root decision) while retaining original historical tests for N06/N08. Unrelated math-set keyboard history accessibility test failed once, but **passed on both mobile and desktop in latest exact all-green run**; math-set learner/code/test itself was not modified. Do not claim a separate permanent underlying defect was fixed or proven.
- **Actual Q08 visual capture source SHA** `f5c0b2934ae1682a63f36401386d4bb24084c06a`, [authentic Chrome screenshot run #39782844611](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39782844611), immutable correct-folder 15-image commit `43fb15e835c008d69cc5606612dbd26bbbc28185`. GitHub independently verified that Q08 authored source, selective migration, review targets, CSS, and dedicated Q08 Chrome test are byte-identical between image source SHA and all-green CI SHA `9816954b...` (only test/docs/evidence changed).
- **Q05 user Gate① accepted**, original unchanged accepted-source SHA `c911529360f070a5b6ddb6cf2a104eabe4abd708`. **Q08 user Gate① remains BLOCK-CHECK-PENDING**: correct genuine numbered [Q08 Gate① sheet](./GATE1_N13_Q08_REVIEW_SHEET.md) awaits explicit `細部OK` or `要修正`. Do NOT mark `CROSS-VERIFIED`/Gate② or `FINAL-APP-ACCEPTED`/Gate③. W-MATH-022 N14 Q16 human Gate① separately pending; no main merge, deployment, user whole-app playthrough or costs.
- This checkpoint overrides older historical sections reporting CI IN_PROGRESS/FAIL or Stage B NOT STARTED. Those are preserved for provenance.

## CURRENT historical checkpoint 2026-10-22 — Q05 Gate① accepted; Q08 Stage B coded+photographed, Q08 Gate① pending
- **W-MATH-023 Status: VERIFYING**, P-002 approved. User's verbatim 「いいよ続けて。因みに今どこまで進んでいる？」 accepted Q05 authentic two-point visual; **Q05 BLOCK-VISUAL-OK**. Q05 accepted source `c911529360f070a5b6ddb6cf2a104eabe4abd708`, immutable images `913a7b0d6ce165f910c85bb3498fb5a9921c6a7d`. Never re-request Q05 acceptance.
- Stage B **Q08-only**: N13 rev3→4 (9 original Word markers; 10→12 graded steps), three meaningful choices: ± branches, positive root, negative root. Preserve Q05 blocks exactly, archive3, clear only old bundled Q08 active answer. **Learner code and actual Chrome tested SHA `f5c0b2934ae1682a63f36401386d4bb24084c06a`**, authentic corrected 320/390/1440 screenshots in immutable commit `43fb15e835c008d69cc5606612dbd26bbbc28185` — [Q08 Gate① numbered review](./GATE1_N13_Q08_REVIEW_SHEET.md). **Q08 Gate① user response NOT YET RECEIVED: BLOCK-CHECK-PENDING**.
- Dedicated Q08 Chromium screenshot job **39782844611** SUCCESS and corrected-path job **39782844611** SUCCESS; correct 15 images source SHA and Noto CJK JP verified. Whole work governance and review CI success at checked SHA. Math textbook complete CI **39783808307** failed on R5 obsolete Q08 two-line Playwright assertion and unrelated math-set keyboard toggle; obsolete Q08 expectation now repaired in test file only, rerun on later SHA **39785732319** pending (no PASS claim). Historical Stage A v3 test fixture idempotence fixed; 229 unit tests then passed.
- W-MATH-022 N14 Q16 separate Gate① still pending. Q08 Gate②/whole-app Gate③ not started; no main merge, production hosting, release or paid services. All lower sections describing proposal-only or Q05 pending are historical and superseded here.

## Historical checkpoint — 2026-10-22 JST, Q05 Stage A tech PASS / human Gate① pending
- **Status: VERIFYING, BLOCK-CHECK-PENDING**; the student-facing Stage A N13 Q05 is coded at source SHA `c911529360f070a5b6ddb6cf2a104eabe4abd708`, not merged. Q08 Stage B **not started**.
- Native math textbook CI #39777436006, math practice #39777435983, governance #39777435948, review preview + real Chrome #39777436057 all SUCCESS on that exact SHA.
- Initial images showed square placeholders for Japanese. GitHub Actions screenshot font setup was corrected to Noto CJK JP; reproduced 320/390/1440 screenshots in storage commit `913a7b0d6ce165f910c85bb3498fb5a9921c6a7d`, source code unchanged. Verified screenshot images directly; see [Q05 numbered Gate① sheet](./GATE1_N13_Q05_REVIEW_SHEET.md).
- **Human `細部OK` has NOT been received**. Gate② and Gate③ uncompleted. W-MATH-022 N14 Q16 separately remains Gate① pending. No merge, release, hosting, or costs authorized.
- The sections below are historical snapshots; assertions that code remains proposal-only or CI pending were superseded by the checkpoint above.

## Exact authority and current status
- Origin: W-MATH-022 `IMPACT_AUDIT_PRESCREEN_20261022.md`, confirmed sibling F-022-S1/F-022-S2.
- Original teacher Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`, N13 Q05 paragraph 557, Q08 paragraph 566.
- Source N13 code blob `58d1f6d1172dc216dd6417adf2a276b40163423e` on parent W-MATH-021 and frozen W-MATH-022; existing N13 revision=2 and prior R5 N13 Q08 migration are protected.
- Branch from W-MATH-021 HEAD `1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8` — documents/proposal only, no N13 code edits.
- W-MATH-022 Q16 Gate① user visual acceptance still pending. This new Work does **not** skip that human gate.

## Purpose
Proposal-only linked corrections for **two independently reviewed N13 source questions**, restoring the student operations the teacher Word asks. Per-block Gate① must be separate: P-002 proposes Q05 only at revision3, and Q08 only after Q05's user Gate① at revision4. Neither stage implemented; revised P-002 remains unapproved.

## Protected boundary
Never edit N14 Q10/Q14/Q15/Q16 or accepted revisions/4-step hints, N13 Q01–04/Q06–07/Q09, original Word and N13 figures n13-f01/n13-f02, common makeReviewSteps, renderer, other modes, main/release/hosting. Do not merge or open production URLs.

## Proposal
See `PROPOSAL.md` — **P-002**, correcting the prior contradictory stage/revision assumptions. Historical unapproved P-001 retained verbatim in `PROPOSAL_P001_HISTORICAL.md`. **P-002 approved for staged implementation by direct user 「いいよ続けて」 after exact P-002 approval question; Stage A Q05 implementing. Stage B Q08 still BLOCKED by Q05 user Gate①.**

## Next authorized action
Stage A scoped Q05 revision2→3 is implemented in isolated branch, CI and genuine screenshot Gate① in progress. Stage B Q08 MUST wait for Q05 user 細部OK. No merge/release/hosting. W-MATH-022 Q16 Gate① still awaits user 細部OK.
