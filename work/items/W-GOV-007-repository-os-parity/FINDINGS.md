# Findings — W-GOV-007

## F-001
Date: 2026-10-11
Type: CONFIRMED
Statement: Main OS skeleton already exists. `governance/` 6/6, `subjects/` 8/8, Work templates 5/5. `WORK_SYSTEM`, `COMMAND_WORDS`, `CHANGE_PROTOCOL`, all five Work templates are exact upstream Git blob matches.
Evidence: Compare Paul main Git tree `b6687b5` and target main `be98aa0`.
Impact: Do NOT reinvent/rewrite the rules; concentrate on routing/integration/enforcement.
Promote to Decision: NO

## F-002
Date: 2026-10-11
Type: CONFIRMED
Statement: Old `memory/DECISIONS/` seven files, four W-GOV Work groups and six `technical/` files are saved in the target's historical Paul import, not lost. Target technical/backend and current published subject material differ.
Evidence: `history/imports/paulfields83-20261010/`, `governance/DOCUMENT_AUTHORITY.md`, `technical/README.md`.
Impact: Index and distinguish history, never bulk-promote as live target canonical.

## F-003
Date: 2026-10-11
Type: RISK
Statement: `README.md` still largely describes an older initial app, and OS routing is confined to a prefatory note rather than a useful top-level human/AI navigation map.
Evidence: target README vs old Paul README.
Impact: Minimally add OS-first routing and historically label previous app prose without deleting it.

## F-004
Date: 2026-10-11
Type: RISK
Statement: Existing main governance CI checks structural assertions. W-GOV-006 #53's stronger policy and hash tests only run for one named proposal branch. Both upstream and target main are currently unprotected and have zero rulesets.
Evidence: GitHub branch/rulesets API; `.github/workflows/repository-governance.yml` on main and PR #53.
Impact: Generalize future PR scope audit but keep pilot non-required; human approval is not cryptographically established. Settings require different approval.

## F-005
Date: 2026-10-11
Type: CONFIRMED
Statement: Target existing published Math/Physics modes have their own accepted source and do not have the same deployment or backend state as Paul.
Evidence: `AGENTS.md`, `navigation/MODE_STATE_2026-10-10.md`, `CHATGPT_README_FIRST.md`, archived import README.
Impact: Preserve all app and lesson sources, refuse upstream wholesale copy.

## F-006
Date: 2026-10-11
Type: RISK
Statement: “GitHub rules strictly execute” has separate meanings: agents following docs; CI detecting many violations; GitHub actually blocking merges. Only the second is partially implemented; human consent and actual agent reading cannot be proven from a Git text marker.
Evidence: `governance/WORK_SYSTEM.md`, W-GOV-006 test results, main settings.
Impact: Report separate verification and authorization states; never advertise 100% guarantee.


## F-007
Date: 2026-10-11
Type: CONFIRMED
Statement: New generic Work integrity pilot is read-only for the target repository and implements file-scoped verdicts PROPOSAL_ONLY / SCOPE_PASS_HUMAN_REVIEW_REQUIRED / REVIEW_REQUIRED / FAIL. It never grants actual merge authority.
Impact: Preserve human review for consent. A Git object and even the recorded approval quote can be tampered with together; SHA anchoring only detects unexpected inconsistency, not who approved.
