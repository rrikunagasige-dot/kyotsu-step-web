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
