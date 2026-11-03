# P-W047-06/T1 — N11の原本・AST対応を二つの固定版へ限定する

状態：未承認、未適用。P-W047-06の教材内容承認は記録済みであり、再承認を求めない。本書はそのscopeに含まれていない検証器2ファイルだけの追加確認。

## 実装前に見つかった制約

R05の本人承認を記録し、R06の未適用生成を実行した。N11の6node変更・N12の5node変更、85回答契約・node/stage/表示block ID・採点・保存revision・式番号mapを保持する生成物は作成できた。ただしN11の既存W038表示を正式再compileすると、TG03_COVERAGEで拒否された。実製品は未変更。

`tools/textbook/transformation/n11-source-binding.mjs` はW038承認時のAuthored全体hash一つを固定している。変更が第5・6段階の外であっても全体hashが変わるため、既存生成関数を呼ぶだけでは新版を登録できない。SYMpy依存を既存環境で解消した後もTG03だけが残ることを再現した。本文を直したのに旧hashのままとする方法、sourceGraphsを後付けして別経路を通す方法は使用しない。

## 追加する二つの製品パス

|パス|未適用差分|
|---|---|
|tools/textbook/transformation/n11-source-binding.mjs|旧sourceHashと3graphの対応を保持し、今回の固定Authored hash `3465df01e4d764a6aae14742b370804494450055205c968685715c9157cb10fe` と同じ3graphの対応を一件だけ明示登録|
|tools/textbook/transformation/validate.mjs|当該source hashに対応するgraph集合で検査する。未知source・graph改変・欠落・追加・重複を拒否。採点・範囲・slot・解放順・数学検証のガードは維持|

差分の実体は [proposed-tooling/CHANGE.diff](proposed-tooling/CHANGE.diff)、適用前後hashと全文は [proposed-tooling/PATCH.json](proposed-tooling/PATCH.json)。共有検証器へは未適用。

## 実行済みの検証

二ファイルを隔離した一時コピーへ置き、既存compilerとvalidatorを実行した。`check_bridge.mjs` から再現できる。

- 旧source：既存compiler PASS。
- P006固定source：既存compiler PASS。
- さらに1token変えた未登録source：TG03でFAIL。
- graph改変・欠落・追加・重複：各TG03でFAIL。
- compile後のW038 groups/interactions/gradingHash/numberAliases/scopeは旧版と全項目一致。

原結果は [evidence/PROPOSED_BRIDGE_CHECK.json](evidence/PROPOSED_BRIDGE_CHECK.json)。これを候補教材の実画面合格とは扱わない。

## 承認後の再開点

1. 本書への追加承認があれば、旧P006と2IRを不変のまま追加scopeと固定生成証拠を工程へ束縛する。元の内容承認を別内容へ転用しない。
2. block別content_design_hashと、生成bytesから算出したpatch_hashを登録し、更新した入力のR04/R05を既存CODE・元の同target審査・有効な本人承認と照合する。古い結果hashを直接書き換えない。
3. R06の限定patch adapterで適用し、R07の実装後検証へ。四幅・85回答/全誤答・旧保存と履歴・原5図・N09/N10保護を確認する。

子agentはA=w047_review_design、B=w047_layout_sourcefirstの二人のみ。以前の完了taskは履歴として保持し、再稼働しない。本文・問題・穴の設計追加、新しい表示engine、保存resetは本書の対象に含めない。
