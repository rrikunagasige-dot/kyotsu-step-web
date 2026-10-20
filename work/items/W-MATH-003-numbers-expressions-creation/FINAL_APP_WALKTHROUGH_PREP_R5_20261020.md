# W-MATH-003｜Gate③ 既存「アプリ全体・最終総チェック票」準備

Status: **FINAL-REVIEW-NOT-READY (deployment authorization + exact-SHA playable URL missing)**
Date: 2026-10-20 JST
Work: W-MATH-003 / P-003-R1, corrections P-004 and R1–R5.
Frozen candidate **tested learner-code SHA**: `ad77318b37e90b9c39150b14ee706283b3f59355`.
Review-only branch: `work/W-MATH-003-p003-r1-n04-n14-batch-20261019`; [Draft PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) still unmerged. Evidence-only documentation and screenshot updates following the code commit do **not** change the learner implementation; GitHub compare `ad77318...` to recorded pre-Gate-closure head `66fbad...` returns 36 changes **all markdown or PNG**.

## Gate① / Gate② prerequisite evidence

- **Gate① BLOCK-VISUAL-OK:** original eight new units, ten older repairs, eleven recent repairs preserved. For R5's final three fresh 320/390px screenshot groups ([actual gallery](./evidence/n04-n14-gallery/README.md)), user replied **「ok続けて」** on 2026-10-20 around 22:32 JST directly to an invitation to give `R5の3問、細部OK`; accepted as the three visual blocks' sign-off, not as final app play or release permission.
- **Gate② CROSS-VERIFIED** on this frozen candidate SHA: [new final cross-block audit](./CROSS_BLOCK_AUDIT_FINAL_R5_20261020.md) with PASS/NOT-APPLICABLE evidence, [repaired original-source math and all wrong-candidate audit](./GATE2_P004_R5_POST_REPAIR_INDEPENDENT_AUDIT_20261020.md), [full Math CI 39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) SUCCESS and [real screenshot 39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311) SUCCESS.

## Exact app availability verification / blockers

| Check | Evidence | Status |
| --- | --- | --- |
| Last verified live main SHA | `537c3cbf28d40f45228d8a0c4bdd20327136aa93`, as returned directly by GitHub live branches/main | **VERIFIED, DIFFERENT from candidate** |
| Last verified main GitHub Pages build+deploy | [Deploy to GitHub Pages #39223506623](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39223506623), SUCCESS, head **`537c3cbf...`** | **VERIFIED, OLD MAIN CODE** |
| Review work PR | [PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) Draft, not merged, base main `537c3cb...` | **VERIFIED NOT PUBLISHED** |
| Branch evidence image workflow | [#39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311), **no deploy** by design | **NOT an accessible app URL** |
| Branch preview code-check workflow | `.github/workflows/review-preview-check.yml`, development test, no hosted build URL supplied | **NOT an accessible app URL** |
| Reachable single-tap URL with content at `ad77318...` | No exact-SHA-matching deployment verified or authorized in this work | **UNVERIFIED / REQUIRED BEFORE READY** |
| Authorization to merge PR #101 into main / trigger GitHub Pages, or use separate free authorized staging | Current user messages authorize production of/review of learner content and audit, **not public merge or new hosting** | **NOT GRANTED** |
| Hosted SHA identity, login wall, phone/desktop browser, no production-progress contamination | Cannot validate until authorized exact candidate is actually hosted | **NOT RUN** |
| User entire-app beginning-to-end `総チェックOK` | User has not played full deployed app at the audited candidate SHA | **PENDING** |

**Do NOT give an old main Pages URL to the user as though it contains the new eight units.** Do NOT claim screenshots, a PR code URL, Actions success, or a local Vite server are equivalent to this Gate③ URL. Vercel is optional and not part of this Work's approval.

## Proposed full-play checklist under already approved Gate③ (do not assume sampling)

Review the **entire existing target app UI** from its real front page, while specifically checking newly authored MathⅠ textbook N04,N05,N06,N07,N08,N11,N13,N14 plus inherited math textbook N01,N02,N03,N09,N10,N12, and old Math `math-sets`/other actually reachable topic routes. Other existing modes remain in **the full product walkthrough**: Math Practice Q87–120, Physics Textbook Chapter 1 units 1A–1G, and the actual Physics Practice guided items exposed by the audited build. The exact enabled product navigation at hosted candidate shall be read and copied into final checklist at URL verification time rather than invented now. Not-yet-authored NE01/NE02 source markers are **NOT** an app feature; review-only status does not automatically make a unit public catalog material.

| Module | What the user must check after a matching app URL is VERIFIED | Wrong/right path | Progress & refresh | Mobile and desktop | User accepted/date |
| --- | --- | --- | --- | --- | --- |
| Math Textbook: N01–N14, 8 newly authored target units and prior accepted units | All reachable lesson steps incl. 123 source Q→127 guided choices, links, nine figures and existing other math topics | PENDING | PENDING | PENDING | PENDING |
| Math Practice: existing question/curriculum catalog, Q87–120 | Actual guided problems, formula/result reuse, hint/choice flow | PENDING | PENDING | PENDING | PENDING |
| Physics Textbook: Chapter 1 (1A–1G) | Existing learner route & math/figure/topic continuity | PENDING | PENDING | PENDING | PENDING |
| Physics Practice: actual existing published/adapted items | Question/choice/hint/navigator and reset | PENDING | PENDING | PENDING | PENDING |

## Final authorized sequence (existing §12A, no new process)

1. Secure **separate user authorization** for a playable candidate deployment by an allowed no-extra-cost provider/workflow; do not silently merge PR #101, trigger public Pages or create a new staging project.
2. After authorization, use approved method to serve exact app implementation. Test real address, app access without login, content SHA and scope, on phone and desktop; isolate any production learner records. Keep trace of final hosted SHA.
3. Only when exact URL and user checklist are verified, set **FINAL-REVIEW-READY** and provide the one-tap actual **app** link.
4. User performs complete app play and explicitly replies `総チェックOK` on that SHA/scope. Without this, **FINAL-APP-ACCEPTED cannot be set**.
5. Fixes discovered in Gate③ return to CMD-WORK-001, Gate①/② relevant recheck and new frozen SHA. Public release/merge authorizations remain separately scoped.

**Current verdict: FINAL-REVIEW-NOT-READY because NO AUTHORIZED, REACHABLE CODE-MATCHING APP URL.** This is an authorization/provenance barrier, **not a claim that Math CI/independent proof failed**. The Work remains `VERIFYING`, not final app accepted.
