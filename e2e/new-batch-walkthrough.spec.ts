import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

const units = ['04', '05', '06', '07', '08', '11', '13', '14'] as const
const route = (n: string) => '/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n' + n

for (const n of units) {
  test('W-MATH-003 batch N' + n + ': all original choices, mobile/PC progression, persistence and figures', async ({ page }, testInfo) => {
    test.setTimeout(180_000)
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
    const items = unit.sections[0].items
    const figureIds = unit.sections[0].figures.map(f => f.id)
    await page.goto(route(n))
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
    await expect(page.getByTestId('textbook-item-' + items[0].id)).toBeVisible()
    const evidence = process.env.E2E_BATCH_EVIDENCE === '1'
    const device = testInfo.project.name.includes('mobile') ? 'mobile' : 'desktop'
    const pictured = new Set<string>()
    async function captureFigureWhenUnlocked() {
      for (const fig of figureIds) {
        if (pictured.has(fig)) continue
        const locator = page.getByTestId('textbook-figure-' + fig)
        if (await locator.count() === 0) continue
        await expect(locator).toBeVisible()
        pictured.add(fig)
        if (evidence) {
          await locator.scrollIntoViewIfNeeded()
          await page.screenshot({ path: 'e2e-evidence/n' + n + '-figure-' + fig + '-' + device + '.png', fullPage: false })
        }
      }
    }
    for (const fig of figureIds) {
      const locator = page.getByTestId('textbook-figure-' + fig)
      if (fig === 'n08-f01' || fig === 'n11-f01') await expect(locator).toBeVisible()
      else await expect(locator).toHaveCount(0)
    }
    await captureFigureWhenUnlocked()

    for (const [i, item] of items.entries()) {
      const trigger = page.getByTestId('textbook-item-' + item.id)
      await expect(trigger, item.id).toBeVisible()
      await trigger.click()
      const panel = page.getByTestId('inline-choice-panel-' + item.id)
      await expect(panel).toBeVisible()
      if (evidence && (i === 0 || i === Math.floor(items.length / 2))) {
        await trigger.scrollIntoViewIfNeeded()
        await page.screenshot({ path: 'e2e-evidence/n' + n + '-' + (i === 0 ? 'start' : 'middle') + '-' + device + '.png', fullPage: false })
      }
      await panel.getByRole('button', { name: item.answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + item.id)).toBeVisible()
      await captureFigureWhenUnlocked()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      if (i + 1 < items.length) await expect(page.getByTestId('textbook-item-' + items[i + 1].id)).toBeVisible()
    }
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    for (const fig of figureIds) {
      const image = page.getByTestId('textbook-figure-' + fig).locator('img')
      await expect(image).toBeVisible()
      expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), fig).toBe(true)
    }
    if (evidence) await page.screenshot({ path: 'e2e-evidence/n' + n + '-finish-' + device + '.png', fullPage: false })
    const width = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
    expect(width[0], 'document horizontal overflow').toBeLessThanOrEqual(width[1] + 2)
    await page.reload()
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    await expect(page.getByTestId('resolved-' + items[0].id)).toBeVisible()
  })
}


