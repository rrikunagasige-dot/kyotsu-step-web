// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { bindNestedMathSlots, bindNestedRootRelation, compileNestedMathTemplate, compileNeutralNestedMathTemplate, parseNestedMathTemplate, renderClosedMath, NESTED_KATEX_OPTIONS, type NestedMathPart } from './nestedMathTemplate'
import { registerNestedMathDOM } from './nestedMathGeometry'

const parts: NestedMathPart[] = [
  { key: 'numerator', kind: 'rational', choices: [{ value: '1' }, { value: '2' }] },
  { key: 'denominator', kind: 'rational', choices: [{ value: '3' }, { value: '4' }] },
]
describe('閉じたnested templateと意味位置bind', () => {
  it('root relation役の穴と認定済mirrorも、初期・候補・完成で同じ意味位置を束縛する', () => {
    const relation = { key: 'relation', role: 'relation', kind: '大小関係', choices: [{ value: '>' }, { value: '<' }, { value: '=' }] }
    for (const values of [{}, { relation: '<' }, { relation: '>' }] as Record<string, string>[]) {
      const c = compileNestedMathTemplate({ template: '3 {relation} 2', parts: [relation], values })
      const root = document.createElement('div'); root.innerHTML = c.html
      expect(c.rootRelation).toMatchObject({ path: 'root/1', kind: 'slot', partKey: 'relation' })
      expect(bindNestedRootRelation(root, c)?.querySelector('.rule')).toBeTruthy()
      expect(c.rootBreakPaths).toContain('root/1')
    }
    const readonly = compileNestedMathTemplate({ template: '3 {relation} 2', parts: [relation], values: { relation: '>' }, certifiedKeys: ['relation'], mode: 'readonly' })
    const root = document.createElement('div'); root.innerHTML = readonly.html
    expect(bindNestedRootRelation(root, readonly)).toBeTruthy(); expect(readonly.slots).toHaveLength(0)
    const mirror = compileNestedMathTemplate({ template: '3 {mirror:relation} 2', parts: [relation], values: { relation: '>' }, certifiedKeys: ['relation'] })
    root.innerHTML = mirror.html
    expect(mirror.rootRelation?.kind).toBe('mirror'); expect(bindNestedRootRelation(root, mirror)).toBeTruthy()
    const neutral = compileNeutralNestedMathTemplate({ template: '3 {mirror:relation} 2', parts: [relation] })
    root.innerHTML = neutral.html
    expect(bindNestedRootRelation(root, neutral)?.querySelector('.rule')).toBeTruthy()
  })
  it('最初のroot relationを固有markerで束縛し、分数内部の等号へ誤対応しない', () => {
    const c = compileNestedMathTemplate({ template: '\\frac{x=1}{{numerator}}={denominator}', parts })
    const root = document.createElement('div'); root.innerHTML = c.html
    const relation = bindNestedRootRelation(root, c)
    expect(c.rootRelation?.path).toBe('root/1')
    expect(relation?.classList.contains('mrel')).toBe(true)
    expect(relation?.querySelector('.nested-slot-marker')?.textContent).toBe('NROOTREL0000')
    const noRoot = compileNestedMathTemplate({ template: '\\frac{x=1}{2}', parts: [] })
    const other = document.createElement('div'); other.innerHTML = noRoot.html
    expect(bindNestedRootRelation(other, noRoot)).toBeUndefined()
    relation!.remove()
    expect(() => bindNestedRootRelation(root, c)).toThrow('COMPILED_DOM_MISMATCH')
  })
  it('全候補neutral mirror計測はfuture認定とは別で、learner幾何へ登録できない', () => {
    const c = compileNeutralNestedMathTemplate({ template: '{numerator}+{mirror:numerator}={denominator}', parts })
    expect(c.measurementOnly).toBe(true)
    expect(c.slots).toHaveLength(3)
    expect(new Set(c.slots.map(s => s.key)).size).toBe(3)
    const root = document.createElement('div'); root.innerHTML = c.html
    expect(bindNestedMathSlots(root, c)).toHaveLength(3)
    expect(() => registerNestedMathDOM(document.createElement('div'), root, c)).toThrow('NESTED_NEUTRAL_PROBE_IS_NOT_LEARNER_EVIDENCE')
    expect(() => compileNestedMathTemplate({ template: '{mirror:numerator}', parts })).toThrow('UNPROVEN_MIRROR')
  })
  it('分子分母の位置をDOM順ではなく生成構造とmarkerIDでbindする', () => {
    const c = compileNestedMathTemplate({ template: '\\frac{{numerator}}{{denominator}}', parts })
    const root = document.createElement('div'); root.innerHTML = c.html
    const slots = bindNestedMathSlots(root, c)
    expect(slots.map(s => s.path)).toEqual(['root/0/numerator/0', 'root/0/denominator/0'])
    expect(slots[0].element).not.toBe(slots[1].element)
    // Same-size markers exchanged in HTML must fail even though counts match.
    const a = root.querySelector('.katex-html')!.innerHTML
    root.querySelector('.katex-html')!.innerHTML = a.replace('NSLOT0000', 'TEMP').replace('NSLOT0001', 'NSLOT0000').replace('TEMP', 'NSLOT0001')
    expect(() => bindNestedMathSlots(root, c)).toThrow('COMPILED_DOM_MISMATCH')
  })
  it('trust拡張・任意macro・任意environmentを拒否する', () => {
    expect(NESTED_KATEX_OPTIONS).toMatchObject({ trust: false, strict: 'error' })
    for (const t of ['\\htmlData{x=y}{1}', '\\href{https://x}{1}', '\\def\\x{1}', '\\begin{matrix}1\\end{matrix}', '\\text{<img>}']) expect(() => renderClosedMath(t)).toThrow()
  })
  it('TeX引数をslotと誤認せずcases専用構造を扱う', () => {
    expect(() => renderClosedMath('x=4\\ \\mathrm{or}\\ x=-4')).not.toThrow()
    expect(() => renderClosedMath('\\sqrt{a^2}=\\begin{cases}a&(a\\ge0)\\\\-a&(a<0)\\end{cases}')).not.toThrow()
    expect(() => renderClosedMath('x\\in\\mathbb{R}')).not.toThrow()
    expect(() => renderClosedMath('x\\in\\mathbb R')).not.toThrow()
  })
  it('既知partの指数argumentを穴にし、書体命令の引数は文字列のままにする', () => {
    const part = { key: 'powerA', kind: 'coefficient', choices: [{ value: '2' }, { value: '3' }] }
    const c = compileNestedMathTemplate({ template: '(\\sqrt a)^{powerA}', parts: [part] })
    expect(c.slots.map(s => s.key)).toEqual(['powerA'])
    expect(c.slots[0].path).toContain('/argument')
    expect(() => compileNestedMathTemplate({ template: '\\mathbb{R}', parts: [{ ...part, key: 'R' }] })).not.toThrow()
    expect(compileNestedMathTemplate({ template: 'a^{n}', parts: [] }).slots).toHaveLength(0)
  })
  it('未認定mirror/readonly、不明値、重複slotを拒否する', () => {
    expect(() => compileNestedMathTemplate({ template: '{mirror:numerator}', parts })).toThrow('UNPROVEN_MIRROR')
    expect(() => compileNestedMathTemplate({ template: '{numerator}', parts, mode: 'readonly' })).toThrow('UNPROVEN_READONLY')
    expect(() => compileNestedMathTemplate({ template: '{numerator}', parts, values: { numerator: '99' } })).toThrow('UNKNOWN_CHOICE')
    expect(() => compileNestedMathTemplate({ template: '{numerator}+{numerator}', parts })).toThrow('DUPLICATE_SLOT')
  })
  it('認定値を全式に含め、履歴ではmarkerも操作枠も作らない', () => {
    const c = compileNestedMathTemplate({ template: '{numerator}+{mirror:numerator}', parts, values: { numerator: '2' }, certifiedKeys: ['numerator'], mode: 'readonly' })
    expect(c.slots).toHaveLength(0); expect(c.latex).not.toContain('phantom'); expect(c.latex).toContain('2')
  })
  it('候補内の根号をtext modeに落とさず同じ数式compileへ含める', () => {
    const part = { key: 'a', kind: 'operand', choices: [{ value: '\\sqrt3' }, { value: '\\sqrt2' }] }
    const c = compileNestedMathTemplate({ template: '\\frac{{a}}{6}', parts: [part], values: { a: '\\sqrt2' } })
    expect(c.html).toContain('sqrt')
    const root = document.createElement('div'); root.innerHTML = c.html
    expect(bindNestedMathSlots(root, c)).toHaveLength(1)
  })
  it('rootの関係/演算子だけを改行候補にする', () => {
    const c = compileNestedMathTemplate({ template: 'x=\\frac{{numerator}}{{denominator}}+1', parts })
    expect(c.rootBreakPaths).toEqual(['root/1', 'root/3'])
    expect(() => compileNestedMathTemplate({ template: 'x=\\frac{{numerator}}{{denominator}}', parts, breakAtPath: 'root/2/numerator' })).toThrow('UNSAFE_BREAK_PATH')
    expect(compileNestedMathTemplate({ template: 'x=1+2', parts: [], breakAtPath: 'root/1' }).latex).toContain('gathered')
    expect(compileNestedMathTemplate({ template: '|2-\\sqrt5|={numerator}', parts }).rootBreakPaths).toEqual(['root/1'])
    expect(() => renderClosedMath('\\left|2-\\sqrt5\\right|')).not.toThrow()
    expect(() => renderClosedMath('\\lvert2-\\sqrt5\\rvert')).not.toThrow()
    expect(() => renderClosedMath('|2-\\sqrt5')).toThrow('UNCLOSED_GROUP')
  })
  it('長式は複数の根本演算子で折り返し、構造内部では切らない', () => {
    const source = '141^2=141(100+40+1)=14100+5640+141=19881'
    const paths = compileNestedMathTemplate({ template: source, parts: [] }).rootBreakPaths
    const result = compileNestedMathTemplate({ template: source, parts: [], breakAtPaths: paths })
    expect(result.latex).toContain('\\begin{gathered}')
    expect(result.latex.split('\\\\').length).toBe(paths.length + 1)
    expect(() => compileNestedMathTemplate({ template: source, parts: [], breakAtPaths: ['root/2/group/1'] })).toThrow('UNSAFE_BREAK_PATH')
  })
  it('内部markerはMathMLへ漏らさず、可視DOMでは幅ゼロに隔離する', () => {
    const c = compileNestedMathTemplate({ template: '{numerator}', parts })
    expect(c.html.slice(0, c.html.indexOf('</math>'))).not.toContain('NSLOT')
    expect(c.html).toContain('class="nested-slot-marker" aria-hidden="true"')
  })
  it('正答ラベルなしの候補集合と指定envelopeだけを受け取る', () => {
    const c = compileNestedMathTemplate({ template: '{numerator}', parts, envelopes: { numerator: { widthEm: 3, heightEm: 3 } } })
    expect(c.slots[0].envelope.widthEm).toBe(3)
    expect(JSON.stringify(c)).not.toContain('expected')
    expect(() => compileNestedMathTemplate({ template: '{numerator}', parts, envelopes: { numerator: { widthEm: 1, heightEm: 1 } } })).toThrow('INVALID_ENVELOPE')
    expect(() => parseNestedMathTemplate('x=\\sqrt{1')).toThrow('UNCLOSED_GROUP')
  })
})


