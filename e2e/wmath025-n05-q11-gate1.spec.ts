import { mkdirSync } from 'node:fs'
import { expect,test } from '@playwright/test'
import { mathNumbersN05Unit } from '../src/data/textbook/math/numbers/n05Lesson'
const item=mathNumbersN05Unit.sections[0].items.find(x=>x.id==='n05-11')!
const hint='積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。'
test.describe('W-MATH-025 approved N05-Q11 hint-only real image Gate1',()=>{
  for(const width of [320,390,1440] as const){
    test('real wrong hint and retry '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM025_Q11!=='1','Evidence-only GitHub workflow')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      const sha=process.env.CAPTURE_SHA??''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/review/n05-q11')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      await expect(page.getByTestId('review-mark-n05-formula-11')).toContainText('確認①')
      await expect(page.getByTestId('review-preview-count')).toContainText('0/1')
      await expect(page.getByTestId('review-preview-count')).toContainText('全20穴')
      mkdirSync('e2e-evidence',{recursive:true})
      const snap=async(state:string)=>page.screenshot({path:'e2e-evidence/wm025-q11-'+state+'-'+width+'.png'})
      const trigger=page.getByTestId('textbook-item-n05-11')
      await trigger.scrollIntoViewIfNeeded()
      await snap('review-before')
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-n05-11')
      await panel.getByRole('button',{name:item.choices![1],exact:true}).click()
      await trigger.click()
      await expect(page.getByTestId('textbook-hint-n05-11')).toContainText(hint)
      await snap('review-wrong')
      await panel.getByRole('button',{name:item.answer,exact:true}).click()
      await expect(page.getByTestId('resolved-n05-11')).toBeVisible()
      await expect(page.getByTestId('review-preview-count')).toContainText('1/1')
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await snap('review-complete')
    })
    test('normal N05 previous 10 decisions preserved and Q18 hint '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM025_Q11!=='1','Evidence-only GitHub workflow')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/learning/textbook/math-numbers-expressions-n05')
      mkdirSync('e2e-evidence',{recursive:true})
      const items=mathNumbersN05Unit.sections[0].items
      expect(items).toHaveLength(20)
      for(const q of items.slice(0,10)){
        const trigger=page.getByTestId('textbook-item-'+q.id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        await page.getByTestId('inline-choice-panel-'+q.id)
          .getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
      }
      const trigger=page.getByTestId('textbook-item-n05-11')
      await trigger.scrollIntoViewIfNeeded()
      await page.screenshot({path:'e2e-evidence/wm025-q11-normal-before-'+width+'.png'})
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-n05-11')
      await panel.getByRole('button',{name:item.choices![1],exact:true}).click()
      await trigger.click()
      await expect(page.getByTestId('textbook-hint-n05-11')).toContainText(hint)
      await page.screenshot({path:'e2e-evidence/wm025-q11-normal-wrong-'+width+'.png'})
      await panel.getByRole('button',{name:item.answer,exact:true}).click()
      await expect(page.getByTestId('resolved-n05-11')).toBeVisible()
      await expect(page.getByTestId('textbook-item-n05-12')).toBeVisible()
      await page.screenshot({path:'e2e-evidence/wm025-q11-normal-complete-'+width+'.png'})
      await page.reload()
      await expect(page.getByTestId('resolved-n05-11')).toBeVisible()
    })
  }
})
