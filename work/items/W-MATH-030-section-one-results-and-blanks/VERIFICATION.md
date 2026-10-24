# W-MATH-030 / P-003 verification

Stage: PUBLISHED_FOR_USER_REVIEW. Final exact-source/public workflow SUCCESS.

- Exact46 response positions match approved ITEM_ID_DESIGN, across45 design locations; 291 active decisions and71 stages; all106 mother questions mapped.
- Original S4 explanatory prose retained. Existing mathematical contracts preserved for surviving IDs; six replaced IDs archived rather than repurposed.
- 42 test files /464 tests PASS, including per-item references, source row selection, all formulae before/after answers, and all7 previous-revision migrations with wrong/retry.
- Protected math-practice/physics/domain data: 11 files /120 tests PASS.
- Current written equalities408 /668 distractors checked at10 assignments; coefficient-expression alternatives distinguished by counterexamples before imposing concrete coefficient constraints. Nine historical equivalent-but-wrong-requested-form alternatives remain explicitly identified.
- Legacy independent polynomial/equation checks132/141 and N01 current11x55 PASS.
- Build and scoped ESLint PASS.
- Local compiled playthrough: 21 flows /873 correct answers at320,390,1440; wrong/retry on every S5 decision, references checked per current item, history conclusions, reset, no page or formula overflow. The last change corrected two new NE01 label exponents from Unicode text to mathematical superscripts; authoritative exact-source CI will repeat the complete suite.
- Initial browser failures and fixes: intermediate formatter edit interrupted the first development-server run; second full pass identified one NE01 parenthesized factor exceeding320px. Explicit factor-continuation layout fixed it. Final local compiled suite passed.

Technical verification does not imply user final pedagogical acceptance.

## Authoritative final verification

- Source: dfa332facab4c206fc33ad54de4f0a92116169e9; hosting: a0a50c7df3b7e89699dd4e02dc4821a01200ecbf.
- Run40065534607 /job120787873795 SUCCESS. All steps succeeded, including actual-public browser checks.
- 42 files/465 tests;11 protected files/120 tests PASS. Regenerated authoring data exactly matches committed runtime/ledger. Source-scope guard PASS.
- Compiled21 flows/873 correct answers at320/390/1440 PASS; actual public21 flows/873 PASS. Every S5 decision wrong/retry checked; every current-item prerequisite and recorded-history presence checked; zero clipped options, page overflow or formula overflow. Reset, correct-answer rendering, all16 routes/reloads and preserved production-history sentinel PASS.
- Verification artifact12549545887: section-one-S5-dfa332fa-verification,79,503,195 bytes; SHA256 5b3893471ee83453cf4864fb98217883c2638a4b7be9a60bbb4a7c8b7cb0db61.
- Pages artifact12549242803:2,353,576 bytes; SHA256 c2eab42c170c5303cfc71b72f11620de2c89a57dcd3e9ca791e873bc5c6f3d47.
- Independent public manifest fetch confirmed final source, hosting SHA, existing storage namespace,3 themes/16 units. First-section revisions/counts: N01 7/27;N02 6/40;N03 7/39;N04 7/59;N05 7/45;N06 8/41;NE01 6/40.
- Direct image reading used local screenshots; CI artifacts contain authoritative exact-source compiled and hosted screenshots. User's final pedagogical acceptance is still pending.

Clarification: the independent evaluator uses exact numeric counterexamples to distinguish proposed coefficient-expression alternatives, rather than a CAS symbolic-expansion proof. The408 written equality checks are evaluated at10 assignments each, in addition to source/structural and UI checks; they are not claimed as a general formal proof engine.
