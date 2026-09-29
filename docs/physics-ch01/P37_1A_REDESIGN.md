# P37 — 1A Redesign, Paper / Data Only

Status: **P37 PASS — 1A TARGET DATA DESIGN COMPLETE**

Date: 2026-09-29

Inputs:
- Chapter-1 v2.1 user-reviewed learning text
- P33 dependency map
- P34 contradiction audit
- P35 pedagogy rules
- P36 representation / reveal / mask specification
- canonical figures 1–4

P37 does not modify TypeScript or the running app.
It defines the exact target learning flow that P38 will simulate and that a later implementation may encode.

---

## 1. Redesign goal

Replace the current 1A structure:

    24 concept items
    → 19 figure-reading items
    → 8 example-1 items
    → 19 example-2 items
    → 8 review items

with one continuous dependency-driven lesson containing the already approved ten v2.1 holes:

    A1 … A10

The target is not “ten questions instead of seventy-eight.”
The target is:

    natural prose
    + figures at concept-formation time
    + ten justified decisions
    + answer-dependent reveal boundaries
    + mobile-complete explanation

The canonical unit content remains:
- position,
- position vector,
- displacement,
- displacement components,
- elapsed time,
- average velocity,
- instantaneous velocity / tangent direction,
- speed vs velocity,
- numerical transfer.

---

## 2. Target macro flow

Visible pedagogical headings may remain natural:

1. 位置を矢印で表す
2. 位置の変化を表す
3. 座標で変位を見る
4. 位置の変化を時間と結びつける
5. 瞬間の速度
6. 速度と速さ
7. 例題：変位から平均速度へ

These headings are not reveal boundaries.

Inside them, invisible representation-event / reveal boundaries control dependent content.

---

## 3. 1A event sequence

| Event | Concept | Pre-answer evidence | Decision | Type / scaffold | Correct-resolution reveal | Next dependency |
|---|---|---|---|---|---|---|
| 1A-E01 | position meaning | origin O, point P1, O→P1 arrow in staged fig1 | A1: arrow represents [position] | H1 / S1 | complete prose; teach “位置ベクトル”; introduce r1 | second position / displacement |
| 1A-E02 | displacement meaning | same fig1; r1/r2 available; Δr label still staged | A2: P1→P2 represents [position change] | H1 / S1 | teach “変位”; reveal/introduce Δr | vector relation |
| 1A-E03 | arrow relation → equation | fig1 with r1,r2,Δr now semantically established | A3: r1 + [Δr] = r2 | H3+H2 / S2 | show completed relation and derive Δr=r2−r1 | coordinate components |
| 1A-E04 | displacement components | fig4 and Δr=r2−r1 | A4: Δx=[x2−x1] | H3+H6 / S2 | show Δy=y2−y1 directly; show full component vector | elapsed time |
| 1A-E05 | elapsed time | same displacement, two different travel times | A5: Δt=[t2−t1] | H2 / S2 | establish elapsed-time notation | average velocity |
| 1A-E06 | average velocity | Δr and Δt already established | A6: vbar=[Δr/Δt] | H2 / S2 | show full r2−r1 over t2−t1 relation and direction meaning | instantaneous velocity |
| 1A-E07 | instantaneous direction | fig2: secant/average direction vs local velocity geometry | A7: limiting direction approaches [tangent direction] | H1+H3 / S2 | define instantaneous velocity; show limit formula; then fig3 as confirmation | speed/velocity distinction |
| 1A-E08 | velocity vs speed | velocity as vector; magnitude notation | A8: quantity including direction is [velocity] | H2 / S2 | state v=|v-vector| and distinction | transfer |
| 1A-E09 | strategy transfer | numerical P1/P2/t1/t2 problem | A9: first quantity to find is [displacement] | H4 / S3 | show Δr and Δt calculations | final transfer |
| 1A-E10 | numerical transfer | calculated Δr=(6,4), Δt=3 | A10: average velocity result | H6+T / S4 | complete vector result; short chapter-link summary | 1B |

No additional progress-gating holes are added for:
- the name “位置ベクトル”,
- the name “変位”,
- r2 notation,
- Δy after Δx pattern is learned,
- numerator/denominator separately,
- r1/r2/Δr label transcription,
- every arithmetic line,
- final repetition review.

---

## 4. Figure 1 staged use

Canonical fig1 contains:
- O, P1, P2,
- r1,
- r2,
- Δr,
- the three arrows.

It is reused across E01–E03 rather than moved to a later generic figure section.

### Stage F1-S0 — before A1

Visible:
- axes,
- O,
- P1/P2 geometry,
- arrows.

Neutralized/staged:
- r1 label,
- r2 label,
- Δr label if they would distract from the first meaning.

Purpose:
the learner can see that O→P1 encodes where the object is without being asked to know notation first.

