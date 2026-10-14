# W-PREVIEW-001 Findings
## F-001 — CONFIRMED
PR #57 is Draft and unmerged. Main-only GitHub Pages does not provide the new UI to users.
## F-002 — OPEN-QUESTION
Which provider can supply a safe PR-specific URL with exact commit provenance, usable base path, verified assets and appropriate account permissions? Requires evaluation and new approval before implementation.

## F-003 — CONFIRMED
Cloudflare Pages Git integration can produce branch/PR URLs; its Free plan limit is 500 builds/month (official 2026 documentation), with public previews by default. Vercel Hobby requires personal noncommercial use.
Evidence: provider official docs URLs in P-002.

## F-004 — CONFIRMED
Vite uses fixed base `/kyotsu-step-web/` on main; Vite CLI can override build base using `--base=/`. TextbookFigure resolves assets using `import.meta.env.BASE_URL`; HashRouter routes should be tested at `/#/learning/textbook/math-sets`.
Evidence: PR #57 vite.config.ts, src/components/textbook/TextbookFigure.tsx, src/main.tsx and official Vite build documentation.

## F-005 — RISK
The PR predates new Cloudflare connection. No live preview is verified, and creating a new PR #57 commit to trigger provider automatically would be outside current preview proposal-only authorization.
Impact: P-002 explicitly stops if no supported branch initial deployment method.

## F-006 — RISK
Connecting a new Pages project with main as production branch creates a secondary Pages deployment, which could be publicly accessible even if original GitHub Pages stays unchanged.
Impact: explicit disclosure and provider/project access review required.
