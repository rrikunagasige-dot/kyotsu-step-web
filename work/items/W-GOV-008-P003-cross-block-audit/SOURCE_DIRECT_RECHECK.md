# W-GOV-008/P-003 Gate ② — Native Word direct source recheck

Status: PASS (the two approved blocks' source identity, original expressions, original figure binary and derived answers). App-wide/source-233 independent solutions and publisher booklet are outside this Gate ② claim.
Checked: 2026-10-19 JST. User attached original bytes anew to this thread as filename ending `v2(2).docx`. The source DOCX was inspected read-only; no source file or binary was uploaded to the public repository.

## Source identity and native structure
- Newly attached `01_数と式_教科書モード_対話段階導入版_v2(2).docx`: **212,863 bytes**, **SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`**.
- Exactly matches the previously recovered original `v2(1).docx` byte-for-byte by SHA-256 and size, despite the renamed duplicate suffix.
- Fresh direct `word/document.xml` inspection: **397 native `m:oMath` nodes**, **14 files under `word/media/`**, and **233 source question labels** matching previous `SOURCE_OMML_AUDIT.md`. The DOCX itself says the answers are in a separate booklet, which was not provided. No source-booklet truth is claimed.
- Previous Library direct-page read returned 403, so no permission workaround was attempted. The current user explicitly supplied a new authorized local copy; this check uses that attachment.

## Original OMML vs the two current review lesson blocks
| Target | Native source paragraph / prompt (Word body paragraph order) | Current version/verified mathematics | Result |
| --- | --- | --- | --- |
| N01 Q07 | N01 source formula body paragraph 47 contains native OMML `3x²−5x+6−5x²+2x−3`; body paragraph 52 states `【7】` simplify all three groups | `n01Lesson.ts` review revision 2, `formula-r3-q07-x2coef/xcoef/const`, `n01-07`. Independent coefficient grouping `3−5=−2`, `−5+2=−3`, `6−3=3` gives `−2x²−3x+3`; matches reviewed answers and all three source-derived parts | PASS |
| N03 Q10 | N03 source formula body paragraph 121 has native OMML `(2x+1)(3x+4)`; body paragraph 126 states `【10】` four products before like-term collection | `n03Lesson.ts` review revision 2, `formula-r3-q10-p1…p4`, `n03-10`, `n03-11`. Independent multiplication gives four products `6x², 8x, 3x, 4`, raw sum `6x²+8x+3x+4`, collected `6x²+11x+4`; matches answers and chronological resolution | PASS |
| N03-F01 original graphic | `word/media/image1.png`, referenced immediately before N03 `【9】`/`【10】` | GitHub `public/assets/math/textbook/numbers/n03-f01.png` is 6,796 bytes; exact Git blob SHA-1 `fa55954a7b9ee9af2a3ec2c36d1872351bb9c690` **equals** a fresh Git object hash of the source Word's decompressed image1.png bytes | PASS |

The image equality compares original **binary bytes**, not just two visual labels or screenshot resemblance. The mathematical identities were recomputed independently from the original expressions; they were not accepted merely because the existing application contained answer strings.

## Scope and invariants
- The source `【7】`/`【10】` are originally blank-answer prompts. The seven interactive small holes are user-approved P-002/P-003 pedagogical additions; they are not misrepresented as seven original Word question labels.
- This closes the *fresh raw-source comparison* that was F-209 UNVERIFIED. The historical 403 error remains recorded, but a separate explicit user attachment supplied the exact bytes and lifted that blocker.
- All other Gate ② rows rely on previous successful exact-SHA app/governance tests, including N02/N09/N10/N12 scoped related-screen impact and the two named user `細部OK` responses. The full final app Gate ③, publication, `main` merge and billing remain distinct and **not approved**.
