# Action Log — W-MATH-007

## A-001 — User's coefficient-one display feedback, source-only audit (2026-10-18 JST)
User approved publishing W-MATH-006's N12 visual fix with 「いいよ」 and added a separate display correction: coefficient1 inserted before x should read x, not 1x. Published design PR #83 merged at 066e0da905bf4948e25ec200fe1b46e34d6ed573; Pages deploying independently.
Read current main source: N12 Q06-left authored formula parts use choice n12-p002-q06-left-coef followed by math x+2\\le4. Record value "1" is rendered as its own InlineMath. Source audit identified exact root cause, constants and other coefficients protected. Drafted P-001 only and stopped before learner code changes, awaiting exact approval.

## A-002 — Exact P-001 implementation approval and isolated branch (2026-10-18 JST)
User answered 「いいよ続けて」 immediately after the exact W-MATH-007/P-001 proposal. Interpreted as permission for isolated implementation and QA only; no main merge or Pages release. Created work/W-MATH-007-coefficient-one-display-implementation-20261018 from proposal commit 5c4b845ca7935a15dd2c5e4690fd223b63536289.

Planned code delta is limited to formula-part-boundary rendering when a resolved formula choice value is exactly "1" followed by a simple x+… factor: keep the resolved element visible as x, trim one leading x from the next displayed math part; retain progress.value="1", wrong-answer behavior, all 26 N12 answers, original teaching text and other lesson sources. E2E assertions check visible expression, neighboring coefficients/constants and reload. Verification and wider sibling-impact scan follow this code commit.
