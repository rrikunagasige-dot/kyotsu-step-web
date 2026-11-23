# P-004 作成・修正の実行入口

新しい数学教材Workは `production/2`。入口は既存の `CMD-WORK-002`（作成）と `CMD-WORK-001`（修正）。P-004は工程基盤の承認であり、新しい教材本文の承認ではない。

## 工程の配置

| 作成 | 内部のcode / AI |
|---|---|
| C01 原資料 | 固定版、Word/構造化資料の取込、無番号説明も含むcoverage / AIが省略と対応を確認 |
| C02 概念 | 記号・定義・既習台帳 / AIが学習目標と概念の順序を決める |
| C03 型・事例 | 既存モデルの事例検索 / AIが適用・非適用の理由を残す |
| C04 完全解法 | 既存solver・対応範囲付き検算 / AIが判断・根拠・接続を補う |
| C05 具体設計 | 教える順、小段階、穴、本文、図表、IR検査、原資料監査、初学者監査 |
| C06 承認照合 | bundle内の全C05が完成後、版・内容・範囲の既承認を照合 |
| C07 生成 | 承認済みIR hashとの一致、既存compilerと限定patch |
| C08 検証 | 数理・IR・四幅UI・保護対象の検査。意味判断が必要ならAI receiptも必須 |
| C09 意味監査 | 実装後の原資料監査と初学者監査。C05の監査とはphaseを分離 |

| 修正 | 内部のcode / AI |
|---|---|
| R01 再現 | 元発言・版・症状・可視状態・未完了queueの復元 |
| R02 原因 | 属性に応じた検査・事例検索 / AIが症状と原因・仮説を分ける |
| R03 事前影響 | 必須inventoryの全行と版を照合 / AIが同型・無関係・未確認を判断 |
| R04 具体案 | 必要な解法・教え方・穴・表現のみ再設計し、事前監査を行う |
| R05 承認照合 | 対応するbundleの既承認を使用 |
| R06 限定修正 | 既存patch adapter、前後hash、scope、安定ID、保存履歴、IR hash |
| R07 検証・意味監査 | 数理・IR・実UI・保護対象・原症状・説明のつながりを検査 |
| R03 事後sweep | 受入後に実差分・現在版の同型を再確認。事前の表を流用しない |
| R08 修正事例 | 修正証拠・回帰・規則との対応を確定 |

共通は S00復元 → S01経路 → 上記工程 → G2横断QA → G3既存公開先 → G3単元受入 → L01事例・学習 → Z01閉鎖。修正ではG3受入後に事後sweepとR08を挟む。

## 一つの台帳、三つの単位

- Work: 依頼と承認範囲。
- block: 概念・例題・導出の制作単位。`node_refs`には学習者の小段階IDを記録できる。`depends_on_blocks`と`fact_dependencies`は別で、制作順を既習の証明にしない。
- release unit: 完成したN07など、公開・実物確認する単位。approval bundleと分ける。

`blocks[].release_unit`、`release_units[{id,block_ids}]`、`approval_bundles[{id,block_ids,proposal_hash,content_hash}]`を指定する。省略時は全blockを一つのunit/bundleへ正規化する。blockごとにIRが異なる場合は`content_design_hash`、差分が異なる場合は`patch_hash`も各blockへ固定する。

bundle内の全C05/R04が揃うまで承認nodeは実行可能にならない。一つの明示承認を各blockへ照合し、同じ案を聞き直さない。schedulerは準備ができた現単元を優先するので、同一bundleの別blockの設計が進められなくなる循環は作らない。G1画像承認や固定の「総チェックOK」という合言葉は使用しない。

## 実行方法

```sh
python workflow/cli.py --root . --store WORK/runtime open --json plan.json
python workflow/cli.py --root . --store WORK/runtime auto --work WORK_ID
python workflow/cli.py --root . --store WORK/runtime next --work WORK_ID
python workflow/cli.py --root . --store WORK/runtime production-run --work WORK_ID --json capability-inputs.json
python workflow/cli.py --root . --store WORK/runtime production-ai --work WORK_ID
python workflow/cli.py --root . --store WORK/runtime render --work WORK_ID --out WORK/generated
```

`production-run`の入力は`{capability名:その機能の入力,...}`。現在nodeの`capability_requests`すべてを渡す。例えばC04なら`math.solve`と`math.verify`。既存Node/Pythonサービスの入力schemaを使う。成果物、phase、実装版、入力版、消費事例、再利用元は同じStoreへ保存される。code receiptを作るだけで工程は完了しない。

戻り値のclaim tokenと`receipts`を使い、主工程の`required`項目・`verdict`・`evidence_refs`・`capability_receipts`・AI requestに対応する`aiReview`を提出する。AI工程は`submit`、TOOL工程は`production-result`。根拠のないPASS、codeのFAIL/UNSUPPORTED、別phase・別node・古いhashのreceiptは拒否する。対応外の数理は、`math.solve`と`math.verify`へ`kind:"argument"`、`claim/assumptions/sourceRefs/steps[{statement,basisRefs,dependsOn}]`を渡す。コードは解答構造を検査してNEEDS_AI_REVIEWとし、AIの完全解法・根拠監査へ明示的に接続する。`proofStatus:AI_ARGUMENT_REVIEWED`と`formalProof:false`が必要で、機械証明とは呼ばない。未登録のsolverへ渡した結果のUNSUPPORTEDをPASSにはしない。

`user approve_proposal`は具体案のhashへ対応させる。`bundle_ids`を省略すると全bundleを明示対象にする。限定承認なら対象だけ指定する。`auto`は既承認範囲の照合とCODE処理だけを進め、AIやユーザーの判断を生成しない。

