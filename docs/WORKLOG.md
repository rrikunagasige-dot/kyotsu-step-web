# WORKLOG

## 2026-08-02

- 建立完整 Workflow、PRD、需求矩阵、架构、测试、设计、Schema、内容和部署控制文档；
- 记录原附件未同步与继承审计证据；
- 开始阶段 0 独立 Vite/React/TypeScript 工程与质量基线。
- 阶段 0–3：完成只读参考审计、工程基线、信息架构、设计系统、版本化 Question Schema 与 4 道验证题；
- 阶段 4–5：完成逐空学习状态机、首次答案、回填、局部解析、刷新恢复和真实完成页；
- 阶段 6–7：完成无反馈模拟、持久计时、统一判分、结果分类与真实巩固推荐；
- 阶段 8–10：完成 Attempt 分析、自动错题状态、历史、本地演示排名、设置和本地题库管理；
- 阶段 11：修复 skip link、弹窗焦点、手机表格溢出和生产大包；最大 JS chunk 266.11 kB；
- 进入阶段 12，补全 README、内容/部署说明并执行最终 `check:all`。
- 最终 `check:all`：18 项单元测试、22 条 Playwright E2E、类型、ESLint 和生产构建全部通过；阶段 0–12 均 PASS。
- 阶段 13：新增全局日文/中文切换、持久化语言偏好、中文界面与 4 道独立中文题目；保证双题库稳定 ID/判分逻辑一致，答题中切换不重建 session；
- 阶段 13 首轮回归发现语言按钮触控高度不足和管理页变量重名，修复并补回归；最终 `check:all` 为 21 项单元测试、24 条 Playwright E2E、类型、ESLint、生产构建全部通过。


## 2026-10-04 — Math practice 119 checkpoint

- 87–118: main へ統合済み。
- 119 「関数の値」: 日本語/中国語source、current-item presentation、catalog/taxonomy、unit tests、E2E を実装。
- 119の設計原則: 単純な数値代入は1段、複合入力 f(a+1), g(-a), g(a-1) のみ「代入→必要な展開/符号処理→整理」に分ける。
- 10小問は current-item-only 表示。前の小問結果を convenience link として残さない。
- 問題一覧は mobile overflow を避けるため、同一LaTeX block内で5行×2項に折り返し。
- source fidelity: 原典 pages 71–73 と照合済み。式・小問順・段階化すべて一致。
- PR #41。差分は Math 119 関連のみで physics 混入なし。
- 最新CI: typecheck PASS / focused tests PASS / build PASS / mobile smoke PASS。desktop smoke 実行中。
- 120: 別prep branchで no-blank solution、thinking nodes、dependency graph、answer leakage、stable blank IDs/choices、最終87–120 QA planまで準備済み。本実装は119 merge後。


## 2026-10-04 — Math practice 87–120 release QA / production release

- PR #44 の98–120 reasoning-flow / progressive figuresをmainへ統合し、Pages公開を実施。
- feature branchのPages QAがproduction Pagesと同じdeployment targetを使い、`concurrency: pages` でmain deployをcancelし得る問題を確認。production deployをmainで再実行し成功。
- release QAで図のsemantic / answer-leakageを再監査。
- PR #45で修正:
  - 99-(2) `(-∞,1)` を左無限rayとして描画
  - 101の実数数直線を左右両方向arrowへ修正
  - 110の途中図から完成済み implication forms を除去し、summaryでのみ表示
- 追加監査で99-(4)のendpoint leakageを発見:
  - `P=[-2,2]`, `Q=(-2,4)` の○/●が `p4-left-endpoint` の答えを先に表示
  - PR #47でF99-4をendpoint判断後まで遅延
  - focused timing regression追加
- PR #47 CI run `37182773854`:
  - typecheck PASS
  - unit/focused tests PASS
  - build PASS
  - Pixel 7 mobile smoke PASS
  - desktop smoke PASS
- main merge commit: `bba63fdcd77c67f6a71f6ca9b1160d19e1e7d42e`
- production Pages run `37182944455`: build PASS / browser smoke PASS / deploy PASS
- deployed Pages build version: `bba63fdcd77c67f6a71f6ca9b1160d19e1e7d42e`
- 111–120を追加静的監査:
  - target label / dependency / guide leakage: 新規confirmed defectなし
  - 114 figures: resultを先出しせずcase-onlyでPASS
  - 118 two-output reveal: count判断後のみ2-output figureでPASS
  - 120 route/domain figures: endpoint未解決時は`x=?`、両endpoint解決後のみ0/5表示でPASS
- workflow lesson:
  - CI / Pages待ち中は次の独立監査を進める
  - mainが並行chatで進んだら再baseし、重複変更を捨ててPRを最小化する
- 現在の残作業: production appでのuser hands-on QA。具体的不具合が出た箇所だけ再openする。
