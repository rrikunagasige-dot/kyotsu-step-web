// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ConstructionLessonReadingFlow } from './ConstructionLessonReadingFlow'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from '../../domain/compiledNestedLesson'
import { answerNestedPart, type NestedLesson, type NestedNode } from '../../domain/nestedLesson'

afterEach(cleanup)
function fixture() {
  const makeNode = (id: string, stageId: string, prerequisiteNodeIds: string[]): NestedNode => ({
    nodeId: id, stageId, q: 1, resultId: id + '-result', classification: 'NEW_CONSTRUCTION', prerequisiteNodeIds, requiredResultRefs: [],
    leadParts: [{ type: 'text', text: id + 'の計算を進めます。' }], assumptions: ['実数の加算。'],
    rows: [{ id: id + '-row-1', kind: 'math', template: '1+1={x}', partKeys: ['x'], requiresCorrectKeys: [] }, { id: id + '-row-2', kind: 'math', template: '{mirror:x}=2', partKeys: [], requiresCorrectKeys: ['x'] }],
    parts: [{ id: id + '::x', key: 'x', role: 'rational', kind: 'math', prompt: id + 'の和を計算します。', expected: '2', choices: [{ value: '2', kind: 'math', display: '二', latex: '2', feedback: '正答です。', misconception: '正答' }, { value: '3', kind: 'math', display: '三', latex: '3', feedback: '二つの1を数え直してください。', misconception: '加算' }] }], partOrder: ['x'],
    terminalRecord: { formulas: ['1+1=2'], conditions: ['加算'], prose: id + 'で確定した結論です。', requiresCorrectKeys: ['x'] },
  })
  const nodes = [makeNode('a', 'stage-a', []), makeNode('b', 'stage-b', ['a'])]
  const lesson: NestedLesson = { unitId: 'u', fromRevision: 2, toRevision: 3, compiledHash: 'fixture-compiled', nodes }
  const compiled = { ...lesson, schemaVersion: 'transformation-reading/3', nestedPipeline: 'n0910/1', stages: [{ id: 'stage-a', q: 1, title: '第一の問題', sourceQuestionParts: [{ type: 'text', text: '最初の原問題です。' }] }, { id: 'stage-b', q: 2, title: '第二の問題', sourceQuestionParts: [{ type: 'text', text: '未来の原問題です。' }] }], nodeDesign: nodes, constructionPlan: { schemaVersion: 'nested-construction-plan/1', nodes: nodes.map(n => ({ nodeId: n.nodeId, rows: n.rows, parts: n.parts, partOrder: n.partOrder })) } } as unknown as CompiledNestedLesson
  compiled.layoutPlan = { schemaVersion: 'layout-plan/2', nestedGeometryContract: 'nested-geometry/1', unitId: 'u', tokens: { mathFontPx: 18, katexScale: 1, minHitPx: 44, rowGapPx: 4, noteGapPx: 6, paragraphGapPx: 8 }, groups: nodes.map(n => ({ id: n.nodeId + '-layout', sourceNodeIds: [n.nodeId], rowIds: n.rows.map(r => r.id), mathRowIds: n.rows.filter(r => r.kind === 'math').map(r => r.id), number: n.equationNumber ?? null, numberRowRef: n.rows.filter(r => r.kind === 'math').at(-1)?.id ?? null })) }
  compiled.nestedDisplay = { schemaVersion: 'nested-display/1', unitId: 'u', breakPolicy: 'root-relation-or-operation', rowTemplates: nodes.map(n => ({ nodeId: n.nodeId, rows: n.rows.map(({ id, template, kind }) => ({ id, template, kind })) })) }
  return { lesson, compiled }
}

