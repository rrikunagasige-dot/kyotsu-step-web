import raw from './qf01Unit.json'
import presentation from './qf01Presentation.json'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'

export const mathQuadraticQF01Unit = validateTextbookUnits([raw])[0]
export const qf01GuidedPresentation = presentation

/** P011: view-only pilot; original learning IDs, grading and JSON remain unchanged. */
export const qf01TransformationPresentation = {
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
