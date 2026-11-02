# R04具体案の理念・工程レビュー B — 最終版と初回訂正履歴

現判定：SCOPED_R04_MEANING_REVIEW_PASS。対象は固定PROPOSAL.json a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840。初回の完成公式先出し・可視prefix・公開入力の表示解決は補修後を照合済み。この提案の理念/可視意味の範囲に未解決STOP所見は残っていない。既存importのPASSはBの読取判断のhash/phase結合であり、数理証明・実装・移行・実画像・正式Store receipt・本人承認の合格ではない。現在の限界と証拠は末節に集約した。以下の旧hash/未確認記述は初回履歴として残す。製品/Store/Gitは変更していない。

## 読取対象と証拠の範囲

- 初稿からの更新後PROPOSAL.json f3fd64b6d383c175e9beaf3562a5dfb77576c99496980fc28fbbf0519e65ea7b、PROPOSAL.md 08f6f9c96e6d97ea11c348c373bbe4e54ba0713a9fca91ecc4194c1905e61771。
- 同時点CANDIDATE_NODE_DESIGN.json 6f2f06c8cc67805b8f698766e5ec54fdb61ef3b78beab522d95e03359ddcf90c、NATIVE_PREFLIGHT.json f403147c1bfc2457c134e68db9c9e1b2d249049ba5b8540415dfb574098a5f96。
- 固定691dのnative原本work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json、reader/project契約、R03全41原報告とmain MASTER/WORK_SYSTEMを照合。最新更新でhashが変わるため、以下はこの初回所見の対象であり後続版へ自動継承する合格ではない。

## 初回の確定欠陥 — 旧hash対象の履歴（現版の補修確認は末節）

1. **decimal-methodの旧assumptionが完成公式を初期表示する。** scratch nativeは旧assumptions/assumptionPartsを保持し、このnodeの「1.41=141/100、1.42=142/100。平方の公式(A+B)²=A²+2AB+B²を使う。」をそのまま表示する。正答後のprivate terminalではない。readerのrenderNodeはin-contextでないassumptionを実際に描画するため、係数2等を本人が導く初期に完成公式が見える。新row introだけ修正しても漏洩を閉じない。
2. **q11-formulaにも同型。** 旧assumption「既習公式：(A-B)^2=A^2-2AB+B^2。」が初期表示として残り、受講完了を仮定せずその場で符号/係数を導く案と矛盾する。全11対象のassumptionsを照合し、完成公式を含む同型はこの二件。必要条件だけの新本文へ置換するか、旧条件の非表示を明示し必要な定義域/根拠を他の公開文へ残すこと。
3. **onEntryの宣言と可視prefixが不一致。** 共通「leadと最初の行だけ」は、parts-targetのr=x−n/0≤x−n<1/区間行、q11の平方→積→分配→符号行など、requiresCorrectKeys=[]の複数行が初期に見える設計と一致しない。これは複数行を教えてはいけないという欠陥ではなく、初期公開状態の仕様が不正確という欠陥。初期の全prefixと、各回答直後に何が解放されるかをblock別に確定する必要がある。

## 初稿の欠陥と、確認できた訂正

- decimal row3 intro「BAは…ABと書けます」が同じ行のAB穴を先出し。A/Bとも同型を指摘。現案は最初の交差項をBAとして本人が構成し、正答後にBA=ABへ並べ直す行を置く。これで当該intro漏洩は解消。ただし上記旧assumption漏洩が別に残る。
- n09-02条件を空にする案は既存validator非空契約に不一致。旧条件を保持しassumptionsDisplay=in-contextで反復を抑制する現案を確認。q02-negative-squareにも同overrideと必要条件の配置方針が追記され、同文反復への仕様が明確になった。
- decimal availableBeforeの「直前の√2大小判定」は未実施の事実を既認定とした誤記だった。直前は√((2−√5)²)の段階。現案は今回の目標として訂正。
- fontのglobal変更はN07/N08/Guided/Practice等へ広がるため撤回し、native reader限定のstrong overrideへ補修。baseline69に加え新対話nodeを数える必要を指摘。Bは当初N10-17のAUTO→対話を落とし71と通知したが、rootの実native集計32+40=72を確認して訂正。文字サイズのscopeはbaselineとtargetを区別する。

