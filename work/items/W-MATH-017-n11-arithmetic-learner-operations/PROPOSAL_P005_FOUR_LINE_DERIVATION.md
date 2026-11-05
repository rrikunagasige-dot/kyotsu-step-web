# W-MATH-017 / P-005 — 4行の連続式変形と式中の穴
Status: APPROVED
Approval: user explicit 「欸对对对就是这样」 directly in response to “このP-005で進めてよいですか？” (2026-10-21 JST).
Command: CMD-WORK-001 修正; Supersedes unapproved P-004; preserves user-approved P-003 Q01.
Baseline main: `15ae503455bc6ae75b080caa1c4919cafb250027`

## Exact approved mathematical lesson
Show one **vertical mathematical chain**, with interactive gaps inside it, not prose-driven stand-alone quiz cards:

```text
3x - 2 < 5
3x - 2 + [2] < 5 + [2]
3x < [7]
x < [7/3]
```

Two `2` gaps have distinct learner purpose: cancel -2 on LHS and mirror identical operation on RHS. This preserves the user's explicit depiction of **two holes** without one compound full-answer choice. Q05 owns three learner decisions (LHS operation, RHS balance, numeric RHS); original Q06 owns fractional RHS decision. At no stage show a later completed numerical row before the prior row has been correctly answered. Keep brief support **outside** the formula chain, don't make long sentences primary.

## Implementation authorization
- N11 Q05/Q06 only, source IDs `N11-Q05`, `N11-Q06` unchanged; genuine old `n11-01` Q01 fix unchanged.
- Local `derivationId` in four consecutive formula blocks (existing shared renderer capabilities); existing canonical N11 group-2 "確認" removed, meaningful section heading retained.
- Preserve prior choice IDs `n11-wm017-q05-operation`, `n11-05`, `n11-06`; add `n11-wm017-q05-balance`; update Q06 key semantics (whole operation+answer -> only fractional result).
- Revision7 -> 8 migration: archive previous revision in full, selectively reopen changed Q06, new balance decision starts unanswered; old Q01/Q05 successful answers remain.
- No global renderer, CSS, generator, original Word, figures, protected approved blocks Q11/Q14, other modes, publication/main.
- Test 4 visible equation lines in one derivation frame at 320/390/1440; check gating, wrong/hint/retry, Q07 boundary handoff, historical revision chains, 123 Word markers, 144 final learner decisions; evidence screenshots with exact SHA, Gate① user review only new modified block; Gate②/Gate③ remain open.
