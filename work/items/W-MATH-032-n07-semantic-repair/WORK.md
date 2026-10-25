# W-MATH-032 — N07の意味と解法接続の修正

Status: IMPLEMENTING
Command: CMD-WORK-001
Proposal: P-001 / PROPOSAL.md
Date: 2026-10-25（日本時間）
Branch: work/n07-semantic-repair-proposal-20261025
Live main at entry:b737ea42ff8527bfefd19f6ffd427dd13749084b
Workflow implementation:190941bc9d65fb3ed2fa6b52ba90196addf19e33 / production/2
Published lesson source:4fb7a98e7f864839ccc1374080473df4ba60ce88

Objective: 六つのユーザー指摘と全41nodeの同型を診断し、具体的な修正案へまとめる。現在の依頼は前作業の続行。P-004基盤承認を、この教材修正の承認へ転用しない。

Current: 原Word、全六画像、公開版とのbyte一致、全41node/36item/14stage/62式番号を照合。N07の具体案と41nodeの表示partsを作成。実運用での旧形式の診断・モデル不在という実行器の不足も提案へ含める。R02に未解決を残し、R03/R04の資料を実行器の合格結果とは呼ばない。

Protected: 第一タイトルの受入22bc43ba、他単元・他モード、原Word、既存のレイアウト、item/段階/進捗・storage namespace。現行learnerとproduction codeは未変更。

Next: R06の候補commit固定と結果提出→四幅の実UI/全回答/誤答/履歴→R07/G2→既存Pages公開。P-001は「いいよ続けて」で承認済み。承認原文とhashはAPPROVAL.json、原版PROPOSAL.mdは改変しない。

実装checkpoint: 全41nodeのsemantic IRをN07専用readerへ接続。36回答/14段階/revision4保持。620 learner回帰・39 authoring検査・6つの修正専用Node検査はPASS。ローカルChromiumのダウンロードが破損し、実画面検証はGitHub CIへ接続。公開・受入は未完。