## 全11再設計への局所評価（欠陥修正前の条件付き所見）

|block|式内構成と監視判断|
|---|---|
|n09-q01-negative|−4という一つの因子を構成し、既存16計算へつなぐ。textの作用判断にも価値はあったため、文字穴へ変えたという事実だけを優劣根拠にしない。負号を基底に含めるtransferという目的なら採用可能。|
|n09-q02-negative-square|負の根号基底→負号の積1→根号平方5を先行構成する案は、結果5の回答後に解法全部を与える旧案と異なる。1という数字穴も符号/演算対象を決める役割がある。分解の根拠を本文で保ち、完成値を他条件へ漏らさないこと。|
|n09-q04-negative|候補−aの正性、同じ平方a²、非負平方根の同定へ段階を分けた。候補を仮置きすることと答え認定を区別しており、正性/平方の根拠を旧AUTOから本人へ戻している。毎回の例で同じ証明を増殖しない。|
|n09-decimal-method|平方意味→同じ二項→A/Bへの分配→BA/B²→係数2という段階は本人の指定に対応する。A/B/B²/2は単文字/単数字でも式構成。四項全部を穴にしないこと自体は欠陥でない。修正済introと未修正assumptionを分ける。|
|n09-parts-target|定義は教え、区間の上下端n/n+1を本人が組む。単純な移項の独立小問を増やさず意味ある境界へ焦点化。本文でなぜ区間が必要かを結ぶ。初期prefixの正確化が必要。|
|n10-q01-square|同じt√5を因子へ戻し、tの指数2、根号平方5を組む。÷5の旧逆演算小問へ戻さず、候補の平方を125へ一致させる目的を保つ。|
|n10-q11-formula|既に和の平方を導いた前提で、差による負項同士の符号と交差項係数へ絞ることは可能。全分配のやり直しを強制しない。ただし旧「既習公式」assumptionは除かないと新設計が成立しない。|
|n10-q13-identity|交差項の符号、相殺0、具体根号での交差pairという異なる操作がある。四項全体の一択を必須としない。端平方7/2/差5は後続の本人計算へ保持。|
|n10-15|√3という値自体は既知でも、分母に掛けた倍率を分子へ補償する適用が初めて式内になる。したがって単なる文字列コピーとは断定しない。後段の指数2は根号を消すため平方を作る役割がある。既存1倍計算を廃止して操作適用へ移す意味は明示されている。|
|n10-17|√3cは分子積、(√3+√2)cのscope穴は分母全体を掛ける構文対象の同定。cの既知値を再入力する穴とは異なる。既に見える分母を選ぶことに数学的作用範囲の意味がある。元分数×c/cの可視根拠を残し、上端の和全体だけを単に暗記させない。|
|n10-20|分子の同じ二因子を指数2へ、分母の相殺を−へ別々に構成するため旧完成分数一択と異なる。4/3を再計算させず認定結果を使う。二変形を二つへ分ける必要と、既知の易しい計算を全て分割することを混同しない。|

3本文限定変更は、n09-02の同文条件抑制と、q08左右へのA/B対応・中項/計算目的を明確にする変更。左右4partの採点契約を守り、本文を直しただけで上流導出の漏洩が直ったと扱わない。

## 保護・全範囲・工程

native原本とscratch候補を独立読取比較し、86ID全一致、変更は宣言した14nodeのみ、protected√a√b/商証明9nodeはwhole object一致を確認した。これは14nodeの内容適合やR07合格とは別の保持証拠。

N09r8→r9/N10r5→r6、NEW未回答、RETIRE出所付き履歴、KEEP厳密契約、新しい前提より後の旧正答は保存しpending、旧terminalからNEWを埋めないという方針は整合。意味の異なる旧keyを流用しない。実移行の結果は未実行である。

R04で案/native scratchを検査→R05新案hash/範囲照合→R06代表decimal限定→R07実CODE/意味/実画像と本人細部→残り適用、という既存図の位置は維持。本人の案作成指示を新案の実装承認へ転用していない。全体入替/新自由入力engine/新公開先を追加していない。

