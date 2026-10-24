# R1 — visible inline blanks and explicit derivation links

Baseline learner source:15509ec12c24cfbf74efba82306bd093a94bd28e.
User feedback:「非常的整齐不错。但是咋说呢，空就是填空没有。然后推导和诱导不详细还得写」.
The positive evaluation applies to the layout. It does not accept the content as sufficiently detailed.
Existing authorization: finish the first theme against the accepted detailed-design standard and publish it for direct review.
The first-theme scope, layout and three headings remain. No second-theme lesson change.

## Root cause and limited repair
- Most interactive holes said 選択 and many required a completed expression. These did not visually convey an unfinished equation.
- Local calculations alone did not explain the purpose of a transformation or how its result was used next.
- Saved correct answers replaced holes, while restart was available only at the bottom.

Render visible □ controls in the first theme; preserve tap-based selection on phones.
Add24 authored local decisions, including coefficient blanks with the unchanged variable factor after the hole.
Keep original answers and previous60 added decisions. First-theme decisions182→206; chapter375→399.
Add authored problem-level explanations before/after transformations in firstThemeDeepening.json.
Show a top restart control and explain that solved holes display saved answers. No silent progress wipe.
Advance revisions and archive previous attempts; only the new24 IDs are unanswered after migration.
Recursive insertion respects explicit target dependencies and rejects cycles/missing anchors.

## Evidence / status
-37 test files /426 tests passed, including migration from the previous public edition for all seven units.
-71 independent polynomial checks, eight substitutions each; wrong options differ.
-Current-edition UI flow uses the same actual runtime data and tests visible □, retry, full flow and restart at320/390/1440px.
-Visual QA inspected N01 and N02 inline coefficient holes at320px.
-Source shape and other themes protected by scope and baseline hashes.
-User content acceptance remains pending. Publication is for immediate user review, as previously instructed.

The user's meaning of “no blanks” is not assumed to establish a browser-state bug. Both verified contributors
(the 選択 label and whole-expression selection) are addressed; saved-answer behavior is made explicit.

## Public delivery verified

- Learner source `f16275079d3b39758f2da9ceb6b4e156a48c4b9e`.
- Hosting commit `383caa806b4154b23dbbf99a7062082cc16329b4`.
- [Run40052655846](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40052655846) completed SUCCESS.
-426 tests,71 independent polynomial checks, compiled21 flows and public21 flows passed.
-Each full-flow suite exercised618 correct answers, wrong/retry, history expansion and restart across320/390/1440px.
-Public16 routes/reload/history isolation passed. Direct HTTP release manifest matched f1627507, three themes,16 units,399 decisions.
-State: PUBLISHED_FOR_USER_REVIEW. Layout's prior positive feedback is preserved; R1 content acceptance remains PENDING.
