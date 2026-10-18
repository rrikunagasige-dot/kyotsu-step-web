# Findings — W-MATH-007

## F-001
Date: 2026-10-18 JST
Type: CONFIRMED
Statement: N12 Q06-left coefficient has answer 1 and an immediately following x math span; current renderer displays their adjacent contents as 1x. The desired mathematical display is x, with saved coefficient 1 unchanged.
Evidence: main 066e0da905bf4948e25ec200fe1b46e34d6ed573, src/data/textbook/math/numbers/n12Lesson.ts formula-q06-left-coef and n12-p002-q06-left-coef; src/components/textbook/TextbookFormula.tsx resolved path.
Impact: local post-answer pedagogy and typography; not correctness of stored math answer.
Corrective rule / next action: P-001 proposes context-aware formula display only; wait for approval.
Promote to Decision: NO
Promote to Lesson: NO

## F-002
Date: 2026-10-18 JST
Type: RISK
Statement: Blanket stripping of literal 1 before any symbol could erase a constant, exponent, comparison endpoint or explanatory text; hiding an empty span also risks breaking solved-element visibility and accessibility.
Evidence: N12 q02 constant answer 1, explanatory paragraph 1x=x, active E2E requires resolved-<itemId> to be visible.
Impact: must combine the variable into the visible resolved slot and trim exactly the next duplicated variable, rather than overwrite the answer or replace arbitrary strings.
Corrective rule / next action: require explicit adjacent coefficient-factor context, non-effect regression, no global replacement.
Promote to Decision: NO
Promote to Lesson: NO
