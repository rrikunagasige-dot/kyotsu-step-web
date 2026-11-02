# W046 UX04 pilot — コード非作者審査

Status: CODE_REVIEW_PASS / FINAL_AFFECTED_QA_RESULTS_CONFIRMED（版・実行範囲を区別）
Reviewer: /root/w046_source_review
Implementation author: /root
Scope: N09写真2nodeのpilot実装に伴うrevision/schema/移行/保存・旧版route・N10固定。N09設計案そのものはreviewerが作者であり、その非作者PASSを名乗らない。

## 初回所見と補修後の読取

1. **未知native hashの暗黙fallback**：mainが既知native revisionで未知hashを持つとき、古いr4/空r6へ進んでいた。現行の復元が無い場合、mainとarchiveの既知revision/未知hashをcommit前にthrowする補修を確認。r6/r5/r4、およびN10 active r4・pilot r4・r3のhashをknown集合へ含める。
2. **移行元の古い専用keyが新しいmain resetを隠す**：source候補に対しreadSavedとsavedNestedLessonFromMainを読み、main側resetAtが大きければmainのledger全体を採用する補修を確認。これによりreset後の実回答も保持し、元の古い回答を復活させない。

## 初回再審査で残っていた所見（補修後は下記で解消確認）

### R-PILOT-03 — 現行r6のstale-key＋新main-resetで、reset後の回答を消す

`N0910RevisionPage.tsx`の現行復元はまだ `readSaved(currentKey) ?? savedNestedLessonFromMain(main, lesson)` で専用keyを優先する。専用r6が古いreset、同じhashのmain r6が新しいresetとその後の回答を持つ場合、次のreset同期節がmainのledgerを採用せず、空の `resetNestedLedger` へ置き換える。この結果、mainにあるreset後の実回答まで消える。

現行復元にもsource選択と同じ比較を適用し、exact unit/revision/hashのmainのresetAtが新しければ、そのledger全体を採用する。未知hashや破損を無条件救済せず、既存の正しいschema検査・保存非破壊は維持する。実browserに現行r6のstale-key/new-main-reset（reset後に1件以上の実回答あり）を追加して、events・record値・時刻が保持されることを確認する。

## 確認できた実装上の保護

- N09 r5 snapshotは公開中r5 compiledとbyte一致し、r6の新版登録・schema許可・lessonのactive切替を同時に行う。
- r5→r6の新native edgeはfrom/to revisionだけでなく正確なsource/target compiledHashへ束縛。旧r4は固定r5 snapshotを経由する。
- 既存KEEPのprompt・候補・正答・assumptionsを保持し、copy-only例外を増やしていない。追加の6判断を旧回答だけで解決済みにしない。
- 旧記録はrecordsとして保持し、到達時だけactivateする。parent projectionの再構成でも偽の回答イベントは作らない。
- N09 r5/r4/r3のrouteを区別し、旧版試し解答はcomponent内stateだけで行う。
- N10 active compiled・revision4・lesson・R3 snapshot・pilot R4 snapshotとn10 pinはsource db99相当の基準コピーとbyte/値一致。
- N10の再生成はpriorUx03DesignRaw（hash16c546fc…）の正確な旧入力へ分岐。legacy7が使うpriorReviewedDesignRaw（hashd144b882…）は別に不変保存。

## 初回再審査対象ファイルのSHA-256（履歴保持）

