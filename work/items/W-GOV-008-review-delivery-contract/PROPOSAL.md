# W-GOV-008 / P-001 — Typed Review Delivery Contract
Status: APPROVED FOR GOVERNANCE IMPLEMENTATION ONLY
Date: 2026-10-11

## Problem
Work W-MATH-002 PR #57 had passing code CI but no running UI preview. The prior agent offered an unapproved Windows launcher ZIP instead. Existing review-link rules do not distinguish review artifacts by type; plan omitted actual delivery method and CI did not verify a preview.

## Solution
1. Extend CMD-WORK-001 with type-specific review deliverables, retaining EXACT/SIMILAR/UNKNOWN commands and existing code-review fallback.
2. Add planning/task gate for real deliverables and permission boundaries to Work System and Change Protocol.
3. Extend Work/Proposal/Verification templates.
4. Add positive/negative record-policy tests and invoke in existing governance CI.
5. Capture correction as ERROR-PROCESS, ERROR-SPEC, ERROR-QA, plus reusable Lesson/Decision.
6. Define separate W-PREVIEW-001 *proposal-only* for choosing and approving preview implementation.

## Scope
Governance documents, Work templates, governance validator/tests/CI, new Work/memory records. Existing code/assets, main Pages, Constitution, GitHub Settings, other PRs are untouched.

## Review Delivery Contract
Review Type: CODE
Required Review Artifact: direct Draft PR link and relevant checks
Delivery Route: independent W-GOV-008 branch targeting main, unmerged
Responsible Actor: agent + GitHub checks
Already Authorized: documented governance and audit work
Additional Permission: preview infrastructure setup, third-party account linking, Settings/merge all separately authorized
Acceptance: tests detect absent UI URL, unsafe substitution, missing scope and SHA mismatch; protected app files unchanged; recorded verification honest.
Fallback: BLOCKED if CI/scope fail; never report draft as merged.
User Task: review PR diff and test status; no terminal or ZIP.

## Approval Evidence
Exact user response: 「これでいいお思う。じゃ修正よろしく」 following assistant's full P-001. This grants implementation only within the explicit proposal, including separate preview *design* but not preview rollout.
