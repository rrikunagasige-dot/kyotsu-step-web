# 追加D04案 — QF01 R3の本文数式を数学として表示する

状態: **未採用・実装前の具体案**。D03の再採用確認ではない。本案の採用・実D・新after hash・新CODE合格・公開・本人受入はまだ存在しない。

## 確認した問題と今回の変更

現在C `900642faf76267546c5c7420b7d50a010516ca6e` の本文 `qf01-r3-c3-s08-p05` では「横が正であるにはx<20、縦が正であるにはx>0…」が通常文字のspanへ描かれる。同じ式のformula blockはKaTeXである。Rootは320幅の原093画像を実見し、現在の2名はそれぞれ同じ境界を320/390/430/1440幅で実見した。所見は `QF01-C-PROSE-MATH-SPAN-20261123`、native evidence `E-QF01-C-OPEN-PROSE-MATH-FINDING-20261123` としてOPEN保存した。

`docs/MATH_RENDERING_RULES.md` §1は本文inline・formula・choice・resolvedを同じ数学単位として自然なKaTeXへ描く。原QF採用案6a5f65e4…の事例N07-USER-F06も「誤答理由と本文中の数学を実描画」を対象にしている。原案・当該規則・採用済み1d/D02/D03内で、このplain spanを許す明示例外は確認できなかった。読めることや幾何測定PASSをこの条件の合格へ変換しない。

今回求める修復は、**原教材を変えず、R3で既に可視になった本文の数学区間を数学として描くこと**。

例: 通常の日本語「横が正であるには」は通常文として保持し、その後の `x<20` は一つの数学単位として描く。`f(x)`、符号・括弧を含む入力全体、等式/連鎖不等式を分断しない。`40cm` / `x cm` / `y cm` のcmを変数c×mにしない。

現在の `R3FeedbackMath` を本文へ一律流用しない。読取診断では原134canonicalのtext102 parts中66partsに164 token候補があり、KaTeX compile errorは0でも、実3partsのcmが変数扱いになる。また一般英語を数式化する負例もある。この66/164は候補検出数であり、全候補を正しい数学区間と認定した数ではない。

具体inventory候補では164件を数学134件・通常の縦横名詞24件・単位付き量5件・通常名詞と数学の混合1件へ分けた。提案区間は63parts/140spans。元partのUTF16範囲と実未回答paragraph10件のpiecesを照合し、現sliceによる数学区間の途中切断は0だった。この候補と読取診断は実装・画面合格ではなく、採用後の全意味審査と実描画検査の入力である。監査原inventoryは `axis_D04_BODY_SPAN_INVENTORY_PROPOSAL_20261123.json`、SHA256 `e51a1a4ca494a2f1bfaa00c8e40750b0fb394ca9e04aeb9778366a215b0f7cff`。

## 製品の限定設計

製品変更は次の2pathだけ。

- `src/components/textbook/GuidedMathReadingFlow.tsx`
- `src/components/textbook/QF01ReadingRevision3.test.tsx`

Cのbefore hashes:

| path | SHA256 |
|---|---|
| GuidedMathReadingFlow.tsx | `4fb2042b5647620d504a30d334a9d36688b28f7d80fee380c0efbdd5c09ad964` |
| QF01ReadingRevision3.test.tsx | `41cdfc2a6a75e29bb68ccb959e88cbec9c6a9c96235cade13ca363fca78fc320` |

原134canonical/102 text partsを読んで数学区間を分類し、blockId・元partIndex・文字範囲・元lexeme・表示latex・単位/通常文の区別を持つsource-bound inventoryを固定する。単なる「英数字なら全部数式」という規則を使わない。元文字列との一致と境界を検査し、数学の意味・式・語順・学習判断を変更しない。typed区間は既存TypesetInlineMath等へ一体で渡し、通常文は通常文として残す。

全134の静的inventory作成と、実行時の可視状態を区別する。実行時に描くのは確定対応した現在の可視sliceの文字範囲だけであり、非可視区間を再構築・描画・計測しない。63parts/140spans及びslice10件の読取結果で、全35判断・help・正誤・履歴の実行時対応が検証済みとはしない。

inventory/本文用投影処理は上記renderer内のR3限定実装とする。shared parser、CSS、domain、教材JSON、134本文・metadataのbytesは変更しない。現在可視の本文だけを入力とし、hidden正解・未来の本文・正解registryを数学区間の決定に使わない。

