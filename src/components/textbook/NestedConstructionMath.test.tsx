// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NestedConstructionMath } from './NestedConstructionMath'
import type { NestedMathPart } from './nestedMathTemplate'

const parts: NestedMathPart[] = [{ key: 'a', kind: '係数', choices: [{ value: '1' }, { value: '-1' }] }, { key: 'b', kind: '定数', choices: [{ value: '2' }, { value: '3' }] }]
afterEach(cleanup)
describe('nested prototypeの操作（実幾何検査ではない）', () => {
  it('現在の一partだけ操作でき、候補/正答の判定をrendererが作らない', () => {
    const onActivate = vi.fn()
    const view = render(<NestedConstructionMath id="m" template="{a}+{b}" parts={parts} values={{}} certifiedKeys={[]} editableKey="a" onActivate={onActivate} />)
    const a = screen.getByRole('button', { name: '係数の空欄' }), b = screen.getByRole('button', { name: '定数の空欄' })
    expect((a as HTMLButtonElement).disabled).toBe(false); expect((b as HTMLButtonElement).disabled).toBe(true); fireEvent.click(a); fireEvent.click(b)
    expect(onActivate).toHaveBeenCalledTimes(1); expect(onActivate).toHaveBeenCalledWith('a')
    expect(view.container.querySelector('[data-neutral-status]')?.getAttribute('data-neutral-status')).toBe('UNVERIFIED')
  })
  it('候補値と認定値を区別し、認定済みの操作buttonを除く', () => {
    const onActivate = vi.fn()
    const view = render(<NestedConstructionMath id="m" template="{a}+{b}" parts={parts} values={{ a: '-1' }} certifiedKeys={[]} editableKey="a" onActivate={onActivate} />)
    expect(view.container.querySelector('[data-part-key="a"]')?.getAttribute('data-slot-state')).toBe('wrong')
    view.rerender(<NestedConstructionMath id="m" template="{a}+{b}" parts={parts} values={{ a: '1' }} certifiedKeys={['a']} editableKey="b" onActivate={onActivate} />)
    expect(screen.queryByRole('button', { name: /係数の空欄/ })).toBeNull()
    expect((screen.getByRole('button', { name: '定数の空欄' }) as HTMLButtonElement).disabled).toBe(false)
  })
  it('明示readonlyは純数式となり操作や予約markerを含めない', () => {
    const view = render(<NestedConstructionMath id="m" template="{a}+{b}" parts={parts} values={{ a: '1', b: '2' }} certifiedKeys={['a', 'b']} editableKey={null} onActivate={() => undefined} mode="readonly" />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(view.container.querySelector('.nested-math-formula')?.textContent).not.toContain('NSLOT')
  })
})
