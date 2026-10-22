import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN14Unit } from '../src/data/textbook/math/numbers/n14Lesson'

const id = 'n14-wm020-q15-divide-center'
const hintText = '3xの係数を1にするには、どんな正の数で割ればよいか考えよう。正の数で割れば不等号の向きと等号は変わらない。'
const out = 'e2e-evidence/'
for (const width of [320, 390, 1440]) {
  test('W-MATH-021 approved Q15 center wrong-hint real learning '+width, async ({page}, info) => {
    test.skip(process.env.E2E_WM021_HINT!=='1', 'run only on exact W-MATH-021 approved PR')
    test.skip(width===1440 ? info.project.name!=='desktop-chromium' : info.project.name!=='mobile-chromium')
    test.setTimeout(240_000)
    const sourceSha=process.env.CAPTURE_SHA || ''
    expect(sourceSha).toMatch(/^[0-9a-f]{40}$/)
    await page.setViewportSize({width,height:width===1440?1000:850})
    await page.goto('/#/learning/textbook/math-numbers-expressions-n14')
    await page.evaluate(()=>localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
    const items=mathNumbersN14Unit.sections[0].items
    const where=items.findIndex(item=>item.id===id)
    expect(where).toBeGreaterThan(20)
    const correct=async(itemId:string,answer:string)=>{
      const trigger=page.getByTestId('textbook-item-'+itemId)
      await expect(trigger).toBeVisible()
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-'+itemId)
      await expect(panel).toBeVisible()
      await panel.getByRole('button',{name:answer,exact:true}).click()
      await expect(page.getByTestId('resolved-'+itemId)).toBeVisible()
    }
    for(const item of items.slice(0,where))await correct(item.id,item.answer)
    const trigger=page.getByTestId('textbook-item-'+id)
    await expect(trigger).toBeVisible()
    const hint=page.getByTestId('textbook-hint-'+id)
    await expect(hint).toHaveCount(0)
    await expect(page.getByTestId('textbook-item-n14-15')).toHaveCount(0)
    await trigger.focus()
    await trigger.press('Enter')
    let panel=page.getByTestId('inline-choice-panel-'+id)
    await expect(panel).toBeVisible()
    const good=panel.getByRole('button',{name:'3',exact:true})
    const key=await good.getAttribute('data-testid')
    const choices=await panel.getByRole('button').all()
    let wrong:(typeof choices)[number]|undefined
    for(const c of choices)if((await c.getAttribute('data-testid'))!==key){wrong=c;break}
    expect(wrong).toBeDefined()
    await wrong!.click()
    await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
    await expect(trigger).toHaveAttribute('class',/--wrong/)
    await trigger.click()
    panel=page.getByTestId('inline-choice-panel-'+id)
    await expect(panel).toBeVisible()
    await expect(hint).toBeVisible()
    await expect(hint.locator('span')).toHaveText(hintText) // ignore the unchanged 'ヒント' heading
    await expect(hint).not.toContainText('3x÷3=x')
    await expect(page.getByTestId('textbook-item-n14-15')).toHaveCount(0)
    await hint.scrollIntoViewIfNeeded()
    const root=await hint.evaluate(el=>{
      const r=el.getBoundingClientRect()
      return {l:r.left,r:r.right,w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}
    })
    expect(root.l).toBeGreaterThanOrEqual(-1)
    expect(root.r).toBeLessThanOrEqual(root.w+1)
    expect(root.scroll).toBeLessThanOrEqual(root.w+2)
    await expect(page.locator('.katex-error')).toHaveCount(0)
    mkdirSync(out,{recursive:true})
    const png='wm021-q15-center-wrong-'+width+'.png'
    await page.screenshot({path:out+png,fullPage:false})
    await panel.getByRole('button',{name:'3',exact:true}).click()
    await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    const rest=items.slice(where+1,where+4)
    expect(rest.map(item=>item.id)).toEqual(['n14-wm020-q15-divide-right','n14-15','n14-wm020-q15-bound-right'])
    for(const item of rest)await correct(item.id,item.answer)
    await expect(page.getByTestId('textbook-item-n14-16')).toBeVisible()
    await page.reload()
    await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    writeFileSync(out+'wm021-q15-center-'+width+'.json',JSON.stringify({
      sourceSha,width,changedId:id,hint:hintText,
      source:'real ordinary textbook N14, wrong then hint then retry',
      rest:rest.map(item=>item.id),image:png,
    },null,2)+'\n')
  })
}