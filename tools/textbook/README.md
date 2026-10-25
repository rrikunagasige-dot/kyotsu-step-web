# 数学教科書の制作ツール（N07 pilot）

Status: ACTIVE
Authority: W-GOV-010 / P-002＋REFERENCE_CODE_RESEARCH / APPROVAL_20261024.md

制作専用。現行learner data、renderer、progress、公開設定は書き換えない。対応範囲はN07。候補を既存TextbookUnit形式へcompileできるが、アプリへの登録・新UI・進捗移行・公開検証は、N07具体設計の承認後に行う。

## 再現

Node22以上、pnpm lockfile、制作時のPython3＋lxml6.1.1＋Pandocを使用。Fraction.js5.3.4はdevDependency、Zodは既存依存を再利用。原Word本体・取り込み中間データはpublic repo外に置く。

```bash
pnpm install --frozen-lockfile --ignore-scripts
node tools/textbook/cli.mjs inspect --unit n07 --source /path/to/teacher.docx --out /tmp/n07-source.json
node tools/textbook/cli.mjs author --unit n07 --source /tmp/n07-source.json --out /tmp/n07-plan.json --job /tmp/n07-job.json
node tools/textbook/cli.mjs verify --unit n07 --plan /tmp/n07-plan.json --layer design
node tools/textbook/cli.mjs compile --unit n07 --plan /tmp/n07-plan.json --out /tmp/n07-runtime.json
node tools/textbook/cli.mjs compile --unit n07 --plan /tmp/n07-plan.json --out /tmp/n07-runtime.json --check
node tools/textbook/cli.mjs export-proposal --unit n07 --plan /tmp/n07-plan.json --out /tmp/N07_DESIGN.md
node tools/textbook/cli.mjs resume --unit n07 --job /tmp/n07-job.json
pnpm run test:textbook-authoring
python -m unittest discover -s tools/textbook/tests -p '*_test.py'
```

ジョブは入力・実装fingerprint・出力hashを検証して再利用する。FAILは再開コマンドと原因を残す。未完成の出力を確定artifactへ書かず、同じエラーを自動で無限再試行しない。jobにraw sourceが含まれ得るためrepo外へ保存する。

## 設計・検証の境界

- Fraction.jsは値の計算。途中を教えるtrace・小目標・穴は別の規則で作る。
- Mathsteps/Numbas/STACK/PreTeXt/DoenetMLの設計を参照したが、コードの移植・runtime依存追加はしていない。
- N07のAI編集結果はfixtures/n07-author.mjsに明示。規則生成とAI編集のprovenanceを保持。汎用AI APIの自動呼出しは実装しない。
- schema/前提/source対応/参照/選択肢検証は機械検査。自由文の自然さ・意味的漏洩・教育的採否は別のsource/novice auditが必要。
- 0/9だけの循環、範囲外の規則、指定Nが0件の場合は未対応・失敗。省いてPASSにしない。
- raw source index fixtureには原文・変換全文を入れず、source hash・段落位置・数式構造の証拠を保存する。
- exportされた提案には全原問・無番号説明・全ノードの本文/穴/候補/理由/ヒント/前結果/番号anchorを含む。状態candidateは公開承認ではない。

## 外部資産

Fraction.jsの版・著作者・MITライセンスはnode_modules/fraction.js/LICENSEとlockfileで追跡。Pandoc/texmathは制作時の外部CLIで、アプリbundleへコピーしない。調査commit・license表示・参考ファイルはWorkのREFERENCE_CODE_SOURCES.json、採用境界はTHIRD_PARTY_REFERENCES.md参照。

## 一問の解法・新形式の入口

`solution/1` / `production-ir/2` の opt-in、C/Rへの配置、SymPy環境、可視先行監査、学習文脈、四幅操作試験は [SOLUTION_PIPELINE.md](SOLUTION_PIPELINE.md)。旧N07等のIR/readerは従来の経路を使う。
