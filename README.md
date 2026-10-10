# 塾 / Kyotsu Step — GitHubの入口

高校数学・物理の教材制作と学習アプリを、以前のPaul版Repository OSの手順に従って管理するプロジェクト。**このREADMEは人間・新しいAIの共通入口であり、詳細仕様書ではない。** 旧版の管理構造を継承しつつ、正しい書込み先は必ず \`rrikunagasige-dot/kyotsu-step-web\`（Repository ID \`1391122224\`）とする。旧 \`paulfields83/kyotsu-step-web\` は参照専用。

## 最初に行うこと — 「憲法から」

1. **GitHub実体確認:** owner / repository ID / branch / live \`main\` のHEADを確認。誤接続ならSTOP。
2. **命令を照合:** [指示辞典](governance/INSTRUCTION_DICTIONARY.md) の \`CMD-ROOT-001\` と \`EXACT / SIMILAR / UNKNOWN\` に従う。類似指示は確認なしに実行しない。
3. **上位規則を読む:** [AGENTS（AI入口）](AGENTS.md) → [憲法](governance/CONSTITUTION.md) → [命令語](governance/COMMAND_WORDS.md) → [変更手順](governance/CHANGE_PROTOCOL.md) → [正本の権限](governance/DOCUMENT_AUTHORITY.md)。
4. **現在地を復元:** [CURRENT_POSITION](navigation/CURRENT_POSITION.md) → [MASTER_MATCH_GRAPH（火柴図）](navigation/MASTER_MATCH_GRAPH.md) → [ACTIVE_CONTEXT](memory/ACTIVE_CONTEXT.md) + [PROGRESS](memory/PROGRESS.md)。
5. **対象モードのみ読む:** 下記の教材の正本、承認済み [Work System](governance/WORK_SYSTEM.md)、対応する [Work記録](work/README.md) と必要な [教訓](memory/LESSONS/)・[決定](memory/DECISIONS/)。
6. **承認ゲート:** 未承認なら \`ASSESS → PROPOSE → USER APPROVAL\` でSTOP。承認済みならそのexact scopeでだけ作業し、検証結果とレビュー可能なPR/アプリURLを記録。
7. **分離する:** 提案承認 ≠ 実装完了 ≠ PRマージ承認 ≠ GitHub Settingsの変更承認 ≠ 公開教材のユーザー実地評価。

## 数学・物理の4モード

公開範囲は必ず [MODE_STATE](navigation/MODE_STATE_2026-10-10.md) とlive mainで確認する。旧Paul版の番号・backend・公開状態で上書きしない。

| 対象 | 作業の入口 | 現在の実体・正本 |
| --- | --- | --- |
| 数学 学習・教科書 | [Math Textbook候補SPEC](subjects/mathematics/textbook/SPEC.md) | [数学校正済みデータ](src/data/textbook/math/)：集合 \`math-sets\` 公開。残りの該当単元はreviewで、未公開を自動昇格しない |
| 数学 練習 | [Math Practice候補SPEC](subjects/mathematics/practice/SPEC.md) | [既存の教訓](docs/MATH_PRACTICE_MASTER_LESSONS.md)、[87–120構造](docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md) |
| 物理 学習・教科書 | [Physics Textbook候補SPEC](subjects/physics/textbook/SPEC.md) | [README FIRST](CHATGPT_README_FIRST.md)、[第1章火柴図](docs/physics-ch01/MASTER_FIRE_DIAGRAM.md)：1A–1Gの内部単位は保持し、学習者向け3見出し |
| 物理 練習 | [Physics Practice候補SPEC](subjects/physics/practice/SPEC.md) | [現行代表問題](src/data/textbookPracticeQuestions.ts)：3問と第1章adapter。大規模問題バンクの完成とは異なる |

\`subjects/**/SPEC.md\` は現在の教材の上に立つ新正本ではない。承認済み原資料と齟齬があれば、編集せずFindingとして記録する。

## Work（作業ごとの正式な証拠）

[Work System](governance/WORK_SYSTEM.md)に従い、\`work/items/<WORK-ID>-<short-name>/\` に以下を残す。

\`WORK.md\`（現在の状態） / \`PROPOSAL.md\`（修正案・承認） / \`ACTION_LOG.md\`（実作業） / \`FINDINGS.md\`（問題・教訓） / \`VERIFICATION.md\`（観測した結果）。

[作業テンプレート](work/templates/)、[品質確認](quality/QUALITY_GATES.md)、[現在の技術仕様](technical/README.md)を利用する。批准・変更範囲のCIは検査の一部であり、**あなたの本当の承認の代わりにはならない**。未解決なら \`PENDING\` / \`NEEDS-HUMAN-REVIEW\` と報告。

## 旧Paul版との関係

[旧Repo OSの保存アーカイブ](history/imports/paulfields83-20261010/README.md)には旧Work・ADR・監査・技術規則がGit SHAを保って収録されている。旧backend仕様は現行対象の設計ではない。[比較監査](work/items/W-GOV-007-repository-os-parity/PARITY_AUDIT.md)も参照。今後の復元では現在の教材・原本が優先。

---

## 移植前からのアプリREADME本文（原文保存）

> 以下は従来からあるアプリREADMEの記述を編集・削除せず保存したもの。旧い内蔵問題数・Nodeバージョン等は現在の公開範囲を表さない可能性がある。現行の正本と状態は上のMODE_STATE / \`AGENTS.md\` / live codeで判断する。

> **Repository OS入口 (2026-10-10):** [AGENTS.md](AGENTS.md) → [憲法](governance/CONSTITUTION.md) → [現在地](navigation/CURRENT_POSITION.md)。作業開始は「憲法から」。既存教材・UI・題庫の正本は [CHATGPT_README_FIRST.md](CHATGPT_README_FIRST.md) と従来の `docs/` を保持。旧READMEの数値や機能範囲は履歴的記述。現行4モードの正本・公開状態は [MODE_STATE](navigation/MODE_STATE_2026-10-10.md) と live main で確認する。

# 共通 STEP 数学・物理刷题 Web App

面向日本大学入学共通测试的手机优先 Web App。产品把逐空学习、无即时反馈模拟测试、真实 Attempt 分析、错题复习和本地题库管理连成一个闭环。

## 已实现

- 学习模式：三种引导程度、逐空选择、首次答案不可覆盖、错后回填正确答案、局部解析、刷新恢复和真实完成统计；
- 模拟测试：科目/范围/难度/题数/时间设置，单选、多选、数值题，题号导航、稍后检查、自动保存、超时交卷和统一判分；
- 学习闭环：知识与解题行为分维度分析、错题状态自动推进、Attempt 历史、规则型真实巩固题；
- 本地功能：明确标识的演示排名、持久化设置、确认式清除、JSON 题库导入/导出/预览；
- 内容：2 道数学、2 道物理内置题，覆盖 KaTeX、图片、表格、长日文和 6 空长流程；
- 双语：顶部可随时切换 `日本語 / 中文`；语言偏好自动保存，4 道内置题各有独立编写的完整中文内容，答题中切换不会丢失进度；
- 工程：TypeScript、ESLint、Vitest、Playwright、生产构建、错误边界、键盘焦点和多视口回归。

## 快速开始

需要 Node.js 24 和 pnpm 11。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://127.0.0.1:4173`。

