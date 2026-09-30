export function stripTextbookMarkdown(value: string) {
  return value
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function normalizeSubscriptSequence(value: string) {
  const map: Record<string, string> = {
    '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9',
    'ₓ':'x','ᵧ':'y','ₜ':'t',
  }
  return [...value].map((char) => map[char] ?? char).join('')
}

export function normalizeTextbookMath(value: string) {
  let next = stripTextbookMarkdown(value)

  next = next
    .replace(/Δ([A-Za-z])⃗([₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]+)/g, (_, base: string, sub: string) => `\\Delta \\vec{${base}}_{${normalizeSubscriptSequence(sub)}}`)
    .replace(/([A-Za-z])⃗([₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]+)/g, (_, base: string, sub: string) => `\\vec{${base}}_{${normalizeSubscriptSequence(sub)}}`)
    .replace(/([A-Za-z])([₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]{2,})/g, (_, base: string, sub: string) => `${base}_{${normalizeSubscriptSequence(sub)}}`)
    .replace(/([A-Za-z])_([0-9]+)_([A-Za-z])/g, '$1_{$2$3}')
    .replace(/v̄⃗/g, '\\vec{v}_{\\mathrm{avg}}')
    .replace(/([A-Za-z])̄⃗/g, '\\bar{\\vec{$1}}')
    .replace(/Δ([A-Za-z])⃗/g, '\\Delta \\vec{$1}')
    .replace(/([A-Za-z])⃗/g, '\\vec{$1}')
    .replace(/lim\(Δt→0\)/g, '\\lim_{\\Delta t\\to0}')
    .replace(/Δ/g, '\\Delta ')
    .replace(/θ/g, '\\theta ')
    .replace(/→/g, '\\to ')
    .replace(/−/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/·/g, '\\cdot ')
    .replace(/}([₀₁₂₃₄₅₆₇₈₉ₓᵧₜ])/g, (_, sub: string) => `}_{${normalizeSubscriptSequence(sub)}}`)
    .replace(/₀/g, '_0')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/₄/g, '_4')
    .replace(/₅/g, '_5')
    .replace(/₆/g, '_6')
    .replace(/₇/g, '_7')
    .replace(/₈/g, '_8')
    .replace(/₉/g, '_9')
    .replace(/ₓ/g, '_x')
    .replace(/ᵧ/g, '_y')
    .replace(/ₜ/g, '_t')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/sin/g, '\\sin ')
    .replace(/cos/g, '\\cos ')
    .replace(/tan/g, '\\tan ')
    .replace(/√\(([^()]*)\)/g, '\\sqrt{$1}')
    .replace(/√([A-Za-z0-9_]+)/g, '\\sqrt{$1}')

  return next.trim()
}

export function looksLikeTextbookMath(value: string) {
  const text = stripTextbookMarkdown(value)
  if (!text || /[ぁ-んァ-ヶ一-龠]/.test(text)) return false
  if (/[=+\-−×÷/√²³⃗θΔ()₀₁₂₃₄₅₆₇₈₉ₓᵧₜ_]/.test(text)) return true
  if (/(?:sin|cos|tan)/.test(text)) return true
  if (/^[0-9]*[A-Za-z]{1,4}$/.test(text)) return true
  return false
}

type InlineMathPart =
  | { type: 'text'; text: string }
  | { type: 'math'; latex: string }

function isMathToken(token: string) {
  const cleaned = token.replace(/^[「『（(]/, '').replace(/[」』、。！？）)]$/, '')
  if (!cleaned) return false
  if (looksLikeTextbookMath(cleaned)) return true
  return /^[POTDH][₀₁₂₃₄₅₆₇₈₉]$/.test(cleaned)
}

export function splitTextbookInlineMath(value: string): InlineMathPart[] {
  const text = stripTextbookMarkdown(value)
  if (!text) return []

  const tokenPattern = /(?:[A-Za-zΔ][A-Za-z0-9Δθ⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜ_{}\/]*(?:[=+\-−×·/<>|][A-Za-z0-9Δθ⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜ_{}().,+\-−×·/<>|]+)*|[POTDH][₀₁₂₃₄₅₆₇₈₉])/g

  const parts: InlineMathPart[] = []
  let cursor = 0
  for (const match of text.matchAll(tokenPattern)) {
    const index = match.index ?? 0
    if (index > cursor) parts.push({ type: 'text', text: text.slice(cursor, index) })
    const token = match[0]
    if (isMathToken(token)) parts.push({ type: 'math', latex: normalizeTextbookMath(token) })
    else parts.push({ type: 'text', text: token })
    cursor = index + token.length
  }
  if (cursor < text.length) parts.push({ type: 'text', text: text.slice(cursor) })

  return parts.filter((part) => part.type === 'math' || part.text.length > 0)
}
