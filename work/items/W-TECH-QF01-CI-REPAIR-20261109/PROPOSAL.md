# Approved proposal record

Status: APPROVED

P-QF01-COMMON-CI-20261109-001 / HTML SHA256 b6a78d5fb1b8ad28b7e8be127c3c8f8a6968bfcb68ab22693789869665ad6a3f
User: いいよ続けて
Actual approval event: 3e1fa8e6-c06b-412a-b869-fb0203d9274f
The following is the unchanged proposal text at presentation time; its old PROPOSED/未承認 wording is historical.

---
# 共通CI修正案 P-QF01-COMMON-CI-20261109-001

Status: PROPOSED

現在のQF01 source 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b を基準に、旧版テストの参照先と、旧Work記録の機械可読な状態表示だけを修正する具体案。

対象は64ファイル。既存テスト8件＋test-only fixture1件、旧22 Workの記録55件。今回Workの記録・根拠を別途維持する。

旧テストのN13 r4/12判断・N14 r10/38判断を、独立した旧版unit/mapへ固定する。現行N13 r5/18判断・N14 r11/41判断は保持し、4件の版境界・実保存移行検査を既存CI対象テスト内に追加する。元の検査本文・期待値を維持する。

53診断は47直接対象pathに加え、状態・承認・完了検証の連動を含め55pathへ限定した。4件の実閉鎖は元の承認・close証拠へ対応させ、不明なものはBLOCKED/PROPOSEDの理由を明示する。原本文とW050/W051の既存ローカル10本文を保持する。

作業用コピー検証：Preview48/48、Math259/259、変更箇所lint/型検査成功。同じ記録検証器で原CIの53診断を完全再現し、提案版0診断・exit0。A/Bの相互確認済み。正式適用・実CI・G2解除は未実施。

承認後：独立修正branchで固定入力を安全に揃え、元のtechnical CMD-WORK-001工程で固定patchを適用する。同じ公開repoへ修正branch・draft PRを作り、共通CI成功後に既存QF01 feature branchへexpected-HEADで統合する。新sourceの4幅CIと必要な再照合、G2再判定まで進める。main統合・本番配信・本人受入は別工程。

ネイティブ入力は承認後に固定する。既存Workのsource_manifestをreviseで拡張しない。新規入力の現在作成と歴史的原本を区別し、閉鎖証拠や本人発言を捏造しない。

現在sourceの教材・UI・保存データと、workflow/validator/core/依存は変更対象外。正本patchはproposal/PATCH_NATIVE.json、native hash 86341090c66b9a22887f3892f92c9b964389245fac972fccde9945c85ef1002d。

承認状態：未承認。今回の「いいよ続けてくれ」は調査・具体案作成の続行として記録し、この未提示案への承認とは扱わない。WORK_SYSTEM §4/§11/§12Bにより、旧保護範囲へ広がる今回の具体案を提示してから実装する。
