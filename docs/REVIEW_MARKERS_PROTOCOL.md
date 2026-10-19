# W-GOV-008 / P-002 — App-side review marks

Status: **implemented in isolated review branch; awaiting engineering CI and the user's visual acceptance**.

## Purpose and boundaries

- CMD-WORK-001「修正」; the user approved W-GOV-008/P-002 on 2026-10-19.
- Avoid asking a non-developer to evaluate a raw PR. Link to an actual, reachable, commit-identified app review route and point to precisely what changed.
- No mutation of lesson text, answer keys, learner progress, subscriptions or production host. Marks are rendered only when the preview gate `VITE_REVIEW_PREVIEW=true` is built; existing `src/app/App.tsx` gates `/review/*`.
- Source: PR #92 lesson work → W-GOV-008/P-001 isolated pilot (PR #94) → this P-002 branch. A draft PR is evidence only, **never a substitute for the app review URL**.

## State machine and human check

1. **awaiting-user**: review page displays a numbered amber `確認①` etc. Only the changed `markBlockIds` in `src/review/reviewTargets.ts` are marked; original context is visible but not marked.
2. Send a **verified app deep link** to `/#/review/n01-q07` or `/#/review/n03-q10`; label what to inspect. Confirm the deployed commit matches the P-002 branch HEAD, the UI loads and each mark is there. If any check fails, show `USER-REVIEW-NOT-READY`, no acceptance request.
3. User responds **OK** / **要修正** in ChatGPT (not an in-app answer). Record response, exact block ID(s), work ID, commit SHA and date in `ACTION_LOG.md` and `VERIFICATION.md`. No inferred consent. `REVIEW-FEEDBACK != APPROVAL`; answering the exercise is not review acceptance.
4. **要修正**: pause progression to new work, retain marks, repair only specified blocks under the correct command and reverify same deep link against a new exact commit.
5. **OK**: record the accepted scope in append-only history; change its `reviewState` to `accepted` **in the next review build** so `activeReviewMarkIds` returns no marks for that target. Test the absence before starting another small block. Do not discard Work history.
6. **Never** treat user content acceptance as permission for `main` merge, GitHub Pages/production publish, paid Vercel plan, or banking details. Each would require separately explicit authorization.

## Current seven checks

| Route | Mark | Exact changed reading-flow block | Check |
| --- | --- | --- | --- |
| /#/review/n01-q07 | 確認① | formula-r3-q07-x2coef | x² coefficient (-2) |
| /#/review/n01-q07 | 確認② | formula-r3-q07-xcoef | x coefficient (-3) |
| /#/review/n01-q07 | 確認③ | formula-r3-q07-const | constant (3) |
| /#/review/n03-q10 | 確認① | formula-r3-q10-p1 | product 6x² |
| /#/review/n03-q10 | 確認② | formula-r3-q10-p2 | product 8x |
| /#/review/n03-q10 | 確認③ | formula-r3-q10-p3 | product 3x |
| /#/review/n03-q10 | 確認④ | formula-r3-q10-p4 | product 4 |

## Engineering gates

- Typecheck, build, Vitest target assertions, and Playwright desktop+320 px mobile preview interaction; no horizontal overflow, no learner storage writes.
- Verify preview source hash, gate on/off, stale-content fail-closed behavior, representative wrong/correct answer operation.
- `ENGINEERING-PASS` means the code passes checks; `USER-REVIEW-ACCEPTED` requires an actual user OK after using verified app links.
- No preview deployment currently established. Do not guess a hostname or claim a live working URL.

## Build-origin fingerprint

The UI commit label must derive from the real Git checkout, **never** an old manually set Vercel `VITE_PREVIEW_COMMIT`. Vite compile-time substitution prefers `VERCEL_GIT_COMMIT_SHA` (Vercel system environment variables) and, only for GitHub Actions, `VITE_PREVIEW_COMMIT` from the PR head. Without a valid 40-hex SHA the review route renders `review-preview-mismatch`; it cannot be used for approval. For protected Vercel projects verify source head, label, access and exact marks before requesting OK.
