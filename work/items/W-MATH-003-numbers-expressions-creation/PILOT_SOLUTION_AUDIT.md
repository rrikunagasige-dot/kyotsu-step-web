# Verified pilot math and reasoning — N01 / N03 / N10 / N12

Status: **SOURCE-RESTORED / SOLUTIONS-INDEPENDENTLY-DERIVED (not publisher-answer-key-verified)**
Date: 2026-10-17
Input SHA-256: \`93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa\`
Command: CMD-WORK-002 / approved W-MATH-003 P-001
Counts: 10 + 13 + 21 + 15 = **59 original source question labels**. This document is **internal solution QA**, NOT a learner-visible article. All answer expressions must be concealed until appropriate state unlock in the app.

Notation uses source Word's mathematical expressions recovered from native OMML via Pandoc; the source specifies that the answer key is in a *separate booklet* not provided. Mathematical values below are independently calculated and cross-checked for key symbolic simplifications with SymPy.

## N01 — coefficients, degree, like terms (Q1–Q10)

Original expressions: \(-2x\), \(x^2\), \(-x^2y^2\), \(5x^3y\), \(axy\), \(3x^2-5x+6-5x^2+2x-3\), \(x^3-2x^2+x-x^3+3x-1\).

| Q | Full solution / source-aligned reasoning | Node decision and dependency |
| --- | --- | --- |
| 1 | \(-x^2y^2=(-1)\cdot x\cdot x\cdot y\cdot y\). | Factor the product; keep minus as part of coefficient. |
| 2 | \(-2x\to(-2,1)\); \(x^2\to(1,2)\); \(-x^2y^2\to(-1,4)\). | Formalize coefficients/degrees AFTER Q1, never quiz unknown names. |
| 3 | \(5x^3y=(5y)x^3\) (as a polynomial in \(x\)). | Choose variable x; y becomes part of coefficient. |
| 4 | As \(x\)-polynomial: \((\mathrm{coeff},\deg)=(5y,3)\); as \(y\)-polynomial: \((5x^3,1)\). | Explain distinction variable versus coefficient. In polynomial ring \(\mathbb R[y][x]\) degree 3; numeric specialization \(y=0\) needs caveat. |
| 5 | \(axy\) has coefficient \(ay\) w.r.t. \(x\), and \(ax\) w.r.t. \(y\). | Immediate transfer. |
| 6 | Sort terms: \((3x^2-5x^2)+(-5x+2x)+(6-3)\). | Group like parts, preserve minus signs; Q7 depends on Q6. |
| 7 | \((3-5)x^2+(-5+2)x+(6-3)=-2x^2-3x+3\). | One continuous derivation, not three separate visual answer cards. |
| 8 | Degree 2, constant term 3, **after** Q7. | Use simplified nonzero terms, not raw left-to-right scan. |
| 9 | \(x^3-2x^2+x-x^3+3x-1=(1-1)x^3-2x^2+(1+3)x-1=-2x^2+4x-1\). | Degree can drop after cancellation; Q10 depends on Q9. |
| 10 | A quadratic polynomial, degree 2: cubic coefficients cancel exactly. | Must include explanation, not bare numeric answer. |

**Learning flow:** example concrete products → **単項式**, **係数**, **次数** → designated variable → **項/多項式/同類項** → independent grouping and cancellation → transfer. Use ≤few learner-facing headers; preserve N01 internally.

## N03 — laws of exponents and expansion (Q1–Q13)

| Q | Full solution / source-aligned reasoning | Node/figure placement |
| --- | --- | --- |
| 1 | \(a^3(4a^5)=4a^{3+5}=4a^8\). Numeric factor 4 is not an occurrence of \(a\). | Prior to general rule. |
| 2 | \(a^m a^n\) contains \(m+n\) copies, \(a^{m+n}\). | Define when \(m,n\) positive integers, as in source. |
| 3 | \((a^m)^n\) contains \(m\) repeated in \(n\) groups, \(a^{mn}\). | Product of counts not sum. |
| 4 | \((ab)^n=(ab)(ab)\cdots(ab)=a^n b^n\). | Regroup factors using commutative/associative laws. |
| 5 | \((-2x^3y^2)^3=(-2)^3(x^3)^3(y^2)^3\). | Whole bracket raised to 3; negative sign included. |
| 6 | \((-2)^3x^9y^6=-8x^9y^6\). | Depends on Q5. |
| 7 | \(x^2(x^2-3x+4)=x^2x^2+x^2(-3x)+x^2\cdot4\). | Three terms must be represented; no answer reveal. |
| 8 | \(x^4-3x^3+4x^2\). | **展開** name after meaningful operation. |
| 9 | \((2x+1)(3x+4)=2x(3x+4)+1(3x+4)\). | **N03-F01** correspondence table: four unanswered product slots, before solving Q10. |
| 10 | \(2x\cdot3x+2x\cdot4+1\cdot3x+1\cdot4=6x^2+8x+3x+4\). | Keep four products uncombined. |
| 11 | \(6x^2+(8+3)x+4=6x^2+11x+4\). | Depends on Q10; no premature coefficient label. |
| 12 | \((3x-1)(2x^2-x+5)=3x(2x^2-x+5)-(2x^2-x+5)\). | Two outer multiplications before three inner. |
| 13 | \(6x^3-3x^2+15x-2x^2+x-5=6x^3-5x^2+16x-5\). | Single coherent expanded→collected frame. |

**Figure source QA:** 633×365 PNG contains top columns \(3x,4\), left rows \(2x,1\), inside exactly 4 “?” placeholders. This is structurally suitable before Q10 and not an answer leak by itself. Keep original geometry for pilot rather than inventing decorative diagram.

## N10 — radicals, proof, rationalization (Q1–Q21)

The source explicitly proves \(\sqrt a\sqrt b=\sqrt{ab}\) and \(\sqrt a/\sqrt b=\sqrt{a/b}\) **under \(a>0,b>0\)**. These are the original hypotheses and must not be silently rewritten. Product identity may be generalized to nonnegative inputs separately, after source distinction.

| Q | Complete calculation / reasoning | Pedagogical target |
| --- | --- | --- |
| 1 | \((t\sqrt5)^2=5t^2=125\Rightarrow t^2=25\). | Square candidate only; positive-root sign not yet inferred. |
| 2 | Since \(t>0\), \(t=5\); so \(\sqrt{125}=5\sqrt5\). | Sign check required. |
| 3 | \((\sqrt a\sqrt b)^2=(\sqrt a)^2(\sqrt b)^2=ab\) for \(a,b>0\). | **Proof** begins; justify equality under stated hypotheses. |
| 4 | \(\sqrt a\sqrt b>0\), and it has square \(ab\); therefore \(\sqrt a\sqrt b=\sqrt{ab}\). | Square equality alone not sufficient without sign. |
| 5 | \((\sqrt a/\sqrt b)^2=(\sqrt a)^2/(\sqrt b)^2=a/b\) because \(b>0\). | Prevent zero denominator. |
| 6 | \(\sqrt a/\sqrt b>0\), hence \(\sqrt a/\sqrt b=\sqrt{a/b}\). | Proof closure using square+sign. |
| 7 | \(\sqrt6\sqrt8=\sqrt{48}=\sqrt{16\cdot3}\). | Valid source input. |
| 8 | \(\sqrt{48}=4\sqrt3\). | Q7→Q8. |
| 9 | \(\sqrt8+\sqrt{50}=2\sqrt2+5\sqrt2\). | Apply root extraction separately; no false additivity. |
| 10 | \(2\sqrt2+5\sqrt2=7\sqrt2\). | Like radicals, not \(\sqrt{58}\). |
| 11 | \((\sqrt2-\sqrt3)^2=(\sqrt2)^2-2\sqrt2\sqrt3+(\sqrt3)^2\). | Distinct labeled Example; prior multiplication identity N04. |
| 12 | \(2-2\sqrt6+3=5-2\sqrt6\). | No duplicate final line in another card. |
| 13 | \((\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=7-2=5\). | Conjugate structure reused later. |
| 14 | Multiply numerator and denominator by same **nonzero** factor; fraction remains equal. | Explain equal-ratio invariant. |
| 15 | \(\frac{1}{2\sqrt3}\cdot\frac{\sqrt3}{\sqrt3}=\frac{\sqrt3}{2(\sqrt3)^2}\). | Factor choice is the meaningful blank. |
| 16 | \(\frac{\sqrt3}{2\cdot3}=\frac{\sqrt3}{6}\). | Name **有理化** after deriving it. |
| 17 | \(\frac{\sqrt3}{\sqrt3+\sqrt2}\cdot\frac{\sqrt3-\sqrt2}{\sqrt3-\sqrt2}\). | Choose conjugate; denominator is nonzero. |
| 18 | \((\sqrt3+\sqrt2)(\sqrt3-\sqrt2)=3-2=1\). | Denominator first as source directs. |
| 19 | \(\sqrt3(\sqrt3-\sqrt2)=3-\sqrt6\), denominator \(1\). | Formula chain finished. |
| 20 | \(\frac{2-\sqrt3}{2+\sqrt3}\cdot\frac{2-\sqrt3}{2-\sqrt3}=\frac{(2-\sqrt3)^2}{4-3}\). | Factor selected independently. |
| 21 | \((2-\sqrt3)^2/(4-3)=(4-4\sqrt3+3)/1=7-4\sqrt3\). | Transfer and short correctness check. |

**Critical proof warning:** the original root law’s \(a,b>0\) is pedagogically sufficient, even though broader domains exist. Do not present the broader version as if quoted from the Word. \(\sqrt a+\sqrt b=\sqrt{a+b}\) is not generally true. Proof/Example headings must not visually collapse into the same style. This pilot has no original image, and none should be invented without a specific visual learning need.

## N12 — systems, number line, integer story (Q1–Q15)

| Q | Complete calculation / reasoning | Node/figure placement |
| --- | --- | --- |
| 1 | \(x-2<3x+5\Rightarrow-7<2x\Rightarrow x>-7/2\). | First independent inequality. |
| 2 | \(x+4\le5-x\Rightarrow2x\le1\Rightarrow x\le1/2\). | Second independent inequality. |
| 3 | At \(x=1\), Q1 condition holds; Q2 condition \(1\le1/2\) fails. Hence \(1\) is **not** a system solution. | Both constraints must be checked. |
| 4 | Intersect \(x>-7/2\) and \(x\le1/2\): \(-7/2<x\le1/2\). | **N12-F01** shows two bands only; do not reveal joined result before response. |
| 5 | \(3x+2\le2x+4\le9-x\) ↔ \(3x+2\le2x+4\) **AND** \(2x+4\le9-x\). | Do not replace with direct outer comparison only. |
| 6 | First: \(3x+2\le2x+4\Rightarrow x\le2\). Second: \(2x+4\le9-x\Rightarrow3x\le5\Rightarrow x\le5/3\). | **N12-F02** shows both original bounds on one scale. |
| 7 | At \(x=2\), second fails since \(2>5/3\); intersection is \(x\le5/3\). | Choose tighter upper bound. |
| 8 | Let \(x\) = cream-puff count; pudding count \(20-x\). | First domain-aware choice. |
| 9 | \(x\in\mathbb Z,\ 0\le x\le20\). | Quantity counts cannot be arbitrary real values. |
| 10 | Total \(T(x)=50+180x+130(20-x)=2650+50x\) yen. | Explain fixed box cost + both item kinds. |
| 11 | \(3200\le50+180x+130(20-x)<3300\). | Translate both bound directions faithfully. |
| 12 | \(3200\le2650+50x<3300\). | Reduce to one quantity. |
| 13 | \(550\le50x<650\Rightarrow11\le x<13\). | Divide by **positive** 50, preserving signs. |
| 14 | Intersect with \(x\in\mathbb Z\), \(0\le x\le20\): \(x=11\) or \(x=12\). | Noninteger values in [11,13) are not feasible. |
| 15 | \(T(11)=2650+550=3200\); \(T(12)=2650+600=3250\) yen. Both meet \(3200\le T<3300\). | Reveal **N12-F03** only AFTER Q14 answer; after Q15 if testing total verification. |

**Figure source checks**: original N12-F01 displays top \(x>-7/2\) open \(-7/2\) and bottom \(x\le1/2\) filled \(1/2\). N12-F02 shows \(\le2\), \(\le5/3\), both filled; common scale correctly places \(5/3<2\). N12-F03 shows 11 and 12 filled, 13 open; this is a **full answer image**, so it must not be shown before the learner gives the integer result.

## Cross-pilot review and implementation conditions

1. **Mathematical check:** Source formulas restored; symbol, signs, Q marker count and 14 original image references checked; key expansions and inequalities independently recomputed with SymPy. Source answer booklet not supplied. All 59 answers above are authored mathematical derivations, not quotations from a separate answer key.
2. **Instructional flow:** Apply the approved math textbook mode: continuous source-faithful text, meaningful inline holes, no premature answers, concept→properties→necessary proof→example, controlled title hierarchy, intentional figure placement.
3. **No over-holing:** 59 source markers are authoring coverage obligations, not a requirement to display 59 equal-weight quiz panels. Multiple markers may be grouped into meaningful coherent paragraphs with their original traceable IDs.
4. **Geometry/figure gate:** Preserve original figure or recreate only if rendering needs dictate and after a new figure spec; no unapproved new figure content. For N03-F01 and N12-F01/F02/F03, ensure no premature full answer leak.
5. **Next step:** Transform N01 as the first complete learner-facing pilot prose with inline cognitive holes and review, then apply the design to N03/N10/N12. The user already approved W-MATH-003 P-001 as a workflow, but exact learner-facing pilot should be reviewed before mass rollout. No changes outside current approved chapter.