未回答paragraphでは `projectQF01R3Block` が元partのsliceを作るため、可視sliceと元partの対応も明示検査する。非表示の後半を再構築して露出させない。数学区間の途中でsliceが切れるなど対応不能なら、その状態を未確認として停止し、勝手な補完や本文再編集で通さない。

元partIndex/start/endは実pending.piecesから平行するorigin対応として導出する。project後の配列位置jを元partIndexとして扱ったり、同じ文字列のindexOfで由来を推測したりしない。solved/recordedとpendingの各経路で、実際の可視partsとoriginの一致を検査する。

canonical表示、readonlyの再掲、前結果・履歴で同じ意味の数学を描き、viewPrefixと元source IDを使ってDOM identityを区別する。slot/choice/式番号/図/枠/焦点/スクロール/解答判定は既存契約を守る。feedbackの既存経路を一般変更しない。旧版・R2・Numbers・他単元へ適用しない。

F05の太字/term改善は本案へ追加しない。原QFで採用された意味説明と、元N07の別の視覚条件を区別したまま保存する。

## 原D03を保存し、新D04の権限と現在版を別に結ぶ

原1d/D02/D03の本人回答、原5repair、B→CのD03補足と実イベント、現在Cの全成果・失敗・OPEN、原first-pass/sealを保存する。D03のquote/hash/afterをD04用に上書きしない。

現在D03はmigration seq13950、event `bad3d783c3d3c9ac40b566bf5a6d4a3eec45b0d5e8ab8f82c1a90b48a7b2f108`、supplement digest `f8ebbd59f53e025d59ff1f888b5d3cb7e4f76cba6b2108087081db16ddc8e00b`。これは真正な先行C履歴として検証する。

別の `qf01-math-prose-rendering-supplement/1` を追加し、固定した本D04原文のSHA256、実本人採用file/evidence・quote・実call参照・transcription hash、baseline/実直前candidate C、実取得後のD、許可product2のC before/D after、原D03 event/digest、現在epoch、実definitionD/implementationDを結ぶ。実D・after・本人回答を採用前に作らない。

baselineはCに固定する。初回beforeはC、採用範囲内で後続移行が必要になった場合のbeforeは実直前candidate/manifestへ結ぶ。各時点のafterを不変に保存し、D04採用後の補足削除・別採用への置換・旧afterへの巻戻しも拒否する。

Python native replay/Runtime/Git proof/技術owner/teamと、publisherのNode検査で、D03歴史CとD04現在Dを同じ条件で検証する。D04の実採用が無ければ新branchを認めない。旧D03 helperの「現在一致」を単に外す変更はしない。normal/D02/D03単独の既存検査とnull PIN拒否を保持する。

原Git proofの5repairs/B blobとD03 B→C差分を保ち、新 `mathRenderingRepair` / `mathRenderingChangedPaths` をC→Dへ別追加する。D04原文は実Git blob/mode100644/rawSHA/working一致とdiff含有を検査する。原D03原文6e072…のGit照合を維持する。全src/public/package/lock treeを調べ、許可2外の製品差分・削除・未知fileを拒否する。

原A22 source/rules/snapshotを保持し、既存RECOVERY ownerを実直前C22から正規再結合する。protected418は同じkeysで許可product2だけ更新し、残416を同一bytesで保護する。既存RECOVERY/PUBLISHERの2技術Workを使い、第三の技術Workは作らない。過去のfilewrite/patchを捏造しない。

## 変更可能pathの上限と公開範囲

製品2に加え、coreは次の最大11path。不要なpathは変更しない。

- `workflow/checkpoint.py`
- `workflow/adapters.py`
- `workflow/runtime.py`
- `workflow/team.py`
- `workflow/cli.py`
- `workflow/integration.py`
- `workflow/definitions.py`
- `workflow/test_checkpoint.py`
- `workflow/test_checkpoint_runtime.py`
- `workflow/test_checkpoint_definition.py`
- `workflow/INTEGRATION_RUNBOOK.md`

publisherは次の最大7path。新Dを実取得した後にcode CI pinsを結ぶ。生産用PINは実R06/export後だけ設定する。

