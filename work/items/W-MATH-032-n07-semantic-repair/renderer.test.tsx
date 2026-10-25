import { describe,it,expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { N07ReadingFlow } from '../../../src/components/textbook/N07ReadingFlow'
import { mathNumbersN07Unit as unit,n07Presentation as p } from '../../../src/data/textbook/math/numbers/n07Lesson'
import {answerTextbookItem,type TextbookUnitProgress} from '../../../src/domain/textbook'
const storage='math-textbook-compact-v1:'+unit.unitId+':r'+unit.revision
const html=(progress:TextbookUnitProgress|undefined,stage:number)=>{window.localStorage.setItem(storage,String(stage));return renderToStaticMarkup(<N07ReadingFlow unit={unit} section={unit.sections[0]} progress={progress} />)}
describe('N07 actual reader projection',()=>{
 it('renders every node before and after its answer, without broken KaTeX',()=>{
  let progress:TextbookUnitProgress|undefined
  for(const node of p.nodes){
   const stage=p.stages.findIndex(s=>s.id===node.stageId)
   const before=html(progress,stage)
   expect(before).not.toContain('katex-error')
   if(node.interaction){
    expect(before).toContain('textbook-item-'+node.interaction.id)
    expect(before).not.toContain('data-semantic-id="'+node.id+'-after-')
    if(node.id==='n07-q03-cycle'){expect(before).toContain('n07-remainder-table');expect(before).toContain('整数部分は2')}
    const item=unit.sections[0].items.find(i=>i.id===node.interaction?.id)!
    progress=answerTextbookItem(progress,unit,item,item.answer,100)
    const after=html(progress,stage);expect(after).not.toContain('katex-error');expect(after).toContain('resolved-'+item.id)
    if(node.id.endsWith('-subtract'))expect(after).toContain('ことで、同じ小数部分を消します。')
   }
  }
 })
})
