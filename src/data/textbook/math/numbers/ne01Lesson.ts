import { repairFirstTheme } from './firstThemeRepair'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'

// W-MATH-003/P-005: exact 25-question batch approved by user「続けて」2026-10-23.
export const ne01SourceToItemIds = {
  "NE01-Q01": [
    "ne01-01"
  ],
  "NE01-Q02": [
    "ne01-02"
  ],
  "NE01-Q03": [
    "ne01-03"
  ],
  "NE01-Q04": [
    "ne01-04"
  ],
  "NE01-Q05": [
    "ne01-05"
  ],
  "NE01-Q06": [
    "ne01-06"
  ],
  "NE01-Q07": [
    "ne01-07"
  ],
  "NE01-Q08": [
    "ne01-08"
  ],
  "NE01-Q09": [
    "ne01-09"
  ],
  "NE01-Q10": [
    "ne01-10"
  ],
  "NE01-Q11": [
    "ne01-11"
  ],
  "NE01-Q12": [
    "ne01-12"
  ],
  "NE01-Q13": [
    "ne01-13"
  ]
}

const rawUnit = {
  "schemaVersion": "1.1",
  "unitId": "math-numbers-expressions-ne01",
  "revision": 1,
  "status": "review",
  "subject": "math-1a",
  "chapter": {
    "chapterId": "math-ch01-numbers-expressions",
    "chapterNumber": "1",
    "chapterTitle": "数と式",
    "unitCode": "1NUM",
    "orderInChapter": 15,
    "sourcePages": [
      37,
      38
    ]
  },
  "title": "3次の展開と因数分解",
  "subtitle": "平方と分配法則から、三乗の公式を作って使う。",
  "source": {
    "type": "reference",
    "label": "ユーザー提供「数と式」教科書モード対話段階導入版 v2 / NE01",
    "rightsNote": "教師編集Wordの原問を照合した参考・発展のレビュー教材。出典は原Word SHA-256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa。sourcePagesは2026-10-23 LibreOffice再描画40頁版のページ番号であり、過去の53頁索引のページとは異なる。原問の段落対応はW-MATH-003/NE01_NE02/source.jsonに保持。別冊解答は未提供。"
  },
  "objectives": [
    "分配した六項から三乗の係数を説明する",
    "共通因数を使って三乗の和と差を因数分解する"
  ],
  "sections": [
    {
      "id": "lesson",
      "number": "NE01",
      "title": "本文",
      "role": "concept",
      "description": "参考・発展。式と説明を一続きに読み、必要な変形を自分で完成させる。",
      "figures": [],
      "readingFlow": [
        {
          "id": "ne01-heading-01",
          "type": "heading",
          "text": "同じ因子を三つ掛ける"
        },
        {
          "id": "ne01-marker-01",
          "type": "marker",
          "kind": "example",
          "text": "例題"
        },
        {
          "id": "ne01-intro-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三乗は同じ因子を三つ掛けることを表す。まず二つを先に掛け、既習の平方の公式から計算を始める。"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-problem-01",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(x+3)^3"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-lead-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三つの同じ因子のうち二つを先に掛ける。平方で生まれる中央の項も残し、一次式と二次式の積に直す。"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-formula-01",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(x+3)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-01"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-after-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの因子を先に掛けた結果を使い、残りの積を分配する。"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-lead-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "前の積で、一次式の各項を二次式のすべての項へ掛ける。六つの積を書いてから同類項をまとめる。"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-before-02-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x(x^2+6x+9)+3(x^2+6x+9)"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-before-02-2",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "=x^3+6x^2+9x+3x^2+18x+27"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-formula-02",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(x+3)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-02"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-after-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "各項をすべて掛けると六項ができる。同じ次数の項だけをまとめるので、中央の二つの係数も変わる。"
            }
          ],
          "derivationId": "ne01-chain-01"
        },
        {
          "id": "ne01-heading-03",
          "type": "heading",
          "text": "和と差の3乗を作る"
        },
        {
          "id": "ne01-marker-03",
          "type": "marker",
          "kind": "proof",
          "text": "導出"
        },
        {
          "id": "ne01-intro-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "具体例の数を文字へ置き換える。a,bは任意の実数とし、平方の公式と分配法則から一般の式を導く。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-lead-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "具体例の3を一般の実数bへ置き換える。同じ因子二つを平方にまとめ、既習の和の平方を使う。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-formula-03",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(a+b)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-03"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-after-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "aからの三項とbからの三項を、まとめる前の形で並べる。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-lead-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "aを掛けた三項とbを掛けた三項を順に書く。まだ同類項をまとめず、中央の係数がどこから生まれるか見える形にする。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-formula-04",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(a+b)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-04"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-after-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "六項のうち、同じ文字・次数の項同士をまとめる。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-lead-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "前の六項でa²b同士、ab²同士をまとめる。得られた式を和の3乗の公式として整理する。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-formula-05",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(a+b)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-05"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-after-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "中央の係数3は、それぞれ2と1を足して生まれた。これが和の3乗の展開である。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-lead-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "今作った和の公式でbを−bへ置き換える。奇数乗と偶数乗の符号を分けて判断する。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-formula-06",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(a-b)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-06"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-after-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "奇数乗では負号が残り、偶数乗では残らない。置換を使えば符号の理由まで確かめられる。"
            }
          ],
          "derivationId": "ne01-chain-03"
        },
        {
          "id": "ne01-heading-07",
          "type": "heading",
          "text": "できた公式を具体式へ使う"
        },
        {
          "id": "ne01-marker-07",
          "type": "marker",
          "kind": "check",
          "text": "確認"
        },
        {
          "id": "ne01-intro-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "差の3乗の公式を、新しい具体式へ対応させる。"
            }
          ],
          "derivationId": "ne01-chain-07"
        },
        {
          "id": "ne01-problem-07",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(x-2)^3"
            }
          ],
          "derivationId": "ne01-chain-07"
        },
        {
          "id": "ne01-lead-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "差の3乗の公式を今度はxと2に使う。中央二項の係数と符号を確かめ、具体式へ戻す。"
            }
          ],
          "derivationId": "ne01-chain-07"
        },
        {
          "id": "ne01-formula-07",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(x-2)^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-07"
            }
          ],
          "derivationId": "ne01-chain-07"
        },
        {
          "id": "ne01-after-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "公式の各項へ代入すると、中央二項も省かず展開できる。"
            }
          ],
          "derivationId": "ne01-chain-07"
        },
        {
          "id": "ne01-result-07-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x^3-3x^2\\cdot2+3x\\cdot2^2-2^3"
            }
          ],
          "derivationId": "ne01-chain-07"
        },
        {
          "id": "ne01-heading-08",
          "type": "heading",
          "text": "3乗の和を積へ戻す"
        },
        {
          "id": "ne01-marker-08",
          "type": "marker",
          "kind": "proof",
          "text": "導出"
        },
        {
          "id": "ne01-intro-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "和の3乗には、3乗の和のほかに中央の二項がある。この二項を取り除くため、先に共通因数を見つける。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-lead-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "3乗の和だけを取り出すため、和の3乗で生じた中央二項に注目する。両方に共通する因数でまとめる。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-formula-08",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "3a^2b+3ab^2="
            },
            {
              "type": "choice",
              "itemId": "ne01-08"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-after-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "このまとまりを和の3乗から引くと、3乗の和が残る。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-lead-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "中央二項を移すとa³+b³=(a+b)³−3ab(a+b)になる。二つの項に共通するa+bを一つ取り出す。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-before-09-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "a^3+b^3=(a+b)^3-3ab(a+b)"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-formula-09",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "a^3+b^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-09"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-after-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "括弧内の平方を展開し、中央の項をまとめる。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-result-09-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(a+b)^2-3ab=a^2+2ab+b^2-3ab"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-lead-10",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "括弧内だけを展開して整理する。和の平方でできる中央項と、引いた項を合わせ、積の形で完成させる。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-formula-10",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "a^3+b^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-10"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-after-10",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "展開して元の二項へ戻ることでも、この因数分解を確かめられる。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-lead-11",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "和の因数分解にb→−bを使う。一次の因子と二次の因子の両方へ置換を反映し、3乗の差を作る。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-formula-11",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "a^3-b^3="
            },
            {
              "type": "choice",
              "itemId": "ne01-11"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-after-11",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "和と差では、一次因子と二次因子の中央項の符号の組み合わせが変わる。"
            }
          ],
          "derivationId": "ne01-chain-08"
        },
        {
          "id": "ne01-heading-12",
          "type": "heading",
          "text": "何の3乗かを見つけて因数分解する"
        },
        {
          "id": "ne01-marker-12",
          "type": "marker",
          "kind": "check",
          "text": "確認"
        },
        {
          "id": "ne01-intro-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの式で何をa,bと見ればよいかを考え、できた公式を使う。"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-problem-12",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x^3-1\\quad;\\quad8x^3+27y^3"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-lead-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの確認問題で、それぞれ何の3乗かを見つける。式の係数も文字と一緒に三乗の内側へ戻す。"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-formula-12",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne01-12"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-after-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの式をそれぞれの公式のa,bへ対応させ、両方を積へ戻す。"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-lead-13",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "前の対応を使って、差には差の公式、和には和の公式を選ぶ。二つとも最後の積まで完成させる。"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-formula-13",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne01-13"
            }
          ],
          "derivationId": "ne01-chain-12"
        },
        {
          "id": "ne01-after-13",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三次の関係も、分配法則・平方の公式・共通因数を組み合わせて得られた。式を覚える場合も、展開すると元へ戻ることを確かめる。"
            }
          ],
          "derivationId": "ne01-chain-12"
        }
      ],
      "items": [
        {
          "id": "ne01-01",
          "label": "NE01-01",
          "prompt": "三つの同じ因子のうち二つを先に掛ける。平方で生まれる中央の項も残し、一次式と二次式の積に直す。",
          "answer": "(x+3)(x^2+6x+9)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "(x+3)(x^2+6x+9)",
            "(x+3)(x^2+9)",
            "(x+3)(x^2+3x+9)"
          ],
          "purpose": "concept-formation",
          "scaffoldLevel": "strong",
          "hints": [
            "和の平方では、異なる二項の積が二つできる。"
          ]
        },
        {
          "id": "ne01-02",
          "label": "NE01-02",
          "prompt": "前の積で、一次式の各項を二次式のすべての項へ掛ける。六つの積を書いてから同類項をまとめる。",
          "answer": "x^3+9x^2+27x+27",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x^3+9x^2+27x+27",
            "x^3+27",
            "x^3+6x^2+9x+27"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "xを掛けた三項と、3を掛けた三項を並べよう。"
          ]
        },
        {
          "id": "ne01-03",
          "label": "NE01-03",
          "prompt": "具体例の3を一般の実数bへ置き換える。同じ因子二つを平方にまとめ、既習の和の平方を使う。",
          "answer": "(a+b)(a^2+2ab+b^2)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "(a+b)(a^2+2ab+b^2)",
            "(a+b)(a^2+b^2)",
            "(a+b)(a^2+ab+b^2)"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "三乗を一次式と平方の積に分ける。"
          ]
        },
        {
          "id": "ne01-04",
          "label": "NE01-04",
          "prompt": "aを掛けた三項とbを掛けた三項を順に書く。まだ同類項をまとめず、中央の係数がどこから生まれるか見える形にする。",
          "answer": "a^3+2a^2b+ab^2+a^2b+2ab^2+b^3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a^3+2a^2b+ab^2+a^2b+2ab^2+b^3",
            "a^3+2a^2b+ab^2+b^3",
            "a^3+2a^2b+ab^2+a^2b+ab^2+b^3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "先にa×括弧、次にb×括弧の三項ずつを数えよう。"
          ]
        },
        {
          "id": "ne01-05",
          "label": "NE01-05",
          "prompt": "前の六項でa²b同士、ab²同士をまとめる。得られた式を和の3乗の公式として整理する。",
          "answer": "a^3+3a^2b+3ab^2+b^3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a^3+3a^2b+3ab^2+b^3",
            "a^3+2a^2b+2ab^2+b^3",
            "a^3+3a^2b+3ab^2-b^3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "a²bとab²について、それぞれ係数を足そう。"
          ]
        },
        {
          "id": "ne01-06",
          "label": "NE01-06",
          "prompt": "今作った和の公式でbを−bへ置き換える。奇数乗と偶数乗の符号を分けて判断する。",
          "answer": "a^3-3a^2b+3ab^2-b^3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a^3-3a^2b+3ab^2-b^3",
            "a^3-3a^2b-3ab^2-b^3",
            "a^3+3a^2b+3ab^2-b^3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "bの一次・二次・三次で、負号が残るかを別々に確かめよう。"
          ]
        },
        {
          "id": "ne01-07",
          "label": "NE01-07",
          "prompt": "差の3乗の公式を今度はxと2に使う。中央二項の係数と符号を確かめ、具体式へ戻す。",
          "answer": "x^3-6x^2+12x-8",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x^3-6x^2+12x-8",
            "x^3-6x^2-12x-8",
            "x^3-8"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "a=x、b=2と対応させ、各項へ代入しよう。"
          ]
        },
        {
          "id": "ne01-08",
          "label": "NE01-08",
          "prompt": "3乗の和だけを取り出すため、和の3乗で生じた中央二項に注目する。両方に共通する因数でまとめる。",
          "answer": "3ab(a+b)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3ab(a+b)",
            "3ab(a-b)",
            "ab(a+b)"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "二項それぞれに含まれる数と文字をすべて取り出そう。"
          ]
        },
        {
          "id": "ne01-09",
          "label": "NE01-09",
          "prompt": "中央二項を移すとa³+b³=(a+b)³−3ab(a+b)になる。二つの項に共通するa+bを一つ取り出す。",
          "answer": "(a+b)((a+b)^2-3ab)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "(a+b)((a+b)^2-3ab)",
            "(a+b)((a+b)^2+3ab)",
            "(a+b)((a+b)-3ab)"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "三つある同じ因子から一つくくると、いくつ残るか考えよう。"
          ]
        },
        {
          "id": "ne01-10",
          "label": "NE01-10",
          "prompt": "括弧内だけを展開して整理する。和の平方でできる中央項と、引いた項を合わせ、積の形で完成させる。",
          "answer": "(a+b)(a^2-ab+b^2)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "(a+b)(a^2-ab+b^2)",
            "(a+b)(a^2+ab+b^2)",
            "(a+b)(a^2-3ab+b^2)"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "括弧内の(a+b)²を先に展開し、abの係数をまとめよう。"
          ]
        },
        {
          "id": "ne01-11",
          "label": "NE01-11",
          "prompt": "和の因数分解にb→−bを使う。一次の因子と二次の因子の両方へ置換を反映し、3乗の差を作る。",
          "answer": "(a-b)(a^2+ab+b^2)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "(a-b)(a^2+ab+b^2)",
            "(a-b)(a^2-ab+b^2)",
            "(a-b)(a^2+ab-b^2)"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "二つの括弧の中にあるbを、一つずつ−bへ置き換えよう。"
          ]
        },
        {
          "id": "ne01-12",
          "label": "NE01-12",
          "prompt": "二つの確認問題で、それぞれ何の3乗かを見つける。式の係数も文字と一緒に三乗の内側へ戻す。",
          "answer": "x^3-1^3\\quad;\\quad(2x)^3+(3y)^3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x^3-1^3\\quad;\\quad(2x)^3+(3y)^3",
            "x^3-1^3\\quad;\\quad(8x)^3+(27y)^3",
            "x^3-1^3\\quad;\\quad(2x)^3-(3y)^3"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "数の係数も三つの同じ因数へ分ける。"
          ]
        },
        {
          "id": "ne01-13",
          "label": "NE01-13",
          "prompt": "前の対応を使って、差には差の公式、和には和の公式を選ぶ。二つとも最後の積まで完成させる。",
          "answer": "(x-1)(x^2+x+1)\\quad;\\quad(2x+3y)(4x^2-6xy+9y^2)",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "(x-1)(x^2+x+1)\\quad;\\quad(2x+3y)(4x^2-6xy+9y^2)",
            "(x-1)(x^2-x+1)\\quad;\\quad(2x+3y)(4x^2-6xy+9y^2)",
            "(x-1)(x^2+x+1)\\quad;\\quad(2x+3y)(4x^2+6xy+9y^2)"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "一次の因子と二次の因子では、中央の符号の組み合わせが異なる。"
          ]
        }
      ]
    }
  ]
} as const

export const mathNumbersNE01Unit = validateTextbookUnits([repairFirstTheme(validateTextbookUnits([rawUnit])[0])])[0]
