# W-MATH-019 — VERIFICATION
Status: VERIFYING
Date: 2026-10-22 JST
Source: Work/W-MATH-019 P-001, main baseline 15ae503455bc6ae75b080caa1c4919cafb250027.

| Check | Status |
| --- | --- |
| User exact proposal approval 「继续」 | APPROVED — Q14 only |
| Q14 3 logical equations + 1 reason + 5 separate holes | DRAFT IMPLEMENTED; tests pending |
| Q13/Q15, Q10 and prior accepted N11/N14 unchanged | diff comparison pending |
| N14 16 Word marker IDs and 30 operations / rev8 | tests pending |
| N14 rev7→8 archives and selective reopening | unit tests pending |
| 320/390 mobile and 1440 PC authentic Chromium | UNVERIFIED |
| Original blue「選択」 / red「×」 unchanged | source code checked; real screen pending |
| Gate① user visual acceptance of Q14 | PENDING |
| Gate② independent broader audit | IN PROGRESS / NOT CROSS-VERIFIED |
| Gate③ SHA-matched whole-app playthrough | FINAL-REVIEW-NOT-READY |
| Main / Pages / public application | UNCHANGED |

No synthetic image can substitute for native screenshots. Report CI status accurately after it completes.

## 2026-10-22 — actual P001 technical evidence and reviewer defect
- Target source SHA `8c0c7d0967ba91b28474d0f67f35b0bd5159e783` real full CI: textbook [#39655429435](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429435), review code [#39655429375](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429375), governance [#39655429352](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429352), math practice [#39655429357](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429357) **ALL SUCCESS**. These runs verify version8 migration, 16 original markers, 30 interactions and unrelated regressions; not equivalent to human visual acceptance.
- SHA `594c17c7226bdcbab67a255d50e1773cfd880aac` differs from above only in Gate① test/workflow; Q14 mathematical learner data and stylesheet unchanged. Real 6-case screenshot [#39707797563](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39707797563): **review 320 FAIL (225>220) / review390 PASS / review1440 PASS / normal320 PASS / normal390 PASS / normal1440 PASS**. Failing video/trace and passing screenshots retained via artifact ID 12396235441; no Gate① PASS.
- Gate① = **FAILED-VERIFICATION**, P-002 targeted reviewer-only correction proposed (UNAPPROVED); Gate② **NOT CROSS-VERIFIED**, Gate③ **NOT READY**, main/Pages/public unchanged. Do not ask user to reapprove P001 maths or previously approved N11/N14.

## Current authorized P-002 review-only code adjustment (2026-10-22)
- User explicitly said **「いいよ」** to exact 320px review-only inset correction; `src/review/review.css` adds scoped <=350px 0.15rem rule without touching normal learner or canonical button styles. Actual native Chromium recheck 320/390/1440 required, not presumed. Previous P-001 global full CI success is not a pass for this CSS-only fix. Gate①/Q14 user acceptance PENDING. Gate② and Gate③ remain NOT DONE.


## P-002 exact native QA checkpoint 2026-10-22
Real Chromium #39709378275 at SHA 4700299964b946cb9dc440606dd986dfe233b2ad: 5/6 cases PASS; 320px marked review FAIL. Original 225px vs 220px inner-width assertion no longer fails. The next assertion finds a math child left coordinate 47.125px against minimum 47.578125px, exceeding 1px allowance by 0.453125px (1.453125px outside formula line). Reviewed 390/1440 and ordinary 320/390/1440 PASS. P-002 approval and CSS implementation stand; no full Gate1 PASS. No reapproval of math content needed. P-003 only PROPOSED, code not changed.
Governance #39709378281 SUCCESS, Math practice #39709378228 SUCCESS; Review Preview workflow #39709378275 FAIL (320 marked reviewer). Full Textbook CI #39709378334 was still in progress at this checkpoint. Gate1 user visual PENDING, Gate2 OPEN, Gate3 NOT READY, main/public unchanged.

## 2026-10-22 P-003 exact acceptance and review-only code checkpoint
- P-003 separately APPROVED by user 「いいよ。」; code only `@media(max-width:350px) .review-preview [data-testid=review-mark-n14-formula-14] {padding-inline:0}`. Original P-001 learner math, full-size choice buttons and Q10/Q15 unchanged. Prior P-002 measured 320 marked review failure remains real; only post-P003 authentic Chrome proves correction.
- Status VERIFYING; 320/390/1440 real app photos and full CI not yet asserted, Gate① user acceptance PENDING, Gate② and Gate③ OPEN.

## 2026-10-22 — P-003 genuine Chromium 6/6 PASS (Q14 review-only)
- Exact user P-003 response 「いいよ。」 separately authorized Q14 yellow reviewer <=350px `padding-inline: .15rem → 0`, implemented in code commit `391468fc8fd9d8f990ddfc7873d8d51308851877` (only `src/review/review.css` plus approval/Work records). Q14 pedagogical source/5 answers, Q10, Q15 and canonical blue「選択」/red「×」 unchanged.
- [Real Chromium screenshot and six-case tests #39712477478](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39712477478): **SUCCESS** including previously failed **320px numbered review**, 390/1440 numbered review and normal 320/390/1440. All six formula fragments within bounds and internal width, canonical original size and state controls, focus/keyboard/wrong/hint/retry, five staged decisions, no KaTeX error. Previous P-002 320 failure remains preserved in history (now corrected by separately approved P-003).
- Actual app screenshot artifacts stored under [evidence/gate1](./evidence/gate1/README.md), auto-evidence commit `31c3a078cd77b7caff75c1be54db4eeb3a2021d9`. The README expressly binds the real image to **source SHA `391468fc8fd9d8f990ddfc7873d8d51308851877`**, NOT the screenshot-storage SHA. Images visually inspected, including 320px review-before, wrong and bound states.
- [Review Preview code check](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39712477478) SUCCESS; [governance #39712477506](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39712477506) SUCCESS; [Math practice #39712477534](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39712477534) SUCCESS. Full [math textbook #39712477602](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39712477602) was still running at this checkpoint and MUST NOT be called PASS until explicit completion.
- Gate① Q14 **TECHNICAL-SCREENSHOT-READY / USER VISUAL PENDING**. The user explicitly prefers ONLY the concise three-equation math representation inline rather than another lengthy screenshot gallery. Do not present the raw screenshots as the user confirmation UI, but keep them verifiable in GitHub. No inference from P-003 implementation approval to Gate① acceptance.
- Gate② broad independent math/source/history/figure audit OPEN; Gate③ SHA-matched playable whole app and user `総チェックOK` NOT READY. Draft PR #108 unmerged; main and published Pages untouched.

## 2026-10-22 — N14 Q14 user Gate① accepted (scoped, concise representation)
- The assistant displayed in ChatGPT only the user-requested concise 3-logical-equation N14 Q14 mathematical layout, with the middle logical equation visually split into 2 phone rows and one interstitial explanation. The user's **exact direct reply** to that displayed Q14 review was **「いいよ」**. Record this as **BLOCK-VISUAL-OK for N14-Q14's concise math/content layout only**; do not falsely assert the user inspected all 15 GitHub screenshots individually.
- Actual source-matched Chromium 320/390/1440 normal/numbered six-case PASS [#39712477478](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39712477478), source SHA `391468fc8fd9d8f990ddfc7873d8d51308851877`, genuine GitHub evidence commit `31c3a078cd77b7caff75c1be54db4eeb3a2021d9`. Subsequent evidence-only/documentation commits preserve the same learner formula and CSS. Exact images and original before/wrong/bounds source remain retained.
- As §12A requires, `reviewTargets['n14-q14'].reviewState` is now `accepted`, so **the next review output hides accepted Q14 numbered markers**, but keeps stable IDs, source markers, original evidence and provenance; review test updated. The old Q14 snapshot job skips recapture after acceptance rather than erasing previous images or failing a no-longer-applicable numbered-review assertion.
- This **does not grant** Gate② global CROSS-VERIFIED, Gate③ SHA-matched full playable app or `総チェックOK`, main merge, Pages/public staging or Q15 change approval. Related existing W-MATH-017/F-017-08 N14 Q15 bundled operation/result remains a separate **CONFIRMED correction candidate** subject to new bounded proposal. Previously accepted N11/N14 stays approved; no repeat request.
