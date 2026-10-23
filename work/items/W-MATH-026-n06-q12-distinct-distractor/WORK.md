# W-MATH-026 — N06 Q12 数学的重複誤答の限定修正
Status: VERIFYING
Updated: 2026-10-23 JST

## Objective / Authority
既承認P-001（直接「いいよ続けて」）の1選択肢だけを修正。P-001全文とexact承認を保持。Q06は最新直接「承認！続けて…」でhint-only画像受入。ユーザーは次から約5問を完成させ一度に見るよう指示。Q12一問だけのGate①承認を要求せず、次のまとめ提示へ証拠を保持する。

## Branch / Provenance
canonical target: `rrikunagasige-dot/kyotsu-step-web` (ID1391122224)。
main `15ae503455bc6ae75b080caa1c4919cafb250027` を読取照合。
起点はPR115 HEAD `44e42bf42d065057d54785d6bbe578ef9b4cbb5b`。
独立した順次実装枝 `work/W-MATH-026-n06-q12-distinct-distractor-20261023`、Draft PRのbaseはW025枝。main/N14別枝を統合しない。W025の旧SHAのCI結果を本修正のPASSとしない。

## Scope / Do Not Touch
q12 wrong[2]のみ `(x+y)(x+1)(x-2)` → `(x+y)(x+2)(x+1)`。
正答、他2誤答、受入済みヒント、他15問、原16問、stable ID、revision3、全履歴、renderer/CSS/schema、母本と図は保持。Q06受入済みreviewマーカーを隠し、Q12選択肢は別targetで証拠化する。
W025/P005–007はPROPOSED/未実装。N14 Q16はPR111の別SHA証拠として扱い、勝手にrev9/rev10を混ぜない。

## Current Step / Next Step
限定変更・保存済み旧誤答の再回答・四択の数学的非同値性・実画面証拠を準備。新source SHAとCI runはcommit生成後に確定記録する。現段階はCI PENDING、Gate①は5件まとめ提示に向け保留、Gate②OPEN、Gate③FINAL-REVIEW-NOT-READY。
次: Native CI/実画像を照合→新3ヒント案をまとめ提示→承認済み範囲を進め、5件の確認票を一度に提示する。

## Completion Condition
旧誤答保存を無改変復元、初回値/日時/試行数保全、誤答でQ13未解放・正答で解放、全16問完了復元、4つの多項式の非同値、正答一意、320/390/1440通常/reviewを確認。source/画像SHA付き問別受入後に閉鎖。全体監査/通し確認/統合公開は別状態。
