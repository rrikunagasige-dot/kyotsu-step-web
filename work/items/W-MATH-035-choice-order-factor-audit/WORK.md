## CURRENT — 学習入力の最終訂正を反映

否定2件の元snapshotがpresentationの管理metadataから抽出され`[]`になっていたため、semantic.nodesの実本文・数式と実選択肢へ訂正した。入力はN09が849文字、N10が703文字。元の評価イベント・対象版・ラベル・事例数は変更していない。

同じcase.finalize→ml.trainサービスで訂正版catalogを検証・実fitし、supplemental native capability receiptsとlearning_input_correction_verifiedイベントを保存した。初回L01の結果を歴史として保持し、訂正版を現役とする。2回目のユーザー承認や2回目のL01工程合格を捏造していない。現在のmodelはMODEL_RESULT_CORRECTED.json、hash `0fdba96ef01eca3c857145b755d6f48519ce94addc4fbf8554c4b409438692a5`、catalog hash `b1e33add46660c201a2d1fc4431f228edc5eaa831baf2a5f9e666da19f088b76`。15件・5family group、全入力が実教材で空ではなく、全token処理。初回モデルの「切捨てなし」だけでは意味のある入力を保証できなかったため、空の可視投影も確認する。

実fit対象はlayout_discomfort 2件だけ。新operation_order/factor_groupingは否定だけ、overall_material_acceptanceは肯定だけで未学習の観点。現在は事例検索・ルール適用で使い、OFFLINE_ONLYを維持する。以下の初回model hashやnative初回fitはsuperseded履歴。

---

## CURRENT — N09/N10教材受入・実学習・終了（2026-10-25）

本人「私が言っているのはN09,N10承認の意味」を公開fa0eff271a97940fad08d83960ae50faeabc81b9への両単元受入として記録。G3_FINAL両unit→fresh事後sweep→R08→L01実fit→Z01を同じRuntimeで完了し、W035 DONE。W034の修正依頼は子W035の完了証拠でresolve。W034の古いcb7版の受入や古いGateの合格は捏造していない。

学習は既存11＋原否定2＋単元全体肯定2＝15（否定9/肯定6）。AI追加発見5件はGoldへ加えていない。15入力すべて全token処理・切捨て0。固定multilingual-e5-small＋LogisticRegression.fitを実行。学習可能なのは既存layout_discomfortの2例のみ。operation_order/factor_groupingは否定のみ、overall_material_acceptanceは肯定のみのため各headは作らない。OFFLINE_ONLY/advisoryEligible=false、未知holdoutなし・精度推定不可。modelHash 5ce745657964110893535f9ef7ceab08939769222b012513d0c7165c5124c53b。native両unitのL01は同じ15事例集合を検証・fitするが、データ件数を二重加算しない。

次の依頼はNE02/N11/N12。P001と学習の承認を混同せず、W036で全node具体設計を先に提示する。以下は過去の公開確認待ち記録。

---

# W-MATH-035 — 選択肢の順序・因子全体の監査

Status: VERIFYING
Command: CMD-WORK-001
Parent: W-MATH-034
Proposal: P-001 / PROPOSAL.md
Branch: work/n0910-choice-order-factor-audit-20261025
Input: 公開cb7d30bfへの本人指摘。①は計算→計算→比較の順序、②は因子全体の括弧。全件監査を終えてから提案。
Output: 全86node/81回答/282候補の監査表、7修正項目、限定同型検索、提案IR・表示policy・実装/検査手順。
Current: P001は「おけこれでいいよ。じゃ続けてよろしく」で承認済み。両R06完了、両R07/G2とexact-source4幅の表示・全回答検査PASS、既存Pages run40172534338で公開・実配信と公開後4幅操作もPASS、両G3_HOST完了。本人の実物受入は未取得。
Next: 公開fa0eff27への本人評価（G3_FINAL@n09/n10）。対象修正、またはfresh事後sweep/R08/L01。
