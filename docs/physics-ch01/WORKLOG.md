# Physics Chapter 1 Worklog

## 2026-09-28 — workspace migration

### Repository state

- upstream source: `paulfields83/kyotsu-step-web`
- working fork: `rrikunagasige-dot/kyotsu-step-web`
- working branch: `chatgpt/physics-ch01-textbook-v2`
- fork preserves upstream repository history and current main.

### Read before work

- README.md
- WORKFLOW.md
- docs/ARCHITECTURE.md
- src/domain/textbookSchema.ts
- src/pages/TextbookUnitPage.tsx
- src/pages/LearningSetupPage.tsx
- src/data/textbookUnits.ts
- src/data/textbookUnits.test.ts
- e2e/textbook-flow.spec.ts

### Source packet available in conversation

- current upstream repository ZIP
- 第1〜5章教材 mother-template ZIP
- figure.zip
- Chapter 1 figure set 1–17

### Current findings

- current app has one built-in textbook unit: `physics-a-displacement-velocity`
- current textbook schemaVersion is 1.0
- current UI already supports sequential sections and persisted progress
- current completion copy hard-codes `A 変位と速度` and `78`
- current figure rendering is plain image rendering with no answer-mask overlay
- current choice generation can fall back to answers from other items in the same unit
- current data is concentrated in `src/data/textbookUnits.ts`

### Decisions

- retain existing textbook state machine
- introduce schemaVersion 1.1 rather than silently changing 1.0 semantics
- 1A becomes the V2 golden unit before importing 1B–1G
- Figure V2 uses one source image plus percentage overlay metadata
- V2 published items use explicit distractors
- chapter 1 data will be split by unit

### Next

P01 implement Textbook Schema 1.1.
