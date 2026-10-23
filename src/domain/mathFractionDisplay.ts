/**
 * Scope: the four confirmed textbook items only. Protect a numeric denominator
 * from the legacy finite-set normalizer without changing the grading value.
 * mathord is an identity for these numerals; every TeX argument stays braced.
 */
export function mathFractionDisplayValue(itemId: string, value: string): string {
  if (!['n07-08', 'n10-16', 'ne02-10', 'ne02-12'].includes(itemId)) return value
  return value
    .replace(/\\frac([0-9])\{([0-9]+)\}/g, '\\frac{$1}{\\mathord{$2}}')
    .replace(/\}\{([0-9]+)\}/g, '}{\\mathord{$1}}')
}
