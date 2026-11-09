import { expect, test, type Page } from '@playwright/test'
import editionData from './fixtures/historical-math-data.json' with { type: 'json' }

const appRoute = (path: string) => /^\[archive171c\] /.test(test.info().title)
  ? editionHistoricalRoute(path) : '/kyotsu-step-web/#' + path

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('[archive171c] chapter 1 has three core and one optional reachable review topics; chapter 3 and physics remain intact', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  const chapter1 = page.getByTestId('math-textbook-chapter-1')
  await expect(chapter1).toContainText('数と式')
  const labels = [
    ['numbers-polynomials', '式を整える', 'math-numbers-expressions-n01'],
    ['numbers-real', '実数を扱う', 'math-numbers-expressions-n07'],
    ['numbers-inequalities', '不等式を使う', 'math-numbers-expressions-n11'],
    ['numbers-development', '参考・発展', 'math-numbers-expressions-ne01'],
  ] as const
  const links = chapter1.locator('a[data-testid^="math-textbook-topic-"]')
  await expect(links).toHaveCount(4)
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

test('[archive171c] theme navigation and stable N02/N09 deep links show the real source lessons', async ({ page }) => {
  await page.getByTestId('math-textbook-topic-numbers-real').click()
  await expect(page).toHaveURL(/\/learning\/textbook\/math-numbers-expressions-n07$/)
  await expect(page.getByRole('heading', { name: '実数を扱う', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('分数と小数で、同じ数を表す')
  await expect(page.getByTestId('textbook-item-n07-01')).toBeVisible()

  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n09'))
  await expect(page.getByTestId('textbook-item-n09-01')).toBeVisible()

  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n02'))
  await expect(page.getByRole('heading', { name: '式を整える', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('多項式の整理と加減')
  await expect(page.getByTestId('textbook-item-n02-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n02-02')).toHaveCount(0)
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('[archive171c] chapter 1 keeps learner progress and shows unfinished topic on return', async ({ page }) => {
  await page.getByTestId('math-textbook-topic-numbers-real').click()
  await page.getByTestId('textbook-item-n07-01').click()
  await page.getByTestId('inline-choice-panel-n07-01').getByRole('button', { name: '0.75（小数第2位で終了）', exact: true }).click()
  await expect(page.getByTestId('resolved-n07-01')).toBeVisible()
  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  await page.reload()
  const topic = page.getByTestId('math-textbook-topic-numbers-real')
  await expect(topic).toContainText('1/65 完了')
  await expect(topic).toHaveAttribute('href', '#/learning/textbook/math-numbers-expressions-n07')
})


// Explicit archival compatibility entry; original test assertions remain unchanged.
function editionHistoricalRoute(path: string) {
  if (!test.info().annotations.some(item => item.type === 'historical-edition')) {
    test.info().annotations.push({ type: 'historical-edition', description: '171c archival Page + pinned shared runtime; not current Page coverage' })
  }
  return '/kyotsu-step-web/e2e/fixtures/historical-math.html#' + path
}


// Separate actual-current-entry smoke for every affected family. These checks never
// enter the historical fixture and do not reuse historical answer/renderer aliases.
type EditionCurrentContract = {
  code: string; unitId: string; revision: number; title: string; kind: string
  firstId?: string; nextId?: string; control?: string; reopenAfterWrong?: boolean; resetMode?: string
  nodeId?: string; partId?: string; partKey?: string; nextPartKey?: string; compiledHash?: string
  answer: string; wrong: string
}
const editionCurrentContracts = editionData.currentContracts as EditionCurrentContract[]

async function editionMainProgress(page: Page, unitId: string) {
  return page.evaluate(id => JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}').state?.textbookProgress?.[id], unitId)
}

for (const contract of editionCurrentContracts.filter(item => item.code !== 'n12')) {
  test('Current ordinary route ' + contract.code + ': accepted edition, wrong gate, answer, reload and reset', async ({ page }) => {
    test.setTimeout(90_000)
    test.info().annotations.push({ type: 'actual-current-entry', description: 'cd64 accepted production route; first interaction smoke, not full-unit replay' })
    await page.goto('/kyotsu-step-web/#/learning/textbook/' + contract.unitId)
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByTestId('textbook-current-topic')).toContainText(contract.title)
    expect(page.url()).not.toContain('/fixtures/')
    if (contract.kind === 'nested') {
      const reader = page.getByTestId('n0910-revision-page')
      await expect(reader).toHaveAttribute('data-revision', String(contract.revision))
      await expect(reader).toHaveAttribute('data-compiled-hash', contract.compiledHash!)
      const first = page.locator('[data-node-id="' + contract.nodeId + '"] [data-part-key="' + contract.partKey + '"]')
      const nextEditable = page.locator('[data-node-id="' + contract.nodeId + '"] [data-part-key="' + contract.nextPartKey + '"][data-editable="true"]')
      await expect(first).toHaveAttribute('data-slot-state', 'initial')
      await first.click()
      const panel = page.locator('[data-active-part-id="' + contract.partId + '"]')
      await panel.getByRole('button', { name: contract.wrong, exact: true }).click()
      await expect(first).toHaveAttribute('data-slot-state', 'wrong')
      await expect(nextEditable).toHaveCount(0)
      await expect(panel.getByRole('status')).toBeVisible()
      await panel.getByRole('button', { name: contract.answer, exact: true }).click()
      // Certified parts are substituted into the completed math, so their controls disappear.
      await expect(first).toHaveCount(0)
      await expect(nextEditable).toBeVisible()
      const saved = await editionMainProgress(page, contract.unitId)
      expect(saved.unitRevision).toBe(contract.revision)
      expect(saved.nestedProgress.records[contract.partId!].value).toBe(contract.answer)
      expect(saved.nestedProgress.records[contract.partId!].firstValue).toBe(contract.wrong)
      expect(saved.nestedProgress.records[contract.partId!].selectionCount).toBe(2)
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible({ timeout: 30_000 })
      await expect(first).toHaveCount(0)
      await expect(nextEditable).toBeVisible()
      expect((await editionMainProgress(page, contract.unitId)).nestedProgress.records[contract.partId!]).toEqual(saved.nestedProgress.records[contract.partId!])
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'この単元を最初から', exact: true }).first().click()
      await expect(first).toHaveAttribute('data-slot-state', 'initial')
      expect((await editionMainProgress(page, contract.unitId)).nestedProgress.records[contract.partId!]).toBeUndefined()
    } else {
      const target = page.getByTestId('textbook-item-' + contract.firstId)
      const first = contract.control === 'child-button' ? target.getByRole('button') : target
      const panel = page.getByTestId('inline-choice-panel-' + contract.firstId)
      await expect(first).toBeVisible()
      await first.click()
      await panel.getByRole('button', { name: contract.wrong, exact: true }).click()
      if (contract.reopenAfterWrong) await first.click()
      await expect(page.getByTestId('textbook-hint-' + contract.firstId)).toBeVisible()
      expect((await editionMainProgress(page, contract.unitId)).answers[contract.firstId!].resolved).toBe(false)
      await expect(page.getByTestId('textbook-item-' + contract.nextId)).toHaveCount(0)
      await panel.getByRole('button', { name: contract.answer, exact: true }).click()
      const saved = await editionMainProgress(page, contract.unitId)
      expect(saved.unitRevision).toBe(contract.revision)
      expect(saved.answers[contract.firstId!].value).toBe(contract.answer)
      expect(saved.answers[contract.firstId!].firstValue).toBe(contract.wrong)
      expect(saved.answers[contract.firstId!].resolved).toBe(true)
      expect(saved.answers[contract.firstId!].attemptCount).toBe(2)
      await expect(target).toHaveCount(0)
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible({ timeout: 30_000 })
      expect((await editionMainProgress(page, contract.unitId)).answers[contract.firstId!]).toEqual(saved.answers[contract.firstId!])
      await expect(target).toHaveCount(0)
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'この単元を最初から', exact: true }).first().click()
      await expect(first).toBeVisible()
      const reset = await editionMainProgress(page, contract.unitId)
      if (contract.resetMode === 'empty-and-archive') {
        expect(reset.answers).toEqual({})
        expect(Object.values(reset.archivedRevisions).some(archive => { const record = archive as { answers: Record<string, { value: string }> }; return record.answers[contract.firstId!]?.value === contract.answer })).toBe(true)
      } else expect(reset).toBeUndefined()
    }
    await expect(page.locator('.katex-error')).toHaveCount(0)
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible({ timeout: 30_000 })
    const reset = await editionMainProgress(page, contract.unitId)
    if (contract.kind === 'nested') expect(reset.nestedProgress.records[contract.partId!]).toBeUndefined()
    else if (contract.resetMode === 'empty-and-archive') expect(reset.answers).toEqual({})
    else expect(reset).toBeUndefined()
  })
}

// Current catalogue is an independent ordinary-route contract: 36+30+32+40+30=168.
// The unchanged historical 1/65 assertion above remains an archival data contract.
test('Current ordinary catalog: three core topics, total168, progress, physics and return link', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/kyotsu-step-web/#/learning/setup?subject=math-1a')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  const chapter1 = page.getByTestId('math-textbook-chapter-1')
  await expect(chapter1.locator('a[data-testid^="math-textbook-topic-"]')).toHaveCount(3, { timeout: 30_000 })
  for (const [topicId, firstUnit] of [['numbers-polynomials', 'n01'], ['numbers-real', 'n07'], ['numbers-inequalities', 'n11']]) {
    await expect(page.getByTestId('math-textbook-topic-' + topicId)).toHaveAttribute('href', '#/learning/textbook/math-numbers-expressions-' + firstUnit)
  }
  await expect(page.getByTestId('math-textbook-topic-numbers-development')).toHaveCount(0)
  await expect(page.getByTestId('math-textbook-topic-organize-sets')).toHaveAttribute('href', '#/learning/textbook/math-sets')
  await expect(page.getByTestId('math-textbook-topic-read-propositions')).toContainText('準備中')
  await page.getByRole('button', { name: '物理', exact: true }).click()
  await expect(page.getByTestId('textbook-part-1')).toBeVisible()
  // Setup retains its selected subject while mounted; use the real subject control.
  await page.getByRole('group', { name: '科目', exact: true }).getByRole('button', { name: '数学 I・A', exact: true }).click()
  const topic = page.getByTestId('math-textbook-topic-numbers-real')
  await expect(topic).toContainText('0/168 完了', { timeout: 30_000 })
  await expect(topic).toHaveAttribute('href', '#/learning/textbook/math-numbers-expressions-n07')
  await topic.click()
  await expect(page.getByTestId('textbook-item-n07-q01-tenths-answer')).toBeVisible()
  await page.getByTestId('textbook-item-n07-q01-tenths-answer').click()
  await page.getByTestId('inline-choice-panel-n07-q01-tenths-answer').getByRole('button', { name: '7', exact: true }).click()
  await page.goto('/kyotsu-step-web/#/learning/setup?subject=math-1a')
  await expect(topic).toContainText('1/168 完了', { timeout: 30_000 })
  expect(page.url()).not.toContain('/fixtures/')
  await page.reload()
  await expect(topic).toContainText('1/168 完了', { timeout: 30_000 })
  await expect(topic).toHaveAttribute('href', '#/learning/textbook/math-numbers-expressions-n07')
})
