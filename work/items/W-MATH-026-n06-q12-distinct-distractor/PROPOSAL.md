# W-MATH-026 — N06 Q12の数学的に重複した誤答
## P-001
Status: APPROVED
Created: 2026-10-23 JST
Command: CMD-WORK-001 修正

### 2026-10-23 latest execution checkpoint
P-001のexact内容は不変。Q06hintの受入後、専用順次枝PR116に限定実装済み。sourced894e38820829c387386d207ff2d44d1ac95eebb、全体Math39900003882/Review39900003982/Governance39900003884 SUCCESS。旧wrong履歴保持の再回答と24実画像まで検証。ユーザー直接指示によりQ12一問で止めず、次5件groupの視覚受入へ保持する。

### HISTORICAL — 2026-10-23 execution checkpoint
承認済み、未実装。先行小問の実画像Gate①後にexact範囲で実装。承認を再度求めない。

### Problem / Need
教師原Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`。対象repo `rrikunagasige-dot/kyotsu-step-web` (ID1391122224)、確認した教材SHA `b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10`、N06 revision3 / 原問16件 / 選択16件。原Wordは読取専用。
原Word paragraph271【12】は残る二次式の因数分解を完成させる問い。正答は `(x+y)(x+2)(x-1)`。現在の第1誤答 `(x+y)(x-2)(x+1)` と第3誤答 `(x+y)(x+1)(x-2)` は、積の交換法則により同じ多項式である。文字列比較だけで選択肢を用意し、数学的同値性の検査が不足した `mathematically_duplicate_distractors` が原因。ヒント先出しとは別原因なのでW-MATH-025/P-002には含めない。受入済みなのはQ12のヒント1文だけである。

### Proposed Solution — exact one-distractor change
対象 `src/data/textbook/math/numbers/n06Lesson.ts`、q:12の `wrong[2]` だけ。
- 旧: `(x+y)(x+1)(x-2)`
- 新: `(x+y)(x+2)(x+1)`

正の定数二つを選んで積の符号を間違える、既存の符号ヒントで考え直せる誤答に置き換える。第1誤答、第2誤答、正答の3つはそのまま。4つは互いに異なる多項式になる。

### Scope / Expected Affected Areas
学習内容の変更はこの選択肢1つだけ。承認後、既存W-MATH-025の実装・検証と同じファイルを書き合わないよう、確定した最新SHAから独立したW-MATH-026 feature branchで順番に実装する。専用のQ12「選択肢」確認票/previewと必要な検証を用意する。旧ヒントの実画像・受入履歴は保持し、選択肢の新Gate①を別記録にする。現時点は提案文書のみで、実装ブランチ未作成。

### Out of Scope / Do Not Touch
正答 `(x+y)(x+2)(x-1)`、残る誤答 `(x+y)(x-2)(x+1)` / `(x-y)(x+2)(x-1)`、受入済みP-002のヒント、lead/expr/prompt/after、他15問、stable ID `n06-12`、revision3、原16問/16選択、正誤判定・shared choice生成・UI/CSS・保存schema・移行処理を保持。Q03/Q06はW-MATH-025各案に従う。旧Word・図・既受入単元・N14 Q16別枝・main統合・公開・費用は対象外。

### Mathematical Evidence
`(x-2)(x+1)=(x+1)(x-2)=x²-x-2` なので旧二つは同一。
新 `(x+2)(x+1)=x²+3x+2` は、正しい `x²+x-2` と第1誤答のどちらとも異なる。第2誤答は外の因子が `x-y` であり、他の3つとも異なる。全因子をx,yの整数係数多項式として独立展開し、提案後4つの係数辞書が全て異なることを検算済み。

### History / Revision Plan / Risks
問題・正答・採点意味は変わらず、学習者に追加判断を要求しないため、**revision3と全進捗を維持**する案。現 `effectiveTextbookProgress` は同revisionをそのまま返し、`answerTextbookItem` はfirstValueや初回正誤を保持する。保存済みの削除対象誤答文字列を新しい選択肢へ書換・再判定・削除しない。過去の未解決誤答は未解決のまま、新しい4択で再回答できる。削除された旧誤答は新4択に無いので、その選択肢の赤い再表示はできないが、誤答状態・ヒント・試行履歴は保全される。この挙動もテスト対象にする。修正前に正答済みなら再学習や完了取消を強制しない。

### Preflight / Verification Plan
2026-10-23、Q12選択肢の設計前にMASTER §§19/20/21/23/25/51–54、WORK_SYSTEM §§12A/12B/12C、mode SPEC、原Word【12】、q12全選択肢・現 `src/domain/textbook.ts` と `TextbookUnitPage.tsx` の保存/再回答を確認。
承認後は一文字列だけのsource diff、数学的同値/非同値、4択中の正解が1つだけ、誤答を正解扱いしないことを確認する。旧wrong[2]を保存した状態→reload→新4択→再回答、旧firstValue・attemptCount・初回正誤維持、正答済み/全16問完了の復元を検証する。320/390/1440pxで実画面の4択とヒントを確認し、通常/preview双方で誤答時Q13未解放・正答後のみ解放を検証。既存schema/型/lint/build・数学/他モード回帰、同根影響表の再監査を行う。Q12選択肢だけの実画像Gate①、全体Gate②/③、統合/公開は分ける。

### Approval
Status: APPROVED
Approved by user: YES
Approval date: 2026-10-23 JST
Approval evidence: ユーザーは本チャットで、3案の全文リンクと変更内容を示し「この3案を承認し、Q03から1問ずつ進めてよいですか？」と明示した直後に **「いいよ続けて」** と回答（2026-10-23 JST）。対象は9ef406823375a267d13d493c2a3c57af5e938bebで固定したW-MATH-025/P-003、P-004、W-MATH-026/P-001の3案。これは前のQ12ヒントGate①への同文回答とは別の承認事象。各案のexact範囲を順番に許可し、一括実装・Gate①省略・main統合/公開は許可しない。

### Review History
- Review status: APPROVED
- User feedback: 「いいよ続けて」; exact unchanged proposal approved, execution staged per question.
- Supersedes: None.
- Superseded by: None.
- 内容に変更が必要なら新しいrevisionを全文提示し、明示承認を待つ。
