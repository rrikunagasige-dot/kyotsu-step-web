# W-MATH-023/P-002 — 実装前の静的整合性監査（提案段階）
Status: PREIMPLEMENTATION-CHECK / P-002-NOT-APPROVED
Date: 2026-10-22 JST

## Authority and exact current state
- Repository: rrikunagasige-dot/kyotsu-step-web; live main checked `15ae503455bc6ae75b080caa1c4919cafb250027`; proposal branch checked `a87a879963400d5f988f5c5cb974e7c02eeb32f3` before this file.
- Canonical `AGENTS.md`, `governance/CONSTITUTION.md`, `governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-001, `governance/WORK_SYSTEM.md` §§12A/B/C, `navigation/CURRENT_POSITION.md`, mode SPEC and MASTER_APP_LESSONS inspected.
- P-002 requests **explicit approval of that exact revised proposal**. Latest conversation reply 「続けて」 without direct P-002 affirmation is *not treated as approval* under P-002's own approval boundary. Do not implement any N13 learner changes.
- Historical P-001 unapproved, preserved at `PROPOSAL_P001_HISTORICAL.md`. P-002 v2→3→4 staging is the current proposal.

## Verified source mechanics before any implementation
| Surface | Current verified fact | Exact staged check after approval |
| --- | --- | --- |
| `n13Lesson.ts` | revision 2, 9 teacher labels/9 real choices, existing figure placement before Q05 | Stage A N13 Q05 two live choices, 9→10, rev3; Stage B Q08 three live choices, 10→12, rev4 |
| `newBatchGuidedSteps.ts` | For each old source marker creates one `n13-XX` choice and `lead/formula/after` blocks; source map is initially one-to-one | Replace *only* Q05's flow/items/map at A and Q08's at B; do not edit common helper |
| `src/domain/textbook.ts` | Existing accepted R5 revision1→2 migration clears prior `n13-08` and preserves archive1 | v2→v3 archive2 and clear only `n13-05`. Later v3→v4 archive3 and clear only `n13-08`; preserve all other IDs, previous archives and timestamps. Check v1→v2→v3→v4 chain and idempotence |
| `newBatchCoverage.test.ts` | Source-count and revision/count snapshots and old Q08 bundled-answer fixtures exist | At A retain intentional old Q08 answer fixture, add Q05 gate; at B replace old Q08 fixture with three decisions; keep old revision-specific R5 test as *historical fixture*, not wrongly rewrite evidence |
| `src/review/reviewTargets.ts` | Genuine numbered review requires exact unit revision, item count, in-order block IDs, expected answers and awaiting-user status | At A provide Q05 target only, 10 item count/rev3. At B Q05 accepted marker hidden, Q08 target only, 12/rev4. Existing accepted review targets must remain untouched |
| Real viewport and figures | N13-F01/F02 preserved teacher images and existing readingFlow gates | 320/390/1440 actual Chromium; KaTeX, one question at a time, wrong/red ×, guided hint, retry/blue 選択, refresh, archive and figures |
| Gate record | N14 Q16 W-MATH-022 still Gate① pending; N13 P-002 **unapproved** | No N13 Stage A before P-002 exact approval. No Stage B before N13-Q05 Gate① user `細部OK`. No Stage C or release inferred |

## Separate branch/release reconciliation risk (NOT authority to merge)
- W-MATH-023 proposal branch derives from W-MATH-021 SHA `1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8`.
- W-MATH-022 **Q16** corrected learner source is at frozen SHA `e64fd99b18ba167364c2dd6b108a6f7fef76f439` on another draft branch, not on the W-MATH-023 baseline. GitHub compare confirms `n14Lesson.ts`, `src/domain/textbook.ts`, `src/review/reviewTargets.ts` differ between these baselines and `n13Lesson.ts` does not.
- Therefore **never present the standalone W-MATH-023 preview as if it contains the already repaired Q16**. Both Works remain independent. Future combined release requires explicit, conflict-aware integration plan and separate merge/deployment authorizations; do not silently overwrite Q16 migration or previous approvals.
- The source code in this proposal branch is unchanged from the W-MATH-021 parent and its N13 blob is `58d1f6d1172dc216dd6417adf2a276b40163423e`.

## Outcome / next permitted action
**Design-only consistency audit PASS** for the staged arithmetic counts and selective rekey concept; **implementation/test/visual gates UNVERIFIED**. Read-only checks establish necessary work, not the final correctness of new code.

Next: user explicitly approves current [P-002](./PROPOSAL.md) or supplies review feedback. Only then begin Stage A Q05 scoped implementation and true Gate① sheet. Q16 independent human Gate① remains pending. No main merge, published app URL or billing action.
