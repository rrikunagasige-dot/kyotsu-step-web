# Findings — W-GOV-008/P-003

## F-001 — CONFIRMED (policy conflict)
P-001 Work OS §12A and dictionary required exact-head live app deep links **for each block**; P-003 explicitly approves GitHub marked visual sheets per block and postpones mandatory app play to one final comprehensive gate. Without an explicit supersession, both claims would contradict. Resolution: replace §12A and command handoffs in the isolated P-003 branch, retain P-001 Work/history and section §12B.

## F-002 — CONFIRMED (branch split)
2026-10-19 main `154a16ff379321016f4692bb0ac6fe9a8a596214` unchanged. Draft PR #93 P-001 head `80e6fdc2151c1b7ac4a2aea181f82bd3cad81b43`; draft PR #95 P-002 head `a6d4e09be50ad5aaf731abc9352207f5d113a5a2` on a *different PR #92-derived lineage*. Do not silently combine app code and governance; P-003 uses P-001 base and references P-002 provenance only.

## F-003 — RISK (real screenshot and host truth)
GitHub source Markdown cannot play an unpublished app. Current P-003 branch has governance source and no P-002 review screen; an honest review sheet needs an actual screenshot from the target app SHA, and the **final** review needs a separately authorized reachable app URL. As of proposal implementation, these are pending, not accepted.

## F-004 — RISK (no-cost/manual screenshot workflow)
A manual/reusable GitHub Actions artifact workflow can capture SHA-checked app screenshots **without deploying**, but availability of `workflow_dispatch` from an unmerged feature branch may be limited until a workflow exists on default branch. The workflow must not run or publish by guessing, and no paid service is authorized.

## F-005 — CONFIRMED (separate user answer meanings)
A reply `細部OK` to a GitHub screenshot could be misreported as interactive user acceptance; P-003 requires `BLOCK-VISUAL-OK` only. `FINAL-APP-ACCEPTED` requires the same frozen SHA, tested app URL, full walkthrough and explicit `総チェックOK` user message.