| path | SHA-256 |
|---|---|
| `src/pages/N0910RevisionPage.tsx` | `746d6c8fcf98a27675fa7cf88ec8254d9c7838f8a9edf80643f4abc6ce766eb0` |
| `src/domain/nestedMigration.ts` | `4a3a7039b41c0a0d991c5836fea3cd94b313339dc6ade944e071c2946d61cdf5` |
| `src/domain/nestedLessonStorage.ts` | `892b205b7f3f47fbca1a3c13cff98fbd42aadb32fe844329708fbb46a21099cc` |
| `src/pages/N0910ArchivePage.tsx` | `29e52710bbab52d752b3743c9955258236962b8bfd43b21dea0cec857266eeed` |
| `src/pages/TextbookUnitPage.tsx` | `cf8d645406bba8cdb85b8972d2412477fbfe25c52ded13e00f4c078a436c9fec` |
| `src/domain/textbookSchema.ts` | `637762b868e3495a0b96a13072b39db21d3a52a1f07a31f1cdcdae4f55f06d2f` |
| `tools/textbook/transformation/nested-lesson.mjs` | `7b640e8d2522a02f5c75246ded9ca633547109ce2dfab3a5c93cad925e7e7426` |
| `src/data/textbook/math/numbers/n09Lesson.ts` | `cdd57d8e81139e40f6513f635e5d69e867901c882ef4a1f5a1e5ed1ccc8b9ea4` |
| `src/data/textbook/math/numbers/n09Revision6.json` | `8a47efeaa48199b553d50b3d49829e96d8c3587cb60a3215d5e91ee221cf44b8` |
| `src/data/textbook/math/numbers/n09ConstructionCompiled.json` | `dcbd2a16fa8d56e79e0906c194028d8afff9cb4d1f13362f2591d1657758ddd0` |
| `src/data/textbook/math/numbers/n09ConstructionCompiledR5.json` | `c9a881c4d4a27dfc9ebcd218fa25aeb094d02486d5cc4da3bcedae099f6fc05b` |
| `src/data/textbook/math/numbers/n10ConstructionCompiled.json` | `969b3fe063f8ea21f35904812d06b1fd4842961912077811377bb384f92cd41e` |
| `src/data/textbook/math/numbers/n0910CandidatePins.json` | `be6a4871f110c3e87bc69f5b1d31812f4771a239e33f63a4c686bed779bfbdac` |

## QA結果の扱い

root報告の旧2testfileの5失敗はdb99とbyte同じ旧checkoutでも再現されたため、既存失敗と新しい回帰を分ける方針は妥当。期待値を黙って更新したり、検査を外したりしていない。主担当の進行中の133scope/新migration/browser結果は本審査では未取得であり、そのPASSを代わりに認定しない。製品QAの重複実行は行っていない。

## 補修後の最終確認

最終再読対象N0910RevisionPage.tsx SHA-256: `746d6c8fcf98a27675fa7cf88ec8254d9c7838f8a9edf80643f4abc6ce766eb0`。

- 現行のdedicatedとexactMainを両方parseし、mainのresetAtがより新しいときはmainのledger全体を採用する。
- 以前の一律resetNestedLedgerによる置換blockは撤去され、mainにあるreset後の回答・events・record時刻を空へ消す経路は解消。
- 移行元の選択でも同じ新しいresetAt比較を行い、旧source保存の復活を防ぐ。
- 未知のmain native hashはcurrent復元済みでもcommit前に拒否。currentが復元済みなら、無関係な古いarchiveを検査して巻き添え停止させず、そのまま保持する。currentが無ければ利用候補のarchiveについても未知hashを拒否。
- N10のknown集合はactive r4（3cfe9538…）、pilot r4（5f42dba6…）、r3（a9604f8f…）を区別して認識し、既存pilot r4を新guardで誤拒否しない。

前回の二所見とR-PILOT-03はコード読取上で解消。migration/schema/revision周辺に追加の確定欠陥は見つからなかった。これはコード審査の限定PASSであり、主担当が追加するbrowserのunknown-main非破壊、source stale-key/new-main-reset、current stale-key/new-main-reset-after-one-answerの実行成功は未認定。

## 操作範囲

この審査記録を/tmpへ保存した以外、製品・Git・正式Storeは変更していない。

## 最終再審査対象のSHA-256

