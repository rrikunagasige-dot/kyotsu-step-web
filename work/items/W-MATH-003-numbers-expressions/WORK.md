# W-MATH-003 — 数学Ⅰ「数と式」教科書モード作成

Status: BLOCKED-SOURCE / DESIGN-IN-PROGRESS
Updated: 2026-10-17
Repository: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Base main: `c184077a745c7d4bc077e0b5d0eaa70e9af2ddaf`
Branch: `work/W-MATH-003-numbers-expressions-pilot-20261017`

## Objective
ユーザー承認済み `CMD-WORK-002「作成」` に従い、従来Word「01_数と式_教科書モード_対話段階導入版_v2.docx」を参照し、数学Ⅰ数と式（本編N01–N14＋発展NE01–NE02）の教科書モードを設計し、新しい章としてアプリへ導入する。

## Authority
`governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-002、`governance/WORK_SYSTEM.md`、`work/templates/CREATION_DESIGN.md`、`subjects/mathematics/textbook/SPEC.md`、現在のユーザー承認済み「集合」母版、`docs/MASTER_APP_LESSONS.md`、`docs/INFORMATION_ARCHITECTURE_RULES.md`、`docs/MATH_RENDERING_RULES.md`。

## Source inventory
Previously uploaded personal Library `01_数と式_教科書モード_対話段階導入版_v2.docx`; 53 pages / 212,863 bytes / 2026-10-10; Library file ID `file_000000001c2082099e18f3f93760a31e` (not a filesystem path or downloadable GitHub attachment).
- Audited structure: 16 units, 233 numbered question markers, 12 identified figure IDs. Source document is a third-party teacher's edited learning-mode proposal, **not the publisher's textbook original**.
- Library *text* indexed and readable. Embedded Word mathematics objects/equations/diagrams missing in indexed extraction; authorized raw-byte materialization failed. Read-only checks of connected Mac Downloads/Documents and Spotlight did not locate a local copy. **Do not invent or reconstruct missing source questions without verifying the exact originals**.

## Scope approved by user
P-001: Full coverage/source review then representative N01 (definitions + inline holes), N03 (derivation + multiplication table), N10 (proof + example), N12 (number line + practical inequalities), pilot QA + user visual acceptance before batch authoring other units. Build new stable ID/route/catalog without overwriting existing `集合`, `命題`, `関数`, math practice or physics. Independent PR; final merge/Pages requires separate release approval.

## Do Not Touch
Existing app source/data until source gate passes, main, original Word, already approved lessons/figures, learner state IDs, physics/practice modes.

## Approved Proposal
`PROPOSAL.md` P-001: user said 「いいよ。こうやって作ろうか」 on 2026-10-17 responding to the exact previous plan/approval request; no new conditions.

## Current step
Complete detailed four-pilot teaching-node plan and source fidelity/figure checklist while waiting for original equations/graphics. This is a design-only GitHub branch; no app implementation yet.

## Next step
**Blocker**: Obtain upload/downloadable original Word or its accurate PDF rendering with equations and figures; compare all pilot equations/answer content; only then implement pilot UI in independent branch following approved P-001. Do not seek new approval for unchanged P-001.

## Completion conditions
16/16 source coverage and 233-marker decision log, 12/12 figure verification, verified mathematical solutions; staged pilot with full QA (PC/mobile/rendering/regressions), PR+review link, explicit user hands-on acceptance. Remaining batch promotion and release use separate gates.
