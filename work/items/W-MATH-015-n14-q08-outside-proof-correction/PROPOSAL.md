# W-MATH-015/P-001 — N14 Q08「|X|>a」の外側一般式を導出する
Status: APPROVED
Updated: 2026-10-21
Command: CMD-WORK-001「修正」
Implementation approval: APPROVED for unchanged exact W-MATH-015/P-001 by user 「いいよ」; no main/hosting approval.

## 1. 原典と不具合の厳密な範囲

教師編集原Word `01_数と式_教科書モード_対話段階導入版_v2` (212863 bytes; SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`)。N14 Q08は前問Q07の「内側」と対比して、`a>0` のとき任意の実数`X`に対する `|X|>a` の一般規則を導く「導出」段階。

既存ソース `src/data/textbook/math/numbers/n14Lesson.ts`（blob `b8b0148c5abb0e99c95d4352b0549fe19a63110a`、N14 revision4）は、完成解答を1つ選ぶだけ。元 `n14-08` の正解 `X<-a\;\text{または}\;X>a` と3誤答 `-a<X<a` / `X\le-a\;\text{または}\;X\ge a` / `X<-a\;\text{かつ}\;X>a` は数学的に正しく区別されているので変えない。現在の「外側」直観だけでは、符号別の厳密な導出と「または」「かつ」の区別を生徒が実際に考えていない。W-MATH-011独立監査で**R2 general proof gap CONFIRMED**、象徴的な正答漏洩ではないと確認済み。

参照権威：Constitution、CMD-WORK-001「修正」、WORK_SYSTEM §§11/12A/12B/12C、MASTER_APP_LESSONS既存節、Mathematics Textbook SPEC §§5–8。ルール・教訓の新設なし。

## 2. 数学の全導出（省略禁止）

`a>0`、`X∈R`。
**順向き**：`|X|>a` を仮定する。
1. `X≥0` のとき `|X|=X`。よって `X>a`。`a>0` だからこの条件は自動的に `X>0` を含む。
2. `X<0` のとき `|X|=-X`。よって `-X>a`。両辺に`-1`を掛けると不等号の向きが変わり `X<-a`。`-a<0` なので確かに負の枝である。
3. 実数Xは上のどちらかに属するので、全解は両集合の**和集合（または）**：
\[
(X<-a)\ \text{または}\ (X>a).
\]
両方を同時に満たす「かつ」は不可能。境界`X=\pm a`は等号がないため含まない。`X=0`も`|0|=0`で満たさない。

**逆向き**：`X>a`なら`X>0`で`|X|=X>a`。`X<-a`なら`X<0`で`|X|=-X>a`。いずれか1条件を満たせば元の絶対値不等式を満たす。したがって
\[
|X|>a\quad\Longleftrightarrow\quad(X<-a)\ \text{または}\ (X>a),\quad a>0.
\]

## 3. 1原問Q08の3操作（2つ新しい穴 + 元の4択）

現在の「距離の規則を一般化する」/「導出」見出し、本文は黒字、穴とフィードバックだけ機能色を使用する。図は追加せず、3枚の過剰な白カードも作らない。式と選択肢が320pxで横切れしないよう局所的な選択部分を用いる。

**Step① 非負の枝（NEW）** ID `n14-wm015-q08-nonnegative`。提示：`|X|>a, a>0, X≥0, |X|=X`、求める「この場合のXの条件」。式中選択の正答 `X>a`。誤答 `X\ge a`（等号混入）、`0\le X<a`（内側誤認）、`X<-a`（負の枝との混同）。ヒントは「絶対値は外すとXのまま、元はより大きい」とし、**完成答えを先に出さない**。正答後だけ `|X|=X>a` を示す。

**Step② 負の枝（NEW）** ID `n14-wm015-q08-negative`。提示：`X<0, |X|=-X, -X>a`、負数倍で不等号反転することを考えさせる。式中選択の正答 `X<-a`。誤答 `X\le-a`（等号）、`X>-a`（反転忘れ）、`X>a`（別の枝）。ヒントは「−1倍は不等号を反転」とし、答えを完成形では表示しない。正答後だけ `-X>a\iff X<-a` を説明。

**Step③ 元の最終Q08（EXISTING）** stable ID `n14-08`。両枝の導出結果を踏まえて「どちらかを満たせばよい」を判断し、元の選択肢を**一字一句変更せず**表示。正答 `X<-a\;\text{または}\;X>a`。誤答3件も上記§1のまま。回答**後だけ**逆向きの数学証明を追加し、「かつ」が成り立たない理由を説明。元の説明も維持する。

**火柴図**：
`N14 Q01–Q06 数直線例・元図 n14-f01 → N14 Q07「内側」符号別2穴＋元の結論（修正済み、Gate①ユーザー未確認）
→ N14 Q08 導出開始 |X|>a
→ [NEW: X≥0 → |X|=X → 生徒がX>aを選択]
→ [NEW: X<0 → |X|=-X → 生徒がX<-aを選択]
→ [EXISTING n14-08: X<-a または X>aの最終4択]
→ [回答後: 逆向きの証明・境界と論理和の確認]
→ N14 Q09以下は全維持、Q12は別R1修正待ち`

## 4. 承認後だけの実装・データ範囲

- `src/data/textbook/math/numbers/n14Lesson.ts` のQ08生成範囲`n14-lead-08 / n14-formula-08 / n14-after-08`のみ、Q07で検証された局所差し替え方法を再利用。元の`n14-08`の正答・3誤答、Q07本体、後続Q09～Q16には触れない。
- Source map `N14-Q08` のみ `['n14-wm015-q08-nonnegative','n14-wm015-q08-negative','n14-08']`。元の原問ラベルN14 Q01–Q16は16件のまま。N14学習操作**18→20**、8単元合計**138→140**（設計上の予測値）。
- `src/domain/textbook.ts` のN14だけrevision**4→5**。以前のv1/v2/v3は承認済みの順次移行を通してv4に正規化してからv5にする。元の`n14-08`を含む旧回答・正誤・時刻、Q07で追加された2操作の履歴を**そのまま保持**し、v4状態を`archivedRevisions['4']`に格納。旧完了時刻は`previousRevisionCompletedAt`として残し、新2操作が未回答ならv5を完了扱いにしない。冪等・全体リセット禁止。
- 隣接テスト`newBatchCoverage.test.ts`で数学・誤答6件・厳密な端点・論理和と逆向きの証明・保存履歴・未回答時正解非漏洩を検査。既存の`e2e/new-batch-walkthrough.spec.ts`内で320/390px誤答→ヒント→再挑戦→正答→再読込を検証。既存の非公開スクリーンショットWorkflowを変更せず利用する。
- 共通レンダラー、schema、global styles、CI workflowの変更が必要ならSTOPし改訂Proposalを提示、追加承認まで実装を進めない。

## 5. 必須検証・Gate

数学：一般`a>0`、`X=-a,0,a`および外側・内側の試験値、両向きの証明、OR≠AND、6新規誤答＋元の3誤答の分類、KaTeXを独立確認。
原典：16原問、N14計20操作、8単元合計140、旧Q08選択肢・Q07・図PNGと承認済みN11の保持。
進捗：N14 v1/v2/v3/v4→v5、アーカイブ・回答時刻・Q07履歴の保持、追加2ノード以外を不用意に再回答させない。
実画面：3操作×2幅(320/390)×3状態＝**本物の18枚**、横切れ、先出し、誤答ヒント、回答後逆証明、PCと他モードの回帰、実GitHub Actionの厳密なSHA対応。
Gate①：**Q08だけ**新しい実画面をユーザーが細部承認する。Q07 Gate①は**まだユーザー未確認**。既承認のN11も再確認不要。
Gate②：Q07・Q08の根本R2と別件Q12/R1、全原問の数学・文章・表示・進捗の横断監査。未完ならCROSS-VERIFIED禁止。
Gate③：最終候補と同一SHAの実働アプリURLでユーザーが全範囲プレイし判断。CI/画像では代替不可。

## 6. Do Not Touch・§12C独立性・停止条件

元Word、N14 Q01–Q07（特に修正済みQ07 Gate①未承認）、Q09–Q16（特にQ12別修正）、元図`n14-f01`、N11 Q01–Q04/Q11/Q14承認済み内容、数学練習・物理・共通レンダラー・schema・style・マスターレッスン・憲法・main・PR #101のmain統合・公開・課金・資格情報は変更禁止。

CI待ちPrimary A = W-MATH-014/P-001 Q07（撮影コードSHA`e42356de0b01a314e3e39779de1ab98a57f4f85b`、画像コミット`50465039632687ab1891687678a85b10904c9276`、Gate①実画面票記録`4aa7d38c05dde2c060b979868258967948fe9be9`、人間受入PENDING）。Secondary B = W-MATH-015の**原典/数学/Proposalドキュメント作成のみ**、独立`proposal/W-MATH-015-n14-q08-outside-proof-20261021` branch。Q07とQ08は同一`n14Lesson.ts`及びN14 revisionを共有するため、Bの**実装は現在のAと競合**する。Q07状態を固定・確認し、Q08の明示的承認後にのみ別の新しい実装ブランチで進む。Q07の不具合・CI不整合が発覚したらQ07を優先する。

## 7. 承認境界・未完

今回のユーザー指示は、待機運用違反の指摘と「作業続て」であり、§12Cの範囲内で既知のQ08原典監査・**提案書作成**を進める許可として扱う。新しいQ08教材コードの実装許可ではない。本P-001は承認待ち。原典は教師編集WordとW-MATH-011独立監査に基づく。出版社別冊解答は未提供。PR #101はDraft、公開用mainは別で変更しない。

## 9. Latest user approval (2026-10-21)
User replied exactly 「いいよ」 to the previous assistant's dual pending decisions: Q07 visual Gate① and W-MATH-015/P-001 Q08 implementation. Q07 acceptance was separately recorded at review-only commit `0841561265b95576fcfc84570fea9eaf2ef24488`, then an isolated Q08 branch was created from that verified base. The full exact Q08 proposal is approved ONLY for Q08 sign-case branches + stable old `n14-08` final, N14 rev4→5 selective migration and bounded tests. Old WAITING clauses above are historical provenance; current status APPROVED. Q12 still requires a different approved proposal. No approval to merge PR #101 into main or deploy.
