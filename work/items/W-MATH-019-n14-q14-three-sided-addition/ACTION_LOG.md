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
