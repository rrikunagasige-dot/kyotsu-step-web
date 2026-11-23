# 追加D05案 — QF01 R3のまとめ・意味選択肢・フィードバックを同じ数学表示へ結ぶ

Proposal ID: `P-QF01-MIXED-INLINE-SURFACES-D05`。版はV2。状態は**未採用・製品実装前**。原D04の再承認ではない。実装後source・新after hash・現在版の合格・公開・本人受入はまだ存在しない。

## 現物で確認した問題と範囲の理由

現在の教材・実装・native candidateはD3 `249cc8ee4648bc86897e66e3c9b5847e5592e5c1`、tree `c7cd91e86cd3bc07dd9080028a996091685037d1`。現行D04ではparagraphの140数学区間と原math22を数学として表示した。四幅420観測・help280観測、全行を覆う採用915tile（740同bytes画像）の取得を完了した。このカウンターは次の別surfaceを全て含むものではない。

1. 段階末のmarker本文では、例えば「入力xの定義域は0<x<20。両端は含めない。」が通常文字のまま。原canonical `qf01-r3-c3-s08-m02` を描くbranchは `b.text` を直接渡し、四幅の実DOMでKaTeXは0だった。
2. 意味選択肢では、例えば「括弧の外の−1と、括弧の中のaとの積」「20より小さい」が通常文字。意味を問う選択肢にも数学区間があるが、現branchは `answerDomain==='semantic'` の値を直接表示する。320幅の実DOMで全24選択肢を取得し、数学を含む18文字列もplainだった。解決済みspanのprobeは8件とも非mountであり、これをplain resolved answerの根拠にしない。
3. ヒントの実pは `display:grid`。通常文と数式をfragmentで直接入れたため、例えば「『4倍』は、入力と4との積を作る操作です。」の文・4・文・4・文が別grid itemになり、広い1440幅でも別行へ分かれる。式内部の分割とは別の表示問題である。

Rootは四幅140help DOM・36段階末DOM・44PNGを実クリックで取得し、source前後不変、ブラウザerror・外部network試行0を確認した。実DOM診断のSHA256は `5e4b9d46db200359a8b74a7d452f81e2ff2c731ac72ef3616d32baa8d66f3268`。意味選択肢の別320診断は `80335a2e0645a8466e4a952acde5b7b26a232208aab43274e0cc9075e2bebe3d`。所見は `D3_OPEN_OTHER_INLINE_SURFACES_FINDING_20261123.json`、SHA256 `e4bd2ac4703abcec535896300d1e7bc90c707d1df9b3b7faf282db09191635fb`、正式evidence `E-QF01-D3-OPEN-OTHER-INLINE-SURFACES-20261123` として保存した。

`docs/MATH_RENDERING_RULES.md` §1は、同じ数学的表現を本文inline・formula・choice・resolvedのどこでも自然なKaTeX表示にする。読むことができる、KaTeX compileが通る、paragraphのcounterが0というだけでは全体合格にならない。一方、採用済みD04原文31–43行は102partsのinventoryとその可視sliceを設計対象とし、feedback既存経路を一般変更しないと明記した。marker/semantic choiceとフィードバックの境界・flowを追加するため、`governance/WORK_SYSTEM.md` §11に従って本案を提示する。

## 元文を変更しない追加境界

固定した候補は `D05_ALL187_TYPED_BOUNDARY_INVENTORY_PROPOSAL_V2_20261123.json`、322,155 bytes、SHA256 `474f3e40d743bdfdbb35c361049c165b605dedd160b0fb63f17779eb0a5d09e8`。

| 現sourceの候補 | 全文字列 | 数学を含む文字列 | 数学区間 |
|---|---:|---:|---:|
| canonical marker | 23 | 7 | 14 |
| semantic 8問の全選択肢 | 24 | 18 | 25 |
| hint70＋非null誤答理由70 | 140 | 97 | 152 |
| 合計 | 187 | 122 | 191 |

誤答理由のnull35枠は非可視sourceとして別記し、空文や閲覧済みに変換しない。semantic全8問のacceptedAnswersは現在すべて空配列で、解答・候補・採点は変更しない。問１/問２、順序を示す第2項/2つ目、普通名詞としての縦/横は通常文のまま。値・変数・符号・括弧・等式・比較は原文の意味単位で数式化する。

例として、先頭の `+1` は符号込みの一単位、`0<x<20` は連鎖全体を一単位とする。説明用の `f(入力)=対応する値` は `f(\text{入力})=\text{対応する値}` とし、日本語placeholderをx/yや実際の答えへ置換しない。数量labelを使う `縦×横` は式全体で扱い、普通の「横を縦の式で表す」等とは区別する。現140feedbackに単位literalは0であり、単位を補わない。

現R3FeedbackMathのTS ASTから関数を正確に取り出した読取診断では166lexer単位だった。これを正解へ流用せず、140文字列を個別に読んで152区間を提案した。境界差の11文字列はinventoryに原文・旧出力・提案区間を残す。これは語句・数学・判断内容の修正ではない。

