# P-004 — N04–N14 Gate② source-fidelity repair proposal (APPROVED)

Status: **APPROVED 2026-10-20** by user's explicit 「承認」. Exactly eight listed learner blocks plus scoped tests and required state preservation authorized. Additional defects outside the eight remain NOT authorized. Linked work W-MATH-003, Gate② findings F-028-A–H; follows CMD-WORK-001 修正, WORK_SYSTEM §12A/§12B, and Mathematics Textbook SPEC. This is an evidence-only proposal, not a modification of P-003-R1 creation authorization.

## Need and verified evidence

Exact original Word matches historical source SHA 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa. The 123 source markers and 127 app interactions map correctly and the nine original figures match bytes. But eight source-student cognitive tasks are not faithfully exercised in the app. Evidence: N04_N14_SOURCE_SOLUTION_AUDIT.md (commit c89355b38d207ba5fb7055a97004337057bf8aa4); cross audit appendix.

## Proposed repairs, each independent small block

1. N04-Q13: require the two cross-products (3x·2 and 1·x) **as well as** the expansion 3x²+7x+2. Keep source marker ID and a visually continuous derivation; avoid introducing irrelevant clicks.
2. N05-Q17: answer must include both opposing signs and why (rs=-3<0); prior N05-Q16 may remain visible as prerequisite, but the justification is an active learner decision, not only post-answer prose.
3. N06-Q08: withhold the degree comparison before the decision. Ask for both deg_x=3 and deg_y=1 and selection of y. Provide rationale after response.
4. N07-Q06: do not state multiplier 10 before asking the *smallest* of 10,100,1000. Display alignment and 10x=8.888... after learner's decision.
5. N08-Q05: ask for squared comparison 5<9 together with sqrt(5)<3; do not display both numbers as pre-answer key.
6. N11-Q05: ask learner to choose the transformation (add 2 to both sides) and resulting 3x<7 without lead pre-filling the operation.
7. N14-Q06: remove the explicit answer (-4 or 4 exterior, connective または) from pre-question prose; learner selects both ranges and connective, then explanation appears afterward.
8. N14-Q11: do not pre-classify outer/inner and endpoint inclusion; learner chooses rule then branches x+3<=-2 or x+3>=2.

N14-Q05: independently review source's intentional scaffolding before labeling a defect. Not an automatic change in this proposal.

## Root-cause impact sweep (required before close)

- Mechanism A — compound Word question truncated to one accepted key: inspect all eight new units, plus previously approved creation products N01,N02,N03,N09,N10,N12; mark each CONFIRMED / NOT-AFFECTED / UNVERIFIED with source and SHA.
- Mechanism B — pre-answer lead/figure/hint supplies the exact learner decision: inspect the same approved artifacts and relevant shared helper, source figures, captions, answer-gated flow.
- If new defects are confirmed outside the eight IDs, record findings and **propose an additional exact revision**, do not edit silently. When existing curriculum instructions teach a scaffold intentionally, do not label it leakage without examining the intended decision.

## Change / keep / permissions

CHANGE (only after exact user approval): eight target small learner-answer/lead blocks, their corresponding answer choices and narrow regression tests; minimal helper adaptation if necessary and explicitly described before execution.

KEEP: 123 original source IDs; original Word unchanged; original nine PNG byte hashes and nonleaking placement; other units and curricula; existing six accepted lesson contents; math practice and physics modes; learner progress identities/revision migration safety; main and published Pages; no new staging/deploy or Vercel changes. Avoid changing 127-item count by default; if additional steps are necessary, return with exact revised proposal and progress migration plan.

## Verification plan

- For each of eight blocks: original exact question → meaning/operation analysis → local implementation → independent math check → 4-choice answer type + distractors → answer/hint leakage → genuine app screenshot with numbered confirmation marker and full SHA → user 細部OK/要修正.
- After each root-cause class: affected approved-creation impact ledger and second pass; no open confirmed applicable defect.
- Final Gate②: wrong→hint→retry→correct and progression, 320px/390px/desktop, KaTeX, image identity/reveal, source IDs, persistence/reset, review isolation, prior math and physics regression, actual CI evidence with full SHA.
- Gate③ only after verified Gate② and separate authorized release-candidate hosted app URL; explicit user 総チェックOK required.

## Approval gate

**Approval received for these eight blocks only on 2026-10-20.** Feedback that materially changes it requires a new proposal revision, presented and approved before execution. Main merge / publication separately gated.


## Post-approval checkpoint

P-004 eight learner corrections have been implemented on draft PR #101 only. Final source head for full CI: `7fce8fa93511df5406602d1a3e0d3c6e1f3dfdf9`; [Math textbook CI 39343256282](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39343256282) **success**. Includes 188 Vitest assertions, 127-step mobile/desktop walkthrough, 16 repaired-question 320/390px wrong→reopen→hint→correct scenarios, physics and practice regressions. Genuine 48 repaired screenshot evidence: code `e397d77e39168958499eafd8f7ad0025243ee7e6`, image commit `d74b210187d90c98628271f173ed5cf795c3f964`. Separate confirmed source-leakage findings N06-Q11 and N14-Q05 **are not included in this P-004 approval**. Gate② and Gate③ remain open pending complete impact-loop closure and user acceptance.
