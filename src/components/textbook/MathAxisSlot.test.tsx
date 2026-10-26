// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MathAxisSlot } from './MathAxisSlot'
import { measureInlineBaseline, measureMathAxis, validateFrameEnvelope } from './axisGeometry'
import { ConstructionMathRow } from './ConstructionMathRow'

afterEach(cleanup)
describe('r7 mathematical slot mechanism', () => {
  it('keeps mathematical ink in normal flow, separate from its absolute hit button', () => {
    const activate = vi.fn()
    const view = render(<MathAxisSlot parentId="parent" partId="p" label="符号" panelId="panel" active onActivate={activate} />)
    const root = view.container.querySelector('.axis-slot')!
    expect(root.querySelector(':scope > [data-axis-baseline]')).toBeTruthy()
    expect(root.querySelector(':scope > .axis-slot-ink .strut')).toBeTruthy()
    expect(root.querySelector('button .katex')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '符号' }))
    expect(activate).toHaveBeenCalledOnce()
    view.rerender(<MathAxisSlot parentId="parent" partId="p" label="符号" panelId="panel" valueLatex="-\\sqrt5" wrong onActivate={activate} />)
    expect(root.querySelector(':scope > .axis-slot-ink')?.textContent).toContain('5')
    expect(screen.getByRole('button').getAttribute('aria-invalid')).toBe('true')
    expect(view.container.querySelectorAll('.axis-slot-box')).toHaveLength(1)
  })
  it('refuses missing baseline or math-axis markers rather than inventing zero', () => {
    const node = document.createElement('span'); document.body.append(node)
    expect(measureMathAxis(node)).toEqual({ status: 'UNVERIFIED', reason: 'missing-axis-probe' })
    expect(measureInlineBaseline(node)).toBeNull()
    expect(validateFrameEnvelope({ id: 'g', source: 'all-candidates-neutral-syntax', leftPx: 50, relationPx: NaN, rightPx: 44 })).toBe(false)
    node.remove()
  })
  it('places the number on the current visible mathematical last row and keeps numeric frame identity', () => {
    const rows = [{ id: 'known', sourceNodeId: 'n', left: 'a', relation: '=', right: '1' }, { id: 'current', sourceNodeId: 'n', left: null, relation: '=', right: '2' }]
    const envelope = { id: 'full-plan-g', source: 'all-candidates-neutral-syntax' as const, leftPx: 90, relationPx: 18, rightPx: 120 }
    const view = render(<div className="n08-axis-reader"><ConstructionMathRow id="g" rows={rows.slice(0, 1)} envelope={envelope} number={7} /></div>)
    expect(view.container.querySelector('[data-number-row-ref]')?.getAttribute('data-number-row-ref')).toBe('known')
    view.rerender(<div className="n08-axis-reader"><ConstructionMathRow id="g" rows={rows} envelope={envelope} number={7} /></div>)
    expect(view.container.querySelector('[data-number-row-ref]')?.getAttribute('data-number-row-ref')).toBe('current')
    expect(view.container.querySelectorAll('[data-construction-number-anchor="true"]')).toHaveLength(1)
    expect(view.container.querySelector('[data-envelope-id]')?.getAttribute('data-envelope-id')).toBe('full-plan-g')
  })
})
