# UX06 代表r9→本適用r10：既存実装への接続案 A

読取基準は製品source `691d3d160493bf684ca8a31a22476d31d98caeec`。本人「可以来吧」（page `818ccd59-f1f5-4505-8e5d-55826804a47a`）のUX06承認を受け、まずdecimal-method代表とnative font限定だけを実装する方針のコード接続を検討した。Aは製品・Store・Gitを変更せず、Runtimeを初期化していない。R04案のレビュー/この接続案は実装・移行検査の成功ではない。

## 採番と適用境界

|段階|active版・厳密edge|対象・予定部品数|
|---|---|---|
|現在|N09r8（from7）、hash39634b3c…／N10r5（from4）、hash6f86b3d2…|N09 43parts、N10 60parts|
|代表|N09r9（from8）へr8 hash→r9の実生成hashを厳密に束縛。N10r5はbyte保持。|decimal-methodのみ0→6parts。旧43KEEP、0RETIRE、6NEW→49parts、31対話node。N09他40node不変。fontは承認済native限定。|
|代表本人細部OK後の本適用|N09r10（from9）、N10r6（from5）。r9→r10、r5→r6を別の実生成hashへ束縛。|代表6partが意味/契約不変ならN09 48KEEP/1RETIRE/7NEW→55parts。N10 58KEEP/2RETIRE/12NEW→70parts。r8→r10はr8→r9→r10の鎖で扱う。|

同じr9の別hashを本適用として上書きしない。採番追加は内容案の変更ではなく、代表の回答・比較画面・厳密sourceを保つ技術対応としてR05/実装記録へ残す。代表段階に他10block/3本文変更を混ぜない。代表本人細部OK前に本適用を生成・有効化しない。保持の再判定でNEWが増える場合は数を再計算する。

## 既存generatorとN10不変

実入口は `tools/textbook/transformation/apply-n0910-construction.mjs` の `materializeN0910(rootDir,codes)`。`buildNestedTransformationPlan`→`compileTransformationV3`→`validateCompiledNestedLesson`でcompiled/pin/revisionを作り、CLI末尾が指定unitだけ保存する。codes省略は両unitなので、代表は明示的にn09だけを指定する（TS importを扱う既存のNode loader/実行環境を使用）。ここでは生成を実行していない。

- W043 `NODE_DESIGN.json` のN09 decimal-methodだけを承認案へmaterializeし、unit from8/to9へ。残40node、N10unit、原資料sourceSha/pinsを保持する。intro/afterを行と同じgateの実text rowへ、旧完成公式のassumptionsを承認overrideへ置換する。
- `nested-lesson.mjs` はglobal designRawのhashをplan/sourceBindingへ入れるため、N10のunitが同じでも新designRawから再生成するとN10 compiledHashは変わる。ファイル保存をn09へ絞るだけで、N10再生成の再現性まで保護できたとは言わない。
- 既存UX04 pilotの `unitId=n10 && ux04Pilot → priorUx03DesignRaw` と同じ形で、UX06代表に限る新flagと、**source691d時点のdesignRawそのもの**を持つ別名のpriorRawを使う分岐が妥当。例 `ux06Pilot / priorUx05DesignRaw`。旧legacy移行に使う既存 `priorReviewedDesignRaw` を上書き・別用途化しない。
- 新代表design hashをreview済allowlistへ追加し、旧475035b4…等のreview済hashを保存。N10を旧rawへ委譲する分岐はraw hash whitelistの内側とし、未認定rawを迂回させない。両unit materializeをscratchで比較する場合もN10 compiled/pin/revisionがsource691dとexact一致することを確認する。
- 本適用では代表r9の数学node objectを固定保存してから、残対象とN10をr10/r6へ。pilot用分岐を本適用N10まで誤って残し、新N10設計を旧版へ黙って戻さない。

## 代表段階の必要path

|path|必要な変更・保護|
|---|---|
|`work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json`|代表だけ、from8/to9、priorRaw/代表flag。旧rawの履歴/原資料/既存移行根拠を保持。|
|`tools/textbook/transformation/nested-lesson.mjs`|design hash allowlistとN10保持分岐。source pinsは変更不要。|
|`src/data/textbook/math/numbers/n09ConstructionCompiledR8.json`（新規）|active r8を変更前にbyte exactで固定する。後でr9代表を本適用時R9.jsonへ同様に保存。|
|同directory `n09ConstructionCompiled.json`／`n09Revision9.json`／`n0910CandidatePins.json`|実generatorの出力。candidate pinsはn09項だけ更新しn10項不変。新hashを事前に捏造しない。|
|同directory `n09Lesson.ts`|active catalogをrevision9へ切替。原資料n09Authored.jsonは不変。|
|`src/domain/textbookSchema.ts`|明示native版のN09へ9を追加。10やN10r6は本適用時に追加。全正整数へ緩めない。|
|同directory `n0910Ux06Migration.json`（新規案）＋`src/domain/nestedMigration.ts`|既存UX05 manifestは履歴として保持し、新manifestを同じstrict edge選択へ連結。代表edgeはsourceRevision8/hash39634…/targetFrom8/targetRevision9/target実hash、43KEEP・0RETIRE・6NEWを完全partition。関数の役割は同じで新engine不要。|
|`src/pages/N0910RevisionPage.tsx`|R8snapshot import。migrationSources N09はR8を先頭、旧版を降順。intermediatesへR8を昇順追加。unknown-native guardのknown集合にもR8が入る。N10 branch/legacy7を維持。|
|`src/pages/N0910ArchivePage.tsx`／`TextbookUnitPage.tsx`|version=8をR8snapshotへ明示ルート追加。未知revisionを旧R4へ黙って丸めるような新分岐は作らない。R4–R7とlegacyR3の既存route保持。|
|`src/styles/construction-lesson-reading.css`|native限定のchoice body font継承だけ。global.css/KaTeX内部の指数/分数を一律変更しない。compiledとは別にCSS sourceを固定し実fontを計測。|
|独自のUX06 migration/pilot回帰、必要な既存契約test|下記の43KEEP/6NEWと旧chain/reset/unknownを意味付きで固定。既存期待値をassert削除や無差別dynamic化で通さない。|