```bash
pnpm check       # typecheck + lint + unit + production build
pnpm test:e2e    # Playwright 手机流程
pnpm check:all   # 完整门禁
```

## 主要目录

```text
src/domain/       题目 Schema、学习/模拟状态、判分、分析、推荐
src/data/         通过 Zod 校验的日文/中文内置题库
src/i18n/         语言运行时与科目、难度、标签显示名
src/stores/       Zustand persist 会话、Attempt、题库和设置
src/components/   AppShell、内容 renderer、学习流程与通用状态
src/pages/        路由页面
e2e/              手机端真实用户流程
docs/             PRD、矩阵、架构、测试、内容、部署和阶段报告
```

更完整的技术决策见 [ARCHITECTURE.md](docs/ARCHITECTURE.md)，题目字段见 [QUESTION_SCHEMA.md](docs/QUESTION_SCHEMA.md)，完整执行门禁见 [WORKFLOW.md](WORKFLOW.md)。

## 本地数据与隐私

- 不需要登录，不连接正式后端，不上传答题数据；
- 会话、Attempt、自定义题和设置保存在浏览器 `localStorage` 的 `kyotsu-step-store`；
- `settings.language` 保存当前语言；已有本地记录升级后默认保持日文，可随时切换中文；
- 清理浏览器站点数据会删除本地记录，当前版本不支持跨设备同步；
- 排名页是固定演示数据与本机真实表现的比较，不是全国或联网排名；
- 时间戳以数值保存，界面历史按 `Asia/Tokyo` 显示。

## 题库管理

从“マイページ → 題庫を管理”进入 `/admin`：

1. 可把当前题复制到 JSON 编辑栏；
2. 修改 `questionId`、内容和关系后执行联合验证；
3. 验证通过才会替换本地追加题库；
4. 可分别下载追加题库或完整题库 JSON。

非法 ID、悬空空栏/选项/图片/关系、错误表格列数和不完整判分字段都会被拒绝。内置题只读。具体规则见 [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)。

内置中文题库与日文题库共用稳定 ID 和判分逻辑，但题干、选项、解析、表格与图片说明分别撰写。用户自己导入的 JSON 按文件原始语言显示，应用不会自动机翻。

## 部署

`pnpm build` 生成纯静态 `dist/`。托管平台必须把未知 SPA 路径回退到 `index.html`。生产建议、缓存与 CSP 见 [DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 参考材料与当前 authority

原始参考材料与 live App 继续分离管理。Chapter 1 的 canonical figure/source archive 已完成 identity 记录，当前 provenance 见 [SOURCE_MANIFEST.md](docs/physics-ch01/SOURCE_MANIFEST.md)。

开始大规模修改前先读：
- [MASTER_APP_LESSONS.md](docs/MASTER_APP_LESSONS.md)
- [REPO_CLEANUP_POLICY.md](docs/REPO_CLEANUP_POLICY.md)
- [Documentation Map](docs/README.md)

历史性的早期 source audit 仍保留在 [source-audit.md](docs/source-audit.md)，但不要把其中“原件尚未同步”等旧状态当作当前事实。
