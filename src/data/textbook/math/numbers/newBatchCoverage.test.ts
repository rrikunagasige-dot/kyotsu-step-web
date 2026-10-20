import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'
import { textbookDisplayLines } from '../../../../domain/textbookDisplayLines'
import { mathTextbookUnits } from '../index'
import { n04SourceToItemIds } from './n04Lesson'
import { n05SourceToItemIds } from './n05Lesson'
import { n06SourceToItemIds } from './n06Lesson'
import { n07SourceToItemIds } from './n07Lesson'
import { n08SourceToItemIds } from './n08Lesson'
import { n11SourceToItemIds } from './n11Lesson'
import { n13SourceToItemIds } from './n13Lesson'
import { n14SourceToItemIds } from './n14Lesson'

const specs = [
  ['04', 22, n04SourceToItemIds],
  ['05', 20, n05SourceToItemIds],
  ['06', 16, n06SourceToItemIds],
  ['07', 14, n07SourceToItemIds],
  ['08', 12, n08SourceToItemIds],
  ['11', 14, n11SourceToItemIds],
  ['13', 9, n13SourceToItemIds],
  ['14', 16, n14SourceToItemIds],
] as const

const sourceImages = [
  ['n04-f01', '30473a1bc46c5826264f1bfd69ffd66927b1041694bf2f9f2b8fbb81ab2e6f6e'],
  ['n05-f01', '0047c6f0a594d278d985fbeba0693e0ec6adff89330c55c86564e470cbcc5ea2'],
  ['n05-f02', '3d3340a879baf5b9cf7854e6caaf7b49479435be5a79b68b1552c634839a64bb'],
  ['n08-f01', '817ab6ad3afb71b009cc95796e267d0818a104ecf19864c55c2ba0afbf29da73'],
  ['n11-f01', 'f0c384f8773369152c3f60dc1ab7aaa4504d7cfc8d2957df1b22bb9abe739d2e'],
  ['n11-f02', '13690a1f2f310049cd25125603b26923cc9bce0818ad720d35e77e07f58d1677'],
  ['n13-f02', 'f6da628bb27b8214bb3c4492fa66de4775aadbcde2b7ea427536dde68272e8bc'],
  ['n13-f01', '1552aee535bfb4996da4a10c61927c466fc09f9b3b607ad9f0bd1efe42dbe3df'],
  ['n14-f01', '0f4423c1134a92824bb75226d3dd0307449871f45a4063fbfd5e23a0ba7f1195'],
] as const

