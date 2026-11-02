# UX05 full browser collector — 非作者組版/操作コード審査B

Reviewer: /root/w046_render_review（root製collectorの非作者、native checkerの作者）。
Status: SCOPED_COLLECTOR_CODE_REVIEW_PASS。自作checkerそのものの独立PASSはAの別審査へ委ねる。
Target: `/tmp/w046-ux05-full/browser.mjs` SHA256 `4bd7a24bb1bd13a1f03309ce40a110f42dd776928765862fe93db59af43c634e`
Root指定固定app source: `ba2e1d8b00c7d7eb113cb9d828ec8b495adcf444`。この報告はコード読取であり、そのsourceの全幅実行成功を先に認定しない。

## actual DOMと比較oracleの区別

- compiler/template/mode/status/font/overflow/slot rect/stateは実shell/formulaとdata属性から収集。geometryは同一app moduleのmeasureNestedMathDOMへ接続しWeakMap/DOM exact bindingを通る。Nodeのexpected metadataをactual packetへコピーする処理はない。
- owner nodeを実DOMから探し、現stageIdは実readerのdata-current-stage、width/pageWidth/readerWidthも実測。毎partのinitial/allwrong/filledを操作し、選択肢をクリックした結果を採取する。誤答では同partが続きfeedbackが見えること、正答では実状態が変わることを確認し、完全coverage/値/型は既存native importerへ渡す。
- fontはfonts.readyだけで合格にせずMain/Mathのcheck、実loaded face（Math italic）、error faceなしを毎settleで検査する。実font寸法の証拠とnode_modulesのMain fontSHAを記録する。
- 式番号はactual label/font/ink/baselineを収集し、root gatheredの行群と通常baseを区別。geometryのroot/slot/axis/inkとtag測定を既存checkerで反証する。

## 現readerとの接続

回答クリックはcurrent stageを保持するため、filled後もownerのinteractive DOMを採取。stage完了後advance内でauto packetを採り、次へを実クリックする。全AUTO stageもこのループを通る。最後のstageはpartループ後のauto採取で補う。各auto packetのstageIdは実DOM、nodeIdsはそのstage全nodeの実存在をsourceと照合し、重複stageは作らない。

auto formulaはそのstageのauto-only nodes＋全node math extrasの実DOM union。math extrasのIDとreadonly modeもそのまま読む。historyは全回答/reload後の最終stageで実際に開き、過去stageのdetailsを開いて実DOMを採る。現在の最終stageをhistoryへ偽装していない。式番号、history-prefixを持つ通常row、prefixなしextrasはactual IDのままで、更新されたstrict importerの契約に一致する。

text-only初期のmathゼロも空配列として取り込み、必要rowの欠落判定はsource-bound exact coverageへ委ねる。ゼロを埋める偽のmemo formulaやdummy geometryは作らない。text slotはactual value/state/editable/button/rectを記録し、mathLines一候補一valueの選択もdata-choice-valueで操作する。

## 操作と保存範囲

各候補を一度ずつ誤答操作し、slot focus→Enter、候補のEnter/Space、Escape後の課題保持を確認。readonly historyのenabled buttonが無いこと、完成→reload、旧版の試し解答前後のlocalStorage全key/value一致を検査する。

resetは取消時の全storage不変、確定/reload後の先頭課題、他unit/main旧版/専用旧keyの不変、現在版のreset archiveが1件増え原ledgerを保持することを照合する。fixtureは専用namespace/新context内の合成seedで、本物の学習者記録を編集する処理ではない。全KEEP/RETIREの厳密移行・firstValue/時刻/回数等はrootの別保存/移行検証と合わせて判定し、このcollectorだけで代用しない。

## 初回所見と最終補修

1. outer catchがexitCodeだけで、manifest assert等のinner catch外の失敗後にRESULT.statusがPASSになり得た。rootがouterFailuresをRESULTの合否へ加え、manifest/終了HEADの失敗をrun.failuresへ保存するよう補修した。最終sourceで確認し解消。
2. source SHAを開始時だけ読んでいた。rootが各run終了時のHEAD一致もassertし、前後manifestとの差を原FAILとして記録する。参照するmanifestは明示されたsrc/public/tools/workflow/package/lock/NODE_DESIGNのpath集合であり、依存物全byteの監視を主張しない。初期dirty-source拒否とsource freezeを合わせる。
3. ERR_ABORTEDを全て捨てる実装ではnetwork0という主張が不正確になる。最終版は原request failureをrun.abortedRequestsへ残し、自分のgoto/reload実行中以外はnetworkFailuresにも入れてFAILにする。許容されたnavigation abortとoperation failure0を区別し、原記録を消さない。全response HTTP>=400は引き続き記録する。

最終版に未解決の確定したcollector接続/組版/操作の所見なし。root報告のdebug N09 320px/182packet PASSは接続確認として区別し、Bが新しいbrowserを起動したとは記さない。正式な四幅両単元の実行、完全native importerの肯定受入、最終画像の教材/表示審査、本人受入は別段階。本報告のための製品/Store/Git変更・重複browser試験は行っていない。
