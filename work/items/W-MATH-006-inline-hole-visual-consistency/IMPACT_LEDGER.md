# W-MATH-006/P-001 linked impact ledger (design-only)
Root-cause signature: exact `TextbookFormula` local-token prefix => □ glyph + `reading-formula-choice--token` instead of established formula `選択` rectangle.
| Scope | Status | Evidence | Action proposed |
| --- | --- | --- | --- |
| Published N12 / W-MATH-004 P-002 | CONFIRMED LIVE | Browser N12 Q01 + main source `n12-p002-` | Restore legacy visual for 11 token buttons only |
| Published N02 formula Q01 | NOT-AFFECTED / REFERENCE | Browser Q01 `2bx+bx=[選択]`; generic source | No edit |
| Draft W-MATH-005 N01 Q07 | CONFIRMED SOURCE ONLY | PR #80 `n01-r3-` same special class | Align three token buttons on existing draft, no release |
| Draft W-MATH-005 N03 Q10 | CONFIRMED SOURCE ONLY | PR #80 `n03-r3-` same special class | Align four tokens on existing draft, no release |
| Draft W-MATH-005 N09 Q08 | CONFIRMED SOURCE ONLY | PR #80 `n09-r3-` same special class | Align two tokens on existing draft, no release |
| Other mathematics textbook stages | NOT-AFFECTED UNDER PREFIX SIGNATURE | No above special prefix | No blanket UI change; unchanged controls should regress |
| Physics learning / Mathematics practice | UNVERIFIED VISUAL (separate renderer) | No direct token branch shown | Regression only, no speculative changes |
Pending: user approval of exact visual treatment and cross-draft impact; then E2E and secondary scan before lesson dedup.
