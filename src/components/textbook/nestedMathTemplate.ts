import katex from 'katex'

/** Closed display grammar. It is not a TeX evaluator or a mathematical prover. */
export type MathTemplateNode =
  | { type: 'sequence'; children: MathTemplateNode[] }
  | { type: 'group'; open: string; close: string; body: MathTemplateNode }
  | { type: 'sqrt'; body: MathTemplateNode }
  | { type: 'fraction'; numerator: MathTemplateNode; denominator: MathTemplateNode }
  | { type: 'cases'; rows: MathTemplateNode[][] }
  | { type: 'power' | 'subscript'; base: MathTemplateNode; argument: MathTemplateNode }
  | { type: 'slot' | 'mirror'; key: string }
  | { type: 'symbol'; value: string; relation?: boolean; operation?: boolean }
  | { type: 'text'; value: string; command: 'text' | 'mathrm' | 'mathbb' | 'operatorname' }
export type MathTemplateAST = Extract<MathTemplateNode, { type: 'sequence' }>
export type NestedMathChoice = { value: string; latex?: string; kind?: string }
export type NestedMathPart = { key: string; kind: string; role?: string; choices: NestedMathChoice[] }
export type NeutralEnvelope = { widthEm: number; heightEm: number; axisEm?: number; choiceWidthsEm?: Record<string, number> }
export type NestedMathSlot = { key: string; sourceKey?: string; path: string; marker: string; candidateMarker?: string; value?: string; certified: boolean; envelope: NeutralEnvelope }
export type ResolvedNestedPart = { key: string; path: string; value: string; source: 'slot' | 'mirror' }
export type CompiledNestedMath = { resolvedParts: ResolvedNestedPart[]; ast: MathTemplateAST; latex: string; html: string; slots: NestedMathSlot[]; rootBreakPaths: string[]; semanticRootBreakPaths: string[]; rootRelation?: { path: string; marker: string; kind: 'symbol' | 'slot' | 'mirror'; partKey?: string }; measurementOnly: boolean; mode: 'interactive' | 'readonly' }
export type CompileNestedMathOptions = {
  template: string; parts: NestedMathPart[]; values?: Record<string, string>; certifiedKeys?: string[]
  mode?: 'interactive' | 'readonly'; envelopes?: Record<string, NeutralEnvelope>; breakAtPath?: string; breakAtPaths?: string[]
  /** Internal, non-learner probe: mirrors reserve all-candidate space without claiming a result. */
  neutralReferences?: boolean
}
export const NESTED_KATEX_OPTIONS = Object.freeze({ trust: false, strict: 'error' as const, throwOnError: true, output: 'htmlAndMathml' as const })
const relations = new Set(['=', '<', '>', '\\le', '\\leq', '\\ge', '\\geq', '\\ne', '\\neq', '\\Rightarrow', '\\Leftrightarrow', '\\iff', '\\in', '\\notin', '\\subset', '\\subseteq'])
const commands = new Set([...relations, '\\times', '\\cdot', '\\div', '\\pm', '\\mp', '\\pi', '\\infty', '\\alpha', '\\beta', '\\theta', '\\lambda', '\\Delta', '\\,', '\\;', '\\!', '\\ ', '\\quad', '\\qquad', '\\lvert', '\\rvert', '\\vert'])
const unicode: Record<string, string> = { '−': '-', '×': '\\times', '÷': '\\div', '≤': '\\leq', '≥': '\\geq', '≠': '\\ne', 'π': '\\pi', '⇒': '\\Rightarrow', '⇔': '\\Leftrightarrow', '∞': '\\infty' }
const fail = (s: string): never => { throw new Error('NESTED_MATH: ' + s) }

