# W-MATH-003 — 数学Ⅰ「数と式」教科書モードの作成
Status: VERIFYING
Source gate: RECOVERED (原Word元バイト・397 OMML・14原図を確認)。N01はPR #66/main/Pagesで確認済み。N03/N10/N12のユーザー承認済みreview専用アプリはPR #68でmain統合（merge `1e7a5d77e5f741d77afc7c0fe124cf978e45993e`）。最終PR CI 39009560379／ガバナンス 39009560317、統合後ガバナンス 39015513887はSUCCESS。[Pages 39015513835](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39015513835) SUCCESS、N03/N10/N12の公開Chrome操作はPASS。教材一覧への正式昇格・ユーザー実機受入は未実施。
Updated: 2026-10-17
Repo: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Previous N01 base main: `c184077a745c7d4bc077e0b5d0eaa70e9af2ddaf`; current reviewed main at start of next-pilot work: `1bd40d5790faeb28ccccfaa7add5090a715949a2`
Branch (source review): `work/W-MATH-003-next-pilots-review-20261017` (PR #67)
Branch (app implementation): `work/W-MATH-003-n03-n10-n12-app-20261017` (PR #68, merged to main 2026-10-17)

## Objective
CMD-WORK-002「作成」初回実証: 既存の「数と式」Word教材案を一次資料として、数学・教科書モードの新章16単元（N01–N14, NE01–NE02）を過去の集合完成版と正本教訓に基づいて設計し、代表4単元N01/N03/N10/N12を経て学習アプリへ統合する。

## Authority
`AGENTS.md`; `governance/CONSTITUTION.md`; `governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-002; `work/templates/CREATION_DESIGN.md`; `subjects/mathematics/textbook/SPEC.md` (CANONICAL-CANDIDATE); `docs/MASTER_APP_LESSONS.md`; `docs/INFORMATION_ARCHITECTURE_RULES.md`; `docs/MATH_RENDERING_RULES.md`; user-approved exemplar `集合_教科書モード_完成版_v1(1).docx`.

## Inputs & provenance
- Library: `01_数と式_教科書モード_対話段階導入版_v2.docx`, 212863 bytes, 53 pages, dated upload 2026-10-10. **Edited teaching draft**, not the original publisher textbook. Notes cite 啓林館 `深進数学Ⅰ` guide.
- Saved approved planning report `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md` (local proposal artifact; not textbook source itself).
- 16 units / 233 original question markers / **14** verified embedded figures. Raw input SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`. Original answer booklet remains absent; 59 pilot solutions independently checked.
- User-approved exemplar `集合_教科書モード_完成版_v1(1).docx` indexed in Library.

## Scope
P-001 as approved: all-source fidelity audit, concept/problem graph, complete reasoning, four pilots N01/N03/N10/N12, design+user review, then approved batch production, regression and eventual app handoff. Present work phase = N01 review-only pilot main-merged and Pages-deployed with technical browser PASS and user positive acceptance; **N03/N10/N12 learner copy and figure positions accepted by the user 2026-10-17**; PR #68 was subsequently approved for main merge/Pages publication, while remaining `status:'review'`. User hands-on acceptance of these three units is still pending.

## Do Not Touch
Existing textbook `math-sets`, proposition, functions (including review-only), Math Practice, Physics, learner IDs/progress, existing app UI or active CI, old source Word, `main` directly, canonical lessons.

## Approval
P-001 approved in conversation on 2026-10-17 by 「いいよ。こうやって作ろうか」 in direct answer to exact proposed workflow; no conditions added. N01 v2 later accepted for implementation with 「いいよ進めて」; PR #66 main merge/Pages authorized separately with 「よろしく」; N01 public pilot review received 「今のでいいと思う。続け」 in direct response to its live review link (2026-10-17). This is positive user acceptance of the pilot, **not proof of manual mobile-device testing, nor automatic authorization to publish later pilots**.

## Current Step
- User-supplied raw DOCX (SHA `93827322...`) has 397 OMML math nodes, 14 figures, 233 source question labels; 59 four-pilot original solutions independently verified, 174 other source markers remain unaudited.
- N01 source 10 → 15 interactive choices. PR #66 merged into main at `1bd40d5790faeb28ccccfaa7add5090a715949a2`. [Pages workflow 38994031060](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38994031060) SUCCESS. Actual public N01 deep link opened; Q1 -1 clicked correct, progress 0/15→1/15, next item unlocked. Prior CI covered all 15 choices on desktop/mobile. Current code remains `status:'review'`.
- Following the user's 「今のでいいと思う。続け」, treat N01 pilot copy/behavior as accepted at the conversational review gate, **without claiming the user personally tested every device**. W-MATH-003 stays VERIFYING for remainder of chapter.
- N03/N10/N12 drafts authored on independent source-review branch and implemented via main-merged review-only PR #68, preserving source 13/21/15 markers and 1/0/3 original figures:
  - `N03_LEARNER_REVIEW_V1.md` — exponent laws, distributive expansion, no prefilled original 2×2 product cells.
  - `N10_LEARNER_REVIEW_V1.md` — root laws under the source's `a>0,b>0` conditions, proof distinct from examples, rationalization.
  - `N12_LEARNER_REVIEW_V1.md` — inequality intersections, integer money context, answer-filled figure F03 unlocked after Q15.

## Next Step
1. Invite user hands-on review of the **three live review-only** N03/N10/N12 deep links. Capture any changes and treat substantive feedback through CMD-WORK-001 / revised design gate.
2. Keep all three at `status:'review'` and out of the normal learner catalog until **separate explicit promotion approval**; do not interpret publication of direct links as catalog release.
3. Continue the approved staged workflow for remaining 174 unaudited source markers; no mass autoproduction or whole-chapter DONE claim. W-MATH-003 stays VERIFYING.
4. Confirm documentation-only release evidence PR status and latest main/Pages head before final Work Close.

## Approval of exact N03/N10/N12 learner copy (2026-10-17)
Following presentation of all three exact student-facing draft reviews, user replied 「いいよ。よろしく」. This authorizes a separate review-only app PR under P-001, **not** main merge or Pages release. Draft PR #67 remains the reviewed design source; PR #68 carried the implementation and unchanged original PNGs, and was later merged with separate release assent.

## Separate merge / GitHub Pages release approval (2026-10-17)
After being explicitly asked whether PR #68 may be merged into main and published on GitHub Pages, user replied 「いいよ」. This authorizes PR #68 release only, not automatic promotion from `review` into the normal published catalog, nor automatic completion of all 16 units. Merge and deployment evidence: [PR #68](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/68), [Pages 39015513835](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39015513835) SUCCESS、公開ChromeでN03/N10/N12の各初回選択が進捗を解放（N12の元図F01はQ2後）。.

## Definition of Done
Source faithfulness + math proof QA + user textbook pedagogy acceptance + browser/mobile/e2e + PR/release gates and Work/Memory Close. Technical CI alone insufficient.


## 2026-10-17 — N02/N09 の次バッチ（最新）

User directive: 「次はN02・N09の原資料監査と詳細設計から始める。かなりいいから、今は少し大胆に多くつくろう」。
Scope is exactly **N02 (12 source markers) + N09 (14 source markers)**: deeper source audit, mathematically complete independent answer derivations, two full learner reading lines, 26 thinking stages with distractors and per-error feedback, original N09-F01 no-leak gate. This is inside approved P-001 and **design-only at this stage**, not app implementation/publishing.
- Source: original teacher-edited DOCX 212863 bytes / original SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` verified again. Direct word/document.xml scan: N02 has 12 labels, 34 OMML, 0 drawings; N09 has 14 labels, 37 OMML, 1 drawing. N09 original image6.png visually inspected.
- Independent solutions: N02 12/12, N09 14/14, total **26/26** math audit PASS; no official answer booklet.
- New documents: `work/items/W-MATH-003-numbers-expressions-creation/N02_N09_BATCH_DESIGN_REVIEW.md` (review entrance), `work/items/W-MATH-003-numbers-expressions-creation/N02_N09_SOURCE_SOLUTION_AUDIT.md`, `work/items/W-MATH-003-numbers-expressions-creation/N02_LEARNER_REVIEW_V1.md`, `work/items/W-MATH-003-numbers-expressions-creation/N09_LEARNER_REVIEW_V1.md`.
- Design choice to review: source N09-F01 appears before Q10 but labels -3/-2 and the -2.1 point; proposed app timing **after** Q10 to avoid premature answer.
- Arithmetic source coverage now 59 previous pilot markers + 26 = **85/233 audited**; 148 original source markers still not audited. This is NOT a claim of 85 deployed questions.
- **Current step:** await review of exact two learner texts, 26 interaction designs, and altered original figure timing. Status remains VERIFYING.
- **Next step if explicitly accepted:** independently implement N02/N09 as review-only app work on separate PR, run live desktop/mobile/source/regression QA; obtain distinct merge+Pages authorization. Preserve existing approved main app and progress.

## 2026-10-17 — N02/N09 implementation phase (latest)
Approval evidence: Immediately after being offered the two exact N02/N09 learner design drafts, 26-choice structure, and N09 original-image delayed gate, user replied **「いいよつづけて」** on 2026-10-17. Treat as approval of **review-only app implementation** inside already approved P-001, not main merge/Pages/catalog promotion.
- Implementation proposal: add exact N02 12-item and N09 14-item math textbook review units at stable IDs math-numbers-expressions-n02 and math-numbers-expressions-n09; retain 26 source marker→choice mappings, compound answers as one item, original image6.png unchanged, gated after N09-Q10.
- Branch: work/W-MATH-003-n02-n09-app-review-20261017 (separate review-only PR).
- Do Not Touch: previous N01/N03/N10/N12 data and decisions, published math-sets, practice, physics, source Word, learner IDs/progress, main directly.
- Current step: code and asset authored; CI/desktop-mobile progression and PR QA pending.
- Next: verify typecheck/lint/unit/browser regression, present PR live code review; separately request authorization before main merge/Pages. W-MATH-003 stays VERIFYING and 148 source markers outside this batch remain unaudited.

## 2026-10-17 — P-002 approved: Math chapter-1 review learner navigation and Pages
User corrected command classification to 作成, and replied 「いいよ続け」 in direct response to the revised P-002 six-unit/three-theme Pages review proposal. Approved scope and do-not-touch appear in P-002_LEARNER_CATALOG_PAGES_RELEASE.md. Six source-audited units remain review, not published. A new branch/PR integrates staged PR #71 and gates merge/Pages on QA. W-MATH-003 remains VERIFYING pending real learner acceptance.

## 2026-10-19 — P-003-R1 Gate② current verification checkpoint
Command: previously approved `CMD-WORK-002 作成` (all eight N04/N05/N06/N07/N08/N11/N13/N14 in one batch) with `CMD-WORK-001 修正優先` queue checked and W-GOV-008/P-003 review overlay. **No new work proposal is being introduced.**
Status remains `VERIFYING`, not DONE. Gate①: accepted by user's 「結構いいぞ。承認する！」 based on actual eight-unit screenshot gallery. Gate②: `IN-PROGRESS` with honest PASS/UNVERIFIED ledger in `CROSS_BLOCK_AUDIT_P-003-R1.md`. The latest current-head math/governance/review CI is successful; 123 original ID mappings/127 correct-path operations were checked, but independent all-123 Word/content/answer reconciliation is not proved. Original Word retrieval 403; missing two purported source/design artifacts must not be treated as audited. Gate③: `FINAL-REVIEW-NOT-READY`, no verified same-SHA app URL/complete user play. No main integration, production release, new public staging, Vercel mutation/deletion, fees, learner source revisions or branch cleanup authorized.



## 2026-10-20 — P-004 repaired and tested, correction-first loop still open
The user explicitly approved P-004 eight-question correction. All eight were repaired, preserved 123 source markers/127 interactions/9 original figures, and passed full CI 39343256282 at source SHA `7fce8fa93511df5406602d1a3e0d3c6e1f3dfdf9`; 48 real revised screenshots are in the existing gallery. Gate① original batch remains accepted; revised P-004 eight-question fine visual check is pending.
P-004 scope and full 14-unit root-cause sweep found **two more confirmed source-cognitive leakages** N06-Q11 and N14-Q05. These remain **UNTOUCHED** pending user's exact separate scope permission under `P004-R1_ADDITIONAL_LEAK_REPAIR_PROPOSAL.md`. Keep Work `VERIFYING`, Gate② NOT CROSS-VERIFIED and Gate③ NOT READY. Do not merge, publish or alter billing; do not start a new creation Work while correction-first issues remain unresolved.


## 2026-10-20 — P-004-R1 追加2問の修正・自動検証を完了
N06-Q11/N14-Q05の回答前説明のみを承認済み範囲で修正した。10問の誤答・ヒント・再挑戦20ケース、127操作と旧数学・物理・練習回帰が[Math CI #39346035269](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39346035269)で **PASS**（教材SHA `2604589da22062cb67928ee5e1569a5de0338845`）。[60枚の実画面・確認①〜⑩](./evidence/n04-n14-gallery/README.md)を整理済み。修正後の**一括細部確認はユーザー待ち**。Gate②は123問の独立証明等が未検証なのでNOT CROSS-VERIFIED、Gate③ NOT READY。既存8単元の承認履歴は保持し、main統合・本番公開・Vercel変更・課金は行っていない。Workは引き続きVERIFYING。

## 2026-10-20 P-004-R2 next gate
Source-cognitive Gate② audit on the unchanged approved code SHA confirmed 11 new pre-answer reasoning omissions: N06-Q01/Q05, N07-Q09, N08-Q02, N11-Q06/Q08/Q09/Q13, N14-Q10/Q14/Q15. Separate `P-004-R2_PREANSWER_COGNITIVE_REPAIR_PROPOSAL.md` is **PROPOSED / NOT APPROVED** and no app changes have been made. A first independent 48-check mathematical evidence sheet is in `GATE2_INDEPENDENT_ALGEBRA_CHECKPOINT_20261020.md`. The 123-question all-distractors independent proof remains UNVERIFIED; Gate② NOT CROSS-VERIFIED, Gate③ NOT READY. **Next executable action**: user decision on exact P-004-R2; only after authorization implement precisely the eleven repairs and preserve old progress with targeted v2→v3 migration, then CI/screenshots/impact loop, then return to independent math audit. Previous P-004/P-004-R1 approvals remain valid.
