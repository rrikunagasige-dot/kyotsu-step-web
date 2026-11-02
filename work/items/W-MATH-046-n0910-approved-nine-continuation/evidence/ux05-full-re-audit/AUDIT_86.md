# 全86設計箇所の原則照合一覧

固定製品source `691d3d160493bf684ca8a31a22476d31d98caeec`。N09:41 / N10:45、AUTO17/interactive69も全件対象。公開内容は未変更。

**現在もNEEDS-FIX。** 学習行為の局所判定と、本文・共通フォント・上流依存の適合は別。PASSの行があっても単元全体が合格したとは扱わない。未確認は未確認として残す。

[N09全41詳細](n09-audit-b.json) / [N10全45詳細](n10-audit-a.json) / [N10読取表](n10-audit-a.md) / [工程・理念監視](workflow-monitor-b.md) / [主担当の反証・統合](ROOT_REVIEW.md)

|対象|局所学習要求|本文|式内の本人操作と改善方向|
|---|---|---|---|
|n09-q01-positive|PASS|PASS|手本と全解探索の区別を保持。AUTOだから穴を増やさない。|
|n09-q01-negative|UNVERIFIED|UNVERIFIED|既存textの意味判断と式内value穴を一律廃止しない。二因子構成が必要なら既存選択→式内反映で補えるが、新しい自由入力engineや全符号穴化を要件化しない。最新要求に対する粒度が未確認のため、過去承認済みを理由にPASSともtext enumだからFAILとも決めない。共通choice fontは確定FAIL。|
|n09-01|PASS|PASS|数学上の二判断は保持。文字数でfactor/OR判断を評価せず、表示/MathLinesの型を確認する。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-definition|PASS|PASS|概念本文を保持。数学の定義を穴数目当てに増やさない。|
|n09-q02-root|PASS|PASS|数字穴を保持。単なる4のコピーと一律判定しない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q02-negative-square|FAIL|FAIL|現在の5という計算判断の価値は保持しつつ、穴なし解法のどの中間構成を本人が担うかを本人要求と照合する。負号・根号・指数の作用対象を式内へ作る案を具体化する。前q01の未確認を「転用済み」で消さない。assumption反復と共通fontも別の修正対象。|
|n09-02|PASS|FAIL|正当な結果再利用としてAUTO保持。 共通条件は必要な位置へまとめ、正答を受けて今どの操作へ移るかを本文でつなぐ。|
|n09-boundary|PASS|PASS|境界説明を保持。今後別範囲の複素数を混入しない。|
|n09-q03-inside|PASS|PASS|AUTO維持。以前の答えを別の問いとして再採点しない。|
|n09-03|PASS|PASS|意味の異なる結果穴として保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q04-nonnegative|PASS|PASS|文字穴を保持。数字例だけの写しへ落とさない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q04-negative|FAIL|PASS|最初の一般形を定着させる場面として、正性/平方/同定のうちどの重要な関係を式内穴にするかを具体設計する。良い√a√bの証明段階を参照し、毎例で全符号再証明へ展開しない。必要な文字/符号穴を維持し、最終式一択に押し込まない。共通fontもFAIL。|
|n09-04|UNVERIFIED|PASS|AUTOの条件付き結果整理を保持。|
|n09-05|UNVERIFIED|PASS|記号穴を保持。名称暗記のみと誤認しない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q06-squares|PASS|PASS|算術の価値は比較法への必要性で保持。将来削減はこの役割を保って判断する。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q06-order|PASS|PASS|関係記号一文字を意味ある式構成として保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-06|PASS|PASS|符号判断を保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q07-negation|PASS|PASS|段階の役割を保持。uの代入に相当する文字/符号穴も選択肢にし得るが勝手に置換しない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-07|PASS|PASS|具体変形の判断を保持。正答後の中間式を省かない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-decimal-method|FAIL|FAIL|本人指定の平方意味→分配→四項→同類項を式内の意味ある穴で設計する。A/B/符号/係数穴を許容し、全部を一つの完成公式choiceに置換しない。140²等の既知算術を全て穴へする必要はない。|
|n09-p001-q08-left-square|UNVERIFIED|PASS|局所4part/具体計算を保護。前の公式導出が満たされるまで連鎖全体の適合完了としない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-p001-q08-right-square|UNVERIFIED|UNVERIFIED|必要計算をKEEP。既知の2²=4等を後で再入力させず、この上端が必要な理由を接続。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-p001-q08-lower-sign|PASS|UNVERIFIED|不等号穴を保護。stageの完成目標は証明すべき命題として区別し、数値計算を飛ばす口実にしない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-p001-q08-upper-sign|PASS|UNVERIFIED|不等号穴を保護。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-08|PASS|PASS|AUTO保持。|
|n09-09|PASS|PASS|一文字の関係穴を維持。正性条件と使用理由を表示し続ける。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-parts-target|UNVERIFIED|UNVERIFIED|定義そのものと導いた検査条件を区別し、本文で0≤x−n<1→n≤x<n+1をつなぐ。意味ある区間構成を本人へ任せる要否を個別に決める。全AUTOも全穴化も先に決めない。|
|n09-q10-reject-truncation|PASS|PASS|計算/条件判断を維持。負の整数だから棄却という誤概念を区別する。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-10|PASS|PASS|数字穴を維持。上流の区間条件の説明を補うまで全鎖合格とはしない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q11-remainder|PASS|PASS|適用計算を保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-11|PASS|PASS|AUTO検算を保持。|
|n09-q12-lower|PASS|PASS|数字穴を役割込みで保持。各平方を機械的に再証明する設計へは増やさない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q12-upper|PASS|PASS|単なる同数字の再出現を理由に撤去しない。既認定結果を直接再利用する案も同目的を満たすなら検討可。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-12|PASS|PASS|関係穴を保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q13-reverse|PASS|PASS|符号穴を保持。全式choiceだけにまとめない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-13|PASS|PASS|数字/符号の配置穴を意味ある表現変換として保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q14-positive-integer|PASS|PASS|数値穴を保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q14-positive-remainder|PASS|UNVERIFIED|式構成を保持。全体public文脈を省略したレビューにしない。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q14-negative-integer|PASS|UNVERIFIED|数字/符号穴を保持。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-q14-negative-remainder|PASS|UNVERIFIED|式の構成を保護。必要な途中式/理由を見せることと穴数追加を分ける。 共通choice文字サイズ欠陥も修正対象だが現段階はread-only。|
|n09-14|PASS|PASS|AUTOまとめを保持。|
|n10-q01-square|FAIL|SEE_DETAIL|積の証明と同様、同じ底の積から指数・因子を生徒が埋めて具体平方を作る。5の計算穴は意味を確認して残す。|
|n10-01|PASS|SEE_DETAIL|125÷5の具体適用と係数を除く理由の本文を保持。÷5という新穴の追加を義務にしない。|
|n10-q02-sign|PASS|SEE_DETAIL|t>0を条件として残し、5という一文字の数値穴を浅いと消さない。|
|n10-02|PASS|SEE_DETAIL|正性→平方値→同定理由の順とゲートを保護する。値125だけで平方根を同定しない。|
|n10-q03-expand|PASS|SEE_DETAIL|褒められた積・商証明の保護対象。2だから単純と廃止せず、平方の構成を他の導出の基準にする。|
|n10-03|PASS|SEE_DETAIL|保護。a/b等の一文字をwhole-result選択へ統合しない。|
|n10-q04-sign|PASS|SEE_DETAIL|保護。正の条件を残し、負も平方値は同じという後続理由と結ぶ。|
|n10-04|PASS|SEE_DETAIL|保護。理由だけを残して前段の式穴を削除しない。|
|n10-q05-denominator|PASS|SEE_DETAIL|保護。非零条件を証明後の注釈に追いやらない。|
|n10-q05-square|PASS|SEE_DETAIL|保護。分子・分母の指数穴を残し、完成式丸当てにしない。|
|n10-05|PASS|SEE_DETAIL|保護。異なる認知操作として指数構成と平方根定義の適用を残す。|
|n10-q06-sign|PASS|SEE_DETAIL|保護。商の存在と正性を混同しない本文の順を残す。|
|n10-06|PASS|SEE_DETAIL|保護。理由選択だけを一般化し、前の式導出をAUTOへ移さない。|
|n10-q07-product|PASS|SEE_DETAIL|×→48の解放順を保護。根号の和と積を取り違える誤答に意味がある。|
|n10-07|PASS|SEE_DETAIL|平方因子と残りを式内で作る活動を保持し、4という係数の先出しをしない。|
|n10-q08-factor|PASS|SEE_DETAIL|前07の因子認定からの接続と係数4の式穴を保護。根号の分割を毎回独立穴にするノルマへ戻さない。|
|n10-08|PASS|SEE_DETAIL|AUTOの元式復帰と、前提で認定した因子・係数への拘束を維持する。|
|n10-q09-left|PASS|SEE_DETAIL|平方因子と係数の式穴を残し、初回手順を直す場合もこの転用を値の丸当てへ縮めない。|
|n10-q09-right|PASS|SEE_DETAIL|同型の転用として保護。左右どちらを計算中か本文で明示し続ける。|
|n10-09|PASS|SEE_DETAIL|元の＋と順序を保持し、未回答の合計7を出さない。|
|n10-q10-coefficients|PASS|SEE_DETAIL|共通根号を保持する構成を残す。今後の具体案では係数・演算記号を式内で埋める表現も比較できるが、文字数だけで全式選択の採否を決めない。|
|n10-10|PASS|SEE_DETAIL|認定結果の復帰として保護。合計7を同じ意味で再び穴にしない。|
|n10-q11-formula|UNVERIFIED|SEE_DETAIL|既習の実根拠を照合。導出が対象なら二乗→同じ差の積→分配→四項→同類項を文章でつなぎ式内に判断を置く。中項の具体適用は残す。|
|n10-11|PASS|SEE_DETAIL|端の数値穴を機械的に消さず、確定した中項と異なる今回の定義適用として残す。|
|n10-q12-product|PASS|SEE_DETAIL|−2を式全体で保持する本文と部分計算の戻し先を残す。|
|n10-12|PASS|SEE_DETAIL|普通の数と根号項の役割を見せる。5だけをKPIとして増減せず、前の式との対応を維持。|
|n10-q13-identity|UNVERIFIED|SEE_DETAIL|N04q8の既習/参照と今回の学習目標を照合。既習ならpair＋端平方の分散操作を許容し、公式を再証明する穴を機械的に増やさない。必要な未既習部分のみ具体案へ。|
|n10-13|PASS|SEE_DETAIL|平方値と差の式穴を保護し、相殺後の結果を単なる完成5の選択へ統合しない。|
|n10-14|PASS|SEE_DETAIL|値保存の根拠の導入として保護し、後続の分子分母を本人が構成する一手につなぐ。|
|n10-q15-factor|PASS|SEE_DETAIL|因子を式内へ置く活動を保持。初期publicの目的説明と正答後terminalの条件記録を混同せず、逆符号の有効な別解と指定c>0を区別する。|
|n10-15|FAIL|SEE_DETAIL|分子・分母の掛ける因子や対象範囲を式内で作る。1倍という易しい結果だけに活動を集中させない。|
|n10-q16-denominator|PASS|SEE_DETAIL|3と6の対象を混同しない二段の式を保護。単純数字という理由で同じ穴にまとめない。|
|n10-16|PASS|SEE_DETAIL|元式復帰と非零条件を記録し、認定値の写し穴を追加しない。|
|n10-q17-factor|PASS|SEE_DETAIL|式内の因子構成を保護。問いがA−B順を指定することと、逆符号の別解が不可能だという主張を区別する。|
|n10-q17-nonzero|PASS|SEE_DETAIL|>の式穴と差が非零という帰結を保護。根号の大小の既習根拠は必要に応じて参照できるようにする。|
|n10-17|FAIL|SEE_DETAIL|一般操作の理解とは別に、選んだ因子を分数全体のどこへ置くかを式内で構成。既認定の因子そのものの写し穴を増やすだけにしない。|
|n10-18|PASS|SEE_DETAIL|分母全体の主語を保ち、平方値→差の順を維持する。|
|n10-q19-distribute|PASS|SEE_DETAIL|分配された各因子・符号の意味を保持。最新指示に沿う個別の因子/符号穴の配置も具体案で比較可能だが、選択肢長だけで不適合としない。|
|n10-19|PASS|SEE_DETAIL|同名の数値一致でなく18のresult参照を保ち、確定した分子を元式へ戻す連続性を維持。|
|n10-q20-factor|PASS|SEE_DETAIL|因子→平方比較→符号→理由の順とゲートを保護。正の因子という手順条件と逆符号別解の数学的有効性を区別。|
|n10-20|FAIL|SEE_DETAIL|同じ分数の連続導出内で、分子の平方構成・分母の平方差構成を各式内の因子/指数/符号として分離。4/3は既認定なので再計算させない。|
|n10-q21-denominator|PASS|SEE_DETAIL|差の数値穴を保持し、分子計算と混ぜない。|
|n10-q21-expand|PASS|SEE_DETAIL|中項の符号・係数・根号の構成を残し、4/3を写し穴に戻さない。一般公式の導出根拠の確認は別に必須。|
|n10-q21-constants|PASS|SEE_DETAIL|どの項を保存してどれを合計するかを本文で保持。7だけを問うことを全nodeへ一般化しない。|
|n10-21|PASS|SEE_DETAIL|元式との同値と非零条件を保持し、最終式の写し穴を増やさない。|
