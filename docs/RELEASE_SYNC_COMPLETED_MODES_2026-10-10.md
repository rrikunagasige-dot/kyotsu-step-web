# Public app synchronization plan — 2026-10-10

## Source versions
- Target repo: `rrikunagasige-dot/kyotsu-step-web`.
- New production base: main `73b1d5762dd3fed0e0b3f414bb4a3ec1bf518824` (Math Practice Q87–Q120 and Physics textbook 1A–1G plus guided Physics Practice).
- Mathematics textbook candidates: branch `332c1537b14508c3f916dac8cf5f1486e2fa8a17`, published `math-sets`; review-only other mathematical units stay in `review` and are NOT promoted.
- Old production checkout pinned at `2127c3d4d35793546228ac2fe2a9d38e8a9f97be`.

## Integration
- Keep every target main `src/data/mathPractice/**` and other practice source file byte-for-byte.
- Copy mathematical textbook unit files, math assets, tests from the Math textbook branch.
- For shared UI, preserve main Practice rendering; add the math textbook section selector and its dedicated textbook reader/schema/term CSS.
- Preserve all existing Physics Chapter 1 files and internal unit IDs.
- Remove pinned SHA from GitHub Pages; deploy triggering main commit only AFTER CI and review.

## Acceptance
- Static target-modes integration sanity and GitHub Actions checks, math practice source fidelity.
- Math textbook set exists and is published. Proposition/quantifier/proof/function lessons remain review.
- Math practice 87–120, Physics chapter 1, Physics representative Practice remain available.
- GitHub Pages build must succeed. Keep restore commit `2127c3d4` and original `main` commit `73b1d5762dd3fed0e0b3f414bb4a3ec1bf518824` for rollback.
- Do not modify `paulfields83` or merge a separate governance PR with this release.
