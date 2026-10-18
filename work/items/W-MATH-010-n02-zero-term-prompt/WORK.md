# W-MATH-010 — N02 欠けた一次項と係数の言い方

Status: VERIFYING
Updated: 2026-10-18
Command: CMD-WORK-001 修正
Parent: W-MATH-008/P-001 impact audit
Base: main 5c4b4979dbae5329de93d71fce33c115d0f0348d

## Objective
N02-Q05で係数0と項0xの区別を説明と回答穴で一致させる。

## Authority
governance/WORK_SYSTEM.md, subjects/mathematics/textbook/SPEC.md, docs/MASTER_APP_LESSONS.md; N02 source SHA 47a0a7508f2ff4fa6599497d2a92ef59046e41af.

## Branch
fix/w-math-010-n02-zero-term-prompt — merged as PR #90, main 1f3ea4d18d3f13b9ee0e2125e2d26190e5a5e2ec

## Scope
P-001 implemented only N02-Q05 prompt/after-answer clarification and focused regression tests; original 12 IDs and answer keys unchanged.

## Do Not Touch
N02 change was approved before implementation; no N09/N12 learner lesson or Constitution change is part of this correction.

## Approved Proposal
P-001 approved 2026-10-18 by 「いいよ」 replying directly to the explicit two-proposal request W-MATH-009/P-001 and W-MATH-010/P-001.

## Current Step
PR #90 merged after new combined N02+N09 math CI and governance PASS; GitHub Pages publication and user hands-on QA are tracked separately.

## Next Step
Verify Pages deployment #39119967626 and ask user to confirm N02 Q05 wording/0x after-answer explanation in the published app.

## Dependencies
N12 correction acceptance and W-MATH-009 linked audit review.

## Completion Condition
Branch implementation and merge verified; pedagogical DONE still requires published UI user acceptance and lesson-memory close.