// W-MATH-014/P-001 — original N14 Q07: two sign-case thinking decisions
// plus the unchanged original final four-choice interval. Actual screenshots
// are written only when the existing native evidence workflow enables it.
for(const width of [320,390]){
  test('W-MATH-014 N14 Q07 sign-case proof, wrong/hint/retry and persisted choices at '+width+'px',
    async({page},testInfo)=>{
      test.skip(testInfo.project.name!=='mobile-chromium','Capture once per requested viewport')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:850})
      const unit=mathTextbookUnits.find(u=>u.unitId.endsWith('n14'))!
      const items=unit.sections[0].items
      const ids=['n14-wm014-q07-nonnegative','n14-wm014-q07-negative','n14-07']
      expect(unit.revision).toBe(9) // Q15 P001 adds 4 decisions; earlier approved items unchanged
      expect(items.slice(6,9).map(i=>i.id)).toEqual(ids)
      await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n14')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
      for(const item of items.slice(0,6)){
        const trigger=page.getByTestId('textbook-item-'+item.id)
        await expect(trigger,item.id).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+item.id)
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+item.id)).toBeVisible()
      }
      const evidence=process.env.E2E_BATCH_EVIDENCE==='1'
      if(evidence)mkdirSync('e2e-evidence',{recursive:true})
      for(const id of ids){
        const item=items.find(z=>z.id===id)!
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        let panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const correct=panel.getByRole('button',{name:item.answer,exact:true})
        await expect(correct).toBeVisible()
        const correctID=await correct.getAttribute('data-testid')
        for(const option of await panel.locator('.reading-choice-option').all())
          for(const line of await option.locator('.reading-choice-formula-line').all()){
            const dimensions=await line.evaluate(node=>[node.scrollWidth,node.clientWidth])
            expect(dimensions[0],id+' choice clipping').toBeLessThanOrEqual(dimensions[1]+1)
          }
        if(evidence){
          await trigger.scrollIntoViewIfNeeded()
          await page.screenshot({path:'e2e-evidence/wmath014-'+id+'-'+width+'-before.png'})
        }
        const options=await panel.getByRole('button').all()
        let wrong:(typeof options)[number]|undefined
        for(const option of options){
          if((await option.getAttribute('data-testid'))!==correctID){wrong=option;break}
        }
        expect(wrong).toBeDefined()
        await wrong!.click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath014-'+id+'-'+width+'-wrong.png',
        })
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await expect(page.locator('.katex-error')).toHaveCount(0)
        const bounds=await page.evaluate(()=>[
          document.documentElement.scrollWidth,document.documentElement.clientWidth,
        ])
        expect(bounds[0],id+' horizontal overflow').toBeLessThanOrEqual(bounds[1]+2)
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath014-'+id+'-'+width+'-resolved.png',
        })
      }
      await expect(page.getByTestId('textbook-item-n14-wm015-q08-nonnegative')).toBeVisible()
      await page.reload()
      for(const id of ids)await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      await expect(page.getByTestId('textbook-figure-n14-f01')).toBeVisible()
    })
}


// W-MATH-015/P-001: true browser interaction with N14 Q08 positive,
// negative and original final "または" choices; real screenshots only
// under preexisting E2E_BATCH_EVIDENCE flow, not mock screenshots.
for(const width of [320,390]){
  test('W-MATH-015 N14 Q08 strict outside proof and history at '+width+'px',
    async({page},testInfo)=>{
      test.skip(testInfo.project.name!=='mobile-chromium','Capture on mobile chromium')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:850})
      const unit=mathTextbookUnits.find(u=>u.unitId.endsWith('n14'))!
      const items=unit.sections[0].items
      const ids=['n14-wm015-q08-nonnegative','n14-wm015-q08-negative','n14-08']
      expect(unit.revision).toBe(9) // Q15 P001 adds 4 decisions; earlier approved items unchanged
      expect(items.slice(9,12).map(x=>x.id)).toEqual(ids)
      await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n14')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
      for(const item of items.slice(0,9)){
        const trigger=page.getByTestId('textbook-item-'+item.id)
        await expect(trigger,item.id).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+item.id)
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+item.id)).toBeVisible()
      }
      const evidence=process.env.E2E_BATCH_EVIDENCE==='1'
      if(evidence)mkdirSync('e2e-evidence',{recursive:true})
      for(const id of ids){
        const item=items.find(z=>z.id===id)!
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        let panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const right=panel.getByRole('button',{name:item.answer,exact:true})
        await expect(right).toBeVisible()
        const rightKey=await right.getAttribute('data-testid')
        for(const option of await panel.locator('.reading-choice-option').all())
          for(const line of await option.locator('.reading-choice-formula-line').all()){
            const widths=await line.evaluate(node=>[node.scrollWidth,node.clientWidth])
            expect(widths[0],id+' choice overflow').toBeLessThanOrEqual(widths[1]+1)
          }
        if(evidence){
          await trigger.scrollIntoViewIfNeeded()
          await page.screenshot({path:'e2e-evidence/wmath015-'+id+'-'+width+'-before.png'})
        }
        const choices=await panel.getByRole('button').all()
        let wrong:(typeof choices)[number]|undefined
        for(const choice of choices){
          if((await choice.getAttribute('data-testid'))!==rightKey){wrong=choice;break}
        }
        expect(wrong).toBeDefined()
        await wrong!.click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath015-'+id+'-'+width+'-wrong.png',
        })
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await expect(page.locator('.katex-error')).toHaveCount(0)
        const bounds=await page.evaluate(()=>[
          document.documentElement.scrollWidth,document.documentElement.clientWidth,
        ])
        expect(bounds[0],id+' page overflow').toBeLessThanOrEqual(bounds[1]+2)
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath015-'+id+'-'+width+'-resolved.png',
        })
      }
      await expect(page.getByTestId('textbook-item-n14-09')).toBeVisible()
      await page.reload()
      for(const id of ids)await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      await expect(page.getByTestId('resolved-n14-07')).toBeVisible()
      await expect(page.getByTestId('textbook-figure-n14-f01')).toBeVisible()
    })
}


