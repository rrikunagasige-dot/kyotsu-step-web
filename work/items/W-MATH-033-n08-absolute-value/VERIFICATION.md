# N08 実装の検証 — 現在

Status: PASS_BOUNDED / PUBLICATION_RUNNING

承認済みP-001（83ea55bc）から生成したsource `ea47dd97f7d323267281915e8d9a7bb92a8e7c03` をCI40162373237で検証した。原12問のID/正答と原図を保持し、36node・31回答・12段階を実装。

| 検査 | 結果 | 根拠 |
|---|---|---|
| 教材回帰 | 620 PASS（既知の物理catalog二ファイル除外） | evidence/CI_RUN.json |
| N08専用 | 7 PASS：凍結設計、3版移行、実reader、論理接続、廃止誤答再開 | implementation.test.tsx / evidence/CI_RUN.json |
| authoring / build | 39 PASS / PASS | 同上 |
| 実ブラウザ | 320/390/430/1440各幅、31正答・74誤答・履歴・再読込・3版移行 PASS | evidence/UI_REPORT.json |
| 実画像 | 320pxのQ07式連鎖・Q10論理条件を確認 | evidence/IMAGE_AUDIT.json |
| 既存教材保護 | N07・第一タイトル・元図のhash一致、protected UI PASS | evidence/LOCAL_IMPLEMENTATION_CHECKS.json |
| 公開 | run40162687421実行中 | PUBLICATION_INTENT.json |
| ユーザー受入 / 学習 | 未実施。設計承認を品質肯定に変換しない | 次はG3_FINAL@n08 |

同じassistantによる意味・画像監査であり、別AIによる独立監査ではない。全repo旧Markdownメタデータ検査の完全PASSは主張しない。以下は提案時の履歴。現在の承認・実装・検証状態は上記を優先する。

---

# N08 具体案の検証

Status: PASS_BOUNDED / IMPLEMENTATION_NOT_STARTED

| 検査 | 結果 | 根拠 |
|---|---|---|
| Word取込 | PASS：35block・30数式・原問12 | evidence/SOURCE_INDEX.json |
| 無番号説明を含む対応 | PASS：35/35、逆対応一致 | SOURCE_COVERAGE.json / evidence/COVERAGE_CHECK.json |
| 元図 | PASS：原画像とapp画像のbyte一致 | evidence/FIGURE_PROVENANCE.json |
| 元採点契約 | PASS：12IDと正答が不変 | evidence/ORIGINAL_STEPS.json / evidence/PROPOSAL_CHECKS.json |
| 思考ノード・穴 | 36node・31回答・12段階 | NODE_DESIGN.json |
| 候補IR | PASS：警告0、compile成功 | evidence/IR_CHECK.json / CANDIDATE_COMPILED.json |
| 旧版診断投影 | schema PASS、旧text数式候補のWARN2を保持 | evidence/LEGACY_PROJECTION_CHECK.json |
| 数理 | 9恒等式をSymPyで検算。距離・大小・全場合をAI監査 | COMPLETE_SOLUTION.json / evidence/MATH_CHECK.json |
| 事例の利用 | 版付き10件、適用理由を記録。classifierによる合否なし | CASE_DISPOSITIONS.json / evidence/R02_CAUSE_RESULT.json |
| 実工程 | 既存production/2でR01→R02→R03→R04を完了 | evidence/RUNTIME_CHECKPOINT.json / generated/ |
| source保護 | src/public/tools/workflowに差分なし | ACTION_LOG.md |
| learner実装・四幅UI・移行 | NOT_RUN | 具体設計承認後に実施 |
| 公開・N08ユーザー受入 | NOT_RUN | 今回の続行指示を具体設計承認や品質正例に変換しない |

旧IR診断のschema PASSは、旧教材が教育的に合格したという意味ではない。N08候補のcompile PASSも、実UIや配信が検証済みという意味ではない。今回のAIによる意味監査は現在の同じassistantによるもので、別AIの独立監査とは呼ばない。

中央workflow codeは変更していないため、前回の131工程テストを今回再実行したとは主張しない。今回実行した検査は上記のN08対象のもの。
