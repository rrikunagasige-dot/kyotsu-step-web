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
      await expect(links.nth(i)).toContainText('0/' + [122, 77, 116][i] + ' 完了')
    }
    await expect(page.getByTestId('math-textbook-topic-numbers-development')).toHaveCount(0)
    await fits(page)
    await page.screenshot({ path: `${root}/catalog-${width}.png`, fullPage: true })
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
  await expect(page.getByTestId('math-textbook-topic-numbers-polynomials')).toContainText('110/122 完了')
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
  await expect(page.getByTestId('math-textbook-topic-numbers-polynomials')).toContainText('122/122 完了')
  await expect(page.getByTestId('math-textbook-topic-numbers-real')).toContainText('77/77 完了')
  for (const code of ['ne01', 'ne02']) {
    await page.goto(route('/learning/textbook/' + unit(code).unitId))
    await expect(page.getByTestId('textbook-next-unit')).toHaveCount(0)
    await expect(page.getByTestId('textbook-return-to-setup')).toHaveAttribute('href', '#/learning/setup?subject=math-1a')
  }
  await page.reload()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store')!).state.textbookProgress)).toEqual(fullySaved)
})
