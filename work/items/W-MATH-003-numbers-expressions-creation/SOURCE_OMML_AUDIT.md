# Source audit — raw DOCX / math and figures restored

Date: 2026-10-17
Work: W-MATH-003 / Approved P-001
Status: **RAW-SOURCE-RECOVERED / PILOT-MATH-AUDIT-IN-PROGRESS**

## Exact uploaded source identity

- Original uploaded name: `01_数と式_教科書モード_対話段階導入版_v2(1).docx`
- Format: Office Open XML DOCX (ZIP).
- File bytes: **212,863**.
- SHA-256: `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`
- Contains **397 `m:oMath` nodes**, **14** image binaries `word/media/image1.png` through `image14.png`.
- Actual paragraph order confirms **16 units**, **233 source question labels**, and **14 referenced original diagrams**. All 233 question labels checked by docx XML paragraph count and independent Pandoc source extraction.
- Source itself states `解答は別冊`; **answer booklet is not part of this upload**. Derived solutions must be independently verified, not presented as supplied author-approved answers.

## Provenance and extraction method

Directly opened uploaded original DOCX, enumerated `word/document.xml`, math OMML and media with ZIP+lxml. Converted the same DOCX to CommonMark with Pandoc (its Word reader preserves most OMML as LaTeX, unlike the prior lossy plain-text index). Inspected all 14 actual image binaries as image contact sheet. No OCR, no invented equations.

The 53-page layout in the original Library index is a separate rendition; current raw-source audit confirms the underlying XML and media, not that every Word page has been independently rendered at the exact user authoring environment.

## Corrected figure inventory (previous estimate of 12 was WRONG)

| Original figure ID | Media file | Mathematical meaning | Proposed safety gate |
| --- | --- | --- | --- |
| N03-F01 | image1.png | 2×2 product correspondence `(2x+1)(3x+4)` | 4 interior products unfilled before reasoning |
| N04-F01 | image2.png | symbolic `(a+b)^2` product correspondence | unfilled, not a geometric length model |
| **N05-F01** | **image3.png** | generic たすき掛け cross coefficients `(px+q)(rx+s)` | no candidate answer prior to selection |
| **N05-F02** | **image4.png** | `(x+1)(4x+3)` check and cross-term coefficient | AFTER example answer, not prior |
| N08-F01 | image5.png | points `−5,0,2.3` on line | no distance labels before answering |
| N09-F01 | image6.png | point `−2.1` between `−3,−2` | integral/fractional split still unresolved |
| N11-F01 | image7.png | sign reversal `2,5` versus `−2,−5` | correct same-scale alignment and signs |
| N11-F02 | image8.png | `x<7/3` and `x≥−1` open/closed endpoints | displayed after derivation |
| N12-F01 | image9.png | `x>−7/2`, `x≤1/2` shown separately | intersection withheld until Q4 |
| N12-F02 | image10.png | `x≤2`, `x≤5/3` shown separately | no stronger upper bound answer before Q7 |
| N12-F03 | image11.png | `11≤x<13` with integers 11,12 marked | reveal AFTER Q14/Q15 |
| N13-F02 | image12.png | symmetric positions `−5,5` at distance 5 | AFTER Q1 |
| N13-F01 | image13.png | distance `|x−1|` when `x>1,x<1` | distances shown as unanswered `?` |
| N14-F01 | image14.png | `|x|<3` versus `|x|≥4` | AFTER both examples |

**Root cause of previous wrong count:** N05 contains two illustrations. The previous text index/summary incorrectly recorded N05 as having none. This was found only when opening raw DOCX and inspecting its embedded images.

## Original source mathematics — four pilot units

| Pilot | Original source markers | OMML-restored examples | Source figures |
| --- | ---: | --- | --- |
| N01 | 10 | `−2x`, `x²`, `−x²y²`, `5x³y`, `3x²−5x+6−5x²+2x−3` | no |
| N03 | 13 | `a³·4a⁵`, `(−2x³y²)³`, `(2x+1)(3x+4)`, `(3x−1)(2x²−x+5)` | N03-F01 |
| N10 | 21 | `√125`, `√a√b`, `√a/√b`, `√8+√50`, `√3/(√3+√2)` | no |
| N12 | 15 | `x−2<3x+5` and `x+4≤5−x`; `3x+2≤2x+4≤9−x`; pastry/pudding problem | N12-F01/F02/F03 |

The original N10 proof explicitly assumes **`a>0,b>0`**. Keep this text faithful. The more general validity of the product identity with `a,b≥0` is independent mathematical knowledge, not the exact source statement. N01 `5x³y` viewed as an x-polynomial has degree 3 formally in `R[y][x]`; if treating y as an arbitrary specialized numeric coefficient, `y=0` creates a zero polynomial, so the exact pedagogy must clarify what "y is constant" means.

## Quality gates after file recovery

- **RAW FILE READER: PASS** — 397 math objects, 14 image binary objects, 233 original question labels, source title and sections verified.
- **FIGURE ID/GEOMETRY: PASS for inventory and initial visual inspection**, not all app rendering.
- **PILOT SOURCE FORMULAS: PASS for recovered statements**. Independently solve 59 source markers and check proof assumptions separately. See `PILOT_SOLUTION_AUDIT.md`.
- **ALL 233 MATHEMATICAL SOLUTIONS: NOT-YET-DONE** — do not mark chapter COMPLETE merely from inventory counts.
- **AUTHOR ANSWER BOOKLET: NOT PROVIDED** — no claim of agreement to unavailable official answers.
- **APP IMPLEMENTATION & USER ACCEPTANCE: NOT-YET-DONE**. No `src/`, `public/`, progress or other modes changed.

Do not commit the entire original DOCX or bulk-reproduce publisher textbook material; preserve provenance/hash and work on authorized original upload in the conversation.
