# Existing code and reference reuse

新しいworkflowやmath engineは作らない。既調査の由来は`tools/textbook/THIRD_PARTY_REFERENCES.md`とW-GOV-010/REFERENCE_CODE_SOURCES.jsonに残る。

| 必要な仕事 | 実際に利用する既存code | AIが引き受ける不足 |
|---|---|---|
| 原Word抽出 | Pandoc/texmath + source/import-word.py | 数学的意味と無番号段落の役割 |
| 構造化 | Zod + ir/index.mjs | 正しい式であっても必要性が分かるか |
| 式の厳密検算 | SymPy（制約を付けた恒等式/不等式集合） | 対象・条件・符号の説明が十分か |
| 教える順序 | planner/graph.mjs、teaching/step候補 | 初学者の既知情報だけで進める候補を選ぶ |
| 穴 | interaction/index.mjs | 何を考えさせるか、未知事実を当てさせていないか |
| 表示 | KaTeX、TypesetFormula、SemanticReading、NumberedEquation | 文章と式のつながり、実画像の読みやすさ |
| 短くする表示 | GuidedMathReadingFlowの段階/knownRefs/history | 呼び戻す結論の条件と量 |
| 事例検索 | 固定multilingual-e5-small encoder + scoped corpus | 今の箇所へどう適用するか |
| 品質の学習 | sklearn LogisticRegression.fit、既存ml/train.py | ラベルの出所・範囲・学習可能性、昇格させない判断 |
| 工程/承認 | 既存workflow.Runtime/Store/production2 | AIの監査証拠を書く。本人の受入は代行しない |

Mathstepsのbefore/after/substeps、Numbas/STACKのpart/gap、PreTeXtの教材役割、DoenetMLの条件表示は既調査の設計参照で、今回それらのruntimeを新規移植・vendor化しない。現在の既存実装で必要な機能を具体的に指定する。
