# Current record reconciliation — W-MATH-050 / PROPOSAL.md

Status: BLOCKED
Record-Scope: Metadata/provenance restoration only; no product or Store mutation.
Fixed-Candidate: 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b
Work-State: BLOCKED

Historical record recovery remains blocked: exact current scope/approval/verification mapping is incomplete; no approval, completion, or learner acceptance is inferred. Parent W050 gap marker is not closure; REVALIDATION/ROLLOUT sources are distinct related evidence.

Evidence: existing fixed-candidate historical text below where present. Missing exact approval/closure provenance remains unresolved; do not substitute filename or informal positive wording.

Original-Body-Source: existing untracked physical recovery record
Original-Git-Body-SHA256: ABSENT
Original-Physical-Body-SHA256: 28ea684b625175fc51a50b36219ddae8df051896893b9a806fc6e6d3255f1fa9

<!-- HISTORICAL ORIGINAL BODY START — bytes below preserved exactly; current metadata is above -->
# P-W050-001 — N04の冒頭を文章・排版の見本として整える

Status: PROPOSED / 未承認・未実装

## 目的と対象

本人の新依頼は前半N01〜N07程度の文章と排版を後半の読みやすさへ揃えること。まずN04「具体的な平方と四つの積」の最初の段階（heading-four-products / n04-s5-stage-1）を完成見本にする。今回の実装対象はN04 revision7のこの段階のみ。段階2〜12、他単元の文章/表示への一括適用は含めない。N01〜N07全体の修正依頼は継続し、見本の受入後に残りの具体案へ展開する。

基準教材source96a24d6bffa3a0f6e4c5340e29a5a0364664fb77、publisher/maina39827c8ca25f7318c14ec28339c2379207dbe86。実画面は同公開版で確認済み。詳細はFINDINGSとevidence/TARGET、BROWSER_OBSERVATIONS。

## 具体的な文章変更（四つだけ）

原block IDと原文parts/置換後partsはevidence/PROPOSED_TEXT.jsonへ固定。数式はmath partを使い、本文フォントの文字列へ置き換えない。

| 既存block | 変更後の本文 |
|---|---|
| paragraph-n04-intro | 「(5x+4y)²を展開します。二乗は、同じ括弧を二つ掛けることです。」に続けて、既存の(5x+4y)²=(5x+4y)(5x+4y)を保持 |
| n04-s4-square-plan | 「四つの積を順に求めます。ここでは同類項をまとめず、得られた四項を並べます。」 |
| paragraph-n04-four-products | 「まず、一つ目の括弧の5xを、二つ目の括弧の5xと4yに掛けます。次に、一つ目の括弧の4yも、二つ目の各項に掛けます。」 |
| paragraph-n04-bridge | 「四つの積を並べた式ができました。次は、中央の二項をまとめる理由を考えます。」 |

見通し、今行う操作、回答後の接続を分担する。花子の問いと係数・文字を分ける四本の計算根拠は今回はそのまま残す。四つの積から40xyへ先回りしない。

## 具体的な排版

unitId=math-numbers-expressions-n04 AND revision=7 AND stage.id=heading-four-products の全条件で限定属性を既存sectionへ追加し、その属性だけに新しいscoped CSSを適用する。n04-s5-stage-1はderivationIdであり、stage.idとは区別する。旧版・他stage・他unitのDOM/CSSには適用しない。

1. 本文の外枠は残し、当該stage内側の角丸カードの境界線/影/二重paddingを除く。stage内paddingは0、見出しと本文の開始線を揃える。外側の既存responsive paddingは保持する。
2. 段階見出しと1/12は既存の一箇所だけを使用。例題markerは小さく保持し、大きな新見出しや『今すること』カードを追加しない。
3. 本文は既存18px/行間1.8を基準に、同じ導出内のblock間12px、操作目的の変わるまとまりの前24px。計算根拠の文とその式の間は8px。余白はこのstageのscoped CSSだけが管理し、全体CSSを上書きしない。
4. 式内の係数・文字・等号・空欄は既存TypesetFormula/NumberedEquationを使う。四つの積それぞれの既存typesetting group（根拠式＋回答式）を保持し、そのgroup内の等号列を揃える。stage全体を新しい一つのgroupへ統合しない。式番号は右端（狭幅で衝突する場合は既存の下段退避）。式開始位置と等号列は別々に計測し、単純なtext-align指定だけで合格にしない。グループ計測の共通実装を変更する必要が判明した場合は、影響範囲を拡大せず再提案する。
5. 未回答・誤答・正答後も同じ本文/式の順番を保つ。空欄の操作領域を44px以上とし、長い回答も端切れ/番号衝突を起こさず、必要な折返しは既存の数式planに従う。等号列の安定と番号衝突を実測する。

## 保護条件

- 既存5判断：n04-q01-p1/p2/p3/p4、n04-01を全て保持。正答は順に25x²、20xy、20xy、16y²、四項を分けた和。次段階の同類項判断を飛ばさない。
- 四本の係数計算根拠、式parts/ID/番号/順序、sourceCoverage、hint、choice、採点、revision7、保存キー/旧進捗/resetを保持。
- NE01、N01〜N03、N05〜N14、他modeの教材/表示/旧版リンクを保護。共有ファイル内の他unit JSON subtreeも同一に保つ。
- 未回答の答えを見通し/見出しへ出さない。必須理由をdetailに隠さない。過去受入の記録と修正後の新受入を分ける。

## 実装pathと検証

対象候補は既存firstSectionTeaching.jsonの上記4parts、TextbookUnitPage.tsxの当該stage属性、追加のstage限定CSS。必要なcontract/回帰検査と読取専用ブラウザ検査を同じWork内に置く。共有render/state/domainの全面変更は対象外。native工程登録や検査用コードは教材への未承認変更を許可しない。

意味のある検証は、5判断/全数式/順序/後続54判断・他unit subtree不変、四幅320/390/430/1440で全5判断の正誤/途中/完了、次stage/context/history/reload/reset/スクロール、狭幅の等号列/番号/overflow/フォント/操作サイズ。NE01と後半を影響確認する。変更に対応した型検査・build・関連テストを実行する。同じ版のPASSを根拠なく反復しない。

承認後は既存公開アプリで限定見本を確認できる状態まで進める。同じ範囲の公開許可を再要求せず、実配信sourceに対応したURLを渡す。最終の本人受入を経て見本段階を締める。

## 依頼全体の未了事項

N02の定数項に「その文字の部分は残す」と書く不適合な操作説明を調査で確認。N04別stageに係数2を直前本文が供給する候補もあり、可視時点の確認待ち。これらとN01〜N07全体の修正は別の具体差分に結び付け、今回の5判断見本だけで解決済みにしない。
