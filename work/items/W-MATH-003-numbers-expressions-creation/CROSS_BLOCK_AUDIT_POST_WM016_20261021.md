# W-MATH-003 — W-MATH-016後のGate②横断監査（既存 W-GOV-008/P-003 様式）

Status: CROSS-VERIFIED
Date: 2026-10-21 JST
Scope: 承認済みMathⅠ「数と式」N04/N05/N06/N07/N08/N11/N13/N14（教師Word原問123件）、旧6単元と物理/練習の回帰。本監査は**公開承認やGate③ではない**。
Audit target reviewed app code full SHA: `43ef4fae17b8ce9d0d9eb62358e392c47146cac1` / [PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) はDraft。
Gate① Q12 user reply: **「いいよ続けて」**（直前の実画面18枚の「細部OK/要修正」への直接回答、文言を正確に保持）。これはQ12の視覚受入に限り、アプリ全体の受入ではない。
Previous accepted screenshot: N11（Q01–04/Q11/Q14）、N14 Q07/Q08、R5までの各ブロックを維持。
Previous Gate② canonical audit: [2026-10-20 R5全123問](./CROSS_BLOCK_AUDIT_FINAL_R5_20261020.md)、[51原問](./GATE2_PHASE2_INDEPENDENT_KEY_DISTRACTOR_AUDIT_20261020.md)、[72原問](./GATE2_PHASE3_REMAINING_SOURCE_DISTRACTOR_AUDIT_20261020.md)、[R5追加3問](./GATE2_P004_R5_POST_REPAIR_INDEPENDENT_AUDIT_20261020.md)。
原資料：教師編集Word（212,863 bytes / SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`）。出版社の別冊正答は提供されていない。

## 既存123原問を再利用できる根拠と差分範囲

- 旧R5正本コード `ad77318b37e90b9c39150b14ee706283b3f59355` と現行レビューHEAD `df2e3e381f4887046e23fd701dbe1bc6aaf0e820` をGitHubで比較。N04/N05/N06/N07/N08/N13の6単元は**ファイルblob SHA完全一致**。
- N11原問14件とN14原問16件、各 `makeReviewSteps` 内の `{q:,lead:,expr:,prompt:,answer:,wrong:,hint:,after:}` **原問定義30行を旧R5と完全一致**で確認。ただし、N11 Q03/Q04の**生徒が実際に選ぶ既存ID回答内容**は承認済みW-MATH-011で段階別に再構成されたため、単なるソース行一致を選択肢一致と誤認しない。
- 旧127学習操作＝原問123＋既存N04細分4。追加15学習操作（N11 9操作、N14 6操作）＝現行**142**操作。原問番号は123のまま。
- 旧127組×3＝381誤答候補。**既存N11 Q03/Q04の2組は再構成**されるので、旧組から継承する125組×3＝375件、新規15組×3＋既存2組再構成×3＝51件、総数**426件**。継承375件は旧51＋72原問の実証とGitソース不変確認を根拠とし、変更51件は下表17組を今回再監査した。
- 旧R5コードから現行の変化はN11/N14導出、N11/N14 revision履歴・関連テスト・証拠。元図9点のPNG SHAテストを維持。独立実装CI [#39548305543](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39548305543)と統合後review-code CI [#39549620273](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39549620273)ともに**SUCCESS**。統合後ソースSHA `43ef4fae17b8ce9d0d9eb62358e392c47146cac1`→最新レビュー記録前HEADに至るGitHub diffは44ファイルすべてmd/pngで、教材コード変更ゼロ。

## 現行変更17組・51誤答候補の独立数学検査

| 現行選択操作ID | 正答の独立導出 | 三つの誤答の誤り（著者配列順） | 判定 |
| --- | --- | --- | --- |
| `n11-wm011-q02-compare` | 差=(b+c)−(a+c)=b−a>0なので a+c<b+c | 大小逆／等号誤認／差正なのに大小逆 | PASS |
| `n11-wm011-q03-factor` | bc−ac=c(b−a), 括り出すのはc | −c／c²／1は一般に係数cではない | PASS |
| `n11-wm011-q03-positive` | c>0,b−a>0でbc−ac>0,ac<bc | 差と向きが逆／誤った等号／差の符号のみ逆 | PASS |
| `n11-03` | c<0,b−a>0でbc−ac<0,ac>bc | 正数倍扱い／誤った等号／差の符号のみ逆 | PASS |
| `n11-wm011-q03-zero` | c=0で ac=bc=0、厳密不等号は消える | 厳密不等号保持／大小反転／等号と元の大小保持の矛盾 | PASS |
| `n11-wm011-q04-fraction` | a<bを負の1/5倍すると−a/5>−b/5 | 向き逆／等号誤認／反転理由を正数倍と誤記 | PASS |
| `n11-04` | a<b→−a>−b→3−a>3−b | 向き逆／等号誤認／3+a>3+bは逆 | PASS |
| `n11-wm012-q11-expand` | 3(2x+3)=6x+9 | 定数項の掛け忘れ／x項の掛け忘れ／9を6と誤算 | PASS |
| `n11-wm012-q11-xcoef` | 6x−10x=−4x | 符号逆／6xを無視／加算して16 | PASS |
| `n11-wm013-q14-xcoef` | 6x−x=5x | 引く操作の欠落／加算誤り／符号逆 | PASS |
| `n11-wm013-q14-const` | −2−3=−5 | 1と誤算／元の−2のまま／符号を反転 | PASS |
| `n14-wm014-q07-nonnegative` | a>0,X≥0,|X|<a→0≤X<a | aを含む／外側／負の枝 | PASS |
| `n14-wm014-q07-negative` | a>0,X<0,|X|<a→−a<X<0 | −aを含む／外側／正の枝 | PASS |
| `n14-wm015-q08-nonnegative` | a>0,X≥0,|X|>a→X>a | aを含む／内側／負の枝 | PASS |
| `n14-wm015-q08-negative` | a>0,X<0,|X|>a→X<−a | −aを含む／逆向き／正の枝 | PASS |
| `n14-wm016-q12-left` | x+3≤−2→x≤−5 | −5を除く／不等号逆／定数を−1と誤算 | PASS |
| `n14-wm016-q12-right` | x+3≥2→x≥−1 | −1を除く／向き逆／定数を1と誤算 | PASS |

一般文字式の候補は、偶然の特殊値ではなく、原問で指定された普遍条件・恒等関係として判定。N11-Q04の誤答「正数倍なので反転」は結果式が合っても*要求された理由*が偽であり不正解。N14-Q12は左右の枝を個別に3減算し、端点−5、−1を含み、OR（同時ANDではない）で結ぶ。全17現行IDは教材ファイル内に重複のない `reviewItem` として存在。

## Gate②監査台帳（既存templateの全10面）

| 検証面 | 判定 | 証拠・境界 |
| --- | --- | --- |
| 元Word/原問ID/文章・図の忠実性 | **PASS** | 旧R5独立監査51+72、旧6単元blob不変、N11/N14原問定義30行一致。追加導出は同じ原問内の思考操作で、原問番号追加なし |
| 数学連鎖・前提・導出 | **PASS** | 旧123問の導出監査継承＋上表17組再導出、N11 Q02→Q03→Q04、Q11・Q14、N14 Q07→Q08→Q11→Q12→Q13の接続と各端点 |
| 正答・選択肢の型と誤答 | **PASS** | 旧継承375件＋新監査51件、計426件；142操作は新BatchCoverageの4択/Katex/IDマッピングテストと全実装CI |
| 回答前の先出し・ヒント | **PASS（可読性留意）** | 2枝と証明は回答局所の穴より前に正答を示さず、回答後に連結。旧Q12のヒント「枝どうしは結合しない」は*代数的に連立として結び付けない*趣旨だが、ORで集合として結合することと紛らわしい。Gate①で実画像提示済み、ユーザーは「いいよ続けて」で視覚受入。懸念を削除せず記録し無承認修正しない |
| 元図・値・KaTeX・表示 | **PASS（可読性留意）** | 9 PNG byte-preservation CI、N11/Q07/Q08/Q12実画像と320/390、長文密度・数式直後の本文密着は既知の留意点として保持 |
| 誤答→ヒント→再挑戦→正答、遷移 | **PASS** | 全142正解経路＋変更対象の誤答経路、320/390の正答後/reloadを含むMath CI #39548305543 と #39549620273 SUCCESS |
| 共通UI・数学/物理/練習モード | **PASS** | Math CIにビルド、数学旧6単元、Physics Textbook、Math Practice回帰あり。共通UIコード無変更。全subjectの独立完全検証は本Work対象外 |
| 320/390スマホ・desktop | **PASS** | 実アプリQ12 18PNG、N11/Q07/Q08実画像と旧R5証拠、Playwright mobile/desktop、スクロール/KaTeXエラー検査 |
| 保存/移行・既存回答・reset | **PASS** | N11/N14 revision1–6段階履歴・旧回答保持・新回答だけ未回答、冪等性、reload/playwright、他単元のprogress非破壊 |
| 以前の承認済み修正保護 | **PASS** | 旧6単元完全一致、原問N11/N14 30定義一致、承認済みN11/Q07/Q08とR5以前のGate①維持。PR #101はDraft、学習者コードの無断変更なし |

## §12B correction-first と教訓閉鎖

原因：原典が求める導出が単一の最終選択肢で省かれる（R1）／回答前の説明が生徒の判断を先に出す（R2）。承認済みWork W-MATH-011～016各Proposalに限定して修正済み。旧R5監査の全原問・誤答の結果は変更箇所だけ再点検。承認済みの他モードはソース差分0＋回帰PASS。今回確認した範囲で新たな**数学・原典不一致の確定欠陥なし**。Q12表現の曖昧さ・長文密着は既存Gate①に開示して受入済みの注意事項として保持し、改善するときは承認付き別CMD-WORK-001へ戻す。

共通教訓は既存 `governance/WORK_SYSTEM.md` §12A/12B、既存原典監査とMaster教材原則に存在。重複する新しい命令やMASTER改変は行わない。修正のない別Workを無断で開始しない。

## Gate②閉鎖とGate③の区別

- [x] 上記10必要面の現在の限定監査PASS、完全SHA、テスト・実画像・元Word監査記録へのリンク有
- [x] 旧承認とQ12 Gate①ユーザー原文を記録
- [x] 旧監査123問/381件と現行追加・再構成の差分を過大計上せず再監査
- [x] §12B根本原因と既存教訓の重複照合、無承認修正なし
- [ ] **Gate③は別工程**：実際に起動できる**同じSHA**のアプリURLを確認し、ユーザーがアプリ全体を最初から最後までプレイして`総チェックOK`を伝えるまで `FINAL-REVIEW-NOT-READY`。PR・GitHub画像・古いPages・SHA不明previewは代替不可。
