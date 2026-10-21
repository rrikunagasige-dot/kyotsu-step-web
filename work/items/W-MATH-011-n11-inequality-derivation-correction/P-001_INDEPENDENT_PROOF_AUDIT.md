# W-MATH-011 P-001 — 独立数学・思考ノード監査（N11原問Q01〜Q04）

Status: **INDEPENDENT MATH PASS / FULL CI PASS / REAL USER GATE① PENDING**
Date: 2026-10-20 JST. Frozen reviewed math learner code SHA: `2ebdf7fbb0c7387ae05753c286b3c457da74e17c` (N11 revision 4). Original teacher Word Q01–04 and actual N11 localized source checked; **not** an answer-booklet copy.

## Mathematics: nine staged decisions, independently proved

| Stage | Independent mathematical proof | True correct reply | Incorrect categories checked |
| --- | --- | --- | --- |
| Q01 original | Since −2>−5 by number-line order (−2 right of −5), multiplication by −1 reverses this example `2<5`. | `-2>-5` | reverse order, false equality, incorrect pair |
| Q02 original | `(b+c)-(a+c)=b+c-a-c=b-a` by cancellation. | `b-a` | unremoved c, extra c, subtraction reversed |
| Q02 compare NEW | `a<b⇔b-a>0`. The new right−left gap is the same positive `b-a`, so `a+c<b+c`. | true inequality + positive-gap reason | reverse inequality, wrong equality, reason contrary to inequality |
| Q03 factor NEW | `bc-ac = c(b-a)` from distributivity. | `c` | `-c`, `c^2`, `1` fail **general symbolic identity**; special assignments `c=0/1` do not turn those into general identities |
| Q03 positive NEW | From `b-a>0,c>0`, `bc-ac=c(b-a)>0`, so `ac<bc`. | correct relation + positive difference | reverse sign, false equality, correct relation with wrong sign |
| Q03 negative original ID REVISED | From `b-a>0,c<0`, `bc-ac=c(b-a)<0`, hence `bc<ac`, i.e. `ac>bc`. | correct relation + negative difference | wrong forward direction, equality, correct result paired with false sign |
| Q03 zero NEW | `c=0\Rightarrow ac=bc=0`, thus strict `<` and `>` both fail; division by 0 illegal. | equality + strict order loss | false strict order, false inverted strict order, true equality paired with false preservation claim |
| Q04 fraction NEW | `a<b\Rightarrow b-a>0`. Multiply by `-1/5`: `(-b/5)-(-a/5)=-(b-a)/5<0\Rightarrow-a/5>-b/5`. | relation + negative-multiplier flips | wrong direction, false equality, true direction but false “positive multiplier flips” explanation |
| Q04 second branch original ID REVISED | **Independently restart** from `a<b`, multiply by -1 `-a>-b`, then add 3 `3-a>3-b`. | `3-a>3-b` | reverse order, false equality, contradictory `3+a>3+b` |

Q04 **not** `a<b\to -a/5>-b/5\to3-a>3-b`: that would be a mathematically invalid chain. Sequentially adding 3 to the first branch gives `3-a/5>3-b/5`, which is a different true statement. New text explicitly separates the two valid branches and original source equation targets.

## Response/options and source-coverage

The four teacher-original labels Q01, Q02, Q03, Q04 correspond to **1+2+4+2=9** responses; Q05–Q14 remain 10 existing responses, so N11 has 19. Across other seven previously-authored units: 123 source labels and **132** active app decisions, each with 1 answer + 3 distinct authored distractors, **396 wrong option entries**. Of these, 381 belonged to pre-P-001 candidate; source Q03 and Q04 each replaced their three wrong options, and five added local nodes bring 15 new alternatives, so **21 current wrong alternatives require post-P-001 explicit recheck** and are covered by the nine-row mathematical arguments above. Q01/Q02 wrong choices remain byte-identical to the earlier 6 audited entries. New source still uses same nine byte-identical original PNGs.

The current `TextbookUnitPage` gates reading flow after the first unresolved item; authored first-group order is (Q01)→(Q02 compute→compare)→(Q03 factor→positive→negative→zero)→(Q04 fraction→independent second branch). Thus completed statements only display after the learner's corresponding choice; all new choices are tested with KaTeX and normalized uniqueness. New review photos are linked [here](./GATE1_N11_Q01_Q04_REVIEW_SHEET.md) with true browser run #39440719673 and screenshot commit `3e94827402bb0a1f53101c84fd3d1c8fae907f4c`.

**Careful limits:** This independently justifies the mathematics and pedagogical sequencing on Q01–Q04; it does **not** independently revalidate the pedagogical completeness of Q05–14 or N14. Previous user-identified under-derivation at Q11/Q14 remains in separately scoped future repair; no cross-unit spontaneous code edits. Formal W-MATH-011 Gate② and application-wide Gate③ remain OPEN until final successful CI, human updated visual Gate①, relevant cross-block check and authorized SHA-matching hosted app/user complete play.

## 2026-10-21 final technical checkpoint — source-matched PASS
- **Exact reviewed learner-code SHA**: `2ebdf7fbb0c7387ae05753c286b3c457da74e17c`; review-only draft PR #101. Current branch documentation/image commits have no learner code changes after this SHA (verified compare through previous branch head `4e100705410f6a2917fb04bc6b276ed20e1f99c7`; recheck after this records-only commit).
- [Math textbook full CI #39442017686](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39442017686): **SUCCESS**, all jobs including typecheck/lint/schema, build, source-batch **132 actions** mobile+PC, N11 revised **9 stages** wrong→hint→retry→correct 320/390, repaired prior **24 problems**, N12 26 local operations, old math lessons, physics textbook and math-practice regressions. The CI ran on a documentation-only descendant `4e100705410f6a2917fb04bc6b276ed20e1f99c7`, identical learner code to the frozen SHA.
- [Authentic screenshots #39440719673](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39440719673): **SUCCESS** on exact learner SHA; all **54 N11 images** (9 stages × widths 320/390 × before/wrong/resolved), saved in screenshot commit `3e94827402bb0a1f53101c84fd3d1c8fae907f4c`; mobile Q01/Q02/Q03/Q04 screenshot content inspected. Original two N11 drawings and nine original figure bytes unchanged.
- Independent original-source [9-stage mathematical proof and changed distractor audit](./P-001_INDEPENDENT_PROOF_AUDIT.md) PASS. Four source markers Q01–Q04 preserved, five local answers added, N11 v3→v4 archives old records and reopens precisely Q03/Q04; Q05–Q14 untouched.
- **Status: IMPLEMENTED + TECHNICAL-QA PASS; EXISTING Gate① visual review for *these four newly corrected source-question groups* PENDING**. [Actual review sheet](./GATE1_N11_Q01_Q04_REVIEW_SHEET.md). Gate② affected N11 content must be recrosschecked after explicit human visual acceptance; Gate③ hosted SHA-matching real app + user full-play still unverified and not authorized. **No main merge, public hosting, lesson edit, Word edit, Vercel permission or payment change**.
