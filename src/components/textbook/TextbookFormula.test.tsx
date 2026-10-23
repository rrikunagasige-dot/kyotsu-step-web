import { renderToStaticMarkup } from 'react-dom/server'
import { describe,expect,it } from 'vitest'
import { answerTextbookItem } from '../../domain/textbook'
import { TextbookFormula } from './TextbookFormula'
import { mathNumbersN12Unit as n12 } from '../../data/textbook/math/numbers/n12Lesson'
import { mathNumbersN10Unit as n10 } from '../../data/textbook/math/numbers/n10Lesson'
import { extractReviewSection,reviewTargets,activeReviewMarkIds } from '../../review/reviewTargets'
import type { TextbookSection } from '../../domain/textbookSchema'
const formula=(section:TextbookSection,id:string)=>{
 const block=section.readingFlow.find(b=>b.id===id)
 if(!block||block.type!=='formula')throw Error(id)
 return block
}
describe('P015 stable identity and P016 mathematical groups',()=>{
 for(const [targetId,blockId] of [['n12-q06-layout','formula-q06-left-coef'],['n12-q12-layout','formula-q12-signed-coef']]){
  it(targetId+' retains N12 rendering with no sentinel item',()=>{
   const target=reviewTargets[targetId],section=extractReviewSection(n12,target)!
   expect(section.items.some(q=>q.id==='n12-01')).toBe(false)
   const html=renderToStaticMarkup(<TextbookFormula unitId={n12.unitId} section={section} block={formula(section,blockId)} progress={undefined} onOpen={()=>{}} />)
   expect(html).toContain('reading-formula-line--n12')
   expect(html).toContain('data-testid="textbook-item-'+target.itemIds[0]+'"')
   expect(html).toContain('data-testid="p016-right"')
   expect(html).toContain('data-testid="p016-left"')
   expect(activeReviewMarkIds(target)).toEqual([])
  })
 }
 it('keeps the existing full N12 formula controls and identities',()=>{
  const section=n12.sections[0],blocks=section.readingFlow.filter(b=>b.type==='formula')
  expect(blocks).toHaveLength(32)
  for(const block of blocks){
   const html=renderToStaticMarkup(<TextbookFormula unitId={n12.unitId} section={section} block={block} progress={undefined} onOpen={()=>{}} />)
   expect(html).toContain('reading-formula-line--n12')
   expect(html.includes('reading-formula-expression--p016')).toBe(['formula-q06-left-coef','formula-q12-signed-coef','formula-q02-coef','formula-q06-right-coef','formula-cost-pudding'].includes(block.id))
   for(const part of block.parts)if(part.type==='choice')expect(html).toContain('data-testid="textbook-item-'+part.itemId+'"')
   expect(html).not.toContain('katex-error')
  }
 })
 it('does not switch another unit into N12 layout merely because an item has that name',()=>{
  const section={...n10.sections[0],items:[...n10.sections[0].items,{...n10.sections[0].items[0],id:'n12-01'}]}
  const block=section.readingFlow.find(b=>b.type==='formula')!
  if(block.type!=='formula')throw Error('formula')
  const html=renderToStaticMarkup(<TextbookFormula unitId={n10.unitId} section={section} block={block} progress={undefined} onOpen={()=>{}} />)
  expect(html).not.toContain('reading-formula-line--n12')
 })

 it('keeps the solved unit coefficient as x while retaining stored answer 1',()=>{
  const target=reviewTargets['n12-q06-layout'],section=extractReviewSection(n12,target)!,item=section.items[0]
  const progress=answerTextbookItem(undefined,n12,item,item.answer,1)
  const html=renderToStaticMarkup(<TextbookFormula unitId={n12.unitId} section={section} block={formula(section,'formula-q06-left-coef')} progress={progress} onOpen={()=>{}} />)
  expect(progress.answers[item.id].value).toBe('1')
  expect(html).toContain('係数は1（式ではx）')
  expect(html).toContain('data-testid="p016-right"')
 })
})

for(const [targetId,blockId] of [['n12-q02-layout','formula-q02-coef'],['n12-q06-right-layout','formula-q06-right-coef'],['n12-q10-pudding-layout','formula-cost-pudding'],['n12-q13-lower-layout','formula-q13-lower']]){
 it('P017 '+targetId+' preserves actual choice and a bound mathematical group',()=>{
  const target=reviewTargets[targetId],section=extractReviewSection(n12,target)!
  const html=renderToStaticMarkup(<TextbookFormula unitId={n12.unitId} section={section} block={formula(section,blockId)} progress={undefined} onOpen={()=>{}} />)
  expect(html).toContain('data-testid="textbook-item-'+target.itemIds[0]+'"')
  expect(html).toContain(blockId==='formula-q13-lower'?'data-testid="p017-bound"':'data-testid="p016-right"')
  expect(activeReviewMarkIds(target)).toEqual([blockId])
  expect(html).not.toContain('katex-error')
 })
}
