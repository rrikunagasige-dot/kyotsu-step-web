# W-GOV-008 — ユーザー確認はPRではなく変更箇所に直行する実アプリ

Status: BLOCKED
Review state: USER-REVIEW-NOT-READY (repository-only preparation; user app preview is not yet deployed)
Updated: 2026-10-19 JST
Repo: rrikunagasige-dot/kyotsu-step-web (ID 1391122224)
Base live main: 154a16ff379321016f4692bb0ac6fe9a8a596214
Branch: work/W-GOV-008-P001-review-link-20261019

## Objective
Stop asking 陸君 to interpret PR #92 or start Codespaces. Deliver a tested, single-tap changed-app link with a short check list before requesting user PASS/要修正.

## Authority
CMD-WORK-001「修正」, exact proposal W-GOV-008/P-001 explicitly approved by the user with 「いいよ。今の感じはすごくいい。特に ... ちゃんと辞書確認したね。じゃよろしく頼む！」. On 2026-10-19 JST, the user also replied "IIYO" to the separate exact question asking to connect Vercel and GitHub and publish an isolated, no-login, link-accessible review app. This authorizes ONLY that provider connection and such preview publication, not billing, paid contracts, production Pages or main merge. Constitution and existing Dictionary / WORK_SYSTEM govern all action.

## Scope
- WORK_SYSTEM §12A canonical review readiness; dictionary's CMD-WORK-001/002 review handoff consistency; MASTER_APP_LESSONS §54 and memory lesson.
- Review handoff template and provider/setup contract.
- Preview-only route and isolated answer state using real textbook math renderer; initial target N01 Q07 and N03 Q10 of draft PR #92.
- QA workflow for preview build and pilot E2E, source and Work records, independent branch and draft PR.

## Do Not Touch
Constitution, command aliases, old accepted content, math/physics authored source, progress schema, direct main, Pages production workflow/deployment, PR #92 head without separate review of the integration, unapproved hosting/service accounts or other public publication, billing or paid plans, ordinary learner gating, unrelated modes. GitHub Pages release and main merge each separately authorized.

## Approved Proposal
W-GOV-008/P-001 in PROPOSAL.md, approved 2026-10-19 JST.

## Current Step
Draft PR #93 implements the governance rule and reviewer module (head c69e56ad7b9787600e6513bd8a90a42354e3d891). Draft PR #94 is a separate pilot based on PR #92's cb726d8 head, candidate 6fa112a4c3f8728f0fbf62fe7f0a847d1d1765b6. Governance PR #93 and PR92-derived pilot #94: preview build, governance gate and four desktop/mobile real-interaction tests PASS. All three PR #94 CI workflows PASS including full Math textbook regression. PR #93 governance and preview-code CI PASS; its full Math textbook regression was still running at last check. Vercel approval granted and ChatGPT connector installed/authenticated on 2026-10-19 JST, but Vercel has no visible linked GitHub repository/project; explicitly scoped API reads failed with 403 forbidden. No hosted URL.

## Next Step
The code-only PR and PR92-derived interactive pilot have passed targeted CI. Await Vercel-side GitHub repository authorization and 403 account scope resolution. Then create only the approved isolated, no-login **preview publication** for exact PR #94 candidate SHA. Stop before any paid-plan requirement; verify both live full URLs/commit/viewport gates, then ask 陸君 for hands-on PASS/要修正. Do not touch main or Pages.

## Dependencies
PR #92 (draft, unmerged, head cb726d843263c645bfa08891cc5cef7375a82f8d at last read). PR #92 user hands-on approval pending. Vercel isolated public review preview selected and separately approved by "IIYO"; ChatGPT integration installed/authenticated; Vercel GitHub repository link and API scope access unresolved (403).

## Completion Condition
Consistent governance + tests, exact-head PR preview available and verified at both deep links, user hands-on acceptance of review experience, Work verification/memory close. Engineering CI alone is not DONE.