## 初回の未確認と修正条件（旧hash時点、現状は末節）

- MDが参照するCODE_MAPは読取時点folderに存在しない。教授/段階/穴/本文/数理へ渡す正確な入力・出力・採否と、原則ごとの意味判断の接続は未確認。既存native validator/compilerの事前試験だけで全R04 CODE完了としない。
- NATIVE_PREFLIGHTのdesign PASS/78状態compileというroot記録は構造/構文の範囲。初回Longrightarrow未対応2FAILとRightarrow補修は原履歴保持。候補の有限数学/対応外の理由審査、前提/既習/本文の採否、phase/hash束縛は別途必要。
- 四幅実画像・新指数/文字slot44px中立状態・候補拡大後の高さ/括弧・部分正答・誤答・履歴・font相対サイズはNOT_RUN。設計段階のlayoutを実画面合格へ拡張しない。
- 上記assumption漏洩2件と初期可視prefixを補修し、その版/hashへ限定再照合するまで提案全体のPASSは発行しない。root統合案にも同じ条件を適用する。

## 限定再照合 — 初回3件は解消、全体審査は未完了

現proposal f84ddfcadc45e9f7ed24a2651fc571217a1f126d08307ca6d5e7ab4988111dbdでは、decimal/q11のassumptionsとassumptionPartsを実数条件と具体課題だけへ明示置換し、scratch nativeでも旧完成公式を初期表示しないことを確認した。全11のinitialVisiblePrefixはrequiresCorrectKeys空の全visibleSequence行IDと一致する。したがって初回3件を未修正の現行欠陥とは呼ばない。

typed copyの最終具体案、CODE_MAP/既存教授・段階・穴処理への入力出力採否と最終hashの確認が残る。新intro/afterのplain textへ数式文字を埋めることを避ける方針は妥当だが、補助式を挟むときの偽等式鎖に注意する。例えばBA=ABを独立行として挟んだ後に多項式を=だけで再開しない。既存の主多項式の交換結果行と自然文を使うか、主式を完全左辺で復帰する。実装・R07測定はまだ合格とはしない。

## 最終a604版の審査範囲と結果

31回答直前＋11block完了の42状態を全件読取。主担当の説明だけでなく、実projectNestedLesson/answerNestedPartに従った仮想public状態を対象とした。最終requestHashはbb9130a79b86275aba189d677b43fd2a085495a01ae2e601077214ca29bc2580、phaseはR04-proposal。MEANING_RESPONSE_Bは既存required13欄を満たし、31partそれぞれに可視の式と採用理由を記した。caseIdsは空なので架空caseを追加せずcaseDispositions=[]。既存operate('solution-review',{request,response})へ戻した結果はPASS/automaticAcceptance:falseである。

最後の公開入力には、text enumをvalueで置換して日本語displayを落とす不一致があった。Bはn10-20前段のnonzero-and-rational-product等を例にSTOPし、実TextRowと同じchosen.display解決へ補修された版で審査した。数学slotのvalueは維持。前stageの認定結果asideとstage原問題も追加された。回答前31状態だけでは完了後本文を実証しないという主担当の補強により、11完了状態も確認した。wrong gateはモデルのfrontier/row-ID比較assertであり、誤答原state全件保存/ブラウザ操作とは呼ばない。

新稿はplain TextRowにBA=AB等の数式を押し込まず、typed leadPartsと主math rowを使う。decimalの交換は多項式全体の主式行、q13の補助交差項計算後は完全左辺で本体へ復帰し、偽等式鎖を作らない。各完了aftertextは実text rowとして目的と次の用途をつなぐ。元のsourceにある、正答後にだけ説明されていた主要構成を現在の穴へ戻している。

n10-15の既知√3を分子へ補償する操作とn10-17の分母全体scopeは有意味な適用として採用する。値が既に見えるという理由だけでコピー扱いしない。一方、既認定4/3の再計算、÷5等の易しい逆算の追加、全行全穴化は今回の要件にしていない。

