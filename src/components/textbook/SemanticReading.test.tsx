import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { SemanticReading } from './SemanticReading'

describe('production IR rendering contract', () => {
  it('keeps math, first-definition terms and sentence slots in the same prose', () => {
    const html = renderToStaticMarkup(<SemanticReading parts={[
      { type: 'text', text: '上の式から下の式を' },
      { type: 'choice', itemId: 'choose-operation', semanticId: 'operation-slot' },
      { type: 'text', text: '。' },
      { type: 'term', text: '素因数分解', usage: 'first_definition', semanticId: 'prime-term' },
      { type: 'math', latex: '\\frac{p}{2^u5^v}', semanticId: 'rational-expression' },
    ]} renderChoice={() => <button>引く</button>} />)
    expect(html).toContain('data-semantic-id="operation-slot"')
    expect(html).toContain('<strong data-semantic-id="prime-term"')
    expect(html).toContain('data-semantic-id="rational-expression"')
    expect(html).toContain('class="katex"')
    expect(html.indexOf('上の式')).toBeLessThan(html.indexOf('引く'))
    expect(html).not.toContain('katex-error')
  })
})
