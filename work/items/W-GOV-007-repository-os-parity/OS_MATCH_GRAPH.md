# W-GOV-007 — Repository OS 火柴図 / dependencies

This is an **operational graph**, not the Mathematics/Physics problem dependency diagram.

```text
[User says "憲法から"]
            |
            v
[Identity: repo ID 1391122224 / live main / branch]
            | mismatch -> [STOP / ERROR-PROVENANCE]
            v
[AGENTS.md + INSTRUCTION_DICTIONARY.md]
            |-- EXACT ----> [execute only defined command semantics]
            |-- SIMILAR --> [present candidate, confirm BEFORE action]
            '-- UNKNOWN --> [STOP / propose dictionary work, no guessing]
            |
            v
[CONSTITUTION + COMMAND_WORDS + DOCUMENT_AUTHORITY]
            |
            v
[CURRENT_POSITION + MASTER_MATCH_GRAPH]
            |
            v
[ACTIVE_CONTEXT + PROGRESS + relevant ADR / LESSON]
            |
            v
[Current-target canonical mode source]
   | Math Textbook / Math Practice / Physics Textbook / Physics Practice
   | upstream archival refs are NON-AUTHORITATIVE
            |
            v
[Work ID + exact PROPOSAL status + scope]
   | no approval ----------> [PROPOSE -> USER REVIEW -> STOP]
   | amended proposal -----> [REVISE-PROPOSAL -> STOP]
   '-- verified approval ---> [approved scope IMPLEMENT]
                                 |
                                 v
                     [record ACTION / FINDINGS]
                                 |
                                 v
            [Git diff/allowed paths + target-mode regression + provenance]
                | failure ---> [STOP and record honest FAIL]
                '-- PASS ----> [PR URL / human review]
                                 |
                                 v
                [separate explicit merge approval?]
                | no --------> [Draft PR only]
                '-- yes -----> [main verification + Memory Close]
                                 |
                                 v
                [separate GitHub Settings approval?]
                | no --------> [no Ruleset or branch protection edit]
                '-- yes -----> [distinct settings Work / safe rollback]
```

Difference from upstream: the target does NOT have its backend; old 7 ADRs and 6 technical files are stored in `history/imports/paulfields83-20261010/` and remain historical, while the target's accepted math/physics artifacts have higher authority.
