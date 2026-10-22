# W-MATH-019/P-002 — 320px reviewer-only horizontal inset correction
Status: PROPOSED — USER APPROVAL PENDING
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正; WORK_SYSTEM §12B.
Source candidate code SHA: `594c17c7226bdcbab67a255d50e1773cfd880aac` (P001 Q14 mathematics unchanged).
Evidence: [Authentic Chromium #39707797563](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39707797563) at SHA `594c17c7226bdcbab67a255d50e1773cfd880aac`, screenshot artifact `wmath019-q14-real-gate1-594c17c7226bdcbab67a255d50e1773cfd880aac` (artifact ID 12396235441).

## Observed actual defect and root
The new Q14 normal 320px learning page PASSED; the numbered yellow review wrapper at exactly 320px FAILED its inner content width check: `scrollWidth = 225px`, `clientWidth = 220px`, i.e. **5px actual clipping** with full-size original choice buttons. The 390px numbered review, PC 1440px numbered review and all three normal routes PASSED (5/6 cases). In the isolated review wrapper only, CSS `.review-preview [data-testid="review-mark-n14-formula-14"] {padding-inline:.4rem}` remains after the general 5px yellow left border. This has less available content space than the normal lesson. The same-root pattern occurred in N14 Q10; now Q14's formula requires ~5px more clearance.

## Minimal exact proposed change (not implemented)
Change precisely **one Q14-specific review-only media override**, inside `src/review/review.css`, leaving the present <=430px `.4rem` rule intact for widths 351–430:
```css
/* W-MATH-019/P-002: Q14 yellow numbered reviewer at 320px only. */
@media (max-width: 350px) {
  .review-preview [data-testid="review-mark-n14-formula-14"] {
    padding-inline: .15rem;
  }
}
```
At a 16px root font, reducing each side from .4rem (6.4px) to .15rem (2.4px) gains 8px interior width, exceeding the measured 5px deficit and leaving ~3px margin. This is a testable predicted correction, **not yet a confirmed PASS**. 390px is unchanged. Do not shrink or alter any blue「選択」, red「×」, formula font, logical 3 equations, 1 explanatory paragraph, five holes, answer keys, learner source, Q10 or Q15.

## Same-root §12B impact sweep and pass criteria
- Confirmed failed: Q14 numbered-review 320px only (225 vs 220). Q14 numbered 390/1440 and Q14 ordinary 320/390/1440 are actual tested PASS. Narrow review Q10 has its own different selector; NOT-AFFECTED by exact proposed CSS. Previously approved Q07/Q08/Q12 and N11 Q05–Q09/Q13, all other modes and original data are NOT-AFFECTED by this new ID-only selector; unrelated pre-existing clipping not globally certified.
- After user approval, implement this exact CSS override only. Native Chrome rerun reviewer and ordinary six cases 320/390/1440; test every one of six math fragments is within the formula box and body; original blue/red button size, hint/wrong/retry, 5 gated answers, original figure/progress. Store genuine images and absolute source code SHA in isolated draft PR. Then re-open only Q14 Gate① in the user's requested **concise three-equation layout**; never replace visual evidence with invented render. Full independent Gate② and user Gate③ `総チェックOK` remain separate.
- STOP and report if width remains clipped or new overlap appears; no further unapproved CSS trials or unrelated refactors, no main/Pages/publication/cost changes.

## Approval boundary
P-001 was already approved and its mathematical content tested; P-002 exact 320px CSS change is **NOT APPROVED** yet. Await the user's direct `承認` or equivalent reply before altering any code. Existing P-001 approval cannot substitute for P-002 approval.
