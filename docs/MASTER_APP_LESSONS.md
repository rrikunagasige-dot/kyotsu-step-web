# MASTER APP LESSONS — 共通STEP 全体教訓

Status: **PROJECT-WIDE MANDATORY FIRST-READ**

Purpose:
このファイルは、これまでの共通STEP開発で得た設計・実装・教材制作・QA上の教訓を一つに集約した master lesson である。

これは単なる履歴ではない。

## Math practice mandatory first-read

Math I・A 基礎演習 / 4STEP 練習モードを変更・追加する場合は、このMASTERに加えて、作業開始前に必ず次を読む:

docs/MATH_PRACTICE_MASTER_LESSONS.md

数学練習モードでは、この専用MASTERが user-approved information architecture、inline穴埋め、current-target、subproblem compression、dependency/result reuse、数式rendering、mobile QA の最新authorityである。

今後、
- 新しい章を作る、
- 既存章を直す、
- UIを変える、
- 図を差し替える、
- 数式や穴を増減する、
- データ構造を変える、
- batch productionする、
- deployする、
といった作業の前に読む**判断基準**である。

詳細な証拠・履歴・専門ルールは各 authority 文書に残すが、まずこのファイルで「何を絶対に忘れてはいけないか」を確認する。

---

## 0. Authority / precedence

競合した場合の優先順位:

1. **最新の明示的なユーザー判断**
2. **この MASTER APP LESSONS**
3. current authoritative design/rule documents
4. latest fire diagram / audit / source manifest
5. worklog / historical snapshots
6. older prototypes / stale branch assumptions

古い文書に過去の数値やルールが残っていても、後の明示的な user-QA correction があれば後者を優先する。

重要:
- historical record は消さない。
- ただし「今のauthority」と「過去のsnapshot」は明確に分ける。

---

## 1. まず設計してから実装する

### 教訓

何を直すか分からない状態でコードを触ると、
- 問題範囲が広がる、
- ユーザーが直したくなかった部分まで変わる、
- 別の箇所を壊す、
- 後から何を変えたのか追えなくなる。

### ルール

作業順は原則:

```text
要求を読む
↓
authorityを確認
↓
現状を監査
↓
問題を列挙
↓
scopeを固定
↓
修正方針を決める
↓
実装
↓
tests
↓
browser
↓
build
↓
deploy
↓
USER QA
```

ユーザーが「まず分析だけ」「まだ直すな」と言ったら、修正してはいけない。

---

## 2. Scope control は仕様そのもの

### 教訓

「第一節だけ」
「この式だけ」
「この2か所だけ」
という指定は、単なる会話上の希望ではなく**変更境界**である。

### ルール

実装前に常に頭の中で:

```text
CHANGE:
  exact region / exact behavior

KEEP:
  neighboring content
  already accepted holes
  other derivations
  other figures
  other units
```

を固定する。

「ついでに改善」は許可がない限り行わない。

---

## 3. correctness だけでは教材Appとして不十分

数学・物理内容が正しくても、
- 見た目が分断される、
- 図が遅い、
- 数式が崩れる、
- 穴の意味が薄い、
- スマホで追えない、
なら教材としてFAIL。

Acceptance は最低でも:

1. semantic correctness
2. source fidelity
3. pedagogical correctness
4. visual correctness
5. interaction correctness
6. mobile usability
7. browser behavior
8. deploy integrity
9. user hands-on QA

を分けて考える。

---

## 4. 学習単元は「問題集」ではなく「連続した授業」

Core invariant:

> A learning unit is a continuous teaching narrative in which some important reasoning steps are made interactive.

つまり、
- 本文
- 図
- 式
- グラフ
- 穴
- 例題

は別々の箱ではなく、概念理解の流れの中に配置する。

固定順序:

```text
知識チェック
→ 図読み
→ 例題
→ 復習
```

を全概念へ機械適用しない。

---

## 5. 表現順序は概念依存

内部では次の表現を意識する:

- P = Phenomenon
- V = Visual
- Q = Quantity
- R = Relation
- M = Math
- G = Graph
- T = Transfer

概念ごとに必要な順序は違う。

例:
- ベクトル: 図と意味を同時に学ぶ方が自然
- 速度: 変位と時間から関係を作る
- 加速度: 速度変化・グラフ・式が相互依存

schema section名に学習順を支配させない。

---

## 6. Meaning before terminology

新しい専門用語を知らない段階で名前を当てさせない。

Bad:

```text
この量を何という？
A. 相対速度 ...
```

