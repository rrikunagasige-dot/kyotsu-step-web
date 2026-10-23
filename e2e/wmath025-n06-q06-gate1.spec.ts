import { mkdirSync } from 'node:fs'
import { expect,test,type Page } from '@playwright/test'
import { mathNumbersN06Unit } from '../src/data/textbook/math/numbers/n06Lesson'
import { getTextbookChoices,type TextbookUnitProgress } from '../src/domain/textbook'

const item=mathNumbersN06Unit.sections[0].items.find(x=>x.id==='n06-06')!
const hint='積が正なので二数は同符号。和が負なので両方とも負になる。和と積を確かめ、最後にTをx²へ戻そう。'
const wrong=getTextbookChoices(mathNumbersN06Unit,item).find(choice=>choice!==item.answer)!
async function savedProgress(page:Page):Promise<TextbookUnitProgress>{
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state?.textbookProgress?.['math-numbers-expressions-n06'])
  expect(progress?.unitRevision).toBe(3)
  return progress
}
test.describe('W-MATH-025 P-004 N06 Q06 hint-only authentic Gate1',()=>{
  for(const width of [320,390,1440] as const){
    test('numbered Q06 wrong hint and retry '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM025_Q06!=='1','Evidence-only GitHub workflow')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      const sha=process.env.CAPTURE_SHA??''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      for(const accepted of ['n05-q11','n05-q18','n06-q03','n06-q12','n13-q05','n13-q08']){
        await page.goto('/#/review/'+accepted)
        await expect(page.getByTestId('review-preview-ready')).toBeVisible()
        await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(0)
      }
      const savedBefore=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      await page.goto('/#/review/n06-q06')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      await expect(page.getByTestId('review-mark-n06-formula-06')).toContainText('確認①')
      await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(1)
      await expect(page.getByTestId('review-preview-count')).toContainText('0/1')
      await expect(page.getByTestId('review-preview-count')).toContainText('全16穴')
      mkdirSync('e2e-evidence',{recursive:true})
      const snap=async(state:string)=>page.screenshot({path:'e2e-evidence/wm025-q06-'+state+'-'+width+'.png'})
      const trigger=page.getByTestId('textbook-item-n06-06')
      await trigger.scrollIntoViewIfNeeded()
      await expect(page.getByTestId('textbook-hint-n06-06')).not.toBeVisible()
      await snap('review-before')
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-n06-06')
      await panel.getByRole('button',{name:wrong,exact:true}).click()
      await expect(page.getByTestId('review-preview-count')).toContainText('0/1')
      await trigger.click()
      const shownHint=page.getByTestId('textbook-hint-n06-06')
      await expect(shownHint.locator('span')).toHaveText(hint)
      await expect(shownHint).not.toContainText('T−1とT−4')
      await panel.scrollIntoViewIfNeeded()
      await snap('review-wrong')
      await panel.getByRole('button',{name:item.answer,exact:true}).click()
      await expect(page.getByTestId('resolved-n06-06')).toBeVisible()
      await expect(page.getByTestId('review-preview-count')).toContainText('1/1')
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await snap('review-complete')
      expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(savedBefore)
    })
    test('normal N06 Q06 wrong/reload/retry and all 16 saved decisions '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM025_Q06!=='1','Evidence-only GitHub workflow')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/learning/textbook/math-numbers-expressions-n06')
      mkdirSync('e2e-evidence',{recursive:true})
      const items=mathNumbersN06Unit.sections[0].items
      expect(mathNumbersN06Unit.revision).toBe(3)
      expect(items).toHaveLength(16)
      for(const q of items.slice(0,5)){
        await page.getByTestId('textbook-item-'+q.id).click()
        await page.getByTestId('inline-choice-panel-'+q.id)
          .getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
      }
      const previous=(await savedProgress(page)).answers
      const trigger=page.getByTestId('textbook-item-n06-06')
      await trigger.scrollIntoViewIfNeeded()
      await expect(page.getByTestId('textbook-hint-n06-06')).not.toBeVisible()
      await expect(page.getByTestId('textbook-item-n06-07')).not.toBeVisible()
      await page.screenshot({path:'e2e-evidence/wm025-q06-normal-before-'+width+'.png'})
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-n06-06')
      await panel.getByRole('button',{name:wrong,exact:true}).click()
      await expect(page.getByTestId('textbook-item-n06-07')).not.toBeVisible()
      const wrongProgress=await savedProgress(page)
      expect(wrongProgress.answers['n06-06']).toMatchObject({value:wrong,firstValue:wrong,attemptCount:1,isFirstCorrect:false,resolved:false})
      await page.reload()
      expect(await savedProgress(page)).toEqual(wrongProgress)
      await expect(page.getByTestId('textbook-item-n06-07')).not.toBeVisible()
      await trigger.click()
      await expect(page.getByTestId('textbook-hint-n06-06').locator('span')).toHaveText(hint)
      await panel.scrollIntoViewIfNeeded()
      await page.screenshot({path:'e2e-evidence/wm025-q06-normal-wrong-'+width+'.png'})
      await panel.getByRole('button',{name:item.answer,exact:true}).click()
      await expect(page.getByTestId('resolved-n06-06')).toBeVisible()
      await expect(page.getByTestId('textbook-item-n06-07')).toBeVisible()
      await expect(page.getByTestId('review-mark-n06-formula-06')).toHaveCount(0)
      const retried=await savedProgress(page)
      expect(retried.answers['n06-06']).toMatchObject({value:item.answer,firstValue:wrong,attemptCount:2,isFirstCorrect:false,resolved:true,firstAnsweredAt:wrongProgress.answers['n06-06'].firstAnsweredAt})
      for(const q of items.slice(0,5))expect(retried.answers[q.id]).toEqual(previous[q.id])
      await page.screenshot({path:'e2e-evidence/wm025-q06-normal-complete-'+width+'.png'})
      for(const q of items.slice(6)){
        await page.getByTestId('textbook-item-'+q.id).click()
        await page.getByTestId('inline-choice-panel-'+q.id)
          .getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
      }
      const completed=await savedProgress(page)
      expect(Object.keys(completed.answers)).toHaveLength(16)
      expect(completed.completedAt).toBeTruthy()
      await page.reload()
      expect(await savedProgress(page)).toEqual(completed)
      await expect(page.getByTestId('resolved-n06-06')).toBeVisible()
      await expect(page.getByTestId('resolved-n06-16')).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
    })
  }
})
