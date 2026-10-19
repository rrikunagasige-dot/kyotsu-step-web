# Verification — W-GOV-008/P-003 visual pilot

Status: TECHNICAL-PASS / BLOCK-CHECK-PENDING (user has not accepted)

| Gate | Observed result |
| --- | --- |
| Authorization/isolation | PASS — pilot branch starts from P-002 exact head, main `154a16ff379321016f4692bb0ac6fe9a8a596214` untouched; no app lesson changes |
| Actual seven visible marks | PASS — captures N01 Q07 (3) + N03 Q10 (4) from real app with previous steps advanced by Playwright |
| Mobile + desktop | PASS — 14 PNG (390px and 1440px); capture run `39203622766` |
| Full source/build SHA | PASS — captured `3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141`, assertion against GitHub SHA |
| Learner state isolation | PASS — E2E tests assert no persistent learner writes |
| Governance, TS, lint, Vitest, build, E2E | PASS — visual run `39203622766`; governance `39203622823` |
| Human-readable actual screenshot | PASS inspected — corrected N01 frame, N03 marks; F-005 formula horizontal legibility note retained |
| GitHub hosted per-mark inline screenshot sheets | PENDING final exact-path/readability verification at committed review branch |
| User `細部OK` | NOT RECEIVED; do not mark block approved |
| Later horizontal audit and `総チェックOK` | NOT READY, not performed |
| Deployment, billing, main | NONE |
