import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { mathNumbersNE01Unit, ne01SourceToItemIds } from './ne01Lesson'
import { mathNumbersNE02Unit, ne02SourceToItemIds } from './ne02Lesson'
import { developmentFeedback } from './developmentFeedback'
import { getTextbookChoices, answerTextbookItem, type TextbookUnitProgress } from '../../../../domain/textbook'
import { textbookDisplayLines } from '../../../../domain/textbookDisplayLines'
import { extractReviewSection, reviewTargets } from '../../../../review/reviewTargets'

const cases = [
  { unit: mathNumbersNE01Unit, mapping: ne01SourceToItemIds, count: 13 },
  { unit: mathNumbersNE02Unit, mapping: ne02SourceToItemIds, count: 12 },
]
describe('P005 source coverage and real lesson contracts', () => {
  it.each(cases)('$unit.unitId covers each original marker once, compiles all options and keeps gated review slices valid', ({unit, mapping, count}) => {
    expect(unit.status).toBe('review')
    expect(unit.revision).toBe(1)
    const section=unit.sections[0]
    expect(section.figures).toHaveLength(0)
    expect(section.items).toHaveLength(count)
    expect(Object.keys(mapping)).toHaveLength(count)
    expect(Object.values(mapping).flat()).toEqual(section.items.map(item=>item.id))
    let progress: TextbookUnitProgress | undefined
    for(const item of section.items) {
      const block=section.readingFlow.find(b=>(b.type==='formula'||b.type==='paragraph')&&b.parts.some(p=>p.type==='choice'&&p.itemId===item.id))!
      const at=section.readingFlow.indexOf(block)
      expect(JSON.stringify(section.readingFlow.slice(0,at))).not.toContain(JSON.stringify({type:'math',latex:item.answer}))
      expect(item.choices).toHaveLength(3)
      expect(new Set(item.choices).size).toBe(3)
      for(const choice of item.choices!) {
        expect(()=>katex.renderToString(choice,{throwOnError:true,strict:'ignore'})).not.toThrow()
        for(const line of textbookDisplayLines(item.id,choice))expect(()=>katex.renderToString(line,{throwOnError:true,strict:'ignore'})).not.toThrow()
      }
      const visible=getTextbookChoices(unit,item)
      expect(visible.filter(c=>c===item.answer)).toHaveLength(1)
      for(const choice of visible.filter(c=>c!==item.answer)){
        expect(developmentFeedback(item.id,choice)).toBeTruthy()
        progress=answerTextbookItem(progress,unit,item,choice,100)
        expect(progress.answers[item.id].resolved).toBe(false)
      }
      progress=answerTextbookItem(progress,unit,item,item.answer,200)
      expect(progress.answers[item.id]).toMatchObject({value:item.answer,isFirstCorrect:false,resolved:true,attemptCount:visible.length})
      const [prefix,num]=item.id.split('-'),target=reviewTargets[prefix+'-q'+num]
      expect(extractReviewSection(unit,target)?.items).toEqual([item])
      expect(target.markBlockIds).toEqual([prefix+'-formula-'+num])
      expect(extractReviewSection({...unit,revision:2},target)).toBeNull()
    }
    expect(progress?.completedAt).toBeTruthy()
  })

  it('keeps the actual two original problem expressions in the first compound review slice', () => {
    const section=extractReviewSection(mathNumbersNE01Unit,reviewTargets['ne01-q12'])!
    expect(JSON.stringify(section.readingFlow)).toContain('x^3-1')
    expect(JSON.stringify(section.readingFlow)).toContain('27y^3')
  })

  it('keeps the sum/product step free of its unseen numerical result',()=>{
    const flow=mathNumbersNE02Unit.sections[0].readingFlow
    const before=flow.slice(flow.findIndex(b=>b.id==='ne02-heading-05'),flow.findIndex(b=>b.id==='ne02-formula-06'))
    expect(JSON.stringify(before)).not.toContain('20')
    expect(JSON.stringify(before)).not.toContain('5と4')
    expect(developmentFeedback('n12-01','anything')).toBeUndefined()
  })
})
