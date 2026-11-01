import { bindNestedMathSlots, bindNestedRootRelation, compileNeutralNestedMathTemplate, renderClosedMath, type CompiledNestedMath, type NestedMathPart, type NeutralEnvelope } from './nestedMathTemplate'
type Rect = { x: number; y: number; width: number; height: number }
export type NestedGroupAlignment = { groupId: string; bodyWidth: number; relationColumn: number; neutralLayoutKey: string; breakAtPaths: string[] }
const sources = new WeakMap<HTMLElement, { formula: HTMLElement; compiled: CompiledNestedMath; group?: NestedGroupAlignment }>()
export function registerNestedMathDOM(shell: HTMLElement, formula: HTMLElement, compiled: CompiledNestedMath, group?: NestedGroupAlignment) {
  if (compiled.measurementOnly) throw Error('NESTED_NEUTRAL_PROBE_IS_NOT_LEARNER_EVIDENCE')
  sources.set(shell, { formula, compiled, group })
}
const rect = (e: Element): Rect => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }
const intersects = (a: Rect, b: Rect) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > .5 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > .5

/** Actual DOM, revalidated against the shared compiler. Own candidate lines are
 * identified by a compiler-inserted marker, never by generic DOM ancestry. */
export function measureNestedMathDOM(shell: HTMLElement) {
  const source = sources.get(shell)
  if (!source || shell.dataset.neutralStatus !== 'MEASURED') throw Error('NESTED_GEOMETRY_SOURCE_UNVERIFIED')
  const { formula, compiled, group } = source, bound = bindNestedMathSlots(formula, compiled)
  const probe = document.createElement('span'); probe.className = 'nested-axis-probe'
  probe.style.cssText = 'display:inline-block;font-size:18px;line-height:normal'
  probe.innerHTML = renderClosedMath('\\frac{1}{1}') + '<i style="display:inline-block;width:0;height:0;vertical-align:baseline"></i>'
  const probeParent = shell.querySelector('.nested-neutral-probes')
  if (!probeParent) throw Error('NESTED_AXIS_PROBE_PARENT')
  probeParent.append(probe)
  const axisLine = probe.querySelector('.katex-html .frac-line'), zero = probe.querySelector('i')
  if (!axisLine || !zero) throw Error('NESTED_AXIS_PROBE_UNAVAILABLE')
  const axisRect = rect(axisLine), axisPx = rect(zero).y - axisRect.y - axisRect.height / 2
  probe.remove()
  if (!Number.isFinite(axisPx) || axisPx <= 0 || axisPx > 18) throw Error('NESTED_AXIS_PROBE_UNVERIFIED')
  const slots = bound.map(s => {
    const control = [...shell.querySelectorAll<HTMLElement>('[data-semantic-path]')].find(e => e.dataset.semanticPath === s.path)
    if (!control) throw Error('NESTED_GEOMETRY_CONTROL_MISSING')
    let candidate: Element | undefined
    if (s.candidateMarker) {
      const marker = [...formula.querySelectorAll('.nested-slot-marker')].find(e => e.textContent === s.candidateMarker)
      const markerLap = marker?.closest('.rlap')
      candidate = markerLap?.parentElement?.closest('.rlap') ?? undefined
      if (!candidate) throw Error('NESTED_CANDIDATE_OWNER_UNVERIFIED')
    }
    const marker = s.element.parentElement?.querySelector(':scope > .nested-zero-baseline')
    if (!marker?.parentElement) throw Error('NESTED_SLOT_BASELINE_UNVERIFIED')
    const baseline = rect(marker).y, fontPx = parseFloat(getComputedStyle(marker.parentElement).fontSize), bounds = rect(control)
    return { id: s.key, path: s.path, candidate, value: s.value, rect: bounds, rule: rect(s.element), baseline, localFontPx: fontPx, axisDeltaPx: bounds.y + bounds.height / 2 - (baseline - axisPx * fontPx / 18) }
  })
  const collisions: { slot: string; line: number; kind: string }[] = []
  const lines = [...formula.querySelectorAll('.katex-html .frac-line, .katex-html svg')].map((element, index) => {
    const owner = slots.find(s => s.candidate?.contains(element)), kind = element.tagName.toLowerCase() === 'svg' ? 'structural-svg' : 'fraction-rule'
    let box = rect(element)
    let alpha: Uint8ClampedArray | undefined, rasterWidth = 0
    if (kind === 'structural-svg') {
      // KaTeX's long radical SVG is clipped by hide-tail. Rasterize only that
      // actual visible region, using SVG path coordinates and their real CTM.
      const clip = element.closest('.hide-tail')
      if (clip) { const c = rect(clip), right = Math.min(box.x + box.width, c.x + c.width), bottom = Math.min(box.y + box.height, c.y + c.height); box = { x: Math.max(box.x, c.x), y: Math.max(box.y, c.y), width: right - Math.max(box.x, c.x), height: bottom - Math.max(box.y, c.y) } }
      if (![box.x, box.y, box.width, box.height].every(Number.isFinite) || box.width <= 0 || box.height <= 0 || box.width > 4096 || box.height > 2048) throw Error('NESTED_SVG_CLIP_UNVERIFIED')
      const canvas = document.createElement('canvas'); canvas.width = Math.ceil(box.width); canvas.height = Math.ceil(box.height); rasterWidth = canvas.width
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx || typeof Path2D === 'undefined') throw Error('NESTED_SVG_RASTER_UNAVAILABLE')
      for (const path of element.querySelectorAll('path')) {
        const matrix = path.getScreenCTM(), data = path.getAttribute('d')
        if (!matrix || !data) throw Error('NESTED_SVG_PATH_UNVERIFIED')
        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e - box.x, matrix.f - box.y)
        ctx.fill(new Path2D(data))
      }
      alpha = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    }
    const inkOverlaps: string[] = []
    for (const slot of slots) {
      if (!intersects(box, slot.rect)) continue
      let collision = kind === 'fraction-rule'
      if (alpha) {
        const left = Math.max(0, Math.ceil(slot.rect.x - box.x + .5)), top = Math.max(0, Math.ceil(slot.rect.y - box.y + .5)), right = Math.min(rasterWidth, Math.floor(slot.rect.x + slot.rect.width - box.x - .5)), bottom = Math.min(Math.ceil(box.height), Math.floor(slot.rect.y + slot.rect.height - box.y - .5))
        for (let y = top; y < bottom && !collision; y++) for (let x = left; x < right; x++) if (alpha[(y * rasterWidth + x) * 4 + 3] > 64) { collision = true; break }
      }
      if (collision) { inkOverlaps.push(slot.id); if (owner?.id !== slot.id) collisions.push({ slot: slot.id, line: index, kind }) }
    }
    return { kind, rect: box, inkOverlaps, ownerPartId: owner?.id ?? null, ownerSemanticPath: owner?.path ?? null, ownerProof: owner ? 'compiler-candidate-marker' : 'template-structure', rasterized: kind === 'structural-svg' }
  })
  const glyphs = []
  const glyphCanvas = document.createElement('canvas'), ctx = glyphCanvas.getContext('2d')
  if (!ctx) throw Error('NESTED_GLYPH_METRICS_UNAVAILABLE')
  const tree = document.createTreeWalker(formula.querySelector('.katex-html')!, NodeFilter.SHOW_TEXT)
  for (let text = tree.nextNode(); text; text = tree.nextNode()) {
    const parent = text.parentElement, value = text.textContent ?? ''
    if (!parent || !value.trim() || parent.closest('.nested-slot-marker, .nested-zero-baseline')) continue
    const style = getComputedStyle(parent)
    if (style.visibility === 'hidden' || style.color === 'transparent' || style.color === 'rgba(0, 0, 0, 0)' || parseFloat(style.fontSize) <= 0) continue
    const range = document.createRange(); range.selectNodeContents(text)
    const origin = range.getBoundingClientRect(), marker = document.createElement('i')
    marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'
    let baseline: number
    parent.append(marker)
    try { baseline = marker.getBoundingClientRect().top } finally { marker.remove() }
    ctx.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ')
    const metrics = ctx.measureText(value)
    const ink = { x: origin.x - metrics.actualBoundingBoxLeft, y: baseline - metrics.actualBoundingBoxAscent, width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent }
    if (![ink.x, ink.y, ink.width, ink.height].every(Number.isFinite)) throw Error('NESTED_GLYPH_INK_UNVERIFIED')
    if (!ink.width || !ink.height) continue
    const owner = slots.find(s => s.candidate?.contains(parent)), inkOverlaps = slots.filter(s => intersects(ink, s.rect)).map(s => s.id)
    for (const id of inkOverlaps) if (id !== owner?.id) collisions.push({ slot: id, line: lines.length + glyphs.length, kind: 'font-glyph-ink' })
    glyphs.push({ kind: 'font-glyph-ink', rect: ink, inkOverlaps, ownerPartId: owner?.id ?? null, ownerSemanticPath: owner?.path ?? null, ownerProof: owner ? 'compiler-candidate-marker' : 'template-structure', baseline, font: ctx.font })
  }
  const axisFailures = slots.filter(s => !Number.isFinite(s.axisDeltaPx) || Math.abs(s.axisDeltaPx) > 1).map(s => ({ slot: s.id, delta: s.axisDeltaPx }))
  // Temporary zero markers have been removed; collection cannot conceal a DOM swap.
  bindNestedMathSlots(formula, compiled)
  const relation = bindNestedRootRelation(formula, compiled), frame = rect(formula), available = rect(shell)
  const relationX = relation ? rect(relation).x + rect(relation).width / 2 : frame.x + frame.width / 2
  const body = group ? shell.querySelector<HTMLElement>(':scope > .nested-group-body') : undefined
  if (group && (!body || body.dataset.groupBodyLayoutKey !== group.neutralLayoutKey)) throw Error('NESTED_GROUP_BODY_UNVERIFIED')
  const bodyRect = body ? rect(body) : undefined
  const groupAlignment = group && bodyRect ? { groupId: group.groupId, bodyLeft: bodyRect.x, bodyWidth: bodyRect.width, availableWidth: available.width, relationX, rowRelationOffset: relationX - frame.x, rowLeftExtent: relationX - frame.x, rowRightExtent: frame.x + frame.width - relationX, neutralLayoutKey: group.neutralLayoutKey, status: relation ? 'ALIGNED' as const : 'NO_ROOT_RELATION' as const } : undefined
  const rootRelationProof = relation ? { semanticPath: compiled.rootRelation!.path, marker: compiled.rootRelation!.marker, source: 'shared-compiler-marker-dom-revalidated', rect: rect(relation) } : { source: 'shared-compiler-ast', status: 'NO_ROOT_RELATION' }
  return { schemaVersion: 'nested-geometry/1', status: collisions.length || axisFailures.length ? 'FAIL' : 'PASS', source: 'shared-compiler-dom-revalidated', axisPx, axisSource: 'same-font-fraction-rule', baselineSource: 'zero-inline-dom-marker', slots: slots.map(s => ({ id: s.id, path: s.path, value: s.value, rect: s.rect, rule: s.rule, baseline: s.baseline, localFontPx: s.localFontPx, axisDeltaPx: s.axisDeltaPx })), lines: [...lines, ...glyphs], collisions, axisFailures, frame, available, ...(groupAlignment ? { groupAlignment } : {}), rootRelationProof }
}

