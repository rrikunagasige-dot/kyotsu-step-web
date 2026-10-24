# 現行入口: P-004 作成・修正の統合

新規数学教材Workは `production/2`。工程・機能・承認・公開・修正復帰・移行・三階層火柴図は [INTEGRATION_RUNBOOK.md](INTEGRATION_RUNBOOK.md) を使用する。下記は旧P-002の履歴説明で、G1画像承認と固定の総チェック文言は新Workへ適用しない。

---

# 作成・修正の実行器（P-002）

状態: 運用中。P-002はPR #129でmainへ正式採用済み（7c66bb6bbc1647b82601fb5010ffbef3cd4ef6e2）。教材の受入・公開権限は既存三Gateに従う。

Python 3.11以上・標準ライブラリだけで動く。憲法 → Work OS → 指示辞書 → 個別Workの具体案・既承認 → モード正本を復元してから使う。規範は従来の正本、実行状態は追記イベント台帳、画面と現在地は派生物である。

## 入口と担当

| 経路 | 工程 | 意味の判断 |
|---|---|---|
| CMD-WORK-002 | C01原資料 → C02概念 → C03型 → C04完全解法 → C05設計 → C06既承認 → C07生成 → C08検査 → C09意味審査 | AIが課題を受領し、根拠付き結果を提出する |
| CMD-WORK-001 | R01再現 → R02原因 → R03全影響 → R04具体案 → R05既承認 → R06限定差分 → R07検査・意味審査 → R08事例更新 | 資料不足はUNVERIFIED。登録済みの全ブロック・資料の行と版がそろわなければ拒否。原症状と保護対象を審査する |
| 教材の受入 | ブロックごとのGate① → Gate②横断監査 → 実働URL → Gate③総チェック → 事例統合 | 既存三Gateを使う。独立性は担当名だけで保証しない |
| 技術限定 | 分析 → 具体案の既承認 → 実装 → 検証 → 事例統合 | 教材の受入・公開承認にはならない |

各AIノードは `definitions.py` の必須項目を持つ。`claim` は着手記録、`submit` は成果物の提出であり、課題を発行しただけでは実行済みにしない。結果の形式が通っても内容が正しいとは証明しない。

## 現在のチャットから動かす

最初にplan JSONを固定する。必要形式は `contracts.py:plan_check`、実例は `scenarios.py` / `test_workflow.py:make_plan`。実際のWorkでは `simulation:false`、正規repoの実SHA、元ファイルと憲法・規則のSHA256、安定したブロックID、具体案ファイルのハッシュ、変更可能なpathsとpreserveを入れる。モード正本、原資料、関連事例、登録patterns/templatesの版もrules manifestへ含める。教材JSONを変更する場合はproposalに `patch_hash` を固定する。新規ファイル追加・削除・ID移行はこの版では停止して具体案へ戻す。

```bash
python workflow/cli.py --root . --store work/items/W-ID/runtime open --json plan.json
python workflow/cli.py --root . --store work/items/W-ID/runtime auto --work W-ID
python workflow/cli.py --root . --store work/items/W-ID/runtime next --work W-ID
python workflow/cli.py --root . --store work/items/W-ID/runtime claim --work W-ID --json claim.json
python workflow/cli.py --root . --store work/items/W-ID/runtime submit --work W-ID --json result-envelope.json
python workflow/cli.py --root . --store work/items/W-ID/runtime render --work W-ID --out work/items/W-ID/generated
```

`claim.json`: `{"node_id":"R02_CAUSE@block-id","actor":"current-chat"}`。
`submit`のenvelope: `{"node_id":"…","token":"claimが返した値","result":{…課題のrequired項目…,"verdict":"PASS","evidence_refs":["登録済み参照"]}}`。
`user`: `intent / quote / reply_to / source_ref` と必要な `block / scope` を渡す。会話からの転記は `conversation_transcribed`、テストの模擬発言は `simulation`。実装承認と品質肯定と公開許可は別種で記録する。

