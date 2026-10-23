# W-MATH-027 — 現在地（2026-10-24 JST）

Status: VERIFYING / Gate① visual accepted; Gate② not passed / N02 proposal pending
Work execution: W-MATH-027-P001-R1
Source branch: work/W-MATH-027-workflow-resume-20261024
Frozen candidate: f3c69618d5f97cf235d2f0d0d9256f33056e9525

最新の「いいよ。」で固定P-001-R1四ファイルの実装を承認。適用、CI、実画像9枚の確認、修正事例の学習取込まで実施済み。確認①への「いいよ。次は何？」を視覚確認として記録済み。現在は[Gate②所見](GATE2_P001_R1_AUDIT.md)のFAIL/UNVERIFIEDが残り、[N02本文の具体案](p002-n02/PROPOSAL.md)を提示する段階。実装承認を細部OKや総チェックOKへ転用しない。

[生成された現在地](workflow-p001-r1/generated/CURRENT_POSITION.md)と[火柴図](workflow-p001-r1/generated/FIRE_DIAGRAM.md)は追記イベント台帳から生成。G1_VISUALは通過、G2_AUDITは未通過、アプリ受入はfalse。

main未統合・未公開。教材の推導・図・選択肢・文章設計など元の指摘はAUDIT_FINDINGSとSOURCE_AUDIT_LEDGERに保持し、今回の見出し修正と区別して継続する。

## 以下は当初の調査・保留時点の履歴

# W-MATH-027 — 数と式の3テーマ復元と教材設計の再監査

Status: PROPOSED
Command: CMD-WORK-001「修正」
Date: 2026-10-23 JST
Branch: work/W-MATH-027-three-theme-pedagogy-repair-20261023

## 現在地と権限

公開候補ソース171c04781f32c1286a0762905891b582714834f9に対し、ユーザーが画像10枚とともに「修正命令」「最優先は3タイトル、第四も統合」「残る二つも同種問題を探す」を指示。調査・影響監査・提案作成の権限。新しいexact修正案の承認はまだないため、教材・公開版は未変更。

live main: e907bf5fc22025fbd74127b9b72176b90aaeb36e（配信workflow変更のみ）。教材はmainではなく上記候補SHA。教材基準3055ed71b25057b80b85d46b1d219f1005d0a35dとの違いは保存キーの環境指定のみ。

Gate③: NEEDS-FIX。総チェックOKは未取得。従来の全章CROSS-VERIFIEDを教材設計合格の根拠として維持しない。過去の正答・構文・操作・寸法検査の成功記録は履歴として保持。影響を受けたブロックは再検証・再レビューが必要。関係しない承認を一括で破棄しない。

## 優先順

1. P-001：承認済み3テーマの復元、NE01/NE02の内容を適切なテーマへ統合、導線・集計・接続文の整合。
2. 最初のテーマ「式を整える」：画像②〜⑩と同根の新規指摘を含め、本文・図・式・局所穴の詳細修正案を作る。
3. 「実数を扱う」「不等式を使う」：下記影響台帳の確定箇所を同じ原因ごとに修正案へ組み込む。第1テーマの修正終了後に初めて調べるのではなく、既にソース横断監査を開始・記録済み。
4. 承認された修正だけを実装し、実画像の細部確認→横断監査→固定SHAの実アプリ通し確認へ戻る。

## 正本

- governance/INSTRUCTION_DICTIONARY.md CMD-WORK-001
- governance/WORK_SYSTEM.md §12A・§12B
- docs/MASTER_APP_LESSONS.md §§7–14、49–50、数学への学習行為の規則
- docs/INFORMATION_ARCHITECTURE_RULES.md：大見出し・内部IDの分離、接続文、同階層見出しの積み増し禁止
- work/items/W-MATH-003-numbers-expressions-creation/P-002_LEARNER_CATALOG_PAGES_RELEASE.md：「exactly three theme cards」
- subjects/mathematics/textbook/SPEC.md（詳細な承認済み規則より下位の要約）

## 非変更対象

原Word・原図、未関係の数学章・物理・練習、ユーザーの保存履歴、既承認の無関係な局所修正。内容の脱落でタイトル数を減らさない。既存ルールが不足していないのに新憲法や新手順を作らない。

Next: PROPOSAL_P001.mdをユーザーへ提示。承認前に実装しない。本文の修正は、どの中間式をどこで見せ、何を学習者にさせるかまで具体化した別のexact案が必要。


## 最新指示 — 教材修正を保留

2026-10-23 JST、ユーザーが修正作業を一度止め、AIの自由判断に依存する部分とコード化できる部分を分ける仕組みの提案を先に求めた。W-GOV-010/P-001（提案保存SHA d4d6774a89df74fc01425bdb74250afa79f21912）が現在の優先Work。W-MATH-027/P-001は未承認のまま保持し、実装しない。新仕組みの初期整理・試作・比較評価を承認された場合も、それを本番教材の変更許可へ拡大しない。

## Approved N02 execution — 2026-10-24 JST

User explicitly approved P-002-N02-R1 and immediate compilation. W-MATH-027-N02-R1-EXEC applied the fixed nine-existing-file patch through hash/scope checks. Learner changes are only N02 Q06-Q12 and its N02-only progress migration. Necessary existing QA fixtures and the compile workflow follow the new 15-action N02 and 318-action chapter. No shared UI, other learner units, main or public deployment changed. R07 compile/real-screen verification is next.
