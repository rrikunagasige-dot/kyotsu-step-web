# N05 Q18 — 実アプリ Gate① 確認①（誤答ヒント）
**Work:** W-MATH-024 / approved P-001  
**Status:** BLOCK-CHECK-PENDING（ユーザー細部確認待ち）  
**Source/actual browser SHA:** `7112121f1976c5d3ddb10e32c81ced665c9bd958`  
**Immutable 18-photo GitHub storage commit:** `3728e9a3cdd23f360bec9f2205a150c62bae285b`  
**Actual successful action:** [#39796060750](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39796060750) — Review Code Check + real N05-Q18 Chromium screenshot job both SUCCESS, using the exact source SHA above.  
**Widths:** 320px / 390px / 1440px, authentic numbered and ordinary lesson, normal/before/wrong/retry/completed states, with Noto CJK JP font installed.  
**Unit:** N05 revision 2 / 20 Word question markers / 20 graded choices; original figures and older user progress untouched.  
**CI result:** Full math textbook [#39797852305](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39797852305) **SUCCESS**, governance [#39797851985](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39797851985) **SUCCESS**, review [#39797852142](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39797852142) **SUCCESS**, all at `5d9be0e0ba53a3d29cecb37b4c377a57a3acc28a`. Screenshot-source student code is byte-identical. Visual Gate① response remains pending. Gate② blocked by independent sibling findings.

## 今回確認するのは N05 Q18 のヒント1文だけ

誤答したとき、正解の `r=-1,s=3` を直接教えず、誤った候補 `r=1,s=-3` で二条件を照合する方法を説明するように直しました。

**確認① 320px — 本物の実アプリで誤答したとき**

![320px real GitHub browser wrong-only hint](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/3728e9a3cdd23f360bec9f2205a150c62bae285b/work/items/W-MATH-024-n05-q18-hint-leak/evidence/gate1/wm024-q18-review-wrong-320.png)

**確認① 390px — 誤答後、選択肢とヒント**

![390px real GitHub browser wrong-only hint](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/3728e9a3cdd23f360bec9f2205a150c62bae285b/work/items/W-MATH-024-n05-q18-hint-leak/evidence/gate1/wm024-q18-review-wrong-390.png)

**正答後 — 既存の答えは一切変更していません**

![390px real completed answer](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/3728e9a3cdd23f360bec9f2205a150c62bae285b/work/items/W-MATH-024-n05-q18-hint-leak/evidence/gate1/wm024-q18-review-complete-390.png)

[通常学習320pxの誤答画像](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/3728e9a3cdd23f360bec9f2205a150c62bae285b/work/items/W-MATH-024-n05-q18-hint-leak/evidence/gate1/wm024-q18-normal-wrong-320.png) ／ [通常学習1440pxの正答画像](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/3728e9a3cdd23f360bec9f2205a150c62bae285b/work/items/W-MATH-024-n05-q18-hint-leak/evidence/gate1/wm024-q18-normal-complete-1440.png) ／ [固定コミットに保存された全18枚](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/3728e9a3cdd23f360bec9f2205a150c62bae285b/work/items/W-MATH-024-n05-q18-hint-leak/evidence/gate1/README.md)

**ユーザー返信:** この確認①だけを見て `細部OK` または `要修正`。  
修正済みのN13 Q05/Q08は再承認不要です。Q18の細部了承は、Gate②の独立横断監査・Gate③の全アプリプレイ・N14 Q16の未完確認、PRマージ・公開許可とは別です。

## Exact trace for auditor
- [x] One approved literal hint replacement in `src/data/textbook/math/numbers/n05Lesson.ts`; return new hint to old string and source equals parent SHA `f15de2c1073b5bbb24b9e5253fd3df901d1a729f`.
- [x] Native Q18 320/390/1440 review + normal browser workflow SUCCESS at source SHA `7112121f1976c5d3ddb10e32c81ced665c9bd958`; screenshots are in pinned immutable commit `3728e9a3cdd23f360bec9f2205a150c62bae285b`.
- [x] Visually inspected 320px actual new hint and 390px success; Japanese text readable, distinct red ×, no leaked right pair in hint text.
- [x] Source `7112121f1976c5d3ddb10e32c81ced665c9bd958` → latest evidence/doc branch change excludes learner code, CSS, migrations, and E2E code; all learner source hashes match.
- [ ] Human `細部OK` / `要修正`.
- [ ] Independently final CI status as of current exact branch, §12B second pass Gate②, app Gate③.
