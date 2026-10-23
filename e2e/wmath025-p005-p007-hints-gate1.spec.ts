import { mkdirSync } from 'node:fs'
import { expect,test,type Page } from '@playwright/test'
import { mathNumbersN05Unit } from '../src/data/textbook/math/numbers/n05Lesson'
import { mathNumbersN07Unit } from '../src/data/textbook/math/numbers/n07Lesson'
import { mathNumbersN08Unit } from '../src/data/textbook/math/numbers/n08Lesson'
import { getTextbookChoices,type TextbookUnitProgress } from '../src/domain/textbook'

const cases=[
  {unit:mathNumbersN05Unit,id:'n05-06',q:6,target:'n05-q06-hint',rev:2,count:20,hint:"両端の係数と文字の指数を別々に見て、それぞれ何を二乗すると元の項に戻るか確かめよう。",old:"16は4の平方、9は3の平方。文字の指数にも注意する。"},
  {unit:mathNumbersN07Unit,id:'n07-09',q:9,target:'n07-q09-hint',rev:3,count:14,hint:"繰り返す数字の一周期が何桁か数えよう。その桁数だけ小数点を右へ動かして元の小数部分と揃え、差をとろう。",old:"100xとxの小数部分を揃え、左辺は100x−xにする。"},
  {unit:mathNumbersN08Unit,id:'n08-05',q:5,target:'n08-q05-hint',rev:3,count:12,hint:"根号の付いた数は、二乗すると根号の中の数に戻る。もう一方も二乗し、二つの値を比べよう。両方とも非負なので大小の向きは保たれる。",old:"√5を二乗すると5、3を二乗すると9。二つとも非負なので大小の向きは保たれる。"},
]
async function savedProgress(page:Page,unitId:string):Promise<TextbookUnitProgress>{
  return page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state?.textbookProgress?.[id],unitId)
}
test.describe('W025 P005 P006 P007 approved hint batch, genuine app evidence',()=>{
  for(const c of cases){
    const item=c.unit.sections[0].items.find(candidate=>candidate.id===c.id)!
    const choices=getTextbookChoices(c.unit,item)
    const wrong=choices.find(choice=>choice!==item.answer)!
    for(const width of [320,390,1440] as const){
      test(c.id+' review wrong hint and retry '+width,async({page},info)=>{
        test.skip(process.env.E2E_WM025_HINT_BATCH!=='1','Evidence-only branch workflow')
        test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
        const sha=process.env.CAPTURE_SHA??''
        expect(sha).toMatch(/^[0-9a-f]{40}$/)
        await page.setViewportSize({width,height:width===1440?1400:850})
        for(const accepted of ['n05-q11','n05-q18','n06-q03','n06-q06','n06-q12','n13-q05','n13-q08']){
          await page.goto('/#/review/'+accepted)
          await expect(page.getByTestId('review-preview-ready')).toBeVisible()
          await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(0)
        }
        const before=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
        await page.goto('/#/review/'+c.target)
        await expect(page.getByTestId('review-preview-ready')).toBeVisible()
        await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
        await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(1)
        await expect(page.getByTestId('review-mark-'+c.id.slice(0,3)+'-formula-'+c.id.slice(-2))).toContainText('確認①')
        await expect(page.getByTestId('review-preview-count')).toContainText('0/1')
        await expect(page.getByTestId('review-preview-count')).toContainText('全'+c.count+'穴')
        mkdirSync('e2e-evidence',{recursive:true})
        const snap=async(state:string)=>page.screenshot({path:'e2e-evidence/wm025-batch-'+c.id+'-review-'+state+'-'+width+'.png'})
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
        await expect(page.getByTestId('review-preview-count')).toContainText('0/1')
        await trigger.click()
        const shownHint=page.getByTestId('textbook-hint-'+c.id)
        await expect(shownHint.locator('span')).toHaveText(c.hint)
        await expect(shownHint).not.toContainText(c.old)
        await panel.scrollIntoViewIfNeeded()
        await snap('wrong')
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
        await expect(page.getByTestId('review-preview-count')).toContainText('1/1')
        await expect(page.locator('.katex-error')).toHaveCount(0)
        await snap('complete')
        expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(before)
      })
      test(c.id+' normal old wrong reload retry all original answers '+width,async({page},info)=>{
        test.skip(process.env.E2E_WM025_HINT_BATCH!=='1','Evidence-only branch workflow')
        test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
        test.setTimeout(240_000)
        await page.setViewportSize({width,height:width===1440?1400:850})
        await page.goto('/#/learning/textbook/'+c.unit.unitId)
        mkdirSync('e2e-evidence',{recursive:true})
        const snap=async(state:string)=>page.screenshot({path:'e2e-evidence/wm025-batch-'+c.id+'-normal-'+state+'-'+width+'.png'})
        const items=c.unit.sections[0].items
        expect(c.unit.revision).toBe(c.rev)
        expect(items).toHaveLength(c.count)
        for(const q of items.slice(0,c.q-1)){
          await page.getByTestId('textbook-item-'+q.id).click()
          await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
          await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
        }
        const previous=(await savedProgress(page,c.unit.unitId)).answers
        const next=items[c.q]
        const trigger=page.getByTestId('textbook-item-'+c.id)
        await trigger.scrollIntoViewIfNeeded()
        await expect(page.getByTestId('textbook-hint-'+c.id)).not.toBeVisible()
        await expect(page.getByTestId('textbook-item-'+next.id)).not.toBeVisible()
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
        await expect(page.getByTestId('textbook-item-'+next.id)).not.toBeVisible()
        await page.reload()
        expect(await savedProgress(page,c.unit.unitId)).toEqual(wrongProgress)
        await expect(page.getByTestId('textbook-item-'+next.id)).not.toBeVisible()
        await trigger.click()
        await expect(page.getByTestId('textbook-hint-'+c.id).locator('span')).toHaveText(c.hint)
        await panel.scrollIntoViewIfNeeded()
        await snap('wrong')
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
        await expect(page.getByTestId('textbook-item-'+next.id)).toBeVisible()
        const retried=await savedProgress(page,c.unit.unitId)
        expect(retried.answers[c.id]).toMatchObject({value:item.answer,firstValue:wrong,attemptCount:2,isFirstCorrect:false,resolved:true,firstAnsweredAt:wrongProgress.answers[c.id].firstAnsweredAt})
        for(const q of items.slice(0,c.q-1))expect(retried.answers[q.id]).toEqual(previous[q.id])
        await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(0)
        await snap('complete')
        for(const q of items.slice(c.q)){
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