## 更新、修正優先、復帰

`block-context`へ`{block,facets,evidence_refs}`。facetsは`source/math/design/render/cases/knowledge/model`から必要な属性を選び、値はStore artifact hash。実行中claimへの入力差替えは禁止。renderだけなら解法と意味の設計・承認を保持し、mathならfact依存先まで再検査する。新しい重大指摘はissue/queueとして止め、未消費だから無視することはしない。

未完了修正は、同じStoreのissue・未完了修正Work、`correction_queue_refs`、既存N07の六指摘registry、`request`で受けた未Work化の依頼から照合する。registryのRESOLVED文字だけで閉じない。版・親子対応・有効なZ01を確認する。実装承認や続行を正例にしない。品質評価は受信時にfeedbackとして即時保存し、否定は修正issueへ結ぶ。

`request`は`id/kind/quote/source_ref/version`、`resolve-request`は対応する`parent_request`を持つ子修正WorkのDONEが必要。`resolve`は従来どおり`parent_issue`との対応を検査する。同一原因・artifact・元版の子Workは重複作成せず、既存Workを使う。

`adopt-correction`は`{child,block_map,evidence_refs}`。子は`parent_work`を持ち、具体案・QA・公開先・受入・事後影響・事例更新を完了している必要がある。親の不変範囲の承認と子の承認済み差分を、合成根拠として保存する。架空のユーザー発言は作らない。変わった属性の再検査は残す。共有ファイルを変更した場合は、そのファイルに関係する全blockを対応表へ入れる。JSON内の意味的な部分一致を推測して承認を広げない。

## 公開・受入・閉鎖

`bind`へ`{commit_sha,release_units:[...]}`を渡し、対象unitのSHAを固定する。別unitの固定済みSHAと受入は保持する。G2は`release_readiness`と`impact_sweep_completion`を分ける。今回の退行と必須未確認行は公開を止める。既存の関連欠陥を、根拠と対応する子修正へ引き継いだ場合は主対象の確認を進められるが、必要な関連修正が終わるまでZ01は閉じない。

G2の`audit_rows`は、対象unitの全source、または明示した`audit_inventory`をartifact/block/版/証拠付きで覆う。方法と担当を記録し、同じAIを独立モデルの監査とは呼ばない。

`external-intent DEPLOY`には`release_unit`も必要。QA完了・現行の範囲承認・既存公開先ポリシーが揃えば、公開の再許可は要求しない。未確定の外部操作は照合してから進める。実公開するunitは`review_route`へ`/learning/textbook/…`のhash routeを固定する。app証拠はそのroute・unit・source SHA・配信manifest・到達性・スマホ/PC操作・履歴分離に対応する。URLの`?v=`だけで版を確認しない。

G3_FINALは`accept_app`の発言と、確認したunit・SHA・app証拠を照合する。quality_positiveは受入として扱わない。受入待ちを、新しい単元の未承認実装を進める許可にしない。

R03の事前/事後には`originFinding/rootCauseSignature/artifact/version/approvedCreationWork/block_id/evidence_refs/status/phase`。関連欠陥は`linkedCorrection`、元版から新しい修正後版へ移った場合は`origin_version`も付ける。既存の訪問記録を保持し、子Workは各exact proposalの承認を守る。主対象のissueは原症状の検証・受入・事後影響・R08の修正証拠が揃えば自Work内で閉じられ、自分の子WorkのDONEを待つ循環を作らない。

## 学習と履歴

L01は即時feedbackを重複なく規則・回帰へ対応させ、版付きcatalogをStoreへ保存する。`case.finalize`の`curation:{observations,decisions}`は既存curateコードで観点別corpusへ変換する。新しいGold labelは原評価イベントが必要で、既存caseの流用は`baseCatalogArtifact`の原版・scope・根拠と一致させる。`ml.train`の例は、その確定catalogから既存examplesコードで再生成し、別のlabel配列へ差し替えられない。同じL01呼出しならcatalogを自動接続する。既存ML training adapterを使用する。版付きdatasetが未指定、データ不足なら`NOT_TRAINABLE`を記録し、教材の完了をモデル採用待ちにしない。現在のモデルはOFFLINE_ONLY。P-004では再学習・本番採用を行っていない。

過去のproduction/1とlegacy台帳を保存する。`status/render`で読み、定義が異なるものの進行には移行が必要。`migrate-workflow`へ`{new_plan,evidence_refs}`を渡すと、旧plan・成果物・承認をarchiveし、再利用候補をAI requestへ渡す。旧S工程のPASSをR02/R03のPASSへ変換しない。内容hashと元の案・scopeが一致する明示承認だけを移行できる。`revise`による工程版のすり替えは禁止。

## 三階層の火柴図と検証

同じsnapshot/台帳HEADから`FIRE_DIAGRAM.md`、`BLOCK_FIRE_DIAGRAM.md`、`CAPABILITY_FIRE_DIAGRAM.md`を生成する。queue、現在位置、関連子Work、各receiptはsnapshotにも出る。差戻しは追記イベント・失効・子Workで記録し、実行DAGへ循環辺を入れない。

```sh
pnpm run test:production-workflow
python workflow/verify_integration.py --root . --out /tmp/p004-verification
```

fixtureの模擬承認・模擬app受入と、実行した読取専用adapter検査を分離する。工程試験は説明の教育効果を証明しない。AIは原資料・論理・文章・学習者の可視情報を引き続き審査する。

## solution/1 opt-in（W-GOV-011）

