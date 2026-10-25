// Historical edition regression; current-theme coverage lives in firstThemeRepair.test.ts.
import { firstThemeBaseline, firstThemeBaselineTargets } from '../test/firstThemeBaseline'
import { mathNumbersN04Unit as current_mathNumbersN04Unit } from '../data/textbook/math/numbers/n04Lesson'
import { mathNumbersN10Unit } from '../data/textbook/math/numbers/n10Lesson'
import { mathNumbersN12Unit } from '../data/textbook/math/numbers/n12Lesson'
import { describe, expect, it } from 'vitest'
import { mathNumbersN01Unit as current_mathNumbersN01Unit } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit as current_mathNumbersN03Unit } from '../data/textbook/math/numbers/n03Lesson'
import { mathNumbersN11Unit } from '../data/textbook/math/numbers/n11Lesson'
import { mathNumbersN14Unit } from '../data/textbook/math/numbers/n14Lesson'
import { mathNumbersN13Unit } from '../data/textbook/math/numbers/n13Lesson'
import { mathNumbersN05Unit as current_mathNumbersN05Unit } from '../data/textbook/math/numbers/n05Lesson'
import { mathNumbersN06Unit as current_mathNumbersN06Unit } from '../data/textbook/math/numbers/n06Lesson'
// Legacy review slices retain their original v3 source; current N07 is independently tested.
import { mathNumbersN07Unit } from '../data/textbook/math/numbers/n07LegacyLesson'
import { mathNumbersN08Unit } from '../test/n08Legacy'
import { activeReviewMarkIds, extractReviewSection, reviewTargets as current_reviewTargets } from './reviewTargets'
const mathNumbersN01Unit = firstThemeBaseline(current_mathNumbersN01Unit)

const mathNumbersN04Unit = firstThemeBaseline(current_mathNumbersN04Unit)
const mathNumbersN03Unit = firstThemeBaseline(current_mathNumbersN03Unit)
const mathNumbersN05Unit = firstThemeBaseline(current_mathNumbersN05Unit)
const mathNumbersN06Unit = firstThemeBaseline(current_mathNumbersN06Unit)
const reviewTargets = firstThemeBaselineTargets(current_reviewTargets)


