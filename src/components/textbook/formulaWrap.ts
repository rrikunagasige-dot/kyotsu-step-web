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
        } else if ((command === '\\qquad' || ((block.id === 'formula-n03-01' || block.id === 'first-theme-choice') && /^\\(?:times|cdot)$/.test(command)) || /^\\(?:le|ge|lt|gt)$/.test(command)) && i > start) push(i)
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
    if ((!parentheses || (block.id === 'first-theme-choice' && parentheses === 1)) && !absolute && (char === '=' || ((char === '+' || char === '-') && i > start))) push(i)
    // A tuple or case label may continue after its comma; keep each entry intact.
    if (char === ',' && parentheses <= 1 && !absolute) push(i + 1)
  }
  push(source.length)
  return chunks.filter(chunk => chunk.trim())
}

export const auditedWrapBlocks: Readonly<Record<string, readonly string[]>> = {
  'math-numbers-expressions-ne02': ["ne02-problem-01", "ne02-formula-01", "ne02-before-02-1", "ne02-formula-02", "ne02-formula-03", "ne02-formula-04", "ne02-problem-05", "ne02-formula-05", "ne02-before-06-1", "ne02-formula-06", "ne02-result-06-1", "ne02-formula-07", "ne02-formula-08", "ne02-result-08-1", "ne02-problem-09", "ne02-formula-09", "ne02-formula-10", "ne02-formula-11", "ne02-before-12-1", "ne02-formula-12", "ne02-result-12-1"],
  'math-numbers-expressions-ne01': ["ne01-problem-01", "ne01-formula-01", "ne01-before-02-1", "ne01-before-02-2", "ne01-formula-02", "ne01-formula-03", "ne01-formula-04", "ne01-formula-05", "ne01-formula-06", "ne01-problem-07", "ne01-formula-07", "ne01-result-07-1", "ne01-formula-08", "ne01-before-09-1", "ne01-formula-09", "ne01-result-09-1", "ne01-formula-10", "ne01-formula-11", "ne01-problem-12", "ne01-formula-12", "ne01-formula-13"],
  'math-numbers-expressions-n01': ['formula-n01-01', 'formula-n01-02a', 'formula-n01-02b', 'formula-n01-02c', 'formula-r3-q07-x2coef', 'formula-r3-q07-xcoef', 'formula-r3-q07-const', 'formula-n01-07'],
  'math-numbers-expressions-n02': ['formula-n02-02', 'formula-n02-03', 'formula-n02-04', 'formula-n02-07', 'formula-n02-08', 'formula-n02-09', 'formula-n02-10', 'formula-n02-11', 'formula-n02-12'],
  'math-numbers-expressions-n03': ['formula-n03-01', 'formula-n03-04', 'formula-n03-12', 'formula-n03-05', 'formula-n03-07', 'formula-n03-09'],
  'math-numbers-expressions-n09': ['formula-n09-04', 'formula-n09-07'],
  'math-numbers-expressions-n10': ['formula-n10-01', 'formula-n10-03', 'formula-n10-06', 'formula-n10-13', 'formula-n10-18', 'formula-n10-11', 'formula-n10-20'],
  'math-numbers-expressions-n11': ['n11-formula-08', 'n11-formula-13'],
  'math-numbers-expressions-n04': ['formula-n04-q01-complete', 'n04-formula-13', 'n04-formula-15', 'n04-formula-16'],
  'math-numbers-expressions-n05': ['n05-formula-13'],
  'math-numbers-expressions-n06': ['n06-formula-01', 'n06-formula-09', 'n06-formula-13'],
}

// Only these nineteen completed answers themselves exceeded the available width.
export const auditedResolvedWrapBlocks: readonly string[] = ["formula-n02-04", "formula-n02-09", "formula-n02-10", "formula-n02-11", "formula-n02-12", "formula-n03-05", "formula-n03-07", "formula-n03-09", "formula-n03-12", "formula-n04-q01-complete", "formula-n10-11", "formula-n10-20", "n04-formula-13", "n04-formula-15", "n04-formula-16", "n05-formula-13", "n06-formula-01", "n06-formula-09", "n06-formula-13"]