まだ意味を作っていないのに名称だけ当てる。

Preferred:

```text
現象
↓
図 / 関係
↓
意味を構成
↓
用語を教える
↓
後で retrieval
```

新しい言葉は「初回は教える」、後で「使わせる」。

---

## 7. One-step learnability

各穴は、その時点で見えている情報と既習内容から答えられなければならない。

答える根拠は:
1. 現在画面上の visible evidence
2. 直前までに明示的に学んだ内容
3. 一般的な数学知識

のどれか。

未学習の物理知識を暗黙に要求しない。

---

## 8. 穴の数ではなく「学習行為」で評価する

穴を置く理由を必ず説明できるようにする。

有効な学習行為:
- meaning judgment
- relation selection
- representation translation
- strategy selection
- physical condition
- variable elimination
- meaningful transformation
- calculation that applies a just-learned relation
- reuse of an intermediate result
- final interpretation
- retrieval / transfer

Bad:
- たまたま空けやすい場所
- 同じものをただ写すだけ
- 単純な数字当て
- 未習語の当て物
- 問題数を増やすための穴

ただし arithmetic だから即REMOVEではない。
その計算が「初めて関係式を使う学習行為」なら穴にする価値がある。

---

## 9. relation hole と result hole は別の学習行為になりうる

Chapter 1 の1Aで得た重要な教訓:

```text
Δr = [r2-r1]
   = numerical substitution
   = [(6,4)]

Δt = [t2-t1]
   = numerical substitution
   = [3]
```

ここでは:
- relation hole = 何を使うか
- result hole = 実際に適用できるか

を別に学ぶ。

同じ概念が2回出ても、役割が違えば冗長ではない。

ただしこのパターンを全例題へ自動コピーしない。
概念の初回適用・transfer・reuseの必要性を見て判断する。

---

## 10. 一つの推導 = 一つの視覚的まとまり

連続した導出を式ごとに別カードへ分割しない。

Bad:

```text
[ formula card ]
[ formula card ]
[ formula card ]
```

Preferred:

```text
ONE DERIVATION FRAME
  parent relation
  ↓
  substitution
  ↓
  calculation
  ↓
  result
  ↓
  reuse / interpretation
END
```

visual grouping は semantic grouping でもある。

---

## 11. 「途中式を増やす」と「穴を増やす」は別

Mobile-firstでは中間導出を見せる必要がある。

しかし:

```text
visible derivation detail ↑
unshown cognitive jumps ↓
hole count ≠ automatically ↑
```

必要な途中式は見せる。
その中で、学習価値のある判断だけinteractiveにする。

---

## 12. Formula derivation の基本

非自明な導出では:

```text
parent relation
↓
physical condition / substitution
↓
intermediate transformation
↓
final reusable form
↓
physical meaning
```

を可能な限り可視化する。

穴候補:
- F1 parent relation
- F2 physical condition
- F3 variable elimination
- F4 meaningful transformation
- F5 final reconstruction

最終結果だけ穴にして途中がブラックボックス、は避ける。

---

## 13. 図は装飾ではなく source / evidence

Canonical textbook figure は教材の一部。

原則:
- 元のcanonical figureを使う
- 内容を勝手に描き直さない
- AI生成guideへ黙って置換しない
- high-resolution re-exportは内容不変なら可
- 新しい図を作るなら明示的なユーザー判断が必要

図が不十分ならまず:
1. prose
2. placement
3. question timing
4. crop / scaling
を直す。

---

## 14. 図は参照される前に存在しなければならない

「図6を見ると」と書くなら、その時点で図6が画面上にあること。

Hard gate:

> first textual mention of 図N must occur after fig-N insertion.

図を未来に置いたまま説明だけ先に出さない。

---

## 15. 図の品質も correctness

チェック:
- canonical source identity
- resolution
- no unauthorized crop
- no missing labels
- no blur
- no upscaling of low-res raster
- phone widthで読めるか
- required contentがmaskで隠れていないか

「画像がロードできた」だけではPASSしない。

---

## 16. 数式は compile だけでなく visual QA する

Math QA は3段階:

1. semantic correctness
2. compile correctness
3. visual correctness

問題例:
- raw LaTeX
- KaTeX error
- combined subscript崩れ
- 根号の見た目
- 二重矢印/二重bar
- 重複表示
- 行幅overflow

rendererが受け付けたから終わり、ではない。

---

## 17. Formula repetition を機械的に消さない

Bad repetition:
- 同じ完成式をすぐ下でもう一度表示
- learner actionが何も変わらない