describe('automatic semantic wrapping', () => {
  it('keeps r with its first equals and only splits a multi-equality derivation at later relations', () => {
    const c=compileNestedMathTemplate({template:'r=-\\sqrt{10}-(-4)=-\\sqrt{10}+4',parts:[]})
    expect(c.rootBreakPaths).toContain(c.rootRelation!.path)
    expect(c.semanticRootBreakPaths).not.toContain(c.rootRelation!.path)
    const nodes=c.semanticRootBreakPaths.map(p=>c.ast.children[Number(p.split('/')[1])])
    expect(nodes.length).toBeGreaterThan(0)
    expect(nodes.every(n=>n.type==='symbol'&&n.value==='=')).toBe(true)
  })
  it('preserves each inequality chain and allows the implication boundary', () => {
    const c=compileNestedMathTemplate({template:'-4<-\\sqrt{10}<-3\\Rightarrow0<4-\\sqrt{10}<1',parts:[]})
    expect(c.semanticRootBreakPaths.map(p=>c.ast.children[Number(p.split('/')[1])])).toEqual([{type:'symbol',value:'\\Rightarrow',relation:true,operation:false}])
    expect(compileNestedMathTemplate({template:'-4<-\\sqrt{10}<-3',parts:[]}).semanticRootBreakPaths).toEqual([])
  })
  it('permits a row between comma-separated complete assertions', () => {
    const template='0<\\sqrt{10}-3<1,\\quad0<4-\\sqrt{10}<1',c=compileNestedMathTemplate({template,parts:[]})
    expect(c.semanticRootBreakPaths).toHaveLength(1)
    expect(()=>compileNestedMathTemplate({template,parts:[],breakAtPaths:c.semanticRootBreakPaths})).not.toThrow()
  })
  it('does not split unary minus after an equals sign', () => {
    const c=compileNestedMathTemplate({template:'r=-\\sqrt{10}+4',parts:[]})
    expect(c.semanticRootBreakPaths).not.toContain('root/2')
    expect(c.semanticRootBreakPaths).not.toContain(c.rootRelation!.path)
  })
})