既存planへ `solution_pipeline:"solution/1"` を指定する。一問のgraph、複数slot、IR v2、可視先行監査をC/Rの既存capabilityへ追加する。新入口・新しい画像承認は設けない。機能配置、入力例、環境、未対応範囲と四幅fixtureは `tools/textbook/SOLUTION_PIPELINE.md`。
research_extractを指定するとC01のresearch.extractが必須になる。修正でsource facetを持つR01にもresearch.ingest/analyze（指定時extract）を必須にする。renderだけの修正へ数学の新規設計を要求しない。

旧plan・旧IRは自動でv2へ変換しない。旧WorkのdefinitionHashと現在の実装が違う場合、既存migrationを使って範囲と失効を記録する。既に未受入の教材を新実行器の試験合格で受入済みに変更しない。

## team/1 — 主担当＋2子agent（W-GOV-012）

新規教材Workは`production/2`に`agent_team`を指定する。標準方針は`governance/TEAM_POLICY.json`。既存Workを一括書換えせず、過去の一人監査・旧承認・保存を履歴として保持する。入口は作成／修正の二つ。

Mが正式nodeのclaimとStoreへの書込を所有し、A/Bへnode内部subtaskを割り当てる。Aは通常、資料・解法・穴・本文、Bは操作・排版・実装。相互の担当箇所を審査し、Mの統合にもA/Bが反証する。担当は交代できるが、作者履歴はblock/claim/facetと派生対象へ残る。同じclaimの全員共著では独立審査を捏造しない。

実spawn/message/wait/interruptはChatGPTのharnessで行う。Python CLIはLLMを起動しない。原tool出力を`team-capture`で同じStoreへ保存し、実task登録→結果→完了照合→主node結果へのcollectionと進める。転記は`transcribed-tool-result`と明記し、OS権限分離・盲検・別モデル独立性を主張しない。

```sh
python workflow/cli.py --root . --store WORK/runtime team-policy
python workflow/cli.py --root . --store WORK/runtime team-capture --work WORK --json harness-capture.json
python workflow/cli.py --root . --store WORK/runtime team-bind-target --work WORK --json current-target.json
python workflow/cli.py --root . --store WORK/runtime team-register --work WORK --json assignment-packet-harness.json
python workflow/cli.py --root . --store WORK/runtime team-capture --work WORK --json original-report.json
python workflow/cli.py --root . --store WORK/runtime team-record-output --work WORK --json task-output.json
python workflow/cli.py --root . --store WORK/runtime team-reconcile --work WORK --json task-completion.json
```

`teamCollection:{submissionActor:"M",registrationRefs:[...],outputRefs:[...]}`を既存`submit`/`production-result`に添付する。担当・現入力・source・対象hash・非作者・初回所見・未解決がCODE検査を通る必要がある。結果到着は基礎inputHashを変えず、packet→assignment→report→collectionを一方向に結ぶ。途中交代は旧taskを完了／取消／失効してから新epochを登録する。

`adopt-team-policy`はproduction/2内の保守操作。実行中claim/子task/未確定外部操作を拒否し、具体案とpolicy hashに対応する実承認を必要とする。旧plan/結果/承認をarchiveし、必要な審査と依存結果のみ未充足へ戻す。旧`migrate-workflow`を同じproduction/2内の変更へ流用しない。

## construction-layout/1 — CODE／AI分担の追加

`solution_pipeline:"solution/1"`に加え、`construction_pipeline:"construction-layout/1"`を指定したWorkだけが新しい組立・配置capabilityを使う。

| 既存工程 | 追加CODE | AIが決めること |
|---|---|---|
| C05／R04 | construction.validate、layout.validate | 穴の判断内容、写すだけか、必要な説明、三状態の読みやすさ |
| C07／R06 | construction.compile | 原資料と承認案の欠落がないか |
| C08／R07_VERIFY | 部品型・全候補・三状態・実字号／整列／番号／操作領域 | CODEで決まらない項目を未判定のまま返す |
| C09／R07_SEMANTIC | 現画像と可視stateの版・行/part coverage | 完成式を選ぶだけになっていないか、一問の推導がつながるか |

blockの`content_design_hash`、`construction_design_hash`、`layout_design_hash`、`learner_copy_hash`を同じcompiled artifactに照合する。個々のhashが別々の成果物に存在するだけでは受理しない。旧v1未指定のcompile・表示・採点は保持する。

数式AST、learner decision、display groupを別の単位として扱う。単項負号／二項演算子／符号付き項を区別し、式全体を文字列分割して部品にしない。必須説明はdetailへ隠さず、現在の指示は回答後に消す。見た目の規則だけで教育品質をPASSにしない。

ブラウザ検査は320/390/430/1440で未回答・途中・完成を測定する。実画像hash・可視state hash、18px、KaTeX倍率、等号列差、中心、切れ・重なり・操作領域を検査する。画像比較のbaselineを更新しただけでは正しさの証拠にならない。

学習入力は`construction-visible/1`→`learner-visible-json/3`。typed mathと一意renderRefを使い、実寸法を保存する。未知はnullで、0を作らない。新schemaを旧モデルへ無指定で渡すと棄権する。agent協議は既定UNKNOWN、本人の実評価と合意票数を混ぜない。モデルはOFFLINE_ONLYのままで、自動fitや本番昇格は行わない。

実行可能な受渡し順、incoming author packet、現target固定、resolverの完了条件は[TEAM_PROTOCOL.md](TEAM_PROTOCOL.md)を参照。式番号は各状態で現在見える最後の数式行を指す。

## P046-R3限定の版移行と修復証拠連結

この追記は `P046-R3-20261116`、親 `W-MATH-QF01-FULL-RELEASE-P035-20261115`、技術owner `W-TECH-QF01-VERSION-TRANSITION-P046-R3-20261116` だけを対象とする。未指定のWork・旧変換plan・resolve/adopt・queue規則は従来どおり。新しい正式Work状態は追加しない。

