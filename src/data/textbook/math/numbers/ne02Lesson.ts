import { validateTextbookUnits } from '../../../../domain/textbookSchema'

// W-MATH-003/P-005: exact 25-question batch approved by user「続けて」2026-10-23.
export const ne02SourceToItemIds = {
  "NE02-Q01": [
    "ne02-01"
  ],
  "NE02-Q02": [
    "ne02-02"
  ],
  "NE02-Q03": [
    "ne02-03"
  ],
  "NE02-Q04": [
    "ne02-04"
  ],
  "NE02-Q05": [
    "ne02-05"
  ],
  "NE02-Q06": [
    "ne02-06"
  ],
  "NE02-Q07": [
    "ne02-07"
  ],
  "NE02-Q08": [
    "ne02-08"
  ],
  "NE02-Q09": [
    "ne02-09"
  ],
  "NE02-Q10": [
    "ne02-10"
  ],
  "NE02-Q11": [
    "ne02-11"
  ],
  "NE02-Q12": [
    "ne02-12"
  ]
}

const rawUnit = {
  "schemaVersion": "1.1",
  "unitId": "math-numbers-expressions-ne02",
  "revision": 1,
  "status": "review",
  "subject": "math-1a",
  "chapter": {
    "chapterId": "math-ch01-numbers-expressions",
    "chapterNumber": "1",
    "chapterTitle": "数と式",
    "unitCode": "1NUM",
    "orderInChapter": 16,
    "sourcePages": [
      39,
      40
    ]
  },
  "title": "二重根号を、平方の形から外す",
  "subtitle": "和と積の条件を作り、最後に非負性まで確かめる。",
  "source": {
    "type": "reference",
    "label": "ユーザー提供「数と式」教科書モード対話段階導入版 v2 / NE02",
    "rightsNote": "教師編集Wordの原問を照合した参考・発展のレビュー教材。出典は原Word SHA-256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa。sourcePagesは2026-10-23 LibreOffice再描画40頁版のページ番号であり、過去の53頁索引のページとは異なる。原問の段落対応はW-MATH-003/NE01_NE02/source.jsonに保持。別冊解答は未提供。"
  },
  "objectives": [
    "平方の展開と二重根号を対応させる",
    "和と積を同時に満たす二数を探す",
    "主平方根の符号を確かめて値を決める"
  ],
  "sections": [
    {
      "id": "lesson",
      "number": "NE02",
      "title": "本文",
      "role": "concept",
      "description": "参考・発展。式と説明を一続きに読み、必要な変形を自分で完成させる。",
      "figures": [],
      "readingFlow": [
        {
          "id": "ne02-heading-01",
          "type": "heading",
          "text": "平方した結果から元の式を探す"
        },
        {
          "id": "ne02-marker-01",
          "type": "marker",
          "kind": "example",
          "text": "例題"
        },
        {
          "id": "ne02-intro-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "ここまでは、平方根の積や商を計算し、分母の根号をなくしてきた。次は根号の中にさらに根号がある式を考える。候補を平方した結果と、候補が非負であることを確かめて、外側の根号を外していく。根号の中にさらに根号がある形を二重根号という。平方すると根号の中と同じ値になる、非負の式を探す。a,bは正の実数とする。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-problem-01",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\sqrt{5+2\\sqrt6}"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-lead-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "a,bを正の実数とする。平方根の和を二乗し、平方の項と二つの交差項を分けて書く。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-formula-01",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(\\sqrt a+\\sqrt b)^2="
            },
            {
              "type": "choice",
              "itemId": "ne02-01"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-after-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "この形を、根号内の定数部分と交差項へ対応させる。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-lead-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "前の平方の展開を5+2√6と比べる。根号の外の部分と、交差項の根号の中を対応させる。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-before-02-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "5+2\\sqrt6"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-formula-02",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-02"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-after-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの条件を同時に使って、正の二数を探す。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-lead-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "和と積の二条件を同時に満たす正の二数を探す。順番はどちらでもよい。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-formula-03",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-03"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-after-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "この二数を平方根の和へ戻す。ただし平方の一致だけでは正負を決め切れないため、非負性も確かめる。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-lead-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "平方が一致しただけでは符号が決まらない。候補が非負であることも確かめ、元の根号の値を選ぶ。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-formula-04",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-04"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-after-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "根号が表す主平方根は非負である。候補の平方と符号の両方が合えば、元の根号の値を決められる。"
            }
          ],
          "derivationId": "ne02-chain-01"
        },
        {
          "id": "ne02-heading-05",
          "type": "heading",
          "text": "差では非負の方を選ぶ"
        },
        {
          "id": "ne02-marker-05",
          "type": "marker",
          "kind": "example",
          "text": "例題"
        },
        {
          "id": "ne02-intro-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "今度は交差項が負なので、平方根の差の平方を考える。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-problem-05",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\sqrt{9-4\\sqrt5}"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-lead-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次は中央項が負の9−4√5を考える。平方根の差の平方を展開し、対応させる形を作る。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-formula-05",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "(\\sqrt a-\\sqrt b)^2="
            },
            {
              "type": "choice",
              "itemId": "ne02-05"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-after-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "交差項の係数を同じ形へそろえてから、和と積を対応させる。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-lead-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "交差項の係数をそろえて比べられるよう、4√5を係数2と一つの根号の積へ直す。和と積を別々の条件にする。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-before-06-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "9-4\\sqrt5"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-formula-06",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-06"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-after-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二条件を満たす二数を求め、順序を入れ替えた差も候補に残す。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-result-06-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "4\\sqrt5=2(2\\sqrt5)=2\\sqrt{20}"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-lead-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "和と積を満たす二数を求め、平方根の差へ戻す。この段階では二つの順序を候補として残す。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-formula-07",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-07"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-after-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの候補は符号が逆だが、平方は一致する。主平方根を決めるには大小の比較が必要になる。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-lead-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの候補の大小を平方で比較する。根号そのものを表す非負の方を一つ選ぶ。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-formula-08",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-08"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-after-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "差の形では平方だけでなく大小も確かめ、非負の方を選ぶ。方程式の二つの解と主平方根の値を区別する。"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-result-08-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\sqrt{(\\sqrt a-\\sqrt b)^2}=|\\sqrt a-\\sqrt b|"
            }
          ],
          "derivationId": "ne02-chain-05"
        },
        {
          "id": "ne02-heading-09",
          "type": "heading",
          "text": "中央の係数をそろえて使う"
        },
        {
          "id": "ne02-marker-09",
          "type": "marker",
          "kind": "check",
          "text": "確認"
        },
        {
          "id": "ne02-intro-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "中央の係数が2でない形にも同じ方法を使うため、根号内全体を一つの分数へ直す。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-problem-09",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\sqrt{3+\\sqrt5}"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-lead-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "最後は√(3+√5)に取り組む。根号の中全体を分母2へ通分し、分子の中央の係数を前とそろえる。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-formula-09",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "3+\\sqrt5="
            },
            {
              "type": "choice",
              "itemId": "ne02-09"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-after-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "分子と分母はどちらも正なので、平方根の商の関係を使える。分子の和は一つの根号に保つ。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-lead-10",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "分子が正、分母が正であることを確かめ、平方根の商の関係を使う。分子の和は一つの根号に保つ。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-formula-10",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\sqrt{3+\\sqrt5}="
            },
            {
              "type": "choice",
              "itemId": "ne02-10"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-after-10",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "分子について最初と同じ和と積の方法を使う。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-lead-11",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "分子へ、最初の例題で作った和と積の方法を使う。条件、二数、非負の平方根の和までを一つの対応として選ぶ。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-formula-11",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "ne02-11"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-after-11",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "分子の平方根の和は正である。この結果を前の商へ戻して、有理化する。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-lead-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "分子の結果を前の商へ戻す。分母と分子に同じ平方根を掛け、有理化して答えをまとめる。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-before-12-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\frac{\\sqrt5+1}{\\sqrt2}"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-formula-12",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\sqrt{3+\\sqrt5}="
            },
            {
              "type": "choice",
              "itemId": "ne02-12"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-after-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "和と積の条件を作り、二数を探し、最後に符号まで確かめた。ここで扱ったのは根号内を平方の展開へ対応させられる場合であり、すべての二重根号へ機械的には一般化しない。"
            }
          ],
          "derivationId": "ne02-chain-09"
        },
        {
          "id": "ne02-result-12-1",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "\\frac{(\\sqrt5+1)\\sqrt2}{2}=\\frac{\\sqrt{10}+\\sqrt2}{2}"
            }
          ],
          "derivationId": "ne02-chain-09"
        }
      ],
      "items": [
        {
          "id": "ne02-01",
          "label": "NE02-01",
          "prompt": "a,bを正の実数とする。平方根の和を二乗し、平方の項と二つの交差項を分けて書く。",
          "answer": "a+b+2\\sqrt{ab}",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a+b+2\\sqrt{ab}",
            "a+b+\\sqrt{ab}",
            "a+b+2ab"
          ],
          "purpose": "concept-formation",
          "scaffoldLevel": "strong",
          "hints": [
            "和の平方の交差項に√aと√bを代入する。"
          ]
        },
        {
          "id": "ne02-02",
          "label": "NE02-02",
          "prompt": "前の平方の展開を5+2√6と比べる。根号の外の部分と、交差項の根号の中を対応させる。",
          "answer": "a+b=5,\\quad ab=6",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a+b=5,\\quad ab=6",
            "a+b=5,\\quad ab=3",
            "a+b=5,\\quad ab=12"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "中央の係数2をそろえたまま、根号内を比べよう。"
          ]
        },
        {
          "id": "ne02-03",
          "label": "NE02-03",
          "prompt": "和と積の二条件を同時に満たす正の二数を探す。順番はどちらでもよい。",
          "answer": "a=2,\\quad b=3\\quad(\\text{順不同})",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a=2,\\quad b=3\\quad(\\text{順不同})",
            "a=1,\\quad b=4",
            "a=1,\\quad b=6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "一方の条件だけで決めず、もう一方も代入して確かめよう。"
          ]
        },
        {
          "id": "ne02-04",
          "label": "NE02-04",
          "prompt": "平方が一致しただけでは符号が決まらない。候補が非負であることも確かめ、元の根号の値を選ぶ。",
          "answer": "\\sqrt2+\\sqrt3>0,\\quad\\sqrt{5+2\\sqrt6}=\\sqrt2+\\sqrt3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "\\sqrt2+\\sqrt3>0,\\quad\\sqrt{5+2\\sqrt6}=\\sqrt2+\\sqrt3",
            "\\sqrt{5+2\\sqrt6}=-\\sqrt2-\\sqrt3",
            "\\sqrt{5+2\\sqrt6}=\\sqrt5+\\sqrt{2\\sqrt6}"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "√の記号が表す値の符号も条件に入れよう。"
          ]
        },
        {
          "id": "ne02-05",
          "label": "NE02-05",
          "prompt": "次は中央項が負の9−4√5を考える。平方根の差の平方を展開し、対応させる形を作る。",
          "answer": "a+b-2\\sqrt{ab}",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a+b-2\\sqrt{ab}",
            "a+b+2\\sqrt{ab}",
            "a-b-2\\sqrt{ab}"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "差の平方では中央項の符号だけでなく、最後の平方の符号も確かめよう。"
          ]
        },
        {
          "id": "ne02-06",
          "label": "NE02-06",
          "prompt": "交差項の係数をそろえて比べられるよう、4√5を係数2と一つの根号の積へ直す。和と積を別々の条件にする。",
          "answer": "a+b=9,\\quad ab=20",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a+b=9,\\quad ab=20",
            "a+b=9,\\quad ab=5",
            "a+b=9,\\quad ab=10"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "4√5を2でくくった残りを、一つの根号へ入れよう。"
          ]
        },
        {
          "id": "ne02-07",
          "label": "NE02-07",
          "prompt": "和と積を満たす二数を求め、平方根の差へ戻す。この段階では二つの順序を候補として残す。",
          "answer": "a=5,\\ b=4:\\ \\sqrt5-2\\quad\\text{または}\\quad a=4,\\ b=5:\\ 2-\\sqrt5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a=5,\\ b=4:\\ \\sqrt5-2\\quad\\text{または}\\quad a=4,\\ b=5:\\ 2-\\sqrt5",
            "a=8,\\ b=1:\\ \\sqrt8-1",
            "a=5,\\ b=4:\\ \\sqrt{5-4}"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "二数の順序を入れ替えると、差の符号がどうなるかも書こう。"
          ]
        },
        {
          "id": "ne02-08",
          "label": "NE02-08",
          "prompt": "二つの候補の大小を平方で比較する。根号そのものを表す非負の方を一つ選ぶ。",
          "answer": "\\sqrt5>2,\\quad\\sqrt{9-4\\sqrt5}=\\sqrt5-2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "\\sqrt5>2,\\quad\\sqrt{9-4\\sqrt5}=\\sqrt5-2",
            "\\sqrt{9-4\\sqrt5}=2-\\sqrt5",
            "\\sqrt{9-4\\sqrt5}=\\pm(\\sqrt5-2)"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "正の数同士なので、平方した値の大小を比べられる。"
          ]
        },
        {
          "id": "ne02-09",
          "label": "NE02-09",
          "prompt": "最後は√(3+√5)に取り組む。根号の中全体を分母2へ通分し、分子の中央の係数を前とそろえる。",
          "answer": "\\frac{6+2\\sqrt5}{2}",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "\\frac{6+2\\sqrt5}{2}",
            "\\frac{3+2\\sqrt5}{2}",
            "\\frac{6+\\sqrt5}{2}"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "根号の中の式全体に2/2を掛けよう。"
          ]
        },
        {
          "id": "ne02-10",
          "label": "NE02-10",
          "prompt": "分子が正、分母が正であることを確かめ、平方根の商の関係を使う。分子の和は一つの根号に保つ。",
          "answer": "\\frac{\\sqrt{6+2\\sqrt5}}{\\sqrt2}",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "\\frac{\\sqrt{6+2\\sqrt5}}{\\sqrt2}",
            "\\frac{\\sqrt{6+2\\sqrt5}}{2}",
            "\\frac{\\sqrt6+\\sqrt{2\\sqrt5}}{\\sqrt2}"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "商全体の平方根では、分母にも平方根を付ける。"
          ]
        },
        {
          "id": "ne02-11",
          "label": "NE02-11",
          "prompt": "分子へ、最初の例題で作った和と積の方法を使う。条件、二数、非負の平方根の和までを一つの対応として選ぶ。",
          "answer": "a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{5,1\\};\\ \\sqrt{6+2\\sqrt5}=\\sqrt5+1",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{5,1\\};\\ \\sqrt{6+2\\sqrt5}=\\sqrt5+1",
            "a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{3,3\\};\\ \\sqrt{6+2\\sqrt5}=2\\sqrt3",
            "a+b=6,\\ ab=5;\\ \\{a,b\\}=\\{5,1\\};\\ \\sqrt{6+2\\sqrt5}=\\sqrt5-1"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "分子の定数部分と中央項から、二つの条件を作り直そう。"
          ]
        },
        {
          "id": "ne02-12",
          "label": "NE02-12",
          "prompt": "分子の結果を前の商へ戻す。分母と分子に同じ平方根を掛け、有理化して答えをまとめる。",
          "answer": "\\frac{\\sqrt{10}+\\sqrt2}{2}",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "\\frac{\\sqrt{10}+\\sqrt2}{2}",
            "\\frac{\\sqrt{10}+1}{2}",
            "\\sqrt{10}+\\sqrt2"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "(√5+1)/√2の分子全体にも√2を掛けよう。"
          ]
        }
      ]
    }
  ]
} as const

export const mathNumbersNE02Unit = validateTextbookUnits([rawUnit])[0]
