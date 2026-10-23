import type { TextbookReadingBlock } from '../../domain/textbookSchema'

type FormulaBlock = Extract<TextbookReadingBlock, { type: 'formula' }>

// Keep operators with the following term; never split a brace, radical, fraction,
// parenthesized factor or interactive coefficient. Only audited blocks opt in.
export function formulaWrapChunks(block: FormulaBlock): string[] {
  const source = block.parts.map((part, index) => part.type === 'math'
    ? part.latex : part.type === 'choice' ? `§${index}§` : '').join('')
  const chunks: string[] = []
  let start = 0, braces = 0, parentheses = 0, absolute = false
  const push = (end: number) => { if (end > start) chunks.push(source.slice(start, end)); start = end }
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (char === '\\') {
      const command = source.slice(i).match(/^\\[A-Za-z]+/)?.[0] ?? source.slice(i, i + 2)
      if (!braces && !parentheses && !absolute) {
        if (/^\\(?:Longrightarrow|longrightarrow)$/.test(command)) {
          push(i); push(i + command.length)
        } else if (/^\\(?:times|cdot|qquad)$/.test(command) && i > start) push(i)
      }
      i += command.length - 1
      continue
    }
    if (char === '{') braces++
    if (char === '}') braces--
    if (braces) continue
    if (char === '(') parentheses++
    if (char === ')') parentheses--
    if (char === '|') absolute = !absolute
    if (!parentheses && !absolute && (char === '=' || ((char === '+' || char === '-') && i > start))) push(i)
    // This one audited label has two complete case descriptions inside bigl(...).
    if (block.id === 'formula-n09-04' && char === ',') push(i + 1)
  }
  push(source.length)
  return chunks.filter(chunk => chunk.trim())
}

export const auditedWrapBlocks: Readonly<Record<string, readonly string[]>> = {
  'math-numbers-expressions-n01': ['formula-n01-01', 'formula-n01-02a', 'formula-n01-02b', 'formula-n01-02c', 'formula-r3-q07-x2coef', 'formula-r3-q07-xcoef', 'formula-r3-q07-const', 'formula-n01-07'],
  'math-numbers-expressions-n02': ['formula-n02-02', 'formula-n02-03', 'formula-n02-04', 'formula-n02-07', 'formula-n02-08'],
  'math-numbers-expressions-n03': ['formula-n03-01', 'formula-n03-04', 'formula-n03-12'],
  'math-numbers-expressions-n09': ['formula-n09-04', 'formula-n09-07'],
  'math-numbers-expressions-n10': ['formula-n10-01', 'formula-n10-03', 'formula-n10-06', 'formula-n10-13', 'formula-n10-18'],
  'math-numbers-expressions-n11': ['n11-formula-08', 'n11-formula-13'],
}
