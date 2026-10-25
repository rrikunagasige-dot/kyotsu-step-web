# Verification

設計段階の実行結果：

- 原Word SHA一致・Pandoc3.1.3、108block/50数式の抽出PASS。
- NE02 33node/30回答、N11 47/39、N12 49/46。各IR schema/依存/漏洩、coverage、compile PASS。
- 原78ID・正答・300のcanonical choice keyを保存。
- 16恒等式・6不等式の解集合をSymPyで厳密検算。個数0〜20の整数を金額条件へ照合し11/12を確認。
- balancedな式templateと全選択肢spanのKaTeX strict parse：1016件・0エラー。
- 元図5点のファイルhashを表示契約へ固定。実ブラウザでの表示時点と幾何は実装後に検査する。
- native workflow到達点はgenerated/CURRENT_POSITION.mdとevidence/RUNTIME_CHECKPOINT.json。

未実施：教材src変更、revision移行の実働、スマホ/PC browser play、公開、今回3単元の本人評価。compileは制作IRのcompileであり、公開appのbuildではない。

再現：`python design.py` → 既存ML venvのpythonで`verify.py` → `python display_spec.py` → `node verify_math_render.mjs`。いずれもこのWorkをcwdにせずrepo rootからWorkの相対pathで実行する。承認後はDESIGN_INPUTS.jsonの固定hashを確認し、再生成物が承認版と一致する場合だけ採用する。

## Implementation checkpoint — supersedes design-only unperformed status above
P001 approved by「いいぞ」. All three learner units now match frozen IR and original78 answers/300choice keys. Dedicated19 and applicable learner620 tests,authoring39,lint/build pass locally. NE02 f860 publication run40179268540 and hosted four-width complete plays passed; N11 first browser overflow caught in run40179387131 and repaired. Final three-unit source459a6131 / CI40179800038 remains pending; no final QA or user material acceptance claimed here. Historical proof and failures are immutable, not overwritten.

## Final pre-publication proof
Source397788f1715b96459032a6647d6fbe772004a7b3 / CI40180994131 SUCCESS; artifact12594007880 SHA256a3fa4a639d622181fd036c45e2975a0750070f0f78bf4dd015a89ffbf9be133c. 12 four-width current plays:115 correct/296 wrong per width;41 stages;5 exact original figure gates;all old revisions;archives/reload/resize/expanded histories/semantic math and terms/one result-group number. Dedicated19,620 applicable regressions,authoring39,7 accepted behaviors,build/lint PASS. All3 native R07/G2 PASS after11 actual image inspections. Shared reader and accepted N09/N10 data byte-identical to source71dc5eaa whose full4-width plays passed CI40180105566; current protected display also PASS. Existing publication workflow79ba8c41 in progress; hosted verification and USER material acceptance remain pending here.
