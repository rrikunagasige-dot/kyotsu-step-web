# W-GOV-010 — 検証記録

## 対象

- 最終検証コード：7d4e5b7c501a0502ece2e77e41506b1a57b8f801
- 対象リポジトリ：rrikunagasige-dot/kyotsu-step-web / ID 1391122224
- 作業ブランチ：work/W-GOV-010-coded-authoring-proposal-20261023
- 保護したmain：e907bf5fc22025fbd74127b9b72176b90aaeb36e
- 最終CI：[39969162480](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39969162480)
- 最終CI状態：SUCCESS。実画像の日本語表示も目視確認済み。

## ローカル検査

- 27の境界・回帰試験PASS。
- 追加合成計算120例PASS。
- 故意に途中式を+1した20例を全て拒否。
- 既知の指摘の構造化再現：自動拒否5／未対応3／意味の審査待ち2。
- 36件の事例台帳の整合検査PASS。正例として使った件数0、学習未実施。
- 教科書3教材と練習用1問のCLI生成：TECHNICAL_PASS。独立した固定収録計画と照合済み。
- コンパイラ・型・カタログ・テンプレートのハッシュ：8ca4888b3b7cd4d6536af0a11e3bcd7658e93999d917768ab41f3cb4c08ab437。

## 実画面の対象

320px／390px／1440px、教科書3教材＋練習1問＝12ケース。各操作で誤答→4段階ヒント→正答、次への解放、再読込、最終式、横幅、一つの導出枠、既存保存キーの維持を確認する。最終結果：12/12 PASS、計63操作。日本語の実描画フォントはNoto Sans CJK JP。元の24枚から代表8枚をGitHub確認票に固定保存し、教科書3教材の完成画面・最初の図と穴・練習の開始画面を目視確認した。

## 検証結果の境界

合成した技術試験と、既知の指摘を使った再現試験であり、独立した未使用教材での精度・教育効果は測っていない。コンパイラの数学検査は有限次数の限定領域にだけ適用する。

単一AIによる設計・意味の審査であり、独立した教育的監査を実施したとはしない。既存Gate①のユーザー細部確認、Gate②の独立横断監査、Gate③の一致した実働アプリでの全体受入は未完。公開教材の修正、main統合、Pages公開は実施していない。

## CI履歴

| コードSHA | Run | 結果 | 役割 |
|---|---:|---|---|
| 6fa5f6baa59828cab4cbfffdfd67b72852638cb1 | 39965531878 | SUCCESS | 初回試作。後続版の検証に流用しない |
| d15986e437ba5c6aae1b1847bb8a93e1498d957a | 39966232688 | SUCCESS | 単一誤操作の選択肢へ変更 |
| 8285706e81b4dd79db3e2a27305812ca23af8c49 | 39966680939 | SUCCESS | 事例カタログを工程に接続 |
| df33767c16d7bfb4e9f671cc80143555cef52bf2 | 39967337449 | SUCCESS | 外部導入で待機した履歴。後に完了を確認 |
| bbe0ea8d7c214d72602a0a529e50dd70d288a459 | 39968268156 | 操作SUCCESS／表示FAIL | 既存Chromeを使用。実画像で日本語の文字化けを発見 |
| 7d4e5b7c501a0502ece2e77e41506b1a57b8f801 | 39969162480 | SUCCESS＋実画像確認 | 固定日本語フォントと実描画フォント検査を追加 |

最終成果物ZIPのSHA256：89c0cc95efde05426a037726a90c5a40dd57840a6fe47a40eb9e5562b11c252d。


## P-002最終コードの検証（2026-10-24 JST）

- コードSHA: d206b6de91cd869cd15c2f60f9f84327deed4143
- 専用CI: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39979184049 — completed/success、head_sha一致。検査・三経路再生・成果物保存の全step成功をコネクタで照合した。
- 実行器66試験、既存生成器27試験、教科書/練習の両アダプタPASS。既存の追加計算120例・破損20例も再実行。
- 作成27・修正27・技術限定8ノードの模擬通し実行と、保存後の再生を確認。模擬のユーザー承認は実承認ではない。
- 実際のP-002実装承認とCIを使った技術限定Work: workflow-execution/、DONE、application_accepted:false。
- Gitツリー全体の比較: src/public/e2e、package/lock、憲法本文の差分なし。変更範囲は実行器・テスト用CI・入口/運用文書・Work内の試作と検証記録。

教育効果・独立未使用教材の品質評価・アプリ全体Gate③は未実施。mainへの正式採用とW-MATH-027の再開は残る。



### 最終追補 — 影響調査の完全性

最終コード: d379a251f5753dccb08b21696027acf33c54e588。専用CI https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39980481915 SUCCESS、head_sha一致。Repository Governance Check #39980482099、Review Preview Code Check #39980481937もSUCCESS。実行器69試験、既存27試験、両アダプタ、三経路の保存台帳再生を確認。追加実行記録はworkflow-impact-execution/、旧記録は対応する旧コード版の履歴として保持する。
