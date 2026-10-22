# W-MATH-021 — Findings
Status: CONFIRMED

F-021-01: Q15 center's unresolved answer is 3, but after a wrong selection its help text explicitly prints 3x÷3=x. Direct answer leakage confirmed (after wrong only).
F-021-02 §12B: Q10/Q14 nearby corrected arithmetic hints guide rather than directly supplying an unresolved division. Q16 old after-wrong hint explicitly supplies 3x−2=−4 and 3x−2=4 to its checking choice; confirmed sibling outside this scope, requires separate decision. Broader unit/mode sweep remains UNVERIFIED.
F-021-03: Q15 3-equation / 5-blank display and historical source-SHA photos remain user-accepted; proposing this hint change does not reopen or negate accepted math Gate①.

F-021-04 / CONFIRMED FIXED (source `d7148e8e06cb3bcebd327f6ac382285be85866b7`): Q15 center after-wrong direct answer `3x÷3=x` is removed, replaced by user-approved positive-divisor reasoning sentence; dedicated real wrong/hint/retry Chromium #39722553067 at 320/390/1440 SUCCESS; full Math textbook CI #39722553169 SUCCESS. Same-root old Q16 endpoint worked answer still CONFIRMED separate proposal candidate; broader hint audit UNVERIFIED. Current Q15 arithmetic content and previously accepted math layout untouched.

F-021-05 (USER CORRECTION, 2026-10-22): P-001's no-leak factual hint PASS did not establish user acceptance of the didactic scaffold: user requested 「不有问句是引导」 immediately after real screenshot. Current text is a `考えよう` instruction plus a completed direction fact, not two direct questions. P-002 exact question-style revision PROPOSED / NOT IMPLEMENTED; prior P-001 genuine screenshots retained and prior approved Q15 mathematical layout not reopened. Root style signature `unanswered decision -> explanatory hint rather than interrogative guidance`; adjacent Q15/Q16 remain separate audit candidates, not licensed for mass editing.

F-021-06 (CONFIRMED USER CORRECTION 2026-10-22): P-002 two questions were insufficient because they supplied no low-threshold example or chain connecting 2×□=1 to 3×□=1, then 3x×□=x and equivalent 3x÷□=x. Correct root is absence of incremental example→generalization→current target, not merely insufficient interrogative grammar. New P-003 offers exact sequence, without giving the numerator reciprocal or positive divisor. Entire P-003 remains proposal only, Q15 accepted graded items untouched.


F-021-08 (VERIFIED): authorized one-hint P-003 source SHA 0718c4fcb06740ee52a5fdb8ac321f77c32ded2c, real browser 320/390/1440 #39729380880 SUCCESS, full textbook #39729380733 SUCCESS. Only Q15 center after-wrong hint differs from previous code. User replied 「続けて」 to the image-linked P-003 implementation report; accepted scoped continuation, no claims of individually viewing screenshots. Q16 separate confirmed correction candidate.

F-021-09 (USER EXPLICIT ACCEPTANCE): P-003 4-stage error hint Gate① scoped accepted by direct 「承認」 following the screenshot-linked display. Native 3/3 Chrome and CI SUCCESS source SHA 0718c4fcb06740ee52a5fdb8ac321f77c32ded2c. No Q16 authorization, broad Gate② and Gate③ remain open.