`auto` は実行可能なCODEノードと、現在の具体案・scopeに既に有効な承認の照合だけを進める。AI分析、監査、ユーザーの細部確認や総チェックを作り出さない。AI課題が返ったら、現在のチャットの担当者が資料を読み、結果を提出して再び `auto` を呼ぶ。終了したチャットの自動起動やAI API課金は実装範囲に含めない。

## 証拠と接続

| 操作 | 内容 |
|---|---|
| evidence | file / screenshot / ci / capture / check / appの出所・対象SHA・ハッシュを記録 |
| author | P-001生成器の既存CLIを呼ぶ。引数はengine_dir / input_path / out_dir / plan_path |
| patch | 現在のclaim・承認・patch_hashと前後ファイルを照合し、限定差分だけ適用 |
| bind | GitHubで実コミットを確認後、そのSHAを登録。未記録のファイル変更を追認しない |
| tool-result | 現行成果物または現在SHAの検査証拠を、対応するTOOL課題へ提出 |
| capture | CIのZIPをパス・サイズ・PNG・hashで照合して取り込む |
| probe-app | 実HTTPSと版マニフェストを取得。現在SHAのmobile_play / desktop_play / progress_isolation / no_auth_wall操作検証も必要 |
| export | 実行記録のGit tree要素とexpected_headを出す。GitHubコネクタがCAS付きで保存する |
| external-intent / external-outcome | merge / deploy / costの具体的許可、操作ID、未知結果を管理。外部操作そのものは実行しない |

GitHub保存では最初に接続アカウント・repo ID 1391122224・対象branchとlive HEADを照合する。tree → commit → `update_ref(expected_sha=確認HEAD)` の順。lease拒否時は再取得・実差分確認を行い、上書きしない。ネット切断時は実commit・run・artifactを照合してから記録を復元する。

転記証拠やローカル実行記録を暗号学的に認証された外部イベントとは呼ばない。ファイルとhashは検査するが、端末操作・学習上の妥当性・実質的な監査独立性は出所を読んで審査する。ローカルファイルへ直接書き込める者の悪意まで防ぐ認可サーバーではない。

## 中断・改訂・継続的な事例更新

- stateを最初から再生し、claimが生きていれば結果待ちを返す。期限切れは自動再実行しない。`reconcile` に根拠と成否を渡す。
- 未解決・失敗のAI結果は `reopen` に追加根拠を渡して再分析できる。過去結果はイベントと成果物に保持する。合格結果を黙って削除できない。
- 中断したpatchは `reconcile-patch` で実ファイルを照合し、`RECORD_COMPLETED` または `RESTORE_BEFORE`。未知の第三の差分があれば停止する。
- `revise` は新しい具体案hashが必要。原資料・規則の移行は新Workで固定する。承認の版・範囲が違えば流用しない。
- `issue` は原因署名・対象版・原証拠・説明を保持し、同型重複を照合する。修正子Workが必要な受入を終えるまで `resolve` で閉じられない。
- 全ての指摘は、既存規則／規則候補／パターン候補／検査／意味の審査／未解決へ対応付ける。新しい規則を強制的に増やさず、既存教訓なら参照する。
- 明確な品質評価だけを対象版と結ぶ。続行・実装承認はUNKNOWN。後から否定されたら事例更新ノードを失効させて戻す。以前の発言は削除しない。

`render --check` で派生物の相違を検出できる。Work内の現在地だけを生成し、他チャットの全体現在地を上書きしない。

## 検証

```bash
python workflow/verify_all.py --engine work/items/W-GOV-010-coded-authoring/engine --out workflow-test-output
python workflow/scenarios.py workflow-test-output/scenarios
```

模擬出力先は空のディレクトリを指定する。既存台帳への混在は拒否する。模擬経路の承認・監査・アプリ証拠は全てsimulationであり、本当のユーザー承認ではない。既存生成器は登録済みの狭い数学領域だけ。教材の品質改善率・独立した未使用教材への汎化・生徒の理解向上は未測定。詳細な規則対応と未自動化部分は `rules/mapping.json`、実装結果はWorkの `WORKFLOW_IMPLEMENTATION_RESULTS.md` を参照する。
