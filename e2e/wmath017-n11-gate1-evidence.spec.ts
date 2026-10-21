import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN11Unit } from '../src/data/textbook/math/numbers/n11Lesson'

const specs = [
  {
    route: 'n11-q01',
    steps: [
      { block: 'n11-formula-01', item: 'n11-01', correct: '>', label: '確認①' },
    ],
  },
  {
    route: 'n11-q05',
    steps: [
      { block: 'n11-formula-05', item: 'n11-wm017-q05-operation', correct: '2', label: '確認①' },
      { block: 'n11-formula-05', item: 'n11-wm017-q05-balance', correct: '2', label: '確認①' },
      { block: 'n11-after-05', item: 'n11-05', correct: '7', label: '確認②' },
      { block: 'n11-formula-06', item: 'n11-06', correct: '\\frac73', label: '確認③' },
    ],
  },
] as const

test.describe('W-MATH-017 P-005/P-006 SHA-locked real application gate-1 images', () => {
  for (const width of [320,390,1440]) for (const spec of specs) {
    test(spec.route + ' real learner before/wrong/retry/resolved at ' + width, async ({ page }, info) => {
      test.skip(process.env.E2E_WM017_GATE1 !== '1', 'Only existing approved PR evidence flow')
      test.skip(width===1440 ? info.project.name!=='desktop-chromium' : info.project.name!=='mobile-chromium')
      test.setTimeout(180_000)
      const sha=process.env.CAPTURE_SHA || ''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/review/' + spec.route)
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      const originalStorage=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      mkdirSync('e2e-evidence',{recursive:true})
      const evidence=[]

      for(const [i,step] of spec.steps.entries()){
        const changedExplanationId=spec.route==='n11-q05'
          ? (i===2?'n11-p006-q05-cancel-explain':i===3?'n11-p006-q06-positive-explain':null)
          : null
        const mark=page.getByTestId('review-mark-'+(changedExplanationId??step.block))
        const trigger=page.getByTestId('textbook-item-'+step.item)
        await expect(trigger).toBeVisible()
        if(spec.route==='n11-q01'||changedExplanationId){
          await expect(mark).toContainText(spec.route==='n11-q01'?'確認①':i===2?'確認①':'確認②')
          await expect(mark).toBeVisible()
        }
        if(spec.route==='n11-q05' && i===0){
          // Operation chosen first; worked-out transformed line must remain gated.
          await expect(page.getByTestId('textbook-item-n11-05')).toHaveCount(0)
        }
        if(spec.route==='n11-q05' && i<2){
          await expect(page.getByTestId('textbook-item-n11-05')).toHaveCount(0)
        }
        if(spec.route==='n11-q05' && i<3){
          await expect(page.getByTestId('textbook-item-n11-06')).toHaveCount(0)
        }
        if(spec.route==='n11-q05'){
          const explanations=page.locator('[data-derivation-id="n11-q05-q06-chain"] .reading-derivation-step--paragraph')
          await expect(explanations).toHaveCount(i<2?0:i===2?1:2)
          if(i===2)await expect(page.getByTestId('review-mark-n11-p006-q06-positive-explain')).toHaveCount(0)
        }
        const anchor=(spec.route==='n11-q01'||changedExplanationId)?mark:trigger
        await anchor.evaluate(e=>window.scrollTo({top:Math.max(0,window.scrollY+e.getBoundingClientRect().top-innerHeight*0.32),left:0,behavior:'instant'}))
        for(const state of ['before','wrong','resolved'] as const){
          if(state==='before'){
            await expect(mark).toBeVisible()
          } else if(state==='wrong'){
            await trigger.click()
            const panel=page.getByTestId('inline-choice-panel-'+step.item)
            await expect(panel).toBeVisible()
            const correctBtn=panel.getByRole('button',{name:step.correct,exact:true})
            const rightTestId=await correctBtn.getAttribute('data-testid')
            const all=await panel.getByRole('button').all()
            const ids=await Promise.all(all.map(b=>b.getAttribute('data-testid')))
            const wrong=all.find((_,idx)=>ids[idx]!==rightTestId)
            expect(wrong).toBeDefined()
            await wrong!.click()
            await expect(page.getByTestId('resolved-'+step.item)).toHaveCount(0)
            await trigger.click()
            await expect(page.getByTestId('textbook-hint-'+step.item)).toBeVisible()
          } else {
            const panel=page.getByTestId('inline-choice-panel-'+step.item)
            await panel.getByRole('button',{name:step.correct,exact:true}).click()
            await expect(page.getByTestId('resolved-'+step.item)).toBeVisible()
          }
          await expect(page.locator('.katex-error')).toHaveCount(0)
          const path='e2e-evidence/'+spec.route+'-step-'+(i+1)+'-'+state+'-'+width+'.png'
          await page.screenshot({path,fullPage:false})
          evidence.push({state,file:path,item:step.item,viewport:width})
          if(width!==1440){
            const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
            expect(over).toBeLessThanOrEqual(2)
          }
        }
      }
      expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(originalStorage)
      writeFileSync('e2e-evidence/'+spec.route+'-manifest-'+width+'.json',JSON.stringify({sha,route:spec.route,width,evidence},null,2)+'\n')
    })
  }
})


