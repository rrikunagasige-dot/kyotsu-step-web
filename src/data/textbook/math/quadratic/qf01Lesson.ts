import raw from './qf01Unit.json'
import presentation from './qf01Presentation.json'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import type { TransformationReading } from '../../../../domain/transformationReading'

export const mathQuadraticQF01Unit = validateTextbookUnits([raw])[0]
export const qf01GuidedPresentation = presentation

/** P017: all nine stages; old twenty-five physical nodes, twenty-four active answers. */
export const qf01TransformationPresentation = {
  "schemaVersion": "transformation-reading/1",
  "unitId": "math-quadratic-qf01",
  "presentationVersion": 2,
  "baseIRHash": "cf7825183cb69c5dc979c6c5082d2def31bcfc41e6bec1b38aef3aec14ce01f6",
  "gradingHash": "6932c1fbf45bd8cfe2938c6d77ad514258fbc3494882a5ee358f28e5ad0c5dd1",
  "scope": {
    "nodeIds": [
      "qf01-n01",
      "qf01-n02",
      "qf01-n03",
      "qf01-n04",
      "qf01-n05",
      "qf01-n06",
      "qf01-n07",
      "qf01-n08",
      "qf01-n09",
      "qf01-n10",
      "qf01-n11",
      "qf01-n12a",
      "qf01-n12b",
      "qf01-n12c",
      "qf01-n12",
      "qf01-n13",
      "qf01-n14",
      "qf01-n15",
      "qf01-n16",
      "qf01-n17",
      "qf01-n18",
      "qf01-n19",
      "qf01-n20",
      "qf01-n21",
      "qf01-n22"
    ],
    "stageIds": [
      "qf01-stage-1",
      "qf01-stage-2",
      "qf01-stage-3",
      "qf01-stage-4",
      "qf01-stage-5",
      "qf01-stage-6",
      "qf01-stage-7",
      "qf01-stage-8",
      "qf01-stage-9"
    ]
  },
  "groups": [
    {
      "id": "qf01-stage-1-rule",
      "kind": "relation-sequence",
      "number": 1,
      "numberId": "qf01-stage-1-rule-equation",
      "stageIds": [
        "qf01-stage-1"
      ],
      "sourceNodeIds": [
        "qf01-n01",
        "qf01-n02"
      ],
      "rows": [
        {
          "id": "qf01-n01-chain",
          "sourceNodeId": "qf01-n01",
          "stateRef": "qf01-n01-chain",
          "role": "main",
          "visibleAfter": [],
          "interactionRef": "qf01-n01-answer",
          "before": [
            {
              "type": "text",
              "text": "規則のうち、まず掛け算の部分を式にする。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "掛け算の結果から、同じ規則の引き算を続ける。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "\\text{出てくる数}"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n01-p017-slot",
                "interactionRef": "qf01-n01-answer"
              },
              {
                "type": "math",
                "latex": "-6"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "\\text{出てくる数}"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4\\times2-6"
              }
            ]
          }
        },
        {
          "id": "qf01-product-value",
          "sourceNodeId": "qf01-n02",
          "stateRef": "qf01-product-value",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer"
          ],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "8-6"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "8-6"
              }
            ]
          }
        },
        {
          "id": "qf01-n02-chain",
          "sourceNodeId": "qf01-n02",
          "stateRef": "qf01-n02-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer"
          ],
          "interactionRef": "qf01-n02-answer",
          "before": [
            {
              "type": "text",
              "text": "得た積から、規則どおりに引き算を続ける。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "入力する数を一つ決めると、出てくる数がただ一つ決まる。これを関数という。この規則を名前で表すと、"
            },
            {
              "type": "math",
              "latex": "y=f(x)"
            },
            {
              "type": "text",
              "text": "、ここでは"
            },
            {
              "type": "math",
              "latex": "f(x)=4x-6"
            },
            {
              "type": "text",
              "text": "である。"
            },
            {
              "type": "math",
              "latex": "f(2)=2"
            },
            {
              "type": "text",
              "text": "は入力に対して決まった値を表し、関数の名前と数との積ではない。入力と出力がいつも等しいわけではない。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n02-p017-slot",
                "interactionRef": "qf01-n02-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "2"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-2-negative",
      "kind": "relation-sequence",
      "number": 2,
      "numberId": "qf01-stage-2-negative-equation",
      "stageIds": [
        "qf01-stage-2"
      ],
      "sourceNodeIds": [
        "qf01-n03",
        "qf01-n04"
      ],
      "rows": [
        {
          "id": "qf01-n03-chain",
          "sourceNodeId": "qf01-n03",
          "stateRef": "qf01-n03-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer"
          ],
          "interactionRef": "qf01-n03-answer",
          "before": [
            {
              "type": "text",
              "text": "入力全体を括弧で囲み、元の文字の位置へ入れる。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n03-p017-slot",
                "interactionRef": "qf01-n03-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4\\times(-1)-6"
              }
            ]
          }
        },
        {
          "id": "qf01-negative-product",
          "sourceNodeId": "qf01-n04",
          "stateRef": "qf01-negative-product",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer"
          ],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "-4-6"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "-4-6"
              }
            ]
          }
        },
        {
          "id": "qf01-n04-chain",
          "sourceNodeId": "qf01-n04",
          "stateRef": "qf01-n04-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer"
          ],
          "interactionRef": "qf01-n04-answer",
          "before": [
            {
              "type": "text",
              "text": "同じ関数値を保ったまま計算する。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "入力"
            },
            {
              "type": "math",
              "latex": "-1\\text{（入力）}"
            },
            {
              "type": "text",
              "text": "と、出力"
            },
            {
              "type": "math",
              "latex": "-10\\text{（出力）}"
            },
            {
              "type": "text",
              "text": "を区別する。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n04-p017-slot",
                "interactionRef": "qf01-n04-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "-10"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-3-symbol",
      "kind": "relation-sequence",
      "number": 3,
      "numberId": "qf01-stage-3-symbol-equation",
      "stageIds": [
        "qf01-stage-3"
      ],
      "sourceNodeIds": [
        "qf01-n05",
        "qf01-n06",
        "qf01-n07"
      ],
      "rows": [
        {
          "id": "qf01-n05-chain",
          "sourceNodeId": "qf01-n05",
          "stateRef": "qf01-n05-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer"
          ],
          "interactionRef": "qf01-n05-answer",
          "before": [
            {
              "type": "text",
              "text": "文字式も一つの入力として、全体を置き換える。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(a-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n05-p017-slot",
                "interactionRef": "qf01-n05-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(a-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4(a-1)-6"
              }
            ]
          }
        },
        {
          "id": "qf01-n06-chain",
          "sourceNodeId": "qf01-n06",
          "stateRef": "qf01-n06-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer"
          ],
          "interactionRef": "qf01-n06-answer",
          "before": [
            {
              "type": "text",
              "text": "括弧の各項へ係数を分配する。外側の引き算はそのまま残す。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "("
              },
              {
                "type": "slot",
                "id": "qf01-n06-p017-slot",
                "interactionRef": "qf01-n06-answer"
              },
              {
                "type": "math",
                "latex": ")-6"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4a-4-6"
              }
            ]
          }
        },
        {
          "id": "qf01-n07-chain",
          "sourceNodeId": "qf01-n07",
          "stateRef": "qf01-n07-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer"
          ],
          "interactionRef": "qf01-n07-answer",
          "before": [
            {
              "type": "text",
              "text": "文字の項を保ち、定数どうしをまとめる。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n07-p017-slot",
                "interactionRef": "qf01-n07-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4a-10"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-4-square-number",
      "kind": "relation-sequence",
      "number": 4,
      "numberId": "qf01-stage-4-square-number-equation",
      "stageIds": [
        "qf01-stage-4"
      ],
      "sourceNodeIds": [
        "qf01-n08",
        "qf01-n09"
      ],
      "rows": [
        {
          "id": "qf01-n08-chain",
          "sourceNodeId": "qf01-n08",
          "stateRef": "qf01-n08-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer"
          ],
          "interactionRef": "qf01-n08-answer",
          "before": [
            {
              "type": "text",
              "text": "二乗の対象は負の入力全体である。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n08-p017-slot",
                "interactionRef": "qf01-n08-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(-1)^2-1"
              }
            ]
          }
        },
        {
          "id": "qf01-square-product",
          "sourceNodeId": "qf01-n09",
          "stateRef": "qf01-square-product",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer"
          ],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(-1)\\times(-1)-1"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(-1)\\times(-1)-1"
              }
            ]
          }
        },
        {
          "id": "qf01-square-value",
          "sourceNodeId": "qf01-n09",
          "stateRef": "qf01-square-value",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer"
          ],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "1-1"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "1-1"
              }
            ]
          }
        },
        {
          "id": "qf01-n09-chain",
          "sourceNodeId": "qf01-n09",
          "stateRef": "qf01-n09-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer"
          ],
          "interactionRef": "qf01-n09-answer",
          "before": [
            {
              "type": "text",
              "text": "平方を先に計算してから、元の引き算へ進む。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "同じ入力でも、規則が違えば出力は変わる。今の規則は"
            },
            {
              "type": "math",
              "latex": "f(x)=x^2-1"
            },
            {
              "type": "text",
              "text": "である。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n09-p017-slot",
                "interactionRef": "qf01-n09-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "0"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-5-positive",
      "kind": "relation-sequence",
      "number": 5,
      "numberId": "qf01-stage-5-positive-equation",
      "stageIds": [
        "qf01-stage-5"
      ],
      "sourceNodeIds": [
        "qf01-n10"
      ],
      "rows": [
        {
          "id": "qf01-positive-input",
          "sourceNodeId": "qf01-n10",
          "stateRef": "qf01-positive-input",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer"
          ],
          "interactionRef": null,
          "before": [
            {
              "type": "text",
              "text": "置換と平方の途中式を見ながら、最後の値をまとめる。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(2)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "2^2-1"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(2)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "2^2-1"
              }
            ]
          }
        },
        {
          "id": "qf01-positive-square",
          "sourceNodeId": "qf01-n10",
          "stateRef": "qf01-positive-square",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer"
          ],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4-1"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4-1"
              }
            ]
          }
        },
        {
          "id": "qf01-n10-chain",
          "sourceNodeId": "qf01-n10",
          "stateRef": "qf01-n10-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer"
          ],
          "interactionRef": "qf01-n10-answer",
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n10-p017-slot",
                "interactionRef": "qf01-n10-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "3"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-6-parent",
      "kind": "relation-sequence",
      "number": 6,
      "numberId": "qf01-stage-6-parent-equation",
      "stageIds": [
        "qf01-stage-6"
      ],
      "sourceNodeIds": [
        "qf01-n11"
      ],
      "rows": [
        {
          "id": "qf01-n11-chain",
          "sourceNodeId": "qf01-n11",
          "stateRef": "qf01-n11-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer"
          ],
          "interactionRef": "qf01-n11-answer",
          "before": [
            {
              "type": "text",
              "text": "二乗に入れるのは式全体。二乗の外にある引き算も保つ。平方部分を整えたあと、元の関数に残る引き算へ戻る。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(a-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n11-p017-slot",
                "interactionRef": "qf01-n11-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(a-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(a-1)^2-1"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-6-square",
      "kind": "relation-sequence",
      "number": 7,
      "numberId": "qf01-stage-6-square-equation",
      "stageIds": [
        "qf01-stage-6"
      ],
      "sourceNodeIds": [
        "qf01-n12a",
        "qf01-n12b",
        "qf01-n12c",
        "qf01-n12"
      ],
      "rows": [
        {
          "id": "qf01-square-anchor",
          "sourceNodeId": "qf01-n12a",
          "stateRef": "qf01-square-anchor",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer"
          ],
          "interactionRef": null,
          "before": [
            {
              "type": "text",
              "text": "親の関数値は上に保ち、ここでは平方部分だけを整える。平方を同じ式二つの積に戻して分配する。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "(a-1)^2"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(a-1)(a-1)"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "(a-1)^2"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(a-1)(a-1)"
              }
            ]
          }
        },
        {
          "id": "qf01-n12a-chain",
          "sourceNodeId": "qf01-n12a",
          "stateRef": "qf01-n12a-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer"
          ],
          "interactionRef": "qf01-n12a-answer",
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a(a-1)+("
              },
              {
                "type": "slot",
                "id": "qf01-n12a-p017-slot",
                "interactionRef": "qf01-n12a-answer"
              },
              {
                "type": "math",
                "latex": ")"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a(a-1)-1(a-1)"
              }
            ]
          }
        },
        {
          "id": "qf01-n12b-chain",
          "sourceNodeId": "qf01-n12b",
          "stateRef": "qf01-n12b-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer"
          ],
          "interactionRef": "qf01-n12b-answer",
          "before": [
            {
              "type": "text",
              "text": "最初の積の括弧を外し、残りの項は同じ行に保つ。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "("
              },
              {
                "type": "slot",
                "id": "qf01-n12b-p017-slot",
                "interactionRef": "qf01-n12b-answer"
              },
              {
                "type": "math",
                "latex": ")-1(a-1)"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2-a-1(a-1)"
              }
            ]
          }
        },
        {
          "id": "qf01-n12c-chain",
          "sourceNodeId": "qf01-n12c",
          "stateRef": "qf01-n12c-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer"
          ],
          "interactionRef": "qf01-n12c-answer",
          "before": [
            {
              "type": "text",
              "text": "残った負の係数の積を展開する。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "(a^2-a)+("
              },
              {
                "type": "slot",
                "id": "qf01-n12c-p017-slot",
                "interactionRef": "qf01-n12c-answer"
              },
              {
                "type": "math",
                "latex": ")"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2-a-a+1"
              }
            ]
          }
        },
        {
          "id": "qf01-n12-chain",
          "sourceNodeId": "qf01-n12",
          "stateRef": "qf01-n12-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer"
          ],
          "interactionRef": "qf01-n12-answer",
          "before": [
            {
              "type": "text",
              "text": "同じ文字の項を、係数どうしの和としてまとめる。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "二つの同じ負の文字の項を合わせた。平方部分の計算を、元の関数に戻す。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2+("
              },
              {
                "type": "slot",
                "id": "qf01-n12-p017-slot",
                "interactionRef": "qf01-n12-answer"
              },
              {
                "type": "math",
                "latex": ")a+1"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2-2a+1"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-6-return",
      "kind": "relation-sequence",
      "number": 6,
      "numberId": "qf01-stage-6-parent-equation",
      "stageIds": [
        "qf01-stage-6"
      ],
      "sourceNodeIds": [
        "qf01-n13"
      ],
      "rows": [
        {
          "id": "qf01-return-anchor",
          "sourceNodeId": "qf01-n13",
          "stateRef": "qf01-return-anchor",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer"
          ],
          "interactionRef": null,
          "before": [
            {
              "type": "text",
              "text": "平方部分の結果を親の関数へ戻し、最後の定数を整理する。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(a-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2-2a+1-1"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(a-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2-2a+1-1"
              }
            ]
          }
        },
        {
          "id": "qf01-n13-chain",
          "sourceNodeId": "qf01-n13",
          "stateRef": "qf01-n13-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer"
          ],
          "interactionRef": "qf01-n13-answer",
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n13-p017-slot",
                "interactionRef": "qf01-n13-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "a^2-2a"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-7-rectangle",
      "kind": "relation-sequence",
      "number": 8,
      "numberId": "qf01-stage-7-rectangle-equation",
      "stageIds": [
        "qf01-stage-7"
      ],
      "sourceNodeIds": [
        "qf01-n14",
        "qf01-n15",
        "qf01-n16"
      ],
      "rows": [
        {
          "id": "qf01-n14-chain",
          "sourceNodeId": "qf01-n14",
          "stateRef": "qf01-n14-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer"
          ],
          "interactionRef": "qf01-n14-answer",
          "before": [
            {
              "type": "text",
              "text": "周の条件を一つの関係式にする。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n14-p017-slot",
                "interactionRef": "qf01-n14-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "",
            "right": [
              {
                "type": "math",
                "latex": "2x+2y=40"
              }
            ]
          }
        },
        {
          "id": "qf01-n15-chain",
          "sourceNodeId": "qf01-n15",
          "stateRef": "qf01-n15-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer"
          ],
          "interactionRef": "qf01-n15-answer",
          "before": [
            {
              "type": "text",
              "text": "関係式の両辺に同じ割り算をする。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n15-p017-slot",
                "interactionRef": "qf01-n15-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "x+y=20"
              }
            ]
          }
        },
        {
          "id": "qf01-n16-chain",
          "sourceNodeId": "qf01-n16",
          "stateRef": "qf01-n16-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer"
          ],
          "interactionRef": "qf01-n16-answer",
          "before": [
            {
              "type": "text",
              "text": "元の目的である横の長さだけを左辺に残す。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n16-p017-slot",
                "interactionRef": "qf01-n16-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "y=20-x"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-8-domain",
      "kind": "relation-sequence",
      "number": 9,
      "numberId": "qf01-stage-8-domain-equation",
      "stageIds": [
        "qf01-stage-8"
      ],
      "sourceNodeIds": [
        "qf01-n17",
        "qf01-n18",
        "qf01-n19"
      ],
      "rows": [
        {
          "id": "qf01-n17-chain",
          "sourceNodeId": "qf01-n17",
          "stateRef": "qf01-n17-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer"
          ],
          "interactionRef": "qf01-n17-answer",
          "before": [
            {
              "type": "text",
              "text": "二つの辺が実際に長方形を作る条件を、まとめて表す。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n17-p017-slot",
                "interactionRef": "qf01-n17-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "",
            "right": [
              {
                "type": "math",
                "latex": "x>0\\land y>0"
              }
            ]
          }
        },
        {
          "id": "qf01-positive-width",
          "sourceNodeId": "qf01-n18",
          "stateRef": "qf01-positive-width",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer",
            "qf01-n17-answer"
          ],
          "interactionRef": null,
          "before": [
            {
              "type": "text",
              "text": "横の正条件を入力の不等式へ移す。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "y>0"
              }
            ],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "20-x>0"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "y>0"
              }
            ],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "20-x>0"
              }
            ]
          }
        },
        {
          "id": "qf01-n18-chain",
          "sourceNodeId": "qf01-n18",
          "stateRef": "qf01-n18-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer",
            "qf01-n17-answer"
          ],
          "interactionRef": "qf01-n18-answer",
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n18-p017-slot",
                "interactionRef": "qf01-n18-answer"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "x<20"
              }
            ]
          }
        },
        {
          "id": "qf01-n19-chain",
          "sourceNodeId": "qf01-n19",
          "stateRef": "qf01-n19-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer",
            "qf01-n17-answer",
            "qf01-n18-answer"
          ],
          "interactionRef": "qf01-n19-answer",
          "before": [
            {
              "type": "text",
              "text": "入力についての二つの条件を同時に満たす範囲にまとめる。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "このように関数で使える入力の範囲を、定義域という。端の値では辺がつぶれるため、今回は含めない。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "x>0\\land x<20"
              }
            ],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n19-p017-slot",
                "interactionRef": "qf01-n19-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "x>0\\land x<20"
              }
            ],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "0<x<20"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "qf01-stage-9-range",
      "kind": "relation-sequence",
      "number": 10,
      "numberId": "qf01-stage-9-range-equation",
      "stageIds": [
        "qf01-stage-9"
      ],
      "sourceNodeIds": [
        "qf01-n20",
        "qf01-n21",
        "qf01-n22"
      ],
      "rows": [
        {
          "id": "qf01-n20-reused-lower-bound",
          "sourceNodeId": "qf01-n20",
          "stateRef": "qf01-n20-reused-lower-bound",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer",
            "qf01-n17-answer",
            "qf01-n18-answer",
            "qf01-n19-answer"
          ],
          "interactionRef": null,
          "before": [
            {
              "type": "text",
              "text": "正の辺長の条件から、出力の下側の条件は既に得ている。同じ条件を再質問せず、そのまま使う。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "正の辺長として既に得た下限を再利用する。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [],
            "relation": "",
            "right": [
              {
                "type": "math",
                "latex": "y>0"
              }
            ]
          },
          "completed": {
            "left": [],
            "relation": "",
            "right": [
              {
                "type": "math",
                "latex": "y>0"
              }
            ]
          }
        },
        {
          "id": "qf01-n21-chain",
          "sourceNodeId": "qf01-n21",
          "stateRef": "qf01-n21-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer",
            "qf01-n17-answer",
            "qf01-n18-answer",
            "qf01-n19-answer"
          ],
          "interactionRef": "qf01-n21-answer",
          "before": [
            {
              "type": "text",
              "text": "正の入力を引くことから、出力の上側の条件を調べる。"
            }
          ],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "x>0"
              }
            ],
            "relation": "\\Rightarrow",
            "right": [
              {
                "type": "math",
                "latex": "y=20-x\\text{ は }"
              },
              {
                "type": "slot",
                "id": "qf01-n21-p017-slot",
                "interactionRef": "qf01-n21-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "x>0"
              }
            ],
            "relation": "\\Rightarrow",
            "right": [
              {
                "type": "math",
                "latex": "y<20"
              }
            ]
          }
        },
        {
          "id": "qf01-n22-chain",
          "sourceNodeId": "qf01-n22",
          "stateRef": "qf01-n22-chain",
          "role": "main",
          "visibleAfter": [
            "qf01-n01-answer",
            "qf01-n02-answer",
            "qf01-n03-answer",
            "qf01-n04-answer",
            "qf01-n05-answer",
            "qf01-n06-answer",
            "qf01-n07-answer",
            "qf01-n08-answer",
            "qf01-n09-answer",
            "qf01-n10-answer",
            "qf01-n11-answer",
            "qf01-n12a-answer",
            "qf01-n12b-answer",
            "qf01-n12c-answer",
            "qf01-n12-answer",
            "qf01-n13-answer",
            "qf01-n14-answer",
            "qf01-n15-answer",
            "qf01-n16-answer",
            "qf01-n17-answer",
            "qf01-n18-answer",
            "qf01-n19-answer",
            "qf01-n21-answer"
          ],
          "interactionRef": "qf01-n22-answer",
          "before": [
            {
              "type": "text",
              "text": "既に確定した下側と上側の条件を、出力の範囲として一つにまとめる。"
            }
          ],
          "after": [
            {
              "type": "text",
              "text": "これが出力の範囲、値域である。入力の定義域とは文字も役割も違う。"
            },
            {
              "type": "text",
              "text": "すべての中間の出力が実現することも確かめる。任意の"
            },
            {
              "type": "math",
              "latex": "0<y<20"
            },
            {
              "type": "text",
              "text": "に対して"
            },
            {
              "type": "math",
              "latex": "x=20-y"
            },
            {
              "type": "text",
              "text": "とすると、"
            },
            {
              "type": "math",
              "latex": "0<x<20"
            },
            {
              "type": "text",
              "text": "で、元の関係も満たす。したがってこの範囲のすべての値が実現する。この逆対応による説明は作者補足である。"
            }
          ],
          "afterVisible": true,
          "continuation": false,
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "y>0\\land y<20"
              }
            ],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "slot",
                "id": "qf01-n22-p017-slot",
                "interactionRef": "qf01-n22-answer"
              }
            ]
          },
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "y>0\\land y<20"
              }
            ],
            "relation": "\\Leftrightarrow",
            "right": [
              {
                "type": "math",
                "latex": "0<y<20"
              }
            ]
          }
        }
      ]
    }
  ],
  "interactions": [
    {
      "id": "qf01-n01-answer",
      "nodeId": "qf01-n01",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "入力2を4倍する積そのもの",
      "prerequisiteInteractionIds": [],
      "choices": [
        "4×2",
        "4+2",
        "2−4"
      ],
      "correctValue": "4×2"
    },
    {
      "id": "qf01-n02-answer",
      "nodeId": "qf01-n02",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "規則の最終出力2",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer"
      ],
      "choices": [
        "2",
        "14",
        "−2"
      ],
      "correctValue": "2"
    },
    {
      "id": "qf01-n03-answer",
      "nodeId": "qf01-n03",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "4x−6へ−1全体を代入した右辺全体",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer"
      ],
      "choices": [
        "4×(−1)−6",
        "4−1−6",
        "4×(−1−6)"
      ],
      "correctValue": "4×(−1)−6"
    },
    {
      "id": "qf01-n04-answer",
      "nodeId": "qf01-n04",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "関数値−10",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer"
      ],
      "choices": [
        "−10",
        "2",
        "10"
      ],
      "correctValue": "−10"
    },
    {
      "id": "qf01-n05-answer",
      "nodeId": "qf01-n05",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "4x−6へa−1全体を代入した右辺全体",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer"
      ],
      "choices": [
        "4(a−1)−6",
        "4a−1−6",
        "4(a−1−6)"
      ],
      "correctValue": "4(a−1)−6"
    },
    {
      "id": "qf01-n06-answer",
      "nodeId": "qf01-n06",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "部分式4(a−1)の展開全体",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer"
      ],
      "choices": [
        "4a−4",
        "4a−1",
        "4a+4"
      ],
      "correctValue": "4a−4"
    },
    {
      "id": "qf01-n07-answer",
      "nodeId": "qf01-n07",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "最終関数値4a−10",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer"
      ],
      "choices": [
        "4a−10",
        "4a+2",
        "4a−2"
      ],
      "correctValue": "4a−10"
    },
    {
      "id": "qf01-n08-answer",
      "nodeId": "qf01-n08",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "x²−1へ−1全体を代入した右辺全体",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer"
      ],
      "choices": [
        "(−1)²−1",
        "−1²−1",
        "(−1−1)²"
      ],
      "correctValue": "(−1)²−1"
    },
    {
      "id": "qf01-n09-answer",
      "nodeId": "qf01-n09",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "新しい規則の最終出力0",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer"
      ],
      "choices": [
        "0",
        "−2",
        "1"
      ],
      "correctValue": "0"
    },
    {
      "id": "qf01-n10-answer",
      "nodeId": "qf01-n10",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "x²−1でのf(2)の最終値3",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer"
      ],
      "choices": [
        "3",
        "1",
        "−3"
      ],
      "correctValue": "3"
    },
    {
      "id": "qf01-n11-answer",
      "nodeId": "qf01-n11",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "x²−1へa−1全体を代入した右辺全体",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer"
      ],
      "choices": [
        "(a−1)²−1",
        "a²−1−1",
        "(a−1)²"
      ],
      "correctValue": "(a−1)²−1"
    },
    {
      "id": "qf01-n12a-answer",
      "nodeId": "qf01-n12a",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "分配後の負の項全体−1(a−1)",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer"
      ],
      "choices": [
        "−1(a−1)",
        "+(a−1)",
        "−1(a+1)"
      ],
      "correctValue": "−1(a−1)"
    },
    {
      "id": "qf01-n12b-answer",
      "nodeId": "qf01-n12b",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "a(a−1)の展開全体a²−a",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer"
      ],
      "choices": [
        "a²−a",
        "a²−1",
        "a²+a"
      ],
      "correctValue": "a²−a"
    },
    {
      "id": "qf01-n12c-answer",
      "nodeId": "qf01-n12c",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "−1(a−1)の展開全体−a+1",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer"
      ],
      "choices": [
        "−a+1",
        "−a−1",
        "a−1"
      ],
      "correctValue": "−a+1"
    },
    {
      "id": "qf01-n12-answer",
      "nodeId": "qf01-n12",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "中央のaの係数−2そのもの",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer"
      ],
      "choices": [
        "−2",
        "−1",
        "2"
      ],
      "correctValue": "−2"
    },
    {
      "id": "qf01-n13-answer",
      "nodeId": "qf01-n13",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "元の関数に戻った最終式a²−2a",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer"
      ],
      "choices": [
        "a²−2a",
        "a²−2a+2",
        "a²−1"
      ],
      "correctValue": "a²−2a"
    },
    {
      "id": "qf01-n14-answer",
      "nodeId": "qf01-n14",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "長方形の周の関係式全体2x+2y=40",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer"
      ],
      "choices": [
        "2x+2y=40",
        "xy=40",
        "x+y=40"
      ],
      "correctValue": "2x+2y=40"
    },
    {
      "id": "qf01-n15-answer",
      "nodeId": "qf01-n15",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "2で割った関係式全体x+y=20",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer"
      ],
      "choices": [
        "x+y=20",
        "x+y=40",
        "x+y=80"
      ],
      "correctValue": "x+y=20"
    },
    {
      "id": "qf01-n16-answer",
      "nodeId": "qf01-n16",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "yについて解いた関係式全体y=20−x",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer",
        "qf01-n15-answer"
      ],
      "choices": [
        "y=20−x",
        "y=x−20",
        "y=20+x"
      ],
      "correctValue": "y=20−x"
    },
    {
      "id": "qf01-n17-answer",
      "nodeId": "qf01-n17",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "両方の辺が正という条件全体x>0かつy>0",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer",
        "qf01-n15-answer",
        "qf01-n16-answer"
      ],
      "choices": [
        "x>0かつy>0",
        "x≥0かつy≥0",
        "x>0だけでよい"
      ],
      "correctValue": "x>0かつy>0"
    },
    {
      "id": "qf01-n18-answer",
      "nodeId": "qf01-n18",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "横が正となるxの範囲全体x<20",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer",
        "qf01-n15-answer",
        "qf01-n16-answer",
        "qf01-n17-answer"
      ],
      "choices": [
        "x<20",
        "x>20",
        "x≤20"
      ],
      "correctValue": "x<20"
    },
    {
      "id": "qf01-n19-answer",
      "nodeId": "qf01-n19",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "入力xの共通範囲0<x<20",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer",
        "qf01-n15-answer",
        "qf01-n16-answer",
        "qf01-n17-answer",
        "qf01-n18-answer"
      ],
      "choices": [
        "0<x<20",
        "0≤x≤20",
        "x<20だけ"
      ],
      "correctValue": "0<x<20"
    },
    {
      "id": "qf01-n21-answer",
      "nodeId": "qf01-n21",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "20と比較した出力の大きさを表す語句全体20より小さい",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer",
        "qf01-n15-answer",
        "qf01-n16-answer",
        "qf01-n17-answer",
        "qf01-n18-answer",
        "qf01-n19-answer"
      ],
      "choices": [
        "20より小さい",
        "20に等しい",
        "20より大きい"
      ],
      "correctValue": "20より小さい"
    },
    {
      "id": "qf01-n22-answer",
      "nodeId": "qf01-n22",
      "blankRole": "same-meaning-whole-answer",
      "learnerDecision": "出力yの範囲全体0<y<20",
      "prerequisiteInteractionIds": [
        "qf01-n01-answer",
        "qf01-n02-answer",
        "qf01-n03-answer",
        "qf01-n04-answer",
        "qf01-n05-answer",
        "qf01-n06-answer",
        "qf01-n07-answer",
        "qf01-n08-answer",
        "qf01-n09-answer",
        "qf01-n10-answer",
        "qf01-n11-answer",
        "qf01-n12a-answer",
        "qf01-n12b-answer",
        "qf01-n12c-answer",
        "qf01-n12-answer",
        "qf01-n13-answer",
        "qf01-n14-answer",
        "qf01-n15-answer",
        "qf01-n16-answer",
        "qf01-n17-answer",
        "qf01-n18-answer",
        "qf01-n19-answer",
        "qf01-n21-answer"
      ],
      "choices": [
        "0<y<20",
        "0<x<20",
        "0≤y≤20"
      ],
      "correctValue": "0<y<20"
    }
  ],
  "planHash": "980ebd8e4416a8f70965f63d5ee64c01c188de0dc78b23c47a18327880af457a"
} satisfies TransformationReading

