# W-GOV-005 Proposal — port the Work OS
## P-001
Status: APPROVED
Date: 2026-10-10
## Problem
The designed Constitution / Work Operating System was mistakenly implemented under upstream `paulfields83/kyotsu-step-web` rather than owned `rrikunagasige-dot/kyotsu-step-web`.
## User instruction / approval evidence
「今のpaulfields83から全て受け着いたものを全部の工作流システム俺がデザインしたやつをrrikunagasige_dotまで運んで後確認だ。俺のrrikunagasigeの中のsection2,3は導きあるかどうか。」
## Solution
Preserve exact upstream workflow source snapshot; adapt identity, entrypoint, approval, current-state, navigation, Work records, 4 mode candidate router and validator to the real target. Audit Section2/3 on target.
## Scope / Out of scope
Governance and its historical work evidence only. No content replacement, no automated merge into main, no destructive cleanup.
## Risks
Upstream application backend and question IDs are different; prior approvals do not transfer.
## Verification
Target repo identity, no target runtime changes, all first-read/Work files present, governance validator, PR checks, Section 2/3 code evidence and review link.
## Review History
User initiated migration directly. Material extension to app code will require new proposal.

## 2026-10-10 continuation / same approved scope
User requested continuation of this existing Work after PR #50 app release. Refreshing current-state memory and validating against the new main is mechanical work inside the previously approved governance-only P-001 scope. No app changes or upstream content merge authorized.
