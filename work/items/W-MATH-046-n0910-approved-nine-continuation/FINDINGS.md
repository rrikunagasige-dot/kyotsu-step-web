# W046 Findings

Status: ACTIVE

## F-UX03-01 — ERROR-SPEC / ERROR-QA
旧UIはN08の排版・番号付き選択肢・左下resetを継承せず、memo再掲と学習行為不足を見落とした。旧技術PASSを消さず、本人のG3_FINAL要修正を保持。旧案UX-02も詳細不足で未完成だった。原指摘・原因の履歴はWORK.md。

## F-UX03-02 — ERROR-IMPLEMENTATION（補修済み）
Aが、旧r2保留回答の親記録欠落とmain-only r3の比較表示漏れを確認。親の初回値/回数/時刻/正誤投影とmain/archive fallbackで補修。実browserでr2移行45新規回答/r3移行3新規回答後に両方36/36を確認。

## F-UX03-03 — ERROR-QA（補修済み）
Bが予備画像で番号枠・node間余白・ラベル横並び・条件再掲を指摘。N08の既存class/tokenと文脈内条件表示へ補修。固定SHA `830b620b343112e4f8c4e3d00b51461dc8ecc098` の20画像をBが確認し限定PASS。

## F-UX03-04 — CONFIRMED / 限定意味審査
H07の正性は正の因子二つの積から導ける。同定には正性と平方125の両条件が必要。Aが現compiledHash `5f42dba655ce6dad1348dcf6cce705138fc7c266240277ad769d22be82f24f2b` で明示PASS。finite-mathのunsupported31件全体をPASSにはしない。

## F-UX03-05 — OPEN-QUESTION / 全体governance
源candidateで42件の他Work記録不足等が残り、修正前adbbc230にも同じ42件があった。新規source違反なし。このWorkの正規記録整備による減少を別途記録する。未合格を隠して公開ゲートへ進めない。他Workの記録や承認を推測で補完しない。

## F-UX03-06 — ERROR-QA / 補修済み
初回16node実装でH12の「和」初出定義を落とした。非作者Aが指摘し、用語metadataと定義を保持。H14の分子だけの問い→全分数の式の接続は、元分数積を左辺へ明示して偽の等式鎖を防止。

## F-UX03-07 — ERROR-IMPLEMENTATION / 補修済み
初回実画像でH03/H11/H12/H13の未完…行が回答後も残存。表示gateへ全part正答後の足場消去を追加。部分hideによる未回答消失はvalidator/runtimeで防御。H03mirrorを失わずPublicPartを引き渡す回帰を追加。

## F-UX03-08 — ERROR-RENDER / 補修済み
N10/320のq17-factorでタグink gap4.06px、N09/390で括弧とタグの衝突を検出。mordだけの衝突対象へKaTeXのmclose/mopen/演算/関係/構造glyphを追加し、衝突時は最後の数式の下へ退避。9692実測で再発なし。H01論理行はKaTeX/日本語接続へ統一。

## F-UX03-09 — ERROR-TEST / 検査側期待を訂正
legacyr2比較は現行/既存keyを変更せず、既知のarchive-review専用cursor keyを新設する。初回全storage一致、続く空{}固定という検査期待が誤りだった。正確な専用keyと旧stage範囲内の整数cursorだけを許可し、既存全key byte不変は維持。原差分/FAILを保存。公開検証器のnative旧版比較は新規cursorを書かないので全storage厳密一致を要求。

## F-UX03-10 — ERROR-RECORD / 補修済み
公開待ちをWORK Statusの未登録underscore値で書いたため記録検査が既存38件から39件となった。規則を変えずStatus: VERIFYINGに戻し、公開待ちはReviewとJSONへ明記。修正前logを保存し、既存38件と今回増分を区別する。

## F-UX03-11 — ERROR-SPEC / ERROR-QA：導出参加度の不足
本人は排版改善を評価したが、n09-01がzeroLogic一穴で移項/因数分解/一次式の処理まで自動表示される点を要修正とした。直前の負数の平方も積の構成/符号を自動化してvalue16だけ問う。既存MASTER §§8/11/52/53と数学SPEC §5の適用不足であり、新しい穴数ノルマではない。完成解法の非自明操作の網羅を検査していなかった。原因→同型→既存基準照合を含む指摘として扱う。詳しい根拠と写真の5操作案はWORK末尾、監査対象はevidence/ux03-full/DERIVATION_PARTICIPATION_AUDIT.jsonへ一本化。製品コードは変更していない。

