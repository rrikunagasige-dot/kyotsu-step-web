# W-PREVIEW-001 / P-002 — Cloudflare Pages PR preview
Status: PROPOSED
Created: 2026-10-11
Supersedes: P-001 (provider comparison only; unapproved)
Implementation approval: NOT GRANTED
Target repository: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Target math implementation: Draft PR #57, SHA `b8791e82215a56512094e265025c112d116e59d3`

## What / Why
Deliver an accessible *running application URL* where the user can inspect actual Math-sets compact UI from the exact unmerged PR #57. User must only open the link and test the lesson. A PR diff, ZIP or local executable is NOT an APP_UI review artifact. Existing GitHub Pages production (main) must remain unaffected.

## Provider choice and evidence
FIRST CHOICE: Cloudflare Pages (new separate project), connected via limited GitHub integration to the canonical target repository only. Git-connected preview deployments produce per-PR/branch preview URLs without modifying the existing GitHub Pages site. Cloudflare Pages Free currently allows 500 builds/month; previews are publicly accessible by default, so restrict access if required. Branch URL updates as newer commits arrive; prefer immutable deployment URL and pin the exact SHA in verification.

Other options considered: Vercel supports previews but Hobby plan is limited to noncommercial personal projects; using GitHub Pages as PR preview would require more invasive deploy architecture changes. No existing connected Cloudflare account/project has been confirmed.

Sources:
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://vercel.com/docs/plans/hobby
- https://vite.dev/guide/build

## Delivery design (only if P-002 is approved)
T01. User explicitly authorizes a NEW Cloudflare Pages preview project and ONE-TIME GitHub installation/repository access confined to `rrikunagasige-dot/kyotsu-step-web`; inspect actual permissions shown by Cloudflare before user grants access. No personal tokens in repository/chat.
T02. New Cloudflare Pages project, not the existing GitHub Pages production site. Configure production branch `main` as Pages requires (this may create a second public copy of existing main; user must accept this disclosure) and branch preview for the existing implementation branch `work/W-MATH-002-textbook-ui-compression-implementation-20261011`. Limit automatic branch preview scope if possible. No change to GitHub production deploy workflow.
T03. Build settings: repository root; Node 22 (`NODE_VERSION=22`); pnpm 11.9.0 (`PNPM_VERSION=11.9.0`); build command `pnpm run build -- --base=/`; output folder `dist`. Vite supports `--base` at build time. Check command forwarding, package-manager detection and actual project build logs; do NOT edit `vite.config.ts` or `package.json` unless separately approved.
T04. The PR #57 branch predates the Cloudflare connection. Confirm whether initial branch deploy is available; if not, do NOT manufacture a commit to PR #57 or change its contents under this authorization. Stop and propose an explicitly approved triggering method or alternative preview-only path.
T05. Verify the created deployment commit equals `b8791e82215a56512094e265025c112d116e59d3` (or refresh exact PR head and review with user), using Cloudflare build log `CF_PAGES_COMMIT_SHA` and GitHub SHA. Verify full public HTTPS URL is actually accessible without developer login.
T06. Real browser QA on direct page `/#/learning/textbook/math-sets`: app boots; CSS/JS load; stage 1 and 15-stage progression, Next button, original revealed definition after answer, past-stage expansion, persistence/reload; all expected SVG figure assets load; mobile & desktop no overflow; no browser console/runtime errors.
T07. Provide the user a direct immutable deployed app URL and optionally a PR link for code context. The user's sole normal task is opening the application URL, evaluating the UI and reporting feedback. Record APP_UI user review separately from CI.
T08. STOP before PR #57 main merge, production deployment, GitHub settings outside one-time approved connection, or other modes' UI changes. Rollback: disable Cloudflare branch deployments/revoke integration/delete only the newly created Cloudflare Pages preview project (after separate appropriate user permission); preserve original Pages and PRs.

## Scope
Cloudflare Pages project setup + limited GitHub repository integration, Cloudflare project build configuration and preview deployment/QA only; no modifications to existing app source or main. Any newly required code/workflow edits or PR #57 triggering commits are out-of-scope until revised proposal is approved.

## Risks / unknowns
- GitHub OAuth/repository permission approval by user is unavoidable at initial provider connection; normal lesson review itself requires no setup.
- Preview and mirrored Pages project may be public, including preview routes; use access policy if user wants protected preview, but restricted access may complicate frictionless app inspection.
- Provider behavior for a PR already open before connection is not yet verified; do not promise a URL until deployed.
- Cloudflare Pages Free build quota (500/month) and service constraints may change.
- GitHub Pages production uses Vite base `/kyotsu-step-web/`; new Pages URL should use base `/`. Confirm actual Vite CLI forwarding; no production source modifications.

## Review Delivery Contract
Review Type: APP_UI
Required Review Artifact: real browser-accessible immutable preview URL serving exact PR #57 implementation
Delivery Route: Cloudflare Pages per-PR preview project
Responsible actor: initial user account permission grant, setup by authorized connected service/Cloud Browser workflow; assistant to verify artifacts/evidence using available capabilities
Authority already approved: research and proposal-only
Additional Permission: explicit approval of this P-002 PLUS Cloudflare account/GitHub repository authorization. No automatic external connection or GitHub settings modifications without user-granted consent.
Acceptance: exact build SHA, real URL, valid SVG/CSS/JS and mobile/desktop lesson interaction, user receives direct link.
On failure: BLOCKED — PREVIEW_MISSING; no ZIP/localhost fallback.
User task: open provided app URL and evaluate the Math-sets lesson.

## Approval
Status: WAITING. User 「よろしく」 means continue the approved planning, NOT consent to unspecified third-party OAuth or deployment.
After review the exact P-002 must be explicitly approved before implementation, and any new means must return to REVISE-PROPOSAL.
