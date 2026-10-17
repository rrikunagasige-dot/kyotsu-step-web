# Original-to-target Coverage Manifest (preliminary)

Work: W-MATH-003 / P-001 (approved). Date: 2026-10-17.
Source: Library `01_数と式_教科書モード_対話段階導入版_v2.docx` (2026-10-10, 53 pages, not mounted raw).
**Coverage is based on text-index labels only, not verification of the missing original equation objects.**

| Source section | Unit | Source title | Question markers | Figure IDs | Pilot status | Source-formula verification |
|---|---|---|---:|---|---|---|
| 多項式 | N01 | 式をほどいて、係数と次数を読む | 10 | – | DESIGNED | BLOCKED |
| 多項式 | N02 | 整理する文字を決めて、式を足し引きする | 12 | – | LATER BATCH | BLOCKED |
| 多項式 | N03 | 積をほどいて、指数法則と展開をつくる | 13 | N03-F01 | DESIGNED | BLOCKED |
| 多項式 | N04 | 展開に現れる同じ形をまとめる | 22 | N04-F01 | LATER BATCH | BLOCKED |
| 多項式 | N05 | 展開を逆にたどり、積の形を見つける | 20 | – | LATER BATCH | BLOCKED |
| 多項式 | N06 | 複雑な式を、既に知っている形へ戻す | 16 | – | LATER BATCH | BLOCKED |
| 実数 | N07 | 分数と小数で、同じ数を表す | 14 | – | LATER BATCH | BLOCKED |
| 実数 | N08 | 向きと距離を分けて、絶対値を読む | 12 | N08-F01 | LATER BATCH | BLOCKED |
| 実数 | N09 | 平方根の符号と、数直線上の位置を確かめる | 14 | N09-F01 | LATER BATCH | BLOCKED |
| 実数 | N10 | 平方根の計算を、定義と既習の公式につなぐ | 21 | – | DESIGNED | BLOCKED |
| 1次不等式 | N11 | 大小関係を保つ変形を選ぶ | 14 | N11-F01 / N11-F02 | LATER BATCH | BLOCKED |
| 1次不等式 | N12 | 二つの条件を同時に満たす範囲を残す | 15 | N12-F01 / N12-F02 / N12-F03 | DESIGNED, MONEY SUBPROBLEM VERIFIED | PARTIAL |
| 1次不等式 | N13 | 距離の条件を、二つの位置へ戻す | 9 | N13-F02 / N13-F01 | LATER BATCH | BLOCKED |
| 1次不等式 | N14 | 距離の上限と下限から、残す範囲を決める | 16 | N14-F01 | LATER BATCH | BLOCKED |
| 発展 | NE01 | 3次の展開と因数分解 | 13 | – | OPTIONAL LATER | BLOCKED |
| 発展 | NE02 | 二重根号を、平方の形から外す | 12 | – | OPTIONAL LATER | BLOCKED |
| **Total** | **16 units** | | **233** | **12 diagram IDs** | | |

## Four-pilot original question counts
- N01: 10 labels; details/mathematics cannot be fully recovered from index.
- N03: 13 labels + N03-F01.
- N10: 21 labels including square-root multiplication/division proof and conjugate rationalization.
- N12: 15 labels + N12-F01/F02/F03; the numbers in the cream-puff count word problem are legible and its complete solution has been independently checked.

## Twelve original diagrams: figure-gate manifest

| Figure | Purpose | Timing proposal | Actual image QA |
| --- | --- | --- | --- |
| N03-F01 | All 2×2 factor pairs | Empty matrix before learner fills products, reveal after | NOT RUN |
| N04-F01 | Double binomial square products | Before generalization, no premature cross-term | NOT RUN |
| N08-F01 | Points on number line | Positions before distance answers | NOT RUN |
| N09-F01 | Negative decimal location | Interval marks before integer-part selection | NOT RUN |
| N11-F01 | Two numbers and their sign inverses | Before deciding order reversal | NOT RUN |
| N11-F02 | Open/closed inequality endpoints | After solving two source inequalities | NOT RUN |
| N12-F01 | Two inequalities on same scale | Before selecting intersection | NOT RUN |
| N12-F02 | Compare two fractional upper bounds | Before selecting tighter bound | NOT RUN |
| N12-F03 | Allowed discrete integer choices | Only after choosing allowed counts | NOT RUN |
| N13-F02 | Two symmetric points at fixed distance | After learner answers | x|=constant | NOT RUN |
| N13-F01 | Right and left of 1 | At distance interpretation, before final formula | NOT RUN |
| N14-F01 | Absolute-value inward vs outward bounds | After two original exercises | NOT RUN |

## Preservation and readiness gates

1. Each original question marker Nxx-【k】 must map to an app node/retained explanation/explicit merge-with-reason. Merely counting 233 does not establish a complete source→node map.
2. Recover actual OMML formulas and original figure bytes/rendering. The first 4 pilots cannot be released on indexed text alone.
3. Reproduce source faithful text and maths, but write instructional prose as a new learning flow—do not copy original teacher's wording indiscriminately.
4. Mark additional questions as newly authored; do not pretend they are from the source.
5. Preserve original and target IDs, all accepted sets/proposition/function content, existing progress, other subject modes and present UI.
