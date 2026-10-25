# Findings

CONFIRMED:
- Q03の前結果関数はnode.after/outputLatexだけを描き、元問題とtableを運ばない。
- 倍率10/100が独立output、操作「引く」がchoiceだけのparagraph、係数9x/99xが別式になっている。
- さらにQ02の二つの余り、Q12のr上限、Q10約分にも同型の孤立がある。
- 現行compiled readingFlowにはterm partsが0件。正式な定義語の9位置に意味属性を付ける必要がある。
- before/afterの数式候補は文字列検出だけでも複数あり、変数単体はそれだけでは拾い切れない。全41nodeの明示parts設計で補った。
- Q06の最小の定義域はWord p315に存在し、appのbeforeで欠落。倍率1を含む曖昧な最小性にはしない。
- production/2の初回実運用はlegacy artifactと新IRの区別、モデル不在時のcatalog参照に不足がある。教材の数学エラーと混同しない。

BOUNDARIES:
- 正しい数値でも表示上の意味は保証されない。
- すべての独立式へ等号を付けない。部分式の変形だけを対象にする。
- 第一タイトルの受入、既存余白や選択肢配置の高評価を維持する。
- 事前影響の資料を修正後のsweep完了とは呼ばない。

Legacy governance checker note: its Markdown-only rule reports W032 as unapproved because the original PROPOSAL.md deliberately retains its pre-approval bytes. Actual approval is in APPROVAL.json and the hash-chained user event, matched to the immutable e6fc attachment and current runtime bundle. Whole-repository checker currently reports10 earlier metadata errors plus this compatibility warning/error; it is not claimed PASS. No original proposal bytes or original approval were rewritten to satisfy that legacy display rule. Runtime and CI exact approval checks pass.
