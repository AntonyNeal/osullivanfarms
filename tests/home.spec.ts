import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Check for the main heading
  await expect(page.getByRole('heading', { name: /Welcome to SW Website/i })).toBeVisible();

  // Check for buttons
  await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Learn More/i })).toBeVisible();
});

test('has correct page title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/SW Website/);
});
