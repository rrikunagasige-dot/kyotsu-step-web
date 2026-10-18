# W-MATH-004 / P-001 — W-MATH-003 P-003 作成再開前の設計依存事項
Date: 2026-10-18 JST
Status: DESIGN ONLY — P-003 UNAPPROVED AND PAUSED
Creation proposal: https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/73

N11 (14) + N13 (9) + N14 (16) = 39 original source markers. They do NOT exist in the main learner app and must not be called released defects.

Before asking for creation approval, review all 15 D-class entries of INEQUALITY_COGNITIVE_AUDIT.md against R1 (hidden unmodeled operation) and R2 (missing reason bridge):
- N11: demonstrate sign reversal from difference/sign with c positive/zero/negative, and visible intermediate equations for Q11/Q14.
- N13: distance meaning -> two branches x-1=4 and x-1=-4 -> independent solutions -> checks. Include zero parameter case.
- N14: inside AND / outside OR for positive thresholds; endpoint inclusion; |3x-2|≤4 -> -4≤3x-2≤4 -> -2≤3x≤6 -> -2/3≤x≤2; put answer-bearing N14-F01 after Q06.
- Preserve 2–3 concise headings, black concept text, proof/example distinctions, inline cognitive blanks and reason-based feedback, source-to-choice mapping and figure reveal gates.
- Six supplemental N12 stages are NOT six extra Word source questions.
- New lessons materially changing the pending P-003 design require a revised creation Proposal and exact user approval. Do not edit or merge PR #73 here.

Return gate: verified N12 correction + linked defects resolved + shared lessons deduplicated + user acceptance + correction queue rechecked.
