# Findings — W-GOV-008/P-003 visual pilot

## F-001 — CONFIRMED
P-002 real app markers have the seven approved stable IDs and unmodified original problem/source. The GitHub image sheets now target exactly those controls.

## F-002 — CONFIRMED
Only a subsequent step is rendered after the previous response, so genuine E2E screenshots advance through real user answers and capture each targeted `確認①` etc. **before** answering it. Capture tests assert full checked-out build SHA and no persistent learner state.

## F-003 — RESOLVED (engineering delivery)
The short-lived GitHub Actions artifact was downloaded and its genuine PNG members were committed as individual files and embedded via relative Markdown links. Reviewers no longer need a ZIP, PR diff or artifact viewer. Actual GitHub rendered path verification is recorded separately.

## F-004 — AUTHORIZATION
No public app environment, production deployment, Vercel removal, payment or main integration. Public-repo standard GitHub runner; artifact retention 1 day.

## F-005 — PARTIALLY RESOLVED screenshot framing; UI/capture limitation disclosed
First capture run `39203069126` cropped N01 `確認①` vertically; fixed by root-only vertical centering and visually rechecked run `39203622766`. Nevertheless, N01 has a long horizontally scrollable line in the genuine app view, so not every symbol in the entire equation is visible in one screenshot at either capture width. The selected calculation and numbered target are visible, and the user sheet explicitly invites `要修正：N01の式が切れる`. This is a **visual risk / possible UX correction**, not permission to modify source. If the user rejects legibility, open a separate `修正` Work/proposal for confirmation and do not silently change lesson code.

## F-006 — REVIEW PENDING
The sheets show expected values to facilitate non-technical review, but neither N01 nor N03 has user `細部OK`. Horizontal cross-block audit and final actual-app full walkthrough cannot be labeled approved.