// W-MATH-016/P-001 — actual N14 Q12 branch subtraction and preserved OR final.
// Capture only in existing, non-deploy evidence workflow; no mock screenshots.
for(const width of [320,390]){
  test('W-MATH-016 N14 Q12 separate subtraction branches and progress '+width+'px',
    async({page},testInfo)=>{
      test.skip(testInfo.project.name!=='mobile-chromium','Mobile evidence viewport')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:850})
      const unit=mathTextbookUnits.find(u=>u.unitId.endsWith('n14'))!
      const items=unit.sections[0].items
      const ids=['n14-wm016-q12-left','n14-wm016-q12-right','n14-12']
      expect(unit.revision).toBe(9) // Q15 P001 adds 4 decisions; earlier approved items unchanged
      expect(items.slice(19,22).map(x=>x.id)).toEqual(ids) // Q10 adds four prior items
      await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n14')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
      for(const item of items.slice(0,19)){ // includes four new Q10 operations before Q12
        const trigger=page.getByTestId('textbook-item-'+item.id)
        await expect(trigger,item.id).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+item.id)
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+item.id)).toBeVisible()
      }
      const evidence=process.env.E2E_BATCH_EVIDENCE==='1'
      if(evidence)mkdirSync('e2e-evidence',{recursive:true})
      for(const id of ids){
        const item=items.find(z=>z.id===id)!
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        let panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const right=panel.getByRole('button',{name:item.answer,exact:true})
        await expect(right).toBeVisible()
        const rightKey=await right.getAttribute('data-testid')
        for(const opt of await panel.locator('.reading-choice-option').all())
          for(const line of await opt.locator('.reading-choice-formula-line').all()){
            const w=await line.evaluate(node=>[node.scrollWidth,node.clientWidth])
            expect(w[0],id+' formula clipping').toBeLessThanOrEqual(w[1]+1)
          }
        if(evidence){
          await trigger.scrollIntoViewIfNeeded()
          await page.screenshot({path:'e2e-evidence/wmath016-'+id+'-'+width+'-before.png'})
        }
        const options=await panel.getByRole('button').all()
        let wrong:(typeof options)[number]|undefined
        for(const option of options){
          if((await option.getAttribute('data-testid'))!==rightKey){wrong=option;break}
        }
        expect(wrong).toBeDefined()
        await wrong!.click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath016-'+id+'-'+width+'-wrong.png',
        })
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await expect(page.locator('.katex-error')).toHaveCount(0)
        const pageBounds=await page.evaluate(()=>[
          document.documentElement.scrollWidth,document.documentElement.clientWidth,
        ])
        expect(pageBounds[0],id+' page horizontal overflow').toBeLessThanOrEqual(pageBounds[1]+2)
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath016-'+id+'-'+width+'-resolved.png',
        })
      }
      await expect(page.getByTestId('textbook-item-n14-13')).toBeVisible()
      await page.reload()
      for(const id of ids)await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      for(const id of ['n14-07','n14-08','n14-11'])
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      await expect(page.getByTestId('textbook-figure-n14-f01')).toBeVisible()
    })
}


