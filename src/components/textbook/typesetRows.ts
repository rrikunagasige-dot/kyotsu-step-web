/** Mathematical rows, not screen lines: first equality, subsequent transforms,
 * independent equalities, and continuations retain different meanings. */
export type TypesetRow = { latex: string; lhs?: string; rhs?: string; kind: 'equation' | 'expression' | 'continuation'; group: number; product?: boolean }
export type TypesetPlan = { rows: TypesetRow[]; independent: boolean; table?: string[][] }
export type MathMeasure = (source: string) => number
export const mathWithoutMarkers = (s: string) => s.replace(/§(?:a|z)\d+§/g, '')

function split(source: string, kind: 'equals' | 'terms', inner = false): string[] {
  const parts: string[] = []
  let start = 0, braces = 0, parentheses = 0
  for (let i = 0; i < source.length; i++) {
    const c = source[i]
    if (c === '\\') {
      const command = source.slice(i).match(/^\\[A-Za-z]+/)?.[0]
      if (command) {
        if (kind === 'terms' && !braces && !parentheses && /^\\(?:times|cdot)$/.test(command) && i > start) { parts.push(source.slice(start, i)); start = i }
        i += command.length - 1; continue
      }
      i++; continue
    }
    if (c === '{') braces++
    if (c === '}') braces--
    if (braces) continue
    if (kind === 'terms' && !parentheses && c === '(' && source[i - 1] === ')' && i > start) { parts.push(source.slice(start, i)); start = i }
    if (c === '(') parentheses++
    if (c === ')') parentheses--
    if (kind === 'equals' && c === '=' && !parentheses) { parts.push(source.slice(start, i)); start = i + 1 }
    if (kind === 'terms' && parentheses <= (inner ? 1 : 0) && i > start && (c === '+' || c === '-')) { parts.push(source.slice(start, i)); start = i }
  }
  parts.push(source.slice(start))
  return kind === 'equals' ? parts : parts.filter(p => p.trim())
}

function wrap(source: string, width: number, measure: MathMeasure): string[] {
  if (measure(source) <= width) return [source]
  let terms = split(source, 'terms')
  if (terms.length === 1) terms = split(source, 'terms', true)
  if (terms.length === 1) return [source]
  const best: ({ cost: number; rows: string[] } | undefined)[] = Array(terms.length + 1)
  best[terms.length] = { cost: 0, rows: [] }
  for (let i = terms.length - 1; i >= 0; i--) {
    let line = ''
    for (let j = i; j < terms.length; j++) {
      line += terms[j]
      const size = measure(line), next = best[j + 1]
      if (size > width) break
      if (!next) continue
      const cost = 1e6 + (width - size) ** 2 + (j === terms.length - 1 && size < width * .28 ? 1e5 : 0) + next.cost
      if (!best[i] || cost < best[i]!.cost) best[i] = { cost, rows: [line, ...next.rows] }
    }
  }
  if (best[0]) return best[0].rows
  return terms.flatMap(term => measure(term) <= width || split(term, 'terms', true).length === 1 ? [term] : wrap(term, width, measure))
}

export function typesetRows(source: string, width: number, measure: MathMeasure): TypesetPlan {
  if (source.includes('\\begin{array}')) {
    const content = source.replace(/\\begin\{array\}\{[^}]+\}|\\end\{array\}|\\hline/g, '')
    return { rows: [], independent: true, table: content.split('\\\\').filter(Boolean).map(row => row.split('&')) }
  }
  const aligned = source.includes('\\begin{aligned}')
  const groups = aligned
    ? source.replace(/\\(?:begin|end)\{aligned\}/g, '').split('\\\\').map(s => s.replaceAll('&', ''))
    : source.split('\\qquad')
  const rows: TypesetRow[] = []
  const addExpression = (s: string, group: number) => {
    const lines = measure(s) <= width ? [s] : wrap(s, width - 18, measure)
    lines.forEach((latex, i) => rows.push({ latex, kind: i ? 'continuation' : 'expression', group }))
  }
  groups.forEach((source, group) => {
    const terms = split(source.trim(), 'equals')
    if (terms.length === 1) { addExpression(terms[0], group); return }
    const [lhs, rhs, ...rest] = terms
    if (measure(lhs) + measure('=') + measure(rhs) + 8 <= width) rows.push({ lhs, rhs, latex: lhs + '=' + rhs, kind: 'equation', group })
    else {
      addExpression(lhs, group)
      const lines = wrap(rhs, width - measure('=') - 8, measure)
      lines.forEach((latex, i) => rows.push(i ? { latex, kind: 'continuation', group } : { lhs: '', rhs: latex, latex: '=' + latex, kind: 'equation', group }))
    }
    rest.forEach(rhs => wrap(rhs, width - measure('=') - 8, measure).forEach((latex, i) => rows.push(i ? { latex, kind: 'continuation', group } : { lhs: '', rhs: latex, latex: '=' + latex, kind: 'equation', group })))
  })
  // A long chain uses a leading expression followed by one common relation
  // column; do not displace every subsequent equality by a long first lhs.
  const eq = rows.filter(r => r.kind === 'equation')
  const left = Math.max(0, ...eq.map(r => measure(r.lhs ?? ''))), right = Math.max(0, ...eq.map(r => measure(r.rhs ?? '')))
  if (groups.length === 1 && eq.length > 1 && left + measure('=') + right + 8 > width && eq[0].lhs) {
    const first = rows.indexOf(eq[0]), lhs = eq[0].lhs
    rows.splice(first, 0, ...wrap(lhs, width - 18, measure).map((latex, i): TypesetRow => ({ latex, group: 0, kind: i ? 'continuation' : 'expression' })))
    eq[0].lhs = ''; eq[0].latex = '=' + eq[0].rhs
  }
  rows.forEach((r, i) => { if (r.kind === 'continuation' && /^\(/.test(mathWithoutMarkers(r.latex).trim()) && /\)$/.test(mathWithoutMarkers(rows[i - 1]?.latex ?? '').trim())) r.product = true })
  return { rows, independent: groups.length > 1 }
}