describe('W-GOV-008/P-002 review marker boundaries', () => {
  it('W-MATH-017 P-006 marks only the new explanatory paragraphs in existing N11 revision8', () => {
    const q1 = reviewTargets['n11-q01']
    const q5 = reviewTargets['n11-q05']
    expect(q1.revision).toBe(10)
    expect(q5.revision).toBe(10)
    expect(activeReviewMarkIds(q1)).toEqual(['n11-formula-01'])
    expect(activeReviewMarkIds(q5)).toEqual([]) // P006 user visual approved
    expect(extractReviewSection(mathNumbersN11Unit,q1)?.items.map(i=>i.answer)).toEqual(['>'])
    expect(extractReviewSection(mathNumbersN11Unit,q5)?.items.map(i=>i.answer)).toEqual(['2','2','7','\\frac73'])
    expect(extractReviewSection({...mathNumbersN11Unit,revision:7},q5)).toBeNull()
    expect(activeReviewMarkIds({...q1,reviewState:'accepted'})).toEqual([])
    expect(activeReviewMarkIds({...q5,reviewState:'accepted'})).toEqual([])
    const q89=reviewTargets['n11-q08-q09']
    expect(q89.revision).toBe(10)
    expect(extractReviewSection(mathNumbersN11Unit,q89)?.items.map(i=>i.answer)).toEqual(['3','3','2','\\ge','-1'])
    expect(activeReviewMarkIds(q89)).toEqual([]) // P007 accepted
    const q13=reviewTargets['n11-q13']
    expect(extractReviewSection(mathNumbersN11Unit,q13)?.items.map(i=>i.answer)).toEqual(['3','3','6','3'])
    expect(activeReviewMarkIds(q13)).toEqual([]) // P008 accepted
    const n14=reviewTargets['n14-q10']
    expect(n14.revision).toBe(10)
    expect(n14.totalItems).toBe(38)
    expect(extractReviewSection(mathNumbersN14Unit,n14)?.items.map(i=>i.answer)).toEqual(['3','3','3','-2','8'])
    expect(activeReviewMarkIds(n14)).toEqual([])
    expect(extractReviewSection({...mathNumbersN14Unit,revision:6},n14)).toBeNull()
    const q14=reviewTargets['n14-q14']
    expect(q14.revision).toBe(10)
    expect(q14.totalItems).toBe(38)
    expect(extractReviewSection(mathNumbersN14Unit,q14)?.items.map(i=>i.answer)).toEqual(['2','2','2','-2','6'])
    expect(activeReviewMarkIds(q14)).toEqual([]) // Q14 user accepted concise formula Gate1 layout
    expect(extractReviewSection({...mathNumbersN14Unit,revision:7},q14)).toBeNull()
    const q15=reviewTargets['n14-q15']
    expect(q15.revision).toBe(10)
    expect(q15.totalItems).toBe(38)
    expect(extractReviewSection(mathNumbersN14Unit,q15)?.items.map(i=>i.answer)).toEqual(['3','3','3','-\\frac23','2'])
    expect(activeReviewMarkIds(q15)).toEqual([]) // user accepted concise Q15 math layout; original evidence retained
    expect(extractReviewSection({...mathNumbersN14Unit,revision:8},q15)).toBeNull()
    const q16=reviewTargets['n14-q16']
    expect(q16.revision).toBe(10)
    expect(q16.totalItems).toBe(38)
    expect(extractReviewSection(mathNumbersN14Unit,q16)?.items.map(i=>i.answer)).toEqual(['-4','4','4','4','両端とも含む'])
    expect(q16.markBlockIds).toEqual(['n14-formula-16','n14-wm022-q16-right','n14-wm022-q16-conclusion'])
    expect(activeReviewMarkIds(q16)).toEqual([]) // grouped visual acceptance retained
    expect(extractReviewSection({...mathNumbersN14Unit,revision:9},q16)).toBeNull()
    expect(activeReviewMarkIds(q15)).toEqual([]) // previously approved Q15 stays hidden
    expect(extractReviewSection({...mathNumbersN11Unit,revision:9},q89)).toBeNull()
  })

  it('marks only the seven user-review blocks, not original final examples', () => {
    expect(activeReviewMarkIds(reviewTargets['n01-q07'])).toEqual([
      'formula-r3-q07-x2coef', 'formula-r3-q07-xcoef', 'formula-r3-q07-const',
    ])
    expect(activeReviewMarkIds(reviewTargets['n03-q10'])).toEqual([
      'formula-r3-q10-p1', 'formula-r3-q10-p2',
      'formula-r3-q10-p3', 'formula-r3-q10-p4',
    ])
    expect(activeReviewMarkIds(reviewTargets['n01-q07'])).not.toContain('formula-n01-07')
    expect(activeReviewMarkIds(reviewTargets['n03-q10'])).not.toContain('formula-n03-10')
  })

  it('hides accepted marks without deleting their traceable IDs', () => {
    const target = reviewTargets['n01-q07']
    expect(activeReviewMarkIds({ ...target, reviewState: 'accepted' })).toEqual([])
    expect(target.markBlockIds).toHaveLength(3)
    expect(activeReviewMarkIds({ ...target, reviewState: 'needs-fix' })).toHaveLength(3)
  })

  it('fails closed for unknown, repeated, or out-of-scope markers', () => {
    const target = reviewTargets['n01-q07']
    expect(extractReviewSection(mathNumbersN01Unit, target)).not.toBeNull()
    expect(extractReviewSection(mathNumbersN03Unit, reviewTargets['n03-q10'])).not.toBeNull()
    expect(extractReviewSection(mathNumbersN01Unit, {
      ...target, markBlockIds: ['not-a-real-block'],
    })).toBeNull()
    expect(extractReviewSection(mathNumbersN01Unit, {
      ...target, markBlockIds: [target.markBlockIds[0], target.markBlockIds[0]],
    })).toBeNull()
  })

  it('W-MATH-023/P-002 Gate1 accepts Q05 and Q08; both review markers hidden',()=>{
    const q05=reviewTargets['n13-q05']
    expect(q05.revision).toBe(4)
    expect(q05.totalItems).toBe(12)
    expect(q05.itemIds).toEqual(['n13-wm023-q05-right','n13-05'])
    expect(q05.expectedAnswers).toEqual(['x-1','1-x'])
    expect(activeReviewMarkIds(q05)).toEqual([])
    expect(extractReviewSection(mathNumbersN13Unit,q05)?.items.map(i=>i.answer)).toEqual(['x-1','1-x'])
    const q08=reviewTargets['n13-q08']
    expect(q08.revision).toBe(4)
    expect(q08.totalItems).toBe(12)
    expect(q08.itemIds).toEqual(['n13-wm023-q08-branches','n13-wm023-q08-positive-root','n13-08'])
    expect(q08.expectedAnswers).toEqual(['3x=6\\;\\text{または}\\;3x=-6','2','-2'])
    expect(activeReviewMarkIds(q08)).toEqual([])
    expect(q08.markBlockIds).toEqual(['n13-formula-08','n13-wm023-q08-positive-root','n13-wm023-q08-negative-root'])
    expect(extractReviewSection(mathNumbersN13Unit,q08)?.items.map(i=>i.answer)).toEqual(q08.expectedAnswers)
    expect(extractReviewSection({...mathNumbersN13Unit,revision:3},q08)).toBeNull()
  })

  it('W-MATH-024/P-001 N05 Q18 actual one-question hint review, no accepted N13 markers',()=>{
    const target=reviewTargets['n05-q18']
    expect(target.revision).toBe(2)
    expect(target.totalItems).toBe(20)
    expect(target.blockIds).toEqual(['n05-lead-18','n05-formula-18','n05-after-18'])
    expect(target.itemIds).toEqual(['n05-18'])
    expect(target.expectedAnswers).toEqual(['(x-1)(5x+3)'])
    expect(activeReviewMarkIds(target)).toEqual([])
    expect(target.markBlockIds).toEqual(['n05-formula-18'])
    expect(extractReviewSection(mathNumbersN05Unit,target)?.items.map(i=>i.answer)).toEqual(['(x-1)(5x+3)'])
    expect(extractReviewSection({...mathNumbersN05Unit,revision:1},target)).toBeNull()
    expect(activeReviewMarkIds({...target,reviewState:'accepted'})).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n13-q05'])).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n13-q08'])).toEqual([])
  })

  it('W-MATH-025/P001 Q11 accepted marker hidden, accepted Q18 and N13 remain silent',()=>{
    const target=reviewTargets['n05-q11']
    expect(target.revision).toBe(2)
    expect(target.totalItems).toBe(20)
    expect(target.itemIds).toEqual(['n05-11'])
    expect(target.expectedAnswers).toEqual(['(a-8)(a+2)'])
    expect(target.blockIds).toEqual(['n05-lead-11','n05-formula-11','n05-after-11'])
    expect(activeReviewMarkIds(target)).toEqual([])
    expect(target.markBlockIds).toEqual(['n05-formula-11'])
    expect(extractReviewSection(mathNumbersN05Unit,target)?.items.map(i=>i.answer)).toEqual(['(a-8)(a+2)'])
    expect(extractReviewSection({...mathNumbersN05Unit,revision:1},target)).toBeNull()
    expect(activeReviewMarkIds(reviewTargets['n05-q18'])).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n13-q05'])).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n13-q08'])).toEqual([])
  })

  it('W-MATH-025/P002 accepted Q12 marker is hidden while original IDs and revision checks remain',()=>{
    const target=reviewTargets['n06-q12']
    expect(target.revision).toBe(3)
    expect(target.totalItems).toBe(16)
    expect(target.itemIds).toEqual(['n06-12'])
    expect(target.blockIds).toEqual(['n06-lead-12','n06-formula-12','n06-after-12'])
    expect(activeReviewMarkIds(target)).toEqual([])
    expect(target.markBlockIds).toEqual(['n06-formula-12'])
    const extracted=extractReviewSection(mathNumbersN06Unit,target)
    expect(extracted?.items.map(i=>i.id)).toEqual(['n06-12'])
    expect(extracted?.items.map(i=>i.answer)).toEqual(['(x+y)(x+2)(x-1)'])
    expect(extractReviewSection({...mathNumbersN06Unit,revision:2},target)).toBeNull()
    expect(activeReviewMarkIds(reviewTargets['n05-q11'])).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n05-q18'])).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n13-q05'])).toEqual([])
    expect(activeReviewMarkIds(reviewTargets['n13-q08'])).toEqual([])
  })

  it('W-MATH-025/P003 accepted hint-only Q03 keeps its original boundaries with its marker hidden',()=>{
    const target=reviewTargets['n06-q03']
    expect(target.revision).toBe(3)
    expect(target.totalItems).toBe(16)
    expect(target.itemIds).toEqual(['n06-03'])
    expect(target.blockIds).toEqual(['n06-lead-03','n06-formula-03','n06-after-03'])
    expect(activeReviewMarkIds(target)).toEqual([])
    expect(target.markBlockIds).toEqual(['n06-formula-03'])
    const extracted=extractReviewSection(mathNumbersN06Unit,target)
    expect(extracted?.items.map(i=>i.id)).toEqual(['n06-03'])
    expect(extracted?.items.map(i=>i.answer)).toEqual(['(X-3)(X+2)'])
    expect(extractReviewSection({...mathNumbersN06Unit,revision:2},target)).toBeNull()
    for(const id of ['n06-q12','n05-q11','n05-q18','n13-q05','n13-q08'])
      expect(activeReviewMarkIds(reviewTargets[id])).toEqual([])
  })

  it('W-MATH-025/P004 selects Q06 only and preserves all accepted sibling marker states',()=>{
    const target=reviewTargets['n06-q06']
    expect(target.revision).toBe(3)
    expect(target.totalItems).toBe(16)
    expect(target.itemIds).toEqual(['n06-06'])
    expect(target.blockIds).toEqual(['n06-lead-06','n06-formula-06','n06-after-06'])
    expect(activeReviewMarkIds(target)).toEqual([])
    expect(target.markBlockIds).toEqual(['n06-formula-06'])
    const extracted=extractReviewSection(mathNumbersN06Unit,target)
    expect(extracted?.items.map(i=>i.id)).toEqual(['n06-06'])
    expect(extracted?.items.map(i=>i.answer)).toEqual(['(x^2-1)(x^2-4)'])
    expect(extractReviewSection({...mathNumbersN06Unit,revision:2},target)).toBeNull()
    for(const id of ['n06-q03','n06-q12','n05-q11','n05-q18','n13-q05','n13-q08'])
      expect(activeReviewMarkIds(reviewTargets[id])).toEqual([])
  })

  it('W-MATH-026/P001 isolates Q12 choices without reopening accepted hint marks',()=>{
    const target=reviewTargets['n06-q12-choices']
    expect(target.revision).toBe(3)
    expect(target.totalItems).toBe(16)
    expect(target.itemIds).toEqual(['n06-12'])
    expect(target.blockIds).toEqual(['n06-lead-12','n06-formula-12','n06-after-12'])
    expect(target.markBlockIds).toEqual(['n06-formula-12'])
    expect(activeReviewMarkIds(target)).toEqual([]) // grouped five-item visual acceptance, 2026-10-23
    const extracted=extractReviewSection(mathNumbersN06Unit,target)
    expect(extracted?.items.map(i=>i.answer)).toEqual(['(x+y)(x+2)(x-1)'])
    expect(extractReviewSection({...mathNumbersN06Unit,revision:2},target)).toBeNull()
    for(const id of ['n06-q06','n06-q03','n06-q12','n05-q11','n05-q18','n13-q05','n13-q08'])
      expect(activeReviewMarkIds(reviewTargets[id])).toEqual([])
  })

  it('W025/P-005 N05 Q06 hint is one original item with accepted siblings hidden',()=>{
    const target=reviewTargets['n05-q06-hint']
    expect(target.revision).toBe(2)
    expect(target.totalItems).toBe(20)
    expect(target.itemIds).toEqual(['n05-06'])
    expect(target.markBlockIds).toEqual(['n05-formula-06'])
    expect(activeReviewMarkIds(target)).toEqual([]) // grouped five-item visual acceptance, 2026-10-23
    const extracted=extractReviewSection(mathNumbersN05Unit,target)
    expect(extracted?.items.map(item=>item.id)).toEqual(['n05-06'])
    expect(extracted?.items.map(item=>item.answer)).toEqual(['(4x)^2,\\quad(3y)^2'])
    expect(extracted?.items[0].hints[0]).toBe("両端の係数と文字の指数を別々に見て、それぞれ何を二乗すると元の項に戻るか確かめよう。")
    expect(extractReviewSection({...mathNumbersN05Unit,revision:1},target)).toBeNull()
    for(const id of ['n06-q06','n06-q03','n06-q12','n05-q11','n05-q18','n13-q05','n13-q08'])
      expect(activeReviewMarkIds(reviewTargets[id])).toEqual([])
  })

  it('W025/P-006 N07 Q09 hint is one original item with accepted siblings hidden',()=>{
    const target=reviewTargets['n07-q09-hint']
    expect(target.revision).toBe(3)
    expect(target.totalItems).toBe(14)
    expect(target.itemIds).toEqual(['n07-09'])
    expect(target.markBlockIds).toEqual(['n07-formula-09'])
    expect(activeReviewMarkIds(target)).toEqual([]) // grouped five-item visual acceptance, 2026-10-23
    const extracted=extractReviewSection(mathNumbersN07Unit,target)
    expect(extracted?.items.map(item=>item.id)).toEqual(['n07-09'])
    expect(extracted?.items.map(item=>item.answer)).toEqual(['\\text{100倍},\\;100x=69.\\overline{69},\\;99x=69'])
    expect(extracted?.items[0].hints[0]).toBe("繰り返す数字の一周期が何桁か数えよう。その桁数だけ小数点を右へ動かして元の小数部分と揃え、差をとろう。")
    expect(extractReviewSection({...mathNumbersN07Unit,revision:2},target)).toBeNull()
    for(const id of ['n06-q06','n06-q03','n06-q12','n05-q11','n05-q18','n13-q05','n13-q08'])
      expect(activeReviewMarkIds(reviewTargets[id])).toEqual([])
  })

  it('W025/P-007 N08 Q05 hint is one original item with accepted siblings hidden',()=>{
    const target=reviewTargets['n08-q05-hint']
    expect(target.revision).toBe(3)
    expect(target.totalItems).toBe(12)
    expect(target.itemIds).toEqual(['n08-05'])
    expect(target.markBlockIds).toEqual(['n08-formula-05'])
    expect(activeReviewMarkIds(target)).toEqual([]) // grouped five-item visual acceptance, 2026-10-23
    const extracted=extractReviewSection(mathNumbersN08Unit,target)
    expect(extracted?.items.map(item=>item.id)).toEqual(['n08-05'])
    expect(extracted?.items.map(item=>item.answer)).toEqual(['5<9,\\quad\\sqrt5<3'])
    expect(extracted?.items[0].hints[0]).toBe("根号の付いた数は、二乗すると根号の中の数に戻る。もう一方も二乗し、二つの値を比べよう。両方とも非負なので大小の向きは保たれる。")
    expect(extractReviewSection({...mathNumbersN08Unit,revision:2},target)).toBeNull()
    for(const id of ['n06-q06','n06-q03','n06-q12','n05-q11','n05-q18','n13-q05','n13-q08'])
      expect(activeReviewMarkIds(reviewTargets[id])).toEqual([])
  })

})


