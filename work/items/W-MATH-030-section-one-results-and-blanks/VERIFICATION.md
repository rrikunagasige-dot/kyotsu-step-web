# W-MATH-030 / P-003 verification

Stage: local verified; frozen-source CI/public checks pending.

- Exact46 response positions match approved ITEM_ID_DESIGN, across45 design locations; 291 active decisions and71 stages; all106 mother questions mapped.
- Original S4 explanatory prose retained. Existing mathematical contracts preserved for surviving IDs; six replaced IDs archived rather than repurposed.
- 42 test files /464 tests PASS, including per-item references, source row selection, all formulae before/after answers, and all7 previous-revision migrations with wrong/retry.
- Protected math-practice/physics/domain data: 11 files /120 tests PASS.
- Current written equalities408 /668 distractors checked at10 assignments; coefficient-expression alternatives also checked symbolically without imposing concrete coefficient constraints. Nine historical equivalent-but-wrong-requested-form alternatives remain explicitly identified.
- Legacy independent polynomial/equation checks132/141 and N01 current11x55 PASS.
- Build and scoped ESLint PASS.
- Local compiled playthrough: 21 flows /873 correct answers at320,390,1440; wrong/retry on every S5 decision, references checked per current item, history conclusions, reset, no page or formula overflow. The last change corrected two new NE01 label exponents from Unicode text to mathematical superscripts; authoritative exact-source CI will repeat the complete suite.
- Initial browser failures and fixes: intermediate formatter edit interrupted the first development-server run; second full pass identified one NE01 parenthesized factor exceeding320px. Explicit factor-continuation layout fixed it. Final local compiled suite passed.

Technical verification does not imply user final pedagogical acceptance.
