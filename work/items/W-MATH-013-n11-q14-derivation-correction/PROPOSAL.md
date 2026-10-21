# W-MATH-013 / P-001 — N11-Q14 1原問・2つの式中穴による導出修正案
Status: PROPOSED
Created: 2026-10-21
Command: CMD-WORK-001「修正」 (not creation).
Approval status: WAITING — **NOT authorized for learner-code implementation**.
Proposal authoring permission: user 「いいよ続けて」 immediately after the assistant committed to producing a formal N11-Q14 correction proposal.

## 1. 問題 / 原典 / 既存の不具合

原Word N11-Q13で得た不等式をQ14で「同類項を整理して解こう」とする。正本 Word SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`、元Q14のソース位置はN11 p.27–29。現在のアプリ `src/data/textbook/math/numbers/n11Lesson.ts`（review PR #101、Git blob `5afb6870054a69223e2eeddf976bd0d2114d58ce`）は
`x-2\le6x+3` から生徒が完成結果 `x\ge-1` を一度に選ぶ。既存正答は正しく、3誤答も誤り。だが
\[
x-2\le6x+3
\ \Longleftrightarrow\ -2\le5x+3
\ \Longleftrightarrow\ -5\le5x
\ \Longleftrightarrow\ x\ge-1
\]
のうち「両辺からxを引く」「両辺から3を引く」の二つが学習者の操作として可視化されていない。W-MATH-011 Gate② 根本原因R1（複数の意味ある操作を最終回答に圧縮）として確認済み。既存 `docs/MASTER_APP_LESSONS.md` §§7–8,11–12,18,20,51–53、モードSPEC §§5–8とW-MATH-012の承認済みQ11実例を再利用し、教訓追加・改変はしない。

## 2. 1原問・3段階の確定設計（修正はQ14のみ）

**Step 1 — 文字項を右辺に集める：NEW** `n11-wm013-q14-xcoef`
- 前提として `x-2\le6x+3` を本文に示し、「両辺から同じxを引く」とだけ教え、結果の係数を先に言わない。
- 式中穴 `-2\le [choice]x+3`。正答 `5`。誤答 `6`（xを引かない）、`7`（xを加える）、`-5`（係数の符号間違い）。
- 選択後だけ `6x-x=5x` と変形理由を表示。ヒントは「右辺のx係数は6−1」など正答を完成しない根拠への誘導。

**Step 2 — 定数項を左辺に集める：NEW** `n11-wm013-q14-const`
- Step 1 解決後だけ前結果 `-2\le5x+3` を表示し、「両辺から同じ3を引く」と促す。
- 式中穴 `[choice]\le5x`。正答 `-5`。誤答 `1`（-2+3）、`-2`（操作を忘れる）、`5`（負符号を落とす）。
- 選択後に限り `-2-3=-5` と `-5\le5x` を確認させる。未回答の状態で正答数値を先出ししない。

**Step 3 — 最終解の範囲：EXISTING** `n11-14`（stable ID/従来の正誤意味を維持）
- 前段の完成式 `-5\le5x` から、正の5で割る操作と不等号の向きを考え、最後の既存4択で `x\ge-1` を選ばせる。
- **既存正答と誤答をそのまま保持:** `x\ge-1`（正答）、`x\le-1`（反転間違い）、`x\ge1`（符号間違い）、`x>-1`（等号脱落）。選択後だけ必要な最終説明を表示。
- `n11-14` の既回答の正否/履歴は意味が変わらないので再解答を強制しない。ただし新規2ノードは未回答で復元される。

各段階は一つの自然な数学教科書本文・導出として接続し、3つの余計な大見出し・白カード分割を作らない。説明は黒字、色は選択穴/フィードバックのみ。前提全文と選択肢を**同じ長い式ボックスに連結しない**（Q11の320px崩れの教訓）。証明/例題ラベルを勝手に追加しない。最終の式の結果が学習者の入力より先に見えない。

### Q13→Q14→章末の「火柴図」（確認すべき先出しと接続）

`N11-Q13: (x−2)/3≤2x+1 → x−2≤6x+3 (既存の正答を保持)
    ↓
Q14 input x−2≤6x+3
    ↓ [NEW xcoef = 5] subtract x on both sides
−2≤5x+3
    ↓ [NEW const = −5] subtract 3 on both sides
−5≤5x
    ↓ [EXISTING n11-14 answer x≥−1] positive 5 division, no inequality flip
