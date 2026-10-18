import { n12CostDisplayLines } from './n12CostDisplay'

/**
 * Display-only row layout for approved staged math derivations.
 * Canonical answers, comparison signs and grading strings never change.
 */
export function textbookDisplayLines(itemId: string, value: string): string[] {
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