原source SHA `1f10ecbcd088ca8636932c8df4c7b85293777efc` とopened snapshot、原二path manifestは保存する。今回の実preimage SHA `9e6d6798ac40624373db0a87e53e7d8938fb317a` は別の `source_extension` に記録する。追加current既存pathと新規pathはtyped `output_paths` としてblockに結ぶ。不存在fileを空の原資料に偽装しない。現在input/manifest/影響inventoryは全出力を含め、原資料参照と実current preimageを別に表示する。

1. 技術ownerの正式T01/T02/T03を既存APIで行う。T03でworkflow sourceが変わった後は、旧Python processのimport値を新定義と呼ばない。fresh source-only processで実DEFINITION/serviceを導出し、既存の定義移行と現在T工程再検証を行い、T04を実新定義で完了する。旧prefix・旧成功patchイベントは保存する。
2. `prepare-version-transition` は共同承認原文・固定仕様・T04実導出・source9e Git blobs・旧24採点・134本文/35登録簿・旧r2三原bytes・実compile・expectedAbsentを照合してから一度準備する。旧R01等のPASSは新PASSへ移植しない。prepareで失効したS00/S01を含む現在依存を再照合する。
3. 最初の `patch` は有効なR06 claimと現承認・transition ref・実差分に限定する。全pathを先に検査し、新fileは排他作成、既存は原方式の原子置換。実after definition/serviceはfresh source-only processから記録する。中断時は既存 `reconcile-patch` の `RECORD_COMPLETED` または `RESTORE_BEFORE` のみ。未知bytesを上書き・削除しない。
4. app実装変更によるservice失効を隠さない。初回patchの成功イベントを保ったまま、旧R06 claimを既存 `reconcile` の認める実語彙で解放する。成功patchをNOT_EXECUTEDと偽らない。実Git commit/object/限定差分/全候補・保護bytesを検証してafter candidateへbindし、現在実装で失効した全R01〜R05依存を再検査する。
5. 新しいR06 claimから同じ `patch` を呼んだ場合、同transitionの一意な実完了・全after bytes・現在definition/service・現在compile・実Git candidateだけを再照合し `ALREADY_APPLIED_CURRENT_PROOF` を返す。二度目のfilewrite/patch_intent/patch_appliedは行わない。これはR06 PASSやsemantic受入を自動生成しない。新claimに現在の正規compile/検証結果を結合し、通常の提出を行う。
6. R07/G2/公開/実host/本人G3_FINAL/事後sweep/R08/L01を各現在inputで完了する。旧r2のCI・画像・品質結果をr3認定へ転用しない。旧r2閲覧とr1保存、進捗非継承、元SVG保護、派生図・48px・aria・四幅は新sourceで検証する。
7. `link-correction-receipt` は旧調査受付 `W-MATH-QF01-QUALITY-FOLLOWUP-20261115` の `SC-02`、`LAYOUT-SOURCE-04`、`P044-LAYOUT-TOUCH-48-01` のみ。原FAILとOPEN/DONEは変えず、元三件・承認・現在修復prefix・本人受入・事例・実app proofが全て一致した場合だけ派生充足を表示する。親Z01を前提とせず循環を避ける。元queueは別欄で残す。新issue/再open/source/実装/結果input/受付変更で充足は無効となる。一般のchild DONE要件は弱めない。

承認仕様を超えるpath・新schema・任意policy・任意Work・旧guard除外が必要なら、このopt-inで通さず改訂停止とする。隔離候補の試験や静的見本を実App/正式R04/本人受入と同一視しない。

## QF01 checkpointからの限定再開（P-QF01-CHECKPOINT-RECOVERY-01）

2026-11-22の本人回答「この限定案を採用して進める」は、固定提案SHA256 `1d167fe02fa7e6fa8480f45e5c0bb02d5d401f869e82952940311103284ee86b` の採用である。提案本文は採用前の表示を含めて不変保存し、採用状態と発言出所はWORK/ACTION_LOGおよび新しい回復イベントで記録する。

対象は親 `W-MATH-QF01-FULL-RELEASE-P035-20261115` の固定checkpointだけ。原contract、299objects、baseState、nodes、真正なteam部分集合135件、承認等を含む既知envelopes138件、feedback本文projectionをhash検証する。anchorはseq13742/head `586be1a3dfeb92e9699cc82ef330131d10b22a78353c165d5610f181d6201106`。全13742イベントや旧openedを再構成したとは扱わない。

