# W-MATH-019 — N14 Q14 三辺の同時加算を生徒が導く
Status: VERIFYING
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正; WORK_SYSTEM §§12A–12B.
Authority: main Constitution/dictionary, MASTER §52–54, Mathematics Textbook SPEC §§5–8; live main 15ae503455bc6ae75b080caa1c4919cafb250027; based on isolated review branch 857127cba2351054a1070b65b10cda2a56d64209.

Root cause from W-MATH-017/F-017-03 and F-017-08: existing original N14 Q14 grades the *combined operation+completed inequality* as one choice. Student should operate on every member and calculate endpoints, without seeing the final range early.

Exact candidate [P-001](./PROPOSAL_P001.md) is authored only. Nothing in src/, CSS, public/, tests, original Word, published main or app is changed by this proposal. Stage Q14 approval, then bounded implementation/real-screen QA/Gate①; N14 Q15 is separate next block. Earlier accepted Q10/N14 Q07-Q08-Q12/N11 are not reopened merely by starting Q14. Whole Gate② remains open by [W-MATH-018 audit](../W-MATH-018-n14-q10-three-sided-inequality/CROSS_BLOCK_AUDIT_20261022.md); Gate③ is not ready.

User replied exactly 「继续」 immediately to the specific Q14 5-hole proposal and explicit implementation offer. P-001 APPROVED for Q14 only. Scoped implementation in isolated draft PR #108 underway. No authorization for Q15, main/Pages, hosting, or release. Continue static and Chromium verification; no claim of Gate① acceptance until after actual evidence.

## 2026-10-22 — P-001 full CI PASS but real Gate① review 320px FAIL → P-002 awaits consent
- SHA `8c0c7d0967ba91b28474d0f67f35b0bd5159e783`: [full Math Textbook #39655429435](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429435) **SUCCESS**, [Review Code #39655429375](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429375) **SUCCESS**, [Governance #39655429352](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429352) **SUCCESS**, [Math Practice #39655429357](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39655429357) **SUCCESS**. 3 math lines, reason, five local answers and historical migration are tested. This CI did not prove the narrower yellow reviewer frame at 320px.
- Exact-source live Chromium #39707797563 at `594c17c7226bdcbab67a255d50e1773cfd880aac` tested reviewer and normal app at 320/390/1440. **5/6 PASS, reviewer-only 320 FAIL**: interior 225px scroll vs 220px available; original full-size holes must remain. Real screenshots of the five passing routes retained in artifact ID 12396235441, failed 320 trace and screenshot in Actions; no claim of complete Gate①.
- Root and smallest proposed remedy in [P-002](./PROPOSAL_P002_320_REVIEW_INSET.md): CSS ONLY the Q14 numbered-review wrapper at <=350px, padding-inline .4rem→.15rem, predicted +8px clearance; no learner data, prior approved Q10, Q15, main, public changes. **USER P-002 CONSENT PENDING**. Gate② and Gate③ still not closed. Old P-001 math approval not reopened.

## 2026-10-22 — P-002 user approved, exact CSS-only correction (current)
- User reply **「いいよ」** to the explicit new P-002 approval request is authoritative. On <=350px only Q14's yellow `[data-testid="review-mark-n14-formula-14"]` horizontal inset changes from .4rem to .15rem. Q10 and all other reviewer markers, normal lesson and buttons retain existing CSS. No math/React/answers/history changes.
- Prior native 320 review failed 225px content vs 220px inner width; predicted +8px from this authorized correction. Must measure anew before claiming PASS, record exact current learner SHA and genuine screenshots.
- Gate① user visual acceptance of Q14, independent Gate② and playable SHA-matched Gate③ remain OPEN. Draft PR #108 and main unchanged; Q15 correction is a distinct future Work.


## 2026-10-22 P-002 verified stop / P-003 pending
Real Chromium #39709378275 at SHA 4700299964b946cb9dc440606dd986dfe233b2ad: 5/6 cases PASS; 320px marked review FAIL. Original 225px vs 220px inner-width assertion no longer fails. The next assertion finds a math child left coordinate 47.125px against minimum 47.578125px, exceeding 1px allowance by 0.453125px (1.453125px outside formula line). Reviewed 390/1440 and ordinary 320/390/1440 PASS. P-002 approval and CSS implementation stand; no full Gate1 PASS. No reapproval of math content needed. P-003 only PROPOSED, code not changed.


## 2026-10-22 — P-003 exact approval and 320px-only Q14 yellow reviewer scope
- User replied **「いいよ。」** immediately to W-MATH-019/P-003, separately authorizing only the Q14 yellow numbered reviewer CSS <=350px from `.15rem` to `0`; full-size original buttons, three logical formulas, five choices, revision8 answer archive, Q10 and Q15 stay untouched.
- Review the real native 320/390/1440 numbered and normal app test results after code commit, including six fragment bounds, blue「選択」/red「×」, keyboard/hint/wrong/retry, and authentic SHA-based screenshot preservation. Failed 320 prior P-002 history remains preserved.
- Gate① Q14 user visual acceptance PENDING, independent Gate②/③ OPEN. Main/public app not modified.
