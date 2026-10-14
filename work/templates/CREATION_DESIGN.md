# Creation Design Template — 「作成」 / CMD-WORK-002

Status: TEMPLATE — コピーして対象Workの承認済みProposalに関連付ける。空欄のまま実装しない。
Source: `governance/INSTRUCTION_DICTIONARY.md` / `CMD-WORK-002`.
Approved by user (template specification): 2026-10-14, W-GOV-006 / P-001.

## 0. Work / source identity

- Work ID / Proposal ID:
- Status: PROPOSED / REVISE-PROPOSAL / APPROVED / IMPLEMENTING / VERIFYING / DONE
- Repository + live main HEAD (実施時再取得):
- Subject + mode: mathematics|physics × textbook|practice
- Source type: Word問題集 / 教科書 / PDF / 既存教材
- Source files / canonical provenance / version / date / chapter-range:
- Copyright/access/ability to reuse original items and figures:
- Target app route / current main source:
- Intended audience and source prerequisites:
- Authoring type: **既存問題のguided変換** / **教科書根拠の新規導入問題** / mixed with each item labeled
- Do Not Touch (IDs / existing wording / answers / progress / other modes):

## 1. Coverage / 対応表 (漏れなく列挙)

| Source location | Original ID | Kind (問題/概念/性質/証明/例題/図) | Prerequisites | Target Node ID | Preserve or newly authored | Status | Exclusion reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | NOT-DESIGNED | |

Mandatory:
- 原資料の章・節・問題番号・図番号を列挙し、未収録/除外は理由を書く。
- sourceの問題IDとアプリで表示する番号を混同しない。
- 原問題の条件・元図・設問・答え・問題間参照は勝手に書き換えない。
- 他の版と出典が食い違う場合はOPEN-QUESTIONとして停止し、canonical判定を行う。

## 2. Concepts, full reasoning, dependencies

### 2A Concept graph (textbook)

- Concrete motivating question:
- Known concepts and prerequisite representations:
- New meaning and name/definition:
- Properties / theorems:
- Proof needed? YES/NO; reason:
- Example that applies what was learned:
- Fading / simple transfer:
- Relation between concept, diagram, formula, language and graph:

### 2B Problem/step graph (practice)

- Original question and requested end result:
- Reviewed complete mathematical/physical solution **before creating holes**:
- Subproblems:
- Node ID / `dependsOn` / `basis` / `operation` / `purpose` / `feeds`:
- Prior-problem results imported and actual usage:
- Independent nodes vs logically dependent nodes:
- Result nodes reused in later subproblems/problems:
- Exceptions/cases/signs/units/boundaries:

### Fire diagram / 火柴図

- Describe dependency arrows by stable Node IDs.
- Include figure placement, unresolved dependencies, current target and next unlock.
- Keep detailed steps in table/linked node files; do not cram everything into a picture.
- Verify no contradictory or falsely inferred edges.

## 3. Mode-specific mandatory lessons (re-read per Work)

| Mode | Minimum canon + accepted lessons |
| --- | --- |
| Math Textbook | `subjects/mathematics/textbook/SPEC.md` (**candidate summary**) + original mother Word/current approved lesson + `docs/MASTER_APP_LESSONS.md` + `docs/MATH_RENDERING_RULES.md` |
| Math Practice | `docs/MATH_PRACTICE_MASTER_LESSONS.md`, relevant structure map and target accepted problem graph, `subjects/mathematics/practice/SPEC.md` (candidate summary) |
| Physics Textbook | `docs/physics-ch01/LEARNING_TEXT_WRITING_RULES.md`, `FORMULA_DERIVATION_RULES.md`, `CH1_USER_QA_DESIGN_LESSONS.md`, `subjects/physics/textbook/SPEC.md` |
| Physics Practice | `subjects/physics/practice/SPEC.md` (candidate summary), `docs/QUESTION_SCHEMA.md`, existing guided problem examples/approved mode source |

- Technical/UI/design when relevant: `docs/MATH_RENDERING_RULES.md`, `docs/INFORMATION_ARCHITECTURE_RULES.md`, `docs/MASTER_APP_LESSONS.md`.
- Which lesson files were actually read (path + version):
- Conflict or missing original (do not pretend to have read them):
- Resolution / OPEN-QUESTION:
- **Do not transfer one mode's pedagogy as authority for another mode.**

## 4. Student-facing writing + thinking nodes

For **each** proposed hole/node:

| Node ID | Learner's current question | Why think? | Source/basis | Reasoning action | Blank position / formula | Choices + misconception-specific feedback | Unlock after correct |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

- Write a coherent, complete, hole-free exposition/solution first.
- Insert holes only for meaningful retrieval, observation, reasoning, operation or interpretation. Do not quiz unknown names, copy answers or trivial fragments.
- Where nontrivial, show parent equation → conditions → substitution → intermediate steps → final result → meaning.
- One reasoning chain = one visual grouping (not one equation per card).
- Future answers must not leak through prose, captions, hints, options, figure fill, revealed previous results or the source problem.
- Proof vs Example vs Concept visually distinct; top-level headings limited by accepted information architecture.
- Interaction is staged: current task visible, prior useful result selectively shown; unresolved next answers hidden.
- Validate final text with every hole filled is still natural; proof and mathematical meaning correct.

## 5. Figure and presentation plan

| Node | Need image? | Already canonical asset? | Purpose | Before/after which step? | Source/creation authority | Visible before answer? | QA constraints |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | YES/NO | | | | | | |

- Use existing source figure when it works; new/altered figures require explicit scope authorization.
- Decide location and learning purpose **before** drawing.
- Figure dimensions, labels, physical quantities, vectors, set relations, boundary conditions and math semantics are part of QA.
- Mobile legibility, blank/formula formatting, title hierarchy, content compression, accessible alt text.

## 6. Implementation strategy / exact Proposal

- Pilot (representative subunit) and why:
- Batch scope after pilot acceptance:
- Expected affected files:
- Protected files/behaviors:
- Data schema and IDs:
- Tests to create/adapt:
- Planned PR / preview / official release sequence:
- Risks and rollback:
- Estimated exclusions and unresolved source issues:

**Approval gate:** present full proposal to user → STOP. If user supplies additions/changes, `REVISE-PROPOSAL` → new full proposal → STOP. Begin work only upon explicit approval of that exact proposal.

## 7. Verification and user acceptance

- Source coverage and data fidelity; new vs reproduced original identified.
- Logical/physical proof, complete reasoning and valid answers.
- No missing node/circular dependency/cross-problem omission.
- Reasonable distractors and correct wrongReason.
- Figure placement and semantic correctness; no answer leakage.
- KaTeX, paragraph/line break, contrast, padding, responsive/mobile.
- Unit/schema/lint/typecheck, mobile/desktop E2E, production build.
- No unintended changes to other subjects/modes or user progress/IDs.
- Link to preview or app where learner can review **actual work**:
- Technical QA status vs user hands-on QA:
- User decision: ACCEPTED / REJECTED / NEEDS-REVIEW.
- REJECTED → finding + evidence + `CMD-WORK-001` new correction proposal; do not count as DONE.

## 8. Work/memory closure

- Action Log (what actually changed and where):
- Findings (CONFIRMED, OPEN-QUESTION, ERROR categories):
- Verification (failures preserved, later passing evidence appended):
- Reusable lessons promoted to correct mode canon:
- Current graph/progress updated only when true:
- Next unit release authorization separately confirmed:
