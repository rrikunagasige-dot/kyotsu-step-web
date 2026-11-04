# ブロック火柴図（GENERATED）

台帳HEAD: `360c69354d29682958b428952c9a781c8044ff51fa9f72fd64b19a5e6887740d`

```mermaid
flowchart TD
  N0["S00_RECOVER / CODE / PASSED"]
  N1["S01_ROUTE / CODE / PASSED"]
  N2["R01_CAPTURE@n13 / AI / PASSED"]
  N3["R02_CAUSE@n13 / AI / INVALIDATED"]
  N4["R03_IMPACT@n13 / AI / INVALIDATED"]
  N5["R04_PROPOSAL@n13 / AI / INVALIDATED"]
  N6["R05_APPROVAL@n13 / USER / INVALIDATED"]
  N7["R06_PATCH@n13 / TOOL / BLOCKED"]
  N8["R07_VERIFY@n13 / TOOL / PENDING"]
  N9["R07_SEMANTIC@n13 / AI / PENDING"]
  N10["R01_CAPTURE@n14 / AI / INVALIDATED"]
  N11["R02_CAUSE@n14 / AI / INVALIDATED"]
  N12["R03_IMPACT@n14 / AI / INVALIDATED"]
  N13["R04_PROPOSAL@n14 / AI / INVALIDATED"]
  N14["R05_APPROVAL@n14 / USER / PENDING"]
  N15["R06_PATCH@n14 / TOOL / PENDING"]
  N16["R07_VERIFY@n14 / TOOL / PENDING"]
  N17["R07_SEMANTIC@n14 / AI / PENDING"]
  N18["G2_AUDIT@n13 / AI / PENDING"]
  N19["G3_HOST@n13 / TOOL / PENDING"]
  N20["G3_FINAL@n13 / USER / PENDING"]
  N21["R03_IMPACT_SWEEP@n13 / AI / PENDING"]
  N22["R08_CAPTURE_LEARNING@n13 / AI / PENDING"]
  N23["L01_LEARNING@n13 / AI / PENDING"]
  N24["G2_AUDIT@n14 / AI / PENDING"]
  N25["G3_HOST@n14 / TOOL / PENDING"]
  N26["G3_FINAL@n14 / USER / PENDING"]
  N27["R03_IMPACT_SWEEP@n14 / AI / PENDING"]
  N28["R08_CAPTURE_LEARNING@n14 / AI / PENDING"]
  N29["L01_LEARNING@n14 / AI / PENDING"]
  N30["Z01_CLOSE / CODE / PENDING"]
  N18 --> N19
  N24 --> N25
  N20 --> N21
  N26 --> N27
  N19 --> N20
  N25 --> N26
  N23 --> N30
  N29 --> N30
  N2 --> N3
  N10 --> N11
  N3 --> N4
  N11 --> N12
  N4 --> N21
  N4 --> N5
  N12 --> N27
  N12 --> N13
  N21 --> N22
  N27 --> N28
  N5 --> N13
  N5 --> N6
  N5 --> N14
  N13 --> N6
  N13 --> N14
  N6 --> N7
  N14 --> N15
  N7 --> N8
  N15 --> N16
  N9 --> N18
  N9 --> N22
  N17 --> N24
  N17 --> N28
  N8 --> N9
  N16 --> N17
  N22 --> N23
  N28 --> N29
  N0 --> N1
  N1 --> N2
  N1 --> N10
```

現在: R02_CAUSE@n13 / READY

## 主担当と2 subagent（同じsnapshot）

| node | 担当 | 役割 | 対象 | 状態 |
|---|---|---|---|---|
| R04_PROPOSAL@n13 | A / /root/w048_review_a | reviewer | design: teaching | COMPLETED |
| R04_PROPOSAL@n13 | B / /root/w048_review_b | reviewer | render: layout | COMPLETED |
| R04_PROPOSAL@n13 | A / /root/w048_review_a | reviewer | design: teaching | COMPLETED |
| R04_PROPOSAL@n13 | B / /root/w048_review_b | reviewer | render: layout | COMPLETED |
| R04_PROPOSAL@n13 | A / /root/w048_review_a | reviewer | design: teaching | COMPLETED |
| R04_PROPOSAL@n13 | B / /root/w048_review_b | reviewer | render: layout | COMPLETED |
| R04_PROPOSAL@n14 | A / /root/w048_review_a | reviewer | design: teaching | COMPLETED |
| R04_PROPOSAL@n14 | B / /root/w048_review_b | reviewer | render: layout | COMPLETED |

CODE: 担当・packet・対象hash・非作者・未解決を検査。AI: 原資料・数学・教え方・実表示を審査。USER: 具体案承認と実アプリ評価。
役割交代は作者履歴を消さない。差戻しは元工程への改訂taskとして記録。

finding記録: 4
- W048-P001-N13-R04-B-LEFT-ALIGN-001 / n13 / layout / OPEN / 同一導出の左端揃えが実式本文へ届かない。proposed Page w048ScopedStyleの .reading-formula-line{text-align:left} に対し、実consumer TextbookFormulaContentは .reading-formula-expression のflex内へ式partsを出す。global.css:974-980のjustify-content:centerが存続し、N13はtypesetting非対象のため中央配置が続く。Q05の350px以下はglobal.css:1457-1481でgrid中央配置も残る。revision限定で実本文flex/gridの配置を明示的に上書きし、新targetとして再審査が必要。
- W048-P001-N13-R04-B-LEFT-ALIGN-001 / n13 / layout / OPEN / P002は通常flexの中央寄せを修正するが、N13 Q05の350px以下grid中央寄せを上書きできない。新selectorは3 classで詳細度(0,3,0)、旧global.css:1463-1474 selectorは2 class+2 attributeで(0,4,0)。旧justify-content:center/justify-items:centerが勝つため、320pxで左右2条件rowの左端揃え契約を満たさない。実式本文と狭幅特例に届くrevision限定selectorを凍結して再審査が必要。
- W048-P001-N13-R04-B-LEFT-ALIGN-001 / n13 / layout / VERIFIED_FIXED / P003の実consumer祖先に一致するrevision限定selectorは詳細度(0,5,0)。通常flex(0,1,0)およびN13 Q05狭幅grid(0,4,0)より優先し、justify-content:flex-startとjustify-items:startの両指定が届く。B独立のcssselect2/tinycss2照合でN13の13導出formula行×320/350/351/390/430/1440px=78条件を検査し、全条件で両propertyの勝者を確認。rootの32条件静的CODE証拠のPage SHAと内容も照合。実DOM/実座標検証は含まない。
- W048-P001-N13-R04-B-LEFT-ALIGN-001 / n13 / layout / VERIFIED_FIXED / P003の実consumer祖先に一致するrevision限定selectorは詳細度(0,5,0)。通常flex(0,1,0)およびN13 Q05狭幅grid(0,4,0)より優先し、justify-content:flex-startとjustify-items:startの両指定が届く。B独立のcssselect2/tinycss2照合でN13の13導出formula行×320/350/351/390/430/1440px=78条件を検査し、全条件で両propertyの勝者を確認。rootの32条件静的CODE証拠のPage SHAと内容も照合。実DOM/実座標検証は含まない。
