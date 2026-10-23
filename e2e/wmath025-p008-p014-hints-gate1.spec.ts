import { mkdirSync } from 'node:fs'
import { expect,test,type Page } from '@playwright/test'
import { mathNumbersN04Unit } from '../src/data/textbook/math/numbers/n04Lesson'
import { mathNumbersN07Unit } from '../src/data/textbook/math/numbers/n07Lesson'
import { mathNumbersN10Unit } from '../src/data/textbook/math/numbers/n10Lesson'
import { mathNumbersN12Unit } from '../src/data/textbook/math/numbers/n12Lesson'
import { getTextbookChoices,type TextbookUnitProgress } from '../src/domain/textbook'

const cases=[
  {unit:mathNumbersN04Unit,p:"008",id:"n04-20",target:"n04-q20-hint",mark:"n04-formula-20",rev:2,count:26,hint:"二つずつ組にして展開したとき、xの係数が何の和になるか考えよう。その和が同じになる組合せを探そう。",old:"1と4を組にし、2と3を組にすると和が揃う。",prereq:[]},
  {unit:mathNumbersN10Unit,p:"009",id:"n10-07",target:"n10-q07-hint",mark:"formula-n10-07",rev:1,count:21,hint:"まず根号の中の数どうしを掛けよう。得られた数を、できるだけ大きい平方数と残りの因子の積に分けよう。",old:"平方数である16を因子として取り出す。",prereq:[]},
  {unit:mathNumbersN10Unit,p:"010",id:"n10-08",target:"n10-q08-hint",mark:"formula-n10-08",rev:1,count:21,hint:"前の式で見つけた平方数が、何を二乗した数か確かめよう。その平方根を根号の外へ出し、残りの因子は根号の中に残そう。",old:"16の正の平方根は4になる。",prereq:["n10-07"]},
  {unit:mathNumbersN12Unit,p:"011",id:"n12-p002-q06-left-coef",target:"n12-q06-coef-hint",mark:"formula-q06-left-coef",rev:3,count:35,hint:"両辺から同じ文字の項を引くと、係数どうしの引き算になる。文字xを残したまま、係数だけを計算しよう。",old:"3−2=1。1xはxと同じ。",prereq:[]},
  {unit:mathNumbersN12Unit,p:"012",id:"n12-p002-q12-signed-coef",target:"n12-q12-coef-hint",mark:"formula-q12-signed-coef",rev:3,count:35,hint:"括弧の外の正の数を、括弧内の負の項にも掛けよう。係数の大きさと符号を別々に確かめ、文字xを除いた数を選ぼう。",old:"130×(−x)=−130x。符号も答えに含める。",prereq:[]},
  {unit:mathNumbersN04Unit,p:"013",id:"n04-22",target:"n04-q22-hint",mark:"n04-formula-22",rev:2,count:26,hint:"二乗の公式でT²を展開し、それから一次のTの項も元の式へ戻そう。同じ次数の項を集め、各係数を自分で計算しよう。",old:"T²ではx⁴、10x³、25x²が出る。さらに10Tを足す。",prereq:[]},
  {unit:mathNumbersN07Unit,p:"014",id:"n07-11",target:"n07-q11-hint",mark:"n07-formula-11",rev:3,count:14,hint:"10を素数の積に分け、同じ積をk回掛けた形を考えよう。それぞれの素数が何回ずつ掛かるかを数え、指数で表そう。",old:"10=2×5なので、その積をk回掛ける。",prereq:[]},
]
async function savedProgress(page:Page,unitId:string):Promise<TextbookUnitProgress>{
  return page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state?.textbookProgress?.[id],unitId)
}
test.describe('W025 P008–P014 approved hint batch, genuine app evidence',()=>{
  for(const c of cases){
    const item=c.unit.sections[0].items.find(candidate=>candidate.id===c.id)!
    const choices=getTextbookChoices(c.unit,item)
    const wrong=choices.find(choice=>choice!==item.answer)!
    for(const width of [320,390,1440] as const){
      test(c.id+' review wrong hint and retry '+width,async({page},info)=>{
        test.skip(process.env.E2E_WM025_SEVEN_HINTS!=='1','Evidence-only branch workflow')
        test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
        test.setTimeout(180_000)
        const sha=process.env.CAPTURE_SHA??''
        expect(sha).toMatch(/^[0-9a-f]{40}$/)
        await page.setViewportSize({width,height:width===1440?1400:850})
        if(c.p==='008')for(const accepted of ['n05-q11','n05-q18','n06-q03','n06-q06','n06-q12','n13-q05','n13-q08','n06-q12-choices','n05-q06-hint','n07-q09-hint','n08-q05-hint','n14-q16']){
          await page.goto('/#/review/'+accepted)
          await expect(page.getByTestId('review-preview-ready')).toBeVisible()
          await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(0)
        }
        const before=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
        await page.goto('/#/review/'+c.target)
        await expect(page.getByTestId('review-preview-ready')).toBeVisible()
        await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
        await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(1)
        await expect(page.getByTestId('review-mark-'+c.mark)).toContainText('確認①')
        await expect(page.getByTestId('review-preview-count')).toContainText('0/'+(c.prereq.length+1))
        await expect(page.getByTestId('review-preview-count')).toContainText('全'+c.count+'穴')
        for(const id of c.prereq){
          const prior=c.unit.sections[0].items.find(q=>q.id===id)!
          await page.getByTestId('textbook-item-'+id).click()
          await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:prior.answer,exact:true}).click()
          await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        }
        mkdirSync('e2e-evidence',{recursive:true})
        const snap=async(state:string)=>page.screenshot({path:'e2e-evidence/wm025-seven-'+c.id+'-review-'+state+'-'+width+'.png'})
        const trigger=page.getByTestId('textbook-item-'+c.id)
        await trigger.scrollIntoViewIfNeeded()
        await expect(page.getByTestId('textbook-hint-'+c.id)).not.toBeVisible()
        await snap('before')
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+c.id)
        await expect(panel.getByRole('button')).toHaveCount(choices.length)
        await panel.scrollIntoViewIfNeeded()
        await snap('choices')
        await panel.getByRole('button',{name:wrong,exact:true}).click()
        await expect(page.getByTestId('review-preview-count')).toContainText(c.prereq.length+'/'+(c.prereq.length+1))
        await trigger.click()
        const shownHint=page.getByTestId('textbook-hint-'+c.id)
        await expect(shownHint.locator('span')).toHaveText(c.hint)
        await expect(shownHint).not.toContainText(c.old)
        await page.getByTestId('textbook-hint-'+c.id).scrollIntoViewIfNeeded()
        await snap('wrong')
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
        await expect(page.getByTestId('review-preview-count')).toContainText((c.prereq.length+1)+'/'+(c.prereq.length+1))
        await expect(page.locator('.katex-error')).toHaveCount(0)
        await snap('complete')
        expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(before)
      })
      test(c.id+' normal saved wrong reload retry all actual items '+width,async({page},info)=>{
        test.skip(process.env.E2E_WM025_SEVEN_HINTS!=='1','Evidence-only branch workflow')
        test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
        test.setTimeout(240_000)
        await page.setViewportSize({width,height:width===1440?1400:850})
        await page.goto('/#/learning/textbook/'+c.unit.unitId)
        mkdirSync('e2e-evidence',{recursive:true})
        const snap=async(state:string)=>page.screenshot({path:'e2e-evidence/wm025-seven-'+c.id+'-normal-'+state+'-'+width+'.png'})
        const items=c.unit.sections[0].items
        const index=items.findIndex(q=>q.id===c.id)
        expect(index).toBeGreaterThanOrEqual(0)
        expect(c.unit.revision).toBe(c.rev)
        expect(items).toHaveLength(c.count)
        for(const q of items.slice(0,index)){
          await page.getByTestId('textbook-item-'+q.id).click()
          await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
          await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
        }
        const previous=(await savedProgress(page,c.unit.unitId)).answers
        const next=items[index+1]
        const trigger=page.getByTestId('textbook-item-'+c.id)
        await trigger.scrollIntoViewIfNeeded()
        await expect(page.getByTestId('textbook-hint-'+c.id)).not.toBeVisible()
        if(next)await expect(page.getByTestId('textbook-item-'+next.id)).not.toBeVisible()
        else await expect(page.getByTestId('textbook-unit-complete')).toHaveCount(0)
        await snap('before')
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+c.id)
        await expect(panel.getByRole('button')).toHaveCount(choices.length)
        await panel.scrollIntoViewIfNeeded()
        await snap('choices')
        await panel.getByRole('button',{name:wrong,exact:true}).click()
        const wrongProgress=await savedProgress(page,c.unit.unitId)
        expect(wrongProgress.unitRevision).toBe(c.rev)
        expect(wrongProgress.answers[c.id]).toMatchObject({value:wrong,firstValue:wrong,attemptCount:1,isFirstCorrect:false,resolved:false})
        if(next)await expect(page.getByTestId('textbook-item-'+next.id)).not.toBeVisible()
        else await expect(page.getByTestId('textbook-unit-complete')).toHaveCount(0)
        await page.reload()
        expect(await savedProgress(page,c.unit.unitId)).toEqual(wrongProgress)
        if(next)await expect(page.getByTestId('textbook-item-'+next.id)).not.toBeVisible()
        else await expect(page.getByTestId('textbook-unit-complete')).toHaveCount(0)
        await trigger.click()
        await expect(page.getByTestId('textbook-hint-'+c.id).locator('span')).toHaveText(c.hint)
        await page.getByTestId('textbook-hint-'+c.id).scrollIntoViewIfNeeded()
        await snap('wrong')
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
        if(next)await expect(page.getByTestId('textbook-item-'+next.id)).toBeVisible()
        const retried=await savedProgress(page,c.unit.unitId)
        expect(retried.answers[c.id]).toMatchObject({value:item.answer,firstValue:wrong,attemptCount:2,isFirstCorrect:false,resolved:true,firstAnsweredAt:wrongProgress.answers[c.id].firstAnsweredAt})
        for(const q of items.slice(0,index))expect(retried.answers[q.id]).toEqual(previous[q.id])
        await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(0)
        await snap('complete')
        for(const q of items.slice(index+1)){
          await page.getByTestId('textbook-item-'+q.id).click()
          await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
          await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
        }
        const completed=await savedProgress(page,c.unit.unitId)
        expect(Object.keys(completed.answers)).toHaveLength(c.count)
        expect(completed.completedAt).toBeTruthy()
        await page.reload()
        expect(await savedProgress(page,c.unit.unitId)).toEqual(completed)
        await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
        await expect(page.getByTestId('resolved-'+items.at(-1)!.id)).toBeVisible()
        await expect(page.locator('.katex-error')).toHaveCount(0)
      })
    }
  }
})
