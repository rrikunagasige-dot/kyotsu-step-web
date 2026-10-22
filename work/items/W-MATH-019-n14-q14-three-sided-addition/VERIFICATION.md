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
