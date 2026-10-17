# W-MATH-003 Findings

## F-001 CONFIRMED — source structure
The 53-page third-party Word draft includes N01–N14 and NE01/NE02, 233 prompt markers and twelve named figures; its text is accessible through Library. It is not the original publisher textbook, despite referencing 教科書ガイド 啓林館版 深進数学Ⅰ.

## F-002 OPEN-QUESTION / BLOCKED-SOURCE — missing equations
The indexed Word extraction omits the contents of many formula objects; on N01, N03, N10 and N12 this prevents exact source formula, answer and diagram review. Original raw file is inaccessible via current Library materialization, not found locally or in limited Mac search. No invented formulas or proof of fidelity allowed. Ask for direct upload or page-accurate PDF if needed.

## F-003 CONFIRMED — existing math textbook route
Current GitHub `src/data/textbook/math/mathCatalog.ts` registers 集合 and 命題 themes; 数と式 is not yet in topic catalog. New unit identifiers/route and progress semantics need design, not a disguised overwrite of sets, functions or proposition lessons.

## F-004 CONFIRMED — prose/holes
The current Word uses separate ［　］ response boxes below questions in many places. An approved `集合` exemplar instead uses coherent instructional text plus meaningful inline decisions. Improvements should not indiscriminately convert all 233 prompt markers to standalone cards.

## F-005 CONFIRMED — recoverable N12 real-world conditions
N12 contains a textual problem: 50円の箱、180円/個のシュークリーム、130円/個のプリン、合計20個、合計金額3200円以上3300円未満. These numeric conditions are present in readable text. Let x be the cream-puff count, integer 0…20. Total 50+180x+130(20−x)=2650+50x; 3200≤2650+50x<3300 implies 11≤x<13, i.e. x∈{11,12}. This arithmetic is independently checkable, but figure timing/format must still be checked against raw source.

## F-006 RISK — approval vs source gate
User approved P-001 workflow; source fidelity did not automatically become verified. Treat Work as design-only until original equations/figures can be inspected. Release authorization remains a separate review.