固定nativeと最終candidateを再照合し、全86ID/宣言14変更/保護9node whole object保持を確認した。fontはnative限定overrideでbaseline69/target72、旧版/archive/historyへの影響を検査対象とし、他readerへglobal変更を広げない。移行は旧採点契約一致のKEEP、新前提を満たすまでpending、RETIRE保存、NEW未回答の方針を維持し、実施済みとはしない。

CODE_MAPと実INPUTS/OUTPUTS/SUMMARYを確認。作者が55意味stepと31partを分解し、teaching-candidatesが並べ替え/候補を返したことを区別する。N04資産/今回の目標をknowledgeへ入れず、36宣言根拠を個人習熟認定としない。raw93候補の31ADOPT/62REJECTはAI採否でrawDecisionCheck NEEDS_AI_REVIEWを保持、代表6 graph候補の採用照合はその範囲だけ。S11/prose.composeを自動執筆器と主張しない。

数学CODEはUNSUPPORTED/MATH_DEPENDENCY_MISSING、graphTeachingもUNSUPPORTED、proseIRはNOT_RUNのままである。この結果を意味import PASSで上書きしない。数学の対応可能な実行環境または根拠付きargument/専門AI審査への接続は、対応する工程claimで別に記録する必要がある。R04_RESULTの必須before_after/protected_scope/patch_plan/verification_plan/proposal_hashは存在しa604へ一致するが、Bの本稿は正式R04 capability receiptやStoreの欠落26を埋めるものではない。

実画像/四幅/指数slot44px中立形/相対font/移行/history/resetはR07未実施。新案承認はまだ付与しない。R05承認照合→代表decimal限定実装→R07実CODE/意味/実画像・本人細部確認→残り適用の順を守る。

初回response作成中に主担当の公開requestが42状態へ更新され、Bの旧requestHash固定assertがFAILして応答を保存しなかった。これを無視して旧hashへ合格を出さず、最終bb9130へ読み直して再作成した。importの再現scriptは純関数のみを呼びStore/Gitへ書かない。

### 最終証拠SHA256

|file|sha256|
|---|---|
|PROPOSAL.json|a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840|
|PROPOSAL.md|385f5d8763081ca318e24bc0ef6e98e096d056d3512c45c4ad2f0ac8db14f358|
|CANDIDATE_NODE_DESIGN.json|0c21be3cfd750097bea0c81f45fbd37fd866368d18871c6537d65c9bc219e92a|
|PUBLIC_STATES.json|dc5cfc1ffc49caaec2ed110e6001f4c39591ba60bf676fa9a9f74dac66e5d686|
|MEANING_REQUEST.json|915c72793a72c0fe160a24f57ac60131a4eefbfe909992916d56fdbf716705cf|
|MEANING_RESPONSE_B.json|96b601f6d70c125d90306cc1a0744f5e518e6a463e41e068a20f23b53d2b17fc|
|MEANING_IMPORT_B.json|a583e1cdaba1699a9f37f7bd88f3e40ff532d21d1d52023c6b1197782be7299d|
|CODE_MAP.md|874828b26e12b310fb3b0d91ab90a53350820d5431d2b9cd8b8ed08255b944c0|
|CODE_INPUTS.json|1e601400ea0ca6d961844cba560e54e56884796844e44b85e60f03d874cdd59a|
|CODE_OUTPUTS.json|a28dc95686f514d67d2372eece3d5828db997a88c0462f85ab186ef21b2602b1|
|CODE_SUMMARY.json|b17962e306cc661159d745a7c83a5fff8fec57f0e6a1edeb2c3a2b76e15a574b|
|R04_RESULT.json|4ba63ba40434a531ae63852b147aa22adb17653b6a5ab927f4251531b006aad6|

再現：write-meaning-response-b.pyでBの具体判断をhashへ束縛し、import-meaning-response-b.mjsで既存importへ渡す。旧版の文章を同じモデルの別passで読んだことを独立モデル検証とは呼ばない。BはUX06主担当案の非作者だが、旧N10の一部と共有rendererの作者履歴を保持し、共有実装の独立PASSを名乗らない。
