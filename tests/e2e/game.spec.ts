import { test, expect } from '@playwright/test'

test.describe('Poker Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('shows initial state with POKER logo and start button', async ({ page }) => {
    await expect(page.locator('.logo__main')).toContainText('POKER')
    await expect(page.locator('[data-testid="player-chips"]')).toContainText('💰')
    await expect(page.locator('[data-testid="round-number"]')).toContainText('R0')
    await expect(page.locator('[data-testid="start-round-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="start-round-btn"]')).toContainText('ゲーム開始')
  })

  test('starts a round when clicking ゲーム開始', async ({ page }) => {
    await page.locator('[data-testid="start-round-btn"]').click()

    // Round number should increment
    await expect(page.locator('[data-testid="round-number"]')).toContainText('R1')

    // Start button should disappear; betting controls appear for player's turn
    await expect(page.locator('[data-testid="start-round-btn"]')).not.toBeVisible()
  })

  test('shows betting controls on player turn', async ({ page }) => {
    await page.locator('[data-testid="start-round-btn"]').click()

    // Wait for player's turn (fold button is always shown when betting controls appear)
    await expect(page.locator('[data-testid="fold-btn"]')).toBeVisible({ timeout: 15000 })

    // Fold button must be visible and enabled
    const foldBtn = page.locator('[data-testid="fold-btn"]')
    await expect(foldBtn).toBeEnabled()
  })

  test('player can fold and result overlay appears', async ({ page }) => {
    await page.locator('[data-testid="start-round-btn"]').click()

    // Wait for fold button to be available and clickable
    const foldBtn = page.locator('[data-testid="fold-btn"]')
    await expect(foldBtn).toBeVisible({ timeout: 15000 })
    await expect(foldBtn).toBeEnabled()

    await foldBtn.click()

    // Result overlay should appear showing AI wins on fold
    await expect(page.locator('[data-testid="result-banner"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="next-round-btn"]')).toBeVisible()
  })

  test('proceeds to next round after viewing result', async ({ page }) => {
    await page.locator('[data-testid="start-round-btn"]').click()

    const foldBtn = page.locator('[data-testid="fold-btn"]')
    await expect(foldBtn).toBeVisible({ timeout: 15000 })
    await expect(foldBtn).toBeEnabled()
    await foldBtn.click()

    const nextRoundBtn = page.locator('[data-testid="next-round-btn"]')
    await expect(nextRoundBtn).toBeVisible({ timeout: 10000 })
    await nextRoundBtn.click()

    // After proceeding, we should be back to start state or in next round
    await expect(page.locator('[data-testid="result-banner"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="round-number"]')).toContainText('R1')
  })

  test('player chips update after a round', async ({ page }) => {
    const chipsBefore = await page.locator('[data-testid="player-chips"]').textContent()

    await page.locator('[data-testid="start-round-btn"]').click()

    const foldBtn = page.locator('[data-testid="fold-btn"]')
    await expect(foldBtn).toBeVisible({ timeout: 15000 })
    await expect(foldBtn).toBeEnabled()
    await foldBtn.click()

    const nextRoundBtn = page.locator('[data-testid="next-round-btn"]')
    await expect(nextRoundBtn).toBeVisible({ timeout: 10000 })
    await nextRoundBtn.click()

    // Chips must have changed (folding causes blind/pot loss)
    const chipsAfter = await page.locator('[data-testid="player-chips"]').textContent()
    expect(chipsAfter).not.toBe(chipsBefore)
  })

  test('betting pot shows current pot during active round', async ({ page }) => {
    await page.locator('[data-testid="start-round-btn"]').click()

    await expect(page.locator('[data-testid="fold-btn"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('[data-testid="betting-pot"]')).toBeVisible()
    await expect(page.locator('[data-testid="betting-pot"]')).toContainText('ポット:')
  })
})
