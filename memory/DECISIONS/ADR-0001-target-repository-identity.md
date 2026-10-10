# ADR-0001 — Canonical target repository identity
Status: ACCEPTED BY DIRECT USER INSTRUCTION
Date: 2026-10-10
Decision: `rrikunagasige-dot/kyotsu-step-web` is the actual owner-controlled Juku app repository. `paulfields83/kyotsu-step-web` is an upstream origin of the previous governance work only.
Reason: prior assistant confused the upstream with the target, incorrectly reported the former as the official app. Verify owner, repository ID, main and live HEAD before trusting files.
Consequences: no direct main writes; independent target feature branch; separate archival of imported upstream material; all review links point to the target.
