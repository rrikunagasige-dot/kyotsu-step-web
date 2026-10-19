# Verification — W-GOV-008/P-003 visual pilot

Status: TECHNICAL-PASS / BLOCK-VISUAL-OK (both named blocks only)

| Gate | Observed result |
| --- | --- |
| Authorization/isolation | PASS — pilot branch starts from P-002 exact head, main `154a16ff379321016f4692bb0ac6fe9a8a596214` untouched; no app lesson changes |
| Actual seven visible marks | PASS — captures N01 Q07 (3) + N03 Q10 (4) from real app with previous steps advanced by Playwright |
| Mobile + desktop | PASS — 14 PNG (390px and 1440px); capture run `39203622766` |
| Full source/build SHA | PASS — captured `3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141`, assertion against GitHub SHA |
| Learner state isolation | PASS — E2E tests assert no persistent learner writes |
| Governance, TS, lint, Vitest, build, E2E | PASS — visual run `39203622766`; governance `39203622823` |
| Human-readable actual screenshot | PASS inspected — corrected N01 frame, N03 marks; F-005 formula horizontal legibility note retained |
| GitHub hosted per-mark inline screenshot sheets | PASS — reviewed actual GitHub contents and all 10 image blobs (7 inline marks, 3 PC extras), at commit `4e34495d3e6d16b7049182877f83cba2a49d8ad4` |
| User `細部OK` | PASS — exact 2026-10-19 14:55 JST user reply explicitly accepts N01 Q07 and N03 Q10 actual screenshots; original SHA/IDs in `ACCEPTANCE_LOG.md`. Visual only. |
| Later horizontal audit and `総チェックOK` | Gate ② technical checks ran; some independent evidence pending. Gate ③ full-app check NOT READY and no `総チェックOK` recorded. |
| Deployment, billing, main | NONE |
