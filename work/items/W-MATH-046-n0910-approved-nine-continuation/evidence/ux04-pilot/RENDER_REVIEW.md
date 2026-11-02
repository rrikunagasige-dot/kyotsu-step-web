# W046 UX04 N09 pilot — 非作者数学・表示審査

Reviewer: /root/w046_render_review
Scope: 承認済みN09案ce632c18のうち n09-q01-negative / n09-01 の2nodeのみ。
Role: N09製品・設計の非作者。N10提案作者であり、当pilotの実装作者ではない。
Status: SCOPED_PILOT_MATH_RENDER_PASS — 下記の最終470f・正常フォント原画像に限定。初回失敗の記録は保持。

## 初回補修後候補 f2bc35bb

- source SHA: 778a6c3acb18765d99f3ebaf922457326af536f1
- N09 r6 compiledHash: f2bc35bbdb464a360d429b504459ff8c0f0b8c082db4e020a3b791f0d92619b3
- 原画像/主担当の実測: /tmp/w046-ux04-browser-final/（後続の必要再撮影と区別して保持すること）
- 主担当実行結果は128対象状態/1192幾何・四幅PASS、共有renderer不変・source manifest前後一致。私は同じ試験を再実行していない。

数学の読取と原PNGでは、累乗の作用範囲→積符号→値を分離し、次nodeも共通逆演算→第二因子の符号→零積→各枝の逆演算を順に行う。未回答の後続計算は解放せず、誤答時の説明と現在の穴を保持する。旧value16/zeroLogicのKEEPと6新partの違いも確認した。

320pxで二nodeの初期/複数誤答/途中/完成、390/430/1440で負の候補の完成と1440の全解完成を実見。元条件はMathCopy、zeroLogicは日本語LaTeX、操作欄はUnicodeを使いTeXコードを露出しない。第一/第二因子という枝ラベルは原方程式との対応を保つ。式番号は最後の可視数式へ付く。

## 主担当へ返した所見

1. 320pxで先頭iffの因数分解行と通常=行を同一relation軸にすると、x²−16 / =16−16=0 と因数積 / =0 が細かく折り返す。数学の誤りではないが、式のまとまりを読みにくくする。先頭iff行を別semantic groupへ分ける小修正を主担当が採用。数学・問い・gateは変えず、原結果は保持して新hashの必要表示再検査へ進む。
2. RESULTのnetworkFailuresにKaTeXフォントERR_ABORTEDが204件（各幅51件）ある。撮影時の失敗か、N11 smoke後のclose由来かが未識別である。1440画像も既公開db99画像よりsans寄りに見えるため、document.fontsのKaTeX各face status（Main/Math-Italic/AMS等）を撮影前に記録して出所を明確にする。現段階でnetwork0/フォント確認済みとは記録しない。
3. 主担当が先に見つけたitalic xとfactorSignのhit域の約2px侵入は原FAILを保持。thinspace補修後の320画像ではxと操作域を目視分離している。最終hashでも必要実測/実画像を確認する。

## 留保

最終の数学・表示SCOPED PASSは、新group hashと撮影時fontを確認した画像に束縛して追記する。承認済み全26nodeの実装完了、公開、本人の細部OK/総合受入、Gold/fitは本審査では認定しない。製品/Git/正式Store変更・新しい重複試験は実施していない。

## font所見の確定と検査方式の補修

主担当のphase付き独立probeで、N09撮影時にKaTeX_Main/Math/AMSのfaceがerror、font HTTPが403と確定した。新worktreeのnode_modulesが旧worktreeへのsymlinkで、Vite devのfs.allow外にあるfont URLが拒否された。close時だけのabortではなかった。

したがって、上記f2bc35bbのraw checkerがPASSと出した幾何・PNGを、正常フォント下の最終表示PASSには使わない。原checker出力/PNG/HTTP失敗を保持し、数学/gateのsource読取結果とは分ける。guardや製品を緩めず、build済みの本番distをvite previewで表示し、撮影前のKaTeX face loadedとfont HTTPを厳密確認する方針を主担当が実施中。必要な計測関数の検証用注入は配信製品そのものの改変ではなく、出所を別記録にする。新source/compiledHash・正常フォント画像を受けて審査を続行する。


## 最終正常フォント版 — 非作者SCOPED PASS

