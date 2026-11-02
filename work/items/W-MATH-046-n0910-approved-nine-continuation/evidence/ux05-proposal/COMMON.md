## 共通表示の具体的修正

### 正答した穴を通常の数式へ戻す

対象はN09/N10の数学行内の直接slot。同型経路は現基準で94行/106slot出現だが、これは静的inventoryであり全件の画像破綻実見数ではない。text slot・mirror・回答後に消える足場と分けて扱う。

| 状態 | 数式の出力 | 操作・寸法の契約 |
|---|---|---|
| 未回答 | 未確定slot。後続の答えは出さない | 有効な操作域44px以上、全候補からの中立予約。keyboard/誤答gate維持。 |
| 誤答 | 選択値と対応する説明。未確定のまま | 正答を使って幅を計画しない。同じ未確定状態で予約を保持。 |
| 正答済みのpart | 確定した候補を閉じたASTの通常数式として出す | 操作button/透明span/44pxphantomを残さない。＋/−/関係記号のTeX種別、単項符号、根号/分数/累乗の束縛を保つ。 |
| 一行で正答と未回答が混在 | 正答部分は自然な文字、未回答部分だけslot | node全体を早期readonlyにしない。未回答の操作を消さない。 |
| 完了/履歴/旧版比較 | 通常の数学組版 | 原教材/原回答は保管し、採点・時刻・回数を変えない。 |

`compileNestedMathTemplate`は、certifiedの候補存在/値/参照の証明を通した後、interactiveでも通常の確定subtreeを出力する。確定値を操作slot一覧から除き、`resolvedParts`等の表示根拠metadata（key/path/value）で未回答slotと区別する。正答の無い値や任意の未証明mirrorを確定扱いにしない。閉じた数式文法、trust:false、候補allowlist、root relation markerを維持する。

確定した式には自然な演算子間隔を使う。単に＋をmordの箱へ押し込み、見た目だけ枠を消す方法は採用しない。受入基準の例は、正答後の`(x-4)(x+4)=0`が同じfontの通常描画と同じ括弧高さ/内部間隔になること。44pxは未回答の操作域へ適用し、確定した＋や指数2の文字寸法へ適用しない。

### group計画を公開状態へ追従させる

`NeutralNestedGroupRow`へ、すでに公開・正答認定された`values`/`certifiedKeys`を渡せるようにする。未解放row/未認定partの答えは入力しない。`NodeRows`は可視row・正答状態・group幅・実fontから計画する。通常表示と履歴で同じ出所のrender/planner契約を使う。

- 未回答partは従来どおり全候補中立幅、確定partは選択された通常式の幅で計測する。mirrorは参照元の正答が証明された場合だけ自然式へする。
- 正答公開時にはgroupを再計画してよい。旧「正答後も全候補の中立frame固定」を、未回答/誤答中の安定性と混同しない。根号や分数の内部を勝手に分断しない。
- cache/signatureには可視rowと認定済み値・certified集合・width/fontを含める。同じwidth/fontでも正答状態が変われば再計画する。
- 多項式変形/因数分解/論理/別の補助量は意味groupを分ける。補助量から本体へ戻るときは完全な左辺または明確な数学対象を示し、偽の等式鎖を作らない。
- slot/control必須の検査は未確定slotに適用する。確定部の正しい通常表示の検査を追加し、単に検査対象から消して合格にしない。
- DOM計測のWeakMap登録・本体compilerへの出所検証を維持する。別bundleの近似DOMを本体の証拠と呼ばない。

### 複数条件を一つの判断として答える表示

零積や相殺項の組など、意味上ひとまとまりの回答は一つの選択肢/buttonで扱う。320pxで長い式全体を一つの巨大slotへ押し込まない。単元別案の指定に従い、条件の接続語・二項の境界で行を分ける。

零条件や相殺交差項の組など、必要な候補に限って表示専用`mathLines?: string[]`を追加できる。各lineは閉じたLaTeX、`value`は一つ、`display`は全条件の読み上げ用ラベル、各lineを同じ候補button内で縦に描画する。複数buttonへ分割して別問にはしない。純粋なmeaning型のenumを採点値とし、数式表示を別に持つ場合も型を明記する。`mathLines`は入力値の意味や誤答フィードバックを変えるフィールドではない。

画面の足場がtext行の場合も、正答後は足場を消して具体的な条件を通常のmath行へ置換する。未回答の条件を先に完成印字し「または」だけ問う形へ戻さない。複数条件の順序交換が同値であることは設問・候補・説明に明示し、同じ正答の順序違いを誤答候補にしない。

## 旧回答・新版・保存の具体契約

