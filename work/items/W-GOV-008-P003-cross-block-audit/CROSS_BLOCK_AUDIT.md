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
| Answer keys / choice types | all seven plus two final sums | PASS | 27 scoped Vitest including N01 and N03 original answer, unique choices, KaTeX: run 39206502799 at `9a379173ffc91e92b2c5014b1013b7299f68fce9` | F-201/F-207 |
| Premature hints / leakage | same nine choices | PASS | Before answering, future marked step absent; N03 wrong stays unresolved, hint then shown, no next product until correction: 39206502799 | F-207 |
| Figure, cells, KaTeX / visual | N03 figure, N01 formula | UNVERIFIED | Original PNG hash, all KaTeX alternatives and 390/1440 captures PASS (39206502799); N01 long equation needs horizontal scroll, complete expression not within a single image | F-203 |
| Wrong/retry/correct/nav | both review routes | PASS | Existing + new 320px N01 4 steps, N03 5 steps with wrong/hint/retry, review switch and invalid target: 39206502799 | F-207 |
| Shared UI / other modes | ordinary route + math textbook | PASS (pilot isolation only) | Optional review prop, review route feature-flagged; ordinary /problems has zero amber marks; PR #97 changes no content/shared renderer. Other subject full walkthrough separately pending | F-202/F-207 |
| Phone 320/390 and desktop | all 7 marks | UNVERIFIED (visual fit) | 320px root overflow and interactions PASS on both target routes; 390/1440 real screenshots PASS; complete N01 long equation only horizontally scrollable, screenshot visual gate not closed | F-203/F-207 |
| Progress/persistence/reset | both isolated review routes | PASS | Existing and new E2E assert unchanged `kyotsu-step-store` even after wrong/retry; reload resets ephemeral review answers: 39206502799 | F-202/F-207 |
| Previous approved work / acceptance | P002/P003 source and snapshots | UNVERIFIED (human review) | PR #97 changes evidence/tests only, immutable prior screenshot assets remain; user said `大丈夫` but exact per-block `細部OK` not recorded | F-204 |

## Root-cause sweep / correction recursion
Origin: Pilot F-005/F-203 screen-width legibility of horizontally long N01 formula.
Applicability: other math textbook review-only long formula sequences, potential but not proven.
Impact result: N01 **CONFIRMED limited single-frame legibility** (CSS provides intentional horizontal scrolling); N03 **NOT-AFFECTED** among the seven marks; N02/N09/N10/N12 other approved creation candidates **UNVERIFIED on actual mobile screens** after static source scan.
Proposed repair: none implemented, no exact approval for learner UI change. If user marks `要修正`, open separate CMD-WORK-001 proposal before editing.
Visited tuple: `(long-inline-formula, N01-Q07, 3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141)`; N03 inspected as comparison.
Lesson dedup: see `docs/MASTER_APP_LESSONS.md` §§16,21,26 and `docs/MATH_RENDERING_RULES.md` §13; avoid duplicating these lessons.

## Close gate
- [ ] All required rows PASS or justified NOT-APPLICABLE
- [x] Real GitHub screenshot assets tied to full tested source SHA
- [x] No source/content or public app updates
- [ ] Explicit per-block `細部OK` record (not app-wide acceptance)
- [x] New CI PASS at `9a379173ffc91e92b2c5014b1013b7299f68fce9` / 39206502799; unresolved visual matters still open
- [ ] Release candidate and actual verified app link (separate final phase, not yet authorized)

**Never treat this in-progress agent audit as final app acceptance.**
