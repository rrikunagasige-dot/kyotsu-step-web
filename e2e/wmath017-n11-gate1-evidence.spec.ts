import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

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
      { block: 'n11-lead-05', item: 'n11-wm017-q05-operation', correct: '2', label: '確認①' },
      { block: 'n11-formula-05', item: 'n11-05', correct: '7', label: '確認②' },
    ],
  },
] as const

test.describe('W-MATH-017 P-003 SHA-locked real application gate-1 images', () => {
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
        const mark=page.getByTestId('review-mark-'+step.block)
        await expect(mark).toContainText(step.label)
        await expect(mark).toBeVisible()
        const trigger=page.getByTestId('textbook-item-'+step.item)
        await expect(trigger).toBeVisible()
        if(spec.route==='n11-q05' && i===0){
          // Operation chosen first; worked-out transformed line must remain gated.
          await expect(page.getByTestId('textbook-item-n11-05')).toHaveCount(0)
        }
        if(spec.route==='n11-q05' && i===1){
          await expect(mark).toContainText('3x')
          await expect(page.getByText('ここまでで')).toHaveCount(0)
        }
        await mark.evaluate(e=>window.scrollTo({top:Math.max(0,window.scrollY+e.getBoundingClientRect().top-innerHeight*0.32),left:0,behavior:'instant'}))
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
