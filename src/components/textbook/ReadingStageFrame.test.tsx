import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReadingStageFrame } from './ReadingStageFrame'

describe('shared current-stage frame', () => {
  it('keeps source context before the task body and adds no extra frame or duplicated answer element', () => {
    const output = renderToStaticMarkup(<ReadingStageFrame contextHeader={<small>例題</small>} header={<h3>現在の問い</h3>} prelude={<p>元条件</p>} references={<aside>確定した結果</aside>} conclusion={<p>結論</p>} navigation={<button>次へ</button>}><button id="one-slot">穴</button></ReadingStageFrame>)
    expect(output).toBe('<small>例題</small><h3>現在の問い</h3><p>元条件</p><aside>確定した結果</aside><button id="one-slot">穴</button><p>結論</p><button>次へ</button>')
  })
})