Pre-answer alt:
> 座標平面上の原点 O と2つの位置 P1・P2、およびそれらを結ぶ矢印を示す図。ベクトル記号の一部は未導入。

Do not say:
- “位置ベクトル r1/r2”,
- “変位 Δr”.

### Stage F1-S1 — after A1 teaching prose

Reveal/teach:
- r1 for O→P1,
- r2 when the second position is introduced.

Still keep Δr semantically unresolved until A2.

This reveal is a teaching-stage reveal, not a separate quiz.

### Stage F1-S2 — before A2

P1→P2 arrow is visible; Δr label remains neutralized if necessary.

A2 asks for the **meaning** “位置の変化,” not the printed symbol.

### Stage F1-S3 — after A2

Teach:
- “位置の変化を変位という”
- notation Δr

Reveal Δr label.

### Stage F1-S4 — A3

All three arrow meanings are now legitimately known.
The full figure is evidence for:

    r1 + [Δr] = r2

Seeing Δr on the figure is not leakage here; A3 is a representation-conversion / relation task, not symbol recall.

---

## 5. Figure 4 use

Canonical fig4 is used in E04.

Role:
**F-CONCEPT / F-INFERENCE hybrid**.

Visible before A4:
- A(x1,y1),
- B(x2,y2),
- horizontal/vertical projection geometry,
- Δx / Δy labels are acceptable evidence.

A4 asks:
    Δx = [x2−x1]

The figure does not directly print that formula, so no formula mask is necessary.

After A4:
- show Δy=y2−y1 as prose/formula,
- show full vector component relation.

Do not add a second Δy hole merely to mirror x.

Neutral alt:
> 座標平面上の A(x1,y1) から B(x2,y2) への変化を、水平方向と鉛直方向の成分に分けた図。

---

## 6. Figures 2 and 3 use

### Figure 2 — E07

Role:
**F-INFERENCE / concept-forming**.

Purpose:
show that as the second point approaches P, the secant/average direction approaches the local line direction.

A7:
    接線方向

Pre-answer alt:
> 曲線上の2点を結ぶ方向と、点 P の近くに引かれた局所的な直線方向を比較する図。

Do not put “接線方向” in pre-answer alt/caption.

The printed phrase “瞬間速度の向き” in the canonical figure does not directly answer A7; it is part of the evidence about which arrow is under discussion.

After A7:
- state the tangent-direction result,
- introduce the limit formula,
- then show fig3.

### Figure 3 — after A7

Role:
**F-EXPLAIN / confirmation**.

Purpose:
show instantaneous velocity arrows at several points following the local tangent.

No extra label-reading hole.

Neutral caption:
> 曲線上の各点における速度の向き

---

## 7. Exact reveal-boundary plan

| Boundary | Before resolution | After resolution |
|---|---|---|
| RB-A1 | staged fig1 + A1 sentence | position completed; teach position vector/r1 |
| RB-A2 | fig1 with position-vector meaning known; Δr not named | teach displacement/Δr |
| RB-A3 | full semantic fig1 + formula hole | completed arrow equation + Δr=r2−r1 |
| RB-A4 | fig4 + x-component hole | Δy + full vector components + path-independence explanation |
| RB-A5 | travel-time contrast + Δt hole | elapsed-time notation fixed |
| RB-A6 | Δr/Δt evidence | full average-velocity formula + direction interpretation |
| RB-A7 | fig2 + local-direction question | tangent result + limit formula + fig3 |
| RB-A8 | vector/magnitude prose | speed-vs-velocity distinction fixed |
| RB-A9 | numerical problem statement | expose calculated Δr and Δt |
| RB-A10 | Δr and Δt values | average-velocity result + transition to 1B |

A visible heading is not required at any RB.

---

## 8. Hole specification

| Hole | Purpose | Evidence | Why it deserves interruption | Choice policy |
|---|---|---|---|---|
| A1 | H1 meaning | O→P1 geometry | creates position meaning before terminology | strong semantic distractors |
| A2 | H1 meaning | P1→P2 geometry | distinguishes position from position change | strong semantic distractors |
| A3 | H3/H2 | three-arrow relation | converts visual relation to equation | symbol/relation distractors |
| A4 | H3/H6 | fig4 + “後−前” | applies displacement relation to coordinates | sign/order distractors |
| A5 | H2 | two times | establishes elapsed-time relation | order/sign distractors |
| A6 | H2 | displacement + elapsed time | constructs average velocity | relation distractors |
| A7 | H1/H3 | fig2 geometry | key geometric meaning of instantaneous velocity | direction distractors |
| A8 | H2 | vector vs magnitude | prevents speed/velocity conflation | concept distractors |
| A9 | H4 | worked target | teaches solution planning | strategy distractors |
| A10 | H6/T | computed Δr, Δt | transfer with reduced support | result distractors |

