# W-MATH-018 — N14 Q10 三辺同時の式変形
Status: IMPLEMENTING
Updated: 2026-10-21 JST

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
