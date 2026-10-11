# W-MATH-002 / P-001 — 数学学習モードの段階的表示圧縮

Status: PROPOSED
Created: 2026-10-11
Implementation approval: NOT GRANTED
Merge / Settings approval: NOT GRANTED
Target: `rrikunagasige-dot/kyotsu-step-web`, main baseline `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`

## 0. 誤解を排除した目的
**教材本文を短縮・要約・書き直ししない。** 元の文章・穴・選択肢・図・式・導出・教材順序を完全保持したまま、一度に画面上に展開される**既習の長い部分**を縮める。練習モードから借りるのは「現在の対象だけを表示」「必要な過去結果だけを小さく表示」「過去の全文を任意に展開する」という**ソフトウェア設計**である。

## 1. 既存実装の事実
- 練習 `MathPracticeReadingFlow.tsx`: unresolved blank → `currentTarget`; `targetIdForFlowIndex` → `renderedEntries` current-stage only。 `mathPracticeDependencyTargets` と `mathPracticeResultItems` に従い解決済み結論をcompact表示。ユーザーが押すと過去解法全体を再表示。
- `presentation.ts`: `target.id / blankIds / dependsOn / result` が論理依存を明示。`docs/MATH_PRACTICE_MASTER_LESSONS.md` §§12,14,17,18,21 に受け渡し方が明文化。
- 学習 `TextbookUnitPage.tsx`: `firstIncompleteGroup`, `visibleGroups`, `visibleBlocksInGroup` は未来側を制御するが、過去の完了groupを畳まない。`math-sets` は1セクションのcontinuousLessonなので既習文章が累積する。後半のreview候補4単元は公開されていない。

## 2. 提案する学習モードUI（練習モードのコピーではない）

### 2.1 学習ステップの明示的な境界
- 対象は**公開済み数学学習 `math-sets` のみ**でpilotする。
- 小問番号ではなく、既存の読み順と概念・性質・必要な証明・例題の因果順を守る**意味のある学習段落群（learning stage）**を単位とする。
- 現行の大見出し3つだけでは長すぎる可能性がある。見出しを増やしたり教材内容を切ったりせず、既存ブロックIDを用いた**表示専用の細分化**を別metaで宣言する。選択肢・図・式・導出チェーンの中間を切らない。元の`readingFlow`を並べ替えない。
- 穴のない説明blockは「前後の意味に所属するstage」へ明示接続し、解く問題のないstageがロード直後に勝手に完了したことにならないようにする。

### 2.2 現在のstageの表示
- 初学時: 現在の一まとまりは**元の全文、図、式、穴、会話をそのまま**表示。未学習の未来側は従来どおり隠す。
- 穴に正解した直後: 直後に現れる定義・概念の説明・式まで読めるようにして、**自動で畳まない**。
- まとまりの最後の本文を読み終えた後、原則として**一まとまりにつき一回の「次へ」操作**で次stageへ進む（穴ごとの操作追加は避ける）。
- 直前のstageは「完了｜元の見出し/既存概念ラベル｜全文を見る」の**小さな一行カード**に圧縮。ラベルは原教材の既存名称やUI汎用語を使用し、数学本文を要約生成しない。
- 「全文を見る」で元の順序・文字列・解決済み答案・図・導出を完全に再展開でき、閉じれば一行へ戻せる。全体を見直す「すべて展開」も設け、復習を妨げない。

### 2.3 必要な先行知識だけを手元に置く
- 練習の`dependsOn`に相当する**明示的な表示依存**をstageに与える（依存の有無を単なる表示順で推測しない）。
- 現在stageに必要な既習の定義・式・図があるときだけ、「前に学んだこと」行から参照できる。出典ブロックIDに戻り、**元の本文・数式そのもの**を表示する。新たな教材説明文は作らない。
- 既に解決した内容以外を先行知識として表示しない。答え漏洩になる将来の式や確認図は絶対に前倒ししない。依存のない過去全stageを毎回表示しない。

### 2.4 集合の実例・危険回避
既存 `setLesson.ts` の `paragraph-a01`（24の約数の穴）→ `paragraph-set-concept`（集合/要素という概念）→ `formula-set-a`（集合の表示）の流れを保持。穴を正解した瞬間には概念説明が初めて現れるので、その説明を読める状態のままにする。次stageへ明示移動した後で「集合と要素（完了・詳しく見る）」にする。
新しい段落文や解釈は挿入せず、必要なときのみ元の定義と式を再表示。例題、証明、確認のマーカーは展開内で現在と同じ意味・順序で保持する。

