# W-MATH-002 — Preview entry for PR #57

Status: EXTERNAL BROWSER LAUNCH LINK PREPARED / RUNTIME NOT YET VERIFIED
Date: 2026-10-13
GitHub repository: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Frozen app-code commit: `b8791e82215a56512094e265025c112d116e59d3`
PR: https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/57

## Run the actual PR #57 source in a browser

[Open PR #57 math-sets in StackBlitz](https://stackblitz.com/github/rrikunagasige-dot/kyotsu-step-web/tree/b8791e82215a56512094e265025c112d116e59d3?startScript=dev&view=preview&initialpath=%2Fkyotsu-step-web%2F%23%2Flearning%2Ftextbook%2Fmath-sets)

This link uses the documented StackBlitz GitHub-import contract `/github/OWNER/REPO/tree/COMMIT` with `startScript=dev`, `view=preview` and `initialpath`.
It imports the exact immutable PR #57 code commit, invokes the repo's existing `dev` script (`vite`) and requests the HashRouter lesson route at the configured `/kyotsu-step-web/` Vite base. It does not deploy anything to the production GitHub Pages site, change GitHub settings, or merge the PR.

## Verification boundaries

- Confirmed: GitHub PR #57 source commit exists and passed its three recorded CI workflows; package.json declares `dev: vite`, Vite base is `/kyotsu-step-web/`, application uses HashRouter.
- Confirmed: StackBlitz documents GitHub import by commit, automatic npm script launch and `initialpath` URL query option.
- **NOT YET VERIFIED**: The external StackBlitz session has successfully imported this particular 37MB source repository, installed packages, served Vite, or rendered and completed math-sets. Do not state user-facing live preview SUCCESS without an observed browser result.
- No URL on `rrikunagasige-dot.github.io/kyotsu-step-web/` contains PR #57 until a separate approved release.
- If an external browser import cannot run this stack, record a blocker instead of calling this app preview done.

## User QA checklist after actual launch

1. First divisor question → correct answer → new definition still shown.
2. `次へ` → prior section becomes a one-line card.
3. `全文を見る` → exact original source recovers.
4. `過去の学習をすべて見る` → full review.
5. References, reload/resume, mobile overflow, last summary and final completion.

No main merge, GitHub Settings or PR #53–#56 action is authorized by this record.