対象候補codeはGitHub `66c8007b37cc12391c9df574b8ebbb1b95cf26f5`。主担当が撮影working treeの変更20ファイルのgit blobと候補commitの一致を確認した報告に基づく。raw RESULTのsourceSHA `778a6c3acb18765d99f3ebaf922457326af536f1` は撮影時worktreeの基準HEADであり、候補実装commitと同一という意味には使わない。

- N09 revision6 compiledHash: `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d`
- compiled JSON byte SHA256: `5b9db2503a303bab5a1c230bafc23d5d133ce3e641cb85c1a93940d5a174e7b2`
- NODE_DESIGN JSON byte SHA256: `2d3854a6dcd4751acb859c9ed3c0484b9e7df8464d7ab959d0de09317c4c856a`
- 最終原画像・RESULT: `/tmp/w046-ux04-browser-font-verified/`
- RESULT.json SHA256: `69a31193ce10a3b8b71d6877442e8d55fae7437b7262ae596d10d801cda5a63c`
- runner SHA256: `d22e5ef665bfb5f86948c2af0d9782ffbe15d14037f4bf36c58a886b1bde51d1`

### 検査方式と原失敗の分離

本番previewに別bundleの計測器を注入する試みは、元shared moduleのWeakMap登録を共有できず `SOURCE_UNVERIFIED` でfail closedした。近似登録やguard緩和でPASSに置き換えていない。この方式は最終証拠には採用しない。

最終runは既存固定依存treeをworktree内へbyte同一hardlinkコピーし、外部symlinkに起因するfontの403のみを環境側で解消したもの。製品・lock・依存version・Vite guard・shared計測moduleの契約は不変。RESULTを読み、276回のfont記録、KaTeX_MainとMath italicのloaded/チェック、AMS loaded、HTTP/network失敗0、505pathのsourceManifest前後一致を確認した。旧403版のf2bc35bb PNG/幾何は正常フォントPASSへ昇格させない。

### 非作者が実見した範囲と判断

主担当の最終runは四幅320/390/430/1440、128状態・1192幾何、104記録PNG＋N08比較4。各幅で52partの解答通過、対象14誤答候補、再読込・履歴・旧比較storage保持・reset cancel/reset reload・keyboard Enter/Space/Escape・N08/N11 smokeをPASSと記録している。私はこの試験を重複実行していない。以下は原PNGを開いた人による独立審査であり、全128状態を目視したという意味ではない。

- 四幅の負候補完成、全解完成、390/430/1440の左逆演算正答直後を実見。左解x=4の確定後も右逆演算の穴を残し、x=−4を先出ししない。
- 320のpowerAction/productSign/factorSign/rightInverseOperationの誤答を実見。累乗の括弧全体、負×負の符号、固定した第一因子に対応する第二因子、第二枝の逆演算という異なる操作を問う。誤答説明は対象式に対応し、後続結果を解放していない。factorSignの誤答は(x−4)²に−8xが残るという正しい根拠であり、問題が第一因子を固定しているので因子順の別解を数学的偽として扱わない。
- 320のfactorSign/zeroLogic初期と320/1440のstage全体も実見。x²−16=16−16=0、x²−4²=0、同値な因数分解、零積の「または」、左右それぞれの逆演算、全場合を尽くす結論は数学的に整合する。負候補の確認だけで全解と断定する構成へ戻っていない。
- 最終正常フォントではfactorSign隣のitalic xと穴枠が分離し、式番号(1)/(2)も可視式と衝突しない。factorizationだけを別semantic groupにした結果、320でも通常の減算行・因数積の不要な細切れは解消している。左右枝の見出し/式/次の操作の対応を保ち、正答後は操作足場が消えて導出が残る。
- 四幅のN08原画像と比較し、共通header/タイトル/単一の現在stage帯/小ラベル/番号付き選択肢/下部resetの表示系統が保たれる。式条件はMathCopyで表示され、零積の日本語は数式行、操作選択はUnicode表示で、raw TeXが本文へ露出しない。

この2nodeの承認案・数学・gate・最終実画像に未解決の確定欠陥はない。製品/正式Work/Git/Storeの編集、新しいbrowser試験は実施していない。このSCOPED PASSは残りUX04対象の実装、公開環境、本人による見た目の受入、Gold/fitを認定しない。
