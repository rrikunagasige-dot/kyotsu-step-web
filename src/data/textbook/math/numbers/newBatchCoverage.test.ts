import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'
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
      expect(unit?.revision).toBe(n === '13' ? 1 : 2)
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
    expect(allChoiceCount).toBe(127) // 123 original markers + 4 local N04-Q01 product holes
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

  it('P-004 keeps 123 source markers/127 decisions while recovering eight omitted reasoning operations', () => {
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
      const upgraded = effectiveTextbookProgress(unit, previous)!
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

})
