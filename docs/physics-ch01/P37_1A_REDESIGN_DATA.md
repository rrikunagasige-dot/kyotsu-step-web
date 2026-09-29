# P37 — 1A Redesign (Paper / Data Only)

Status: **P37 PASS — 1A DATA REDESIGN COMPLETE**

Date: 2026-09-29

Inputs:
- Chapter-1 v2.1 source
- P33 representation/dependency map
- P34 contradiction audit
- P35 pedagogy rules
- P36 representation integration spec

This file defines the target 1A learning data. It is **not application code**.

---

## 1. Redesign objective

Replace the current 1A architecture:

    77 items
    + concept section
    + separate figure-reading section
    + worked examples
    + review

with one continuous 10-hole learning flow whose figures and formulas appear at the point of conceptual need.

Current app item IDs are not preserved merely for compatibility.

## 2. Target semantic spine

    position
      ↓
    position vector
      ↓
    position change
      ↓
    displacement Δr
      ↓
    vector relation r1 + Δr = r2
      ↓
    coordinate components
      ↓
    elapsed time
      ↓
    average velocity
      ↓
    instantaneous velocity / tangent
      ↓
    velocity vs speed
      ↓
    transfer example

## 3. Target interactive nodes

| Hole | Purpose | H-type | Scaffold | Evidence | Knowledge gained |
|---|---|---|---|---|---|
| A1 | arrow meaning | H1 | S1 | O→P1 setup/figure | arrow can represent position |
| A2 | P1→P2 meaning | H1 | S1 | two-position figure | position change |
| A3 | vector relation | H3/H2 | S2 | meanings of r1, r2, Δr | r1+Δr=r2 |
| A4 | coordinate component | H3/H6 | S2 | Δr=r2-r1 | Δx=x2-x1 |
| A5 | elapsed time | H2 | S2 | t1,t2 | Δt=t2-t1 |
| A6 | average velocity | H2 | S2 | displacement + elapsed time | v̄=Δr/Δt |
| A7 | tangent direction | H1/H3 | S2 | shrinking-interval figure | instantaneous velocity is tangent |
| A8 | velocity vs speed | H2 | S2 | vector magnitude distinction | velocity includes direction |
| A9 | solution strategy | H4 | S3 | numerical average-velocity task | find displacement first |
| A10 | transfer result | H6/T | S4 | computed Δr and Δt | numerical average velocity |

No replacement hole is added for removed legacy micro-items.

## 4. Learning events

### E1 — position meaning

Primary representation: **Visual**.

    setup O and P1
    → show fig-1 in neutral concept-forming state
    → A1: arrow expresses [position]
    → teach term 'position vector'
    → introduce r1

Pre-answer caption:
`図1　原点から物体の位置へ向かう矢印`

Pre-answer alt:
`原点 O と点 P1 を結ぶ矢印、および後の時刻の点 P2 を含む位置関係図。`

Do not ask the learner to guess the term 'position vector'.

### E2 — displacement meaning

Primary representation: **Visual / Quantity**.

    add P2 / r2 context
    → focus P1→P2
    → A2: [position change]
    → teach displacement / Δr

The name is read, not guessed.

### E3 — visual relation → formula

Primary representation: **Visual → Relation → Math**.

    O→P1 = r1
    P1→P2 = Δr
    O→P2 = r2
    → A3: r1 + [Δr] = r2
    → completed relation
    → Δr = r2-r1
    → translate back into words

No separate later label-transcription questions.

### E4 — coordinate representation

Primary representation: **Math with fig-4 confirmation**.

    r1=(x1,y1), r2=(x2,y2)
    → later - earlier
    → A4: Δx=[x2-x1]
    → show full Δr=(x2-x1,y2-y1)
    → fig-4 as F-EXPLAIN

Only one component is interactive because the y component repeats the same reasoning pattern.

### E5 — time and average velocity

Primary representation: **Quantity → Relation → Math**.

    same displacement, different durations
    → need elapsed time
    → A5: Δt=t2-t1
    → unit-time position change
    → A6: v̄=Δr/Δt
    → expanded r/t expression

Do not split numerator and denominator into independent questions.

### E6 — instantaneous velocity

Primary representation: **Visual**.

    average interval on a curve
    → fig-2 as F-INFERENCE
    → shrink P2 toward P1
    → A7: direction tends to [tangent]
    → teach the limit expression
    → fig-3 as F-EXPLAIN confirmation