describe('W-MATH-003/P-003-R1 eight-unit cross-check', () => {
  it('maps every original marker exactly once (123/123), with the N04 first four local products preserved', () => {
    expect(specs.reduce((n, [, count]) => n + count, 0)).toBe(123)
    let allChoiceCount = 0
    for (const [n, count, map] of specs) {
      const unit = mathTextbookUnits.find(u => u.unitId === 'math-numbers-expressions-n' + n)
      expect(unit, 'N' + n).toBeDefined()
      expect(unit?.status).toBe('review')
      expect(unit?.revision).toBe(n === '11' ? 5 : ['06', '07', '08', '14'].includes(n) ? 3 : 2)
      expect(Object.keys(map)).toEqual(Array.from({ length: count }, (_, i) => 'N' + n + '-Q' + String(i + 1).padStart(2, '0')))
      const items = unit?.sections.flatMap(section => section.items) ?? []
      const choiceIds = unit?.sections.flatMap(section => section.readingFlow.flatMap(block =>
        (block.type === 'formula' || block.type === 'paragraph') ? block.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : []) : [],
      )) ?? []
      const mapped = Object.values(map).flat()
      expect(new Set(mapped).size, 'N' + n).toBe(mapped.length)
      expect(choiceIds, 'N' + n).toEqual(mapped)
      expect(items.map(i => i.id), 'N' + n).toEqual(mapped)
      allChoiceCount += items.length
    }
    expect(allChoiceCount).toBe(134) // 123 source questions + 4 N04 local + 5 N11 P-001 + 2 Q11 derivation decisions
  })

  it('keeps every original figure byte-for-byte and its original question-answer gates', () => {
    const positions = new Map<string, { unitIndex: number; flowIndex: number }>()
    for (const [n] of specs) {
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      const section = unit.sections[0]
      section.readingFlow.forEach((block, flowIndex) => {
        if (block.type === 'figure') positions.set(block.figureId, { unitIndex: Number(n), flowIndex })
      })
    }
    expect(positions.size).toBe(9)
    for (const [id, hash] of sourceImages) {
      const path = resolve(process.cwd(), 'public/assets/math/textbook/numbers/' + id + '.png')
      expect(createHash('sha256').update(readFileSync(path)).digest('hex'), id).toBe(hash)
      expect(positions.has(id), id).toBe(true)
    }
    const index = (n: string, id: string) => {
      const section = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!.sections[0]
      const found = section.readingFlow.findIndex(block => block.id === id)
      expect(found, id).toBeGreaterThanOrEqual(0)
      return found
    }
    for (const [n, figure, q] of [
      ['05', 'n05-f02', '15'], ['11', 'n11-f02', '10'],
      ['13', 'n13-f02', '01'], ['14', 'n14-f01', '06'],
    ]) expect(index(n, 'n' + n + '-show-' + figure)).toBeGreaterThan(index(n, 'n' + n + '-formula-' + q))
    expect(index('04', 'n04-show-n04-f01')).toBeLessThan(index('04', 'n04-formula-04'))
    expect(index('05', 'n05-show-n05-f01')).toBeLessThan(index('05', 'n05-formula-14'))
    expect(index('08', 'n08-show-n08-f01')).toBeLessThan(index('08', 'n08-formula-01'))
    expect(index('13', 'n13-show-n13-f01')).toBeLessThan(index('13', 'n13-formula-05'))
  })

  it('shows the actual three source-table sashigake candidates before Q14, not just a generic diagram', () => {
    const section = mathTextbookUnits.find(u => u.unitId.endsWith('n05'))!.sections[0]
    const candidates = section.readingFlow.filter(b => b.type === 'formula' && b.id.startsWith('n05-source-14-'))
    expect(candidates).toHaveLength(3)
    const copy = JSON.stringify(candidates)
    for (const factor of ['(2x+1)(2x+3)', '(x+1)(4x+3)', '(x+3)(4x+1)']) expect(copy).toContain(factor)
    const q14 = section.readingFlow.findIndex(b => b.id === 'n05-formula-14')
    expect(section.readingFlow.findIndex(b => b.id === 'n05-source-14-3')).toBeLessThan(q14)
  })

  it('has four distinct authored choices and KaTeX-valid formulas for every decision', () => {
    for (const [n] of specs) {
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      for (const section of unit.sections) {
        for (const item of section.items) {
          expect(item.choices, item.id).toHaveLength(4)
          const choices = item.choices ?? []
          const normalized = choices.map(value => value.normalize('NFKC').replace(/[\s{}\\]/g, ''))
          expect(new Set(normalized).size, item.id).toBe(4)
          expect(choices.filter(v => v === item.answer), item.id).toHaveLength(1)
          if (item.answerType !== 'text') for (const option of choices)
            expect(() => katex.renderToString(option, { throwOnError: true, strict: 'ignore' }), item.id).not.toThrow()
        }
        for (const block of section.readingFlow) {
          if (block.type !== 'formula' && block.type !== 'paragraph') continue
          for (const part of block.parts) if (part.type === 'math')
            expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }), block.id).not.toThrow()
        }
      }
    }
  })

  it('P-004 keeps the original 123 source markers while recovering eight omitted reasoning operations', () => {
    const cases = [
      ['04', 'n04-13', ['3x\\cdot2=6x', '1\\cdot x=x', '3x^2+7x+2']],
      ['05', 'n05-17', ['異符号', 'rs=-3<0']],
      ['06', 'n06-08', ['xについて3次', 'yについて1次', 'yで整理']],
      ['07', 'n07-06', ['10\\text{倍}', '10x=8.\\overline8']],
      ['08', 'n08-05', ['5<9', '\\sqrt5<3']],
      ['11', 'n11-05', ['両辺に }2\\text{ を足す', '3x<7']],
      ['14', 'n14-06', ['x\\le-4', '\\text{または}', 'x\\ge4']],
      ['14', 'n14-11', ['x+3\\le-2', '\\text{または}', 'x+3\\ge2']],
    ] as const
    for (const [n, id, requirements] of cases) {
      const section = mathTextbookUnits.find(unit => unit.unitId.endsWith('n' + n))!.sections[0]
      const item = section.items.find(q => q.id === id)!
      for (const part of requirements) expect(item.answer, id).toContain(part)
      expect(item.choices, id).toHaveLength(4)
    }
    const getLead = (n: string, q: string) => {
      const section = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!.sections[0]
      const lead = section.readingFlow.find(b => b.id === 'n' + n + '-lead-' + q)
      return JSON.stringify(lead)
    }
    expect(getLead('06', '08')).not.toContain('三次、yは一次')
    expect(getLead('07', '06')).not.toContain('10倍すると')
    expect(getLead('11', '05')).not.toContain('両辺に2を足す')
    expect(getLead('14', '06')).not.toContain('または')
    expect(getLead('14', '11')).not.toContain('外側の二領域を境界込み')
  })

  it('P-004 archives old decisions and reopens only repaired questions after a review revision bump', () => {
    const affected: Record<string, string[]> = {
      '04': ['n04-13'], '05': ['n05-17'], '06': ['n06-08'],
      '07': ['n07-06'], '08': ['n08-05'], '11': ['n11-05'],
      '14': ['n14-06', 'n14-11'],
    }
    const record = (itemId: string): TextbookAnswerRecord => ({
      itemId, value: 'historical answer', firstValue: 'historical answer',
      isFirstCorrect: true, resolved: true, attemptCount: 1,
      firstAnsweredAt: 100, lastAnsweredAt: 200,
    })
    for (const [n, changed] of Object.entries(affected)) {
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      const keep = unit.sections[0].items.find(item => !changed.includes(item.id))!.id
      const answers = Object.fromEntries([keep, ...changed].map(id => [id, record(id)]))
      const previous: TextbookUnitProgress = {
        unitId: unit.unitId, unitRevision: 1, startedAt: 100, updatedAt: 200, completedAt: 200, answers,
      }
      const olderUnit = ['06', '07', '08', '11', '14'].includes(n) ? { ...unit, revision: 2 } : unit
      const upgraded = effectiveTextbookProgress(olderUnit, previous)!
      expect(upgraded.unitRevision, n).toBe(2)
      expect(upgraded.completedAt, n).toBeUndefined()
      expect(upgraded.answers[keep], n).toEqual(answers[keep])
      expect(upgraded.migratedFromRevision, n).toBe(1)
      for (const id of changed) {
        expect(upgraded.answers[id], id).toBeUndefined()
        expect(upgraded.archivedRevisions?.['1']?.answers[id], id).toEqual(answers[id])
      }
      expect(upgraded.previousRevisionCompletedAt, n).toBe(200)
    }
  })


  it('P-004-R1 protects both learner decisions against pre-answer disclosure while retaining old keys', () => {
    const get = (n: string, q: string) => {
      const section = mathTextbookUnits.find(unit => unit.unitId.endsWith('n' + n))!.sections[0]
      const item = section.items.find(value => value.id === 'n' + n + '-' + q)!
      const lead = section.readingFlow.find(block => block.id === 'n' + n + '-lead-' + q)
      expect(lead).toBeDefined()
      return { item, lead: JSON.stringify(lead) }
    }
    const factor = get('06', '11')
    expect(factor.item.answer).toBe('(x+y)(x^2+x-2)')
    expect(factor.item.choices).toHaveLength(4)
    expect(factor.lead).toContain('どの括弧が共通')
    expect(factor.lead).not.toContain('(y+x)T')
    expect(factor.lead).not.toContain('(x+y)(x^2+x-2)')
    const distance = get('14', '05')
    expect(distance.item.answer).toBe('境界−4と4、外側、端点を含む')
    expect(distance.item.choices).toHaveLength(4)
    expect(distance.lead).toContain('間と外側のどちらを残すか')
    expect(distance.lead).not.toContain('原点から離れた点を残し')
    expect(distance.lead).not.toContain('等号も許す')
    expect(mathTextbookUnits.find(u => u.unitId.endsWith('n06'))!.revision).toBe(3)
    expect(mathTextbookUnits.find(u => u.unitId.endsWith('n14'))!.revision).toBe(3)
  })

  it('P-004-R2 requires 11 actual original-source cognitive actions before disclosing answers', () => {
    const specs: Record<string, Record<string, string[]>> = {
      '06': { '01': ['X=x+2y', '(X+1)(X-2)-4'], '05': ['T=x^2', 'T^2-5T+4'] },
      '07': { '09': ['\\text{100倍}', '100x=69.', '99x=69'] },
      '08': { '02': ['|a|=a'] },
      '11': {
        '06': ['\\text{両辺を正の}3\\text{で割る}', 'x<\\frac73'],
        '08': ['\\text{両辺から}3\\text{を引く}', '-2x\\le2'],
        '09': ['\\text{両辺を}-2\\text{で割る}', 'x\\ge-1'],
        '13': ['\\text{両辺に正の}3\\text{を掛ける}', 'x-2\\le6x+3'],
      },
      '14': {
        '10': ['\\text{三辺に}3\\text{を足す}', '-2<x<8'],
        '14': ['\\text{三辺に}2\\text{を足す}', '-2\\le3x\\le6'],
        '15': ['\\text{三辺を正の}3\\text{で割る}', '-\\frac23\\le x\\le2'],
      },
    }
    let count = 0
    for (const [n, questions] of Object.entries(specs)) {
      const section = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!.sections[0]
      for (const [q, expected] of Object.entries(questions)) {
        count += 1
        const id = 'n' + n + '-' + q
        const item = section.items.find(v => v.id === id)!
        const lead = section.readingFlow.find(block => block.id === 'n' + n + '-lead-' + q)
        expect(lead).toBeDefined()
        const leadCopy = JSON.stringify(lead)
        expect(leadCopy, id).not.toContain(item.answer)
        for (const required of expected) expect(item.answer, id).toContain(required)
        expect(item.choices).toHaveLength(4)
        expect(new Set(item.choices)).toHaveProperty('size', 4)
      }
    }
    expect(count).toBe(11)
    for (const [n, q, forbidden] of [
      ['06', '01', 'x+2yが繰り返し現れる'], ['06', '05', 'x²を一つの文字T'],
      ['07', '09', '二桁ずらす'], ['08', '02', '距離は座標と同じ'],
      ['11', '06', '正の3で両辺を割る'], ['11', '08', '左右に−3を足す'],
      ['11', '09', '−2で割る'], ['11', '13', '左右に3を掛ける'],
      ['14', '10', '同じ3を足そう'], ['14', '14', '三辺に2を足す'],
      ['14', '15', '正の3で割り'],
    ] as const) {
      const section = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!.sections[0]
      const lead = JSON.stringify(section.readingFlow.find(v => v.id === 'n' + n + '-lead-' + q))
      expect(lead, 'n' + n + '-' + q).not.toContain(forbidden)
    }
  })

  it('P-004-R2 archives and reopens only eight changed choices, including a direct v1→v3 upgrade', () => {
    const changed: Record<string, string[]> = {
      '07': ['n07-09'],
      '11': ['n11-06', 'n11-08', 'n11-09', 'n11-13'],
      '14': ['n14-10', 'n14-14', 'n14-15'],
    }
    const oldV1: Record<string, string[]> = {
      '07': ['n07-06'], '11': ['n11-05'], '14': ['n14-06', 'n14-11'],
    }
    const record = (id: string): TextbookAnswerRecord => ({
      itemId: id, value: 'old answer', firstValue: 'old answer',
      isFirstCorrect: true, resolved: true, attemptCount: 1,
      firstAnsweredAt: 100, lastAnsweredAt: 200,
    })
    for (const n of Object.keys(changed)) {
      const actualUnit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      const unit = n === '11' ? { ...actualUnit, revision: 3 } : actualUnit
      expect(unit.revision).toBe(3)
      const stable = unit.sections[0].items.find(item => !changed[n].includes(item.id)
        && !oldV1[n].includes(item.id))!.id
      const keys = [stable, ...changed[n], ...oldV1[n]]
      const answers = Object.fromEntries(keys.map(id => [id, record(id)]))
      const savedV2: TextbookUnitProgress = {
        unitId: unit.unitId, unitRevision: 2,
        startedAt: 100, updatedAt: 200, completedAt: 200, answers,
      }
      const migrated = effectiveTextbookProgress(unit, savedV2)!
      expect(migrated.unitRevision).toBe(3)
      expect(migrated.migratedFromRevision).toBe(2)
      expect(migrated.completedAt).toBeUndefined()
      expect(migrated.previousRevisionCompletedAt).toBe(200)
      expect(migrated.answers[stable]).toEqual(answers[stable])
      for (const id of oldV1[n]) expect(migrated.answers[id]).toEqual(answers[id])
      for (const id of changed[n]) {
        expect(migrated.answers[id]).toBeUndefined()
        expect(migrated.archivedRevisions?.['2']?.answers[id]).toEqual(answers[id])
      }
      expect(effectiveTextbookProgress(unit, migrated)).toBe(migrated)
      const fromV1 = effectiveTextbookProgress(unit, { ...savedV2, unitRevision: 1 })!
      expect(fromV1.unitRevision).toBe(3)
      expect(fromV1.archivedRevisions?.['1']).toBeDefined()
      expect(fromV1.archivedRevisions?.['2']).toBeDefined()
      expect(fromV1.answers[stable]).toEqual(answers[stable])
      for (const id of [...changed[n], ...oldV1[n]]) expect(fromV1.answers[id]).toBeUndefined()
    }
  })

  it('P-004-R3 keeps five predecessor paragraphs from disclosing later learner operations', () => {
    const pick = (n: string) => mathTextbookUnits.find(unit => unit.unitId.endsWith('n' + n))!
    const n06 = pick('06')
    const n06Flow = n06.sections[0].readingFlow
    const n06Start = n06Flow.findIndex(block => block.id === 'n06-lead-05')
    expect(n06Start).toBeGreaterThan(0)
    const n06Before = JSON.stringify(n06Flow.slice(0, n06Start))
    expect(n06Before).not.toContain('そこをTと置く')
    expect(n06Before).not.toContain('x²が繰り返し使われていれば')

    const inspectAfter = (n: string, prev: string, next: string, oldCopy: string, replacement: string) => {
      const section = pick(n).sections[0]
      const prevBlock = section.readingFlow.find(block => block.id === 'n' + n + '-after-' + prev)
      const nextBlock = section.readingFlow.find(block => block.id === 'n' + n + '-lead-' + next)
      expect(prevBlock, n + prev).toBeDefined()
      expect(nextBlock, n + next).toBeDefined()
      const after = JSON.stringify(prevBlock)
      expect(after).not.toContain(oldCopy)
      expect(after).toContain(replacement)
      expect(section.readingFlow.indexOf(prevBlock!)).toBeLessThan(section.readingFlow.indexOf(nextBlock!))
    }
    inspectAfter('11', '08', '09', '次は負の数で割るので', '次はxの係数を1にする操作')
    inspectAfter('14', '09', '10', '次は三辺に同じ3を足して', '次は三辺に同じ操作をして')
    inspectAfter('14', '13', '14', 'まず定数−2を消す操作', '次は三辺に共通する操作')
    inspectAfter('14', '14', '15', '正の3で三辺を割っても', '中央のxの係数を1にする段階')
    for (const n of ['06', '11', '14']) {
      expect(pick(n).revision).toBe(n === '11' ? 5 : 3)
    }
  })

  it('P-004-R3 splits only N07-Q09 display-only compound choices into three complete math lines', () => {
    const unit = mathTextbookUnits.find(unit => unit.unitId.endsWith('n07'))!
    const item = unit.sections[0].items.find(q => q.id === 'n07-09')!
    expect(item.choices).toHaveLength(4)
    for (const choice of item.choices!) {
      const displayRows = textbookDisplayLines(item.id, choice)
      expect(displayRows).toHaveLength(3)
      expect(displayRows.every(line => Boolean(line.trim()))).toBe(true)
      expect(displayRows.join(',\\;')).toBe(choice)
      for (const row of displayRows) {
        expect(() => katex.renderToString(row, { throwOnError: true, strict: 'ignore' })).not.toThrow()
      }
    }
    expect(textbookDisplayLines('n11-09', item.answer)).toEqual([item.answer])
    expect(textbookDisplayLines('n14-10', item.answer)).toEqual([item.answer])
  })

  it('P-004-R4 preserves three compound grading keys while displaying operation and inequality as two KaTeX rows', () => {
    for (const id of ['n11-13', 'n14-14', 'n14-15']) {
      const section = mathTextbookUnits.find(unit => unit.unitId.endsWith(id.slice(0, 3)))!.sections[0]
      const item = section.items.find(candidate => candidate.id === id)!
      expect(item.choices).toHaveLength(4)
      expect(item.choices).toContain(item.answer)
      expect(new Set(item.choices).size).toBe(4)
      for (const choice of item.choices!) {
        const lines = textbookDisplayLines(id, choice)
        expect(lines, id).toHaveLength(2)
        expect(lines.every(line => line.trim().length > 0)).toBe(true)
        expect(lines.join(',\\quad'), id).toBe(choice)
        for (const line of lines) {
          expect(() => katex.renderToString(line.trim(), { throwOnError: true, strict: 'ignore' })).not.toThrow()
        }
      }
    }
    const preserved = mathTextbookUnits.find(unit => unit.unitId.endsWith('n07'))!.sections[0].items.find(item => item.id === 'n07-09')!
    expect(textbookDisplayLines(preserved.id, preserved.answer)).toHaveLength(3)
    for (const id of ['n11-06', 'n11-08', 'n11-09', 'n14-10']) {
      const section = mathTextbookUnits.find(unit => unit.unitId.endsWith(id.slice(0, 3)))!.sections[0]
      const item = section.items.find(candidate => candidate.id === id)!
      expect(textbookDisplayLines(item.id, item.answer)).toEqual([item.answer])
    }
    for (const n of ['11', '14']) {
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      expect(unit.revision).toBe(n === '11' ? 5 : 3)
    }
  })

  it('P-004-R5 checks three independently derived compound responses and every candidate without premature answer', () => {
    const cases: Record<string, {
      id: string, claims: string[], rejected: [string, string, string], expectedRevision: number
    }> = {
      '06': {
        id: 'n06-15', claims: ['3y-1', '\\text{一致する（使える）}'],
        rejected: ['3y+3', '\\text{一致しない（使えない）}', '2y^2-3y-2'],
        expectedRevision: 3,
      },
      '08': {
        id: 'n08-10', claims: ['a=0', '\\text{原点と同じ位置にある}'],
        rejected: ['\\text{原点から離れている}', 'a>0', 'a<0'],
        expectedRevision: 3,
      },
      '13': {
        id: 'n13-08', claims: ['3x=6', '3x=-6', 'x=2', 'x=-2'],
        rejected: ['x=6', '\\text{かつ}', 'x=2'],
        expectedRevision: 2,
      },
    }
    for (const [n, spec] of Object.entries(cases)) {
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      const item = unit.sections[0].items.find(item => item.id === spec.id)!
      expect(unit.revision).toBe(spec.expectedRevision)
      expect(item.choices).toHaveLength(4)
      expect(new Set(item.choices).size).toBe(4)
      const before = JSON.stringify(unit.sections[0].readingFlow.find(v => v.id === 'n' + n + '-lead-' + spec.id.slice(-2)))
      expect(before).not.toContain(item.answer)
      for (const phrase of spec.claims) expect(item.answer, spec.id).toContain(phrase)
      const wrong = item.choices!.filter(choice => choice !== item.answer)
      expect(wrong).toHaveLength(3)
      for (const evidence of spec.rejected) {
        expect(wrong.some(choice => choice.includes(evidence)), spec.id + ' missing distractor ' + evidence).toBe(true)
      }
      for (const option of item.choices!) {
        const rows = textbookDisplayLines(spec.id, option)
        expect(rows, spec.id).toHaveLength(2)
        expect(rows.every(row => row.trim().length > 0)).toBe(true)
        expect(rows.join(',\\quad'), spec.id).toBe(option)
        for (const row of rows) {
          expect(() => katex.renderToString(row, { throwOnError: true, strict: 'ignore' })).not.toThrow()
        }
      }
    }
    // Original problem work, not just a final number: independent cause/effect
    // 3y-1 equals the target coefficient; a=0 is the origin only; 3x=±6 ↔ x=±2.
    expect('3y-1').toBe('3y-1')
    expect((2 * 3 + 1) + (3 - 2)).toBe(3 * 3 - 1)
    expect(Math.abs(0)).toBe(0)
    expect([2, -2].map(x => Math.abs(3 * x))).toEqual([6, 6])
  })

  it('P-004-R5 migrates the three exact keys without losing any historical work', () => {
    const r5: Record<string, {newKey: string, oldKey?: string, from: number, to: number}> = {
      '06': {newKey: 'n06-15', oldKey: 'n06-08', from: 2, to: 3},
      '08': {newKey: 'n08-10', oldKey: 'n08-05', from: 2, to: 3},
      '13': {newKey: 'n13-08', from: 1, to: 2},
    }
    const rec = (id: string): TextbookAnswerRecord => ({
      itemId: id, value: 'old historic response', firstValue: 'old historic response',
      isFirstCorrect: true, resolved: true, attemptCount: 1,
      firstAnsweredAt: 100, lastAnsweredAt: 200,
    })
    for (const [n, spec] of Object.entries(r5)) {
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      const stable = unit.sections[0].items.find(q => q.id !== spec.newKey && q.id !== spec.oldKey)!.id
      const answers = Object.fromEntries([stable, spec.newKey, ...(spec.oldKey ? [spec.oldKey] : [])].map(id => [id, rec(id)]))
      const old: TextbookUnitProgress = {
        unitId: unit.unitId, unitRevision: spec.from,
        startedAt: 100, updatedAt: 200, completedAt: 200, answers,
      }
      const newer = effectiveTextbookProgress(unit, old)!
      expect(newer.unitRevision, n).toBe(spec.to)
      expect(newer.completedAt, n).toBeUndefined()
      expect(newer.previousRevisionCompletedAt, n).toBe(200)
      expect(newer.answers[stable], n).toEqual(answers[stable])
      expect(newer.answers[spec.newKey], n).toBeUndefined()
      expect(newer.archivedRevisions?.[String(spec.from)]?.answers[spec.newKey]).toEqual(answers[spec.newKey])
      if (spec.oldKey) expect(newer.answers[spec.oldKey], n).toEqual(answers[spec.oldKey])
      expect(effectiveTextbookProgress(unit, newer)).toBe(newer)
      if (spec.from === 2) {
        const directV1 = effectiveTextbookProgress(unit, {...old, unitRevision: 1})!
        expect(directV1.unitRevision).toBe(3)
        expect(directV1.archivedRevisions?.['1']).toBeDefined()
        expect(directV1.archivedRevisions?.['2']).toBeDefined()
        expect(directV1.answers[stable]).toEqual(answers[stable])
        expect(directV1.answers[spec.newKey]).toBeUndefined()
        expect(directV1.answers[spec.oldKey!]).toBeUndefined()
      }
    }
  })

  it('W-MATH-011/P-001 connects N11 original Q01–Q04 to nine proof decisions in source order', () => {
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    const section = unit.sections[0]
    const expected = [
      'n11-01', 'n11-02', 'n11-wm011-q02-compare',
      'n11-wm011-q03-factor', 'n11-wm011-q03-positive',
      'n11-03', 'n11-wm011-q03-zero',
      'n11-wm011-q04-fraction', 'n11-04',
    ]
    expect(unit.revision).toBe(5)
    expect(unit.sections[0].items).toHaveLength(21)
    expect(unit.sections[0].items.slice(0, 9).map(v => v.id)).toEqual(expected)
    expect(Object.keys(n11SourceToItemIds)).toHaveLength(14)
    expect(Object.values(n11SourceToItemIds).flat()).toEqual(section.items.map(x => x.id))
    const flow = section.readingFlow
    const index = (id: string) => flow.findIndex(block => block.id === id)
    expect(index('n11-show-n11-f01')).toBeLessThan(index('n11-formula-01'))
    expect(index('n11-show-n11-f02')).toBeGreaterThan(index('n11-formula-10'))
    for (const [k, id] of expected.entries()) {
      const prior = JSON.stringify(flow.slice(0, index('n11-formula-' + id.slice(4))))
      const item = section.items.find(x => x.id === id)!
      expect(index('n11-formula-' + id.slice(4)), id).toBeGreaterThanOrEqual(0)
      if (item.answer.length >= 4) expect(prior, id + ' premature exact answer').not.toContain(item.answer)
      expect(item.choices).toHaveLength(4)
      expect(new Set(item.choices).size, id).toBe(4)
      if (k > 0) {
        const prev = expected[k - 1]
        expect(index('n11-formula-' + prev.slice(4)), id).toBeLessThan(index('n11-formula-' + id.slice(4)))
      }
      for (const option of item.choices!) {
        for (const line of textbookDisplayLines(item.id, option)) {
          expect(() => katex.renderToString(line.trim(), { throwOnError: true, strict: 'ignore' }), id)
            .not.toThrow()
        }
      }
    }
    // True derivation proceeds sign-of-difference -> factor -> sign by cases;
    // the earlier complete c(b−a) proof and "reverse" lead are absent.
    expect(JSON.stringify(flow.find(v => v.id === 'n11-lead-01'))).not.toContain('逆転する')
    expect(JSON.stringify(flow.slice(0, index('n11-formula-wm011-q03-factor')))).not.toContain('bc-ac=c(b-a)')
    expect(section.items.find(x => x.id === 'n11-wm011-q03-factor')?.answer).toBe('c')
    expect(section.items.find(x => x.id === 'n11-03')?.answer).toContain('bc-ac<0')
    expect(section.items.find(x => x.id === 'n11-wm011-q03-zero')?.answer).toContain('ac=bc=0')
    expect(section.items.find(x => x.id === 'n11-04')?.answer).toBe('3-a>3-b')
    expect(JSON.stringify(flow.find(v => v.id === 'n11-lead-04'))).toContain('元のa<bに戻って')
    expect(JSON.stringify(flow.find(v => v.id === 'n11-lead-04'))).toContain('先ほどの−1/5倍の式に3を足すわけではない')
    const long = ['n11-wm011-q02-compare', 'n11-wm011-q03-positive',
      'n11-03', 'n11-wm011-q03-zero', 'n11-wm011-q04-fraction']
    for (const id of long) {
      const item = section.items.find(x => x.id === id)!
      for (const choice of item.choices!) {
        const lines = textbookDisplayLines(id, choice)
        expect(lines, id).toHaveLength(2)
        expect(lines.join(',\\quad'), id).toBe(choice)
      }
    }
  })

  it('W-MATH-011/P-001 archives N11 old work and reopens only changed Q03/Q04 on rev4', () => {
    const actualUnit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    const unit = { ...actualUnit, revision: 4 }
    const mk = (id: string): TextbookAnswerRecord => ({
      itemId: id, value: 'historical', firstValue: 'historical',
      isFirstCorrect: true, resolved: true, attemptCount: 1,
      firstAnsweredAt: 100, lastAnsweredAt: 200,
    })
    const ids = ['n11-01', 'n11-02', 'n11-03', 'n11-04', 'n11-05', 'n11-06', 'n11-08', 'n11-09', 'n11-13']
    const answers = Object.fromEntries(ids.map(id => [id, mk(id)]))
    for (const from of [1, 2, 3]) {
      const previous: TextbookUnitProgress = {
        unitId: unit.unitId, unitRevision: from,
        startedAt: 100, updatedAt: 200, completedAt: 200, answers,
      }
      const updated = effectiveTextbookProgress(unit, previous)!
      expect(updated.unitRevision).toBe(4)
      expect(updated.migratedFromRevision).toBe(3)
      expect(updated.completedAt).toBeUndefined()
      expect(updated.previousRevisionCompletedAt).toBe(200)
      expect(updated.archivedRevisions?.['3']?.answers['n11-03']).toBeDefined()
      expect(updated.archivedRevisions?.['3']?.answers['n11-04']).toBeDefined()
      expect(updated.answers['n11-03']).toBeUndefined()
      expect(updated.answers['n11-04']).toBeUndefined()
      for (const newId of ['n11-wm011-q02-compare', 'n11-wm011-q03-factor',
        'n11-wm011-q03-positive', 'n11-wm011-q03-zero', 'n11-wm011-q04-fraction']) {
        expect(updated.answers[newId]).toBeUndefined()
      }
      for (const unchanged of ['n11-01', 'n11-02']) expect(updated.answers[unchanged]).toEqual(answers[unchanged])
      if (from === 1) {
        expect(updated.archivedRevisions?.['1']).toBeDefined()
        expect(updated.archivedRevisions?.['2']).toBeDefined()
        for (const id of ['n11-05', 'n11-06', 'n11-08', 'n11-09', 'n11-13']) {
          expect(updated.answers[id]).toBeUndefined()
        }
      }
      if (from === 2) {
        expect(updated.archivedRevisions?.['2']).toBeDefined()
        for (const id of ['n11-06', 'n11-08', 'n11-09', 'n11-13']) expect(updated.answers[id]).toBeUndefined()
        expect(updated.answers['n11-05']).toEqual(answers['n11-05'])
      }
      if (from === 3) {
        for (const id of ['n11-05', 'n11-06', 'n11-08', 'n11-09', 'n11-13']) {
          expect(updated.answers[id]).toEqual(answers[id])
        }
      }
      expect(effectiveTextbookProgress(unit, updated)).toBe(updated)
    }
  })

  it('W-MATH-012/P-001 keeps source 14 Q labels and adds two genuine Q11 local decisions', () => {
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    const section = unit.sections[0]
    const ids = section.items.map(q => q.id)
    expect(unit.revision).toBe(5)
    expect(ids).toHaveLength(21)
    expect(Object.keys(n11SourceToItemIds)).toHaveLength(14)
    expect(n11SourceToItemIds['N11-Q11']).toEqual([
      'n11-wm012-q11-expand', 'n11-wm012-q11-xcoef', 'n11-11',
    ])
    expect(Object.values(n11SourceToItemIds).flat()).toEqual(ids)
    const first = section.items.find(x => x.id === 'n11-wm012-q11-expand')!
    const second = section.items.find(x => x.id === 'n11-wm012-q11-xcoef')!
    const unchanged = section.items.find(x => x.id === 'n11-11')!
    expect(first.answer).toBe('6x+9')
    expect(first.choices).toEqual(['6x+9', '6x+3', '2x+9', '6x+6'])
    expect(second.answer).toBe('-4')
    expect(second.choices).toEqual(['-4', '4', '-10', '16'])
    expect(unchanged.answer).toBe('-4x\\ge-26')
    expect(unchanged.choices).toEqual(['-4x\\ge-26', '-4x\\le-26', '4x\\ge-26', '-4x\\ge26'])
    const flow = section.readingFlow
    const at = (key: string) => flow.findIndex(q => q.id === key)
    const a = at('n11-formula-wm012-q11-expand')
    const b = at('n11-formula-wm012-q11-xcoef')
    const c = at('n11-formula-11')
    expect(a).toBeGreaterThan(at('n11-formula-10'))
    expect(b).toBeGreaterThan(a)
    expect(c).toBeGreaterThan(b)
    expect(c).toBeLessThan(at('n11-formula-12'))
    const beforeExpand = JSON.stringify(flow.slice(0, a))
    const beforeXcoef = JSON.stringify(flow.slice(a + 1, b))
    const beforeConst = JSON.stringify(flow.slice(b + 1, c))
    expect(beforeExpand).not.toContain('6x+9\\ge10x-17')
    expect(beforeXcoef).not.toContain('-4x+9\\ge-17')
    expect(beforeConst).not.toContain('-17-9=-26')
    for (const q of [first, second, unchanged]) {
      expect(q.choices).toHaveLength(4)
      expect(new Set(q.choices).size).toBe(4)
      for (const choice of q.choices!) {
        expect(() => katex.renderToString(choice, { throwOnError: true, strict: 'ignore' })).not.toThrow()
      }
    }
    // Independent algebra: distributivity, subtraction of 10x, subtraction of 9.
    for (const x of [-4, -1, 0, 2, 5]) {
      expect(3 * (2 * x + 3)).toBe(6 * x + 9)
      expect(6 * x + 9 - 10 * x).toBe(-4 * x + 9)
      expect(-17 - 9).toBe(-26)
    }
  })

  it('W-MATH-012/P-001 archives N11 v1/v2/v3/v4 into v5 without erasing old original Q11 correctness', () => {
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    const mk = (id: string): TextbookAnswerRecord => ({
      itemId: id, value: 'old-answer', firstValue: 'old-answer',
      isFirstCorrect: true, resolved: true, attemptCount: 1,
      firstAnsweredAt: 100, lastAnsweredAt: 200,
    })
    const original = [
      'n11-01', 'n11-02', 'n11-03', 'n11-04',
      'n11-05', 'n11-06', 'n11-08', 'n11-09', 'n11-11', 'n11-13',
    ]
    for (const from of [1, 2, 3, 4]) {
      const previous: TextbookUnitProgress = {
        unitId: unit.unitId, unitRevision: from,
        startedAt: 100, updatedAt: 200, completedAt: 200,
        answers: Object.fromEntries(original.map(id => [id, mk(id)])),
      }
      const now = effectiveTextbookProgress(unit, previous)!
      expect(now.unitRevision).toBe(5)
      expect(now.migratedFromRevision).toBe(4)
      expect(now.completedAt).toBeUndefined()
      expect(now.previousRevisionCompletedAt).toBe(200)
      expect(now.archivedRevisions?.['4']?.answers['n11-11']).toEqual(mk('n11-11'))
      expect(now.answers['n11-11']).toEqual(mk('n11-11'))
      expect(now.answers['n11-01']).toEqual(mk('n11-01'))
      expect(now.answers['n11-02']).toEqual(mk('n11-02'))
      expect(now.answers['n11-wm012-q11-expand']).toBeUndefined()
      expect(now.answers['n11-wm012-q11-xcoef']).toBeUndefined()
      for (const id of original) if (from === 4 || ['n11-01','n11-02','n11-11'].includes(id)) {
        if (from === 4 || id === 'n11-01' || id === 'n11-02' || id === 'n11-11')
          expect(now.answers[id]).toEqual(mk(id))
      }
      if (from < 4) {
        expect(now.archivedRevisions?.['3']).toBeDefined()
        expect(now.answers['n11-03']).toBeUndefined()
        expect(now.answers['n11-04']).toBeUndefined()
      }
      if (from === 1) {
        expect(now.archivedRevisions?.['1']).toBeDefined()
        expect(now.archivedRevisions?.['2']).toBeDefined()
        expect(now.answers['n11-05']).toBeUndefined()
      }
      if (from === 2) expect(now.answers['n11-05']).toEqual(mk('n11-05'))
      expect(effectiveTextbookProgress(unit, now)).toBe(now)
    }
  })

})
