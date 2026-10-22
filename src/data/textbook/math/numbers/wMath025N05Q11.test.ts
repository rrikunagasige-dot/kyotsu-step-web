import {describe,it,expect} from 'vitest'
import katex from 'katex'
import {mathNumbersN05Unit,n05SourceToItemIds} from './n05Lesson'
import {effectiveTextbookProgress,type TextbookUnitProgress} from '../../../../domain/textbook'
const unit=mathNumbersN05Unit,section=unit.sections[0],q=section.items.find(x=>x.id==='n05-11')!
const hint='積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。'
describe('W-MATH-025/P-001 approved one-hint N05 Q11',()=>{
  it('retains original Word source, revision, accepted Q18 and figures',()=>{
    expect(unit.revision).toBe(2)
    expect(Object.keys(n05SourceToItemIds)).toHaveLength(20)
    expect(n05SourceToItemIds['N05-Q11']).toEqual(['n05-11'])
    expect(section.items.map(x=>x.id)).toEqual(Array.from({length:20},(_,i)=>'n05-'+String(i+1).padStart(2,'0')))
    expect(section.figures.map(x=>x.id)).toEqual(['n05-f01','n05-f02'])
    expect(section.items.find(x=>x.id==='n05-18')?.hints).toEqual(['例えば r=1、s=−3 なら、積は−3でも s+5r=2 となり、−2には一致しない。候補は積だけでなく、一次の係数も計算して選ぼう。'])
  })
  it('avoids leaking the two integers while keeping four KaTeX-valid answers',()=>{
    expect(q.answer).toBe('(a-8)(a+2)')
    expect(q.answerType).toBe('formula')
    expect(q.prompt).toBe('整数の組と完成した因数分解を選ぼう。')
    expect(q.choices).toEqual(['(a-8)(a+2)','(a-4)(a+4)','(a-2)(a+8)','(a-8)(a-2)'])
    expect(q.hints).toEqual([hint])
    expect(q.hints?.[0]).not.toContain('−8と2')
    expect(new Set(q.choices).size).toBe(4)
    for(const x of q.choices??[])expect(()=>katex.renderToString(x,{throwOnError:true})).not.toThrow()
    const seq=['n05-after-10','n05-lead-11','n05-formula-11','n05-after-11','n05-lead-12'].map(id=>section.readingFlow.findIndex(b=>b.id===id))
    expect(seq.every(x=>x>=0)).toBe(true)
    expect(seq).toEqual([...seq].sort((a,b)=>a-b))
  })
  it('checks correct factorization independently of hint',()=>{
    expect((-8)*2).toBe(-16)
    expect(-8+2).toBe(-6)
    for(const a of [-2,0,3])expect((a-8)*(a+2)).toBe(a*a-6*a-16)
  })
  it('preserves completed user progress at stable revision 2',()=>{
    const old:TextbookUnitProgress={unitId:unit.unitId,unitRevision:2,startedAt:1,updatedAt:5,completedAt:6,answers:{'n05-11':{itemId:'n05-11',value:q.answer,firstValue:q.answer,resolved:true,isFirstCorrect:true,attemptCount:1,firstAnsweredAt:2,lastAnsweredAt:3}}}
    expect(effectiveTextbookProgress(unit,old)).toBe(old)
  })
})
