# N13 Q08 — 実画像 Gate① 確認①〜③

Work: W-MATH-023 / P-002 Stage B（N13 Q08 のみ）  
**Status: BLOCK-CHECK-PENDING — User visual confirmation not yet received**  
**Learner code exact SHA (Chrome actually operated):** `f5c0b2934ae1682a63f36401386d4bb24084c06a`  
**Immutable screenshot storage commit (15 PNGs):** `43fb15e835c008d69cc5606612dbd26bbbc28185`  
**Original Word:** N13-Q08 `|3x|=6`; 9 original source problems, revision4, 12 grading decisions.  
**Browser proof:** [GitHub Actions #39782844611](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39782844611) and correct-path screenshot run [#39782844611](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39782844611); actual final corrected recording uses source SHA `f5c0b2934ae1682a63f36401386d4bb24084c06a`. Noto CJK JP, real Chrome 320/390/1440, normal + isolated review, wrong→hint→retry, reload and no horizontal clipping: PASS. 
**Global CI status:** Separate Math textbook full-suite CI found a revision3 fixture reference (fixed), and legacy Q08 two-line check (fixed); an *unrelated math-set keyboard accessibility regression check* has not yet passed. Current re-run is IN PROGRESS. This review image sheet is Stage B small-block visual only, NOT independent Gate② or total app success.

## 今回、ここだけ見る

### 確認① — 絶対値を外す

`|3x|=6` の中身を、正・負の二つの等式に分ける。**最初は答えを先に表示しない**。

![Q08 review genuine before 390px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/43fb15e835c008d69cc5606612dbd26bbbc28185/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1-q08/wm023-q08-review-before-390.png)

### 確認② — 正の枝を解く

`3x=6` の係数3を使って、`x=2` を求める。最初の判断を解いた後にだけ現れる。

### 確認③ — 負の枝を解く

`3x=-6` から `x=-2` を求め、最後に「または」で二解を結ぶ。**320pxで切れずに読めるか**を確認。

![Q08 review genuine complete 320px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/43fb15e835c008d69cc5606612dbd26bbbc28185/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1-q08/wm023-q08-review-complete-320.png)

[誤答したときのヒント（390px）](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/43fb15e835c008d69cc5606612dbd26bbbc28185/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1-q08/wm023-q08-review-wrong-390.png) ／ [通常学習・完成後（1440px）](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/43fb15e835c008d69cc5606612dbd26bbbc28185/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1-q08/wm023-q08-normal-complete-1440.png) ／ [実画像15枚の一覧（固定コミット）](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/43fb15e835c008d69cc5606612dbd26bbbc28185/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1-q08/README.md)

**返信方法:** 画像の**確認①〜③**だけに対して `細部OK` または `要修正（番号と理由）`。

この段階の承認はQ08の視覚・文章の細部だけ。N13 Q05はすでに承認済みで再承認不要。別WorkのN14 Q16 Gate①、全体Gate②、実働アプリGate③、mainのマージ、公開・追加費用は承認されていない。

## Evidence notes

- [x] Frozen SHA matches actual Q08 browser run and the 15 screenshot blobs in immutable Git commit; no user-facing Q08 source difference across later commits (only test/evidence changes).
- [x] Actual Japanese and numerical glyphs manually checked at 320/390px. After final full solution, sentence delimiter was corrected in the frozen screenshot source.
- [x] Original Q05 Stage A derivation blocks and items byte-identical to their accepted state.
- [x] Q08 has exactly 3 independent answer nodes (two branches, positive root, negative root) and distinct wrong-only hints. Real Chromium Gate① screenshot test PASS.
- [ ] Q08 user `細部OK` / `要修正` response.
- [ ] Independent global Gate② and playable Gate③, held apart from visual review. Math-set keyboard check is currently NOT PASS; record without concealing it.
