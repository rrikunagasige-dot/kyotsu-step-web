// Historical edition regression; current-theme coverage lives in firstThemeRepair.test.ts.
import { firstThemeBaseline } from '../../../../test/firstThemeBaseline'
import { describe,expect,it } from 'vitest'
import katex from 'katex'
import { mathNumbersN05Unit as current_mathNumbersN05Unit,n05SourceToItemIds } from './n05Lesson'
import { effectiveTextbookProgress,type TextbookUnitProgress } from '../../../../domain/textbook'
const mathNumbersN05Unit = firstThemeBaseline(current_mathNumbersN05Unit)

const unit=mathNumbersN05Unit,section=unit.sections[0],q=section.items.find(i=>i.id==='n05-11')!
const newHint='積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。'
describe('W-MATH-025 P-001 N05 Q11 accepted hint-only change',()=>{
  it('keeps 20 original Word markers and no revision migration',()=>{
    expect(unit.revision).toBe(2)
    expect(Object.keys(n05SourceToItemIds)).toHaveLength(20)
    expect(n05SourceToItemIds['N05-Q11']).toEqual(['n05-11'])
    expect(section.items).toHaveLength(20)
    expect(section.figures.map(f=>f.id)).toEqual(['n05-f01','n05-f02'])
    const seq=['n05-lead-10','n05-formula-10','n05-after-10','n05-lead-11','n05-formula-11','n05-after-11','n05-lead-12']
    const at=seq.map(id=>section.readingFlow.findIndex(b=>b.id===id))
    expect(at.every(i=>i>=0)).toBe(true)
    expect(at).toEqual([...at].sort((a,b)=>a-b))
  })
  it('correct key/choices unchanged; wrong-only hint does not reveal the sought integer pair',()=>{
    expect(q.prompt).toBe('整数の組と完成した因数分解を選ぼう。')
    expect(q.answer).toBe('(a-8)(a+2)')
    expect(q.answerType).toBe('formula')
    expect(q.choices).toEqual(['(a-8)(a+2)','(a-4)(a+4)','(a-2)(a+8)','(a-8)(a-2)'])
    expect(q.hints).toEqual([newHint])
    expect(q.hints[0]).not.toContain('−8と2')
    expect(q.hints[0]).not.toContain('(a-8)(a+2)')
    expect(new Set(q.choices).size).toBe(4)
    for(const v of q.choices??[])expect(()=>katex.renderToString(v,{throwOnError:true})).not.toThrow()
  })
  it('independently checks integer pair and expansion',()=>{
    expect((-8)*2).toBe(-16)
    expect((-8)+2).toBe(-6)
    for(const a of [-2,-1,0,1,2])expect(Math.abs((a-8)*(a+2)-(a*a-6*a-16))).toBeLessThan(1e-10)
  })
  it('retains saved N05 Q11 progress unchanged at same revision2',()=>{
    const old:TextbookUnitProgress={
      unitId:unit.unitId,unitRevision:2,startedAt:1,updatedAt:5,completedAt:6,
      answers:{'n05-11':{itemId:'n05-11',value:q.answer,firstValue:q.answer,
        resolved:true,isFirstCorrect:true,attemptCount:1,firstAnsweredAt:3,lastAnsweredAt:5}},
    }
    expect(effectiveTextbookProgress(unit,old)).toBe(old)
    const q18=section.items.find(i=>i.id==='n05-18')!
    expect(q18.hints).toEqual(['例えば r=1、s=−3 なら、積は−3でも s+5r=2 となり、−2には一致しない。候補は積だけでなく、一次の係数も計算して選ぼう。'])
  })
})
