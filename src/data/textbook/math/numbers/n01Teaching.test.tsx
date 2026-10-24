import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { mathTextbookUnits as currentUnits } from '../index'
import previousUnits from '../../../../../work/items/W-MATH-029-section-one-teaching/BASELINE.json'
const mathTextbookUnits=currentUnits.map(u=>(previousUnits as unknown as Record<string,typeof u>)[u.unitId]??u)

import { effectiveTextbookProgress, type TextbookUnitProgress } from '../../../../domain/textbook'
import type { TextbookReadingBlock, TextbookUnit } from '../../../../domain/textbookSchema'
import { TextbookFormula } from '../../../../components/textbook/TextbookFormula'
import { mathNumbersN01R3Unit as unit, n01SourceToItemIds } from './n01Lesson'
import { n01RetiredItems } from './n01Teaching'
const oldUnits = JSON.parse(readFileSync('work/items/W-MATH-028-n01-teaching-sequence/R2_UNITS.json', 'utf8')) as Record<string,{sha256:string;unit?:TextbookUnit}>
const section = unit.sections[0]
const flow = section.readingFlow
const at = (id: string) => flow.findIndex(b=>b.id===id)
describe('W-MATH-028 approved current teaching edition', () => {
  it('changes only the two approved N01 sequences and preserves all15 other numbers units', () => {
    for (const current of mathTextbookUnits) if (oldUnits[current.unitId] && current.unitId !== unit.unitId) expect(createHash('sha256').update(JSON.stringify(current)).digest('hex'),current.unitId).toEqual(oldUnits[current.unitId].sha256)
    const old = oldUnits[unit.unitId].unit!.sections[0]
    const untouched = (blocks:TextbookReadingBlock[]) => {
      const begin = blocks.findIndex(b=>b.id==='heading-variable')
      const end = blocks.findIndex(b=>b.id==='marker-degree-check')
      const tail = blocks.findIndex(b=>b.id==='paragraph-n01-10a')
      return [...blocks.slice(0,blocks.findIndex(b=>b.id==='paragraph-coefficient-compare')), ...blocks.slice(begin,end), ...blocks.slice(tail)]
    }
    // R3 coefficient replacement starts at its own intro, not the retired source intro.
    const normalized = flow.map(b=>b.id==='n01-r3-coefficient-intro'?{...b,id:'paragraph-coefficient-compare'}:b)
    expect(untouched(normalized)).toEqual(untouched(old.readingFlow))
    for (const item of old.items) if (!n01RetiredItems.some(id=>id===item.id)) expect(section.items.find(q=>q.id===item.id)).toEqual(item)
    expect(unit.revision).toBe(5)
  })
  it('teaches one target at a time and returns the results before interpreting degree', () => {
    const anchors=['n01-r3-plan','n01-r3-linear-heading','n01-r3-linear-calculate','n01-r3-linear-result','n01-r3-quadratic-heading','n01-r3-cubic-heading','n01-r3-cubic-calculate','n01-r3-cubic-zero','n01-r3-constant-heading','n01-r3-assembly-heading','n01-r3-assembly-reuse','n01-r3-final-equation','paragraph-n01-10a']
    expect(anchors.every(id=>at(id)>=0)).toBe(true)
    expect(anchors.map(at)).toEqual(anchors.map(at).sort((a,b)=>a-b))
    expect(n01SourceToItemIds['N01-Q09']).toEqual(['n01-bridge-r3-linear','n01-bridge-r3-cubic','n01-bridge-r3-reuse'])
    expect(n01SourceToItemIds['N01-Q02']).toHaveLength(6)
    for (const id of n01RetiredItems) expect(section.items.some(q=>q.id===id)).toBe(false)
  })
  it('archives the whole R2 attempt, retains unchanged answers, and leaves all nine new holes unanswered', () => {
    const old=oldUnits[unit.unitId].unit!
    const progress:TextbookUnitProgress={unitId:unit.unitId,unitRevision:4,startedAt:1,updatedAt:2,completedAt:3,answers:Object.fromEntries(old.sections[0].items.map(q=>[q.id,{itemId:q.id,value:q.answer,resolved:true,isFirstCorrect:true,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]))}
    const current=effectiveTextbookProgress(unit,progress)!
    expect(current.archivedRevisions?.['4'].answers).toEqual(progress.answers)
    expect(current.completedAt).toBeUndefined()
    expect(section.items.filter(q=>!current.answers[q.id])).toHaveLength(9)
    for (const id of n01RetiredItems) expect(current.answers[id]).toBeUndefined()
    expect(current.answers['n01-07']).toEqual(progress.answers['n01-07'])
  })
  it('renders current equations/options and uses the same blank content as sets, with no inner square glyph', () => {
    for (const block of flow) if (block.type==='formula' || block.type==='paragraph') for (const part of block.parts) if (part.type==='math') expect(()=>katex.renderToString(part.latex,{throwOnError:true})).not.toThrow()
    for (const item of section.items.filter(q=>q.id.startsWith('n01-bridge-r3-'))) for (const choice of item.choices!) expect(()=>katex.renderToString(choice,{throwOnError:true})).not.toThrow()
    const block=flow.find(b=>b.id==='n01-r3-linear-calculate')!
    if (block.type!=='formula') throw Error('Expected formula')
    for (const unitId of [unit.unitId,'math-sets']) {
      const html=renderToStaticMarkup(<TextbookFormula unitId={unitId} block={block} section={section} progress={undefined} onOpen={()=>{}} />)
      expect(html).toContain('>選択</button>')
      expect(html).not.toContain('□')
    }
  })
})
