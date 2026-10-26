Status: PASS

共有基盤の実装検証のみ。教材品質の受入ではない。

# 検証記録 — ローカル実装

| 検査 | 結果 |
|---|---|
| 新旧Nodeの工程・組立・配置・変形 | 111 tests PASS |
| workflow全体（team44を含む） | 190 tests PASS |
| corpus・ML・入力互換 | 31 tests PASS |
| 既存教材authoring | Node35＋Vitest4 PASS |
| 最終team／接続境界 | 51 tests PASS（上記と重複する再確認） |
| build | tsc -b＋Vite PASS |
| operation経由 | construction-validate 33組合せ、compile v2、visible preview 28 snapshots PASS/NEEDS_AI_REVIEWを区別 |
| 保護対象 | src/、public/、pnpm-lock.yamlは0401a924基点とbyte不変 |

全テストはローカル実行。GitHub CIの結果は別途記録する。既存の移行fixtureが存在しない旧pathをgit showするstderrを出すが、期待した拒否検査として全190件は成功。buildの既存chunk size警告は残る。

## 相互レビューで検出し修正したもの

作者alias／G2での履歴消失、別blockのfinding解決、任意旧target、未完了resolver、作者着手とCODE待ちの循環、late findingの既存PASS再開、左辺の正答漏れ、LaTeX文字列衝突、行とpartの誤対応、必須契約hashの省略、測定の初期／途中状態抜け、hitOverlapの型。

AがBとMの実装、BがAとMの実装を確認。Mが統合と回帰を検査。作者の自己試験と非作者のレビューは区別した。fixtureは教材の教育効果や実agentの教材品質承認の証明ではない。

公開アプリの教材sourceはc4e7133aのまま。本作業で新しい教材UIを配信したとは記録しない。

## GitHubの固定source検証

最終sourceは31b87bd37c2f4837e57c5d6b6c88241ec2a44f04。主要CI40289658345 SUCCESS。新しいcode-only配布treeの独立checkoutで23テストPASS。既存adapter probeも修正優先queueを含めPASS。初回2失敗はCI_RESULT.jsonに理由と訂正sourceを残し、成功へ改ざんしない。補助N08/N11回帰は同jsonに別記。

正本main185da0e9は7件の現在地・設定・火柴図のみを更新。src/public/workflow/deployへの変更なし。公開appを新しい教材版へ切り替えていない。

専用N08/N11 CI40289658242（job121461462923）SUCCESS。同sourceで全問・全誤答・四幅・旧保存・共有slot geometryを確認。補助の通常変形CI40289658355はapt更新待ちとして別記し、成功とは記録しない。接続toolに取消機能がないため、未実行の取消も記録しない。