V2では検査の比較対象を明確にする。AST/可視inner HTML/spacingの同一性は、提案typed191区間それぞれのungroupedとwhole-groupedの比較で検証する。旧166lexerとの11境界差は、原文字列の完全保持と個別の意味審査で検証し、旧lexerの単位数・切り方との同一性を要求しない。V1から全187原文字列・191区間・source/hashは不変で、修正は検査要件の表現だけである。隔離191式診断は境界が同一のV1を使用しており、新V2を実行済みと偽装しない。

## 製品の具体設計

製品変更は既存の次の2pathだけ。

- `src/components/textbook/GuidedMathReadingFlow.tsx`
- `src/components/textbook/QF01ReadingRevision3.test.tsx`

現在D3のbefore SHA256は順に `a6cdaeff9ab4e1b7b8e78006475a9ef19ce1b1bdb57546ccff7c8dad1980ee6c`、`c72637c2de40e5fab336f9eba896862d74dda11a4477036b4236c345acb1cebe`。afterは採用後の実装・検査・実Git取得後だけ確定する。

rendererのR3限定部分へ、上記187文字列のsource identity、元field/item/index、原UTF8 SHA256、UTF16範囲、原lexeme、表示LaTeXを持つtyped境界を置く。本文paragraph140区間＋原math22とは別集合として維持する。全英数字をregexで数式化する一般規則を作らない。旧汎用feedback helperを他教材向けに変更せず、現在R3の登録済みmarker/semantic choice/feedback入口を限定して結ぶ。

描くのは現在の条件で可視になった原文字列だけ。markerは実projected block、選択肢は現在の実候補、誤答理由は実際に選んだ候補の原index、hintは実際のopen/attempt条件で結ぶ。正解や未来の本文を用いて表示文字列を補完しない。field/source/hash/rangeの対応不成立は未確認として操作を停止し、plainへの黙ったfallbackや本文の補作で通さない。未表示の187文字列をDOM・aria・計測probeへ一括挿入しない。

数学区間だけを既存TypesetInlineMathへ一体で渡す。不可視relaxを含むpure TeX whole-groupは、元のAST・演算/関係spacing・見える記号を維持して各式の内部改行を防ぐ。日本語は通常文のまま。markerの役割、候補の順序/判定、resolved/誤答値/readonly/historyの元条件は維持する。

helpのpとその枠・CSSは維持し、内部を一つのinline-flow要素で包む。gridの直接childを文・数学ごとのfragmentにせず、その一要素内で通常の行折返しを行う。共有CSSや共有TypesetFormula、他単元のhint/feedback/Numbers/R2は変更しない。

未採用の隔離HTML診断で候補191式のKaTeX parse、whole-group前後の内部AST/可視inner HTML/spacingの一致、1baseを調べた。18pxで最大自然幅180.609375px、現320 hintの実content幅184.65625pxだった。これは実現性の診断であり、製品への実装・現アプリの全状態合格ではない。実装後の四幅・全状態・文字や枠の検査を別途必須とする。字を小さくして押し込む、式を切る、隠す、条件を緩める実装はしない。

## 保存するもの

原134canonical（marker23/paragraph66/formula44/figure1）、35判断・全ID/解答候補、27 owner AST、metadata、compile入力、図・式番号・slot/固定候補envelope・前結果/履歴・保存を維持する。

`qf01Unit.json` raw SHA256 `36ecc2dca63b664f67337134b491b2377ad32d28b6f0c02b7500f4b7561d2e2e`、`qf01ReadingPresentation.json` raw `1c0914d502cedbc3d5d543fdd9b01afa8fe8fcb3a46850ee0a7ae331a4af8349` を変更しない。原文・誤答理由・学習判断を直す案ではない。現在のparagraph typed140＋原math22、D03 source別nearby判定、以前のR2/Numbers/他単元を保護する。F05の別term/太字要件は追加しない。

## 原D04を歴史として保存して現在版へ結ぶ

原1d/D02/D03/D04の実本人回答、固定原文、各補足・migration event・各時点のbefore/after、旧成果・失敗・OPEN・作者履歴・初回sealを保存する。D04の採用をD05の採用へ付け替えない。

別のD05補足に、本案の固定hash、実本人採用file/evidence・実call参照・quote/hash、実直前candidate D3とmanifest、新取得後のcandidate、許可product2のD3 before/新after、真正な先行D04 event/補足、現在epoch/definition/implementationを結ぶ。後続移行が必要ならbeforeは実直前candidate/manifestとし、各afterを不変保存する。過去補足の削除・採用入替・旧after巻戻しを拒否する。

Python Runtime/native typed replay/Git proof/技術owner/teamとpublisher Nodeで同じ条件を検査する。新補足が無ければD04の範囲外変更を認めない。正常/D02/D03/D04単独の既存guard、原B5repair、原C2path、null PIN拒否を維持する。既存RECOVERY/PUBLISHERの2技術Workだけを使い、原A22 source/rules/scope/snapshot、protected418keys/許可2以外416を保持する。過去patch/filewriteを捏造・再実行しない。

