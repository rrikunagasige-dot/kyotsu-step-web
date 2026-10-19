# 横断チェック — W-GOV-008/P-003 Gate ② N01/N03

Status: IN-PROGRESS
Work / approved Proposals: W-GOV-008/P-002 and P-003, current Work `W-GOV-008-P003-cross-block-audit`
Frozen audit starting SHA: `ec8b97653fd65c134a31d05dbd008dd1bfbf476e` (full 40 hex)
App screenshot source/build SHA: `3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141`
Auditor + date: agent, 2026-10-19 JST
Blocks: N01 Q07 (`formula-r3-q07-x2coef`, `xcoef`, `const`), N03 Q10 (`formula-r3-q10-p1..p4`), math textbook learning review mode.
Previous user response: `大丈夫だよ。そのまま続けて`, positive continuation; **not recorded as the separately required `細部OK` per target**.
Unresolved correction queue: none known for seven arithmetic answers; N01 long-formula legibility remains F-203 possible UX issue, not authorized for source change.

## Audit ledger
| Surface | Block IDs / mode | Status | Evidence / SHA / observation | Finding |
| --- | --- | --- | --- | --- |
| Original source / IDs / text fidelity | N01/N03 math textbook | UNVERIFIED | Verified derived source IDs and old source image SHA test; independent mother Word comparison not repeated this audit; new exact CI pending | F-201 |
| Mathematical chain / dependencies | N01/N03 | PASS | N01 `(3−5,−5+2,6−3)=(−2,−3,3)`; N03 four distributive products yield `6x²+11x+4` | F-201 |
| Answer keys / choice types | all seven plus two final sums | UNVERIFIED | Source literal values match; expanded four-suite Vitest pending | F-201/F-205 |
| Premature hints / leakage | same nine choices | UNVERIFIED | Rendered reading groups block future incomplete steps; new wrong/retry regression pending | F-205 |
| Figure, cells, KaTeX / visual | N03 figure N01 formula | UNVERIFIED | Previous 390/1440 screenshot + original figure checksum; N01 formula one-frame horizontal crop | F-203 |
| Wrong/retry/correct/nav | both review routes | UNVERIFIED | Existing preview E2E passed, 320px N03 wrong/retry and cross-switch new CI pending | F-205 |
| Shared UI / other modes | ordinary route + math textbook | UNVERIFIED | Optional review prop, route gated; new ordinary-route smoke test pending. Physics/practice data untouched, no direct suite claim | F-202 |
| Phone 320/390 and desktop | all 7 marks | UNVERIFIED | 390/1440 screenshot run passed; 320 N01/N03 new CI pending, formula legibility F-203 | F-203/F-205 |
| Progress/persistence/reset | both isolated review routes | UNVERIFIED | Existing no-localStorage E2E passed, new regression pending. Reset covered prior N01 E2E by reload | F-202 |
| Previous approved work / acceptance | P002/P003 source and snapshots | UNVERIFIED | PR #97 changed only evidence/CI, but exact visual `細部OK` per block not yet recorded | F-204 |

## Root-cause sweep / correction recursion
Origin: Pilot F-005/F-203 screen-width legibility of horizontally long N01 formula.
Applicability: other math textbook review-only long formula sequences, potential but not proven.
Impact result: N01 **CONFIRMED limited single-frame legibility**; N03 **NOT-AFFECTED by this same long-equation pattern** in current seven screenshots; other approved creation candidates **UNVERIFIED** pending source/screen audit.
Proposed repair: none implemented, no exact approval for learner UI change. If user marks `要修正`, open separate CMD-WORK-001 proposal before editing.
Visited tuple: `(long-inline-formula, N01-Q07, 3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141)`; N03 inspected as comparison.
Lesson dedup: see `docs/MASTER_APP_LESSONS.md` §§16,21,26 and `docs/MATH_RENDERING_RULES.md` §13; avoid duplicating these lessons.

## Close gate
- [ ] All required rows PASS or justified NOT-APPLICABLE
- [x] Real GitHub screenshot assets tied to full tested source SHA
- [x] No source/content or public app updates
- [ ] Explicit per-block `細部OK` record (not app-wide acceptance)
- [ ] All new CI results and unresolved visual matters closed
- [ ] Release candidate and actual verified app link (separate final phase, not yet authorized)

**Never treat this in-progress agent audit as final app acceptance.**
