# 全件分析と設計中に見つけた問題

Status: AI_ANALYSIS。本人がこの3単元を否定したというGoldラベルではない。

1. NE02 Q01/Q05の平方展開、Q06の係数4から2√20への変形、Q08の符号、Q11/Q12の条件と有理化が複数操作の選択へ圧縮されている。展開・対応・候補・平方・符号へ分割する。
2. N11は以前の小操作を多く保持しているが、引く括弧の分配、定数の計算、除数の選択、境界を元式へ代入した計算を補う余地がある。旧31採点を残し8回答を追加する。
3. N12は既存35回答を保持する。同時条件を二つへ実代入する過程、x=2の失敗を元三連式で示す過程、三辺に行う操作、商の個別計算、二つの内訳を元代金式で検算する過程を追加する。
4. 3unitとも旧readerを使い、条件付き前結果/段階/履歴の現仕様が不足している。原問題を各例の冒頭へ出し、必要な結論は次のページへ条件付きで渡す。
5. 現共通readerの一部の数式型候補はcanonical keyから描画する。新3unitは任意semanticDisplay分岐で明示した行とspanを使い、既存N09/N10の分岐は保持する。
6. 新旧の版を区別しない移行は不可。N11の既存v1〜v10、N12v1〜v3の修正履歴を先に適用し、新追加の穴を回答済みと推測しない。

設計検証で実際に見つけた失敗：

- 無番号の花子の説明、乗法の差の式、個数へ戻る説明が当初coverageから漏れ、assertで停止した。意味を該当nodeへ統合して対応を追加した。構造扱いにして逃がしていない。
- 数字・因子の正答が回答前の単独math spanに出る箇所をIR validatorが検出。式全体との対応・操作対象が分かる本文へ改めた。validatorは緩和していない。
- fraction/radicalの穴を挟む片側だけの文字列をKaTeXへ渡す検査は不適切。実際と同じbalanced templateに穴を入れて検査し、正しい数式部分木を作る実装条件として固定した。
- 旧日本語の候補文字列をそのままmath modeへ渡すとstrict parseで失敗。表示をtext/mathへ明示分割し、採点キーは保持した。
- SymPyの同じ不等式が左右反対の形で返るため、文字列・構文の一致でなく解集合の厳密一致を検査した。

これらはAI/コードの制作中発見であり、ユーザーGold否定例に加えていない。

## Implementation sequencing recovery
N12 R06 dispatch was refused while the N11 R06 claim remained active. A following shell line nevertheless projected historical N12 test imports before the N12 authored file existed; the targeted test correctly failed ENOENT. No learner N12 source was applied by the rejected dispatch and nothing was published. N11 R06 was then completed, N12 R06 claimed and its approved authored file applied. The existing N12 test projection is retained once (not duplicated); repeat the current all-three tests/build before recording verification. Future dependent shell steps must stop on the first nonzero exit.

## N11 real browser failure b04e46bb / CI40179387131
320px rejected n11-wm011-q03-zero: standalone Japanese explanation was inside a KaTeX aligned row and could not wrap. Preserve frozen DISPLAY_SPEC and canonical keys; materializer interprets pure text rows as ordinary text with explicit optional row metadata. Shared reader honors this metadata, absent for accepted units. Full protected N09/N10 plays enabled again because shared reader changed. Historical N12 test import initially duplicated an existing `as n12` alias; fixed the projection helper to preserve aliases and be idempotent. No assertion removed.

## Full play459a6131 / CI40179800038
All four NE02 plays and the complete N11 320px play finished; migration test then timed out while N11 reopened an already-complete first page (real ERROR.png shows correct old answer and enabled Next). Saved cursor is intentionally allowed before the pending frontier. Fix the browser harness to follow the actual Next controls, bounded by stage count, until the reopened unanswered item. Keep all archive/attempt/other-unit assertions. No learner change or gate weakening. Artifact12593926919 SHA2566ee8d51c9aa367cf4a3471a2a02f9f244c358e689704d2772be75803be617aaf retained.
