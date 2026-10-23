# W-MATH-025/P-003 — N06 Q03、整数組を教えない誤答ヒント
Status: APPROVED
Created: 2026-10-23 JST
Command: CMD-WORK-001 修正

### 2026-10-23 execution checkpoint
P-003 Q03だけを実装。source 7bad9d800d143dcc99f52fecb96b867914ca09d7、原画像18枚 d889a22957362c50ef0cf88c3d023cf2e9b844c7、実Chrome/Review39894543039 SUCCESS。ヒント1文のみの実画像Gate①は直接「ヒントならいいよじゃ続けて」で受入済み、BLOCK-VISUAL-OK、全体Math39894542994も同じsource SHAでSUCCESS（237単体/254画面成功、9skip）。

### Problem / Need
教師原Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`。対象repo `rrikunagasige-dot/kyotsu-step-web` (ID1391122224)、確認した教材SHA `b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10`、N06 revision3 / 原問16件 / 選択16件。原Wordは読取専用。
原Word paragraph254【3】はXの多項式を因数分解する問い。Q02までに得た式は `X²−X−6` で、Q03では和−1・積−6の整数組を生徒が選ぶ。現ヒント「−3と2の和・積をそれぞれ計算する。」は求める組そのものを先出しする。根本原因は `answer_preexposure_on_wrong_attempt`、既存P-001/P-002と同根だが別問であり、その承認範囲には含まれない。

### Proposed Solution — exact one-literal change
対象 `src/data/textbook/math/numbers/n06Lesson.ts`、`q:3`、`n06-03`。
- 旧: `hint:'−3と2の和・積をそれぞれ計算する。'`
- 新: `hint:'積が負なので二数は異符号。和が負になるには、絶対値の大きい方が負になる。和と積の両方を確かめよう。'`

正解の−3と2、完成した因数をヒントで教えず、符号から候補を考え、和と積を両方確認させる。

### Scope / Expected Affected Areas
学習内容の変更は上記ヒント1文字列だけ。承認後はP-003を一つの小ブロックとして実装し、対象 `n06-formula-03` に限るpreview確認、既存検証の必要な拡張、正確なSHAの実画像と確認票を作る。実画像のGate①了承後に次の承認済み小問へ進む。P-004やW-MATH-026をこの承認で実装しない。

### Out of Scope / Do Not Touch
N06の他15問、Q03のlead/expr/prompt/answer/3誤答/after、原16問・全stable ID・revision3、共有renderer/CSS/schema/選択肢生成/進捗・旧回答・原Word・図を保持。正答 `(X-3)(X+2)`、誤答 `(X+3)(X-2)` / `(X-6)(X+1)` / `(X-3)(X-2)` を変えない。既受入N05 Q11/Q18、N13 Q05/Q08、Q12のヒントを保護する。N14 Q16別枝、main統合・公開・費用は対象外。

### Preflight / Mathematical Evidence / Risks
2026-10-23、Q03の独立設計判断の前にMASTER §§19/20/21/23/51–54、WORK_SYSTEM §§12A/12B/12C、mode SPEC、原Word paragraphs252–254と現Q01–Q04を確認した。`(X−3)(X+2)=X²−X−6` は係数比較で独立検算済み。新ヒントは整数組を含まない。旧ヒントより自分で考える量が増えるため、誤答後にも符号・和・積の手掛かりが読めるか実画面で確認する。ヒントのみのため採点意味と回答IDは不変、revisionを上げて旧進捗を消す変更は行わない。

### Verification Plan / Completion
承認後、差分がq3のhintだけであること、未回答時の先出し無し、誤答でQ04未解放→新ヒント→再回答→正答でQ04解放を実操作する。320/390/1440pxで日本語/数式/選択肢を実画像確認。通常経路と限定previewの両方、保存後リロードで旧回答・attemptCount・firstValue維持、正答後の解放を確認。既存schema/型/lint/buildと関連数学・他モード回帰を実行。Gate①はこのQ03だけ、Gate②は影響表の同根再監査後に判断し、Gate③・公開許可とは区別する。

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
