# W-MATH-003 — 数学Ⅰ「数と式」教科書モード「作成」
Status: BLOCKED
Blocker: Original DOCX math/formula and embedded figure source unavailable for exact reconstruction.
Updated: 2026-10-17
Repo: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Base main at Work open: `c184077a745c7d4bc077e0b5d0eaa70e9af2ddaf`
Branch: `work/W-MATH-003-numbers-expressions-textbook-20261017`

## Objective
CMD-WORK-002「作成」P-001: 既存の数と式Word案全16単元を監査し、数学教科書モードの思考導入・本文内穴・概念→性質→必要なら証明→例題・必要な図へ再設計し、新章としてアプリへ導入する。まずpilot N01/N03/N10/N12で検証し、ユーザーレビュー後に他単元へ展開する。

## Source / authority
- Prior uploaded Word: `01_数と式_教科書モード_対話段階導入版_v2.docx` (212863 bytes, 53 pages; Library ref `file_000000001c2082099e18f3f93760a31e`; original text available but Word raw bytes/embedded equations inaccessible in current tool).
- Previous user-reviewed creation inventory/proposal: `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md` (conversation generated artifact). This Work's `PROPOSAL.md` records its material content and approval.
- `governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-002; `work/templates/CREATION_DESIGN.md`; `subjects/mathematics/textbook/SPEC.md` (candidate, subordinate to accepted source); `docs/MASTER_APP_LESSONS.md`, `docs/MATH_RENDERING_RULES.md`, `docs/INFORMATION_ARCHITECTURE_RULES.md`; accepted `集合_教科書モード_完成版_v1(1).docx`.
- Bibliographic source identified within Word: 『教科書ガイド 啓林館版 深進数学Ⅰ』(教科書: 数Ⅰ 711). The teacher-authored Word is not the publisher's textbook itself.

## Scope
16 units N01–N14, NE01–NE02 / 233 printed prompt markers / 12 referenced figure IDs. Source fidelity first; design a full chapter with pilot N01, N03, N10, N12. Establish stable IDs/course order, preserve 3 conceptual headings + separated advanced topics, avoid over-converting thin holes, implement only after exact source and pre-pilot design review.

## Do Not Touch
Existing `math-sets`, propositions, functions/review sources, mathematics practice, physics modes, user progress and stable IDs, Constitution/commands, original source Word/figures, production/main and published routes until separate release authority.

## Approved Proposal
`P-001` — **APPROVED** 2026-10-17: user reviewed the 16-unit audit + P-001 plan and responded 「いいよ。こうやって作ろうか」, directly accepting the immediately presented plan. This approval allows source recovery, inspection, detailed design, pilot preparation/implementation within scope; it does **not** authorize guessing lost original equations or skipping source/pilot review gates, nor main merge/Pages publication.

## Current Step
P1 source exact-data gate **BLOCKED**: Library text recovers conceptual prose but drops most embedded Word equations/variables and figures; raw materialization declined. Targeted Mac Downloads/file-index searches returned no matching local Word. No source math correctness PASS; no app implementation begun.

## Next Step
Ask for original DOCX attached again or a readable exact-source transfer. Render page images, extract oMath and drawing/media, verify questions/figures and source rights. Then complete pilot node design, deliver detailed user-reviewable sample and only then implement pilot in feature branch.

## Dependencies
Ability to read original equation objects and figures, full answer key when available, exact permissions to reuse images/teacher wording. Original math textbook master skill may remain unavailable; report gap, do not fake reading it.

## Completion
Pilot/remaining units technical QA and user hands-on acceptance, separate main/release approval, Work/Memory Close. This Work is NOT DONE.