Good repetition:
- 以前学んだ式を例題でretrievalする
- 図→式へrepresentation transferする
- 新しいcontextへ適用する

判定基準:

> 同じ式が再登場した時、学習者は前回と違うことをしているか？

Noなら削る/統合。
Yesなら目的を明示。

---

## 18. Scaffold は段階的に弱める

概念初回と後半transferで同じ支援を続けない。

目安:
- S0 teach/read
- S1 strong guided choice
- S2 relation / representation
- S3 derivation strategy
- S4 transfer reduced support
- S5 self reconstruction

同じ4択強度を最後まで続けない。

---

## 19. Wrong answer は「進捗」にしない

誤答時:
- unresolvedのまま
- すぐ正答を出さない
- evidenceへ戻すhint
- 2回目はより具体的hint
- 必要なら prerequisite を復元

四択を順番に押せば突破できる設計にしない。

---

## 20. Leakage を全チャネルで見る

答え漏れは本文だけではない。

確認対象:
- title
- heading
- caption
- alt
- figure label
- previous formula
- next formula
- tooltip
- resolved state
- choice wording

問題を出す前に答えが見えていないか監査する。

---

## 21. Mobile-first は「紙なし」を前提にする

対象学習者は:
- phone only
- no paper
- no pen
- no second screen

かもしれない。

App側だけで追えるように:
- intermediate steps
- relevant figure
- current formula
- hint
を必要な時点で表示する。

横に長い式、巨大な図、離れた参照を避ける。

---

## 22. Student UI に内部構造を漏らさない

内部で必要:
- stable IDs
- 1A/1B
- A9/D4
- revision
- parser version

student UIには不要。

learner-facing:
- prose
- headings
- prompts
- feedback
- choice panels

に内部IDやversionを出さない。

---

## 23. Stable ID と revision を軽視しない

旧実装の教訓:
- array indexをanswer identityに使わない
- questionとattemptを分離する
- revision変更時に古いprogressを誤適用しない

重要変更ではrevision bumpを行う。

データ移行で「昔の正答済み」が別の穴へ流用されないようにする。

---

## 24. Source authority と provenance を残す

教材sourceは必ず出所を追えるようにする。

記録する:
- source file
- page range
- canonical archive
- filename mapping
- SHA256 / size
- transformed asset
- current authority
- historical-only artifact

sourceが未確認なら「確認済み」と言わない。

---

## 25. 元sourceを壊さない

Reference project / original ZIP / textbook archive は read-only source として扱う。

- originalを直接上書きしない
- platform-specific codeをそのまま移植しない
- current appへ必要な形にreconstructする
- sourceとderived assetを区別する

---

## 26. UI設計は「見た目」ではなく操作意味まで含む

Design system:
- mobile-first
- touch target >= 48px
- readable line height
- no accidental horizontal overflow
- stateを色だけで表さない
- navigationで本文を隠さない
- low-radius / paper-like visual identityを維持

ただしdesign-system consistencyより学習意味を優先する。
「カード統一」のために導出を分断しない。

---

## 27. Audit mode と Repair mode を分ける

ユーザーが「全部の問題を先に探して」と言ったら:

Audit:
- defect inventory
- classification
- dependencies
- no symptom patching

Repair:
- accepted listをfreeze
- priority順にfix
- each group after test

作業中に新しい不具合を見つけても、勝手にscopeへ加えるかはユーザー意図を見る。

---

## 28. 一度に大量変更しない

特にuser-QA中は:
- one defect class
- one section
- one derivation
- one figure family

の単位で進める。

小さく直すことで:
- cause/effectが分かる
- rollbackしやすい
- user approvalが明確
- test failure原因も追いやすい

---

## 29. Testは仕様を固定するために使う

テストは単にgreenにするものではない。

user-approved behaviorをencodeする。

例:
- one derivation container
- no inner formula borders
- exact hole order
- exact canonical figures
- figure-before-reference
- no generated figure directive
- no internal code leakage
- wrong answer unresolved
- no KaTeX error
- mobile / desktop both boot

「今回の教訓を次回忘れない」ための executable memory と考える。

---

## 30. Automated PASS と User PASS は分ける

Release ladder:

```text
source/data
↓
typecheck
↓
unit tests
↓
math/asset gates
↓
mobile browser
↓
desktop browser
↓
production build
↓
Pages deploy
↓
USER HANDS-ON QA
```

最後のuser QAが終わる前に、
「教材として完成」
「P39 PASS」
と断定しない。

---