describe('W025 P008–P014 exact hint review boundaries',()=>{
  const cases=[
    {unit:mathNumbersN04Unit,target:"n04-q20-hint",ids:["n04-20"],mark:"n04-formula-20",count:26},
    {unit:mathNumbersN10Unit,target:"n10-q07-hint",ids:["n10-07"],mark:"formula-n10-07",count:21},
    {unit:mathNumbersN10Unit,target:"n10-q08-hint",ids:["n10-07","n10-08"],mark:"formula-n10-08",count:21},
    {unit:mathNumbersN12Unit,target:"n12-q06-coef-hint",ids:["n12-p002-q06-left-coef"],mark:"formula-q06-left-coef",count:35},
    {unit:mathNumbersN12Unit,target:"n12-q12-coef-hint",ids:["n12-p002-q12-signed-coef"],mark:"formula-q12-signed-coef",count:35},
    {unit:mathNumbersN04Unit,target:"n04-q22-hint",ids:["n04-22"],mark:"n04-formula-22",count:26},
    {unit:mathNumbersN07Unit,target:"n07-q11-hint",ids:["n07-11"],mark:"n07-formula-11",count:14},
  ]
  it.each(cases)('$target maps only real items and the one changed hint marker',c=>{
    const target=reviewTargets[c.target]
    expect(target.totalItems).toBe(c.count)
    expect(target.revision).toBe(c.unit.revision)
    expect(extractReviewSection(c.unit,target)?.items.map(q=>q.id)).toEqual(c.ids)
    expect(target.markBlockIds).toEqual([c.mark])
    expect(activeReviewMarkIds(target)).toEqual([]) // user accepted all seven images
    expect(extractReviewSection({...c.unit,revision:c.unit.revision+1},target)).toBeNull()
    for(const accepted of ['n06-q12-choices','n05-q06-hint','n07-q09-hint','n08-q05-hint','n14-q16'])
      expect(activeReviewMarkIds(reviewTargets[accepted])).toEqual([])
  })
})
