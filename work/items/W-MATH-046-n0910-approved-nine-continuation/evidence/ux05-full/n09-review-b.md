# UX05 N09 full native候補 — B非作者読取審査

Reviewer: /root/w046_render_review（N09教材/設計は非作者）。
Status: SCOPED_NATIVE_SOURCE_REVIEW_PASS。製品/Store/Git変更・新しい重複試験なし。

対象 `/tmp/w046-ux05-full/n09-unit.json` SHA256 `d3399d5ab2a376c7fa3593fdd1743fa31fcdc8276298fc60a9fa744378d497ef`。from7→to8はr7本人確認済みpilotを不変保管するための版更新で、UX05の学習契約の追加変更ではない。

## 観察と判定

- 基準r7native（固定pilot worktreeのNODE_DESIGN、unitのparts48）との比較で残14CHANGEのみ、代表2nodeとKEEP25nodeの計27nodeは全object一致。旧48part=34KEEP/14RETIRE、新9→43。34KEEPはpart object全体で一致し、旧or等の別意味記録を新しい判断へ流用しない。
- 負の根号の平方は一つの計算単位、一般則の適用から具体的平方を問う。既出(−4)²=16はn09-q01-negative-resultを追加requiredResultRefsに持ち、参照して新たに再入力させず、平方根の非負値の選択は次nodeで保持。
- a<0の平方根は非負の候補を本人が選び、具体−aの正性/平方/結論はその後。差2−√5の符号、絶対値の具体的な外し方、括弧の負号を含む式整理、不等号反転、整数/小数部分の定義適用を、生徒の主判断として残す。differenceRelationのroleがrelationで、既存root relation ASTの型へ対応している。
- Q08のL1/L2/L3/R1/R2/R3は基準part全object保持。新中項は一般公式を具体的な140と1/2へ適用する一判断で、二交差積/各符号を六つの小問へ割らない。未回答中項/総和/小数値を先に出さず、補助平方から元の小数へ戻す行には1.41²/1.42²という完全左辺がある。n09-decimal-methodの既存計算supportは引き続きn09-08の認定後へ移す契約で、19881/20164が初期へ漏れない。
- n09-q10の候補棄却は必要な−0.1計算の後に0≤r<1へ照らす判断を問う。負の整数が禁止という誤概念とは区別。小数部分はr=x−nから式全体を作り、負の整数部分を引く符号を含む具体適用を残す。正しい可換順の式を誤答候補に重複していない。
- 一般公式はtyped math行、理由はtext。casesの一般定義や平方公式を、未知の法則を説明せず当てさせる形にしない。初期条件と未解放の具体答えを区別し、補助量/本体を裸の=で接続していない。
- partOrder/requiresCorrectKeys/hide ownkey/mirrorの先行gateを読取。複数part行の先頭partだけ解けても後続partを正答扱いにせず、完全なterminalは全keyを要求。node/resultの必要前提を新設計へ対応させている。
- 元図/表/alt/captionは既存sourceExtraDispositionを保持。aの表、整数部分の図、正負小数部分表は認定後に限定される。sourceCoverageは元sourceMeaning/refsを残し、新しいlead/rows/terminalへ対応する対象を明示している。元の数値/問題/図を置換する案ではない。

未解決の確定した数学/先出し/型/主判断/source対応の所見なし。これはnative候補の読取審査で、root統合後の既存CODE・移行・実browser・最終SHAの非作者受入は別途必要。共有rendererの自作部分のPASSを本報告に含めない。

基準を読取中にfull worktreeへroot統合が入ったため、最終比較は変更されていないpilot worktreeのr7 native unitへ明示的に束縛して行った。同時作業中のfull current sourceを旧版として比較した結果は採用しない。
