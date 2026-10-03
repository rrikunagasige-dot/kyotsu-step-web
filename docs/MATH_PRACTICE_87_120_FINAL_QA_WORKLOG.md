# MATH PRACTICE 87–120 FINAL QA WORKLOG

Branch: `chatgpt/math-practice-87-120-final-qa`

## Operating rules

- Do not use Desktop / Remote Desktop.
- Keep each tool operation small.
- Prefer one write per call; at most two tightly related writes.
- Do not continuously poll CI.
- While CI runs, only prepare the next audit/design; do not start dependent implementation.
- After a small closed unit of work, leave a checkpoint here.

Connection note:
- The exact cut point is not identified.
- Long continuous tool sessions correlate strongly with the observed disconnects.
- Therefore optimize for recoverability rather than assuming one specific cause.

## Baseline

Main currently contains:
- 118 merged
- 119 merged
- 120 merged
- GitHub Pages deploy for 118 / 119 / 120 succeeded

119 and 120 already contain:
- JA
- ZH
- presentation stages
- source/unit tests
- browser E2E
- mobile-overflow assertions

Do not reimplement them.

## Final QA gates

1. information architecture
2. topic navigation
3. current-stage compression
4. hole quality
5. answer leakage
6. math rendering
7. mobile-first overflow
8. cross-problem dependencies
9. JA/ZH parity
10. source fidelity
11. repository hygiene
12. final acceptance

## Checkpoints

### 119
- source fidelity: PASS against `MATH_PRACTICE_119_CONTENT_DESIGN.md`
- current-stage compression: PASS by presentation graph / E2E
- answer leakage: no issue found in first audit
- mobile overflow: automated assertion present
- deploy: PASS

### 120
- source fidelity: PASS against `MATH_PRACTICE_120_CONTENT_DESIGN.md`
- current-stage compression: PASS by presentation graph / E2E
- answer leakage: no issue found in first audit
- mobile overflow: automated assertion present
- deploy: PASS

### 87–117
- not yet final-audited in this branch
