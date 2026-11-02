# UX05 N09代表 教材/保存の非作者読取レビューB

Reviewer: /root/w046_render_review（共有renderer作者、N09教材/移行は非作者）
Status: SCOPED_SOURCE_REVIEW_PASS
製品編集/Store/Git変更/新しい試験の重複実行なし。数学・設問・source/移行の読取とbyte比較に限定。実browser/保存操作/配信はroot側で別検査。

## 固定対象

N09r6 compiled470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d→代表のみr7 compiled `dedfd7c553c2c0186bf7bdbc881bba51649741dbe330e0c854c11dce7822a813`。コードのGit保存SHAはrootが後でこの内容へ束縛し、古い基準HEADと混同しない。

- `work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json` SHA256 `f73e64fae94c45349b7c0ceb95cdca1e422342124b738cc684c8f76b0d8ca2f8`
- `tools/textbook/transformation/nested-lesson.mjs` SHA256 `a079f954ed71f1df0ee3726afd1181e86f48135f56da07367f1998943fd621b6`
- `src/data/textbook/math/numbers/n09ConstructionCompiled.json` SHA256 `3e5d6899e66522a039ee27247cd7771fda8e73d6101c613f17afa7b5bfb12b49`
- `src/data/textbook/math/numbers/n09ConstructionCompiledR6.json` SHA256 `5b9db2503a303bab5a1c230bafc23d5d133ce3e641cb85c1a93940d5a174e7b2`
- `src/data/textbook/math/numbers/n09Revision7.json` SHA256 `d815669d0e984afb4bddec119e007058736d0efc890f6ce4f1910172b280fdcf`
- `src/data/textbook/math/numbers/n0910CandidatePins.json` SHA256 `b8efa40cbe001c4cbc19155a71b881262ec2019ee19afa2c218eb2c5cc710c59`
- `src/data/textbook/math/numbers/n09Lesson.ts` SHA256 `3de4d1808a9f1b57a6723ebeeafc56579315c4f7431f009ac6fffbb65a39628e`
- `src/domain/textbookSchema.ts` SHA256 `d8167c2c9d03861177ed4b9c33053ff90fd8b623482e759c8fb7ef93c2f3f134`
- `src/domain/nestedMigration.ts` SHA256 `30de9ea497fc34eee99bf2894bfc7f5c223821381d427fa64f906b1c3a8429a7`
- `src/pages/N0910RevisionPage.tsx` SHA256 `7f95241a4b758b3a219d960a3c122be8ca5cc3831a4e093e2b3e5e250623533a`
- `src/pages/N0910ArchivePage.tsx` SHA256 `783b30856226ba6d8cfdb639365e598ad13aa90f4afd7e28b7a9fa6967261745`
- `src/pages/TextbookUnitPage.tsx` SHA256 `3b3a8098b025a26d4bd38804b9989becc69119fa8974bdb65d1edbd96f232b92`
- `src/domain/nestedLesson.ux05.test.ts` SHA256 `5c874be24919492f13b5072d393d41b19afc63cb58b5a3df9e7b29785fc075e3`
- `src/pages/N0910ArchiveReset.test.tsx` SHA256 `21f5208909f5244e2ca0e4f26e471ce8e327d3b3af59773c696e86bd9e065e07`

## 内容と範囲

R6snapshotのbyte SHA256は旧正常フォント検査に束縛した `5b9db2503a303bab5a1c230bafc23d5d133ce3e641cb85c1a93940d5a174e7b2` と一致。activeとのnode比較で変更はn09-q01-negative/n09-01だけ。他39nodeはJSON内容が一致し、N10 compiledは既存ux03 worktreeの3cfe版とbyte一致。元問題/図/sourceIRを変更する設計ではない。

旧52part中、46partの局所契約はpart object全体で一致。旧productSignと全解のbalanceOperation/factorSign/zeroLogic/leftInverseOperation/rightInverseOperationの6partはactiveから廃止。新2part factorisedFormUX05/factorZeroConditionUX05を追加し代表activeは48part。これは承認された全体改訂を全nodeへ適用したという意味ではない。

負候補は平方が負号を含む括弧全体へ作用することと実際の積16を保持。全解ではx²−4²へ至る必要な途中式を示し、恒等的な因数分解と二因子の零条件全体を学習者が回答する。候補の正しい順違いを誤答にしていない。零条件の組はenum一値の採点で、mathLinesの式を同じ一候補に表示し、旧or記録で新しい条件生成を済ませない。各初期/正答後rowのgateとownkey hideは対応し、具体的な零条件とx=±4は新2判断が終わるまで本文へ解放しない。

実数でAB=0ならA=0またはB=0。A≠0の場合はAB/A=B=0となり、逆向きはどちらか一因子0なら積0。A=x−4、B=x＋4を代入して全条件を尽くす。ANDは同時零を要求して必要条件ではなく、因子等値は零を保証せず、x=0は実際の因子の零条件ではない。これは人による意味審査の数学根拠であり、既存closed solution graphがlogical ORを機械証明したという主張ではない。finite unsupportedを無条件PASSにしない。

## 保存/移行

新6→7edgeはsource470f/to6/from6→targetdedf/to7を厳密allowlist化。版番号だけや同じ数値で移す経路にしていない。既存4→5→6→7は実snapshotを通し、N10のpilot/fullr4・legacy r2由来の既存鎖へ新しい意味を混ぜない。

native recordの移行はIDに加え対象node/result/stage/q、数学前提、問い、型/role/正答/全候補が一致することを検査し、mathLinesもoptional候補契約に含める。46既存recordのfirstValue/時刻/回数・過去eventを保つ。RETIRE6件はR6snapshot/旧保存へ残し、NEW2件へaliasしない。旧親の完了だけでは新親を完了にせず、新前提より先のKEEP recordは記録として保ちordered frontierでのみ再活性化する。

version=6 routeは不変R6snapshotを表示し、試し解答はuseStateのみ。Dedicated/main双方で同じhashを確認し、より新しいresetとその後の回答を優先する。reset markerがあるだけでledger全体を空にせず、旧完了を復活させない。旧版の試し解答を現行/原保存へ書く実装はない。

## 初回所見と補修確認

1. unknown native guardが既知revisionしか調べず、未来revisionのnative mainを旧版/空新版へfallbackし得た。Aも独立に同症状を発見し、nestedProgressがある候補はknown revision＋hashの完全一致を必須に補修。現行が復元済みのとき無関係な古いarchiveまで無条件blockしない従来境界も維持している。最終sourceで確認し解消。
2. 一般公式がtext行でA^2等をraw表示していた。Aは一般公式/零積一般則を通常math行と説明textへ分離し、質問/全候補/依存の意味を変えず再生成した。最終sourceでは`(A-B)(A+B)=A^2-B^2`と`AB=0\iff A=0\quad\text{または}\quad B=0`がmath行、理由がtext行であり解消。targetHash/pins/revisionもdedfd7c5へ追従している。

未解決の確定所見なし。A報告のunit結果はA実行として区別し、Bが同じ試験を重複実行したとは記さない。共有rendererの自作部分を本報告で非作者PASSにはしない。実画像・移行実browser・本人細部確認は別に残る。
