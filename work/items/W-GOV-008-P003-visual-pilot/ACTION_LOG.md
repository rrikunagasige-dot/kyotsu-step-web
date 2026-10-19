# Action Log — W-GOV-008/P-003 visual pilot

- 2026-10-19 — Reconfirmed seven P-002 approved targets, P-003 GitHub-first review, current main and distinct draft PRs #95/#96.
- 2026-10-19 — Created independent pilot branch from exact P-002 head `a6d4e09be50ad5aaf731abc9352207f5d113a5a2`; no main, P-002 or P-003 original-branch change.
- 2026-10-19 — First run `39203069126` PASS but visual QA found N01 confirmation 1 vertically cropped in screenshot; logged as a defect in **capture**, not as a proven learner-code defect.
- 2026-10-19 — Capture centering fixed with document root-only vertical scroll; source/capture commit `3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141`.
- 2026-10-19 — GitHub Actions run `39203622766` PASS: governance, TS, lint, scoped Vitest, build, existing interactive E2E and 14 real screenshot E2Es (seven at 390 mobile and seven at 1440 desktop). Governance run `39203622823` PASS.
- 2026-10-19 — Downloaded artifact `12164484000` (14 PNG and 4 JSON; 1-day retention), inspected corrected N01 desktop/mobile and four N03 mobile screenshot pixels. Vertical target crop corrected; N01 long inline formula still partly clips horizontally in a single narrow view. Transparently disclosed in user sheet; no learner UI code changed.
- 2026-10-19 — Attached immutable image blobs and direct Markdown GitHub review sheets `docs/reviews/W-GOV-008-P003/N01-Q07.md`, `docs/reviews/W-GOV-008-P003/N03-Q10.md` to pilot branch; verify exact repo paths before asking for user feedback. Artifact ZIP is for engineers, **not** user's task.
- 2026-10-19 — Await `細部OK` or `要修正` separately for each block. Do not infer acceptance or final `総チェックOK` from passing automation.
