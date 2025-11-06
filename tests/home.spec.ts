import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Check for the main heading (h1)
  await expect(page.locator('h1').filter({ hasText: 'Claire Hamilton' })).toBeVisible();

  // Check for subtitle in hero section
  await expect(
    page.locator('section').getByText(/Real curves\. Real connection\. Ultimate GFE\./i)
  ).toBeVisible();

  // Check for buttons
  await expect(page.getByText('Book Now')).toBeVisible();
  await expect(page.getByText('View Gallery')).toBeVisible();
});

test('has correct page title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Claire Hamilton - Canberra Companion/);
});
