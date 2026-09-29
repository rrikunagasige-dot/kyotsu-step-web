import { expect, test, type Page } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`

async function dumpBootState(page: Page, label: string) {
  await page.waitForTimeout(1500)
  const body = await page.locator('body').innerText().catch(() => '<body unavailable>')
  const root = await page.locator('#root').innerHTML().catch(() => '<root unavailable>')
  console.log(`[P39-DIAG:${label}] URL=${page.url()}`)
  console.log(`[P39-DIAG:${label}] BODY=${body.slice(0, 4000)}`)
  console.log(`[P39-DIAG:${label}] ROOT=${root.slice(0, 6000)}`)
}

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('v2.2 app boots and opens the textbook setup', async ({ page }) => {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`)
  })

  await page.goto(appRoute('/learning/setup'))
  await dumpBootState(page, 'setup')
  console.log('[P39-DIAG:setup] PAGE_ERRORS=', JSON.stringify(pageErrors))
  console.log('[P39-DIAG:setup] CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('[P39-DIAG:setup] FAILED_REQUESTS=', JSON.stringify(failedRequests))

  expect(pageErrors).toEqual([])
  expect(consoleErrors).toEqual([])
  expect(failedRequests).toEqual([])
  await expect(page.getByText('App の起動に失敗しました')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '学習設定' })).toBeVisible()
  await expect(page.getByTestId('textbook-part-list')).toBeVisible()
})

test('v2.2 1A renders the first inline hole and choices', async ({ page }) => {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`)
  })

  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))
  await dumpBootState(page, '1a')
  console.log('[P39-DIAG:1a] PAGE_ERRORS=', JSON.stringify(pageErrors))
  console.log('[P39-DIAG:1a] CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('[P39-DIAG:1a] FAILED_REQUESTS=', JSON.stringify(failedRequests))

  expect(pageErrors).toEqual([])
  expect(consoleErrors).toEqual([])
  expect(failedRequests).toEqual([])
  await expect(page.getByText('App の起動に失敗しました')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '変位と速度', exact: true })).toBeVisible()

  const a1 = page.getByTestId('textbook-item-a1')
  await expect(a1).toBeVisible()
  await a1.click()

  const choices = page.getByTestId('inline-choice-panel-a1')
  await expect(choices).toBeVisible()
  await expect(choices.getByRole('button', { name: '位置', exact: true })).toBeVisible()
})
