# Approval and Work-Record Lessons

Updated: 2026-10-18

## L1 — A request to modify is not automatically approval of the modification design

Before changing implementation, determine what actually needs to change and whether the exact correction proposal is already approved.

If not approved: propose first and wait.

## L2 — Do not ask twice for the same unchanged approval

Approval may survive chat boundaries when the repository records exactly what was approved and the current action remains inside that scope.

## L3 — User corrections are project data

When the user establishes that an assumption, design, or operation was wrong, classify and record it as a Work finding. Promote it to a reusable Lesson when the rule generalizes.

## L4 — Correct conclusions are also project data

A confirmed fact or accepted design should not disappear because only errors were logged. Preserve it as CONFIRMED and promote durable choices to Decisions.

## L5 — Record where work happened

For meaningful actions, record target path/location and evidence. “Fixed” without a location or verification is not sufficient handoff information.

## L6 — Do not extend an approved state machine during implementation

If implementation reveals that an extra workflow state might be useful, record the finding first. Do not silently add the new state unless the approved proposal already covers it or a revised proposal is approved.

## L7 — 作成/修正は同じ品質改善ループを共有する

承認済み作成成果物に不具合が見つかったら、修正実施中に同じ根本原因が他の承認済み作成成果物（review-onlyを含む）にも存在するか調べる。追加不具合はリンクした修正Workで承認→検証し、残件を閉じてから作成を再開する。作成開始時にも未完了修正依頼を先に処理する。**横断調査の承認は、全件自動修正の承認ではない。**

重複する教訓を何度も新規登録しない。既存ruleとの同一性・共通部分・mode固有例外を比較し、正本へ一度だけ反映する。詳細実行フローは `governance/WORK_SYSTEM.md` §12B、共通教訓は `docs/MASTER_APP_LESSONS.md` §51を参照。
