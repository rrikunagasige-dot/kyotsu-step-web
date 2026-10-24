# W-GOV-010 — 作成・修正のcode/AI/ML統合

Status: DONE
Proposal: P-004（integration/APPROVAL.json）
Date: 2026-10-24
Branch: work/workflow-cr-integration-p004-20261024
Implementation source:190941bc9d65fb3ed2fa6b52ba90196addf19e33
Final CI:40116299835 SUCCESS
Canonical main adoption:b737ea42ff8527bfefd19f6ffd427dd13749084b

Closure scope: P-004の制作基盤統合。I01–I07、code/AI契約、queue、属性別再検査、承認と単元公開、旧版移行、三階層火柴図、通常入口の切替とmemory closeまで完了。120 workflow試験（追加42）・620 learner・39 authoring・19 production Node・8 source/corpus/ML・27 legacy・build・四幅UIがPASS。

Open downstream: N07の六指摘はOPEN。新しい修正案・教材修正・実教材受入は、このP-004閉鎖の対象ではない。モデルはOFFLINE_ONLY、再fit・本番昇格なし。公開app4fb7a98eと第一タイトル受入22bc43ba、他モードと保存進捗を保持。

実行はworkflow/INTEGRATION_RUNBOOK.md、結果はintegration/IMPLEMENTATION_RESULTS.md、根拠はintegration/FINAL_CI_VERIFICATION.jsonとCANONICAL_ADOPTION.json。

以下は旧proposalと作業途中の履歴。上記P-004の現在地を優先する。

---

# W-GOV-010 — コード＋AIの教材制作パイロット

Status: VERIFYING
Proposal: P-002＋REFERENCE_CODE_RESEARCH（承認記録APPROVAL_20261024.md）
Date: 2026-10-24 Asia/Tokyo
Branch: work/textbook-code-ai-pilot-20261024
Implementation base: f2a3ef837fccf584914b4e4caee8edf058a82cab
Accepted app source:22bc43ba53fa87bb85e82e18a25db13a5c8a485c
Live main verified at entry:9b7dcd470847ec7c16683c58f1f24c500c442489

Objective: Make the approved external-code-based production pipeline concrete and demonstrate it on all N07 source content before learner edits.
Authority: current user approval > Constitution > exact P-002＋reference-code adoption scope > source and accepted rules. Approval survives chats; do not ask for the same tooling/publication permission again.

Completed pilot: M0 current review-policy consolidation with historical preservation; M1 source identities/schema/compiler adapter; M2 Fraction/Pandoc-based N07 mathematics; M3 candidate/prose/blank/choice generation, source/novice audit, compiler, result/render metadata, state model, job/cache/resume and bounded CLI; M4 all14 N07 questions plus unnumbered content drafted. Concrete41-node/36-interaction design is n07/N07_DESIGN.md and N07_DESIGN_PLAN.json, status PROPOSED. This is a usable bounded pilot, not a universal all-subject generator or an integrated new learner UI.

Protected: accepted first-title content/IDs/figures/revisions/progress, all non-N07 units and other modes, original Word and existing storage namespace. The current explicit N07 approval authorizes only its new learner source, isolated renderer/shared opt-ins, scoped v1–v3 migration and existing-Pages publication. See n07/CONTENT_APPROVAL.json.

Current: M5 N07 integration complete at4fb7a98e7f864839ccc1374080473df4ba60ce88. Exact-source CI40101499771 PASS:619 applicable learner tests,39 authoring tests, build, changed-code lint, actual browser all36 responses and every wrong choice at320/390/1440px, reload/full history and persisted v3→v4 migration. Separate untouched checkout99b57ba reproduces two unrelated physics catalog/count test failures; these are not counted as PASS. Whole-repo governance also retains its old4 metadata errors/2 warnings.

Publication: release40101675993 PASS, hosting main618e2be2 points to exact source4fb7a98e. Compiled N07/first-title typography+history and hosted exact-source/N07/first-title typography checks all passed. See n07/integration/VERIFICATION.json. No unseen N08–NE02 content is promoted. Existing first-title acceptance remains22bc43ba.
Next: user hands-on N07 feedback at https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=4fb7a98e#/learning/textbook/math-numbers-expressions-n07. Technical implementation/publication verification and memory close are complete. The approved N07 design is no longer awaiting design approval; user app acceptance is still distinct.

## P-003 workflow redesign — current user priority, 2026-10-24