1. 通常Storeへ空のprefixや推測イベントを入れない。明示的な `checkpoint-init` だけが、新規専用path `work/recovery-checkpoints/qf01-p046-r3` にoriginと実bootstrapを作成する。status/nextは初期化を代行しない。通常Storeのzero始点検証とLinux procfs lockは維持する。
2. init入力は固定contract/blob、承認済み提案の実bytes、本人回答の原文・出所、Git由来原source proof/snapshotとする。原2sourceはGit `1f10ecbcd088ca8636932c8df4c7b85293777efc` の実blobから照合した新しい回復証拠であり、旧opened envelopeやnative receiptではない。
3. Runtimeは固定baseStateのdeep copyへ実suffixを再生する。全suffixのseq/previous/hashとscopeを検証し、expectedHEADで追記する。真正なteam部分集合、feedback本文、承認envelope、完全な新suffixを別APIで扱う。`Store.events()`相当の完全prefix要求、未知Work、global queueはUnknownContextで拒否する。未知を空配列にしない。
4. sourceを変更したPython processを使い続けない。fresh source-only processから現在のdefinition/serviceを導出し、`checkpoint-preflight`、次いで同じHEAD・同じproofを指定した `checkpoint-migrate` を実施する。原承認と全旧結果を保存し、旧結果は `INVALIDATED_BY_DEFINITION` と記録する。旧PASSを新PASSへ移植しない。
5. 物理candidateの変更は採用済み修復5pathの全体だけを許す。実Git candidate、旧325bのbefore、修復291fc142のafter、全candidateと保護manifestを照合する。実装が既に存在する場合、その作成履歴と現在再検査を区別し、T03で未実施のfilewriteを記録しない。
6. 新規技術Workは `W-TECH-QF01-CHECKPOINT-RECOVERY-20261122` と `W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122` の2件だけ。実opened/T01〜T04を新しいsuffixへ記録する。旧owner状態、旧T04、patch_applied、版archiveをこの2件の代わりに作らない。R06の専用current-candidate proofは現在のclaim・compile・新技術owner検証へ結び、自動PASSや再filewriteを行わない。
7. 現在版CI、R07、意味審査、G2、実CAS/DEPLOY、公開後検査を必要な根拠が揃った順に進める。元受付snapshot、旧版archive、全prefixのnonce/他Work/queueは未回復のまま表示する。必須依存が未知なら該当工程を停止する。旧受付の派生receipt、事後sweep、R08/L01/閉鎖を完了扱いにせず、本人受入も代行しない。

正式checkpoint操作はfresh processから `python -I -S -B workflow/cli.py ...` とscriptを直接起動する。この入口はRuntime等の最初のlocal importより前にSourceOnly loaderを設置する。`-B`単独は古いpycの読取りを禁止しない。`current_core_identity()`はdisk sourceのfresh導出とcallerのdefinition一致を照合するが、通常importで既に実行中の全module bytecodeまで証明するAPIではない。直接embeddingを正式入口の検証結果で認定しない。

R06のGit検証では製品5pathとworkflow22pathだけでなく、9eeからの全diffを採用済みcode・指定Work記録・専用native JSONの上限へ照合する。`tools/textbook/`、任意governance、別Workや別publisherの実装をこのcore候補へ混入させない。

checkpoint lockはowner-tokenの排他方式を用い、PIDの推測や経過時間でlockを削除しない。中断したlockの自動解除は未対応として拒否する。origin・alias・junction・部分書込・CAS・再openを検査するが、電源断時のdirectory fsyncや悪意ある同時path交換に対するOS隔離は保証しない。Windowsで権限不足のsymlink検査とLinux限定の通常lock実検査は、実行済み検査と分けて報告する。

### QF01 D02の限定再検査基準

固定提案SHA256 `706ac7b5231831cfee8d67fe2a6080a05e2bb7c9770c3d246ec5a8ca8bcb5c60` に対する本人の「限定D02案を採用して進める」（request_user_input_async/call_27be7afbeef843249d088b530a5701b7）を追加権限として扱う。原1d案と原plan/users/初回sealは不変。新agentを作らず、現在のauthority_reviewとaxis_reviewを維持する。

1. D02の実採用転記ファイルをfile evidenceとして保存する。原A bootstrap/最初の定義移行を保持し、新current coreの実Git commitを固定してから後続preflightを作る。2回目以降の `checkpoint-preflight` には `informed_adoption_ref` が必要で、実D02採用と同ファイルSHAを検証する。原1dの移行機構を置き換えず、reviewMethodAdoptionを追加する。全旧結果は原artifactとして保存し、現在定義では再検証する。
2. 既存RECOVERY技術Workを正規改訂し、原source/source_manifestは保持したままD02追加権限・現candidate・新定義でT01〜T04を実施する。旧1dのT02と現在D02のT02を別々に保存する。新しいWork IDを追加したり旧T工程を改名したりしない。D02 authority採用後、既存ownerの現在候補はfresh CLIの `reconcile-informed-technical-owner` で結び直す。原Aの22path Git bytes・opened snapshot・原1d採用・現在D02採用・変更scope・現Git B/core・verification refs・expected HEADを検証する読み取り専用処理であり、実施していないfilewriteやpatch成功を作らない。旧結果を保存し、現在T工程で再検証する。通常bind/patchと新PUBの一度の実patchは変更しない。
3. `adopt-informed-review-method` は現在Git/core/sourceと、元plan/users、原first-pass2件、固定2名の寄与行列、実採用発言、expected HEADを検査してplan外authorityを記録する。採用authority自身は段階inputを含めず、段階inputがauthorityを参照し、後続receiptが計算済みinput/targetを参照する。
4. 対象はR04_PROPOSAL、R07_SEMANTIC、G2_AUDITの固定3nodeだけ。原教材source（R04では1f）と現在renderer/core sourceを別fieldで保持する。現在target、実harness/task/packet/原報告、両担当による各必須claim/facetの再検査、現CODEを束縛する。現在報告はindependent/sourceFirst/firstPass=false、理由露出true。作者集合には原packet履歴と現在寄与の両方を残す。
5. `informed-review-run` はD採用済みの指定3nodeだけで、既存run_capabilityを実行し、両実再検査用のclaim時間を明示する（既定3600秒、900〜7200秒）。通常production-runの挙動は変えず、CODEはclaim後に実行し、自動受理しない。`seal-informed-review` は有効な現在claimに対し、両実報告・現CODE・evidence・finding dispositionを検査して新receiptと実seal eventを記録する。これは自動PASSではなく、通常のsubmit/check_resultが同receiptを再検証する。作者単独のfinding解消、OPEN/UNRESOLVED、CODE FAIL、未確認・異版・報告欠落は停止する。
6. source/target/definition/service/method/作者集合の変更、または `revoke-informed-review-method` で対応receiptと下流を失効させる。R06 current proofにはD02 authorityと現在D02 owner権限を追加し、原1d承認も別に保持する。Aからのcore差分をD02の許可pathへ限定する。publisherも同じ追加権限・複数移行・実seal/receiptを検証する。
7. 独立審査の保証を回復したとは表示しない。通常team/1、他Work、未知prefix/元受付/global queue、実公開のCAS/DEPLOY/公開後検査は従来のまま。最終G3_FINAL@qf01-p035は公開後の本人の実物受入を待つ。D02採用や技術成功を本人受入・品質labelへ変換しない。

