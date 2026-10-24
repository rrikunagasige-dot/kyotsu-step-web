# 既存コードの調査 — 自作・AI設計・検査の仕事をどこまで減らせるか

Status: RESEARCHED / ADOPTION PROPOSED
Date: 2026-10-24 Asia/Tokyo
Work: W-GOV-010
Related proposal: P-002（未承認）。本調査は採用実装の承認・実施を意味しない。

## 1. 結論と前案の不足

ユーザーの指摘どおり、P-002は既存の解説資料とアプリ内コードを調べた一方、外部の実装を使って開発・設計作業を減らす調査が不足していた。自作モジュールを先に列挙し、既存資産との差分を見ていなかった。

今回、10リポジトリの現在のcommit・保守状態・license metadataを確認し、26のコード／schema／テスト／package／licenseファイルを読んだ。加えて、教師WordのPandoc変換と、Fraction.jsの12例を隔離環境で実行した。確認したcommitと実ファイルは[REFERENCE_CODE_SOURCES.json](REFERENCE_CODE_SOURCES.json)へ固定した。

採用方針の案は次の三層。

1. **計算・変換の基盤は既存コードを使う候補へ変更**：Pandoc/texmathによるWord数式変換、Fraction.jsによる正確な分数・循環小数処理。
2. **教材の設計方式と試験資産を参考にして考える量を減らす**：Mathstepsの操作trace/substeps、Numbasの穴・補助段階・式規則、STACKの答えの要求別検査、PreTeXtの教材構造、DoenetMLの条件表示。
3. **私たちの固有部分へ実装を集中**：日本語の誘導、既習と前結果、意味ある穴の採否、スマホの受入済み組版、既存進捗と公開経路へのadapter。

これは候補の選定であり、統合が動作するとの結論ではない。導入コストと削れる自作範囲を実験で確定する。現在の公開アプリやlockfileは変更していない。

## 2. 調査対象の比較

commitは下記の調査時点に固定。license欄はrepoのmetadataと確認したファイルの表示であり、個別ファイル・第三者資産を全て同じと断定しない。原文コピー・組込は採用方法を確定してから行う。今回はアプリへ外部コードをコピーしていない。

