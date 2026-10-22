import {mkdirSync,writeFileSync} from 'node:fs'
import {expect,test,type Page} from '@playwright/test'
import {mathNumbersN14Unit} from '../src/data/textbook/math/numbers/n14Lesson'
const cases=[['n14-wm020-q15-divide-left','3'],['n14-wm020-q15-divide-center','3'],['n14-wm020-q15-divide-right','3'],['n14-15','-\\frac23'],['n14-wm020-q15-bound-right','2']] as const
const dir='e2e-evidence/'
const photo=async(page:Page,name:string,w:number)=>{mkdirSync(dir,{recursive:true});await page.screenshot({path:dir+'q15-'+name+'-'+w+'.png'})}
async function fit(page:Page,w:number){
  const row=page.getByTestId('textbook-formula-n14-formula-15')
  const m=await row.evaluate(el=>{
    const r=el.getBoundingClientRect(), exp=el.querySelector('.reading-formula-expression') as HTMLElement
    const parts=Array.from(exp.children).map(p=>{const z=p.getBoundingClientRect();return{l:z.left,r:z.right,t:z.top}})
    const root=parseFloat(getComputedStyle(document.documentElement).fontSize)
    const buttons=Array.from(el.querySelectorAll('button.reading-formula-choice')).map(p=>{
      const z=p.getBoundingClientRect(),s=getComputedStyle(p)
      return{text:p.textContent?.trim(),label:p.getAttribute('aria-label'),w:z.width,h:z.height,color:s.color,border:s.borderColor}
    })
    return{l:r.left,r:r.right,scroll:el.scrollWidth,width:el.clientWidth,viewport:document.documentElement.clientWidth,display:getComputedStyle(exp).display,parts,buttons,root}
  })
  expect(m.parts).toHaveLength(6)
  expect(m.scroll,'Q15 inner clip '+w).toBeLessThanOrEqual(m.width+1)
  expect(m.r,'Q15 viewport clip '+w).toBeLessThanOrEqual(m.viewport+1)
  for(const p of m.parts){expect(p.l).toBeGreaterThanOrEqual(m.l-1);expect(p.r).toBeLessThanOrEqual(m.r+1)}
  for(const b of m.buttons){expect(b.text).toMatch(/^(選択|×)$/);expect(b.label).toBeTruthy();expect(b.w).toBeGreaterThanOrEqual(3.15*m.root-1);expect(b.h).toBeGreaterThanOrEqual(2*m.root-1);expect(b.color).toBe(b.border)}
  if(w<=430){expect(m.display).toBe('grid');expect(Math.min(...m.parts.slice(4).map(p=>p.t))-Math.min(...m.parts.slice(0,4).map(p=>p.t))).toBeGreaterThan(12)}
  else expect(m.display).toBe('flex')
}
const widths=[320,390,1440] as const
test.describe('W-MATH-020/P-001 SHA-bound native Gate1 capture',()=>{
  for(const width of widths){
    test('numbered review '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM020_GATE1!=='1')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(180_000)
      const sha=process.env.CAPTURE_SHA||''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/review/n14-q15')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      await expect(page.getByTestId('review-mark-n14-formula-15')).toBeVisible()
      await expect(page.getByTestId('review-mark-n14-formula-10')).toHaveCount(0)
      await fit(page,width)
      await page.getByTestId('textbook-item-'+cases[0][0]).scrollIntoViewIfNeeded()
      await photo(page,'review-before',width)
      for(const [i,[id,answer]] of cases.entries()){
        const b=page.getByTestId('textbook-item-'+id)
        await expect(b).toBeVisible()
        if(i<3){await expect(page.getByTestId('review-mark-n14-wm020-q15-explain')).toHaveCount(0);await expect(page.getByTestId('textbook-item-n14-15')).toHaveCount(0)}
        await b.focus();await b.press('Enter')
        const panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const good=panel.getByRole('button',{name:answer,exact:true})
        const key=await good.getAttribute('data-testid')
        const options=await panel.getByRole('button').all()
        let bad:(typeof options)[number]|undefined
        for(const o of options)if((await o.getAttribute('data-testid'))!==key){bad=o;break}
        expect(bad).toBeDefined()
        await bad!.click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await b.click()
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(i===0){await fit(page,width);await photo(page,'review-wrong',width)}
        await panel.getByRole('button',{name:answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await fit(page,width)
        if(i===2){
          await expect(page.getByTestId('review-mark-n14-wm020-q15-explain')).toBeVisible()
          await page.getByTestId('textbook-item-n14-15').scrollIntoViewIfNeeded()
          await photo(page,'review-bounds',width)
        }
        if(i!==4)await expect(page.getByTestId('textbook-item-n14-16')).toHaveCount(0)
      }
      await expect(page.getByTestId('review-preview-count')).toContainText('5/5')
      await expect(page.locator('.katex-error')).toHaveCount(0)
      writeFileSync(dir+'q15-review-'+width+'.json',JSON.stringify({sha,width,cases},null,2)+'\n')
    })
    test('real normal lesson '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM020_GATE1!=='1')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      const sha=process.env.CAPTURE_SHA||''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/learning/textbook/math-numbers-expressions-n14')
      await page.evaluate(()=>localStorage.clear());await page.reload()
      const items=mathNumbersN14Unit.sections[0].items
      const first=items.findIndex(i=>i.id===cases[0][0])
      expect(first).toBeGreaterThan(20)
      const answer=async(id:string,key:string)=>{
        const b=page.getByTestId('textbook-item-'+id);await expect(b).toBeVisible();await b.click()
        await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:key,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      }
      for(const a of items.slice(0,first))await answer(a.id,a.answer)
      await expect(page.locator('.review-marked-block')).toHaveCount(0)
      await fit(page,width)
      await page.getByTestId('textbook-item-'+cases[0][0]).scrollIntoViewIfNeeded()
      await photo(page,'normal-before',width)
      for(const [id,key] of cases.slice(0,3))await answer(id,key)
      await expect(page.locator('[data-derivation-id="n14-q15-chain"] .reading-derivation-step--paragraph')).toHaveCount(1)
      await page.getByTestId('textbook-item-n14-15').scrollIntoViewIfNeeded()
      await photo(page,'normal-bounds',width)
      for(const [id,key] of cases.slice(3))await answer(id,key)
      await expect(page.getByTestId('textbook-item-n14-16')).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await page.reload()
      for(const [id] of cases)await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      writeFileSync(dir+'q15-normal-'+width+'.json',JSON.stringify({sha,width,cases},null,2)+'\n')
    })
  }
})