The limit symbol may be treated as ordinary mathematical background.

### E7 — velocity vs speed

Primary representation: **Quantity / Relation**.

    velocity is a vector
    → speed is its magnitude
    → A8: which includes direction? [velocity]
    → v=|v⃗|

Do not split magnitude, direction, vector quantity, and speed into four separate micro-items.

### E8 — transfer example

Primary representation: **Transfer / Math**.

    given t1, P1, t2, P2
    → target = average velocity
    → A9: first find [displacement]
    → visible calculation Δr
    → visible calculation Δt
    → A10: final average velocity

A9 tests solution planning. A10 checks transfer/calculation. Routine subtraction is shown rather than separately quizzed.

## 5. Figure plan

| Figure | Role | Timing | Mask required? | Leakage treatment |
|---|---|---|---|---|
| fig-1 position/displacement | F-CONCEPT | E1–E3 | normally no | neutral pre-answer caption/alt; full terminology after meaning established |
| fig-4 components | F-EXPLAIN | after A4 | no | no active answer to hide |
| fig-2 average→instantaneous | F-INFERENCE | directly before A7 | only if source label directly answers A7 | neutral caption/alt |
| fig-3 tangent velocities | F-EXPLAIN | after A7 | no | confirmation only |

The old 1A mask-label drill is not carried forward.

## 6. Formula plan

| Formula | Role | Introduction |
|---|---|---|
| r1+Δr=r2 | concept-forming / representation | after A2 via A3 |
| Δr=r2-r1 | representation | immediately after A3 |
| Δr=(x2-x1,y2-y1) | representation | E4 |
| Δt=t2-t1 | relation | A5 |
| v̄=Δr/Δt | concept-forming | A6 |
| v=lim Δr/Δt | concept-forming | after A7 |
| v=|v⃗| | representation | E7 |

Every formula has a visible parent meaning.

## 7. Legacy-item disposition

Current 1A contains 77 items.

P37 does not map the 77 old IDs to 10 new IDs one-to-one.

Policy:
- archive old item IDs as historical implementation data,
- keep analytics migration separate from pedagogy,
- new semantic IDs are A1–A10,
- do not preserve an old item if its only purpose was label transcription, numerator/denominator splitting, repeated direction recall, or arithmetic fragmentation.

Representative merges:
- old position-vector / r1 / r2 / position micro-items → E1,
- old displacement labels + formula duplicates → E2/E3,
- separate Δx/Δy questions → A4 + visible y relation,
- separate average-velocity numerator/denominator questions → A6,
- repeated tangent-direction questions → A7,
- magnitude/direction/vector/speed micro-items → A8,
- long worked-example microchain → A9/A10 plus visible derivation.

## 8. Target data shape

Paper/data target:

    unit
      metadata
      learningFlow[]
        prose
        figure
        inlineChoice
        formula
        explanation
      concepts[]
      formulas[]
      figures[]
      questions[]
      representationLinks[]
      leakageAudit[]

A future implementation may adapt this to the existing schema, but must not reintroduce the old section order.

## 9. Example semantic record

    conceptId: A-DISP
    prerequisite: A-POS
    primaryRepresentation: visual
    figureId: fig-1
    questionId: A2
    questionPurpose: H1
    scaffold: S1
    visibleEvidence: P1→P2 arrow
    knowledgeGained: position change
    taughtTermAfterAnswer: displacement
    symbolAfterAnswer: Δr
    next: A3
    leakage:
      title: checked
      caption: neutral-before
      alt: neutral-before
      figure: checked

## 10. Student-facing section behavior

Legacy metadata may still classify blocks internally.

Student-facing flow must not show a mandatory sequence such as:

    知識点チェック
    ↓
    図の読み取り
    ↓
    例題
    ↓
    最後の確認

The learner experiences one continuous 1A lesson.

## 11. P37 gate judgment

G59 requires a complete 1A paper/data redesign.

P37 defines:
- target semantic spine,
- 10 target holes,
- scaffold levels,
- event-by-event flow,
- figure roles/timing,
- formula roles/timing,
- legacy-item disposition,
- target data shape,
- leakage behavior.

**G59 PASS.**

**P37 PASS.**

Next: `P38 VIRTUAL LEARNER SIMULATION + DEVELOPER AUDIT MODE SPEC`