### QF01 D03 V2の再掲修復と再検査

固定追加案 `NEARBY_VISIBILITY_PROPOSAL_D03.md` のSHA256は `6e072c442c602947169f63bc5711e559377e685a5adffa872eccf5b56f3332cf`。本人の「D03案V2を採用し、記載範囲の公開反映とCIも許可する」（request_user_input_async/call_d8bca8dac40a458ca60d5346bbd6e8d5）を別のfile evidenceとして保持する。本文冒頭の未採用状態は採用前の原文であり、原文を採用済みに書き換えない。

1. 原1d/D02、Bの5修復、旧移行・結果・初回seal・OPEN所見を保持する。製品変更は `GuidedMathReadingFlow.tsx` と `QF01ReadingRevision3.test.tsx` の2pathだけ。残り3修復path、本文・metadata・数学・採点・保存を維持する。新実Git候補をB `247cb09b1d852d4e4fa469b3d74fb29bee053c53` の子孫へ固定する。Bからの全差分は追加案のcore11・製品2・原文1pathだけとし、公開前にpath/bytes/SHA256を固定する。
2. fresh SourceOnly CLIから `checkpoint-preflight` に `informed_adoption_ref` と `repair_adoption_ref` の両方を指定する。後者は `qf01-d03-v2-actual-user-adoption/1` の実転記file evidence。`repairAdoption` は固定案・実転記hash・原Bの2hash・現在2hash・直前/現在candidate・現在definition/service・epochを結ぶ。`checkpoint-migrate` は同じHEADとproofを再検証する。後続移行で補足を削除したり、直前candidateをBへ戻したりしない。旧PASSは保存し、現在入力では失効させる。
3. 原D02のauthority形式・同じ2名・寄与行列・非独立性を保持し、新current authorityのevidenceRefsに実D03採用evidenceを含める。新たなD02本人発言を作らず、保存済み実採用を再参照する。既存RECOVERYをD03原文hashへ正規改訂し、原A22 source/rules/scope/snapshotは維持する。現在保護manifestの418keysのうち製品2値だけをD03 afterへ更新し、旧planは保持する。現在ownerの実直前candidate/Git bytesと新候補を `reconcile-informed-technical-owner` で照合し、新T01〜T04を実施する。
4. Git proofの旧 `repairs` 5組とafterGitBlobSHAはBのまま保持する。現在製品treeと追加 `nearbyRepair` / `nearbyChangedPaths` がD03の実差分を表す。R06は現在compile・D03 ownerの実T01〜T04・現在承認・現在source/definition/serviceを検証する。実行していないpatchやfilewriteを記録しない。
5. 四幅320/390/430/1440×35判断×未回答/誤選択/正答後の420状態を実画面で採取し、原093境界、個別sourceの画面内0コピー/画面外1コピー、scroll双方向・clip・未mount/測定不能・保存隔離を確認する。現在sourceのlocal_execution/check証拠には `nearby_visibility` のfindingId、PASS、widths4整数、sampleCount420、unverified/unexpectedCopies/missingCopies各0を実測に基づき記録する。Nodeの模擬DOMや旧B画像だけでこれを作らない。
6. 各対象nodeの必須render claimについて両名それぞれの実報告に `QF01-B-NEARBY-VISIBLE-SOURCE-DUPLICATE-20261123` のVERIFIED_FIXED、元file evidenceを指す `reexaminesEvidenceRef`、理由、現在実測evidenceRefs、現在CODE参照を要求する。元B所見は真正な旧team outputへ呼び替えない。片方欠落・OPEN・測定不能・CODE FAILでは停止する。旧診断fileは上書きしない。
7. publisherのD03 private exportは、登録file evidenceのraw UTF8 bytesを `exportEnvelope.fileEvidence` の相対path→`{sha256,rawUTF8}` で伝達し、登録hash/実bytesを照合する。旧D02 envelopeは不変。CIには明示したTEST_FIXTUREだけを使う。コード20pathと原文1pathの公開許可を、実台帳・学習・認証情報の公開送信へ転用しない。main/配信・本人G3_FINAL・未知prefix/global queueは既存の別gateを維持する。

### QF01 D04の本文数学表示と履歴C・現在Dの分離

固定追加案 `MATH_PROSE_RENDERING_PROPOSAL_D04.md` はSHA256 `09a4c45c229d1b18190541a1441ee18d2b9d5d07dc62020b684b64b033d6fd85`。実採用「D04案を採用し、記載範囲の公開反映とCIも許可する」（request_user_input_async/call_93a584b6ba4842a3badb87262bb07b2b）を別file evidenceとして保持する。原1d/D02/D03や原134/35ID/metadata/AST/採点/保存を変更しない。F05太字改善は含めない。