## 31. GitHub docs も実装の一部

大きな設計変更では:
- README
- master lessons
- fire diagram
- source manifest
- audit
- worklog

のうち必要なauthorityを同期する。

ただし全ファイルへ同じ文章をコピペしない。

役割:
- MASTER APP LESSONS = reusable judgment
- README_FIRST = entry point / current status
- FIRE_DIAGRAM = dependency / state
- RULES = detailed domain rule
- AUDIT = defect evidence
- WORKLOG = chronology
- SOURCE_MANIFEST = provenance

---

## 32. 古いsnapshotを「現在」として読まない

長期projectでは古いcountやstatusが残る。

例:
- 45 holes
- 47 holes
- 49 holes
- 13 derivations
- 14 derivations

historical snapshotは削除せず残すが、latest authorityを明示する。

数値を使う前に必ずcurrent source/testを確認する。

---

## 33. Branch / repo authority を確認する

作業前:
- correct repository
- correct branch
- current main HEAD
- stale branchではないか

を確認する。

古いbranchを「最新版」と誤認しない。

---

## 34. 失敗したCIを隠さない

CI failureが出たら:
- どこまでPASSしたか
- 何がFAILしたか
- app defectかtest defectか
- 修正後の最終run

を分けて記録する。

途中runがFAILでも、最後のrunがgreenならその履歴も残す。

---

## 35. 実際の原因と症状を分ける

例:
- 「白枠が多い」は症状
- 原因は「semantic derivation groupがUIに存在しない」

- 「図がない」は症状
- 原因は「figure timing / source mapping / reveal ordering」

- 「穴が弱い」は症状
- 原因は「learning purposeが定義されていない」

修正は原因へ行う。

---

## 36. 一般化する前にユーザーの意図を確認する

一つの成功パターンを見つけても、
「全部これでいい」とは限らない。

Chapter 1 1A:
- relation hole + result hole

はよかった。

しかしこれは:
- first worked example
- just-learned relation
- same-chain reuse

という条件があった。

局所patternの一般化には条件を書く。

---

## 37. Anti-pattern master list

将来のAI/開発者は次を避ける:

- いきなりコードを書く
- userが「まだ直すな」と言っているのに修正
- local fixを全章へ展開
- formula = automatically hole
- arithmetic = automatically remove
- more holes = more learning
- fewer holes = better pedagogy
- one equation = one card
- unclear figure = invent a new figure
- generated figure = canonical source
- text refers to future invisible figure
- compile success = visual success
- repeated formula = always bad
- repeated formula = always good
- test green = pedagogically complete
- deployed = user approved
- internal IDをstudent UIへ表示
- old snapshot countをcurrent扱い
- source hash未確認でverified扱い
- stale branchで作業
- READMEだけ更新してtestしない
- testだけ更新してactual browserを見ない

---

## 38. Future-work preflight checklist

作業開始前:

1. 今のauthorityは何か？
2. latest mainか？
3. userのscopeはどこまでか？
4. 今はauditかrepairか？
5. learnerがここで学ぶものは何か？
6. representation順は自然か？
7. source figureはcanonicalか？
8. figureは参照前に見えるか？
9. 一つのreasoning chainは一つに見えるか？
10. 各holeのlearning purposeは何か？
11. answer leakageはないか？
12. phoneだけで追えるか？
13. mathはcorrect / compile / visualすべてOKか？
14. internal metadataはstudent UIに漏れていないか？
15. revision bumpが必要か？
16. どのtestで今回のruleを固定するか？
17. browserでmobile/desktopをどう確認するか？
18. deploy後に何をuser QAしてもらうか？
19. docs authorityのどこを更新するか？
20. 「完成」と言う条件は何か？

---

## 39. Detailed authority documents

Project / engineering:
- `../WORKFLOW.md`
- `DESIGN_SYSTEM.md`
- `source-audit.md`
- `WORKLOG.md`

Physics textbook pedagogy:
- `physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md`
- `physics-ch01/P35_PEDAGOGY_RULES.md`
- `physics-ch01/LEARNING_TEXT_WRITING_RULES.md`
- `physics-ch01/FORMULA_DERIVATION_RULES.md`
- `physics-ch01/P34_CURRENT_APP_CONTRADICTION_AUDIT.md`
- `physics-ch01/P38_VIRTUAL_LEARNER_AND_AUDIT_MODE.md`
- `physics-ch01/P39_HOLE_QUALITY_AUDIT.md`
- `physics-ch01/P39_LIVE_APP_DEFECT_AUDIT.md`

