# W-PREVIEW-001 / P-001 — PR browser preview (PROPOSED ONLY)
Status: NOT APPROVED FOR HOSTING IMPLEMENTATION
Date: 2026-10-11

## Purpose
Users must open a direct running app URL for actual UI review. PR #57 is Draft, while the existing deploy-pages.yml serves only main.

## Candidates for technical assessment
A. Existing authorized infrastructure preview under a separate path/project, with preview-only GitHub Actions job.
B. External Cloudflare Pages PR/branch preview.
C. External Vercel PR/branch preview.
Compare permissions/GitHub connections, cost, public or private access, risks, rollback, build SHA fidelity, Vite base '/kyotsu-step-web/', hash routing, static figures, mobile display. No provider chosen yet.

## Planned deliverable after NEW approval
One functioning app URL serving exact PR head, validated with real desktop/mobile browser paths and assets, then passed to user. No instructions for user to install tools. PR link may accompany, but not replace, app link.

## Exclusions
No GitHub Settings, provider OAuth, production Pages, curriculum or main modifications on the basis of this proposal. No new approval inferred from governance-only instruction.

## Approval
WAITING. This proposal records a dependency, not permission to connect or publish.
