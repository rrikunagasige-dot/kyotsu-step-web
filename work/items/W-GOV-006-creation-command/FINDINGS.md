# Findings — W-GOV-006

## F-001 — CONFIRMED: New creation command missing
live main `governance/INSTRUCTION_DICTIONARY.md` v1.3.0 has Root `憲法から` and Work `修正`, no `作成`. Therefore do not interpret the latter implicitly as `修正`; register explicitly per user-approved design.

## F-002 — CONFIRMED: Four different modes
Mode specs are `subjects/{mathematics,physics}/{textbook,practice}/SPEC.md`. Their imported status is CANONICAL-CANDIDATE and they may not supersede target-approved detailed mode lessons. Math practice authoritative `docs/MATH_PRACTICE_MASTER_LESSONS.md`; Physics textbook detailed `docs/physics-ch01/LEARNING_TEXT_WRITING_RULES.md`, `FORMULA_DERIVATION_RULES.md`, `CH1_USER_QA_DESIGN_LESSONS.md`. Technical cross-mode lessons `docs/MASTER_APP_LESSONS.md`, `docs/MATH_RENDERING_RULES.md`, `docs/INFORMATION_ARCHITECTURE_RULES.md`.

## F-003 — OPEN-QUESTION: Missing original mother skill in current GitHub
`MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1` and `SCIENTIFIC_WRITING_MASTER_SKILL_2026-09-24` are mentioned historically, but their exact original source files were not located on current main. The math textbook imported summary points to the first. Do not claim those original documents were read. When authoring content dependent on the mother source, request/access the exact canonical original instead of improvising.

## F-004 — ERROR-IMPLEMENTATION / corrected Markdown escaping
Initial new Command text had 76 escaped Markdown backtick characters, potentially breaking code/path rendering. Targeted static audit found these before PR; all were removed. Regression static check `!dictionary.includes('\\`')` now PASS. No content meaning changed.

## F-005 — CONFIRMED: governance scope isolation
Diff contains only dictionary, command router, creation template, one memory lesson and this Work's five records. Existing Root/修正 command IDs and semantics remain in place; Constitution and application source were not changed.
