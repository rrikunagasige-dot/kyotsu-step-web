# FINDINGS — W-GOV-008/P-002

- Raw PR diff is not a usable approval UI for this user; app review should link to the precise interactive changed area.
- The PR #94 pilot already isolates the real N01/N03 textbook display with ephemeral answer state. Reuse it; no fork of lesson content.
- One optional prop on `TextbookReadingFlow` renders marks only under the preview route. Ordinary app routes pass no such prop.
- The seven target IDs and exact revision/answer checks prevent accidentally reviewing old content; invalid marker IDs halt preview.
- User's OK/NG and correctness of an exercise are distinct inputs.
- Previous Vercel attempt did not produce a verified live preview URL. Publishing of any kind needs a safe authorized preview path and verified head; no billing.
