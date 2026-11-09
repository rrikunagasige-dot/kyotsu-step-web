# Current record reconciliation — W-MATH-037 / WORK.md

Status: VERIFYING
Record-Scope: Metadata/provenance restoration only; no product or Store mutation.
Fixed-Candidate: 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b
Work-State: VERIFYING

Exact historical approval and bounded implementation checks exist, but this native Work has no proved closure. Preserve pending acceptance/remaining workflow; do not promote it to DONE.

Evidence:
- Store approval event W037-P001-PRESERVE-R4-APPROVED-20261026, proposal_hash=71e6f67bb98d372a6146502cba0f69d13967f3047af9be59a8a86b1cb6a7eb6d (historical, no new quote)

Original-Body-Source: fixed candidate Git blob
Original-Git-Body-SHA256: fbbf70e522851f90666cb591cc08a13cdc47bdc588d935b67723a08cf3ee3f16
Original-Physical-Body-SHA256: ABSENT

<!-- HISTORICAL ORIGINAL BODY START — bytes below preserved exactly; current metadata is above -->
# W-MATH-037 — N08新ワークフロー実地試験

Command: CMD-WORK-001 / production/2 / solution_pipeline:solution/1
Status: APPROVED / NATIVE_R06_PATCH_COMPLETE / G3_HOST_PASS / WAITING_USER_MATERIAL_EVALUATION
Scope: 本人が指定したN08「絶対値」の全12問、既存36node。本文の全交換ではなく指定した改善と3回答追加。
Source: 69014b5b149f730c5f738129c9febbd19a96214a、N08 revision4。公開教材source397788f1に由来するN08を保持。
Request: 「一旦試しに不等式N08の修正をやってみよう」。対象確認への回答「N08：絶対値の単元」。
Branch: work/n08-solution-workflow-trial-20261026
Proposal: P-001 / PROPOSAL.md + NODE_DESIGN.json
Approval: current explicit permission with preservation requirement; APPROVAL.json. No quality label inferred.

新しい検算の未対応を既存の数学的誤りと混同しない。R01で現行を固定し、R02の未対応を記録する。R04具体案を文書として準備するが、nativeのR04完了・R05承認済みとは記録しない。

本人に提示する提案は、必要な制作コード拡張と教材の具体案を一つの承認範囲として明記する。既存公開appでの確認方法を維持し、画像承認や公開の再許可を復活させない。

2026-10-26: P001不変、旧版保護の実現scopeを記録。制作codeの新しい実行版でR01-R04を再実行、実発言をR05へ結び、限定R06適用完了。以前のUNVERIFIED・失敗・lock復旧は削除せず保持。VERIFICATION.md参照。

公開source1e8d2ae4、publisher5142b598、run40214438103 SUCCESS。G3_HOST@n08 PASS。旧r4保持。G3_FINALは本人の実物評価待ち、品質label/fitなし。PUBLICATION_REPORT.md参照。
