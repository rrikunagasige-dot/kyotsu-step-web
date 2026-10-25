# 外部資産と由来

Status: ACTIVE

| 資産 | 使用形態 | 版・参照 |
|---|---|---|
| Fraction.js / Robert Eisele / MIT | devDependencyとして利用。ソースの独自vendorコピーなし | 5.3.4 exact、package.json/pnpm-lock.yaml、配布LICENSE |
| Pandoc / texmath | 利用者環境の制作CLI。原本→JSONの変換 | ローカル検証Pandoc3.1.3。CLI版を抽出manifestへ記録 |
| Zod | 既存のproject dependencyを制作schemaにも使用 | 既存lockfile |
| Mathsteps | changeType・変更前後・substepsという設計の参照。コードコピーなし | Work REFERENCE_CODE_SOURCES.json |
| Numbas/STACK/PreTeXt/DoenetML | part/gap/ヒント、要求別判定、教材役割、条件表示の設計参照。runtime移植なし | 同上 |
| fast-check | 調査のみ。今回のテストはNode標準・既存Vitest | 新依存追加なし |

原資料本体や第三者の教材本文はここへコピーしない。コード・ドキュメント・教材のlicenseは別に扱う。追加の採用は対象ファイルと使用方法を確認して記録する。

P-003制作側ML（学習アプリには同梱しない）: multilingual-e5-small/MIT、SetFit1.1.3/Apache-2.0、SentenceTransformers3.4.1/Apache-2.0、Transformers4.48.3/Apache-2.0、scikit-learn1.8.0/BSD-3-Clause、PyTorch2.6.0+cpu/BSD-style。モデルrevision・tokenizer/pooling/weights SHA256はredesign/implementation/ENCODER_MANIFEST.json、実環境の版はtools/textbook/ml/requirements.lock。既存ライブラリを利用し、sourceのvendorコピーは行わない。Qwen候補は調査段階で未取得・未採用。

## W-GOV-011 solution/1

| 参照 | 今回の使用 | 採用の境界 |
|---|---|---|
| SymPy 1.14.0 / BSD | 制作側の厳密計算。公式inequalities/calculus文書に沿った独自adapter | 数値定義域の二次極値等へ範囲限定。形式証明・一般論証の代用ではない |
| OATutor / MIT code | Problem.js / HintSystem.jsの段階別回答・ヒントの設計参照 | code/contentの許諾は別。本文やFirebase実装をコピーしていない |
| CTAT | example tracing・複数経路・誤り経路の設計参照 | 制約付きlicenseのruntimeを導入していない |
| Mathsteps | 変形前後・操作・substepsの設計参照 | archived engineの移植や一般不等式solverの採用ではない |
| STACK | 数学的同値と要求形を分ける判定の設計参照 | GPL runtimeの移植なし |
| Docling / MIT code、model条件別 | 任意の遅延import adapterだけを用意 | 未取得・精度未比較・既定に未採用。model利用条件の確認と原式照合が必要 |
| PyMuPDF / AGPL又は商用 | 任意PDF native adapterの呼出箇所 | 未同梱・既定依存なし。利用時にlicenseと配布条件を選定する |
| pyBKT | 将来の学習者skill推定の参考 | 教材品質headに流用せず、今回の採用なし |

原典URLと調査範囲はW-GOV-011/PROPOSAL.mdのR02〜R13。参考先の教材を私たちの訓練データへ自動投入しない。新規codeは独自実装であり、採用libraryの配布条件は別途保つ。

研究の穴あき例・支援の段階的減少は設計仮説の根拠として扱う。対象者・課題が違う研究から、今回の不等式教材の学習効果を保証しない。
