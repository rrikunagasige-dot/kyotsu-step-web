# 旧画像確認方式 — 履歴保存

Status: HISTORICAL

W-GOV-008/P-003の当時の規則。今後の制作・公開に適用しない。現役正本はgovernance/REVIEW_POLICY.jsonとWORK_SYSTEM §12A。


## governance/WORK_SYSTEM.md

## 12A. W-GOV-008/P-003 — GitHub小ブロック確認 → 横断監査 → 最終アプリ総チェック

Approved: 2026-10-19 JST; CMD-WORK-001「修正」; W-GOV-008/P-003. **P-003 expressly revises P-001/P-002's mandatory per-block live-app gate.** The preceding P-001 version remains historical in its original Work/PR; this section is the forward-looking rule **now effective on target main** under the user's separate 2026-10-19 integration approval. Constitution, instruction matching, proposal approval, correction-first §12B, Work states and release authorization do not change.

**Three distinct evidence gates (no automatic equivalence):**

| Gate | Reviewer / proof | Status and scope |
| --- | --- | --- |
| ① Small-block GitHub visual sheet | User sees an authentic screenshot/render, numbered `確認①`, stable block ID, target exact SHA, 2–4 concrete points; responds `細部OK` or `要修正` in ChatGPT | `BLOCK-CHECK-PENDING` → `BLOCK-VISUAL-OK` (layout/content visual acceptance **only**) |
| ② Cross-block audit | Agent tests source, math/physics, answers, hint leaks, transitions, progress and regression across affected units | `CROSS-VERIFIED` only with recorded evidence; new confirmed defects return to §12B |
| ③ Entire-app user playthrough | **Verified live app link** for a frozen release-candidate SHA; user actually plays the whole agreed app scope from the beginning to the end | `FINAL-REVIEW-NOT-READY` → `FINAL-REVIEW-READY` → explicit `FINAL-APP-ACCEPTED` |

These are *review labels*, not extra Work statuses. Preserve Work's `PROPOSED / APPROVED / IMPLEMENTING / VERIFYING / DONE / BLOCKED / REVISE-PROPOSAL / FAILED-VERIFICATION` machine. A narrow technical Work may be `DONE` when its own specified gates pass, **without claiming the app has passed final overall review**. Do not call an app-wide release accepted before `FINAL-APP-ACCEPTED`.

### Gate ① — one small block, GitHub-centered
1. For both `CMD-WORK-001 修正` and `CMD-WORK-002 作成`, define one bounded concept/question/decision, read §12B's correction queue and the applicable MASTER, mode SPEC, original-source and approved Work lessons *before* touching each block. Record the stable block ID, Work/Proposal, source revision, preview head SHA, changed/unchanged boundaries and expected learner decision. No unauthorized broad batch change.
2. Produce a **plain-language review sheet viewable in GitHub**, using `work/templates/BLOCK_REVIEW_SHEET.md`. Include a **real app-derived screenshot** attached/embedded at a verified GitHub location, `確認①` etc. precisely where changes occurred, the target complete commit SHA, check-point names, and 2–4 short actual visual checks. Never fabricate screenshots or claim an image is actual if it was not produced from the referenced commit. Raw PR/code/ZIP links are optional engineer evidence, **not the user's only review task**. A missing authentic image or mismatched SHA is `BLOCK-CHECK-PENDING`, not an acceptance request.
3. The user checks just the visibly marked places and responds `細部OK` or `要修正` in ChatGPT; agent logs the exact response, Work/Proposal, stable block IDs, SHA, date and image reference. **`細部OK` means visual/design acceptance only, not interactive app functionality.** Treat it neither as proposal approval nor as main/production publication permission. Do not infer consent from viewing a sheet or completing a textbook question.
4. After a recorded `BLOCK-VISUAL-OK`, hide that block's marker in the **next review output** but retain append-only acceptance history, SHA, underlying block ID and pending final playthrough. Do not erase prior evidence, change learner answers/IDs, or silently expand the accepted scope. P-002 app-side markers are an optional implementation; the P-002 pilot's independent-branch history is preserved, while the N01/N03 learner release subsequently reached main through PR #98.
5. On `要修正`, stop the next creation block, log the observed defect, root-cause signature and impact, follow `CMD-WORK-001` full-proposal permission and §12B correction-first sweep. Recheck the corrected screenshot against the *new* SHA, and invalidate the affected prior visual acceptance as appropriate; no mass changes merely because an audit found related concerns.

