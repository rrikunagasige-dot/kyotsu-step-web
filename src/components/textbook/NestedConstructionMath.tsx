import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  bindNestedMathSlots, bindNestedRootRelation, compileNestedMathTemplate, renderClosedMath,
  type NestedMathPart, type NeutralEnvelope,
} from './nestedMathTemplate'
import './nested-construction-math.css'
import { registerNestedMathDOM, type NestedGroupAlignment } from './nestedMathGeometry'

export type NestedConstructionMathProps = {
  template: string
  parts: NestedMathPart[]
  values: Record<string, string>
  certifiedKeys: string[]
  editableKey: string | null
  onActivate: (key: string) => void
  id: string
  /** Only unresolved slots retain an all-candidate interaction reservation. */
  mode?: 'interactive' | 'readonly'
  groupAlignment?: NestedGroupAlignment
}
type Placement = { key: string; path: string; left: number; top: number; width: number; height: number; certified: boolean; value?: string }
const EMPTY_ENVELOPES: Record<string, NeutralEnvelope> = {}

export function NestedConstructionMath({ template, parts, values, certifiedKeys, editableKey, onActivate, id, mode = 'interactive', groupAlignment }: NestedConstructionMathProps) {
  const shell = useRef<HTMLDivElement>(null), formula = useRef<HTMLSpanElement>(null), probes = useRef<HTMLDivElement>(null)
  const [envelopes, setEnvelopes] = useState<Record<string, NeutralEnvelope>>(EMPTY_ENVELOPES)
  const [placements, setPlacements] = useState<Placement[]>([])
  const [measured, setMeasured] = useState(false)
  const [breakAtPaths, setBreakAtPaths] = useState<string[]>([])
  const [overflow, setOverflow] = useState(false)
  const [groupFormulaLeft, setGroupFormulaLeft] = useState<number>()
  const effectiveBreaks = groupAlignment?.breakAtPaths ?? breakAtPaths
  const compiled = useMemo(() => compileNestedMathTemplate({ template, parts, values, certifiedKeys, mode, envelopes, breakAtPaths: effectiveBreaks }), [template, parts, values, certifiedKeys, mode, envelopes, effectiveBreaks])
  const neutralChoices = useMemo(() => parts.flatMap(part => part.choices.map((choice, index) => ({ key: part.key, value: choice.value, index, html: renderClosedMath(choice.latex ?? choice.value) }))), [parts])
  const axisProbeHtml = useMemo(() => renderClosedMath('\\frac{1}{1}'), [])

  useLayoutEffect(() => {
    let disposed = false
    const measure = () => {
      if (disposed || !shell.current || !formula.current || !probes.current) return
      const next: Record<string, NeutralEnvelope> = {}
      let realMeasurements = true
      const axisRule = probes.current.querySelector<HTMLElement>('[data-nested-axis-probe] .frac-line'), axisZero = probes.current.querySelector<HTMLElement>('[data-axis-zero]')
      const ruleRect = axisRule?.getBoundingClientRect(), zeroRect = axisZero?.getBoundingClientRect()
      const axisPx = ruleRect && zeroRect ? zeroRect.top - ruleRect.top - ruleRect.height / 2 : 0
      if (!Number.isFinite(axisPx) || axisPx <= 0) realMeasurements = false
      const localFonts = new Map(bindNestedMathSlots(formula.current, compiled).map(slot => {
        const size = slot.element.parentElement ? parseFloat(getComputedStyle(slot.element.parentElement).fontSize) : 18
        return [slot.key, Number.isFinite(size) && size > 0 ? size : 18]
      }))
      for (const part of parts) {
        const candidates = [...probes.current.querySelectorAll<HTMLElement>('[data-neutral-part]')].filter(e => e.dataset.neutralPart === part.key)
        const widths: Record<string, number> = {}
        let width = 44.1, height = 44.1
        for (const candidate of candidates) {
          const math = candidate.querySelector<HTMLElement>('.katex-html'), rect = math?.getBoundingClientRect()
          if (!rect || rect.width <= 0 || rect.height <= 0 || ![rect.width, rect.height].every(Number.isFinite)) { realMeasurements = false; continue }
          const choice = part.choices[Number(candidate.dataset.neutralIndex)]
          widths[choice.value] = rect.width / 18
          width = Math.max(width, rect.width + 8); height = Math.max(height, rect.height + 8)
        }
        next[part.key] = { widthEm: width / 18, heightEm: height / 18, axisEm: (axisPx > 0 ? axisPx / 18 : .25) * (localFonts.get(part.key) ?? 18) / 18, choiceWidthsEm: widths }
      }
      if (JSON.stringify(next) !== JSON.stringify(envelopes)) { setEnvelopes(next); setMeasured(false); return }
      // Fonts and real DOM dimensions are required for geometry evidence.
      setMeasured(realMeasurements && Boolean(document.fonts && document.fonts.status === 'loaded'))
      const available = shell.current.getBoundingClientRect().width
      if (available > 0 && !groupAlignment) {
        const probeContainer = probes.current
        const unwrapped = compileNestedMathTemplate({ template, parts, values, certifiedKeys, mode, envelopes })
        const widthFor = (paths: string[]) => {
          const candidate = compileNestedMathTemplate({ template, parts, values, certifiedKeys, mode, envelopes, breakAtPaths: paths })
          const probe = document.createElement('span'); probe.className = 'nested-root-probe'; probe.innerHTML = candidate.html
          probeContainer.append(probe)
          const width = probe.getBoundingClientRect().width; probe.remove()
          return width > 0 ? width : Infinity
        }
        let best: string[] = [], bestWidth = widthFor([])
        // Greedily split only root relations/operations; never roots or fractions.
        for (let i = 0; bestWidth > available && i < unwrapped.semanticRootBreakPaths.length; i++) {
          let next = best, nextWidth = Infinity
          for (const path of unwrapped.semanticRootBreakPaths.filter(p => !best.includes(p))) {
            const paths = [...best, path], width = widthFor(paths)
            if (width < nextWidth) { next = paths; nextWidth = width }
          }
          best = next; bestWidth = nextWidth
        }
        setOverflow(Number.isFinite(bestWidth) && bestWidth > available)
        if (JSON.stringify(best) !== JSON.stringify(breakAtPaths)) { setBreakAtPaths(best); return }
      }
      const parentRect = shell.current.getBoundingClientRect()
      if (groupAlignment && available > 0) {
        const bounds = formula.current.getBoundingClientRect(), relation = bindNestedRootRelation(formula.current, compiled), r = relation?.getBoundingClientRect()
        const offset = r ? r.left + r.width / 2 - bounds.left : bounds.width / 2
        const body = shell.current.querySelector<HTMLElement>(':scope > .nested-group-body')?.getBoundingClientRect()
        if (!body) throw Error('NESTED_GROUP_BODY_UNVERIFIED')
        const target = (r ? groupAlignment.relationColumn : groupAlignment.bodyWidth / 2) - offset
        const actualLeft = body.left - parentRect.left + target
        setOverflow(body.width > available + 1 || actualLeft < -1 || actualLeft + bounds.width > available + 1)
        if (groupFormulaLeft === undefined || Math.abs(groupFormulaLeft - target) > .1) { setGroupFormulaLeft(target); setMeasured(false); return }
      }
      registerNestedMathDOM(shell.current, formula.current, compiled, groupAlignment)
      const slots = bindNestedMathSlots(formula.current, compiled).map(slot => {
        const rect = slot.element.getBoundingClientRect()
        return { key: slot.key, path: slot.path, left: rect.left - parentRect.left, top: rect.top - parentRect.top, width: Math.max(44, rect.width), height: Math.max(44, rect.height), certified: slot.certified, value: slot.value }
      })
      setPlacements(old => JSON.stringify(old) === JSON.stringify(slots) ? old : slots)
    }
    measure()
    const ready = document.fonts?.ready
    if (ready) void ready.then(measure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    if (shell.current) observer?.observe(shell.current)
    window.addEventListener('resize', measure)
    return () => { disposed = true; observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [template, parts, values, certifiedKeys, mode, envelopes, breakAtPaths, compiled, groupAlignment, groupFormulaLeft])

  return <div ref={shell} id={id} className={'nested-math-shell' + (groupAlignment ? ' nested-math-shell--group-aligned' : '')} data-nested-group-id={groupAlignment?.groupId} data-neutral-layout-key={groupAlignment?.neutralLayoutKey} data-nested-render-mode={mode} data-neutral-status={measured ? 'MEASURED' : 'UNVERIFIED'} data-layout-overflow={overflow ? 'true' : 'false'} data-root-break-path={effectiveBreaks.join(',')}>
    {groupAlignment ? <span className="nested-group-body" style={{ width: groupAlignment.bodyWidth }} data-group-body-layout-key={groupAlignment.neutralLayoutKey}>
      <span ref={formula} className="nested-math-formula" style={{ left: groupFormulaLeft ?? 0 }} data-compiled-template={template} dangerouslySetInnerHTML={{ __html: compiled.html }} />
    </span> : <span ref={formula} className="nested-math-formula" data-compiled-template={template} dangerouslySetInnerHTML={{ __html: compiled.html }} />}
    {mode === 'interactive' && placements.map(slot => {
      const part = parts.find(p => p.key === slot.key)!, editable = editableKey === slot.key && !slot.certified
      const style = { left: slot.left, top: slot.top, width: slot.width, height: slot.height }
      const state = slot.certified ? 'filled' : slot.value !== undefined ? 'wrong' : 'initial'
      return <button key={slot.key} type="button" className={'nested-slot-control' + (slot.value !== undefined ? ' nested-slot-control--candidate' : '')}
          style={style} disabled={!editable} aria-label={part.kind + 'の空欄' + (slot.value !== undefined ? '、選択値 ' + slot.value : '')}
          onClick={() => onActivate(slot.key)} data-part-key={slot.key}
          data-semantic-path={slot.path} data-slot-state={state} data-editable={editable ? 'true' : 'false'} />
    })}
    <div ref={probes} className="nested-neutral-probes" aria-hidden="true">
      {neutralChoices.map(choice => <span key={choice.key + ':' + choice.index} data-neutral-part={choice.key} data-neutral-index={choice.index} className="nested-neutral-choice" dangerouslySetInnerHTML={{ __html: choice.html }} />)}
      <span data-nested-axis-probe style={{ display: 'inline-block', fontSize: 18, lineHeight: 'normal' }}><span dangerouslySetInnerHTML={{ __html: axisProbeHtml }} /><i data-axis-zero style={{ display: 'inline-block', width: 0, height: 0, verticalAlign: 'baseline' }} /></span>
    </div>
  </div>
}

export default NestedConstructionMath