| path | SHA-256 |
|---|---|
| `src/pages/N0910RevisionPage.tsx` | `746d6c8fcf98a27675fa7cf88ec8254d9c7838f8a9edf80643f4abc6ce766eb0` |
| `src/domain/nestedMigration.ts` | `4a3a7039b41c0a0d991c5836fea3cd94b313339dc6ade944e071c2946d61cdf5` |
| `src/domain/nestedLessonStorage.ts` | `892b205b7f3f47fbca1a3c13cff98fbd42aadb32fe844329708fbb46a21099cc` |
| `src/pages/N0910ArchivePage.tsx` | `29e52710bbab52d752b3743c9955258236962b8bfd43b21dea0cec857266eeed` |
| `src/pages/TextbookUnitPage.tsx` | `cf8d645406bba8cdb85b8972d2412477fbfe25c52ded13e00f4c078a436c9fec` |
| `src/domain/textbookSchema.ts` | `637762b868e3495a0b96a13072b39db21d3a52a1f07a31f1cdcdae4f55f06d2f` |
| `tools/textbook/transformation/nested-lesson.mjs` | `7b640e8d2522a02f5c75246ded9ca633547109ce2dfab3a5c93cad925e7e7426` |
| `src/data/textbook/math/numbers/n09Lesson.ts` | `cdd57d8e81139e40f6513f635e5d69e867901c882ef4a1f5a1e5ed1ccc8b9ea4` |
| `src/data/textbook/math/numbers/n09Revision6.json` | `8a47efeaa48199b553d50b3d49829e96d8c3587cb60a3215d5e91ee221cf44b8` |
| `src/data/textbook/math/numbers/n09ConstructionCompiled.json` | `dcbd2a16fa8d56e79e0906c194028d8afff9cb4d1f13362f2591d1657758ddd0` |
| `src/data/textbook/math/numbers/n09ConstructionCompiledR5.json` | `c9a881c4d4a27dfc9ebcd218fa25aeb094d02486d5cc4da3bcedae099f6fc05b` |
| `src/data/textbook/math/numbers/n10ConstructionCompiled.json` | `969b3fe063f8ea21f35904812d06b1fd4842961912077811377bb384f92cd41e` |
| `src/data/textbook/math/numbers/n0910CandidatePins.json` | `be6a4871f110c3e87bc69f5b1d31812f4771a239e33f63a4c686bed779bfbdac` |

## 表示補修後のmetadata追従とruntime結果（実行版を区別）

実行者は主担当root。審査者は製品試験を重複実行せず、最終コードとraw結果・使用scriptを読取確認した。

### 実行済み版と最終版

| 対象 | N09 compiledHash | 状態 |
|---|---|---|
| 移行browser10ケース・CODE136の実行版 | `f2bc35bbdb464a360d429b504459ff8c0f0b8c082db4e020a3b791f0d92619b3` | 主担当の実行結果として確認。 |
| factorSignのsemantic group分離後の最終コード | `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d` | metadataと移行コードの追従を本審査で確認。四幅表示と関連76件/type/buildは主担当・Bが再検証中。 |

初回320pxのfactorSign左italic xのink侵入FAILは履歴として保持する。slot両側thinspaceの補修後、通常等号と先頭iffの同groupによる細切れ折返しがさらに見つかり、factorSign行を専用`n09-01-ux04-factorization`へ分離した。数学・問い・候補・gate・routeは変えていない。N09設計の意味審査や最終実画像審査の非作者認定はB担当の範囲と区別する。

### 最終metadataの確認