| 項目 | 本案の処理 |
|---|---|
| 新revision | N09r6→r7、N10r4→r5。unit/node/resultの同一性は保ち、対象partだけを個別対応する。 |
| 不変snapshot | 現N09 compiled470fを`n09ConstructionCompiledR6.json`、現N10 compiled3cfeを`n10ConstructionCompiledR4.json`へ保存する。既存R5/R4/R3・N10 pilotR4別hashもそのまま保管。 |
| KEEP | 単元別表で同じ対象・学習行為・問い・型・正答・全候補・数学上の対象条件を維持すると指定したpartだけ。前提node・解放gateは単元別新版の指定で再評価する。文言だけの整備も個別に意味一致を審査し、数値一致を十分条件にしない。 |
| RETIRE | 現行達成数の分母から外すが、元のsource/hashに結び付けた旧記録/履歴を保存。現行へ原recordをコピーしない。 |
| NEW | 新key/id、未回答から開始。旧or→零条件全体、旧符号→中項全体、後段平方→前段初回平方等は同値の数値/語でも継承しない。 |
| 旧回答が未来の段階にある場合 | recordを保持しても、新しい前提を飛ばしてdraftや親完了へ復活させない。最初の未解決の新判断から再開。 |
| 保管単位 | 旧revision番号だけでなくunit/compiledHash/source bindingで識別する。archive内の余分な旧partを現行ledgerへ残してparseを壊さない。 |

N09の公開r5→既存r6→r7、旧r4→r5→r6→r7は、各段の実snapshotと検証済みadapterを使う。N10旧r3→既存fullr4→r5、pilot r4別hash→fullr4→r5も同じ。legacy r2由来の7件は、そのときの原design/analysisとr3 snapshotを使う既存の鎖を保護する。新designで旧`priorReviewedDesignRaw`を上書きしない。

new edgeはsource/targetの正確なhashとfrom/to revisionのallowlistで登録する。未知のnative main/hashを、古い版や空の新版へ黙って丸めない。復元済みの正当な現行記録と無関係な古いarchiveは、保存したままにする。

専用keyとmain-onlyの両方がある場合、同一hashの新しいreset markerを優先し、そのreset後の回答も含めたledger全体を保持する。新resetを見つけたからと空ledgerに置き換えない。古い完了回答をreset後へ復活させない。改訂後のresetは現在単元の現在版だけ。取消は無変更、他unit/保管版を巻き込まない。

firstValue・選択回数・初回/最終時刻・過去event IDを保つ。新しい正答イベントを作らず、旧親が完了済みでも新partが必要なら完了と数えない。既に受けた旧回答を、新しい問いの初回正答率の加点へ偽装しない。表示専用のcompact化だけでは採点値/保存を一切変えない。

## Expected Affected Areas / 実装順

| 領域 | 変更の役割 |
|---|---|
| `work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json` | 本案の新学習契約をsource-boundで記述。元Word/原問題/図のbindingを維持。 |
| `tools/textbook/transformation/nested-lesson.mjs` / `apply-n0910-construction.mjs` | reviewed design pinと新版生成。全生成物が同じ設計から再現できることを確認。 |
| `src/data/textbook/math/numbers/` のcompiled/pins/revision/lesson | N09r7/N10r5を登録し、現在版/過去版snapshotを不変保管。 |
| `src/domain/textbookSchema.ts`、`nestedMigration.ts`、`nestedLessonStorage.ts`、revision/archive pageとroute | 新版・明示対応・厳密hash鎖・main/reset/旧版隔離の保護。必要なパスだけ変更。 |
| `nestedMathTemplate.ts` / `NestedConstructionMath.tsx` / `nestedMathGeometry.ts` / `ConstructionLessonReadingFlow.tsx` | 正答後の自然AST出力、未確定44px操作との分離、認定状態でのgroup再計画、必要な複数条件候補の表示。 |
| `nestedLesson.ts` 等のchoice型/公開projection | 使用する場合だけmathLines表示フィールドをwhitelist。expected/正答印/誤答説明の先出しをしない。 |
| 既存compiler/renderer/geometry/unit/migration/bridge/archive/generator検査 | 今回の実欠陥と学習単位/保存に対応する意味のある回帰。旧数値だけの期待更新で不具合を消さない。 |

共有rendererの直接利用先はN09/N10のconstruction readerと関連tools/tests。N08は同じrendererを直接使わないが、表示基準・共通header/resetと既存版routeを影響確認する。共有static compilerを使う変換toolも生成/grammarを検査する。他教材の設問を無断で変更しない。

## Risks

| リスク | 防止・確認 |
|---|---|
| 穴を減らす反動で主判断までAUTOになる | 完成解法の主要推論と生徒回答を対応させる。各rowの「提示/新判断/確定結果」を審査する。 |
| 高校生だから計算は不要と決めつける | §53の必要計算比較、新しい公式の初回適用と転移、非零/正性/定義域を保護する。 |
| 条件の組が単なるor当て/因子の写しになる | 二因子の零条件全体を作る契約と誤答候補を審査し、未知法則の説明と具体適用を区別する。 |
| 受理済みの正答が新版の別意味へ移る | 全旧partのKEEP/RETIRE/NEW対応を検査。旧or/P/Q/K等は新意味へaliasしない。 |
| compact化で未回答のhit域/根号/分数が壊れる | 混在状態、正答後の通常数式との比較、未回答44px/衝突/axisを別々に測定する。 |
| plannerが未回答正答値を知って先出しする | 正答済み値だけを状態入力にし、未回答は全候補中立予約。cacheと可視rowに状態を結び付ける。 |
| 画面が正答後も昔の幅/改行を保持する | 正答状態で再計画し、自然な括弧・根号・指数・分数の高さと余白を通常描画と比較する。 |
| 有効な旧試験/承認を全部やり直す | 対象SHAと変更依存を記録し、未変更の有効結果を継承。未解決/新変更のある部分だけ必要に再検査。 |