1. 正規 `checkpoint-preflight` は `informed_adoption_ref`、`repair_adoption_ref`、`math_rendering_adoption_ref` を指定する。旧D03 `repairAdoption` は実C `900642faf76267546c5c7420b7d50a010516ca6e` の歴史objectのまま保存し、新しい `mathRenderingRepair`（qf01-math-prose-rendering-supplement/1）を別に付ける。実DのSHA/after/definition/serviceはGit確定後にだけ導出する。
2. 新recordの `beforeRepair` は固定C2hash、`candidateBeforeSHA` と `candidateBeforeManifestSHA256` は実直前stateである。初回はC、後続は実直前candidate/full manifest。原D03 event `bad3d783...` とsupplement digest `f8ebbd59...` を検査する。採用後の削除・置換、C又は過去の異なるafter mapへの巻戻しを拒否する。coreだけが変わる後続移行で現在after mapを保持することは許す。HEAD/epoch/from/直前candidate/manifestと全resultDispositionsを検証し、旧結果を保存して失効させる。
3. `current_product_repair_context` が旧D03単独とD04を明示分岐する。D04では原D03のC定義/serviceを現在Dと偽らず、現在Dの別recordを検査する。原5repairs/B blobとD03 `nearbyRepair` / `nearbyChangedPaths` のB→Cを保存し、新 `mathRenderingRepair` / `mathRenderingChangedPaths` だけをC→現在へ結ぶ。D04原文のGit mode100644/blobSHA1/rawSHA256/working同一/diff含有を検査し、全Git差分・許可product2・core11・新原文1以外を拒否する。
4. 原A22 source/rules/scope/snapshotと418保護keysを維持する。current ownerは実直前候補と現在D22を正規再結合し、許可2afterだけ保護値を更新し残416を保持する。元1d/D02/D03のtechnical userも保存し、新D04の正規提案/T02とT01〜T04を実施する。R06は現在owner proposalD04・現在compile・claimからproofを作り、昔のpatch/filewriteを作り直さない。
5. 現在Dのauthority evidenceRefsはD03/D04実採用の両方を含める。同じ2名・寄与開示・3false・原sealを保持。両current render報告が、原B nearby OPENと原C `QF01-C-PROSE-MATH-SPAN-20261123` をそれぞれ元file evidenceへ `reexaminesEvidenceRef` で結び、現在CODEと実測を引用してVERIFIED_FIXEDを報告する必要がある。原C診断rawSHA `8208aca8...` は不変で、現在Dの測定へ付け替えない。
6. current/local_execution/check の `data.math_prose_rendering` はfindingId、PASS、四幅整数320/390/430/1440、sampleCount整数420、`unverified/missingMathUnits/unexpectedMathUnits/splitMathUnits/unitErrors/sourceMismatch` の整数0を実DOM/source照合から採取する。bool、未知、負数、未採取を0へ変換しない。旧nearby_visibility条件も維持する。両実報告の全意味審査と全新画像tileの実見は、これらCODE counterとは別の必須条件である。
7. public CIのTEST_FIXTUREには実C private suffix/採用payloadを含めない。`QF01_CHECKPOINT_BASELINE_REPAIR_ROOT` は原B checkout、`QF01_CHECKPOINT_MATH_BASELINE_ROOT` は原C checkoutを指定し、それぞれ固定hashで検査する。synthetic fixtureの原C event/digestと診断rawhash境界をmockする場合は明示し、fixture event/hash/state/実bindingまでmockで消さない。通常回帰はLinuxで実実行し、Windowsの既知制約を全PASSへ変換しない。
8. コード20path＋D04原文1の公開作業ブランチ/CI許可は、実台帳・実本人回答・学習・認証payload公開を含まない。実R06/export前の生産PINはnull拒否、R07/G2・実公開後検査・本人G3・global UNKNOWNは従来通り別に検証する。

### QF01 D05 V2の混在inline表示と真正D3履歴

固定追加案 `MIXED_INLINE_SURFACES_PROPOSAL_D05.md` のSHA256は `68fe1a1431a1ac915bab6f4cbf7225aa380448cbbb611e2a68dc1cfe6de03000`、境界inventoryのSHA256は `474f3e40d743bdfdbb35c361049c165b605dedd160b0fb63f17779eb0a5d09e8`。実回答「D05 V2を採用し、記載範囲の公開反映とCIも許可する」（request_user_input_async/call_cdb41ee1e0fc4a1c94d7a17ddc35cc30）を別file evidenceで保持する。原1d/D02/D03/D04、原134/35ID/metadata/AST/採点/保存は不変である。