| 対象 | 確認した資産 | どの仕事を減らすか | 提案する扱い |
|---|---|---|---|
| [Fraction.js](https://github.com/rawify/Fraction.js) / MIT | BigInt分数、循環文字列、演算、テスト | 分数・約分・符号・循環の値を毎回自作しない | **N07の数値基盤・検算候補**。限定probe12件PASS |
| [Pandoc](https://github.com/jgm/pandoc)＋[texmath](https://github.com/jgm/texmath) / 確認sourceはGPL v2以降 | docx reader→OMML reader、分数・根号・指数の変換 | OMML変換器をゼロから作る仕事 | **制作時CLI候補**。教師Word変換probe成功。原位置mapと意味監査は残す |
| [Mathsteps](https://github.com/google/mathsteps) / Apache-2.0 | changeType、old/new node、substeps、同類項処理と試験 | 途中式を持つ構造・操作分類・試験例の設計 | **参考設計優先**。archive済み、古いmathjs依存。全体導入は保留 |
| [Numbas](https://github.com/numbas/Numbas) / Apache-2.0 | gapfill、part、式のrewrite、状態保持 | 穴・補助段階・回答後説明・式規則の構造設計 | **schema/状態/規則の参考**。runtime丸ごと交換しない |
| [STACK](https://github.com/maths/moodle-qtype_stack) / 確認sourceはGPL v3以降 | answer-test controller、fixture runner | 同値・形式・既約等を分ける検査設計とケース | **検査分類・固定例の参考**。Moodle/Maxima一式導入は保留 |
| [PreTeXt](https://github.com/PreTeXtBook/pretext) / COPYINGはGPL v2またはv3 | 実schema、task/hint/answer/solution、最小教材 | 定義・証明・例題・段階の内容契約設計 | **既存schemaへの対応表を作る**。独自XML一式への移行は保留 |
| [DoenetML](https://github.com/Doenet/DoenetML) / AGPL-3.0表示 | Hint、ConditionalContentの状態と依存 | 条件に応じた教材表示・ヒントの設計方式 | **状態モデルの参考**。大きなworker/renderer導入は保留 |
| [mathjs](https://github.com/josdejong/mathjs) / Apache-2.0 | Fraction型がfraction.jsを利用する実装 | 汎用数学ライブラリと分数だけの利用を比較 | N07分数だけなら**直接Fraction.jsを先に比較**。mathjs全面追加はしない |
| [fast-check](https://github.com/dubzzz/fast-check) / MIT | ModelRunnerと公式API説明 | 演算の境界例・状態遷移テスト生成と失敗例縮小 | **開発時検査候補**。アプリbundleに含めない |

Pandocとtexmathを別repoとして数え、比較表は9行・10repos。候補の数やスター数を品質の根拠にはしない。

## 3. Mathsteps — 「詳しい途中過程」をすでに実装している部分

調査commit: `9d370c30f2d9c2b3650883e942f97c8abe6805f8`。repoは2024-08-29にarchive。確認packageはmathsteps0.2.0、mathjs3.11.2固定、旧Node世代を対象としている。

読んだ実装：

- [lib/node/Status.js](https://github.com/google/mathsteps/blob/9d370c30f2d9c2b3650883e942f97c8abe6805f8/lib/node/Status.js)：操作種別、変更前後の木、入れ子のsubstepsを持つ。局所変更を親の式へ戻す処理もある。
- [collectAndCombineSearch/index.js](https://github.com/google/mathsteps/blob/9d370c30f2d9c2b3650883e942f97c8abe6805f8/lib/simplifyExpression/collectAndCombineSearch/index.js)：同類項を集める段階と、各群をまとめる段階を分ける。
- [同処理のテスト](https://github.com/google/mathsteps/blob/9d370c30f2d9c2b3650883e942f97c8abe6805f8/test/simplifyExpression/collectAndCombineSearch/collectAndCombineSearch.test.js)：最終式だけでなくsubstepsを期待値として確認する。
- ChangeTypes.jsとstepThrough.jsも確認。操作IDと一段実行の反復を分けている。

P-002への変更案：solution traceを私たちだけで発明し直さず、変更前／操作／変更後／小段階／全体への復帰を参考にする。特に「局所計算をした後、元の問題へ戻す」ための構造として有用。受入済み第一タイトルは再生成しない。

限界：この構造は日本語の授業本文、なぜその操作を選ぶか、既習状態、穴の採否を自動的に満たさない。同類項の自動順序が陸君の受入順序と同じとも限らない。古い依存を現行アプリへそのまま入れる前提にはしない。今回は静的読解のみでruntime実行はしていない。

## 4. Numbas — 穴・補助段階・採点・式規則

調査commit: `65a4a143db4e1110ac26870ef3394e1ac350d059`。

読んだ実装：

- [runtime/scripts/parts/gapfill.js](https://github.com/numbas/Numbas/blob/65a4a143db4e1110ac26870ef3394e1ac350d059/runtime/scripts/parts/gapfill.js)：複数のgapを子partとして扱い、JSONから構成できる。正答表示の設定も別に持つ。
- [runtime/scripts/part.js](https://github.com/numbas/Numbas/blob/65a4a143db4e1110ac26870ef3394e1ac350d059/runtime/scripts/part.js)：補助steps、次のpart、回答・補助表示の保存／再開等を持つ。
- [runtime/scripts/jme-rules.js](https://github.com/numbas/Numbas/blob/65a4a143db4e1110ac26870ef3394e1ac350d059/runtime/scripts/jme-rules.js)：式patternと書換後pattern、結合・交換等のmatching optionを持つ。

削れる考え仕事：文章の穴と回答欄を場当たり的に結ぶ構造の設計、補助段階を別問題から完全に切り離す設計、式のpattern matchingの基本方式。既存のpart/step/gapを私たちのproblem/node/itemへ対応させ、必要な差分だけ作れる。

そのまま移さないもの：採点・試験終了・補助問題の点数減点等のassessment方針、Numbas独自scope・renderer・保存機構。私たちは教科書モードの現在の正答後表示・前結果・進捗を維持する。穴の有無や位置をNumbas自体が教育的に決めるとの主張はしない。

## 5. STACK — 同じ値と、要求された答え方を分ける

調査commit: `1b4e42d44930157a01f49ab35057e88b0883884d`。

[answer-test controller](https://github.com/maths/moodle-qtype_stack/blob/1b4e42d44930157a01f49ab35057e88b0883884d/stack/answertest/controller.class.php)には、AlgEquiv、EqualComAss、Expanded、SingleFrac、LowestTerms等のテスト分類がある。[fixture runner](https://github.com/maths/moodle-qtype_stack/blob/1b4e42d44930157a01f49ab35057e88b0883884d/tests/answertest_general_fixtures_test.php)は、点数だけでなくerror、feedback、note等を扱う。公式Answer Tests資料も確認した。

私たちへの適用：

| 私たちの検査 | 参考にする区別 | 例 |
|---|---|---|
| 値の一致 | 数学的同値 | 69/99と23/33 |
| 答えの形式 | 既約・単一分数・展開済み等 | 「既約分数」で69/99を最終答えにしない |
| 問い固有の条件 | 同値判定とは別の要求 | 最小倍率10が要求される問題で100を正答にしない |
| 誤答の説明 | 合否以外のfeedbackと識別note | 等式は正しいが最小条件に不適合 |

STACKに私たちの「最小倍率」の完全な判定が既にあると確認したわけではない。値・形式・課題契約を分ける設計を参考にする。Moodle/PHP/Maximaという依存を持つので、静的な現行アプリへ一式を入れる採用案にはしない。今回は実行していない。

## 6. PreTeXt・DoenetML — 教材構造と条件表示

PreTeXt調査commit: `da193419f0746242287b2358094a496029ca9671`。

[schema/pretext.rnc](https://github.com/PreTeXtBook/pretext/blob/da193419f0746242287b2358094a496029ca9671/schema/pretext.rnc)を読み、task、hint、answer、solution、definition等の内容構造を確認。taskにはstatementとhint/answer/solutionを分ける形がある。[minimal教材](https://github.com/PreTeXtBook/pretext/blob/da193419f0746242287b2358094a496029ca9671/examples/minimal/source/main.ptx)は、sourceと出版処理の分離の小例になる。

P-002の制作schemaをゼロから全て決めず、次の対応表をまず作る案：definition/property/proof/example/task/hint/solution→既存のrole、readingFlow、interaction、before/after、history。番号・参照は受入済みアプリ方式へadapterで接続する。PreTeXtの最小サンプルを日本語教材としてコピーする案ではない。

DoenetML調査commit: `533da992fcb9cebe45f728b0bede27d2c0731726`。

[Hint.js](https://github.com/Doenet/DoenetML/blob/533da992fcb9cebe45f728b0bede27d2c0731726/packages/doenetml-worker-javascript/src/components/Hint.js)には表示フラグとhideに依存したヒント表示、reveal操作がある。[ConditionalContent.js](https://github.com/Doenet/DoenetML/blob/533da992fcb9cebe45f728b0bede27d2c0731726/packages/doenetml-worker-javascript/src/components/ConditionalContent.js)はcase/elseと条件に応じる内容を扱う。

私たちの前結果・正答後説明・履歴を、HTMLの位置だけで制御せず状態と依存で設計する参考になる。ただし閉じた内容が回答漏洩しないこと、数学の段階順、進捗移行が自動的に保証されるとはしない。独自worker・依存解決・renderer・licenseを伴い、現行React画面を置き換えるコストが大きいため、まず設計参照に限定する。

## 7. Fraction.jsとmathjs — N07の数値処理を自作しない候補

Fraction.js調査commit: `9aa0f355e5d6c25d10bce7a7ab25a3a4bd074942`、package5.3.4。

[dist/fraction.mjs](https://github.com/rawify/Fraction.js/blob/9aa0f355e5d6c25d10bce7a7ab25a3a4bd074942/dist/fraction.mjs)はBigIntで分子・分母等を扱い、明示した循環文字列を読める。[tests/fraction.test.js](https://github.com/rawify/Fraction.js/blob/9aa0f355e5d6c25d10bce7a7ab25a3a4bd074942/tests/fraction.test.js)も確認した。

mathjs調査commit: `8d214e050a0acb9f132405d55a96b683fa7b6324`。[Fraction.jsラッパー](https://github.com/josdejong/mathjs/blob/8d214e050a0acb9f132405d55a96b683fa7b6324/src/type/fraction/Fraction.js)はfraction.jsを利用する。N07で分数だけが必要なら、mathjs一式を入れる前に小さい責務のFraction.jsを直接比較する方が対象を絞れる。bundle削減量は測定していない。

### 隔離probeの結果

公式commitの配布ファイルを一時領域へ置き、Git blob SHAが取得metadataと一致することを確認して実行。app依存・lockfile・srcは変更していない。実行環境Node v24.22.1。CIのNode22での統合検証は未実施。

| 入力・検査 | 結果 |
|---|---|
| 0.(8) | 8/9 |
| 0.(69) | 23/33 |
| 0.(6969) | 23/33 |
| 0.1(6) | 1/6 |
| 6/15 | 2/5 |
| −1/8 | −1/8 |
| 0.(9) | 1 |
| 整数2、0 | それぞれ保持 |
| 安全整数範囲を超える分子 | 入力した正確な比を保持、BigInt型 |
| 分母0 | 例外 |
| 69/99と23/33 | 同値 |

12ケースPASS。[実行結果](evidence/reference-code/fraction-probe.json)。これは値の処理の限定試験であり、最小倍率を選ぶ導出、途中式、文章、穴、アプリ動作まで合格したという意味ではない。

重要な境界：有限の文字列0.696969を勝手に無限循環と推定させない。入力に循環構造が明示されたときだけ変換する。0.(6969)を同じ分数へ変換できたことは、最小周期・最小倍率の教育的な説明ができた証拠ではない。近似小数への出力や周期表示の上限設定も採用時に確認する。

このprobeにより、P-002付録F07の「6/15の既約分数1/5」という数値誤記を発見。正しくは2/5であり訂正した。新しい検算が既存提案と独立した根拠になる一例。アプリ教材の誤りや改稿ではない。

## 8. Pandoc/texmath — Word数式変換器を自作する前に使う

Pandoc調査commit: `a3dce9e471c44e81c5f3fa4ef4c6beeef7c9a090`。texmath調査commit: `847ff05b569674a7565a795f4048de2209e5a51a`。

[Pandoc Docx/Parse.hs](https://github.com/jgm/pandoc/blob/a3dce9e471c44e81c5f3fa4ef4c6beeef7c9a090/src/Text/Pandoc/Readers/Docx/Parse.hs)はtexmathのreadOMMLを利用。[texmath OMML.hs](https://github.com/jgm/texmath/blob/847ff05b569674a7565a795f4048de2209e5a51a/src/Text/TeXMath/Readers/OMML.hs)は分子・分母、根号の対象・次数、指数等を構造として読む。単純なXML文字列抽出より、既存の変換器を使う候補がある。

### 教師Wordでの隔離probe

環境に既設のPandoc3.1.3を使用。上記調査した最新版commitをbuildして実行したわけではない。正本Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`をJSON ASTへ変換。

| 観測 | 結果 |
|---|---|
| 変換exit code／警告 | 0／なし |
| 原本word/document.xmlのoMath | 397件 |
| Pandoc ASTのMath | 397件 |
| 空のMath | 0件 |
| 分数コマンドを含むMath | 8件 |
| 根号コマンドを含むMath | 48件 |
| Image参照 | 14件。原図の種類数・第二タイトル原図数を意味しない |
| 原本hash | 実行前後一致 |

[実行結果](evidence/reference-code/pandoc-probe.json)。対象は教師Word全体。第二タイトルだけの全件意味検証や、oMathと変換Mathの一対一の意味照合を終えたという意味ではない。397という件数一致を網羅的な正しさの証明にしない。

採用候補の接続：原OOXMLを位置・source ID・画像relationshipの台帳として読む→Pandocで内容と数式を変換→原構造と変換結果の対応を保持→既知の分母・根号・指数・循環記号を照合→未対応を残す。元位置mapはPandoc出力だけで自動的に満たされないためadapterが必要。

texmathの[OMML-BUGS](https://github.com/jgm/texmath/blob/847ff05b569674a7565a795f4048de2209e5a51a/OMML-BUGS)にも未解決表示例が記載されている。変換器を使えば原本照合が不要になるとはしない。

## 9. fast-check — 検査例を人手で全部列挙しない

調査commit: `d36bc93e0b5914c7d116486a433e93845844650c`。

[ModelRunner.ts](https://github.com/dubzzz/fast-check/blob/d36bc93e0b5914c7d116486a433e93845844650c/packages/fast-check/src/check/model/ModelRunner.ts)はmodelと実物にcommand列を適用する構造を持つ。公式repoで性質ベースの入力生成・縮小方式も確認。

候補となる性質：

- 有理数の約分で値が変わらず、既約分母は正、分子分母の共通因数がない。
- 余り遷移で10r=q×桁+次余り、次余りの範囲が成立。
- 未回答→誤答→ヒント→正答→履歴→再読込の操作列で、未来の結果が解放されない。
- 新旧planの互換対象の回答は保持し、追加穴を旧回答で完了扱いしない。

失敗した入力を小さい再現例へ絞る仕事をライブラリへ任せられる。一方、検査する性質の正しさは私たちが設計する必要がある。多数サンプルのPASSは一般証明にならず、日本語本文の教育的正しさも判定しない。今回は静的調査で、導入や実行はしていない。

## 10. P-002のどこを置換・縮小するか

| P-002の予定部分 | 調査後の変更候補 | 自作として残るもの |
|---|---|---|
| source/import-word.pyの全面変換 | Pandoc/texmathを制作CLIとして使いadapterへ縮小 | 元位置・source ID・未対応・原図対応・意味監査 |
| rules/exact-rational.mjsをゼロから作る | Fraction.jsへの薄いadapter＋固定検算 | problem contract、表示形と値の分離、操作trace |
| solution traceの型を全て自前で考える | Mathstepsの変更前/後・操作・substepsを比較し採用 | 条件・source・一般論証・全体への復帰 |
| 式のmatchingを自作設計 | Numbas JMEの規則構造を参考に対象限定 | 既存式とのadapter、条件、必要な教育順 |
| lesson schemaを全て自前で考える | PreTeXtとNumbasの実schema/part構造に対応表 | 日本語誘導・8分類穴・knownRefs・表示前後 |
| 判定を単一の同値テストにする危険 | STACKの要求別テストに倣い分離 | 最小倍率など問い固有の契約 |
| 表示を任意のbefore/afterだけで設計 | DoenetMLの状態・依存を参考に明示 | 既存React部品・集合と第一タイトルの操作 |
| 境界例・操作列を人手で全列挙 | fast-checkを開発用に比較 | 何を不変条件とするか、重要固定例、実画面監査 |
| schema validatorを新規追加 | 既存Zod/schemaの再利用を先に検討 | 制作側の新しい意味契約。validatorを二重増設しない |

「既存コードを読む→対応表→薄いadapter→必要差分」の順へ改める。巨大frameworkの導入が小さな自作より安いとは限らない。導入前に対象責務と移行コストを比較する。

## 11. 採用可否を決める次の比較試験

新たな学習内容・公開変更へ進む前に、次を具体設計と採用案へ組み込む。今回の依頼は調査なので、これらを既に実施済みとはしない。

| 試験 | 確かめる内容 | 採用判断 |
|---|---|---|
| Pandoc adapter | N07全原式と無番号式の位置・条件対応、根号・分数の固定例、14画像参照の由来 | 自作OMML変換の何割が不要か。件数だけで採用しない |
| Fraction adapter | N07全正答・誤答、有限/循環、最小条件、Node22、既存表示との接続 | 数値基盤として使い、途中導出を別で持てるか |
| trace/schema比較 | N07の一例をMathsteps型＋Numbas/PreTeXt対応で表現 | 独自概念を減らして必要な説明を保持できるか |
| answer tests | 同値／既約／最小／理由の合否を別々に出す | 誤答理由を壊さず判定を共通化できるか |
| state model | 現行knownRefs・履歴を条件依存へ対応 | 不要なruntime導入を避けて受入動作を保てるか |
| property tests | 少数の不変条件を既存Vitestへ接続 | 手書きcaseを減らし再現性が上がるか |

ライブラリ採用は版・license・必要ファイル・依存・実行場所を固定し、第三者noticeを必要な場所へ保持する。コード・文書・教材内容のlicenseは混同しない。アプリ一式のlicenseを今回勝手に変更しない。

## 12. 調査で確認できた範囲

確認済み：10repoのmetadataとcommit、26ファイルの実内容、Fraction.js12例、Pandoc教師Word変換、原本不変、P-002数値例の誤記1件。

未確認：各frameworkの全コード、全自動教材制作、全N07統合、スマホ画面・進捗・公開、Node22でのFraction統合、変換全件の意味、速度改善率、licenseの全ファイル横断確認。本文の自然さや穴の教育的採否まで自動で満たす完成品が、この調査で見つかったとの結論は出さない。

P-002本文は承認済みにはしない。本調査はその実装候補を改めるための追加資料であり、次の採用設計はP-003等で具体化する。今回は付録の数値誤記だけ訂正し、教材・依存・公開は変更しない。
