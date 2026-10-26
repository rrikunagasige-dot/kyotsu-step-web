import { createContext } from 'react'

export const AxisPartAdvances = createContext<Record<string, number>>({})
/** Actual inline baselines, never glyph-box centres. An unavailable measurement
 * is explicit; consumers must not convert it to zero or a verified result. */
export type AxisMeasurement = { status: 'VERIFIED'; axisPx: number; baselineY: number; mathFontPx: number } | { status: 'UNVERIFIED'; reason: string }
export function measureMathAxis(probe: HTMLElement): AxisMeasurement {
  const marker = probe.querySelector<HTMLElement>('[data-axis-baseline]')
  const rule = probe.querySelector<HTMLElement>('.frac-line')
  const math = probe.querySelector<HTMLElement>('.katex')
  if (!marker || !rule || !math || !probe.isConnected) return { status: 'UNVERIFIED', reason: 'missing-axis-probe' }
  const baselineY = marker.getBoundingClientRect().top
  const rect = rule.getBoundingClientRect(), style = getComputedStyle(rule)
  const border = parseFloat(style.borderBottomWidth), mathFontPx = parseFloat(getComputedStyle(math).fontSize)
  const axisPx = baselineY - (rect.bottom - border / 2)
  if (![baselineY, rect.width, border, axisPx, mathFontPx].every(Number.isFinite) || rect.width <= 0 || border <= 0 || axisPx <= 0 || mathFontPx !== 18) return { status: 'UNVERIFIED', reason: 'invalid-axis-or-font' }
  return { status: 'VERIFIED', baselineY, axisPx, mathFontPx }
}

export function measureInlineBaseline(run: HTMLElement): number | null {
  const marker = run.querySelector<HTMLElement>(':scope > [data-axis-baseline]')
  if (!marker || !run.isConnected || run.getBoundingClientRect().width === 0) return null
  const y = marker.getBoundingClientRect().top
  return Number.isFinite(y) ? y : null
}

export function measureKatexStrutBaselines(run: HTMLElement): number[] | null {
  const struts = [...run.querySelectorAll<HTMLElement>('.katex-html > .base > .strut')]
  if (!struts.length) return null
  const values = struts.map(strut => {
    const align = getComputedStyle(strut).verticalAlign
    return strut.getBoundingClientRect().bottom + (align === 'baseline' ? 0 : parseFloat(align))
  })
  return values.every(Number.isFinite) ? values : null
}

export type FrameEnvelope = { leftPx: number; relationPx: number; rightPx: number; source: 'all-candidates-neutral-syntax'; id: string; partAdvances?: Record<string, number> }
export function validateFrameEnvelope(value: FrameEnvelope): boolean {
  return value.source === 'all-candidates-neutral-syntax' && value.id.length > 0 && [value.leftPx, value.relationPx, value.rightPx].every(n => Number.isFinite(n) && n >= 0) && value.relationPx > 0
}
