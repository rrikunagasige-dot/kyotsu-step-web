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