現在の公開core branch head `c0be347fdc2bcf8f749aff1518c4620955ee93d3` は、D3の既存負例3件の期待位置だけを直したtest-only childで、現在native candidateではない。この区別と実P11 Linux CIを保存する。D05実装candidateへ修正済みtestを収録するときも、nativeの実直前D3をtest-only childへ偽装しない。同一定義の偽migrationや無意味なversion bumpを行わない。

入力変更で失効するS/T/R、現候補proof/compile/R06、両報告、publisher/R07/G2は新実版で再検査する。現D3のR01/R02/R03・P11・915画像を新sourceの合格として再利用しない。原6a教材案のIR/内容が同一ならR05は真正な既承認へ照合し、本人の新しい品質受入を作らない。生産用PINは実R06/export後だけ設定する。

## 必須検査と停止

- 全187原文のidentity/SHA/UTF16/191区間と65通常文字列、null35枠を照合し、元語句・数学・判断を変えない。各数式のparse/AST/annotation/spacing/wholegroupを実検査する。
- marker23、semantic24全候補、hint70、非null理由70をsourceで全件審査。四幅の実UIでは35判断の操作前・一誤選択後・受理後の420観測、help開閉280観測、全行を覆う新しい全tileを取得する。第2hintは実再誤答によって別途確認し、非可視nullを完成状態にしない。
- 選択肢・実誤答値・成立済み値・readonly/前結果/compact/full history・段階末・unit-summaryを、実mount条件で検査する。非mount probeは未表示として区別する。
- 本文140＋原math22の既存六counter/実visual line、Bのnearby可視境界、原C093・旧D1007を維持。新表面は別の計測を加え、KaTeX0/数学区間欠落・余分・単位誤り・内部split・source mismatch/欠測を拒否する。grid fragment分断と自然な文の折返しを別に調べる。
- 図/枠/slot/番号/軸・基線/固定候補envelope/overflow、全既存正誤、scroll/wheel/history/reload/reset、保存隔離と既存版保護を維持する。新文字列を正解の先出し・隠れた計測oracleとして使わない。
- 同じ2名が実task・全原画像・全191区間を実際に確認し、各実報告を現在claim/input/target/authority/CODEへ結ぶ。D02方式の制作寄与・理由既読、independent/sourceFirst/firstPass=falseを継続し、独立審査の保証は得られない。未見・未確認・CODE FAILを合意でPASSにしない。
- 実採用欠落/別採用、実直前candidate/manifestの偽装、原D04歴史入替、product2外/416保護変更、原文と異なるGit blob、旧版receipt/画像/報告の流用を負例で拒否する。修正済み旧3負例と既存深部保護テストを保持する。
- 固定Linuxで通常workflow/checkpoint/publisher・app/build/lintを実実行し、全体lintの既知baseline FAILは同一性を検証して保存する。閾値・元assert・null PINを緩めず、環境固有失敗をmockで隠さない。

2製品pathでは安全に達成できない、原文・数学・採点/ID/保存やshared CSS/domain/metadataを変える必要がある、必須根拠が不足する場合は停止し、変更部分を具体化して追加判断へ戻す。本案から未確認の教材改訂・一般的UI改良・他単元への展開を許可しない。

## 変更path上限と公開範囲

製品2に加えるcoreは、必要な場合の次の最大11path。

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

publisherは必要な場合の次の最大7path。

- `.github/workflows/qf01-publisher-g3.yml`
- `tools/release/qf01-publish-contract.json`
- `tools/release/qf01-publish-check.mjs`
- `tools/release/qf01-publish-check.test.mjs`
- `tools/release/qf01-retained-adapters.mjs`
- `tools/release/qf01-retained-adapters.test.mjs`
- `tools/release/qf01-browser.mjs`

本案原文を同一bytesで置く公開pathは `work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/MIXED_INLINE_SURFACES_PROPOSAL_D05.md` の1path。元D04原文は変更しない。

本案の採用は、**列記20コードpath内の実際に必要な検査済み差分と本原文1path、最大21path**を、公開GitHub `rrikunagasige-dot/kyotsu-step-web` の既存core/publisher作業ブランチへ反映してCIを実行する許可を含む。送信前に実path・bytes・SHA256を固定し、不要なpathは変更しない。同じ範囲の必要な後続修復・再結合も同じ許可の中で検査・記録する。

実台帳・実本人回答の採用payload・学習保存・認証情報はこのコード送信の対象外。これらの公開が必要な場合は実payloadを先に具体化して別に判断する。main変更・配信はこのコード送信操作で行わず、既存の実CAS/MERGE/DEPLOYと公開前依存を個別確認する。最終 `G3_FINAL@qf01-p035` は本人の実物受入であり、本案採用・CI成功・続行指示から生成しない。

原version91 ZIP・完全prefix・元受付・global queueは未回復/UNKNOWNのまま。目標は正規工程を経た実アプリの公開後確認と、本人へ渡せる現在sourceに一致するURLである。

採用を求める内容：原文・判断を変えないR3追加187文字列/191区間とヒントflowの限定修復、原D04を保存するD05の正規再結合・再検査、列記20コードpath内の必要差分＋本原文1pathの既存公開作業ブランチ反映・CI実行。