Source / provenance:
- `physics-ch01/SOURCE_MANIFEST.md`
- `source_archives/README.md`

State / dependency:
- `physics-ch01/MASTER_FIRE_DIAGRAM.md`
- `physics-ch01/WORKLOG.md`

---

## 40. Final rule

このprojectで最も重要なのは:

> **正しいものを大量に作ることではなく、学習者が理解できる形を、source・理由・scope・testを保ったまま再現可能に作ること。**

新しい実装がこのmasterと衝突する場合、
実装を先に進めず、どのルールを変えるのかを明示してから進む。


---

## 41. Repository hygiene is part of correctness

Repository clutter can reintroduce old bugs by making stale code/assets/docs look current.

Mandatory companion:
`REPO_CLEANUP_POLICY.md`

Before major new work, verify:
- current main authority,
- no stale workflow is being treated as active,
- rejected assets are not left in public paths,
- dead/legacy code is classified,
- historical docs are not mistaken for current state,
- temporary artifacts have an exit plan.

Cleanup must be evidence-based: delete only after reference/provenance checks, then run the relevant full gate.

---

## 42. Formula application gate — taught is not the same as learned

Chapter-1 1B user QA exposed a recurring defect: a formula can be explained correctly in the concept section and still never be used by the learner in the worked example.

Hard rule:

> An important formula is not pedagogically complete merely because it appeared in prose. A worked example or transfer event must make the learner retrieve/select the relation and then apply it to concrete quantities.

Preferred chain:

```text
learn relation
↓
worked example asks learner to retrieve/select it
↓
substitute concrete vectors/values
↓
compute an intermediate result
↓
reuse that result / interpret it
```

For 1B this means:
- composition: retrieve `v = v1+v2` → add components → recover speed,
- decomposition: retrieve `(vx,vy)=(v cosθ,v sinθ)` → substitute a concrete angle/value → compute components.

A final numerical question alone does not count as formula application when the App has already supplied the important intermediate vector/relation.

Do not generalize this into “every formula needs many holes.” The gate is about learner action: relation retrieval + actual use.

## 43. Next-unit review protocol

When moving from one user-reviewed unit to the next, do not immediately edit.

Required order:

```text
read MASTER_APP_LESSONS
↓
read relevant pedagogy / formula / user-QA lessons
↓
inspect current unit exactly as deployed
↓
state what the learner is supposed to learn
↓
check whether each important formula is actually used
↓
propose a correction plan only
↓
USER CHECK
↓
implement only after approval
```

This protocol is explicitly required for the next Chapter-1 unit review after 1B.


---

## 44. Cross-unit retrieval is valuable review, not redundant repetition

A formula learned in one unit should sometimes be retrieved again in a later unit when the new context genuinely needs it.

Example:
- 1B teaches the magnitude of a velocity vector,
- 1C can reuse that relation after constructing a relative-velocity vector.

This is pedagogically valuable because the learner must recognize:
1. the old relation is still applicable,
2. the representation is the same even though the physical context changed,
3. the result of the new calculation has physical meaning in the new unit.

Therefore a repeated formula should not be removed merely because it appeared in the previous unit.

Good cross-unit review:
```text
learn relation in unit N
↓
new context in unit N+1
↓
retrieve the old relation with weaker support
↓
apply it to the new result
↓
interpret in the new context
```

Bad repetition is still bad:
- showing the same completed formula again with no learner action,
- repeating identical arithmetic only to increase hole count.

The distinction is whether the learner performs retrieval/transfer.


---

## 45. Active derivation on phone — the learner should build the formula, not watch it

From the 1D review, a stronger rule is now required for genuine physics derivations.

For a nontrivial derivation, the learner should be able to use only the phone screen and still actively reconstruct the important reasoning steps.

The target experience is not:

```text
read formula
↓
read next formula
↓
read final formula
```

It is:

```text
see the physical setup
↓
make one meaningful inference
↓
fill that step
↓
see the consequence
↓
make the next inference
↓
complete the derived formula
```

This means derivation holes may legitimately appear at intermediate physical-identification steps such as:

- `Δv = v - v0`,
- `Δt = t - 0 = t`,
- selecting the relation that eliminates a variable,
- reusing a formula derived a few lines earlier,
- identifying a graph area or geometric quantity,
- reconstructing the final reusable formula.

The aim is not to maximize hole count. The aim is to make the learner perform the meaningful reasoning that would otherwise be silently done by the App.

### Phone-only derivation gate

A derivation should pass the following test:

