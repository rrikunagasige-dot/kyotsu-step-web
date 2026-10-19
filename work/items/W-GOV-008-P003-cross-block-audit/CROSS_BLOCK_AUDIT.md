# 横断チェック — W-GOV-008/P-003 Gate ② N01/N03

Status: IN-PROGRESS
Work / approved Proposals: W-GOV-008/P-002 and P-003, current Work `W-GOV-008-P003-cross-block-audit`
Frozen audit starting SHA: `ec8b97653fd65c134a31d05dbd008dd1bfbf476e` (full 40 hex)
App screenshot source/build SHA: `3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141`
Auditor + date: agent, 2026-10-19 JST
Blocks: N01 Q07 (`formula-r3-q07-x2coef`, `xcoef`, `const`), N03 Q10 (`formula-r3-q10-p1..p4`), math textbook learning review mode.
Earlier `大丈夫だよ。そのまま続けて` was continuation only. Exact new user response at 2026-10-19 14:55 JST names `細部OK N01 Q07` and `細部OK N03 Q10`, after viewing both actual sheets. Pilot `ACCEPTANCE_LOG.md` records the words and SHA; Gate ① `BLOCK-VISUAL-OK`, not Gate ②/③.
Unresolved correction queue: no confirmed wrong answer or app defect in N01/N03 target scope. N01 long equation requires inner horizontal scrolling, verified reachable at 320/390px; user accepted original marked screen. Other-unit impacts still unverified; no new learner code change authorized.

## Audit ledger
| Surface | Block IDs / mode | Status | Evidence / SHA / observation | Finding |
| --- | --- | --- | --- | --- |
| Original source / IDs / text fidelity | N01/N03 math textbook | UNVERIFIED (fresh direct OMML) | Prior input DOCX SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`, historical 397 OMML and 14-figure audit. New Library title search found both 212,863-byte v2 Word copies and page-indexed N01 Q7 (p4)/N03 Q10 (p8), but index omits math and direct page-render returned 403. No fresh byte-level comparison; historical `SOURCE_OMML_AUDIT.md` and solution audit remain evidence. | F-201/F-209 |
| Mathematical chain / dependencies | N01/N03 | PASS | N01 `(3−5,−5+2,6−3)=(−2,−3,3)`; N03 four distributive products yield `6x²+11x+4` | F-201 |
| Answer keys / choice types | all seven plus two final sums | PASS | 27 scoped Vitest including N01 and N03 original answer, unique choices, KaTeX: run 39206502799 at `9a379173ffc91e92b2c5014b1013b7299f68fce9` | F-201/F-207 |
| Premature hints / leakage | same nine choices | PASS | Before answering, future marked step absent; N03 wrong stays unresolved, hint then shown, no next product until correction: 39206502799 | F-207 |
| Figure, cells, KaTeX / visual | N03 figure, N01 target formula | PASS (two target review routes) | Original figure PNG integrity and KaTeX alternatives in scoped Vitest; 390/1440 genuine screen captures. Complete N01 equation does not fit one still image, but tested full rightmost access by horizontal scroll at 320/390px: code run 39207997970 (SHA `2249e8a66aab6519f83e5b74f144e6566d455d04`). UX limitation disclosed and accepted; do not generalize to other units. | F-203/F-210 |
| Wrong/retry/correct/nav | both review routes | PASS | Existing + new 320px N01 4 steps, N03 5 steps with wrong/hint/retry, review switch and invalid target: 39206502799 | F-207 |
| Shared UI / other modes | ordinary route + math textbook | PASS (pilot isolation only) | Optional review prop, review route feature-flagged; ordinary /problems has zero amber marks; PR #97 changes no content/shared renderer. Other subject full walkthrough separately pending | F-202/F-207 |
| Phone 320/390 and desktop | all 7 marks | PASS (two target routes, horizontal scroll required) | User accepted seven authentic 390px marked images. At exact SHA `2249e8a66aab6519f83e5b74f144e6566d455d04`, app run 39207997970 PASS includes 320+390px N01 full rightmost-access assertions in both mobile/desktop Chromium and root horizontal-overflow checks; refreshed marked captures 390/1440 PASS. Other creation unit phone screens not covered. | F-203/F-207/F-210 |
| Progress/persistence/reset | both isolated review routes | PASS | Existing and new E2E assert unchanged `kyotsu-step-store` even after wrong/retry; reload resets ephemeral review answers: 39206502799 | F-202/F-207 |
| Previous approved work / acceptance | P002/P003 source and snapshots | PASS (Gate ① named marks only) | Exact user `細部OK N01 Q07` + `細部OK N03 Q10`, original app capture SHA and immutable GitHub sheets; pilot `ACCEPTANCE_LOG.md`. Separate source/mobile/global acceptance remains pending. | F-204 |

| Related created units / ordinary phone screens | N02/N09/N10/N12 | PASS (right-end access, NOT full visual/source acceptance) | Exact SHA `4212ee2a851e8eaa6fb34ac390f9b6e7a9026f50`, [app 39209590187](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39209590187) mobile Chromium 4/4: 86 choices answered, 84 formula blocks scanned at 320px/390px; no document overflow / KaTeX errors, each rendered math/choice right end reachable. One-screen fitting and fresh OMML still UNVERIFIED. | F-208/F-213 |

## Root-cause sweep / correction recursion
Origin: Pilot F-005/F-203 screen-width legibility of horizontally long N01 formula.
Applicability: other math textbook review-only long formula sequences, potential but not proven.
Impact result: N01 **CONFIRMED limited single-frame legibility** (CSS provides intentional horizontal scrolling); N03 **NOT-AFFECTED** among the seven marks; N02/N09/N10/N12 other approved creation candidates **PASS for actual 320px inner-scroll right-end accessibility and 390px completed reflow** under full normal lesson interaction, GitHub Actions app run `39209590187` / SHA `4212ee2a851e8eaa6fb34ac390f9b6e7a9026f50`. No root horizontal overflow or KaTeX errors; one-frame fit and fresh original-Word source comparison remain unverified. See `IMPACT_SCREEN_SWEEP.md`.
Proposed repair: none implemented, no exact approval for learner UI change. If user marks `要修正`, open separate CMD-WORK-001 proposal before editing.
Visited tuple: `(long-inline-formula, N01-Q07, 3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141)`; N03 inspected as comparison.
Lesson dedup: see `docs/MASTER_APP_LESSONS.md` §§16,21,26 and `docs/MATH_RENDERING_RULES.md` §13; avoid duplicating these lessons.

## Close gate
- [ ] All required rows PASS or justified NOT-APPLICABLE
- [x] Real GitHub screenshot assets tied to full tested source SHA
- [x] No source/content or public app updates
- [x] Explicit per-block `細部OK` in pilot `ACCEPTANCE_LOG.md` (visual only; not final-app acceptance)
- [x] Latest exact SHA `4212ee2a851e8eaa6fb34ac390f9b6e7a9026f50`: governance PASS `39209590046`, app PASS `39209590187`, including original N01/N03 + four related-unit phone right-end sweep. Original independent Word/OMML recheck remains UNVERIFIED; no Gate ② `CROSS-VERIFIED` promotion.
- [ ] Release candidate and actual verified app link (separate final phase, not yet authorized)

**Never treat this in-progress agent audit as final app acceptance.**
