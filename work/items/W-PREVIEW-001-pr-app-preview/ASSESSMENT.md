# W-PREVIEW-001 — Preview delivery option assessment (proposal only)
Date: 2026-10-11
Status: ASSESSING / NOT AUTHORIZED TO DEPLOY
Target: W-MATH-002 Draft PR #57, exact branch/commit verification required.

## Known current deployment
Target `.github/workflows/deploy-pages.yml` publishes production `main` via GitHub Pages. It does not provide PR-specific app preview URLs. `vite.config.ts` has a fixed `base: '/kyotsu-step-web/'`; React uses HashRouter. Preview provider MUST validate this base path; a root-hosted preview may need an approved preview-only Vite base build setting. Static math figure URLs and mobile/desktop routes must be verified.

## Alternatives
A. GitHub-managed preview with isolated deploy path: avoids new service account, but GitHub Pages' existing single-site configuration and deployment permissions require exact feasibility and any settings workflow changes to be reviewed; must not replace existing production Pages. No implementation permission.
B. Cloudflare Pages Git integration: official docs confirm PR previews and per-branch URLs, independent of existing production project; requires connecting a GitHub repository to Cloudflare and review of requested access, public exposure and build settings. Not connected.
C. Vercel Git integration: official docs confirm automatic per-PR previews and PR comments; requires provider/repository connection and preview visibility setting review. Not connected.

## Sources checked
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://vercel.com/docs/git
- https://vercel.com/docs/git/vercel-for-github

## Open decision and risk
No existing authorized Cloudflare/Vercel connection, project, preview URL, accessible app or cost/permission approval established. Do not infer one. Provider choice and any new GitHub OAuth, project setup, deployment workflow, public access or price must be made in a separate approved execution proposal. Check actual pricing and permission screen at connection time, not from generic templates.

## Required acceptance
- exact PR #57 HEAD built and served (logged build SHA, verified independently)
- actual browser access from ordinary user device with no local setup
- HashRouter `#/learning/textbook/math-sets`, CSS/JS and 14 figures load
- current/previous-stage, next, expand and persistence checks on desktop and mobile
- preview URL link delivered directly; APP_UI user review completed separately
- no main/production Pages modification or other curriculum/PR changes

Decision: BLOCKED — PREVIEW_MISSING; implementation requires distinct user approval.