export function parseNestedMathTemplate(source: string, knownPartKeys: readonly string[] = []): MathTemplateAST {
  if (typeof source !== 'string' || !source.trim() || source.length > 10000) fail('INVALID_TEMPLATE')
  let offset = 0, nodes = 0
  const count = <T extends MathTemplateNode>(node: T): T => { if (++nodes > 2048) fail('NODE_LIMIT'); return node }
  function space() { while (/\s/.test(source[offset] ?? '') && offset < source.length) offset++ }
  function argument(depth: number): MathTemplateNode {
    space()
    if (source[offset] === '{') {
      const placeholder = /^\{(mirror:)?([A-Za-z][A-Za-z0-9_.-]*)\}/.exec(source.slice(offset))
      if (placeholder && knownPartKeys.includes(placeholder[2])) { offset += placeholder[0].length; return count({ type: placeholder[1] ? 'mirror' : 'slot', key: placeholder[2] }) }
      offset++; const body = sequence('}', depth + 1); return body
    }
    return atom(depth + 1)
  }
  function atom(depth: number): MathTemplateNode {
    if (depth > 32) fail('DEPTH_LIMIT')
    space(); const c = source[offset]
    if (!c) return fail('MISSING_ARGUMENT')
    if (c === '{') {
      const token = /^\{(mirror:)?([A-Za-z][A-Za-z0-9_.-]*)\}/.exec(source.slice(offset))
      if (token) { offset += token[0].length; return count({ type: token[1] ? 'mirror' : 'slot', key: token[2] }) }
      offset++; return count({ type: 'group', open: '{', close: '}', body: sequence('}', depth + 1) })
    }
    if (c === '(' || c === '[') { offset++; return count({ type: 'group', open: c, close: c === '(' ? ')' : ']', body: sequence(c === '(' ? ')' : ']', depth + 1) }) }
    if (c === '|') { offset++; return count({ type: 'group', open: '|', close: '|', body: sequence('|', depth + 1) }) }
    if (c === '\\') {
      const match = /^\\(?:[A-Za-z]+|[,;! ])/.exec(source.slice(offset)); if (!match) return fail('UNSUPPORTED_ESCAPE')
      offset += match[0].length; const command = match[0]
      if (command === '\\sqrt') return count({ type: 'sqrt', body: argument(depth) })
      if (['\\frac', '\\dfrac', '\\tfrac'].includes(command)) return count({ type: 'fraction', numerator: argument(depth), denominator: argument(depth) })
      if (command === '\\begin') {
        if (!source.startsWith('{cases}', offset)) return fail('UNSUPPORTED_ENVIRONMENT')
        offset += '{cases}'.length; const end = source.indexOf('\\end{cases}', offset)
        if (end < 0) return fail('UNCLOSED_CASES')
        const body = source.slice(offset, end); if (body.includes('\\begin')) return fail('NESTED_ENVIRONMENT')
        const rows = body.split('\\\\').map(row => row.split('&').map(cell => parseNestedMathTemplate(cell, knownPartKeys)))
        if (!rows.length || rows.length > 10 || rows.some(row => row.length !== 2)) return fail('CASES_SHAPE')
        offset = end + '\\end{cases}'.length; return count({ type: 'cases', rows })
      }
      if (command === '\\left' || command === '\\bigl') return atom(depth + 1)
      if (command === '\\right') return fail('UNMATCHED_RIGHT')
      if (command === '\\lvert' || command === '\\vert') return count({ type: 'group', open: command, close: command === '\\lvert' ? '\\rvert' : '\\vert', body: sequence(command === '\\lvert' ? '\\rvert' : '\\vert', depth + 1) })
      if (['\\text', '\\mathrm', '\\mathbb', '\\operatorname'].includes(command)) {
        space()
        if (source[offset] !== '{') {
          if (['\\mathbb', '\\mathrm'].includes(command) && /[A-Za-z0-9]/.test(source[offset] ?? '')) return count({ type: 'text', value: source[offset++], command: command.slice(1) as 'mathbb' })
          return fail('TEXT_GROUP_REQUIRED')
        }
        offset++
        const end = source.indexOf('}', offset); if (end < 0) return fail('UNCLOSED_TEXT')
        const value = source.slice(offset, end); if (!value || /[\\{}<>%$&#_^]/.test(value)) return fail('UNSAFE_TEXT')
        offset = end + 1; return count({ type: 'text', value, command: command.slice(1) as 'text' })
      }
      if (!commands.has(command)) return fail('UNSUPPORTED_COMMAND:' + command)
      return count({ type: 'symbol', value: command, relation: relations.has(command), operation: ['\\times', '\\cdot', '\\div'].includes(command) })
    }
    if (c === '√') { offset++; return count({ type: 'sqrt', body: argument(depth) }) }
    if (unicode[c]) { offset++; const value = unicode[c]; return count({ type: 'symbol', value, relation: relations.has(value), operation: ['-', '\\times', '\\div'].includes(value) }) }
    if (/[0-9]/.test(c)) { const match = /^(?:\d+(?:\.\d+)?)/.exec(source.slice(offset))!; offset += match[0].length; return count({ type: 'symbol', value: match[0] }) }
    if (/[A-Za-z]/.test(c) || '+-=<>.,:|/!'.includes(c)) { offset++; return count({ type: 'symbol', value: c, relation: relations.has(c), operation: ['+', '-'].includes(c) }) }
    return fail('UNSUPPORTED_CHARACTER:' + c)
  }
  function sequence(close: string | null, depth: number): MathTemplateAST {
    const children: MathTemplateNode[] = []
    while (offset < source.length) {
      space()
      if (close && (source.startsWith('\\right', offset) || source.startsWith('\\bigr', offset))) { offset += source.startsWith('\\right', offset) ? '\\right'.length : '\\bigr'.length; space() }
      if (close && source.startsWith(close, offset)) { offset += close.length; return count({ type: 'sequence', children }) }
      if (offset >= source.length) break
      if (source[offset] === '^' || source[offset] === '_') {
        const type = source[offset++] === '^' ? 'power' : 'subscript', base = children.pop(); if (!base) return fail('POWER_WITHOUT_BASE')
        children.push(count({ type, base, argument: argument(depth) })); continue
      }
      children.push(atom(depth))
    }
    if (close) return fail('UNCLOSED_GROUP')
    return count({ type: 'sequence', children })
  }
  return sequence(null, 0)
}

export function renderClosedMath(source: string): string {
  const ast = parseNestedMathTemplate(source)
  const emit = (n: MathTemplateNode): string => emitStatic(n, emit)
  return katex.renderToString(emit(ast), NESTED_KATEX_OPTIONS)
}
function emitStatic(n: MathTemplateNode, emit: (n: MathTemplateNode) => string): string {
  switch (n.type) {
    case 'sequence': return n.children.map(emit).join(' ')
    case 'symbol': return n.value
    case 'text': return '\\' + n.command + '{' + n.value + '}'
    case 'group': return n.open === '{' ? '{' + emit(n.body) + '}' : '\\left' + n.open + emit(n.body) + '\\right' + n.close
    case 'sqrt': return '\\sqrt{' + emit(n.body) + '}'
    case 'fraction': return '\\frac{' + emit(n.numerator) + '}{' + emit(n.denominator) + '}'
    case 'cases': return '\\begin{cases}' + n.rows.map(row => row.map(emit).join('&')).join('\\\\') + '\\end{cases}'
    case 'power': return '{' + emit(n.base) + '}^{' + emit(n.argument) + '}'
    case 'subscript': return '{' + emit(n.base) + '}_{' + emit(n.argument) + '}'
    default: return fail('UNRESOLVED_PLACEHOLDER')
  }
}
export function compileNestedMathTemplate(options: CompileNestedMathOptions): CompiledNestedMath {
  const ast = parseNestedMathTemplate(options.template, options.parts.map(p => p.key)), values = options.values ?? {}, certified = new Set(options.certifiedKeys ?? [])
  const mode = options.mode ?? 'interactive', parts = new Map<string, NestedMathPart>(), slots: NestedMathSlot[] = [], resolvedParts: ResolvedNestedPart[] = [], used = new Set<string>()
  for (const part of options.parts) {
    if (parts.has(part.key) || !part.choices.length || new Set(part.choices.map(c => c.value)).size !== part.choices.length) fail('INVALID_PART:' + part.key)
    for (const c of part.choices) renderClosedMath(c.latex ?? c.value)
    parts.set(part.key, part)
  }
  const isRelation = (node: MathTemplateNode) => node.type === 'symbol' ? Boolean(node.relation) : (node.type === 'slot' || node.type === 'mirror') && parts.get(node.key)?.role === 'relation'
  const rootBreakPaths = ast.children.flatMap((node, i) => i > 0 && (isRelation(node) || node.type === 'symbol' && node.operation) ? ['root/' + i] : [])
  const rootRelationIndex = ast.children.findIndex(isRelation), relationNode = ast.children[rootRelationIndex]
  // Automatic wrapping keeps a simple token subject with its first relation and
  // keeps inequality assertions intact. Manual structural breaks stay compatible.
  const implication = new Set(['\\Rightarrow', '\\Leftrightarrow', '\\iff'])
  const inequalities = new Set(['<', '>', '\\le', '\\leq', '\\ge', '\\geq'])
  const spacing = new Set(['\\ ', '\\,', '\\;', '\\!', '\\quad', '\\qquad'])
  const isSpacing = (node: MathTemplateNode) => node.type === 'symbol' && spacing.has(node.value)
  const hasInequality = ast.children.some(node => node.type === 'symbol' ? inequalities.has(node.value) :
    (node.type === 'slot' || node.type === 'mirror') && parts.get(node.key)?.role === 'relation' &&
      Boolean(parts.get(node.key)?.choices.some(choice => inequalities.has(choice.latex ?? choice.value))))
  const atomic = (node: MathTemplateNode) => node.type === 'symbol' && !node.operation && !node.relation && node.value !== ',' || node.type === 'slot' || node.type === 'mirror'
  const keepsSubject = (index: number) => {
    let start = index - 1
    while (start >= 0) {
      const node = ast.children[start]
      if (node.type === 'symbol' && (node.value === ',' || implication.has(node.value))) break
      start--
    }
    const lhs = ast.children.slice(start + 1, index).filter(node => !isSpacing(node))
    return lhs.length === 1 && atomic(lhs[0]) || lhs.length === 2 && lhs[0].type === 'symbol' && ['+', '-'].includes(lhs[0].value) && atomic(lhs[1])
  }
  const relationCount = ast.children.filter(isRelation).length
  const isComma = (node: MathTemplateNode) => node.type === 'symbol' && node.value === ','
  const completeAssertion = (nodes: MathTemplateNode[]) => {
    const terms = nodes.filter(node => !isSpacing(node)), relation = terms.findIndex(isRelation)
    return relation > 0 && relation < terms.length - 1
  }
  const commaBreaks = ast.children.flatMap((node, i) => {
    if (!isComma(node)) return []
    let start = i - 1, end = i + 1
    while (start >= 0 && !isComma(ast.children[start])) start--
    while (end < ast.children.length && !isComma(ast.children[end])) end++
    return completeAssertion(ast.children.slice(start + 1, i)) && completeAssertion(ast.children.slice(i + 1, end)) ? ['root/' + (i + 1)] : []
  })
  const semanticRootBreakPaths = [...new Set([...rootBreakPaths, ...commaBreaks])].filter(path => {
    const i = Number(path.split('/')[1]), node = ast.children[i]
    if (commaBreaks.includes(path)) return true
    if (node.type === 'symbol' && implication.has(node.value)) return true
    if (hasInequality) return node.type === 'symbol' && node.value === '=' && i !== rootRelationIndex && !keepsSubject(i)
    if (isRelation(node)) return !keepsSubject(i)
    if (relationCount > 1 || rootRelationIndex >= 0 && i < rootRelationIndex) return false
    let before = i - 1
    while (before >= 0 && isSpacing(ast.children[before])) before--
    const previous = ast.children[before]
    return before >= 0 && !isRelation(previous) && !(previous.type === 'symbol' && previous.operation)
  })
  const rootRelation: CompiledNestedMath['rootRelation'] = rootRelationIndex < 0 ? undefined : { path: 'root/' + rootRelationIndex, marker: 'NROOTREL0000', kind: relationNode.type as 'symbol' | 'slot' | 'mirror', ...('key' in relationNode ? { partKey: relationNode.key } : {}) }
  const breaks = options.breakAtPaths ?? (options.breakAtPath ? [options.breakAtPath] : [])
  if (new Set(breaks).size !== breaks.length || breaks.some(path => !rootBreakPaths.includes(path) && !semanticRootBreakPaths.includes(path))) fail('UNSAFE_BREAK_PATH')
  function emit(node: MathTemplateNode, path: string): string {
    const markRoot = (latex: string) => rootRelation?.path === path ? '\\mathrel{' + latex + '\\phantom{\\smash{\\rlap{\\text{' + rootRelation.marker + '}}}}}' : latex
    if (rootRelation?.path === path && node.type === 'symbol') return markRoot(node.value)
    if (node.type === 'slot' || node.type === 'mirror') {
      const part = parts.get(node.key); if (!part) return fail('UNKNOWN_PART:' + node.key)
      const value = values[node.key], chosen = part.choices.find(c => c.value === value)
      if (value !== undefined && !chosen) return fail('UNKNOWN_CHOICE:' + node.key)
      if (certified.has(node.key) && !chosen) return fail('CERTIFIED_WITHOUT_VALUE:' + node.key)
      if (node.type === 'mirror' && !certified.has(node.key) && !options.neutralReferences) return fail('UNPROVEN_MIRROR:' + node.key)
      const latex = chosen ? emitStatic(parseNestedMathTemplate(chosen.latex ?? chosen.value), n => emitStaticRecursive(n)) : ''
      if (node.type === 'mirror' && certified.has(node.key)) {
        resolvedParts.push({ key: node.key, path, value: value!, source: 'mirror' })
        return markRoot(latex)
      }
      const slotKey = node.type === 'mirror' ? node.key + '-neutral-reference-' + slots.length : node.key
      if (used.has(slotKey)) return fail('DUPLICATE_SLOT:' + slotKey)
      used.add(slotKey)
      if (mode === 'readonly' && !certified.has(node.key)) return fail('UNPROVEN_READONLY:' + node.key)
      // Emit the closed candidate subtree into its actual TeX context. Wrapping
      // a standalone +/− in an ordinary group would change its operator class.
      if (certified.has(node.key)) {
        resolvedParts.push({ key: node.key, path, value: value!, source: 'slot' })
        return markRoot(latex)
      }
      const envelope = options.envelopes?.[slotKey] ?? options.envelopes?.[node.key] ?? { widthEm: 44 / 18, heightEm: 44 / 18 }
      if (![envelope.widthEm, envelope.heightEm].every(n => Number.isFinite(n) && n >= 44 / 18 && n < 100)) return fail('INVALID_ENVELOPE')
      const marker = 'NSLOT' + slots.length.toString().padStart(4, '0')
      const candidateMarker = chosen ? 'NSCAND' + slots.length.toString().padStart(4, '0') : undefined
      slots.push({ key: slotKey, sourceKey: node.key, path, marker, candidateMarker, value, certified: certified.has(node.key), envelope })
      const number = (n: number) => n.toFixed(6)
      const width = envelope.widthEm, height = envelope.heightEm, candidateWidth = chosen ? envelope.choiceWidthsEm?.[chosen.value] ?? 0 : 0
      const selected = chosen ? '\\mathrlap{\\kern' + number(Math.max(0, (width - candidateWidth) / 2)) + 'em{' + latex + '}\\phantom{\\smash{\\rlap{\\text{' + candidateMarker + '}}}}}' : ''
      return markRoot('{' + selected + '\\phantom{\\rule[' + number((envelope.axisEm ?? .25) - height / 2) + 'em]{' + number(width) + 'em}{' + number(height) + 'em}\\smash{\\rlap{\\text{' + marker + '}}}}}')
    }
    if (node.type === 'sequence') {
      const children = node.children.map((child, i) => emit(child, path + '/' + i))
      if (path === 'root' && breaks.length) {
        const indices = [0, ...breaks.map(path => Number(path.split('/')[1])).sort((a, b) => a - b), children.length]
        return '\\begin{gathered}' + indices.slice(0, -1).map((at, i) => children.slice(at, indices[i + 1]).join(' ')).join('\\\\') + '\\end{gathered}'
      }
      return children.join(' ')
    }
    switch (node.type) {
      case 'sqrt': return '\\sqrt{' + emit(node.body, path + '/radicand') + '}'
      case 'fraction': return '\\frac{' + emit(node.numerator, path + '/numerator') + '}{' + emit(node.denominator, path + '/denominator') + '}'
      case 'cases': return '\\begin{cases}' + node.rows.map((row, r) => row.map((cell, c) => emit(cell, path + '/case/' + r + '/' + c)).join('&')).join('\\\\') + '\\end{cases}'
      case 'group': return node.open === '{' ? '{' + emit(node.body, path + '/group') + '}' : '\\left' + node.open + emit(node.body, path + '/group') + '\\right' + node.close
      case 'power': case 'subscript': return '{' + emit(node.base, path + '/base') + '}' + (node.type === 'power' ? '^' : '_') + '{' + emit(node.argument, path + '/argument') + '}'
      default: return emitStatic(node, n => emit(n, path))
    }
  }
  const latex = emit(ast, 'root')
  const rendered = katex.renderToString(latex, NESTED_KATEX_OPTIONS), mathEnd = rendered.indexOf('</math>')
  // Phantom marker text is a DOM identity, never mathematical or spoken copy.
  // Clip that text alone; the neutral rule still determines the reserved frame.
  const mathml = mathEnd >= 0 ? rendered.slice(0, mathEnd + 7).replace(/(?:NS(?:LOT|CAND)|NROOTREL)\d{4}/g, '') : ''
  const visibleHtml = rendered.slice(mathEnd >= 0 ? mathEnd + 7 : 0).replace(/(<span[^>]*>)((?:NS(?:LOT|CAND)|NROOTREL)\d{4})(<\/span>)/g, '$1<span class="nested-slot-marker" aria-hidden="true">$2</span>$3')
  const html = mathml + visibleHtml.replace(/(<span class="[^"]*\brule\b[^"]*"[^>]*>)/g, '<span class="nested-zero-baseline" style="display:inline-block;width:0;height:0;vertical-align:baseline"></span>$1')
  return { ast, latex, html, slots, resolvedParts, rootBreakPaths, semanticRootBreakPaths, rootRelation, measurementOnly: Boolean(options.neutralReferences), mode }
}
/** This output is used only in temporary neutral probes, never for learner display. */
export function compileNeutralNestedMathTemplate(options: Omit<CompileNestedMathOptions, 'mode' | 'neutralReferences'>) {
  const certifiedKeys = options.certifiedKeys ?? []
  const values = Object.fromEntries(Object.entries(options.values ?? {}).filter(([key]) => certifiedKeys.includes(key)))
  return compileNestedMathTemplate({ ...options, neutralReferences: true, values, certifiedKeys, mode: 'interactive' })
}
function emitStaticRecursive(node: MathTemplateNode): string { return emitStatic(node, emitStaticRecursive) }

export type BoundNestedSlot = NestedMathSlot & { element: HTMLElement }
/** Match legal phantom marker IDs, then verify the entire generated DOM structure.
 * No DOM-order zip: a same-size numerator/denominator exchange fails the DOM check. */
export function bindNestedMathSlots(root: HTMLElement, compiled: CompiledNestedMath): BoundNestedSlot[] {
  const reference = root.ownerDocument.createElement('div'); reference.innerHTML = compiled.html
  if (root.childNodes.length !== reference.childNodes.length || [...root.childNodes].some((n, i) => !n.isEqualNode(reference.childNodes[i]))) fail('COMPILED_DOM_MISMATCH')
  const visible = root.querySelector<HTMLElement>('.katex-html'); if (!visible) return fail('KATEX_DOM_MISSING')
  return compiled.slots.map(slot => {
    const leaves = [...visible.querySelectorAll<HTMLElement>('span')].filter(e => !e.children.length && e.textContent === slot.marker)
    if (leaves.length !== 1) return fail('MARKER_ID_MISMATCH:' + slot.key)
    let parent = leaves[0].parentElement
    while (parent && parent !== visible && ![...parent.children].some(c => c.matches('.rule'))) parent = parent.parentElement
    const rules = parent ? [...parent.children].filter(c => c.matches('.rule')) : []
    if (rules.length !== 1) return fail('MARKER_RULE_BINDING:' + slot.key)
    return { ...slot, element: rules[0] as HTMLElement }
  })
}

export function bindNestedRootRelation(root: HTMLElement, compiled: CompiledNestedMath): HTMLElement | undefined {
  bindNestedMathSlots(root, compiled)
  if (!compiled.rootRelation) return undefined
  const markers = [...root.querySelectorAll<HTMLElement>('.katex-html .nested-slot-marker')].filter(el => el.textContent === compiled.rootRelation!.marker)
  if (markers.length !== 1) return fail('ROOT_RELATION_MARKER_MISMATCH')
  const relation = markers[0].closest<HTMLElement>('.mrel')
  if (!relation || !root.contains(relation)) return fail('ROOT_RELATION_BINDING')
  return relation
}
