# Current runtime snapshot and bounded audit evidence
Status: VERIFIED-EXPORT
Frozen learner source: fc27e7f5fbdc28345917276d43602ea4787537bd
Actual native execution:3cea41ef729ec21a6e0b6233346b677b0feffab5
Native run39908283290/job120265153221 SUCCESS;real Vite SSR/real Zod validation;18 frozen source blobs matched. Artifact12481657761,originalZIP SHA256 aa58d74418211c227a6059cb36399ac927b446f5147a9884598eef64b1e2f6fb. [Original29-file artifact ZIP](./native-runtime-audit-original.zip) preserved without modification;includes full runtime-units.json and14 per-unit JSON/TSV exports. Derived local audits are separate files below,not represented as native output.

| Unit | Original Word questions | Current graded items | Ordered actual hints |
|---|---|---|---|
| N01 | 10 | 18 | [TSV](./n01-hints.tsv) |
| N02 | 12 | 12 | [TSV](./n02-hints.tsv) |
| N03 | 13 | 17 | [TSV](./n03-hints.tsv) |
| N04 | 22 | 26 | [TSV](./n04-hints.tsv) |
| N05 | 20 | 20 | [TSV](./n05-hints.tsv) |
| N06 | 16 | 16 | [TSV](./n06-hints.tsv) |
| N07 | 14 | 14 | [TSV](./n07-hints.tsv) |
| N08 | 12 | 12 | [TSV](./n08-hints.tsv) |
| N09 | 14 | 18 | [TSV](./n09-hints.tsv) |
| N10 | 21 | 21 | [TSV](./n10-hints.tsv) |
| N11 | 14 | 31 | [TSV](./n11-hints.tsv) |
| N12 | 15 | 35 | [TSV](./n12-hints.tsv) |
| N13 | 9 | 12 | [TSV](./n13-hints.tsv) |
| N14 | 16 | 38 | [TSV](./n14-hints.tsv) |
| Total |208|290|14 real units|

[Original marker correspondence](./word-source-map-audit.json):PASS for all208 original marker identities/counts,not full-wording/math fidelity. Initial local body threshold incorrectly excluded N01 and failed immediately;corrected to body paragraph28 and compared every map before recording PASS. OMML radicals/powers separately preserved for the seven diagnosed questions (e.g.body418=√6√8,not68).

[Actual visible options](./visible-choices.json) generated using unchanged real src/domain/textbook.ts blob708d7f64bf88b81fb1deed41ee25fd7462091334,executed locally after stripping type-only syntax. It is not a four-options-everywhere fixture. [Narrow exact radical audit](./visible-radical-audit.json) parses all options for56 of290 items using integers/single signed integer×√integer only. Zero equivalent pairs in the actually visible options of those56. Remaining grammar is unverified by that numerical parser.

N10Q08 authored4√12 and8√3 are equivalent (both positive,square192),but current medium scaffold shows4√12,16√3,4√3,so the duplicate pair is not co-visible. Record authored-pool equivalence as a latent data-quality observation;do not invent a current duplicate UI defect or change options under hint-only approvals. Accepted N06Q12 choice repair remains intact.

This is a read-only export/triage record. Seven new hint proposals are [here](../../BATCH_HINT_PROPOSALS_P008_P014.md). No learner edit or global Gate② PASS is inferred from successful schema validation.
