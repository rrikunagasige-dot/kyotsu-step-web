// Generated from W035/P-001; canonical choice keys are never changed.
const policies = {
  "n09-08": {
    "kind": "independent-facts",
    "order": [
      "left-square",
      "right-square",
      "comparison"
    ],
    "choices": {
      "1.41^2=1.9881<2<2.0164=1.42^2": [
        "1.41^2=1.9881",
        "1.42^2=2.0164",
        "1.9881<2<2.0164"
      ],
      "1.41^2=1.9981<2<2.0164=1.42^2": [
        "1.41^2=1.9981",
        "1.42^2=2.0164",
        "1.9981<2<2.0164"
      ],
      "1.41^2=1.9881<2<2.0104=1.42^2": [
        "1.41^2=1.9881",
        "1.42^2=2.0104",
        "1.9881<2<2.0104"
      ],
      "1.41^2=1.9881<2>2.0164=1.42^2": [
        "1.41^2=1.9881",
        "1.42^2=2.0164",
        "1.9881<2>2.0164"
      ]
    },
    "applyTo": [
      "options",
      "completed",
      "prior-results",
      "history"
    ],
    "relationAnchor": "first-relation-each-row"
  },
  "n10-07": {
    "kind": "complete-equality",
    "choices": {
      "\\sqrt{48}=\\sqrt{16\\cdot3}": [
        "\\sqrt{48}=\\sqrt{16\\cdot3}"
      ],
      "\\sqrt{14}": [
        "\\sqrt{48}=\\sqrt{14}"
      ],
      "\\sqrt{48}=\\sqrt{8\\cdot8}": [
        "\\sqrt{48}=\\sqrt{8\\cdot8}"
      ],
      "\\sqrt{48}=\\sqrt{16\\cdot2}": [
        "\\sqrt{48}=\\sqrt{16\\cdot2}"
      ]
    },
    "applyTo": [
      "options"
    ]
  },
  "n10-15": {
    "kind": "operation-then-result",
    "applyTo": [
      "options"
    ],
    "choices": {
      "\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt3}{\\sqrt3}=\\frac{\\sqrt3}{2(\\sqrt3)^2}": [
        "\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt3}{\\sqrt3}",
        "\\frac{\\sqrt3}{2(\\sqrt3)^2}"
      ],
      "\\frac1{2\\sqrt3}\\cdot\\sqrt3": [
        "\\frac1{2\\sqrt3}\\cdot\\sqrt3",
        "\\frac12"
      ],
      "\\frac1{2\\sqrt3}\\cdot\\frac3{\\sqrt3}": [
        "\\frac1{2\\sqrt3}\\cdot\\frac3{\\sqrt3}",
        "\\frac12"
      ],
      "\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt2}{\\sqrt2}": [
        "\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt2}{\\sqrt2}",
        "\\frac{\\sqrt2}{2\\sqrt6}"
      ]
    },
    "rowRelations": [
      "",
      "="
    ],
    "note": "The second row is the actual value of that candidate; never replace wrong factors by correct factors."
  },
  "n10-20": {
    "kind": "operation-then-result",
    "applyTo": [
      "options"
    ],
    "choices": {
      "\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)(2-\\sqrt3)}=\\frac{(2-\\sqrt3)^2}{4-3}": [
        "\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)(2-\\sqrt3)}",
        "\\frac{(2-\\sqrt3)^2}{4-3}"
      ],
      "\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)^2}": [
        "\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)^2}",
        "\\frac{(2-\\sqrt3)^2}{7+4\\sqrt3}"
      ],
      "\\frac{2-\\sqrt3}{2+\\sqrt3}\\cdot\\frac{2+\\sqrt3}{2+\\sqrt3}": [
        "\\frac{2-\\sqrt3}{2+\\sqrt3}\\cdot\\frac{2+\\sqrt3}{2+\\sqrt3}",
        "\\frac{1}{(2+\\sqrt3)^2}"
      ],
      "\\frac{(2-\\sqrt3)^2}{4+3}": [
        "\\frac{(2-\\sqrt3)^2}{4+3}",
        "\\frac{(2-\\sqrt3)^2}{7}"
      ]
    },
    "rowRelations": [
      "",
      "="
    ]
  }
} as const
export type GuidedDisplayStep = { role: string; math: string }
export function guidedMathDisplaySteps(itemId: string, value: string, surface: 'option' | 'completed'): GuidedDisplayStep[] | undefined {
 const policy = (policies as unknown as Record<string, { kind: string; applyTo: readonly string[]; order?: readonly string[]; choices: Record<string, readonly string[]> }>)[itemId]
 if (!policy || !policy.applyTo.includes(surface === 'option' ? 'options' : surface)) return undefined
 const rows = policy.choices[value]
 return rows?.map((math, i) => ({ role: policy.order?.[i] ?? (policy.kind === 'operation-then-result' ? (i ? 'result' : 'operation') : 'equation'), math: i && policy.kind === 'operation-then-result' ? '=' + math : math }))
}