## 3. 実装案（明示承認後のみ）
- `src/data/textbook/math/presentation.ts` **新規**: `math-sets`向けの表示専用stage registry。既存 `TextbookReadingBlock.id` で開始・終了境界と参照元を固定。`stageId / sourceBlockIds / dependsOn / referenceBlockIds / titleSourceBlockId` 等のview-only metadataを持つ。文章文字列、正解内容は保存しない。
- `src/components/textbook/MathTextbookCompactReading.tsx` **新規候補**: math-only stage navigation / compact chips / optional prior-content expansion。現在のレンダリング関数 `renderBlock` / `TextbookFormula` / `TextbookFigure` を再利用し、新しい数学rendererを作らない。
- `src/pages/TextbookUnitPage.tsx`: `unit.subject === 'math-1a' && unit.unitId === 'math-sets'` のときだけ表示レイヤーを差し替える**明示的なguard**。progress/answerと段階解放・wrong-answer retryは維持。物理、review四単元、その他の未設定単元は既存表示のまま。
- `src/styles/global.css`, `src/styles/mobile.css`: 完了chip、展開、現在stageのフォーカス・mobile overflow・スクロール位置安定のためのUI限定変更。概念本文は黒字、色は状態/操作のみ。
- `src/data/textbook/math/*Lesson.ts`等の**既存教材原文は0行変更**。既存schema、回答ID、progress key、revision、数式・図の元データも原則変更しない。
- 途中の非interactive blockが重複/欠損しないよう、pilotで各ブロックIDがstageに**一度だけ**属することを検査する。連続 `derivationId` chain は複数stageへ分割禁止。

## 4. Scope / Do Not Touch
許可候補（**まだ承認なし**）: `src/pages/TextbookUnitPage.tsx`; 必要なmath-only表示component; 新しいpresentation metaとそのtests; `src/styles/global.css` / `mobile.css`; `e2e/math-textbook-set-smoke.spec.ts`の回帰ケース; 今回のWork記録。
禁止: `src/data/textbook/math/**`内の**既存** lesson原文・問題・選択肢・定義・図・正解、他4 review単元の表示変更、物理、数学練習、公開範囲、元Word、deploy/lockfile/憲法・辞典・Work OS、旧PR #31/#53/#54/#55、勝手なmain統合。
もし現行schemaや教材本体の変更が必要と判明したら`REVISE-PROPOSAL`し、再承認する。

## 5. 必須QA・成功条件
1. **Source/text identity**: 対象の元の全block/parts/text/latex/itemId/figureIdの列、answer/options/derivationId、および`math-sets` unit revisionのGit blob SHAが原状一致。表示上で開くと全文・式・図の完全再現ができ、重複・欠落なし。
2. **Learning order**: 初回/正答前/誤答/正答直後/次へ操作後/戻って全文展開/リロード/途中再開/全完了。正答直後の概念説明と証明を隠さない。未来の解答を先に表示しない。
3. **Dependency**: 既に解決した必要な既習事項だけが該当stageへ現れる。参照元が正確でクリックで全文へ戻れる。必要な参照の欠落・無関係な表示ゼロ。
4. **Atomic rendering**: 連続式のフレームと`derivationId`、図の出現順、例題/証明/まとめのラベルを変えない。元の例題・図・考え方の数は不変。
5. **Mobile & a11y**: Pixel系mobileとdesktop Chromium、320px級表示で横はみ出しゼロ。開閉の`aria-expanded`、キーボード・戻る、scroll jumpを検証。
6. **Mode isolation**: 数学練習Q87–120・物理教科書第1章・物理練習・review四単元の挙動/公開範囲は不変。既存math textbook unit/integrity/QAを実行。既存E2Eの「過去が常時表示される」前提は、全文展開経路のassertへ更新して同等以上の意味的検証を残す。
7. **Verification honesty**: targeted test/CI・browser実行とユーザー実地レビューを分離。FAILを隠さずWork記録へ。限定pilot成功後でも全学習単元への横展開は別提案・別承認。

## 6. ゲート / 実行順
ASSESS（完了）→ PROPOSE P-001（本書）→ **USER REVIEW / STOP** → 明示承認があった場合だけ独立implementation branchで `math-sets` pilot → 画面レビューリンク → targeted QAと比較 → 必要なら修正案再提出 → 別承認でmain mergeを検討。
P-001に追加・変更条件が付いたときは`REVISE-PROPOSAL` → P-002全文提示 → STOP。`REVIEW-FEEDBACK ≠ APPROVAL`を厳守。

## 7. 承認記録
Status: WAITING
Approved by user: NO
Approval evidence: NONE
Allowed writes now: only proposal-level Work documentation in a separate branch.
