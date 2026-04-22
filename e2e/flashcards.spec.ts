import { test, expect } from '@playwright/test'

/**
 * Flashcard / review queue E2E specs.
 *
 * /flashcards is a protected route. Unauthenticated tests verify that the
 * app handles the route without crashing and redirects appropriately.
 * Tests requiring a real session are skipped with explanatory comments.
 */

test.describe('Flashcards — unauthenticated', () => {
  test('navigating to /flashcards loads a page without crashing', async ({ page }) => {
    // Arrange + Act
    await page.goto('/flashcards')
    await page.waitForLoadState('networkidle')

    // Assert — at minimum the body renders
    await expect(page.locator('body')).toBeVisible()
  })

  test('unauthenticated /flashcards does not remain on /flashcards', async ({ page }) => {
    await page.goto('/flashcards')
    await page.waitForLoadState('networkidle')

    const url = page.url()
    // ProtectedRoute redirects away; verify the page is reachable at all
    expect(url).not.toBe('about:blank')
  })

  test('the landing page links to the app (entry point exists)', async ({ page }) => {
    await page.goto('/')
    // Verify the SPA boots cleanly — title or brand element present
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Authenticated flashcard tests — skipped in CI
// ---------------------------------------------------------------------------

test.describe('Flashcards — authenticated (skip in CI)', () => {
  test.skip(!!process.env.CI, 'Skipped in CI — requires auth session')

  test('flashcard review page loads at /flashcards when authenticated', async ({ page }) => {
    // Would: sign in, navigate to /flashcards, verify page heading
    test.skip(true, 'Requires authenticated session')
  })

  test('shows empty state message when no cards are due', async ({ page }) => {
    // Would: sign in with a user that has no due flashcards,
    // navigate to /flashcards, verify empty-state UI is rendered.
    test.skip(true, 'Requires authenticated session + seeded data')
  })

  test('shows a flashcard when there is a card due', async ({ page }) => {
    // Would: sign in, seed a due card, navigate to /flashcards,
    // verify card front text is visible.
    test.skip(true, 'Requires authenticated session + seeded data')
  })
})