describe('compiled nodeDesignとconstructionPlanを使うreader', () => {
  it('root gatheredの最終pstrutの下端へ番号を合わせ、nested tableのstrutを使わない', async () => {
    const { compiled } = fixture()
    compiled.nodeDesign[0].equationNumber = '1'; compiled.layoutPlan.groups[0].number = '1'
    const box = (x: number, y: number, width: number, height: number) => ({ x, y, width, height, left: x, top: y, right: x + width, bottom: y + height, toJSON: () => ({ x, y, width, height }) })
    const measurements = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('construction-lesson-math-row')) return box(10, 100, 200, 100)
      if (this.classList.contains('nested-math-formula')) return box(20, 100, 120, 100)
      if (this.classList.contains('construction-lesson-equation-number')) return box(180, 100 + parseFloat(this.style.top || '0'), 30, 29)
      if (this.hasAttribute('data-number-baseline')) return box(180, 120 + parseFloat(this.parentElement!.style.top || '0'), 0, 0)
      if (this.dataset.testStrut === 'root') return box(20, 146, 0, 54)
      if (this.dataset.testStrut === 'nested') return box(20, 900, 0, 54)
      return box(0, 0, 0, 0)
    })
    try {
      const view = render(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={() => undefined} onReset={() => undefined} />)
      const formula = view.container.querySelector<HTMLElement>('#a-row-1 .nested-math-formula')!
      formula.innerHTML = '<span class="katex-html"><span class="base"><span class="strut"></span><span class="mord"><span class="mtable"><span class="col-align-c"><span class="vlist-t"><span class="vlist-r"><span class="vlist"><span><span class="pstrut" data-test-strut="root"></span><span class="mord">x<span class="mtable"><span class="col-align-c"><span class="vlist-t"><span class="vlist-r"><span class="vlist"><span><span class="pstrut" data-test-strut="nested"></span><span class="mord">nested</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
      formula.closest<HTMLElement>('.nested-math-shell')!.dataset.rootBreakPath = 'root/1'
      await waitFor(() => expect(view.container.querySelector<HTMLElement>('.construction-lesson-equation-number')?.style.top).toBe('80px'))
    } finally { measurements.mockRestore() }
  })
  it('frontierより先の問題、未確定の結論とmirror行を見せない', () => {
    const { compiled } = fixture()
    const view = render(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={() => undefined} onReset={() => undefined} />)
    expect(screen.getByText('最初の原問題です。')).toBeTruthy()
    expect(screen.queryByText('未来の原問題です。')).toBeNull()
    expect(screen.queryByText('aで確定した結論です。')).toBeNull()
    expect(view.container.querySelector('#a-row-2')).toBeNull()
    expect(view.container.querySelector('[data-certified-memo]')).toBeNull()
  })
  it('候補表示文でなくraw valueを渡し、安定した順序を保つ', () => {
    const { compiled } = fixture(), onAnswer = vi.fn(), onReset = vi.fn()
    const view = render(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={onAnswer} onReset={onReset} />)
    const before = [...view.container.querySelectorAll('[data-choice-value]')].map(e => e.getAttribute('data-choice-value'))
    fireEvent.click(view.container.querySelector('[data-choice-value="2"]')!)
    expect(onAnswer).toHaveBeenCalledWith('a::x', '2')
    view.rerender(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={onAnswer} onReset={onReset} />)
    expect([...view.container.querySelectorAll('[data-choice-value]')].map(e => e.getAttribute('data-choice-value'))).toEqual(before)
    // Unit-page reset owns confirmation; this reader must not duplicate it.
    expect(screen.queryByText('この版をやり直す')).toBeNull(); expect(onReset).not.toHaveBeenCalled()
  })
  it('誤答後は対応する誘導だけを表示し、訂正後に結論と次の原問題を解放する', () => {
    const { compiled, lesson } = fixture()
    const wrong = answerNestedPart(lesson, undefined, 'a::x', '3', 'wrong', 1)!
    const view = render(<ConstructionLessonReadingFlow compiled={compiled} ledger={wrong} onAnswer={() => undefined} onReset={() => undefined} />)
    expect(screen.getByRole('status').textContent).toBe('もう一度考えよう二つの1を数え直してください。')
    expect(screen.queryByText('未来の原問題です。')).toBeNull()
    fireEvent.click(view.container.querySelector('[data-choice-value="2"]')!)
    const right = answerNestedPart(lesson, wrong, 'a::x', '2', 'right', 2)!
    view.rerender(<ConstructionLessonReadingFlow compiled={compiled} ledger={right} onAnswer={() => undefined} onReset={() => undefined} />)
    expect(view.container.querySelector('#a-row-2')).toBeTruthy()
    expect(view.container.querySelector('#a-row-1 .nested-slot-control')).toBeNull()
    expect(screen.queryByText('未来の原問題です。')).toBeNull()
    fireEvent.click(screen.getByText('次へ'))
    expect(screen.getByText('未来の原問題です。')).toBeTruthy()
    fireEvent.click(screen.getByText('前の段階を見る'))
    expect(view.container.querySelector('[data-readonly-history] button')).toBeNull()
    expect(view.container.querySelector('[data-readonly-history] .nested-slot-control')).toBeNull()
    expect(view.container.querySelector('#history-a-row-1')?.getAttribute('data-nested-render-mode')).toBe('readonly')
  })
  it('別planの行やpartを差し込んだcompiledは表示しない', () => {
    const { compiled } = fixture()
    const changed = structuredClone(compiled)
    changed.constructionPlan.nodes[0].rows = [{ ...changed.constructionPlan.nodes[0].rows[0], template: '1+1=999' }]
    render(<ConstructionLessonReadingFlow compiled={changed} onAnswer={() => undefined} onReset={() => undefined} />)
    expect(screen.getByRole('alert').textContent).toContain('NESTED_COMPILED_PLAN_MISMATCH')
    expect(screen.queryByText('最初の原問題です。')).toBeNull()
  })
  it('実JSONの用語属性を強調し、補助表・図を認定前に表示しない', () => {
    const { compiled, lesson } = fixture()
    compiled.nodeDesign[0].leadParts.push({ type: 'text', text: '平方根', semanticRole: 'term', usage: 'first_definition', emphasis: 'black-bold' })
    compiled.nodeDesign[0].displayExtras = [{ kind: 'table', caption: '確定後の補助表', headers: ['x', 'x^2'], rows: [['2', '4']] }, { kind: 'figure', id: 'f', src: '/f.svg', alt: '確定後の数直線', caption: '図の説明', sha256: 'fixture-figure' }]
    const view = render(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={() => undefined} onReset={() => undefined} />)
    expect(screen.getByText('平方根').tagName).toBe('STRONG')
    expect(screen.queryByText('確定後の補助表')).toBeNull()
    expect(screen.queryByAltText('確定後の数直線')).toBeNull()
    fireEvent.click(view.container.querySelector('[data-choice-value="2"]')!)
    const right = answerNestedPart(lesson, undefined, 'a::x', '2', 'right', 1)!
    view.rerender(<ConstructionLessonReadingFlow compiled={compiled} ledger={right} onAnswer={() => undefined} onReset={() => undefined} />)
    expect(screen.getByText('確定後の補助表')).toBeTruthy()
    expect(screen.getByAltText('確定後の数直線')).toBeTruthy()
  })
  it('同じnodeの静的math行へ、日本語のtext候補を渡さない', () => {
    const { compiled, lesson } = fixture(), node = compiled.nodeDesign[0]
    node.rows = [{ id: 'static-math', kind: 'math', template: 'c\\ne0\\Rightarrow\\frac cc=1', partKeys: [], requiresCorrectKeys: [] }, { id: 'text-choice', kind: 'text', template: '値を保つ操作：{x}', partKeys: ['x'], requiresCorrectKeys: [] }, { id: 'text-mirror', kind: 'text', template: '確定した操作：{mirror:x}', partKeys: [], requiresCorrectKeys: ['x'] }]
    node.parts[0].kind = 'text'
    node.parts[0].expected = '分子と分母に同じ0でない数を掛ける'
    node.parts[0].choices = ['分子と分母に同じ0でない数を掛ける', '分母だけに同じ数を掛ける'].map(value => ({ value, kind: 'text', display: value, feedback: '分数の値を確認してください。', misconception: '値の保存' }))
    compiled.constructionPlan.nodes[0] = { nodeId: node.nodeId, rows: node.rows, parts: node.parts, partOrder: node.partOrder }
    compiled.layoutPlan.groups[0].rowIds = node.rows.map(r => r.id)
    compiled.layoutPlan.groups[0].mathRowIds = ['static-math']
    compiled.layoutPlan.groups[0].numberRowRef = 'static-math'
    compiled.nestedDisplay.rowTemplates[0].rows = node.rows.map(({ id, template, kind }) => ({ id, template, kind }))
    const onAnswer = vi.fn()
    const view = render(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={onAnswer} onReset={() => undefined} />)
    expect(view.container.querySelector('#static-math .katex')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'aの和を計算します。' })).toBeTruthy()
    const token = view.container.querySelector('[data-text-row-id="text-choice"] [data-text-part-id="a::x"]')!
    expect(token.getAttribute('data-slot-state')).toBe('initial'); expect(token.getAttribute('data-editable')).toBe('true'); expect(token.getAttribute('data-text-part-value')).toBeNull()
    fireEvent.click(view.container.querySelector('[data-choice-value="分子と分母に同じ0でない数を掛ける"]')!)
    expect(onAnswer).toHaveBeenCalledWith('a::x', '分子と分母に同じ0でない数を掛ける')
    const wrong = answerNestedPart(lesson, undefined, 'a::x', '分母だけに同じ数を掛ける', 'text-wrong', 1)!
    view.rerender(<ConstructionLessonReadingFlow compiled={compiled} ledger={wrong} onAnswer={onAnswer} onReset={() => undefined} />)
    expect(view.container.querySelector('[data-text-row-id="text-choice"] [data-text-part-id="a::x"]')?.getAttribute('data-slot-state')).toBe('wrong')
    fireEvent.click(view.container.querySelector('[data-choice-value="分子と分母に同じ0でない数を掛ける"]')!)
    const right = answerNestedPart(lesson, wrong, 'a::x', node.parts[0].expected, 'text-right', 2)!
    view.rerender(<ConstructionLessonReadingFlow compiled={compiled} ledger={right} onAnswer={onAnswer} onReset={() => undefined} />)
    for (const row of ['text-choice', 'text-mirror']) {
      const completed = view.container.querySelector('[data-text-row-id="' + row + '"] [data-text-part-id="a::x"]')!
      expect(completed.tagName).toBe('SPAN'); expect(completed.getAttribute('data-slot-state')).toBe('filled'); expect(completed.getAttribute('data-editable')).toBe('false'); expect(completed.getAttribute('data-text-part-value')).toBe(node.parts[0].expected)
    }
  })
})