`nestedLessonStorage.ts` と `nestedLesson.ts` のstorage key形式を変える必要は原則ない。keyはnamespace+unit+r(toRevision)+compiledHashなので新r9/hashに自然に分離される。`savedNestedLessonFromMain`/parseの厳密hashとresetAt検査も既存を利用し、許容版を緩めない。

## strict edgeの注意

現 `migrateNativeRevisionLedger` はUX05 manifest edgeのexact source/targetを選び、KEEPのnodeId/resultId/stageId/qとpart全体のstable一致を確認し、records/processedEventIdsをcloneする。新edgeもこの道へ接続すれば、特別なcopy-only例外を追加せず保持できる。

- 代表の43旧partは全て変わらない40nodeに属する。decimal-methodは旧AUTOなので旧parent/値から新6回答を作らない。
- `activateRetainedNativeRecords` は現在到達できるeditableのみを順に復元し、誤答・新未回答の前で止まる。この経路を保ち、旧未来回答はrecordsへ保持してもdraft/完成を先に解放しない。
- 新manifestのKEEP/RETIRE/NEWがsource/target全part集合を漏れなく覆うこと、互いに交差しないことをコード/回帰で確認する。現manifestの数や値が一致するだけで数学上の対象・問い・条件・思考操作を同一としない。
- RevisionPageのsource走査は最新既知版を優先し、空resetのledgerでも移行したらbreakする契約。R8を走査先頭へ入れ忘れると、R7の古い回答から再生する危険がある。
- 旧r7→r8 manifest、r4→r5→r6→r7、N10pilot同revision→fullr4→r5、旧authored7件の鎖をそのまま使う。r7から新r9へ直接移す寛大なhash例外は作らない。
- full時はR9snapshotとroute、R8/R9のsource/中間リスト、N10R5snapshot/route、r9→r10/r5→r6のstrict manifestを追加。同じr9やr5へ別hashを上書きしない。

## 必要な実検査（未実行）

1. source691dの43完了→r9：43recordのvalue/firstValue/選択数/時刻/イベントIDを保持。最初の新未回答はdecimal-methodの基底。新6に各誤答→正答、正答でのみ次行/intro/terminalが開き、Q08の旧保持回答は新6完了前に到達しない。
2. 部分回答/誤答/将来recordの保存とreload。新6以外を再質問せず、旧AUTO完成や同じ数値2/ABから新回答を推定しない。旧parentが追加partsの認定へ流用されない。
3. R8 dedicated staleとR8 mainの新reset（空/1回答）、currentR9 staleとmainR9新reset（空/1回答）を両方。reset後の回答を一律resetし直さず全ledgerを優先。別unit/旧版/dedicated/archiveを非破壊に保つ。
4. 未知native revision/hash（main、current専用key、該当source）を既知旧版/空currentへfallbackせず拒否。known currentがある時の無関係な古い未知archiveと区別し、raw byte不変を検査。
5. R7以前→…→R8→R9の鎖、N10現r5/旧pilot/legacy7の現動作保持。version8のreadonly試し解答がcurrent/旧storageを変えないこと。reset時の旧archive・別unitの保護。
6. N09他40node、N10 compiled/revision/pin、褒められた積商9nodeはbyte/契約を照合。font変更によるN10/旧版の表示影響はbyte保持とは別に実画像で確認。
7. 四幅320/390/430/1440で指数・文字・候補、未回答/誤答/部分正答/通常式/履歴を実測。旧完成公式assumptionsと未来introの先出しを全publicで反証。数学恒等式、CODE構造、可視意味、本人細部OKを別記録にする。

本適用時のテストはr9の新6回答も部分/誤答を含めて保持し、残7NEWが旧回答から解放されないことを追加。旧r8利用者の鎖で新6を飛び越さないことも確認する。

## SymPy既存ローカル依存の読取検索

`/tmp`、workspace、`/opt/codex` をvenv設定/既存package targetの範囲で読取検索した。`/tmp/w046-sympy/sympy/__init__.py` と既存mpmathを発見。

|確認ファイル|読取結果|
|---|---|
|`/tmp/w046-sympy/sympy/release.py`|`__version__ = "1.14.0"`|
|同 `sympy-1.14.0.dist-info/METADATA`|Version 1.14.0|
|同 `mpmath-1.3.0.dist-info/METADATA`|Version 1.3.0|
|repo `tools/textbook/research/requirements-solution.txt`|sympy==1.14.0（既存targetと一致）|

これはvenvではなく、既存のpackage targetをPYTHONPATHで見せる配置である。実行側が既存Pythonへ `PYTHONPATH=/tmp/w046-sympy` を明示し、`PYTHONDONTWRITEBYTECODE=1` または `-B` で読取probeを行えば復元利用できる可能性がある。KYOTSU_MATH_PYTHONは実行ファイルpathなので、そこへshell文字列を入れない。今回は検索/metadata読取だけで、import・インストール・ネットワーク・環境変更は行っていない。実行可能/solver PASSを先取りしない。
