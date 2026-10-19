# W-GOV-008/P-003 — review marks and three-gate acceptance

Status: **P-003 approved for isolated governance branch, not merged into main**.  
Authority: `governance/WORK_SYSTEM.md` §12A; dictionary CMD-WORK-001/002; MASTER §54 addendum.  
P-002 provenance: `work/W-GOV-008-P002-marked-review-20261019`, draft PR #95 (unmerged); this P-003 governance branch does **not** copy its app-side code or claim its prototype is deployed.

## What changes from P-001 / P-002

The P-001/P-002 review prototype expected **a working live app deep link for every small block**. The user explicitly approved P-003 to move **small-block acceptance to a GitHub-visible marked screenshot sheet**, with a separate final one-link playable app review. The earlier decisions remain visible in their original Work/branches, but their conflicting per-block URL requirement is superseded by §12A **when P-003 becomes effective**. A PR-only code diff does not replace a visual sheet, and a screenshot never replaces the final user playthrough.

## Persistent review labels (separate from Work statuses)

| Review state | Meaning | Next action |
| --- | --- | --- |
| `BLOCK-CHECK-PENDING` | Real image/SHA or user's response not verified | Fix handoff; do not request visual OK |
| `BLOCK-VISUAL-OK` | User specifically accepted numbered visual block(s) at exact SHA | Persist log; hide marks on **next** review output |
| `NEEDS-FIX` | User identified issue or test failed | Follow CMD-WORK-001 correction-first and retest |
| `CROSS-VERIFIED` | Required block-to-block technical ledger has no FAIL/UNVERIFIED | Freeze final candidate / request separate app-link permission if needed |
| `FINAL-REVIEW-NOT-READY` | No verified hosted candidate start URL or other final precondition missing | Remain pending, never infer approval |
| `FINAL-REVIEW-READY` | Valid actual app URL, frozen SHA, scope and cross-QA verified | User can play entire app |
| `FINAL-APP-ACCEPTED` | User explicitly wrote `総チェックOK` after full playthrough of same SHA/scope | Acceptance recorded, release still separately gated |

## App-side marks vs GitHub sheets

- Stable IDs, not screen coordinates, identify each changed learning decision. On GitHub use `work/templates/BLOCK_REVIEW_SHEET.md`, real screenshot, `確認①` markers and expected content (2–4 points).
- In P-002 the seven pilot marks were N01 Q07: `formula-r3-q07-x2coef` (-2), `formula-r3-q07-xcoef` (-3), `formula-r3-q07-const` (3); N03 Q10: `formula-r3-q10-p1` (6x²), `p2` (8x), `p3` (3x), `p4` (4). These mark IDs are historical prototypes **not** proof they run on this branch.
- Never include answer keys or future solutions in learner-visible state simply to create a marker. Keep preview-only gates and permanent learner progress isolated.
- `細部OK` / `要修正` arrive in ChatGPT. The agent updates append-only Work records with response, date, screenshot asset link, full SHA, block IDs. Only then do accepted marks disappear **in the next screenshot/review output**, without deleting the accepted records.
- A new affected SHA/revision invalidates only acceptance genuinely affected by the change; require new visual check and redo impacted cross-app QA. Never mutate earlier acceptance logs to pretend the new commit was reviewed.
- Final total-play app link is separate. The user must actually play all agreed subjects/modes/chapters/questions from start; only explicit `総チェックOK` at exact candidate creates `FINAL-APP-ACCEPTED`.

## Evidence route and failure modes

- An actual image must be captured from a real checked-out build. Optional `.github/workflows/review-screenshot-evidence.yml` prepares Playwright captures, **without deployment**; artifact output is engineer evidence. GitHub sheet becomes user-ready **only after** a true screenshot is embedded in an accessible GitHub page with clear marks/IDs and exact SHA.
- Screenshot capture job requires a real `/#/review/<target>` route and matching build fingerprint; it fails closed on a missing page, wrong SHA, build failure or unauthorized environment. The workflow is manual/reusable and does not auto-create public hosting or send acceptance messages. Workflow dispatch availability may depend on whether GitHub has the workflow on its default branch; that limitation must not be papered over.
- For a final total-play URL, test user access, exact candidate SHA, intended start route, phone/desktop, no auth wall and data isolation. GitHub code pages, old Pages and PRs are never final playable URLs.
- **Permissions:** no main merge, Pages/public production, new publicly reachable preview, deletion of Vercel, payment/card details, or changes outside approved work scope from this document.