// W-MATH-019/P-001: independent real-browser Q14 check in an already-approved
// math E2E workflow. Never infer formula fit from document scrollWidth only.
for(const width of [320,390,1440] as const){
  test('W-MATH-019/Q14 narrow real Chromium '+width, async({page},info)=>{
    test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
    test.setTimeout(240_000)
    await page.setViewportSize({width,height:width===1440?1000:850})
    const unit=mathTextbookUnits.find(u=>u.unitId.endsWith('n14'))!
    const ids=['n14-wm019-q14-add-left','n14-wm019-q14-add-center','n14-wm019-q14-add-right','n14-14','n14-wm019-q14-bound-right']
    const items=unit.sections[0].items
    const first=items.findIndex(i=>i.id===ids[0])
    expect(first).toBeGreaterThan(20)
    await page.goto(route('14'))
    await page.evaluate(()=>localStorage.clear())
    await page.reload()
    const answer=async(id:string,value:string)=>{
      const button=page.getByTestId('textbook-item-'+id)
      await expect(button,id).toBeVisible()
      await button.click()
      await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:value,exact:true}).click()
      await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    }
    for(const prior of items.slice(0,first)) await answer(prior.id,prior.answer)
    const line=page.getByTestId('textbook-formula-n14-formula-14')
    const chain=page.locator('[data-derivation-id="n14-q14-chain"]')
    const reason=chain.locator('.reading-derivation-step--paragraph')
    await expect(line).toBeVisible()
    await expect(reason).toHaveCount(0)
    await expect(chain.locator('.reading-formula-line')).toHaveCount(2)
    const measure=async()=>{
      const m=await line.evaluate(el=>{
        const b=el.getBoundingClientRect()
        const e=el.querySelector('.reading-formula-expression') as HTMLElement
        const parts=Array.from(e.children).map(k=>{const r=k.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top}})
        const buttons=Array.from(el.querySelectorAll('button.reading-formula-choice')).map(k=>{
          const s=getComputedStyle(k),r=k.getBoundingClientRect()
          return {text:k.textContent?.trim(),w:r.width,h:r.height,minw:parseFloat(s.minWidth),minh:parseFloat(s.minHeight),
            label:k.getAttribute('aria-label'),color:s.color,borderColor:s.borderColor}
        })
        return {scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,left:b.left,right:b.right,
          display:getComputedStyle(e).display,parts,buttons}
      })
      expect(m.parts).toHaveLength(6)
      expect(m.scrollWidth,'N14 Q14 formula clips internally at '+width).toBeLessThanOrEqual(m.clientWidth+1)
      for(const p of m.parts){
        expect(p.left,'N14 Q14 left clip '+width).toBeGreaterThanOrEqual(m.left-1)
        expect(p.right,'N14 Q14 right clip '+width).toBeLessThanOrEqual(m.right+1)
      }
      for(const b of m.buttons){
        expect(['選択','×']).toContain(b.text)
        expect(b.label).toBeTruthy()
        expect(b.w).toBeGreaterThanOrEqual(b.minw-1)
        expect(b.h).toBeGreaterThanOrEqual(b.minh-1)
        expect(b.color).toBe(b.borderColor)
      }
      if(width<=430){
        expect(m.display).toBe('grid')
        expect(Math.min(...m.parts.slice(4).map(k=>k.top))-Math.min(...m.parts.slice(0,4).map(k=>k.top))).toBeGreaterThan(12)
      }else expect(m.display).toBe('flex')
      return m
    }
    for(const [i,id] of ids.entries()){
      const item=items.find(k=>k.id===id)!
      await page.getByTestId('textbook-item-'+id).scrollIntoViewIfNeeded()
      if(i<3){
        await measure()
        await expect(reason).toHaveCount(0)
        await expect(page.getByTestId('textbook-item-n14-14')).toHaveCount(0)
      }else await expect(reason).toHaveCount(1)
      const button=page.getByTestId('textbook-item-'+id)
      await button.focus()
      await button.press('Enter')
      const panel=page.getByTestId('inline-choice-panel-'+id)
      const opts=await panel.getByRole('button').all()
      const right=panel.getByRole('button',{name:item.answer,exact:true})
      const rightId=await right.getAttribute('data-testid')
      let bad:(typeof opts)[number]|undefined
      for(const opt of opts)if((await opt.getAttribute('data-testid'))!==rightId){bad=opt;break}
      expect(bad).toBeDefined()
      await bad!.click()
      await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
      await button.click()
      await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
      await panel.getByRole('button',{name:item.answer,exact:true}).click()
      await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      if(i===2){
        await expect(reason).toHaveCount(1)
        await expect(reason.first()).toContainText('中央の−2と＋2')
      }
      if(i!==4) await expect(page.getByTestId('textbook-item-n14-15')).toHaveCount(0)
    }
    await expect(page.getByTestId('textbook-item-n14-15')).toBeVisible()
    await expect(page.locator('.katex-error')).toHaveCount(0)
    const v=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth])
    expect(v[0]).toBeLessThanOrEqual(v[1]+2)
    await page.reload()
    for(const id of ids)await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    await expect(page.getByTestId('resolved-n14-10')).toBeVisible()
  })
}
