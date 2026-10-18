/**
 * W-MATH-008/P-001: split only the two long N12 cost-model answers for
 * presentation. The canonical answer and scoring strings stay unchanged.
 * Every fragment is independent valid KaTeX (never split a TeX command).
 */
export function n12CostDisplayLines(itemId: string, value: string): string[] {
  if (itemId === 'n12-10' || itemId === 'n12-11') {
    const breakAt = value.lastIndexOf('+130(')
    if (breakAt > 0) {
      return [value.slice(0, breakAt), value.slice(breakAt)]
    }
  }
  if (itemId === 'n12-15') {
    const breakAt = value.indexOf(',\\ ')
    if (breakAt > 0) return [value.slice(0, breakAt), value.slice(breakAt + 3)]
  }
  return [value]
}
