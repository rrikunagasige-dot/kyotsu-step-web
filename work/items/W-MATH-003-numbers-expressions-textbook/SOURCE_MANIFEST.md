# 数学Ⅰ 数と式 — SOURCE_MANIFEST / P1 audit (2026-10-17)
Status: **PARTIAL — exact mathematical notation, images, solution verification BLOCKED**
Source: `01_数と式_教科書モード_対話段階導入版_v2.docx` (teacher-authored teaching-mode draft, 53 pages, 212863 bytes, 2026-10-10 Library); cite: 『教科書ガイド 啓林館版 深進数学Ⅰ』教科書数Ⅰ 711. Do not assume this *is* the original guide or that copy permission is granted.
Confirmed by indexed text: all unit titles, instructional aims, numbered prompt labels, figure IDs. Text extractor omits many OMML mathematical formulas and rendered illustrations; **no original formula/answer fidelity has been verified**.

## Chapter/unit coverage (all 16)

| Unit | Theme | Prompts | Figure IDs | Critical prior concept / design task | Formula QA |
| --- | --- | ---: | --- | --- | --- |
| N01 | 単項式・多項式、係数、次数、同類項、定数項 | 10 | — | Start at operations/known expressions; do not guess new terminology | BLOCKED |
| N02 | 指定文字についての降べき・昇べき、多項式加減 | 12 | — | N01; parentheses sign, prior result reuse | BLOCKED |
| N03 | 指数法則、分配法則、単項式/二項式の展開 | 13 | N03-F01 | N01/N02; empty products table, reveal only after answer | BLOCKED |
| N04 | 和/差の平方・積、乗法公式と導出 | 22 | N04-F01 | N03; verify middle term and group full derivation | BLOCKED |
| N05 | 共通因数、平方形の逆、和積条件、たすき掛け | 20 | — | N03/N04; verify via expansion, preserve constraints | BLOCKED |
| N06 | 置換による既習二次式への還元、整理文字選択 | 16 | — | N01/N02/N05; substitutions reversible | BLOCKED |
| N07 | 有理数、有限/循環小数、余り、実数分類 | 14 | — | Division algorithm and pigeonhole remainder, decimals | BLOCKED |
| N08 | 絶対値＝数直線上の距離、場合分け | 12 | N08-F01 | Number line, sign of **whole expression** | BLOCKED |
| N09 | 平方根の定義/主値、√(a²)、整数/小数部分 | 14 | N09-F01 | N08; positivity of principal root, signed floor | BLOCKED |
| N10 | 根号の積・商の証明、根号計算、分母の有理化 | 21 | — | N09 and N04; nonnegative and nonzero assumptions; proof/example separation | BLOCKED |
| N11 | 不等号、負数乗除/零、一次不等式 | 14 | N11-F01/F02 | Difference sign argument; open/closed endpoints | BLOCKED |
| N12 | 連立不等式、共通範囲、3項条件、整数個数文章題 | 15 | N12-F01/F02/F03 | N11; common number line scales; discrete restrictions and units | BLOCKED |
| N13 | 絶対値方程式、左右の距離、零・負右辺 | 9 | N13-F02/F01 | N08/N11; right/left branches; figures timed | BLOCKED |
| N14 | 絶対値不等式の上限/下限、内側/外側、等号 | 16 | N14-F01 | N08/N11/N12/N13; conjunction/disjunction | BLOCKED |
| NE01 | 三次展開と因数分解の導出（参考・発展） | 13 | — | N03/N04/N05; optional route, no memorization-only formulas | BLOCKED |
| NE02 | 二重根号、平方・符号の選択と有理化（参考・発展） | 12 | — | N04/N09/N10; principal root nonnegative | BLOCKED |

Count check: 93 (polynomials) + 61 (real) + 54 (inequalities) + 25 (advanced) = **233** printed question markers.

## 12 referenced figures and visibility timing

| Figure ID | Function / before-after behavior | Source fidelity gate |
| --- | --- | --- |
| N03-F01 | Distributive four-product table, blank products before student response | Recover exact original diagram cells |
| N04-F01 | Table of all pairs for (a+b)²; NOT a physical area diagram by default | Recover mathematical table |
| N08-F01 | Distances from origin (points shown first; numeric distance hidden until answer) | Exact points/scale |
| N09-F01 | Negative decimal number line, floor/integer-part boundary | Exact signs and interval |
| N11-F01 | Location of 2 and 5 and corresponding opposite values | Check axis order/scale |
| N11-F02 | Two solved inequalities with open/closed endpoint markers | Exact signs vs ○/● |
| N12-F01 | Stacked 2 conditions with common scale; answer interval still hidden | Exact bounds/scale |
| N12-F02 | Comparison of two upper bounds (fractions) | Fraction placement |
| N12-F03 | Integer-valued candidates for word problem; after-answer support | Count/cost restrictions |
| N13-F02 | Two points ± distance, explicitly after answering | Visibility unlock |
| N13-F01 | x relative to 1, two cases | General vs example distinction |
| N14-F01 | Upper/lower absolute-value bounds shown after two earlier answers | Figure not leak later answer |

No figure has been rendered or accepted; all 12 are UNVERIFIED. `N13-F02` appears before `N13-F01` in the indexed text; investigate provenance/design intentionally.

## Dependency tiers
- Core: N01→N02→N03→N04→N05→N06; N03/N04/N05→NE01.
- Real number: N07→N08→N09→N10; N04→N10; N04/N09/N10→NE02.
- Inequality: N11→N12; N08/N11→N13; N08/N11/N12/N13→N14.
These are **provisional pedagogical edges**, not verified mathematical minimal prerequisites. Fix only after exact formula review.

## Explicit source-restoration checklist (must pass before coding)
1. Regain original DOCX bytes; record sha256, source/owner/edition and technical rights.
2. Render 53 pages visually and inspect all 12 figures.
3. Parse all OMML/embedded equation objects and paragraph order. Record every numbered original problem/expression and its solution.
4. Compare 233 markers to original Word with stable file/page/unit/ID references; note intentional merges/omissions.
5. Verify math proofs/conditions and figure-before/after treatment.
6. Mark each unit/figure PASS or ERROR; zero blanket PASS from indexed text.
