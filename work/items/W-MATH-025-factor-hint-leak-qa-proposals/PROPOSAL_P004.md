# W-MATH-025/P-004 — N06 Q06、完成した因数を教えない誤答ヒント

## 2026-10-23 最新ユーザー受入・まとめ提示指示
ユーザー直接発言: **「承認！続けて。後仕事どれぐらい残っているのか教えてくれ。次からは例えば一つQ06じゃなくて5個のやつ全部完成して私に見せてください。その方が効率いいから」**。
直前に提示したQ06ヒント実画像98ffc53ca390ef4769a4800a58cf3436f87b2057 / 固定画像dd0842e26de33565afdc28e412d26182ad3dec35への受入として、Q06 hint-onlyを **BLOCK-VISUAL-OK** と記録する。既存ID/原画像/元履歴を保ち、次候補でQ06マーカーを非表示、再撮影を停止する。
今後は約5問の修正・技術確認・問別証拠をまとめ、一度の確認に提示する。各問の原文照合・数学・履歴・画面の内部確認は保持する。以前の「1問ずつ止める」提示頻度はこの直接指示で変更された。未提示P-005/006/007のexact内容、Gate②/③、main統合・公開への承認には読み替えない。Q12既承認P-001は再承認なしで継続する。

Status: APPROVED
Created: 2026-10-23 JST
Command: CMD-WORK-001 修正

### 2026-10-23 execution checkpoint
Q03はヒントとして直接「ヒントならいいよじゃ続けて」で受入済み。P-004の既存exact承認を用い、今回Q06hint1文のみを実装。撮影source 98ffc53ca390ef4769a4800a58cf3436f87b2057、原画像18枚 dd0842e26de33565afdc28e412d26182ad3dec35。実Chrome/Review39897233016 SUCCESS、全体Math39897233018も同じ撮影SHAでSUCCESS（237単体/254画面成功、9skip）、人間Gate①は未受入。既存実装承認を再度求めない。

### Problem / Need
教師原Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`。対象repo `rrikunagasige-dot/kyotsu-step-web` (ID1391122224)、確認した教材SHA `b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10`、N06 revision3 / 原問16件 / 選択16件。原Wordは読取専用。
原Word paragraph260【6】は置換した式を因数分解し元の文字へ戻す問い。Q05は `T=x²` と `T²−5T+4` まで。Q06の現ヒント「T−1とT−4に分けてからTをx²へ戻す。」は、生徒が得るべき `(T−1)(T−4)` を先出ししている。根本原因 `answer_preexposure_on_wrong_attempt`。P-003と同根でも別小問として承認・実画面確認する。

### Proposed Solution — exact one-literal change
対象 `src/data/textbook/math/numbers/n06Lesson.ts`、`q:6`、`n06-06`。
- 旧: `hint:'T−1とT−4に分けてからTをx²へ戻す。'`
- 新: `hint:'積が正なので二数は同符号。和が負なので両方とも負になる。和と積を確かめ、最後にTをx²へ戻そう。'`

答えの−1/−4や完成した因数を提示せず、符号の条件と、既に学んだ置換を戻す行動を案内する。

### Scope / Expected Affected Areas
学習内容はq6のhint1文字列だけ。P-003が実装される場合も、先にその独立Gate①を閉じてから本案を実装。対象preview `n06-formula-06`、必要な既存検証の拡張、実SHAの実画像/確認票を本案の検証範囲とする。本案の承認だけで他の提案を変更しない。

### Out of Scope / Do Not Touch
正答 `(x^2-1)(x^2-4)`、誤答 `(x^2+1)(x^2+4)` / `(x^2-2)(x^2-2)` / `(x^2-1)(x^2+4)`、q6の他のフィールド、他15問、16原問・16選択・revision3・ID・旧進捗は保持。原Word、図、shared renderer/CSS/schema、移行処理を変更しない。既受入単元・Q12ヒント・別枝N14 Q16を保護。main統合・公開・費用は対象外。

### Preflight / Mathematical Evidence / Risks
2026-10-23、Q06の設計前にMASTER §§19/20/21/23/51–54、WORK_SYSTEM §§12A/12B/12C、mode SPEC、原Word paragraphs259–260と現Q05–Q07を確認。`(T−1)(T−4)=T²−5T+4`、T=x²へ戻すと既存正答に一致する。新ヒントはその定数組・積の完成形を含まない。長くなる文が小画面で読めるか、既出のT=x²の復元に迷わないか確認する。ヒントのみなので採点意味とIDは不変、revision/保存履歴の変更は行わない。

### Verification Plan / Completion
差分がq6hintだけか確認し、誤答→ヒント→再回答→正答を実操作。誤答でQ07は解放されず、正答後のみQ07へ進むこと。320/390/1440px、通常経路/限定preview、全16問の継続、保存と再読込でfirstValue/attemptCount/旧正答済みを維持すること。既存schema/型/lint/build・関連回帰を実行し、正確なSHAの実画像でQ06単独Gate①を依頼。影響表と同根再監査を更新し、未解決項目を残してGate②をPASSにしない。

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
