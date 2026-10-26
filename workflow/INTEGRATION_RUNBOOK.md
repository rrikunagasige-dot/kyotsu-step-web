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
