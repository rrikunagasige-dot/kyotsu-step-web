# Repository Cleanup Policy

Status: **PROJECT-WIDE REPOSITORY HYGIENE AUTHORITY**

Purpose:
このファイルは、共通STEP repository を「今動くもの」「歴史資料」「一時物」「不要物」に分け、将来のAI/開発者が古い実装や古いルールを current authority と誤認しないための恒久ルールを定める。

---

## 1. Core principle

Repository cleanup の目的は「ファイル数を減らすこと」ではない。

目的は:

- current authority がすぐ分かる
- live code と historical evidence が混ざらない
- dead code / dead assets が将来の判断を汚さない
- source provenance を失わない
- rollback / audit 可能性を残す
- CI / docs / branch の役割を明確にする

こと。

---

## 2. File classes

すべての重要ファイルは次のどれかとして扱う。

### A. CURRENT AUTHORITY
現在のAppが直接使う、または現在の設計判断を定義するもの。

例:
- live source code
- live assets
- current data source
- MASTER_APP_LESSONS
- current rules
- active CI

Aは明確な名前を使い、古いversion名を残さないことを目標にする。

### B. HISTORICAL EVIDENCE
過去の判断、prototype、audit、checkpoint。

削除する必要はないが、
- currentではないこと
- 何にsupersedeされたか
を明記する。

可能なら `docs/archive/` または明確な historical section に置く。

### C. CANONICAL SOURCE / ARCHIVE
原教材、source archive、hash manifest等。

内容を勝手に変更しない。
derived asset と必ず区別する。

### D. GENERATED / REPRODUCIBLE ARTIFACT
generatorから再生成できるもの。

liveで不要ならrepositoryに残さない。
残す場合は生成元を明記する。

### E. TEMPORARY / EXPERIMENTAL
一時branch、実験asset、one-time script、temporary workflow。

目的達成後:
- currentへ昇格
- historicalへ移動
- 削除
のどれかを決める。

mainへ永久放置しない。

### F. DEAD / ORPHANED
current code/docs/testから使われず、source authorityにもならず、historical valueもないもの。

検証後に削除する。

---

## 3. Deletion rule

削除前に確認:

1. live import / reference がない
2. test が依存していない
3. canonical source ではない
4. current docs authority ではない
5. rollbackに必要ならGit history / archiveで復元できる
6. 削除後に relevant tests + production build が通る

不明なら削除せず、まず historical / candidate として分類する。

---

## 4. Main branch rule

`main` は唯一の live implementation authority。

mainに置くもの:
- current code
- current assets
- active CI
- current rule/index docs
-必要なhistorical docs

mainに置かないもの:
- stale branch専用workflow
- user-rejected generated assets
- one-time migration/restore workflow
- currentと誤認されるdead implementation

---

## 5. Branch rule

### `main`
current authority。

### `source-archives`
canonical/raw archive保存専用。
App implementationの作業branchとして使わない。

### `backup/*`
復元用snapshot。
新しい作業のbaseにしない。
README/current docsからauthorityとして参照しない。

### `chatgpt/*`
temporary working branch。
merge/supersede後はcleanup candidate。

新しいAIは branch名だけでcurrentを判断せず、必ず main HEAD と README_FIRST を確認する。

---

## 6. Workflow rule

Active workflow は最小限にする。

mainに残すworkflowは:
- current mainに実際に適用される
- 明確な役割がある
- 他workflowと重複しない

古い作業branchだけを監視するworkflowをmainに残さない。

一時workflowは目的達成後に削除する。

---

## 7. Asset rule

`public/` は「今Appが配信するasset」の場所。

置かない:
- rejected guide
- unused mock
- duplicate export
- old prototype asset
- one-time comparison image

canonical sourceそのものは source archive / manifest 側で管理し、live public assetと役割を分ける。

---

## 8. Code rule

同じ機能の old implementation と current implementation を `src/` に並べ続けない。

安定後:
- currentへ一本化
- old implementationは削除
- 必要な歴史はGit history / docsに残す

特に:
- obsolete per-unit data
- old adapters
- duplicate parser
- versioned live module names
は定期的に監査する。

---

## 9. Naming rule

current live fileに古いversion名を残さないことを目標にする。

Bad examples:
- `v22Continuous.ts`
- `p39-v22-smoke.spec.ts`

stabilized後のpreferred:
- `chapter1Continuous.ts`
- `chapter1LearningSmoke.spec.ts`

Version名は prototype / archive には残してよい。

Renameはimport/test/workflowを同時に更新してから行う。

---

## 10. Docs rule

Docsの役割を分ける。

- `README.md` — product/repo overview
- `CHATGPT_README_FIRST.md` — AI作業入口/current status
- `docs/MASTER_APP_LESSONS.md` — accumulated judgment rules
- `docs/REPO_CLEANUP_POLICY.md` — repository hygiene
- `docs/README.md` — docs map
- `WORKFLOW.md` — execution process
- domain rules — detailed design rules
- audit — defect evidence
- worklog — chronology
- source manifest — provenance

同じcurrent statusを多数のファイルへコピペしすぎない。

---

## 11. Historical document rule

古いprototype/checkpointを残す場合:

-冒頭またはindexで `HISTORICAL` を明示
- current authorityへのリンクを置く
- 古いcount/statusを最新値として使わない

歴史的価値がない中間生成物は削除候補。

---

## 12. Cleanup cadence

次のタイミングで hygiene audit を行う:

- major feature merge後
- user QAで大きな方針変更後
- chapter完成時
- batch production開始前
- temporary migration/restore後

毎回見る:
- stale branches
- stale workflows
- dead assets
- dead code
- duplicate docs
- outdated names
- obsolete counts/status
- temp scripts
- source provenance

---

## 13. Cleanup safety gate

Cleanup commit後は最低:

```text
typecheck
↓
unit/data tests
↓
relevant browser tests
↓
production build
```

UI/content assetを削った場合は mobile + desktop browser も確認。

大規模cleanupでは `pnpm check:all` 相当を優先。

---

## 14. Do not

- 古そうという理由だけで削除しない
- source archiveをpublic assetと一緒に消さない
- historical evidenceとdead fileを混同しない
- cleanupで教材内容をついでに変更しない
- renameとbehavior changeを同じcommitへ大量に混ぜない
- CIがgreenになるまで「掃除完了」と言わない
- stale branchをmainより優先しない

---

## 15. Current cleanup authority

Current audit:
`docs/REPO_CLEANUP_AUDIT.md`

Future cleanup decisions must update that audit or create a dated successor section.
