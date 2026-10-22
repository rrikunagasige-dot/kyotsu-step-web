# W-MATH-024 — N05 Q18 誤答ヒントの未回答結果先出し
Status: PROPOSED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正 — linked W-MATH-023 Gate② / W-MATH-022 §12B same-root impact

## Origin and approved boundary
- Original teacher Word SHA256: `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`; N05 Q18 paragraph 240: 「二つの条件を満たす組を選び、積を完成させよう。」
- Existing N05 `src/data/textbook/math/numbers/n05Lesson.ts`, `{q:18}`. Current correct expression `(x-1)(5x+3)`, bad wrong-only hint directly says `r=−1、s=3` which are the exact unsolved coefficients.
- Root: prematurely disclosing the coefficients sought by the task in its after-wrong hint; confirmed independently when W-MATH-023/P-002 Stage B Gate② audited sibling creations.
- Proposal only; see `PROPOSAL_P001.md`. **No implementation approval has been obtained.** Branch based on tested W-MATH-023 code SHA `9816954b94593389fd6e92bed47dede35621eee2`, documents only.

## Do not touch
N05 Q01–17/Q19–20, figure N05-F01/F02, teacher Word, N13 Q05/Q08 accepted/pending gate history, N14 Q10/Q14/Q15/Q16, all other source modules, shared helper, content schema, math practice/physics, main, PR merges, production and paid services.

## Next authorized action
Present exact P-001 for explicit acceptance; if approved, modify only the Q18 after-wrong hint, run exact CI and genuine 320/390/1440 native screenshot Gate①, then user `細部OK`. Gate② W-MATH-023 remains blocked on this confirmed applicable sibling correction, but nothing from W-MATH-024 is auto-authorized by the preceding 「続けて」.