export type NeutralNestedGroupRow = { id: string; template: string; parts: NestedMathPart[] }
export type NeutralNestedGroupPlan = { groupId: string; bodyWidth: number; relationColumn: number; availableWidth: number; neutralLayoutKey: string; overflow: boolean; rows: { id: string; breakAtPaths: string[]; left: number; right: number; width: number; hasRelation: boolean }[] }

/** Temporary offscreen probes contain only approved syntax and all-candidate
 * envelopes. They are removed synchronously, and never certify a future result. */
export function measureNeutralNestedGroup(groupId: string, rows: NeutralNestedGroupRow[], host: HTMLElement, availableWidth: number): NeutralNestedGroupPlan {
  if (!Number.isFinite(availableWidth) || availableWidth <= 0) throw Error('NESTED_GROUP_WIDTH_UNVERIFIED')
  const probes = document.createElement('div')
  probes.className = 'nested-neutral-probes'; probes.setAttribute('aria-hidden', 'true'); host.append(probes)
  try {
    const axisProbe = document.createElement('span'); axisProbe.style.cssText = 'display:inline-block;font-size:18px;line-height:normal'
    axisProbe.innerHTML = renderClosedMath('\\frac{1}{1}') + '<i style="display:inline-block;width:0;height:0;vertical-align:baseline"></i>'; probes.append(axisProbe)
    const fraction = axisProbe.querySelector<HTMLElement>('.katex-html .frac-line'), zero = axisProbe.querySelector('i')
    if (!fraction || !zero) throw Error('NESTED_GROUP_AXIS_UNVERIFIED')
    const axisPx = zero.getBoundingClientRect().top - fraction.getBoundingClientRect().top - fraction.getBoundingClientRect().height / 2
    axisProbe.remove()
    if (!Number.isFinite(axisPx) || axisPx <= 0) throw Error('NESTED_GROUP_AXIS_UNVERIFIED')
    const envelopes = rows.map(row => {
      const result: Record<string, NeutralEnvelope> = {}
      for (const part of row.parts) {
        let width = 44.1, height = 44.1
        for (const choice of part.choices) {
          const candidate = document.createElement('span'); candidate.className = 'nested-neutral-choice'; candidate.innerHTML = renderClosedMath(choice.latex ?? choice.value); probes.append(candidate)
          const math = candidate.querySelector<HTMLElement>('.katex-html')?.getBoundingClientRect(); candidate.remove()
          if (!math || math.width <= 0 || math.height <= 0) throw Error('NESTED_GROUP_CANDIDATE_UNMEASURED')
          width = Math.max(width, math.width + 8); height = Math.max(height, math.height + 8)
        }
        result[part.key] = { widthEm: width / 18, heightEm: height / 18, axisEm: axisPx / 18 }
      }
      const compiled = compileNeutralNestedMathTemplate({ template: row.template, parts: row.parts, envelopes: result })
      const probe = document.createElement('span'); probe.className = 'nested-root-probe'; probe.innerHTML = compiled.html; probes.append(probe)
      for (const slot of bindNestedMathSlots(probe, compiled)) {
        const size = slot.element.parentElement ? parseFloat(getComputedStyle(slot.element.parentElement).fontSize) : 18
        if (!Number.isFinite(size) || size <= 0) throw Error('NESTED_GROUP_LOCAL_FONT_UNVERIFIED')
        result[slot.key] = { ...result[slot.sourceKey ?? slot.key], axisEm: axisPx / 18 * size / 18 }
      }
      probe.remove(); return result
    })
    const options = rows.map((row, index) => ({ template: row.template, parts: row.parts, envelopes: envelopes[index] }))
    const paths = options.map(option => compileNeutralNestedMathTemplate(option).semanticRootBreakPaths)
    const cache = new Map<string, { left: number; right: number; width: number; hasRelation: boolean }>()
    function measure(index: number, breaks: string[]) {
      const key = index + ':' + [...breaks].sort().join(',')
      const cached = cache.get(key); if (cached) return cached
      const compiled = compileNeutralNestedMathTemplate({ ...options[index], breakAtPaths: breaks })
      const probe = document.createElement('span'); probe.className = 'nested-root-probe'; probe.innerHTML = compiled.html; probes.append(probe)
      const bounds = probe.getBoundingClientRect(), relation = bindNestedRootRelation(probe, compiled)
      const relationBox = relation?.getBoundingClientRect(), x = relationBox ? relationBox.left + relationBox.width / 2 - bounds.left : bounds.width / 2
      if (!(bounds.width > 0) || !Number.isFinite(x)) throw Error('NESTED_GROUP_ROW_UNMEASURED')
      const result = { left: x, right: bounds.width - x, width: bounds.width, hasRelation: Boolean(relation) }
      probe.remove(); cache.set(key, result); return result
    }
    const dimensions = (breaks: string[][]) => {
      const measured = rows.map((_, index) => measure(index, breaks[index]))
      const left = Math.max(0, ...measured.filter(r => r.hasRelation).map(r => r.left)), right = Math.max(0, ...measured.filter(r => r.hasRelation).map(r => r.right))
      const width = Math.max(left + right, 0, ...measured.filter(r => !r.hasRelation).map(r => r.width))
      return { measured, width, column: left + (width - left - right) / 2 }
    }
    let breaks = rows.map(() => [] as string[]), size = dimensions(breaks)
    for (let step = 0; size.width > availableWidth + .25 && step < paths.flat().length; step++) {
      let best: { breaks: string[][]; size: ReturnType<typeof dimensions> } | undefined
      for (let index = 0; index < rows.length; index++) for (const path of paths[index].filter(path => !breaks[index].includes(path))) {
        const candidate = breaks.map((existing, row) => row === index ? [...existing, path] : existing)
        const next = dimensions(candidate)
        if (!best || next.width < best.size.width) best = { breaks: candidate, size: next }
      }
      if (!best) break
      breaks = best.breaks; size = best.size
    }
    const signature = JSON.stringify({ groupId, availableWidth, rows, envelopes, breaks, width: size.width, column: size.column })
    let key = 2166136261; for (const c of signature) key = Math.imul(key ^ c.charCodeAt(0), 16777619) >>> 0
    return { groupId, availableWidth, bodyWidth: size.width, relationColumn: size.column, neutralLayoutKey: 'neutral-group-' + key.toString(16).padStart(8, '0'), overflow: size.width > availableWidth + 1, rows: rows.map((row, index) => ({ id: row.id, breakAtPaths: breaks[index], ...size.measured[index] })) }
  } finally { probes.remove() }
}
