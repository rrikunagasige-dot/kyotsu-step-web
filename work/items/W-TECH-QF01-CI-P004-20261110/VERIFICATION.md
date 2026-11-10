# Verification
V-001 PASS (actual prior860 CI scope): 4workflow成功/3失敗/1skip。P003 activation/RETRY_20261110_CI_RESULTS.jsonとjoblogsに実run/source。失敗は解消済みとしない。
V-002 PASS (scratch): 実CIと同じ保存先・exclude2file広域Vitest選択877/877、exit0。元858＋旧現保護19。evidence/qf_unit_followon_A/broad-final.json/log。
V-003 PASS (scratch): 対象5tests86件＋変更なしStageB8件＝94/94、default/custom namespace両方。app型検査・変更5件lint。初回型不備/欠fixtureログ保持。
V-004 PASS (scratch): N07 full checker正例2・負例6、元integration3/3。旧APPROVAL/PLAN/不変Git設計は変更なし。evidence/qf_n07_bridge_B/REPORT.json。
V-005 PASS (simulation only): 元Runtime/adapter自己Storeで24入力・7path一度適用、全after一致、未知patch・再適用・過大preserve拒否。simulated approvalは正式user承認ではない。evidence/qf_p004_review_B/adapter-simulation/RESULT.jsonとadapter-scope-negative/RESULT.json。
V-006 PASS (source review only): AによるBtool、BによるA5/N12/M提案の対象hash付き非作者審査。盲検ではない。各原報告保存。M assemblyのHTML全after roundtrip/hash/source24件一致。
V-007 PASS (protected scope analysis): parent373件中既承認8＋本案4＝12例外、361不変。src332中5test以外差分0。将来の保護reviseは未実施。
V-008 FRESH CODE REQUIRED: service388件、capability hash876805bc…→2af9f6bb…、変わるserviceはN07toolだけ。定義72a038…不変。proposal/IMPLEMENTATION_HASHES.jsonに完全hash。
V-009 UNVERIFIED: N12新準備2行のブラウザ効果、最終source全実CI、feature統合後の新四幅/C09/G2、main公開、本人受入。

V-010 PASS（正式適用照合のみ）: activation/EXACT7_APPLIED.json。原adapter1操作、7after/candidate一致、327非対象src・core・依存の353protected全保持。全実CIは未完。
