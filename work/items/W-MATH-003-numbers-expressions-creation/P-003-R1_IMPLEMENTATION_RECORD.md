# W-MATH-003 / P-003-R1 — 承認済み8単元の一括制作・検証記録

Status: **IMPLEMENTED ON INDEPENDENT DRAFT BRANCH / USER CONSOLIDATED IMAGE REVIEW APPROVED / FULL APP WALKTHROUGH PENDING**  
Date: 2026-10-19 UTC  
Command: 最新ユーザー指示「N04〜N14は途中の個別承認で止めず、全部作成し最後に一括確認」。辞書 CMD-WORK-001「修正優先」の既存未解決事象照合後、承認済み W-MATH-003/P-003-R1 の CMD-WORK-002「作成」を実行。ユーザーによる新提案は出していない。

## 正本と権限の確認
- Canonical target: `rrikunagasige-dot/kyotsu-step-web`, repository ID `1391122224`; NOT upstream `paulfields83/`.
- Starting main HEAD: `537c3cbf28d40f45228d8a0c4bdd20327136aa93`, unchanged by this work.
- Isolated branch: `work/W-MATH-003-p003-r1-n04-n14-batch-20261019`; [draft PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101).
- Source: user teacher-edited Word `01_数と式_教科書モード_対話段階導入版_v2(2).docx`; 212863 bytes; SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`.
- Source design/reference: `N04_N14_SOURCE_SOLUTION_AUDIT.md` (123 independent solutions), `N04_N14_LEARNER_DESIGN_MAP.md` (39 cognitive groups), Constitution / instruction dictionary / math textbook master/spec.
- Original textbook author's independent answer booklet and publication rights are **not** supplied; these are review-only teacher-source-derived explanations.

## 原問 → 新しい学習操作 / 原図（実装範囲）

| 単元 | 原資料マーカー | 選択ステップ | 原図 | 認知操作の中心 |
|---|---:|---:|---:|---|
| N04 | 22 | 26 | 1 | 展開／乗法公式 |
| N05 | 20 | 20 | 2 | 共通因数／たすき掛け |
| N06 | 16 | 16 | 0 | 置換／整理する文字 |
| N07 | 14 | 14 | 0 | 有限・循環小数／有理数 |
| N08 | 12 | 12 | 1 | 絶対値／符号判断 |
| N11 | 14 | 14 | 2 | 一次不等式／端点 |
| N13 | 9 | 9 | 2 | 絶対値方程式 |
| N14 | 16 | 16 | 1 | 絶対値不等式 |
| **合計** | **123** | **127** | **9** | **原問漏れなし** |

- N04-Q01の原4積＋完成式（5操作）は以前の独立ブランチからそのまま引継ぎ、Q02〜Q22を追加。これが原問123に対して操作127になる唯一の理由。
- 原図は元Wordの `image2/3/4/5/7/8/12/13/14.png` を**バイトのまま**利用。N05完成たすき掛け図はQ15後、N11完成数直線はQ10後、N13左右位置図はQ01後、N14範囲図はQ06後に出す。
- N05 Q14の元Word表のA/B/C候補（図とは別の表）も数式3本として明示。途中の答えを図で先出ししない。
- 既存3つのテーマカードは維持し、短い見出し2〜3本の配下に N01–06／N07–10／N11–14 を配置。以前に受入済みの N01/N02/N03/N09/N10/N12 の教材内容と保存IDは変更しない。
- 新規8単元はいずれも `status: review`、main/本番には昇格していない。

## 技術・数学の検証と証拠
- 原問123件からインタラクションIDへの完全対応（N04-Q01のみ5操作）、4択重複検査、全KaTeX文字列、元画像9 SHA-256、答えを含む図の後出し配置を `newBatchCoverage.test.ts` で検証。
- N04-Q22の四次展開、N06-Q04/Q12/Q16の因数分解、N07-Q12の2と5だけの分母7候補は別途独立数値チェック。
- Android/iPhone相当のmobile Chromiumとdesktop Chromiumで8単元の**全127操作を自動解答**し、最後の完了状態、端末幅、再読込後の保存と画像の読み込みを確認。
- 実アプリを触って生成したスクリーンショットは [8単元一括確認ギャラリー](./evidence/n04-n14-gallery/README.md) に保存。画面の再現コードSHAはスクリーンショット作成コミットの親コミットから追跡可能。
- [Math textbook CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39252161669), [Repository governance](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39252161600) 等で schema/typecheck/build、N01/N03/N12等の既存回帰、physics/practice、実機相当E2Eを継続確認。最終のexact SHAとgreen runはGitHub Actions上の最新結果を参照。

## 受入ゲート（混同しない）
1. 内部の原文・数学・UI・運用横断検証：全件実行／最新CI最終結果を確認。
2. **細部一括チェック：ユーザー承認済（2026-10-19 JST）。** GitHubの確認①〜⑧一括ギャラリーを案内し、陸君は「結構いいぞ。承認する！」と回答。これは8単元の画像に基づく一括細部承認であり、アプリ全体の実操作承認、公開承認、main統合承認ではない。
3. **実際に動くアプリ全体の総チェック：未実施・次の受入ゲート。** exact candidate commitで最初から最後までplayするためのアプリリンクが別途必要。新しい公開環境・Vercel環境の作成権限はないため、画像ギャラリーを本物のアプリURLと偽らない。

`main`への統合・本番公開・新公開環境・既存Vercelの削除・課金はすべて**未承認**。無断で実行しない。
