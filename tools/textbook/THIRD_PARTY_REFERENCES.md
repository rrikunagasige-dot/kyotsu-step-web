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
