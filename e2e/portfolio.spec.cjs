const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('switches the full page language and remembers the choice', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/庞博仁/);

  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Portfolio/);
  await expect(page.getByRole('button', { name: 'Switch to English' })).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.goto('/?lang=zh');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveTitle(/庞博仁/);
});

test('all in-page links lead to an existing section', async ({ page }) => {
  await page.goto('/');
  const linksResolve = await page.locator('a[href^="#"]').evaluateAll(links =>
    links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))),
  );
  expect(linksResolve).toBe(true);

  await page.getByRole('link', { name: /项目作品/ }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('#projects')).toBeVisible();
});

test('external links opened in a new tab use safe rel attributes', async ({ page }) => {
  await page.goto('/');
  const unsafeLinks = await page.locator('a[target="_blank"]').evaluateAll(links =>
    links.filter(link => {
      const rel = new Set(link.rel.split(/\s+/).filter(Boolean));
      return !rel.has('noopener') || !rel.has('noreferrer');
    }).map(link => link.href),
  );
  expect(unsafeLinks).toEqual([]);
  await expect(page.locator('a[href="mailto:pbr130922@gmail.com"]')).toHaveCount(2);
});

test('fits common narrow mobile widths without horizontal scrolling', async ({ page }) => {
  for (const width of [375, 360]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/?lang=zh');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('keeps the page readable when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.locator('.word').first().evaluate(el => getComputedStyle(el).opacity)).toBe('1');
});

test('provides an accessible canvas fallback when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
      return getContext.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('#globe')).toHaveAttribute('role', 'img');
  await expect(page.locator('#globe')).toHaveAttribute('aria-label', '可拖动旋转的三维点阵地球，标记杨凌与悉尼');
});

test('loads the page without uncaught JavaScript errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('has no WCAG 2.1 A or AA violations in Chinese or English', async ({ page }) => {
  await page.goto('/');

  for (const language of ['zh', 'en']) {
    if (language === 'en') {
      await page.getByRole('button', { name: 'Switch to English' }).click();
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations, `${language}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([]);
  }
});
