# 作業記録 — 2026-10-25

1. 接続GitHub rriku ID332552275、canonical repo、live main443d6433を照合。N08を受入した原文と、次のN09/N10依頼を分離した。
2. W033の実G3_FINAL→事後影響sweep→R08→L01実fit→Z01を完了。11事例の特徴量は元テキストhashと全token処理を確認。N08全体肯定1件のみ追加し、個別観点の肯定を作っていない。
3. 既存Word importerでN09/N10を抽出。41/55block・37/25数式、元14/21markerを確認。現行単元dataはread-only Vite SSRで取得し、N09既存18回答とN10既存21回答を保存。
4. N09元図を実見、Word内画像とbyte一致を確認。以前のQ10後表示・Q08中間4問を保持した。
5. 全86nodeの本文・穴・全選択肢・ヒント・依存先と、既存採点契約を具体化。N09 36回答/11段階、N10 45回答/12段階。重要な無番号説明もcoverageへ含めた。
6. strict IR検査で回答前の答えの先出しを検出。原問題の16を隠す変更はせず正の候補を手本にし、負の候補で計算させた。条件選択は式全体を答える形へ。cを定義して因子の式を選ぶ穴へ整理。
7. Work専用の関係式tokenizerが\leftを\leと取り違えたため、制御綴の境界を指定。中央engineを変更せず、等式・不等式の構造を生成して再検査した。
8. 前結果の文を再監査し、根号の条件表・整数＋残りの条件・c/c=1・平方差の一般式を記録する本文へ明示した。
9. 原資料coverage/IR/compile、19恒等式・厳密小数・floor/残り、39採点IDと正答を検証。共有production/2でR01/R02/R03/R04を実行。最初のR02提出にAI_ARGUMENT_REVIEWED/formalProof=falseの明記が欠けて拒否された。意味監査と機械証明を区別して同じclaimから再開。失敗を保持する。

このWorkでlearner source、中央workflow、公開版は変更しない。N08受入済み版を保護し、N09/N10は具体案の判断まで進める。

実装承認: 「ok。いいよ」をP-001両blockの承認eventへ固定。R05@n09を完了しR06@n09で6ファイルの追加/置換をbefore/backup/after付きでjournal。N09の620回帰と5専用検査、build/typecheck/scoped lintがPASS。旧版固定試験のfixture接続は承認案のtest boundary移行に従い、候補一覧に加えてnumbersNextBatch/r3LocalTokens/domain textbookの3試験もimportだけを凍結N09へ切替。学習者の意味や採点条件は変えず、旧試験を削除していない。
N10は同じ承認からWork内データとadapterを生成したが、既存RuntimeはN09のG3_FINAL前にN10のR05/R06を選ばない。中央codeを変更・受入を偽装して迂回せず、まずN09を公開・実物評価へ進める。

実行順の見直し: 前記「N10はN09 G3_FINAL待ち」はnext()の優先順をDAGの依存と誤読した。実DAGのR05@n10は両R04のみ、R06@n10はR05@n10のみが前提。Work内ready_dispatchは全native依存・現行bundle承認・idle/integrityを検査し、既存integration.accept/capabilities/production_resultを使って直列実行。G3_FINAL等の品質/受入userノードはdispatchしない。中央workflowは変更せず、同じ明示承認でN10も実装。根号内slotのLaTeX分断を9件目の実render試験で検出し、完全な式を既存TypesetFormulaへ渡すnative button表示へ修正。


## 2026-10-25 — both-unit final QA and publication
Exact source cb7d30bf: CI40168250606 SUCCESS. Both four-width plays PASS: N09 36 answers/90 wrong choices, N10 45 answers/111 wrong choices, per width. Real image review is same-assistant, not independent. Native R07/G2 passed for both; retrieved 11 cases consumed through existing CASE_DISPOSITIONS. QA receipt adapter corrected missing CI html_url and case dispositions; no gate bypass. Existing Pages workflow c422776a started with both logical release intents. User quality acceptance remains pending; no new label or model fit.
