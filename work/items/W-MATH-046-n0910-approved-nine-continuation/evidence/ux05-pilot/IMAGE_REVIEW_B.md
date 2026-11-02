# UX05 N09代表 — B非作者の教材/学習判断の実画像審査

Reviewer: /root/w046_render_review。N09教材/設計の非作者。共有renderer実装作者であるため、共有表示実装の非作者PASSは本報告の範囲にしない（担当Aが別に審査）。
Status: SCOPED_N09_LEARNER_DECISION_MATH_PASS。未解決の確定した教材/学習判断の欠陥なし。

## 証拠の出所

- 固定source SHA: `a39bdb8c9d064e6d90c8352020824bb5be4f931f`
- N09r7 compiledHash: `dedfd7c553c2c0186bf7bdbc881bba51649741dbe330e0c854c11dce7822a813`
- 元画像folder: `/tmp/w046-ux05-browser-final-n09`
- RESULT.json SHA256: `681228ef6e6b05b2a9352ed52345c60766cdd3a802f1c52b8bd34bdd911dcde1`
- root実行の記録: 四幅各48回答/各95誤答候補、772状態/5236幾何PASS。fontChecks872、errors/HTTP/network failure各0、sourceManifest前後一致。これらはrootの実行結果を読取確認したもので、Bが同じ試験を再実行した意味ではない。

## 実見範囲

320/390/430/1440pxそれぞれの因数分解初期・零条件初期・零条件正答後、計12原PNGをview_imageで一枚ずつ開いて実見した。既存rootの原PNGを編集/再生成せず、その画像の内容に基づく。cropには当該nodeの連続本文と選択肢が入っている。全page header/resetや他段階をこの12枚で新たに受入したとは記さない。

## 教材と学習判断

### 因数分解初期

四幅とも、他の解がないことを調べる目的、x∈ℝ、一般の平方差公式、実数の零積一般則と理由、x²=16からx²−4²=0までが先に見える。具体的な因数分解は空欄で、本人が四候補から恒等的な積を選ぶ。候補の一つに答えが含まれることと、本文で正答を確定表示してしまうことを区別した。一般則を教えた上で具体的対象へ適用する課題として成立する。

候補(x−4)²/(x＋4)²/x(x−16)と(x−4)(x＋4)は、中間項/定数項の異なる式。正しい順違い(x＋4)(x−4)を誤答候補にはしていない。符号一字だけを埋めて積を全自動で与える旧方式へ戻っていない。

### 零条件初期

四幅とも、因数分解した積(x−4)(x＋4)=0が確定してから「因子についての零条件の組」を問う。本文には未回答の具体零条件やx=4/x=−4が先に現れない。生徒の回答単位は「x−4=0 または x＋4=0」という二条件全体であり、orという単語だけではない。入力は選択方式で、自由記述や全解法を自力入力したと誇張しない。

同じ一候補内の二行でORとANDを区別でき、同時成立/等しい因子/xそのもの0という別の誤解が候補にある。実数の零積は一方が0で十分であり、両因子同時零を要求しない。因子が等しいことだけでは積0を保証せず、x=0はこの積を0にしない。選択の意味と数学は整合する。

### 正答後と全解

四幅とも、条件を回答して初めて通常の二条件が現れ、各一次式からx=4、x=−4へ続く。＋4/−4の逆演算を別の採点小問にしていない。最後に同値変形で場合を尽くしたため二つが全解という説明があり、候補の確認だけで全解と断定する筋道にはならない。

数学根拠は実数でAB=0⇔A=0またはB=0。A≠0ならAB/A=B=0、逆向きは一因子0なら積0である。A=x−4/B=x＋4を適用し全場合を尽くす。これは本担当の数学意味審査であって、logical ORに未対応の有限/closed solution graphを機械証明PASSへ変更したものではない。

## 既存UIの観察範囲

12枚の範囲では、本文→現在式/短い足場→番号付き選択肢という導出順で、別の新cardや導出外の問題一覧へ移していない。一般公式は通常math表示、理由はtextで、raw A^2などが説明文へ露出する初回source所見は解消している。選択肢は一button内の二条件であり、別々の二問に切り分けていない。

選択済み具体式/式番号/二条件/各解を読み取れるという観察は行ったが、括弧の自然寸法や44px/軸/衝突の共有renderer実装をBが非作者として合格させたという意味ではない。rootの測定では全四幅actual/marker-free通常が145.9375×21pxで一致していることをRESULTから確認した。この数値はroot実測の出所として保持し、独立表示受入はAへ委ねる。

## 所見と留保

新たな教材/主判断/先出し/数学の確定所見なし。N10/残り承認変更node/全体教材受入/公開/本人細部OK/Gold/fitは本報告で認定しない。原33d06の5px余分glue FAILや初回probeのfont文脈FAILを、最終a39bdbの結果へ混在させない。製品/Store/Git変更・新規browser試験は実施していない。

## 実見した原PNGのSHA256

|原画像|SHA256|
|---|---|
|`320-n09-01-factorisedFormUX05-initial.png`|`797c5e28ba3998b93eb5896dd90ac437cea7512d22c8ab0b55a2c9f5ae445ea9`|
|`320-n09-01-factorZeroConditionUX05-initial.png`|`4c122069401255afe5b639899d267c0b3d69a6f0bec9ca7125e83c1a1e449012`|
|`320-n09-01-factorZeroConditionUX05-correct.png`|`b1811c0c46668666c47a52f484ecd7e18d4804df8ca2d8bcddbbf3ad0a54d9c4`|
|`390-n09-01-factorisedFormUX05-initial.png`|`e2b945dab95c4595cc6cf74510b0963076a60ebaec6f421017d5dcb467c75ae7`|
|`390-n09-01-factorZeroConditionUX05-initial.png`|`b0c01faaec3f6ea1248508c588aecc970d3345bcc6e170b8ec8af030c5092c52`|
|`390-n09-01-factorZeroConditionUX05-correct.png`|`a5442c8fb92d5a0418d23be5d07602623a9d50573f02183a9b821efc1a2779f5`|
|`430-n09-01-factorisedFormUX05-initial.png`|`3d438262d8e91bae8e9a500ce2dd5b968731557ff19bf05c8c897a4cfd77c209`|
|`430-n09-01-factorZeroConditionUX05-initial.png`|`5728fd25422079ed73e369bbd4b93c3e304c5a7a2ff6d54ff84b002805df0b03`|
|`430-n09-01-factorZeroConditionUX05-correct.png`|`a63e9a5b514d54e83c2abd6decc21930d79b8172015345a3496315f4781e5fb5`|
|`1440-n09-01-factorisedFormUX05-initial.png`|`ab0ba8c4ad451321013e324f342fb51d955a53d7d4fe8665437329b5f39530f9`|
|`1440-n09-01-factorZeroConditionUX05-initial.png`|`020a61cf7cae291a7e806bf23ccb008150215a03f287f4ed73ee38d43f4176be`|
|`1440-n09-01-factorZeroConditionUX05-correct.png`|`acae6a39112cc8239c99f98a966d04c4fa9aae040be5b1979618c757a51bf19a`|
