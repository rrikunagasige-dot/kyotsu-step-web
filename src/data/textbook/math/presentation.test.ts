import { describe, it, expect } from 'vitest'
import { mathSetUnit } from './set/setLesson'
import { mathSetReadingStages, partitionMathSetReadingFlow, mathSetRequiredContextByItemId, requiredMathSetContext } from './presentation'

describe('math-sets view-only stages', () => {
  const section = mathSetUnit.sections[0]
  const stages = partitionMathSetReadingFlow(section.readingFlow)
  it('covers EVERY original block once in the original order, including uninteractive prose', () => {
    expect(stages.flatMap(x=>x.blocks.map(b=>b.id))).toEqual(section.readingFlow.map(b=>b.id))
    expect(new Set(stages.flatMap(x=>x.blocks.map(b=>b.id))).size).toBe(section.readingFlow.length)
    expect(stages.map(x=>x.id)).toEqual(mathSetReadingStages.map(x=>x.id))
  })
  it('keeps the correct first/last semantic chapter anchors and original three titles', () => {
    expect(stages[0].blocks[0].id).toBe('heading-represent')
    expect(stages.at(-1)?.blocks[0].id).toBe('marker-summary-sets')
    expect(stages.flatMap(x=>x.blocks).filter(b=>b.type==='heading').map(b=>b.text)).toEqual([
      '第1部　集合を表す','第2部　集合どうしの関係を見る','第3部　集合の外側まで考える',
    ])
  })
  it('includes the definition AFTER a01 in the current first stage, never hides it on answer', () => {
    const ids=stages[0].blocks.map(b=>b.id)
    expect(ids.indexOf('paragraph-a01')).toBeLessThan(ids.indexOf('paragraph-set-concept'))
    expect(ids.indexOf('paragraph-set-concept')).toBeLessThan(ids.indexOf('formula-set-a'))
    expect(stages[1].blocks[0].id).toBe('dialogue-teacher-membership')
  })
  it('preserves all source choice item ids without altering answers or review units', () => {
    const choiceIds=(blocks: readonly typeof section.readingFlow[number][]) => blocks.flatMap(block => {
      if (block.type==='paragraph'||block.type==='formula') return block.parts.filter(p=>p.type==='choice').map(p=>p.itemId)
      return []
    })
    expect(choiceIds(stages.flatMap(stage=>stage.blocks))).toEqual(choiceIds(section.readingFlow))
    expect(mathSetUnit.revision).toBe(2)
    expect(mathSetUnit.status).toBe('published')
  })
  it('does not split mathematical derivation chains and refuses missing/duplicated anchor', () => {
    expect(stages.length).toBe(15)
    const damaged=section.readingFlow.filter(x=>x.id!=='heading-represent')
    expect(()=>partitionMathSetReadingFlow(damaged)).toThrow()
    expect(()=>partitionMathSetReadingFlow([...section.readingFlow,section.readingFlow[0]])).toThrow()
  })
  it('references only earlier, already-authored blocks and retains every original source figure', () => {
    const index=new Map(stages.flatMap((stage,i)=>stage.blocks.map(b=>[b.id,i] as const)))
    const itemStage = new Map(stages.flatMap((stage,i)=>stage.blocks.flatMap(block =>
      block.type==='paragraph'||block.type==='formula'
        ? block.parts.filter(part=>part.type==='choice').map(part=>[part.itemId,i] as const)
        : [],
    )))
    for (const [itemId, required] of Object.entries(mathSetRequiredContextByItemId)) {
      const target = itemStage.get(itemId)
      expect(target, itemId).toBeDefined()
      expect(required.length, itemId).toBeGreaterThan(0)
      expect(new Set(required).size, itemId).toBe(required.length)
      for (const id of required) {
        expect(index.has(id), id).toBe(true)
        expect(index.get(id)!, id + ' must precede ' + itemId).toBeLessThan(target!)
      }
    }
    expect(stages.flatMap(stage=>stage.blocks.filter(b=>b.type==='figure').map(b=>b.figureId))).toEqual(
      section.readingFlow.filter(b=>b.type==='figure').map(b=>b.figureId))
  })
  it('imports only the requirements of the currently unanswered item, not an entire previous stage', () => {
    expect(requiredMathSetContext(null)).toEqual([])
    expect(requiredMathSetContext('set-a01')).toEqual([])
    expect(requiredMathSetContext('set-d03')).toEqual(['paragraph-universal-concept', 'formula-d-b'])
    expect(requiredMathSetContext('set-d04')).toEqual(['formula-d-a', 'formula-d-b'])
    expect(requiredMathSetContext('set-d06')).toEqual(['formula-d-abar', 'formula-d-b'])
    expect(requiredMathSetContext('set-d11b')).toEqual(['paragraph-universal-concept'])
    expect(requiredMathSetContext('set-b03')).toEqual(['formula-b-sets'])
    expect(requiredMathSetContext('set-c04')).toEqual(['formula-c-sets'])
    expect(requiredMathSetContext('set-f07')).toEqual(['formula-f-sets', 'figure-f-b'])
    expect(requiredMathSetContext('set-f09')).toEqual(['formula-f-sets'])
  })
  it('never imports future De Morgan answers or its finished figures into a prerequisite', () => {
    const future = new Set(stages.slice(10).flatMap(stage=>stage.blocks.map(block=>block.id)))
    for (const [itemId, refs] of Object.entries(mathSetRequiredContextByItemId)) {
      if (itemId.startsWith('set-d')) for (const ref of refs) expect(future.has(ref), ref).toBe(false)
    }
  })

})
