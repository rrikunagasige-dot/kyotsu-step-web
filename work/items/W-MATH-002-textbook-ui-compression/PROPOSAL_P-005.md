# W-MATH-002 / P-005 — 部分集合の図をユーザー承認済みPNGに置換

Status: APPROVED — implementation scope only; production release gate requires passing CI.
Date: 2026-10-14
Repository: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Baseline live main: `a24a3b08a675f9f76a34b329edd9d96ab94c232b`.
Branch: `work/W-MATH-002-P-005-subset-approved-png-20261014`.

## Exact user-visible issue and narrowing of scope
The user complained that the second (subset) diagram obscured the C label and corrected the desired mathematics: B must be wholly within A; C must **partly overlap A**, but remain partly outside A and its letter C must be readable. A revised illustration showing exactly this was generated and the user said 「いいね。じゃgithubの修正に入れ」. The assistant subsequently confirmed the change is **only the second diagram** and offered Option A to replace using generated PNG, explicitly recommending A. The user replied 「よろしく」. These specific instructions supersede the earlier suggestion to move C completely outside A and narrow the current implementation to the subset diagram only.

## Approved technical change
- Add the user-approved revised **second image** as `public/assets/math/textbook/sets/subset-after.png`. Derive an in-app rendition by cropping the outer frame and caption from the approved generated PNG so its image is a plain A/B/C diagram; use the **existing app caption unchanged** to avoid duplicate captions. Keep C partly overlapping A and legible.
- Change **only** `subset-after` source in published `src/data/textbook/math/set/setLesson.ts` from `subset-after.svg` to `subset-after.png`. Keep all other figures including `venn-union.svg` unchanged.
- Preserve historical `subset-after.svg` and all existing SVGs, original text and answer data, progress schema, app logic, and physics/practice modes.
- Verify binary is a valid 720x300 PNG and browser in compiled preview draws the PNG inside the correct lesson `figure-c-subset`. Add test coverage for source identity, not changing other figure references, caption unchanged, PC/mobile and production asset decoding.
- Keep changes in dedicated branch and PR, then only deploy after successful CI and release authorization consistent with Work OS.

## QA evidence before branch merge
Binary Git blob exact Git SHA: `7a609a1e84b73dbaa46bb67ca3062b29b4e9821a`; file length 4515 bytes, image is clean app-cropped 720x300 version of previously user-approved revised drawing, with B entirely in A, C crossing A and readable. This mechanical crop excludes the already-supplied on-screen caption, ensuring no duplicated instructional prose.
