# W-MATH-002 / P-004 — 学習モードのベン図を正式アプリで表示

Status: APPROVED for implementation and subsequent release
Date: 2026-10-14
Canonical repository: `rrikunagasige-dot/kyotsu-step-web` (repository ID `1391122224`)
Base `main`: `7eaac5da1e88b8de2a4409f4244e19fa642bd61a`.
Direct user authorization: 「よろしく」 in reply to exact P-004 proposal that explicitly includes investigation, repair, 11-SVG validation, desktop/mobile QA, preservation of progress, and GitHub Pages release with an app URL.

## Problem
In the already-released main app, math set intersection displays the original SVG caption but no image itself. User needs the figure embedded in the real app, not a raw SVG link. Source readingFlow already registers `venn-two-blank`, `venn-intersection`, `venn-union`; all 11 math set SVG files exist under `public/assets/math/textbook/sets/`.

## Findings / root-cause hypothesis (to be verified with compiled-app QA)
`src/components/textbook/TextbookFigure.tsx` used `(import.meta as ImportMeta & {env?: ...}).env?.BASE_URL ?? '/'`. Vite only guarantees static production substitution of direct `import.meta.env.BASE_URL`, so the optional accessor could fall back to `/` in production, requesting incorrect `/assets/...` rather than `/kyotsu-step-web/assets/...`.
Existing E2E tested only `toBeVisible()` on figure containers under `pnpm dev`, not whether the SVG loaded/decoded in a production build.

## Approved fix
- Use direct `import.meta.env.BASE_URL` in the shared textbook figure component, preserving all asset IDs and existing source SVG files.
- Keep the existing 11 SVGs exactly as-is; do not generate new diagrams.
- Add browser tests that inspect `img.complete`, `naturalWidth`, `naturalHeight`, `currentSrc` for initial/intersection diagrams and decode all 11 source SVGs. Test both mobile and desktop against **Vite production preview** of compiled `dist` (not just dev server).
- Add production-compiled smoke check to math textbook CI and to GitHub Pages publish gate.
- Preserve all lesson text, answers, original diagrams, learner progress, localStorage keys, and stage positions. Do **not** invoke `resetTextbookUnit` or modify persistence.
- Only merge and deliver production app URL when full CI (including compiled-image QA) succeeds.

## Scope / no touch
Allowed: `src/components/textbook/TextbookFigure.tsx`, relevant e2e test, `playwright.config.ts`, math textbook CI and Pages workflow smoke step, Work docs. Not allowed: source lesson content, existing 11 SVGs, mathematics practice, physics lesson data, reset/progress logic.