No hole is a first-exposure terminology lottery.

---

## 9. Scaffold fading in 1A

The ten-hole sequence intentionally fades:

    A1/A2    S1 — meaning construction with strong guidance
    A3–A8    S2 — relation / representation decisions
    A9       S3 — choose strategy
    A10      S4 — transfer/result with less conceptual prompting

The unit ends with a non-gated summary:

    position → displacement → velocity

This summary is not another multiple-choice review.

P38 will test whether the learner can reconstruct the chain without relying on a final duplicate quiz.

---

## 10. Mobile layout requirements

For E01–E04:
- figure and the sentence/hole it supports must remain in one continuous event,
- no section-switch navigation between them,
- if fig1 is taller than one viewport, keep the relevant arrow region and current sentence adjacent through sticky/compact treatment or a repeated compact visual in implementation; P37 does not mandate the UI technique.

For E07:
- fig2, A7, and the tangent explanation must be contiguous,
- fig3 appears after resolution as confirmation.

For E09/E10:
- the numerical givens, strategy hole, calculation, and final result must remain a single worked narrative.

Do not insert progress cards or unrelated review prompts inside these event chains.

---

## 11. Leakage specification for 1A

### Unit / headings
Allowed:
- “変位と速度” as unit title because no hole asks the learner to guess either term on first exposure.
- “瞬間の速度” heading because A7 asks direction, not the term itself.

### Figure metadata
Replace current answer-bearing alt text with evidence-only alt text specified above.

### Formula
Do not show:
    r1 + Δr = r2
before A3 resolves.

Do show:
- the already-established figure labels as evidence.

### Downstream prose
Do not show:
- “この矢印は位置を表す” after A1 but before A1 resolution,
- “P1→P2 is displacement” before A2 resolution,
- “tangent direction” before A7 resolution.

The corresponding post-answer explanation sits behind its reveal boundary.

---

## 12. Old 1A item inventory treatment

P37 does not preserve the old 78 interactive items as student gates.

Conceptually:

| Old item family | Target treatment |
|---|---|
| first-term quizzes a-1 / a-4 / a-19 etc. | teach in prose when first introduced |
| duplicate position / start-end label items | absorb into natural prose |
| x/y mirrored micro-items | one interactive pattern + one visible counterpart |
| numerator/denominator split items | one relation hole |
| figure label transcription d16–d19 | replace with synchronized concept reveal |
| repeated tangent questions | one A7 inference + later explanatory figure |
| long arithmetic micro-chain in q2 | visible worked derivation; only A9 strategy and A10 transfer remain interactive |
| final-review duplicates | replace with short readable reconnection summary |

Historical attempt data is an implementation/migration concern for P39.
P37 does not delete history or choose a migration mechanism.

---

## 13. Target data record, implementation-neutral

Each event can be represented conceptually as:

    eventId: 1a-e01
    conceptNode: A-POS
    proseBefore: [...]
    primaryRepresentation: fig-1
    figureStage: F1-S0
    holes: [A1]
    revealBoundary: RB-A1
    onResolve:
      - completed prose
      - teaching prose: position vector
      - reveal r1 stage
    next: 1a-e02

Example for A7:

    eventId: 1a-e07
    conceptNode: A-INST
    primaryRepresentation: fig-2
    role: inference
    holes: [A7]
    preAnswerAlt: neutral geometry description
    revealBoundary: RB-A7
    onResolve:
      - tangent-direction statement
      - instantaneous-velocity limit formula
      - fig-3 explanatory confirmation
    next: 1a-e08

This is not a final TypeScript schema.
It is the data contract P38 will simulate.

---

## 14. Mapping to P33 nodes

| P33 node | P37 event |
|---|---|
| A-POS | E01 |
| A-DISP | E02–E03 |
| A-COMP | E04 |
| A-AVG | E05–E06 |
| A-INST | E07 |
| A-SPEED | E08 |
| A-TR | E09–E10 |

All P33 1A dependencies are represented exactly once in the target flow.

---

## 15. P37 acceptance checks

PASS conditions:
- 10/10 approved holes retained and justified,
- no first-exposure terminology hole,
- all four canonical 1A figures have an intentional role,
- fig1 is staged across position/displacement/formula events rather than isolated later,
- fig2 is present before A7,
- fig3 is explanatory after A7,
- fig4 is integrated with components,
- every answer-dependent explanation has a reveal boundary,
- no title/alt/caption/post-text semantic leak is required,
- scaffold fades S1 → S2 → S3 → S4,
- worked example remains prose-like,
- old 78-item inventory is not treated as a preservation target,
- no current UI/schema constraint weakened the ideal flow.

All conditions are met by this paper/data design.

**G59 PASS.**

**P37 PASS.**

Next:
P38 — virtual learner simulation + developer audit-mode specification.

No application code changed.
