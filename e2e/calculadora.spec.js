import { test, expect } from '@playwright/test';

test('la página carga correctamente', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Calculadora ICS');
  await expect(page.getByRole('heading', { name: 'Calculadora ICS' })).toBeVisible();
});

test('calcula promedio y muestra aprobado', async ({ page }) => {
  await page.goto('/');

  await page.locator('#p1').fill('8');
  await page.locator('#p2').fill('7');
  await page.locator('#p3').fill('9');
  await page.getByRole('button', { name: 'Calcular promedio' }).click();

  await expect(page.locator('#promedioValor')).toHaveText('8');
  await expect(page.locator('#statusText')).toHaveText('Aprobado');
});

test('calcula promedio y muestra desaprobado', async ({ page }) => {
  await page.goto('/');

  await page.locator('#p1').fill('4');
  await page.locator('#p2').fill('5');
  await page.locator('#p3').fill('3');
  await page.getByRole('button', { name: 'Calcular promedio' }).click();

  await expect(page.locator('#promedioValor')).toHaveText('4');
  await expect(page.locator('#statusText')).toHaveText('Desaprobado');
});

test('muestra error con campos vacíos', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Calcular promedio' }).click();

  await expect(page.locator('#errorMsg')).toBeVisible();
  await expect(page.locator('#errorMsg')).toHaveText('Las notas deben ser números');
});

test('muestra error con nota fuera de rango', async ({ page }) => {
  await page.goto('/');

  await page.locator('#p1').fill('11');
  await page.locator('#p2').fill('7');
  await page.locator('#p3').fill('8');
  await page.getByRole('button', { name: 'Calcular promedio' }).click();

  await expect(page.locator('#errorMsg')).toBeVisible();
  await expect(page.locator('#errorMsg')).toHaveText('Las notas deben estar entre 0 y 10');
});

test('el botón limpiar resetea el formulario', async ({ page }) => {
  await page.goto('/');

  await page.locator('#p1').fill('7');
  await page.locator('#p2').fill('8');
  await page.locator('#p3').fill('9');
  await page.getByRole('button', { name: 'Calcular promedio' }).click();
  await page.getByRole('button', { name: 'Limpiar' }).click();

  await expect(page.locator('#p1')).toHaveValue('');
  await expect(page.locator('#p2')).toHaveValue('');
  await expect(page.locator('#p3')).toHaveValue('');
  await expect(page.locator('#result')).not.toBeVisible();
});

test('calcula con Enter además del botón', async ({ page }) => {
  await page.goto('/');

  await page.locator('#p1').fill('6');
  await page.locator('#p2').fill('7');
  await page.locator('#p3').fill('8');
  await page.locator('#p3').press('Enter');

  await expect(page.locator('#promedioValor')).toHaveText('7');
});