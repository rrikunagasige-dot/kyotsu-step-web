# W-MATH-018 — N14 Q10 三辺同時の式変形を復元

## P-001
Status: PROPOSED — explicit user approval required; NO CODE IMPLEMENTATION
Date: 2026-10-21 JST. Canonical command: CMD-WORK-001 修正; WORK_SYSTEM §§12A,12B.
Existing source: src/data/textbook/math/numbers/n14Lesson.ts, revision 6, original N14 Q10. The linked §12B impact ledger is W-MATH-017/P-003.

### Original source and defect
The original teacher Word v2 indexed Library text states: 「【10】だけを中央へ残すため、各辺に同じ操作をしよう。」 The Word maths embedded objects could not be materialized, so direct mathematical OOXML fidelity is UNVERIFIED, not PASS.
Current GitHub N14 Q09 derives |x−3|<5 to −5<x−3<5. Current Q10 asks one ready-made choice containing BOTH 「三辺に3を足す」 AND the already calculated interval 「−2<x<8」. Thus the student never decides separately how all three members are transformed or computes the two endpoints. This is the confirmed same-root defect fixed previously in N11, but the three-sided version needs its own design.

### EXACT learner math and placement
Use one continuous derivation frame with shared derivationId n14-q10-chain. Exactly THREE mathematical lines and ONE intervening short explanatory paragraph; do not mechanically add a fourth row:

Formula 1:    −5 < x−3 < 5

Formula 2:    −5+[3] < x−3+[3] < 5+[3]

Explanation:  三辺に同じ数を足しても、二つの不等号の向きは変わらない。真ん中の−3と＋3が打ち消し合い、xだけが残る。

Formula 3:    [−2] < x < [8]

Display explanation only AFTER all three additions are chosen. Do not print lower/upper results before their separate holes are answered. Preserve strict signs (<), not ≤; do not create a generic learner 「確認」 heading or five separate white formula cards. Keep original Q09 answer and Q10 closing text as meaningful context outside the grouped derivation; Q11 remains as is.

### Five distinct graded decisions, exact keys
N14-Q10 is ONE original source marker mapped to FIVE graded items:
- New n14-wm018-q10-add-left : 3; distractors −3, 2, 5.
- New n14-wm018-q10-add-center : 3; distractors −3, 0, 5.
- New n14-wm018-q10-add-right : 3; distractors −3, −5, 2.
- EXISTING n14-10 changes grading meaning to numeric lower endpoint −2; distractors 2, −8, −5.
- New n14-wm018-q10-bound-right : 8; distractors 2, 5, −8.
Repeating 3 across three members is purposeful: the student must preserve an equal operation across both inequalities. Computing −5+3 and 5+3 are separate arithmetic decisions. Original N14 Q01–Q16 remain 16 source markers, +4 actual student decisions relative to revision 6.

### Progress, do-not-touch boundary, risks
N14 revision6→7 migration is MANDATORY because stable n14-10 meaning changes. Archive ALL old v6 answers, answer times/completion, and keep previous revision archives. Reopen ONLY n14-10 in active answers; add 4 new IDs unanswered; all other current answers (especially original Q07/Q08/Q12, Q09/Q11), historical acceptance and reset provenance remain. The exact correction scope if approved is N14-Q10 source block/items, N14-only migration in src/domain/textbook.ts, directly affected tests and genuine Q10 Gate① review route.
DO NOT CHANGE earlier accepted N14 Q07 proof (W-MATH-014), Q08 proof (W-MATH-015), Q12 OR-branch proof (W-MATH-016), N14 original figure n14-f01 or its timing, N14 Q14/Q15 (different pending sibling proposals), other N units, Math Practice/Physics, shared generator/renderer/CSS, teacher Word, main/Pages or public host. Keep source 16 labels exact.
A three-blank row may be wide at 320px: use authentic screenshot to detect clipping; if the approved form requires material redesign, STOP and reapprove rather than silently changing layout.

### Verification and gates (only following explicit approval)
Mathematical equivalence for boundary/interior/exterior points: −5<x−3<5 iff −2<x<8. Verify three formula rows, one conditional reason, 5 separate answer/hint/distractor types, no premature answer/leak, Q09→Q10→Q11 gating, selective v6→v7 history and unaffected earlier approved blocks. Real Chromium normal learner + review-only changed-block screenshot at 320/390/1440px, SHA exact, wrong/hint/retry/resolved, fit/no overflow. Gate① user only inspects new Q10; Gate② independent source/progress/math/other modes; Gate③ whole-app SHA-matched playable URL and user 総チェックOK distinct.

### Approval history
Status: WAITING; user has NOT approved N14-Q10. P008 Gate① affirmative 「いいよ続けて」 is not P001 authorization. Ask explicit unchanged proposal approval before editing any N14 code.

**Approval requested: exactly these 3 equation rows, 1 reason, 5 holes and selective N14 v6→v7 migration?**
