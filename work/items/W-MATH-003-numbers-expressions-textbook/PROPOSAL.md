# W-MATH-003 — Proposal and approval record

## P-001 — Source-audited 数と式 mathematical textbook creation

Status: APPROVED
Review gates: Original source, per-pilot review, app user acceptance, and release authorization remain separate.
Approval date: 2026-10-17
Evidence: In the immediately prior reply, the assistant presented the 16-unit source mapping + 12 figure IDs, 233 prompts, four representative units, and `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md`, asked user to review/approve P-001. User replied 「いいよ。こうやって作ろうか」 without conditions. No repeated confirmation required.

### Need
The Word is a previously teacher-prepared *teaching-mode draft*, not the unmodified textbook. Convert into a new mathematics textbook app chapter with an educationally meaningful guided narrative and interactive holes, not mechanical 233 blank cards or unchecked copying.

### Materials and scope
`01_数と式_教科書モード_対話段階導入版_v2.docx` — 53 pages; N01–N06 polynomials (93 question markers), N07–N10 real numbers (61), N11–N14 linear inequalities (54), NE01–NE02 advanced (25). Figures: N03-F01, N04-F01, N08-F01, N09-F01, N11-F01/F02, N12-F01/F02/F03, N13-F01/F02, N14-F01. Exact printed formulas and source diagrams not yet verified.

### Approved process
P1 Source manifest, exact formula/figure verification for 16 units/233 prompts/12 referenced drawings; original Word raw access mandatory.
P2 Complete concept/question dependency and source-to-node coverage map (full inclusion, exclusions explained, distinguish new authored prompts vs original).
P3 Reconstruct all original equations/answers and check mathematical correctness/conditions.
P4 Write natural hole-free teaching narrative with question→answer→consequence connections, then meaningful holes.
P5 Define thinking nodes, inline text/formula holes, choice and misconception feedback; concept/proof/example visual distinctions.
P6 Plan figure positions and before/after states, no premature answer leaks, 3-meaningful-heading information architecture with separate optional advanced lessons, fire graph.
P7 Show exact proposed changes/diff and representative unit designs to **user for review** before full pilot. If user requests materially changed scope, REVISE-PROPOSAL → full revision → STOP.
P8 Implement pilot in this order respecting dependencies (N01 concept, N03 distributive table, N10 proof, N12 number line + real-world inequality), using new stable IDs, isolated branch and existing app contracts. Do not fabricate original examples.
P9 Test actual app (math semantics, rendering/KaTeX, browser, mobile, regressions) and share preview/PR link for user hands-on QA.
P10 With approved pilot direction, work remaining 12 units in dependencies-aware batches: N02/N04–N06, N07–N09, N11/N13/N14, NE01/NE02; maintain full 16/16 coverage and 233-prompt mapping.
P11 main merge / official Pages release separately authorized; final acceptance and memory close. Rejection routes to `CMD-WORK-001 — 修正`.

### Locked teaching principles
Mathematics textbook (not practice): concrete question → meaningful reasoning → concept/definition → properties → proof if useful → worked example and reuse. Student-facing concept names in **black bold**, functional color only for holes/state. The completed text should read naturally. Avoid unknown-term guessing. Show full reasoning for nontrivial transitions, keep one derivation as a visual unit. Do not leak answers via prior captions/figures.
Figures must derive from source or separately approved figure specs; check math labels, scales, strict/closed endpoints, before/after timing, mobile.
Chapter headings conceptually compressed; internal IDs stable. Source questions/figures not silently changed.

### Affected / protected
Possible future new chapter assets, new lesson data/routes/registry, figures/tests, with separate technical plan. **Do Not Touch:** existing math sets/proposition/functions, their learning progress, math practice, physics, original teacher Word, Constitution, unrelated branches. No direct main edits.

### Risks and gates
- **BLOCKER**: source from Library is indexed with many missing formulas and no embedded figure images; original raw Word cannot currently be materialized. Existing source formulas are *UNKNOWN* and must be recovered; no new answers invented from approximate curriculum.
- Rights/provenance: teacher-authored draft cites published guide; distinguish original reproductions and user-authored explanations, check permissions prior to public release.
- Exact original math textbook Master Skill not yet found; use existing target-approved exemplar/SPEC and record exceptions.
- Even when source restored: pilot sample user-review and final app user acceptance are separate from this general approval.
- Release approval separate from implementation and proposal approval.

### Acceptance
16/16 source map, 233 prompt disposition, original 12 figures accounted, original equations and full proof audited; pilot four units reviewed and rendered; mobile+desktop browser pass, no regression, no progress reset; user hands-on acceptance, Work/Memory Close.

### Approval history
P-001 presented 2026-10-17 as status PROPOSED in `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md`, explicitly accepted by user's 「いいよ。こうやって作ろうか」, promoted to APPROVED here without altering the design.
