# W-MATH-011 — N11 proof/derivation diagnosis

Status: **CONFIRMED current design failures (learner app draft source SHA \`ad77318b37e90b9c39150b14ee706283b3f59355\`), NO FIX IMPLEMENTED**.
Source and lesson authority listed in [proposal](./P-001_Q01_Q04_DESIGN_PROPOSAL.md).

| Finding | Source scope | Symptom and causal mechanism | Impact |
| --- | --- | --- | --- |
| F-011-01 / ERROR-ANSWER-LEAK | N11-Q01 lead / group intro | Says beforehand “左右の位置が逆転する”, giving away the sign-change principle. Original N11-F01 does not print the final comparison, and may remain before Q01. | Need replace lead/intro only; preserve N11-F01 exact bytes |
| F-011-02 / ERROR-REASONING | N11-Q02 | Correct value \`b-a\` alone does not make learner infer that \`(b+c)-(a+c)=b-a>0\` and therefore \`a+c<b+c\`; explanation is merely post-answer. | Add separate conclusion/why decision; keep old Q02 answer record |
| F-011-03 / ERROR-CIRCULAR-PROOF-SKIP | N11-Q03 | Factor \`bc-ac=c(b-a)\` is supplied, then a single three-case conclusion is chosen; positive/negative/zero signs not built by student. Should derive from **previous distributive and sign-of-product rules**, NOT from the inequality multiplier theorem being proved. | One local factor token + positive/negative/zero decisions; change source Q03 active answer meaning and migrate old progress |
| F-011-04 / ERROR-CAUSAL-CONSISTENCY | N11-Q04 | The lead says “×(−1/5), then +3” but original two true answers are \`-a/5>-b/5\` and \`3-a>3-b\`. The actual sequential composite would be \`3-a/5>3-b/5\`. | Two independent branches; preserve truth/source scope, don't rewrite the original Word or claim final inequalities are mathematically wrong |
| F-011-05 / ERROR-QA-SCOPE | W-MATH-003 previous Gate② record | Previous independent audit checked valid keys/distractors/corrected cognitive tasks but did not detect structural proof and answer-leak errors in first N11 block. | Reopen affected Gate② + human Gate① for this block on new SHA after approved correction, keep versioned older evidence |

**Existing lesson already covers all five causes:** Math Master §§7–8,11,18,43,51–54, Math Textbook Master Skill §§2–5,7–13,15,18–19. **No new/revised project lessons authorized or needed.**
Previously audited W-MATH-004 N11 D-class Q01/Q03/Q04 preimplementation risks already predicted several shortcomings; this does not mean N12 approved correction is defective. Source Word OMML math incompletely extracted as plain text; the current N11 coded expressions are the independent mathematical reconstruction.
