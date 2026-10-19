# アプリ全体・最終総チェック票 — W-GOV-008/P-003

> **最後にユーザー本人が最初から最後までplayするゲート**。小ブロックの `細部OK` やエージェントの自動テストでは代替できない。

Status: FINAL-REVIEW-NOT-READY | FINAL-REVIEW-READY | FINAL-APP-ACCEPTED | NEEDS-FIX  
Work / proposal lineage:  
Frozen release-candidate full 40-character SHA:  
Full product in-scope manifest (subjects, modes, chapters, every question ID):  
Explicit exclusions or separately approved sampling exception:  
Verified live start URL (never a placeholder / old main URL):  
Provider (Vercel not required) and separate authorization reference:  
URL opened + exact SHA + no auth wall verification time and result:  
Phone/desktop + progress isolation checks, screenshots/CI evidence:  
Gate ① all blocks accepted / status ledger:  
Gate ② `CROSS-VERIFIED` linked audit:  

## ユーザーへ送る短い案内（READYで実URLを貼れるときだけ）

**アプリ全体をここから最初から最後まで確認してね：** [実際に開けるアプリのURL]

今回の対象は [教科・モード・章・全問題の説明]。次を一通り試してください。

1. 最初から順番にすべての章/問題へ進める。
2. 各問題で間違えたときやり直せて、正答すると次へ進む。
3. 式、図、ヒント、解説が自然で、次の答えが先に見えない。
4. 戻る・再読み込み・保存・初期化の挙動が意図どおり。
5. スマホとPCで読めて、他の教科/モードにも問題がない。

問題がなければ **総チェックOK**、何かあれば **要修正：教科・章・問・症状** と返信してください。

## Full playthrough ledger — unvisited = pending

| Subject/mode | All chapter/question IDs or checklist link | Wrong & correct interactions | Progress/refresh | Phone/desktop | User's result / date |
| --- | --- | --- | --- | --- | --- |
| [mode A] | [all actual IDs] | PENDING | PENDING | PENDING | PENDING |
| [mode B] | [all actual IDs] | PENDING | PENDING | PENDING | PENDING |

## Final gate rules

- [ ] All small-block visual statuses resolved; marks hidden next sheet but history retained
- [ ] Cross-block audit is `CROSS-VERIFIED`, no outstanding applicable confirmed defect
- [ ] Real app URL loads from start, matches frozen candidate SHA, route/content and exact manifest
- [ ] Hosted visibility/credential/billing permissions separately valid; production state not contaminated
- [ ] User has played *every* agreed unit/question/interaction, or supplied explicit different-scope approval
- [ ] User explicitly replied `総チェックOK` for **this** SHA/scope; record exact words/date/evidence
- [ ] On any NG: return to CMD-WORK-001, repeat relevant cross-audit and full/affected walkthrough, replace SHA

If any gate fails, remain `FINAL-REVIEW-NOT-READY` or `NEEDS-FIX`, **never** `FINAL-APP-ACCEPTED`. This final acceptance does **not** authorize main merge, public production release, GitHub Pages publish, Vercel deletion, or payment.
