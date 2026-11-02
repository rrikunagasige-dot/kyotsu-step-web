# UX05 B共有renderer制作報告（作者）

担当: /root/w046_render_review。製品sourceは下記所有pathのみ変更。Store/Git/公開操作なし。共有実装の自作PASSを非作者レビューへ読み替えない。

## 変更と理由

- certified候補/証明済みmirrorを閉じた通常subtreeとして出力し、操作slot/44px rule/透明spanへ残さない。operator/単項符号/関係記号のTeX文脈をordinary groupで潰さない。resolvedPartsはkey/path/value/sourceを持ち、未確定slotとは分離。
- 未回答/誤答は全候補の中立envelopeと44px操作域を維持。mixed sqrt/fraction/exponentでもcertifiedだけを自然化し、node全体を早期readonlyにしない。
- plannerはraw全future source rowsではなく、projectされた可視public rowsと公開正答値/certified集合を使う。wrong値はneutral計画へ渡さない。visible/certified/width/fontとloaded faceが計画signatureに入り、font loadingdoneにも再計測する。
- 同じ本体compilerとWeakMap登録を維持。DOM exact bindingを通ったgeometryにresolvedPartsを出力し、出所不明DOM/別bundleを証拠にしない。
- mathLinesはoptional表示用配列を型/projectionへwhitelistし、非空文字列/読み上げdisplay/closed grammarを検証。同じbutton/valueの中で意味境界ごとに改行。text足場のownkey正答hideは既存projection契約を使い、正答後は教材側の通常math行へ移る。
- Node toolsのinteraction/math-template.mjsはbrowser TSの直接re-exportで、別grammarではない。compiledNestedLessonから同sourceを使うためNode24が必要とする明示.ts importを採用し、appの拡張子診断にのみ理由付き@ts-expect-errorを付けた。package/lock/tsconfigは変更しない。
- native run checkerはneutralLayoutKeyを比較keyに含めず、可視row＋認定partのpublic phase別に比較する。同phaseのwrong/initialでframe/anchor/group key/columnは従来通り安定性を検査し、認定/行解放での再計画を許す。resolvedPartsを同compilerの期待へ完全照合し、未確定slot側のgeometry/axis/owner/raster検査は維持。

## 検証（正常画像の受入とは別）

- 最終 sourceで47 unit PASS: `/tmp/w046-ux05-render-final-tests.log`。compiler27、renderer3、reader8、domain9。
- 最終native7 PASS: `/tmp/w046-ux05-native-final-tests.log`。実Node source import、実compiled public snapshots、偽の全状態画像ラベル拒否、wrongとinitialの同じphase/filled別phase/可視行増で新phaseを確認。
- tsc-b PASS: `/tmp/w046-ux05-render-types-v2.log`。変更TS lint PASS: `/tmp/w046-ux05-render-lint.log`。
- 新回帰は具体的な普通の因数分解のDOM完全一致、binary+/−・unary−・relation、mixed根号/分数/指数の未回答維持、正答DOM改ざん拒否、mathLines二行一値/一button/読み上げ/足場消去/unsafe line拒否を検査する。jsdomを実幾何証拠とは呼ばない。

## 初回失敗を保持

初回関連unitのreader既存3件は、旧reset reader内ボタン、旧自動次stage/メモ、外部ledger rerender時の現在stageという古いUI期待でFAIL。既存unitは実際の「現在stageを保持→次へ→履歴」を操作する契約へ修正し、resetはunit pageの所有で重複表示しないことを確認。最初のtool出力は本セッションへ記録され、stdout別fileとしては保存していない。次の `/tmp/w046-ux05-render-tests.log` と `...types.log` の原FAILは保存されている。テスト編集時に追加したonReset propsの不足/過剰な文字列置換も補修済み。最終PASSで元の失敗を無かったことにしない。

Node24のextensionless runtime importが初回ERR_MODULE_NOT_FOUNDとなった事実はrootのR04原ログに保存。共通sourceの明示.ts importへ補修した後、native7とroot既存operationsの実接続成功を確認している。

## 境界

Aの非作者source審査、rootの固定SHA/正常font実browser/実保存/数学意味審査を別記録にする。BがA教材/移行を読取した報告と、Bの可視数学pre-design応答は別artifact。実装成功を本人細部受入/公開/全体25node適用へ読み替えない。既存kind metadataがaria labelにも使われる命名整理は今回の自然AST/採点へ影響しないため追加しない。

## 所有変更file hash

- `src/components/textbook/nestedMathTemplate.ts` SHA256 `e6f9c21d31ad2dc0192ccead526359011079b3864be6d9e4f1810a4b4e42bf77`
- `src/components/textbook/NestedConstructionMath.tsx` SHA256 `1bd91a39e382fe73fffd67170fb3fc7be8beec4e36f53002f3f6f14baf6dce9e`
- `src/components/textbook/nestedMathGeometry.ts` SHA256 `bd1eab249c57ac8308327b1cacc27e928a94b2dcf29d56087d53de12c5c12256`
- `src/components/textbook/ConstructionLessonReadingFlow.tsx` SHA256 `1ef02e85a6547f055dbbf0626b604e1e0193313d742f527ae50ed7503fdd2128`
- `src/components/textbook/construction-lesson-reading.css` SHA256 `c0580689710aebdd458fdef015b70fbc563372f6da6622da4d1bc78cd76f53a0`
- `src/domain/nestedLesson.ts` SHA256 `090c6c7dd9a24173f5accb9aee48b8786e344933fc8555fe791494af5b919f09`
- `src/domain/compiledNestedLesson.ts` SHA256 `a2c64fef736e78e0f12df3c50fe2d8c710b83e0b9cfa96f6f1f8d819a453054d`
- `src/components/textbook/nestedMathTemplate.test.ts` SHA256 `36fb0544dc508cc5a833b1ff071420ce96cd590450d73e2ffbdf643ed173a451`
- `src/components/textbook/ConstructionLessonReadingFlow.test.tsx` SHA256 `a41f4de4bf842573581729389a7d594f0c0b57a7273ad6a2efcb3ec26d862c65`
- `tools/textbook/layout/nested-run-measurements.mjs` SHA256 `2428479149b5b23a328747b80b2412d1331377cef677d27cbcc89e68831a7d8a`
- `tools/textbook/tests/nested-native.test.mjs` SHA256 `3d05cfc18400e42347f18697ca761d68f7fc5fdd5f2c24575dd3030269f9c863`
