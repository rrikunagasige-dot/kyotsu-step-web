# W-MATH-019 — ACTION LOG
Status: IMPLEMENTING

## User approval and scoped implementation (2026-10-22 JST)
- Exact user reply 「继续」 approves the adjacent precise P-001 equation-only preview.
- Branch work/W-MATH-019-n14-q14-proposal-20261022; Draft PR #108 based on existing review PR #107 (not main).
- N14 source only Q14: 3 logical equations, one interstitial explanation, 5 holes (2,2,2,-2,6), all original formula buttons kept. Q13 and Q15 unchanged. N14 review revision7→8 adds 4 interactions to 30.
- Selective archive in src/domain/textbook.ts: old n14-14 only re-keyed, prior revision answers preserved.
- CSS only Q14 mobile 2 visual rows and matching Q14 review wrapper padding; review target registered for Q14 and Q10 previously accepted marker suppressed; original Q10 formula/answers unchanged.
- Typecheck on first CI of intermediate state found typing oversight in new test; corrected. Governance on first CI required normal-form Status and mandatory Work files; corrected without changing learner formula.
- E2E/real 320/390/1440, full CI, Gate① user visual, Gate② and Gate③ pending. Do not claim PASS in advance.

## 2026-10-22 real Gate①: failed at narrower yellow reviewer 320
- At test source SHA `594c17c7226bdcbab67a255d50e1773cfd880aac` [genuine Chrome #39707797563](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39707797563) had exactly 1 failure / 6 cases: review marked Q14 320 innerScrollWidth 225 > clientWidth 220. Review 390, review PC 1440 and normal lesson 320/390/1440 PASS; code P001 maths and main intact. Artifact 12396235441 retained partial images. Stop; no fabricated visual PASS.
- Exact [P-002](./PROPOSAL_P002_320_REVIEW_INSET.md) authored only, proposed 320-only Q14 yellow inset .15rem, not implemented or approved. Preserve earlier accepted N11/N14; await new user consent.

## 2026-10-22 — P-002 approved by user「いいよ」 and narrowly implemented
- Exact new P-002 approval received after authentic Chromium 320-only reviewer 225 vs 220 FAIL. Changed only reviewer-specific `src/review/review.css` at <=350px for `review-mark-n14-formula-14` to `padding-inline:.15rem`. Added append-only Work and approval records. No formula button resizing, other CSS refactor, source lesson, Q15, main or public app change.
- Verified results must be linked to SHA after rerun; no Gate① acceptance before native screenshots/tests pass and user replies to requested concise Q14 mathematics layout.


## 2026-10-22 P-002 native QA failed
Real Chromium #39709378275 at SHA 4700299964b946cb9dc440606dd986dfe233b2ad: 5/6 cases PASS; 320px marked review FAIL. Original 225px vs 220px inner-width assertion no longer fails. The next assertion finds a math child left coordinate 47.125px against minimum 47.578125px, exceeding 1px allowance by 0.453125px (1.453125px outside formula line). Reviewed 390/1440 and ordinary 320/390/1440 PASS. P-002 approval and CSS implementation stand; no full Gate1 PASS. No reapproval of math content needed. P-003 only PROPOSED, code not changed.
Stopped per P-002 rule; no weakening of tests, button shrinking, or speculative CSS applied.

## 2026-10-22 — P-003 explicitly approved and narrow CSS implemented
- Exact user reply 「いいよ。」 to P-003 (`Q14 yellow numbered reviewer <=350px padding-inline .15rem -> 0`). Applied only one CSS property to `src/review/review.css`, no learner math/buttons/Q10/Q15/revision changes.
- All native screenshot/test checks remain subject to their actual post-change source SHA. No Gate①/②/③ completion assumed.

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
