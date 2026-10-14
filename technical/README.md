# Technical navigation — target app
Status: CANONICAL ROUTER
Date: 2026-10-10

Do not use upstream `technical/architecture`, `technical/schemas`, or `backend/` as target implementation authority. Upstream technical docs are preserved under `history/imports/paulfields83-20261010/technical/` for comparison only.

Target implementation authority:
- `docs/ARCHITECTURE.md`
- `docs/QUESTION_SCHEMA.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DEPLOYMENT.md`
- `docs/REQUIREMENTS_MATRIX.md`
- `WORKFLOW.md`
- `src/data/mathPractice/` and `src/data/textbook/` actual data.

## Paul版との一致と意図的な差分
旧Paul版の6つの `technical/` 文書は `history/imports/paulfields83-20261010/technical/` に保存済み。人間・AIが以前の設計思想を追跡するには参照してよいが、backend込みの構造をこのtargetにそのまま移植してはならない。原資料・現在のアプリ正本は上記 `docs/` と `src/` を優先する。差分は `work/items/W-GOV-007-repository-os-parity/PARITY_AUDIT.md` を参照。