describe('semantic wrapping boundaries', () => {
  it('retains legacy relation candidates for structured subjects that need narrow-screen wrapping', () => {
    for (const template of ['r^2=1+2', '\\sqrt{x}=1+2', '\\frac{a}{b}=1+2', '-\\sqrt{x}=1+2']) {
      const c = compileNestedMathTemplate({ template, parts: [] })
      expect(c.semanticRootBreakPaths).toContain(c.rootRelation!.path)
    }
  })
  it('does not create assertion boundaries inside comma lists', () => {
    for (const template of ['a,b', 'x=1,2', 'a,b>0']) {
      const c = compileNestedMathTemplate({ template, parts: [] })
      const commas = c.ast.children.flatMap((n, i) => n.type === 'symbol' && n.value === ',' ? ['root/' + (i + 1)] : [])
      expect(c.semanticRootBreakPaths.filter(p => commas.includes(p))).toEqual([])
    }
  })
})

 it('keeps each comma assertion subject with its own first relation', () => {
  const c = compileNestedMathTemplate({ template: 'x=1,y=2', parts: [] })
  expect(c.semanticRootBreakPaths).toEqual(['root/4'])
 })

 it('keeps inequality comparisons intact but allows a later equals in a long mixed chain', () => {
  const c = compileNestedMathTemplate({ template: '1.41^2=1.9881<2<2.0164=1.42^2', parts: [] })
  expect(c.semanticRootBreakPaths).toHaveLength(1)
  expect(c.ast.children[Number(c.semanticRootBreakPaths[0].split('/')[1])]).toMatchObject({ type: 'symbol', value: '=' })
  expect(c.semanticRootBreakPaths).not.toContain(c.rootRelation!.path)
 })

 it('keeps the simple subject after inequality assertion boundaries', () => {
  for (const template of ['x<1,\\quad r=2', 'x<1\\Rightarrow r=2']) {
   const c = compileNestedMathTemplate({ template, parts: [] })
   for (const path of c.semanticRootBreakPaths) expect(c.ast.children[Number(path.split('/')[1])]).not.toMatchObject({type:'symbol',value:'='})
  }
 })


