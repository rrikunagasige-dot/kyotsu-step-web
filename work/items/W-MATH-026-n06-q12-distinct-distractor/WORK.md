# W-MATH-026 — N06 Q12 数学的重複誤答の限定修正
Status: APPROVED
Updated: 2026-10-23 JST

## Objective / Authority
W-MATH-025 Gate②監査で確認した別原因 `mathematically_duplicate_distractors` を、[P-001](./PROPOSAL.md) の1選択肢だけの変更案として提示。直接ユーザー指示・憲法・WORK_SYSTEM §12Bに従う。3案への直接回答「いいよ続けて」でP-001 exact範囲は承認済み。先行Q03/Q06のGate①を待ち、まだ実装しない。

## Branch
現文書はPR115の監査記録に同居する。実装枝は未作成。承認後、W-MATH-025と重複するn06Lessonへの同時書込を避け、検証済み最新SHAから独立したW-MATH-026 feature branchで順番に実施する。mainは変更しない。

## Scope / Do Not Touch
q12 `wrong[2]` のexact変更だけを提案。正答・他選択肢・既受入ヒント・原16問・stable ID・revision3・全進捗、元資料、他単元、renderer/CSS/schemaは保護。別原因/別小問を本案でまとめて変更しない。

## Approved Proposal
P-001 APPROVED by direct 「いいよ続けて」 to the three-proposal request on 2026-10-23 JST.

## Current Step / Next Step
個別承認を取得。先行Q03→Q06の限定実装と各Gate①後、確定SHAからQ12の1選択肢だけを実装→実検証→Q12選択肢Gate①。承認済み、未実装。

## Dependencies / Completion Condition
W-MATH-025の既受入hintを保全。Q03/Q06案を実施する場合は各Gate①後のSHAを採用し、同じファイルを並行変更しない。別N14 Q16 branchは未統合。原症状・保存済み旧誤答の再回答・数学的に異なる4択・関連回帰・実画像受入を完了してからWork完了を判断。全体Gate②/③・main統合・公開承認は別に残る。

## 2026-10-23 current execution dependency
Q03のヒントGate①は直接「ヒントならいいよじゃ続けて」で了承済み。先行P-004 Q06の限定実装/実画像Gate①が進行中。本Work P-001 exact承認を保持し、まだQ12選択肢や実装ブランチは変更しない。次はQ06 Gate①後の確定SHAから順番に実装。