1. `checkpoint-preflight` のJSON入力に既存3採用refと `mixed_inline_adoption_ref` を指定する。新 `mixedInlineRepair` は `qf01-mixed-inline-surfaces-supplement/1` のexact20fields。固定D3 `249cc8ee4648bc86897e66e3c9b5847e5592e5c1` の2before、真正D04 migration event `166dc5ce...`、原D04 record digest `39564d49...` を照合する。テストだけのC0をnative前像にしない。現在after/source/definition/serviceは実Git固定後だけ導出する。
2. D04 `mathRenderingRepair` はD3の歴史objectのまま保存し、原D03 Cも保持する。D05後の実移行では新補足の削除・採用置換・直前candidate/full manifestの自己申告・過去afterへの巻戻しを拒否する。coreのみの後続移行は現在afterを維持できる。旧結果を保存し、現定義で失効させる。
3. Git proofは原5組/B blobs、B→C `nearbyChangedPaths`、C→D3 `mathRenderingChangedPaths` と、D3→現在 `mixedInlineChangedPaths` を分ける。新原文の100644 entry、blobSHA1、固定UTF8 SHA256、working bytes同一、diff含有を検証する。製品2・core11・新原文1以外の追加差分を拒否する。
4. RECOVERY ownerは原A22 source/rules/scope/snapshotと418保護keysを維持し、現在2afterだけを更新して残416を保存する。D05への正規改訂・実T02を行い、元1d/D02/D03/D04 userも保持する。同じD05採用内での後続再結合は、真正過去D05 record・最後の実owner proof・現在method・無claims/未完patch/未確定external・CASを検査し、planの許可2値と `proposal.currentMaterialSourceSHA` 以外の変更を拒否する。R06では現compile/claim/owner T01〜T04を照合する。
5. D04の実測条件を維持した上で、current/local_execution/check の `data.mixed_inline_rendering` に新schema、固定inventory、既知3finding、四幅、main420/help280/secondHint140の別groupsを記録する。各groupは実sampleCount/visualLineSampleCount、正の実measurementCountと12個の整数0を必要とし、bool/未採取/未知を0にしない。23marker/24semantic choiceの実可視mount coverageは必要な補足captureを含む別aggregateで全47を照合する。191全部をDOMへoracleとして挿入しない。
6. 両current render報告が原D3の3所見を元file evidenceへ `reexaminesEvidenceRef` で結び、現在実測と現CODEを引用する。全新画像の実見・全35判断/134意味審査はcounterとは別に必須。同じ2名の寄与開示とindependent/sourceFirst/firstPass=falseを維持し、旧B/C/D1所見や初回sealを上書きしない。
7. public TEST_FIXTUREは実private台帳/本人payloadを含めない。B/C baseline envに加え `QF01_CHECKPOINT_MIXED_BASELINE_ROOT` へ独立D3 checkoutを指定する。私的先行event/hash境界だけをsynthetic依存へ置換する場合は明示する。実chain/manifest/field検査を省略しない。コード公開許可をnative/学習/認証送信へ転用せず、生産PIN null、global UNKNOWN、公開後検査、本人G3は別gateのまま維持する。

### QF01 D06の共同移行と実親枠の包含

固定追加案 `INLINE_LAYOUT_WIDTH_PROPOSAL_D06.md` のSHA256は `de658139cbba61090ff66976a539cf15fb3b60f1147cbc73be4e1a82a1cef7f1`。本人回答「D06案を採用し、記載範囲の公開反映とCIも許可する」（request_user_input_async/call_0076d49fb62e4803bbb4e8a70ead98f6）を別file evidenceで保持する。D05の再採用として扱わず、原D05実採用rawhash474e62a3…も検証する。

1. 初回は真正D3からの一回の共同移行とし、JSON入力へ `inline_layout_adoption_ref` を加える。D05 exact20の `mixedInlineRepair` を維持し、D06 exact10の `inlineLayoutRepair`（qf01-mixed-inline-layout-supplement/1）を同じpreflight/eventへ追加する。後者のmixedInlineRepairSHA256は同eventのD05 recordのcanonical digestへ一方向に結ぶ。未実施のD05中間SHA/migration/T02を作らず、D05単独移行後に共同初回だったことにすることも拒否する。
2. D06原文の100644 entry/blobSHA1/rawSHA256/working一致を検査する。D3→現在の同じmixedInlineChangedPathsにD05/D06原文を含めることを、両補足の実採用・aliasが有効な場合だけ許す。C→D3のD04履歴は不変。採用後のD06削除・置換・異なるD05参照・既知after巻戻しを拒否し、同afterのcore-only継続では双方の実直前recordと現在aliasを検証する。
3. current owner proposalはD06を最高優先とする。原A22/rules/scope/snapshot・418keysと他416値、元1d〜D04 owner userと実D05採用fileを保存し、現在T02を実D06回答へ結ぶ。同じD06採用内の改訂では、実mixed/layout historyの一対一対応、最後の実owner proofの両record、現在method、CASと未確定操作なしを検証する。旧D05 same-adoptionで現在D06を再利用しない。R06は現在共同owner/CODE/compileから作り直す。
4. D05の3所見・12zero・47sourceと、原B/C所見を保持する。追加所見QF01-D05-WORKING-SECOND-HINT-INTRINSIC-OVERFLOW-20261123は未commit作業版b891…/f62…の事実であり、actualNativeCandidateD3/newActualGitSHA=nullの資格とrawhash a60d25…を保存する。正式D05 sourceへretagしない。両current render報告は元file evidence E-QF01-D05-WORKING-SECOND-HINT-OVERFLOW-20261123を再検査し、現在CODEと実測へ結ぶ。
5. current/local_execution/check のdata.inline_layout_renderingはqf01-mixed-inline-layout-measurements/1とし、main420/help280/secondHint140のsampleCount/parentContainmentSampleCountを別計上する。実在して適用する祖先のみ測り、不存在はnotApplicableAncestorCount、可視だが欠測はUNVERIFIEDとする。measuredAncestorCountは実正整数、unverified/overflowingFlowCount/overflowingMathBaseCount/missingApplicableAncestorCountは実整数0である。absent rectを0へ補わない。全840の実PNG前後計測一致をimageGeometryStableへ記録する。
6. 360/361pxとn04 secondHint/n12a最大式の4boundarySamplesを、固定source hashと実操作で結ぶ。既知hint階層font21.78pxを保持し、実math自然幅が最小適用祖先content幅+0.05px以内であることを検証する。別の可視sourceへ置換したり、191全部をDOMへ注入したりしない。全新tileの両名実見・意味審査・原134/35ID/数学/保存不変と、Linux既存207件＋追加分を別に実施する。
7. 公開コード上限20path＋D05/D06原文2pathだけを対象とする。実台帳/採用payload/学習/認証は含めない。private fixtureは先行private hash境界のみsynthetic依存へ置換することを明示する。生産PIN null・公開後の本人G3・global UNKNOWNは従来通り別条件である。
