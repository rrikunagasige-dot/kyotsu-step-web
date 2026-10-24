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

戻り値のclaim tokenと`receipts`を使い、主工程の`required`項目・`verdict`・`evidence_refs`・`capability_receipts`・AI requestに対応する`aiReview`を提出する。AI工程は`submit`、TOOL工程は`production-result`。根拠のないPASS、codeのFAIL/UNSUPPORTED、別phase・別node・古いhashのreceiptは拒否する。対応外の数理は、構造付きargumentとAI監査へ明示的に渡し、機械証明とは呼ばない。

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
