# Lesson — no idle waiting, resume from proven checkpoint
Status: ACTIVE
Date: 2026-10-10

- Do not keep polling unchanged GitHub Actions run status. While CI/deploy is in progress, work on an independent approved audit, QA checklist, document consistency, or link verification.
- After network disconnect, verify live repository, current branch and HEAD, last successful commit and workflow run; continue from the last PROVEN checkpoint, not from zero.
- Separate CI SUCCESS, main merge, Pages deploy and user hands-on evaluation. Do not claim DONE from a build alone.
- Record failure/retry outcomes; provide a real accessible PR or app URL at every completed modification/handoff.
