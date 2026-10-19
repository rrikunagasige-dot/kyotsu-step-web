# W-GOV-008 / P-001 — 直接開けるアプリ確認フロー

Status: APPROVED
Date: 2026-10-19 JST
Command: CMD-WORK-001「修正」 as explicitly matched with the dictionary, not a new alias.
Approval evidence: The assistant presented this exact seven-part proposal and asked 「今回の依頼を CMD-WORK-001『修正』として扱い、上記 W-GOV-008 / P-001 の設計で進めていいかな？」; the user immediately replied 「いいよ。今の感じはすごくいい。特に ... ちゃんと辞書確認したね。じゃよろしく頼む！」, with no added condition or material revision.

## Problem / need
A PR URL (#92) cannot communicate or let the user quickly test the changed learning behavior. The current §12A permitted PR fallback even without a real app preview; an older Pages app was once supplied despite the PR-only changes not being published there. Asking the user to run Codespaces, install or unpack a ZIP is too burdensome.

## Exact approved solution
1. For all app/content creation and correction, require a direct opening interactive changed-app preview URL before user hands-on approval requests.
2. PR-specific isolated automatic preview through a suitable provider (candidate Netlify/Cloudflare/Vercel) without main merge or Pages publication; **provider connection and any external publication require separate explicit user approval**.
3. In preview only, a deep link jumps to the exact changed question/first new choice without normal prerequisite solving, while reusing real app renderer and correctness logic. Preview state must not affect production learner progress. Optional preview wrong/correct views are diagnostic only.
4. Every user handoff: exact changed place, expected visible content, tiny concrete checklist, and PASS / 要修正 reply.
5. Agent must verify exact PR SHA, direct links, mobile + desktop visuals, interaction and progress isolation. Without that proof, say USER-REVIEW-NOT-READY; a PR link does not suffice.
6. Update governance/WORK_SYSTEM.md, governance/INSTRUCTION_DICTIONARY.md, docs/MASTER_APP_LESSONS.md, template/CI and related memory/Work within scope. Do not amend Constitution or alter existing higher-order command definitions.
7. First pilot N01 Q07 (-2, -3, 3) and N03 Q10 (6x², 8x, 3x, 4) from W-MATH-005/P-002 PR #92; user approval of this governance work does not approve learner content or production release.

## Expected affected files
Governance Work OS and dictionary handoff paragraphs, shared/master lesson, memory pointer, review template/setup, optional build-only preview route using real TextbookReadingFlow and temporary state, tests/CI and these five Work records.

## Risks
Provider requires new authorization; provider preview visibility/pricing/privacy can vary; old source main N01/N03 lacks added holes; wrong preview commit or stale content; accidental progress writes; overflow/missing diagram on phone; false readiness based on a code-only PR; undesired bundling in production; CI passing without human review.

## Verification plan
- Static governance consistency, exact authority, branch/main isolation, review handoff ready criteria.
- Typecheck/build both ordinary Pages base and preview base.
- Pilot PR92-derived interactive test: all seven new decisions, wrong and correct gating, original figure, 320/390 mobile + desktop, reload/persist safety and exact SHA.
- Open and manually inspect hosted deep links only after external publication is independently authorized.
- Record technical PASS separately from user acceptance and main/Pages gate.

## Out of scope
External hosting connection/publication now; billable upgrades; direct editing main; merge/release; changing N01/N03 source text/answers/images; general bypass on production; changing Constitution or inventing a new command alias.

## Approval
Status: APPROVED for branch preparation and implementation only.
Approved by user: YES, 2026-10-19 JST.
External host connection/publication: NOT APPROVED.
Main merge / Pages release: NOT APPROVED.
User acceptance of PR #92: PENDING.