### Gate ② — cross-block audit, not user labor
6. Before the final candidate, audit links/dependencies across blocks and modes: source fidelity, math and physics reasoning, exact answer keys and choice types, figure/value consistency, premature hint/answer revelation, wrong/correct gates, navigation, shared UI, small-phone and desktop rendering, persistence/reset, previous corrections, and unaffected accepted units. The impact ledger must say `PASS / FAIL / UNVERIFIED` per surface, linked evidence/SHA and why a surface is out of scope. Use `work/templates/CROSS_BLOCK_AUDIT.md`; absence of evidence is UNVERIFIED, not PASS.
7. New confirmed defects re-enter §12B with linked scope-specific Work and exact approval; finish correction, repeat the affected checks and ensure no confirmed defect remains. `CROSS-VERIFIED` cannot be granted while a required audit cell is FAIL/UNVERIFIED.

### Gate ③ — one final entire-app user check
8. Only after Gate ① acceptance/closure and Gate ② QA, freeze a **release-candidate full commit SHA** and exact in-scope content manifest. Supply a real, reachable and *tested* one-tap **app URL**, not just a GitHub code page, linking to a start point. Verify the hosted build matches SHA, has no auth wall, works on phone and desktop, and does not pollute production learner progress. Vercel is optional; an already authorized free alternative may be used. A GitHub repository/Markdown screenshot **cannot itself serve as a playable app**. If no authorized accessible build exists, show `FINAL-REVIEW-NOT-READY` and request separate deployment/publication permission if needed; never invent a URL or use old main Pages as the new candidate.
9. The user starts at the beginning and plays the **entire agreed app scope**, each subject/mode/chapter/question, correct/wrong choices, transitions, hints/figures, refresh/reset and phone/desktop. Provide `work/templates/FINAL_APP_WALKTHROUGH.md` with actual URL, SHA, scope, route coverage and checkboxes. Sampling cannot replace the entire-app check unless the user separately approves a scoped exception.
10. Explicit user `総チェックOK` on the tested SHA/scope creates `FINAL-APP-ACCEPTED`; `要修正` records the failure and reopens CMD-WORK-001, affected cross audits and the relevant/full playthrough before another acceptance. No final acceptance is inferred from individual `細部OK` or engineering CI success.

**Authorization guard:** The user separately approved this governance-only main integration on 2026-10-19 JST. This does **not** authorize future learner-data edits, other feature merges, further production/Pages deployments, new public staging, Vercel deletion, bank/card entry, cost-bearing services, unauthorized account connections, or changing source lessons/previous approvals. Future actions still require their own applicable permission. Never imply Vercel is required. Prefer GitHub evidence for Gate ① and a playable app link only for Gate ③. The engineering helper workflow is evidence-only; it does not publish or make acceptance decisions.



## governance/INSTRUCTION_DICTIONARY.md

### User review handoff (W-GOV-008/P-003 — updated)

`governance/WORK_SYSTEM.md` §12A is the canonical three-gate flow. For this correction's **small visual block**, provide an authentic **GitHub-viewable** review sheet with an actual image, exact SHA, numbered `確認` marker, stable IDs and 2–4 short points; ask only `細部OK` / `要修正`. Individual `細部OK` is **visual approval only**, not live app hands-on approval, revised proposal authorization, or release permission. Hide accepted marks only in the subsequent review output; preserve Work logs and final pending status. The §12B correction-first impact audit still applies; no confirmed defect may silently propagate. After cross-block QA, a **verified playable whole-app URL for the exact frozen candidate SHA** is mandatory at the final `総チェック` gate; absent an authorized host/app link, record `FINAL-REVIEW-NOT-READY`. PR/ZIP/old-main Pages are not that final app. Host/publication/main/cost permissions remain separate.



## governance/INSTRUCTION_DICTIONARY.md

### Completion / review handoff — W-GOV-008/P-003

作成中のCI待機も `governance/WORK_SYSTEM.md` §12C の選択・復帰規則を参照する。§12B修正優先、exact Proposal承認、§12Aの既存Gateは変わらない。

小ブロックは §12A の GitHub確認票・実スクリーンショット・`確認①` マーカー・SHAで `細部OK / 要修正` を受け取る。小ブロックの `細部OK` は**表示内容だけ**の受入で、実アプリを操作した証拠ではない。承認済みマークを次回非表示にしても履歴と最終総チェック待ちは保持する。

作成Workの技術的 `DONE` は各Work自身の検証・承認条件の充足を意味するが、**アプリ全体の受入・公開可能性を意味しない**。全小ブロックの記録と横断監査を完了し、release-candidate SHAを固定して初めて、実際に起動するアプリリンクでユーザーが最初から最後まで `総チェック` する。`総チェックOK` まで `FINAL-APP-ACCEPTED` と呼ばない。アプリへの直行リンクをまだ用意できない場合は `FINAL-REVIEW-NOT-READY` と明記し、勝手に新規公開しない。

不合格は `FINDINGS.md` と §12B 修正優先・他の作成成果物の影響監査へ戻す。提案そのものへの承認（`REVIEW-FEEDBACK ≠ APPROVAL`）、モード正本、原資料、学習進捗、main/Pages公開の個別承認も維持する。