test.describe('W-MATH-017 P-006 four-line derivation plus conditional explanations in normal learner route', () => {
  for (const width of [320,390,1440]) {
    test('N11 ordinary lesson four-row Q05/Q06 at '+width, async ({page},info)=>{
      test.skip(process.env.E2E_WM017_GATE1 !== '1','Only approved existing Gate1 evidence runner')
      test.skip(width===1440 ? info.project.name!=='desktop-chromium' : info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      const sha=process.env.CAPTURE_SHA||''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/learning/textbook/math-numbers-expressions-n11')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
      const items=mathNumbersN11Unit.sections[0].items
      const screenshot=async(name:string,triggerId:string)=>{
        const trigger=page.getByTestId('textbook-item-'+triggerId)
        if(await trigger.count()) await trigger.scrollIntoViewIfNeeded()
        else {
          const resolved=page.getByTestId('resolved-'+triggerId)
          await resolved.scrollIntoViewIfNeeded()
        }
        await expect(page.locator('.review-marked-block')).toHaveCount(0)
        await expect(page.locator('.katex-error')).toHaveCount(0)
        if(width!==1440){
          const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
          expect(over,name+' ordinary page overflow').toBeLessThanOrEqual(2)
        }
        await page.screenshot({path:'e2e-evidence/n11-normal-'+name+'-'+width+'.png',fullPage:false})
      }
      const answer=async(id:string,correct:string)=>{
        await page.getByTestId('textbook-item-'+id).click()
        await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:correct,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      }
      await screenshot('q01-before','n11-01')
      await answer('n11-01',items[0].answer)
      await screenshot('q01-after','n11-01')
      for(const item of items.slice(1,9))await answer(item.id,item.answer)
      const op='n11-wm017-q05-operation'
      const balance='n11-wm017-q05-balance'
      const calc='n11-05'
      const fraction='n11-06'
      const chain=page.locator('[data-derivation-id="n11-q05-q06-chain"]')
      const explanation1='両辺に同じ数を足しても、不等号の向きは変わらない。左辺では−2と＋2が打ち消し合う。'
      const explanation2='xの係数は正の3なので、両辺を3で割っても不等号の向きは変わらない。'
      const reasons=chain.locator('.reading-derivation-step--paragraph')
      await screenshot('q05-operation-before',op)
      await expect(reasons).toHaveCount(0)
      await expect(chain.locator('.reading-formula-line')).toHaveCount(2)
      await expect(page.getByTestId('textbook-item-'+calc)).toHaveCount(0)
      await answer(op,'2')
      await screenshot('q05-balance-before',balance)
      await expect(reasons).toHaveCount(0)
      await expect(page.getByTestId('textbook-item-'+calc)).toHaveCount(0)
      await answer(balance,'2')
      await expect(reasons).toHaveCount(1)
      await expect(reasons.nth(0)).toContainText(explanation1)
      await expect(page.getByText(explanation2,{exact:true})).toHaveCount(0)
      await screenshot('q05-result-before',calc)
      await expect(chain.locator('.reading-formula-line')).toHaveCount(3)
      await answer(calc,'7')
      await expect(reasons).toHaveCount(2)
      await expect(reasons.nth(1)).toContainText(explanation2)
      await screenshot('q06-fraction-before',fraction)
      await expect(chain.locator('.reading-formula-line')).toHaveCount(4)
      await answer(fraction,'\\frac73')
      await screenshot('q06-after',fraction)
      await expect(chain.locator('.reading-formula-line')).toHaveCount(4)
      await expect(page.getByTestId('textbook-item-n11-07')).toBeVisible()
      writeFileSync('e2e-evidence/n11-normal-manifest-'+width+'.json',JSON.stringify({sha,route:'ordinary N11 four-line complete context',width,ids:['n11-01',op,balance,calc,fraction]},null,2)+'\n')
    })
  }
})
