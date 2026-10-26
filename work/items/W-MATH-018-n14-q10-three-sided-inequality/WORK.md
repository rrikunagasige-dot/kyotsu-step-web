# W-MATH-018 — N14 Q10 三辺同時の式変形
Status: VERIFYING — N14 Q10 user-chosen concise layout accepted, Gate② open
Updated: 2026-10-22 JST

## Objective
Fix same-root operation+already-completed-result error under existing N14 Q10 only, respecting prior approved N14 blocks.

## Authority
CONSTITUTION, CMD-WORK-001 修正, WORK_SYSTEM §§12A/12B, MASTER_APP_LESSONS, Math Textbook SPEC and W-MATH-017 sibling audit. Indexed original Word N14 Q10 prompt consulted, maths OOXML raw-byte reinspection UNVERIFIED.

## Branch
Proposal-only file carried in W-MATH-017 Draft PR #107 branch. N14 code NOT edited; main unchanged.

## Scope and Approved Proposal
[Exact P001](./PROPOSAL.md) is awaiting user approval, not implemented. 3 formula rows + 1 interleaved explanation + 5 local holes within original source Q10; revision6→7 selective archive planned.

## Do Not Touch
N14 Q07/Q08/Q12 previous accepted changes, Q09/Q11, Q14/Q15 (separate candidates), original figure, N11 accepted content, other units/subjects/modes, original Word, common renderer or CSS, main/Pages/cost-bearing hosting.

## Current Step and Next
Present exact P001 and STOP before editing N14 Q10 until direct unchanged user approval. Future Gate① real SHA screenshot, independent Gate② and whole-app Gate③ remain independent.

## Dependencies and Completion Condition
Prior W-MATH-017 P008 small-block user accepted; full math CI 39611931626 SUCCESS after narrow older-test fix. Completion requires explicit proposal approval, source-only correction and verification; no main/publication permissions granted.

## 2026-10-22 exact approval and execution
- User: 「続けて」 directly after full P-001, treated as approval to execute exactly this N14 Q10 correction. Live main/head, instructions, prior approved N14 Q07/Q08/Q12 and 16-source map rechecked. Implement only Q10 3 equations, 1 explanatory paragraph, 5 choice holes; N14 revision7 selective archived migration. CI and real screenshot Gate① pending; no main merge.


## 2026-10-22 — P001 visual FAIL, exact P002 proposal required
- Real Chromium screenshot run [39629959612](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39629959612) succeeded in capturing actual Q10, but **actual normal 320/390px screenshots are clipped**: rightmost 5+unfinished selection control hidden/partially hidden. Test originally checked page-level not formula-inner overflow.
- Recorded images, exact learner source SHA e1e913f2230c42175bc5e67a53e726d030752634, blocker and root cause in [P001_GATE1_VISUAL_DEFECT.md](./P001_GATE1_VISUAL_DEFECT.md). Gate① USER CHECK NOT READY. No main merge.
- [P002 compact mobile inline holes](./PROPOSAL_P002_MOBILE_INLINE_HOLES.md) proposal ONLY; no CSS/learner code changes until new exact user approval. Existing P001 mathematics+v7 archived history remain implemented, not accepted visually.
- Full math CI [39629959584](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39629959584) failed 6 N14 Q07/Q08/Q12 historical browser cases still expecting rev6/Q12 old index. Test-only update commit 0b63f8a1fc9b6d70d8ce6c0f90732345d431e8a9 preserves their real learner content. Retest pending; previous complete unit tests/schema, desktop/mobile smoke and N12 tests PASS.


## 2026-10-22 — P002 exact user authorization and minimal implementation
- User replied 「続けて」 immediately to [P002 mobile-only 320/390 clipping proposal](./PROPOSAL_P002_MOBILE_INLINE_HOLES.md), approving precisely this responsive layout repair; NOT P001 visual Gate① nor full release.
- CSS only adds a max-width:430px rule targeting derivationId `n14-q10-chain`: in-unanswered-hole visual `□`, wrong `↻`, min 2rem × 34px, text/answer unchanged, .9rem equation and minimal gap; 1440 and other N units untouched.
- Test now measures the **inner three-sided formula row's own scrollWidth/clientWidth and every actual hole bounding rect** at 320/390, wrong/restore/resolve in both true learner route and review mode. Original clipped P001 images in `evidence/p001-gate1` preserved; new P002 evidence goes to `evidence/p002-gate1` and carries exact SHA. Gate① pending until genuine PASS and human visual confirmation. Other gates unchanged.


## 2026-10-22 — user challenged P002 different hole design; new P003 proposal pending
- User said 「いいけど、穴のデザインが前と違うじゃない？　続けて」. Under CMD-WORK-001, conditional feedback changes the exact styling proposal, so NOT approval of P002's `□/↻` approach. Work returns to REVISE-PROPOSAL.
- Audited actual `TextbookFormula.tsx`: canonical `button.reading-formula-choice` displays blue `選択` and red `×` after wrong, unlike P002's proposed pseudo `□/↻`; P002 CSS targeted `reading-inline-blank` (wrong component), so compact label was ineffective. Real screenshot #39634288270 FAIL: formula scroll width300, client widths213/241 at 320 and 283 at 390. Gate① Q10 not ready.
- Prepared [P003 exact proposal](./PROPOSAL_P003_CANONICAL_CHOICES_WRAP.md): preserve exact established blue/red button design and use Q10-only mobile CSS grid to wrap the second equation into two **visual** lines, still 3 logical equations + 1 explanation and 5 decisions. **NO P003 code change authorized**, main not merged, previous approved content protected.

