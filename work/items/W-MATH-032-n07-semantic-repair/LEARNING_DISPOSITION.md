# 原評価・回帰・モデルの扱い

- 原六指摘は元の否定例として保持する。修正後artifactへの評価と混同しない。
- P-001承認は設計の承認。修正教材の人間による肯定評価には変換しない。
- N07の見やすさに関する既存肯定例は、その観点だけを保護する。内容全体の合格へ拡張しない。
- 今回の決定的な検査は、文脈投影、操作語の文中挿入、倍率の最小条件、等式group、定義語、math/termの描画対応へ結ぶ。
- モデル不在時の参照はSCOPED_CATALOG、ranked=false、modelRan=false。元六指摘は必須入力である。
- 今回はfit・モデル昇格をしていない。OFFLINE_ONLYを維持する。
- 実画面/公開検証後に元caseへrepair evidenceとregressionRefを追記する。ユーザー受入は別途、その対象・版・観点付きで記録する。

2026-10-25 actual acceptance: 原発言に基づくN07全体の肯定1件を追加。R08/L01実行、評価済み10件（否定7・肯定3）。固定encoderで全入力を特徴化し、既存layout_discomfort headを2例で再fit。overall_material_acceptanceは正の1例のみのためheadを作らない。131 workflow/11 corpus tests。モデルOFFLINE_ONLY、未知教材評価なし。
