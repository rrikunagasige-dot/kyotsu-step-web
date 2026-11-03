# P-W047-06/T2 — 現在版のCI検証と画像登録

状態：追加1pathの未適用案。P006教材内容とT1検証器2pathの承認は保持。本人のブラウザ再接続を必須にしないため、既存のpush起動機能を使う。

## 追加するパス

`.github/workflows/w047-n1112-verification.yml` 一つ。

未適用の全文は `proposed-ci/w047-n1112-verification.yml`。既存の旧Work・テスト・CIは変更しない。新CIは今回承認した現在版を明示して検査する。教材内容、採点、保存、表示engineの変更は追加しない。

## 実行すること

1. 専用Workブランチへの保存で起動。公開権限は与えず、`contents: read`だけを使用。
2. 固定した旧baselineまたは承認済みartifactとの一致、全85回答・保存revision・段階・式番号、N11の6箇所/N12の適用状態、W038表示と3graphを検査。
3. 数理33件と現在のlearner behavior4件、buildを実行。旧版のbyte固定テストはその旧Workの検査として保持する。今回CIをリポジトリ全検査の合格と称さない。
4. 既存Playwright検査を再利用し、N11/N12を各四幅で全正答・全誤答、旧保存・履歴・再読込まで操作。N11の対話6対象（保持する全式合成も含む）の未回答/完成と、分数問題導入の文脈画面を撮影。
5. 実行source SHA付きREPORTと実PNGをCI artifactへ保存。失敗時も証拠を残し、失敗runの画像を合格証拠へ転用しない。

既存のWork内スクリプトは入力アダプタとして利用し、撮影先・URL・ブラウザpath・source SHAを環境に対応させる。GitHub上に存在しないlocal commitを要求せず、保存済みbaseline commit `929f3c5…` を使用する。旧branchや凍結済みplanは書き換えない。

## 再開する工程

追加1pathの承認後、既存patch adapterのtechnical Workで適用し、pushで自動起動する。実CIの現在sourceを候補へ束縛し、R07の検証・画像登録・非作者意味審査→G2横断検査→G3公開前確認へ戻る。本人受入と技術合格を分ける。N12の教材内容は既承認の5箇所のまま。現在のCIではN12旧版も保護検査するため、CI全PASSだけでN12実装済みとは言わない。N12新版の正式R07ではCURRENT_CONTRACTSのN12 modeがAPPROVEDであることを必須にする。

子agentは既存の二人だけ。追加承認の対象はこのCI設定1pathであり、教材案の再承認は求めない。
