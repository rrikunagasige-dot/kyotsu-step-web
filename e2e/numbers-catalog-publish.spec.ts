import { expect, test } from '@playwright/test'

const appRoute = (path: string) => '/kyotsu-step-web/#' + path

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('chapter 1 has exactly three reachable review topics; chapter 3 and physics remain intact', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  const chapter1 = page.getByTestId('math-textbook-chapter-1')
  await expect(chapter1).toContainText('数と式')
  const labels = [
    ['numbers-polynomials', '式を整える', 'math-numbers-expressions-n01'],
    ['numbers-real', '実数を扱う', 'math-numbers-expressions-n07'],
    ['numbers-inequalities', '不等式を使う', 'math-numbers-expressions-n11'],
  ] as const
  const links = chapter1.locator('a[data-testid^="math-textbook-topic-"]')
  await expect(links).toHaveCount(3)
  for (const [topic, title, firstUnit] of labels) {
    const link = page.getByTestId('math-textbook-topic-' + topic)
    await expect(link).toContainText(title)
    await expect(link).toContainText('レビュー公開中')
    await expect(link).not.toContainText('準備中')
    await expect(link).toHaveAttribute('href', '#/learning/textbook/' + firstUnit)
  }
  await expect(page.getByTestId('math-textbook-chapter-3')).toContainText('集合と命題')
  await expect(page.getByTestId('math-textbook-topic-organize-sets')).toHaveAttribute('href', '#/learning/textbook/math-sets')
  await expect(page.getByTestId('math-textbook-topic-read-propositions')).toContainText('準備中')
  const width = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
  expect(width[0]).toBeLessThanOrEqual(width[1] + 1)
  await page.getByRole('button', { name: '物理', exact: true }).click()
  await expect(page.getByTestId('textbook-part-1')).toBeVisible()
})

test('theme navigation and stable N02/N09 deep links show the real source lessons', async ({ page }) => {
  await page.getByTestId('math-textbook-topic-numbers-real').click()
  await expect(page).toHaveURL(/\/learning\/textbook\/math-numbers-expressions-n07$/)
  await expect(page.getByRole('heading', { name: '実数を扱う', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('分数と小数で、同じ数を表す')
  await expect(page.getByTestId('textbook-item-n07-01')).toBeVisible()

  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n02'))
  await expect(page.getByRole('heading', { name: '式を整える', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('多項式の整理と加減')
  await expect(page.getByTestId('textbook-item-n02-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n02-02')).toHaveCount(0)
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('chapter 1 keeps learner progress and shows unfinished topic on return', async ({ page }) => {
  await page.getByTestId('math-textbook-topic-numbers-real').click()
  await page.getByTestId('textbook-item-n09-01').click()
  await page.getByTestId('inline-choice-panel-n07-01').getByRole('button', { name: '0.75（小数第2位で終了）', exact: true }).click()
  await expect(page.getByTestId('resolved-n09-01')).toBeVisible()
  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  await page.reload()
  const topic = page.getByTestId('math-textbook-topic-numbers-real')
  await expect(topic).toContainText('1/65 完了')
  await expect(topic).toHaveAttribute('href', '#/learning/textbook/math-numbers-expressions-n07')
})
