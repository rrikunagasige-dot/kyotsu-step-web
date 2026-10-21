# W-MATH-013 — N11-Q14 同類項整理の3段階導出を復元する修正
Status: VERIFYING
Updated: 2026-10-21

## Objective
既存数学教科書モード N11 原Word Q14「同類項を整理して解こう」の非自明な操作を、生徒が段階的に答えられるようにする。既存の最終Q14正答/誤答を保持し、**1原問に2つの式中穴を追加するだけ**の修正を提案。

## Authority
- Root `governance/CONSTITUTION.md`, `governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-001「修正」, `governance/WORK_SYSTEM.md` §§11,12A,12B,12C.
- `docs/MASTER_APP_LESSONS.md` §§7–8, 11–12,18,20,51–53; `subjects/mathematics/textbook/SPEC.md` §§5–8.
- W-MATH-011 Gate② source/impact [five-question ledger](../W-MATH-011-n11-inequality-derivation-correction/CROSS_BLOCK_AUDIT_N11_N14_FOLLOWUP_20261021.md), N11 Q11 proven pattern W-MATH-012/P-001.
- User-provided teacher-edited `01_数と式_教科書モード_対話段階導入版_v2`; N11-Q13→Q14; 212863 B / source SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`. Official answer booklet not supplied.

## Branch / verified checkpoint
- Audit/creation parent: PR #101, branch `work/W-MATH-003-p003-r1-n04-n14-batch-20261019`, full head SHA `763c751af79f366b0b34af944444d8be8f482151` (only docs added on previous frozen learner-code SHA).
- **Proposal-only isolated branch:** `proposal/W-MATH-013-n11-q14-derivation-20261021`, parent identical to above. No learner/CI/hosting modifications permitted at proposal stage.
- Last tested N11 learner-code SHA from W-MATH-012: `74b73ad275b8aced7ccf99c3ef0ffc943f02d208`; earlier 18 real Q11 screenshot evidence remains valid for unchanged source.
- Current `main` is separate governance-only W-GOV-009 merge, and PR #101 is Draft/unmerged. Do not silently merge either feature branch.

## Scope
**Exactly N11-Q14 one teacher-source problem.** Two new user decisions before original stable item `n11-14`. Add source map only for N11-Q14, preserve 14 source labels. Require selective N11 revision 5→6 with all old answers and completedAt history archived, no global reset. Related unit/renderer tests and screenshot evidence **only after separate implementation approval**.

## Do Not Touch
Original DOCX, N11 Q01–Q13 answers/reading/figures/progress (including accepted Q01–Q04/Q11), Q14 existing `n11-14` key/distractors, N12/N14 units, original PNG bytes, Math Practice, Physics, master lessons, mode SPEC, shared global renderer/schema unless separately re-proposed, CI/deploy config, billing, `main`/GitHub Pages/Vercel/public release.

## Approved Proposal
**W-MATH-013/P-001 exact isolated implementation APPROVED** by user 「承認します。」 after complete Proposal. No main merge or deployment approval.

## Current Step
Complete source-grounded small-block design, mathematical/distractor checks, strict migration and verification contract; present the whole P-001 to user for exact implementation approval.

## Next Step
Wait for user to approve the displayed **full P-001**. On approval, implement on a safe isolated branch with SHA lease, conduct unit/math/UX/E2E/progress regression and genuine GitHub Gate①, then replay §12B Gate②. Do not treat designing as having passed Gate①/②/③.

## Dependencies
N11 Q11 v5 approved visual review; N11 Q12 R1 NOT-AFFECTED; N14 Q07/Q08/Q12 open separate corrections, not bundled. Existing PR #101 should remain review-only and unmerged until separate authorization.

## Completion Condition
Only scoped approved and tested code + 320/390 actual images + explicit new Q14 Gate① + independent Gate② replay and closure of linked defects. Entire-app Gate③ separate.

## 2026-10-21 approved implementation snapshot
- User implementation approval: 「承認します。」 in direct answer to finished P-001, after prior drafting-only instruction.
- Isolated work branch `work/W-MATH-013-n11-q14-derivation-20261021`, based on Proposal commit `472063abfe4d6af5b8d487a37d040812cd12259c`.
- Bounded source/test code commit `b22db8b3f5cf08bca1c2f48d0d086c5ae41dad47`; no main/PR #101 integration, UI helper/asset/master changes.
- Next: run actual PR CI, inspect real browser wrong/hint/retry and 320/390 screenshots, present new Q14-only GitHub Gate①. Status VERIFYING not DONE; global Gate② remains blocked by separate N14 Q07/Q08/Q12.


## 2026-10-21 Gate① ready; preserve approval boundary
- Implementation/QA on isolated feature branch passed: [Math CI #39532210400](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39532210400) SUCCESS (code `a06c8f2e8353b9a7a1e6f4f304e8e45d1a546c4a`); internal PR #103 merged to **review-only PR #101 branch**, code SHA `91a7c7ee74ceab747079b27089271b1c65e5f65f`.
- Review-branch [Math CI #39533384786](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39533384786) SUCCESS for merge code SHA; [real app capture #39533380704](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39533380704) SUCCESS. Actual 18 files saved by screenshot-only commit `f44a8a0017429370194e048fb16cf56902a947eb` (no learner source edits).
- [Gate① Q14 18-image review sheet](./GATE1_N11_Q14_REVIEW_SHEET.md): **BLOCK-CHECK-PENDING for the user's Q14-only visual check**. Q01–Q04/Q11 earlier Gate① approvals remain accepted. Gate② N14 Q07/Q08/Q12 separate issues; Gate③ NOT READY.
- Historical 'Current Step' / 'Next Step' above are snapshots before user approval and now superseded by this latest checkpoint. No `main` merge or app publication.

## 2026-10-21 Gate① user decision and return point
User responded **「おけ続けて」** directly to Q14 18-image Gate① review and invitation for Q14 細部OK: **N11 Q14 BLOCK-VISUAL-OK** at source SHA `91a7c7ee74ceab747079b27089271b1c65e5f65f`. N11 Q01–Q04/Q11 accepted checkpoints retained. Current Work remains **VERIFYING** (global Gate② N14 Q07/Q08/Q12 unclosed and Gate③ not ready). Resume §12B correction queue: N14 Q07 independent R2 proof-bridge proposal. No `main` merge, public release, or other unit code changes authorized.