## F-UX04-01 — 提案草案の不備を補修（製品未実装）
N09の片辺だけ操作したように見える足場、因数分解のtext選択、N10のhide集合不一致・補助式後の偽等式接続・一回答で四積自動生成を案の審査で検出。操作指定＋完全式、式内factorSign、行part集合一致、完全左辺復帰、交差積の構成へ補修。初回FAILと最終非作者審査をevidence/ux04-proposal/REVIEW.mdへ保存。F-UX03-11は提案準備が進んだだけで、製品における解消は未認定。

## F-UX04-02 — 実装移行の保存保護（補修済み・対象runtime確認）
未知native hashから旧版/空へのfallback、source/current専用keyに対する新main reset後回答の消失を非作者審査で検出。未知hashはcommit前拒否、新しいresetAtのexact main ledger全体を採用。10browserケースで保存byte/旧回答field/解放を確認。原所見はpilot source reviewへ保持。

## F-UX04-03 — 描画計測環境のfont欠落（最終描画再検査中）
新worktreeが旧worktreeのnode_modulesへsymlinkするため、dev ViteのFS guardがKaTeX fontをHTTP403で拒否していた。fonts.readyだけでは検出できず、Bの実見/abort指摘とphase付きprobeでMain/Math/AMS face errorを確定。前の四幅128状態/1192幾何のスクリプトPASSを最終描画PASSへ採用しない。回答操作/保存の検査結果とは分離。guard/製品configを緩めず、本番dist previewで各faceとHTTPを確認して同checkerで再検査・再撮影する。原FAIL/403/画像は保持する。

F-UX04-03の検査環境は同一byte依存treeのhardlinkコピーで解消。本体と同じshared module＋実loaded face/HTTPの四幅最終128/1192を別取得し合格、B原画像審査も限定PASS。製品guardを緩めず、旧fallback/別bundleの結果は不採用のまま。F-UX03-11は代表2nodeでの是正観察までで、残り24nodeは承認案の後続範囲として未実装。

## F-UX05-01 — ERROR-SPEC / ERROR-QA：学年相応の主判断の取り違え
本人は高校生の既習逆演算を細分化する一方で、積から二つの因子の零条件を生成する主判断を自動提示している点を指摘。MASTER§§8/11/52/53と数学SPECの高校初学/非自明という既存基準の適用不足。UX04の承認や技術PASSを本人受入へ転用しない。過去問の公式実見と全86node/未実装設計の同型監査をANALYSIS等へ記録し、残り24の適用を止めて具体案改訂へ戻る。

## F-UX05-02 — ERROR-RENDER / ERROR-QA：正答後も空欄予約を保持
添付の第二因子(x＋4)だけ大きい括弧/空白になる欠陥を確認。interactive certifiedでも44px phantomを保持しauto括弧が伸長する実装が原因。正常font下の症状で、前のfont403とは別。N09/N10の94math行/106slotは静的経路候補、全件の画像欠陥実見数ではない。旧非作者表示審査はこの自然組版を見逃した。確定値を自然数式へ戻し、未回答44px操作/planner/混在状態を区別する案を準備する。今回は未補修。

## F-UX05-02 — 同型原因を完成設計へ反映
既存MASTER§§8/11/52/53と高校初学の非自明判断を全86nodeへ適用し、25変更/61維持を確定。穴数を目標にせず主判断の先出し/単純操作の細分化/確定値再入力を修正する。案の相殺交差項が長い単一math slotだった所見は、短いtext enum足場＋一候補内mathLines＋正答後通常式で補修。KEEPは数学上の対象条件と採点契約の保持であり、旧解放gateの固定ではないと明記。いずれも未実装の設計補修であり表示合格ではない。

## F-UX05-03 — R07実寸比較で検出したroot relation markerの余白
初期source33d06bd8の実browserで、認定slot0・括弧同寸でも普通の式より5px長い実欠陥を検出。root relation markerがmrel→phantom(mord)の内部glueを作っていた。markerなし通常KaTeXとの比較を新回帰にし、mrel兄弟＋共通親検証へ限定補修。harness側のprobe 1.21倍率という別の原FAILを先に分離補修した。旧unitPASSはこの実寸同一を証明していなかった。原画像/原計測を保持し、新sourceで四幅再確認へ戻る。
