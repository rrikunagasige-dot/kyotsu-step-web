# W-MATH-019/P-003 — Q14 320px numbered review left-edge clearance
Status: APPROVED — user exact reply 「いいよ」; P-003 scoped CSS implemented; technical verification pending
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正, WORK_SYSTEM 12A/12B

## Verified problem
Real Chromium #39709378275 at SHA 4700299964b946cb9dc440606dd986dfe233b2ad: 5/6 cases PASS; 320px marked review FAIL. Original 225px vs 220px inner-width assertion no longer fails. The next assertion finds a math child left coordinate 47.125px against minimum 47.578125px, exceeding 1px allowance by 0.453125px (1.453125px outside formula line). Reviewed 390/1440 and ordinary 320/390/1440 PASS. P-002 approval and CSS implementation stand; no full Gate1 PASS. No reapproval of math content needed. P-003 only PROPOSED, code not changed.
Source evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39709378275

## Exact isolated candidate CSS (NOT yet authorized)
Keep existing Q14 430px .4rem rule and Q10 styling. In src/review/review.css, within the existing <=350px Q14-only media rule, replace padding-inline: .15rem with padding-inline: 0.
Selector is .review-preview [data-testid="review-mark-n14-formula-14"] inside @media (max-width: 350px).
This adds 0.3rem total interior clearance (approx. 4.8px at root 16px); it is a hypothesis and NOT yet proven to correct left-edge bounds.
No other CSS, JSX, formula, answer, learner button size, hints, Q10, Q15, N11, revision, main, hosting or public app change.

## Technical checkpoints after separate approval
Re-run authentic source-SHA Chromium 320/390/1440 numbered review and normal lesson, require all six formula fragments within both sides of their formula box and correct inner width. Do NOT relax the 1px position tolerance or shrink original blue choice/red wrong control. Check wrong/hint/retry, keyboard, five answers, timing and exact SHA screenshot persistence.
Reconfirm previously accepted N11/N14 not affected; keep broad Gate2 and whole-app Gate3 separate. If zero padding fails again, STOP, gather geometry evidence, propose a new exact design; no unapproved CSS trials.
User prefers a concise equation-only presentation for Q14 Gate1 once native review technical checks pass. Do not ask user to inspect all image files.

## Exact approval request
Approve ONLY Q14 yellow numbered review <=350px horizontal padding .15rem -> 0? P-003 remains proposed until explicit reply.

## Exact approval ledger — 2026-10-22 JST
The user directly replied **「いいよ。」** to the P-003 exact yes/no question. This authorizes ONLY the Q14 yellow numbered review wrapper `padding-inline:.15rem → 0` for widths <=350px, and its direct code-SHA/browser verification and Work records. It does not approve edits to formulas, buttons, Q10/Q15, earlier accepted blocks, main/Pages, deployment, Gate① visual reception, Gate② or Gate③. If Chromium still fails, STOP and return to REVISE-PROPOSAL without guessing extra CSS.
