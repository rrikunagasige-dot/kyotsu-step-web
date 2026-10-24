# Local verification — P-003

- Existing workflow baseline69 / legacy engine27 tests PASS before extension.
- Applicable learner suite620 tests PASS (the two documented unrelated physicsTaxonomy/questionSchema failures excluded, not repaired or counted).
- Existing authoring39 tests PASS; new semantic/generation tests19 PASS.
- Python source/corpus/ML fixtures7 PASS. Extended workflow suite final count recorded in CI.
- TypeScript build, changed React/schema lint, production build, exact N07 regeneration PASS.
- e5 actual model revision, weights, tokenizer and pooling are hashed in ENCODER_MANIFEST.json. Real supervised fit recorded in MODEL_OFFLINE.json, not a synthetic performance claim.
- All development evaluations are marked seen. Model statusOFFLINE_ONLY; no unseen accuracy or production-quality claim. SetFit/Qwen experiment limits are explicit.
- Browser four-width verification is pending in production-workflow-ci on frozen source.

Existing learner data, accepted first-title content/IDs/figures, progress and hosting main618e2be2 remain protected. New renderer is opt-in and not registered into current N07. Six user defects remain OPEN for the later lesson correction work.
