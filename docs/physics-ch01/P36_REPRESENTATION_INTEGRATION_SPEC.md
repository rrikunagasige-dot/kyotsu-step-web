# P36 — Representation Integration / Mask / Leakage Specification

Status: **P36 PASS — AUTHORITATIVE REPRESENTATION SPEC**

Date: 2026-09-29

Inputs:
- P33 representation/dependency map
- P34 contradiction audit
- P35 pedagogy rules
- current Chapter-1 v2.1 source

P36 defines how **text, figure, formula, graph, and interaction** represent one physics idea without split attention or answer leakage.

This is still design/data specification. No app code changes are made here.

---

## 1. Semantic representation group

Every important concept is one semantic object with multiple representations.

Example:

    concept: displacement
    ├─ phenomenon: P1 → P2 movement
    ├─ visual: arrow P1→P2
    ├─ quantity language: position change
    ├─ term: displacement / 変位
    ├─ symbol: Δr
    ├─ relation: r1 + Δr = r2
    ├─ formula: Δr = r2 - r1
    └─ transfer: calculate average velocity

These are views of one concept, not separate lessons.

## 2. Representation-group data contract

Future data should be able to express at least:

    conceptId
    primaryRepresentation
    supportingRepresentations[]
    prerequisites[]
    knowledgeGained
    nextDependencies[]
    questionId?
    figureIds[]
    formulaIds[]
    graphIds[]
    synchronizedReveal[]
    leakageDependencies[]
    scaffoldLevel

## 3. Primary vs supporting representation

For every concept, choose one primary representation.

Examples:
- position/displacement: Visual,
- relative velocity: Phenomenon/Relation,
- v-t slope/area: Graph,
- terminal condition: Relation + Graph,
- projectile trajectory derivation: Math with Visual support.

Supporting representations clarify the primary one; they do not compete for equal priority.

## 4. Co-presence rule

If two representations are required for one reasoning step, they must be visible close together.

Mobile target:
- figure immediately before/after the sentence that uses it,
- formula immediately after the prose that motivates it,
- graph and its slope/area question in the same local reading region,
- no multi-screen search for a representation needed to answer the current hole.

A generic later figure-reading section fails this rule when the figure was needed earlier.

## 5. Representation path

A concept may follow P→V→Q→R→M, V→R→M, P→R→M→G, G→Q→M, M→V→T, or another justified path.

Do not force one universal text→figure→formula order.

## 6. Synchronized reveal

When a learner resolves one semantic relation, linked representations may reveal together.

Example: A3 correct = Δr may insert Δr into the formula, unmask the corresponding P1→P2 label/region, and briefly highlight the same semantic target.

Synchronize only representations of the same concept.

## 7. Synchronized highlight

A correct answer may briefly highlight the filled word, corresponding formula symbol, and corresponding figure/graph region.

Highlight is supplemental; understanding must not depend on animation.

## 8. Figure roles

Each figure usage declares one role:

- **F-CONCEPT** — needed to form the concept; show before/during the reasoning step.
- **F-INFERENCE** — learner extracts information; show with the question.
- **F-EXPLAIN** — confirms/summarizes established knowledge; may appear after resolution.

The same canonical image may have different roles at different stages.

## 9. Mask necessity decision tree

Before creating a mask:

    Does the figure visibly contain the answer?
    ├─ NO → no mask
    └─ YES
         ├─ figure required before answer?
         │    ├─ YES → mask answer-bearing region
         │    └─ NO → show figure after answer
         └─ simpler non-answer-bearing crop/variant possible?
              ├─ YES → prefer it
              └─ NO → use mask

Do not create masks merely because the UI supports them.

## 10. Mask semantic identity

Every mask links to one question, one semantic target, and one answer-bearing region.

Example fields:
- maskId
- questionId
- semanticTarget
- figureId
- answerSemanticId

## 11. Mask completeness gate