## Verification Plan

1. **具体案の非作者審査**：N09作者A/N10作者B、相互に相手の数学・主判断・選択肢・誤答説明・先出し・移行を審査。rootの共通renderer/migration/統合も審査対象にする。全86nodeの一致、旧全partの処遇、新keyと解放を構造照合する。これは製品試験ではない。
2. **本案の明示承認**：[main WORK_SYSTEM§11](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/WORK_SYSTEM.md#L246)の「The revised proposal must be shown before implementation.」に従う。今回の「修正方案を作れ」はこの具体案の作成指示であり、まだ提示していなかった設問やrenderer契約の承認に転用しない。
3. **代表の実装**：承認後、写真のN09負数の平方→全解と、その自然組版に必要な共有rendererを隔離候補へ実装。正答が普通の式へ戻り、主たる零条件生成を生徒が行い、未回答は操作できることを確認する。
4. **代表の実SHA/実画像確認**：[main WORK_SYSTEM§12A](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/WORK_SYSTEM.md#L291)に従い、固定候補/正確な出所の原画像をGitHub確認票へ結び付け、本人の細部OK/要修正を受ける。未確認の方式を残りへ量産しない。この確認を本案の再承認や全体受入へ読み替えない。
5. **残りの限定適用**：代表の確認後、単元別表のCHANGEだけを適用。KEEPの学習契約と原問題/図を差分比較。意味を変える追加指摘は本案を改訂し、承認を無断拡張しない。
6. **CODE/数学/学習単位**：source-bound生成一致、part/row/候補一意性、先行gate・循環なし・mirror証明・足場消去、型/変更lint/build、関連回帰。完成解法の主判断が生徒回答に残っているかを非作者意味審査する。有限数学のunsupportedは必要な意味審査へ渡し、無条件PASSにしない。
7. **保存/移行**：各既知native revision/hash、legacy r2の7記録、現行・旧版main-only、部分/誤答/全完了、新旧keyとreset marker不整合/後続KEEP済み＋新前提未回答、未知hash拒否を確認。全旧recordの原値/時刻/回数/event、保管記録/他unit保存を照合する。旧版試し解答の保存隔離、reset取消/確定/reloadを実操作する。
8. **表示**：320/390/430/1440pxで初期・全誤答候補・部分正答・全正答・次stage・履歴・旧版の指定範囲を操作。Main/Math-Italic等の実loaded faceとHTTP成功、同じ本体compiler/DOM出所を必須にし、fonts.readyだけのPASSを禁止する。正答済みの括弧/根号/分数/指数/関係記号を通常描画と比較し、未回答の44px・keyboard・衝突/overflow/式番号を別に確認。正答後に自然寸法へ変わることを、旧frame固定検査で誤ってFAILにしない。
9. **G2横断・公開・本人総チェック**：対象86nodeと保管N09/N10native版、保持N08各版/N11、共有toolへの実影響をPASS/FAIL/UNVERIFIEDで記録する。必要なblockerが残れば公開へ進まない。候補manifestを固定し、公開用の具体的差分を別に承認対象にする。認可された実働URLで配信byte/操作を照合後、本人が合意範囲を総チェックする。CODE・画像・公開成功を本人合格/Gold/fitへ転用しない。

最新Storeの欠落26イベントに対するW046継続の本人特例を保持し、旧台帳へ戻って同じ検査/受理を再要求したり、receiptを創作したりしない。全体governanceの既存38件は別Workの同一ERROR集合として記録し、本Work追加0/全体FAILと分ける。今回の具体案作成で全体governanceや製品QAが成功したとは記さない。

## Approval

Status: WAITING
Approved by user: NO
Approval date: —
Approval evidence: 未受領。本人の依頼は本具体案の作成。
Scope: 本書の限定教材改訂・自然組版・保存保護の実装と候補検証。既存の代表細部確認・横断監査・別公開承認・本人総チェックを保持。

## Review History

- Supersedes: UX04の今後の修正内容。UX04の実承認・実装・実行結果は固定commitで履歴として保管する。
- 原因/全86node監査/公式例：record32139fa4、evidence/ux05-feedback。
- 本案の担当・対象hash・初回所見・補修・最終非作者審査は `evidence/ux05-proposal/REVIEW.md` へ保存。
- 同じmodel/履歴共有の2担当であり、盲検・model独立性を主張しない。正式Storeの新受理receiptは作らない。
- User detailed acceptance / final acceptance / Gold / fit: 未成立。
