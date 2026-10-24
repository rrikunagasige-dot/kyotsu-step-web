# Verification

Local working-tree checks before freeze:
- 37 test files / 418 tests passed, including current-edition protection, old-edition regressions, rendering and review slices.
- 50 independently parsed polynomial identities, 8 substitutions each; every corresponding wrong option differs.
- 21 browser flows (320px,390px,1440px × seven units), 546 correct interactions plus wrong/retry per unit and width.
- All stages reachable, no page horizontal overflow or KaTeX errors, history expandable, restart returns to first item and top.
- Production TypeScript/Vite build passed. Targeted ESLint passed.

Final frozen-source CI repeats verification on the compiled build, then public release verification.
CI artifacts contain report.json, math.json and actual screenshots. Local results are not claimed as exact-commit CI evidence.
Public handoff is complete only when release.json.sourceSHA equals the candidate and hosted interaction checks pass.
User pedagogical acceptance: PENDING. Next two themes: NOT modified by this Work.

## Frozen publication verified

- Learner source: `15509ec12c24cfbf74efba82306bd093a94bd28e`.
- Hosting workflow commit: `201776527b63d4b9e347b433bb94c6a7ea9225fc`.
- [Exact-source run40051308092](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40051308092): completed SUCCESS.
- 418 tests, protected scope, 50 independent calculations, build, compiled21 full flows and public21 full flows passed.
- Each full-flow suite covers546 correct interactions plus wrong/retry, history expansion and restart at320/390/1440px.
- Public sixteen-unit route/reload/history-isolation verification passed before the final public full-flow suite.
- Direct HTTP release.json independently matched15509ec1, workflow20177652, three themes,16 units,375 total decisions.
- Artifact `first-theme-15509ec1-verification`, ID12543576397, SHA256 `61b1935fd0c4e07e6b9f6bbf63ceb569f223144fb753e084cee3c84f58f99649` contains actual compiled/public reports and screenshots.
- Final local frozen-build21-flow suite also passed. Local direct browser networking to GitHub Pages returned EMPTY_RESPONSE;
  public interaction evidence comes from the successful GitHub-hosted runner, not a claimed local public screenshot.

State: PUBLISHED_FOR_USER_REVIEW.
Gate①/Gate③ user quality acceptance remains PENDING; independent Gate② acceptance is not manufactured from this agent's tests.
No second-theme lesson repair started. The hosting workflow remains pinned to15509ec1; this evidence-only record does not change learner source.
