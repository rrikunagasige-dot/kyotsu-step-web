import { mathFractionDisplayValue } from './mathFractionDisplay'
import { neDevelopmentDisplayLines } from './neDevelopmentDisplay'
import { n12CostDisplayLines } from './n12CostDisplay'

/**
 * Display-only row layout for approved staged math derivations.
 * Canonical answers, comparison signs and grading strings never change.
 */
export function textbookDisplayLines(itemId: string, value: string): string[] {
  const developmentLines = neDevelopmentDisplayLines(itemId, value)
  if (developmentLines) return developmentLines.map(line => mathFractionDisplayValue(itemId, line))
  // P-004-R3: one specific long original-source choice, three independent facts.
  // Visual line breaks only; grading, stored answer and other items are unchanged.
  if (itemId === 'n07-09') return value.split(',\\;')
  // P-004-R4: three operation-and-result choices wrap only on presentation.
  if (['n11-13', 'n14-14', 'n14-15'].includes(itemId)) return value.split(',\\quad')
  // W-MATH-011/P-001: five proof decisions show sign/reason on separate rows.
  if (['n11-wm011-q02-compare', 'n11-wm011-q03-positive', 'n11-03',
    'n11-wm011-q03-zero', 'n11-wm011-q04-fraction'].includes(itemId)) return value.split(',\\quad')
  // P-004-R5: one cognitive operation plus one justified result per item.
  if (['n06-15', 'n08-10', 'n13-08'].includes(itemId)) return value.split(',\\quad')
  if (itemId === 'n09-08') {
    // Cover correct and distractor options, preserving the exact comparison operators.
    const match = /^1\.41\^2=(\d+\.\d+)([<>])2([<>])(\d+\.\d+)=1\.42\^2$/.exec(value)
    if (match) {
      const [, left, leftSign, rightSign, right] = match
      return [`1.41^2=${left}`, `${left}${leftSign}2${rightSign}${right}`, `${right}=1.42^2`]
    }
  }
  return n12CostDisplayLines(itemId, mathFractionDisplayValue(itemId, value))
}