A mask passes only when:
1. every answer glyph/symbol is covered,
2. padding prevents partial glyph leakage,
3. duplicate labels do not reveal it elsewhere,
4. mobile scaling preserves coverage,
5. desktop scaling preserves coverage,
6. zoom/responsive layout preserves coverage,
7. reveal cannot occur before resolution,
8. mask and question are semantically one-to-one.

## 12. Leakage channels

| Channel | Pre-answer requirement |
|---|---|
| unit title | must not directly answer active question |
| section title | same |
| heading | same |
| prose | give evidence, not answer text |
| formula | stage/hide answer-bearing term if necessary |
| figure | mask/stage answer-bearing label |
| caption | no direct answer |
| alt text | no direct answer |
| ARIA/mask label | no direct answer |
| note/callout | no direct answer |
| prior answer | only acceptable for meaningful retrieval/transfer |

## 13. Accessibility-safe alt text

Bad pre-answer alt when asking highest-point vertical velocity:

> 斜方投射の最高点で v_y=0 と示した図

Good pre-answer alt:

> 斜方投射の複数点で速度を水平・鉛直成分に分けた図。最高点の鉛直成分の値は学習問題のため非表示。

After resolution, accessible explanatory text may state the relation.

Accessibility and anti-leakage are both requirements.

## 14. Caption staging

If a canonical caption leaks the active question, use a neutral pre-answer caption and restore a fuller explanatory caption later.

Example:
- pre-answer: 図14　斜方投射の速度成分
- post-answer: 図14　最高点では鉛直速度成分が0

## 15. Formula staging

If a question asks for part of a formula, the same answer must not be fully printed nearby.

Use the parent relation with the target term as the hole, or stage the completed equation after resolution.

## 16. Graph integration

Graphs are semantic representations, not decoration.

For a graph question:
- axes must be clear,
- the relevant visual feature must be visible,
- the question references that feature,
- prose translates the feature into physics.

Example: v-t slope → Δv/Δt → acceleration; area under v-t → accumulated vΔt → displacement.

This is required for 1D.

## 17. Figure-question ordering

Concept-forming:
    setup prose → figure → inline question → concept name/formula

Inference:
    short task → figure visible → inline question → explanation

Confirmation:
    concept/result → figure → interpretation

## 18. Split-attention mobile gate

Fail if:
- question and required figure are several screens apart,
- parent equation disappears before substitution,
- learner must reopen an unrelated collapsed section,
- repeated scrolling is required to map labels.

Prefer local co-presence and concise restatement of needed parent relations.

## 19. 1A concrete integration

    setup: O, P1
    → figure (F-CONCEPT)
    → A1: arrow expresses [position]
    → teach position vector
    → add P2
    → A2: P1→P2 expresses [position change]
    → teach displacement Δr
    → same semantic figure
    → A3: r1 + [Δr] = r2
    → derive Δr = r2-r1

If canonical fig-1 prints r1/r2/Δr, mask/stage only what is necessary. Do not create a later label-transcription exercise.

## 20. 1F concrete leakage fix

Current app issue: figure-14 mask asks highest-point v_y while alt text states v_y=0.

P36 requirement:
- pre-answer mask the value/label,
- use neutral caption and neutral alt,
- ask F4,
- post-answer reveal v_y=0 and explain the physical transition.

## 21. Representation audit record

For each interactive node, audit data should record:

    questionId
    conceptId
    primaryRepresentation
    supportingRepresentationIds
    visibleEvidence
    answerSemanticId
    maskId?
    formulaId?
    leakageChecked: title/heading/prose/formula/figure/caption/alt/aria
    mobileProximityChecked
    desktopChecked

## 22. P36 gate judgment

G58 requires text↔figure↔formula↔graph integration, synchronized reveal, figure roles, mask necessity/completeness, and pre-answer leakage gates.

All are specified above.

**G58 PASS.**

**P36 PASS.**

Next: `P37 1A REDESIGN — PAPER / DATA ONLY`
