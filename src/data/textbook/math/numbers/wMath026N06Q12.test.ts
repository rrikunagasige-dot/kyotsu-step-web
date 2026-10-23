import { describe,expect,it } from 'vitest'
import { answerTextbookItem,effectiveTextbookProgress,getTextbookChoices,isTextbookAnswerCorrect,isTextbookItemResolved } from '../../../../domain/textbook'
import { mathNumbersN06Unit as unit } from './n06Lesson'

const item=unit.sections[0].items.find(candidate=>candidate.id==='n06-12')!
const removed='(x+y)(x+1)(x-2)'
// Independent exact integer expansion, including y coefficients.
// Reject unsupported syntax instead of mistaking a parser gap for equivalence.
function coefficients(expression:string):Record<string,number>{
  const factors=expression.match(/\([^()]+\)/g)??[]
  if(factors.join('')!==expression)throw new Error('Unsupported factored expression')
  let result:Record<string,number>={'0,0':1}
  for(const wrapped of factors){
    const factor=wrapped.slice(1,-1)
    const terms=factor.match(/[+-]?(?:x|y|\d+)/g)??[]
    if(terms.join('')!==factor)throw new Error('Unsupported factor')
    const next:Record<string,number>={}
    for(const term of terms){
      const sign=term.startsWith('-')?-1:1
      const value=term.replace(/^[+-]/,'')
      const dx=value==='x'?1:0,dy=value==='y'?1:0
      const coefficient=dx||dy?sign:sign*Number(value)
      for(const [powers,existing] of Object.entries(result)){
        const [x,y]=powers.split(',').map(Number)
        const key=[x+dx,y+dy].join(',')
        next[key]=(next[key]??0)+existing*coefficient
      }
    }
    result=next
  }
  return Object.fromEntries(Object.entries(result).filter(([,value])=>value!==0).sort(([a],[b])=>a.localeCompare(b)))
}
describe('W-MATH-026/P-001 mathematical distinctions and unchanged revision3 history',()=>{
  it('rejects the former equivalent pair and leaves exactly one correct polynomial among four choices',()=>{
    const choices=getTextbookChoices(unit,item)
    expect(coefficients(removed)).toEqual(coefficients('(x+y)(x-2)(x+1)'))
    expect(choices).toHaveLength(4)
    expect(choices).not.toContain(removed)
    expect(choices).toContain('(x+y)(x+2)(x+1)')
    const expanded=choices.map(coefficients)
    expect(new Set(expanded.map(value=>JSON.stringify(value))).size).toBe(4)
    const source={'3,0':1,'2,1':1,'2,0':1,'1,1':1,'1,0':-2,'0,1':-2}
    expect(coefficients(item.answer)).toEqual(source)
    const answerSignature=JSON.stringify(coefficients(item.answer))
    expect(expanded.filter(value=>JSON.stringify(value)===answerSignature)).toHaveLength(1)
    expect(choices.filter(value=>isTextbookAnswerCorrect(item,value))).toEqual([item.answer])
  })
  it('preserves a removed wrong answer verbatim, then retains its first attempt on retry',()=>{
    const old=answerTextbookItem(undefined,unit,item,removed,100)
    const saved=structuredClone(old)
    expect(effectiveTextbookProgress(unit,old)).toBe(old)
    expect(isTextbookItemResolved(item,old.answers[item.id])).toBe(false)
    const retried=answerTextbookItem(old,unit,item,item.answer,200)
    expect(old).toEqual(saved)
    expect(retried.answers[item.id]).toMatchObject({value:item.answer,firstValue:removed,firstAnsweredAt:100,lastAnsweredAt:200,attemptCount:2,isFirstCorrect:false,resolved:true})
    expect(retried.unitRevision).toBe(3)
    expect(retried.archivedRevisions).toBeUndefined()
  })
  it('restores all sixteen completed answers without forced reset or answer replacement',()=>{
    const items=unit.sections.flatMap(section=>section.items)
    expect(items).toHaveLength(16)
    let progress=answerTextbookItem(undefined,unit,items[0],items[0].answer,100)
    for(const [index,candidate] of items.slice(1).entries())
      progress=answerTextbookItem(progress,unit,candidate,candidate.answer,101+index)
    expect(progress.completedAt).toBeTruthy()
    expect(effectiveTextbookProgress(unit,progress)).toBe(progress)
    expect(answerTextbookItem(progress,unit,item,'(x+y)(x+2)(x+1)',300)).toBe(progress)
  })
})
