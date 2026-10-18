# W-MATH-004 — 他の承認済み「作成」成果物への影響台帳（P-001実装時）
Status: SOURCE/COGNITIVE PASS COMPLETE; RUNTIME/MOBILE QA PENDING
Date: 2026-10-18 JST
Origin: F-001/F-002 / W-MATH-004.
Signatures: R1 = 未学習の独立した複数変形を一つの結果で隠す；R2 = その操作の理由・意味への橋がない。
Assessment scope: approved/review-visible Number & Expressions N01/N02/N03/N09/N10/N12 under W-MATH-003.

| Creation / source blob SHA | First/middle/last and all-item pass | R1/R2 verdict | Evidence / limit |
| --- | --- | --- | --- |
| N01 n01Lesson.ts 0bb6f7f24cfeeed74a101aa00e39445afa6e3e00 | All 15 inline IDs; Q02a–c distinctions; Q06a/b→Q07; Q09a→09b→10a→10b | NOT-AFFECTED for confirmed N12 signature | Final cancellation separates regroup/simplify/degree/reason; browser QA UNVERIFIED |
| N02 n02Lesson.ts 47a0a7508f2ff4fa6599497d2a92ef59046e41af | All 12 IDs; Q05→06; Q07 -B→08 A-B; Q09 2A/-3B→10 collect→11/12 reuse | NOT-AFFECTED under modeled-operation transfer | Q09 has two already-modeled scalar distributions during later check; precedents and explicit signs; browser QA UNVERIFIED |
| N03 n03Lesson.ts 2f3c57434a4c30e5cfbe61349278afe224899e83 | All 13 IDs; Q05→06 powers, Q07→08, Q09 split→10 products→11 combine, Q12→13 transfer | NOT-AFFECTED under deliberately faded transfer | Q13 combines already-modeled distribution/collection after Q09–11 and retains two-choice chain; browser QA UNVERIFIED |
| N09 n09Lesson.ts 07b8523e7b64b5c72d525fa0805d4e211cfb3e00 | All 14 IDs; Q03–05 sign; Q08→09 squares; Q10→11 integer part; Q12→13→14 signed roots | NOT-AFFECTED by N12 hidden-transform signature | Q13 prose explicitly gives negative multiplication and sign reversal; browser QA UNVERIFIED |
| N10 n10Lesson.ts e7498844e3fa7dcc4f7862e5ad6b25abb92cae67 | All 21 IDs; Q03→06 proof; Q07–12 roots; Q14–16 rationalization; Q17→18→19→20→21 transfer | NOT-AFFECTED by N12 hidden-transform signature | Final 2-stage transfer follows previously modeled conjugate/denominator/numerator; browser QA UNVERIFIED |
| N12 n12Lesson.ts f8dd758e334564ef9c341ad2017e743361e6ab2b (before change) | All original 15 IDs, especially Q01/02/06/12/13 | CONFIRMED affected | Approved P-001 inserts six extra in-flow stages; CI/browser/user acceptance pending |
| N11/N13/N14 draft PR #73 P-003 NOT APPROVED | 14+9+16 = 39 Word markers; 15 D risk entries in INEQUALITY_COGNITIVE_AUDIT.md | DESIGN-GATE, NOT existing app bug | Require P-003 revision after correction; see P003_DESIGN_DEPENDENCY.md |

## Method, limits and second-pass trigger
1. Read all item definitions and readingFlow transitions for the 5 accepted neighboring source files, with special review of each start/middle/end causal chain. Judgments are source-level for R1/R2 only, never a blanket PASS for other mathematical/UI bugs.
2. Same operations may be legitimately combined later when the preceding chain has taught them and explanation remains visible. This distinguishes N02 Q09/N03 Q13 from N12 Q06.
3. No additional same-signature defect confirmed in this pass. If CI, browser, or user finds one, revisit the ledger by (root signature, unit, source SHA), enqueue separate CMD-WORK-001 proposal and await approval before any code changes.
4. No unrelated approved unit code changed. Broader mobile, persistence, production version and user quality judgment are still UNVERIFIED, never misreported as full quality PASS.
5. The user's monotone-deterioration observation remains a falsifiable quality-drift hypothesis; do not generalize it without evidence. Reconcile shared lessons only after verification and acceptance.
