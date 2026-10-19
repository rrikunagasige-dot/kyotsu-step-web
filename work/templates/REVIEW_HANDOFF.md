# User review handoff — APP SCREEN ONLY

Work / Proposal:
Status: USER-REVIEW-NOT-READY | USER-REVIEW-READY | USER-ACCEPTED | NEEDS-FIX
PR / exact head SHA (agent-side evidence):
Preview URL (must be tested, direct to changed location):
Preview target / item ID:
Preview deployment / verified-at timestamp:
Production URL (separate; never mislabel as PR preview):

## User-facing message (copy after the gate passes)

**ここだけ確認してね:** [単元・問番号と短い名前](actual-app-deep-link)

今回変えたのは: [one sentence, include expected values or diagram].
確認すること:
1. [first changed hole/state and expected presentation]
2. [one wrong choice does not advance; correct one advances]
3. [any target-specific figure/sizing/progression]

合格なら **PASS**、違ったら **要修正：どこが違うか** と返信してね。

## Agent-only READY gate (all PASS required)

- [ ] Preview is the actual PR implementation and exact full SHA, not current main or a mock.
- [ ] Direct URL opens the intended first changed decision without login, commands, or long prerequisite solving.
- [ ] Mobile (at least 320px / 390px) and desktop visuals checked.
- [ ] Wrong/correct/gating checked, no answer leakage.
- [ ] No write to learner persisted progress or unrelated modes.
- [ ] Preview isolated from production; no unapproved publishing/hosting/release.
- [ ] Evidence / URL / timestamp in VERIFICATION, remaining blockers stated.
- [ ] User has not been told automated PASS = user acceptance.

If any check fails: USER-REVIEW-NOT-READY. Do not send the user-facing message as an acceptance request. Developer PR URL may appear separately as evidence only.
