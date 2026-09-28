import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

test('phase 00 app smoke test', async ({ page }) => {
  await page.goto(appRoute('/health'))
  await expect(page.getByTestId('app-ready')).toContainText('APP READY')
  await expect(page).toHaveTitle(/共通 STEP/)
})