it('UX05 mathLines stays one accessible value/button and becomes ordinary math only after the answer', () => {
  const { compiled, lesson } = fixture(), node = compiled.nodeDesign[0]
  node.parts[0] = { ...node.parts[0], kind: 'text', expected: 'either', prompt: '零条件の組を選びます。', choices: [
    { value: 'either', kind: 'text', display: 'x=1 または x=−1', mathLines: ['x=1', '\\text{または}\\quad x=-1'], feedback: '一方が0です。', misconception: '正答' },
    { value: 'both', kind: 'text', display: 'x=1 かつ x=−1', mathLines: ['x=1', '\\text{かつ}\\quad x=-1'], feedback: '同時である必要はありません。', misconception: 'AND' },
  ] }
  node.rows = [
    { id: 'pair-scaffold', kind: 'text', template: '条件の組：{x}', partKeys: ['x'], requiresCorrectKeys: [], hideAfterCorrectKeys: ['x'] },
    { id: 'pair-resolved', kind: 'math', template: 'x=1', partKeys: [], requiresCorrectKeys: ['x'] },
  ]
  compiled.constructionPlan.nodes[0] = { nodeId: node.nodeId, rows: node.rows, parts: node.parts, partOrder: node.partOrder }
  compiled.layoutPlan.groups[0].rowIds = node.rows.map(r => r.id)
  compiled.layoutPlan.groups[0].mathRowIds = ['pair-resolved']
  compiled.layoutPlan.groups[0].numberRowRef = 'pair-resolved'
  compiled.nestedDisplay.rowTemplates[0].rows = node.rows.map(({ id, template, kind }) => ({ id, template, kind }))
  const onAnswer = vi.fn(), view = render(<ConstructionLessonReadingFlow compiled={compiled} onAnswer={onAnswer} onReset={() => undefined} />)
  expect(view.container.querySelector('#pair-resolved')).toBeNull()
  const button = screen.getByRole('button', { name: 'x=1 または x=−1' })
  expect(button.querySelectorAll('.construction-lesson-choice-math-lines > span')).toHaveLength(2)
  expect(view.container.querySelectorAll('[data-choice-value="either"]')).toHaveLength(1)
  fireEvent.click(button); expect(onAnswer).toHaveBeenCalledWith('a::x', 'either')
  const right = answerNestedPart(lesson, undefined, 'a::x', 'either', 'pair', 1)!
  view.rerender(<ConstructionLessonReadingFlow compiled={compiled} ledger={right} onAnswer={onAnswer} onReset={() => undefined} />)
  expect(view.container.querySelector('[data-text-row-id="pair-scaffold"]')).toBeNull()
  expect(view.container.querySelector('#pair-resolved')).toBeTruthy()
  expect(view.container.querySelector('#pair-resolved .nested-slot-control')).toBeNull()
  // Display is whitelisted; correctness and misconception stay private.
  for (const value of [[], [''], ['\\href{https://example.com}{x}']]) {
    node.parts[0].choices[0].mathLines = value
    expect(() => nestedLessonFromCompiled(compiled)).toThrow()
  }
})
