async page => {
  page.setDefaultTimeout(10000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const origin = 'http://127.0.0.1:3000';
  const report = [];
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto(origin);
  await page.evaluate(() => localStorage.removeItem('observatory-paused'));
  await page.reload();
  await page.waitForFunction(() => document.querySelector('.observatory')?.dataset.paused === 'false');
  for (const [path, title] of [['/', "Hi, I'm Abdiel."], ['/about','About me'], ['/experience','Experience'], ['/projects', 'Projects'], ['/writing', 'Writing'], ['/cabinet', 'Cabinet']]) {
    const response = await page.goto(origin + path);
    assert(response.status() === 200, `HTTP ${path}`);
    assert((await page.locator('h1').innerText()).includes(title), `Heading ${path}`);
    assert(await page.locator('nav [aria-current="page"]').count() === 1, `Active nav ${path}`);
    assert(!(await page.content()).includes('Unpublished'), `Draft leak ${path}`);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${path} @${width}`);
      if(path==='/projects') assert(await page.evaluate(()=>{
        const a=document.querySelector('.collection').getBoundingClientRect();
        const b=document.querySelector('.scene-caption').getBoundingClientRect();
        return a.bottom<=b.top || b.bottom<=a.top || a.right<=b.left || b.right<=a.left;
      }),`Projects reading panel overlaps scene controls @${width}`);
    }
  }
  report.push('Six routes: 200, headings, active navigation, no draft text; no horizontal overflow at 1440/768/390/320.');
  for (const path of ['/writing/writing-draft', '/writing/does-not-exist', '/does-not-exist', '/src/content/profile.json', '/analysis/REPORT.md']) {
    const response = await page.goto(origin + path);
    assert(response.status() === 404, `Expected 404: ${path}`);
  }
  report.push('Draft, unknown article, unknown route, raw content and analysis requests: 404.');
  await page.goto(origin);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('nav').getByRole('link', { name: 'About', exact: true }).click();
  await page.waitForURL(origin + '/about');
  assert(await page.locator('.about-page').isVisible(), 'About route missing');
  assert((await page.locator('.about-page').innerText()).includes('Abdiel Deandra EL Dzaky'), 'Full owner identity missing');
  await page.locator('nav').getByRole('link', { name: 'Experience', exact: true }).click();
  await page.waitForURL(origin + '/experience');
  for (const organization of ['Digital Laboratory', 'EXERCISE FTUI', 'IME FTUI']) {
    assert((await page.locator('.experience-page').innerText()).includes(organization), 'Missing supplied experience: ' + organization);
  }
  report.push('Dedicated About/Experience routes expose the supplied identity and three real roles.');
  await page.locator('nav').getByRole('link', { name: 'Projects', exact: true }).click();
  await page.waitForURL(origin + '/projects');
  await page.locator('nav').getByRole('link', { name: 'Writing', exact: true }).click();
  await page.waitForURL(origin + '/writing');
  await page.locator('nav').getByRole('link', { name: 'Cabinet', exact: true }).click();
  await page.waitForURL(origin + '/cabinet');
  await page.locator('nav').getByRole('link', { name: 'Home', exact: true }).click();
  await page.waitForURL(origin + '/');
  await page.keyboard.press('Tab');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('main').evaluate(el => el === document.activeElement), 'Skip link focus');
  const button = page.getByRole('button', { name: 'Pause motion' });
  await button.focus();
  assert(await button.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Visible keyboard focus');
  await page.keyboard.press('Space');
  assert(await page.locator('.observatory').getAttribute('data-paused') === 'true', 'Keyboard pause');
  const text = await page.locator('.interest-line').innerText();
  const top = await page.locator('.intro-copy').evaluate(el => el.getBoundingClientRect().top + window.scrollY);
  await page.waitForTimeout(500);
  assert(await page.locator('.interest-line').innerText() === text, 'Paused typing changes');
  assert(await page.locator('.scene').getAttribute('data-motion') === 'paused', 'Scene not paused');
  await page.locator('nav').getByRole('link', { name: 'Projects', exact: true }).click();
  assert(await page.locator('.observatory').getAttribute('data-paused') === 'true', 'Pause lost across navigation');
  await page.reload();
  assert(await page.locator('.observatory').getAttribute('data-paused') === 'true', 'Pause lost across reload');
  await page.locator('nav').getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('button', { name: 'Motion paused' }).click();
  await page.waitForTimeout(3000);
  assert(Math.abs(await page.locator('.intro-copy').evaluate(el => el.getBoundingClientRect().top + window.scrollY) - top) < 1, 'Typing shifts layout');
  report.push('Click navigation, skip link, visible focus, keyboard pause, frozen typing/orbit, pause across route/reload and stable typing layout.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('.observatory')?.dataset.paused === 'true');
  assert((await page.locator('.interest-line').innerText()).includes('a computer engineering student'), 'Reduced motion text incomplete');
  await page.getByRole('button', { name: 'Motion paused' }).click();
  assert(await page.locator('.scene').getAttribute('data-motion') === 'paused', 'Explicit play under reduced motion');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(150);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('.observatory')?.dataset.paused === 'true');
  report.push('Live reduced-motion change pauses, complete static interest, explicit Play works, later reduction pauses again.');
  assert(await page.getByRole('button', { name: 'Inspect as ASCII' }).count() === 0, 'Removed ASCII control returned');
  const touchContext = await page.context().browser().newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const touch = await touchContext.newPage();
  await touch.goto(origin);
  await touch.locator('.scene[data-state=ready]').waitFor();
  assert(await touch.locator('.scene').evaluate(el => getComputedStyle(el).position) === 'fixed', 'Scene must remain behind content');
  assert(await touch.getByRole('button', { name: 'Inspect as ASCII' }).count() === 0, 'ASCII control returned on mobile');
  await touchContext.close();
  report.push('Touch emulation: full-screen scene behind content and removed ASCII control.');
  const context = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fallback = await context.newPage();
  for (const path of ['/', '/about', '/experience', '/projects', '/writing', '/cabinet']) {
    const response = await fallback.goto(origin + path);
    assert(response.status() === 200, `No-JS HTTP ${path}`);
    assert(await fallback.locator('h1').isVisible(), `No-JS title ${path}`);
    assert(await fallback.locator('canvas').count() === 0, 'Fallback requires canvas');
    assert(await fallback.locator('.scene-poster img').evaluate(el => el.complete && el.naturalWidth > 0), `No-JS poster ${path}`);
  }
  await fallback.getByRole('link', { name: 'Home', exact: true }).click();
  assert((await fallback.locator('h1').innerText()).includes('Abdiel'), 'No-JS navigation');
  assert(await fallback.getByRole('button', { name: 'Motion paused' }).isDisabled(), 'No-JS motion control should be disabled');
  assert(await fallback.getByRole('button', { name: 'Inspect as ASCII' }).count() === 0, 'No-JS inspection control should be disabled');
  await context.close();
  report.push('JavaScript disabled: all routes and full headline readable, native navigation, actual scene poster, inactive controls disabled.');
  assert(failures.length === 0, `Browser errors: ${failures.join('; ')}`);
  return { passed: report, pageErrors: failures };
}
