# 残作業 — 2026-10-23

## CURRENT — 3hint implementation/QA complete; grouped visual pending
最新直接「いいよ」でP005/P006/P007を一括承認し、sourceb1025cab41342b7648acb191abadfa8aaaa66e5cでexact3文実装・全体回帰まで成功。今回の既知修正4件(Q12choices+3hint)は実装済み。残るのはQ12/新3hint/Q16の5件まとめ細部受入、必須残surfaceの横断監査/候補整合、同一SHAapp全体通し確認。新3案の再承認を求めない。NE01/NE02の2単元25原問は別に未実装。
[5件の実画面](../W-MATH-025-factor-hint-leak-qa-proposals/GATE1_FIVE_ITEM_REVIEW_20261023.md)。以下の修正3件未実装という表は承認前のHISTORICAL状態として保持する。

Evidence source: current candidate `d894e38820829c387386d207ff2d44d1ac95eebb`, W003 original16-unit plan and teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa。
「次の5件」は今回の修正/確認groupであり、章全体の残りが5問という意味ではない。

## 現在の修正群
| 対象 | 残作業 |
|---|---|
| N06Q12 choices | 実装・専用数学/履歴/実画面QA済み。全体CIもPASS。残るのは5件groupでの視覚受入 |
| N05Q06 hint | P005のexact新文承認→限定実装→QA |
| N07Q09 hint | P006のexact新文承認→限定実装→QA |
| N08Q05 hint | P007のexact新文承認→限定実装→QA |
| N14Q16 | 別PR111で実装/実画像作成済み、5件groupで視覚受入 |

新しい教材修正は3件。新3案は一括提示・一括承認後にまとめて実装/検証し、Q12/Q16と合わせ約5件を一度に見てもらう。Q06やQ12既存proposalを再承認しない。

## この修正群の後
1. 変更後SHAで同根・共有面・既受入内容・全関連モードの横断監査を閉じる。必須UNVERIFIEDや確認済み未修正があれば未完了として残す。
2. 分かれた候補・履歴・版の整合を確認し、原文/数学/図/進捗を保持する。特にN14 rev10は別候補。CI成功だけで一方を上書きしない。
3. 同一SHAで操作できるアプリを用意し、合意した全範囲をユーザーが通し確認する。Gate③、main統合/公開は既存の別権限を保持する。

## 章全体の制作残
W003の計画は16単元/233原問。現候補はN01–N14の14lesson sourceを持ち、NE01/NE02のruntime fileは無い。
- NE01「3次の展開と因数分解」: 原Word body618–644に【1】–【13】、13原問。
- NE02「二重根号を、平方の形から外す」: body645–668に【1】–【12】、12原問。
合計2単元/25原問が現在の候補に未実装。制作の再開は修正優先queueの完了と当該exact設計範囲の確認後に行う。コード14/16は制作量の目安であり、最終受入率87.5%などとは主張しない。
残り所要時間/全面的完了率は証拠不足で算定しない。未監査面で追加の不具合が見つかる可能性もあり、件数は既知分として示す。
