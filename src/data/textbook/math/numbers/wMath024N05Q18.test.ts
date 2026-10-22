import { describe,expect,it } from 'vitest'
import katex from 'katex'
import { mathNumbersN05Unit,n05SourceToItemIds } from './n05Lesson'
import { effectiveTextbookProgress,type TextbookUnitProgress } from '../../../../domain/textbook'

const unit=mathNumbersN05Unit
const section=unit.sections[0]
const q=section.items.find(i=>i.id==='n05-18')!
const expectedHint='例えば r=1、s=−3 なら、積は−3でも s+5r=2 となり、−2には一致しない。候補は積だけでなく、一次の係数も計算して選ぼう。'
describe('W-MATH-024/P-001 approved hint-only N05-Q18',()=>{
  it('keeps old 20 Word markers, revision2, figure ordering and graded IDs',()=>{
    expect(unit.revision).toBe(2)
    expect(Object.keys(n05SourceToItemIds)).toHaveLength(20)
    expect(n05SourceToItemIds['N05-Q18']).toEqual(['n05-18'])
    expect(section.items.map(i=>i.id)).toEqual(Array.from({length:20},(_,n)=>'n05-'+String(n+1).padStart(2,'0')))
    expect(section.figures.map(f=>f.id)).toEqual(['n05-f01','n05-f02'])
    const seq=['n05-lead-17','n05-formula-17','n05-after-17','n05-lead-18','n05-formula-18','n05-after-18','n05-lead-19']
    const positions=seq.map(id=>section.readingFlow.findIndex(b=>b.id===id))
    expect(positions.every(n=>n>=0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a,b)=>a-b))
  })
  it('changes only the leaked hint and preserves original answer, options and wrong feedback',()=>{
    expect(q.answer).toBe('(x-1)(5x+3)')
    expect(q.answerType).toBe('formula')
    expect(q.prompt).toBe('両条件に一致する因数分解を選ぼう。')
    expect(q.choices).toEqual(['(x-1)(5x+3)','(x+1)(5x-3)','(x-3)(5x+1)','(x-1)(5x-3)'])
    expect(q.hints).toEqual([expectedHint])
    expect(q.hints[0]).not.toContain('r=−1')
    expect(q.hints[0]).not.toContain('s=3なら')
    expect(new Set(q.choices).size).toBe(4)
    for(const o of q.choices)expect(()=>katex.renderToString(o,{throwOnError:true})).not.toThrow()
    const blocks=section.readingFlow.filter(b=>['n05-lead-18','n05-formula-18','n05-after-18'].includes(b.id))
    expect(blocks.map(b=>b.id)).toEqual(['n05-lead-18','n05-formula-18','n05-after-18'])
    expect(blocks[1].type).toBe('formula')
  })
  it('tests both required factorization conditions on a wrong worked example',()=>{
    const [r,s]=[1,-3]
    expect(r*s).toBe(-3)
    expect(s+5*r).toBe(2)
    expect(s+5*r).not.toBe(-2)
    const [correctR,correctS]=[-1,3]
    expect(correctR*correctS).toBe(-3)
    expect(correctS+5*correctR).toBe(-2)
    for(const x of [0,1,2])expect((x-1)*(5*x+3)).toBe(5*x*x-2*x-3)
  })
  it('preserves previously solved N05 progress because answer IDs and revision do not change',()=>{
    const old:TextbookUnitProgress={
      unitId:unit.unitId,unitRevision:2,startedAt:10,updatedAt:30,completedAt:50,
      answers:{'n05-18':{itemId:'n05-18',value:q.answer,firstValue:q.answer,
        isFirstCorrect:true,resolved:true,attemptCount:1,firstAnsweredAt:20,lastAnsweredAt:22}},
    }
    expect(effectiveTextbookProgress(unit,old)).toBe(old)
  })
})
