# UX05 full — native complete-run importer 現UI対応 作者報告B

担当 /root/w046_render_review。既存checkNestedRunsの接続補修で、新しい判定エンジン/Store受理器を作らない。renderer/教材/記録を変更しない。Store/Git/公開操作なし。

## 旧接続の不足と実source契約

旧checkerはreaderに無いterminal memoを期待し、filled直後にfrontierが次stageへ進んだことから現在rowをreadonlyと仮定し、historyに現在の最終stageまで含めていた。現在のreaderはstageCursorで回答のowner stageを保持し、次へ操作の後に進む。historyは現在より前のstageだけ、memo別表示はない。rootが指摘したこの不一致を既存checkerへ反映した。

- main packet.stageIdはそのpartのnode.stageIdと一致必須。math rowはfilled直後もinteractive。resolved partの通常ASTと未回答slotは既存compiler/geometry contractで照合する。
- expectedForから未表示terminal memoを削除。実際のmath extrasはnode認定後だけreadonlyで期待する。
- historyの通常rowはhistory-prefix、式番号/aliasは通常と同じ。extrasのDOM idはhistory-prefixなし。最終stageより前の全nodeだけを期待する。
- auto補助packetは全stage各1件、stageId一意。auto-only nodeの通常mathと、そのstageの全nodeにある認定後math extrasのunion。auto/extrasが無いstageでも空formulasのpacketを要求し、stage訪問を欠落させない。
- text-only課題では初期math rowが0件になることがある。formulasは配列必須とし、非空を一律要求するのでなくsourceからの完全な期待ID集合で検査する。必要mathがあるのに空のpacketはcoverage FAIL。
- 未知の補助packet種別、欠落/重複/未知auto stage、historyの別stage、mainの別stage、readonlyへのすり替え、memo注入を拒否。

## 維持した厳密な検査

全part/initial/allwrong/filledのsource-bound snapshot照合、全候補の状態数、正確なtemplate/mode/row/式番号/slot/path/value、resolvedParts/root relation proof、public certified phaseでのwrong中立安定、WeakMap本体DOM証明、axis/ink/raster/hit/frame、sourceSHA/script/fontSHA/前後manifest、四幅/lifecycle/keyboardを維持。HTTP/network配列も存在し空であることを明示検査する。

期待関数をexportしたのはDOM targetとoracleの接続を明確にするため。root collectorは実template/mode/status/stage/geometryを実DOMから読み、期待metadataをactualとしてコピーしてはいけない。export helperも新しい成功receiptを発行しない。

## 検証

`/tmp/w046-ux05-full/native-checker-final-tests.log` 既存7＋新2＝9PASS。新しい回帰は具体的な二stage fixtureでmemo無し/過去stage限定/同番号/extra id、実compiled snapshotを使った否定fixtureでwrong stage/filled readonly/memo注入/auto stage不足/未知aux/HTTP403を拒否する。否定fixtureは常に実DOM evidenceではなく、完全runの肯定PASSに使わない。

N10の独自runtime3回帰 `/tmp/w046-ux05-full/n10-learning-tests.log` PASS、変更TS lint `/tmp/w046-ux05-full/n10-learning-lint.log` PASS。同類項構成の後に係数を問う、相殺の具体組の後だけ計算を解放、Q20初回平方/実result参照からQ21符号込み中項へ進むことを、各対象値を独立した具体式として確認している。

実全幅ブラウザrunの肯定受入はrootの実collector→同じcheckNestedRunsで別に確認する。この作者報告はその成功を先に主張しない。A/rootへsourceとcollectorの非作者審査を依頼済み。

## 固定file SHA256

- `tools/textbook/layout/nested-run-measurements.mjs` `d8811cf73b79ff50222e15942e6c1c49cd114dcb27a94063500e2b66b833cfac`
- `tools/textbook/tests/nested-native.test.mjs` `4954deacad656142e69ba9000abfbe4de7329afa7ebcfa5f550bf5d85c0014ec`
- `src/domain/nestedLesson.ux05.n10.test.ts` `72edb139dcc22f8d05b0c5f30109677a8c77cfbcc230b4f62727fea86e25e8c6`
