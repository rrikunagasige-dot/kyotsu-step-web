# 全体火柴図（GENERATED）

台帳HEAD: `fabee4751dc312ea96e4c38dfd5a065157c3eccbb6849d1ffde8f22711e4c5a2`

```mermaid
flowchart TD
  N0["S00_RECOVER 1/1"]
  N1["S01_ROUTE 1/1"]
  N2["n13:design 0/5"]
  N3["APPROVAL:proposal 0/2"]
  N4["n13:release 0/5"]
  N5["n14:design 0/5"]
  N6["n14:release 0/5"]
  N7["n13:learning 0/3"]
  N8["n14:learning 0/3"]
  N9["Z01_CLOSE 0/1"]
  N3 --> N2
  N3 --> N5
  N0 --> N1
  N1 --> N2
  N1 --> N5
  N2 --> N3
  N2 --> N7
  N2 --> N4
  N2 --> N5
  N7 --> N9
  N4 --> N7
  N5 --> N3
  N5 --> N8
  N5 --> N6
  N8 --> N9
  N6 --> N8
```

現在: R01_CAPTURE@n13 / READY
保留・修正queue: 9
関連修正Work: —
差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。

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
