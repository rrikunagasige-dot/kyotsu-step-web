# Findings — W-GOV-008/P-003 visual pilot

## F-001 — CONFIRMED
P-002 app markers exist with strict stable IDs and original source material; its previous CI verified mobile/desktop, wrong/correct and progress isolation, but passing tests did not produce an accessible image sheet.

## F-002 — RISK
On the initial reading flow only the next question may be visible. To avoid a counterfeit all-at-once overview, the capture test must **advance through real answers**, taking each screenshot before that numbered marked decision is answered. Separate 320/390 desktop QA is retained; capture must fail on wrong SHA or unexpectedly missing mark.

## F-003 — RISK
A GitHub Actions artifact alone may be a downloadable ZIP. That is **engineering evidence**, not the user handoff. The reviewer-ready state demands **individual GitHub-rendered actual images** in the sheet; if extraction/embedding fails, remain BLOCK-CHECK-PENDING.

## F-004 — AUTHORIZATION
A new public app host would need separate approval. Existing public-repository standard Ubuntu GitHub-hosted Actions are documented as free for use, but this Work creates no paid runner/provider. Screenshot artifact retention set to one day.