- `.github/workflows/qf01-publisher-g3.yml`
- `tools/release/qf01-publish-contract.json`
- `tools/release/qf01-publish-check.mjs`
- `tools/release/qf01-publish-check.test.mjs`
- `tools/release/qf01-retained-adapters.mjs`
- `tools/release/qf01-retained-adapters.test.mjs`
- `tools/release/qf01-browser.mjs`

本案原文の公開pathは `work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/MATH_PROSE_RENDERING_PROPOSAL_D04.md` の1path。採用後に本案と同一bytesで配置する。元D03原文は変更しない。

本案採用は、**上記20コードpath内の実際に必要な検査済み差分と本原文1path、最大21path** を、公開GitHub `rrikunagasige-dot/kyotsu-step-web` の既存core/publisher作業ブランチへ反映し、必要なCIを実行する許可を含む。送信前に対象path・bytes・SHA256を固定する。同じ範囲のコード反映を別の小分け許可へ戻さない。

実台帳・実本人回答の採用payload・学習保存・認証情報はこのコード送信の対象外。記録は既存Work/専用checkpoint/workspace監査資料に保存する。これらを公開する必要がある場合は実payloadを先に具体化し、別に判断する。main変更・配信はこのコード送信操作で行わず、公開前の依存と既存の実CAS/DEPLOY権限を個別確認する。

## 失効・再検査と停止条件

実source/definition/service/app manifestを導出し、正規preflight・移行・現在候補の再結合を行う。必要ならCの台帳をhash照合した新専用作業先へ保存してからDを唯一の継続先にする。Cと旧Bを凍結履歴として保ち、原plan/users/原承認を保存する。

入力変更で失効するS/T/R、compile/R06 proof、両担当の報告、publisher、R07/G2を現在Dで再検査する。Cで受理したR01/R02/R03や技術CIをDの新合格にしない。固定Linuxの通常workflow/checkpoint/publisherを実実行し、Windows固有FAILをmockで隠さない。既存学習assertion・閾値・負例・null PIN条件を弱めない。

同じ2名を維持するD02方式を使う。制作寄与/理由の既読、independent/sourceFirst/firstPass=false、原作者履歴と初回sealを保持する。現在版の独立審査保証は得られない。次を必須とする。

- source-bound inventoryの全数学候補の意味/区間/単位/日本語境界を実審査し、原134/35判断/ID/AST/保存を照合する。
- 現在Dの本文/ヒント/前結果/履歴、choice/formula/resolvedの数学表示を調べる。原C093の四幅を新Dで実見し、F06 OPENを両現在報告と現在CODE/実画面へ結ぶ。
- 四幅320/390/430/1440、35判断×操作前/一誤選択後/受理後の420状態、全行を覆う新しい全tileを取得・実見する。旧C468枚や局所の実見をDの審査へ流用しない。操作labelを全行/数学の完成認定へ変換しない。
- 軸/基線/固定候補envelope/slot/式番号/図/枠/overflow、全既存正誤選択の回帰、scroll/wheel/history/reload/reset/保存隔離を維持する。
- D03のsource別nearby、表示中0コピー/画面外1コピー、複数source、未成立/測定不能、clip/固定帯/収束を再検査する。原BのOPENfindingも両現在報告と現在実測へ結ぶ。
- D03 supplement削除/入替、D04未採用、C→D前像や直前候補の書換、正しいworking原文と違うGit blob、product2外/保護416の変更、旧Cのreceipt/画像/報告流用を拒否する負例を追加する。

この2製品pathでは安全に実現できない、元本文や数学的意味/ID/保存を変える必要がある、または必須根拠/検査が不足する場合は停止し、具体的な追加差分を別案へ反映する。未解決・CODE FAIL・未見を合意でPASSにしない。

原version91 ZIP・完全prefix・元受付・global queueは未回復/UNKNOWNを保持する。目標は引き続き正規工程を経た実アプリの公開後確認と本人に渡せるURLである。最終 `G3_FINAL@qf01-p035` は本人の実物受入であり、本案採用・コードCI・継続指示から作らない。

採用を求める内容: 本文数学区間の限定表示修復、新D04補足による正規再結合と失効再検査、列記20コードpath内の必要な検査済み差分と原文1pathの既存公開作業ブランチ反映・CI実行。
