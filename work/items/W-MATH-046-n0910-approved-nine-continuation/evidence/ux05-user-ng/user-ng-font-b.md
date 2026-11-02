# 本人NG フォント階層の読取診断 B

対象は公開製品source691dのfrozen sourceと本人添付image(7).png。修正・公開・Git/Store変更は行っていない。結論：選択肢だけ本文/独立式より小さくなる実CSSの継承経路があり、正常KaTeXフォントがloadedの状態で実DOM再現した。フォント403や以前の擬似計測bundleとは別問題。

## 原因

src/styles/global.css:399 `.reading-choice-option > strong {font-size:.88rem}` が選択肢の本文wrapperへ適用される。ConstructionLessonReadingFlow.tsx:165はtext/mathどちらの候補も同じbutton直下strongへ置く。construction-lesson-reading.css:50はstrongのmin-width/weight/wrapを上書きするがfont-sizeは上書きしない。button自体のfont:inheritは18pxでも、子strongの明示.88remを取り消さない。construction-lesson-reading .katexはtoken1emなので、choice内KaTeXはstrongの14.08pxを継承する。一方reader本文とnested-math-shellはtoken18px、shell内KaTeXも18px。

番号にも別の詳細度競合がある。global.css:398 `.reading-choice-option > span {font:700 .7rem/1 ui-monospace,monospace}` はlocal `.construction-lesson-choice-index {font-size:14px}` より詳細度が高く、実際11.2pxになる。番号を本文と同寸にすべきという承認判断までは本診断で行わないが、local想定14pxも実効値になっていない。

## 最小実DOM

固定済みdistをownport4197のVite previewで一時配信し、fresh contextで320/1440を各1回確認。全教材/全状態の再試験はしていない。初期のtext選択と最初の正答後の数式選択の2状態を見た。Main/Math-Italic/AMS loaded、HTTPerror0。

|対象|320|1440|
|---|---:|---:|
|html（rem基準）|16px|16px|
|reader|18px|18px|
|選択肢の問いp|18px|18px|
|独立式shell / KaTeX|18px|18px|
|choice button|18px|18px|
|choice strong（text/math共通）|14.08px|14.08px|
|choice KaTeX|14.08px|14.08px|
|choice番号|11.2px|11.2px|

原設問の見出し的paragraphは別途16px/600指定があり、全pを一括18pxとは述べない。本文・式・候補の役割別Typographyを決めず全フォントを機械的に同一化する修正は本依頼に含まれない。

原JSON：user-ng-font-probe-b.json SHA256 d67b208df7084c73dd2e3ecc035cb846b6b834b2ffe8ed2203b572c94ad7182f、user-ng-font-math-probe-b.json SHA256 7c540fa288dee7913163d458d459235595f3b7392df3419781aa9851fcd6d4ab。最初の別execで起動したpreviewは次呼出時に終了しておりERR_CONNECTION_REFUSEDを一度記録した。単一管理process内でserver起動→probe→終了とした実測で上記値を得た。製品差ではない。

## 過去4228math測定の取り逃し

browser.mjs fullFormula/packetは `.nested-math-shell` を列挙し、shellのcomputed fontとsourcebound geometryを採取する。選択肢button/strong/MathCopyのfont-sizeや本文との比率はpacketに含まれない。settleのfont確認はフォントfaceの正常loadedであり、画面内role間の実サイズ統一ではない。通常AST寸法比較も独立式のshellを18pxで比較しており、14.08pxの選択肢を比較しない。したがって4228件がPASSでも今回の差を反証しない。

これは過去の実画像確認でも目視で指摘すべきだった見落としである。自分のshared renderer/collector関与を含め、数学・slot幾何の合格を画面全体のTypography合格へ広げた範囲が過大だった。今後の修正が承認された場合には、本文/問い/独立式/choice text/choice mathを同じ可視状態で役割別computed fontとして記録し、意図する階層を確認する検査が必要。現時点は原因説明のみで製品補修を行わない。
