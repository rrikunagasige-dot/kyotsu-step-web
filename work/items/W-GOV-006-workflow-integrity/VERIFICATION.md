# VERIFICATION — W-GOV-006

Status: PENDING
Phase: VERIFYING G0–G4 (P-002 approved for implementation only; PR merge/settings NOT approved)
Baseline main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`

## Proposal-stage checks
- Target repo name/ID and live main verified.
- Owner `main` has no branch protection and repository rulesets count=0 (confirmed at assessment).
- Core Constitution / Work OS / command dictionary and current governance CI inspected.
- This proposal-only PR must change only six Work record files (five originals + P-002) under `work/items/W-GOV-006-workflow-integrity/`.
- All application, courseware, production workflow, existing governance code and main branch: UNMODIFIED by this proposal.

## Implementation acceptance (NOT YET RUN)
- Negative/positive approval and scope tests: PENDING.
- CI diffs checked against approval scope: PENDING.
- Navigation/current-work contradiction fixed: PENDING.
- Branch settings enforced, checked via live GitHub: PENDING, requires separate owner permission.
- Approval evidence for actual implementation: PENDING.
- Post-merge verification and memory close: PENDING.

This Work must NOT be declared PASS/DONE at proposal stage. P-001 was not approved; P-002 G0–G4 implementation was approved by user on 2026-10-10. PR merge and Settings remain NOT AUTHORIZED.


## P-002 preparation verification
Original `PROPOSAL.md` (P-001) remains byte-identical; P-002 is a separate revision file. Protection-first requirements are documented but have NOT been executed. Tests and rollback are FUTURE gates, not passed checks.


## G0–G4 implementation evidence (CI PENDING)
- **G0**: 395 protected original Git blob SHA entries recorded, no automated mutations to existing content.
- **G1**: isolated Node tests include positive and negative cases; CI run result not yet observed.
- **G2**: preserve existing governance check; independent PR scope-pilot job is not a required branch protection gate.
- **G3**: stale PR #49 pending-merge issue removed from live Current Position, while historical W-GOV-005 record remains.
- **G4**: compare manifest to PR head Git blobs; full product regression CI and browser gate must be observed before merge. This Work remains VERIFYING.
- **Human review and main merge**: PENDING separate explicit user instruction. No GitHub branch protection or Rulesets modified.


## G4 initial workflow evidence (FAILED checks retained)
- [Workflow run 38062252648](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38062252648): existing governance job PASS.
- Independent policy negative/positive tests PASS **15/15**.
- Pilot PR-scope job FAIL because of false-positive P-001 textual check (an implementation error, not an approval violation). Corrected with anchored status-line check; rerun required.
- Product `pnpm check` job FAIL at lint: **24 pre-existing lint errors in protected unchanged source files**. This Work cannot touch these files. Splitting the new *pilot-only* product job into typecheck, visible legacy lint diagnostic, unit test, build, and Playwright allows actual independent regression evidence without altering the old lint rule or the original app. Do NOT report `pnpm check` full PASS.
- Required post-correction tests and product verification: PENDING.


## G4 second CI evidence (scope pilot PASSED, legacy full suite FAIL)
- [Run 38062455599](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38062455599): Governance PASS; independent workflow-safety pilot PASS (15/15 + full 395 protected Git SHA + allowed PR diff).
- Original `pnpm run lint` still has 24 legacy errors in protected, untouched source, recorded as diagnostic, NOT PASS.
- Original `pnpm run test` has **249/251 PASS**, with 2 historical test-count assertion failures (old expectations 17 vs 3, 19 vs 39). This Work cannot change those protected test files; record FAIL honestly.
- Targeted released Math/Physics tests, build and browser regression are now tracked as independent required steps; their current results pending.

## G4 browser regression legacy baseline (FAIL retained)
- [Run 38062639771](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38062639771) : 156/160 Playwright PASS; 4 historical `learning-flow.spec.ts` test failures on an old removed question-selection menu; 2 failing test titles × mobile+desktop. These test and app files are unchanged and protected, so not caused by W-GOV-006. **The full E2E suite is NOT PASS**.
- Current app's released Math Practice/Math Textbook/Physics Ch1 E2E: passed in that run, now separately kept as required CI step; surviving representative Physics Practice guide separately required.
- Historical broken browser tests remain visible independent diagnostics in new workflow; they are not silently marked PASS and have not been modified.
- Next CI must independently confirm targeted released-mode E2E and preserve protected 395/395 SHA; otherwise Work still VERIFYING/BLOCKED. No PR merge.

## G4 bounded replay — newly configured, NOT yet verified
Long-running comprehensive browser replay 38063508314 was still `in_progress` on 2026-10-11; no final PASS may be inferred. PR-scope SHA and governance tests already PASS. A bounded 25-min product regression now requires representative math practice, published math textbook, physics textbook (desktop/mobile), and the separate Physics Practice guided-image test. Existing obsolete test failures remain a visible diagnostic; their failures are NOT hidden as PASS. This gate stays PENDING until completed GitHub Actions evidence.


## G4 confirmed SUCCESS — 2026-10-11 (latest code checkpoint)
[Workflow run 38064137763](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38064137763), PR head `76145a2fe32230a7de6cab4f625689fedf0272d5`: **3 jobs completed SUCCESS**.
- Original Repository Governance Check: 0 errors, PASS.
- Workflow-safety pilot: **16/16 Node tests PASS**, PR diff scope PASS, approved P-002 & unapproved historical P-001 exact Git SHA anchors PASS, protected-file manifest **395/395 SHA identical** with no additions/deletions.
- Original app typecheck: PASS; 18 targeted unit test files / **202 tests PASS**; original production build PASS.
- Published Math Practice / Math Textbook / Physics Textbook representative browser smoke: **12/12 PASS** across mobile and desktop.
- Physics Practice guided-image browser test: **2/2 PASS** across mobile and desktop.
- **Known legacy failures remain explicitly failing (diagnostic steps use continue-on-error):** lint 24 errors, full Vitest **249/251 PASS and 2 FAIL**, obsolete `learning-flow.spec.ts` **0/4 PASS, 4 FAIL**. Their `src/`/`e2e/` inputs are protected/unmodified; these are not considered fixed and the historical full-suite status is NOT PASS.
- [Older broader E2E 38063317476](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38063317476): **156 PASS / 4 obsolete setup FAIL** (source still unmodified).
- `G0–G4` implementation/checkpoint has positive evidence while full legacy suite failures remain open as separate follow-up scope.
- **Work remains VERIFYING / not DONE:** specific PR main merge (G5) and owner GitHub Settings (G6) have NOT been approved. Branch protection is still disabled. Do not merge automatically.
