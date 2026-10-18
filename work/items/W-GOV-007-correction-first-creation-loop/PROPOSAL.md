# W-GOV-007 / P-001 — CMD-WORK-001 ↔ CMD-WORK-002 common correction-first loop
Status: APPROVED for isolated governance documentation implementation
Date: 2026-10-18 JST
Repo: rrikunagasige-dot/kyotsu-step-web (ID 1391122224)
Base live main: b8e7f087756a0d819abe65f69ca13d03a9fb47fb
Branch: work/W-GOV-007-correction-first-cross-creation-20261018

## User need
During a correction of previously approved creation outputs, scan other approved creations for same root-cause error. If confirmed, trigger further CMD-WORK-001 correction and repeat until closed. Deduplicate/consolidate the lessons shared by creation and correction; before starting creation, clear earlier correction requests first. Suspend the existing N04–N14 creation while switching to correction.

## Exact proposal presented and approved
1. Correction-first preflight before any new/resumed creation: inventory open user correction requests and approved correction Works, route correction before creation.
2. Within correction: root cause and impact criteria → audit other approved creations (published and review-only) → record checked/not affected/unverifiable targets; if sibling defect is confirmed, a linked correction requires its own applicable exact approval.
3. Iterate until no linked applicable defects remain; prevent duplicate/cyclic rechecking by root cause, artifact, revision; no blind cross-mode mass modifications.
4. Only after full verification and necessary user acceptance, merge general lessons into one common canon, leave special mode rules in place and skip already-integrated identical lessons; historical evidence remains.
5. Recheck pending corrections and revised lessons before returning to a paused approved creation; material design changes use REVISE-PROPOSAL. Preserve existing approvals and independent main/Pages release gate.
6. Edit INSTRUCTION_DICTIONARY, WORK_SYSTEM, COMMAND_WORDS, MASTER_APP_LESSONS and necessary memory/LESSONS pointers. Constitution, app code, other mode data and P-003 implementation are excluded.

## Approval evidence
User asked the addition and was presented with a complete five-target plan and rule A–D plus a dependency loop. Immediately replied 「いいよ」 2026-10-18. No changes or conditions to the proposal. Approval is for documentation-only implementation, not main merge/Pages or a particular math UI fix.

## Design decision: one canonical owner
WORK_SYSTEM §12B owns the full procedural rules. COMMAND_WORDS and INSTRUCTION_DICTIONARY route/guard; MASTER_APP_LESSONS §51 holds one reusable lesson; memory/LESSONS entries only point/condense. Existing math rendering surface checks and master §48 remain intact and are reused, not recopied. No formal Work status added.

## Risks/verification
Findings that resemble a bug but have different causes; unapproved scope expansion; stale correction records; duplicate lessons; wrong assumptions that QA means user acceptance; blocking creation endlessly without an actionable correction plan. Confirm entry/exit cases, exact approval gates, no Constitution/app changes and a successful governance check. Stop on authorization blockers.