Current scope: design/research/case recovery only, PROPOSED for implementation. User explicitly prioritizes rebuilding the workflow before N07 correction. Existing P-002 approval and its completed pilot remain historical facts; they do not approve the new ML/redesign implementation.

The full concrete proposal is [redesign/PROPOSAL_FULL.md](redesign/PROPOSAL_FULL.md). It specifies25 stages,24 implementation tasks, reuse of both legacy and current code, semantic IR and checks, actual supervised/transfer training, grouped evaluation, shadow/fallback and feedback consumption.82 raw observations are indexed, including old36,6 N07 records,20 visible-chat excerpts,8 repository records and12 retrieval-summary candidates. Duplicates and unknown scope remain explicit; this is not82 unique training examples. No model training, N07 repair, runtime/app change or publication occurred. Main remains618e2be2 and app source4fb7a98e. N07's six negative cases remain OPEN.

## Current — P-003 APPROVED / IMPLEMENTING

User explicitly:「嗯可以。那你按照现在的所有设计书，做吧！！」. Exact frozen documents/hash and protected scope are in redesign/IMPLEMENTATION_APPROVAL.json. Branch work/production-workflow-p003-20261024 from2e767cc4. Implementing the existing Runtime/Store extension,25-node graph, bounded solver adapters, semantic IR/compiler/opt-in rendering, source/context/holes checks, corpus curation, actual pretrained-encoder classifier fit, and generation/AI consumption. No unseen N07 lesson rewrite or app release is part of this infrastructure implementation. Old P-002/PROPOSED entries above retain history.

Initial local verification:620 applicable learner tests,39 existing authoring tests,19 new Node tests, extended Python workflow/corpus/ML tests, exact N07 regeneration, type/build/lint PASS. GitHub/browser verification is pending on the final code SHA. Real e5 weights/tokenizer/pooling verified by SHA256.9 curated dimensional cases from real versioned evaluations;layout head fitted, OFFLINE_ONLY because group evaluation is insufficient. Seven other heads lack both classes. Broad N07 style praise is distinct from the specific derivation-layout criticism. SetFit fit and Qwen comparison remain data-gated; no false production promotion.


## P-003 infrastructure implementation complete — code bba4df75

25-stage bounded infrastructure and its integrations are implemented and verified: CI40109892971 SUCCESS,620 applicable learner/39 existing authoring/19 new Node/78 workflow/8 source-corpus-ML/27 legacy math tests; four-width browser320/390/430/1440 PASS. See redesign/implementation/RESULT.md and VERIFICATION.json.145 raw observations,9 scoped dimensional cases; actual pretrained-encoder classifier fit is OFFLINE_ONLY.7 other heads, SetFit and pair ranking remain data/evaluation gated, Qwen not run. New lesson application and N07 six defects are not closed by this tooling completion. Existing public source4fb7a98e remains unchanged.

Canonical routing: main f75bfe73 now contains only the five documentation/pointer updates for P-003. Workflow implementation is pinned tobba4df75; hosting workflow and public source4fb7a98e are untouched. Follow governance/PRODUCTION_WORKFLOW.json. No full-branch merge.

## P-004 C/R integration design — PROPOSED

User requests an implementation-ready plan for embedding P-003 capabilities into the two existing commands. Current sourcebba4df75 creates the same25-node graph for both commands and leaves all node.block unset. The code/AI capability baseline is verified, but command-specific integration is not complete. See integration/P004_INTEGRATION_DESIGN.md and P004_MAPPING.json: C01–C09 and R01–R08 placement, common gates/learning/closure, block/release/approval-bundle dependencies, correction queue and pre/post impact, scoped reuse, three-level fire diagrams, migration and seven implementation steps. This turn changes documentation only; production/2 is not implemented or approved by the design request. P-003 source, main routing and public app are unchanged.


## Current — P-004 C/R統合 / final CI running

ユーザー「可以可以那就来做做看把」でP-004を承認。作成と修正へ既存code/AI/MLを組み込み、I01–I07を実装。最終実装source f98a36e6b5930f34d924ae2bd7b391984234673a、CI40115554244を待機。local workflow119件（新規41）・production Node19・source/corpus/ML8・authoring39・legacy27・learner620・build PASS。初回78986acf/CI40114657817も成功しているが、最終版の代用にしない。待機中は資料と根拠の照合だけを行い、完了後はmainの5つの入口/pointerを限定更新する。N07の六指摘、第一タイトル、公開4fb7a98e、他モード・進捗は保持。
