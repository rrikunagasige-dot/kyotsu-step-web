# W-GOV-008 — ユーザー確認はPRではなく変更箇所に直行する実アプリ

Status: IMPLEMENTING
Review state: USER-REVIEW-NOT-READY (repository-only preparation; user app preview is not yet deployed)
Updated: 2026-10-19 JST
Repo: rrikunagasige-dot/kyotsu-step-web (ID 1391122224)
Base live main: 154a16ff379321016f4692bb0ac6fe9a8a596214
Branch: work/W-GOV-008-P001-review-link-20261019

## Objective
Stop asking 陸君 to interpret PR #92 or start Codespaces. Deliver a tested, single-tap changed-app link with a short check list before requesting user PASS/要修正.

## Authority
CMD-WORK-001「修正」, exact proposal W-GOV-008/P-001 explicitly approved by the user with 「いいよ。今の感じはすごくいい。特に ... ちゃんと辞書確認したね。じゃよろしく頼む！」 immediately after the targeted approval question on 2026-10-19 JST. Constitution and existing Dictionary / WORK_SYSTEM govern all action.

## Scope
- WORK_SYSTEM §12A canonical review readiness; dictionary's CMD-WORK-001/002 review handoff consistency; MASTER_APP_LESSONS §54 and memory lesson.
- Review handoff template and provider/setup contract.
- Preview-only route and isolated answer state using real textbook math renderer; initial target N01 Q07 and N03 Q10 of draft PR #92.
- QA workflow for preview build and pilot E2E, source and Work records, independent branch and draft PR.

## Do Not Touch
Constitution, command aliases, old accepted content, math/physics authored source, progress schema, direct main, Pages production workflow/deployment, PR #92 head without separate review of the integration, external hosting/service account, public preview publication or billing, ordinary learner gating, unrelated modes. GitHub Pages release and main merge each separately authorized.

## Approved Proposal
W-GOV-008/P-001 in PROPOSAL.md, approved 2026-10-19 JST.

## Current Step
Draft PR #93 implements the governance rule and reviewer module (head c69e56ad7b9787600e6513bd8a90a42354e3d891). Draft PR #94 is a separate pilot based on PR #92's cb726d8 head, candidate 6fa112a4c3f8728f0fbf62fe7f0a847d1d1765b6. Engineering CI underway; no hosted URL.

## Next Step
Open draft PR from this feature branch; verify CI and code. Then construct an isolated PR92-derived pilot, prove actual N01/N03 behavior, and ask separate explicit authorization before any third-party hosting/publication. Give user **no acceptance request** until direct URLs are truly working.

## Dependencies
PR #92 (draft, unmerged, head cb726d843263c645bfa08891cc5cef7375a82f8d at last read). PR #92 user hands-on approval pending. Hosting provider not selected or approved.

## Completion Condition
Consistent governance + tests, exact-head PR preview available and verified at both deep links, user hands-on acceptance of review experience, Work verification/memory close. Engineering CI alone is not DONE.