> If the learner has no paper, no second screen, and no teacher beside them, can they still follow the visible chain and actively supply the important reasoning steps?

If the answer is no, either:
- an intermediate reasoning step is missing,
- an interaction is missing,
- or a required representation/figure is missing.

---

## 46. A required diagram is part of the derivation

If a derivation depends on a geometric/graphical fact, the figure is not decoration; it is part of the proof/derivation.

Example from constant acceleration:
- displacement from a `v-t` graph requires seeing the graph,
- “rectangle + triangle” is not an acceptable explanation if no such visual decomposition is shown.

Therefore:

> Do not ask the learner to mentally reconstruct a graph or geometric decomposition that the App could show directly.

This does not weaken the canonical-figure rule.

Distinguish:
1. **replacement figure** — silently redraws/replaces a canonical source figure → prohibited unless explicitly approved;
2. **new required educational representation** — no canonical figure exists for a reasoning step, and the missing representation is necessary to understand the derivation → may be added after explicit design approval.

A new educational figure must have:
- a declared pedagogical purpose,
- a clear relationship to the derivation,
- no claim of being a textbook-original figure,
- its own provenance/status,
- tests/QA for mobile readability.


---

## 47. Math rendering has its own technical authority

Pedagogical formula rules and rendering rules are separate concerns.

For tokenizer / Unicode normalization / KaTeX / inline-vs-block consistency / visual-math defects, read:

`docs/MATH_RENDERING_RULES.md`

Hard rule:
**do not rewrite correct physics content to hide a rendering bug. Fix the math rendering pipeline and add regression coverage.**


---

## 48. Repair-scope persistence — a technical detour must not erase the original defect list

1E exposed a workflow failure: the unit had already been audited for multiple pedagogical defects, but after a new radical-rendering defect was discovered, the repair work temporarily narrowed to the technical issue and the original content defects were left open.

Hard rule:

> Once a repair scope has been approved, keep an explicit checklist until every approved item is either fixed, deliberately deferred, or rejected by the user.

Example:

```text
1E repair scope
  [technical] inline radical rendering
  [pedagogy] apply 1D formulas horizontally
  [pedagogy] apply 1D formulas vertically
  [content] repair broken E3a relation
  [retrieval] reuse vector magnitude from 1B
  [derivation] make t=x/v0 an active elimination step
  [worked example] vertical time -> horizontal range
```

Finding a technical bug in the middle does not cancel the pedagogical items.

Completion language is allowed only when the whole active checklist is closed.

For mixed defect classes, fix all user-approved items in the same section before moving to the next section, unless the user explicitly asks for a narrower partial repair.


---

## 49. Information architecture is a separate design layer

A recurring UI problem is excessive learner-facing titles.

This is not merely:
- a writing problem,
- a CSS problem,
- a pedagogy problem,
- or an internal taxonomy problem.

It is an **information-architecture problem**: how many conceptual chunks the learner is asked to hold in mind.

Project-wide authority:

`docs/INFORMATION_ARCHITECTURE_RULES.md`

Chapter 1 design direction:
- preserve internal 1A〜1G identities,
- reduce learner-facing major titles to 3 conceptual chunks,
- repair the lost boundaries with explicit bridge sentences,
- do not stack 3 new titles on top of the old 7 titles,
- final displayed wording must receive user QA before implementation is considered complete.

Hard rule:

> **Title reduction is successful only if the conceptual connections become clearer, not merely if fewer headings remain.**
---

## 50. Major-title/body alignment + phone-first derivation density

Information architecture and pedagogy must agree.

If a learner-facing major title is broadened from a source-topic list to a conceptual theme, the body must construct that concept rather than merely keeping the old content under a new heading.

Example from Chapter 1:
- old source topic: 重力加速度・空気抵抗・終端速度
- learner-facing theme: 力と運動

The body therefore needs the causal parent spine:

```text
net force
→ acceleration
→ velocity change
```

before gravity/drag become the concrete application.

A second rule follows from the same user QA:

> “Later unit = lighter scaffold” does not mean “later unit = few interactions”.

Keep support lighter, but preserve active checkpoints when they represent distinct physical reasoning:
- retrieve the parent law,
- identify the physical force/condition,
- choose a sign,
- close a causal link,
- apply a boundary condition,
- reconstruct a reusable final relation.

Mechanical rearrangement and calculator arithmetic can remain visible rather than interactive.

For mobile-only learning, judge derivation density by whether the learner actively builds the chain on the screen, not by a preset hole quota.
