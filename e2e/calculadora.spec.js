import { test, expect } from '@playwright/test';

test('la página carga correctamente', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Calculadora ICS');
  await expect(page.getByRole('heading', { name: 'Calculadora ICS' })).toBeVisible();
});

test('muestra error con campos vacíos', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Calcular promedio' }).click();

  await expect(page.locator('#errorMsg')).toBeVisible();
  await expect(page.locator('#errorMsg')).toHaveText('Las notas deben ser números');
});

test('el botón limpiar resetea el formulario', async ({ page }) => {
  await page.goto('/');

  await page.locator('#p1').fill('7');
  await page.locator('#p2').fill('8');
  await page.locator('#p3').fill('9');
  await page.getByRole('button', { name: 'Calcular promedio' }).click();
  await page.getByRole('button', { name: 'Limpiar' }).click();

  await expect(page.locator('#p1')).toHaveValue('7');
  await expect(page.locator('#p2')).toHaveValue('8');
  await expect(page.locator('#p3')).toHaveValue('9');
  await expect(page.locator('#result')).not.toBeVisible();
});