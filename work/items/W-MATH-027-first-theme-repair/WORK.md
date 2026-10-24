# W-MATH-027 — First theme, one-at-a-time public review

2026-10-24. Target rrikunagasige-dot/kyotsu-step-web (1391122224).
Public source baseline: 171c04781f32c1286a0762905891b582714834f9.
Governance main at intake: c4a7aca0e72f15896a54d6753197fca196702aa4.
Branch: work/theme-one-guided-repair-20261024.

## Authoritative instruction
User accepted the concrete design: 「可以阿也还行吧。先这样设计」.
User then changed the order: 「我们一个个修按照工作流」,
「修完一个就直接显示到app上面」,
「目前先留着，后面要修改这个方案」,
「你直接修完就comipile就是能够显示到公开的app上面这样我也可以立即确认」.
This authorizes implementation and publication of one theme before the user's hands-on review.
It does not assert user acceptance of the finished content. Existing review gates remain recorded.

## Scope and intended behavior
First theme = N01–N06 + NE01. Preserve original source questions, answers, hints and images.
Add 60 authored intermediate decisions (122 → 182 decisions), not paper-dependent compound jumps.
Use semantic stages, completed-history expansion and earlier prerequisite references.
Explain how to read the existing N03 multiplication grid.
Catalog has exactly three themes; NE01 joins polynomial theme, NE02 joins real-number theme.
Remaining two themes' lesson data and all published set/physics/practice material remain unchanged.
Repair restart remount/cursor/focus/scroll, preserving archived attempts.

## Execution / review status
R01 reproduced from actual publicly hosted source; main itself was not the hosted lesson edition.
R02 cause: compound final choices, omitted substitution/calculation links, continuous long reading page.
R03 seven-unit impact inventory + protected baseline unit/item hashes in baseline.json.
R04 concrete design accepted in current conversation; authored nodes and target IDs fixed in firstThemeRepair.json.
R05 latest user scope explicitly authorizes one-theme public publication for immediate review.
R06 independent branch; local authored node renderer, catalog/presentation/migration changes only.
R07 technical/mathematical/UI checks recorded in VERIFICATION.md. User quality review remains pending.
R08 candidate lesson learned: a successful build is not public delivery; match release SHA and exercise live app.

The candidate snapshot does not include main's workflow/ CLI. Its current contract rejects added IDs.
This Work follows the existing WORK/PROPOSAL/ACTION_LOG/FINDINGS/VERIFICATION process and does not
fabricate CLI claims/submissions or completed gates. Extending the workflow engine is separate work.
No automatic whole-repository merge. Public deployment pins this branch's tested commit.

Latest content revision: see REVISION_R1.md. User approved the neat layout but requested visible fill-in blanks and fuller
induction/derivation. Sourcef1627507 is now publicly deployed and technically verified by run40052655846 SUCCESS.
Next action is user review of this same first theme; do not infer acceptance of R1 content or start the second theme.

Latest feedback revision: REVISION_R2.md and R2_AUDIT.json. User requested all similar first-theme omissions and cramped options repaired.
All206 previous first-theme decisions were reviewed; all399 prior graded chapter decisions remain protected.
R2 adds actual written equations and local decisions, and tests option-internal geometry. No other theme's lesson content was edited.
