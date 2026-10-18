# W-MATH-006 — Verification
Status: IMPLEMENTATION STAGED / CI AND BROWSER RECHECK PENDING
V-001 PASS SOURCE COMPARISON: main N12 local-token special branch vs generic formula path confirmed in TextbookFormula.tsx and global.css.
V-002 PASS BROWSER OBSERVATION: published GitHub Pages N12 Q01 shows □ (11-token family); published N02 Q01 shows old rectangular 「選択」. Both page title and original lesson sections load; no answer selection was submitted in this audit.
V-003 PASS LINKED SOURCE SCAN: draft W-MATH-005 PR #80 applies same CSS class to N01/N03/N09 nine new local stages. Draft not merged; no direct published-user-screen QA claimed.
V-004 PASS APPROVAL. User answered 「いいよ」 directly to W-MATH-006/P-001 exact implementation request on 2026-10-18 JST. Approval is visual-only and excludes main merge/Pages release.
V-005 IMPLEMENTED IN CORRECTION BRANCH. Only TextbookFormula's active-token label and token-specific global CSS changed; N12 E2E checks rectangular thin border, 44px target, sequential math, wrong/correct, history, figures. Learner-source math, IDs, answers not edited.
V-006 PENDING CI. Compare GitHub Actions full workflows plus mobile/desktop regression; linked W-MATH-005 PR #80 updated and verified separately.
