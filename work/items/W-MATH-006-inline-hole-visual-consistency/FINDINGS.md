# W-MATH-006 — Findings
## F-001 CONFIRMED / VISUAL
Published N12 uses a blue-outlined small square □ in coefficient slot (Q01); published N02 Q01 uses established rectangular 「選択」 in its formula. Observed directly in GitHub Pages on 2026-10-18 JST; the difference is in visual component and not in math content.
## F-002 CONFIRMED / ROOT CAUSE
main TextbookFormula.tsx branches on `n12-p002-` and displays □ plus `reading-formula-choice--token`; global.css gives min 44px square, border-width 2, radius .25rem. The generic formula choice displays 「選択」 with thinner rectangular border.
## F-003 CONFIRMED SOURCE ONLY / LINKED DRAFT
W-MATH-005 draft PR #80 adds `n01-r3-`, `n03-r3-`, `n09-r3-` to the same token-style branch; all nine will inherit the difference unless corrected. No assumption they are published.
## F-004 NOT-AFFECTED BY SAME SPECIAL BRANCH
Existing N02 ordinary formula choices do not use token prefixes and remain the visual reference. Other old math textbook choices remain unchanged by the proposed prefix-limited fix. Physics and practice use other presentation flows, and their detailed visual QA is out of scope.
