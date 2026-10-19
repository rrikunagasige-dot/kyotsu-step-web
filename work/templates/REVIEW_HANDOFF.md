# ユーザー確認引き継ぎ — W-GOV-008/P-003（三段階）

Scope / Work / exact Proposal:  
Review layer: SMALL-BLOCK | CROSS-AUDIT | FINAL-APP  
Block / stable IDs:  
Exact tested full commit SHA:  
State: BLOCK-CHECK-PENDING | BLOCK-VISUAL-OK | CROSS-VERIFIED | FINAL-REVIEW-NOT-READY | FINAL-REVIEW-READY | FINAL-APP-ACCEPTED | NEEDS-FIX  
Screenshot evidence and viewport/time:  
GitHub visual sheet URL (small block only):  
App URL (only final gate, must be real and checked):  
Work ACTION_LOG / VERIFICATION links:

## ① 小ブロック — ユーザーに送る（画像/位置/SHAを照合後だけ）

**ここだけ確認してね：** [確認票（実画像が表示されるGitHubページ）のリンク]

[実際の画像と `確認①` の内容が見える短い説明]

1. [チェック①：見える値・図]
2. [チェック②：説明と穴の位置]
3. [必要な場合のチェック③：スマホで読みやすいか]

よければ **細部OK**、違えば **要修正：確認番号と内容** と返信してね。

※これは**画面・内容だけの確認**。アプリを最後まで遊ぶ「総チェック」は後で別に行うよ。

**Gate**: 画像が実物でない、SHAが違う、リンクから表示されない場合は `BLOCK-CHECK-PENDING`。PRのコード/ZIPを代替チェックとしてお願いしない。

## ② 横断監査 — エージェント側で完了する

[work/templates/CROSS_BLOCK_AUDIT.md]に対象、原資料、採点、図、依存、UI、進捗、別モード、回帰を証拠とSHAで記録。欠落は `UNVERIFIED`、FAILは CMD-WORK-001 と §12B に戻す。`CROSS-VERIFIED` が成立してもユーザー総チェックを省略しない。

## ③ 最後のアプリ総チェック — ユーザーに送る（実URL検証後だけ）

**アプリの最初から最後まで遊んで確認してね：** [tested exact-release-candidate app URL]

- [今回の対象範囲、教科・モード・章・問題]
- [誤答/正答、進む/戻る、ヒント、再読み込み、スマホ/PC]
- [work/templates/FINAL_APP_WALKTHROUGH.md に基づく短い操作案内]

全体がよければ **総チェックOK**、違えば **要修正：どこか** と返信してね。

**Gate**: アプリが開かない、候補SHAと違う、公開/ホストの承認がない場合は `FINAL-REVIEW-NOT-READY`。GitHub画面や旧mainアプリのURLを「新しい総チェック用アプリ」として送らない。

## Common approval and release limits

- `細部OK` ≠ proposal approval ≠ app interactive acceptance ≠ `総チェックOK`.
- Work state `DONE` ≠ `FINAL-APP-ACCEPTED` ≠ main merge/production publish.
- No new public deployment, Vercel deletion, bank/card, billing, history erasure or main merge without new explicit approval.
