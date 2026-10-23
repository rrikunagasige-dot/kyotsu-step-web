import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

const units = mathTextbookUnits.filter(u => u.chapter?.chapterId === 'math-ch01-numbers-expressions')
const unit = (id: string) => units.find(u => u.unitId === 'math-numbers-expressions-' + id)!
const bridge1 = 'ここまでは、共通する式を一つのまとまりとして見たり'
const bridge2 = 'ここまでは、平方根の積や商を計算し'
const root = 'e2e-evidence/wmath027'
const route = (path: string) => '/kyotsu-step-web/#' + path
const ids = ['numbers-polynomials', 'numbers-real', 'numbers-inequalities']
async function fits(page: Page) {
  await expect(page.locator('.katex-error')).toHaveCount(0)
  const widths = await page.evaluate(() => [document.documentElement.clientWidth, document.documentElement.scrollWidth])
  expect(widths[1]).toBeLessThanOrEqual(widths[0] + 1)
}
async function setup(page: Page) {
  await page.goto(route('/learning/setup?subject=math-1a'))
  await expect(page.getByTestId('math-textbook-chapter-1')).toBeVisible()
}
async function seed(page: Page, complete: string[], partial: string[]) {
  await page.evaluate(({ all, completeIds, partialIds }) => {
    const raw = JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}')
    raw.state ??= {}; raw.state.textbookProgress ??= {}
    for (const u of all) {
      const items = u.sections.flatMap(s => s.items)
      if (!completeIds.includes(u.unitId) && !partialIds.includes(u.unitId)) continue
      const selected = completeIds.includes(u.unitId) ? items : items.slice(0, 1)
      const answers = Object.fromEntries(selected.map(q => [q.id, {
        itemId: q.id, value: q.answer, firstValue: q.answer, isFirstCorrect: true,
        resolved: true, attemptCount: 1, firstAnsweredAt: 1720000000000, lastAnsweredAt: 1720000000000,
      }]))
      raw.state.textbookProgress[u.unitId] = {
        unitId: u.unitId, unitRevision: u.revision, startedAt: 1720000000000,
        updatedAt: 1720000000000, answers,
        ...(completeIds.includes(u.unitId) ? { completedAt: 1720000000001 } : {}),
      }
    }
    localStorage.setItem('kyotsu-step-store', JSON.stringify(raw))
  }, { all: units, completeIds: complete.map(x => unit(x).unitId), partialIds: partial.map(x => unit(x).unitId) })
  await page.reload()
}
for (const width of [320, 390, 1440]) {
  test('W027 three cards and two actual bridge paragraphs ' + width, async ({ page }, info) => {
    test.skip(width === 1440 ? info.project.name !== 'desktop-chromium' : info.project.name !== 'mobile-chromium')
    await page.setViewportSize({ width, height: 1000 })
    mkdirSync(root, { recursive: true })
    await setup(page)
    await page.evaluate(() => localStorage.clear()); await page.reload()
    const chapter = page.getByTestId('math-textbook-chapter-1')
    const links = chapter.locator('a[data-testid^="math-textbook-topic-"]')
    await expect(links).toHaveCount(3)
    const labels = ['式を整える', '実数を扱う', '不等式を使う']
    for (let i = 0; i < 3; i++) {
      await expect(links.nth(i)).toHaveAttribute('data-testid', 'math-textbook-topic-' + ids[i])
      await expect(links.nth(i)).toContainText(labels[i])
      await expect(links.nth(i)).toContainText('0/' + [125, 77, 116][i] + ' 完了')
    }
    await expect(page.getByTestId('math-textbook-topic-numbers-development')).toHaveCount(0)
    await fits(page)
    await links.first().evaluate(el => {
      const top = window.scrollY + el.getBoundingClientRect().top - 150
      window.scrollTo({ top, behavior: 'instant' })
    })
    const blockers = await links.evaluateAll(nodes => nodes.flatMap(node => {
      const r = node.getBoundingClientRect()
      return Array.from(document.querySelectorAll('nav')).filter(nav => {
        const b = nav.getBoundingClientRect()
        return getComputedStyle(nav).position === 'fixed' && Math.min(r.right, b.right) > Math.max(r.left, b.left) + 1 && Math.min(r.bottom, b.bottom) > Math.max(r.top, b.top) + 1
      }).map(() => node.getAttribute('data-testid'))
    }))
    expect(blockers, 'fixed navigation must not cover any of the three captured cards').toEqual([])
    for (const card of await links.all()) await expect(card).toBeInViewport({ ratio: 1 })
    await page.screenshot({ path: `${root}/catalog-${width}.png` })
    for (const [code, title, bridge] of [['ne01', labels[0], bridge1], ['ne02', labels[1], bridge2]]) {
      await page.goto(route('/learning/textbook/' + unit(code).unitId))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
      const paragraph = page.getByTestId('textbook-reading-flow').locator('p').filter({ hasText: bridge }).first()
      await expect(paragraph).toBeVisible()
      await expect(page.getByTestId('textbook-item-' + code + '-01')).toBeVisible()
      await fits(page)
      await page.screenshot({ path: `${root}/${code}-bridge-${width}.png`, fullPage: true })
    }
    writeFileSync(`${root}/screens-${width}.json`, JSON.stringify({ source: process.env.CAPTURE_SHA, width, titleCount: 3, screenshots: ['catalog', 'ne01-bridge', 'ne02-bridge'] }, null, 2))
  })
}
test('W027 saved answers survive regrouping, resume each development unit and preserve history', async ({ page }) => {
  await setup(page); await page.evaluate(() => localStorage.clear()); await page.reload()
  const completed = ['n01', 'n02', 'n03', 'n04', 'n05', 'n06', 'n07', 'n08', 'n09', 'n10']
  await seed(page, completed, ['ne01', 'ne02'])
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store')!).state.textbookProgress)
  await expect(page.getByTestId('math-textbook-topic-numbers-polynomials')).toContainText('113/125 完了')
  await expect(page.getByTestId('math-textbook-topic-numbers-real')).toContainText('66/77 完了')
  for (const [topic, code] of [[ids[0], 'ne01'], [ids[1], 'ne02']]) {
    await expect(page.getByTestId('math-textbook-topic-' + topic)).toHaveAttribute('href', '#/learning/textbook/' + unit(code).unitId)
    await page.getByTestId('math-textbook-topic-' + topic).click()
    await expect(page.getByTestId('resolved-' + code + '-01')).toBeVisible()
    await setup(page)
  }
  for (const [from, to] of [['n06', 'ne01'], ['n10', 'ne02']]) {
    await page.goto(route('/learning/textbook/' + unit(from).unitId))
    await expect(page.getByTestId('textbook-next-unit')).toHaveAttribute('href', '#/learning/textbook/' + unit(to).unitId)
  }
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store')!).state.textbookProgress)
  expect(after).toEqual(before)
  await setup(page); await seed(page, ['ne01', 'ne02'], [])
  const fullySaved = await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store')!).state.textbookProgress)
  await expect(page.getByTestId('math-textbook-topic-numbers-polynomials')).toContainText('125/125 完了')
  await expect(page.getByTestId('math-textbook-topic-numbers-real')).toContainText('77/77 完了')
  for (const code of ['ne01', 'ne02']) {
    await page.goto(route('/learning/textbook/' + unit(code).unitId))
    await expect(page.getByTestId('textbook-next-unit')).toHaveCount(0)
    await expect(page.getByTestId('textbook-return-to-setup')).toHaveAttribute('href', '#/learning/setup?subject=math-1a')
  }
  await page.reload()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store')!).state.textbookProgress)).toEqual(fullySaved)
})

