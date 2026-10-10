# MASTER MATCH GRAPH — target rriku
Status: PROPOSED / target review branch
Updated: 2026-10-10

## Upstream provenance (NOT rriku completion claims)
R00 INVENTORY → R01 AUTHORITY MAP → R02 REPOSITORY OS → R03 MODE CANON
→ R04 BRANCH SALVAGE → R05 DOC MIGRATION → R06 VALIDATORS
→ R07 CLEANUP → R08 FINAL AUDIT.
These R00–R08 nodes belong to upstream `paulfields83/kyotsu-step-web` and are preserved as historical evidence only.
They do **not** authorize cleanup, branch deletion, or declarations of PASS for `rrikunagasige-dot/kyotsu-step-web`.

## Target migration nodes

```text
[T00 rriku identity verified] ──▶ [T01 upstream snapshot: 113 files archived]
                                       │
                                       ▼
                           [T02 adapt entry/governance]
                                       │
                                       ▼
                           [T03 target state/mode binding]
                                       │
                                       ▼
                           [T04 QA / review PR]
                                       │
                                       ▼
                           [T05 user merge approval] ──▶ [T06 target main adoption]
```

## Existing subject/mode nodes (source-first)
```text
                       [JUKU]
                  /              \
        [MATH]                    [PHYSICS]
       /      \                  /       \
[M-TEXTBOOK] [M-PRACTICE]   [P-TEXTBOOK] [P-PRACTICE]
  draft #31   87–120 live      ch1 live   separate
              │
       problem data + guided
              │
       prior-result / figure QA
```

- M-PRACTICE: `docs/MATH_PRACTICE_MASTER_LESSONS.md` + `src/data/mathPractice/*`.
- P-TEXTBOOK: `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md` + `src/data/textbook/*`.
- M-TEXTBOOK: existing Math textbook work/draft PR #31.
- Imported upstream `subjects/**/SPEC.md` require comparative review (CANDIDATE), not a silent replacement.

## Scope protection
Textbook ≠ Practice. Physics ≠ Mathematics. Source problem ID identity differs across repos.
Any transfer from upstream W-MATH-001 / W-MATH-002 needs re-mapping and a new approved target Work.
