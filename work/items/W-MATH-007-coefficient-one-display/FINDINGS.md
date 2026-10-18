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

## F-003
Date: 2026-10-18 JST
Type: CROSS-UNIT AUDIT — NO NEW CORRECTION
Statement: Comprehensive source-only scan after P-001 implementation found the same choice-followed-by-x formula boundary only four times in N12; of those, only Q06-left has coefficient answer "1". All 11 published math lesson modules and three math slices/helpers show no second approved-unit defect with this signature; W-MATH-005 draft #80 was separately checked and unchanged. N03 matches for text "1x" are the valid value "11x" and do not indicate unit-coefficient syntax.
Evidence: main 066e0da source tree and math lesson files; N12 n12Lesson.ts Q01/Q02/Q06-left/Q06-right values 2/2/1/3; draft #80 source review.
Impact: isolated renderer display correction suffices; no duplicate revision directive or mass replacement warranted.
Corrective rule / next action: complete final regression checks; defer shared lesson promotion and creation until acceptance.
Promote to Decision: NO
Promote to Lesson: NO — await user acceptance and deduplication.