/** Historical view-only P011 pilot, retained for its original regression assertions. */
export const qf01PilotTransformationPresentation = {
  "schemaVersion": "transformation-reading/1",
  "unitId": "math-quadratic-qf01",
  "presentationVersion": 1,
  "baseIRHash": "b31f09b6469af680135aee9a49c8d098d875c8c3a4084432f5cbec174adf893b",
  "gradingHash": "118fefbba2f8319dba0a74aafed0c7a8c3bddd3e284acbb18ab3ae098a374cdd",
  "scope": {
    "nodeIds": [
      "qf01-n03",
      "qf01-n04"
    ],
    "stageIds": [
      "qf01-stage-2"
    ]
  },
  "groups": [
    {
      "id": "qf01-substitution-chain",
      "kind": "expression-chain",
      "number": 1,
      "numberId": "qf01-substitution-equation",
      "stageIds": [
        "qf01-stage-2"
      ],
      "sourceNodeIds": [
        "qf01-n03",
        "qf01-n04"
      ],
      "rows": [
        {
          "id": "qf01-input",
          "sourceNodeId": "qf01-n04",
          "stateRef": "qf01-input",
          "role": "main",
          "visibleAfter": [],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": true,
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ]
          },
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ]
          }
        },
        {
          "id": "qf01-substitution",
          "sourceNodeId": "qf01-n03",
          "stateRef": "qf01-substitution",
          "role": "main",
          "visibleAfter": [],
          "interactionRef": "qf01-n03-answer",
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": false,
          "completed": {
            "left": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "4\\times(-1)-6"
              }
            ]
          },
          "masked": {
            "left": [
              {
                "type": "math",
                "latex": "f(-1)"
              }
            ],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-substitution-slot",
                "interactionRef": "qf01-n03-answer"
              }
            ]
          }
        },
        {
          "id": "qf01-arithmetic",
          "sourceNodeId": "qf01-n04",
          "stateRef": "qf01-arithmetic",
          "role": "main",
          "visibleAfter": [
            "qf01-n03-answer"
          ],
          "interactionRef": null,
          "before": [],
          "after": [],
          "afterVisible": false,
          "continuation": true,
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "-4-6"
              }
            ]
          },
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "-4-6"
              }
            ]
          }
        },
        {
          "id": "qf01-value",
          "sourceNodeId": "qf01-n04",
          "stateRef": "qf01-value",
          "role": "main",
          "visibleAfter": [
            "qf01-n03-answer"
          ],
          "interactionRef": "qf01-n04-answer",
          "before": [],
          "after": [
            {
              "type": "text",
              "text": "入力が−1のとき、出力は−10です。"
            }
          ],
          "afterVisible": true,
          "continuation": true,
          "completed": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "math",
                "latex": "-10"
              }
            ]
          },
          "masked": {
            "left": [],
            "relation": "=",
            "right": [
              {
                "type": "slot",
                "id": "qf01-value-slot",
                "interactionRef": "qf01-n04-answer"
              }
            ]
          }
        }
      ]
    }
  ],
  "interactions": [
    {
      "id": "qf01-n03-answer",
      "nodeId": "qf01-n03",
      "blankRole": "substitution",
      "learnerDecision": "x全体に−1を代入する",
      "prerequisiteInteractionIds": [],
      "choices": [
        "4×(−1)−6",
        "4−1−6",
        "4×(−1−6)"
      ],
      "correctValue": "4×(−1)−6"
    },
    {
      "id": "qf01-n04-answer",
      "nodeId": "qf01-n04",
      "blankRole": "result",
      "learnerDecision": "代入した式を計算する",
      "prerequisiteInteractionIds": [
        "qf01-n03-answer"
      ],
      "choices": [
        "−10",
        "2",
        "10"
      ],
      "correctValue": "−10"
    }
  ],
  "planHash": "84cb53c1919462772ccfba4b54e7e0c65a3850f10a4fd11efb9e5383ed280001"
}
