import { n12CostDisplayLines } from './n12CostDisplay'

/**
 * Display-only row layout for approved staged math derivations.
 * Canonical answers, comparison signs and grading strings never change.
 */
export function textbookDisplayLines(itemId: string, value: string): string[] {
  // P-004-R3: one specific long original-source choice, three independent facts.
  // Visual line breaks only; grading, stored answer and other items are unchanged.
  if (itemId === 'n07-09') return value.split(',\\;')
  // P-004-R4: three operation-and-result choices wrap only on presentation.
  if (['n11-13', 'n14-14', 'n14-15'].includes(itemId)) return value.split(',\\quad')
  if (itemId === 'n09-08') {
    // Cover correct and distractor options, preserving the exact comparison operators.
    const match = /^1\.41\^2=(\d+\.\d+)([<>])2([<>])(\d+\.\d+)=1\.42\^2$/.exec(value)
    if (match) {
      const [, left, leftSign, rightSign, right] = match
      return [`1.41^2=${left}`, `${left}${leftSign}2${rightSign}${right}`, `${right}=1.42^2`]
    }
  }
  return n12CostDisplayLines(itemId, value)
}
