# 今回の分析・提案の検証

- 原本：N08 revision4、36node/31回答/12stage/元図1点。NODE_INVENTORYのSHA256へ固定。
- 旧IRを現行compilerで再生成し、配信由来のauthored.semanticと完全一致。既存教材の内容を今回の試験で誤って別版へ置き換えていない。
- 既存の新solution検算：表現できる部分計算3件PASS、Abs/根号/πの表現canary3件は未対応。数学的に偽の式を検査して未対応と呼んだわけではなく、同じ式から同じ式への恒等変形でも新ASTが受理できないことを確認した。
- 独立したSymPy試行：17件PASS。これは接続実装や教材受入の完了を表さない。
- 現行実画面：320/390pxの各12stage、全31正答＝62操作。制作者向け文と原問保持の問題を実DOM/画像で確認した。
- 提案：全36nodeを重複なく設計。旧31回答IDと正答の一致、3新回答/5slot、12stageの被覆、39node/34回答をCODEで照合。
- 提案書中の92数式をKaTeX strictで描画検査しPASS。最初に本文の回答二つをmathへ入れた検査は失敗し、text/mathを分離して再生成した。初回の失敗もevidenceへ残した。
- referenceサービス：原本hashと位置、観察と補完の区別を用いて実際にpattern候補を生成。数式抽出とimport返却属性の欠落を検出。未解決の参考範囲をPASSへ偽装していない。
- native：既存共有Runtimeで修正入口を使用。R01 PASS。R02は未対応solution.validateのreceiptを含めUNVERIFIED。R04/R05/R06の完了・承認・実装は記録していない。
- corpus：既存15件を取得し、各事例へAPPLY/ALREADY_SATISFIED/OUT_OF_SCOPEと理由を記録。未学習モデルを品質判定へ使わず、本人の新しいGold labelを作っていない。
- src/tools/workflow/publicの実装差分なし。新教材のcompile・公開・修正版QAは未実施。

全12画像はevidence/screenshots.tar.gz.base64へ可逆保存、同jsonにhash。元の画像は保存・展開後に照合可能。

再現：このWorkのanalyze.mjs、probe_math.py、verify_analysis.py。browserはaudit-browser.mjs。research-analysis.mjsは取得したHTML抽出cacheを必要とする。nativeのrecord_analysis.pyは一度だけの登録用であり、既存Workへ再実行しない。R02の初回提出では事例消化表が不足して拒否され、resume_analysis.pyで同じ実claimを完了した。失敗を避けるための別台帳・模擬承認は使っていない。
