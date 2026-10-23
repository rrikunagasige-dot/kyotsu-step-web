# P016 impact audit — confirmed remaining scope

Source: 91f7b2df72d5403931e0a0df0b656627516116d8. Native run 39919622149. Original metrics: evidence/p016/p016-related-{320,390,1440}.json; all original failure screenshots preserved in native-original.zip.

11 N12 choice→following-math pairs were operated in before/wrong/correct states at all three widths. At 390 and 1440 all tested pairs remain on the same row. At 320 four OTHER blocks fail; these were directly inspected in original screenshots. These defects pre-exist the P016 two-block change and remain unfixed.

| Block / item | 320 states with split | Observed defect |
|---|---|---|
| formula-q02-coef / n12-p002-q02-coef | before, wrong | coefficient slot separates from x+4≤5 |
| formula-q06-right-coef / n12-p002-q06-right-coef | before, wrong | coefficient slot separates from x+4≤9 |
| formula-cost-pudding / n12-p003-q10-pudding-coef | before, wrong, correct | coefficient separates from (20−x) |
| formula-q13-lower / n12-p002-q13-lower | before, wrong | slot separates from ≤50x<3300−2650 |

P016 targets Q06 LEFT and Q12 pass all tested states and widths. Audit execution PASS is not audit-all-clear. No edits to these four blocks are authorized by P016; prepare one exact grouped follow-up proposal, without inventing a fifth defect. Whole-chapter Gate② OPEN, Gate③ NOT-READY.

Remaining project inventory is not a completion estimate: 14 existing units, 208 original questions / 290 graded items. NE01 (13 originals) and NE02 (12 originals) remain uncreated. Unsupported source/math checks remain UNVERIFIED; do not infer chapter completion from these bounded tests.
