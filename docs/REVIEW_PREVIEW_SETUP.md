# PR app review — hosting and pilot contract

Status: REPOSITORY PREPARATION ONLY (W-GOV-008/P-001, 2026-10-19). **No external deployment or hosting account has been connected or authorized.**

## Purpose

A user must be able to open an exact changed place as a normal app screen. The first pilot covers existing draft PR #92 (head cb726d843263c645bfa08891cc5cef7375a82f8d as checked 2026-10-19 JST): N01 Q07 new 3 coefficient steps, N03 Q10 new 4 product steps.

## Review routes in a separately built review preview

- N01 Q07: #/review/n01-q07; expected local steps −2, −3, 3, then original final expression.
- N03 Q10: #/review/n03-q10; expected local products 6x², 8x, 3x, 4, then the original sum. Original four-cell figure should be visible.

These routes exist **only** when VITE_REVIEW_PREVIEW=true at build time. The review page reuses the actual unit's reading-flow / formula / figure / choice renderer and answer evaluation, but stores attempts only in temporary React memory. It never uses persisted learner progress. It rejects missing expected IDs/revisions to prevent mistaking old main for PR #92.

Preview build environment:
- Node 22, pnpm 11.9.0, install frozen lockfile.
- VITE_REVIEW_PREVIEW=true
- VITE_BASE_PATH=/ (GitHub Pages production still uses /kyotsu-step-web/)
- VITE_PREVIEW_COMMIT=the **actual PR head full SHA** (build service must set this from its trusted checkout and agent must verify).
- Build: pnpm run build; publish dist.
- Deploy Preview must be built from PR #92's code **plus** W-GOV-008 reviewer module or from a derived pilot branch using exactly that candidate source. No implicit main merge.
- Protect public access as explicitly agreed, set noindex / suitable privacy controls and avoid transmitting learner data. Review links must load actual math assets at the preview origin.
- Provider candidates are Netlify Deploy Previews, Cloudflare Pages Preview Deployments or equivalent. Selection/account linkage, any public or restricted publication and associated cost/visibility require separate explicit user consent; do not configure or trigger them by inference.

## First-pilot acceptance gate

1. Check deployed commit SHA matches GitHub PR candidate source, route renders revision 2 and shows expected 18 (N01) / 17 (N03) item versions.
2. Open both deep links directly in a clean browser, including mobile 320px and 390px and desktop; ensure no login or developer action.
3. On N01 Q07 test wrong, then −2, −3, 3, final expression; N03 Q10 test wrong, then 6x², 8x, 3x, 4, original sum, with image and 320/390px horizontal overflow check.
4. Reload, then verify the reviewer attempts were not saved and regular app progress in the same browser is untouched; check next unrelated unit and production unchanged.
5. Only after the above passes, use work/templates/REVIEW_HANDOFF.md with **two actual clickable, full URLs** and PASS / 要修正. Current PR #92 and published GitHub Pages do not yet satisfy that condition.

## Independence of permissions

W-GOV-008/P-001 permits repository branch code and documentation preparation. It does **not** permit a third-party hosting connection, enabling build deployments publicly, charging a plan, main merge, or GitHub Pages release. Stop and ask for that exact authorization when needed. A CI artifact or a GitHub code-review link is not a user-facing preview.
