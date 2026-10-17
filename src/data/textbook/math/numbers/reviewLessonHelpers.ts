// Shared authoring primitives for the three approved W-MATH-003 review pilots.
// Source-to-item IDs and answers belong to the authoring layer, not learner copy.
export const T = (text: string) => ({ type: 'text' as const, text })
export const M = (latex: string) => ({ type: 'math' as const, latex })
export const C = (itemId: string) => ({ type: 'choice' as const, itemId })
export const K = (text: string) => ({ type: 'term' as const, text })

type Purpose = 'concept-formation' | 'representation-link' | 'transfer' | 'causal-reasoning'
type Level = 'strong' | 'medium' | 'light'
type Kind = 'formula' | 'text'

export function reviewItem(
  id: string, prompt: string, answer: string, answerType: Kind,
  distractors: [string, string, ...string[]], purpose: Purpose, scaffoldLevel: Level,
  hints: string[] = [],
) {
  return {
    id, label: id.toUpperCase(), prompt, answer, acceptedAnswers: [], answerType,
    choices: [answer, ...distractors], purpose, scaffoldLevel, hints,
  }
}

export function oneToOneSourceMap(prefix: 'N03' | 'N10' | 'N12', count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const n = String(index + 1).padStart(2, '0')
      return [prefix + '-Q' + n, [prefix.toLowerCase() + '-' + n]]
    }),
  ) as Record<string, string[]>
}