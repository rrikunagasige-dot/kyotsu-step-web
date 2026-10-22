import { mkdirSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { mathNumbersN13Unit } from '../src/data/textbook/math/numbers/n13Lesson'

const choices = [['n13-wm023-q05-right','x-1'],['n13-05','1-x']] as const
const shots = 'e2e-evidence'
const snapshot = async(page:Page,name:string,width:number)=>{
  mkdirSync(shots,{recursive:true})
  await page.screenshot({path:shots+'/wm023-q05-'+name+'-'+width+'.png',fullPage:false})
}
const checkFit = async(page:Page,width:number)=>{
  for(const id of ['n13-wm023-q05-right','n13-formula-05']){
    const el=page.getByTestId('textbook-formula-'+id)
    if(!(await el.count()))continue
    const v=await el.evaluate(e=>{
      const b=e.getBoundingClientRect()
      const expr=e.querySelector('.reading-formula-expression') as HTMLElement
      const root=parseFloat(getComputedStyle(document.documentElement).fontSize)
      const parts=Array.from(expr.children).map(p=>{
        const r=p.getBoundingClientRect()
        return {left:r.left,right:r.right,top:r.top,height:r.height}
      })
      const buttons=Array.from(e.querySelectorAll('button.reading-formula-choice')).map(q=>{
        const r=q.getBoundingClientRect()
        const st=getComputedStyle(q)
        return {text:q.textContent?.trim(),aria:q.getAttribute('aria-label'),width:r.width,height:r.height,color:st.color,border:st.borderColor}
      })
      return {left:b.left,right:b.right,width:e.clientWidth,scroll:e.scrollWidth,display:getComputedStyle(expr).display,parts,buttons,root,viewport:document.documentElement.clientWidth}
    })
    expect(v.parts,id).toHaveLength(2)
    if(width<=350){expect(v.display).toBe('grid');expect(v.parts[1].top-v.parts[0].top).toBeGreaterThan(8)}
    else expect(v.display).toBe('flex')
    expect(v.right,id+' viewport at '+width).toBeLessThanOrEqual(v.viewport+1)
    expect(v.scroll,id+' overflow at '+width).toBeLessThanOrEqual(v.width+1)
    for(const p of v.parts){expect(p.left).toBeGreaterThanOrEqual(v.left-1);expect(p.right).toBeLessThanOrEqual(v.right+1)}
    for(const q of v.buttons){
      expect(q.text).toMatch(/^(選択|×)$/)
      expect(q.aria).toBeTruthy()
      expect(q.width).toBeGreaterThanOrEqual(v.root*3.15-1)
      expect(q.height).toBeGreaterThanOrEqual(v.root*2-1)
      expect(q.color).toBe(q.border)
    }
  }
}
test.describe('W-MATH-023 P-002 Stage A — N13 Q05 real exact-SHA Gate1 evidence',()=>{
  for(const width of [320,390,1440] as const){
    test('numbered review, wrong-hint-retry and no learner writes '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM023_Q05!=='1','W-MATH-023 Q05 GitHub evidence-only workflow')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(180_000)
      const sha=process.env.CAPTURE_SHA??''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/review/n13-q05')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      await expect(page.getByTestId('review-preview-count')).toContainText('0/2')
      await expect(page.getByTestId('review-preview-count')).toContainText('全10穴')
      await expect(page.getByTestId('review-mark-n13-wm023-q05-right')).toContainText('確認①')
      await expect(page.getByTestId('review-mark-n13-formula-05')).toHaveCount(0) // locked until first case is answered
      const before=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      await expect(page.getByTestId('textbook-figure-n13-f01')).toBeVisible()
      await page.getByTestId('textbook-item-'+choices[0][0]).scrollIntoViewIfNeeded()
      await checkFit(page,width)
      await snapshot(page,'review-before',width)
      for(const [i,[id,answer]] of choices.entries()){
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const wrong=mathNumbersN13Unit.sections[0].items.find(q=>q.id===id)!.choices!.find(x=>x!==answer)!
        await panel.getByRole('button',{name:wrong,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        await checkFit(page,width)
        if(i===0)await snapshot(page,'review-wrong',width)
        await panel.getByRole('button',{name:answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        if(i===0){
          await expect(page.getByTestId('textbook-item-n13-05')).toBeVisible()
          await expect(page.getByTestId('review-mark-n13-formula-05')).toContainText('確認②')
        }
        await expect(page.getByTestId('review-preview-count')).toContainText((i+1)+'/2')
      }
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await snapshot(page,'review-complete',width)
      const after=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      expect(after).toBe(before)
    })
    test('normal lesson unlocks Q05 from original figure and preserves solved history '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM023_Q05!=='1','W-MATH-023 Q05 GitHub evidence-only workflow')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/learning/textbook/math-numbers-expressions-n13')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      const items=mathNumbersN13Unit.sections[0].items
      expect(items.map(i=>i.id).slice(4,6)).toEqual(choices.map(c=>c[0]))
      const solve=async(id:string,value:string)=>{
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:value,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      }
      for(const prior of items.slice(0,4))await solve(prior.id,prior.answer)
      await expect(page.getByTestId('textbook-figure-n13-f01')).toBeVisible()
      await expect(page.getByTestId('textbook-item-n13-wm023-q05-right')).toBeVisible()
      await expect(page.getByTestId('textbook-item-n13-05')).toHaveCount(0)
      await checkFit(page,width)
      await page.getByTestId('textbook-item-n13-wm023-q05-right').scrollIntoViewIfNeeded()
      await snapshot(page,'normal-before',width)
      await solve(...choices[0])
      await expect(page.getByTestId('textbook-item-n13-05')).toBeVisible()
      await solve(...choices[1])
      await expect(page.getByTestId('textbook-item-n13-06')).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await snapshot(page,'normal-complete',width)
      await page.reload()
      for(const id of [...items.slice(0,4).map(q=>q.id),...choices.map(c=>c[0])])
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      const d=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth])
      expect(d[0]).toBeLessThanOrEqual(d[1]+2)
    })
  }
})
