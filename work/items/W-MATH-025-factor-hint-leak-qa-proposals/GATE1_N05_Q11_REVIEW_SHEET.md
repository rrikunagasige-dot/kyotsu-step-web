# N05 Q11 — 実画像 Gate① 確認①「正解の整数組を先に教えないヒント」
**Work:** W-MATH-025/P-001（ユーザーがP-001/P-002とも「承認続けて」で承認、ただし今回はP-001のQ11のみ）  
**Status:** BLOCK-VISUAL-OK — 2026-10-23 user 「続けていいよ」  
**実働教材/ブラウザの完全SHA:** `26c6e82130e52ff89a7bec352ec785aed2a062ad`  
**実画像18枚のGitHub固定コミット:** `eb7d99d0901562b7909e89903af01483f6aa23c1`（元画像が後から変わらないよう固定）  
**元の問題:** N05 Q11、a²−6a−16 の因数分解。元Word 20問、N05 revision2／20選択、正答 `(a-8)(a+2)` は不変。  
**実際のChrome証拠:** [レビュー・画像検査成功 #39881650791](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39881650791)、日本語 Noto CJK JP、320/390/1440px、番号付きレビュー/通常学習、誤答→ヒント→再回答、保存後リロード。  
**承認時の技術検証:** predecessor `aa6758fa8a8a8656a9c10860bd3815e4c51de57c` のMath #39882399861、Review #39882399858、Governance #39882399855は全てSUCCESSと実GitHubで再確認。Q12 Stage Bの新SHAは別途検証する。

## 今回見る場所 — 確認①のみ

生徒が誤答したとき、**求める整数組「−8と2」は出さず、積と和を自分で確かめる方法だけ示す**ように変更しました。

### 確認① 320px：誤答後の本物のヒント

![N05 Q11 320px 実ブラウザ誤答時のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-review-wrong-320.png)

### 確認① 390px：誤答後の選択・ヒントが読みやすいか

![N05 Q11 390px 実ブラウザ誤答時のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-review-wrong-390.png)

### 正答後の既存の答え（変更していません）

![N05 Q11 390px 実ブラウザ正答後の画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-review-complete-390.png)

[通常学習モードの320px誤答画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-normal-wrong-320.png) ／ [通常学習モード1440pxの完成画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-normal-complete-1440.png) ／ [全18枚の固定画像一覧](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/README.md)

**承認記録:** この確認①の実画像を本チャットで提示後、ユーザーが「続けていいよ」と直接了承。Q11の再確認は不要。原画像は履歴として固定保存し、次の出力では確認マーカーを外す。

N05 Q18・N13 Q05/Q08の細部は承認済みなので、再確認は不要。当初の確認時点でN06 Q12は承認済み・コード未変更。Q11了承後、同じ承認を保持してQ12 Stage Bへ進みます。N14 Q16のGate①も独立して未完了。Gate②・全アプリGate③・main統合・公開は別段階です。

## 監査用情報（実画像の作り物禁止）
- [x] Original N05 Q11 guided item `n05-11` / original `n05-formula-11` / preview ID `n05-q11`, 1 graded choice, answer and distractors unchanged; one confirmed hint replaced.
- [x] Actual source SHA `26c6e82130e52ff89a7bec352ec785aed2a062ad` / fixed 18 PNG capture storage `eb7d99d0901562b7909e89903af01483f6aa23c1`; image storage branch diff was exactly 18 PNG and README. N05-Q18 and accepted N13 blocks source protected.
- [x] Genuine screenshots manually inspected for Japanese text and hint no correct-coefficient pre-exposure. Browser reviewer workflow PASS.
- [x] Q11 predecessor full math/Review/Governance CI exact SHA `aa6758fa8a8a8656a9c10860bd3815e4c51de57c` success rechecked.
- [x] User Q11 direct visual response 「続けていいよ」; Q11 BLOCK-VISUAL-OK only.
- [ ] After accepted Q11, separately implement approved P-002 N06 Q12, cross-audit and final live user playthrough.

## 2026-10-23 JST — authoritative Q11 visual acceptance and Stage B checkpoint
- Direct user response **「続けていいよ」** immediately followed this chat's Q11 確認① real-image review and explicit request for `細部OK / 要修正`. This is **Q11 BLOCK-VISUAL-OK**, not a fabricated literal `細部OK` quote, not Gate②/③ or release permission.
- Accepted original Q11 IDs: `n05-11`, `n05-formula-11`, review target `n05-q11`; original screenshot source `26c6e82130e52ff89a7bec352ec785aed2a062ad`, immutable images `eb7d99d0901562b7909e89903af01483f6aa23c1`. Reviewed current predecessor `aa6758fa8a8a8656a9c10860bd3815e4c51de57c`; all three source-head CI successes independently rechecked. Retain old evidence/history; hide only Q11's accepted marker and stop its recapture job.
- Stage B uses existing exact **W-MATH-025/P-002** approval (prior verbatim 「承認続けて」 for both proposals). Sole learner source mutation: `src/data/textbook/math/numbers/n06Lesson.ts` q:12 hint `2と−1なら和は1、積は−2。` → `積が負なので二数は異符号。和が正なので、絶対値の大きい方が正になる。元の因子(x+y)も残そう。`.
- Word source SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`: N06 heading paragraph 248, Q12 paragraph 271, original Q01–Q16 confirmed including OMML. Actual N06 revision3 has **16 original questions / 16 graded items**, not the stale handoff shorthand 15; no source/revision/IDs/options/answers/progress edits.
- Existing same Work feature branch / Draft PR #115 retained; parent `aa6758fa8a8a8656a9c10860bd3815e4c51de57c`; base PR remains accepted W-MATH-024 branch. Preserve N05 Q11/Q18, N13 Q05/Q08 and all other learner code. Separate W-MATH-022 N14 Q16 Gate① remains pending.
- Verification-only surfaces: one N06 review target, review boundary assertions, actual Chrome test and Q12 capture in its own `evidence/gate1-q12/` folder at 320/390/1440. CI source/run IDs initially **PENDING**, to be recorded from actual GitHub results; no invented PASS.
- **Next:** obtain actual CI and original Q12 images; inspect Japanese/formula/hint; present only Q12 確認① for user Gate①. Same-root second pass / Gate② OPEN, Gate③ FINAL-REVIEW-NOT-READY; main/hosting unchanged. Sections below retain historical snapshots and are superseded by this checkpoint on current state.
