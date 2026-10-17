# 数と式 — Source Manifest / Coverage and source gate
Date: 2026-10-17
Status: STRUCTURE-VERIFIED / FORMULAS-UNVERIFIED

## Identity
Input: Library `01_数と式_教科書モード_対話段階導入版_v2.docx` (212863 bytes, 53 pages, upload 2026-10-10). A **teacher edited pedagogical draft**, not the publisher source itself. Title page says 数学Ⅰ「数と式」教科書モード, revised v2.0. Credits `『教科書ガイド 啓林館版 深進数学Ⅰ』（数Ⅰ711）`. Do not claim original publishing permissions or publisher source matching.

Library index permits text read (about 2596 rendered lines); the raw .docx is not materializable in this environment. Original algebraic expressions often entirely omitted, including numerator, radicand and symbolic variables. Textual account of what a question asks may be identifiable but its exact mathematical input generally is **NOT**. Page images also unavailable. Mac Downloads/Documents targeted searches and current conversation-mounted files showed no original Word. No OCR or invented reconstruction.

## Coverage table — user approved pilot first

| id | section | title/topic | original marker count | figure IDs | target phase |
| --- | --- | --- | ---: | --- | --- |
| N01 | 多項式 | 係数・次数、単項式と多項式、同類項 | 10 | — | PILOT |
| N02 | 多項式 | 注目文字、降べき/昇べき、多項式の加減 | 12 | — | BATCH |
| N03 | 多項式 | 指数法則、分配法則、二項式の展開 | 13 | N03-F01 | PILOT |
| N04 | 多項式 | 平方/和差の乗法公式の導出 | 22 | N04-F01 | BATCH |
| N05 | 多項式 | 共通因数、平方・和積、たすき掛け | 20 | — | BATCH |
| N06 | 多項式 | 置換と文字の選択による因数分解 | 16 | — | BATCH |
| N07 | 実数 | 有理数/循環小数/無理数 | 14 | — | BATCH |
| N08 | 実数 | 絶対値の距離・場合分け | 12 | N08-F01 | BATCH |
| N09 | 実数 | 根号の非負性、整数部分/小数部分 | 14 | N09-F01 | BATCH |
| N10 | 実数 | 平方根の積・商証明、根号演算、有理化 | 21 | — | PILOT |
| N11 | 一次不等式 | 変形規則と端点 | 14 | N11-F01, N11-F02 | BATCH |
| N12 | 一次不等式 | 連立不等式、範囲、金額と整数条件 | 15 | N12-F01, N12-F02, N12-F03 | PILOT |
| N13 | 一次不等式 | 絶対値方程式、2点間距離 | 9 | N13-F02, N13-F01 | BATCH |
| N14 | 一次不等式 | 絶対値不等式、間/外側、等号 | 16 | N14-F01 | BATCH |
| NE01 | 発展 | 三次式の展開と因数分解 | 13 | — | OPTIONAL BATCH |
| NE02 | 発展 | 二重根号、和積条件、符号 | 12 | — | OPTIONAL BATCH |

Count: N01–N06 = 93; N07–N10 = 61; N11–N14 = 54; NE01–NE02 = 25; all = 233. These are source **markers**, not counts of valid inline blanks. PILOT = 59.

## Figure gate — 12 referenced IDs
- N03-F01: 2x2 cross-product table, four interior products unanswered.
- N04-F01: repeated binomial multiplication table; not a metric area drawing.
- N08-F01: marks on number line, unsigned distance remains unanswered.
- N09-F01: location of negative decimal; integer part must obey 0<=fractional<1.
- N11-F01: signed order reversal on matched-scale number lines.
- N11-F02: post-result number line for open/closed endpoint demonstration.
- N12-F01: two range conditions on aligned number lines, intersection remains for learner.
- N12-F02: compare fractional upper limits on one consistent scale.
- N12-F03: candidate integer points after solving monetary constraints; answers must not leak.
- N13-F02: equal distance points, unlock AFTER answer for first task.
- N13-F01: x compared to coordinate 1, left/right distance.
- N14-F01: post-result comparison of inner/outer absolute-value regions.

Embedded original figures/actual scales/colors/unreadable labels cannot be checked. **Do not generate replacement figures or math answers based on these descriptions alone.** Once .docx raw is available, extract image/shape/OMML manifests and visual-render each page before deciding figure work.

## Identity & reuse conditions
- Teacher's draft is edited secondary pedagogical source. Keep publisher citation as provenance, not an unrestricted reproduction license.
- Check exact original math statements, proof hypotheses, original answer key, reference figures and reuse scope before publication.
- Source ID `Nxx/NEyy` is authoring internal stable ID; learner-facing headings can be fewer/shorter; not an implicit claim existing learner progress IDs exist.

## Next SOURCE gate
1. Receive the raw `.docx` or a verified complete render containing equations and figures.
2. SHA-256/hash and file size, check Word doc contains all 53 pages / full OMML and images; if different version, reconcile.
3. Map every original marker to exact equation(s), choices, source figure, proposed cognitive node, answer and complete solution, with exclusions recorded.
4. Check 12/12 original images; test N01/N03/N10/N12 source correctness and pilot figure ordering.
5. Only then mark FORMULAS-VERIFIED and permit content drafting / program changes.
