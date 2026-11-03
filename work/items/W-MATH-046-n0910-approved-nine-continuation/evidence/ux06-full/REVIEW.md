# UX06 本適用・確認票

本人page `e95fae75-162d-4d66-bcb5-5d61dd7bddcc` の「修正後は承認として自動で次へ」に従い、代表2点の補修・確認後、残り承認済み10導出/3本文へ進めた。今回の代表細部を再承認待ちへ戻さない。公開承認・本人の単元総合受入は別。

## 何を直したか

具体的な小数候補を平方する目的から、分子141/142を140+1/140+2と見る理由、一般の二つの数A/Bを使う目的、導出後のA=140/B=1または2への帰還を本文で接続した。差の平方と和・差の積にも同型の不足を見つけ、具体根号と文字の対応を補修した。和・差の積を導く前に、それを既習として扱っていた条件も、分配/交換の既習根拠へ訂正した。

和の平方は平方→同じ二因子→分配→四項→交差項の交換→係数をまとめる順。6穴と正答での行解放を保持し、完成式を先に見せない。主導出5行を一つの等号列にし、後ろの分数・補助計算は別groupに分離した。数式フォント縮小や正答後の44px空枠固定は行っていない。

代表以外の負号を含む平方、負数での根号、整数/小数部分、積の平方、差の平方、和差積、3種類の有理化も承認済みの導出へ変更。各段階の文字・数・符号を学生が判断する。以前評価された√a/√bの積・商の証明9nodeはwhole objectで維持した。

検査時のlocal sourceは `5e83a17b…`、GitHub保存した同一full treeの製品commitは `d588d1c395de3132805395f2708bed7535c1767d`。[保存時の完全一致](SOURCE_SYNC.json)。commit metadataだけが異なり、原検査をGitHub版で実行したと偽記しない。G3の公開候補と公開前検査はremote d588へ固定する。

## 実画像

以下は新source `5e83a17ba73c39f855384b31fc51488028b96a09` の実ブラウザ画像。44画像はscroll0全ページからDOMの矩形で切り出し、原画像もimages/full-pageへ保持。固定ヘッダーが上部を覆った旧element.screenshotは採取不合格として区別し、画像受入へ使わない。

- [和の平方・320px完成](images/320-n09-decimal-method-complete.png) / [1440px開始](images/1440-n09-decimal-method-initial.png)
- [差の平方・1440px開始](images/1440-n10-q11-formula-initial.png)
- [和と差の積・320px開始](images/320-n10-q13-identity-initial.png)
- [既往x+4の形・320px正答後](images/320-n09-01-complete.png)

未回答・途中正答・各誤答・完成・履歴の主導出の等号列を実DOMで検査。代表detail候補の28状態はA/Bも可視の「=」のink/矩形を照合し差0px。fullは別sourceで全状態を撮り直し、既存importerで絶対relationXを含むsource-bound契約を検査した。

## 検査と保存

|対象|確認した結果|
|---|---|
|構造生成|既存NODE_DESIGN→nested-lesson→compileTransformationV3→compiled validator。再生成が両unitの保存物と一致|
|既存CODEの判断境界|construction-validate、blank-candidates、interaction-planはNEEDS_AI_REVIEWを保持。有限数学125parts/171候補、失敗0、70parts未対応のPARTIAL。意味の自動合格にはしない|
|関連回帰|152件合格。native検査31件合格。型/build合格|
|実ブラウザ|320/390/430/1440。55+70=125回答、120+145=265誤答候補、4幅2060状態packet。既存checkNestedRunsの両unit取込PASS。実KaTeX Main/Math italic・日本語fontで確認|
|操作/保存|再読込、readonly履歴、旧版試し解答、キャンセル/実行リセット、別unitと旧archive保護、キーボード操作。移行19case合格。旧authored r2の7履歴をr3→r4→r5→r6経由で保持し、残り63回答を実操作|
|履歴契約|N09r9→r10は48KEEP/1RETIRE/7NEW=55。N10r5→r6は58KEEP/2RETIRE/12NEW=70。旧r9/r5をbyte固定、同revisionの別artifactへ黙って回答を流用しない|
|lintの制限|変更sourceのlintは合格。repo全体は既存25error/1warningで失敗。全指摘ファイルが着手baseから不変とLINT_BASELINE.jsonで照合。全体lint合格とは報告しない|

保存検査の原FAILも保持。r9reset後の最初のpowerActionは承認RETIREなので新recordsへ保持しないのが正しい。誤ったfixture期待を訂正し、旧archive全保存、次のKEEP value16の保持、resetAt/event ID/専用keyの保護を改めて確認した。

## 理念監視と工程

[A 数学・前提・保存審査](SOURCE_REVIEW_A.md)、[B 理念・表示審査](RENDER_REVIEW_B.md)、[代表条件の本人承認](DETAIL_ACCEPTANCE.json)、[保護と実差分](PROTECTED.json)、[CODEと実測](VERIFICATION.json)を分けて参照する。rootの実装をrootだけで非作者合格にはしない。初回REVISE・CODE未対応・撮影失敗を消さない。

[火柴図の正本/現在地](../../WORKFLOW_CURRENT.md)に戻って照合する。R05→R06→R07→G2の必要結果をそろえた後の次工程はG3公開前確認。main§12Aに従い公開は別の具体的承認を要し、この条件付き代表承認から推測しない。公開後にrelease.verify/配信byte/操作確認→本人の実物評価→事後同型確認→R08/L01/Z01へ進む。

既存26イベント欠落の本人特例は継続。空Store、架空receipt、正式next認定、本人受入、Gold/fitを作らない。mainと実公開は今回変更していない。