N11 conclusion and transition to N12 unchanged`

原問の求める結果は一つだが、新しい2ノードにより元の計算上の思考を復元する。新しい独立原問を作るわけではない。

## 3. 実装・データ契約（承認後のみ）

1. `src/data/textbook/math/numbers/n11Lesson.ts`：Q14付近だけ。既存 `makeReviewSteps` が生成する `n11-lead-14/n11-formula-14/n11-after-14` の範囲を、Q11の実証済み局所置換方法で「2式中穴→既存Q14完成4択→既存after」の順に再構成。既存 `n11-14` 自体は元の `oldContent.items` から再利用し、中身の正誤は変更しない。
2. Q14の `sourceToItemIds` のみ `'N11-Q14': ['n11-wm013-q14-xcoef', 'n11-wm013-q14-const', 'n11-14']` へ。原Word N11 14原問ラベルは変えない。新規2つの `reviewItem` だけ追加、いずれも明示した正答と異なる3誤答（4 authored choices、表示個数がscaffoldで減る場合は既存仕様を確認）。
3. 新規2 IDの答えが原データと衝突しないようN11 `revision:5→6`。数学教科書8単元の有効導出操作 `134→136`、N11 `21→23`、全8単元の教師原問ラベル123・N11原問14は不変。古い authored distractor 402 + 新規6 = **408**（設計上の予測数、承認後に測定）。
4. `src/domain/textbook.ts`：rev5→rev6の**N11限定**差分migration。旧rev1–rev4利用者は既存の承認済み段階的migrationでrev5へ変換してからrev6へ。全rev5既存ID/回答/正否/回答時刻（`n11-14`、Q11の既存/新規段階を含む）を保持。完了済み履歴 `completedAt` をrev5アーカイブへ移し、過去の完了時刻を `previousRevisionCompletedAt` に残し、rev6の現行完了扱いは新規2ノード未解答の間付けない。`archivedRevisions['5']` を追加し過去1–4を維持。二度の正規化は冪等。**rev6で関係ない旧回答をクリアしない**。
5. 必要な限定テストのみ：`newBatchCoverage.test.ts` / adjacent text persistence tests / relevant Playwright E2E; UI helper・schema・グローバルstyleを変更する必要が出たらいったん止め、改訂Proposalを示す。新規画像生成・Word編集は禁止。

## 4. 数学・誤答候補の独立検証条件

等価な変形は（1）両辺からxを引く、（2）両辺から3を引く、（3）正の5で割る、の3手を独立に証明。選択穴 `5` の誤答 `6/7/−5`、穴 `−5` の誤答 `1/−2/5`、既存最終四択（符号・向き・境界）が互いに異なり全て間違いであることを単体試験+数学監査で確認。前段の答えや将来の完成式を `lead`/図/ヒント/ `after` の誤った順序で提示しない。正誤判定と4候補のKaTeXコンパイルも確認。

## 5. 必須テストと3 Gate（承認後）

- **Unit/source**：N11 14原問→23アイテム、Q14 source map 3、新Q14 2 IDs→答え・誤答6件、Q11 3既存ステージ、N11 Q01–04の既承認9ステージ、Q05–13全原題の答え不変、N14不変、教師Word表現と原図2点のバイト保存。
- **Migration**：旧rev1,2,3,4,5→rev6。旧Q14の既回答、Q11全回答、completedAt/archives維持、新2ステージのみ未回答、rev6初回完了計算、idempotence、不要な全体reset禁止。
- **Behavior/visual**：新2段階+既存最終1段階を、**320pxと390pxの回答前・誤答/ヒント・正答後＝18枚の本当のアプリ画像**でGitHubへ保存。wrong→hint→retry→correct→reload、数式の切れ/二重表示/フィードバック位置/正解漏れなし。Desktopも確認する。old Q14 positive-division final choice remains.
- **Regression**：数学8単元全136操作のスマホ/PC、本来の他数学N12 26 inline穴、数学練習、物理教科書、既存 P-004/P-004-R1 24修正・N11 Q01–04/Q11の受入対象、原図9点・progress保存の独立テスト。CIは**exact code SHA**に結び、GitHub Actionsが成功して初めて技術PASS。
- **Gate①**：Q14の1原問だけ新しいGitHub実画像レビュー票に小番号を付け、ユーザーの `Q14 細部OK` を待つ。**N11 Q01–04/Q11は再承認を求めない**。画像と実コードSHAの一致を検証する。
- **Gate②**：修正後に元Word・数学/誤答・回答漏洩・前後接続・進捗・全旧問・N14の別既知課題を横断再監査。N14 Q07/Q08/Q12は未承認の別Workであり、現時点では未修正。四件全体が閉じるまで chapter `CROSS-VERIFIED` と言わない。
- **Gate③**：最後の全体完了時のみ、release候補SHAと一致するアクセス可能なアプリURL+ユーザーの最初から最後までの全範囲プレイが必要。PR CI PASSやスクリーンショットでは代替不可。main/Pages/Vercel公開は別許可。

## 6. Do Not Touch / stop conditions

対象外：N11 Q01–Q13、N11原図2、N14 Q07/Q08/Q12（独立修正待ち）、N12、旧教師Word、MASTER既存教訓、mode SPEC、既存数学/物理/練習学習状況、他のpublished app、`main`直接更新、draft PR #101無断merge、他公開・課金・CI workflow変更。新しい発見/共有部変更/問題外拡張は停止→`REVISE-PROPOSAL`→ユーザー再承認。

## 7. レビュー / 承認履歴

- Design preparation instruction: user 「いいよ続けて」 on 2026-10-21 in immediate response to making **N11 Q14 formal detailed proposal** (not response to this completed P-001).
- **Implementation approval: WAITING**; no app source edits, no testing of future revision, no fake screenshot.
- One block per approval: after Q14, independently preflight N14 Q07, then Q08, Q12. Each needs its own scoped Proposal and QA, unless user explicitly approves revised grouping.
- Final status before explicit user authorization: **PROPOSED / NOT APPROVED FOR IMPLEMENTATION**.
