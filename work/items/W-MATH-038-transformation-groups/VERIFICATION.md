# W038 verification

Status: LOCAL_IMPLEMENTATION_VERIFIED; exact-source CI and public hosting pending.

P001 and its approval hash are immutable. The original document-only checks remain described in the proposal source commit f297503b. This record adds the approved implementation.

- New33 transformation tests passed, including wrong-source substitution, negative/zero division, mask bindings, source coverage, leakage, grading, numbering and expression continuation. The earlier combined run had67 checks; later additions are recorded separately rather than rewriting that historical count.
- Existing applicable620 learner tests passed. Existing135 workflow tests passed before the final compatibility extension; four new approval-binding tests passed. Exact full current-source rerun is required in CI.
- N11 all39 answers and109 wrong candidates at each320/390/430/1440px passed; both original figures, history, reload, resize, old revisions1–10 and original/new layout switches passed. Current39 grading contracts and revision11 remain unchanged.
- Eight supported display fixtures × four widths =32 real-browser cases passed. The two shared-slot interactions each record one attempt, replace the same row, and leave exactly one terminal state. Excluded pattern fixtures fail explicitly.
- Actual images inspected by the same assistant: source equation, shared comparison column, intermediate operations, complete solution and separate boundary interpretation. This is not an independent second-AI audit.
- Scoped ESLint and TypeScript/build passed. Existing unrelated physics exclusions are explicit in the learner test command, not called whole-repository green.
- Native shared Runtime R01–R06 ran with exact content+display hash binding and dimension-specific dispositions for15 existing cases. No model inference, fit, Gold label or user app acceptance was fabricated.
- N08 r4/r5 original source/readers/CSS and all protected manifests pass.

Evidence: evidence/LOCAL_N11_BROWSER.json, LOCAL_FIXTURE_BROWSER.json, GALLERY.html and command logs. The local sourceSHA is not retroactively relabeled as the later frozen commit; CI will rerun that exact frozen source.
