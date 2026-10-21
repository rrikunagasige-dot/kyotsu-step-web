# Findings — W-MATH-003

## F-001 — CONFIRMED: Exact scope
Word indexed in Library: 53 pages, 212863 bytes, 16 units, 233 question-number markers, 12 figure IDs. Mode: Mathematics / textbook (learning), teacher-authored v2.0 citing 啓林館 深進数学Ⅰ guide, not the publisher textbook.

## F-002 — ERROR-PROVENANCE RISK: Text loses equations
Words such as 'を解こう' appear with both operands missing, including sample N01/N03/N10/N12. The text extraction is not sufficient to infer problem coefficients, signs, original answer or diagrams. Never manufacture original source formulas under source fidelity. Raw file and rendered pages unavailable in current file access. Source gate marked BLOCKED.

## F-003 — CONFIRMED: Prior approved 16-unit plan
Approval covers analysis, source recovery, representative pilot N01/N03/N10/N12 and later accepted full batch, subject to within-plan source audit and pilot design user review. Original math textbook skill file is absent/unknown; current canonical candidate SPEC is not necessarily equal to original Skill.

## F-004 — OPEN-QUESTION: Original source recovery
Needed: original uploaded `01_数と式_教科書モード_対話段階導入版_v2.docx` as a new chat attachment or verified retrievable original file. Optional: answer key / guide source for comparing equations, and clearance for publishing proprietary guide figures/statement. Stop content implementation pending resolution.

## F-005 — CONFIRMED: Target app catalog not yet registered
Current `src/data/textbook/math/mathCatalog.ts` includes topics for 集合/命題, not 数と式. This is a **new** chapter; do not overwrite existing `math-sets` or reveal review-only units without authorization.