const oldN02 = ['3bx', 'x^3-ax^2+3bx+5c', '(2y-3,\\ y^2-3y+2)', 'x^2+(2y-3)x+(y^2-3y+2)', '0x',
  'x^3-x^2+x+1', 'x^3-2x^2-2', '3x^3-5x^2+x-3',
  '(4x^3-6x^2+2x-2,\\ 3x^3-6x^2-6)', '7x^3-12x^2+2x-8', '2A-3B', '7x^3-12x^2+2x-8']
for (const width of [320, 390, 1440]) {
  test('N02 R1 approved local derivation, old history, wrong/hint/reload and real screens ' + width, async ({ page }, info) => {
    test.skip(width === 1440 ? info.project.name !== 'desktop-chromium' : info.project.name !== 'mobile-chromium')
    await page.setViewportSize({ width, height: 1000 })
    await setup(page)
    await page.evaluate(() => localStorage.clear()); await page.reload()
    const legacy = {
      unitId: unit('n02').unitId, unitRevision: 1, startedAt: 100, updatedAt: 200, completedAt: 199,
      answers: Object.fromEntries(oldN02.map((value, i) => {
        const itemId = 'n02-' + String(i + 1).padStart(2, '0')
        return [itemId, { itemId, value, firstValue: value, isFirstCorrect: true, resolved: true,
          attemptCount: 1, firstAnsweredAt: 110, lastAnsweredAt: 190 }]
      })),
    }
    await page.evaluate(old => {
      const raw = JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}')
      raw.state ??= {}; raw.state.textbookProgress ??= {}
      raw.state.textbookProgress[old.unitId] = old
      localStorage.setItem('kyotsu-step-store', JSON.stringify(raw))
    }, legacy)
    await page.goto(route('/learning/textbook/' + unit('n02').unitId))
    await page.reload()
    await expect(page.getByTestId('resolved-n02-05')).toBeVisible()
    await expect(page.getByTestId('textbook-item-n02-06')).toBeVisible()
    await expect(page.getByTestId('textbook-item-n02-r2-q07-x3')).toHaveCount(0)
    const snapshots: string[] = []
    const captures: Record<string, string> = {
      'n02-r2-q09-a2': 'two-a', 'n02-09': 'minus-three-b',
      'n02-10': 'collect', 'n02-r2-q11-sign': 'bracket-sign',
    }
    for (const q of unit('n02').sections[0].items.slice(5)) {
      if (q.id === 'n02-12') continue // unchanged v1 Q12 stays resolved but cannot bypass new prerequisites
      const trigger = page.getByTestId('textbook-item-' + q.id)
      await expect(trigger).toBeVisible()
      const chain = trigger.locator('xpath=ancestor::div[contains(@class,"reading-derivation-chain")]')
      await expect(chain).toHaveCount(1)
      if (captures[q.id]) {
        await trigger.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 600, behavior: 'instant' }))
        await expect(trigger).toBeInViewport({ ratio: 1 })
        const overlap = await trigger.evaluate(el => {
          const a = el.getBoundingClientRect()
          return Array.from(document.querySelectorAll('nav,header')).some(n => {
            const b = n.getBoundingClientRect()
            return ['fixed', 'sticky'].includes(getComputedStyle(n).position)
              && Math.min(a.right, b.right) > Math.max(a.left, b.left)
              && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)
          })
        })
        expect(overlap).toBe(false)
        await fits(page)
        const dir = 'e2e-evidence/wmath027-n02'
        mkdirSync(dir, { recursive: true })
        const name = captures[q.id] + '-' + width + '.png'
        await page.screenshot({ path: dir + '/' + name })
        snapshots.push(name)
      }
      await trigger.click()
      let panel = page.getByTestId('inline-choice-panel-' + q.id)
      const options = await panel.getByRole('button').all()
      let wrongButton = options[0]
      for (const option of options) {
        if (await option.getAttribute('aria-label') !== q.answer) { wrongButton = option; break }
      }
      await wrongButton.click()
      await expect(trigger).toBeVisible()
      await trigger.click()
      panel = page.getByTestId('inline-choice-panel-' + q.id)
      await expect(page.getByTestId('textbook-hint-' + q.id)).toBeVisible()
      await page.reload()
      await expect(page.getByTestId('textbook-item-' + q.id)).toBeVisible()
      await page.getByTestId('textbook-item-' + q.id).click()
      await page.getByTestId('inline-choice-panel-' + q.id).getByRole('button', { name: q.answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + q.id)).toBeVisible()
    }
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    await fits(page)
    await page.reload()
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    const current = await page.evaluate(id => JSON.parse(localStorage.getItem('kyotsu-step-store')!).state.textbookProgress[id], unit('n02').unitId)
    expect(current.unitRevision).toBe(2)
    expect(current.archivedRevisions['1']).toEqual({ unitRevision: 1, startedAt: 100, updatedAt: 200, completedAt: 199, answers: legacy.answers })
    expect(current.answers['n02-05']).toEqual(legacy.answers['n02-05'])
    expect(current.answers['n02-09'].value).toBe('3')
    expect(current.answers['n02-09'].attemptCount).toBe(2)
    expect(current.answers['n02-12']).toEqual(legacy.answers['n02-12'])
    writeFileSync('e2e-evidence/wmath027-n02/screens-' + width + '.json', JSON.stringify({ source: process.env.CAPTURE_SHA, width, snapshots, legacyPreserved: true }, null, 2))
  })
}
