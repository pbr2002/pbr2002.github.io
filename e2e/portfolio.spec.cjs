const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('switches the full page language and remembers the choice', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/庞博仁/);

  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Portfolio/);
  await expect(page.getByRole('button', { name: 'Switch to English' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#projects').getByRole('heading', { name: 'Bilingual, interactive personal portfolio website' })).toBeVisible();
  await expect(page.locator('#projects')).toContainText('eight Playwright end-to-end tests');

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
  await expect(page.locator('#projects .portfolio-project')).toContainText('中英双语交互式');
});

test('contact actions copy email safely and external links use safe rel attributes', async ({ page }) => {
  await page.goto('/');
  const unsafeLinks = await page.locator('a[target="_blank"]').evaluateAll(links =>
    links.filter(link => {
      const rel = new Set(link.rel.split(/\s+/).filter(Boolean));
      return !rel.has('noopener') || !rel.has('noreferrer');
    }).map(link => link.href),
  );
  expect(unsafeLinks).toEqual([]);
  await expect(page.locator('#projects a[href="https://github.com/pbr2002/pbr2002.github.io"]')).toHaveAttribute('target', '_blank');
  await expect(page.locator('a[href="mailto:pbr130922@gmail.com"]')).toHaveCount(2);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {configurable:true,value:{writeText:async text=>{window.copiedEmail=text}}}));
  await page.locator('#copy-email').click();
  await expect.poll(() => page.evaluate(() => window.copiedEmail)).toBe('pbr130922@gmail.com');
  await expect(page.locator('#toast')).toContainText('邮箱已复制');
  await page.getByRole('button', {name:'Switch to English'}).click();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {configurable:true,value:{writeText:async()=>{throw new Error('denied')}}}));
  await page.locator('#copy-email').click();
  await expect(page.locator('#toast')).toContainText('Select and copy: pbr130922@gmail.com');
});

test('fits common narrow mobile widths without horizontal scrolling', async ({ page }) => {
  for (const width of [375, 360]) {
    await page.setViewportSize({ width, height: 812 });
    for (const language of ['zh','en']) {
    await page.goto('/?lang='+language);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  }
});

test('respects live reduced-motion changes and renders the globe only as needed', async ({ page }) => {
  await page.addInitScript(() => {
    window.globeDraws=0;
    for(const type of [window.WebGLRenderingContext,window.WebGL2RenderingContext]) {
      if(!type)continue;
      const draw=type.prototype.drawElements;
      type.prototype.drawElements=function(...args){window.globeDraws++;return draw.apply(this,args)};
    }
  });
  await page.setViewportSize({width:1280,height:600});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  expect(await page.locator('script[src$="/globe.js"]').count()).toBe(0);
  await page.locator('#globe').scrollIntoViewIfNeeded();
  await expect(page.locator('#globe')).toHaveAttribute('data-mode','webgl');
  await expect.poll(()=>page.evaluate(()=>window.globeDraws)).toBeGreaterThan(0);
  await page.waitForTimeout(200);
  const stopped=await page.evaluate(()=>window.globeDraws);
  await page.waitForTimeout(200);
  expect(await page.evaluate(()=>window.globeDraws)).toBe(stopped);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect.poll(()=>page.evaluate(()=>window.globeDraws)).toBeGreaterThan(stopped);
  await page.locator('#home').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const offscreen=await page.evaluate(()=>window.globeDraws);
  await page.waitForTimeout(200);
  expect(await page.evaluate(()=>window.globeDraws)).toBe(offscreen);
  await page.locator('#globe').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.evaluate(()=>window.globeDraws)).toBeGreaterThan(offscreen);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('#globe')).toHaveAttribute('data-motion','reduced');
  await page.waitForTimeout(100);
  const stoppedAgain=await page.evaluate(()=>window.globeDraws);
  await page.waitForTimeout(200);
  expect(await page.evaluate(()=>window.globeDraws)).toBe(stoppedAgain);
  await page.locator('#globe').focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(()=>page.evaluate(()=>window.globeDraws)).toBeGreaterThan(stoppedAgain);
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
  await page.locator('#globe').scrollIntoViewIfNeeded();
  await expect(page.locator('svg#globe')).toHaveAttribute('data-mode','fallback');
  await expect(page.locator('#globe text')).toHaveText(['杨凌','悉尼']);
  await expect(page.locator('.globe-hint')).toContainText('静态视图');
  await page.getByRole('button',{name:'Switch to English'}).click();
  await expect(page.locator('#globe')).toHaveAttribute('aria-label','Static study locations: Yangling and Sydney');
  await expect(page.locator('.globe-hint')).toContainText('Static view');
  await expect(page.locator('#globe text')).toHaveText(['Yangling','Sydney']);
  await page.getByRole('button',{name:'切换到中文'}).click();
  await expect(page.locator('.globe-hint')).toContainText('静态视图');
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