## docs/MASTER_APP_LESSONS.md

## 54. GitHub小ブロック・横断監査・総チェック（W-GOV-008/P-003）

### §54 改定 — W-GOV-008/P-003（2026-10-19 現行mainへの反映承認）


過去の **P-001版「全小ブロックを実アプリリンクで確認」** は当時の承認履歴として保持する。ただし今後の正本運用は `governance/WORK_SYSTEM.md` §12A の **三段階** が優先し、P-001版のリンク義務を小ブロックにそのまま適用しない。

1. **細部:** 作成・修正とも概念/問題ごとに既存教訓を確認し、実アプリから採取した画面画像と番号付き `確認` マーカーを載せたGitHub確認票で、ユーザーに `細部OK` / `要修正` を尋ねる。PRのコードを読ませない。承認済みマークは次回画面で外すが Work 履歴・SHA・未完の総チェックを残す。画像なし/対象SHA不明なら `BLOCK-CHECK-PENDING`。
2. **横断:** 算数/数学・物理・原典・正答/選択肢・ヒント漏洩・図・UI・遷移・保存/初期化・スマホ/PC・既承認修正の回帰をエージェントが証拠付きで監査。新規不具合は §51/§12B に戻り、未承認の一括修正は禁止。
3. **最後:** すべてのブロックと横断監査を閉じた後、exact release-candidate SHA に一致する**実際に動くアプリリンク**を渡す。ユーザーが最初から最後まで全対象をplayして、明示的に `総チェックOK` を出すまで `FINAL-APP-ACCEPTED` にしない。開くアプリが未準備なら `FINAL-REVIEW-NOT-READY`。

Vercelを必須とせず、main統合・本番/GitHub Pages公開・新規公開環境・削除・費用発生は別承認。小ブロックの画面受入、技術 Work 完了、アプリ全体の受入は別の記録とする。テンプレートは `work/templates/BLOCK_REVIEW_SHEET.md`、`CROSS_BLOCK_AUDIT.md`、`FINAL_APP_WALKTHROUGH.md`。



## work/templates/REVIEW_HANDOFF.md

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


## work/templates/BLOCK_REVIEW_SHEET.md

# 小ブロックのGitHub確認票 — W-GOV-008/P-003

> **このテンプレートは未記入の見本です。** 実際の記録は `work/reviews/<work-id>/<block-id>-<sha-prefix>.md` 等、対象Workから参照される場所に作る。ユーザーへ送るのはレンダリング済み画像と短いチェックだけ。PRコード解読は不要。

Review: [Work ID / exact Proposal ID]  
Status: BLOCK-CHECK-PENDING | BLOCK-VISUAL-OK | NEEDS-FIX  
Block: [stable concept/question/decision ID]  
Expected exact 40-character commit SHA: [実際の全SHA、推測禁止]  
Source / original material revision: [authority path and reference]  
Affected surface / route: [which app screen; non-public link if accessible]  
Unaffected boundary: [must not change]  
Screenshot SHA provenance: [capture command, app build SHA, timestamp, viewport]  
GitHub-visible actual image: [リンク/添付先; not mock, not code diff]  
Review history: [link to ACTION_LOG / VERIFICATION]

## ユーザーに見せる部分

**今回ここだけ確認：** [単元 / 問題 / 何が変わったかを平易に]

![実際のアプリ画面と変更箇所に付けた確認番号（正しい画像が得られた場合だけ貼る）](実際の画像を取得した後に貼るURL)

- **確認①** [changed ID] — [expected value / arrangement / figure]
- **確認②** [changed ID] — [what should remain unchanged]
- **確認③** [optional, not more than four] — [visual clarity on phone]

**返信：** `細部OK` または `要修正：確認②の◯◯`

*細部OKは画面上の細部確認だけです。後ほどアプリ全体を最初から最後まで操作していただく「総チェック」は別途行います。*

## Agent-only readiness / acceptance ledger

- [ ] Source authority, original IDs/answer types and instruction/lesson preflight checked
- [ ] Actual screenshot derives from exact tested commit, unmodified enough to show real content
- [ ] Numbered marks point **only** to changed content; no answer/progress corruption
- [ ] Image is GitHub-viewable without downloading ZIP or reading code
- [ ] Stable block and full commit SHA visibly associated with this sheet
- [ ] 2–4 simple target questions; no claim of actual interactive approval
- [ ] User's exact response, timestamp, image, SHA and block IDs logged after reply
- [ ] Once `細部OK`: next visual sheet omits accepted marker, history preserved, final status pending
- [ ] On NG: §12B correction-first queue and exact-scope new proposal authorization checked

Until image + SHA and checks are real and match, remain `BLOCK-CHECK-PENDING`; do **not** give the user a false ready link or ask for approval. A URL to a draft PR is engineering evidence only.


## work/templates/FINAL_APP_WALKTHROUGH.md

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
