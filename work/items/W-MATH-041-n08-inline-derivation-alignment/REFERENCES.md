# 今回実際に確認した一次資料と採用箇所

2026-10-26。仕様の存在と本アプリでの実装・学習効果を区別する。外部コードのコピー、新依存追加、アプリ変更は行っていない。

| 資料 | 確認・採用箇所 | 本提案への接続 |
|---|---|---|
| [W3C Flexbox §8.5](https://www.w3.org/TR/css-flexbox/#flex-baselines) | inline-flexのbaselineとbaseline参加者の仕組み | 空slotを44pxboxの底から基準線合成する方式をやめ、明示strutを共有。center→baselineだけでは直らない理由 |
| [W3C Inline Layout](https://www.w3.org/TR/css-inline-3/) | baselineの種類・参加するboxの区別 | glyphの矩形上端/中心と数学の軸を混同しない。未普及propertyへ全面依存せずDOM基準線を測定 |
| [KaTeX Supported Functions](https://katex.org/docs/supported.html) | phantom/vphantom/hphantom、spacing | 既存KaTeXのphantomで空状態にも高さ/深さを持たせる。既存lockの0.16.47を読み、最新版0.19系への更新を混ぜない |
| [MathLive Fill-in-the-Blank](https://mathlive.io/mathfield/guides/fill-in-the-blank/) | 式の固定部分、ID付きprompt、値と状態の分離 | 新しい入力ライブラリに置換せず、固定式＋部品ID＋state管理の設計を参照する |
| [MathLive source](https://github.com/arnog/mathlive/blob/master/src/public/mathfield-element.ts) | 公開APIとprompt識別の参照元 | 今回sourceのコードを複製していない。将来導入する場合はcommit/license/依存影響を別途固定 |

既存W040/REFERENCE_NOTES.mdとW037/W038の教育資料を継承。今回の追加調査は排版と入力stateを実現する技術の裏付けであり、新しい教育効果実験の根拠ではない。

ローカル根拠: W040のUSER_R6_FEEDBACK.json、R6_REVIEW_FINDINGS_AND_REVISION_SCOPE.md、evidence/hosted/w040-hostedの実PNG/geometry。390/1440pxの親Q02の行幅144→83と左端30.5px移動はhosted記録。別local環境148→91/28.5pxとは混ぜない。矩形上端差は真のbaseline誤差と呼ばない。