- active compiled、N09Revision6.compiledHash、unit.nestedContract、candidate pinは最終470f1371…で一致。
- 実NODE_DESIGN SHA-256、sourceBinding.designSha256、pin.designSha256は `2d3854a6dcd4751acb859c9ed3c0484b9e7df8464d7ab959d0de09317c4c856a` で一致。
- factorSign行は `\iff(x-4)(x\,{factorSign}\,4)=0`。前提はbalanceOperationのみで、零積と左右枝は以前と同じ依存順を保つ。
- migratorのtargetHashは最終470f…へ追従。逆置換hashにより、前回審査したmigrationコードとtargetHash文字列以外はbyte一致であることを確認。移行の意味判定・reset・KEEP/解放のロジックは追加変更していない。
- route SHA-256は審査済み`746d6c8fcf98a27675fa7cf88ec8254d9c7838f8a9edf80643f4abc6ce766eb0`から不変。

### 実browser10ケースのraw確認

- Raw result: `/tmp/w046-ux04-migration-final/RESULT.json`
- Result SHA-256: `f4b66e21181f66f2bb2281a854f685809a780f529ef9f338558ae3958b7c915c`
- Script: `/tmp/w046-ux04-migration-browser.mjs`
- Script SHA-256: `b965aa46f83223a7f8561bab6fa15e8f9dea3e341d52e5b0a5d22cbadea58743`
- fixturePolicy: 合成ledger・試験namespace。実学習者記録・正式Storeイベントを作らない。

| ケース | 読取確認したassertと結果 |
|---|---|
| r5完了main / dedicatedの2件 | 旧46recordを初期・完了後に値/firstValue/回数/時刻のfield一致で保持、新6回答だけで完了。最初はpowerAction。旧保存byte不変。 |
| r4段階鎖 | 旧38record保持、新14回答だけで完了。r5を介する実routeを通過。 |
| source r5 stale-key＋新main reset（0/1回答の2件） | 新resetAtを採用し、復活record数が0またはreset後の1件と一致。powerActionから再開。 |
| current r6 stale-key＋新main reset後の1回答 | その1recordをfield一致で保持し、productSignから再開。新reset後の回答を空にしない。 |
| 未知main r5/r6の2件 | alertで拒否し、全localStorageが試験前と完全一致。r6はcurrent専用keyがあっても未知mainを黙って上書きしない。 |
| 旧r5誤答 | −16という初回誤答recordを保持。追加のpowerActionを飛ばさない。 |
| N10 legacy第2版7件 | 初期retained=0は前提未到達の保留を表す。残り56の実操作後、保留7recordが値・firstValue・回数・時刻にfield一致し、旧保存不変。7件消失を成功と扱っていない。 |

全10件status PASS、errors/failuresは空。N09完了ケースでは旧版r5/r4/r3へ移動し、native旧版の試し解答も含め既存保存を変更しない検査を確認した。

raw RESULT自体にはsource SHA欄が無いため、実行版f2…との紐付けは主担当の実行報告と、実checkoutのcompiledを起動時に読むscriptを合わせて確認した。最終470f…に対して同じ10ケースを再実行したとは主張しない。

### その他のCODE結果の扱い

`/tmp/w046-ux04-regression-final.log`に7 testfiles・136 tests PASSを確認。type/lint成功は主担当のexit結果として継承し、build-final.logの成功終端を確認した。これらは上表の実行版f2…の結果である。最終group変更後の新しい関連76件/type/buildは進行中であり、この追記では合格認定しない。既存5 FAILのbaseline再現は履歴として分離し、全リポジトリの全検査成功へ拡張しない。

### 最終再読対象のSHA-256