## 2026-10-22 — P-003 expressly approved; failed review-only 320px fit; P-004 awaits approval
- The user replied **「承認する。」** directly to full W-MATH-018/P-003. Existing canonical blue 「選択」/red 「×」 buttons and original formula math remain protected.
- CSS only in `src/styles/global.css`: removed ineffective P-002 selectors; Q10 `n14-formula-10` alone becomes a two-visual-line grid at <=430px, full-size controls untouched. Allowed equation-only side padding reduced to zero after first measured 3px overflow. E2E checks now measure all six child rectangles and canonical choice states at 320/390/1440.
- Actual Chromium review screenshot workflow [#39642196191](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191) on code SHA `98de588ec8950b62b745aa397bc7d94a3276799e`: **5 PASS, 1 FAIL**, the marked 320px review Q10 first-step `scrollWidth=216` vs `clientWidth=213`. Normal N14 320/390 and reviewer390/desktop1440 PASS. No P-003 Gate① user request or acceptance.
- Root isolated to additional review-only `review-marked-block` border/padding in `src/review/review.css`. Do NOT alter canonical buttons or shrink math to mask overflow. By P-003's explicit stop rule, return to `REVISE-PROPOSAL`.
- New [P-004 exact review-frame proposal](./PROPOSAL_P004_Q10_REVIEW_FRAME_MOBILE_FIT.md) is **PROPOSED ONLY**. `src/review/review.css` must remain untouched until its separate explicit approval. Main/Pages unchanged; Gate②/③ open.

## 2026-10-22 — P-004 exact approval, implementation preflight
- User direct reply **「承認」** to the exact P-004 review-frame-only proposal. Proceed under CMD-WORK-001 and WORK_SYSTEM §12A/B without reapproving prior accepted N11/N14 blocks.
- Scope locked to one learner-independent code file `src/review/review.css`: at mobile <=430px, ONLY `[data-testid="review-mark-n14-formula-10"]` padding-inline `.65rem`→`.4rem`. No learner CSS, formula buttons, source/data, answers, archive, other review marks, main or public app edits.
- Upon implementation, require authentic 320/390/1440 Chromium review and normal route, exact tested SHA, existing full CI and mobile cross-surface regression. If true 320px marked review still fails, STOP and enter REVISE-PROPOSAL; do not automatically adjust other wrappers/controls.
- Gate① Q10 screenshot+user `細部OK` still pending; Gate② and Gate③ independent.

## 2026-10-22 — P-004 tested CSS and Gate① image handoff
- User explicitly approved P-004. Scoped code commit `f058ec38a6e21f2925fc4535c34d0c741f356046` changes ONLY `src/review/review.css` in learner-visible source files, plus exact approval/Work records. Existing N14-Q10 math/answers/IDs/revision7 and all prior approvals unaffected.
- [Authentic review+normal screenshot Action #39643764980](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764980) **SUCCESS** at SHA `f058ec38a6e21f2925fc4535c34d0c741f356046`: 320/390/1440 all **six** E2E scenarios PASS, including 320 numbered view previous failure, literal original blue「選択」/red「×」, six formula parts, two-visual-row mobile / one-row desktop, five decisions, hints, wrong/retry, keyboard focus/activation and normal Q01→Q11. Screenshot-only commit `044525020a58394361f2fb0a3be711b617b781a5`.
- [Full Math Textbook CI #39643764939](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764939) **SUCCESS**, [Math Practice #39643765326](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643765326) **SUCCESS**, [Governance #39643764970](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764970) **SUCCESS**.
- P-004 [GitHub Gate① N14 Q10 true-image sheet](./GATE1_P004_N14_Q10_REVIEW_SHEET.md) and [PR conversation mirror](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107#issuecomment-6322494573). **USER `細部OK` or `要修正` PENDING.** Previously accepted N11/N14 screenshots must not be reapproved; Gate② and Gate③ remain separate, no main/Pages/release.

## 2026-10-22 — N14 Q10 concise visual approval and continuation
User explicitly asked to see ONLY the compact three-equation/two-visual-middle-row mathematical layout instead of a repeated screenshot gallery, following earlier source-matched genuine app screenshots in ChatGPT. On seeing that exact concise layout, the user replied **「对对对，可以的继续」**.
This accepts the N14 Q10 **concise mathematical layout and move-on decision** (BLOCK-VISUAL-OK for the user-selected representation), not a separate claim that the user inspected every 320/390/1440 screenshot. Genuine source-matched screenshot evidence remains GitHub Action #39643764980, target SHA f058ec38a6e21f2925fc4535c34d0c741f356046.
Prior N11/N14 acceptances are retained. Gate② independent wider audit remains OPEN; N14 Q14/Q15 same-root candidates require separate proposals and approval. Gate③ user whole-app play and release permission are NOT given. No production main/pages changes.
