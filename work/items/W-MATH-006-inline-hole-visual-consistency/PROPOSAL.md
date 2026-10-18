# W-MATH-006 / P-001 — 数式中の穴を従来デザインへ統一する修正案

Status: APPROVED FOR ISOLATED IMPLEMENTATION — MAIN / PAGES RELEASE NOT AUTHORIZED
Date: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Direct feedback: 「N12は本当に良かった。しかし穴のデザインだけ前のデザインと違う。これだけ治せばいい。…じゃ続けてくれ」
Identity: rrikunagasige-dot/kyotsu-step-web / main 4a4041aad05c5025075eca11e2a2beb22a390eb4
Origin: W-MATH-004/P-002 published in PR #78; W-MATH-005/P-001 nine-hole implementation is unmerged draft PR #80.
Authority note: The proposal was initially separate from the earlier compact □ approval. After the exact W-MATH-006/P-001 request, the user answered 「いいよ」 on 2026-10-18 JST. This authorizes only the two scoped isolated implementation branches and tests; main/Pages release remains unauthorized.

## 1. Observed mismatch, verified in published UI

- Existing N02 formula-choice style: thin square-corner blue border, rectangular 「選択」 control as the in-equation choice placeholder (public N02 Q01 `2bx+bx=[選択]`).
- Published N12 P-002: prefix `n12-p002-` triggers `reading-formula-choice--token`; inline 44×44 minimum border-2 slightly rounded button with glyph `□`, rather than the familiar `選択` rectangle. Public N12 Q01 displays `-2< [□]x+5`.
- Root cause is explicitly in `src/components/textbook/TextbookFormula.tsx` (`localToken` ID check, ternary label) and `src/styles/global.css` (`.reading-formula-choice--token` override). Ordinary textbook formula choices use `.reading-formula-choice` and `選択`.
- After user feedback, the mathematics, eleven new scalar blanks and sequential derivation have no reported defect. **Only the local blank's visual presentation is in scope.**

## 2. Exact proposed result

Restore the already-established math textbook in-equation visual language **for these local-token items**:

| Before, N12 | After, visually matched to N02 |
| --- | --- |
| `-2 < [□]x+5` | `-2 < [選択]x+5` |
| outlined 44px square, slightly rounded, heavy border | familiar thin-border, square-corner horizontal 「選択」; retain accessible >=44px hit area / visible focus / keyboard access |
| after choosing, resolved value appears in the formula | **unchanged**; correct answer replaces the placeholder in situ |

Implementation surface after separate approval:
1. Only alter token-specific button display/style. Do not alter source expressions, 26 N12 stages, item IDs, answer strings, four+ grouped derivations, hints, ordering, reveal gates, progress migration, chapter titles, figures, choice menus or normal textbook controls.
2. Preserve the established N02 look for all unaffected formula choices. Where exact old dimensions are smaller than current accessibility targets, enlarge the **clickable hit area only** without changing shape/visual language. No mobile horizontal page overflow; formula block's own horizontal scrolling may remain.
3. Wrong-answer display remains existing `×` plus feedback, with next step still locked. Chosen value appears at the precise formula location.

## 3. Linked impact: W-MATH-005 draft nine holes

The same component's implementation in draft PR #80 extends the prefix list to `n01-r3-`, `n03-r3-`, `n09-r3-` (3+4+2=9). Therefore the identical visual inconsistency is **CONFIRMED in source** for the unmerged nine holes, even though published browser QA is unavailable. Once P-001 is explicitly approved, align these draft tokens to the same established visual treatment **within the already existing draft PR #80**, without merging or publishing it. This is an impact-scoped linked correction, not permission to modify N01/N03/N09 pedagogy or extend to unrelated units.

## 4. Verification requirements

- N12 source 15+11=26 active stages and W-MATH-005 old 42+9=51 answers remain bit-for-bit unchanged in ID and answer; original source maps/images unchanged.
- Compare N12 Q01 and N02 Q01 visually at desktop and 320px mobile before/after, including click, wrong selection and correct inline resolved token, visible focus; ensure original look and >=44px target.
- Existing N12 26-step and W-MATH-005 N01/N03/N09 9-token E2E, N02/N09 figure gate, v1→v2 history restoration, math textbook/practice/physics regressions and GitHub CI all pass. Record failures and fixes.
- Inspect other approved-created textbooks sharing the renderer for the same styling defect and list confirmed/not affected/unverified in IMPACT_LEDGER.md. Do not mass-apply visual changes.
- First publishable N12 fix is on a separate correction PR. **Main merge / Pages publication requires a separate user authorization.** Draft PR #80 remains unmerged/unpublished pending user QA and release approval.
- Shared lessons update only after linked corrections/acceptance, then return to paused W-MATH-003/P-003 creation queue.

## 5. Explicit approval request

「**W-MATH-006/P-001を承認する**」 means approve exactly the legacy in-formula 「選択」 rectangle visual on N12's 11 new token buttons and on the 9 existing unmerged W-MATH-005 token buttons, with accessibility/mobile/regression QA on isolated implementation branches. It does **not** authorize changing teaching content, all other lesson holes, W-MATH-005 main merge, a Pages deployment, or resuming N11/N13/N14 creation. If the intended *previous design* was another style, revise P-001 first.