| path | SHA-256 |
|---|---|
| `src/pages/N0910RevisionPage.tsx` | `746d6c8fcf98a27675fa7cf88ec8254d9c7838f8a9edf80643f4abc6ce766eb0` |
| `src/domain/nestedMigration.ts` | `b5d207f3ea720387e1fb2b20479dc5d6e66f0898e517b278a9cb3505f6e51e71` |
| `work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json` | `2d3854a6dcd4751acb859c9ed3c0484b9e7df8464d7ab959d0de09317c4c856a` |
| `tools/textbook/transformation/nested-lesson.mjs` | `9c23c818642f7bad6ec364c9ae70c3deb01b87ccfdde9370bf558b7989ff47bb` |
| `src/data/textbook/math/numbers/n09ConstructionCompiled.json` | `5b9db2503a303bab5a1c230bafc23d5d133ce3e641cb85c1a93940d5a174e7b2` |
| `src/data/textbook/math/numbers/n09Revision6.json` | `3f67709cf8939d63aa806fb4559399d8b6083edfb4bbdc4e5c94099d70fc37ee` |
| `src/data/textbook/math/numbers/n0910CandidatePins.json` | `7b7fcba13bc407e9b80c3383b04862558d09371b5eeb6a59ddeb0c43a9deeca3` |

以上は写真2node pilotのコード・保存周辺と報告済みruntime範囲の確認。UX04残りの適用・公開・本人受入の承認/完了ではない。製品・Git・正式Storeは変更していない。

## 最終470f版の関連QA完了追記

上部の「進行中」は当時の状態として保持し、本追記で次の実完了結果を補う。試験実行者は主担当・Bで、reviewerはrawの読取と対象hash照合のみ行った。source/Migrationの試験は重複実行していない。

### 追加のCODE結果

- `/tmp/w046-ux04-layout-affected-tests.log`：2 testfiles、76/76 PASS（nestedLesson.design 13件、nestedMigration 63件）。最終semantic group分離後の関連範囲。
- `/tmp/w046-ux04-layout-types.log`：型検査成功の実行者報告を継承。正常終了時に出力しないためlogは空であり、空logだけを成功の証明とはしていない。
- `/tmp/w046-ux04-layout-build.log`：buildの成功終端`built in 8.30s`を確認。既存のchunk size warningは成功/失敗と混同しない。

### 四幅の正常font・元shared-moduleでの実表示検査

- `/tmp/w046-ux04-browser-font-verified/RESULT.json`
- Raw SHA-256: `69a31193ce10a3b8b71d6877442e8d55fae7437b7262ae596d10d801cda5a63c`
- Raw実行元sourceSHA: `778a6c3acb18765d99f3ebaf922457326af536f1`
- compiledHash: `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d`
- scriptHash: `d22e5ef665bfb5f86948c2af0d9782ffbe15d14037f4bf36c58a886b1bde51d1`

320/390/430/1440pxで128状態・1192幾何、各幅52partsの完了とpilot対象14誤答候補がPASS。fontChecks276件は全てloadedでKaTeX Main/Mathを確認し、font errorsは空。failures/errors/networkFailures/httpErrorsは空。

各幅でcompletedReload・readonlyHistory・旧版試し解答の保存不変・reset取消/再読込・N08/N11保持・keyboard slotFocus/Enter/Space/Escapeを確認したraw値がtrueである。rawが保護対象とする39nodeと変更2node、追加6partもpilot範囲と一致する。

rawのsourceManifestとsourceManifestAfterの505ファイルが完全一致し、読取時の実checkoutの各bytehashとも505件全て一致することを照合した。正常fontの検査を、前のfont不正状態や別shared moduleでの結果へ置き換えていない。ここで独立した実画像の全意味審査を実行したとは主張しない。

### GitHub保存との区別

主担当からGitHub保存commit `66c8007b37cc12391c9df574b8ebbb1b95cf26f5`と全20変更blobのbyte一致確認を受領した。これは主担当の照合結果として継承し、raw内の実行元sourceSHA778a…を保存commit66c…へ書き換えない。コード保存と、実行元の完全な505ファイルmanifestを分けて追跡する。

これにより、最終470f版のコード追従・関連76件・型/buildと四幅の表示結果は、報告済みの実完了範囲として確認できた。移行browser10件は前節に記録したf2版の実行結果であり、最終470fで同じ10件を再実行したことにはしない。残りUX04の実装、公開、本人の細部確認/総受入は別の工程であり、本追記では認定しない。