describe('UX05 resolved display is ordinary closed math, not a filled neutral slot', () => {
  it('restores the exact ordinary factorisation DOM, including both bracket sizes and binary + class', () => {
    const sign = { key: 'sign', kind: 'math', choices: [{ value: '+' }, { value: '-' }] }
    const c = compileNestedMathTemplate({ template: '(x-4)(x{sign}4)=0', parts: [sign], values: { sign: '+' }, certifiedKeys: ['sign'] })
    const ordinary = compileNestedMathTemplate({ template: '(x-4)(x+4)=0', parts: [] })
    expect(c.html).toBe(ordinary.html)
    expect(c.slots).toEqual([])
    expect(c.latex).not.toContain('\\rule')
    expect(c.resolvedParts).toEqual([{ key: 'sign', path: 'root/1/group/1', value: '+', source: 'slot' }])
  })
  it('preserves unary signs and natural relation/operator classes in their actual TeX context', () => {
    for (const [template, value, literal, role] of [
      ['x{p}4', '+', 'x+4', 'binary-operation'],
      ['x{p}4', '-', 'x-4', 'binary-operation'],
      ['x={p}', '-4', 'x=-4', 'operand'],
      ['x{p}0', '>', 'x>0', 'relation'],
    ]) {
      const c = compileNestedMathTemplate({ template, parts: [{ key: 'p', kind: 'math', role, choices: [{ value }] }], values: { p: value }, certifiedKeys: ['p'] })
      expect(c.html).toBe(compileNestedMathTemplate({ template: literal, parts: [] }).html)
    }
  })
  it('removes only certified reservations in mixed radicals, fractions and exponents', () => {
    const parts = ['a', 'b'].map(key => ({ key, kind: 'math', choices: [{ value: '2' }, { value: '3' }] }))
    for (const template of ['\\sqrt{{a}}+{b}', '\\frac{{a}}{{b}}', 'x^{a}+{b}']) {
      const c = compileNestedMathTemplate({ template, parts, values: { a: '2', b: '3' }, certifiedKeys: ['a'] })
      expect(c.slots.map(p => p.key)).toEqual(['b'])
      expect(c.slots[0].certified).toBe(false)
      expect(c.slots[0].envelope.heightEm).toBeGreaterThanOrEqual(44 / 18)
      expect(c.resolvedParts.map(p => p.key)).toEqual(['a'])
      const root = document.createElement('div'); root.innerHTML = c.html
      expect(bindNestedMathSlots(root, c)).toHaveLength(1)
      root.querySelector('.katex-html')!.textContent = 'different resolved math'
      expect(() => bindNestedMathSlots(root, c)).toThrow('COMPILED_DOM_MISMATCH')
    }
  })
  it('uses only proven values in public-state planning; wrong choices do not move neutral layout', () => {
    const parts = [{ key: 'a', kind: 'math', choices: [{ value: '2' }, { value: '12345' }] }]
    const initial = compileNeutralNestedMathTemplate({ template: '(x+{a})', parts })
    const wrong = compileNeutralNestedMathTemplate({ template: '(x+{a})', parts, values: { a: '12345' }, certifiedKeys: [] })
    expect(wrong.html).toBe(initial.html)
    const proven = compileNeutralNestedMathTemplate({ template: '(x+{a})', parts, values: { a: '2' }, certifiedKeys: ['a'] })
    expect(proven.slots).toHaveLength(0)
    expect(proven.html).toBe(compileNestedMathTemplate({ template: '(x+2)', parts: [] }).html)
    expect(proven.measurementOnly).toBe(true)
  })
})
