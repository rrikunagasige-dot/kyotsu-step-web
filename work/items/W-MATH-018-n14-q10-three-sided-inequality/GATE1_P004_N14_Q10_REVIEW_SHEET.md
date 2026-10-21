# W-MATH-018/P-004 — N14 Q10 実画像・細部確認票

Review: W-MATH-018 / P-004（user-approved 2026-10-22）  
Status: **Gate① USER `細部OK` / `要修正` PENDING**  
Block: `N14-Q10`, `n14-q10-chain`, `n14-formula-10`, `review-mark-n14-formula-10`  
**実アプリ描画・検証コードの完全SHA:** `f058ec38a6e21f2925fc4535c34d0c741f356046`  
**画像保存だけのコミット:** `044525020a58394361f2fb0a3be711b617b781a5`  
スクリーンショットは GitHub Actions [#39643764980](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764980) により、上のコードSHAを実際にビルドしてChromiumで取得しました（320/390/1440、レビューと通常計6ケースPASS）。[Math Textbook full CI #39643764939](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764939) SUCCESS、[Math Practice regression #39643765326](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643765326) SUCCESS、[Repository Governance #39643764970](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764970) SUCCESS。

## 今回ここだけ確認：N14 Q10のスマホ第2式と従来の穴デザイン

**確認① — 320px、回答前。** 長い第2式を2つの**視覚行**に折り返し、`-5+`、`<x-3+`、`<5+` と3つの青い「選択」が右端まで見えるか。

![実アプリ320px確認①、3つの青い選択と第2式の2視覚行](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/044525020a58394361f2fb0a3be711b617b781a5/work/items/W-MATH-018-n14-q10-three-sided-inequality/evidence/p002-gate1/p002-review-1-before-320.png)

**確認② — 320px、誤答後。** 左の穴は従来どおり赤い「×」となり、残りの穴も従来の青い「選択」のままで、縦横の並びが崩れないか。

![実アプリ320px確認①、誤答で赤い×](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/044525020a58394361f2fb0a3be711b617b781a5/work/items/W-MATH-018-n14-q10-three-sided-inequality/evidence/p002-gate1/p002-review-1-wrong-320.png)

**確認③ — 320px、後半。** 三辺同時の足し算を答えた後に説明が現れ、第3式の左右2つの穴も自然に読めるか。式は論理的に3つ・説明1箇所・生徒の採点操作5つのままです。

![実アプリ320px確認②説明と確認③左右境界](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/044525020a58394361f2fb0a3be711b617b781a5/work/items/W-MATH-018-n14-q10-three-sided-inequality/evidence/p002-gate1/p002-review-4-before-320.png)

[通常学習画面320px（黄色い確認枠なし）](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/044525020a58394361f2fb0a3be711b617b781a5/work/items/W-MATH-018-n14-q10-three-sided-inequality/evidence/p002-gate1/p002-normal-left-before-320.png) ／ [確認専用390px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/044525020a58394361f2fb0a3be711b617b781a5/work/items/W-MATH-018-n14-q10-three-sided-inequality/evidence/p002-gate1/p002-review-1-before-390.png) ／ [PC1440px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/044525020a58394361f2fb0a3be711b617b781a5/work/items/W-MATH-018-n14-q10-three-sided-inequality/evidence/p002-gate1/p002-review-1-before-1440.png)

> **画像ファイル名について:** 保存先の `p002-*` は既存GitHub Actions画像ワークフローの古い名前ですが、ここで貼った画像は **P-004修正適用後の上記コードSHA** から撮影した実物です。過去のP-002の失敗画面ではありません。上記の画像blobは実際に照合しています。旧P-001/P-002/P-003の不合格証拠は削除せず別に残しています。

**ユーザー返信：** ChatGPT上で `細部OK` または `要修正：確認①の…`。過去承認済みN11 Q05〜Q09・Q13、N14 Q07・Q08・Q12は**再承認しません**。この返信は小ブロックの視覚合否のみであり、Gate②横断監査やGate③ SHA一致実働アプリ全体プレイ・`総チェックOK`、main/Pages公開許可を意味しません。

## Evidence / agent ledger

- Original N14 Q10 math 3 logical equations / 1 short explanation / 5 graded values `3,3,3,-2,8`: same approved P-001 unchanged, original N14 16 source marker IDs retained.
- P-003 original full-size formula choices and 2-visual-line mobile grid preserved; P-004 touched only `src/review/review.css` Q10 numbered confirmation wrapper padding-inline `.4rem` under 430px.
- Original actual 320 marked review deficiency (216px needed / 213px available) at P-003 SHA `98de588ec...`; new genuine test PASS, all six source parts and each active button measured inside visible formula on 320/390.
- Gate① screenshot+SHA verified and available. **User visual acceptance PENDING.** Gate② overall NOT CROSS-VERIFIED: Word OMML fidelity and N14 Q14/Q15 separate source-cognition risks still open. Gate③ FINAL-REVIEW-NOT-READY. Draft PR #107 unmerged, main and published app unchanged.
- [P-004 exact proposal](./PROPOSAL_P004_Q10_REVIEW_FRAME_MOBILE_FIT.md) | [Action log](./ACTION_LOG.md) | [Verification](./VERIFICATION.md) | [PR discussion mirror](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107#issuecomment-6322494573)
