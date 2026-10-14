# Verification — W-GOV-006

Status: NOT-RUN

## V-001 — Command registry consistency
Date: 2026-10-14
Target: isolated PR branch
Check: dictionary declares CMD-WORK-002 and preserves ROOT/修正; mode router explicitly resolves only 4 distinct modes; approval/state/review gates match Work OS.
Expected: PASS
Result: NOT-RUN
Evidence: pending PR diff + governance CI.

## V-002 — Scope/provenance
Date: 2026-10-14
Target: branch vs exact main base
Check: no app, source lessons, model answers, progress, CI, Constitution or mode spec changes.
Expected: approved paths only
Result: NOT-RUN
Evidence: pending compare.

## V-003 — User review/acceptance
Date: 2026-10-14
Target: PR link
Check: complete command design visible to user, not silently merged.
Expected: present reviewable PR
Result: NOT-RUN
Evidence: pending PR.

## V-004 — Local static governance gates
Date: 2026-10-14
Target: branch `work/W-GOV-006-create-command-20261014`
Checks:
- Existing CMD-ROOT-001 and CMD-WORK-001 preserved.
- CMD-WORK-002 unique; precisely four mode routes.
- Source-provenance caveat for unavailable original Master Skill.
- Exact Proposal→review feedback→revision/STOP→approval logic.
- Actual app review and correction handoff.
- Router contains all three registered commands.
- Template contains original Word, source table, dependencies, figure/Fire graph and protected scope.
- Markdown formatting has no stray `\\`` markers.
Result: **PASS (9/9)**.
Evidence: GitHub branch source inspection / static condition checks in this Work; separate repository Governance CI pending.

## V-005 — Branch scope verification
Date: 2026-10-14
Target: base main `994f9634e2e5288b97887e71df3948bcc3bfc717`
Result: **PASS**: no unexpected files, no behind_main, no `src/`, `public/`, `e2e/`, `Constitution`, `subjects/**`, CI / Pages modifications.
Evidence: compare_commits GitHub API, pending final commit repeat.

## V-006 — Repository Governance PR CI and review handoff
Date: 2026-10-14
Target: `8f55df9aac585927350609474c2385515b1562b7`
Check: repository-governance.yml / `node tools/repo-governance-check.mjs`
Expected: SUCCESS
Result: **SUCCESS** on source head (before these evidence-only Work-record updates).
Evidence: [Workflow 38516262229](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38516262229).
Follow-up: CI on final evidence-only documentation HEAD to be confirmed; no app build required since no app files changed.

## V-007 — Review surface
Date: 2026-10-14
Target: [Draft PR #63](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/63)
Result: **REVIEWABLE**; `main` not merged, no Pages deploy, no new textbook questions implemented. User approval required for promotion/merge. User acceptance not yet claimed.
